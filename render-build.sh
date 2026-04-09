#!/bin/bash
# Script de build simplifié pour Render
echo "Starting build process..."

# Installer les dépendances
npm install

# Créer le dossier dist s'il n'existe pas
mkdir -p dist

# Compiler avec TypeScript directement
npx tsc

# Vérifier si le build a réussi
if [ -f "dist/main.js" ]; then
    echo "Build successful!"
    exit 0
else
    echo "Build failed!"
    exit 1
fi
