#!/bin/bash

echo "🍳 Démarrage de l'application de gestion de recettes..."
echo ""

# Couleurs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js n'est pas installé${NC}"
    echo "Installez Node.js depuis https://nodejs.org"
    exit 1
fi

echo -e "${GREEN}✅ Node.js détecté : $(node -v)${NC}"

# Vérifier MongoDB
if ! command -v mongod &> /dev/null; then
    echo -e "${YELLOW}⚠️  MongoDB ne semble pas installé${NC}"
    echo "Installez MongoDB ou utilisez MongoDB Atlas"
fi

echo ""
echo "📦 Installation des dépendances..."
echo ""

# Backend
echo "Backend..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "Dépendances backend déjà installées"
fi

# Vérifier .env
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Fichier .env manquant${NC}"
    echo "Création du fichier .env..."
    cp .env.example .env
    echo -e "${GREEN}✅ Fichier .env créé. Modifiez-le si nécessaire.${NC}"
fi

cd ..

# Frontend
echo ""
echo "Frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    npm install
else
    echo "Dépendances frontend déjà installées"
fi

cd ..

echo ""
echo -e "${GREEN}✅ Installation terminée !${NC}"
echo ""
echo "🚀 Pour démarrer l'application :"
echo ""
echo "Terminal 1 - Backend :"
echo "  cd backend && npm start"
echo ""
echo "Terminal 2 - Frontend :"
echo "  cd frontend && npm start"
echo ""
echo "📱 L'application sera accessible sur http://localhost:3000"
echo ""