# Bujać! Archiwum

A framework-free public archive and listening page for the Polish Bitcoin podcast **Bujać!**.

## Local preview

```bash
python -m http.server 4173
```

Then open `http://localhost:4173`.

## Tests

```bash
node --test tests/*.test.mjs
python scripts/audit.py
```

## Structure

- `data/episodes.json` - normalized episode catalog
- `data/wayback-manifest.json` - archived capture ledger
- `research/` - source inventory and recovery notes
- `js/archive.mjs` - testable filtering and source selection
- `index.html`, `styles.css`, `app.js` - production site

## Repository and deployment

The source repository is public:

`https://github.com/itstomekk/bujac-archiwum`

The live site is deployed with GitHub Pages:

`https://itstomekk.github.io/bujac-archiwum/`

Pages uses the GitHub Actions workflow with HTTPS enforced.
