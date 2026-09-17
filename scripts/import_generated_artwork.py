"""Import and verify the imagegen profile's episode thumbnails.

The generator writes outside the repository. This script copies only valid
PNG files into the public site and adds their local paths to the catalog.
It refuses partial batches so every episode card has an image.
"""
from __future__ import annotations

import json
import shutil
import struct
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
GENERATED = ROOT / "assets" / "generated"
CATALOG = ROOT / "data" / "episodes.json"
DEST = ROOT / "assets" / "episodes"


def png_size(path: Path) -> tuple[int, int]:
    with path.open("rb") as handle:
        if handle.read(8) != b"\x89PNG\r\n\x1a\n":
            raise ValueError(f"not a PNG: {path.name}")
        length = struct.unpack(">I", handle.read(4))[0]
        if handle.read(4) != b"IHDR" or length < 8:
            raise ValueError(f"missing PNG header: {path.name}")
        return struct.unpack(">II", handle.read(8))


with CATALOG.open(encoding="utf-8") as handle:
    episodes = json.load(handle)
ids = [episode["id"] for episode in episodes]
files = {episode_id: GENERATED / f"{episode_id}.png" for episode_id in ids}
missing = [episode_id for episode_id, path in files.items() if not path.is_file()]
if missing:
    raise SystemExit(f"refusing partial import; missing: {', '.join(missing)}")

sizes = {episode_id: png_size(path) for episode_id, path in files.items()}
invalid = {episode_id: size for episode_id, size in sizes.items() if size[0] != size[1] or size[0] < 512}
if invalid:
    raise SystemExit(f"refusing invalid artwork dimensions: {invalid}")

DEST.mkdir(parents=True, exist_ok=True)
for episode_id, source in files.items():
    shutil.copy2(source, DEST / source.name)
for episode in episodes:
    episode["artwork"] = f"assets/episodes/{episode['id']}.png"

with CATALOG.open("w", encoding="utf-8", newline="\n") as handle:
    json.dump(episodes, handle, ensure_ascii=False, indent=2)
    handle.write("\n")

manifest = [{"id": episode_id, "path": f"assets/episodes/{episode_id}.png", "width": size[0], "height": size[1]} for episode_id, size in sizes.items()]
(ROOT / "research" / "generated-artwork.json").write_text(
    json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
)
print(f"imported {len(files)} artwork files; all dimensions valid")
