// Exercises the real route handler with a controlled receiver; never sends a real inquiry.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes, createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
const require = createRequire(import.meta.url);
const nextServer = pathToFileURL(require.resolve('next/server')).href;
const source = (await readFile(new URL('../src/app/api/inquiry/route.ts', import.meta.url), 'utf8'))
  .replace("'next/server'", JSON.stringify(nextServer))
  .replace("'@/lib/content'", JSON.stringify(new URL('../src/lib/content.ts', import.meta.url).href))
  .replace("'@/lib/inquiry-email'", JSON.stringify(new URL('../src/lib/inquiry-email.ts', import.meta.url).href));
const { POST } = await import('data:text/javascript;base64,' + Buffer.from(stripTypeScriptTypes(source)).toString('base64'));
const { NextRequest } = await import(nextServer);
const originalFetch = globalThis.fetch;
const saved = Object.fromEntries(['INQUIRY_DELIVERY', 'SITE_ORIGIN', 'VERCEL_URL', 'VERCEL_PROJECT_PRODUCTION_URL', 'VERCEL_BRANCH_URL', 'INQUIRY_WEBHOOK_URL', 'INQUIRY_WEBHOOK_TOKEN'].map(key => [key, process.env[key]]));
const origin = 'https://qa.example';
const valid = { name: 'QA Test', email: 'qa@example.com', message: 'Controlled test only.', interest: 'managed-it' };
let deliveries = [];
let mode = 'accept';
async function post(data, expected, requestOrigin = origin, contentType = 'application/json') {
  const request = new NextRequest(origin + '/api/inquiry', { method: 'POST', headers: { origin: requestOrigin, 'content-type': contentType }, body: typeof data === 'string' ? data : JSON.stringify(data) });
  const response = await POST(request);
  assert.equal(response.status, expected);
  const result = await response.json();
  assert.equal(Boolean(result.success), expected === 200, 'Only receiver acceptance may return success');
}
try {
  process.env.INQUIRY_DELIVERY = 'webhook';
  process.env.SITE_ORIGIN = origin;
  process.env.INQUIRY_WEBHOOK_URL = 'https://receiver.example/inquiries';
  process.env.INQUIRY_WEBHOOK_TOKEN = 'qa-only-token';
  globalThis.fetch = async (url, options) => {
    assert.equal(url, 'https://receiver.example/inquiries');
    assert.equal(options.redirect, 'error');
    assert.equal(options.cache, 'no-store');
    assert(options.signal instanceof AbortSignal);
    deliveries.push({ headers: options.headers, payload: JSON.parse(options.body) });
    if (mode === 'throw') throw new Error('Controlled connection/timeout failure');
    return new Response(null, { status: mode === 'accept' ? 202 : 503 });
  };
  await post(valid, 200);
  assert.equal(deliveries[0].headers.Authorization, 'Bearer qa-only-token');
  assert.equal(deliveries[0].payload.source, 'rnbcloud-website');
  assert.equal(deliveries[0].payload.email, valid.email);
  assert(deliveries[0].payload.submittedAt);
  process.env.VERCEL_URL = 'rnbcloud-website-deployment.example.vercel.app';
  process.env.VERCEL_PROJECT_PRODUCTION_URL = 'rnbcloud-website.vercel.app';
  process.env.VERCEL_BRANCH_URL = 'rnbcloud-website-git-review.example.vercel.app';
  for (const host of [process.env.VERCEL_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL, process.env.VERCEL_BRANCH_URL]) await post(valid, 200, `https://${host}`);
  await post(valid, 403, 'https://unrelated-project.vercel.app');
  await post(valid, 403, 'https://rnbcloud-website.vercel.app.unrelated.example');
  await post(valid, 403, 'http://rnbcloud-website.vercel.app');
  await post(valid, 403, 'null');
  // The approved stable staging alias also works when optional system variables are unavailable.
  delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
  await post(valid, 200, 'https://rnbcloud-website.vercel.app');
  mode = 'reject'; await post(valid, 502);
  mode = 'throw'; await post(valid, 502);
  const beforeRejected = deliveries.length;
  await post({ ...valid, website: 'bot' }, 400);
  await post({ ...valid, interest: 'unknown' }, 400);
  await post({ ...valid, email: 'invalid' }, 400);
  await post(valid, 403, 'https://unrelated.example');
  await post(valid, 415, origin, 'text/plain');
  await post('{invalid', 400);
  await post({ ...valid, message: 'x'.repeat(19000) }, 413);
  assert.equal(deliveries.length, beforeRejected, 'Rejected traffic never reaches the receiver');
  delete process.env.INQUIRY_WEBHOOK_URL; await post(valid, 503);
  process.env.INQUIRY_WEBHOOK_URL = 'http://receiver.example'; await post(valid, 503);
  console.log('PASS: deployment, project and branch aliases accepted; unrelated/spoofed origins rejected; controlled receiver acceptance/failure, validation, honeypot, format, size and missing/non-HTTPS receiver. Real delivery remains a staging check.');
} finally {
  globalThis.fetch = originalFetch;
  for (const [key, value] of Object.entries(saved)) { if (value === undefined) delete process.env[key]; else process.env[key] = value; }
}
