# CLAUDE.md

## Project

GitHub Action that sends a formatted Discord message on every push. Uses Discord Components v2 via native `fetch` (Node 20) — no external Discord library.

Two source files:
- `src/index.js` — entry point, reads GitHub Actions inputs and context
- `src/discord.js` — builds the Components v2 payload and POSTs to the Discord webhook API

The `dist/index.js` is the bundled output (esbuild, CJS) committed to the repo. GitHub Actions runs it directly.

## Commit convention

**Mandatory.** All commits must follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <description>

Types: feat | fix | docs | style | refactor | perf | test | build | ci | chore | revert
```

Enforced locally by commitlint + husky (`commit-msg` hook).

Examples:
- `feat: add support for threadId`
- `fix: handle null author in payload`
- `chore: rebuild dist`
- `docs: update README setup steps`

## Build

After any change to `src/**`:

```bash
npm run build
```

This bundles `src/index.js` into `dist/index.js`. Always commit the updated dist — the GitHub Actions runner executes it directly.

In CI, `build.yml` does this automatically on push to `main`.

## Tests

```bash
DISCORD_WEBHOOK_ID=... DISCORD_WEBHOOK_TOKEN=... node tests/test.js
```

Sends 5 real messages to the webhook. Covers: single commit, long message, null author, 11 commits (truncation), mixed.
