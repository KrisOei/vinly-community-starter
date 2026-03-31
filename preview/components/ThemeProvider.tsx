"use client";

import { useEffect } from "react";
import type { Theme } from "@/schema";
import { generateThemeCSS } from "@/preview/themes/engine";

export function ThemeProvider({
  theme,
  children,
}: {
  theme: Theme;
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Inject theme CSS variables into the document
    const styleId = "vinly-theme";
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement("style");
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    styleEl.textContent = generateThemeCSS(theme);

    return () => {
      styleEl?.remove();
    };
  }, [theme]);

  return <>{children}</>;
}
