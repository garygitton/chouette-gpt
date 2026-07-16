import { pipeline, env } from '@huggingface/transformers';
env.allowLocalModels = false;
env.allowRemoteModels = true;
async function run() {
  const model = await pipeline('text-generation', 'katuni4ka/tiny-random-LlamaForCausalLM-onnx', {
    dtype: 'fp32' // or q4
  });
  console.log("Loaded!");
  const out = await model("Hello");
  console.log(out);
}
run().catch(console.error);
