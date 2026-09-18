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

function formatDescription(description = '') {
  return escapeHtml(description)
    .split(/\n{2,}/)
    .filter(Boolean)
    .map((paragraph) => `<p>${paragraph.replaceAll('\n', '<br>')}</p>`)
    .join('');
}

function bindArtworkSwap(card, artwork, artworkButton, episode) {
  const defaultArtwork = artwork.src;
  const hoverArtwork = `assets/generated/no-text/${episode.id}.png`;
  let showingHoverArtwork = false;
  artwork.dataset.hoverSrc = hoverArtwork;

  const setArtwork = (showHoverArtwork) => {
    if (showHoverArtwork === showingHoverArtwork) return;
    showingHoverArtwork = showHoverArtwork;
    artwork.src = showHoverArtwork ? hoverArtwork : defaultArtwork;
  };

  card.addEventListener('pointerenter', () => setArtwork(true));
  card.addEventListener('pointerleave', () => setArtwork(false));
  artworkButton.addEventListener('focus', () => setArtwork(true));
  artworkButton.addEventListener('blur', () => setArtwork(false));
  artwork.addEventListener('error', () => {
    if (showingHoverArtwork) {
      showingHoverArtwork = false;
      artwork.src = defaultArtwork;
    }
  });
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
    const artwork = card.querySelector('.episode-artwork');
    artwork.src = episode.artwork ?? `assets/episodes/${episode.id}.png`;
    artwork.alt = `Grafika odcinka: ${episode.title}`;
    const artworkButton = card.querySelector('.artwork-button');
    const cardPlayer = card.querySelector('[data-card-player]');
    bindArtworkSwap(card, artwork, artworkButton, episode);
    artworkButton.setAttribute('aria-label', `Odtwórz: ${episode.title}`);
    artworkButton.addEventListener('click', () => {
      const isOpen = !cardPlayer.hidden;
      document.querySelectorAll('[data-card-player]:not([hidden])').forEach((player) => {
        player.hidden = true;
        player.replaceChildren();
        player.closest('.episode-card')?.querySelector('.artwork-button')?.setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        cardPlayer.hidden = false;
        artworkButton.setAttribute('aria-expanded', 'true');
        embedPlayer(cardPlayer, getPlayableSource(episode));
      }
    });
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
      <a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.type === 'wayback' ? 'Lokalny zapis źródłowy' : source.label)} ↗</a>
      ${source.note ? `<small>${escapeHtml(source.note)}</small>` : ''}
    </li>
  `).join('');
}

function playerMarkup(source, episode) {
  if (!source) {
    return `<div class="player-missing"><p>Pełny publiczny player nie przetrwał. Został ślad źródłowy, nie udajemy że to nagranie.</p></div>`;
  }
  return `<div class="player-inline" data-auto-player aria-label="Odtwarzacz ładowany inline"></div>`;
}

function embedPlayer(container, source) {
  if (!source) {
    container.innerHTML = '<p class="player-missing-copy">Pełny publiczny player nie zachował się dla tego odcinka.</p>';
    return;
  }
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
      ${episode.description ? `<section class="episode-description" aria-labelledby="description-${escapeHtml(episode.id)}"><h3 id="description-${escapeHtml(episode.id)}">Pełny opis</h3>${formatDescription(episode.description)}<p class="description-source"><small>Źródło: ${episode.descriptionSourceType === 'spotify' ? `<a href="${escapeHtml(episode.descriptionSourceUrl)}" target="_blank" rel="noreferrer">Spotify ↗</a>` : 'lokalny zapis źródłowy w repozytorium'}</small></p></section>` : '<p class="description-missing"><small>Pełny opis nie zachował się w dostępnych publicznych źródłach.</small></p>'}
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
  const inlinePlayer = dialogContent.querySelector('[data-auto-player]');
  if (inlinePlayer) embedPlayer(inlinePlayer, source);
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

async function loadEpisodes() {
  const url = new URL('data/episodes.json', document.baseURI);
  url.searchParams.set('v', '1');
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function init() {
  try {
    state.episodes = await loadEpisodes();
    renderEpisodes();
    const deepLinked = state.episodes.find((episode) => `#${episode.id}` === location.hash);
    if (deepLinked) openEpisode(deepLinked);
  } catch (error) {
    grid.setAttribute('aria-busy', 'false');
    grid.innerHTML = `<article class="no-script"><h3>Nie udało się wczytać odcinków.</h3><p>Ta strona musi działać przez HTTPS lub lokalny serwer, nie jako plik <code>file://</code>. <button class="text-link retry-load" type="button" data-retry-load>Spróbuj ponownie ↻</button></p></article>`;
    count.textContent = 'błąd ładowania';
    grid.querySelector('[data-retry-load]')?.addEventListener('click', () => {
      grid.innerHTML = '';
      count.textContent = 'Ładowanie katalogu…';
      init();
    });
    console.error(error);
  }
}

function renderLightningQr(container, payload) {
  if (!container || typeof window.qrcode !== 'function') return;
  container.replaceChildren();
  const qr = window.qrcode(0, 'M');
  qr.addData(payload);
  qr.make();
  container.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 2 });
}

async function requestLightningInvoice(address, amountSats) {
  const [name, domain] = address.split('@');
  const lnurl = await fetch(`https://${domain}/.well-known/lnurlp/${name}`, { cache: 'no-store' });
  if (!lnurl.ok) throw new Error(`LNURL HTTP ${lnurl.status}`);
  const meta = await lnurl.json();
  if (meta.status === 'ERROR') throw new Error(meta.reason ?? 'LNURL error');
  const amountMsat = Math.round(amountSats * 1000);
  const callbackUrl = new URL(meta.callback);
  callbackUrl.searchParams.set('amount', String(amountMsat));
  const invoiceResponse = await fetch(callbackUrl, { cache: 'no-store' });
  if (!invoiceResponse.ok) throw new Error(`Callback HTTP ${invoiceResponse.status}`);
  const invoiceData = await invoiceResponse.json();
  if (invoiceData.status === 'ERROR' || !invoiceData.pr) throw new Error(invoiceData.reason ?? 'Brak faktury');
  return invoiceData.pr;
}

function initLightningDonation() {
  const lightningAddress = 'sats@bujac.pl';
  const qrContainer = document.querySelector('#lightning-qr');
  const weblnButton = document.querySelector('#webln-zap');
  renderLightningQr(qrContainer, `lightning:${lightningAddress}`);

  weblnButton.addEventListener('click', async () => {
    weblnButton.disabled = true;
    const originalLabel = weblnButton.textContent;
    weblnButton.textContent = 'Łączenie z portfelem…';
    try {
      await window.webln.enable();
      const invoice = await requestLightningInvoice(lightningAddress, 1000);
      weblnButton.textContent = 'Potwierdź w portfelu…';
      await window.webln.sendPayment(invoice);
      weblnButton.textContent = 'Dzięki! Zap wysłany ⚡';
    } catch (error) {
      console.error(error);
      weblnButton.textContent = 'Nie udało się. Spróbuj portfela ↗';
    } finally {
      weblnButton.disabled = false;
      setTimeout(() => {
        weblnButton.textContent = originalLabel;
      }, 4000);
    }
  });

  const revealIfAvailable = () => {
    if (!window.webln || !weblnButton.hidden) return false;
    weblnButton.hidden = false;
    return true;
  };
  if (revealIfAvailable()) return;
  let attempts = 0;
  const pollId = setInterval(() => {
    attempts += 1;
    if (revealIfAvailable() || attempts >= 10) clearInterval(pollId);
  }, 300);
}

init();
initLightningDonation();
