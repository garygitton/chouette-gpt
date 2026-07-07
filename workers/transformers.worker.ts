import { pipeline, env, TextStreamer } from '@huggingface/transformers';

// Configuration for local WASM and Models
env.allowLocalModels = true;
env.allowRemoteModels = false;
env.localModelPath = '/models/';
env.useBrowserCache = false;
if (env.backends.onnx.wasm) {
  env.backends.onnx.wasm.wasmPaths = '/wasm/';
}

let generator: any = null;
let currentGenerationId = 0;

self.onmessage = async (event: MessageEvent) => {
  const { type, payload } = event.data;

  if (type === 'init') {
    const { modelId } = payload;
    try {
      generator = await pipeline('text-generation', modelId, {
        device: 'wasm',
        progress_callback: (progress: any) => {
          // Format it similar to web-llm for easy UI integration
          const text = progress.status === 'downloading' 
            ? `Downloading ${progress.file} (${Math.round(progress.progress || 0)}%)`
            : progress.status === 'ready' ? 'Model loaded!' : `Loading ${progress.status}`;
            
          self.postMessage({ type: 'progress', payload: { text, progress: (progress.progress || 0) / 100 } });
        }
      });
      self.postMessage({ type: 'init_done' });
    } catch (e: any) {
      console.error(e);
      self.postMessage({ type: 'init_error', payload: e.message });
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
