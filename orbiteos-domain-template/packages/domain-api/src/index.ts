import Fastify from 'fastify';
import { deviceRoutes } from './routes/devices.js';
import { platformClient } from './services/platform-client.js';

const PORT = Number(process.env.DOMAIN_PORT) || 4100;
const HOST = process.env.DOMAIN_HOST || '0.0.0.0';

const app = Fastify({ logger: true });

// Health endpoint — called by OrbitEOS platform
app.get('/health', async () => ({
  status: 'ok',
  domain: 'my-domain',
  timestamp: new Date().toISOString(),
}));

// Device routes
app.register(deviceRoutes, { prefix: '/devices' });

async function start() {
  try {
    await app.listen({ port: PORT, host: HOST });
    console.log(`Domain API running on http://${HOST}:${PORT}`);

    // Register with platform on startup (optional, can also use scripts/register.ts)
    if (process.env.PLATFORM_URL) {
      await platformClient.register();
    }
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();
