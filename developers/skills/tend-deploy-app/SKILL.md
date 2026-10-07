---
name: tend-deploy-app
description: Deploy the user's own application on a Tend panel from Git, a Dockerfile, a prebuilt image, or their own CI pipeline (files needed per source, environment variables and secrets, domains and HTTPS, volumes, databases, deploy checks, rollback, deploy tokens and webhooks). Use when the user wants to get their project running on Tend or automate its deploys.
---

# Deploy your own app on Tend

Human review applies to anything you propose to submit upstream. For the user's own deployment, you still must not
claim a deploy works until the panel's checks and the running app prove it.

Tend runs apps in containers on servers the user manages over SSH; nothing is installed on those servers.

## Pick a source

| Source | Needs in your project | Use it when |
|---|---|---|
| **Git repository** | a `Dockerfile` in the build context ([`tend-dockerfile`](../tend-dockerfile/SKILL.md)) | you want Tend to build from a branch, tag or exact commit; optional auto-deploy on push |
| **Prebuilt image** (registry) | an image reference, ideally `repo@sha256:<digest>` | you build elsewhere (your CI, Docker Hub, GHCR) |
| **Your own CI** | a pipeline that publishes an image and calls Tend's image webhook with the digest | you already have CI and want Tend to deploy what CI built |
| **Compose file** | nothing: not deployable as a source today | translate it: [`tend-compose`](../tend-compose/SKILL.md) |
| **Archive (zip URL)** | nothing: recognised but not deployable today | publish a Git repo or an image instead |
| **App Store recipe** | none | an app someone already described: [`tend-app-recipe`](../tend-app-recipe/SKILL.md) |

Overview of the supported sources and their limits: [`../../guides/deploy-sources.md`](../../guides/deploy-sources.md).

## Add the app (UI)

**Apps or App Store, then Add:** choose the source, the target server, an app name and a web address.

1. **Git**: repository URL; **Branch / Git Ref** takes a branch, a tag or a full commit SHA (blank means the
   repository default). The form probes the repo and shows the detected port and a warning when there is no
   Dockerfile. Private repositories are cloned with the connected GitHub App installation token (scoped to the one
   repository), or a stored SSH key or token; the build itself never sees them.
2. **Image**: `nginx:stable`, `docker.io/library/nginx:stable`, or `ghcr.io/you/app@sha256:...`. Public images work
   directly. Private or rate-limited pulls use the **Docker daemon's existing registry login on that server**
   (`docker login` there); Tend stores no second copy of registry credentials.
3. **Storage**: add mounts **before the first deploy** for uploads, config and SQLite files. The default **managed
   storage** (a named volume) survives restarts, updates and redeploys. Host folders and storage drives are
   alternatives. Removing or switching a mount later never deletes or migrates its data.
4. **Databases**: connect every database the app needs (**Install one** if none exists on that server); the
   non-secret setup is kept in the browser tab and the connection values arrive as environment variables. Only
   engines on the app's own server are offered, over a private link; no raw SQL port is published.
5. **Environment**: put ordinary settings in the app's environment and every secret in an **encrypted environment
   set**. The app only sees what it is given, plus whatever the image's own `ENV` sets. Never commit `.env` files.
6. **Check readiness** (server, image, name, address, database, required settings, at least 2 GiB free for images),
   review the checklist, **Install**. Tend then verifies the container is running without a crash-loop, something is
   listening on each routed port, and each web address responds before offering **Open app**. If installation
   fails before verification, the attempt is rolled back and the form keeps your input.

## Domains and HTTPS

On the app: **Add domain**, a real public hostname (no IP address, wildcard, `localhost`, `.local`/`.internal`),
optional path prefix, and the **app's container port**. Add the A record Tend shows at your DNS provider; the
server must accept ports 80 and 443. Certificates are issued and renewed automatically once the name points at the
server. Tend updates the proxy straight away; redeploy if the form says so. A domain-routed app is only published on
the server's loopback behind the proxy.

## Deploy checks and what a deploy does

For Git apps the order is: place (pick the build server), clone, detect and run the project's tests inside the
freshly built image, transfer if built elsewhere, then start the new container beside the old one, verify, swap and
remove the old one. A failing test or failed verification leaves the old container serving. Redeploying an unchanged
commit builds nothing. Image apps are pulled, not tested. A manual deploy may skip checks for one run
(`skip_checks`), which is audited. Any server can offer itself as a build host (off by default) so builds do not
compete with serving.

## Rollback

Each successful release is recorded with its commit or digest. **Roll back** from the app's deploy history re-runs
the previous verified release; it must be exactly the next step back. Rollback exists for image and Git apps, not
for compose. Rollback restores code, not data: data in volumes is untouched, so take a backup before risky
migrations.

## Deploy from your own CI

Two doors, independent:

| Door | Call | Use it when |
|---|---|---|
| Image webhook | `POST /api/orchestrator/apps/{uuid}/deploy-image` with the app's **deploy token** | your pipeline builds the image |
| Forge push webhook | `POST /api/orchestrator/{gitea,forgejo,gitlab,github}/webhook` | Tend builds from the repository and you want it to start within seconds, not at the next five-minute poll (the app must be a Git app with auto-deploy on) |

**Tend deploys only immutable digests.** The image webhook refuses a tag, a bare name, a tag beside a digest and a
local image id. Publish, read the digest the registry returned, send that.

1. Mint the token in the panel (the app must be an **image** app): the app's settings, deploy token. It is shown once,
   deploys only that app, and minting again rotates it; revoke by deleting it. Token management is browser-only; an
   API token cannot mint or read it.
2. Store it in your CI's **secret store** (`TEND_DEPLOY_TOKEN`) with the panel's deploy URL (`TEND_DEPLOY_URL`).
   Anyone who can read your pipeline logs can deploy with it.
3. Call it:

```bash
curl -fsS -X POST "$TEND_DEPLOY_URL" \
  -H "Authorization: Bearer $TEND_DEPLOY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"image":"ghcr.io/acme/api@sha256:<64 hex>","source":{"provider":"GitHub Actions","run_url":"https://github.com/acme/api/actions/runs/123","commit":"8e3c1ab"}}'
```

`X-Tend-Deploy-Token: <token>` works instead of the bearer header. `"dry_run": true` validates and reports the plan
without deploying; do that first. Answers: `202` run recorded (`run_id`), `200` dry run, `401` token missing, wrong,
revoked or no such app (deliberately one answer), `409` the app is already deploying, `422` not a digest or not a
registry image app, `429` more than 10 deploys in 5 minutes for the app, `503` this engine cannot deploy or is not
the primary engine. The panel pulls the digest on the app's server (private registries need a `docker login` there),
starts the replacement beside the current container, verifies, swaps, and restores the previous container
automatically if a check fails. The digest and your provenance line go in the deploy history.

GitHub Actions: `docker/build-push-action` reports `steps.<id>.outputs.digest`; send
`ghcr.io/${{ github.repository }}@${{ steps.build.outputs.digest }}`. Elsewhere read the digest after a push with
`docker inspect --format='{{index .RepoDigests 0}}' <image>`. Complete GitHub, Gitea or Forgejo, GitLab and
Woodpecker pipelines: [tend.host/docs/deploy-from-your-own-ci](https://tend.host/docs/deploy-from-your-own-ci).

Forge push webhooks: generate a per-forge secret in the panel (shown once, 16 characters minimum if you set your
own), then in the forge add a webhook with `application/json`, the secret, **push events** only. Gitea and Forgejo sign
the body (HMAC-SHA256 header); GitLab sends the secret as `X-Gitlab-Token` and the URL must be HTTPS. Tag pushes are
ignored; the same app and commit within ten minutes counts once.

## Verify

- The deploy log reaches the verification step and **Open app** turns on; `curl -I https://your.domain` answers.
- `dry_run` before the first CI call; check the deploy history shows your digest and provenance.
- After the first success, restart the app and confirm the data is still there (the volume is mounted).

## Common refusals

- Sending a mutable tag (`:latest`) to the deploy webhook.
- Putting the deploy token, registry password or any secret in a repository, workflow file or log.
- Using an admin session cookie in CI. Use the deploy token (or a scoped API token, see
  [`tend-api-and-mcp`](../tend-api-and-mcp/SKILL.md)).
- Telling the user a compose file or a zip URL deploys directly.

Source: public docs [applications](https://tend.host/docs/applications),
[deploy-from-your-own-ci](https://tend.host/docs/deploy-from-your-own-ci); panel `internal/api/orchestrator_image_webhook.go`
and `route_scopes.go` (deploy-token routes are browser-only, `apps:deploy` scope), `internal/deploy/plan.go`
(`SupportedSources`), `internal/api/orchestrator_deploy.go` (rollback), the panel docs on deploy checks and build
placement (`docs/how-to/deploy-checks.md`, `deploy-build-placement.md`), `domains-and-dns.md`.
