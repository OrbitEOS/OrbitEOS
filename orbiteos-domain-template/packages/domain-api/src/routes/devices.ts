import type { FastifyPluginAsync } from 'fastify';
import { dldManager } from '../services/dld-manager.js';

export const deviceRoutes: FastifyPluginAsync = async (app) => {
  // List all DLD instances managed by this domain
  app.get('/', async () => {
    const devices = dldManager.listAll();
    return { devices };
  });

  // Get a specific DLD's current state
  app.get<{ Params: { dldId: string } }>('/:dldId/state', async (req, reply) => {
    const dld = dldManager.get(req.params.dldId);
    if (!dld) {
      return reply.status(404).send({ error: 'DLD not found' });
    }
    const state = await dld.refresh();
    return { dld_id: req.params.dldId, state, summary: dld.summary() };
  });

  // Execute an action on a DLD
  app.post<{ Params: { dldId: string }; Body: { action: string; params?: Record<string, unknown> } }>(
    '/:dldId/action',
    async (req, reply) => {
      const dld = dldManager.get(req.params.dldId);
      if (!dld) {
        return reply.status(404).send({ error: 'DLD not found' });
      }
      const result = await dld.executeAction(
        req.body.action,
        req.body.params || {},
      );
      return result;
    },
  );

  // Get sensor definitions for a DLD type
  app.get<{ Params: { dldId: string } }>('/:dldId/sensors', async (req, reply) => {
    const dld = dldManager.get(req.params.dldId);
    if (!dld) {
      return reply.status(404).send({ error: 'DLD not found' });
    }
    return { sensors: dld.sensors() };
  });

  // Get actuator definitions for a DLD type
  app.get<{ Params: { dldId: string } }>('/:dldId/actuators', async (req, reply) => {
    const dld = dldManager.get(req.params.dldId);
    if (!dld) {
      return reply.status(404).send({ error: 'DLD not found' });
    }
    return { actuators: dld.actuators() };
  });
};
