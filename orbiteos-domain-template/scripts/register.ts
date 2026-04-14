/**
 * Register this domain with the OrbitEOS platform.
 *
 * Usage:
 *   PLATFORM_URL=http://localhost:3000/api DOMAIN_PORT=4100 tsx scripts/register.ts
 */

const PLATFORM_URL = process.env.PLATFORM_URL || 'http://localhost:3000/api';
const DOMAIN_SLUG = process.env.DOMAIN_SLUG || 'my-domain';
const DOMAIN_NAME = process.env.DOMAIN_NAME || 'My Domain';
const DOMAIN_PORT = Number(process.env.DOMAIN_PORT) || 4100;
const DOMAIN_HOST = process.env.DOMAIN_PUBLIC_HOST || `http://localhost:${DOMAIN_PORT}`;

async function register() {
  console.log(`Registering domain "${DOMAIN_SLUG}" with platform at ${PLATFORM_URL}...`);

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
    console.error(`Registration failed: ${res.status} ${body}`);
    process.exit(1);
  }

  const data = await res.json();
  console.log('Registration successful:', data);
}

register().catch((err) => {
  console.error('Failed to register:', err.message);
  process.exit(1);
});
