import { NextRequest, NextResponse } from 'next/server';
import { services } from '@/lib/content';
export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  const allowedOrigins = new Set(['https://rnbcloud.com', 'https://www.rnbcloud.com', 'https://rnbcloud-website.vercel.app']);
  if (process.env.SITE_ORIGIN) allowedOrigins.add(process.env.SITE_ORIGIN);
  // The stable project and branch aliases differ from the individual deployment URL.
  // Use only this project's server-provided URLs; never allow every *.vercel.app host.
  for (const host of [process.env.VERCEL_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL, process.env.VERCEL_BRANCH_URL]) {
    if (host) allowedOrigins.add(`https://${host}`);
  }
  if (process.env.NODE_ENV === 'development') { allowedOrigins.add('http://127.0.0.1:3000'); allowedOrigins.add('http://localhost:3000'); }
  if (!origin || !allowedOrigins.has(origin)) return NextResponse.json({ error: 'Please submit your request from our contact page.' }, { status: 403 });
  if (!request.headers.get('content-type')?.includes('application/json')) return NextResponse.json({ error: 'Unsupported request format.' }, { status: 415 });
  // Limit the actual stream, rather than trusting Content-Length supplied by the caller.
  const reader = request.body?.getReader();
  if (!reader) return NextResponse.json({ error: 'Please include your contact details.' }, { status: 400 });
  let body = ''; let bytes = 0;
  const decoder = new TextDecoder();
  try {
    while (true) { const { value, done } = await reader.read(); if (done) break; bytes += value.byteLength; if (bytes > 18000) { await reader.cancel(); return NextResponse.json({ error: 'Your request is too large. Please shorten your message.' }, { status: 413 }); } body += decoder.decode(value, { stream: true }); }
    body += decoder.decode();
    const raw: unknown = JSON.parse(body);
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Invalid body');
    const data = raw as Record<string, unknown>;
    const get = (name: string) => typeof data[name] === 'string' ? (data[name] as string).trim() : '';
    if (get('website')) return NextResponse.json({ error: 'Your request could not be processed. Please contact us directly.' }, { status: 400 });
    const inquiry = { name: get('name'), organization: get('organization'), email: get('email'), phone: get('phone'), interest: get('interest'), message: get('message') };
    if (!inquiry.name || inquiry.name.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inquiry.email) || inquiry.email.length > 254 || !inquiry.message || inquiry.message.length > 4000 || inquiry.organization.length > 160 || inquiry.phone.length > 40 || (inquiry.interest && !services.some(s => s.id === inquiry.interest))) return NextResponse.json({ error: 'Please check your name, email, and message, then try again.' }, { status: 400 });
    const endpoint = process.env.INQUIRY_WEBHOOK_URL;
    if (!endpoint || !endpoint.startsWith('https://')) return NextResponse.json({ error: 'Online requests are not available yet. Please email support@rnbcloud.com or call 502-440-1380 to reach us directly.' }, { status: 503 });
    try {
      const delivery = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(process.env.INQUIRY_WEBHOOK_TOKEN ? { Authorization: `Bearer ${process.env.INQUIRY_WEBHOOK_TOKEN}` } : {}) }, body: JSON.stringify({ ...inquiry, source: 'rnbcloud-website', submittedAt: new Date().toISOString() }), signal: AbortSignal.timeout(10000), redirect: 'error', cache: 'no-store' });
      if (!delivery.ok) throw new Error('Delivery failed');
      return NextResponse.json({ success: true });
    } catch { return NextResponse.json({ error: 'We couldn’t deliver your request. Please email support@rnbcloud.com or call 502-440-1380.' }, { status: 502 }); }
  } catch { return NextResponse.json({ error: 'We couldn’t read this request. Please check your details and try again.' }, { status: 400 }); }
}
