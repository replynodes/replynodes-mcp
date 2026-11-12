# ReplyNodes MCP for Cursor

Research a company by domain, and compare it with 1-5 named competitor domains, through the ReplyNodes MCP server. Markdown, brand, and logo tools are included as supporting reads. The plugin is transport-only: it does not add its own tools or publish anything. Live tools come from `tools/list` on the canonical endpoint.

Canonical endpoint: `https://mcp.replynodes.com/mcp`

This plugin does **not** search for companies by market, category, or a natural-language list query (for example "top 10 SaaS companies in carbon accounting"). Give it a domain, or a domain plus named competitor domains.

## What to call

Use the live tool names from `tools/list`. As of 12 Nov 2026 those names are:

- `anonymous_company_research` — company dossier for one bare domain (no scheme, port, path, or credentials). Same work as `GET /v1/company-research?domain=`.
- `anonymous_competitor_research` — competitor brief. Same work as `GET /v1/competitor-research?domain=&competitors=` (`competitors` is a comma-separated list of 1-5 bare domains).
- Supporting reads: `anonymous_markdown`, `anonymous_brand`, `brand_logo`, `brand_retrieve`.

The REST URLs above can be called without a key (3 company-research and 3 competitor-research calls per caller per UTC day). `tools/list` on the canonical endpoint also works without a key. **MCP tool calls from Cursor are not keyless.** They need a ReplyNodes API key (`rn_test_*` or `rn_live_*`) or OAuth. This plugin uses the API-key path.

## Configuration

1. Install the plugin from the Cursor Marketplace, or load it locally for testing.
2. Open **Plugins → Configure** and set `REPLYNODES_API_KEY`. Do not commit a key.
3. Get a free key (500 credits) at [replynodes.com/auth.md](https://replynodes.com/auth.md). Paid plans start at $19: [replynodes.com/pricing](https://replynodes.com/pricing).

Example prompt after install: "Use ReplyNodes to research watershed.com, then run a competitor brief against persefoni.com and greenly.earth."

## Legal

The plugin is free and open source under MIT. ReplyNodes terms and privacy: [Terms](https://replynodes.com/terms/) and [Privacy](https://replynodes.com/privacy/). Verified live (HTTP 200) on 12 Nov 2026.

## Support

https://replynodes.com and https://docs.replynodes.com
