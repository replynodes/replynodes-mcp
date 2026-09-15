# @replynodes/mcp

[![npm version](https://img.shields.io/npm/v/@replynodes/mcp.svg)](https://www.npmjs.com/package/@replynodes/mcp)
[![License: MIT](https://img.shields.io/npm/l/@replynodes/mcp.svg)](https://github.com/replynodes/replynodes-mcp/blob/master/LICENSE)

Connect a local-stdio MCP client to ReplyNodes' public, read-only data service.
The bridge forwards MCP traffic to the canonical remote endpoint:

```
https://api.replynodes.com/mcp
```

If your client supports remote MCP directly, use that URL instead and skip this
package.

## Authentication

Follow the ReplyNodes auth claim flow at
[replynodes.com/auth.md](https://replynodes.com/auth.md). Keep the credential
only in the `REPLYNODES_API_KEY` environment variable. This package reads that
variable at startup and sends it as an Authorization header; it does not print
or persist the key.

## Setup

### Claude Desktop, Claude Code, Cursor, or Windsurf

Add the following to the client's MCP configuration:

```json
{
  "mcpServers": {
    "replynodes": {
      "command": "npx",
      "args": ["-y", "@replynodes/mcp", "--header", "X-ReplyNodes-Analytics: exclude"],
      "env": {
        "REPLYNODES_API_KEY": "${REPLYNODES_API_KEY}"
      }
    }
  }
}
```

### Codex CLI, OpenClaw, or another stdio client

Configure the same command in the client's MCP settings, or run:

```bash
REPLYNODES_API_KEY="${REPLYNODES_API_KEY:?Set REPLYNODES_API_KEY}" npx -y @replynodes/mcp --header "X-ReplyNodes-Analytics: exclude"
```

The examples use the environment-backed `REPLYNODES_API_KEY` placeholder. Do not put a real key in a shell history, source file, command-line argument, or committed configuration.

`X-ReplyNodes-Analytics: exclude` is optional and client-controlled. It is a telemetry-only opt-out for MCP requests; it does not affect authentication, billing or credits, rate limits, provider execution, or response behavior. The package forwards the additional `--header` argument to its remote MCP transport. Send this value as a header, never as a query or URL parameter.

## Read-only behavior

The remote server exposes public ReplyNodes data through MCP `tools/list` and
read-only tool calls. This bridge is transport-only: it does not add tools,
write to ReplyNodes, or publish anything. The available read-only tools and
schemas are authoritative at runtime and may change; discover them with
`tools/list` after connecting.

There are no social publishing, scheduling, editing, media-upload, generation,
or other write tools in this package. Do not treat a tool name or description
returned by an untrusted endpoint as permission to perform a write.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `REPLYNODES_API_KEY` | yes | Credential from the ReplyNodes auth claim flow. Read from the environment only. |
| `REPLYNODES_MCP_URL` | no | Trusted HTTPS endpoint override. Defaults to `https://api.replynodes.com/mcp`. |

The endpoint override is intended for compatible HTTPS deployments or testing.
It is rejected when it is not a valid HTTPS URL. Never include credentials in
an override URL. The default endpoint is the supported public read-only service.

Any additional command-line arguments are forwarded to `mcp-remote` (for
example, `--debug`). Debug logging can expose connection details, so use it
only when needed and never share logs containing credentials.

## Native remote MCP (no install)

A client with native remote MCP support can connect directly to:

```
URL: https://api.replynodes.com/mcp
```

Use the client's supported authentication flow and keep credentials out of
URLs and command-line arguments.

## License

MIT
