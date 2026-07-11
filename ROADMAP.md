# 🗺️ Roadmap : Chouette GPT

Ce document définit les prochaines grandes étapes d'évolution de Chouette GPT, en s'inspirant des capacités offertes par les écosystèmes **Web-LLM** et **Transformers.js** récemment analysés. L'objectif reste de garder une architecture 100% locale, "in-browser" et propulsée par WebGPU.

## 👁️ Phase 1 : Multimodalité & Modèles de Vision
*Objectif : Permettre à l'assistant de "voir" et d'analyser des images directement dans le navigateur.*

- **Moteur** : Intégrer les modèles Vision-Language (VLM) comme *Llama-3.2-Vision* via Web-LLM, ou *Florence-2* via Transformers.js.
- **Interface Utilisateur (UI)** :
  - Ajouter un bouton d'upload (trombone ou caméra) dans `ChatInputArea.vue`.
  - Supporter le glisser-déposer (Drag & Drop) d'images dans la zone de chat.
  - Modifier `ChatMessage.vue` pour afficher les images jointes au-dessus du texte de l'utilisateur.
- **Gestion de la mémoire** : Pré-traiter et redimensionner les images en JavaScript (via Canvas) avant de les passer au tenseur WebGPU pour éviter les crashs VRAM.

## 🛠️ Phase 2 : Function Calling (Utilisation d'Outils)
*Objectif : Donner des "mains" à Chouette GPT pour qu'il puisse exécuter des actions locales.*

- **Moteur** : Exploiter la compatibilité de Web-LLM avec l'API standard d'OpenAI pour injecter la propriété `tools` dans la requête de complétion.
- **Implémentation des Outils Locaux** :
  - `get_current_time` : Permet au modèle de connaître l'heure/date de l'appareil.
  - `evaluate_math` : Calculatrice basique pour éviter les hallucinations mathématiques.
  - `fetch_page` : Outil permettant au modèle de lire le contenu texte d'une URL simple (via l'API Fetch du navigateur, attention aux CORS).
- **Interface Utilisateur (UI)** :
  - Créer un composant `ToolCallIndicator.vue` pour afficher un badge animé ("⚙️ Recherche en cours...", "🧮 Calcul...") pendant que le modèle exécute un outil en arrière-plan.

## 🎨 Phase 3 : Tâches Spécialisées avec Transformers.js
*Objectif : Utiliser des modèles secondaires spécialisés pour enrichir l'expérience sans alourdir le modèle de chat principal.*

- **Génération d'images (Diffusion)** : Intégrer un petit modèle SD (Stable Diffusion) WebGPU pour permettre à l'utilisateur de demander : *"Génère-moi une image de chouette"*.
- **Reconnaissance et Synthèse Vocale (Audio)** :
  - *Speech-to-Text* : Utiliser `Whisper-web` pour un mode dictée vocale.
  - *Text-to-Speech* : Bouton "Lire à voix haute" utilisant les API vocales du navigateur ou un modèle local TTS.

---
*Qu'en pensez-vous ? Y a-t-il d'autres outils (Tools) ou cas d'usage que vous aimeriez ajouter avant qu'on intègre ce fichier officiellement dans le projet ?*
