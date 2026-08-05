# ══════════════════════════════════════════════════════════════════════
# ÉTAPE 1 — Build : installation des dépendances
# ══════════════════════════════════════════════════════════════════════
FROM node:20-alpine AS builder

WORKDIR /build

# Copie des fichiers de dépendances en premier (optimisation du cache Docker)
COPY package*.json ./

# npm ci = installation reproductible depuis package-lock.json
RUN npm ci --only=production

# ══════════════════════════════════════════════════════════════════════
# ÉTAPE 2 — Runtime : image finale minimale
# ══════════════════════════════════════════════════════════════════════
FROM node:20-alpine AS runtime

# Bonne pratique sécurité : ne jamais exécuter en root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S appuser -u 1001 -G nodejs

WORKDIR /app

# Copie des dépendances depuis l'étape build (pas les devDependencies)
COPY --from=builder --chown=appuser:nodejs /build/node_modules ./node_modules

# Copie du code source
COPY --chown=appuser:nodejs src/ ./src/
COPY --chown=appuser:nodejs package.json ./

# Passage à l'utilisateur non-root
USER appuser

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Healthcheck : Docker sait si le conteneur est réellement fonctionnel
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "src/server.js"]
