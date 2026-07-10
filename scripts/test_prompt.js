import { AutoTokenizer } from '@huggingface/transformers';

async function test() {
    const tokenizer = await AutoTokenizer.from_pretrained('HuggingFaceTB/SmolLM-135M-Instruct');
    const messages = [
        { role: 'system', content: 'Tu es un pirate' },
        { role: 'user', content: 'Bonjour' }
    ];
    const text = tokenizer.apply_chat_template(messages, { tokenize: false });
    console.log("SmolLM Output:");
    console.log(text);

    const tokenizer2 = await AutoTokenizer.from_pretrained('Qwen/Qwen1.5-0.5B-Chat');
    const messages2 = [
        { role: 'system', content: 'Tu es un pirate' },
        { role: 'user', content: 'Bonjour' }
    ];
    const text2 = tokenizer2.apply_chat_template(messages2, { tokenize: false });
    console.log("\nQwen Output:");
    console.log(text2);
}

test();
