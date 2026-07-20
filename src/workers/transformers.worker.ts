// @ts-ignore
import { pipeline, env, TextStreamer } from '@huggingface/transformers';
import * as Comlink from 'comlink';

// Configuration for local WASM and Models
env.allowLocalModels = false;
env.allowRemoteModels = true;
env.useBrowserCache = true;
if (env.backends.onnx.wasm) {
  if (typeof navigator !== 'undefined' && navigator.hardwareConcurrency && typeof crossOriginIsolated !== 'undefined' && crossOriginIsolated) {
    env.backends.onnx.wasm.numThreads = Math.min(navigator.hardwareConcurrency || 4, 4);
  }
}

class TransformersAPI {
  private generator: any = null;
  private currentGenerationId: number = 0;
  private downloadTotals: Record<string, number> = {};
  private downloadLoaded: Record<string, number> = {};

  async init(
    modelId: string,
    dtype: string | undefined,
    forceDevice: string | undefined,
    onProgress: (payload: { text: string; progress: number }) => void
  ): Promise<{ device: string }> {
    try {
      this.downloadTotals = {};
      this.downloadLoaded = {};

      let lastBytes = 0;
      let lastTime = performance.now();
      let isReadingCache = false;

      const progressCb = (progress: any) => {
        if (progress.status === 'initiate') {
          this.downloadTotals[progress.file] = 0;
          this.downloadLoaded[progress.file] = 0;
        } else if (progress.status === 'progress') {
          if (progress.total) this.downloadTotals[progress.file] = progress.total;
          if (progress.loaded) this.downloadLoaded[progress.file] = progress.loaded;
        } else if (progress.status === 'done') {
          if (this.downloadTotals[progress.file]) {
            this.downloadLoaded[progress.file] = this.downloadTotals[progress.file];
          }
        }

        let totalBytes = 0;
        let loadedBytes = 0;
        let fileCount = 0;
        for (const file in this.downloadTotals) {
          totalBytes += this.downloadTotals[file] || 0;
          loadedBytes += this.downloadLoaded[file] || 0;
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

        onProgress({ text, progress: overallProgress });
      };

      let targetDevice = forceDevice;
      if (!targetDevice) {
        let hasWorkerWebGPU = false;
        if (typeof navigator !== 'undefined' && 'gpu' in navigator) {
          try {
            const adapter = await (navigator as any).gpu.requestAdapter();
            if (adapter && adapter.features && adapter.features.has('shader-f16')) {
              const device = await adapter.requestDevice({
                requiredFeatures: ['shader-f16']
              });
              if (device) {
                hasWorkerWebGPU = true;
                device.destroy();
              }
            }
          } catch (e) {
            hasWorkerWebGPU = false;
          }
        }
        targetDevice = hasWorkerWebGPU ? 'webgpu' : 'wasm';
      }

      let activeDevice = targetDevice;
      try {
        this.generator = await pipeline('text-generation', modelId, {
          device: targetDevice as any,
          dtype: (dtype || 'q4') as any,
          progress_callback: progressCb
        });
      } catch (gpuError: any) {
        if (targetDevice === 'webgpu') {
          console.warn('[Transformers Worker] WebGPU initialization failed in worker, falling back to WASM/CPU:', gpuError);
          this.downloadTotals = {};
          this.downloadLoaded = {};
          this.generator = await pipeline('text-generation', modelId, {
            device: 'wasm' as any,
            dtype: (dtype || 'q4') as any,
            progress_callback: progressCb
          });
          activeDevice = 'wasm';
        } else {
          throw gpuError;
        }
      }

      return { device: activeDevice };
    } catch (e: any) {
      console.error('[Transformers Worker] Init error:', e);
      let errorMsg = e.message || String(e);

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
      throw new Error(errorMsg, { cause: e });
    }
  }

  async generate(
    messages: any[],
    generationId: number,
    params: { temperature?: number, topP?: number, maxTokens?: number, topK?: number, repetitionPenalty?: number },
    onChunk: (text: string) => void
  ): Promise<void> {
    if (!this.generator) {
      throw new Error('Generator not initialized');
    }

    this.currentGenerationId = generationId;

    const streamer = new TextStreamer(this.generator.tokenizer, {
      skip_prompt: true,
      callback_function: (text: string) => {
        if (this.currentGenerationId === generationId) {
          onChunk(text);
        }
      }
    });

    const tempVal = params.temperature !== undefined ? params.temperature : 0.7;
    const doSample = tempVal > 0;
    console.log('[Transformers Worker] Generating with messages:', messages);

    await this.generator(messages, {
      max_new_tokens: params.maxTokens || 512,
      temperature: tempVal,
      top_p: params.topP !== undefined ? params.topP : 0.9,
      top_k: params.topK !== undefined ? params.topK : 50,
      repetition_penalty: params.repetitionPenalty !== undefined ? params.repetitionPenalty : 1.0,
      do_sample: doSample,
      streamer
    });
  }

  async interrupt(): Promise<void> {
    this.currentGenerationId = -1;
  }
}

Comlink.expose(new TransformersAPI());

export type TransformersWorkerAPI = InstanceType<typeof TransformersAPI>;
