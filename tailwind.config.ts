import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./preview/**/*.{js,ts,jsx,tsx,mdx}",
    "./community.config.ts",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        "primary-light": "var(--color-primary-light)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        surface: "var(--color-surface)",
        "surface-alt": "var(--color-surface-alt)",
        "on-primary": "var(--color-on-primary)",
        "on-surface": "var(--color-on-surface)",
        "on-surface-muted": "var(--color-on-surface-muted)",
        border: "var(--color-border)",
      },
      fontFamily: {
        display: "var(--font-display)",
        body: "var(--font-body)",
      },
      borderRadius: {
        card: "var(--radius-card)",
        button: "var(--radius-button)",
      },
    },
  },
  plugins: [],
};

export default config;
