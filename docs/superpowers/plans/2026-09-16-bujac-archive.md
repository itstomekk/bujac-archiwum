# Bujać! Archive Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Recover the public Bujać! archive, build a framework-free counterculture podcast site, and publish it from a private GitHub repository.

**Architecture:** Static HTML/CSS/JavaScript renders a normalized episode catalog from JSON. A separate Wayback manifest records every capture and provenance reference so a later framework migration does not change the content model.

**Tech Stack:** HTML5, CSS3, ES modules, Node.js built-in test runner, Python standard library audit scripts, GitHub Actions, GitHub Pages.

---

### Task 1: Research and normalize the archive

**Files:**
- Create: `research/wayback-cdx.json`
- Create: `research/source-notes.md`
- Create: `data/wayback-manifest.json`
- Create: `data/episodes.json`
- Test: `tests/content.test.mjs`

- [ ] Save the complete uncollapsed Wayback CDX response for `bujac.pl` domain captures.
- [ ] Fetch every distinct archived HTML/XML/JSON document and extract episode titles, dates, descriptions, media URLs, guests, and source URLs.
- [ ] Reconcile season three records from Spotify/Laissez Faire and public video indexes.
- [ ] Write `tests/content.test.mjs` first, asserting unique episode IDs, chronological dates, valid source URLs, season grouping, and at least the 11 long episodes plus four Docinki visible in the January archive.
- [ ] Run `node --test tests/content.test.mjs` and confirm failure because the normalized files do not yet exist.
- [ ] Write normalized JSON records and rerun tests until green.

### Task 2: Build archive behavior test-first

**Files:**
- Create: `tests/archive.test.mjs`
- Create: `js/archive.mjs`

- [ ] Write failing tests for `filterEpisodes`, `sortEpisodes`, `getPlayableSource`, and safe text rendering.
- [ ] Run `node --test tests/archive.test.mjs` and confirm the module-not-found failure.
- [ ] Implement pure archive functions with no DOM dependency.
- [ ] Run the test suite and confirm all behavior tests pass.

### Task 3: Build the editorial site

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `app.js`
- Create: `assets/` recovered artwork files
- Create: `404.html`

- [ ] Create the semantic no-JavaScript shell and metadata.
- [ ] Implement the samizdat/xerox art direction from the approved design brief.
- [ ] Render archive controls and cards from `episodes.json` using the tested pure functions.
- [ ] Use click-to-load Spotify/YouTube embeds so initial page load remains private and fast.
- [ ] Add visible source/provenance links and archive status.
- [ ] Add reduced-motion, keyboard focus, and narrow-mobile rules.

### Task 4: Add automated verification and deployment

**Files:**
- Create: `scripts/audit.py`
- Create: `.github/workflows/test.yml`
- Create: `.github/workflows/pages.yml`
- Create: `.nojekyll`

- [ ] Write audit expectations for required files, valid internal references, HTML landmarks, image alt text, and JSON cross-references.
- [ ] Run the audit before implementation is complete and confirm it reports missing requirements.
- [ ] Complete deployment configuration for artifact-based GitHub Pages.
- [ ] Run `node --test tests/*.test.mjs` and `python scripts/audit.py` until both pass.
- [ ] Serve locally and verify HTTP 200 for the page, JSON, CSS, JavaScript, and artwork.

### Task 5: Visual critique and refinement

**Files:**
- Create: `docs/design/brief.md`
- Create: `docs/design/critic-notes.md`
- Create: `docs/design/screenshots/desktop.png`
- Create: `docs/design/screenshots/mobile.png`

- [ ] Capture desktop and mobile screenshots from the local site.
- [ ] Give a fresh visual critic only the screenshots and approved brief.
- [ ] Apply the highest-impact structural and detail corrections.
- [ ] Repeat once, then perform a removal pass for decorative clutter.
- [ ] Re-run functional, accessibility, responsive, and link checks.

### Task 6: Publish and verify remote state

**Files:**
- Modify: `README.md`
- Modify: `PLAN.md`
- Modify: `HANDOFF.md`

- [ ] Initialize Git with branch `main` and commit the verified site.
- [ ] Create private repository `itstomekk/bujac-archiwum` and push.
- [ ] Enable GitHub Pages through Actions.
- [ ] Verify repository visibility is private through `gh api`.
- [ ] Verify Pages deployment succeeds and fetch the live URL over HTTPS.
- [ ] Update project handoff and machine routing records, run the workspace refresh, and commit/push documentation changes.
