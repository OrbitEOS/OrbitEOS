const PLATFORM_URL = process.env.PLATFORM_URL || 'http://localhost:3000/api';
const DOMAIN_SLUG = process.env.DOMAIN_SLUG || 'my-domain';
const DOMAIN_NAME = process.env.DOMAIN_NAME || 'My Domain';
const DOMAIN_PORT = Number(process.env.DOMAIN_PORT) || 4100;
const DOMAIN_HOST = process.env.DOMAIN_PUBLIC_HOST || `http://localhost:${DOMAIN_PORT}`;

export const platformClient = {
  /** Register this domain service with the OrbitEOS platform */
  async register(): Promise<void> {
    try {
      const token = process.env.PLATFORM_API_KEY;
      const res = await fetch(`${PLATFORM_URL}/domains/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          domain_slug: DOMAIN_SLUG,
          display_name: DOMAIN_NAME,
          base_url: DOMAIN_HOST,
          health_endpoint: '/health',
        }),
      });

      if (!res.ok) {
        const body = await res.text();
        console.error(`Failed to register with platform: ${res.status} ${body}`);
        return;
      }

      console.log(`Registered domain "${DOMAIN_SLUG}" with platform at ${PLATFORM_URL}`);
    } catch (err) {
      console.error('Could not reach platform for registration:', err);
    }
  },

  /** Push DLD state to the platform */
  async pushDLDState(
    siteId: string,
    dldId: string,
    state: Record<string, unknown>,
  ): Promise<void> {
    try {
      const token = process.env.PLATFORM_API_KEY;
      await fetch(
        `${PLATFORM_URL}/sites/${siteId}/dlds/${dldId}/state`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ state }),
        },
      );
    } catch (err) {
      console.error(`Failed to push DLD state for ${dldId}:`, err);
    }
  },

  /** Create a physical device on the platform */
  async createPhysicalDevice(
    siteId: string,
    device: Record<string, unknown>,
  ): Promise<Record<string, unknown> | null> {
    try {
      const token = process.env.PLATFORM_API_KEY;
      const res = await fetch(
        `${PLATFORM_URL}/sites/${siteId}/physical-devices`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(device),
        },
      );
      if (!res.ok) return null;
      return (await res.json()) as Record<string, unknown>;
    } catch {
      return null;
    }
  },
};
