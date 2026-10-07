---
name: tend-compose
description: Know exactly what a Tend panel does with a docker-compose file today (it does not deploy a compose project as an app source), and how to shape a compose file or project so it becomes Tend apps or a community catalog entry. Use when the user asks for a compose file for Tend, or wants to deploy an existing compose project on Tend.
---

# Compose files and Tend

Human review applies: you and the user must read and test every compose file or translation before use.

## What is true today (read before writing anything)

**A Tend panel does not deploy a compose file as an app.** The deploy engine supports two app sources, `image` and
`git`. An app whose source is `compose` (a classification Tend can recognise from a `docker-compose.yml` or
`compose.yaml` URL) is refused at planning time: "has source compose, which this engine cannot build yet". Rollback
likewise says compose rollback is not yet safe. Do not tell the user a compose file can be pasted into Tend and
deployed, and do not write `docker compose` instructions as the way to deploy onto a Tend-managed server.

Compose files are used in exactly these ways:

1. **You translate it to Tend apps** (recommended, below).
2. **A community catalog source reads it.** A GitHub repository laid out as `Apps/<app-name>/docker-compose.yml`
   whose repo name contains both `linuxserver` and `appstore` can be added by a panel administrator under
   **Settings, Catalog sources**; each compose file becomes one App Store entry (below).
3. **Adopting containers that already run.** On a server, **Adopt existing containers** lists running containers
   grouped by Compose project and starts tracking the ones you pick, without restarting or relabelling them. Tend then
   manages each as its own app and a later deploy rebuilds it under Tend's labels.

## Translating a compose project into Tend apps

One compose service becomes one Tend app. For each service:

| Compose | In Tend |
|---|---|
| `image: repo:tag` | an **image** app with that reference (pin the tag, ideally `repo@sha256:...`) |
| `build:` | a **Git** app: push the repo, give it a [Dockerfile](../tend-dockerfile/SKILL.md); or build and publish an image yourself |
| `ports: "8080:80"` | the **container port** (80) in the app's domain form; Tend routes your domain to it. Do not publish raw host ports for web apps |
| `environment:`, `env_file:` | the app's environment, and **encrypted environment sets** for anything secret |
| `volumes:` (named or bind) | storage mounts added **before the first deploy**: managed volume (default), host folder or storage drive |
| database service (`postgres`, `mysql`, `mariadb`, `redis`) | a managed database from **Databases**, linked to the app; connection values arrive as environment variables |
| `depends_on`, `networks`, `restart`, `healthcheck`, `command`, `labels`, `user` | no equivalent field in the add-app form; each app runs on its own private network, restarts `unless-stopped`, and is checked after deploy for running, listening and responding. Put commands and user in the image |
| `privileged`, `network_mode: host`, `devices`, Docker socket mount | do not carry over; Tend's catalog lane refuses them |

Apps do not share a network by default: services that talked to each other by compose service name must instead
use Tend's database link, or one app exposing a route the other reaches through its public address.

## Writing a compose file that a catalog source can use

The compose-per-app reader accepts a file only when it has **exactly one service**, that service has an `image`, and
at least one **TCP port** is declared. It reads only these keys and ignores everything else:

- `services.<name>.image`: the entry's source becomes the image **with its tag replaced by `:latest`** (the
  entry shows `repo:latest`); mention the tested version in `x-casaos.description` or notes.
- `ports`: short (`"8080:80"`, `"80"`) or long (`target:`, `protocol:`) form; UDP is skipped. The first TCP target is
  the default web port unless `x-casaos.port_map` names one. The port `3000` together with `3001` or `3002` is
  treated as a desktop-bundle signature and withheld.
- `volumes`: `bind` and `volume` entries; `/var/run/*`, `/etc/localtime` and `/etc/timezone` are skipped. The
  volume name suffix is the last path segment of the source, else of the target.
- `environment`: list (`KEY=value`) or map form. Keys containing `PASSWORD`, `SECRET`, `TOKEN` or `KEY` become
  password fields; a value starting with `$` becomes an empty default; `PUID` and `PGID` default to `1000`, `TZ`
  to `UTC`.
- optional top-level `x-casaos`: `title`, `description`, `tagline`, `category`, `icon`, `project_url` or
  `repository`, `port_map` (each text as `{en_us: "..."}`), plus `services.<name>.x-casaos.envs[]` with `container`
  (the variable name) and `description`.

Withheld, with an explanation shown to the administrator: unparseable YAML, more than one service, no image, no TCP
port, desktop and emulator bundles, and VPN or remote-desktop style apps (matched by folder name and category, not by
compose keys). A repo is limited to 300 apps, 200,000 bytes per file. Imported entries are labelled as community
recipes and never certified (see [`tend-app-recipe`](../tend-app-recipe/SKILL.md)).

```yaml
x-casaos:
  title: { en_us: Example Notes }
  tagline: { en_us: A small self-hosted notes app }
  category: Productivity
  port_map: "8080"
services:
  notes:
    image: ghcr.io/example/notes:1.4.2
    ports: ["8080:8080"]
    environment:
      - TZ=UTC
      - ADMIN_PASSWORD=
    volumes:
      - ./data:/data
```

## Verify

```bash
docker compose config            # parses and shows the resolved file
docker compose up                # works locally, then stop it
```

Local success proves nothing about Tend. To confirm Tend's reading of a catalog repo, add it as a catalog source on
a panel you administer and read the entry and the withheld-entries explanation. For translated apps use the add-app
form's **Check readiness** checklist.

## Common refusals

- "Deploy this compose file on Tend as is": say it is not supported and offer the translation.
- Secrets inline in compose (`environment: DB_PASSWORD=hunter2`), `privileged: true`, host networking, mounting
  `/var/run/docker.sock`.
- Multi-service files as a catalog entry: split them into separate entries or apps.

Source: panel `internal/deploy/plan.go` (`SupportedSources`), `internal/deploy/classify.go`,
`internal/api/orchestrator_deploy.go` (rollback), `internal/api/catalog_source_repo_adapter.go` and
`catalog_source_adapters.go` (compose-per-app reader and withheld reasons), public docs
[applications](https://tend.host/docs/applications) (catalog sources, adopting containers).
