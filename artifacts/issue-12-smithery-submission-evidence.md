# Issue #12 — Smithery Submission Evidence (2026-09-16)

## Objective
Submit ReplyNodes MCP to Smithery using the canonical remote Streamable HTTP
endpoint `https://mcp.replynodes.com/mcp`, the existing public repo
`https://github.com/replynodes/replynodes-mcp`, and only verified live
read-only capabilities. Under parent epic #8 / [MCP-DIST-003].

## Current Smithery flow (researched 2026-09-16)

Smithery's publish surface in September 2026 is auth-gated. No unauthenticated
submission path exists.

### Verified endpoints

| Endpoint | Method | Auth required | Result (no token) |
|---|---|---|---|
| `https://api.smithery.ai/namespaces` | PUT | Yes | 401 Missing authentication token |
| `https://api.smithery.ai/namespaces/com.replynodes` | PUT | Yes | 401 Missing authentication token |
| `https://api.smithery.ai/servers/com.replynodes%2Fmcp` | PUT | Yes | 401 Missing authentication token |
| `https://api.smithery.ai/servers/com.replynodes%2Fmcp/releases` | PUT | Yes | 401 Missing authentication token |
| `https://api.smithery.ai/tokens` | POST | Yes | 401 Missing authentication token |

### CLI

- `smithery` CLI v4.11.1 installed and tested.
- `smithery auth status` → unauthenticated, no stored session.
- `smithery mcp publish "https://mcp.replynodes.com/mcp" -n com.replynodes/mcp` → requires `smithery auth login`.
- `smithery auth login` runs an interactive OAuth flow that is not automatable headless.

### Web

- `https://smithery.ai` → 200, SPA shell.
- `https://smithery.ai/new` → 404 as of this run (the documented publish entrypoint is not served at that path right now).
- `https://smithery.ai/server/com.replynodes/mcp` → 404 "Server Not Found".
- `https://smithery.ai/server/@replynodes/mcp` → 200 but only a 188-byte Next.js catch-all 404 page ("# mcp / Quick Start / npx -y smithery mcp add replynodes/mcp"), not a real server listing. The "replynodes/mcp" in those quick-start instructions is a generic npm add pattern, not a live Smithery listing.

### Namespace/server existence

- Namespace `com.replynodes` does NOT exist on Smithery (GET and PUT without auth both fail; PUT without auth returns 401, so existence cannot be created autonomously).
- Server `com.replynodes/mcp` does NOT exist on Smithery (GET returns 404 "Server not found").

## MCP endpoint verification (canonical)

- `https://mcp.replynodes.com/mcp` → HTTPS 200, nginx/1.24.0 (Ubuntu).
- MCP `initialize` → 200, result `{"protocolVersion":"2024-11-05","serverInfo":{"name":"replynodes-fetcher","version":"dev"},"capabilities":{"tools":{}}}`.
- MCP `tools/list` → 200, listable read-only tools across:
  - web_search
  - webcontext / web scraping / crawling / site mapping / brand extraction
  - brand (brand search, retrieve, styleguide, fonts by domain)
  - reddit (post lookup, search, subreddits, user activity)
  - youtube (video, channel, playlist, comments, transcript, search, related)
  - appstore (App Store search/list/details/ratings/reviews/similar/suggest/privacy)
  - googleplay (Google Play search/categories/details/reviews/permissions/data-safety/availability/similar/suggest)
  - hackernews (item lookup, search, top/ask/show/new/job/best listings, user profiles)
- No auth header required for `initialize`/`tools/list`. This endpoint is
  scan-friendly from Smithery's side — the blocker is Smithery's auth wall,
  not the MCP server.

## Capability discovery surface (non-brand searches on Smithery)

Ran non-brand searches to confirm these are viable discovery queries with
competitors already indexed:

| Query | Sample indexed competitors |
|---|---|
| reddit | kagelogic/youtube, node2flow/youtube, hasdata/youtube-mcp |
| youtube | kagelogic/youtube, node2flow/youtube, hasdata/youtube-mcp |
| hackernews | vercel/grep, imprvhub/mcp-claude-hackernews, cyanheads/hn-mcp-server |
| web search | multiple indexed MCP/tool servers |
| web scraping | multiple indexed MCP/tool servers |
| brand intelligence | multiple indexed MCP/tool servers |
| app store | multiple indexed MCP/tool servers |
| context api for ai agents | supermemory, robin-lidberg/cap-shield |
| data api for ai agents | datafor-b2b/dataforb2b, a2a/structured-output-agent |

Conclusion: ReplyNodes is competitive on all of these axes and would benefit
from Smithery discovery once the auth blocker is removed.

## Repo changes made (this PR)

### smithery.yaml

Updated to the current Smithery manual deploy manifest shape so the repo is
submit-ready the moment a Smithery auth token is available. Changes:
- Added `deploy:` block:
  ```yaml
  deploy:
    type: remote
    url: https://mcp.replynodes.com/mcp
  ```

The existing `startCommand` (stdio bridge via `npx -y @replynodes/mcp`) is
retained. The new `deploy` block tells Smithery this is a remote/streamable HTTP
server at the canonical production endpoint rather than a locally-run stdio
process.

Rationale:
- Smithery's current docs describe server manifests with `deploy.type` ("remote"
  / "hosted") and `startCommand.type` ("stdio"). The old manifest only had
  `startCommand`, which describes the stdio bridge package, not the remote
  endpoint Smithery should connect to for a remote listing.
- We are NOT switching the primary distribution to the remote-only path — the
  stdio bridge stays as the documented install path for Claude Desktop / Codex /
  Cursor / Windsurf. The `deploy` block is added purely to make a future
  Smithery remote submission correct.

### README.md

Corrected the distribution table:
- Old: `| Smithery | Live listing | <https://smithery.ai/server/@replynodes/mcp> |`
- New: `| Smithery | Not listed (blocked) | Submission blocked by Smithery auth; see issue #12 |`

The old claim was false: `https://smithery.ai/server/@replynodes/mcp` is NOT a
live Smithery listing. This file makes the README accurate and prevents future
confusion.

NOT changed in this PR:
- Glama row (issue #9, separate ticket).
- MCP Registry row (verified LIVE — left as-is).
- Cursor / Claude Code rows (unchanged; those belong to #15 / separate work).

## What could NOT be done autonomously (blocker)

Smithery's entire publish surface — API, CLI, and (currently) web UI — requires
an authenticated Smithery account/session. The actions below are owner-gated and
cannot be performed headless from this agent environment:

1. Create a Smithery account / sign in (OAuth or email; may include CAPTCHA).
2. Create a Smithery API key (teams settings → API keys), or authenticate the
   `smithery` CLI via `smithery auth login`.
3. Create the namespace `com.replynodes` on Smithery (PUT
   `https://api.smithery.ai/namespaces/com.replynodes` with Bearer token), or
   create it via the CLI/web.
4. Publish the server `com.replynodes/mcp`:
   - API: PUT `https://api.smithery.ai/servers/com.replynodes%2Fmcp` then
     PUT `https://api.smithery.ai/servers/com.replynodes%2Fmcp/releases` with
     the `deploy` payload `{"type":"remote","remoteUrl":"https://mcp.replynodes.com/mcp"}`.
   - CLI: `smithery mcp publish "https://mcp.replynodes.com/mcp" -n com.replynodes/mcp`.
   - Web: `https://smithery.ai/new` (when available) → enter
     `https://mcp.replynodes.com/mcp` → scan → confirm metadata → publish.
5. Verify ownership / claim where Smithery supports it (endpoint ownership
   confirmation, DNS, or account-level claim).
6. Add title/description/categories/tags/docs/install instructions in the Smithery
   listing UI or via the API once the server exists.
7. Verify the live listing and run non-brand capability searches from a
   authenticated/session context to confirm discovery.

This PR makes the repo submit-ready for steps 4–7; it does not perform them,
because they all require owner Smithery credentials.

## Exact owner action requested

One concrete action:

> Sign in to Smithery (https://smithery.ai), then either:
> - run `smithery auth login` + `smithery mcp publish https://mcp.replynodes.com/mcp -n com.replynodes/mcp`
>   from a machine with the updated repo checkout, or
> - use the Smithery web publish flow at https://smithery.ai/new (or whatever the current "Add a server" entry point is),
>   entering `https://mcp.replynodes.com/mcp`, and complete the metadata form
>   (title: "ReplyNodes", description per issue #12 base text, categories/tags
>   including web search / web scraping / website crawl / Reddit / YouTube / App
>   Store / brand intelligence / public web data / context API for AI agents,
>   repository URL https://github.com/replynodes/replynodes-mcp, and the
>   install/connect instructions below).

Once the listing is live, verify:
- Public listing URL (likely `https://smithery.ai/server/com.replynodes/mcp` or similar).
- Endpoint points to `https://mcp.replynodes.com/mcp`.
- Repository points to `https://github.com/replynodes/replynodes-mcp`.
- Smithery health/connect works.
- Non-brand searches (reddit, youtube, hackernews, web search, web scraping,
  brand intelligence, app store, context api for AI agents, data api for ai agents)
  surface ReplyNodes.

## Install / connect instructions (for the Smithery listing)

Smithery remote connect (once published):

```bash
npx -y smithery mcp add com.replynodes/mcp
npx -y smithery tool list com.replynodes/mcp
```

Native remote MCP (no Smithery install), canonical endpoint:

```
URL: https://mcp.replynodes.com/mcp
Auth: Bearer <REPLYNODES_API_KEY>
```

stdio bridge install (Claude Desktop / Codex / Cursor / Windsurf):

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

Credential claim: https://replynodes.com/auth.md

## Verification evidence (sanitized)

### MCP endpoint live

```
$ curl -sI https://mcp.replynodes.com/mcp
HTTP/2 200
server: nginx/1.24.0 (Ubuntu)
content-type: text/html; charset=utf-8

$ curl -s -X POST https://mcp.replynodes.com/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"probe","version":"1.0.0"}},"id":1}'
{"jsonrpc":"2.0","id":1,"result":{"protocolVersion":"2024-11-05","capabilities":{"tools":{}},"serverInfo":{"name":"replynodes-fetcher","version":"dev"}}}

$ curl -s -X POST https://mcp.replynodes.com/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/list","params":{},"id":2}'
→ 200, tools listable
```

### Smithery auth blocker

```
$ curl -s -o /dev/null -w "%{http_code}" -X PUT \
  -H "Content-Type: application/json" \
  -d '{"name":"com.replynodes","displayName":"ReplyNodes"}' \
  https://api.smithery.ai/namespaces/com.replynodes
401
body: Missing authentication token. Provide an API key or session token in the Authorization header.

$ curl -s -o /dev/null -w "%{http_code}" -X PUT \
  -H "Content-Type: application/json" \
  -d '{"namespace":"com.replynodes","server":"mcp","displayName":"ReplyNodes","description":"test"}' \
  "https://api.smithery.ai/servers/com.replynodes%2Fmcp"
401
body: Missing authentication token. ...
```

### Existing Smithery URLs (not live listings)

```
$ curl -sI https://smithery.ai/server/com.replynodes/mcp
HTTP/2 404
body: # 404 — Server Not Found

$ curl -sI https://smithery.ai/server/@replynodes/mcp
HTTP/2 308 (redirect)
final page: 188-byte Next.js catch-all 404, not a live server listing
```

### MCP Registry (LIVE, left untouched)

```
$ curl -sI https://registry.modelcontextprotocol.io/v0.1/servers/com.replynodes%2Fmcp/versions/latest
HTTP/2 200
body: {"server":{"name":"com.replynodes/mcp","title":"ReplyNodes",...remotes:[{type:"streamable-http",url:"https://mcp.replynodes.com/mcp",...}]}}
```

## Changed files

- `smithery.yaml` — added `deploy:` remote block for Smithery submit-readiness.
- `README.md` — corrected Smithery distribution-table row from "Live listing" to "Not listed (blocked)".
- `artifacts/issue-12-smithery-submission-evidence.md` — this file.

## Test

- `smithery.yaml` is valid YAML and contains the canonical endpoint
  `https://mcp.replynodes.com/mcp` and `deploy.type: remote`.
- `README.md` no longer claims a live Smithery listing.
- MCP endpoint still responds to `initialize` + `tools/list` (verified above).
- No other files touched; issues #9, #10, #11, #13, #14, #15 not touched.

## Result

- Submitted to Smithery: **NO** — blocked by Smithery authentication wall.
- Live verified Smithery listing: **NO** — does not exist.
- Repo submit-ready: **YES** — manifest + docs updated for the moment a Smithery token is available.
- Owner action required: **YES** — one concrete action documented above.

## Blocker summary

Smithery requires an authenticated account session (OAuth/login, possibly CAPTCHA)
for every publish path: REST API (`PUT /namespaces`, `PUT /servers/...`,
`PUT /servers/.../releases`), CLI (`smithery auth login` + `smithery mcp publish`),
and web UI (sign-in-gated `/new` flow). This agent environment cannot complete
any of those autonomously. Once the owner authenticates and publishes, the
listing should be verifiable and the README Smithery row can be changed back to
"Live listing" with the real URL.
