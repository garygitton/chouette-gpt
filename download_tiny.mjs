import { pipeline, env } from '@huggingface/transformers';
env.allowLocalModels = false;
env.allowRemoteModels = true;
async function run() {
  const model = await pipeline('text-generation', 'Xenova/tiny-random-LlamaForCausalLM', {
    dtype: 'fp32' // try fp32 first since it's a tiny model
  });
  console.log("Loaded!");
}
run().catch(console.error);
