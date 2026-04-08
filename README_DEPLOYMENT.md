# Guide de Déploiement Gratuit

## Structure du Projet

```
academie-handball/
|
|-- backend/                 # API NestJS
|   |-- src/
|   |-- package.json
|   |-- render.yaml         # Configuration Render
|   -- academie.db         # Base SQLite
|
|-- frontend/               # React App
|   |-- src/
|   |-- package.json
|   |-- .env.production     # URL API production
|   -- public/
|
-- README_DEPLOYMENT.md    # Ce guide
```

## Étapes de Déploiement

### 1. Préparer Git
```bash
git add .
git commit -m "Préparation déploiement"
git push origin main
```

### 2. Déployer Backend sur Render
1. Allez sur https://render.com
2. Créez un compte gratuit
3. Connectez votre repository GitHub
4. Cliquez sur "New +"
5. Choisissez "Web Service"
6. Configurez:
   - Name: `academie-backend`
   - Branch: `main`
   - Root Directory: `backend`
   - Runtime: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`

### 3. Déployer Frontend sur Vercel
1. Allez sur https://vercel.com
2. Créez un compte gratuit
3. Importez votre repository GitHub
4. Configurez:
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `build`

### 4. Configuration Variables
Dans les settings de chaque service:
- Ajoutez les variables d'environnement
- Configurez les domaines

## URLs Finales
- Backend: `https://academie-backend.onrender.com`
- Frontend: `https://academie-frontend.vercel.app`

## Test de Déploiement
1. Visitez votre frontend
2. Testez la connexion API
3. Vérifiez toutes les fonctionnalités

## Maintenance
- Les déploiements sont automatiques
- Les backups sont gérés par Render
- Monitoring via les dashboards
