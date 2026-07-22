import type { ModelTranslation } from '~/composables/useModelI18n'

export default {
    qwen_05b: {
      desc: "Modèle ultra-léger de 500M paramètres. Très rapide et économe en batterie.",
      lang: "Anglais, Chinois (bon), autres langues (basique).",
      warn: "Taille réduite : sujet à de fréquentes hallucinations et erreurs de logique."
    },
    smollm_360m: {
      desc: "Modèle ultra-compact de 360M paramètres (SmolLM2 par Hugging Face). Ultra-rapide.",
      lang: "Anglais (bon), Français (basique).",
      warn: "Capacités de raisonnement très basiques dues à sa petite taille."
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
  } as Record<string, ModelTranslation>
