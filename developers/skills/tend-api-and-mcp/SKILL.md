---
name: tend-api-and-mcp
description: Use a Tend panel from scripts, CI jobs and AI assistants safely (personal API tokens and scopes, app-bound tokens limited to one app, what no token can reach, connecting an assistant to the panel's MCP endpoint). Use when the user wants to automate Tend, give an agent limited access, or connect Claude, ChatGPT or a coding agent to their panel.
---

# API tokens, app tokens and MCP

Human review applies to anything you submit upstream. For a user's own panel, the safe default is the narrowest
credential that does the job, and a human creates it. Never ask the user to paste a token into the chat, a file or a
commit; tell them to put it in an environment variable or a CI secret.

This skill covers only what Tend's public documentation supports. If a route or scope is not listed here, it is
unknown: check [tend.host/docs/api-tokens](https://tend.host/docs/api-tokens) before using it, and never guess one.

## Personal API tokens

- Created by the signed-in user in **Settings, Account, API tokens**. Shown once; only a keyed digest is stored.
  Revocation is immediate, and changing the password revokes every token.
- Send as `Authorization: Bearer $TEND_TOKEN`. No CSRF token and no 2FA step is involved. If a request also carries a
  session cookie, the cookie decides and the token is ignored.
- `GET /api/auth/me` is the one route every valid token may read without a scope. Call it first: it names the
  account, the token, its scopes and its `app_ids`.

```bash
export TEND_URL=https://panel.example.com       # placeholder
curl -s "$TEND_URL/api/auth/me" -H "Authorization: Bearer $TEND_TOKEN"
```

### Scopes (deny by default)

| Scope | Grants |
|---|---|
| `apps:read` | app list and detail, deploys, logs, stats, build settings, previews, env-set names, ... |
| `apps:deploy` | plan and apply, restart, rollback, deploy-image, update checks, promoting a preview |
| `apps:exec` | run an app task inside its container |
| `apps:write` | create and change apps, build settings, env-set values, tasks, managed databases, custom catalog entries |
| `apps:destroy` | delete an app, destroy a preview, drop a database (destructive) |
| `servers:read`, `servers:write`, `servers:destroy` | servers: read, change, remove (destroy is destructive) |
| `backups:read`, `backups:run`, `backups:restore` | backups: read, run on demand, restore over live data (restore is destructive) |
| `domains:write` | add, change and remove domains, DNS, certificate checks |
| `catalog:read` | browse the app catalog |
| `audit:read` | the audit logs |
| `resources:read`, `resources:write` | resource usage and limits, PostgreSQL engine settings and diagnostics |

Presets: **read only** (every `:read`), **agent** (leaves the three destructive scopes out), **App tuning agent**
(`apps:read`, `resources:read`, `resources:write`). Pick scopes, not presets, for a CI job: a deploy job needs
`apps:deploy` and little else.

**Limit to apps**: a token can be limited to up to 20 apps (and the database engines they are linked to). Another
app answers `404`, panel-wide routes answer `403 token is limited to specific apps`. Use this for any per-app agent.

### What no token can reach

Token management and credential changes; anything that reveals or accepts a stored secret (env-set reveals, SSH key
material, deploy tokens, connection strings, provider and forge configuration, panel secrets); administrative
routes (there is no admin scope); and every route with no policy entry. These need a browser session. To change
one env var without reading the rest, `PATCH /api/orchestrator/env-sets/{name}` with `{"set": {...}, "unset": [...]}`
works under `apps:write` and never returns a value.

### Refusals

| Answer | Meaning |
|---|---|
| `401 authentication required` | unknown, revoked or expired token (one answer for all) |
| `403 token scope required: <scope>` | add that scope to a new token; never retry |
| `403 browser session required` | the route is reserved for a person in the browser |

## App-bound token for an app's own agent

For an agent that looks after one app and its database: create a token (name it after the agent), click **App tuning
agent**, and under **Limit to apps** tick only that app. Do not tick the database; a limited token reaches the engines
the app is linked to. Typical reads (all `resources:read`): `/api/orchestrator/apps/$DB/resources/usage`, `.../db/top-queries`,
`.../db/relation-sizes`, `.../db/rates`, `.../db/activity`, `.../db/index-health`, and `apps/$APP/logs/tail?since=2h&lines=500`;
writes (`resources:write`): the engine's `postgres-settings` and an app's `resources` limits. The token cannot redeploy
or read credentials. Full calls: [tend.host/docs/api-tokens](https://tend.host/docs/api-tokens) and the panel's
"Give an app's agent its own token" page.

## Deploying from CI

Prefer the per-app **deploy token** and the image webhook (it can deploy one app and nothing else): see
[`tend-deploy-app`](../tend-deploy-app/SKILL.md). Use a scoped API token with `apps:deploy` only when you need the
other deploy routes (`POST /api/orchestrator/apply`, `.../rollback`).

## MCP: connecting an assistant

Tend's MCP is how Claude, ChatGPT, a coding agent or any MCP client reads about the user's apps (and proposes changes
a human approves). It is a signed helper running on the user's panel, answering at `https://<panel>/mcp` over
streamable HTTP.

- A human switches it on in **Settings, MCP** (three steps; it installs a signed component).
- **Claude and ChatGPT** sign themselves in: add the panel's `/mcp` address as a connector and approve on the consent
  screen. **Other assistants** take a key: **Create a key** on the Ready step; it is shown once. Use it as a bearer
  credential for `/mcp` only. The panel session cookie and personal API tokens are **not** accepted at `/mcp`, and the
  key is accepted nowhere else.
- Default access is **every app, read-only**. Advanced narrows the key to chosen apps. Separate opt-in ticks (off by
  default): panel reads, server and security reads, app logs, resource reads. Deployment requests are a separate
  choice per assistant: the assistant can only file a request (for example `redeploy_app` with an idempotency key); a
  person reviews its impact, confirms in the panel and may re-enter the password. The assistant never confirms its own
  request.
- Revoke by taking that assistant's access away in the same page.

Never put the key in a repository or a prompt log; use the client's secret or environment mechanism.

## Verify

`GET /api/auth/me` returns the expected scopes and `app_ids`; a call outside the scope returns `403`/`404` as above;
the activity log shows `api_token.resources_request` for resource calls. The token is revoked when the job is retired.

## Common refusals

- "Give the agent an admin token": no such thing; a token never carries administrative power.
- Broad scopes for a narrow job, tokens without an app limit for a per-app agent, secrets in prompts or files.
- Using the panel's REST API with a browser cookie from a script.

Source: public docs [api-tokens](https://tend.host/docs/api-tokens), [mcp](https://tend.host/docs/mcp); the panel's
`app-agent-token` how-to and route policy table (`internal/api/route_scopes.go`).
