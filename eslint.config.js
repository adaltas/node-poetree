import globals from "globals";
import js from "@eslint/js";
import ts from "typescript-eslint"; // TS only
import mocha from "eslint-plugin-mocha";
import prettier from "eslint-plugin-prettier/recommended";

export default [
  {
    ignores: ["dist/**"],
    // Monorepo: ignores: ["**/dist/**"],
  },
  {
    languageOptions: { globals: { ...globals.node } },
  },
  js.configs.recommended,
  ...ts.configs.recommended, // TS only
  mocha.configs.flat.recommended,
  prettier,
];
