
# PokéHelp-Speedrun

PokéHelp-Speedrun est une application web destinée aux joueurs de Pokémon souhaitant optimiser leurs speedruns. Elle fournit des calculateurs pour les statistiques (IV, EV, dégâts, capture, bonheur, etc.) et une gestion complète des routes de speedrun, incluant la possibilité de créer, modifier, noter et consulter des routes partagées par la communauté.

---

## Fonctionnalités principales

- **Gestion des routes de speedrun**  
  - Créer, modifier, supprimer des routes
  - Consulter les routes disponibles
  - Noter les routes (1 à 5 étoiles)
  - Exécution d’un speedrun (sans nécessité de compte)

- **Calculateurs intégrés**
  - IV (valeurs individuelles)
  - EV (effort values)
  - Dégâts
  - Statistiques Pokémon
  - Rencontres
  - SOS
  - Bonheur
  - Capture
  - Ranges d’attaques

- **Authentification**
  - Connexion via **Google** ou **Discord** grâce à **BetterAuth**
  - Création de compte simplifiée

- **Monitoring & Observabilité**
  - **Prometheus** pour collecter les métriques
  - **Grafana** pour la visualisation des dashboards

- **CI/CD**
  - GitHub Actions pour lint, tests, build
  - Publication des images sur GHCR (GitHub Container Registry)
  - Déploiement automatisé sur serveur via SSH

---

## Stack Technique

- **Frontend** : Next.js + TailwindCSS + Shadcn/UI
- **Backend** : Next.js API Routes + Prisma
- **Base de données** : MySQL
- **Authentification** : BetterAuth
- **Tests** : Jest + React Testing Library
- **Conteneurisation** : Docker + Docker Compose
- **Monitoring** : Prometheus + Grafana
- **CI/CD** : GitHub Actions + GHCR
- **Langage** : TypeScript

---

## Structure du projet

```
app/
  api/
    calculators/         # Routes API pour les calculateurs
    speedrun/            # CRUD pour les routes speedrun
    metrics/             # Endpoint Prometheus
  calculators/           # Pages des calculateurs
  speedrun/              # Pages pour consulter, créer, éditer les routes
  login/                 # Page de connexion
  user/                  # Page profil utilisateur
lib/
  prisma.ts              # Client Prisma
  metrics.ts             # Config Prometheus
  auth.ts                # Config BetterAuth
prisma/
  schema.prisma          # Modèle de base de données
monitoring/
  prometheus.yml         # Config Prometheus
Dockerfile
docker-compose.yml
```

---

## Installation locale

```bash
# Cloner le projet
git clone https://github.com/votre-repo/pokehelp-speedrun.git
cd pokehelp-speedrun

# Installer les dépendances
npm install

# Générer le client Prisma
npx prisma generate

# Lancer en mode développement
npm run dev
```

---

## Exécution avec Docker

```bash
docker-compose up -d --build
```

Accès :
- Application : [http://localhost:3000](http://localhost:3000)
- Prometheus : [http://localhost:9090](http://localhost:9090)
- Grafana : [http://localhost:3001](http://localhost:3001)

---

## Déploiement via GitHub Actions (CI/CD)

1. Crée un **Personal Access Token** sur GitHub avec les scopes :  
   `write:packages`, `read:packages`, `repo`
2. Ajoute les **Secrets GitHub** :
   - `GHCR_USERNAME`
   - `GHCR_TOKEN`
   - `SSH_HOST`, `SSH_USER`, `SSH_KEY`, `REMOTE_APP_DIR`, `APP_ENV_FILE`
3. Push sur la branche **main** → Build & Push vers GHCR
4. Déploiement automatique via workflow **Deploy to VPS**

---

## Monitoring

- **Prometheus** collecte les métriques de l’application via `/api/metrics` et de Node Exporter
- **Grafana** connectée à Prometheus pour afficher les dashboards

---

## Authentification

- Connexion via **Google** et **Discord** (BetterAuth)
- Gérer les variables dans `.env` :
```env
GOOGLE_CLIENT_ID=xxxx
GOOGLE_CLIENT_SECRET=xxxx
DISCORD_CLIENT_ID=xxxx
DISCORD_CLIENT_SECRET=xxxx
```

---

## Tests

Exécuter les tests unitaires et fonctionnels :

```bash
npm run test
```
