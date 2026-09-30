# OSEL theme system

Brand and light/dark semantic values live only in src/styles/_variables.scss. Tailwind maps existing canvas/secondary/surface/ink/subdued/muted/line/brand utilities onto those tokens. New background/accent/on-accent/theme utilities are also available. Use text-on-accent for filled accent buttons. Functional success/warning/error/info tokens are separate from brand colors.

Use semantic classes for all future pages. Do not introduce hard-coded black/white backgrounds or brand hex values in components. Media labels use dedicated contrast tokens; decorative masks use pure-black as an alpha mask, not a themed background. Light muted text is slightly deeper than the supplied slate for 4.5:1 contrast on all surfaces.

ThemeProvider exposes theme, setTheme and toggleTheme through useTheme. The root data-theme attribute is initialized by a small head script before body paint: saved osel-theme, otherwise system preference, otherwise light. The external-store subscription keeps controls synchronized without SSR access to browser APIs. The html element suppresses the expected theme-attribute mismatch; body also tolerates external attributes injected by extensions such as ColorZilla. Neither exception suppresses descendant hydration checks. System changes apply until a theme is saved; storage events synchronize tabs. Storage failures leave the control usable.

ThemeToggle is reused in the header and mobile dialog. BrandLogo reuses unchanged official blue/white PNGs (provenance in public/assets/brand/SOURCES.md). CSS offsets only their transparent canvas margins, without recoloring or changing the artwork.

No theme dependency is added to GSAP or ScrollTrigger effects. CSS color transitions respect reduced motion and leave existing transform/height transitions intact.

Validation: npm run lint, npm run build, and TEST_URL=http://localhost:3100 node scripts/verify-theme.mjs. Existing verify-home.mjs and verify-responsive-scroll.mjs cover story and layout regressions.
