# 🧪 Scénarios de Tests Produit & Assurance Qualité

Ce document détaille les scénarios de tests automatisés (BDD Gherkin & E2E Playwright) couvrant les piliers techniques majeurs de **Chouette GPT**.

---

## 💾 1. Packaging Offline-First : Persistance IndexedDB & CacheStorage 100% Autonome

### **Scénario 1.1 : Persistance locale des conversations dans IndexedDB**
* **Fichier de test** : [`tests/offline-first-persistence.spec.ts`](file:///home/gary/Projects/repositories/open-source/garygitton/chouette-gpt/tests/offline-first-persistence.spec.ts)
* **Description** : Vérifie que la base de données locale IndexedDB (`chouette-gpt-db`) stocke l'intégralité des messages et conversations sans aucun serveur externe.
* **Spécification BDD (Gherkin)** :
  ```gherkin
  Fonctionnalité: Persistance locale IndexedDB
    Étant donné que l'utilisateur ouvre Chouette GPT en mode hors-ligne
    Quand il saisit et envoie un message dans le chat
    Alors le message est sérialisé et enregistré dans le store 'conversations' de IndexedDB
    Et la conversation est conservée lors du rechargement de la page sans connexion Internet
  ```

### **Scénario 1.2 : Exécution 100% autonome en mode déconnecté (Network Offline)**
* **Fichier de test** : [`tests/offline-first-persistence.spec.ts`](file:///home/gary/Projects/repositories/open-source/garygitton/chouette-gpt/tests/offline-first-persistence.spec.ts)
* **Description** : Simule une coupure réseau complète (`Network Offline / Mode Avion`) et valide que l'interface reste pleinement opérationnelle.
* **Spécification BDD (Gherkin)** :
  ```gherkin
  Fonctionnalité: Mode Déconnecté Autonome
    Étant donné que l'application est initialisée
    Quand le réseau réseau de l'appareil est complètement désactivé (Mode Avion)
    Alors l'interface utilisateur reste réactive et utilisable sans erreur réseau
    Et les saisies dans le champ de chat restent activées
  ```

### **Scénario 1.3 : Mise en cache des assets et poids de modèles via CacheStorage**
* **Fichier de test** : [`tests/offline-first-persistence.spec.ts`](file:///home/gary/Projects/repositories/open-source/garygitton/chouette-gpt/tests/offline-first-persistence.spec.ts)
* **Description** : Valide la disponibilité de l'API `caches` pour stocker les fichiers ONNX/WASM et assets PWA.
* **Spécification BDD (Gherkin)** :
  ```gherkin
  Fonctionnalité: CacheStorage des Assets et Modèles
    Étant donné que l'utilisateur a téléchargé un modèle IA
    Quand le modèle est stocké dans CacheStorage
    Alors les appels ultérieurs lisent les poids directement dans le cache du navigateur à une vitesse > 200 Mo/s
  ```

---

## 🛠️ 2. Plugins Locaux : Système d'Outils Sécurisés (Calculatrice, Horloge, Scraping Local)

### **Scénario 2.1 : Outil Horloge Locale (`get_current_time`)**
* **Fichier de test** : [`tests/local-plugins.spec.ts`](file:///home/gary/Projects/repositories/open-source/garygitton/chouette-gpt/tests/local-plugins.spec.ts)
* **Description** : Teste la récupération de l'horodatage système local sans appel serveur.
* **Spécification BDD (Gherkin)** :
  ```gherkin
  Fonctionnalité: Plugin Horloge Locale
    Étant donné que le modèle IA sollicite l'outil 'get_current_time'
    Quand le plugin local s'exécute dans le moteur du navigateur
    Alors la date et l'heure exactes de l'appareil utilisateur sont retournées au modèle avec la bonne zone horaire
  ```

### **Scénario 2.2 : Outil Calculatrice Locale (`evaluate_math`)**
* **Fichier de test** : [`tests/local-plugins.spec.ts`](file:///home/gary/Projects/repositories/open-source/garygitton/chouette-gpt/tests/local-plugins.spec.ts)
* **Description** : Évalue des expressions mathématiques complexes de manière sécurisée (sans `eval()` non sécurisé).
* **Spécification BDD (Gherkin)** :
  ```gherkin
  Fonctionnalité: Plugin Calculatrice Sécurisée
    Étant donné une expression mathématique "125 * 8 + 40"
    Quand le plugin 'evaluate_math' est invoqué par l'assistant
    Alors le résultat exact (1040) est calculé sans aucune hallucination numérique
    Et l'exécution est sécurisée contre toute injection de code malveillant
  ```

### **Scénario 2.3 : Outil Extraction / Scraping Local (`fetch_page`)**
* **Fichier de test** : [`tests/local-plugins.spec.ts`](file:///home/gary/Projects/repositories/open-source/garygitton/chouette-gpt/tests/local-plugins.spec.ts)
* **Description** : Permet l'extraction et l'analyse de contenus texte d'URL ou d'éléments DOM locaux pour le RAG.
* **Spécification BDD (Gherkin)** :
  ```gherkin
  Fonctionnalité: Plugin Scraping & Analyse Locale
    Étant donné une page web ou un document chargé localement
    Quand le plugin 'fetch_page' ou le parser DOM extrait le contenu texte
    Alors le texte brut est nettoyé et fourni au modèle pour synthèse
  ```

---

## 🎨 3. UI/UX Premium : Finitions Glassmorphism & Animations de Streaming

### **Scénario 3.1 : Effets de Glassmorphism et Backdrop Blur**
* **Fichier de test** : [`tests/premium-ui-ux.spec.ts`](file:///home/gary/Projects/repositories/open-source/garygitton/chouette-gpt/tests/premium-ui-ux.spec.ts)
* **Description** : Vérifie la présence des styles CSS Glassmorphism (`backdrop-blur`, bordures translucides, lueurs ambiantes).
* **Spécification BDD (Gherkin)** :
  ```gherkin
  Fonctionnalité: Design Glassmorphism Premium
    Étant donné l'affichage du tableau de bord ou des cartes d'accueil
    Alors les conteneurs appliquent un filtre 'backdrop-blur' et des bordures dégradées subtiles
    Et l'arrière-plan comporte un halo lumineux animé ('ambient glow')
  ```

### **Scénario 3.2 : Fluidité des animations de streaming de réponse**
* **Fichier de test** : [`tests/premium-ui-ux.spec.ts`](file:///home/gary/Projects/repositories/open-source/garygitton/chouette-gpt/tests/premium-ui-ux.spec.ts)
* **Description** : Valide l'apparition progressive des messages (streaming token par token, curseur clignotant, transitions CSS).
* **Spécification BDD (Gherkin)** :
  ```gherkin
  Fonctionnalité: Streaming de Réponse Fluide
    Étant donné que le modèle génère du texte en flux continu
    Quand les tokens sont reçus du worker WebGPU
    Alors chaque bloc de texte s'insère avec une animation de transition fluide sans saut de défilement
  ```

### **Scénario 3.3 : Adaptabilité thématique et micro-interactions**
* **Fichier de test** : [`tests/premium-ui-ux.spec.ts`](file:///home/gary/Projects/repositories/open-source/garygitton/chouette-gpt/tests/premium-ui-ux.spec.ts)
* **Description** : Teste les effets de survol (hover scale), les boutons interactifs et la bascule Dark/Light mode.
* **Spécification BDD (Gherkin)** :
  ```gherkin
  Fonctionnalité: Micro-interactions & Thème Adaptatif
    Étant donné l'interaction utilisateur sur les cartes de promts ou la barre latérale
    Quand le curseur survole un composant
    Alors un effet d'élévation ('hover scale') et un halo de couleur se déclenchent de manière fluide
  ```
