import { services } from '@/lib/content';
import type { ConversionName } from '@/lib/conversions';
export const conversionNames: ConversionName[] = ['consultation_click', 'consultation_form_submit', 'booking_click', 'phone_click', 'text_click', 'email_click', 'client_support_click'];
const pageTitles: Record<string, string> = {
  '/secure-ai': 'Secure AI', '/secure-ai/thank-you': 'Assessment request received', '/': 'Home', '/services': 'Services', '/about': 'About', '/industries': 'Industries', '/contact': 'Contact', '/privacy': 'Privacy Policy',
  ...Object.fromEntries(services.map(service => [`/services/${service.slug}`, service.name])),
};
/** Allowlisted paths and titles prevent URL query strings, hashes, or arbitrary input from reaching GA. */
export function analyticsPage(pathname: string) {
  const path = Object.hasOwn(pageTitles, pathname) ? pathname : '/not-found';
  return { page_location: `https://rnbcloud.com${path}`, page_title: pageTitles[path] || 'Page not found', page_referrer: '' };
}
export function analyticsConversion(detail: unknown) {
  if (!detail || typeof detail !== 'object') return null;
  const secure = secureAiConversion(detail as Record<string, unknown>);
  if (secure) return secure;
  const { name, service } = detail as Record<string, unknown>;
  if (!conversionNames.includes(name as ConversionName)) return null;
  return { name: name as ConversionName, parameters: typeof service === 'string' && services.some(item => item.id === service) ? { service } : {} };
}

const secureEvents = ['cta_click', 'secure_ai_page_view', 'quiz_start', 'quiz_complete', 'industry_tab_select', 'form_start', 'form_submit', 'generate_lead'];
/** Only fixed, approved values can reach GA; reject free text, answers and contact details. */
function secureAiConversion(detail: Record<string, unknown>) {
  if (typeof detail.name !== 'string' || !secureEvents.includes(detail.name)) return null;
  const parameters: Record<string, string> = { service: 'secure-ai' };
  const allowed: Record<string, string[]> = {
    result_band: ['ready', 'gaps', 'guardrails'],
    tab_name: ['general_office', 'law', 'cpa', 'retail', 'manufacturing'],
    quiz_id: ['ai_readiness_check'], cta_id: ['assessment', 'readiness_check', 'booking'],
    provider: ['google_appointment_schedule'],
    cta_location: ['hero', 'quiz_result', 'talk', 'final', 'nav', 'banner', 'ai_services_callout'],
  };
  for (const [key, values] of Object.entries(allowed)) {
    if (typeof detail[key] === 'string' && values.includes(detail[key])) parameters[key] = detail[key];
  }
  return { name: detail.name, parameters };
}
