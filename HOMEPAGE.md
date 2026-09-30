# OSEL V2 homepage

## Scope and content

Homepage section layouts and content are preserved. Shared theme tokens now support light/dark mode through the global system documented in `THEMING.md`. The homepage assembles Hero, Product Launch, Welcome, Why OSEL, Product Universe, Manufacturing Statement, Clientele, Journey and Experience CTA sections in `src/components/sections/home/`.

Content sources reviewed on 2026-09-30:
- https://oseldevices.com/ — positioning, nine launch descriptions, company introduction, five pillars, categories and CTA messaging.
- https://oseldevices.com/products/led-displays/ — verified display identities.
- https://oseldevices.com/manufacturing/ — official factory image.
- https://oseldevices.com/clients/ — verified client logos. The homepage shows an eight-logo selection, not an exhaustive client list.

No statistics, capacities, certifications, new clients or product specifications were invented. The outdated dated event banner was not reproduced. Contact and distributor CTAs use existing routes; those inner pages remain skeletons, with no new form or backend.

## Motion

The CSS LED surface has an overlapping GSAP introduction, scan line, masked words and subtle pointer movement. Hero movement continues on initial scroll. `RevealText` and `textAnimations.ts` share masked text reveals; `SectionLabel` shares section numbering.

Nine products travel horizontally through a bounded pinned section at every viewport width, with progress and working previous/next controls. Keyboard focus scrolls the corresponding product into view. Five Why OSEL pillars crossfade through a second pinned section. Compact and landscape layouts adapt their image sizes, spacing and scroll distances to fit the available small viewport height. Reduced-motion visitors retain natural document flow and a native product scroller. Touch scrolling is native; fine-pointer devices use the single Lenis instance.

The product categories expand on desktop hover. Manufacturing imagery expands from a clipped frame with subtle parallax. Two client rows move in opposite directions, react mildly to scroll velocity, stop offscreen/on hover/on focus, and expose a pause toggle. CTA illumination follows desktop pointer input. Reduced motion disables pinning, smooth scrolling, intro/parallax and automatic logo movement.

`HomeMotion` loads the scroll choreography as a separate dynamic chunk. Content stays server-rendered. `smoothScroll.ts` owns the only Lenis instance, uses the GSAP ticker, updates ScrollTrigger, exempts nested native scrolling and stops while the mobile dialog locks the body. MatchMedia contexts, listeners, observers, ticker subscriptions and the Lenis instance are disposed on route exit. Image-load events schedule ScrollTrigger refreshes without changing reserved image dimensions.

## Assets and performance

The initial library contains 19 official WebP assets. Six lower-resolution application scenes now use distinct generated replacements, and the LED category uses a dedicated seventh image; authentic product, hearing, factory and logo assets remain preserved. See IMAGERY-AUDIT.md and public/assets/images/applications/manifest.json for active replacement paths and exact generation prompts. `scripts/home-assets.json` records provenance and dimensions. Next/Image uses explicit image geometry, responsive sizes and lazy loading. The procedural hero has no image download. No Three.js, video player or additional dependency was introduced. The client code is limited to interaction/motion boundaries.

Higher-resolution official product renders, transparent client logo masters and a short approved factory film could improve fidelity. No missing asset blocks this implementation. The hero’s abstract LED visual is intentional, not a depiction of a specific product.

## Verification

Run `npm run lint`, `npm run build`, then `node scripts/verify-home.mjs` against the production server at localhost:3100. Tests cover 1440, 1280, 1024, 768, 430, 390 and 375px; masked text and page overflow; desktop pinning; mobile controls; reduced motion; mid-page refresh; resize; product keyboard navigation; route exit/remount; Lenis cleanup; menu layering; broken images; internal links; duplicate layout components; and console/hydration errors.

This is local production-build/browser validation, not a field Core Web Vitals measurement or a full assistive-technology audit.
