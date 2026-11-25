#!/usr/bin/env python3
"""Capture UX review screenshots at 390px and 1440px. Serve repo root: python3 -m http.server 8765 --directory ."""
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:8765"
OUT = Path(__file__).resolve().parent / "screens"

SHOTS = [
    ("home-idle", "/prototype/pages/index.html"),
    ("services", "/prototype/pages/index.html#services"),
    ("privacy", "/prototype/pages/privacy.html"),
    ("not-found", "/prototype/pages/not-found.html"),
    ("nav-mobile-open", "/prototype/stories/mobile-nav-open.html"),
    ("contact-idle", "/prototype/pages/index.html#contact"),
    ("contact-sent", "/prototype/stories/contact-sent.html"),
    ("contact-sending", "/prototype/stories/contact-sending.html"),
    ("contact-field-errors", "/prototype/stories/contact-field-errors.html"),
    ("contact-delivery-failure", "/prototype/stories/contact-delivery-failure.html"),
    ("contact-booking-unavailable", "/prototype/stories/contact-booking-unavailable.html"),
]

WIDTHS = {"mobile": 390, "desktop": 1440}


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for name, path in SHOTS:
            for label, width in WIDTHS.items():
                page = browser.new_page(viewport={"width": width, "height": 900})
                page.goto(f"{BASE}{path}", wait_until="networkidle")
                page.wait_for_timeout(400)
                outfile = OUT / f"{name}-{label}.png"
                page.screenshot(path=str(outfile), full_page=True)
                page.close()
                print(f"wrote {outfile.name}")
        browser.close()


if __name__ == "__main__":
    main()