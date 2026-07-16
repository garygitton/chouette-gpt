// @ts-ignore
import { pipeline, env, TextStreamer } from '@huggingface/transformers';

// Configuration for local WASM and Models
env.allowLocalModels = false;
// Allow remote models from Hugging Face Hub (cached by the browser)
env.allowRemoteModels = true;
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
    const { modelId, forceDevice, dtype } = payload;
    downloadTotals = {};
    downloadLoaded = {};

    try {
      let lastBytes = 0;
      let lastTime = performance.now();
      let isReadingCache = false;
      
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

        const now = performance.now();
        if (now - lastTime > 250) {
          const bytesDiff = loadedBytes - lastBytes;
          const timeDiffSec = (now - lastTime) / 1000;
          const bytesPerSec = bytesDiff / timeDiffSec;
          
          // Si la vitesse dépasse 250 MB/s, c'est obligatoirement une lecture depuis le cache (disque dur)
          isReadingCache = bytesPerSec > 250 * 1024 * 1024;
          
          lastBytes = loadedBytes;
          lastTime = now;
        }

        let text = 'Préparation...';
        if (progress.status === 'ready') {
          text = 'Modèle chargé !';
          overallProgress = 1;
        } else if (fileCount > 0 && totalBytes > 0) {
          if (isReadingCache) {
             text = `Vérification du cache... (${Math.round(overallProgress * 100)}%)`;
          } else {
             text = `Téléchargement (${(loadedBytes / 1024 / 1024).toFixed(1)} MB / ${(totalBytes / 1024 / 1024).toFixed(1)} MB)`;
          }
        } else if (fileCount > 0) {
          text = `Téléchargement en cours...`;
        }

        self.postMessage({ type: 'progress', payload: { text, progress: overallProgress } });
      };

      let activeDevice = 'webgpu';
      try {
        generator = await pipeline('text-generation', modelId, {
          device: forceDevice || 'webgpu',
          dtype: dtype || 'q4',
          progress_callback: progressCb
        });
      } catch (gpuError) {
        if (forceDevice === 'webgpu') throw gpuError;

        console.warn('[Transformers Worker] WebGPU initialization failed, falling back to WASM/CPU:', gpuError);
        downloadTotals = {};
        downloadLoaded = {};
        generator = await pipeline('text-generation', modelId, {
          device: 'wasm',
          dtype: dtype || 'q4',
          progress_callback: progressCb
        });
        activeDevice = 'wasm';
      }

      self.postMessage({ type: 'init_done', payload: { device: activeDevice } });
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
    const { messages, generationId, temperature, topP, maxTokens, topK, repetitionPenalty } = payload;
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
        top_k: topK !== undefined ? topK : 50,
        repetition_penalty: repetitionPenalty !== undefined ? repetitionPenalty : 1.0,
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
