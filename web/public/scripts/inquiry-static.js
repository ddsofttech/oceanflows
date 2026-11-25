/**
 * Prevent static preview forms from submitting (cbw-fe-01).
 */
(function () {
  var form = document.querySelector("[data-static-inquiry]");
  if (!form) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
  });
})();
