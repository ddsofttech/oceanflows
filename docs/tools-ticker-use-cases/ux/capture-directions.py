#!/usr/bin/env python3
"""Capture G2 direction screenshots. From repo root: python3 -m http.server 8765 --directory ."""
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:8765"
OUT = Path(__file__).resolve().parent / "directions"
DIRS = [
    ("direction-a-focus-tabs", "/docs/tools-ticker-use-cases/ux/directions/direction-a-focus-tabs.html"),
    ("direction-b-snap-rail", "/docs/tools-ticker-use-cases/ux/directions/direction-b-snap-rail.html"),
    ("direction-c-stage-rail", "/docs/tools-ticker-use-cases/ux/directions/direction-c-stage-rail.html"),
]
WIDTHS = {"mobile": 390, "desktop": 1200}


def main() -> None:
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for name, path in DIRS:
            for label, width in WIDTHS.items():
                page = browser.new_page(viewport={"width": width, "height": 860})
                page.goto(f"{BASE}{path}", wait_until="networkidle")
                page.wait_for_timeout(300)
                outfile = OUT / f"{name}-{label}.png"
                page.screenshot(path=str(outfile), full_page=True)
                page.close()
                print(f"wrote {outfile.name}")
        browser.close()


if __name__ == "__main__":
    main()