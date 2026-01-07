# 🍳 Application de Gestion de Recettes

Application complète de gestion de recettes avec React, Node.js et MongoDB.

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (v14+)
- MongoDB (local ou Atlas)
- npm ou yarn

### 1. Installation Backend

```bash
cd backend
npm install
```

Créez un fichier `.env` dans le dossier `backend` :
```
MONGODB_URI=mongodb://localhost:27017/recettes
PORT=5000
JWT_SECRET=votre_secret_jwt_tres_securise
```

Démarrez le serveur :
```bash
npm start
```

### 2. Installation Frontend

```bash
cd frontend
npm install
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 📁 Structure du Projet

```
recettes-app/
├── backend/
│   ├── models/          # Modèles MongoDB
│   ├── routes/          # Routes API
│   ├── middleware/      # Middleware d'authentification
│   └── server.js        # Serveur Express
└── frontend/
    ├── src/
    │   ├── components/  # Composants React
    │   ├── pages/       # Pages de l'application
    │   ├── context/     # Context API pour l'état global
    │   └── App.js       # Composant principal
    └── public/
```

## ✨ Fonctionnalités

- ✅ Authentification utilisateur (inscription/connexion)
- ✅ Création, modification, suppression de recettes
- ✅ Recherche par ingrédients
- ✅ Filtrage par catégorie et temps de préparation
- ✅ Mode cuisine avec instructions pas à pas
- ✅ Gestion des portions
- ✅ Interface moderne et responsive

## 🎨 Technologies

- **Frontend** : React, Axios, React Router
- **Backend** : Node.js, Express, MongoDB, Mongoose, JWT
- **Style** : CSS moderne avec animations