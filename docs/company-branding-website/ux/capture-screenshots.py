#!/usr/bin/env python3
"""Capture UX review screenshots at 390px and 1440px. Serve repo root: python3 -m http.server 8765 --directory ."""
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:8765"
OUT = Path(__file__).resolve().parent / "screens"

SHOTS = [
    ("home-idle", "/prototype/pages/index.html", None),
    ("home-idle-dark", "/prototype/pages/index.html", "dark"),
    ("services", "/prototype/pages/index.html#services", None),
    ("privacy", "/prototype/pages/privacy.html", None),
    ("not-found", "/prototype/pages/not-found.html", None),
    ("nav-mobile-open", "/prototype/stories/mobile-nav-open.html", None),
    ("contact-idle", "/prototype/pages/index.html#contact", None),
    ("contact-sent", "/prototype/stories/contact-sent.html", None),
    ("contact-sending", "/prototype/stories/contact-sending.html", None),
    ("contact-field-errors", "/prototype/stories/contact-field-errors.html", None),
    ("contact-delivery-failure", "/prototype/stories/contact-delivery-failure.html", None),
    ("contact-booking-unavailable", "/prototype/stories/contact-booking-unavailable.html", None),
]

WIDTHS = {"mobile": 390, "desktop": 1440}


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for name, path, theme in SHOTS:
            for label, width in WIDTHS.items():
                page = browser.new_page(viewport={"width": width, "height": 900})
                if theme:
                    page.add_init_script(
                        f'localStorage.setItem("dd-theme", "{theme}");'
                        f'document.documentElement.setAttribute("data-theme", "{theme}");'
                    )
                page.goto(f"{BASE}{path}", wait_until="networkidle")
                page.wait_for_timeout(400)
                outfile = OUT / f"{name}-{label}.png"
                page.screenshot(path=str(outfile), full_page=True)
                page.close()
                print(f"wrote {outfile.name}")
        browser.close()


if __name__ == "__main__":
    main()