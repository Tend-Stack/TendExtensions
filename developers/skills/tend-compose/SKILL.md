---
name: tend-compose
description: Know exactly which part of Docker Compose a Tend panel deploys (a Compose project runs as a stack of apps, within a fixed subset), what it refuses and why, how to write a file that passes, and how to check it with the panel's Validate step or the validate API. Use when the user asks for a compose file for Tend, wants to deploy an existing compose project on Tend, or wants a compose file read by a catalog source.
---

# Compose files and Tend

Human review applies: you and the user must read and test every compose file or translation before use.

## What is true today (read before writing anything)

**A Tend panel deploys a Compose file as a stack, but only a subset of Compose.** The panel does not run
`docker compose`: it reads the file itself, checks every key against a fixed table, and runs each service with its
own deploy engine. A file with anything refused deploys nowhere, and every refusal names its YAML path and a reason.
Do not tell the user that any compose file will deploy, and do not write `docker compose up` instructions as the way
to deploy onto a Tend-managed server.

How a stack behaves:

- Each long-running service becomes an app named `<stack>-<service>`, on one private network per stack; services
  reach each other by service name (`postgres://db:5432`). A service another one waits on with
  `service_completed_successfully` is a **job** run once to exit 0 on every deploy, not an app.
- Releases record exact image digests; **rollback** replays the previous release one step at a time and never rereads
  the source. Data volumes are never rolled back and never deleted by a redeploy. A deploy that fails on any service
  puts every service it already swapped back.
- Compose is deployable **only as a stack**; a single app cannot have a compose source.

Other ways compose files are used:

1. **A community catalog source reads it** (one service per file; below).
2. **Adopting containers that already run.** On a server, **Adopt existing containers** lists running containers
   grouped by Compose project and starts tracking the ones you pick, without restarting or relabelling them.

## What to write (the supported subset)

Keys not listed in the panel's tables are refused ("is not in Tend's compose subset"). The full reference with every
key: [Deploy a Compose file](https://tend.host/docs/compose).

**Allowed**: `image` (or `build` from a Git source), `pull_policy` (`missing`, `always`), `platform`, `command`,
`entrypoint`, `user`, `working_dir`, `stop_signal`, `hostname`, `init`, `tty`, `stdin_open`, `read_only`, `dns` (IP
addresses), `extra_hosts`, `environment`, `env_file` (Git only), `labels` (not `tend.*` or `com.docker.compose.*`),
`restart` (`no`, `always`, `unless-stopped`, `on-failure[:N]`; default `unless-stopped`), `healthcheck`, `depends_on`,
`deploy.resources.limits` (`cpus`, `memory`, `pids`), `mem_limit`, `cpus`, `pids_limit`, `shm_size`, `deploy.replicas`
(`0` or `1`), `ports`, `expose`, `volumes`, `tmpfs`, `networks`, `links`, `cap_add` (only Docker's default
capabilities, a no-op), `cap_drop`, `security_opt: no-new-privileges:true`, `ulimits` (`nofile`, `nproc`, `core`),
`logging` (`json-file` or `local`), `container_name` (kept only as a DNS alias), `profiles` (such services are
skipped), `devices` (GPU only, below).

**Ignored with a warning**: top-level `version` and `name`, `mem_reservation` and `deploy.resources.reservations`,
`develop`, `annotations`, `attach`, volume and network `labels`, and any other `x-*` key except `x-tend`.

**Refused**, with the reason the panel gives:

| Key | Why |
|---|---|
| `privileged: true`, `network_mode`, `pid`, `uts`, `device_cgroup_rules`, any device other than the GPU | gives the container access to the host |
| `secrets`, `configs` (top level or service) | not supported; put values in an encrypted env set |
| `extends`, `include` | one compose file per stack |
| `volumes_from`, `external_links`, `use_api_socket`, external volumes and networks | reach outside the stack or the host |
| absolute or `~` host binds, `docker.sock`, `../` paths, single-file binds, anonymous volumes | host paths and file injection are out of scope |
| volume `driver_opts`, `name`, non-`local` driver; network `ipam`, `driver_opts`, `name`, non-`bridge` driver, static IPs, `mac_address` | can bind host paths or need static addressing |
| `deploy.placement`, `restart_policy`, `update_config`, `rollback_config`, `endpoint_mode`, `labels`, `deploy.mode` other than `replicated`, `replicas` above 1, `scale` | Swarm keys; Tend runs one container per service |
| `build.ssh`, `secrets`, `additional_contexts`, `network`, `entitlements`, `privileged`, `cache_from`, `cache_to`, several `platforms` | would hand the build something from outside the repository |
| `userns_mode`, `cgroup`, `cgroup_parent`, `sysctls`, `storage_opt`, `runtime`, `isolation`, `gpus`, `oom_kill_disable: true`, negative `oom_score_adj`, `pids_limit: -1`, `ipc` shared with the host or another container | not supported |
| `post_start`, `pre_stop`, `models`, `provider`, `pull_policy: never` | not supported |
| `build` or `env_file` in a pasted file | needs a Git source |
| `cap_add` beyond Docker's defaults; `security_opt` other than `no-new-privileges:true` | would widen the container |
| `logging` driver other than `json-file` or `local` | Tend reads `docker logs` |

**Out of scope in this version**: replicas above 1, public TCP or UDP ports, private registries (no registry login is
used when pulling), compose `secrets` and `configs`, and creating, deploying or rolling back stacks from the MCP
server or Sprout.

### Values that behave specially

- **Variables**: `${VAR}`, `${VAR:-default}`, `${VAR:?message}` and `$$` work. Lookup order: Tend's
  `TEND_URL_<SERVICE>` and `TEND_HOST_<SERVICE>` (set from the service's web address), then the stack's env sets,
  then the `.env` beside the compose file (Git only), then the default in the file. An unset variable with no default
  is an error that names it, not an empty string. `TEND_URL_<SERVICE>` needs the service to have a web address
  before it can deploy.
- **Secrets** go in an encrypted env set chosen in the form; `environment` and `env_file` values are stored in an
  encrypted env set per service.
- **Folder binds**: `./data:/var/lib/app` becomes a managed volume named `<stack>-<service>-<folder>-<6 hex>`. It
  **starts empty**, repo files are not copied, and the panel shows a notice. Named top-level volumes become
  `<stack>-<volume>`.
- **Ports**: `ports` and `expose` declare container ports. The host side is ignored with a warning; Tend publishes
  nothing publicly. A web address routes to one declared TCP port (the first, or `x-tend.web_port`).
- **`depends_on`**: `service_started`, `service_healthy` (the dependency **must define a `healthcheck`**) and
  `service_completed_successfully` (a job, 15 minutes at most). Cycles are refused.
- **`build`**: Git sources only; context and Dockerfile stay inside the repository; `args` and `target` are
  honoured. An `image:` next to `build:` is ignored.
- **Images** are pulled once per tag by default (`pull_policy: missing`) and pinned to the digest they resolve to;
  `pull_policy: always` pulls and swaps on every deploy.
- **GPU**: only `/dev/dri` or `/dev/dri/renderD<N>`, mapped to the same path. It is opt-in: the panel asks for an
  explicit confirmation per service before it deploys.
- **`x-tend`** (the only extension read; a typo in it is refused): on a service `address` (the address label,
  default the service name), `web_port` (must be a declared TCP port) and `internal: true` (no web address; cannot be
  combined with the other two); at the top level `storage` (named `prompt` and optional absolute `mount_root`
  questions, validated and reported but not yet asked by the panel).
- **Hardening**: every service gets `no-new-privileges`, a process limit of 4096 (or your lower one), Docker's default
  capabilities minus `cap_drop`, and is never privileged.
- **Names and sizes**: stack name 1-40 lowercase letters, digits or dashes; service names letters, digits, `_`, `-`;
  file at most 256 KiB; Git checkout at most 2 GiB.

```yaml
services:
  db:
    image: postgres:17
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - ./data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      retries: 10
  web:
    image: ghcr.io/example/web:1.4
    depends_on:
      db:
        condition: service_healthy
    environment:
      DATABASE_URL: postgres://postgres:${DB_PASSWORD}@db:5432/postgres
      PUBLIC_URL: ${TEND_URL_WEB}
    ports:
      - "3000"
```

## Translating a project that uses keys Tend refuses

| Compose | Do this instead |
|---|---|
| `secrets:` / `configs:` | an encrypted env set, referenced as `${VAR}` |
| bind of a config file | bake it into an image, or pass its content as an environment variable |
| absolute host bind for data | a named volume or a `./folder` bind (a managed volume) |
| `network_mode: host`, published `ports` | `networks`, and a web address on the container port |
| database service | keep it in the stack (with a `healthcheck`), or use a managed database from **Databases** |
| `replicas: 3` | one container per service; run several stacks if you need more |

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

Check the file **before** deploying, against the panel itself (it is the only authority on its subset):

1. In the panel: **Apps**, **Add app**, **A Compose file**. Paste the file or enter the Git repository. The form
   checks as you type and lists every refusal with its YAML path, every warning and notice, and the variables still
   missing. Nothing is created until you choose **Create stack**.
2. Or call the API (an API token with `apps:write`; it changes nothing):

```bash
curl -fsS -X POST "$TEND_PANEL/api/orchestrator/stacks/validate" \
  -H "Authorization: Bearer $TEND_TOKEN" -H "Content-Type: application/json" \
  -d '{"name":"shop","server_uuid":"<server uuid>","source":{"kind":"inline","compose":"<the file as a JSON string>"}}'
```

   It answers `200` even for a refused file: read `ok`, `refusals[]` (`path` and `message`), `warnings[]`,
   `notices[]`, `missing[]`, `needs_gpu_confirmation[]`, `services[]` and `jobs[]`. A Git source is
   `{"kind":"git","repo_url":"...","ref":"main","compose_path":"compose.yaml"}`. Other stack routes (all under
   `/api/orchestrator`): `POST /stacks`, `GET /stacks/{uuid}/plan`, `POST /stacks/{uuid}/deploy`
   (`apps:deploy`), `POST /stacks/{uuid}/rollback`, `GET /stacks/{uuid}/releases`, `DELETE /stacks/{uuid}`
   (`apps:destroy`).
3. Read the plan before you deploy: it lists what will be added, changed and removed per service.

`docker compose config` shows that the file is valid Compose; it does **not** show what Tend will refuse. For a
catalog repo, add it as a catalog source on a panel you administer and read the entry and the withheld-entries
explanation.

## Common refusals

- "Deploy this compose file on Tend as is": say Tend runs only its subset, run the Validate step, and fix what it
  names.
- Secrets inline in compose (`environment: DB_PASSWORD=hunter2`): use an env set and `${DB_PASSWORD}`.
- `privileged: true`, host networking, mounting `/var/run/docker.sock`, absolute host binds: refused by the panel,
  never worked around.
- Multi-service files as a **catalog** entry: split them into separate entries (a stack deploys them together).
- Promising rollback of data: rollback restores images and settings, not volumes.

Source: panel `internal/compose/validate.go` (the key tables), `normalise.go` (value checks and refusal wording),
`load.go` (variables), `xtend.go`, `internal/api/stacks*.go` and `route_scopes.go` (stack routes and scopes),
`internal/deploy/stack*.go` (ordering, releases, rollback), `internal/api/catalog_source_repo_adapter.go` and
`catalog_source_adapters.go` (compose-per-app reader and withheld reasons), public docs
[Deploy a Compose file](https://tend.host/docs/compose) and [applications](https://tend.host/docs/applications)
(catalog sources, adopting containers).
