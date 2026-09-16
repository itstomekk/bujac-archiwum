# Source notes

## Coverage

The recovery combines the Internet Archive CDX index for `bujac.pl` and subdomains, the archived Castr RSS feed, the January 2026 WordPress site, current Spotify embeds for the Laissez Faire show, and public YouTube records.

- Uncollapsed CDX sweep: 115 successful captures across 98 URLs.
- Original long-form catalog: E01–E11.
- WordPress short-form catalog: Docinek #001–#004.
- Later catalog on Laissez Faire: S03E01–S03E03, plus republications of E03–E11.

## Site generations

1. **Podpage / Castr, 2025:** homepage, About manifesto, RSS, E09 and E11 pages, Nostr-hosted video references.
2. **Custom WordPress, January 2026:** season navigation, four Docinki, custom theme and Nostr zap component.

## Important source distinctions

- The dates in the archived Castr RSS are treated as original publication dates for E01–E09.
- E11 uses the date rendered by its archived page.
- The original E10 date did not survive. Its catalog date is explicitly marked as the later Spotify publication date.
- Spotify republishes E03–E11 on dates different from the first archive publication.
- YouTube links shorter than a full conversation are labeled as trailers or fragments.
- A URL appearing in an archived RSS feed does not prove its media file survived. Sources with no preserved file are marked non-playable.

## Primary archive sources

- CDX inventory: `research/wayback-cdx.json`
- Archived Castr RSS: `research/castr-rss-2025-10-02.xml`
- Verified Spotify embed metadata: `research/spotify-episodes.json`
- Podpage homepage: https://web.archive.org/web/20251002091224id_/https://www.bujac.pl/
- Podpage manifesto: https://web.archive.org/web/20251002091606id_/https://www.bujac.pl/about/
- WordPress homepage: https://web.archive.org/web/20260120204029id_/https://www.bujac.pl/
- Docinek #004: https://web.archive.org/web/20260120203655id_/https://www.bujac.pl/004/
- Spotify show: https://open.spotify.com/show/7JKCgH1nxriBsh6y9JlfOY

## Gaps

- No separate archived HTML pages for E01–E08.
- No separate pages for Docinki #001–#003.
- No preserved original media file for E01, E02, E05, E06, E07, or E08.
- E10 survives as a menu item and later Spotify publication, but its first publication date and original description were not recovered.
