import { pipeline, env, TextStreamer } from '@huggingface/transformers';

// Configuration for local WASM and Models
env.allowLocalModels = true;
// Set this to false if you want STRICT offline mode where it never checks Hugging Face Hub
env.allowRemoteModels = false;
env.localModelPath = '/models/';
env.useBrowserCache = true;
if (env.backends.onnx.wasm) {
  // Optimize WASM multi-threading ONLY if supported
  if (typeof navigator !== 'undefined' && navigator.hardwareConcurrency && typeof crossOriginIsolated !== 'undefined' && crossOriginIsolated) {
    env.backends.onnx.wasm.numThreads = Math.min(navigator.hardwareConcurrency || 4, 4);
  }
}

let generator: any = null;
let currentGenerationId = 0;
let downloadTotals: Record<string, number> = {};
let downloadLoaded: Record<string, number> = {};

self.onmessage = async (event: MessageEvent) => {
  const { type, payload } = event.data;

  if (type === 'init') {
    const { modelId, forceDevice } = payload;
    downloadTotals = {};
    downloadLoaded = {};

    try {
      const progressCb = (progress: any) => {
        if (progress.status === 'initiate') {
          downloadTotals[progress.file] = 0;
          downloadLoaded[progress.file] = 0;
        } else if (progress.status === 'progress') {
          if (progress.total) downloadTotals[progress.file] = progress.total;
          if (progress.loaded) downloadLoaded[progress.file] = progress.loaded;
        } else if (progress.status === 'done') {
          if (downloadTotals[progress.file]) {
            downloadLoaded[progress.file] = downloadTotals[progress.file];
          }
        }
        
        let totalBytes = 0;
        let loadedBytes = 0;
        let fileCount = 0;
        for (const file in downloadTotals) {
           totalBytes += downloadTotals[file] || 0;
           loadedBytes += downloadLoaded[file] || 0;
           fileCount++;
        }
        
        let overallProgress = 0;
        if (totalBytes > 0) {
           overallProgress = loadedBytes / totalBytes;
        }

        let text = 'Préparation...';
        if (progress.status === 'ready') {
          text = 'Modèle chargé !';
          overallProgress = 1;
        } else if (fileCount > 0 && totalBytes > 0) {
          text = `Téléchargement (${(loadedBytes / 1024 / 1024).toFixed(1)} MB / ${(totalBytes / 1024 / 1024).toFixed(1)} MB)`;
        } else if (fileCount > 0) {
          text = `Téléchargement en cours...`;
        }

        self.postMessage({ type: 'progress', payload: { text, progress: overallProgress } });
      };

      try {
        generator = await pipeline('text-generation', modelId, {
          device: forceDevice || 'webgpu',
          dtype: 'q4',
          progress_callback: progressCb
        });
      } catch (gpuError) {
        if (forceDevice === 'webgpu') throw gpuError;
        
        console.warn('[Transformers Worker] WebGPU initialization failed, falling back to WASM/CPU:', gpuError);
        generator = await pipeline('text-generation', modelId, {
          device: 'wasm',
          dtype: 'q4',
          progress_callback: progressCb
        });
      }

      self.postMessage({ type: 'init_done' });
    } catch (e: any) {
      console.error('[Transformers Worker] Init error:', e);
      let errorMsg = e.message || String(e);
      
      // If we got a JSON parse error, it's highly likely a 502/404 HTML error page was cached.
      // We must clear the browser's Cache API to allow recovery on the next attempt.
      if (e instanceof SyntaxError || errorMsg.includes('JSON') || errorMsg.includes('Unexpected token')) {
        try {
          const keys = await caches.keys();
          for (const key of keys) {
            if (key.includes('transformers')) {
              await caches.delete(key);
              console.warn(`[Transformers Worker] Cleared corrupted cache: ${key}`);
            }
          }
          errorMsg = "Cache corrompu (erreur 502/404) nettoyé. Veuillez relancer le téléchargement.";
        } catch (cacheErr) {
          console.error('[Transformers Worker] Failed to clear cache', cacheErr);
        }
      }
      
      self.postMessage({ type: 'init_error', payload: errorMsg });
    }
  }

  if (type === 'generate') {
    const { messages, generationId, temperature, topP, maxTokens } = payload;
    if (!generator) {
      self.postMessage({ type: 'generate_error', payload: 'Generator not initialized', generationId });
      return;
    }
    
    currentGenerationId = generationId;
    
    try {
      // Build streamer
      const streamer = new TextStreamer(generator.tokenizer, {
        skip_prompt: true,
        callback_function: (text: string) => {
          if (currentGenerationId === generationId) {
            self.postMessage({ type: 'generate_chunk', payload: text, generationId });
          }
        }
      });

      const tempVal = temperature !== undefined ? temperature : 0.7;
      const doSample = tempVal > 0;
      console.log('[Transformers Worker] Generating with messages:', messages);

      await generator(messages, {
        max_new_tokens: maxTokens || 512,
        temperature: tempVal,
        top_p: topP !== undefined ? topP : 0.9,
        do_sample: doSample,
        streamer
      });
      
      self.postMessage({ type: 'generate_done', generationId });
    } catch (e: any) {
      self.postMessage({ type: 'generate_error', payload: e.message, generationId });
    }
  }

  if (type === 'interrupt') {
     currentGenerationId = -1; // stop streamer logic
     self.postMessage({ type: 'interrupt_done' });
  }
}
