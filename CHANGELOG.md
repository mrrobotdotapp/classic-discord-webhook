# Changelog

All notable changes to this project will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to [Semantic Versioning](https://semver.org/).

---

## [2.0.0] — 2026-05-27

### Breaking Changes

- Message format switched from Discord Embeds to **Components v2** (Container + TextDisplay + Separator)
- `discord.js` removed — replaced by native `fetch` (Node 20), no external Discord dependency
- Source converted to **ES Modules** (`import`/`export`)

### Added

- `build.yml` CI workflow: auto-rebuilds `dist/index.js` on push to `main` when source changes, commits with `[skip ci]`
- `commitlint` + `husky` `commit-msg` hook enforcing Conventional Commits
- `CLAUDE.md` for AI agents: project context, commit convention, build and test instructions
- `bug_report.yml` issue template
- `CHANGELOG.md`

### Changed

- Bundler: `ncc` → `esbuild` (~30ms build, handles ESM-native packages)
- `@actions/core` 1.10.1 → 3.0.1
- `@actions/github` 6.0.0 → 9.1.1
- Commit subject max length: 40 → 72 chars (Git convention)
- Commit link format: `` `sha` [message](url) `` → `` [`sha`](<url>) message ``
- Footer: `⚡ Edited by @user` → `By @user · repo`
- `console.log` → `core.info` / `core.setFailed`
- `action.yml`: improved description and input descriptions
- `README.md`: full rewrite — quick start, 3-step setup, inputs table
- `SECURITY.md`: replaced broken version table, added GitHub Security Advisories link
- `tests/test.js`: credentials moved to env vars (`DISCORD_WEBHOOK_ID`, `DISCORD_WEBHOOK_TOKEN`)
- `.eslintrc.json`: `sourceType: "module"`, `ecmaVersion: 2022`, `fetch` global

### Fixed

- `for...in` on array in changelog builder
- `reject(error.message)` causing `err.message = undefined` in catch handler
- `require('../src/discord.js')` incorrect relative path
- `icon_url` field name (was `iconURL`, wrong for raw Discord API)
- Removed unused `new Promise()` anti-pattern wrapping an already-Promise API

### Removed

- `discord.js`, `child-process-promise`, `xml-library` (−43 packages)
- Orphan CI job mixed into `discord-push.yml`
- Manual build instructions from README (`ncc build` was developer-facing)

---

## [1.0.0] — 2022-10-01

Initial release.
