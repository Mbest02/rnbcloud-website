import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, Button } from '@/components/ui';
export const metadata: Metadata = { title: 'Assessment Request Received', robots: { index: false, follow: false } };
export default function AssessmentThankYou() {
  return <section className="section"><div className="wrap" style={{ maxWidth: 800 }}><Eyebrow>Your next step</Eyebrow><h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Thank you. We received your Assessment request.</h1><p className="lead">We’ll contact you to discuss your team and arrange a time. Your request is not a confirmed booking.</p><p style={{ marginTop: 20 }}>The Assessment is read-only. We don’t change your systems. You receive a written scorecard and a live readout with the owner.</p><p style={{ marginTop: 20 }}>Questions? Call <a href="tel:5024401380">502-440-1380</a>, text <a href="sms:5022088747">502-208-8747</a>, or email <a href="mailto:support@rnbcloud.com">support@rnbcloud.com</a>.</p><div className="actions"><Button href="/secure-ai">Back to Secure AI</Button><Link href="/">Return home</Link></div></div></section>;
}
