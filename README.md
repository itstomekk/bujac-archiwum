# Bujać! — odcinki i rozmowy

A framework-free public listening page for the Polish Bitcoin podcast **Bujać!**.

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
- `data/wayback-manifest.json` - capture ledger and provenance
- `research/full-descriptions.json` - verified full descriptions and source metadata
- `research/source-artwork.json` - downloaded Spotify artwork provenance
- `assets/source-artwork/` - local copies of public Spotify artwork
- `assets/episodes/` - generated episode thumbnails (imported only as a complete 18/18 batch)
- `content/po-co-to-jest.md` - full transferred source text
- `po-co-to-jest.html` - local full-text page
- `research/` - source inventory and recovery notes
- `js/archive.mjs` - testable filtering and source selection
- `index.html`, `styles.css`, `app.js` - production site

Episode descriptions are served from the local catalog. Fifteen complete
descriptions were verified against public RSS/Spotify metadata; three docinki
have no complete public description and are marked honestly in the dialog.
Large public MP4 files are used only as image-generation references when they
can be read, not copied into the repository.

## Repository and deployment

The source repository is public:

`https://github.com/itstomekk/bujac-archiwum`

The live site is deployed with GitHub Pages:

`https://itstomekk.github.io/bujac-archiwum/`

Pages uses the GitHub Actions workflow with HTTPS enforced.
