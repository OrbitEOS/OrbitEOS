import { ExampleSensorDLD } from '@my-domain/shared';

interface DriverConfig {
  host: string;
  port?: number;
  poll_interval_s?: number;
}

/**
 * Example device driver.
 *
 * In production this would:
 * 1. Connect to physical hardware via the specified protocol
 * 2. Create a DLD instance and register it with the DLD manager
 * 3. Poll the device at the configured interval
 * 4. Push state updates to the platform
 *
 * This example creates a simulated sensor for demonstration.
 */
export function createDriver(config: DriverConfig) {
  const dld = new ExampleSensorDLD();
  const intervalMs = (config.poll_interval_s || 30) * 1000;
  let timer: ReturnType<typeof setInterval> | null = null;

  return {
    dld,

    start() {
      console.log(`Starting example driver for ${config.host}:${config.port || 80}`);
      timer = setInterval(async () => {
        try {
          const state = await dld.refresh();
          console.log(`[${config.host}] State:`, dld.summary());
          // In production: push state to platform via platformClient.pushDLDState()
        } catch (err) {
          console.error(`[${config.host}] Poll error:`, err);
        }
      }, intervalMs);

      // Initial poll
      dld.refresh().catch(console.error);
    },

    stop() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
      console.log(`Stopped example driver for ${config.host}`);
    },
  };
}

// Standalone usage
if (process.argv[1]?.endsWith('index.ts') || process.argv[1]?.endsWith('index.js')) {
  const host = process.env.DEVICE_HOST || '192.168.1.100';
  const port = Number(process.env.DEVICE_PORT) || 80;
  const driver = createDriver({ host, port, poll_interval_s: 5 });
  driver.start();

  process.on('SIGINT', () => {
    driver.stop();
    process.exit(0);
  });
}
