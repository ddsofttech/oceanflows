/**
 * Apply saved or system color theme before first paint.
 */
(function () {
  var KEY = "dd-theme";
  try {
    var stored = localStorage.getItem(KEY);
    var theme =
      stored === "dark" || stored === "light"
        ? stored
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    document.documentElement.setAttribute("data-theme", theme);
  } catch (_) {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();