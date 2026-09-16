# HANDOFF — Bujać! Archiwum

**Updated:** 2026-09-16
**Local path:** `C:\Users\Lenovo\Documents\Claude\Projects\bujac-archiwum`
**Git:** local repository on `main`; source is pushed to the private `origin` remote.
**Remote:** `https://github.com/itstomekk/bujac-archiwum`
**Live URL:** not deployed; GitHub Pages is blocked by the account plan for private repositories.

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

Browser QA completed on the local server at desktop and mobile widths:

- 18 cards render; season filters return the expected counts (Sezon 1: 5); accent-insensitive search returns the Łukasz episode.
- “Włącz najnowszy” opens S03E03; dialog closes with Escape and backdrop click.
- Player iframe count is 0 before consent and 1 after “Załaduj player”.
- Mobile viewport 360px has `scrollWidth === 360`; keyboard focus is visible.
- axe 4.12.1 reports **0 WCAG 2A/2AA violations** (one contrast check remains incomplete because the design uses textured gradients/pseudo-elements).
- Screenshots are saved at `docs/design/screenshots/desktop.png` and `docs/design/screenshots/mobile.png`.

The source repository is private and pushed to GitHub. A GitHub Pages workflow was attempted, but the account returned: `Your current plan does not support GitHub Pages for this repository.` No public deployment exists yet.

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

### 2. Browser QA and screenshots — COMPLETE

The local server was tested with `agent-browser` at desktop and 360px mobile widths. All required functional checks and the axe WCAG scan passed; the two screenshots are present under `docs/design/screenshots/`.

### 3. Independent visual critique — COMPLETE

The critic used only the approved brief and the desktop/mobile screenshots. Three high-impact issues were recorded in `docs/design/critic-notes.md`: mobile intrinsic-width overflow, long display-heading overflow, and a non-focusable horizontal broadcast strip. The fixes were applied and all browser checks were rerun.

### 4. Commit the verified local release — PENDING

Before committing:

```bash
git diff --check
node --test tests/*.test.mjs
python scripts/audit.py
```

Then commit the accessibility fix, screenshots, and project-record updates. Do not include temporary browser state or local server logs.

### 5. Private GitHub repository — COMPLETE

The private repository exists and the current committed source is pushed to:

`https://github.com/itstomekk/bujac-archiwum`

### 6. Public deployment — BLOCKED

The deployment workflow is `.github/workflows/pages.yml`. GitHub Actions verification passed, but Pages deployment failed because the account plan does not support Pages for private repositories. Do not make the source repository public or silently create a public mirror. Choose an alternative host or upgrade the GitHub plan before continuing.

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
