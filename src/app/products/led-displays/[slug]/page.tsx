import { notFound } from "next/navigation";
import { getLedEntry, ledEntries } from "@/data/products";
import LedProductDetailPage from "@/components/pages/products/LedProductDetailPage";

export const dynamicParams = false;
export function generateStaticParams() { return ledEntries.map(({ slug }) => ({ slug })); }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getLedEntry(slug);
  if (!product) notFound();
  return <LedProductDetailPage product={product} />;
}
