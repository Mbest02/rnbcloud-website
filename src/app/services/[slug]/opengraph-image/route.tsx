import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { services } from '@/lib/content';
import { servicePages } from '@/lib/service-pages';
export function generateStaticParams() { return services.map(service => ({ slug: service.slug })); }
export const dynamic = 'force-static';
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find(item => item.slug === slug);
  if (!service) return new Response('Not found', { status: 404 });
  const [logo, font] = await Promise.all([
    readFile(join(process.cwd(), 'public/brand/wordmark-white.png')),
    readFile(join(process.cwd(), 'node_modules/@fontsource/montserrat/files/montserrat-latin-600-normal.woff')),
  ]);
  return new ImageResponse(<div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '65px 75px', background: 'linear-gradient(120deg, #071d5c, #0e4aa2)', color: 'white', fontFamily: 'Montserrat' }}>
    {/* ImageResponse renders the supplied artwork, without recreating the wordmark. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={`data:image/png;base64,${logo.toString('base64')}`} width={260} height={48} alt="RnB Cloud" />
    <div style={{ display: 'flex', fontSize: 20, color: '#a7cde8', marginTop: 48 }}>{service.name}</div>
    <div style={{ display: 'flex', fontSize: 56, lineHeight: 1.15, marginTop: 20, maxWidth: 1000 }}>{servicePages[service.id].heading}</div>
    <div style={{ display: 'flex', fontSize: 18, color: '#d2e4f8', marginTop: 'auto', paddingTop: 25 }}>Louisville · Elizabethtown · Southern Indiana</div>
  </div>, { width: 1200, height: 630, fonts: [{ name: 'Montserrat', data: font.buffer.slice(font.byteOffset, font.byteOffset + font.byteLength) as ArrayBuffer, weight: 600, style: 'normal' }] });
}
