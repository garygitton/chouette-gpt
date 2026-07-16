import type { ModelTranslation } from '~/composables/useModelI18n'

export default {
    qwen_05b: {
      desc: "Ultra-lightweight 500M parameter model. Extremely fast and battery-friendly.",
      lang: "English, Chinese (good), other languages (basic).",
      warn: "Reduced size: prone to frequent hallucinations and logical errors."
    },
    llama_1b: {
      desc: "Balanced 1B parameter model by Meta. Good trade-off between speed and accuracy.",
      lang: "English, French, Spanish, Portuguese, German.",
      warn: "Limited reasoning capabilities on complex technical topics."
    },
    qwen_15b: {
      desc: "Versatile 1.5B parameter model. Excellent logical reasoning and writing skills.",
      lang: "English, Chinese (excellent), French, Spanish (very good).",
      warn: "Consumes more RAM (approx. 2 GB) and might run slower on CPU."
    },
    qwen_math: {
      desc: "1.5B parameter model specialized in solving mathematical equations and problems.",
      lang: "English, Chinese. Understands universal mathematical notation.",
      warn: "Not suitable for general conversation or creative writing."
    },
    qwen_coder: {
      desc: "1.5B parameter expert model in programming (code generation, refactoring, analysis).",
      lang: "Programming languages (Python, JS, C++, etc.). Prompts in English/Chinese.",
      warn: "Highly technical outputs focused on software development."
    },
    llama_3b: {
      desc: "Creative and smart 3B parameter model. Highly accurate language understanding.",
      lang: "Excellent multilingual support (English, French, Spanish, etc.).",
      warn: "Requires a powerful GPU or at least 8 GB RAM. Slower on CPU."
    },
    phi_35: {
      desc: "3.8B parameter model by Microsoft. State-of-the-art logical reasoning capabilities.",
      lang: "English (excellent), very good multilingual support.",
      warn: "Heavy model (2.2 GB download). May cause high CPU/GPU load."
    },
    medgemma: {
      desc: "4B parameter model specialized in medical diagnostics and clinical terminology.",
      lang: "Primarily English (international medical terminology).",
      warn: "Not a replacement for professional medical advice. Use for research only."
    }
  } as Record<string, ModelTranslation>
