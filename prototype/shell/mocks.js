/**
 * Prototype shell only — simulates latency, success, errors. Not imported by production components.
 */
window.DDPrototypeMocks = {
  inquiryLatencyMs: 800,
  simulateSubmit(form, scenario) {
    const submit = form.querySelector("[type=submit]");
    if (submit) {
      submit.disabled = true;
      submit.classList.add("is-loading");
      submit.setAttribute("aria-busy", "true");
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        if (submit) {
          submit.disabled = false;
          submit.classList.remove("is-loading");
          submit.removeAttribute("aria-busy");
        }
        resolve(scenario);
      }, this.inquiryLatencyMs);
    });
  },
};