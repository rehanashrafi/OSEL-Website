"use client";
import { createContext, useSyncExternalStore, type ReactNode } from "react";
import { themeStorageKey, type Theme } from "@/lib/theme";
const eventName = "osel-theme-change";
function snapshot(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}
function serverSnapshot(): Theme {
  return "light";
}
function preferred(): Theme {
  try {
    const saved = localStorage.getItem(themeStorageKey);
    if (saved === "light" || saved === "dark") return saved;
  } catch {}
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}
function apply(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  window.dispatchEvent(new Event(eventName));
}
function setTheme(theme: Theme) {
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch {
    /* In-memory selection still works when storage is unavailable. */
  }
  apply(theme);
}
function toggleTheme() {
  setTheme(snapshot() === "dark" ? "light" : "dark");
}
function subscribe(notify: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const sync = () => apply(preferred());
  const storage = (event: StorageEvent) => {
    if (event.key === themeStorageKey || event.key === null) sync();
  };
  window.addEventListener(eventName, notify);
  window.addEventListener("storage", storage);
  media.addEventListener("change", sync);
  return () => {
    window.removeEventListener(eventName, notify);
    window.removeEventListener("storage", storage);
    media.removeEventListener("change", sync);
  };
}
export const ThemeContext = createContext<{
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
} | null>(null);
export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
