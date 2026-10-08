# Launch-readiness review — October 8, 2026

The approved desktop website has been refined. This is a local review, not final production approval. No hosted staging deployment or production DNS change was made.

## Implementation

- Homepage hero label now reads Cloud & Collaboration.
- Managed IT and Network & Infrastructure use larger artwork beside hero copy; Cybersecurity and AI use image/copy splits in their business-context sections. Other service pages retain the wider image treatment. The existing supplied assets are cropped with object-fit, never stretched.
- Martin's full and short biographies now say 10 years. His current photo component is preserved; source, dimensions, focal position, and alt text are editable in one leadership record.
- Sales form delivery remains a configurable HTTPS receiver, independent of Zoho Desk. The receiver is not configured.
- GA4 integration uses G-QLJYT1B3XH and the seven approved conversion names. Collection is gated off locally and awaits hosted activation/stream verification.
- Privacy copy now describes the configured analytics state rather than promising a future integration. Final sales provider, retention, and cookie settings still require confirmation. Policy approval/indexing remains off.
- Services dropdown links now follow their trigger in keyboard order. Skip link targets a focusable main region. Form failure and success states receive focus; pending submission exposes aria-busy.
- Small blue text and card numbers were darkened; form borders now have stronger contrast. Contrast checks were informed by [W3C's contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). This is not a claim of complete WCAG conformance.
- Static CSS review identified and fixed a tablet Contact overlap: the next-steps card starts after the new booking card and heading. Actual tablet rendering still requires verification.

## Completed checks

- Production build and TypeScript passed.
- Core/service verification passed: all 13 pages, service scope/FAQs/selection, sharing images, redirects and missing-page behavior.
- Desktop DOM review at actual 1280px: one H1 per page, image alt attributes, named buttons, and no horizontal page overflow. Lazy footer images may remain unloaded before scrolling; this was not treated as an image failure.
- Services dropdown: Enter opens; Tab reaches Explore all services; Escape closes and returns focus to Services. Visible 3px outline was observed.
- Every service FAQ: all 36 accordions opened with Enter and closed with Space.
- Skip link focuses main. Empty form submission focuses Name. Form Tab order runs through Organization, Email, Phone, Service, Message, Privacy, and Send; visible outlines were observed on each. A valid local submission with no configured receiver shows the direct-contact error, focuses the alert, returns pending to false, and does not show success.
- Controlled route-handler test: receiver 202 acceptance returns success; rejected or failing receiver returns an error. Honeypot, invalid interest/email, disallowed origin, non-JSON, malformed JSON, and oversize requests are rejected before delivery. Missing or non-HTTPS receiver never claims success. This uses a stub receiver and proves handler behavior only.
- Analytics payload allowlists passed: unknown events/services and extra personal fields are discarded; query strings, fragments, and arbitrary paths do not reach page payloads.
- SEO checks passed locally: unique titles, descriptions, apex canonicals, Organization/Person/Service/Breadcrumb JSON-LD, service OG URLs, cloud legacy redirects, privacy redirect and support redirect. Preview robots disallows crawling; production privacy indexing and sitemap inclusion require approval. Approved sitemap contains 13 apex URLs.
- Google booking destination resolves to RnB Cloud Technology Consultation. Client Support resolves to the live Zoho portal. No appointment or support ticket was submitted.
- Phone/SMS/email hrefs use the approved numbers/address; desktop review does not verify phone dialing or SMS operation on a real handset.

## Responsive control blocker

| Requested width | Actual rendered width | Result |
| --- | --- | --- |
| 390px | 1280px | Pending; override ineffective |
| 430px | 1280px | Pending; override ineffective |
| 768px | 1280px | Pending; override ineffective |
| 1280px | 1280px | Desktop review completed |
| 1920px | 1280px | Pending; override ineffective |

The documented browser viewport control returned without changing page dimensions, including after reload. Temporary overrides were reset. Results are recorded in responsive-control-results.json. Recheck all requested widths with working viewport controls or real devices before approval, including mobile navigation and focus behavior.

## Remaining production gates

1. RnB Cloud-owned Vercel team/project and hosted staging URL.
2. Confirm sales receiver, then verify real recipient delivery, failure handling, visible success/focus, and exactly one successful conversion. No real delivery or success UI is verified yet.
3. Durable bot/rate-abuse protection at receiver/hosting, then staged abuse tests. The current honeypot and request validation are verified, but do not provide durable rate limiting.
4. Confirm GA4 stream settings, activate on staging, and inspect actual receipt/payloads for all seven events and page views. No GA4 collection receipt is verified locally.
5. Confirm provider/retention/cookie settings; finalize and approve Privacy wording based on that actual configuration.
6. Responsive/mobile navigation, handset phone/SMS behavior, screen-reader and complete focus review, and representative hosted performance/accessibility checks.
7. Hosted metadata, robots, sitemap, redirects, canonical host/WWW redirect and SSL verification. Project-specific DNS values must come from Vercel; preserve email/support records.
8. Final staging approval before any production deployment or DNS cutover.
