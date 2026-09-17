const sourcePriority = ['spotify', 'youtube', 'wayback', 'nostr', 'website'];

function normalize(value = '') {
  return value
    .toLocaleLowerCase('pl')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replaceAll('ł', 'l');
}

export function sortEpisodes(episodes) {
  return [...episodes].sort((a, b) => {
    if (a.date === null && b.date === null) return a.id.localeCompare(b.id, 'pl');
    if (a.date === null) return 1;
    if (b.date === null) return -1;
    return b.date.localeCompare(a.date);
  });
}

export function filterEpisodes(episodes, { series = 'all', query = '' } = {}) {
  const needle = normalize(query.trim());
  return episodes.filter((episode) => {
    if (series !== 'all' && episode.series !== series) return false;
    if (!needle) return true;
    const haystack = normalize([
      episode.title,
      episode.guest,
      episode.summary,
      episode.description,
      ...(episode.topics ?? []),
    ].filter(Boolean).join(' '));
    return haystack.includes(needle);
  });
}

export function getPlayableSource(episode) {
  const playable = (episode.sources ?? []).filter((source) => source.playable);
  return playable.sort((a, b) => sourcePriority.indexOf(a.type) - sourcePriority.indexOf(b.type))[0] ?? null;
}

export function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
