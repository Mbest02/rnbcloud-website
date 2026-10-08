# RnB Cloud launch readiness

## Current review state

October 8 refinements and the latest verification results are recorded in [the launch QA report](artifacts/launch-readiness/QA-REPORT.md). Desktop is approved by the user; final production approval is still pending. The browser viewport override remained at 1280px for all five requested sizes, so mobile/tablet/large-desktop verification is not complete.

The user has now supplied the hosted test URL: https://rnbcloud-website.vercel.app. Hosted testing exposed missing `/images/` assets and a 403 rejection for the stable project alias. The fixes scope `.vercelignore` exclusions to root folders, explicitly include `public`, and accept the exact approved staging alias plus the project's Vercel deployment/production/branch URL variables. Unrelated Vercel projects remain rejected. These corrections need a new deployment before hosted verification; no DNS change is needed. Project/team ownership details and final sales receiver remain unconfirmed.

The approved Phase 2 pages, supplied images, Martin profile, and support links remain in place. Contact now provides the inquiry form and a direct “Schedule a 30-Minute Consultation” link to https://calendar.app.google/VrHQ3Vq5wQCdNU9D6. All primary consultation CTAs still lead to Contact. Both `?interest=internal-id` and `?service=id-or-public-slug` select the correct service without changing the existing form IDs.

Sales delivery is still intentionally unconfigured. The form must show the direct-contact fallback until a receiver is selected; it cannot be described as a working delivery flow yet. Google booking provides a usable alternative independently of the form.

## Business-owned staging project

Vercel is selected; GoDaddy manages DNS. No Vercel project is linked in this checkout and the Vercel CLI is not installed. The user will provide the RnB Cloud-owned account/team, project name, and staging URL after project creation. Do not use a developer-owned account.

Prepared files: `vercel.json` (Next.js, frozen pnpm install, production build) and `.vercelignore` (excludes local environment files, planning documents, concept board, and review artifacts).

1. Create/import the project under the RnB Cloud-owned account/team. Use a business-owned Git repository for source history and reproducible deployments; a repository has not yet been initialized/connected here.
2. Use the project root, Node 24.x matching local validation, pnpm, and the Next.js preset. Do not assign the production domains for the staging review.
3. Configure Preview environment values directly in Vercel, then deploy a preview. Do not upload `.env.local`.
4. Verify all pages and integrations against the hosted staging URL. Preview deployments are marked noindex and their robots file disallows crawling.
5. Provide final QA results and obtain production approval before a production deployment or DNS change.

## Environment configuration

| Variable | Value or status |
| --- | --- |
| NEXT_PUBLIC_GA_MEASUREMENT_ID | G-QLJYT1B3XH |
| NEXT_PUBLIC_GA_ENABLED | false by default; enable on hosted Preview only after the stream checks below; enable Production after final review |
| NEXT_PUBLIC_BOOKING_URL | Optional override; defaults to the approved Google booking URL |
| INQUIRY_WEBHOOK_URL | Awaiting the internal sales mailbox/pipeline receiver |
| INQUIRY_WEBHOOK_TOKEN | Server-only token if required by the receiver |
| SITE_ORIGIN | Exact additional preview origin if needed; Vercel's deployment URL is already supported |
| PRIVACY_POLICY_APPROVED | false until final review; true enables Privacy indexing and sitemap inclusion on production |

Public GA/booking settings are build-time variables; redeploy after changing them. Keep inquiry credentials server-side.

## Analytics activation and verification

Prepared events: consultation_click, consultation_form_submit, booking_click, phone_click, text_click, email_click, client_support_click. Form success is recorded only after backend acceptance. Booking click does not mean a booking was completed; no completion event is claimed.

The adapter validates event names and service IDs, drops unexpected fields, uses an allowlist of public paths and titles, excludes query strings/fragments/referrer values, and disables Google Signals and ad personalization. No names, email addresses, phone numbers, organization names, or inquiry content are sent in custom event payloads. Google Analytics still processes technical usage information and browser identifiers; final privacy wording must reflect this.

Before enabling the adapter:

- Disable Enhanced Measurement for this GA4 stream so automatic form interaction, outbound link URLs, site-search terms, and history-based page views do not bypass the controlled event payloads or double-count manual page views.
- Enable GA4 email/query data redaction as an additional safeguard. Confirm retention and cookie choices for the final privacy review.
- Configure the desired key events in GA4; consultation_form_submit is the accepted-inquiry event.
- Enable the adapter in the business-owned Vercel Preview environment. Staging events carry deployment_environment=staging and debug_mode=true; production events carry deployment_environment=production. Do not count staging traffic as business leads.
- Check DebugView/Realtime and actual network payloads on hosted staging. Verify all event names, no form data/query values, one page_view per navigation, no success event on failed delivery, and no advertising integrations.

Sources: Google Analytics configuration reference https://developers.google.com/analytics/devguides/collection/ga4/reference/config; enhanced measurement https://support.google.com/analytics/answer/9216061; PII guidance https://support.google.com/analytics/answer/6366371.

## Inquiry receiver and privacy review

Choose the internal sales mailbox or pipeline and a receiver that accepts JSON and durably delivers/stores requests. Do not use the Zoho Desk support queue by default. Apply durable rate limiting/bot protection at the receiver or hosting layer and verify both acceptance and failure paths end to end. Use test-only details; confirm recipient delivery before enabling public requests.

Privacy draft now describes Vercel, forms, planned GA4, Google booking, and separate Zoho support. It remains marked draft and excluded from indexing until approved. Confirm the actual receiver, retention periods, analytics settings, cookie choices, and any applicable provider terms before approving the text. Setting the approval flag alone is not a substitute for this review.

## Production hostname and DNS

Canonical hostname remains https://rnbcloud.com. The sitemap uses this origin for Home, Services, all seven service pages, About, Industries, Contact, and (after privacy approval) Privacy. Legacy cloud-microsoft-365 and cloud-business-email URLs permanently redirect to cloud-collaboration.

Exact domain DNS records must come from the business-owned Vercel project's domain configuration once ready. No project-specific values are available yet; do not guess them. After final approval, document the exact apex and www records, configure www to redirect to the canonical apex in Vercel, and change only the necessary GoDaddy records. Preserve nameservers, Workspace MX/TXT, Zoho records, SPF/DKIM/DMARC, and the support subdomain. Confirm mail/support operation after any permitted change.

## Final QA gate

Local validation passed: production build/TypeScript, analytics payload allowlists, core and seven-service route checks, redirects, booking link placement, and service preselection. Desktop Contact was visually reviewed. The live Google booking destination displays “RnB Cloud Technology Consultation,” 30-minute appointments, and available appointment times; no appointment was submitted.

The browser's 320px viewport override did not take effect (the page continued to report 1280px), so this run does not confirm mobile layout. Repeat the 320px review on hosted staging with a working device/viewport control.

Hosted staging validation still required: accepted inquiry delivery and failed-delivery behavior; GA4 receipt/payload review; real booking destination; sitemap/robots and canonical consistency; keyboard and 320px mobile review; representative performance/accessibility checks; platform environment settings; privacy approval; ownership and repeatable deployment.

Resources/blog and CMS remain outside this phase. Client proof sections are omitted until approved material is supplied. Production deployment and DNS changes await final review.
