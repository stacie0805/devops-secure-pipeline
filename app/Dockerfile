# ══════════════════════════════════════════════════════════════════════
# ETAPE 1 — Build : installation des dependances
# Node 24 = Active LTS (support jusqu'en avril 2028)
# Node 20 est EOL depuis avril 2026 : ne plus l'utiliser
# ══════════════════════════════════════════════════════════════════════
FROM node:24-alpine AS builder

WORKDIR /build

# Copie des fichiers de dependances en premier (optimisation du cache Docker)
COPY package*.json ./

# npm ci = installation reproductible depuis package-lock.json
# --omit=dev remplace --only=production (deprecie depuis npm 9)
RUN npm ci --omit=dev

# ══════════════════════════════════════════════════════════════════════
# ETAPE 2 — Runtime : image finale minimale
# ══════════════════════════════════════════════════════════════════════
FROM node:24-alpine AS runtime

# Mise a jour des paquets systeme Alpine (corrige les CVE de l'OS de base)
RUN apk upgrade --no-cache

# DURCISSEMENT : suppression de npm, npx et corepack de l'image runtime.
# Le conteneur de production execute uniquement "node src/server.js" et n'a
# aucun besoin d'un gestionnaire de paquets. Cela elimine les CVE des
# dependances transitives de npm (ex: node-gyp -> tar) et reduit la
# surface d'attaque : un attaquant ne peut plus installer de paquets.
RUN rm -rf /usr/local/lib/node_modules/npm \
           /usr/local/lib/node_modules/corepack \
           /usr/local/bin/npm \
           /usr/local/bin/npx \
           /usr/local/bin/corepack \
           /opt/yarn* \
           /usr/local/bin/yarn* \
    && rm -rf /root/.npm /tmp/*

# Bonne pratique securite : ne jamais executer en root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S appuser -u 1001 -G nodejs

WORKDIR /app

# Copie des dependances depuis l'etape build (pas les devDependencies)
COPY --from=builder --chown=appuser:nodejs /build/node_modules ./node_modules

# Copie du code source
COPY --chown=appuser:nodejs src/ ./src/
COPY --chown=appuser:nodejs package.json ./

USER appuser

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

CMD ["node", "src/server.js"]
