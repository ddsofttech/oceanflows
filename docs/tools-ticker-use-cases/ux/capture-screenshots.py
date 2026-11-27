#!/usr/bin/env python3
"""Capture S2.3 screenshots. Start: cd web && npm run dev -- --host 127.0.0.1"""
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:4321"
OUT = Path(__file__).resolve().parent / "screens"
SHOTS = [
    ("tools-ticker-default", "/#services", 800),
    ("use-cases-idle", "/#use-cases", 400),
    ("use-cases-active", "/#use-cases", 1200),
]
WIDTHS = {"mobile": 390, "desktop": 1200}


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for name, path, wait in SHOTS:
            for label, width in WIDTHS.items():
                page = browser.new_page(viewport={"width": width, "height": 900})
                page.goto(f"{BASE}{path}", wait_until="networkidle")
                if name == "use-cases-active":
                    page.evaluate(
                        """() => document.querySelectorAll('[data-lazy-demo]').forEach(r => {
                      r.classList.remove('use-case-row--idle');
                      var f = r.querySelector('iframe[data-src]');
                      if (f) f.src = f.getAttribute('data-src');
                      var ab = r.querySelector('[data-abstract]');
                      if (ab) ab.classList.add('is-active');
                    })"""
                    )
                page.wait_for_timeout(wait)
                outfile = OUT / f"{name}-{label}.png"
                page.screenshot(path=str(outfile), full_page=False)
                page.close()
                print(f"wrote {outfile.name}")
        browser.close()


if __name__ == "__main__":
    main()