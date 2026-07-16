# Guide : Ajouter de nouveaux modèles spécialisés à ChouetteGPT

Ce guide explique étape par étape comment ajouter de nouveaux modèles locaux et de nouveaux domaines de spécialisation (ex. traduction, droit, finance) dans ChouetteGPT.

---

## 1. Critères de compatibilité des modèles

ChouetteGPT exécute l'IA entièrement dans le navigateur à l'aide de **Transformers.js** (ONNX Runtime Web). Pour qu'un modèle soit compatible, il doit :
1. **Être au format ONNX** (contenant `config.json`, `tokenizer.json`, `tokenizer_config.json`, et le fichier de poids `.onnx`).
2. **Être quantifié** de préférence pour optimiser les performances :
   * **`q4` (INT4)** : Recommandé pour l'exécution CPU/WASM standard (compatibilité maximale).
   * **`q4f16` (Float16)** : Recommandé pour l'accélération WebGPU (cartes graphiques).
3. **Être hébergé sur Hugging Face** (de nombreux modèles pré-convertis en ONNX sont disponibles sur l'organisation [onnx-community](https://huggingface.co/onnx-community) ou [xenova](https://huggingface.co/xenova)).

---

## 2. Étape 1 : Enregistrer le modèle dans ChouetteGPT

Tous les modèles disponibles sont listés dans [`src/contexts/modelContext.ts`](file:///home/gary/Projects/repositories/open-source/garygitton/chouette-gpt/src/contexts/modelContext.ts).

Pour ajouter un modèle, insérez un nouvel objet dans la liste `models` :

```typescript
{
  id: 'onnx-community/nom-du-depot-hf',   // ID Hugging Face exact
  name: 'Nom Affiché du Modèle',
  version: '1.0',
  parameters: '1.5B',                       // Nombre de paramètres
  totalSize: '1.8 GB',                     // Taille du fichier de poids
  quantization: 'q4',                      // 'q4' (CPU/WASM) ou 'q4f16' (WebGPU-only)
  estimatedMemory: '2 GB',                 // RAM estimée requise dans le navigateur
  status: ModelStatus.Available,
  ramRequired: 4096,                       // RAM requise minimale en Mo (ex: 4096 pour 4 Go)
  performanceScore: 65,                    // Score arbitraire d'intelligence (0-100)
  description: 'Spécialisé en traduction',  // Description courte
  domains: ['translation'],                // ID du domaine auquel il appartient (ex: general, maths, code)
  supportsSampling: true                   // Facultatif (false si le modèle n'aime pas le sampling libre)
}
```

---

## 3. Étape 2 : Ajouter ou associer un domaine de spécialité

ChouetteGPT associe chaque domaine (ex. médecine, code) à une icône et à un prompt système.

### Associer à un domaine existant
Il vous suffit d'ajouter l'ID du domaine dans la propriété `domains` du modèle (ex. `domains: ['code']`).

### Créer un nouveau domaine
Si vous souhaitez ajouter une nouvelle spécialité (ex: Droit), ouvrez [`src/contexts/modelContext.ts`](file:///home/gary/Projects/repositories/open-source/garygitton/chouette-gpt/src/contexts/modelContext.ts) et ajoutez un nouvel objet dans la liste `domains` :

```typescript
{
  id: 'legal',
  name: 'Droit',
  description: 'Analyse & rédaction juridique',
  icon: 'Scale', // Nom de l'icône Lucide (assurez-vous qu'elle soit importée dans SidebarContent)
  prompt: 'Tu es un assistant juridique expert...' // Le prompt système imposé à l'IA pour ce domaine
}
```

---

## 4. Étape 3 (Facultatif) : Pré-télécharger ou mettre en cache le modèle

Si vous souhaitez mettre en cache localement le modèle sur votre machine de développement pour un accès hors-ligne instantané ou pour le packager dans un environnement de test local :

1. Ouvrez le script [`scripts/download-models.mjs`](file:///home/gary/Projects/repositories/open-source/garygitton/chouette-gpt/scripts/download-models.mjs).
2. Ajoutez votre modèle et le nom du fichier de poids dans la constante `MODELS` :
   ```javascript
   { id: 'onnx-community/nom-du-depot-hf', file: 'onnx/model_q4.onnx' }
   ```
3. Exécutez le téléchargement local :
   ```bash
   node scripts/download-models.mjs
   ```

---

## 5. Étape 4 : Mettre à jour les tests automatisés

Pour garantir que le modèle est toujours accessible sur Hugging Face lors de vos intégrations continues (CI) :

1. Ouvrez [`tests/model-download.spec.ts`](file:///home/gary/Projects/repositories/open-source/garygitton/chouette-gpt/tests/model-download.spec.ts).
2. Ajoutez votre modèle à la liste de validation `models` :
   ```typescript
   { id: 'onnx-community/nom-du-depot-hf', expectedWeight: 'onnx/model_q4.onnx' }
   ```
3. Exécutez la vérification des dépôts :
   ```bash
   npx playwright test tests/model-download.spec.ts
   ```
