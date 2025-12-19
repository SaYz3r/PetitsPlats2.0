import globals from "globals";
import js from "@eslint/js";

export default [
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 2021,
            sourceType: "module",
            globals: {
                ...globals.browser,
            }
        },
        rules: {
            "semi": ["error", "always"],
            "no-unused-vars": "warn",
            "no-console": "off"
        }
    },
    {
        ignores: ["node_modules/**", "data/**"]
    }
];