import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.scss";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { themeInitializationScript } from "@/lib/theme";
import { OselFooterReveal } from "@/components/layout/OselFooterReveal";
import { OselCursorFollower } from "@/components/layout/OselCursorFollower";
import { OselPreloader } from "@/components/ui/OselPreloader";

const sans = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});
const mono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});
export const metadata: Metadata = {
  title: "OSEL Devices Website V2",
  icons: "/assets/icons/favicon.ico",
  description:
    "OSEL Devices Limited — display technology and precision manufacturing.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  // ColorZilla may inject body attributes before hydration; this exception does not suppress descendant checks.
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} ${mono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: themeInitializationScript }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
        document.documentElement.classList.add("osel-loading");
      `,
          }}
        />
        {/* <script
          dangerouslySetInnerHTML={{
            __html: `
        try {
          if (!sessionStorage.getItem("osel-intro-played")) {
            document.documentElement.classList.add("osel-loading");
          } else {
            document.documentElement.classList.add("osel-loaded");
          }
        } catch (_) {
          document.documentElement.classList.add("osel-loading");
        }
      `,
          }}
        /> */}
      </head>
      <body id="top" suppressHydrationWarning>
        <OselPreloader />
        <ThemeProvider>
          <a
            href="#main-content"
            className="fixed left-6 top-4 z-[var(--z-cursor)] -translate-y-24 bg-ink px-4 py-3 text-canvas focus:translate-y-0"
          >
            Skip to content
          </a>
          <Header />
          <main id="main-content" tabIndex={-1} className="site-main">
            {children}
            <OselCursorFollower />
          </main>
          <OselFooterReveal />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
