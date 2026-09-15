# IDE/MCP ecosystem review for issue #15 (done 2026-09-15, before implementation)

Research approach: fetched each platform's current public docs page(s) and marketplace page(s)
with a normal browser UA. No API keys, no login. Text extracted from the served HTML.

## 1. Cursor — strong, current, public discovery + install surfaces (IN SCOPE, PRIMARY)

- Docs: https://cursor.com/docs/mcp (Model Context Protocol) — real, current page, server-rendered text.
  - MCP connects Cursor to external tools/data. Install from Customize page OR configure in mcp.json.
  - Three transports: stdio (local, command), SSE (local/remote, URL, OAuth), Streamable HTTP
    (local/remote, URL, OAuth). Tools/Functions/Prompts/Sampling/Resources/Elicitation/Apps supported.
- Install-links: https://cursor.com/docs/mcp/install-links
  - "MCP servers can be installed with Cursor deeplinks. Uses same format as mcp.json with a name
    and transport configuration."
  - Scheme: cursor://anysphere.cursor-deeplink/mcp/install?name=$NAME&config=$BASE64_ENCODED_CONFIG
  - Helper: JSON.stringify config, base64-encode, plug into the URL. Docs give a postgres npx example.
- Reference/plugins: https://cursor.com/docs/reference/plugins
  - Cursor Plugin manifest: .cursor-plugin/plugin.json. Fields: name (kebab-case), description, version,
    creators/company, repository, icon, categories, tags, readme, license, markdown, settings, screenshots.
  - Components: skills, tools (MCP tools), agents, MCP server, editor, etc. MCP Server component wraps a
    remote MCP server entry for distribution inside a plugin.
  - Submitting to Marketplace: "Push changes to a public Git repository" then go to
    cursor.com/marketplace/publish, submit the repository URL. Requires open source (each marketplace
    plugin must be open source). Company/creators must be included.
- User-facing help: https://cursor.com/help/customization/mcp
  - One-click: Customize > MCPs > Browse > Add to Cursor (prompts for auth if required).
  - Manual: create .cursor/mcp.json (project) or ~/.cursor/mcp.json (global); project wins on conflict.
  - Remote URL MCPs: use `url`, optional `headers` incl. `Authorization: Bearer your-token-here`.
  - Env var auth supported in config. OAuth for servers that require it.
- Marketplace: https://cursor.com/marketplace — real, current, navigable, has many live MCP plugins listed
  (Slack, Notion, Pinecone, Canva, Shopify, Cloudflare, etc.). Has "Publish Plugins" + "Create Plugin"
  quick actions. Section headers: Infrastructure, Data & Analytics, Productivity, Payments, Agent
  Orchestration, etc. — an MCP/server can be categorized.
- Publish form: https://cursor.com/marketplace/publish — page titled "Publish a Cursor Marketplace Plugin".
  (Note: this page is clearly behind auth / a flow; the served HTML is a shell + nav. We did not log in,
  so the exact form steps are not readable here. This is the submit surface referenced by the docs.)

So for Cursor we have: (a) a real public marketplace with live MCP listings, (b) a documented submit flow
(form at /marketplace/publish + Git repo), (c) a documented one-click install surface (Customize > MCPs),
(d) a documented manual install surface (mcp.json), (e) a documented deeplink install surface
(cursor://.../mcp/install). All current as of 2026-09-15.

The right Cursor distribution artifact is a Cursor Plugin (manifest + MCP Server component) so it's
installable both via the marketplace and as a deeplink, and shareable via mcp.json.

## 2. Claude Code / Claude.ai community plugin marketplace — real submit path, but gated (IN SCOPE, PARTIAL)

- Existing artifact: .claude-plugin/plugin.json + marketplace.json already in this repo. It is a valid
  Claude Code stdio plugin (npx -y @replynodes/mcp). It works but points at the stdio bridge and the
  repo still defaults to the wrong host in README (api.replynodes.com).
- Community marketplace submission (per docs): there is a community plugin marketplace; a repo can be added.
  The exact submission surface is owner-gated (Claude Team/Enterprise org + directory permissions) in the
  most credible current docs. We treat that as: prepare the plugin correctly (autonomous), and note the
  owner-only submit action if the owner wants the community marketplace listing specifically.

So Claude Code: we improve the existing plugin to emphasize the canonical endpoint and remote-MCP install
path (in README + plugin metadata), and we document the community marketplace submit flow + owner blocker.
We do NOT fake a submitted listing.

## 3. Gemini CLI extension — OUT OF SCOPE for this ticket

Issue #10 owns Gemini CLI extension. Do not touch.

## 4. Vercel Eve — OUT OF SCOPE for this ticket

Issue #11 owns Eve. Do not touch. (We already have eve-contextdev-research.md as context only.)

## 5. Smithery — handled by its own ticket (#12 area); not this ticket

Smithery currently lists @replynodes/mcp (live listing exists: https://smithery.ai/server/@replynodes/mcp).
That's already a live listing, not a "must submit" gap. We verify the existing listing is consistent with
the canonical endpoint and the 51-tool read-only surface, and record it. Not a new submission here.

## 6. Glama — OUT OF SCOPE

Glama is handled by #9. Do not submit here. (We note the current Glama state if reachable.)

## 7. Other IDEs — only include where a real current listing/registry path exists

Cursor is the headline. We also add a verified install path for any client that supports remote MCP +
mcp.json-style config, since that is a real "install path" even if not a marketplace listing. That covers
Claude Desktop, Codex (where MCP config is supported), Windsurf (where mcp-style config exists), etc.
We do NOT claim marketplace listings where none exist and we do NOT submit to low-quality directories.

## Conclusion: what we will actually ship for #15

Primary deliverable: a Cursor Plugin package (plugin.json + icon + README + categories + MCP Server
component) plus a generated Cursor install deeplink, committed to this repo, configured entirely with the
canonical production endpoint https://mcp.replynodes.com/mcp and Bearer REPLYNODES_API_KEY auth.
Install/connect evidence: deeplink constructs correctly; mcp.json remote config shape matches Cursor's
documented shape; remote endpoint initialize + tools/list both verified live (51 tools).

Secondary deliverable: updates to README.md so the canonical endpoint is the emphasized one everywhere
(remote MCP, native remote, env var default), and the existing .claude-plugin plugin is described as
Claude Code compatible with the correct endpoint + community marketplace submit flow + owner blocker noted.

Tertiary deliverable: a short section in README (and/or a docs file) listing verified install paths by
client, with exact URLs and states: Official MCP Registry (live), Smithery (live), Cursor (plugin + deeplink,
submit-ready), Claude Code (existing plugin + community marketplace owner-gated), and generic remote-MCP
clients (install path, no listing).

Owner-only action (at most one): if the owner wants a real Cursor Marketplace listing, they open
https://cursor.com/marketplace/publish, sign in, and submit the repository URL of this repo. That's the
one concrete action. Everything else in #15 is autonomous.
