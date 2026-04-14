import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { deviceTools } from './tools/devices.js';

const server = new Server(
  { name: 'my-domain-mcp', version: '1.0.0' },
  { capabilities: { tools: {} } },
);

// Register domain-specific MCP tools
const allTools = [...deviceTools];

server.setRequestHandler(
  { method: 'tools/list' } as any,
  async () => ({
    tools: allTools.map((t) => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema,
    })),
  }),
);

server.setRequestHandler(
  { method: 'tools/call' } as any,
  async (request: any) => {
    const { name, arguments: args } = request.params;
    const tool = allTools.find((t) => t.name === name);
    if (!tool) {
      return {
        content: [{ type: 'text', text: `Unknown tool: ${name}` }],
        isError: true,
      };
    }
    return tool.handler(args || {});
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('My Domain MCP server running on stdio');
}

main().catch(console.error);
