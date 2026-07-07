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
