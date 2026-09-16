import test from 'node:test';
import assert from 'node:assert/strict';
import {
  escapeHtml,
  filterEpisodes,
  getPlayableSource,
  sortEpisodes,
} from '../js/archive.mjs';

const episodes = [
  { id: 'older', date: '2025-06-25', title: 'NOSTR i wolność', guest: 'Saunter', topics: ['nostr'], series: 'sezon-1', sources: [{ type: 'wayback', playable: false, url: 'https://example.com/archive' }] },
  { id: 'newer', date: '2026-07-24', title: 'Wolność wypowiedzi', guest: 'Gracjan', topics: ['prawo', 'bitcoin'], series: 'sezon-3', sources: [{ type: 'spotify', playable: true, url: 'https://open.spotify.com/episode/abc' }] },
  { id: 'unknown', date: null, title: 'Komedia i pomidory', guest: 'Łukasz', topics: ['komedia'], series: 'sezon-2', sources: [{ type: 'youtube', playable: true, url: 'https://youtube.com/watch?v=abc' }] },
];

test('sortEpisodes places newest known dates first and unknown dates last', () => {
  assert.deepEqual(sortEpisodes(episodes).map(({ id }) => id), ['newer', 'older', 'unknown']);
});

test('filterEpisodes combines series and accent-insensitive text search', () => {
  assert.deepEqual(filterEpisodes(episodes, { series: 'sezon-3', query: 'wolnosc' }).map(({ id }) => id), ['newer']);
  assert.deepEqual(filterEpisodes(episodes, { series: 'all', query: 'lukasz' }).map(({ id }) => id), ['unknown']);
});

test('getPlayableSource prefers Spotify then YouTube then another playable source', () => {
  const sources = [
    { type: 'wayback', playable: true, url: 'https://example.com/video.mp4' },
    { type: 'youtube', playable: true, url: 'https://youtube.com/watch?v=x' },
    { type: 'spotify', playable: true, url: 'https://open.spotify.com/episode/x' },
  ];
  assert.equal(getPlayableSource({ sources }).type, 'spotify');
  assert.equal(getPlayableSource({ sources: sources.slice(0, 2) }).type, 'youtube');
  assert.equal(getPlayableSource({ sources: [{ type: 'wayback', playable: false, url: 'https://example.com' }] }), null);
});

test('escapeHtml neutralizes markup before card rendering', () => {
  assert.equal(escapeHtml('<img src=x onerror=alert(1)>'), '&lt;img src=x onerror=alert(1)&gt;');
});
