## Secure AI assessment funnel

Adds `/secure-ai` with the requested flow from current AI adoption and security context to time savings, industry examples, practical guardrails, a readiness check and an Assessment conversation. The page uses the supplied headline, full subline, metadata, quiz result labels, conversation copy and cost FAQ. The page header navigates between its sections; other pages retain the main site navigation.

Includes the client-side quiz, five accessible industry tabs, FAQ, protected Assessment inquiry form, confirmation email, thank-you page, SEO/social metadata, interim brand OG art and structured data. Adds homepage, services and footer entry points. All prices, time-limited credit wording, pricing analytics and em/en dashes are removed from the feature and its email flow. Quiz answers never leave the browser.

Every booking entry point uses the dedicated Google Appointment Schedule for a 30-minute Google Meet introductory conversation. Links open in a new tab with rel="noopener" and emit one allowlisted cta_click event with provider and location. The homepage banner and AI service callout use the same schedule. Direct contact and the inquiry form remain available. Trust content stays hidden. Production settings, DNS, secrets and analytics IDs are unchanged.

### Validation

- Production build and TypeScript pass.
- Existing analytics and protected Google email regression tests pass.
- Focused tests cover scoring boundaries, content coverage, inquiry validation, privacy, exact funnel order, rejected pricing analytics and prohibited-copy searches.
- Desktop/mobile browser checks cover navigation, copy, keyboard quiz progression, booking CTA, FAQ and layout. No real emails sent.

Before launch: Martin will test every booking entry point, quiz, tabs, FAQ and navigation on desktop/mobile, check for prohibited punctuation or prices, and complete a real booking to verify email, calendar, Meet and cancel/reschedule links. Hosted delivery/GA4 and mobile performance remain acceptance checks. Do not merge or deploy to production until Martin approves. Detailed evidence is in `artifacts/secure-ai/QA-REPORT.md`.
