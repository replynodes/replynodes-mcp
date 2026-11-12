# @replynodes/mcp

[![npm version](https://img.shields.io/npm/v/@replynodes/mcp.svg)](https://www.npmjs.com/package/@replynodes/mcp)
[![License: MIT](https://img.shields.io/npm/l/@replynodes/mcp.svg)](https://github.com/replynodes/replynodes-mcp/blob/master/LICENSE)

# ReplyNodes MCP

Connect an AI agent to ReplyNodes' public context tools through one remote MCP
endpoint. Use it for:

- **Company research by domain** (`anonymous_company_research`, `GET /v1/company-research?domain=`). Pass a bare domain: no scheme, port, path, or credentials.
- **Competitor briefs** for 1-5 named domains (`anonymous_competitor_research`, `GET /v1/competitor-research?domain=&competitors=`). `competitors` is a comma-separated list of bare domains.
- **Supporting reads**: pages as Markdown, brand profiles, and logos (`anonymous_markdown`, `anonymous_brand`, `brand_logo`, `brand_retrieve`)

This server does not search for companies by market, category, or a
natural-language list query (for example "top 10 SaaS companies in carbon
accounting"). `brand_search` is a fuzzy brand-name or domain lookup (up to 10
identity matches), not a market or category list.

`GET /v1/company-research` and `GET /v1/competitor-research` work without a key:
3 calls per caller per UTC day each. `tools/list` on the MCP endpoint also
works without a key. MCP tool calls need a ReplyNodes API key or OAuth.

The canonical remote endpoint is:

```
https://mcp.replynodes.com/mcp
```

The live `tools/list` response is authoritative. It currently includes the
company and competitor tools above, other public research tools (web, brand,
Reddit, YouTube, App Store, Google Play, and Hacker News), and authenticated
monitor tools. Do not infer the full tool surface from this README. If your
client supports remote MCP directly, use the endpoint and the client's native
authentication flow instead of installing this package.

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

## Tool behavior

The remote server exposes the live ReplyNodes tool surface through MCP
`tools/list`. Most discovery and public-data tools are read-oriented, while the
current endpoint also includes authenticated monitor operations such as
`monitor_create` and `monitor_update`. Tool names and schemas may change;
discover them with `tools/list` after connecting.

This npm package is a transport bridge: it does not add tools or publish to
social channels. Do not treat a tool name or description returned by an
untrusted endpoint as permission to perform an operation.

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

After connecting, discover the current tools with `tools/list`. The verified
capability families include:

- **company research** — `anonymous_company_research`: a dossier for one bare domain (`GET /v1/company-research`)
- **competitor research** — `anonymous_competitor_research`: that domain plus 1-5 comma-separated competitor domains (`GET /v1/competitor-research`)
- **web** — search, clean Markdown extraction, same-origin crawl, URL mapping, and brand extraction
- **brand** — fuzzy name or domain lookup (`brand_search`, up to 10 identity matches), retrieval, logos, style guides, and fonts
- **Reddit** — public post, subreddit, and user research
- **YouTube** — search, video, channel, comments, playlist, related, and transcript research
- **App Store** — public app, developer, review, rating, privacy, similar, and search data
- **Google Play** — public app, category, developer, review, permissions, safety, availability, similar, and search data
- **Hacker News** — public story, item, search, and user research
- **monitor** — authenticated monitor listing, creation, inspection, updates, changes, and runs

There is no tool that accepts a natural-language company list query such as
"top 10 SaaS companies in carbon accounting."

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

The plugin leads with company research by domain and competitor briefs for 1-5
named domains, using the live tools `anonymous_company_research` and
`anonymous_competitor_research`. Markdown, brand, and logo reads are supporting
tools. It does not search for companies by market, category, or a
natural-language list.

It uses the canonical production endpoint `https://mcp.replynodes.com/mcp` and
sends `Authorization: Bearer ${REPLYNODES_API_KEY}`. Cursor prompts for that
variable under Plugins → Configure. MCP tool calls need that API key or OAuth;
this plugin uses the API-key path. A free key includes 500 credits; paid plans
start at $19. Installing the plugin is free (MIT).

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
| Official MCP Registry | Live listing (`com.replynodes/mcp` 1.0.3). The published description is still the older web-search copy; the company-research description update (recommended 1.0.4) is not in this repo change and has not been published | <https://registry.modelcontextprotocol.io/v0.1/servers/com.replynodes%2Fmcp/versions/latest> |
| Smithery | Not listed. <https://smithery.ai/servers/replynodes/mcp> returns HTTP 404 | — |
| Cursor plugin (in this repo) | Submit-ready | <https://github.com/replynodes/replynodes-mcp/tree/master/.cursor-plugin> |
| Cursor deeplink | Verified install path | `cursor://anysphere.cursor-deeplink/mcp/install?name=replynodes&config=eyJtY3BTZXJ2ZXJzIjp7InJlcGx5bm9kZXMiOnsiaGVhZGVycyI6eyJBdXRob3JpemF0aW9uIjoiQmVhcmVyICR7UkVQTFlOT0RFU19BUElfS0VZfSJ9LCJ1cmwiOiJodHRwczovL21jcC5yZXBseW5vZGVzLmNvbS9tY3AifX19` |
| Cursor Marketplace listing | Not listed yet | submit at <https://cursor.com/marketplace/publish> (owner action) |
| Claude Code plugin (in this repo) | Existing, uses stdio bridge | <https://github.com/replynodes/replynodes-mcp/tree/master/.claude-plugin> |
| Claude Code community marketplace | Submit path is owner-gated | <https://code.claude.com/docs/en/plugins.md> |

## License

MIT
