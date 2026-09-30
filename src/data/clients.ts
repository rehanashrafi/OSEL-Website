// Verified against https://oseldevices.com/clients/. Official logo assets only.
export const clients = [
  { name: "NALCO", slug: "nalco" }, { name: "NBCC", slug: "nbcc" },
  { name: "Indian Oil", slug: "indian-oil" }, { name: "DRDO", slug: "drdo" },
  { name: "ALIMCO", slug: "alimco" }, { name: "India TV", slug: "india-tv" },
  { name: "Doordarshan", slug: "doordarshan" }, { name: "Axis Bank", slug: "axis-bank" },
].map(client => ({ ...client, image: `/assets/images/home/${client.slug}.webp` }));
