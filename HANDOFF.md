# HANDOFF — Bujać! Archiwum

**Updated:** 2026-09-16
**Local path:** `C:\Users\Lenovo\Documents\Claude\Projects\bujac-archiwum`
**Git:** local repository on `main`; one initial documentation commit exists. Site work is not yet committed or pushed.
**Remote:** not created
**Live URL:** not deployed

## Goal and approved direction

Publish a framework-free first release, then migrate later. The approved visual direction is Polish underground: xerox, samizdat, punk zine, brutalist typography. Repository must remain private. Do not ask design questions before finishing this first release.

## Current implementation

- Static site: `index.html`, `styles.css`, `app.js`, `404.html`.
- Testable behavior: `js/archive.mjs`.
- Catalog: `data/episodes.json` with 18 records:
  - Sezon 1: E01–E05
  - Sezon 2: E06–E11
  - Docinki Niefiducjarne: #001–#004
  - Sezon 3 / Laissez Faire: S03E01–S03E03
- Wayback ledger: `data/wayback-manifest.json` with all 115 successful captures returned by the uncollapsed domain CDX sweep.
- Research originals: `research/wayback-cdx.json`, `research/castr-rss-2025-10-02.xml`, `research/spotify-episodes.json`, `research/source-notes.md`.
- Recovered artwork: `assets/bujac-podcast.jpg`, `logo.png`, `about-img.png`, `scanner.png`, `relay-mark.png`.
- CI/deploy workflows: `.github/workflows/test.yml` and `.github/workflows/pages.yml`.
- Design/spec/plan: `docs/design/brief.md`, `docs/superpowers/specs/2026-09-16-bujac-archive-design.md`, `docs/superpowers/plans/2026-09-16-bujac-archive.md`.

## Verified state

Run from the project root:

```bash
node --test tests/*.test.mjs
```

Last result: **7/7 passed, 0 failed**.

```bash
python scripts/audit.py
```

Last result: **AUDIT PASSED**; 18 episode records; required files, HTML landmarks, alt text, local references, and source URLs valid.

A local server returned HTTP 200 for `/`, `styles.css`, `app.js`, both hero assets, `js/archive.mjs`, and `data/episodes.json`.

## Honest content decisions already encoded

- E01–E09 use original dates recovered from the archived Castr RSS.
- E11 uses the date shown on its archived page.
- E10's original date did not survive. Its card uses the later Spotify publication date and displays an explicit note.
- Spotify republications are labeled; they do not silently replace original dates.
- YouTube trailers/fragments are labeled as such.
- Missing media files are retained as source evidence with `playable: false`.
- Docinki #001–#003 survive only as homepage excerpts; the site says so.
- No episode metadata may be invented to smooth over gaps.

## Exact next tasks for a small model

Do these in order. Stop on a real blocker instead of changing scope.

### 1. Recheck the saved baseline

```bash
cd "C:/Users/Lenovo/Documents/Claude/Projects/bujac-archiwum"
git status --short
node --test tests/*.test.mjs
python scripts/audit.py
```

Expected: many untracked site files, 7 passing tests, audit passed.

### 2. Complete browser QA and screenshots

Start a local server:

```bash
python -m http.server 4173 --bind 127.0.0.1
```

Then inspect `http://127.0.0.1:4173` in a real browser at desktop and mobile widths. The previous `agent-browser` command timed out during screenshot automation, although the server log proved that the page and all required assets loaded. Diagnose with `agent-browser doctor --offline --quick` before retrying.

Required checks:

- 18 cards render.
- season filters and accent-insensitive search work.
- “Włącz najnowszy” opens S03E03.
- dialog closes by button, backdrop, and Escape.
- Spotify and YouTube embeds load only after consent click.
- mobile layout has no horizontal overflow at 360px.
- keyboard focus is visible.
- run `agent-browser a11y http://127.0.0.1:4173 --tags wcag2a,wcag2aa` if the browser starts.

Save screenshots as:

- `docs/design/screenshots/desktop.png`
- `docs/design/screenshots/mobile.png`

### 3. Run one independent visual critique

Give a fresh critic only the two screenshots and `docs/design/brief.md`. Ask for the three biggest structural/design problems. Apply only high-impact fixes, then rerun tests, audit, screenshots, and accessibility. Avoid adding generic decoration.

Write the final critique and applied fixes to `docs/design/critic-notes.md`.

### 4. Commit the verified local release

Before committing:

```bash
git diff --check
node --test tests/*.test.mjs
python scripts/audit.py
```

Then commit all project files. Do not include temporary browser state or local server logs.

### 5. Create the private GitHub repository and push

GitHub CLI is authenticated as `itstomekk` with `repo` and `workflow` scopes.

```bash
gh repo create bujac-archiwum --private --description "Niezależne archiwum podcastu Bujać!" --source . --push
```

Read back the exact remote state:

```bash
gh repo view itstomekk/bujac-archiwum --json nameWithOwner,visibility,url,defaultBranchRef
```

Do not make the repository public as a workaround.

### 6. Enable and verify GitHub Pages

The deployment workflow is `.github/workflows/pages.yml`. Enable Pages with GitHub Actions if it is not auto-enabled, then inspect workflow runs. GitHub may reject Pages from a private repository if this account plan does not support it. If that happens, record the exact API/workflow error and stop for a human decision. Do not silently create a public mirror.

Done requires all of these:

- repository visibility reads `PRIVATE`;
- Verify workflow passes;
- Pages workflow passes;
- the reported Pages URL returns HTTP 200 over HTTPS;
- the deployed page renders 18 cards.

### 7. Close project records only after deployment

- Update `PLAN.md` before this file.
- Add the live and repository URLs to `README.md` and this handoff.
- Add this project to `C:\Users\Lenovo\.agents\PORTFOLIO.md` and `PROJECT-ROUTING.md` only after the remote exists.
- Run `python C:\Users\Lenovo\.agents\refresh.py`.
- Commit and push the final documentation updates.

### 8. Report task usage after the site is live

In the final delivery, report:

- the number of model inferences for the complete task, including the two research subagents;
- approximate total input tokens sent;
- approximate total output tokens received;
- whether the figures are exact provider usage or estimates reconstructed from session/subagent logs.

Do not claim exact token totals unless the runtime/provider exposes exact usage. If only logs are available, state the counting method and label the result as an estimate.

## Constraints

- Preserve source provenance and uncertainty.
- Keep audio on public original hosts; do not add large audio files to Git.
- No trackers, cookies, external fonts, or framework runtime.
- Do not publish secrets or local temporary paths.
- Do not make the source repository public.
