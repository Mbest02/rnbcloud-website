import { services } from '@/lib/content';
import type { ConversionName } from '@/lib/conversions';
export const conversionNames: ConversionName[] = ['consultation_click', 'consultation_form_submit', 'booking_click', 'phone_click', 'text_click', 'email_click', 'client_support_click'];
const pageTitles: Record<string, string> = {
  '/': 'Home', '/services': 'Services', '/about': 'About', '/industries': 'Industries', '/contact': 'Contact', '/privacy': 'Privacy Policy',
  ...Object.fromEntries(services.map(service => [`/services/${service.slug}`, service.name])),
};
/** Allowlisted paths and titles prevent URL query strings, hashes, or arbitrary input from reaching GA. */
export function analyticsPage(pathname: string) {
  const path = Object.hasOwn(pageTitles, pathname) ? pathname : '/not-found';
  return { page_location: `https://rnbcloud.com${path}`, page_title: pageTitles[path] || 'Page not found', page_referrer: '' };
}
export function analyticsConversion(detail: unknown) {
  if (!detail || typeof detail !== 'object') return null;
  const { name, service } = detail as Record<string, unknown>;
  if (!conversionNames.includes(name as ConversionName)) return null;
  return { name: name as ConversionName, parameters: typeof service === 'string' && services.some(item => item.id === service) ? { service } : {} };
}
