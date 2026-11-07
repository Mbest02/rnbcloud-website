'use client';
import { useEffect } from 'react';
import { services } from '@/lib/content';
import { SECURE_AI_BOOKING_URL, type BookingLocation } from '@/lib/secure-ai-booking';
import { signalSecureAi, signalConversion } from '@/lib/conversions';
export function ConversionEvents() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;
      const link = event.target.closest('a');
      if (!link) return;
      const url = new URL(link.href, window.location.origin);
      const location = link.dataset.secureAiBooking;
      if (link.href === SECURE_AI_BOOKING_URL && location && ['hero', 'quiz_result', 'talk', 'final', 'nav', 'banner'].includes(location)) {
        signalSecureAi('cta_click', { provider: 'google_appointment_schedule', cta_location: location as BookingLocation });
      } else if (url.protocol === 'tel:') signalConversion('phone_click');
      else if (url.protocol === 'sms:') signalConversion('text_click');
      else if (url.protocol === 'mailto:') signalConversion('email_click');
      else if (url.hostname === 'support.rnbcloud.com') signalConversion('client_support_click');
      else if (link.dataset.conversion === 'booking') signalConversion('booking_click');
      else if (url.origin === window.location.origin && url.pathname === '/contact') {
        const interest = url.searchParams.get('interest');
        signalConversion('consultation_click', services.some(service => service.id === interest) ? interest! : undefined);
      }
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);
  return null;
}
