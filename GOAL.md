[English](#english) | [Français](#français)

---

<a id="english"></a>
# 🎯 Project Goals: Chouette GPT

Chouette GPT is an experimental, next-generation AI assistant designed to run **100% locally and privately within the user's web browser**. By leveraging WebGPU and WebAssembly, it brings local LLM execution directly to client-side hardware with zero server-side infrastructure costs.

This document outlines the core objectives, design principles, and long-term vision of the project.

---

## 1. Core Philosophy & Mission
- **100% Client-Side & Private**: No prompts, chats, or document inputs must ever leave the user's local device. Privacy is absolute by design.
- **Zero Server Costs**: Scale the application to millions of users without incurring hosting, API, or GPU server costs, relying entirely on the client's local compute.
- **Accessible AI**: Democratize access to advanced AI tools by packaging them in a standard, cross-platform web application that runs directly in the browser.

## 2. Adaptive Capabilities & Feature Scope
- **Hybrid & Adaptive Engine**: Support state-of-the-art browser capabilities (such as multimodality, vision models, function calling/tool use, and image generation) on capable machines.
- **Graceful Degradation**: Automatically adapt to the client's hardware by recommending ultra-lightweight models (e.g., SmolLM2-135M) for low-end, mobile, or older devices.
- **Specialized Multi-Model Ecosystem**: Use secondary specialized models (e.g., Whisper-web for Speech-to-Text, WebGPU Stable Diffusion) to enrich the experience without bloating the main chat model.

## 3. Offline-First Architecture
- **Persistent Local Caching**: Cache model weights permanently in the browser (using Cache API or IndexedDB) upon the first download to enable instantaneous, completely offline startup on subsequent uses.
- **Client Storage Transparency**: Provide a dedicated storage manager UI within the app settings allowing users to inspect, clean, or delete cached models.
- **Independent Execution**: Ensure all application logic, parsers (markdown, KaTeX, code block highlight, mermaid diagrams), and chat histories run locally without external cloud dependencies.

## 4. UI/UX & Brand Identity
- **Modern Premium Design**: Wow the user with a desktop-grade web application featuring modern typography, harmonious color palettes, smooth dark/light transitions, glassmorphism, and responsive micro-animations.
- **Mascot-Driven Branding**: Embrace the "Chouette" (Owl) mascot throughout the interface, adding character and warmth to the local assistant.
- **Feature-Rich & Intuitive Feed**: Build an interactive chat feed that handles Markdown, code syntax highlighting, mathematical equations (KaTeX), mermaid diagrams, upload previews, and clear processing indicators.

---

<a id="français"></a>
# 🎯 Objectifs du Projet : Chouette GPT

Chouette GPT est un assistant IA expérimental de nouvelle génération conçu pour s'exécuter **à 100 % localement et de manière privée dans le navigateur web de l'utilisateur**. Grâce à WebGPU et WebAssembly, il permet l'exécution de LLM locaux directement sur le matériel client, éliminant tout coût d'infrastructure serveur.

Ce document définit les objectifs clés, les principes de conception et la vision à long terme du projet.

---

## 1. Philosophie Centrale & Mission
- **100 % Client-Side & Privé** : Aucun prompt, chat ou document ne doit quitter l'appareil local de l'utilisateur. La confidentialité est totale par conception.
- **Zéro Coût Serveur** : Distribuer l'application à des millions d'utilisateurs sans frais d'hébergement, d'API ou de serveurs GPU, en exploitant uniquement la puissance de calcul locale du client.
- **Accessibilité de l'IA** : Démocratiser l'accès aux outils IA avancés en les intégrant dans une application web standard et multiplateforme s'exécutant directement dans le navigateur.

## 2. Capacités Adaptatives & Périmètre
- **Moteur Hybride & Adaptatif** : Supporter les fonctionnalités de pointe du web (multimodalité, modèles de vision, utilisation d'outils/function calling et génération d'images) sur les machines performantes.
- **Dégradation Gracieuse** : S'adapter automatiquement au matériel du client en recommandant des modèles ultra-légers (ex: SmolLM2-135M) sur les appareils d'entrée de gamme ou mobiles.
- **Écosystème Multi-Modèle Spécialisé** : Utiliser des modèles secondaires spécialisés (ex: Whisper-web pour le Speech-to-Text, Stable Diffusion WebGPU) pour enrichir l'expérience sans alourdir le modèle de chat principal.

## 3. Architecture Offline-First (Hors-ligne d'abord)
- **Mise en cache locale persistante** : Stocker les poids des modèles de manière permanente dans le navigateur (via Cache API ou IndexedDB) dès le premier téléchargement pour un démarrage instantané et totalement hors-ligne lors des sessions suivantes.
- **Transparence du stockage client** : Fournir une interface de gestion du stockage dédiée dans les paramètres pour permettre aux utilisateurs d'inspecter, nettoyer ou supprimer les modèles mis en cache.
- **Exécution Indépendante** : Garantir que toute la logique applicative, les parseurs (markdown, KaTeX, coloration syntaxique, diagrammes mermaid) et l'historique des conversations fonctionnent localement sans dépendance externe.

## 4. UI/UX & Identité Visuelle
- **Design Premium Moderne** : Offrir une interface utilisateur digne d'une application de bureau avec une typographie moderne, des palettes de couleurs harmonieuses, des transitions sombre/clair fluides, du glassmorphism et des micro-animations réactives.
- **Branding Chouette** : Intégrer l'identité visuelle de la mascotte "Chouette" à travers l'interface pour apporter de la personnalité et de la convivialité.
- **Interface de Chat Riche & Intuitive** : Concevoir un flux de chat interactif gérant le Markdown, la coloration de code, les équations mathématiques (KaTeX), les diagrammes mermaid, les aperçus de fichiers et des indicateurs de traitement clairs.
