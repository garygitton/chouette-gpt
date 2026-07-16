import { computed, ref } from 'vue'
import { ShieldCheck, WifiOff, Activity, Globe, ShieldAlert, Laptop } from 'lucide-vue-next'

export const taglines: Record<string, string> = {
  fr: "Assistant IA 100% local, confidentiel et open-source.",
  en: "100% local, private, and open-source AI assistant."
}

export const shortPitches: Record<string, string> = {
  fr: "ChouetteGPT est un assistant IA s'exécutant intégralement en local au sein du navigateur web via WebGPU. Cette architecture élimine le transit de données vers des serveurs tiers et assure une confidentialité absolue par conception.",
  en: "ChouetteGPT is an AI assistant running entirely locally inside the web browser via WebGPU. This architecture prevents data transit to third-party servers and ensures absolute privacy by design."
}

export const mediumPitches: Record<string, string> = {
  fr: "Conçu pour contourner la dépendance aux infrastructures cloud, ChouetteGPT exécute les modèles de langage directement sur le processeur graphique (GPU) de l'utilisateur grâce aux standards WebGPU et WebAssembly. Cette approche garantit une inférence à faible latence et une isolation totale des données sans installation logicielle requise. L'exécution s'opère de manière autonome dans le bac à sable du navigateur.",
  en: "Designed to eliminate cloud infrastructure dependence, ChouetteGPT executes language models directly on the user's graphics processor (GPU) using WebGPU and WebAssembly. This approach guarantees low-latency inference and complete data isolation with no software installation required. Execution takes place autonomously within the browser sandbox."
}

export const longStories: Record<string, string> = {
  fr: "ChouetteGPT est né du besoin d'exécuter des modèles d'intelligence artificielle avancés directement dans l'environnement d'exécution sécurisé d'un navigateur internet.\n\nLe logo de la chouette symbolise la vigilance de la vie privée et la centralisation locale de l'intelligence. Notre projet démontre qu'il est possible d'allier accessibilité utilisateur (aucun setup technique requis) et souveraineté matérielle.\n\nQu'il s'agisse d'un usage en mobilité (mode hors-ligne en transport) ou d'une exigence de conformité stricte (protection de secrets industriels ou de codes sources), ChouetteGPT offre une alternative factuelle, autonome et sous licence libre (MIT).",
  en: "ChouetteGPT was created to run advanced AI models directly inside a web browser's secure execution environment.\n\nThe owl logo represents local oversight of intelligence and active protection of user privacy. This project proves that user accessibility (zero technical setup) can coexist with hardware sovereignty.\n\nWhether used in transit (offline mode) or for strict security compliance (protecting trade secrets and source code), ChouetteGPT provides a factual, standalone, open-source alternative under the MIT license."
}

export const usageScenarios = [
  {
    icon: ShieldCheck,
    titleFr: "Secret Professionnel (Juristes, Avocats, DGC)",
    titleEn: "Professional Secrecy (Lawyers, Legal, Compliance)",
    descFr: "Analyser des contrats confidentiels, résumer des pièces de procédure ou formuler des avis juridiques sans jamais risquer de voir les données intégrées dans l'entraînement d'un modèle public.",
    descEn: "Analyze confidential contracts, summarize legal case files, or draft opinions without any risk of user data being ingested for training public AI models."
  },
  {
    icon: WifiOff,
    titleFr: "Productivité Nomade (Développeurs, Rédacteurs)",
    titleEn: "Nomadic Productivity (Developers, Writers)",
    descFr: "Générer du code en plein vol, réviser un article dans le train ou travailler dans des zones isolées à couverture réseau défaillante. ChouetteGPT continue de fonctionner sans interruption.",
    descEn: "Generate code mid-flight, proofread articles on the train, or work in isolated areas with poor internet connection. ChouetteGPT works uninterrupted."
  },
  {
    icon: Activity,
    titleFr: "Données de Santé & Diagnostic (Cliniciens, Chercheurs)",
    titleEn: "Medical Data & Diagnostics (Clinicians, Researchers)",
    descFr: "S'appuyer sur le modèle spécialisé MedGemma pour synthétiser des symptômes ou chercher des termes médicaux directement dans le navigateur, en garantissant qu'aucune donnée de santé ne quitte l'ordinateur.",
    descEn: "Use the domain-specific MedGemma model to summarize patient symptoms or query medical jargon directly inside the browser, ensuring medical records never leave the local device."
  }
]

export const faqItems: Record<string, Array<{q: string, a: string}>> = {
  fr: [
    {
      q: "Est-ce vraiment gratuit ?",
      a: "Oui, ChouetteGPT est gratuit et open-source sous licence MIT. Il n'y a pas de frais cachés. Le coût d'infrastructure est nul pour le créateur puisque l'inférence tourne en local chez vous."
    },
    {
      q: "Où vont mes données et mes prompts ?",
      a: "Nulle part. Tout le traitement se fait exclusivement dans le bac à sable local de votre navigateur. Aucun serveur ChouetteGPT ne stocke, ne voit ou ne transmet vos conversations."
    },
    {
      q: "Quelle est la différence avec Ollama ou LM Studio ?",
      a: "Zéro friction : vous n'avez pas besoin d'installer des binaires système lourds ou d'utiliser le terminal. C'est une simple adresse web accessible en un clic qui orchestre tout de manière transparente."
    },
    {
      q: "Quels navigateurs sont compatibles ?",
      a: "Tous les navigateurs récents supportant la technologie WebGPU (Chrome, Edge, Opera, ainsi que les versions récentes de Safari et Firefox en cours de déploiement)."
    }
  ],
  en: [
    {
      q: "Is it really free?",
      a: "Yes, ChouetteGPT is completely free and open-source under the MIT license. There are no hidden fees or API costs, as all computation runs locally on your own machine."
    },
    {
      q: "Where do my prompts and data go?",
      a: "Nowhere. All inference runs in the isolated sandbox of your local browser. No ChouetteGPT servers ever receive, view, or store your queries."
    },
    {
      q: "How does it differ from Ollama or LM Studio?",
      a: "Zero friction: you don't need to install system binaries, download separate configuration files, or run command prompts. It is a single click URL that automates local GPU acceleration."
    },
    {
      q: "Which browsers are supported?",
      a: "Any modern web browser with WebGPU enabled (Chrome, Edge, Opera, and recent versions of Safari and Firefox currently activating the feature)."
    }
  ]
}

export const staticTranslations: Record<string, any> = {
  fr: {
    specializedTitle: 'Modèles Spécialisés par Métier',
    specializedDesc: 'ChouetteGPT intègre des modèles optimisés pour des tâches spécifiques : assistance médicale (MedGemma), génération de code (Qwen-Coder), ou calcul formel (Qwen-Math). Cette approche assure une haute pertinence sur chaque domaine sans surcoût de bande passante.',
    sovereigntyTitle: 'Souveraineté & Mode Hors-ligne',
    sovereigntyDesc: 'L\'exécution de ChouetteGPT s\'effectue localement au sein du navigateur de l\'utilisateur. L\'application fonctionne de manière entièrement autonome hors-ligne après chargement, éliminant ainsi les contraintes de connectivité réseau.',
    complianceTitle: 'Cadre de conformité "Zero-Data" de fait',
    complianceDesc: 'L\'architecture sans serveur de ChouetteGPT empêche structurellement le stockage ou l\'analyse tierce des invites de commande (prompts). Les données de l\'utilisateur restent confinées sur l\'appareil local, répondant par défaut aux exigences des cadres réglementaires :',
    complianceNote: '* Note : N\'hébergeant aucune infrastructure serveur pour l\'inférence, le modèle de sécurité de ChouetteGPT dépend directement du profil de sécurité de la machine hôte.',
    copied: 'Copié !',
    copyArticle: 'Copier l\'article',
  },
  en: {
    specializedTitle: 'Domain-Specific Models',
    specializedDesc: 'ChouetteGPT integrates models optimized for specific workloads: medical tasks (MedGemma), code generation (Qwen-Coder), or formal reasoning (Qwen-Math). This provides targeted accuracy per domain without remote server latency.',
    sovereigntyTitle: 'Sovereignty & Offline Execution',
    sovereigntyDesc: 'ChouetteGPT runs locally inside the browser. Once loaded, the application operates 100% offline, removing remote connection requirements.',
    complianceTitle: 'De Facto "Zero-Data" Compliance',
    complianceDesc: 'The serverless architecture of ChouetteGPT structurally prevents any third-party storage or telemetry of input prompts. User data is isolated to the local device, aligning with key regulatory standards:',
    complianceNote: '* Note: Storing no data remotely, ChouetteGPT inherits the local security profile and authorization policies of the host machine.',
    copied: 'Copied!',
    copyArticle: 'Copy article',
  }
}

export const comparisonTable: Record<string, any> = {
  fr: {
    title: "Tableau Comparatif des Paradigmes IA",
    headers: ["Critère", "Local PC (Ollama, LM Studio)", "Web Local (ChouetteGPT)", "Web Cloud (ChatGPT, Claude)"],
    rows: [
      {
        criterion: "Barrière à l'entrée (Friction)",
        local: { text: "Élevée (Nécessite l'installation de dépendances, de terminaux ou de pilotes spécifiques)", status: "worst" },
        webLocal: { text: "Nulle (Accès instantané via une URL de navigateur)", status: "best" },
        cloud: { text: "Moyenne (Création de compte et authentification requises)", status: "neutral" }
      },
      {
        criterion: "Confidentialité & Données",
        local: { text: "Totale (Isolation locale complète des données sur le disque dur)", status: "best" },
        webLocal: { text: "Totale (Isolation locale complète dans le bac à sable du navigateur)", status: "best" },
        cloud: { text: "Partagée (Transit et traitement des flux sur des serveurs tiers)", status: "worst" }
      },
      {
        criterion: "Installation & Setup",
        local: { text: "Lourde (Configuration des pilotes et téléchargement manuel des fichiers GGUF)", status: "worst" },
        webLocal: { text: "Automatisée (Téléchargement automatique des poids du modèle dans le cache du navigateur au premier lancement)", status: "neutral" },
        cloud: { text: "Nulle (Accès direct via une application web hébergée sans téléchargement)", status: "best" }
      },
      {
        criterion: "Fonctionnement Hors-ligne",
        local: { text: "Oui (Fonctionnement 100% autonome hors-ligne)", status: "best" },
        webLocal: { text: "Oui (Fonctionnement 100% autonome hors-ligne après chargement de la page)", status: "best" },
        cloud: { text: "Non (Nécessite une connexion internet permanente)", status: "worst" }
      },
      {
        criterion: "Coût d'usage",
        local: { text: "Gratuit (Modèles open-source sous licence libre)", status: "best" },
        webLocal: { text: "Gratuit (Inférence locale autonome sans coût serveur)", status: "best" },
        cloud: { text: "Variable (Abonnements ou tarification à la consommation d'API)", status: "worst" }
      },
      {
        criterion: "Capacité & Taille des LLM",
        local: { text: "Limitée (Contrainte par la VRAM physique et la RAM de la machine, typiquement 1B à 8B)", status: "neutral" },
        webLocal: { text: "Limitée (Contrainte par la VRAM allouée au navigateur, typiquement 1B à 3B)", status: "worst" },
        cloud: { text: "Illimitée (Modèles géants hébergés sur des grappes de calcul cloud, 70B+)", status: "best" }
      }
    ]
  },
  en: {
    title: "AI Paradigms Comparison Table",
    headers: ["Metric", "Local PC (Ollama, LM Studio)", "Web Local (ChouetteGPT)", "Web Cloud (ChatGPT, Claude)"],
    rows: [
      {
        criterion: "Barrier to entry (Friction)",
        local: { text: "High (Requires system dependencies, command-line installations, and driver setups)", status: "worst" },
        webLocal: { text: "None (Instant execution via a web browser URL)", status: "best" },
        cloud: { text: "Medium (Account creation and authentication required)", status: "neutral" }
      },
      {
        criterion: "Privacy & Sovereignty",
        local: { text: "Total (Complete data isolation on the local drive)", status: "best" },
        webLocal: { text: "Total (Complete data isolation inside the browser sandbox)", status: "best" },
        cloud: { text: "Shared (Data transit and processing on third-party servers)", status: "worst" }
      },
      {
        criterion: "Installation & Setup",
        local: { text: "Heavy (GPU driver configuration and manual GGUF file downloads)", status: "worst" },
        webLocal: { text: "Automated (Automatic model weights download to browser cache on first launch)", status: "neutral" },
        cloud: { text: "None (Direct access via hosted web interface with zero downloads)", status: "best" }
      },
      {
        criterion: "Offline Support",
        local: { text: "Yes (100% offline execution)", status: "best" },
        webLocal: { text: "Yes (100% offline execution after initial page load)", status: "best" },
        cloud: { text: "No (Requires constant active internet connection)", status: "worst" }
      },
      {
        criterion: "Usage Cost",
        local: { text: "Free (Open-source models under permissive licenses)", status: "best" },
        webLocal: { text: "Free (Autonomous local compute without server overhead)", status: "best" },
        cloud: { text: "Variable (Subscription tiers or pay-as-you-go API keys)", status: "worst" }
      },
      {
        criterion: "Model Capacity & Scale",
        local: { text: "Limited (Constrained by local hardware VRAM and system RAM, typically 1B to 8B)", status: "neutral" },
        webLocal: { text: "Limited (Constrained by memory allocated to browser WebGPU context, typically 1B to 3B)", status: "worst" },
        cloud: { text: "Unlimited (Large-scale models hosted on remote multi-node server clusters, 70B+)", status: "best" }
      }
    ]
  }
}

export const logos = [
  {
    id: 'logo-peek-a-boo-coral',
    name: 'Logo Principal (Original)',
    filename: 'chouettegpt_logo_original',
    description: 'Version originale du logo représentant l\'owl en surimposition sur la barre de marque vert menthe.',
    bgClass: 'bg-[#f0fdf4]',
    svgRaw: `<svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style="display: block;">
  <g class="peeking-owl" transform-origin="50 70">
    <path d="M 30,50 Q 50,38 70,50 L 70,75 L 30,75 Z" fill="#fca5a5" />
    <polygon points="30,50 25,35 42,46" fill="#f87171" />
    <polygon points="70,50 75,35 58,46" fill="#f87171" />
    <circle cx="42" cy="54" r="7" fill="white" stroke="#991b1b" stroke-width="1.5" />
    <circle cx="40" cy="54" r="3" fill="#991b1b" class="shifty-pupil" />
    <circle cx="58" cy="54" r="7" fill="white" stroke="#991b1b" stroke-width="1.5" />
    <circle cx="56" cy="54" r="3" fill="#991b1b" class="shifty-pupil" />
    <polygon points="48,58 52,58 50,63" fill="#fef08a" />
  </g>
  <rect x="6" y="60" width="88" height="40" fill="#34d399" rx="10" />
  <rect x="6" y="60" width="88" height="6" fill="#10b981" rx="3" />
</svg>`
  },
  {
    id: 'logo-favicon-badge',
    name: 'Favicon & Badge Icon',
    filename: 'chouettegpt_favicon_badge',
    description: 'Version du logo optimisée pour les formats réduits (icônes d\'onglet et d\'application).',
    bgClass: 'bg-transparent',
    svgRaw: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style="display: block;">
  <g id="owl-favicon">
    <polygon points="10,50 0,20 34,42" fill="#f87171" />
    <polygon points="90,50 100,20 66,42" fill="#f87171" />
    <path d="M 10,50 Q 50,26 90,50 Q 90,95 50,95 Q 10,95 10,50 Z" fill="#fca5a5" />
    <circle cx="34" cy="58" r="14" fill="white" stroke="#991b1b" stroke-width="3" />
    <circle cx="30" cy="58" r="6" fill="#991b1b" />
    <circle cx="28" cy="55.5" r="2" fill="white" />
    <circle cx="66" cy="58" r="14" fill="white" stroke="#991b1b" stroke-width="3" />
    <circle cx="62" cy="58" r="6" fill="#991b1b" />
    <circle cx="60" cy="55.5" r="2" fill="white" />
    <polygon points="46,66 54,66 50,76" fill="#fef08a" />
  </g>
</svg>`
  }
]

export const pressAngles = [
  {
    id: 'press-sovereignty',
    icon: Globe,
    titleFr: "Souveraineté numérique et inférence décentralisée",
    titleEn: "Digital Sovereignty & Decentralized Inference",
    hookFr: "L'inférence locale évite le transit des données sensibles vers des infrastructures externes.",
    hookEn: "Local inference prevents sensitive data transit to external infrastructures.",
    bodyFr: "Dans un contexte où la souveraineté numérique est une priorité stratégique, ChouetteGPT permet d'exécuter des modèles d'intelligence artificielle avancés sans transfert de données vers des infrastructures tierces. En exploitant l'API WebGPU standardisée directement au sein du navigateur web, le traitement des requêtes s'opère intégralement sur la machine de l'utilisateur. Cette approche technique valide la viabilité de l'IA décentralisée, redonnant le contrôle complet des données et de la puissance de calcul à l'organisation ou à l'individu.",
    bodyEn: "With digital sovereignty rising as a strategic priority, ChouetteGPT enables the execution of advanced AI models without data transfers to third-party infrastructures. By leveraging the standard WebGPU API directly inside the web browser, prompt processing runs entirely on the user's hardware. This technical architecture demonstrates the viability of decentralized AI, returning complete data and compute ownership to the organization or individual."
  },
  {
    id: 'press-confidentiality',
    icon: ShieldAlert,
    titleFr: "Conformité réglementaire et secret professionnel",
    titleEn: "Regulatory Compliance & Professional Secrecy",
    hookFr: "Le traitement local garantit par conception le respect du secret des données.",
    hookEn: "Local processing by design guarantees strict data confidentiality.",
    bodyFr: "Les secteurs d'activité soumis au secret professionnel (santé, juridique, finance) doivent concilier l'adoption des LLM avec de strictes exigences de confidentialité. En proposant des modèles spécialisés s'exécutant dans le bac à sable local du navigateur, ChouetteGPT élimine le risque d'exfiltration des données. L'absence de serveurs de traitement intermédiaires élimine les risques classiques d'interception réseau ou d'hébergement non conforme, assurant une compatibilité de fait avec les normes de protection des données.",
    bodyEn: "Industries governed by professional secrecy (healthcare, legal, finance) must reconcile LLM adoption with strict confidentiality regulations. By providing specialized local models executing within the browser's sandbox, ChouetteGPT removes the risk of data leakage. Bypassing external processing servers eliminates network interception vectors and non-compliant data hosting, ensuring default compatibility with data protection acts."
  },
  {
    id: 'press-green',
    icon: Laptop,
    titleFr: "Sobriété numérique et inférence distribuée",
    titleEn: "Green Compute & Distributed Inference",
    hookFr: "L'exploitation des ressources matérielles locales réduit la dépendance aux centres de calcul.",
    hookEn: "Harnessing local hardware resources reduces reliance on remote server farms.",
    bodyFr: "La massification des modèles d'intelligence artificielle hébergés dans le cloud accroît fortement la demande énergétique des centres de données. ChouetteGPT propose une alternative en exploitant la puissance de calcul locale des puces graphiques (GPU) grand public déjà installées sur les terminaux. Cette architecture décentralisée évite les flux réseau continus et optimise l'usage des processeurs locaux actifs. Elle constitue un modèle d'inférence sobre et écologiquement cohérent pour l'accès aux LLM.",
    bodyEn: "The growth of cloud-based AI services has led to a significant surge in data center energy demand. ChouetteGPT offers an alternative by utilizing the local compute power of graphics processors (GPUs) already active on user devices. This decentralized architecture avoids constant network traffic and optimizes active local hardware assets. It serves as a resource-efficient, ecologically consistent inference model for LLM utilization."
  }
]
