# Contact email activation

The user selected Google Workspace, sales@rnbcloud.com as the receiving alias/group, support@rnbcloud.com as the authenticated sender, and a short acknowledgment. Replying to the internal notification reaches the prospect; replying to the acknowledgment reaches sales. No Zoho Desk ticket API is used.

## Vercel settings

Add these to Preview and Production, then redeploy. Do not commit credentials or paste passwords into chat.

| Variable | Value |
| --- | --- |
| INQUIRY_DELIVERY | google-smtp |
| GOOGLE_SMTP_USER | support@rnbcloud.com |
| GOOGLE_SMTP_APP_PASSWORD | App password created for this website on the support mailbox |
| NEXT_PUBLIC_TURNSTILE_SITE_KEY | Public Cloudflare Turnstile widget site key |
| TURNSTILE_SECRET_KEY | Matching server-only secret |

Remove unused INQUIRY_WEBHOOK_URL/TOKEN values when activating Google delivery. SMTP uses smtp.gmail.com:465 with TLS, never the normal mailbox password. Google app passwords require two-step verification and may be unavailable under organizational/security policies. If unavailable, keep those policies and use an OAuth-based connection instead. An actual authenticated support mailbox is required; an alias/group cannot authenticate on its own.

Google instructions: https://support.google.com/a/answer/176600 and https://support.google.com/accounts/answer/185833

Create the Turnstile widget under an RnB Cloud-owned Cloudflare account. Allow rnbcloud.com, www.rnbcloud.com, and rnbcloud-website.vercel.app. Add exact additional review domains only when used. Do not use the testing keys in public environments. Client rendering and server validation check the token, sales_inquiry action and submitting hostname. Expired/used tokens are rejected; failed submissions refresh the widget for retry. No domain nameserver/DNS migration is needed to use Turnstile.

Cloudflare instructions: https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/ and https://developers.cloudflare.com/turnstile/get-started/server-side-validation/

In Vercel Firewall, add a rate-limiting rule for POST /api/inquiry, initially 5 requests per source IP per 60 seconds, and block excess requests. Review shared-office traffic and tune as needed. Rate limits are regional. This dashboard rule is not configured by the website code and remains a launch prerequisite. The Turnstile integration and honeypot do not replace durable rate limiting.

Vercel instructions: https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting

## Retention

Chosen policy: unconverted website inquiries are retained for up to 12 months after the last inquiry-related contact. Relevant converted inquiries follow client-record policies; legal obligations/disputes can require longer retention.

The site does not store inquiries in a database and does not automatically delete Google mail. Designate a mailbox owner to track the last contact date and review records monthly. Remove expired records from the sales destination, group-member copies, and support Sent folder; also review forwarding, archives and Google Vault rules so they do not contradict the policy. Copies controlled by the visitor are outside this process. Implement the mailbox procedure before approving the Privacy Policy. Analytics retention is a separate setting and has not been selected by this policy.

## Staging acceptance

- Confirm the sales alias/group receives mail from support and its members receive the inquiry; check moderation/spam and forwarding.
- Submit a test-only inquiry using a mailbox you control. Confirm sales receipt, acknowledgment receipt, correct reply-to addresses, and one form-success analytics event.
- Verify SPF/DKIM/DMARC and inspect delivery to an external mailbox; do not alter existing mail DNS without review.
- Test expired/invalid verification and hosting rate limits. Failed verification sends no messages.
- Failed sales SMTP acceptance returns an error and sends no acknowledgment. A later acknowledgment failure logs only inquiry_acknowledgment_failed and does not encourage resubmitting an accepted sales message. SMTP acceptance does not prove eventual inbox delivery; monitor bounces on support.
- Verify keyboard, mobile widget, slow network/retry and visible success/failure on hosted staging.
- Complete privacy/analytics review, then set PRIVACY_POLICY_APPROVED=true. Do not set it merely to hide the review banner.

Controlled local tests and production build pass. Google/Cloudflare credentials have not been supplied, no real emails have been sent, and real staging delivery remains unverified. Production DNS remains unchanged.

## Troubleshooting delivery selection

Google SMTP is now the default when INQUIRY_DELIVERY is absent or blank. The value is trimmed and case normalized; explicit webhook is required for the legacy receiver. Unknown modes fail closed. The earlier message “Online requests are not available yet” indicates the legacy webhook path was selected before Google delivery was attempted. Verify the Vercel environment scope for the deployment you are actually using and redeploy after saving settings. The stable vercel.app domain can serve a Production deployment even before the business domain is attached; setting variables only for Preview will not configure that deployment.

Required values: GOOGLE_SMTP_USER=support@rnbcloud.com, GOOGLE_SMTP_APP_PASSWORD, NEXT_PUBLIC_TURNSTILE_SITE_KEY, TURNSTILE_SECRET_KEY. INQUIRY_DELIVERY=google-smtp is still recommended for clarity. Missing settings produce inquiry_configuration_missing in the function log followed by setting names only. Values and passwords are never logged. The SMTP adapter removes spaces from Google's displayed app-password grouping. A successful widget only confirms browser verification; the server must also validate the token and then deliver mail.
