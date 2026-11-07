'use client';
import { useEffect, useRef, useState, type KeyboardEvent, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { QUESTIONS, RESULTS, FOCUS, INDUSTRIES, readinessBand, secureAiFaqs, type Industry } from '@/lib/secure-ai';
import { signalSecureAi } from '@/lib/conversions';
import { AssessmentBookingLink } from '@/components/secure-ai/booking-link';
import { InquiryVerification } from '@/components/inquiry-verification';

export function ReadinessQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [complete, setComplete] = useState(false);
  const started = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const changed = useRef(false);
  useEffect(() => { if (changed.current) heading.current?.focus(); }, [step, complete]);
  const score = answers.slice(0, 4).reduce((total, answer) => total + (2 - answer), 0);
  const band = readinessBand(score);
  const result = RESULTS[band];
  const focus = (['email', 'docs', 'admin', 'mix'] as const)[answers[4] ?? 3];
  function choose(answer: number) {
    if (!started.current) { signalSecureAi('quiz_start', { quiz_id: 'ai_readiness_check' }); started.current = true; }
    const next = [...answers]; next[step] = answer; setAnswers(next); changed.current = true;
    if (step < 4) setStep(step + 1);
    else { setComplete(true); signalSecureAi('quiz_complete', { result_band: readinessBand(next.slice(0, 4).reduce((total, item) => total + 2 - item, 0)) }); }
  }
  return <div className="sa-quiz-card">
    <div aria-live="polite" aria-atomic="true">
      {complete ? <><p className={`sa-result-band sa-band-${band}`}>{result.band}</p><h3 ref={heading} tabIndex={-1}>{result.title}</h3><p>{result.lead}</p><ul className="sa-takeaways"><li>{result.sec}</li><li>{FOCUS[focus]}</li><li>Book a 30-minute Google Meet conversation to discuss your business and scope the Assessment.</li></ul></> : <><div className="sa-progress" aria-hidden="true">{QUESTIONS.map((_, i) => <span key={i} className={i <= step ? 'filled' : ''} />)}</div><p className="sa-meta">Question {step + 1} of 5</p><h3 ref={heading} tabIndex={-1} id="sa-question">{QUESTIONS[step].q}</h3></>}
    </div>
    {complete ? <div className="actions"><AssessmentBookingLink location="quiz_result" /><button type="button" className="button button-secondary" onClick={() => { setAnswers([]); setStep(0); setComplete(false); started.current = false; }}>Retake the check</button></div> : <><div className="sa-options" role="group" aria-labelledby="sa-question">{QUESTIONS[step].opts.map((option, i) => <button type="button" key={`${step}-${i}`} className={answers[step] === i ? 'selected' : ''} onClick={() => choose(i)}>{option.label}</button>)}</div>{step > 0 && <button type="button" className="sa-back" onClick={() => { changed.current = true; setStep(step - 1); }}><ArrowLeft size={16} aria-hidden="true" />Back</button>}<p className="sa-small sa-quiz-privacy">Helpful self-check only, not a security audit. For a full picture, book the Assessment.</p></>}
    <noscript>This check needs JavaScript. Call 502-440-1380 for help assessing your AI setup.</noscript>
  </div>;
}
const tabs: [Industry, string][] = [['general_office', 'General Office'], ['law', 'Law Firms'], ['cpa', 'CPA & Accounting'], ['retail', 'Retail'], ['manufacturing', 'Manufacturing']];
export function IndustryTabs() {
  const [selected, setSelected] = useState<Industry>('general_office');
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  function select(index: number, focus = false) { const key = tabs[index][0]; setSelected(key); signalSecureAi('industry_tab_select', { tab_name: key }); if (focus) buttons.current[index]?.focus(); }
  function keydown(event: KeyboardEvent, index: number) {
    const keys = ['ArrowRight', 'ArrowLeft', 'Home', 'End']; if (!keys.includes(event.key)) return;
    event.preventDefault(); select(event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length, true);
  }
  return <><div className="sa-tabs" role="tablist" aria-label="Industry examples">{tabs.map(([key, title], i) => <button key={key} ref={el => { buttons.current[i] = el; }} id={`sa-tab-${key}`} role="tab" aria-selected={selected === key} aria-controls={`sa-panel-${key}`} tabIndex={selected === key ? 0 : -1} onClick={() => select(i)} onKeyDown={event => keydown(event, i)}>{title}</button>)}</div>
    {tabs.map(([key]) => <div key={key} id={`sa-panel-${key}`} role="tabpanel" aria-labelledby={`sa-tab-${key}`} tabIndex={0} hidden={selected !== key}><div className="sa-examples">{INDUSTRIES[key].items.map(([title, description]) => <article key={title}><h3>{title}</h3><p>{description}</p></article>)}</div><p className="sa-safe-note">{INDUSTRIES[key].safe}</p></div>)}<p className="sa-small sa-example-note">Examples are illustrative. Attorneys and CPAs: AI drafts support your review; you stay accountable for the final work product.</p></>;
}
export function SecureAiFaq() {
  const [open, setOpen] = useState<number | null>(null);
  return <div className="sa-faq">{secureAiFaqs.map(([question, answer], i) => <div key={question}><h3><button type="button" id={`sa-faq-question-${i}`} aria-expanded={open === i} aria-controls={`sa-faq-answer-${i}`} onClick={() => setOpen(open === i ? null : i)}>{question}<ChevronDown size={20} aria-hidden="true" /></button></h3><div id={`sa-faq-answer-${i}`} role="region" aria-labelledby={`sa-faq-question-${i}`} hidden={open !== i}><p>{answer}</p></div></div>)}</div>;
}
export function AssessmentForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [reset, setReset] = useState(0);
  const started = useRef(false);
  const errorElement = useRef<HTMLParagraphElement>(null);
  useEffect(() => { if (error) errorElement.current?.focus(); }, [error]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (pending) return;
    setPending(true); setError('');
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/inquiry', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...Object.fromEntries(form), interest: 'secure-ai' }) });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'We couldn’t deliver your request. Please call 502-440-1380 or email support@rnbcloud.com.');
      signalSecureAi('form_submit'); signalSecureAi('generate_lead');
      router.push('/secure-ai/thank-you');
    } catch (err) { setError(err instanceof Error ? err.message : 'Please call 502-440-1380 or email support@rnbcloud.com.'); setPending(false); setReset(value => value + 1); }
  }
  return <form className="sa-assessment-form" onSubmit={submit} aria-busy={pending} onFocusCapture={() => { if (!started.current) { started.current = true; signalSecureAi('form_start'); } }}><p className="sa-small">Fields marked * are required.</p><div className="sa-fields">
    <label>Name *<input name="name" required maxLength={120} autoComplete="name" /></label>
    <label>Company *<input name="organization" required maxLength={160} autoComplete="organization" /></label>
    <label>Email *<input name="email" type="email" required maxLength={254} autoComplete="email" /></label>
    <label>Phone *<input name="phone" type="tel" required maxLength={40} autoComplete="tel" /></label>
    <label>Employee count *<select name="employeeCount" required defaultValue=""><option value="">Select…</option>{['1-10', '11-25', '26-50'].map(value => <option key={value}>{value}</option>)}</select></label>
    <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
  </div><p className="sa-small">We’ll use your contact details to arrange an Assessment conversation. Your quiz answers are not included. <Link href="/privacy">Privacy Policy</Link></p><InquiryVerification reset={reset} />{error && <p role="alert" tabIndex={-1} ref={errorElement}>{error}</p>}<button className="button button-light" disabled={pending} type="submit">{pending ? 'Sending…' : 'Request an Assessment conversation'}</button></form>;
}
/** Routed through the existing hostname-gated GA integration; no form values or quiz answers. */
export function SecureAiTracking() {
  useEffect(() => {
    const timer = setTimeout(() => signalSecureAi('secure_ai_page_view'), 0);
    return () => clearTimeout(timer);
  }, []);
  return null;
}
