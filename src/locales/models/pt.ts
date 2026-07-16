import type { ModelTranslation } from '~/composables/useModelI18n'

export default {
    qwen_05b: {
      desc: "Modelo ultra-leve de 500M parâmetros. Muito rápido e economizador de bateria.",
      lang: "Inglês, Chinês (bom), outros idiomas (básico).",
      warn: "Tamanho reduzido: propenso a alucinações frequentes e erros lógicos."
    },
    llama_1b: {
      desc: "Modelo equilibrado de 1B parâmetros da Meta. Bom compromisso velocidade/precisão.",
      lang: "Inglês, Francês, Espanhol, Português, Alemão.",
      warn: "Raciocínio limitado em tópicos técnicos complexos."
    },
    qwen_15b: {
      desc: "Modelo versátil de 1.5B parâmetros. Excelente raciocínio lógico e escrita.",
      lang: "Inglês, Chinês (excelente), Francês, Espanhol (muito bom).",
      warn: "Consome mais RAM (aprox. 2 GB) e pode ser mais lento no CPU."
    },
    qwen_math: {
      desc: "Modelo de 1.5B parâmetros especializado na resolução de problemas matemáticos.",
      lang: "Inglês, Chinês. Compreende a notação matemática universal.",
      warn: "Não adequado para conversas gerais ou escrita criativa."
    },
    qwen_coder: {
      desc: "Modelo de 1.5B parâmetros especialista em programação (geração, correção e análise).",
      lang: "Linguagens de programação (Python, JS, C++, etc.). Prompts em Inglês/Chinês.",
      warn: "Respostas altamente técnicas voltadas para o desenvolvimento."
    },
    llama_3b: {
      desc: "Modelo criativo e inteligente de 3B parâmetros. Grande precisão de linguagem.",
      lang: "Excelente suporte multilingue (Português, Inglês, Espanhol, etc.).",
      warn: "Exige uma GPU potente ou pelo menos 8 GB de RAM. Lento no CPU."
    },
    phi_35: {
      desc: "Modelo de 3.8B parâmetros da Microsoft. Raciocínio lógico de ponta.",
      lang: "Inglês (excelente), muito bom suporte multilingue.",
      warn: "Modelo pesado (2.2 GB para descarregar). Pode aquecer o processador."
    },
    medgemma: {
      desc: "Modelo de 4B parâmetros especializado nas áreas médica e clínica.",
      lang: "Principalmente Inglês (terminologia médica internacional).",
      warn: "Não substitui um médico de verdade. Use apenas para fins de pesquisa."
    }
  } as Record<string, ModelTranslation>
