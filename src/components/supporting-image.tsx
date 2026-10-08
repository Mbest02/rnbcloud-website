import Image from 'next/image';
import type { PageImage } from '@/lib/page-images';
export function SupportingImage({ image, className = '', preload = false, sizes = '(max-width: 640px) calc(100vw - 40px), (max-width: 1050px) calc(100vw - 64px), 768px' }: { image: PageImage; className?: string; preload?: boolean; sizes?: string }) {
  return <div className={`supporting-image ${className}`}><Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes={sizes} preload={preload} /></div>;
}
