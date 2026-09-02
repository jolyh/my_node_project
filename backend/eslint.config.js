import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import pluginNode from "eslint-plugin-n";
import globals from "globals";

export default defineConfig([
   {
    ignores: [
      "frontend/**",       // Ignores everything inside the frontend folder
      "**/frontend/**",    // Matches the folder even if nested
      "client/**",         // Ignores everything inside the client folder
      "**/client/**",      // Matches the folder even if nested
    ]
  },
  { files: ["**/*.{js,mjs,cjs,vue}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: {...globals.browser, ...globals.node} } },
  pluginNode.configs["flat/recommended"],
  {
    rules: {
      "no-unused-vars": "warn",
      "no-console": "off",
      "n/handle-callback-err": "error"
    }
  }
]);
