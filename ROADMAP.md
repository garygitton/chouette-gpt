[English](#english) | [Français](#français)

---

<a id="english"></a>
# 🗺️ Roadmap: Chouette GPT

This document defines the next major evolutionary steps for Chouette GPT, inspired by the capabilities offered by the recently analyzed **Web-LLM** and **Transformers.js** ecosystems. The goal remains to keep a 100% local, "in-browser" architecture powered by WebGPU.

## 👁️ Phase 1: Multimodality & Vision Models
*Goal: Allow the assistant to "see" and analyze images directly in the browser.*

- **Engine**: Integrate Vision-Language Models (VLM) like *Llama-3.2-Vision* via Web-LLM, or *Florence-2* via Transformers.js.
- **User Interface (UI)**:
  - Add an upload button (paperclip or camera) in `ChatInputArea.vue`.
  - Support image Drag & Drop in the chat area.
  - Modify `ChatMessage.vue` to display attached images above the user's text.
- **Memory Management**: Pre-process and resize images in JavaScript (via Canvas) before passing them to the WebGPU tensor to avoid VRAM crashes.

## 🛠️ Phase 2: Function Calling (Tool Use)
*Goal: Give "hands" to Chouette GPT so it can execute local actions.*

- **Engine**: Exploit Web-LLM's compatibility with the standard OpenAI API to inject the `tools` property into the completion request.
- **Local Tools Implementation**:
  - `get_current_time`: Allows the model to know the device's current time/date.
  - `evaluate_math`: Basic calculator to avoid mathematical hallucinations.
  - `fetch_page`: Tool allowing the model to read the text content of a simple URL (via the browser's Fetch API, mind the CORS).
- **User Interface (UI)**:
  - Create a `ToolCallIndicator.vue` component to display an animated badge ("⚙️ Searching...", "🧮 Calculating...") while the model executes a tool in the background.

## 🎨 Phase 3: Specialized Tasks with Transformers.js
*Goal: Use specialized secondary models to enrich the experience without bloating the main chat model.*

- **Image Generation (Diffusion)**: Integrate a small WebGPU SD (Stable Diffusion) model to allow the user to ask: *"Generate an image of an owl"*.
- **Speech Recognition and Synthesis (Audio)**:
  - *Speech-to-Text*: Use `Whisper-web` for a voice dictation mode.
  - *Text-to-Speech*: "Read aloud" button using the browser's voice APIs or a local TTS model.

<br>

---

<a id="français"></a>
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
