import {
  escapeHtml,
  filterEpisodes,
  getPlayableSource,
  sortEpisodes,
} from './js/archive.mjs';

const seriesLabels = {
  'sezon-1': 'Sezon 1',
  'sezon-2': 'Sezon 2',
  docinki: 'Docinki Niefiducjarne',
  'sezon-3': 'Sezon 3 / Laissez Faire',
};

const state = { episodes: [], series: 'all', query: '' };
const grid = document.querySelector('#episode-grid');
const count = document.querySelector('#archive-count');
const empty = document.querySelector('#empty-state');
const dialog = document.querySelector('#episode-dialog');
const dialogContent = document.querySelector('#dialog-content');
const template = document.querySelector('#episode-template');

function formatDate(date) {
  if (!date) return 'data nieznana';
  return new Intl.DateTimeFormat('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' })
    .format(new Date(`${date}T12:00:00Z`));
}

function renderEpisodes() {
  const filtered = sortEpisodes(filterEpisodes(state.episodes, state));
  grid.replaceChildren();
  grid.setAttribute('aria-busy', 'false');
  count.textContent = `${filtered.length} ${filtered.length === 1 ? 'pozycja' : filtered.length < 5 ? 'pozycje' : 'pozycji'}`;
  empty.hidden = filtered.length !== 0;

  filtered.forEach((episode) => {
    const card = template.content.firstElementChild.cloneNode(true);
    card.dataset.episodeId = episode.id;
    card.querySelector('.episode-index').textContent = episode.number;
    card.querySelector('.episode-meta').textContent = `${seriesLabels[episode.series]} / ${formatDate(episode.date)}`;
    card.querySelector('h3').textContent = episode.title;
    card.querySelector('.episode-summary').textContent = episode.summary;
    const topics = card.querySelector('.topic-list');
    episode.topics.slice(0, 4).forEach((topic) => {
      const item = document.createElement('li');
      item.textContent = topic;
      topics.append(item);
    });
    const button = card.querySelector('.card-action');
    button.setAttribute('aria-label', `Otwórz: ${episode.title}`);
    button.addEventListener('click', () => openEpisode(episode));
    grid.append(card);
  });
}

function sourceList(episode) {
  return episode.sources.map((source) => `
    <li>
      <a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.label)} ↗</a>
      ${source.note ? `<small>${escapeHtml(source.note)}</small>` : ''}
    </li>
  `).join('');
}

function playerMarkup(source, episode) {
  if (!source) {
    return `<div class="player-consent"><p>Pełny publiczny player nie przetrwał. Został ślad źródłowy, nie udajemy że to nagranie.</p></div>`;
  }
  return `
    <div class="player-consent" data-player-consent>
      <p>Player załaduje się dopiero po kliknięciu. Wtedy ${source.type === 'spotify' ? 'Spotify' : source.type === 'youtube' ? 'YouTube' : 'zewnętrzne archiwum'} może otrzymać Twój adres IP.</p>
      <button class="button button-primary" type="button" data-load-player="${escapeHtml(episode.id)}">Załaduj player</button>
    </div>
  `;
}

function embedPlayer(container, source) {
  if (source.type === 'spotify') {
    const id = source.url.split('/episode/')[1]?.split(/[?#]/)[0];
    container.innerHTML = `<iframe class="spotify-frame" title="Spotify: odtwarzacz odcinka" src="https://open.spotify.com/embed/episode/${escapeHtml(id)}?utm_source=generator" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`;
    return;
  }
  if (source.type === 'youtube') {
    const id = new URL(source.url).searchParams.get('v');
    container.innerHTML = `<iframe title="YouTube: odtwarzacz odcinka" src="https://www.youtube-nocookie.com/embed/${escapeHtml(id)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
    return;
  }
  container.innerHTML = `<video controls preload="metadata"><source src="${escapeHtml(source.url)}" type="video/mp4">Twoja przeglądarka nie odtwarza tego pliku.</video>`;
}

function openEpisode(episode) {
  const source = getPlayableSource(episode);
  const guest = episode.guest ? `<p><strong>Gość:</strong> ${escapeHtml(episode.guest)}</p>` : '';
  dialogContent.innerHTML = `
    <article class="dialog-body">
      <p class="dialog-number">${escapeHtml(seriesLabels[episode.series])} / ${escapeHtml(episode.number)} / ${formatDate(episode.date)}</p>
      <h2 id="dialog-title">${escapeHtml(episode.title)}</h2>
      ${guest}
      <p class="dialog-lead">${escapeHtml(episode.summary)}</p>
      ${episode.dateNote ? `<p><small>${escapeHtml(episode.dateNote)}</small></p>` : ''}
      <div class="player-shell">${playerMarkup(source, episode)}</div>
      <section class="source-ledger" aria-labelledby="sources-${escapeHtml(episode.id)}">
        <h3 id="sources-${escapeHtml(episode.id)}">Ślady źródłowe</h3>
        <ol>${sourceList(episode)}</ol>
      </section>
    </article>
  `;
  dialog.showModal();
  history.replaceState(null, '', `#${episode.id}`);
  const load = dialogContent.querySelector('[data-load-player]');
  load?.addEventListener('click', () => embedPlayer(dialogContent.querySelector('.player-shell'), source));
}

function closeEpisode() {
  dialog.close();
  if (location.hash && state.episodes.some((episode) => `#${episode.id}` === location.hash)) {
    history.replaceState(null, '', `${location.pathname}${location.search}`);
  }
}

document.querySelectorAll('[data-series]').forEach((button) => {
  button.addEventListener('click', () => {
    state.series = button.dataset.series;
    document.querySelectorAll('[data-series]').forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    renderEpisodes();
  });
});

document.querySelector('#episode-search').addEventListener('input', (event) => {
  state.query = event.target.value;
  renderEpisodes();
});

document.querySelector('[data-close-dialog]').addEventListener('click', closeEpisode);
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) closeEpisode();
});
dialog.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeEpisode();
});

document.querySelector('[data-open-latest]').addEventListener('click', () => {
  const [latest] = sortEpisodes(state.episodes);
  if (latest) openEpisode(latest);
});

async function init() {
  try {
    const response = await fetch('./data/episodes.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    state.episodes = await response.json();
    renderEpisodes();
    const deepLinked = state.episodes.find((episode) => `#${episode.id}` === location.hash);
    if (deepLinked) openEpisode(deepLinked);
  } catch (error) {
    grid.setAttribute('aria-busy', 'false');
    grid.innerHTML = `<article class="no-script"><h3>Archiwum chwilowo nie wstało.</h3><p>Otwórz <a href="https://open.spotify.com/show/7JKCgH1nxriBsh6y9JlfOY">kanał na Spotify</a> albo spróbuj ponownie.</p></article>`;
    count.textContent = 'błąd katalogu';
    console.error(error);
  }
}

init();
