"use client";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const label =
    theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
      className="theme-toggle flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-surface-hover"
    >
      <Moon className="theme-light-only" size={19} aria-hidden="true" />
      <Sun className="theme-dark-only" size={19} aria-hidden="true" />
    </button>
  );
}
