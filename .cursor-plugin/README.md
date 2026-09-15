# ReplyNodes MCP

Web search, scraping, crawling, Reddit, YouTube, App Store, Hacker News, and brand-intelligence MCP server for Cursor. Connects to the canonical public endpoint `https://mcp.replynodes.com/mcp` and authenticates with a `Bearer` API key.

## Configuration

Add a `REPLYNODES_API_KEY` variable in Cursor's Plugins configuration (the plugin prompts for it). Claim a key at [replynodes.com/auth.md](https://replynodes.com/auth.md). The plugin is transport-only: it does not add tools or publish anything; all available read-only tools are discovered via `tools/list` at runtime.

## Endpoint

Canonical production endpoint: `https://mcp.replynodes.com/mcp`.

## Distribution

Submit to the Cursor Marketplace at [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish). The plugin is open source and manually reviewed before listing.
