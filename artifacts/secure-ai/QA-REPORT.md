# Secure AI funnel review

Implemented on `codex/secure-ai-page` using Martin's latest overrides as the source of truth.

## Current behavior

The sections run in the exact requested order: top, happening, catch, upside, examples, how, quiz, talk, why, faq, book. Each stage has a short transition to the next. The page header links to the readiness check, examples, conversation, FAQ and booking. Other pages keep the site's normal navigation.

Hero headline, full subline, primary CTA, soft See how it works link and metadata use Martin's supplied copy. The research is split into adoption, security context and time savings, retaining the approved statistics, dates and sources. Industry tabs retain all five industries and 25 examples. Process, vendor choice and alongside-IT guidance are condensed into one section. The quiz retains its questions and scoring and uses the supplied result labels, with a booking CTA.

No prices, rate cards, per-user rates or time-limited credit language remain in the page, FAQ, JSON-LD, social copy, thank-you page or confirmation email. The general statement that the Assessment fee is credited toward a subsequent plan remains as requested. The pricing analytics event is removed and rejected by the analytics adapter.

Quiz answers stay in memory and are never included in the contact request. The contact form works without a quiz prerequisite and sends an Assessment conversation request through the existing protected inquiry flow. A request is not represented as a confirmed booking. Confirmation emails contain no prices or survey answers.

All booking entry points use the dedicated Google Appointment Schedule URL supplied by Martin. Each opens in a new tab with rel="noopener". The booking section explains that this schedules a 30-minute Google Meet introductory conversation to learn about the business, discuss pricing and scope the Assessment, rather than the Assessment itself. Direct contact and the inquiry form remain available. Trust and testimonials remain hidden.

## Validation after the team review

The earlier validation summary was incomplete: the launch SEO regression still expected 13 sitemap entries. The script now checks 14 entries and includes /secure-ai in its rendered-page title, canonical, description and schema checks. Results below were run against the revised code; they do not imply live inbox delivery or a real booking has been verified.

- Production build, including TypeScript: PASS.
- verify-analytics.mjs: PASS.
- verify-google-inquiry.mjs: PASS, controlled email/verification stubs only.
- verify-image-assets.mjs: PASS, local assets and deployment exclusion checks.
- verify-inquiry-delivery.mjs: PASS, controlled receiver only.
- verify-launch-seo.mjs: PASS, including 14 approved sitemap entries and 14 unique page titles.
- verify-phase-2.mjs: PASS.
- verify-preview.mjs: PASS.
- verify-secure-ai.mjs: PASS, including real booking event payloads, ignored hash navigation, unique service callout location, new employee bands and copy checks.
- git diff --check: PASS.

HTTP scripts ran against the local production build with SITE_ORIGIN=http://127.0.0.1:3000 set for that server process only, allowing localhost origin rejection/fallback checks. SMTP credentials were not configured, and no real inquiries or appointments were sent. No production settings were changed.

Browser checks at 1280px and 390px confirmed the H1 text has a space after AI., the form offers 1-10 / 11-25 / 26-50, the banner points internally to /secure-ai, the service breadcrumb and headline precede the callout, the callout has ai_services_callout tracking, footer punctuation uses commas, and the cost FAQ and Let's talk are the only visible fee-credit statements. No mobile horizontal overflow was observed.

Martin reported Lighthouse mobile scores of 93/100/100/100 during the team's acceptance pass. These are team-reported results, not a new measurement by this session. Review screenshots: review-fixes-desktop.jpg and review-fixes-mobile.jpg.

## Pending launch inputs and checks

Approved trust assets remain pending. Martin will run a real booking on the hosted preview to verify the calendar event, confirmation email, Meet link and cancel/reschedule links before approving a merge. Final campaign OG art can replace the interim brand art. Verify actual SMTP/Turnstile inbox delivery and GA4 DebugView on hosting. Measure throttled mobile LCP and complete the final accessibility review before production merge. No DNS, secrets, analytics IDs or production settings were changed.

## Dedicated booking integration

- Single shared booking link for hero, quiz result, conversation section, final booking, desktop/mobile nav and AI services callout. The homepage banner links internally to /secure-ai.
- Shared global event handler emits one `cta_click` per booking click, with `provider=google_appointment_schedule` and an allowlisted `cta_location`. The AI services callout uses `ai_services_callout`; the other locations are `hero`, `quiz_result`, `final`, `nav` and `banner` as specified.
- Automated test invokes the actual delegated event handler for each location and verifies exact payloads without PII. Attributes and URL are also checked.
- Browser checks verified all local destinations, including completed quiz, mobile nav, homepage banner and AI services callout. Google's live schedule identifies itself as AI Security & Readiness Intro Call, displays 30-minute appointments and says Google Meet details are added after booking. No appointment was booked.
- Owner acceptance pass is intentionally pending. Do not merge or deploy to production before Martin approves it.

## Review-round copy and behavior fixes

Removed the defensive industry disclaimer and timeline sentence, public FAQ plan names, duplicate quiz privacy wording, repeated fee-credit copy, and the repeated Start with phrasing in quiz tips. Fee credit remains once in Let's talk and once in the cost FAQ. The form origin error now offers support@rnbcloud.com and 502-440-1380. Employee bands match the booking form on both client and server. Internal section navigation emits no booking cta_click event. The homepage banner is an internal entry point rather than a booking link.
