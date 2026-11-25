/**
 * Presentational behaviors only (nav). Form simulation lives in prototype/shell/mocks.js on story pages.
 */
(function () {
  const toggle = document.querySelector("[data-nav-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  const sectionLinks = document.querySelectorAll("[data-section-link]");
  const sections = ["home", "services", "approach", "about", "contact"];

  function setCurrentSection(id) {
    document.querySelectorAll("[data-section-link]").forEach((link) => {
      const match = link.getAttribute("href") === `#${id}`;
      link.setAttribute("aria-current", match ? "true" : "false");
    });
  }

  function closeMobileNav() {
    if (!mobileNav || !toggle) return;
    mobileNav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && mobileNav) {
    toggle.addEventListener("click", () => {
      const open = mobileNav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mobileNav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMobileNav));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileNav.classList.contains("is-open")) closeMobileNav();
    });
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
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5] }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  } else {
    setCurrentSection("home");
  }
})();