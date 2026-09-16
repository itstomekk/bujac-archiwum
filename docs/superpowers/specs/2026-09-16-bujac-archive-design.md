# Bujać! Archive Website Design

## Purpose

Create a public, durable archive for the Polish Bitcoin podcast **Bujać!** that preserves its original voice while presenting it as a radical Polish underground publication rather than a generic podcast directory.

## Audience and primary action

The audience is Polish-speaking listeners interested in Bitcoin, Nostr, sovereignty, privacy, and independent media. The primary action is to find an episode and play it from its surviving public source.

## Content scope

- Recover all distinct public pages, episode records, media references, and site states visible in the Internet Archive for `bujac.pl` and its subdomains.
- Reconcile those records with public Spotify/Laissez Faire and YouTube episodes.
- Publish authorized archived text and imagery.
- Embed or link public audio/video rather than duplicating large audio files in GitHub.
- Preserve a machine-readable Wayback capture manifest for later migration.
- Mark source provenance and avoid inventing missing metadata.

## Architecture

The first release is framework-free static HTML, CSS, and JavaScript. Episode data lives in `data/episodes.json`; capture provenance lives in `data/wayback-manifest.json`. `app.js` renders filters, results, and episode details with progressive enhancement: the page retains a useful editorial shell without JavaScript.

A later Astro/Jekyll migration can consume the same JSON records without redesigning the content model.

## Information architecture

1. Cover: title, short thesis, latest recovered installment, listen action.
2. Manifest: edited archival copy beginning with “bo nikt nam nie może zabronić”.
3. Archive: season tabs, topic search, guest filter, episode cards.
4. Episode detail: date, guest, synopsis, topics, player/link, source ledger.
5. Independent infrastructure: Nostr/relay context, RSS, public archive links.
6. Footer: archival status, correction path, repository/source note.

## Visual brief

**Concept:** a forbidden independent-radio transmission printed as a Polish samizdat zine.

**Feeling:** urgent, physical, literate, rebellious, never nostalgic cosplay.

**Metaphor:** photocopied sheets pinned to a wall and repeatedly annotated by listeners.

**Composition:** asymmetric editorial grid, oversized condensed headlines, torn-rule separators, numbered cards, occasional rotated stamps. Information remains aligned to a strict underlying grid.

**Palette:** dirty paper `#f0eadb`, near-black `#11100d`, signal orange `#ff4d00`, muted graphite `#6a665c`.

**Typography:** system-safe condensed display stack with Arial Narrow/Roboto Condensed fallbacks; readable sans-serif body stack. No remote font dependency.

**Motion:** restrained reveal and ticker motion, disabled by `prefers-reduced-motion`.

**Avoid:** gradients, glassmorphism, neon cyberpunk, generic Bitcoin coin art, stock microphones, rounded SaaS cards, decorative dashboard UI, fake listener counts, and excessive animation.

## Accessibility and performance

- Semantic landmarks, heading order, visible focus, keyboard-operable filters.
- WCAG-aware contrast and minimum body size.
- Native lazy loading for media.
- No trackers, cookies, framework runtime, or third-party scripts except user-initiated media embeds.
- Responsive from 320px upward.

## Deployment

Create private GitHub repository `itstomekk/bujac-archiwum`. Deploy the static root with GitHub Pages if the account permits Pages from private repositories. If GitHub rejects that combination, keep source private and use a public deployment branch/repository only as the minimum necessary fallback, documenting the exact constraint.

## Verification

- Validate HTML structure and JSON schemas.
- Unit-test filtering, date ordering, source fallback, and escaped rendering.
- Run automated accessibility checks where available.
- Exercise mobile and desktop layouts in a real browser.
- Verify every public media link and all Wayback references.
- Read back the GitHub repository visibility, Pages configuration, workflow result, and live URL before delivery.
