/**
 * Development startup script.
 *
 * Starts the domain API server and registers an example DLD instance.
 *
 * Usage:
 *   tsx scripts/dev.ts
 */

import { ExampleSensorDLD } from '@my-domain/shared';

async function dev() {
  // Dynamically import after shared is available
  const { dldManager } = await import('../packages/domain-api/src/services/dld-manager.js');

  // Register a demo DLD instance
  const demoSensor = new ExampleSensorDLD();
  dldManager.register('demo-sensor-1', demoSensor);
  await demoSensor.refresh();

  console.log('Registered demo DLD: demo-sensor-1');
  console.log('State:', demoSensor.summary());

  // Import and start the API server
  await import('../packages/domain-api/src/index.js');
}

dev().catch((err) => {
  console.error('Dev startup failed:', err);
  process.exit(1);
});
