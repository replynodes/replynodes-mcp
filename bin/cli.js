#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const DEFAULT_URL = 'https://app.replynodes.com/api/mcp';

const apiKey = process.env.REPLYNODES_API_KEY;

if (!apiKey) {
  console.error(
    [
      '[replynodes-mcp] Missing REPLYNODES_API_KEY.',
      '',
      'Create an API key at https://app.replynodes.com (Settings -> API Keys),',
      'then set it as the REPLYNODES_API_KEY environment variable for this command.',
    ].join('\n')
  );
  process.exit(1);
}

const url = process.env.REPLYNODES_MCP_URL || DEFAULT_URL;
const proxyEntry = require.resolve('mcp-remote/dist/proxy.js');

const args = [
  proxyEntry,
  url,
  '--transport',
  'http-only',
  '--header',
  `Authorization: Bearer ${apiKey}`,
  ...process.argv.slice(2),
];

const result = spawnSync(process.execPath, args, { stdio: 'inherit' });
process.exit(result.status ?? 1);
