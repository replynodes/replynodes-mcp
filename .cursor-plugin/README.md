# ReplyNodes MCP

Web search, scraping, crawling, Reddit, YouTube, App Store, Hacker News, and brand-intelligence MCP server for Cursor. Connects to the canonical public endpoint `https://mcp.replynodes.com/mcp`.

## Configuration

For an interactive Cursor session, add the remote MCP URL and complete Cursor's native Better Auth MCP OAuth flow. The OAuth issuer is `https://auth.replynodes.com` and the required scope is `mcp:read`.

For headless/manual use, configure a ReplyNodes `rn_test_*` or `rn_live_*` API key as a Bearer credential. The plugin is transport-only: it does not add tools or publish anything; all available read-only tools are discovered via `tools/list` at runtime.

## Endpoint

Canonical production endpoint: `https://mcp.replynodes.com/mcp`.

## Distribution

Submit to the Cursor Marketplace at [cursor.com/marketplace/publish](https://cursor.com/marketplace/publish). The plugin is open source and manually reviewed before listing.
