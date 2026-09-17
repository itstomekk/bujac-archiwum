from __future__ import annotations

import json
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
REQUIRED_FILES = [
    "index.html",
    "404.html",
    "styles.css",
    "app.js",
    "js/archive.mjs",
    "data/episodes.json",
    "data/wayback-manifest.json",
    "assets/bujac-podcast.jpg",
]


class SiteParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.tags: set[str] = set()
        self.ids: list[str] = []
        self.local_refs: list[str] = []
        self.images_without_alt: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.tags.add(tag)
        values = dict(attrs)
        if values.get("id"):
            self.ids.append(values["id"] or "")
        if tag == "img" and not (values.get("alt") or "").strip():
            self.images_without_alt.append(values.get("src") or "<missing src>")
        for name in ("href", "src"):
            value = values.get(name)
            if value and not value.startswith(("http://", "https://", "mailto:", "bitcoin:", "lightning:", "#", "data:")):
                self.local_refs.append(value.split("?", 1)[0].split("#", 1)[0])


def fail(message: str, failures: list[str]) -> None:
    failures.append(message)


def main() -> int:
    failures: list[str] = []
    for relative in REQUIRED_FILES:
        if not (ROOT / relative).is_file():
            fail(f"missing required file: {relative}", failures)

    index = ROOT / "index.html"
    if index.is_file():
        parser = SiteParser()
        parser.feed(index.read_text(encoding="utf-8"))
        for landmark in ("header", "main", "nav", "footer"):
            if landmark not in parser.tags:
                fail(f"missing HTML landmark: {landmark}", failures)
        if "h1" not in parser.tags:
            fail("missing h1", failures)
        duplicates = sorted({item for item in parser.ids if parser.ids.count(item) > 1})
        if duplicates:
            fail(f"duplicate HTML ids: {', '.join(duplicates)}", failures)
        if parser.images_without_alt:
            fail(f"images without alt text: {', '.join(parser.images_without_alt)}", failures)
        for reference in parser.local_refs:
            if reference and not (ROOT / reference).exists():
                fail(f"broken local reference: {reference}", failures)

    episodes_file = ROOT / "data" / "episodes.json"
    if episodes_file.is_file():
        episodes = json.loads(episodes_file.read_text(encoding="utf-8"))
        ids = [episode["id"] for episode in episodes]
        if len(ids) != len(set(ids)):
            fail("duplicate episode ids", failures)
        for episode in episodes:
            for source in episode.get("sources", []):
                parsed = urlparse(source.get("url", ""))
                if parsed.scheme not in {"http", "https"} or not parsed.netloc:
                    fail(f"invalid source URL in {episode['id']}", failures)

    if failures:
        print("AUDIT FAILED")
        for item in failures:
            print(f"- {item}")
        return 1
    print("AUDIT PASSED")
    print(f"- {len(json.loads(episodes_file.read_text(encoding='utf-8')))} episode records")
    print("- required files, landmarks, alt text, local references, and source URLs valid")
    return 0


if __name__ == "__main__":
    sys.exit(main())
