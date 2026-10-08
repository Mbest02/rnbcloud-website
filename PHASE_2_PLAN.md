# Phase 2 — Service depth

Prepared after review of the Phase 1 preview, project brief, specification, and confirmed user decisions. The seven dedicated pages are implemented for local review. Integration decisions remain documented below.

## Objective

Give prospective clients a useful, dedicated destination for each service, with business-focused explanations, relevant FAQs, related services, and a clear consultation path. Retain the approved Phase 1 visual direction.

## Seven pages

| Service | Route | Main content focus |
| --- | --- | --- |
| Managed IT Services | /services/managed-it | Support, monitoring, patching, account administration, vendor coordination, onboarding, and technology planning; full and co-managed relationships. |
| Cybersecurity | /services/cybersecurity | Layered endpoint, identity, email, and network protection; discovery assessments, practical remediation, and recovery planning. |
| Cloud & Collaboration | /services/cloud-collaboration | Microsoft 365 and Google Workspace administration, Outlook/Gmail, collaboration, permissions, migrations, and cloud data recovery. |
| AI & Automation | /services/ai-automation | Readiness, Copilot, workflow opportunities, responsible adoption, privacy, permissions, and governance. |
| Backup & Disaster Recovery | /services/backup-disaster-recovery | Backup scope, retention, monitoring, recovery verification, recovery priorities, and continuity planning. |
| Network & Infrastructure | /services/network-infrastructure | Business Wi-Fi, firewalls, switching, secure access, multi-site connectivity, servers, virtualization, and lifecycle planning. |
| IT Projects & Consulting | /services/it-consulting | Scoped migrations, upgrades, office moves, refreshes, assessments, remediation, and vendor coordination. |

The new cloud route reflects support for both platforms. Keep the existing cloud-microsoft-365 service ID for form compatibility, preserve current service-hub anchors, and add a redirect from /services/cloud-microsoft-365 to /services/cloud-collaboration.

## Shared page structure

1. Breadcrumbs and a service-specific hero with a practical outcome and consultation action.
2. Common business problems and the approach to addressing them.
3. Capabilities grouped into readable sections, with scope described accurately.
4. Who the service fits, including internal IT collaboration where relevant.
5. What engagement looks like: discovery, assessment, scope, implementation/support.
6. Four to six original, service-specific FAQs using accessible expandable sections.
7. Related services and a closing consultation action.

Use the shared brand system with varied layouts and restrained diagrams where they explain a service. Avoid repeating identical long card grids on every page.

## Implementation sequence

1. Extend the typed service content model with a route, page copy, capabilities, FAQs, and related-service IDs. Keep route slugs separate from existing form IDs.
2. Build the reusable landing-page structure and FAQ component. Complete Managed IT first as the design reference.
3. Write and implement the remaining six service pages using the approved capability boundaries.
4. Update Home, Services, header, footer, and industry links to the dedicated pages; retain useful hub anchors.
5. Add unique metadata, canonical URLs, Service and BreadcrumbList structured data, sitemap entries, and the legacy cloud redirect. FAQs must remain useful visible content; do not promise search-result enhancements.
6. Verify routes, navigation, contact interest preselection, mobile layouts from 320px, keyboard behavior, headings, structured data, TypeScript, and production build. Review representative page performance and accessibility.
7. Present the local preview and final service copy for review before launch work.

## Conversion preparation

Consultation actions continue to use the Contact page, with the relevant service preselected. Phone, email, and Client Support remain available.

Define conversion events for consultation, phone, email, support, and successfully accepted inquiries. Keep event payloads free of names, emails, phone numbers, and inquiry text. Choose the analytics provider and privacy approach before enabling tracking; do not add an unconfigured third-party tracker.

Inquiry routing remains configurable during development. Public delivery requires a real receiver, durable delivery/storage, bot protection, and an end-to-end check. Scheduling remains optional until a booking URL exists; do not track scheduling completion without a verified provider signal.

## Decisions that remain for launch readiness

- Inquiry receiver: internal mailbox or sales pipeline, provider, and retention arrangement.
- Booking URL, when created.
- Analytics provider and related privacy/cookie choices.
- Actual service inclusions and exclusions to confirm during final copy review.

These decisions do not block the seven-page implementation. Final privacy text and production launch depend on the integration choices.

## Content guardrails

- Service area: Louisville - Elizabethtown - Southern Indiana & surrounding regions.
- Support both Microsoft 365 and Google Workspace; education includes Google Workspace for Education and Jamf.
- Pricing remains consultation-only; specific support commitments depend on the engagement.
- No invented testimonials, certifications, partner status, compliance guarantees, response-time guarantees, or measurable results.
- Cybersecurity discovery is not a formal compliance audit.
- AI scope remains readiness, adoption, Copilot, practical automation, and governance. Do not imply unrestricted custom AI development or advanced Azure architecture.
- Martin remains the only featured leader at launch.

## Completion criteria

All seven pages have original finished copy, useful FAQs, working consultation links and related-service links, consistent public business details, and complete page metadata. Navigation and sitemap expose the new routes. Existing service IDs and hub anchors continue to work. Responsive, keyboard, type, route, and build checks pass; any remaining integration dependencies are documented accurately.

Resources/blog, CMS, deeper industry pages, and new proof content follow separately. Phase 2 preparation does not authorize production deployment or domain changes.

## Approved refinements applied

Full and co-managed IT receive equal treatment. Managed IT onboarding uses Discovery → Assessment → Transition → Onboarding → Ongoing Improvement. Every page includes “What This Service Can Include” with an explicit scope qualifier. Cybersecurity uses seven visual protection layers. Cloud & Collaboration preserves the internal cloud-microsoft-365 ID and redirects the legacy URL. Each page includes Text RnB Cloud as a secondary action and a restrained service-area section. Technology names indicate experience, without partnership claims. Resources/blog and CMS remain outside this phase.
