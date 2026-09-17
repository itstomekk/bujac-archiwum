# HANDOFF — Bujać! / odcinki i rozmowy

**Updated:** 2026-09-16
**Local path:** `C:\Users\Lenovo\Documents\Claude\Projects\bujac-archiwum`
**Git:** local repository on `main`; source is pushed to the public `origin` remote.
**Remote:** `https://github.com/itstomekk/bujac-archiwum`
**Live URL:** `https://itstomekk.github.io/bujac-archiwum/` (GitHub Pages, HTTPS enforced)

## Goal and approved direction

Publish a framework-free first release, then migrate later. The approved visual direction is Polish underground: xerox, samizdat, punk zine, brutalist typography. The source repository is public by the owner's instruction on 2026-09-16; keep all secrets and private operational data out of it.

## Current implementation

- Static site: `index.html`, `styles.css`, `app.js`, `404.html`.
- Full transferred source text: `content/po-co-to-jest.md` and `po-co-to-jest.html`.
- Testable behavior: `js/archive.mjs`.
- Catalog: `data/episodes.json` with 18 records:
  - Sezon 1: E01–E05
  - Sezon 2: E06–E11
  - Docinki Niefiducjarne: #001–#004
  - Sezon 3 / Laissez Faire: S03E01–S03E03
- Wayback ledger: `data/wayback-manifest.json` with all 115 successful captures returned by the uncollapsed domain CDX sweep.
- Research originals: `research/wayback-cdx.json`, `research/castr-rss-2025-10-02.xml`, `research/spotify-episodes.json`, `research/source-notes.md`.
- Local full descriptions: `research/full-descriptions.json` and synchronized description fields in `data/episodes.json` (15 complete, 3 honestly missing).
- Generated artwork: `assets/episodes/` contains 18 verified 1024×1024 PNG thumbnails; `research/generated-artwork.json` and `research/codex-generated-urls.json` record provenance.
- Source artwork: `assets/source-artwork/` contains 12 downloaded Spotify covers with `research/source-artwork.json` provenance.
- Recovered site artwork: `assets/bujac-podcast.jpg`, `logo.png`, `about-img.png`, `scanner.png`, `relay-mark.png`.
- CI/deploy workflows: `.github/workflows/test.yml` and `.github/workflows/pages.yml`.
- Design/spec/plan: `docs/design/brief.md`, `docs/superpowers/specs/2026-09-16-bujac-archive-design.md`, `docs/superpowers/plans/2026-09-16-bujac-archive.md`.

## Verified state

Run from the project root:

```bash
node --test tests/*.test.mjs
```

Last result: **12/12 passed, 0 failed**.

```bash
python scripts/audit.py
```

Last result: **AUDIT PASSED**; 18 episode records; required files, HTML landmarks, alt text, local references, and source URLs valid.

Browser QA completed on the local server at desktop and mobile widths:

- 18 cards render; season filters return the expected counts (Sezon 1: 5); accent-insensitive search returns the Łukasz episode.
- “Włącz najnowszy” opens S03E03; dialog closes with Escape and backdrop click.
- Player loads inline automatically when an episode dialog opens; the index itself does not load external players.
- Bitcoin support section exposes the public on-chain address and Lightning Address.
- Every episode card has a local generated thumbnail; thumbnails were generated via the `image_gen` builtin through `openai-codex` and checked before import.
- Clicking a thumbnail opens one compact inline player at the bottom of that card; clicking another thumbnail closes the previous card player.
- “W drodze” links to the Dwadzieścia Jeden Telegram group and Warsaw Bitcoin Walks, and lists Bitcoin FilmFest 2027 (24–27 June, Warsaw).
- Mobile viewport 360px has `scrollWidth === 360`; keyboard focus is visible.
- axe 4.12.1 reports **0 WCAG 2A/2AA violations** (one contrast check remains incomplete because the design uses textured gradients/pseudo-elements).
- The page uses the logo orange `#f7941e`, rough paper/halftone treatment, shorter copy, and three recovered source graphics in the trace section.
- The full “Po Co To Jest?” text is available locally at `po-co-to-jest.html`; the old external reading prompt is gone.
- Screenshots are saved at `docs/design/screenshots/desktop.png` and `docs/design/screenshots/mobile.png`.

The source repository is public and pushed to GitHub. Pages is configured for the `workflow` build type, HTTPS is enforced, and the deployed site is live at `https://itstomekk.github.io/bujac-archiwum/`. The latest `Deploy GitHub Pages` workflow completed successfully.

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

Expected: clean working tree after the documentation sync, 7 passing tests, audit passed.

### 2. Browser QA and screenshots — COMPLETE

The local server was tested with `agent-browser` at desktop and 360px mobile widths. All required functional checks and the axe WCAG scan passed; the two screenshots are present under `docs/design/screenshots/`.

### 3. Independent visual critique — COMPLETE

The critic used only the approved brief and the desktop/mobile screenshots. Three high-impact issues were recorded in `docs/design/critic-notes.md`: mobile intrinsic-width overflow, long display-heading overflow, and a non-focusable horizontal broadcast strip. The fixes were applied and all browser checks were rerun.

### 4. Commit the verified local release — COMPLETE

The verified local release, screenshots, critique, accessibility fix, and project-record updates are committed as `070f788` and pushed to `origin/main`. The public deployment documentation update is committed as `abd4cc9` and pushed to `origin/main`. No temporary browser state or local server logs were included.

### 5. Public GitHub repository — COMPLETE

The public repository exists and the current committed source is pushed to:

`https://github.com/itstomekk/bujac-archiwum`

### 6. GitHub Pages deployment — COMPLETE

Pages is configured with `build_type: workflow`, source branch `main`, path `/`, and HTTPS enforcement. The latest `Deploy GitHub Pages` workflow passed, and the live page returned HTTP 200 with 18 rendered cards.

### 7. Close project records after deployment — COMPLETE

- `PLAN.md`, `README.md`, `HANDOFF.md`, and `ORGANIZATION-LOG.md` contain the live and repository URLs.
- The project is listed in `C:\Users\Lenovo\.agents\PORTFOLIO.md` and `PROJECT-ROUTING.md`.
- `python C:\Users\Lenovo\.agents\refresh.py` was run after the map update.
- Final documentation updates remain to be committed and pushed.

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
- The source repository is public by the owner's instruction; never publish secrets, cookies, credentials, or private operational data.
