import type { LedProduct } from "@/types/product";

export default function LedProductDetailPage({
  product,
}: {
  product: LedProduct;
}) {
  return (
    <section className="site-container py-24">
      <h1 className="heading-md">{product.name}</h1>
    </section>
  );
}
