import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      // Security: block dangerous code patterns
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
      "no-script-url": "error",

      // Prevent dynamic requires/imports that could be used for injection
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.name='require'][arguments.0.type!='Literal']",
          message: "Dynamic require() is not allowed for security reasons.",
        },
        {
          selector: "ImportExpression",
          message: "Dynamic import() is not allowed in config files for security reasons.",
        },
      ],
    },
  },
];

export default eslintConfig;
