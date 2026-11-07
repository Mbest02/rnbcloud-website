import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
export const dynamic = 'force-static';
/** Interim brand artwork; replace when Martin approves final campaign art. */
export async function GET() {
  const [logo, font] = await Promise.all([
    readFile(join(process.cwd(), 'public/brand/wordmark-white.png')),
    readFile(join(process.cwd(), 'node_modules/@fontsource/montserrat/files/montserrat-latin-600-normal.woff')),
  ]);
  return new ImageResponse(<div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: '65px 75px', background: 'linear-gradient(120deg, #071d5c, #0e4aa2)', color: 'white', fontFamily: 'Montserrat' }}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={`data:image/png;base64,${logo.toString('base64')}`} width={260} height={48} alt="RnB Cloud" />
    <div style={{ display: 'flex', fontSize: 20, color: '#a7cde8', marginTop: 45 }}>SECURE AI FOR SMALL BUSINESS</div>
    <div style={{ display: 'flex', fontSize: 49, lineHeight: 1.2, marginTop: 20 }}>Your team is already using AI.</div>
    <div style={{ display: 'flex', fontSize: 49, lineHeight: 1.2, marginTop: 10, color: '#a7dcff' }}>Let’s make it safe and get hours back.</div>
    <div style={{ display: 'flex', fontSize: 18, color: '#d2e4f8', marginTop: 'auto' }}>Louisville · Southern Indiana · Elizabethtown · Lexington</div>
  </div>, { width: 1200, height: 630, fonts: [{ name: 'Montserrat', data: font.buffer.slice(font.byteOffset, font.byteOffset + font.byteLength) as ArrayBuffer, weight: 600, style: 'normal' }] });
}
