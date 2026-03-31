/**
 * Theme Engine
 *
 * Converts the declarative theme config into CSS custom properties.
 * No runtime JS needed — just CSS variables injected into :root.
 */

import type { Theme } from "@/schema";

/** Convert hex to HSL for better color manipulation */
function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(
    hex.length === 4
      ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`
      : hex
  );
  if (!result) return { h: 0, s: 0, l: 0 };

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

/** Lighten a hex color */
function lighten(hex: string, amount: number): string {
  const { h, s, l } = hexToHSL(hex);
  const newL = Math.min(95, l + amount);
  return `hsl(${h}, ${s}%, ${newL}%)`;
}

/** Font family mapping */
const FONT_MAP: Record<string, string> = {
  Inter: '"Inter", system-ui, -apple-system, sans-serif',
  "DM Sans": '"DM Sans", system-ui, sans-serif',
  "Plus Jakarta Sans": '"Plus Jakarta Sans", system-ui, sans-serif',
  Outfit: '"Outfit", system-ui, sans-serif',
  "Space Grotesk": '"Space Grotesk", system-ui, sans-serif',
  System: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

/** Border radius mapping */
const RADIUS_MAP: Record<string, { card: string; button: string }> = {
  none: { card: "0px", button: "0px" },
  sm: { card: "4px", button: "4px" },
  md: { card: "8px", button: "6px" },
  lg: { card: "16px", button: "10px" },
  full: { card: "24px", button: "9999px" },
};

/** Generate CSS custom properties from theme config */
export function generateThemeCSS(theme: Theme): string {
  const primary = theme.primaryColor;
  const secondary = theme.secondaryColor;
  const accent = theme.accentColor || theme.secondaryColor;
  const radii = RADIUS_MAP[theme.borderRadius] || RADIUS_MAP.md;
  const displayFont = FONT_MAP[theme.fontFamily] || FONT_MAP.System;
  const bodyFont = FONT_MAP[theme.bodyFontFamily] || FONT_MAP.System;

  if (theme.darkMode) {
    return `:root {
  --color-primary: ${primary};
  --color-primary-light: ${lighten(primary, 15)};
  --color-secondary: ${secondary};
  --color-accent: ${accent};
  --color-surface: #111827;
  --color-surface-alt: #1F2937;
  --color-on-primary: #FFFFFF;
  --color-on-surface: #F9FAFB;
  --color-on-surface-muted: #9CA3AF;
  --color-border: #374151;
  --font-display: ${displayFont};
  --font-body: ${bodyFont};
  --radius-card: ${radii.card};
  --radius-button: ${radii.button};
}`;
  }

  return `:root {
  --color-primary: ${primary};
  --color-primary-light: ${lighten(primary, 35)};
  --color-secondary: ${secondary};
  --color-accent: ${accent};
  --color-surface: #FFFFFF;
  --color-surface-alt: #F9FAFB;
  --color-on-primary: #FFFFFF;
  --color-on-surface: #111827;
  --color-on-surface-muted: #6B7280;
  --color-border: #E5E7EB;
  --font-display: ${displayFont};
  --font-body: ${bodyFont};
  --radius-card: ${radii.card};
  --radius-button: ${radii.button};
}`;
}
