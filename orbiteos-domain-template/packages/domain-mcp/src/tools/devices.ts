interface MCPTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (args: Record<string, unknown>) => Promise<{ content: Array<{ type: string; text: string }>; isError?: boolean }>;
}

const DOMAIN_API_URL = process.env.DOMAIN_API_URL || 'http://localhost:4100';

async function apiCall(path: string, method = 'GET', body?: unknown) {
  const res = await fetch(`${DOMAIN_API_URL}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

function ok(data: unknown) {
  return { content: [{ type: 'text' as const, text: JSON.stringify(data, null, 2) }] };
}

function err(message: string) {
  return { content: [{ type: 'text' as const, text: message }], isError: true };
}

export const deviceTools: MCPTool[] = [
  {
    name: 'my_domain_list_devices',
    description: 'List all DLD instances managed by this domain',
    inputSchema: { type: 'object', properties: {} },
    handler: async () => {
      const data = await apiCall('/devices');
      return ok(data);
    },
  },
  {
    name: 'my_domain_get_device_state',
    description: 'Get current state of a DLD instance',
    inputSchema: {
      type: 'object',
      properties: {
        dld_id: { type: 'string', description: 'The DLD instance ID' },
      },
      required: ['dld_id'],
    },
    handler: async (args) => {
      const id = args.dld_id as string;
      if (!id) return err('dld_id is required');
      const data = await apiCall(`/devices/${id}/state`);
      return ok(data);
    },
  },
  {
    name: 'my_domain_execute_action',
    description: 'Execute an action on a DLD instance (calibrate, reset, etc.)',
    inputSchema: {
      type: 'object',
      properties: {
        dld_id: { type: 'string', description: 'The DLD instance ID' },
        action: { type: 'string', description: 'Action name' },
        params: { type: 'object', description: 'Action parameters' },
      },
      required: ['dld_id', 'action'],
    },
    handler: async (args) => {
      const id = args.dld_id as string;
      const action = args.action as string;
      if (!id || !action) return err('dld_id and action are required');
      const data = await apiCall(`/devices/${id}/action`, 'POST', {
        action,
        params: args.params || {},
      });
      return ok(data);
    },
  },
  {
    name: 'my_domain_get_sensors',
    description: 'Get sensor definitions for a DLD instance',
    inputSchema: {
      type: 'object',
      properties: {
        dld_id: { type: 'string', description: 'The DLD instance ID' },
      },
      required: ['dld_id'],
    },
    handler: async (args) => {
      const id = args.dld_id as string;
      if (!id) return err('dld_id is required');
      const data = await apiCall(`/devices/${id}/sensors`);
      return ok(data);
    },
  },
  {
    name: 'my_domain_get_actuators',
    description: 'Get actuator definitions for a DLD instance',
    inputSchema: {
      type: 'object',
      properties: {
        dld_id: { type: 'string', description: 'The DLD instance ID' },
      },
      required: ['dld_id'],
    },
    handler: async (args) => {
      const id = args.dld_id as string;
      if (!id) return err('dld_id is required');
      const data = await apiCall(`/devices/${id}/actuators`);
      return ok(data);
    },
  },
];
