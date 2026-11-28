(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var rows = document.querySelectorAll("[data-lazy-demo]");
  if (!rows.length) return;

  function activate(row) {
    row.classList.remove("use-case-row--idle");
    var root = row.querySelector("[data-demo-root]");
    if (root) root.classList.add("is-ready");
    var frame = row.querySelector("iframe[data-src]");
    if (frame && !frame.getAttribute("src")) {
      frame.setAttribute("src", frame.getAttribute("data-src"));
    }
    var ab = row.querySelector("[data-abstract]");
    if (ab && !reduce) ab.classList.add("is-active");
  }

  if (!("IntersectionObserver" in window)) {
    rows.forEach(activate);
    return;
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          activate(e.target);
          io.unobserve(e.target);
        }
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
  );

  rows.forEach(function (row) {
    io.observe(row);
  });
})();
