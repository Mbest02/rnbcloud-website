import Image from 'next/image';
export function BrandIcon({ width = 44, white = false }: { width?: number; white?: boolean }) {
  return <span className="brand-icon" style={{ width, height: width / 1.4 }} aria-hidden="true"><Image src={white ? '/brand/icon-white.webp' : '/brand/icon.webp'} alt="" width={1024} height={523} /></span>;
}
