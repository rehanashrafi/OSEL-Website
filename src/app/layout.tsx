import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.scss";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { themeInitializationScript } from "@/lib/theme";

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
  icons: { icon: "data:," },
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
      </head>
      <body id="top" suppressHydrationWarning>
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
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
