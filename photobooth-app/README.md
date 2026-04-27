# 🎉 Photobooth Anniversaire

## Structure du projet
```
photobooth-app/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    └── firebase.js   ← ici tu colles tes clés
```

---

## Étape 1 — Créer Firebase (10 min)

1. Va sur https://firebase.google.com → **Commencer**
2. Crée un projet (ex: "photobooth-anniversaire"), désactive Google Analytics
3. Dans le menu gauche → **Firestore Database** → **Créer une base de données**
   - Choisis **Mode test** (pour commencer)
   - Sélectionne la région `europe-west` (serveurs en Europe)
4. Dans ⚙️ **Paramètres du projet** → **Tes applications** → clique sur `</>`  (Web)
   - Donne un nom, clique **Enregistrer**
   - Copie le bloc `firebaseConfig` qui apparaît

5. **Ouvre `src/firebase.js`** et remplace les `"COLLE_ICI"` par tes valeurs

---

## Étape 2 — Déployer sur Vercel (5 min)

1. Va sur https://vercel.com → **Sign Up** (avec Google c'est le plus rapide)
2. Sur le dashboard → **Add New Project**
3. Choisis **"Browse"** et glisse-dépose **tout le dossier** `photobooth-app`
4. Vercel détecte Vite automatiquement → clique **Deploy**
5. ✅ Tu as une URL publique genre `photobooth-anniversaire.vercel.app`

---

## Utilisation le soir J

- **Tablette** : ouvre l'URL → onglet "📸 Prendre une photo"
- **Ton téléphone** : ouvre la même URL → onglet "🏆 Classement" pour voir le live
- **Reset** : dans le classement, tape 5x sur les petits points `· · ·` en bas

---

## Bonus — Sécuriser Firestore (optionnel)

Dans Firebase Console → Firestore → **Règles**, remplace par :
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /photobooth/counts {
      allow read, write: if true;
    }
  }
}
```
