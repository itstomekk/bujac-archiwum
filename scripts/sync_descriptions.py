"""Merge verified local description research into the episode catalog.

The research file stores the source text and provenance. This script copies
those fields into data/episodes.json so the public site never depends on a
remote player for episode descriptions. It intentionally preserves null for
records where no complete public description was found.
"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
episodes_path = ROOT / "data" / "episodes.json"
research_path = ROOT / "research" / "full-descriptions.json"

with episodes_path.open(encoding="utf-8") as handle:
    episodes = json.load(handle)
with research_path.open(encoding="utf-8") as handle:
    descriptions = {entry["id"]: entry for entry in json.load(handle)}

for episode in episodes:
    source = descriptions.get(episode["id"])
    if source is None:
        raise SystemExit(f"Missing description research for {episode['id']}")
    episode["description"] = source.get("description")
    episode["descriptionSourceUrl"] = source.get("descriptionSourceUrl")
    episode["descriptionSourceType"] = source.get("descriptionSourceType")
    episode["descriptionRetrievedAt"] = source.get("retrievedAt")
    episode["descriptionNotes"] = source.get("notes")

with episodes_path.open("w", encoding="utf-8", newline="\n") as handle:
    json.dump(episodes, handle, ensure_ascii=False, indent=2)
    handle.write("\n")

print(f"synced {len(episodes)} episodes; complete descriptions: "
      f"{sum(bool(item.get('description')) for item in episodes)}")
