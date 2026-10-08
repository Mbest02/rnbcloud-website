export type ConversionName = 'consultation_click' | 'phone_click' | 'text_click' | 'email_click' | 'client_support_click' | 'consultation_form_submit' | 'booking_click';
/** Provider-neutral event hook. No network transmission or personal data. */
export function signalConversion(name: ConversionName, service?: string) {
  window.dispatchEvent(new CustomEvent('rnb:conversion', { detail: { name, ...(service ? { service } : {}) } }));
}
