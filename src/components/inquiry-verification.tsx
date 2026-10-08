'use client';
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
type Turnstile = { render: (element: HTMLElement, options: Record<string, unknown>) => string; remove: (id: string) => void };
declare global { interface Window { turnstile?: Turnstile } }
export function InquiryVerification({ reset }: { reset: number }) {
  const container = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState('');
  const sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  useEffect(() => {
    if (!ready || !sitekey || !container.current || !window.turnstile) return;
    const api = window.turnstile;
    const id = api.render(container.current, {
      sitekey, action: 'sales_inquiry', theme: 'light', size: 'flexible',
      callback: () => setNotice(''),
      'error-callback': () => { setNotice('Verification could not load. Please retry or email sales@rnbcloud.com.'); return true; },
      'expired-callback': () => setNotice('Verification expired. Please complete it again.'),
    });
    return () => api.remove(id);
  }, [ready, sitekey, reset]);
  if (!sitekey) return null;
  return <div className="inquiry-verification"><Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" onReady={() => setReady(true)} onError={() => setNotice('Verification could not load. Please email sales@rnbcloud.com or call 502-440-1380.')} /><div ref={container} /><p role="status">{notice}</p></div>;
}
