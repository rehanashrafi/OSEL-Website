# OSEL V2 layout foundation

Header and Footer remain composed in `src/app/layout.tsx`. Navigation and routing coverage is documented in `ROUTES.md`.

- `src/app/globals.scss` remains the only stylesheet entry point; the four existing partials own tokens, typography, motion helpers and shared effects.
- Tailwind 3 uses PostCSS after Sass compilation. Semantic theme mappings live in `tailwind.config.ts`.
- Geist and Geist Mono are self-hosted through `next/font`.
- `src/data/navigation.ts` owns canonical destinations and desktop, mobile, footer, legal and social groupings. `src/data/products.ts` supplies the verified LED family/product catalog. No navigation arrays live in layout components.
- `Brand.tsx` reuses `BrandLogo.tsx` with unmodified official blue/white OSEL logo assets. See `THEMING.md` for the global theme architecture.
- The mobile menu uses a native modal dialog for focus containment and background inertness, preserves scroll position and restores focus on close. GSAP entry/exit respects reduced motion. Internal navigation releases the modal before moving to the next page.
- Footer markup remains server-rendered; FooterMotion and active NavigationLink elements provide focused client boundaries. ScrollTrigger is lazy-loaded and its matchMedia context is reverted on cleanup.
- Inner-page components remain minimal Server Components. The completed homepage is documented in HOMEPAGE.md and reuses this layout foundation.

Validation: `npm run lint`, `npm run build`. Browser smoke test: `node scripts/verify-layout.mjs` with the production server on port 3100 and Microsoft Edge installed (override the URL with OSEL_TEST_URL). The test verifies 58 destinations, dynamic 404s, navigation parity, active states, keyboard behavior, modal scroll locking, responsive geometry and browser errors.

