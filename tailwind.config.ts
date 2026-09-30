import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: {
      success: "var(--success)", warning: "var(--warning)", error: "var(--error)", info: "var(--info)",
      background: "var(--background)", accent: "var(--accent)", "on-accent": "var(--on-accent)", "media-label": "var(--media-label-text)", "media-label-bg": "var(--media-label-background)", theme: "var(--border)",
      brand: "var(--accent)", "brand-hover": "var(--accent-hover)",
      canvas: "var(--background)", secondary: "var(--background-secondary)",
      surface: "var(--surface)", "surface-hover": "var(--surface-secondary)",
      ink: "var(--text-primary)", subdued: "var(--text-secondary)",
      muted: "var(--text-muted)", line: "var(--border)",
    },
    transitionDuration: { DEFAULT: "var(--transition-base)" },
    borderRadius: { sm: "var(--radius-sm)", md: "var(--radius-md)", lg: "var(--radius-lg)", xl: "var(--radius-xl)" },
  } },
  plugins: [],
} satisfies Config;
