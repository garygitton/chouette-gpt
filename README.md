# ChouetteGPT

ChouetteGPT est une interface locale de génération de texte et d'interaction avec des modèles d'intelligence artificielle. Le projet propose une sélection de modèles CPU (WebAssembly) et GPU (WebGPU) afin de fonctionner entièrement en local dans votre navigateur pour un respect total de votre vie privée.

## Configuration requise pour l'accélération matérielle (WebGPU)

Par défaut, l'utilisation de modèles ultra-rapides (marqués MLC) nécessite une accélération matérielle via WebGPU. Cependant, sur certains systèmes (particulièrement sous Linux), le navigateur bloque cette fonctionnalité par mesure de sécurité liée aux pilotes graphiques. 

Si vous rencontrez le message d'erreur `Failed to create WebGPU Context Provider`, voici comment forcer l'activation de la carte graphique dans les navigateurs basés sur Chromium (Chrome, Brave, Edge) :

1. Copiez et collez cette adresse dans la barre de votre navigateur : `chrome://flags/#enable-unsafe-webgpu`
2. Modifiez le menu déroulant sur **Enabled**.
3. (Optionnel sous Linux) Copiez et collez cette adresse : `chrome://flags/#enable-vulkan` et passez-le également sur **Enabled**.
4. Cliquez sur le bouton **Relaunch** (Redémarrer) qui apparaît en bas de l'écran.

Une fois le navigateur redémarré, WebGPU devrait être actif et vous pourrez utiliser les modèles WebLLM (MLC) à pleine puissance. Si l'erreur persiste, c'est que votre système d'exploitation ne supporte pas encore WebGPU et vous devrez vous rabattre sur les modèles CPU (comme TinyLlama ou Qwen1.5 CPU).

## Lancement

Le projet s'appuie sur Nuxt et Docker :
```bash
docker-compose up
```
Accédez au site via [http://chouette-gpt.localhost/](http://chouette-gpt.localhost/) ou [http://localhost:3000](http://localhost:3000).

## Déploiement & CDN (Scaleway Edge Services)

L'application est déployée automatiquement en mode site statique sur un bucket S3 de Scaleway via GitLab CI.

Pour assurer de hautes performances de chargement des actifs lourds (modèles ONNX et runtimes WebAssembly) tout en sécurisant l'accès HTTPS par certificat SSL Let's Encrypt géré, un pipeline **Scaleway Edge Services (CDN)** est placé devant le bucket S3.

### Intégration CI/CD

Lors de chaque déploiement sur la branche `main` :
1. Les fichiers statiques compilés sont synchronisés avec le bucket S3 `chouette.chouette-gpt.fr`.
2. Une commande de **purge de cache** ciblée est envoyée à l'API Scaleway Edge Services pour invalider uniquement le fichier `index.html`.
3. Cela garantit que les utilisateurs obtiennent immédiatement la dernière version de l'application sans vider le cache des gros fichiers modèles (.onnx/.wasm) déjà mis en cache à la périphérie (Edge).

Les variables CI/CD requises (configurées dans GitLab) sont :
- `SCW_ACCESS_KEY` : Clé d'accès API Scaleway.
- `SCW_SECRET_KEY` : Clé secrète API Scaleway.
- `EDGE_PIPELINE_ID` : L'identifiant du pipeline Edge Services (défini dans `.gitlab-ci.yml`).
