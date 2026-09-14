#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const DEFAULT_URL = 'https://api.replynodes.com/mcp';
const apiKey = process.env.REPLYNODES_API_KEY;

if (!apiKey) {
  console.error(
    [
      '[replynodes-mcp] Missing REPLYNODES_API_KEY.',
      '',
      'Claim access at https://replynodes.com/auth.md,',
      'then set the returned credential as REPLYNODES_API_KEY for this command.',
    ].join('\n')
  );
  process.exit(1);
}

const url = process.env.REPLYNODES_MCP_URL || DEFAULT_URL;
let parsedUrl;
try {
  parsedUrl = new URL(url);
} catch {
  console.error('[replynodes-mcp] REPLYNODES_MCP_URL must be a valid HTTPS URL.');
  process.exit(1);
}

if (parsedUrl.protocol !== 'https:') {
  console.error('[replynodes-mcp] REPLYNODES_MCP_URL must use HTTPS.');
  process.exit(1);
}

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
