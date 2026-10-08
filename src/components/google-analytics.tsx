'use client';
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { analyticsPage, analyticsConversion } from '@/lib/analytics';

declare global {
  interface Window { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; }
}
export function GoogleAnalytics({ measurementId, allowedHost, staging }: { measurementId: string; allowedHost: string; staging: boolean }) {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const initialized = useRef(false);
  const lastPage = useRef<string | null>(null);
  useEffect(() => {
    if (window.location.protocol !== 'https:' || (!allowedHost || window.location.hostname !== allowedHost)) return;
    window.dataLayer ??= [];
    window.gtag ??= function () { window.dataLayer!.push(arguments); };
    if (!initialized.current) {
      window.gtag('js', new Date());
      window.gtag('config', measurementId, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, ignore_referrer: true, ...analyticsPage(pathname) });
      initialized.current = true;
      setActive(true);
    }
    if (lastPage.current !== pathname) {
      window.gtag('set', analyticsPage(pathname));
      window.gtag('event', 'page_view', { ...analyticsPage(pathname), send_to: measurementId, deployment_environment: staging ? 'staging' : 'production', ...(staging ? { debug_mode: true } : {}) });
      lastPage.current = pathname;
    }
    const convert = (event: Event) => {
      const conversion = analyticsConversion((event as CustomEvent).detail);
      if (conversion) window.gtag?.('event', conversion.name, { ...analyticsPage(pathname), ...conversion.parameters, send_to: measurementId, deployment_environment: staging ? 'staging' : 'production', ...(staging ? { debug_mode: true } : {}) });
    };
    window.addEventListener('rnb:conversion', convert);
    return () => window.removeEventListener('rnb:conversion', convert);
  }, [measurementId, pathname, allowedHost, staging]);
  return active ? <Script id="rnb-ga4" src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" /> : null;
}
