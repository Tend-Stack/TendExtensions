# What a Tend panel can deploy

Checked against the Tend source in October 2026. Where this page and the panel disagree, the panel (and
the [public documentation](https://tend.host/docs/applications)) win; please open an issue.

Every Dockerfile, compose file, workflow and recipe you write for Tend, with or without an AI agent, must be read,
tested and understood by you before you share it. Humans review anything proposed upstream, and reviewers reject
code its author can't explain.

| Source | Deployable today | How Tend runs it | Rollback | Needs from you |
|---|---|---|---|---|
| Git repository | yes | clones a branch, tag or commit; builds your `Dockerfile` on a server; runs checks; swaps | yes | a `Dockerfile` ([skill](../skills/tend-dockerfile/SKILL.md)) |
| Docker image | yes | pulls the reference on the server; swaps | yes | an image reference, ideally pinned by digest |
| Your CI + image webhook | yes | CI publishes an image, calls `deploy-image` with the digest and a per-app deploy token | yes | an image app, deploy token, a digest ([skill](../skills/tend-deploy-app/SKILL.md)) |
| Git push webhook | yes | a forge push starts a build for an auto-deploy Git app within seconds | yes | webhook secret per forge |
| App Store recipe | yes | an image or Git app described in the catalog; the install wizard fills the form | as the underlying source | a catalog entry ([skill](../skills/tend-app-recipe/SKILL.md)) |
| Compose file | **no** | refused at planning time ("source compose ... cannot build yet") | n/a | translate to apps ([skill](../skills/tend-compose/SKILL.md)) |
| Archive / zip URL | **no** | recognised, refused at planning time | n/a | publish a repo or image |

Things that are always true:

- Apps run in containers on servers the user manages over SSH; nothing is installed on those servers.
- Each app gets its own private Docker network. Web apps are reached through the panel's proxy on a domain; a
  domain-routed app is published on the server's loopback only.
- Secrets belong in encrypted environment sets, never in the repository, the image or the compose file.
- Persistent data belongs in volumes added before the first deploy.
- A deploy is built to keep the old container serving when tests or verification fail: the new one starts beside it
  and takes over only after it is verified.

Not covered here: databases (Tend creates and links managed engines from its Databases page; PostgreSQL, MariaDB and
MySQL are documented) and domains (add the hostname on the app and an A record at your DNS provider).
