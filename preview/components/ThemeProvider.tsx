"use client";

import { useEffect } from "react";
import type { Theme } from "@/schema";
import { generateThemeCSS } from "@/preview/themes/engine";

export function ThemeProvider({
  theme,
  demoMode = false,
  children,
}: {
  theme: Theme;
  demoMode?: boolean;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const styleId = "vinly-theme";
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    let css = generateThemeCSS(theme);

    if (demoMode) {
      css = css
        .replace(/--font-display:[^;]+;/, '--font-display: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;')
        .replace(/--font-body:[^;]+;/, '--font-body: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;');
    }

    styleEl.textContent = css;

    return () => {
      styleEl?.remove();
    };
  }, [theme, demoMode]);

  return <>{children}</>;
}
