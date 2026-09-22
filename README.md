# @replynodes/mcp

[![npm version](https://img.shields.io/npm/v/@replynodes/mcp.svg)](https://www.npmjs.com/package/@replynodes/mcp)
[![License: MIT](https://img.shields.io/npm/l/@replynodes/mcp.svg)](https://github.com/replynodes/replynodes-mcp/blob/master/LICENSE)

Connect to ReplyNodes' public, read-only MCP data service. The canonical remote
endpoint is:

```
https://mcp.replynodes.com/mcp
```

If your client supports remote MCP directly, use that URL and the client's
native OAuth flow instead of installing this package.

## Authentication

Interactive remote clients use native Better Auth MCP OAuth. Connect to
`https://mcp.replynodes.com/mcp`; the OAuth issuer is
`https://auth.replynodes.com` and the required scope is `mcp:read`.

Headless and manual clients use a ReplyNodes API key with the `rn_test_*` or
`rn_live_*` prefix. Organization authority is resolved from the authenticated
identity or key; clients do not send an organization id.

The stdio bridge in this package is the API-key path: it reads
`REPLYNODES_API_KEY` at startup and sends it as an Authorization header. It does
not perform browser OAuth, print the key, or persist it.

## Setup

### Claude Desktop, Claude Code, Cursor, or Windsurf — native remote MCP

Use each client's remote MCP configuration with the canonical URL:

```
https://mcp.replynodes.com/mcp
```

When prompted, complete native Better Auth MCP OAuth with issuer
`https://auth.replynodes.com` and scope `mcp:read`. Do not add an organization
id. See the [canonical MCP endpoint](https://mcp.replynodes.com/mcp) and the client's MCP
configuration help for the exact UI or config shape.

### Claude Desktop, Claude Code, Cursor, or Windsurf — stdio/API key

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

### Codex CLI, OpenClaw, or another headless/manual client

For a client with native remote MCP and interactive sign-in, use the canonical
URL and OAuth details above. For unattended or stdio use, configure an
`rn_test_*` or `rn_live_*` key through the client's secret/environment support:

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

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `REPLYNODES_API_KEY` | yes | `rn_test_*` or `rn_live_*` API key for headless/manual use. Read from the environment only. |
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

Use native Better Auth MCP OAuth with issuer `https://auth.replynodes.com` and
scope `mcp:read`. Keep credentials out of URLs and command-line arguments. For
headless/manual clients, send an `rn_test_*` or `rn_live_*` API key as a Bearer
credential instead.

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

## Cursor and other IDE ecosystems

ReplyNodes is distributed for Cursor both as a native remote MCP server and as a
Cursor plugin that bundles the same remote MCP server.

### Headless/manual remote MCP (API key)

For headless/manual Cursor use, configure a remote MCP server in `mcp.json`
using the canonical URL and an environment-backed Bearer key. Add ReplyNodes to
`.cursor/mcp.json` (project) or `~/.cursor/mcp.json` (global):

```json
{
  "mcpServers": {
    "replynodes": {
      "url": "https://mcp.replynodes.com/mcp",
      "headers": {
        "Authorization": "Bearer ${REPLYNODES_API_KEY}"
      }
    }
  }
}
```

Set `REPLYNODES_API_KEY` in your environment for headless/manual use. For an
interactive Cursor session, use native Better Auth MCP OAuth with issuer
`https://auth.replynodes.com` and scope `mcp:read`. See Cursor's MCP docs at
<https://cursor.com/docs/mcp> and the manual install help at
<https://cursor.com/help/customization/mcp>.

### Cursor plugin (one-click + deeplink + marketplace-ready)

A Cursor plugin that wraps the same remote MCP server lives in `.cursor-plugin/`
in this repository:

- plugin manifest: <https://github.com/replynodes/replynodes-mcp/blob/master/.cursor-plugin/plugin.json>
- logo: <https://github.com/replynodes/replynodes-mcp/blob/master/assets/logo.svg>

The plugin uses the canonical production endpoint `https://mcp.replynodes.com/mcp`
and authenticates with a `Bearer` `REPLYNODES_API_KEY` header, with the key
declared as a plugin variable so Cursor prompts for it in the Plugins
configuration UI.

#### Install with a Cursor deeplink

Cursor supports MCP install deeplinks of the form:

```
cursor://anysphere.cursor-deeplink/mcp/install?name=$NAME&config=$BASE64_ENCODED_CONFIG
```

The ReplyNodes deeplink (remote HTTP MCP, Bearer API key) is:

```
cursor://anysphere.cursor-deeplink/mcp/install?name=replynodes&config=eyJtY3BTZXJ2ZXJzIjp7InJlcGx5bm9kZXMiOnsiaGVhZGVycyI6eyJBdXRob3JpemF0aW9uIjoiQmVhcmVyICR7UkVQTFlOT0RFU19BUElfS0VZfSJ9LCJ1cmwiOiJodHRwczovL21jcC5yZXBseW5vZGVzLmNvbS9tY3AifX19
```

Recompute and test your own deeplink from the Cursor docs at
<https://cursor.com/docs/mcp/install-links>.

#### Submit to the Cursor Marketplace

The plugin is submit-ready. To list it on the public Cursor Marketplace:

1. Confirm the plugin is on a public Git branch of
   <https://github.com/replynodes/replynodes-mcp>.
2. Sign in at <https://cursor.com/marketplace/publish>.
3. Submit the repository URL.

Submission checklist (from <https://cursor.com/docs/reference/plugins>): valid
`.cursor-plugin/plugin.json` manifest; unique lowercase kebab-case name; clear
description; valid component files; logo committed and referenced by relative
path; README with usage and configuration; any `${VAR}` declared in the manifest
`variables` schema; relative, valid paths; tested locally. All marketplace
plugins must be open source and are manually reviewed before listing
(<https://cursor.com/help/security-and-privacy/marketplace-security>).

### Distribution state

| Channel | State | URL |
| --- | --- | --- |
| Official MCP Registry | Live listing | <https://registry.modelcontextprotocol.io/v0.1/servers/com.replynodes%2Fmcp/versions/latest> |
| Smithery | Existing listing; verify its displayed auth/setup metadata against this contract | <https://smithery.ai/servers/replynodes/mcp> |
| Cursor plugin (in this repo) | Submit-ready | <https://github.com/replynodes/replynodes-mcp/tree/master/.cursor-plugin> |
| Cursor deeplink | Verified install path | `cursor://anysphere.cursor-deeplink/mcp/install?name=replynodes&config=eyJtY3BTZXJ2ZXJzIjp7InJlcGx5bm9kZXMiOnsiaGVhZGVycyI6eyJBdXRob3JpemF0aW9uIjoiQmVhcmVyICR7UkVQTFlOT0RFU19BUElfS0VZfSJ9LCJ1cmwiOiJodHRwczovL21jcC5yZXBseW5vZGVzLmNvbS9tY3AifX19` |
| Cursor Marketplace listing | Not listed yet | submit at <https://cursor.com/marketplace/publish> (owner action) |
| Claude Code plugin (in this repo) | Existing, uses stdio bridge | <https://github.com/replynodes/replynodes-mcp/tree/master/.claude-plugin> |
| Claude Code community marketplace | Submit path is owner-gated | <https://code.claude.com/docs/en/plugins.md> |

## License

MIT
