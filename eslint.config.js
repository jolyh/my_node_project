import js from "@eslint/js";
import globals from "globals";
import json from "@eslint/json";
import { defineConfig } from "eslint/config";
import pluginNode from "eslint-plugin-n";

export default defineConfig([
   {
    ignores: [
      "frontend/**",       // Ignores everything inside the frontend folder
      "**/frontend/**"     // Matches the folder even if nested
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
