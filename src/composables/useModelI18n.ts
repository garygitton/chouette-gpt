import { computed } from 'vue'
import { useSettings } from '~/contexts/settingsContext'
import fr from '~/locales/models/fr'
import en from '~/locales/models/en'
import es from '~/locales/models/es'
import zh from '~/locales/models/zh'
import hi from '~/locales/models/hi'
import ar from '~/locales/models/ar'
import pt from '~/locales/models/pt'
import ru from '~/locales/models/ru'
import bn from '~/locales/models/bn'
import ur from '~/locales/models/ur'

export interface ModelTranslation {
  desc: string
  lang: string
  warn: string
}

export const modelTranslations: Record<string, Record<string, ModelTranslation>> = {
  fr,
  en,
  es,
  zh,
  hi,
  ar,
  pt,
  ru,
  bn,
  ur
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
