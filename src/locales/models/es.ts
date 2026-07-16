import type { ModelTranslation } from '~/composables/useModelI18n'

export default {
    qwen_05b: {
      desc: "Modelo ultraligero de 500M parámetros. Muy rápido y de bajo consumo de batería.",
      lang: "Inglés, Chino (bueno), otros idiomas (básico).",
      warn: "Tamaño reducido: propenso a alucinaciones frecuentes y errores lógicos."
    },
    llama_1b: {
      desc: "Modelo equilibrado de 1B parámetros de Meta. Buen compromiso entre velocidad y precisión.",
      lang: "Inglés, Francés, Español, Portugués, Alemán.",
      warn: "Razonamiento limitado en temas técnicos complejos."
    },
    qwen_15b: {
      desc: "Modelo versátil de 1.5B parámetros. Excelente razonamiento lógico y redacción.",
      lang: "Inglés, Chino (excelente), Francés, Español (muy bueno).",
      warn: "Consume más RAM (aprox. 2 GB) y puede ser más lento en CPU."
    },
    qwen_math: {
      desc: "Modelo de 1.5B parámetros especializado en resolución de problemas matemáticos.",
      lang: "Inglés, Chino. Entiende la notación matemática universal.",
      warn: "No apto para conversación general o escritura creativa."
    },
    qwen_coder: {
      desc: "Modelo de 1.5B parámetros experto en programación (generación, corrección y análisis).",
      lang: "Lenguajes de programación (Python, JS, C++, etc.). Prompts en Inglés/Chino.",
      warn: "Respuestas muy técnicas orientadas al desarrollo de software."
    },
    llama_3b: {
      desc: "Modelo creativo e inteligente de 3B parámetros. Alta precisión en el lenguaje.",
      lang: "Excelente soporte multilingüe (Español, Inglés, Francés, etc.).",
      warn: "Requiere una GPU potente o al menos 8 GB de RAM. Lento en CPU."
    },
    phi_35: {
      desc: "Modelo de 3.8B parámetros de Microsoft. Capacidad de razonamiento lógico de vanguardia.",
      lang: "Inglés (excelente), muy buen soporte multilingüe.",
      warn: "Modelo pesado (2.2 GB para descargar). Puede calentar el procesador."
    },
    medgemma: {
      desc: "Modelo de 4B parámetros especializado en el ámbito médico y clínico.",
      lang: "Principalmente inglés (terminología médica internacional).",
      warn: "No sustituye a un médico. Utilizar únicamente con fines de investigación."
    }
  } as Record<string, ModelTranslation>
