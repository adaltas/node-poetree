import globals from "globals";
import js from "@eslint/js";
import ts from "typescript-eslint";
import mocha from "eslint-plugin-mocha";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ["dist/**"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
  },
  { languageOptions: { globals: globals.node } },
  js.configs.recommended,
  ...ts.configs.recommended,
  mocha.configs.flat.recommended,
];
