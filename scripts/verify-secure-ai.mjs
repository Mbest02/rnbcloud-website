import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes, createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
const importSource = source => import('data:text/javascript;base64,' + Buffer.from(stripTypeScriptTypes(source)).toString('base64'));
const { readinessBand, QUESTIONS, INDUSTRIES, secureAiFaqs } = await importSource(await readFile(new URL('../src/lib/secure-ai.ts', import.meta.url), 'utf8'));
for (let score = 0; score <= 8; score++) assert.equal(readinessBand(score), score <= 2 ? 'ready' : score <= 5 ? 'gaps' : 'guardrails');
assert.equal(QUESTIONS.length, 5);
assert.equal(QUESTIONS[4].scored, false);
// All scored choices must match the button order used by the browser quiz.
for (const question of QUESTIONS.slice(0, 4)) question.opts.forEach((option, i) => assert.equal(option.pts, 2 - i));
assert.equal(Object.keys(INDUSTRIES).length, 5);
for (const industry of Object.values(INDUSTRIES)) { assert.equal(industry.items.length, 5); assert(industry.safe); }
assert.equal(secureAiFaqs.length, 8);
const analyticsSource = (await readFile(new URL('../src/lib/analytics.ts', import.meta.url), 'utf8')).replace("'@/lib/content'", JSON.stringify(new URL('../src/lib/content.ts', import.meta.url).href));
const { analyticsConversion, analyticsPage } = await importSource(analyticsSource);
for (const band of ['ready', 'gaps', 'guardrails']) {
  assert.deepEqual(analyticsConversion({ name: 'quiz_complete', result_band: band, email: 'private@example.com', quiz_score: 8, time_focus: 'email', answers: ['private'] }), { name: 'quiz_complete', parameters: { service: 'secure-ai', result_band: band } });
}
assert.deepEqual(analyticsConversion({ name: 'industry_tab_select', tab_name: 'private@example.com' }), { name: 'industry_tab_select', parameters: { service: 'secure-ai' } });
assert.deepEqual(analyticsConversion({ name: 'cta_click', cta_id: 'booking', provider: 'google_appointment_schedule' }), { name: 'cta_click', parameters: { service: 'secure-ai', cta_id: 'booking', provider: 'google_appointment_schedule' } });
assert.equal(analyticsPage('/secure-ai').page_location, 'https://rnbcloud.com/secure-ai');
const require = createRequire(import.meta.url);
const nextServer = pathToFileURL(require.resolve('next/server')).href;
let received;
globalThis.captureAssessment = inquiry => { received = inquiry; };
const stub = 'data:text/javascript;base64,' + Buffer.from('export async function deliverGoogleInquiry(inquiry) { globalThis.captureAssessment(inquiry); }').toString('base64');
const routeSource = (await readFile(new URL('../src/app/api/inquiry/route.ts', import.meta.url), 'utf8')).replace("'next/server'", JSON.stringify(nextServer)).replace("'@/lib/content'", JSON.stringify(new URL('../src/lib/content.ts', import.meta.url).href)).replace("'@/lib/inquiry-email'", JSON.stringify(stub));
const { POST } = await importSource(routeSource);
const { NextRequest } = await import(nextServer);
Object.assign(process.env, { INQUIRY_DELIVERY: 'google-smtp', GOOGLE_SMTP_USER: 'qa@example.com', GOOGLE_SMTP_APP_PASSWORD: 'qa-only', TURNSTILE_SECRET_KEY: 'qa-only', NEXT_PUBLIC_TURNSTILE_SITE_KEY: 'qa-only' });
globalThis.fetch = async () => Response.json({ success: true, hostname: 'rnbcloud-website.vercel.app', action: 'sales_inquiry' });
const valid = { name: 'QA Example', organization: 'QA Company', email: 'qa@example.com', phone: '502-555-0100', employeeCount: '1-10', interest: 'secure-ai', 'cf-turnstile-response': 'qa-token' };
async function post(extra = {}, origin = 'https://rnbcloud-website.vercel.app') { received = undefined; return POST(new NextRequest('https://rnbcloud-website.vercel.app/api/inquiry', { method: 'POST', headers: { origin, 'content-type': 'application/json' }, body: JSON.stringify({ ...valid, ...extra }) })); }
assert.equal((await post()).status, 200);
assert.equal(received.interest, 'secure-ai');
assert(received.message.includes('Employee count: 1-10'));
assert(received.message.includes('Assessment conversation request'));
assert(!received.message.includes('Staff AI use'));
assert(!received.message.includes('Busywork focus'));
assert(!received.message.includes('$'));
for (const extra of [{ employeeCount: 'private' }, { employeeCount: '' }, { organization: '' }, { phone: '' }, { email: 'invalid' }, { website: 'bot' }]) { assert.equal((await post(extra)).status, 400); assert.equal(received, undefined); }
assert.equal((await post({}, 'https://untrusted.example')).status, 403);
assert.equal(received, undefined);
const { sendInquiryEmails } = await import(new URL('../src/lib/inquiry-email.ts', import.meta.url).href);
const mails = [];
await sendInquiryEmails({ ...valid, message: 'Assessment conversation requested' }, async mail => { mails.push(mail); return { accepted: [mail.to] }; });
assert.equal(mails.length, 2);
assert(mails[0].subject.includes('Assessment'));
assert(mails[1].subject.includes('Assessment request received'));
assert(mails[1].text.includes('not a confirmed booking'));
assert(!mails[1].text.includes('fee is credited'));
assert(!/\$\d|90 days|per.user|pricing/i.test(mails[1].text));
assert(!mails[1].text.includes(valid.name));
console.log('PASS: all result boundaries, quiz scoring/order, five industries, eight FAQs, aggregate-only analytics, Assessment validation/origin checks, employee-count delivery and acknowledgment without survey disclosure. No real emails sent.');

const pageSource = await readFile(new URL('../src/app/secure-ai/page.tsx', import.meta.url), 'utf8');
assert(!/price:|priceCurrency:|\$\d|id="pricing"/.test(pageSource), 'No public pricing in page content or Service schema');
for (const file of ['../src/app/secure-ai/page.tsx', '../src/lib/secure-ai.ts', '../src/app/secure-ai/opengraph-image/route.tsx', '../src/app/secure-ai/thank-you/page.tsx', '../src/components/secure-ai/interactions.tsx', '../src/lib/inquiry-email.ts', '../src/app/api/inquiry/route.ts']) {
  const copy = await readFile(new URL(file, import.meta.url), 'utf8');
  assert(!/[\u2013\u2014]/u.test(copy), `No em or en dashes in ${file}`);
  assert(!/\$\d/.test(copy), `No public rates in ${file}`);
}
console.log('PASS: landing page, FAQ, metadata, structured data, OG art and thank-you copy contain no rates, em dashes or en dashes.');

const order = [...pageSource.matchAll(/<section[^>]*id="([^"]+)"/g)].map(match => match[1]);
assert.deepEqual(order, ['top', 'happening', 'catch', 'upside', 'examples', 'how', 'quiz', 'talk', 'why', 'faq', 'book']);
assert.equal(analyticsConversion({ name: 'pricing_view' }), null);
assert(!/request-pricing|90 days|priceCurrency/.test(pageSource));
console.log('PASS: funnel section order and removal of pricing analytics.');

for (const cta_location of ['hero', 'quiz_result', 'talk', 'final', 'nav', 'banner', 'ai_services_callout']) {
  assert.deepEqual(analyticsConversion({ name: 'cta_click', provider: 'google_appointment_schedule', cta_location, email: 'private@example.com' }), { name: 'cta_click', parameters: { service: 'secure-ai', provider: 'google_appointment_schedule', cta_location } });
}
assert.deepEqual(analyticsConversion({ name: 'cta_click', cta_location: 'private@example.com' }), { name: 'cta_click', parameters: { service: 'secure-ai' } });
const bookingSource = await readFile(new URL('../src/components/secure-ai/booking-link.tsx', import.meta.url), 'utf8');
assert(bookingSource.includes('target="_blank" rel="noopener"'));
const bookingConfig = await importSource(await readFile(new URL('../src/lib/secure-ai-booking.ts', import.meta.url), 'utf8'));
assert.equal(bookingConfig.SECURE_AI_BOOKING_URL, 'https://calendar.app.google/VsJWmGbJE4Yy23Rm6');
assert(!pageSource.includes('coming soon'));
assert(pageSource.includes('30-minute introductory conversation on Google Meet'));
for (const location of ['hero', 'talk', 'final']) assert(pageSource.includes(`location="${location}"`));
const interactions = await readFile(new URL('../src/components/secure-ai/interactions.tsx', import.meta.url), 'utf8');
assert(interactions.includes('location="quiz_result"'));
assert(!interactions.includes('dataset.assessmentBooking'), 'Booking events are handled once by the global tracker');
console.log('PASS: dedicated booking URL, safe new-tab attributes, location allowlist, booking contexts and intro-call copy.');

// Exercise the real delegated booking handler with a minimal DOM and event sink.
const asModule = text => 'data:text/javascript;base64,' + Buffer.from(text).toString('base64');
const reactStub = asModule('export function useEffect(effect) { effect(); }');
const eventStub = asModule('export function signalSecureAi(name, parameters) { globalThis.bookingEvents.push({ name, parameters }); } export function signalConversion() { throw new Error("Unexpected generic conversion"); }');
const handlerSource = (await readFile(new URL('../src/components/conversion-events.tsx', import.meta.url), 'utf8'))
  .replace("'react'", JSON.stringify(reactStub))
  .replace("'@/lib/content'", JSON.stringify(new URL('../src/lib/content.ts', import.meta.url).href))
  .replace("'@/lib/secure-ai-booking'", JSON.stringify(new URL('../src/lib/secure-ai-booking.ts', import.meta.url).href))
  .replace("'@/lib/conversions'", JSON.stringify(eventStub));
let onClick;
globalThis.document = { addEventListener(name, callback) { assert.equal(name, 'click'); onClick = callback; } };
globalThis.window = { location: { origin: 'https://rnbcloud.com' } };
globalThis.Element = class { constructor(location) { this.href = bookingConfig.SECURE_AI_BOOKING_URL; this.dataset = { secureAiBooking: location }; } closest() { return this; } };
globalThis.bookingEvents = [];
const { ConversionEvents } = await importSource(handlerSource);
ConversionEvents();
for (const location of ['hero', 'quiz_result', 'talk', 'final', 'nav', 'banner', 'ai_services_callout']) onClick({ target: new Element(location) });
assert.equal(bookingEvents.length, 7);
bookingEvents.forEach((event, index) => assert.deepEqual(event, { name: 'cta_click', parameters: { provider: 'google_appointment_schedule', cta_location: ['hero', 'quiz_result', 'talk', 'final', 'nav', 'banner', 'ai_services_callout'][index] } }));
console.log('PASS: actual global click handler emits one booking event with the exact provider and location for each entry point.');

for (const hash of ['#book', '#quiz']) {
  const target = new Element('hero');
  target.href = 'https://rnbcloud.com/secure-ai' + hash;
  onClick({ target });
}
assert.equal(bookingEvents.length, 7, 'In-page links must not emit booking CTA events');
for (const employeeCount of ['1-10', '11-25', '26-50']) assert.equal((await post({ employeeCount })).status, 200);
for (const employeeCount of ['1-3', '4-10', '11-50', '51+']) assert.equal((await post({ employeeCount })).status, 400);
const denied = await post({}, 'https://untrusted.example');
assert((await denied.json()).error.includes('support@rnbcloud.com'));
assert(!secureAiFaqs.flat().join(' ').match(/Guardrails|Secure Enable|Growth Partner|invent timelines/));
assert(!interactions.includes('We do not claim specific hour savings per task.'));
assert(!interactions.slice(interactions.indexOf('export function SecureAiTracking')).includes('cta_click'));
assert(!pageSource.includes('Your answers stay in this browser.'));
assert(pageSource.includes("AI.{' '}<br />"));
console.log('PASS: section links do not count as bookings, corrected employee bands, contact error fallback and reviewed FAQ/quiz copy.');
