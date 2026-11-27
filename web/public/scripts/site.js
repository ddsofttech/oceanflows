/**
 * Presentational behaviors only (nav). Form simulation lives in prototype/shell/mocks.js on story pages.
 */
(function () {
  const THEME_KEY = "dd-theme";
  const themeToggle = document.querySelector("[data-theme-toggle]");

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (_) {}
    if (themeToggle) {
      const dark = theme === "dark";
      themeToggle.setAttribute("aria-pressed", dark ? "true" : "false");
      themeToggle.setAttribute(
        "aria-label",
        dark ? "Switch to light theme" : "Switch to dark theme",
      );
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next =
        document.documentElement.getAttribute("data-theme") === "dark"
          ? "light"
          : "dark";
      applyTheme(next);
    });
    applyTheme(document.documentElement.getAttribute("data-theme") || "light");
  }

  const toggle = document.querySelector("[data-nav-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  const sectionLinks = document.querySelectorAll("[data-section-link]");
  const sections = [
    "home",
    "services",
    "approach",
    "use-cases",
    "about",
    "contact",
  ];

  const FOCUSABLE =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function setCurrentSection(id) {
    document.querySelectorAll("[data-section-link]").forEach((link) => {
      const match = link.getAttribute("href") === `#${id}`;
      link.setAttribute("aria-current", match ? "true" : "false");
    });
  }

  function focusableIn(container) {
    return Array.from(container.querySelectorAll(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null || el === document.activeElement,
    );
  }

  function closeMobileNav({ returnFocus = true } = {}) {
    if (!mobileNav || !toggle) return;
    mobileNav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.removeEventListener("keydown", onMobileNavKeydown);
    if (returnFocus) toggle.focus();
  }

  function openMobileNav() {
    if (!mobileNav || !toggle) return;
    mobileNav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    const first = focusableIn(mobileNav)[0];
    if (first) first.focus();
    document.addEventListener("keydown", onMobileNavKeydown);
  }

  function onMobileNavKeydown(e) {
    if (!mobileNav.classList.contains("is-open")) return;
    if (e.key === "Escape") {
      e.preventDefault();
      closeMobileNav();
      return;
    }
    if (e.key !== "Tab") return;
    const items = focusableIn(mobileNav);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  if (toggle && mobileNav) {
    toggle.addEventListener("click", () => {
      const willOpen = !mobileNav.classList.contains("is-open");
      if (willOpen) openMobileNav();
      else closeMobileNav({ returnFocus: false });
    });
    mobileNav
      .querySelectorAll("a")
      .forEach((a) => a.addEventListener("click", () => closeMobileNav()));
  }

  sectionLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const id = (link.getAttribute("href") || "").replace("#", "");
      if (id) setCurrentSection(id);
    });
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setCurrentSection(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5] },
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  } else {
    setCurrentSection("home");
  }

  const SCROLL_REVEAL_STAGGER = [
    ".section-heading",
    ".services-table__head",
    ".services-table__row",
    ".tools-ticker",
    ".approach-track > .approach-stage",
    ".use-case-stack > .use-case-row",
    ".about-intro",
    ".about-bring",
    ".about-philosophy",
    ".contact-layout",
  ].join(",");

  function prepareScrollRevealStagger(section) {
    const items = section.querySelectorAll(SCROLL_REVEAL_STAGGER);
    items.forEach((el, index) => {
      el.classList.add("scroll-reveal-item");
      el.style.setProperty("--scroll-reveal-step", String(index));
    });
  }

  function initScrollReveal() {
    const revealSections = document.querySelectorAll(".reveal-section");
    if (!revealSections.length) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    document.documentElement.classList.add("has-reveal");

    revealSections.forEach(prepareScrollRevealStagger);

    function showSection(el) {
      el.classList.add("is-visible");
    }

    if (reducedMotion) {
      revealSections.forEach(showSection);
      return;
    }

    function sectionInView(el) {
      const rect = el.getBoundingClientRect();
      const trigger = window.innerHeight * 0.84;
      return rect.top < trigger && rect.bottom > window.innerHeight * 0.12;
    }

    revealSections.forEach((el) => {
      if (sectionInView(el)) showSection(el);
    });

    if (!("IntersectionObserver" in window)) {
      revealSections.forEach(showSection);
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          showSection(entry.target);
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -14% 0px", threshold: 0.08 },
    );

    revealSections.forEach((el) => {
      if (!el.classList.contains("is-visible")) revealObserver.observe(el);
    });
  }

  initScrollReveal();
})();
