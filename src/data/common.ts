export const common = [
  {
    name: "OSEL Logo",
    slug: "osel",
  },
].map((common) => ({
  ...common,
  image: `/assets/images/common/${common.slug}.png`,
}));
