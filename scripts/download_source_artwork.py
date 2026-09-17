"""Download the largest public Spotify episode artwork into the site.

This keeps source artwork locally available as provenance/reference material;
rendered episode thumbnails are generated separately by the imagegen profile.
"""
from __future__ import annotations

import json
import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
episodes = json.loads((ROOT / "data" / "episodes.json").read_text(encoding="utf-8"))
spotify = json.loads((ROOT / "research" / "spotify-episodes.json").read_text(encoding="utf-8"))
source_by_episode = {}
# Spotify's research IDs are Spotify episode IDs; the catalog uses stable IDs.
for episode in episodes:
    match = next(
        (re.search(r"/episode/([A-Za-z0-9]+)", source.get("url", ""))
         for source in episode.get("sources", [])
         if source.get("type") == "spotify"),
        None,
    )
    if match:
        source_by_episode[episode["id"]] = next(
            entry for entry in spotify if entry["id"] == match.group(1)
        )

out = ROOT / "assets" / "source-artwork"
out.mkdir(parents=True, exist_ok=True)
manifest = []
for episode_id, entry in source_by_episode.items():
    url = entry["visualIdentity"]["image"][1]["url"]
    target = out / f"{episode_id}.jpg"
    urllib.request.urlretrieve(url, target)
    manifest.append({"episodeId": episode_id, "path": f"assets/source-artwork/{target.name}", "sourceUrl": url})

(ROOT / "research" / "source-artwork.json").write_text(
    json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
)
print(f"downloaded {len(manifest)} source artworks")
