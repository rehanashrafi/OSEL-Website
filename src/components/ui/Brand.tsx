import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
export function Brand({ onNavigate }: { onNavigate?: () => void }) {
  return <Link href="/" onClick={onNavigate} aria-label="OSEL Devices home" className="inline-flex shrink-0 items-center py-2"><BrandLogo /></Link>;
}
