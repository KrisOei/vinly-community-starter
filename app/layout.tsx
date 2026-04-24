import type { Metadata } from "next";
import config from "@/preview/lib/config";
import { isDemoMode } from "@/preview/lib/env";
import { ThemeProvider } from "@/preview/components/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: `${config.name} — Preview`,
  description: config.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={config.theme.darkMode ? "dark" : ""}>
      <head>
        {!isDemoMode && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link
              href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
              rel="stylesheet"
            />
          </>
        )}
      </head>
      <body className="min-h-screen bg-surface text-on-surface antialiased">
        <ThemeProvider theme={config.theme} demoMode={isDemoMode}>
          {children}
          {isDemoMode && (
            <div className="preview-badge">Demo Mode — Offline</div>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
