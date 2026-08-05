const express = require('express');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de sécurité : ajoute les headers HTTP protecteurs
// (CSP, HSTS, X-Frame-Options, X-Content-Type-Options...)
app.use(helmet());
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────

// Endpoint de santé — utilisé par le HEALTHCHECK Docker et les load balancers
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Endpoint racine
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'DevOps Secure Pipeline API',
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Exemple d'endpoint métier
app.get('/api/tasks', (req, res) => {
  res.status(200).json({
    tasks: [
      { id: 1, title: 'Configurer le pipeline CI/CD', done: true },
      { id: 2, title: 'Intégrer le scan Trivy', done: true },
      { id: 3, title: 'Déployer sur AWS ECS', done: false },
    ],
  });
});

// Gestion des routes inexistantes
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Gestion centralisée des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Démarrage du serveur (sauf en mode test)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
  });
}

module.exports = app;
