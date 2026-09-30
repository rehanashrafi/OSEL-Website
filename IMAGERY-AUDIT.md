# Website imagery audit

Audited all src image imports, Next/Image instances, src data mappings, CSS image URLs, and public/assets. There are 21 original image assets used by the website: nine display visuals, one hearing photograph, one factory photograph, eight client logos and two corporate logo variants. Other routes have no photographic slots; CSS pixel fields, orbits, gradients and icon components remain unchanged. Files under scripts are QA screenshots, not website imagery.

## Decisions

| Asset | Original pixels | Action |
| --- | --- | --- |
| clario-shield | 798 × 365 | Preserved official product/technology visual; no invented hardware. |
| clario-zen | 788 × 526 | Replaced in active UI with a distinct higher-resolution illustrative application scene; original retained. |
| horizon-blaze | 1265 × 864 | Preserved official product/technology visual; no invented hardware. |
| clario-slim | 1400 × 935 | Replaced in active UI with a distinct higher-resolution illustrative application scene; original retained. |
| engage-board | 571 × 529 | Preserved official product/technology visual; no invented hardware. |
| nomad-link | 791 × 507 | Replaced in active UI with a distinct higher-resolution illustrative application scene; original retained. |
| nomad-curve | 1267 × 713 | Replaced in active UI with a distinct higher-resolution illustrative application scene; original retained. |
| nomad-flex | 999 × 665 | Replaced in active UI with a distinct higher-resolution illustrative application scene; original retained. |
| nalco | 240 × 240 | Preserved authentic client logo; appropriate for its small rendered size. |
| muse-duo | 781 × 425 | Replaced in active UI with a distinct higher-resolution illustrative application scene; original retained. |
| hearing | 755 × 528 | Preserved official hearing-aid photograph; real device appearance maintained. |
| manufacturing | 1600 × 666 | Preserved authentic OSEL manufacturing photo and facility attribution. |
| indian-oil | 240 × 240 | Preserved authentic client logo; appropriate for its small rendered size. |
| nbcc | 240 × 240 | Preserved authentic client logo; appropriate for its small rendered size. |
| drdo | 240 × 240 | Preserved authentic client logo; appropriate for its small rendered size. |
| alimco | 240 × 240 | Preserved authentic client logo; appropriate for its small rendered size. |
| axis-bank | 240 × 240 | Preserved authentic client logo; appropriate for its small rendered size. |
| india-tv | 240 × 240 | Preserved authentic client logo; appropriate for its small rendered size. |
| doordarshan | 240 × 240 | Preserved authentic client logo; appropriate for its small rendered size. |
| osel-blue / osel-white | 1920 × 1080 each | Preserved unchanged official logo variants. |

The LED category panel formerly repeated clario-shield. It now uses a separate architectural LED-atrium visual. Seven new images total, generated with the built-in image_gen tool and optimized as WebP at quality 88 without upscaling. Six landscape images are 1672 × 941; the category background is 1086 × 1448. These provide a high-resolution photographic look, not literal 4K files.

Generated scenes illustrate applications only; they are not evidence of real OSEL installations or exact product designs. Accessible image descriptions identify the product-card scenes as illustrative. Real product photographs, hearing devices, manufacturing and brand/client logos were not regenerated.

All new files, exact prompts, dimensions and provenance: public/assets/images/applications/manifest.json. Official originals: scripts/home-assets.json and public/assets/brand/SOURCES.md. Reference: https://oseldevices.com/ .

Only image data/reference and alt text changed in application source. Card dimensions, image containers/aspect ratios, themes, copy and GSAP timelines remain unchanged.
