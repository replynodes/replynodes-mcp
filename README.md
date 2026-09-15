# @replynodes/mcp

[![npm version](https://img.shields.io/npm/v/@replynodes/mcp.svg)](https://www.npmjs.com/package/@replynodes/mcp)
[![License: MIT](https://img.shields.io/npm/l/@replynodes/mcp.svg)](https://github.com/replynodes/replynodes-mcp/blob/master/LICENSE)

Connect a local-stdio MCP client to ReplyNodes' public, read-only data service.
The bridge forwards MCP traffic to the canonical remote endpoint:

```
https://mcp.replynodes.com/mcp
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
      "args": ["-y", "@replynodes/mcp"],
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
REPLYNODES_API_KEY="${REPLYNODES_API_KEY:?Set REPLYNODES_API_KEY}" npx -y @replynodes/mcp
```

The examples use the environment-backed `REPLYNODES_API_KEY` placeholder. Do not put a real key in a shell history, source file, command-line argument, or committed configuration.

## Read-only behavior

The remote server exposes public ReplyNodes data through MCP `tools/list` and
read-only tool calls. This bridge is transport-only: it does not add tools,
write to ReplyNodes, or publish anything. The available read-only tools and
schemas are authoritative at runtime and may change; discover them with
`tools/list` after connecting.

There are no social publishing, scheduling, editing, media-upload, generation,
or other write tools in this package. Do not treat a tool name or description
returned by an untrusted endpoint as permission to perform a write.

## Canonical MCP endpoint

The supported public MCP endpoint is:

```
https://mcp.replynodes.com/mcp
```

That URL is the canonical production MCP endpoint. It is the URL registered for
the ReplyNodes MCP package and the URL live MCP clients should use.

### Relationship between `mcp.replynodes.com/mcp` and `api.replynodes.com/mcp`

Both hostnames sit in front of the same ReplyNodes MCP backend. The canonical,
primary MCP endpoint is `https://mcp.replynodes.com/mcp`. The host
`https://api.replynodes.com/mcp` routes to the same service only when the
request carries the `mcp.replynodes.com` virtual-host identity; a direct
`api.replynodes.com` MCP request is rejected with an invalid-Host error. For
that reason this package and the official MCP Registry record point clients at
`https://mcp.replynodes.com/mcp`, and `api.replynodes.com/mcp` is not
advertised as a standalone MCP endpoint here.

If a deployment or test environment expects the shared `api.replynodes.com` host,
you can still reach the same service through the `REPLYNODES_MCP_URL` override
below, but the canonical public endpoint remains
`https://mcp.replynodes.com/mcp`.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `REPLYNODES_API_KEY` | yes | Credential from the ReplyNodes auth claim flow. Read from the environment only. |
| `REPLYNODES_MCP_URL` | no | Trusted HTTPS endpoint override. Defaults to `https://mcp.replynodes.com/mcp`. |

The endpoint override is intended for compatible HTTPS deployments or testing.
It is rejected when it is not a valid HTTPS URL. Never include credentials in
an override URL. The default endpoint is the supported public read-only service.

Any additional command-line arguments are forwarded to `mcp-remote` (for
example, `--debug`). Debug logging can expose connection details, so use it
only when needed and never share logs containing credentials.

## Native remote MCP (no install)

A client with native remote MCP support can connect directly to:

```
URL: https://mcp.replynodes.com/mcp
```

Use the client's supported authentication flow and keep credentials out of
URLs and command-line arguments.

## Live tool surface

After connecting, discover the current read-only tools with a `tools/list` call.
As of the last verification, the live endpoint exposes read-only tools across
these capability families:

- **web_search** — public web search results
- **webcontext** — scrape, crawl, map, and brand extraction for one URL
- **brand** — brand search, retrieve, styleguide, and fonts by domain
- **reddit** — post lookup by id/permalink, site-wide search, subreddit listings, user activity
- **youtube** — video, channel, playlist, comments, transcript, search, related videos
- **appstore** — App Store search, list, app/developer details, ratings, reviews, similar, suggest, privacy
- **googleplay** — Google Play search, category browsing, app/developer details, reviews, permissions, data-safety, availability, similar, suggest
- **hackernews** — item lookup, search, and top/ask/show/new/job/best story listings and user profiles

The exact tool set and schemas are authoritative at runtime. Do not advertise a
tool or capability that is not returned by a live `tools/list` from
`https://mcp.replynodes.com/mcp`.

## License

MIT
