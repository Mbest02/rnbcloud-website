export type ConversionName = 'consultation_click' | 'phone_click' | 'text_click' | 'email_click' | 'client_support_click' | 'consultation_form_submit' | 'booking_click';
/** Provider-neutral event hook. No network transmission or personal data. */
export function signalConversion(name: ConversionName, service?: string) {
  window.dispatchEvent(new CustomEvent('rnb:conversion', { detail: { name, ...(service ? { service } : {}) } }));
}

export type SecureAiEvent = 'cta_click' | 'secure_ai_page_view' | 'quiz_start' | 'quiz_complete' | 'industry_tab_select' | 'form_start' | 'form_submit' | 'generate_lead';
export function signalSecureAi(name: SecureAiEvent, parameters: Record<string, string> = {}) {
  window.dispatchEvent(new CustomEvent('rnb:conversion', { detail: { name, ...parameters } }));
}
