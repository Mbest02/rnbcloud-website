# Hosted test fixes — October 8, 2026

Test URL supplied by the user: https://rnbcloud-website.vercel.app

## Observed before correction

- `/images/home/home-hero-main.webp` and the Network & Infrastructure source image returned 404.
- The optimized homepage image returned 400 INVALID_IMAGE_OPTIMIZE_REQUEST because its source was missing.
- Brand and Martin image files returned 200, which isolated the asset issue to the images directory rather than all image optimization.
- An empty JSON request from the stable project's own origin returned 403 “Please submit your request from our contact page.” No real inquiry or personal information was sent.

## Changes

The `Images/` exclusion was unanchored. It is now `/Images/`, limited to the root source-artwork folder; public assets are explicitly included. Artifacts and scripts exclusions are also root-scoped. Image optimization remains enabled; bypassing it would not restore missing source files.

The inquiry origin list now includes the exact approved stable staging URL and all three server-provided deployment/project/branch aliases. It still rejects unrelated Vercel domains, lookalike domains, insecure aliases and null origins. It does not trust the caller's Host header or broadly allow all vercel.app sites.

Vercel documents the project/branch URL variables in [system environment variables](https://vercel.com/docs/environment-variables/system-environment-variables) and file inclusion/exclusion in [.vercelignore](https://vercel.com/docs/deployments/vercel-ignore).

## Validation and next deployment

The origin regression test reproduced the failure before correction and passed after correction, using a controlled receiver. Eleven page/headshot files passed exact case-sensitive path and image-format checks. The production build passed. All eleven raw and optimized image URLs returned image responses from the local production build (22 successful responses). An empty request using the stable Vercel origin reached field validation (400) instead of origin rejection (403). The homepage image was visually verified locally; these checks do not represent a redeployed Vercel site.

After the user pushes and Vercel deploys the new commit:

1. Run `node scripts/verify-image-assets.mjs --base=https://rnbcloud-website.vercel.app`.
2. Verify all page images in the browser.
3. Recheck the form on the stable project URL and any used branch/deployment aliases. If the receiver is still unconfigured, it should show the honest direct-contact/unavailable message instead of the incorrect contact-page error.
4. Configure the confirmed sales receiver before testing real delivery and success conversion. Sales delivery remains separate from Zoho Desk.

This report does not claim that the new code is already deployed or that real sales delivery is configured. No GitHub push or DNS change is performed by this fix.
