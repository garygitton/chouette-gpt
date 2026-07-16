import { computed } from 'vue'
import { useSettings } from '~/contexts/settingsContext'

export interface ModelTranslation {
  desc: string
  lang: string
  warn: string
}

export const modelTranslations: Record<string, Record<string, ModelTranslation>> = {
  fr: {
    qwen_05b: {
      desc: "Modèle ultra-léger de 500M paramètres. Très rapide et économe en batterie.",
      lang: "Anglais, Chinois (bon), autres langues (basique).",
      warn: "Taille réduite : sujet à de fréquentes hallucinations et erreurs de logique."
    },
    llama_1b: {
      desc: "Modèle équilibré de 1B paramètres par Meta. Bon compromis vitesse/précision.",
      lang: "Anglais, Français, Espagnol, Portugais, Allemand.",
      warn: "Raisonnement limité sur des sujets techniques complexes."
    },
    qwen_15b: {
      desc: "Modèle polyvalent de 1.5B paramètres. Excellent raisonnement logique et rédaction.",
      lang: "Anglais, Chinois (excellent), Français, Espagnol (très bon).",
      warn: "Consomme plus de RAM (environ 2 Go) et peut être plus lent sur CPU."
    },
    qwen_math: {
      desc: "Modèle de 1.5B paramètres spécialisé dans la résolution de problèmes mathématiques.",
      lang: "Anglais, Chinois. Comprend la notation mathématique universelle.",
      warn: "Non adapté pour la discussion générale ou la rédaction créative."
    },
    qwen_coder: {
      desc: "Modèle de 1.5B paramètres expert en programmation (génération, correction, explication).",
      lang: "Langages de programmation (Python, JS, C++, etc.). Prompts en Anglais/Chinois.",
      warn: "Réponses très techniques orientées développeur."
    },
    llama_3b: {
      desc: "Modèle créatif et intelligent de 3B paramètres. Grande précision de langage.",
      lang: "Excellent support multilingue (Français, Anglais, Espagnol, etc.).",
      warn: "Requiert un GPU puissant ou au moins 8 Go de RAM. Lent sur CPU."
    },
    phi_35: {
      desc: "Modèle de 3.8B paramètres par Microsoft. Capacités de raisonnement logique de pointe.",
      lang: "Anglais (excellent), très bon support multilingue.",
      warn: "Modèle lourd (2.2 Go à télécharger). Échauffement possible du processeur."
    },
    medgemma: {
      desc: "Modèle de 4B paramètres spécialisé dans le domaine médical et clinique.",
      lang: "Principalement Anglais (terminologie médicale internationale).",
      warn: "Ne remplace pas un médecin. À utiliser uniquement à des fins de recherche."
    }
  },
  en: {
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
  },
  es: {
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
  },
  zh: {
    qwen_05b: {
      desc: "5亿参数超轻量级模型。速度极快且省电。",
      lang: "英文、中文（优秀），其他语言（基础）。",
      warn: "尺寸较小：容易出现频繁幻觉和逻辑错误。"
    },
    llama_1b: {
      desc: "Meta推出的10亿参数平衡模型。在速度与准确性之间取得了良好平衡。",
      lang: "英文、法文、西班牙文、葡萄牙文、德文。",
      warn: "在复杂技术主题上的推理能力有限。"
    },
    qwen_15b: {
      desc: "15亿参数多功能模型。具有出色的逻辑推理 and 写作能力。",
      lang: "中文（卓越）、英文、法文、西班牙文（优秀）。",
      warn: "消耗更多内存（约 2 GB），在 CPU 上运行可能会变慢。"
    },
    qwen_math: {
      desc: "专用于解决数学方程和数学问题的15亿参数模型。",
      lang: "英文、中文。理解通用数学符号。",
      warn: "不适合日常对话或创意写作。"
    },
    qwen_coder: {
      desc: "编程领域的15亿参数专家模型（代码生成、重构和分析）。",
      lang: "编程语言（Python、JS、C++ 等）。提示词支持英文/中文。",
      warn: "偏向软件开发的专业技术回答。"
    },
    llama_3b: {
      desc: "具有创意和智慧的30亿参数模型。高度准确的语言理解能力。",
      lang: "出色的多语言支持（中文、英文、法文、西班牙文等）。",
      warn: "需要强劲的 GPU 或至少 8 GB 内存。在 CPU 上运行较慢。"
    },
    phi_35: {
      desc: "微软推出的38亿参数模型。拥有前沿的逻辑推理能力。",
      lang: "英文（卓越），非常好的多语言支持。",
      warn: "模型较大（需下载 2.2 GB）。可能会使处理器温度升高。"
    },
    medgemma: {
      desc: "专用于医学诊断和临床术语的40亿参数模型。",
      lang: "主要为英文（国际医学术语）。",
      warn: "本模型不能代替专业医生的诊断。仅限研究目的使用。"
    }
  },
  hi: {
    qwen_05b: {
      desc: "अल्ट्रा-लाइटवेट 500M पैरामीटर मॉडल। बेहद तेज़ और बैटरी के अनुकूल।",
      lang: "अंग्रेजी, चीनी (अच्छी), अन्य भाषाएं (बुनियादी)।",
      warn: "छोटा आकार: बार-बार भ्रम (hallucinations) और तार्किक त्रुटियों की संभावना।"
    },
    llama_1b: {
      desc: "Meta द्वारा संतुलित 1B पैरामीटर मॉडल। गति और सटीकता का अच्छा समझौता।",
      lang: "अंग्रेजी, फ्रेंच, स्पेनिश, पुर्तगाली, जर्मन।",
      warn: "जटिल तकनीकी विषयों पर सीमित तार्किक क्षमता।"
    },
    qwen_15b: {
      desc: "बहुमुखी 1.5B पैरामीटर मॉडल। उत्कृष्ट तार्किक सोच और लेखन क्षमता।",
      lang: "अंग्रेजी, चीनी (उत्कृष्ट), फ्रेंच, स्पेनिश (बहुत अच्छी)।",
      warn: "अधिक रैम (लगभग 2 जीबी) की खपत करता है और सीपीयू पर धीमा हो सकता है।"
    },
    qwen_math: {
      desc: "गणितीय समीकरणों और समस्याओं को हल करने में विशेषज्ञता वाला 1.5B मॉडल।",
      lang: "अंग्रेजी, चीनी। सार्वभौमिक गणितीय संकेतन को समझता है।",
      warn: "सामान्य बातचीत या रचनात्मक लेखन के लिए उपयुक्त नहीं है।"
    },
    qwen_coder: {
      desc: "प्रोग्रामिंग (कोड जनरेशन, रिफैक्टरिंग, विश्लेषण) में विशेषज्ञ 1.5B मॉडल।",
      lang: "प्रोग्रामिंग भाषाएं (Python, JS, C++, आदि)। अंग्रेजी/चीनी संकेत।",
      warn: "सॉफ्टवेयर विकास पर केंद्रित अत्यधिक तकनीकी परिणाम।"
    },
    llama_3b: {
      desc: "रचनात्मक और बुद्धिमान 3B पैरामीटर मॉडल। अत्यंत सटीक भाषा समझ।",
      lang: "उत्कृष्ट बहुभाषी समर्थन (हिंदी, अंग्रेजी, फ्रेंच, स्पेनिश आदि)।",
      warn: "एक शक्तिशाली GPU या कम से कम 8 जीबी रैम की आवश्यकता है। सीपीयू पर धीमा।"
    },
    phi_35: {
      desc: "Microsoft द्वारा 3.8B पैरामीटर मॉडल। अत्याधुनिक तार्किक क्षमताएं।",
      lang: "अंग्रेजी (उत्कृष्ट), बहुत अच्छा बहुभाषी समर्थन।",
      warn: "भारी मॉडल (2.2 जीबी डाउनलोड)। प्रोसेसर पर उच्च लोड उत्पन्न कर सकता है।"
    },
    medgemma: {
      desc: "चिकित्सा निदान और नैदानिक शब्दावली में विशेषज्ञता वाला 4B पैरामीटर मॉडल।",
      lang: "मुख्य रूप से अंग्रेजी (अंतरराष्ट्रीय चिकित्सा शब्दावली)।",
      warn: "पेशेवर चिकित्सा सलाह का विकल्प नहीं है। केवल अनुसंधान के लिए उपयोग करें।"
    }
  },
  ar: {
    qwen_05b: {
      desc: "نموذج خفيف للغاية بحجم 500 مليون معلمة. سريع جداً وموفر للبطارية.",
      lang: "الإنجليزية، الصينية (جيد)، اللغات الأخرى (أساسي).",
      warn: "حجم صغير: عرضة للهلوسة المتكررة والأخطاء المنطقية."
    },
    llama_1b: {
      desc: "نموذج متوازن بحجم 1 مليار معلمة من Meta. حل وسط جيد بين السرعة والدقة.",
      lang: "الإنجليزية، الفرنسية، الإسبانية، البرتغالية، الألمانية.",
      warn: "قدرة منطقية محدودة في المواضيع التقنية المعقدة."
    },
    qwen_15b: {
      desc: "نموذج متعدد الاستخدامات بحجم 1.5 مليار معلمة. تفكير منطقي وكتابة ممتازة.",
      lang: "الإنجليزية، الصينية (ممتاز)، الفرنسية، الإسبانية (جيد جداً).",
      warn: "يستهلك ذاكرة أكبر (حوالي 2 جيجابايت) وقد يكون أبطأ على المعالج (CPU)."
    },
    qwen_math: {
      desc: "نموذج بحجم 1.5 مليار معلمة متخصص في حل المسائل والمعادلات الرياضية.",
      lang: "الإنجليزية، الصينية. يفهم الرموز الرياضية العالمية.",
      warn: "غير مناسب للمحادثات العامة أو الكتابة الإبداعية."
    },
    qwen_coder: {
      desc: "نموذج خبير بحجم 1.5 مليار معلمة في البرمجة (توليد، تصحيح وتحليل الأكواد).",
      lang: "لغات البرمجة (Python, JS, C++، إلخ). الأوامر بالإنجليزية/الصينية.",
      warn: "إجابات تقنية للغاية موجهة لمطوري البرمجيات."
    },
    llama_3b: {
      desc: "نموذج إبداعي وذكي بحجم 3 مليار معلمة. فهم دقيق جداً للغة.",
      lang: "دعم ممتاز للغات متعددة (العربية، الإنجليزية، الفرنسية، إلخ).",
      warn: "يتطلب كرت شاشة قوي أو 8 جيجابايت رام على الأقل. بطيء على المعالج."
    },
    phi_35: {
      desc: "نموذج بحجم 3.8 مليار معلمة من Microsoft. قدرات تفكير منطقي متطورة للغاية.",
      lang: "الإنجليزية (ممتاز)، دعم جيد جداً للغات متعددة.",
      warn: "نموذج ثقيل (2.2 جيجابايت للتحميل). قد يسبب جهداً كبيراً على المعالج."
    },
    medgemma: {
      desc: "نموذج بحجم 4 مليار معلمة متخصص في المجال الطبي والسريري.",
      lang: "الإنجليزية بشكل أساسي (المصطلحات الطبية الدولية).",
      warn: "لا يغني عن استشارة الطبيب الحقيقي. يستخدم لأغراض البحث فقط."
    }
  },
  pt: {
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
  },
  ru: {
    qwen_05b: {
      desc: "Ультралегкая модель на 500 млн параметров. Быстрая и экономная для батареи.",
      lang: "Английский, Китайский (хорошо), другие языки (базовый).",
      warn: "Малый размер: склонна к частым галлюцинациям и логическим ошибкам."
    },
    llama_1b: {
      desc: "Сбалансированная модель на 1 млрд параметров от Meta. Компромисс скорости и точности.",
      lang: "Английский, Французский, Испанский, Португальский, Немецкий.",
      warn: "Ограниченное логическое рассуждение в сложных технических вопросах."
    },
    qwen_15b: {
      desc: "Универсальная модель на 1.5 млрд параметров. Отличная логика и навыки письма.",
      lang: "Английский, Китайский (отлично), Французский, Испанский (очень хорошо).",
      warn: "Требует больше ОЗУ (около 2 ГБ) и может работать медленнее на CPU."
    },
    qwen_math: {
      desc: "Модель на 1.5 млрд параметров, специализированная на решении математических задач.",
      lang: "Английский, Китайский. Понимает международную математическую нотацию.",
      warn: "Не подходит для обычного общения или творческого письма."
    },
    qwen_coder: {
      desc: "Модель на 1.5 млрд параметров для программирования (генерация, исправление, анализ кода).",
      lang: "Языки программирования (Python, JS, C++ и др.). Промпты на Английском/Китайском.",
      warn: "Технические ответы, ориентированные исключительно на разработчиков."
    },
    llama_3b: {
      desc: "Креативная и интеллектуальная модель на 3 млрд параметров. Точное понимание языка.",
      lang: "Отличная многоязыковая поддержка (Русский, Английский, Испанский и др.).",
      warn: "Требует мощную видеокарту или не менее 8 ГБ ОЗУ. Медленная на CPU."
    },
    phi_35: {
      desc: "Модель на 3.8 млрд параметров от Microsoft. Передовые логические возможности.",
      lang: "Английский (отлично), хорошая поддержка других языков.",
      warn: "Тяжелая модель (2.2 ГБ для скачивания). Возможен сильный нагрев процессора."
    },
    medgemma: {
      desc: "Модель на 4 млрд параметров, специализированная на медицине и клинических данных.",
      lang: "В основном английский язык (международная медицинская терминология).",
      warn: "Не заменяет врача. Предназначена исключительно для исследовательских целей."
    }
  },
  bn: {
    qwen_05b: {
      desc: "৫০০ মিলিয়ন প্যারামিটারের অতি-হালকা модель। খুব দ্রুত এবং ব্যাটারি সাশ্রয়ী।",
      lang: "ইংরেজি, চীনা (ভালো), অন্যান্য ভাষা (সাধারণ)।",
      warn: "ছোট আকারের কারণে ভুল তথ্য (hallucination) ও লজিক সংক্রান্ত ত্রুটি হতে পারে।"
    },
    llama_1b: {
      desc: "Meta দ্বারা তৈরি ১ বিলিয়ন প্যারামিটারের ভারসাম্যপূর্ণ মডেল। গতি ও নির্ভুলতার ভালো সমন্বয়।",
      lang: "ইংরেজি, ফ্রেঞ্চ, স্প্যানিশ, পর্তুগিজ, জার্মান।",
      warn: "জटिल প্রযুক্তিগত বিষয়ে সীমিত যুক্তি ক্ষমতা।"
    },
    qwen_15b: {
      desc: "১.৫ বিলিয়ন প্যারামিটারের বহুমুখী মডেল। চমৎকার যুক্তি এবং ভালো লেখার ক্ষমতা।",
      lang: "ইংরেজি, চীনা (চমৎকার), ফ্রেঞ্চ, স্প্যানিশ (খুব ভালো)।",
      warn: "বেশি র‍্যাম প্রয়োজন (প্রায় ২ জিবি) এবং সিপিইউতে ধীর হতে পারে।"
    },
    qwen_math: {
      desc: "গাণিতিক সমীকরণ ও সমস্যা সমাধানের জন্য বিশেষায়িত ১.৫ বিলিয়ন প্যারামিটারের মডেল।",
      lang: "ইংরেজি, চীনা। বিশ্বজনীন গাণিতিক সংকেত বুঝতে পারে।",
      warn: "সাধারণ আলোচনা বা সৃজনশীল লেখার জন্য উপযুক্ত নয়।"
    },
    qwen_coder: {
      desc: "প্রোগ্রামিং (কোড তৈরি, সংশোধন ও বিশ্লেষণ) এর জন্য ১.৫ বিলিয়ন প্যারামিটারের বিশেষজ্ঞ মডেল।",
      lang: "প্রোগ্রামিং ভাষা (Python, JS, C++, ইত্যাদি)। ইংরেজি/চীনা প্রম্পট।",
      warn: "সফটওয়্যার ডেভেলপমেন্টের দিকে লক্ষ্য রেখে তৈরি অত্যন্ত প্রযুক্তিগত উত্তর।"
    },
    llama_3b: {
      desc: "৩ বিলিয়ন প্যারামিটারের সৃজনশীল ও বুদ্ধিমান মডেল। অত্যন্ত নির্ভুল ভাষা বোঝার ক্ষমতা।",
      lang: "চমৎকার বহুভাষিক সমর্থন (বাংলা, ইংরেজি, ফ্রেঞ্চ, স্প্যানিশ ইত্যাদি)।",
      warn: "একটি শক্তিশালী GPU বা কমপক্ষে ৮ জিবি র‍্যাম প্রয়োজন। সিপিইউতে ধীর।"
    },
    phi_35: {
      desc: "Microsoft-এর ৩.৮ বিলিয়ন প্যারামিটারের মডেল। সর্বাধুনিক যুক্তি ক্ষমতার সুবিধা প্রদান করে।",
      lang: "ইংরেজি (চমৎকার), অন্যান্য ভাষার খুব ভালো সমর্থন রয়েছে।",
      warn: "ভারী মডেল (২.২ জিবি ডাউনলোড)। প্রসেসরের ওপর অতিরিক্ত চাপ সৃষ্টি হতে পারে।"
    },
    medgemma: {
      desc: "চিকিৎসা সংক্রান্ত ডায়াগনস্টিকস এবং ক্লিনিকাল টার্মিনোলজির জন্য ৪ বিলিয়ন প্যারামিটারের বিশেষ মডেল।",
      lang: "মূলত ইংরেজি (আন্তর্জাতিক চিকিৎসা परिभाषा)।",
      warn: "এটি ডাক্তারের কোনো বিকল্প নয়। শুধুমাত্র গবেষণার উদ্দেশ্যে ব্যবহার করা উচিত।"
    }
  },
  ur: {
    qwen_05b: {
      desc: "انتہائی ہلکا پھلکا 500M پیرامیٹر ماڈل۔ بہت تیز رفتار اور بیٹری فرینڈلی۔",
      lang: "انگریزی, چینی (اچھا)، دیگر زبانیں (بنیادی)۔",
      warn: "چھوٹا سائز: بار بار غلط معلومات (hallucinations) اور منطقی غلطیوں کا امکان۔"
    },
    llama_1b: {
      desc: "Meta کی طرف سے متوازن 1B پیرامیٹر ماڈل۔ رفتار اور درستگی کا بہترین امتزاج۔",
      lang: "انگریزی، فرانسیسی، ہسپانوی، پرتگالی، جرمن۔",
      warn: "پیچیدہ تکنیکی موضوعات پر محدود غور و فکر کی صلاحیت۔"
    },
    qwen_15b: {
      desc: "کثیر المقاصد 1.5B پیرامیٹر ماڈل۔ بہترین منطق اور تحریری صلاحیتیں۔",
      lang: "انگریزی، چینی (بہترین)، فرانسیسی، ہسپانوی (بہت اچھا)۔",
      warn: "زیادہ ریم (تقریباً 2 جی بی) استعمال کرتا ہے اور سی پی یو پر سست ہو سکتا ہے۔"
    },
    qwen_math: {
      desc: "ریاضی کی مساوات اور مسائل کو حل کرنے کے لیے مخصوص 1.5B ماڈل۔",
      lang: "انگریزی، چینی۔ عالمگیر ریاضیاتی علامات کو سمجھتا ہے۔",
      warn: "عام گفتگو یا تخلیقی تحریر کے لیے موزوں نہیں ہے۔"
    },
    qwen_coder: {
      desc: "پروگرامنگ (کوڈ بنانے، درست کرنے اور تجزیہ کرنے) کے لیے مخصوص 1.5B ماڈل۔",
      lang: "پروگرامنگ زبانیں (Python, JS, C++، وغیرہ)۔ انگریزی/چینی پرامپٹ۔",
      warn: "سافٹ ویئر ڈویلپمنٹ سے متعلق انتہائی تکنیکی جوابات۔"
    },
    llama_3b: {
      desc: "تخلیقی اور ذہین 3B پیرامیٹر ماڈل۔ انتہائی درست زبانی سمجھ۔",
      lang: "بہترین کثیر لسانی سپورٹ (اردو، انگریزی، فرانسیسی، ہسپانوی وغیرہ)۔",
      warn: "ایک طاقتور GPU یا کم از کم 8 جی بی ریم کی ضرورت ہے۔ سی پی یو پر سست۔"
    },
    phi_35: {
      desc: "Microsoft کی طرف سے 3.8B پیرامیٹر ماڈل۔ جدید ترین منطقی صلاحیتیں۔",
      lang: "انگریزی (بہترین)، دیگر زبانوں کی بہترین سپورٹ۔",
      warn: "بھاری ماڈل (2.2 جی بی ڈاؤن لوڈ)۔ پروسیسر پر زیادہ بوجھ پڑ سکتا ہے۔"
    },
    medgemma: {
      desc: "طبی تشخیص اور طبی اصطلاحات کے لیے مخصوص 4B پیرامیٹر ماڈل۔",
      lang: "بنیادی طور پر انگریزی (بین الاقوامی طبی اصطلاحات)۔",
      warn: "ڈاکٹر کا متبادل نہیں ہے۔ صرف تحقیقی مقاصد کے لیے استعمال کریں۔"
    }
  }
}

export const uiTranslations: Record<string, Record<string, string>> = {
  fr: {
    local_ai_model: "Modèle IA Local",
    compare_performance: "Comparer les performances",
    download_activate: "Télécharger et activer",
    initializing: "Initialisation...",
    pause: "Pause",
    ready_for_use: "Prêt à l'emploi",
    paused: "En pause",
    resume: "Reprendre",
    engine: "Moteur",
    ram_required: "RAM Requise",
    size: "Taille",
    model_comparator_title: "Comparateur de Modèles (Poids vs Intelligence)",
    who_i_am: "Qui je suis :",
    supported_languages: "Langues supportées :",
    warning: "Mise en garde :"
  },
  en: {
    local_ai_model: "Local AI Model",
    compare_performance: "Compare performance",
    download_activate: "Download & Activate",
    initializing: "Initializing...",
    pause: "Pause",
    ready_for_use: "Ready to use",
    paused: "Paused",
    resume: "Resume",
    engine: "Engine",
    ram_required: "RAM Required",
    size: "Size",
    model_comparator_title: "Model Comparator (Weight vs Intelligence)",
    who_i_am: "Who I am:",
    supported_languages: "Supported languages:",
    warning: "Warning:"
  },
  es: {
    local_ai_model: "Modelo IA Local",
    compare_performance: "Comparar rendimientos",
    download_activate: "Descargar y activar",
    initializing: "Inicializando...",
    pause: "Pausa",
    ready_for_use: "Listo para usar",
    paused: "En pausa",
    resume: "Reanudar",
    engine: "Motor",
    ram_required: "RAM requerida",
    size: "Tamaño",
    model_comparator_title: "Comparador de modelos (Peso vs Inteligencia)",
    who_i_am: "Quién soy:",
    supported_languages: "Idiomas soportados:",
    warning: "Advertencia:"
  },
  zh: {
    local_ai_model: "本地 AI 模型",
    compare_performance: "性能对比",
    download_activate: "下载并激活",
    initializing: "初始化中...",
    pause: "暂停",
    ready_for_use: "准备就绪",
    paused: "已暂停",
    resume: "继续",
    engine: "引擎",
    ram_required: "所需内存",
    size: "大小",
    model_comparator_title: "模型对比器（权重 vs 智能）",
    who_i_am: "自我介绍：",
    supported_languages: "支持语言：",
    warning: "注意事项："
  },
  hi: {
    local_ai_model: "स्थानीय एआई मॉडल",
    compare_performance: "प्रदर्शन की तुलना करें",
    download_activate: "डाउनलोड और सक्रिय करें",
    initializing: "प्रारंभ किया जा रहा है...",
    pause: "विराम",
    ready_for_use: "उपयोग के लिए तैयार",
    paused: "विराम में",
    resume: "पुनः प्रारंभ करें",
    engine: "इंजन",
    ram_required: "आवश्यक रैम",
    size: "आकार",
    model_comparator_title: "मॉडल तुलनित्र (वजन बनाम बुद्धिमत्ता)",
    who_i_am: "मैं कौन हूँ:",
    supported_languages: "समर्थित भाषाएँ:",
    warning: "चेतावनी:"
  },
  ar: {
    local_ai_model: "نموذج الذكاء الاصطناعي المحلي",
    compare_performance: "مقارنة الأداء",
    download_activate: "تنزيل وتفعيل",
    initializing: "تهيئة...",
    pause: "إيقاف مؤقت",
    ready_for_use: "جاهز للاستخدام",
    paused: "موقوف مؤقتاً",
    resume: "استئناف",
    engine: "المحرك",
    ram_required: "الرام المطلوبة",
    size: "الحجم",
    model_comparator_title: "مقارن النماذج (الوزن مقابل الذكاء)",
    who_i_am: "من أنا:",
    supported_languages: "اللغات المدعومة:",
    warning: "تحذير:"
  },
  pt: {
    local_ai_model: "Modelo IA Local",
    compare_performance: "Comparar desempenho",
    download_activate: "Descarregar e ativar",
    initializing: "Inicializando...",
    pause: "Pausa",
    ready_for_use: "Pronto a usar",
    paused: "Em pausa",
    resume: "Retomar",
    engine: "Motor",
    ram_required: "RAM necessária",
    size: "Tamanho",
    model_comparator_title: "Comparador de modelos (Peso vs Inteligência)",
    who_i_am: "Quem sou eu:",
    supported_languages: "Idiomas suportados:",
    warning: "Aviso:"
  },
  ru: {
    local_ai_model: "Локальная модель ИИ",
    compare_performance: "Сравнить производительность",
    download_activate: "Скачать и активировать",
    initializing: "Инициализация...",
    pause: "Пауза",
    ready_for_use: "Готов к работе",
    paused: "На паузе",
    resume: "Продолжить",
    engine: "Движок",
    ram_required: "Требуемая ОЗУ",
    size: "Размер",
    model_comparator_title: "Сравнение моделей (Вес и Интеллект)",
    who_i_am: "О модели:",
    supported_languages: "Поддерживаемые языки:",
    warning: "Предупреждение:"
  },
  bn: {
    local_ai_model: "স্থানীয় এআই মডেল",
    compare_performance: "কর্মক্ষমতা তুলনা করুন",
    download_activate: "ডাউনলোড ও সক্রিয় করুন",
    initializing: "শুরু হচ্ছে...",
    pause: "থামুন",
    ready_for_use: "ব্যবহারের জন্য প্রস্তুত",
    paused: "স্থগিত",
    resume: "আবার শুরু করুন",
    engine: "ইঞ্জিন",
    ram_required: "প্রয়োজনীয় র‍্যাম",
    size: "সাইজ",
    model_comparator_title: "মডেল তুলনাকারী (ওজন বনাম বুদ্ধিমत्ता)",
    who_i_am: "আমি কে:",
    supported_languages: "সমর্থিত ভাষা সমূহ:",
    warning: "সতর্কতা:"
  },
  ur: {
    local_ai_model: "مقامی اے آئی ماڈل",
    compare_performance: "کارکردگی کا موازنہ کریں",
    download_activate: "ڈاؤن لوڈ اور فعال کریں",
    initializing: "ابتدا ہو رہی ہے...",
    pause: "روکیں",
    ready_for_use: "استعمال کے لیے تیار",
    paused: "روکا ہوا",
    resume: "دوبارہ شروع کریں",
    engine: "انجن",
    ram_required: "مطلوبہ ریم",
    size: "سائز",
    model_comparator_title: "ماڈل موازنہ (وزن بمقابلہ ذہانت)",
    who_i_am: "میں کون ہوں:",
    supported_languages: "حمایت یافتہ زبانیں:",
    warning: "انتباہ:"
  }
}

export function getModelKey(modelId: string): string {
  if (!modelId) return 'qwen_05b'
  if (modelId.includes('Qwen2.5-0.5B')) return 'qwen_05b'
  if (modelId.includes('Llama-3.2-1B')) return 'llama_1b'
  if (modelId.includes('Qwen2.5-1.5B-Instruct')) return 'qwen_15b'
  if (modelId.includes('Math')) return 'qwen_math'
  if (modelId.includes('Coder')) return 'qwen_coder'
  if (modelId.includes('Llama-3.2-3B')) return 'llama_3b'
  if (modelId.includes('Phi')) return 'phi_35'
  if (modelId.includes('medgemma')) return 'medgemma'
  return 'qwen_05b'
}

export interface DomainTranslation {
  name: string
  desc: string
}

export const domainTranslations: Record<string, Record<string, DomainTranslation>> = {
  fr: {
    general: { name: "Général", desc: "Polyvalent & créatif" },
    maths: { name: "Mathématiques", desc: "Résolution de problèmes" },
    code: { name: "Développement", desc: "Écriture & analyse de code" },
    medicine: { name: "Médecine", desc: "Diagnostic & concepts médicaux" },
    legal: { name: "Droit", desc: "Analyse & rédaction juridique" },
    writing: { name: "Rédaction & Création", desc: "Rédaction littéraire et créative" },
    translation: { name: "Traduction", desc: "Traduction & apprentissage" },
    education: { name: "Soutien Scolaire", desc: "Pédagogie & explications simples" },
    marketing: { name: "Marketing & SEO", desc: "Accroches publicitaires & SEO" },
    finance: { name: "Finance & Calculs", desc: "Finance, bilans & formules de tableur" }
  },
  en: {
    general: { name: "General", desc: "Versatile & creative" },
    maths: { name: "Mathematics", desc: "Problem solving & logic" },
    code: { name: "Development", desc: "Code writing & analysis" },
    medicine: { name: "Medicine", desc: "Medical terms & diagnostics" },
    legal: { name: "Law", desc: "Legal analysis & drafting" },
    writing: { name: "Writing & Creation", desc: "Creative writing & copy" },
    translation: { name: "Translation", desc: "Translate & learn languages" },
    education: { name: "Tutoring & Education", desc: "Simple pedagogy & homework help" },
    marketing: { name: "Marketing & SEO", desc: "Ads copy & SEO" },
    finance: { name: "Finance & Accounting", desc: "Financial sheets & spreadsheets" }
  },
  es: {
    general: { name: "General", desc: "Versátil y creativo" },
    maths: { name: "Matemáticas", desc: "Resolución de problemas y lógica" },
    code: { name: "Desarrollo", desc: "Escritura y análisis de código" },
    medicine: { name: "Medicina", desc: "Términos médicos y diagnóstico" },
    legal: { name: "Derecho", desc: "Análisis y redacción jurídica" },
    writing: { name: "Redacción & Creación", desc: "Escritura creativa y redacción" },
    translation: { name: "Traducción", desc: "Traducir y aprender idiomas" },
    education: { name: "Educación & Tutoría", desc: "Pedagogía simple y ayuda con tareas" },
    marketing: { name: "Marketing & SEO", desc: "Redacción publicitaria y SEO" },
    finance: { name: "Finanzas & Contabilidad", desc: "Balances financieros y hojas de cálculo" }
  },
  zh: {
    general: { name: "通用", desc: "多功能与创造性" },
    maths: { name: "数学", desc: "问题解决与逻辑推理" },
    code: { name: "代码开发", desc: "代码编写与分析" },
    medicine: { name: "医学", desc: "医学术语与诊断" },
    legal: { name: "法律", desc: "法律分析与起草" },
    writing: { name: "写作与创作", desc: "创意写作与文案" },
    translation: { name: "翻译", desc: "翻译与语言学习" },
    education: { name: "教育辅导", desc: "简单教学与作业帮手" },
    marketing: { name: "营销与 SEO", desc: "广告文案与 SEO" },
    finance: { name: "财务与会计", desc: "财务报表与电子表格" }
  },
  hi: {
    general: { name: "सामान्य", desc: "बहुमुखी और रचनात्मक" },
    maths: { name: "गणित", desc: "समस्या समाधान और तर्क" },
    code: { name: "विकास", desc: "कोड लेखन और विश्लेषण" },
    medicine: { name: "चिकित्सा", desc: "चिकित्सा शब्द और निदान" },
    legal: { name: "कानून", desc: "कानूनी विश्लेषण और प्रारूपण" },
    writing: { name: "लेखन और निर्माण", desc: "रचनात्मक लेखन और प्रतिलिपि" },
    translation: { name: "अनुवाद", desc: "अनुवाद और भाषाएँ सीखें" },
    education: { name: "ट्यूशन और शिक्षा", desc: "सरल शिक्षाशास्त्र और गृहकार्य सहायता" },
    marketing: { name: "मार्केटिंग और एसईओ", desc: "विज्ञापन प्रतिलिपि और एसईओ" },
    finance: { name: "वित्त और लेखा", desc: "वित्तीय पत्रक और स्प्रेडशीट" }
  },
  ar: {
    general: { name: "عام", desc: "متعدد الاستخدامات ومبدع" },
    maths: { name: "الرياضيات", desc: "حل المشكلات والمنطق" },
    code: { name: "التطوير", desc: "كتابة وتحليل الأكواد" },
    medicine: { name: "الطب", desc: "المصطلحات الطبية والتشخيص" },
    legal: { name: "القانون", desc: "التحليل القانوني والصياغة" },
    writing: { name: "الكتابة والإبداع", desc: "الكتابة الإبداعية والنصوص" },
    translation: { name: "الترجمة", desc: "ترجمة وتعلم اللغات" },
    education: { name: "التعليم والتدريس", desc: "شرح بسيط ومساعدة في الواجبات" },
    marketing: { name: "التسويق والسيو", desc: "كتابة الإعلانات وتحسين محركات البحث" },
    finance: { name: "المالية والمحاسبة", desc: "القوائم المالية وجداول البيانات" }
  },
  pt: {
    general: { name: "Geral", desc: "Versátil e criativo" },
    maths: { name: "Matemática", desc: "Resolução de problemas e lógica" },
    code: { name: "Desenvolvimento", desc: "Escrita e análise de código" },
    medicine: { name: "Medicina", desc: "Termos médicos e diagnósticos" },
    legal: { name: "Direito", desc: "Análise e redação jurídica" },
    writing: { name: "Redação & Criação", desc: "Escrita criativa e redação" },
    translation: { name: "Tradução", desc: "Traduzir e aprender idiomas" },
    education: { name: "Tutoria & Educação", desc: "Pedagogia simples e ajuda nos trabalhos" },
    marketing: { name: "Marketing & SEO", desc: "Textos publicitários e SEO" },
    finance: { name: "Finanças & Contabilidade", desc: "Planilhas financeiras e relatórios" }
  },
  ru: {
    general: { name: "Общий", desc: "Универсальный и творческий" },
    maths: { name: "Математика", desc: "Решение задач и логика" },
    code: { name: "Разработка", desc: "Написание и анализ кода" },
    medicine: { name: "Медицина", desc: "Медицинские термины и диагностика" },
    legal: { name: "Юриспруденция", desc: "Юридический анализ и составление документов" },
    writing: { name: "Письмо и копирайтинг", desc: "Творческое письмо и тексты" },
    translation: { name: "Перевод", desc: "Перевод и изучение языков" },
    education: { name: "Обучение и репетиторство", desc: "Простое объяснение и помощь с домашним заданием" },
    marketing: { name: "Маркетинг и SEO", desc: "Рекламные тексты и SEO" },
    finance: { name: "Финансы и учет", desc: "Финансовые отчеты и таблицы" }
  },
  bn: {
    general: { name: "সাধারণ", desc: "বহুমুখী এবং সৃজনশীল" },
    maths: { name: "গণিত", desc: "সমস্যা समाधान এবং যুক্তি" },
    code: { name: "ডেভেলপমেন্ট", desc: "কোড লেখা এবং বিশ্লেষণ" },
    medicine: { name: "চিকিৎসা", desc: "চিকিৎসা শব্দ এবং রোগ নির্ণয়" },
    legal: { name: "আইন", desc: "আইনি বিশ্লেষণ এবং খসড়া তৈরি" },
    writing: { name: "লেখালেখি ও সৃষ্টি", desc: "সৃজনশীল লেখা এবং কপিরাইটিং" },
    translation: { name: "অনুবাদ", desc: "অনুবাদ এবং ভাষা শিক্ষা" },
    education: { name: "শিক্ষা ও গৃহশিক্ষকতা", desc: "সহজ পাঠদান ও হোমওয়ার্ক সহায়তা" },
    marketing: { name: "মার্কেটিং ও এসইও", desc: "বিজ্ঞাপন কপি এবং এসইও" },
    finance: { name: "অর্থায়ন ও হিসাবরক্ষণ", desc: "আর্থিক শীট এবং স্প্রেডশীট" }
  },
  ur: {
    general: { name: "عام", desc: "ہمہ جہت اور تخلیقی" },
    maths: { name: "ریاضی", desc: "مسائل کا حل اور منطق" },
    code: { name: "ترقی اور کوڈنگ", desc: "کوڈ لکھنا اور تجزیہ کرنا" },
    medicine: { name: "طب", desc: "طبی اصطلاحات اور تشخیص" },
    legal: { name: "قانون", desc: "قانونی تجزیہ اور مسودہ سازی" },
    writing: { name: "تحریر و تخلیق", desc: "تخلیقی تحریر اور کاپی رائٹنگ" },
    translation: { name: "ترجمہ", desc: "ترجمہ اور زبانیں سیکھنا" },
    education: { name: "ٹیوشن اور تعلیم", desc: "آسان طریقہ تدریس اور ہوم ورک میں مدد" },
    marketing: { name: "مارکتینگ اور ایس ای او", desc: "اشتہاری تحریر اور ایس ای او" },
    finance: { name: "مالیات اور اکاؤنٹنگ", desc: "مالیاتی چادریں اور اسپریڈ شیٹس" }
  }
}

export function useModelI18n() {
  const settingsStore = useSettings()

  const currentLang = computed(() => settingsStore.language || 'fr')

  function tModel(modelId: string, type: 'desc' | 'lang' | 'warn'): string {
    const lang = currentLang.value
    const key = getModelKey(modelId)
    const translation = modelTranslations[lang]?.[key]?.[type] || modelTranslations['fr']?.[key]?.[type] || ''
    return translation
  }

  function tUI(key: string): string {
    const lang = currentLang.value
    const translation = uiTranslations[lang]?.[key] || uiTranslations['fr']?.[key] || key
    return translation
  }

  function tDomain(domainId: string, type: 'name' | 'desc'): string {
    const lang = currentLang.value
    const translation = domainTranslations[lang]?.[domainId]?.[type] || domainTranslations['fr']?.[domainId]?.[type] || ''
    return translation
  }

  return {
    tModel,
    tUI,
    tDomain,
    currentLang
  }
}
