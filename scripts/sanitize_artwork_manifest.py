"""Remove local machine paths from the public artwork provenance manifest."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
path = ROOT / "research" / "codex-generated-urls.json"
records = json.loads(path.read_text(encoding="utf-8"))
for record in records:
    cleaned = []
    for reference in record.get("inputReferences", []):
        if "bujac-video-refs" in reference:
            cleaned.append("video-reference-frames/" + Path(reference).name)
        else:
            cleaned.append(reference)
    record["inputReferences"] = cleaned
path.write_text(json.dumps(records, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"sanitized {len(records)} artwork provenance records")
