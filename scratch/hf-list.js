async function main() {
  try {
    const res = await fetch('https://huggingface.co/api/models/onnx-community/Qwen2.5-0.5B-Instruct');
    const json = await res.json();
    // print first 5 siblings with all their properties
    console.log('Siblings with details:', json.siblings.slice(0, 8));
  } catch (e) {
    console.error('Error:', e);
  }
}
main();
