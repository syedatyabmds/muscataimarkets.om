# muscataimarkets.om

Static source for **https://muscataimarkets.om**, served by Caddy on our EC2 host.

This repository is the source of truth for the site content. The live copy on the
server (`/opt/websites/sites/muscataimarkets.om/`) is a **deploy target** — do not
edit it by hand, edit here and deploy.

## Layout

```
.
├── index.html
├── styles.css
├── script.js
├── portfolio-data.js
├── assets/
│   ├── clients/       # client logos
│   ├── portfolio/     # project images
│   └── vendor/        # third-party css/js/fonts
└── .github/workflows/ # (planned) deploy workflow
```

## Deploying

Deployment is planned to be automatic: merging a pull request into `main` will
run a GitHub Action that syncs this repository's files to the live folder on the
server.

**Mapping rule:** the repository name is the domain and the live folder — this
repo deploys to `/opt/websites/sites/muscataimarkets.om/`.

Static content is served straight off the bind mount, so no web-server reload is
required for changes to take effect.

Until the workflow exists, deploy manually (from the server):

```bash
rsync -az --delete /home/ubuntu/work_area/muscataimarkets.om/ \
  /opt/websites/sites/muscataimarkets.om/
```

## Contributing

1. Branch off `main`.
2. Make changes.
3. Open a pull request.

Do not put internal notes, prompts, or docs (e.g. `AGENTS.md`, `CLAUDE.md`,
`notes.txt`) in this repository — everything here is published to the public
website.
