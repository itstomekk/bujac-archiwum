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
