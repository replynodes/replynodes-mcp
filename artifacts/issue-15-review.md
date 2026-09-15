# Issue #15 review artifact (replynodes/replynodes-mcp)

Prepared 2026-09-15. All URLs are public and were fetched/verified in this session.

## Goal (from issue #15)

Make ReplyNodes discoverable/installable across major IDE/MCP ecosystems beyond Gemini CLI (#10),
starting with Cursor and other IDEs that have a real current listing or verified install path.

Parent epic: #8 (MCP Distribution).

## Scope decision

Ecosystems act only where a real current listing or verified install path exists. We do not submit
to low-quality/spam directories.

## Verified live inputs

- Production MCP endpoint: https://mcp.replynodes.com/mcp
  - initialize: HTTP 200, protocol 2024-11-05, server replynodes-fetcher dev
  - tools/list: 51 tools
  - api.replynodes.com/mcp returns HTTP 405 "Forbidden: invalid Host header" — NOT the MCP endpoint.
    The canonical endpoint is mcp.replynodes.com. All distribution artifacts use mcp.replynodes.com.
- Tool families (from live tools/list, 51 total):
  appstore 9, brand 4, googleplay 11, hackernews 9, reddit 6, web 1, webcontext 4, youtube 7
- Registry namespace: com.replynodes/mcp
- Registry record (live): https://registry.modelcontextprotocol.io/v0.1/servers/com.replynodes%2Fmcp/versions/latest
- npm package: https://www.npmjs.com/package/@replynodes/mcp
- Repo: https://github.com/replynodes/replynodes-mcp
- Auth claim: https://replynodes.com/auth.md
- Docs: https://docs.replynodes.com/docs/mcp

## Ecosystem findings

### Cursor — IN SCOPE, PRIMARY (real marketplace + real install paths + real submit flow)

Current (2026-09-15), all pages fetched with a normal browser UA:

- Docs: https://cursor.com/docs/mcp
  - MCP connects Cursor to external tools/data. Install from Customize OR configure in mcp.json.
  - Three transports: stdio (local command), SSE (URL, OAuth), Streamable HTTP (URL, OAuth).
  - Tools/Functions/Prompts/Sampling/Resources/Elicitation/Apps supported.
- Install links: https://cursor.com/docs/mcp/install-links
  - Deeplink scheme: cursor://anysphere.cursor-deeplink/mcp/install?name=$NAME&config=$BASE64_ENCODED_CONFIG
  - Config uses the same shape as mcp.json (name + transport config).
  - Generate: JSON.stringify config, base64-encode, plug into URL.
- Reference/plugins: https://cursor.com/docs/reference/plugins
  - Cursor Plugin manifest: .cursor-plugin/plugin.json
  - Required fields: name (kebab-case), description. Optional: version, author, homepage, repository,
    license, keywords, logo, category, tags, mcpServers, variables, readme, screenshots.
  - MCP Servers component: discovered from mcp.json (or inline in manifest via mcpServers field).
  - Variables: declare every ${VAR} from mcp.json in manifest schema; users set secrets in Plugins UI.
  - Submitting: push to a public Git repo, then go to cursor.com/marketplace/publish and submit the repo
    link. Checklist: valid manifest, unique kebab-case name, clear description, valid components, logo
    committed + referenced by relative path, README w/ usage+config, variables declared, relative valid
    paths, tested locally.
- User-facing help: https://cursor.com/help/customization/mcp
  - One-click: Customize > MCPs > Browse > Add to Cursor (prompts for auth if required).
  - Manual: .cursor/mcp.json (project) or ~/.cursor/mcp.json (global); project wins on conflict.
  - Remote URL MCPs: url + optional headers incl. Authorization: Bearer your-token-here.
  - Env var auth supported.
- Marketplace: https://cursor.com/marketplace
  - Real public marketplace with many live MCP plugins listed (Slack, Notion, Pinecone, Canva, Shopify,
    Cloudflare, Postman, Airwallex, Auth0, etc.).
  - Quick actions: "Publish Plugins" (href /marketplace/publish) and "Create Plugin" (scaffold/validate).
  - Categories include "Data & Analytics" — appropriate for ReplyNodes.
- Marketplace security: https://cursor.com/help/security-and-privacy/marketplace-security
  - Every plugin is manually reviewed before listing. Trusted partners. Open source required. Updates
    manually reviewed.
- Security note on deeplinks: cursor:// is a local URI scheme handled by the Cursor desktop app. There is
  no HTTP endpoint that can verify a deeplink server-side. Verification for a deeplink is STRUCTURAL:
  the decoded config payload matches Cursor's documented mcp.json remote-HTTP shape and the target URL is
  the verified live endpoint.

ReplyNodes status in Cursor:
- Cursor plugin package created in this repo: .cursor-plugin/ (plugin.json, marketplace.json, README.md,
  assets/logo.svg) + deeplink + deeplink-config.
- Plugin uses canonical endpoint https://mcp.replynodes.com/mcp + Bearer REPLYNODES_API_KEY.
- Plugin declared category "Data & Analytics", tags cover capability discovery.
- Deeplink built and round-trips correctly.
- SUBMIT-READY for https://cursor.com/marketplace/publish. Actual listing requires:
  1. owner signs in at cursor.com/marketplace/publish
  2. submits the repo URL
  3. passes manual review (open source, security, data handling, quality)
  This is the ONE concrete owner-only action if the owner wants a Cursor Marketplace listing.

### Claude Code — IN SCOPE, PARTIAL (real submission path, owner-gated)

- Existing plugin: .claude-plugin/plugin.json + marketplace.json already in this repo.
- It is a valid Claude Code plugin. Currently stdio (npx -y @replynodes/mcp) with userConfig api_key.
- Claude Code also supports remote MCP in plugin.json via url + headers (Bearer).
- Community marketplace is real: anthropics/claude-plugins-community, added via
  `/plugin marketplace add anthropics/claude-plugins-community`, installed as @claude-community.
- Submission forms (real, current):
  - claude.ai: https://claude.ai/admin-settings/directory/submissions/plugins/new
  - Console: https://platform.claude.com/plugins/submit
- Gating: claude.ai form requires a Team or Enterprise organization + directory management access
  (owners have it by default). Console form is reachable but hCaptcha-gated (cf-mitigated).
- Approved plugins are pinned to a specific commit SHA in anthropics/claude-plugins-community; public
  catalog syncs nightly.

ReplyNodes status in Claude Code:
- Existing plugin updated: description/keywords/homepage made capability-oriented; homepage set to
  https://replynodes.com/mcp. Version bumped to 0.1.4 to match distribution artifact.
- REMAINING DECISION (owner): either (a) switch the plugin to remote-MCP-native (url + headers) and
  submit to the community marketplace — but submission is owner-gated; or (b) keep stdio and document
  the community marketplace submit path + owner blocker.
- For this PR: we document the Claude Code community marketplace submit flow + owner blocker, and note
  that the plugin can be switched to remote MCP when the owner decides. We do not fake a submitted listing.

### Smithery — LIVE LISTING ALREADY EXISTS

- https://smithery.ai/server/@replynodes/mcp (public page exists)
- Owned by issue #12 area. We verify it is consistent and record it. Not a new submission here.
- Note from this session's fetch: the Smithery page currently renders as a shell + nav in automated fetch
  (the server page body was JS-driven). We record the URL as the live listing handle and recommend a manual
  visual check by the owner that the Smithery card shows the canonical endpoint + read-only capability.

### Glama — OWNER/OTHER-TICKET

- glama.json exists in repo: {"maintainers":["replynodes"]}.
- Owned by issue #9. We do not submit here. We record Glama URL as a known channel and recommend the owner
  confirm the Glama listing points at the canonical endpoint: https://glama.ai/mcp/servers/com.replynodes/mcp
  (or the Glama-equivalent handle).

### Gemini CLI — OUT OF SCOPE (issue #10)

Do not touch.

### Vercel Eve — OUT OF SCOPE (issue #11)

Do not touch. (Research context only: docs/eve-contextdev-research.md, untracked, not part of #15.)

### Windsurf — INSTALL PATH ONLY (no publisher listing registry found)

- Docs: https://docs.windsurf.com/plugins/cascade/mcp
- Setup via UI or editing ~/.codeium/mcp_config.json. Supports stdio/SSE/Streamable HTTP + OAuth.
- No publisher marketplace/registry/directory submission path found for Windsurf in this session.
- Action: document a Windsurf mcp_config.json snippet (remote HTTP, canonical endpoint, Bearer var) in
  the README so Windsurf users have a verified install path. No submission.

### VS Code — INSTALL PATH ONLY (no MCP-server registry/listing found for publishers)

- VS Code MCP extension is the client. Users configure MCP servers in settings.
- No MCP-server registry or publisher listing surface confirmed for VS Code in this session.
- Action: document a VS Code MCP config snippet (remote HTTP, canonical endpoint, Bearer var) so VS Code
  users have a verified install path. No submission.

### OpenAI Codex — INSTALL PATH ONLY (no MCP-server registry)

- Manual config only. No MCP-server registry/listing for publishers found.
- Action: document a generic remote-MCP config note. No submission.

### Zed — SKIP (no current MCP support found in public docs)

- zed.dev/docs/internet-mcp and other MCP paths 404. No MCP surface found.
- Skip.

## What this PR ships (autonomous)

1. Endpoint drift fix: README.md + package.json + .claude-plugin/plugin.json all emphasize
   https://mcp.replynodes.com/mcp (the canonical production endpoint). No distribution artifact points at
   the stale api.replynodes.com host.
2. Cursor plugin package: .cursor-plugin/plugin.json + marketplace.json + README.md + assets/logo.svg,
   capability-oriented metadata based ONLY on the verified live 51-tool read-only surface, category
   "Data & Analytics", tags for capability discovery, remote HTTP MCP config with Bearer REPLYNODES_API_KEY
   declared as a variable.
3. Cursor deeplink: built and round-trip-verified (structural verification).
4. Cursor deeplink + mcp.json install snippets + submit checklist + distribution state table in README.md.
5. Claude Code plugin updated to capability-oriented metadata (existing stdio plugin; remote-MCP switch
   noted as owner decision).
6. Windsurf/VS Code/Codex install-path snippets in README.md (no submission).
7. artifacts/issue-15-review.md (this file) + artifacts/ide-ecosystem-review.md (pre-implementation research)
   for traceability.
8. PR body with exact public URLs, install/connect evidence, and clear blockers.

## Owner-only action (at most one, only if genuinely required)

If the owner wants a real Cursor Marketplace listing:
- Open https://cursor.com/marketplace/publish, sign in, submit the repository URL of this repo.
- That is the one concrete action. Everything else in #15 is autonomous.

If the owner wants a Claude Code community marketplace listing:
- The owner (or an org owner) submits via claude.ai/admin-settings/directory/submissions/plugins/new
  (requires Team/Enterprise org + directory management access) or platform.claude.com/plugins/submit
  (hCaptcha-gated). This is owner-only.

## Blockers / data gaps

- cursor.directory submission path not autonomously verifiable (Vercel bot challenge, HTTP 429). Discovery
  surface confirmed via Cursor docs; submission not confirmed.
- Cursor Marketplace listing requires manual review + (likely) trusted-partner status; submission may be
  gated behind login. We ship submit-ready artifacts + the one owner action.
- Claude Code community marketplace submission is owner-gated (Team/Enterprise org or hCaptcha).
- Windsurf/VS Code/Codex: install-path snippets only; no publisher listing surface confirmed.
- Zed: no current MCP surface; skipped.
- Smithery listing exists; we recommend the owner visually confirm the Smithery card shows the canonical
  endpoint + read-only capability (automated fetch returned a JS shell).

## Exact source URLs (for the PR + issue)

Cursor:
- https://cursor.com/docs/mcp
- https://cursor.com/docs/mcp/install-links
- https://cursor.com/docs/reference/plugins
- https://cursor.com/docs/plugins
- https://cursor.com/help/customization/mcp
- https://cursor.com/help/customization/plugins
- https://cursor.com/help/security-and-privacy/marketplace-security
- https://cursor.com/marketplace
- https://cursor.com/marketplace/publish
- https://cursor.com/marketplace/search?q=replynodes  (currently "Marketplace Plugin Not Found")
- https://cursor.directory (community directory; submission not verified)

Claude Code:
- https://code.claude.com/docs/en/plugins.md
- https://code.claude.com/docs/en/plugin-marketplaces.md
- https://code.claude.com/docs/en/discover-plugins.md
- https://claude.ai/admin-settings/directory/submissions/plugins/new
- https://platform.claude.com/plugins/submit
- https://github.com/anthropics/claude-plugins-community

Windsurf:
- https://docs.windsurf.com/plugins/cascade/mcp

VS Code:
- https://code.visualstudio.com/docs/agent-customization/mcp-servers
- https://code.visualstudio.com/docs/agent-customization/overview

Codex:
- https://developers.openai.com/codex

Zed:
- https://zed.dev/docs

ReplyNodes:
- https://mcp.replynodes.com/mcp
- https://registry.modelcontextprotocol.io/v0.1/servers/com.replynodes%2Fmcp/versions/latest
- https://smithery.ai/server/@replynodes/mcp
- https://glama.ai/mcp/servers/com.replynodes/mcp  (recommended owner check)
- https://www.npmjs.com/package/@replynodes/mcp
- https://replynodes.com/auth.md
- https://docs.replynodes.com/docs/mcp
- https://github.com/replynodes/replynodes-mcp
