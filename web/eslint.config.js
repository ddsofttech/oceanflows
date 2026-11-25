import eslintPluginAstro from "eslint-plugin-astro";
import security from "eslint-plugin-security";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      ".astro/**",
      "src/env.d.ts",
      "public/scripts/**",
      "coverage/**",
    ],
  },
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    files: ["**/*.{ts,tsx,js,mjs}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: { security },
    rules: {
      complexity: ["error", { max: 15 }],
      "security/detect-object-injection": "off",
    },
  },
  {
    files: ["src/pages/api/**/*.{ts,js}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["resend", "**/resend*"],
              message: "Resend is server-only in inquiry handler",
            },
          ],
        },
      ],
    },
  },
);
