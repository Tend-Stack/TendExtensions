---
name: tend-dockerfile
description: Write or fix a Dockerfile that a Tend panel builds from Git and runs well (exposed port, listening address, health check, non-root user, small image, build args and secrets, files Tend leaves out of the build context, where the build runs). Use when the user wants an app to deploy on Tend from a repository, or a Tend deploy fails at build or start.
---

# A Dockerfile Tend builds and runs well

Human review applies: you and the user must read, build and run what you write before relying on it, and the user must
be able to explain every line. Do not present an untested Dockerfile as working.

For a Git app, Tend clones the repository, sends the build directory to the Docker daemon and runs your `Dockerfile`.
There is no buildpack: **no Dockerfile means no Git deploy** (use a prebuilt image instead, see
[`tend-deploy-app`](../tend-deploy-app/SKILL.md)).

## How Tend builds it

- Command: `docker build --progress=plain --pull -t <tag> -f <Dockerfile> --build-arg K=V ... --label tend.managed=1 -`
  with the context as a tar on stdin. It is BuildKit, so `RUN --mount`, `RUN --chmod` and heredocs work.
- `--pull`: base images are re-pulled every build. Pin them (`node:22-alpine`, better a digest) so a moved tag
  does not change your build, and remember registry pull limits.
- The Dockerfile name defaults to `Dockerfile` (matched case-insensitively); the app's build settings can name
  another file (`dockerfile_name`), a branch, tag or commit, and a `subpath` for a monorepo (that directory is the
  build context, and the Dockerfile is looked up inside it).
- The build runs on the machine that will run the container, or on another of the user's servers that offered
  itself as a build host and has the same CPU architecture and OS. **There is no cross-architecture build**: do
  not hardcode `--platform` unless the target really is that platform.
- The build has a 10 minute budget by default (per-app `timeout_seconds`), and a 2 GiB cap on the context.
- The tag is derived from the commit and build options: redeploying an unchanged commit reuses the image and builds
  nothing.

### Files that never reach the build

The context is the repository without any directory named **`.git`, `node_modules`, `__pycache__`, `.venv`, `venv`,
`.mypy_cache`, `.pytest_cache`, `.ruff_cache`, `.next`, `.svelte-kit`, `dist`, `build` or `.terraform`**, at any
depth. A Dockerfile that does `COPY dist ./dist` or `COPY build ./build` from a committed folder will fail on Tend
even though it works on your laptop. Build inside the Dockerfile (multi-stage) so output never depends on the
repository's local build folders. Add a `.dockerignore` for anything else large or private (`.env`, keys, local data).

## Port and listening address

- Put `EXPOSE <port>` in the Dockerfile. When the user adds the app, Tend reads the first TCP `EXPOSE` (UDP-only
  tokens are skipped) and offers it as the container port; failing that it looks for `PORT=`, `-p` or `--port` in
  a `package.json` start script. The user can always type another port.
- Tend does **not** inject a `PORT` variable. Make the app read `PORT` with a default equal to your `EXPOSE`.
- Listen on `0.0.0.0`, not `127.0.0.1`: the panel's proxy reaches the container through a published port.
  A domain-routed app is published on the server's loopback only; the container is never exposed raw to the internet.
- Each app runs on its own private network. Databases are reached through Tend's database link (connection values
  arrive as environment variables), not by guessing another container's name.

## Process, signals and restarts

- Use exec form for `CMD`/`ENTRYPOINT` (`CMD ["node","server.js"]`) so the app is PID 1 and receives `SIGTERM`.
  The default stop signal can be changed per app if you need another.
- The default restart policy is `unless-stopped`. Exit non-zero on a fatal start-up error; do not loop internally.
- After a deploy Tend checks that the container is running without a crash-loop, something is listening on each routed
  port, and each web address responds (a protected address answering 401 counts as answering). Keep start-up fast, or
  make the port open only once the app is ready.
- Add a `HEALTHCHECK` for your own and Sprout's benefit (Docker runs it; the panel reads container health), but do not
  rely on it to gate a Tend deploy.

## Non-root and storage

- Create and use a non-root user (`USER app`, or `USER node` on the official Node image). Do not require
  `privileged`, host networking or extra capabilities.
- Persistent data belongs in a path the user mounts as a volume. Tend's default is managed named volumes. For an
  empty named volume Docker copies the image's contents and ownership of that path, so create and `chown` the data
  directory in the image (`RUN mkdir -p /data && chown app:app /data`). A host-folder bind mount keeps the host's
  ownership, so say in the README which uid your image runs as.
- Do not write state into the image layer or in a writable root filesystem if you need to keep it.

## Build arguments and secrets

- Tend passes `--build-arg` values the user stores in the app's build settings, plus an automatic
  `SOURCE_COMMIT=<commit>` (declare `ARG SOURCE_COMMIT` to bake the commit into the image for a version endpoint).
- Build arguments are visible in image history: **never** put a secret in an `ARG`, an `ENV`, a `COPY`ed `.env`, or
  a Dockerfile. Tend does not pass BuildKit `--secret`, so builds cannot receive secrets at all: fetch private
  dependencies another way (vendoring, a private base image) and supply runtime secrets through encrypted
  environment sets.
- Private repositories are cloned with a GitHub App installation token, a stored SSH key or a stored token; none of
  these is available inside your build.

## Small and fast

Multi-stage builds, slim or distroless runtime base, install production dependencies only, copy dependency manifests
before source (layer cache), `.dockerignore`. Free disk matters: the install checklist blocks below 2 GiB free where
Docker stores images, and a server is only considered for building with 5 GiB free.

## Tests run by Tend

Before swapping the container Tend detects and runs the project's tests inside the image it just built (`npm test`,
`bun test`, `pnpm test`, `yarn test`, `go test ./...`, `python -m pytest -q`, `cargo test`, `make test`), with no
network, 1 GiB of memory and only `CI=true` and `TEND_CHECK=1` in the environment. A failing test stops the deploy
and the old container keeps serving. If the final image lacks the tool (distroless, no `node_modules`), the check is
reported as skipped, not as a pass. Do not write tests that need a database or network.

## Example (Node, multi-stage)

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
ENV NODE_ENV=production PORT=3000
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build --chown=node:node /app/dist ./dist
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=20s CMD wget -qO- http://127.0.0.1:3000/healthz || exit 1
CMD ["node", "dist/server.js"]
```

The application must serve `/healthz` and bind `0.0.0.0:$PORT`. Adapt names; do not copy the example blindly.

## Verify before you push

```bash
docker build -t myapp:test .
docker run --rm -p 3000:3000 -e PORT=3000 myapp:test    # then: curl -i http://127.0.0.1:3000/healthz
docker run --rm myapp:test id                           # not uid 0
git ls-files | grep -E '(^|/)(dist|build)/'             # committed folders Tend will drop
```

Then add the app in Tend (the form probes the repository and shows the detected port and a "no Dockerfile" warning
before you deploy) and read the deploy log.

## Common refusals

- Secrets in `ARG`/`ENV`/the image; `latest` for a base image the user wants reproducible; `USER root` at run time
  without a reason; `--privileged`, host networking, Docker socket mounts.
- A build that needs `--platform` for another architecture, or that downloads and runs remote install scripts
  without a pinned checksum.

Source: panel `internal/docker/build.go` (`BuildArgv`), `internal/builder/git.go` and `tar.go` (context, Dockerfile
lookup, skipped directories, limits, `SOURCE_COMMIT`), `internal/api/orchestrator_git_probe.go` (port detection),
`internal/deploy/spec.go` (restart policy, loopback publishing, private network), public docs
[applications](https://tend.host/docs/applications); deploy checks and build placement as documented in the panel's
`docs/how-to/deploy-checks.md` and `deploy-build-placement.md`.
