import type { Metadata } from 'next';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import '@fontsource/montserrat/700.css';
import './globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ConversionEvents } from '@/components/conversion-events';
import { GoogleAnalytics } from '@/components/google-analytics';
export const metadata: Metadata = {
  metadataBase: new URL('https://rnbcloud.com'),
  ...(process.env.VERCEL_ENV === 'preview' ? { robots: { index: false, follow: false } } : {}),
  title: { default: 'Managed IT, Cybersecurity & Cloud in Louisville | RnB Cloud', template: '%s | RnB Cloud' },
  description: 'Louisville-based managed IT, cybersecurity, Microsoft 365, Google Workspace, cloud, and practical AI services with personal accountability.',
  icons: { icon: '/favicon.png', apple: '/apple-touch-icon.png' },
  openGraph: { type: 'website', siteName: 'RnB Cloud', locale: 'en_US' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';
  const analyticsEnabled = ['production', 'preview'].includes(process.env.VERCEL_ENV || '') && process.env.NEXT_PUBLIC_GA_ENABLED === 'true' && /^G-[A-Z0-9]+$/.test(gaId);
  const organization = { '@context': 'https://schema.org', '@type': 'Organization', name: 'RnB Cloud', legalName: 'Apex IT Solutions LLC', url: 'https://rnbcloud.com', logo: 'https://rnbcloud.com/brand/icon.webp', email: 'support@rnbcloud.com', telephone: '+1-502-440-1380', areaServed: ['Louisville, Kentucky', 'Elizabethtown, Kentucky', 'Southern Indiana'] };
  return <html lang="en"><body><a className="skip-link" href="#main">Skip to main content</a><Header /><main id="main" tabIndex={-1}>{children}</main><Footer /><ConversionEvents />{analyticsEnabled && <GoogleAnalytics measurementId={gaId} allowedHost={process.env.VERCEL_ENV === 'production' ? 'rnbcloud.com' : process.env.VERCEL_URL || ''} staging={process.env.VERCEL_ENV === 'preview'} />}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} /></body></html>;
}
