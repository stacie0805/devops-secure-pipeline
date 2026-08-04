# DevOps Secure Pipeline

[![CI/CD Pipeline](https://github.com/Stacie0805/devops-secure-pipeline/actions/workflows/ci.yml/badge.svg)](https://github.com/Stacie0805/devops-secure-pipeline/actions/workflows/ci.yml)
![Docker](https://img.shields.io/badge/docker-multi--stage-blue)
![Security](https://img.shields.io/badge/security-Trivy%20%2B%20OWASP-green)

Pipeline CI/CD complet avec sécurité intégrée (DevSecOps) pour une application Node.js conteneurisée.

## Objectif du projet

Démontrer une chaîne de livraison logicielle automatisée et sécurisée, de bout en bout : du commit au déploiement, avec des contrôles de sécurité à chaque étape critique.

## Architecture du pipeline

```
Push / Pull Request
        │
        ├─── Job 1 : Lint & Tests unitaires (Jest, ESLint, couverture ≥70%)
        │
        ├─── Job 2 : Audit des dépendances (npm audit, seuil HIGH)
        │
        ├─── Job 3 : Build Docker + Scan Trivy
        │              ├── Build multi-stage (image minimale)
        │              ├── Scan CVE (CRITICAL/HIGH)
        │              └── Upload SARIF → GitHub Security
        │
        └─── Job 4 : Push Docker Hub (main uniquement)
                       └── Tags automatiques (latest, SHA, semver)
```

## Stack technique

| Domaine | Technologies |
|---|---|
| Application | Node.js 20, Express, Helmet |
| Conteneurisation | Docker (multi-stage), utilisateur non-root, healthcheck |
| CI/CD | GitHub Actions |
| Sécurité | Trivy (scan images), npm audit (dépendances), Helmet (headers HTTP) |
| Tests | Jest, Supertest, seuil de couverture 70% |
| Registre | Docker Hub |

## Pratiques de sécurité implémentées

- **Image Docker durcie** : build multi-stage, base Alpine, exécution en utilisateur non-root (UID 1001), pas de devDependencies en production
- **Scan de vulnérabilités automatisé** : Trivy bloque le pipeline sur toute CVE critique corrigeable
- **Audit des dépendances** : `npm audit` échoue au niveau HIGH avant même le build
- **Headers HTTP sécurisés** : Helmet applique CSP, HSTS, X-Frame-Options, X-Content-Type-Options
- **Secrets gérés** : credentials Docker Hub via GitHub Secrets, jamais en clair
- **Résultats centralisés** : les rapports SARIF remontent dans l'onglet Security de GitHub
- **Permissions minimales** : chaque job déclare uniquement les permissions dont il a besoin

## Démarrage local

```bash
# Installation
cd app && npm install

# Lancer les tests
npm test

# Lancer l'application
npm start

# Build et exécution Docker
docker build -t devops-secure-pipeline ./app
docker run -p 3000:3000 devops-secure-pipeline

# Vérification
curl http://localhost:3000/health
```

## Configuration requise pour le CI/CD

Deux secrets à définir dans **Settings → Secrets and variables → Actions** :

| Secret | Description |
|---|---|
| `DOCKERHUB_USERNAME` | Nom d'utilisateur Docker Hub |
| `DOCKERHUB_TOKEN` | Access token Docker Hub (Account Settings → Security → New Access Token) |

## Endpoints disponibles

| Méthode | Route | Description |
|---|---|---|
| GET | `/` | Informations de l'application |
| GET | `/health` | Statut de santé (utilisé par le healthcheck Docker) |
| GET | `/api/tasks` | Exemple d'endpoint métier |

## Prochaines étapes

- [ ] Déploiement automatique sur AWS ECS Fargate via Terraform
- [ ] Scan dynamique OWASP ZAP sur l'environnement déployé
- [ ] Signature des images avec Cosign
- [ ] Intégration au stack d'observabilité (Prometheus + Grafana)

## Auteur

**Estelle Bouopda Meba** — Full Stack & DevOps Engineer
[GitHub](https://github.com/Stacie0805) · [LinkedIn](https://linkedin.com/in/estelle-marcella-bouopdameba-061639150)
