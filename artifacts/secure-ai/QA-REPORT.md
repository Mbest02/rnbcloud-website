# Secure AI funnel review

Implemented on `codex/secure-ai-page` using Martin's latest overrides as the source of truth.

## Current behavior

The sections run in the exact requested order: top, happening, catch, upside, examples, how, quiz, talk, why, faq, book. Each stage has a short transition to the next. The page header links to the readiness check, examples, conversation, FAQ and booking. Other pages keep the site's normal navigation.

Hero headline, full subline, primary CTA, soft See how it works link and metadata use Martin's supplied copy. The research is split into adoption, security context and time savings, retaining the approved statistics, dates and sources. Industry tabs retain all five industries and 25 examples. Process, vendor choice and alongside-IT guidance are condensed into one section. The quiz retains its questions and scoring and uses the supplied result labels, with a booking CTA.

No prices, rate cards, per-user rates or time-limited credit language remain in the page, FAQ, JSON-LD, social copy, thank-you page or confirmation email. The general statement that the Assessment fee is credited toward a subsequent plan remains as requested. The pricing analytics event is removed and rejected by the analytics adapter.

Quiz answers stay in memory and are never included in the contact request. The contact form works without a quiz prerequisite and sends an Assessment conversation request through the existing protected inquiry flow. A request is not represented as a confirmed booking. Confirmation emails contain no prices or survey answers.

All booking entry points use the dedicated Google Appointment Schedule URL supplied by Martin. Each opens in a new tab with rel="noopener". The booking section explains that this schedules a 30-minute Google Meet introductory conversation to learn about the business, discuss pricing and scope the Assessment, rather than the Assessment itself. Direct contact and the inquiry form remain available. Trust and testimonials remain hidden.

## Validation

- Production build, including TypeScript, passes.
- Existing analytics and protected Google email regression scripts pass.
- Focused Secure AI tests cover all quiz result boundaries, scoring, five industries, eight FAQs, aggregate-only analytics, Assessment validation and origin rejection, employee-count delivery, fixed acknowledgment, exact section order and rejected pricing analytics. Controlled stubs send no real emails.
- Source searches across the feature, inquiry endpoint and email module find no em or en dashes, dollar amounts, per-user rates or time-limited credit language.
- Browser checks at 1280px and 390px verify exact section order, hero links, header anchor links, metadata, price-free copy, mobile menu, keyboard quiz progression, booking result CTA and the exact cost FAQ answer. No horizontal overflow at either width. No browser errors or warnings observed.
- `git diff --check` passes.
- Review images: `booking-desktop-1280.jpg`, `booking-mobile-390.jpg`.

## Pending launch inputs and checks

Approved trust assets remain pending. Martin will run a real booking on the hosted preview to verify the calendar event, confirmation email, Meet link and cancel/reschedule links before approving a merge. Final campaign OG art can replace the interim brand art. Verify actual SMTP/Turnstile inbox delivery and GA4 DebugView on hosting. Measure throttled mobile LCP and complete the final accessibility review before production merge. No DNS, secrets, analytics IDs or production settings were changed.

## Dedicated booking integration

- Single shared booking link for hero, quiz result, conversation section, final booking, desktop/mobile nav, homepage banner and AI services callout.
- Shared global event handler emits one `cta_click` per booking click, with `provider=google_appointment_schedule` and an allowlisted `cta_location`. The AI services callout uses `talk`; the other locations are `hero`, `quiz_result`, `final`, `nav` and `banner` as specified.
- Automated test invokes the actual delegated event handler for each location and verifies exact payloads without PII. Attributes and URL are also checked.
- Browser checks verified all local destinations, including completed quiz, mobile nav, homepage banner and AI services callout. Google's live schedule identifies itself as AI Security & Readiness Intro Call, displays 30-minute appointments and says Google Meet details are added after booking. No appointment was booked.
- Owner acceptance pass is intentionally pending. Do not merge or deploy to production before Martin approves it.
