# RnB Cloud website

Phase 1 foundation and Phase 2 service pages built with Next.js App Router, TypeScript, React, and Tailwind CSS. Self-hosted Montserrat and Inter fonts and optimized assets derived from the supplied brand toolkit.

## Run locally

Use Node.js 20.9 or newer and pnpm. Install the pinned dependencies with `pnpm install --frozen-lockfile`, then run `pnpm dev`. Open http://127.0.0.1:3000.

- `pnpm build`: production build (webpack compiler)
- `pnpm start`: run the production build locally
- `pnpm typecheck`: TypeScript validation

## Phase 1 scope

- Home, Services overview, About, Contact, Industries overview, and draft Privacy Policy
- Responsive shared header, services mega-menu, mobile navigation, and footer
- Official phone, text, email, and live Zoho Desk support link
- Seven service overview sections with anchors; dedicated service landing pages belong to Phase 2
- Page titles, descriptions, canonical URLs, Organization structured data, sitemap, robots, and a legacy privacy URL redirect
- Accessible form labels, required-field validation, server validation, bounded request size, same-origin checks, and a honeypot

Core content: `src/lib/content.ts`. Shared components: `src/components`. Routes and theme: `src/app`. Development decisions: `PROJECT_BRIEF.md`.

## Inquiry delivery

Copy `.env.example` to `.env.local` and configure a server-side HTTPS endpoint:

- `INQUIRY_WEBHOOK_URL`: a controlled endpoint that accepts JSON and durably stores or delivers inquiries
- `INQUIRY_WEBHOOK_TOKEN`: optional bearer token for that endpoint
- `NEXT_PUBLIC_BOOKING_URL`: optional HTTPS scheduling URL; defaults to the approved Google booking page
- `SITE_ORIGIN`: optional exact origin for other preview hosts; Vercel's deployment URL is supported automatically

The endpoint receives `name`, `organization`, `email`, `phone`, `interest`, `message`, `source`, and `submittedAt`. It must only return a successful HTTP status after accepting the inquiry for delivery/storage. Successful acceptance shows confirmation; a configured booking link is offered afterward. Missing or failing delivery shows an error with direct contact options. The site does not store inquiries itself or create Zoho Desk tickets.

Do not put secrets in `NEXT_PUBLIC_` variables. Avoid logging inquiry bodies or tokens. Use a least-privilege receiver. Before enabling public form delivery, configure durable rate limiting/bot protection at the hosting or receiver layer, verify delivery end to end, and document provider and retention details in the privacy policy.

## Deployment and launch

Prepared for Vercel using the default Next.js preset. Set environment variables in the hosting project and verify the production origin passes form origin validation. The current work is a local review preview; production deployment and domain changes have not been performed.

Before launch:

1. Approve visual design and final copy.
2. Review the seven dedicated service pages and their FAQs implemented in Phase 2.
3. Finalize inquiry delivery and bot protection; the approved Google booking link is available on Contact.
4. Review privacy text with the actual hosting, delivery, retention, analytics, and scheduling arrangements. The current policy is clearly marked as a draft and excluded from indexing.
5. Review remaining legacy URLs and redirects. Existing homepage fragments (`#services`, `#cybersecurity`, `#ai`, `#about`, `#contact`) need a migration decision because fragments are not sent to server redirects.
6. Perform production accessibility and performance checks, confirm consistent business details, and connect version control and reproducible deployment.

No active analytics collection in the local preview, fabricated client proof, unapproved partner badges, or Blake profile are included. Resources/blog and Sanity integration follow later. Original brand artwork is not redrawn; the icon is clipped in CSS to exclude lettering fragments already present in the provided standalone asset.

## Future content model

Service records hold ID/URL, label, outcome summary, capabilities, and icon. Phase 2 adds full service copy, related services, and FAQs to this model. Later CMS types should include Article (title, slug, category, author, body, dates, SEO), Case Study (approved problem/work/outcome), and Testimonial (approved quote, attribution, permission status). Publish only approved records; avoid empty resource pages.

## Phase 2 implementation

Seven service pages use `src/app/services/[slug]/page.tsx`, statically generated from the typed records in `src/lib/content.ts` and page content in `src/lib/service-pages.ts`. Each contains possible scope, client fit, process, FAQs, experience, related services, service-area copy, and contextual consultation/text actions. The service `slug` controls the route; `id` remains the contact form value. Cloud & Collaboration uses `/services/cloud-collaboration`; `/services/cloud-microsoft-365` and the previously planned `/services/cloud-business-email` redirect there. Hub anchors remain available.

Every service has unique metadata, Service/BreadcrumbList JSON-LD, sitemap inclusion, and a generated 1200×630 social sharing image using the official wordmark. FAQ expansion uses native keyboard-accessible details/summary elements.

### Conversion adapter

`ConversionEvents` emits browser-only `rnb:conversion` CustomEvents with `detail: { name, service? }`. Names: consultation_click, phone_click, text_click, email_click, client_support_click, consultation_form_submit, booking_click. The optional service is a validated internal ID. Inquiry acceptance fires only after the server returns success; booking click is not scheduling completion. The event hook excludes contact details, message content, and full URLs. The GA4 adapter uses validated event names and service IDs, strips URL query/hash values, uses fixed public page titles, and suppresses advertising signals. Collection requires hosted Vercel preview/production, the expected host, a Measurement ID, and explicit NEXT_PUBLIC_GA_ENABLED=true. Reporting is not active in the local preview; see LAUNCH_READINESS.md for stream settings and activation checks.

Verify the expanded build with `node scripts/verify-phase-2.mjs` against the local dev preview; the original Phase 1 checks remain in `scripts/verify-preview.mjs`.

## Supporting imagery

Image mappings and actual intrinsic dimensions are in `src/lib/page-images.ts`; `SupportingImage` uses Next Image, responsive sizes, native aspect ratios, and rounded containers. Ten supplied WebPs are served from `public/images`. Home uses a preloaded skyline strip within its hero; service images appear near the top and lazy load. Contact imagery stays secondary to the form. The concept board and its generated headshot are not published. Martin’s real photo remains in use.

## Launch readiness

See `LAUNCH_READINESS.md` for business-owned Vercel setup, Google booking, GA4 activation, privacy indexing, sales delivery, DNS controls, and the final QA gate. `vercel.json` pins the Next.js framework and install/build commands; `.vercelignore` excludes source concept boards, local review artifacts, environment files, and planning documents from deployment uploads.

Martin's photo stays in the existing About profile. To replace it, add the approved image under `public/team/` and update `image`, `imageWidth`, `imageHeight`, `imagePosition`, and `imageAlt` in `src/lib/leadership.ts`. The page and Person structured-data image both use that record. Use a new filename to avoid stale image caches.

Launch verification: `node scripts/verify-inquiry-delivery.mjs` tests the real handler with a controlled receiver; `node scripts/verify-launch-seo.mjs` checks the local preview and environment-dependent indexing gates. Neither replaces hosted staging delivery/analytics verification. See `artifacts/launch-readiness/QA-REPORT.md` for completed checks and remaining gates.

Deployment regression checks: `node scripts/verify-image-assets.mjs` validates all page/headshot assets and deployment exclusions. After redeploying, use `node scripts/verify-image-assets.mjs --base=https://rnbcloud-website.vercel.app` to check raw and optimized image responses. Keep `.vercelignore` folder exclusions anchored to the project root so the source `Images/` directory does not exclude `public/images/`. The contact endpoint accepts the approved stable staging alias and exact URLs from VERCEL_URL, VERCEL_PROJECT_PRODUCTION_URL, and VERCEL_BRANCH_URL. Additional custom test domains can use SITE_ORIGIN. Inquiry delivery still requires the separately confirmed HTTPS sales receiver.

Google Workspace sales email configuration is documented in `CONTACT_EMAIL_SETUP.md`. Set `INQUIRY_DELIVERY=google-smtp`, the support mailbox app password, and Cloudflare Turnstile keys in Vercel; redeploy before testing. Sales messages go to sales@rnbcloud.com with the prospect as Reply-To. Acknowledgments are fixed plain text with sales as Reply-To and are attempted only after Google accepts the sales message. `node scripts/verify-google-inquiry.mjs` exercises this flow with controlled stubs and no real emails.
