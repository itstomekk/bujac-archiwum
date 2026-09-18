import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);

async function loadJson(path) {
  return JSON.parse(await readFile(new URL(path, root), 'utf8'));
}

test('episode catalog preserves all recovered series', async () => {
  const episodes = await loadJson('data/episodes.json');
  assert.equal(episodes.length, 18);
  const ids = new Set(episodes.map((episode) => episode.id));
  assert.equal(ids.size, episodes.length);
  assert.equal(episodes.filter((episode) => episode.series === 'sezon-1').length, 5);
  assert.equal(episodes.filter((episode) => episode.series === 'sezon-2').length, 6);
  assert.equal(episodes.filter((episode) => episode.series === 'docinki').length, 4);
  assert.equal(episodes.filter((episode) => episode.series === 'sezon-3').length, 3);
});

test('episode records carry honest dates and public sources', async () => {
  const episodes = await loadJson('data/episodes.json');
  for (const episode of episodes) {
    assert.match(episode.id, /^[a-z0-9-]+$/);
    assert.ok(episode.title.length > 8);
    assert.ok(Array.isArray(episode.topics));
    assert.ok(Array.isArray(episode.sources));
    assert.ok(episode.sources.length > 0);
    if (episode.date !== null) assert.match(episode.date, /^\d{4}-\d{2}-\d{2}$/);
    for (const source of episode.sources) {
      assert.doesNotThrow(() => new URL(source.url));
      assert.ok(['spotify', 'youtube', 'wayback', 'nostr', 'website'].includes(source.type));
      assert.equal(typeof source.playable, 'boolean');
    }
  }
});

test('Wayback manifest records every successful domain capture', async () => {
  const cdx = await loadJson('research/wayback-cdx.json');
  const manifest = await loadJson('data/wayback-manifest.json');
  assert.equal(manifest.length, cdx.length - 1);
  assert.ok(manifest.length >= 100);
  for (const capture of manifest) {
    assert.match(capture.timestamp, /^\d{14}$/);
    assert.equal(capture.status, 200);
    assert.ok(capture.waybackUrl.startsWith('https://web.archive.org/web/'));
  }
});

test('transferred source text is local and the old external prompt is gone', async () => {
  const sourceText = await readFile(new URL('content/po-co-to-jest.md', root), 'utf8');
  const sourcePage = await readFile(new URL('po-co-to-jest.html', root), 'utf8');
  const index = await readFile(new URL('index.html', root), 'utf8');
  assert.match(sourceText, /Internet należy do nas\./);
  assert.match(sourcePage, /Internet należy do nas\./);
  assert.doesNotMatch(index, /Czytaj oryginał w Wayback Machine/);
});

test('full descriptions are local, sourced, and synchronized', async () => {
  const episodes = await loadJson('data/episodes.json');
  const research = await loadJson('research/full-descriptions.json');
  const byId = new Map(research.map((entry) => [entry.id, entry]));
  assert.equal(byId.size, episodes.length);
  assert.equal(episodes.filter((episode) => episode.description).length, 15);
  for (const episode of episodes) {
    const source = byId.get(episode.id);
    assert.ok(source);
    assert.equal(episode.description, source.description);
    assert.equal(episode.descriptionSourceType, source.descriptionSourceType);
    if (episode.description) assert.ok(episode.description.length >= 400);
  }
});

test('Bitcoin support details are visible in the page', async () => {
  const index = await readFile(new URL('index.html', root), 'utf8');
  assert.match(index, /bc1q8m269ngu09zt4cg2menjts9vprpf2hf69wddad/);
  assert.match(index, /sats@bujac\.pl/);
  assert.match(index, /lightning-qr/);
  assert.match(index, /webln-zap/);
});

test('footer links to the GitHub repo and Nostr profile', async () => {
  const index = await readFile(new URL('index.html', root), 'utf8');
  assert.match(index, /https:\/\/github\.com\/itstomekk\/bujac-archiwum/);
  assert.match(index, /nostr:npub1adsudqw8jge35ff5g8vc7q6xqugpza3cxmaqm6fgk4uv0nd50gms4hn7pf/);
});

test('every episode has a local generated thumbnail', async () => {
  const episodes = await loadJson('data/episodes.json');
  const manifest = await loadJson('research/generated-artwork.json');
  assert.equal(manifest.length, 18);
  assert.equal(new Set(manifest.map((entry) => entry.id)).size, 18);
  for (const episode of episodes) {
    assert.equal(episode.artwork, `assets/episodes/${episode.id}.png`);
    const image = await readFile(new URL(episode.artwork, root));
    assert.deepEqual([...image.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
    assert.equal(image.readUInt32BE(16), 1024);
    assert.equal(image.readUInt32BE(20), 1024);
  }
});

test('every episode has a no-text hover artwork', async () => {
  const episodes = await loadJson('data/episodes.json');
  const manifest = await loadJson('research/codex-generated-urls-no-text.json');
  assert.equal(manifest.length, episodes.length);
  assert.ok(manifest.every((entry) => entry.imageUrl.startsWith('assets/generated/no-text/')));
  assert.ok(manifest.every((entry) => !/[A-Za-z]:[\\/]|Users[\\/]Lenovo|AppData|Documents/.test(JSON.stringify(entry))));
  for (const episode of episodes) {
    const image = await readFile(new URL(`assets/generated/no-text/${episode.id}.png`, root));
    assert.deepEqual([...image.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
    assert.equal(image.readUInt32BE(16), image.readUInt32BE(20));
    assert.ok(image.readUInt32BE(16) >= 1024);
  }
});

test('episode players load inline when a dialog opens', async () => {
  const app = await readFile(new URL('app.js', root), 'utf8');
  assert.match(app, /data-auto-player/);
  assert.doesNotMatch(app, /data-load-player/);
});

test('episode artwork swaps to the no-text variant on hover and focus', async () => {
  const app = await readFile(new URL('app.js', root), 'utf8');
  assert.match(app, /assets\/generated\/no-text\/\$\{episode\.id\}\.png/);
  assert.match(app, /card\.addEventListener\('pointerenter'/);
  assert.match(app, /artworkButton\.addEventListener\('focus'/);
  assert.match(app, /artwork\.addEventListener\('error'/);
});

test('episode artwork opens a compact card player and community links exist', async () => {
  const index = await readFile(new URL('index.html', root), 'utf8');
  const app = await readFile(new URL('app.js', root), 'utf8');
  assert.match(index, /https:\/\/t\.me\/DwadziesciaJeden/);
  assert.match(index, /Bitcoin FilmFest 2027/);
  assert.match(index, /https:\/\/bitcoinwalk\.org\/warszawa\//);
  assert.match(index, /data-card-player/);
  assert.match(app, /cardPlayer\.hidden = false/);
  assert.match(app, /getPlayableSource\(episode\)/);
});
