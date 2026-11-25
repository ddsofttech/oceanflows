/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard"],
  ignoreFiles: ["src/styles/site.css", "src/styles/tokens.css"],
  rules: {
    "color-hex-length": "short",
    "selector-class-pattern": null,
    "custom-property-pattern": null,
  },
};
