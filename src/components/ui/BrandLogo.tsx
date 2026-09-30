import Image from "next/image";
// Original PNGs from OSEL's official blue/white corporate logo downloads; no color filters.
export function BrandLogo() {
  return <span className="brand-logo relative block shrink-0"><Image src="/assets/brand/osel-blue.png" alt="OSEL Devices Limited" width={1920} height={1080} sizes="186px" className="theme-light-only " priority /><Image src="/assets/brand/osel-white.png" alt="OSEL Devices Limited" width={1920} height={1080} sizes="186px" className="theme-dark-only " priority /></span>;
}
