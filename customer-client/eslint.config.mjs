import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Next already registers the plugin with a subset of rules; this enables the full recommended set.
  { rules: jsxA11y.flatConfigs.recommended.rules },
  // A scrollable region must be focusable so keyboard users can scroll it (axe: scrollable-region-focusable).
  { rules: { "jsx-a11y/no-noninteractive-tabindex": ["error", { roles: ["region"] }] } },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "storybook-static/**",
  ]),
]);

export default eslintConfig;
