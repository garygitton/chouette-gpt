# Chouette GPT — Compagnon Natif (Linux/macOS)

Ce dossier contient le compagnon natif de Chouette GPT. Il s'agit d'un script Python autonome qui s'exécute sur votre système et permet à l'extension Google Chrome de s'affranchir des limites de mémoire pour faire tourner des modèles de plus de 20 Go (comme Qwen-32B ou Llama-70B) directement sur votre GPU.

## Installation & Enregistrement (Linux)

Pour que Google Chrome puisse communiquer avec ce compagnon natif via l'API **Native Messaging**, vous devez l'enregistrer auprès de votre navigateur.

### Étape 1 : Rendre le script exécutable
Assurez-vous que le script Python principal a les droits d'exécution :
```bash
chmod +x companion.py
```

### Étape 2 : Configurer le Manifest de l'Hôte
Ouvrez le fichier `com.chouette.gpt.companion.json` et vérifiez que le champ `"path"` pointe bien vers le chemin absolu de votre script `companion.py`.

*Exemple :*
```json
"path": "/home/gary/Projects/repositories/open-source/garygitton/chouette-gpt/companion/companion.py"
```

> **Note :** Si l'identifiant de votre extension Chrome change en mode développeur, ajoutez son ID dans le tableau `"allowed_origins"`.
> Par exemple : `"chrome-extension://knldjbgmffnchmenfpddjdbeligoaajd/"`

### Étape 3 : Copier le Manifest dans le dossier de Chrome
Copiez le fichier JSON dans le dossier de configuration de Chrome (ou Chromium) :

**Pour Google Chrome :**
```bash
mkdir -p ~/.config/google-chrome/NativeMessagingHosts/
cp com.chouette.gpt.companion.json ~/.config/google-chrome/NativeMessagingHosts/
```

**Pour Chromium (si applicable) :**
```bash
mkdir -p ~/.config/chromium/NativeMessagingHosts/
cp com.chouette.gpt.companion.json ~/.config/chromium/NativeMessagingHosts/
```

---

## Comment ça fonctionne ?
Lorsque Chouette GPT (exécuté sous forme d'extension) se connecte au background service worker, ce dernier instancie le compagnon en tant que sous-processus. 
La communication se fait via des flux d'entrées/sorties standard (`stdin`/`stdout`) en envoyant des messages JSON préfixés par leur taille sur 4 octets.

Le compagnon peut ensuite :
- Télécharger de gros modèles de 100 Go de façon stable via l'API Hugging Face Hub (avec gestion de reprise sur coupure).
- Allouer pleinement la VRAM de votre carte graphique (ex: 20 Go+) hors des contraintes du navigateur.
