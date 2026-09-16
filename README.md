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

The source repository is private:

`https://github.com/itstomekk/bujac-archiwum`

A public deployment is not live yet. GitHub Pages rejected the private repository because the current account plan does not support Pages for private repositories. Do not make the source repository public as a workaround.
