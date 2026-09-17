"""Rebuild the research description ledger from the verified catalog.

Use this after a scraper writes an incomplete or shorter candidate file. The
catalog is the checked copy: Spotify descriptions were compared byte-for-byte
with public meta descriptions before this export.
"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
episodes = json.loads((ROOT / "data" / "episodes.json").read_text(encoding="utf-8"))
research = [
    {
        "id": episode["id"],
        "description": episode.get("description"),
        "descriptionSourceUrl": episode.get("descriptionSourceUrl"),
        "descriptionSourceType": episode.get("descriptionSourceType"),
        "retrievedAt": episode.get("descriptionRetrievedAt"),
        "notes": episode.get("descriptionNotes"),
    }
    for episode in episodes
]
(ROOT / "research" / "full-descriptions.json").write_text(
    json.dumps(research, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
)
print(f"exported {len(research)} records; complete descriptions: "
      f"{sum(bool(item['description']) for item in research)}")
