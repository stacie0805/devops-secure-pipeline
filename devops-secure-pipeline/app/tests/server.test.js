const request = require('supertest');
const app = require('../src/server');

describe('Endpoints de l\'API', () => {
  describe('GET /health', () => {
    it('retourne un statut 200 et healthy', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body.status).toBe('healthy');
      expect(res.body).toHaveProperty('uptime');
    });
  });

  describe('GET /', () => {
    it('retourne les informations de l\'application', async () => {
      const res = await request(app).get('/');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message');
      expect(res.body).toHaveProperty('version');
    });
  });

  describe('GET /api/tasks', () => {
    it('retourne la liste des taches', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.tasks)).toBe(true);
      expect(res.body.tasks.length).toBeGreaterThan(0);
    });
  });

  describe('Route inexistante', () => {
    it('retourne une erreur 404', async () => {
      const res = await request(app).get('/route-qui-nexiste-pas');
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('Headers de securite (helmet)', () => {
    it('ajoute les headers de protection', async () => {
      const res = await request(app).get('/');
      expect(res.headers).toHaveProperty('x-content-type-options');
      expect(res.headers['x-content-type-options']).toBe('nosniff');
    });
  });
});
