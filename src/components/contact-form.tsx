'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { company, services } from '@/lib/content';
import { signalConversion } from '@/lib/conversions';
export function ContactForm({ initialInterest = '' }: { initialInterest?: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const confirmation = useRef<HTMLDivElement>(null);
  const errorMessage = useRef<HTMLParagraphElement>(null);
  useEffect(() => { if (sent) confirmation.current?.focus(); }, [sent]);
  useEffect(() => { if (error) errorMessage.current?.focus(); }, [error]);
  const booking = process.env.NEXT_PUBLIC_BOOKING_URL || company.booking;
  const safeBooking = booking && /^https:\/\//.test(booking) ? booking : undefined;
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setPending(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/inquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(form)) });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'We couldn’t send your request. Please email support@rnbcloud.com or call 502-440-1380.');
      setSent(true);
      const interest = String(form.get('interest') || '');
      signalConversion('consultation_form_submit', services.some(service => service.id === interest) ? interest : undefined);
    } catch (e) { setError(e instanceof Error ? e.message : 'We couldn’t send your request. Please contact us by phone or email.'); }
    finally { setPending(false); }
  }
  if (sent) return <div className="success-box" role="status" tabIndex={-1} ref={confirmation}><h2>Thank you. Your request is on its way.</h2><p>We’ll review your message and get in touch to discuss your needs and the next step.</p>{safeBooking && <><p>Prefer to choose a time now?</p><a href={safeBooking} data-conversion="booking" className="button button-primary">Schedule a 30-Minute Consultation</a></>}</div>;
  return <form className="contact-form" onSubmit={submit} aria-busy={pending}><h2>Start a conversation.</h2><p className="form-note">Fields marked * are required. A few details are all we need to get started.</p><div className="form-fields">
    <label className="field">Name *<input name="name" autoComplete="name" required maxLength={120} /></label>
    <label className="field">Organization<input name="organization" autoComplete="organization" maxLength={160} /></label>
    <label className="field">Work email *<input name="email" type="email" autoComplete="email" required maxLength={254} /></label>
    <label className="field">Phone<input name="phone" type="tel" autoComplete="tel" maxLength={40} /></label>
    <label className="field full">What would you like help with?<select name="interest" defaultValue={initialInterest}><option value="">I’d like to discuss my options</option>{services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
    <label className="field full">Tell us a little about your needs *<textarea name="message" rows={5} required maxLength={4000} /></label>
    <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
  </div><p className="privacy-note">We’ll use these details to respond to your request. Please don’t include passwords or sensitive client information. <Link href="/privacy">Privacy Policy</Link></p>{error && <p className="form-status" role="alert" tabIndex={-1} ref={errorMessage}>{error}</p>}<button className="button button-primary" type="submit" disabled={pending}>{pending ? 'Sending…' : 'Send My Request'}</button></form>;
}
