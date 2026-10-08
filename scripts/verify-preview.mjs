import assert from 'node:assert/strict';
const base = 'http://127.0.0.1:3000';
for (const path of ['/', '/services', '/about', '/contact', '/industries', '/privacy']) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${path} has one main heading`);
  assert(!html.includes('502-410-8029'), `${path} uses the updated phone`);
  assert(!html.includes('Blake'), `${path} excludes Blake`);
  if (path === '/services') for (const id of ['managed-it', 'cybersecurity', 'cloud-microsoft-365', 'ai-automation', 'backup-disaster-recovery', 'network-infrastructure', 'it-consulting']) assert(html.includes(`id="${id}"`), `Service anchor ${id}`);
}
const valid = { name: 'Development Test', email: 'test@example.com', message: 'Local validation only.' };
async function post(data, expected, origin = base, contentType = 'application/json') {
  const response = await fetch(base + '/api/inquiry', { method: 'POST', headers: { origin, 'content-type': contentType }, body: JSON.stringify(data) });
  assert.equal(response.status, expected);
  const result = await response.json();
  assert(!result.success, 'Rejected requests must never claim delivery');
}
await post(valid, 503); // Delivery has deliberately not been configured.
await post({ ...valid, email: 'invalid' }, 400);
await post({ ...valid, website: 'bot' }, 400);
await post(valid, 403, 'https://unrelated.example');
await post(valid, 415, base, 'text/plain');
await post({ ...valid, message: 'x'.repeat(19000) }, 413);
const redirect = await fetch(base + '/privacy.html', { redirect: 'manual' });
assert.equal(redirect.status, 308);
assert(redirect.headers.get('location').endsWith('/privacy'));
const missing = await fetch(base + '/not-a-real-page');
assert.equal(missing.status, 404);
for (const path of ['/sitemap.xml', '/robots.txt']) assert.equal((await fetch(base + path)).status, 200);
console.log('PASS: six pages, seven service anchors, updated contact details, redirects, sitemap, 404, and six form rejection/fallback checks.');
