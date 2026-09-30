import type { ProductFamily } from "@/types/product";

// Names verified against https://oseldevices.com/products/led-displays/.
export const productFamilies: readonly ProductFamily[] = [
  { name: "Clario", slug: "clario", products: [
    { name: "Clario Shield", slug: "clario-shield" },
    { name: "Clario Slim", slug: "clario-slim" },
    { name: "Clario Zen", slug: "clario-zen" },
  ] },
  { name: "Horizon", slug: "horizon", products: [{ name: "Horizon Blaze", slug: "horizon-blaze" }] },
  { name: "Engage", slug: "engage", products: [{ name: "Engage Board", slug: "engage-board" }] },
  { name: "Muse", slug: "muse", products: [{ name: "Muse Duo", slug: "muse-duo" }] },
  { name: "Nomad", slug: "nomad", products: [
    { name: "Nomad Curve", slug: "nomad-curve" },
    { name: "Nomad Flex", slug: "nomad-flex" },
    { name: "Nomad Link", slug: "nomad-link" },
  ] },
];
export const ledEntries = productFamilies.flatMap(family => [
  { name: family.name, slug: family.slug }, ...family.products,
]);
export function getLedEntry(slug: string) { return ledEntries.find(entry => entry.slug === slug); }

const launchDetails = [
  ["clario-shield", "Fine-pitch COB, indoor fixed installation"],
  ["clario-slim", "Ultra-thin all-in-one fine pixel pitch"],
  ["clario-zen", "Micro-pitch, for control rooms"],
  ["horizon-blaze", "High-brightness outdoor display"],
  ["engage-board", "All-in-one interactive smart display"],
  ["nomad-curve", "Ultra-flexible curved rental cabinet"],
  ["nomad-flex", "Touring-ready mesh and solid panels"],
  ["nomad-link", "The one-4-all rental system"],
  ["muse-duo", "Dual-sided ultra-slim display"],
] as const;
const applicationImages: Partial<Record<string, { image: string; imageAlt: string }>> = {

  "clario-shield": {
    "image": "/assets/images/applications/fine-pitch-indoor-led-lounge.webp",
    "imageAlt": "Illustrative fine-pitch indoor LED wall in a corporate lounge"
  },
  "horizon-blaze": {
    "image": "/assets/images/applications/outdoor-led-commercial-facade.webp",
    "imageAlt": "Illustrative outdoor LED display on a commercial building"
  },
  "engage-board": {
    "image": "/assets/images/applications/interactive-display-collaboration-room.webp",
    "imageAlt": "Illustrative all-in-one interactive display in a collaboration room"
  }
,
  "clario-slim": {
    "image": "/assets/images/applications/led-executive-meeting-room.webp",
    "imageAlt": "Illustrative fine-pitch LED display in a modern meeting room"
  },
  "clario-zen": {
    "image": "/assets/images/applications/micro-pitch-control-room.webp",
    "imageAlt": "Illustrative micro-pitch LED video wall in a control room"
  },
  "nomad-curve": {
    "image": "/assets/images/applications/curved-led-exhibition.webp",
    "imageAlt": "Illustrative curved rental LED wall in an exhibition hall"
  },
  "nomad-flex": {
    "image": "/assets/images/applications/touring-led-stage.webp",
    "imageAlt": "Illustrative touring stage with LED walls and mesh panels"
  },
  "nomad-link": {
    "image": "/assets/images/applications/modular-led-conference.webp",
    "imageAlt": "Illustrative modular LED installation at a corporate event"
  },
  "muse-duo": {
    "image": "/assets/images/applications/retail-dual-sided-signage.webp",
    "imageAlt": "Illustrative suspended digital signage in a retail arcade"
  }
};

export const launchProducts = launchDetails.map(([slug, description]) => {
  const product = getLedEntry(slug);
  if (!product) throw new Error(`Unknown launch product: ${slug}`);
  const visual = applicationImages[slug] ?? { image: `/assets/images/home/${slug}.webp`, imageAlt: `${product.name} LED display` };
  return { ...product, description, ...visual };
});
