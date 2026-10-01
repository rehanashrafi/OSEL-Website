import { pages } from "@/data/navigation";

export default function ProductsPage() {
  return (
    <section className="site-container py-24">
      <h1 className="heading-md">{pages.products.label}</h1>
    </section>
  );
}
