# @replynodes/mcp

[![npm version](https://img.shields.io/npm/v/@replynodes/mcp.svg)](https://www.npmjs.com/package/@replynodes/mcp)
[![License: MIT](https://img.shields.io/npm/l/@replynodes/mcp.svg)](https://github.com/replynodes/replynodes-mcp/blob/master/LICENSE)

Connect Claude, Cursor, Codex, OpenClaw, or any other [Model Context
Protocol](https://modelcontextprotocol.io) client to your
[Replynodes](https://replynodes.com) account, so your AI agent can list your
social channels, schedule posts, generate images/video for posts, and manage
your Replynodes workspace directly from chat.

Replynodes already runs a remote MCP server
(`https://app.replynodes.com/api/mcp`). This package is a thin,
zero-maintenance bridge for MCP clients that only support local (stdio)
servers — it forwards everything to that remote server using
[`mcp-remote`](https://www.npmjs.com/package/mcp-remote), and authenticates
with your Replynodes API key.

If your client already supports **remote** MCP servers natively (e.g. Claude.ai
custom connectors, Claude Code, VS Code Copilot), you don't need this package
at all — see [Native remote MCP](#native-remote-mcp-no-install) below.

## Get an API key

1. Log in to [app.replynodes.com](https://app.replynodes.com).
2. Go to **Settings → API Keys** and create a key.
3. Keep it secret — it grants full access to your Replynodes organization.

## Setup

### Claude Code (as a plugin)

This repo is also a Claude Code plugin marketplace, so you can install it
with:

```
/plugin marketplace add replynodes/replynodes-mcp
/plugin install replynodes-mcp@replynodes-mcp
```

You'll be prompted for your Replynodes API key; Claude Code stores it and
starts the MCP server for you.

### Claude Desktop / Claude Code (manual MCP config)

Add to your MCP config (`claude_desktop_config.json` or `.mcp.json`):

```json
{
  "mcpServers": {
    "replynodes": {
      "command": "npx",
      "args": ["-y", "@replynodes/mcp"],
      "env": {
        "REPLYNODES_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

### Cursor / Windsurf

Same shape, under Cursor's `mcp.json` / Windsurf's MCP settings:

```json
{
  "mcpServers": {
    "replynodes": {
      "command": "npx",
      "args": ["-y", "@replynodes/mcp"],
      "env": { "REPLYNODES_API_KEY": "your-api-key-here" }
    }
  }
}
```

### Codex CLI / OpenClaw / other agent frameworks

Run it directly as a stdio command:

```bash
REPLYNODES_API_KEY=your-api-key-here npx -y @replynodes/mcp
```

Point your framework's MCP tool config at that command the same way you would
configure any other stdio MCP server.

### Native remote MCP (no install)

Clients that speak remote MCP directly can skip this package entirely and
connect straight to:

```
URL:     https://app.replynodes.com/api/mcp
Header:  Authorization: Bearer <your-api-key>
```

An OAuth-based connector flow is also available at
`https://app.replynodes.com/api/mcp-oauth` for clients that support MCP OAuth
discovery instead of static API keys.

## Available tools

| Tool | What it does |
| --- | --- |
| `groupList` | List your groups/customers, for filtering integrations |
| `integrationList` | List connected social integrations (channels), optionally scoped to a group |
| `integrationSchema` | Get the schema/required fields for scheduling a post to a given integration |
| `triggerTool` | Trigger an integration action once you have the ids/fields it needs |
| `schedulePostTool` | Schedule a post to one or more integrations |
| `generateImageTool` | Generate an image to attach to a post |
| `generateVideoTool` / `generateVideoOptions` / `videoFunctionTool` | Generate video content and resolve provider-specific options |
| `uploadFromUrlTool` | Upload a remote image/video into the media library from a public URL |

Tool availability depends on your Replynodes plan and connected integrations.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `REPLYNODES_API_KEY` | yes | Your Replynodes API key |
| `REPLYNODES_MCP_URL` | no | Override the remote MCP endpoint (defaults to `https://app.replynodes.com/api/mcp`) |

Any extra CLI arguments passed to `replynodes-mcp` are forwarded to
`mcp-remote` (e.g. `--debug`).

## Security

Your API key grants access to your Replynodes organization. It is only used
as a Bearer token sent directly to `app.replynodes.com` — this package does
not transmit it anywhere else. Treat it like a password; rotate it in
**Settings → API Keys** if it leaks.

## Related

Looking for the agent side of this — skills that draft, review, and prepare
content before it reaches `schedulePostTool`? See
[Awesome Social Media Skills](https://github.com/replynodes/awesome-social-media-skills),
an open-source library of portable AI agent skills for social content, with
a [quickstart](https://github.com/replynodes/awesome-social-media-skills/blob/main/docs/mcp-quickstart.md)
showing how the two fit together.

## License

MIT
