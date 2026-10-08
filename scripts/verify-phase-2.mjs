import assert from 'node:assert/strict';
const base = process.env.PREVIEW_ORIGIN || 'http://127.0.0.1:3000';
const records = [
  ['managed-it', 'managed-it'], ['cybersecurity', 'cybersecurity'],
  ['cloud-collaboration', 'cloud-microsoft-365'], ['ai-automation', 'ai-automation'],
  ['backup-disaster-recovery', 'backup-disaster-recovery'], ['network-infrastructure', 'network-infrastructure'], ['it-consulting', 'it-consulting'],
];
const sitemap = await (await fetch(base + '/sitemap.xml')).text();
for (const [slug, id] of records) {
  const path = `/services/${slug}`;
  const response = await fetch(base + path);
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert.equal((html.match(/<h1[ >]/g) || []).length, 1, `${slug}: one H1`);
  assert(html.includes('What This Service Can Include'), `${slug}: scope section`);
  assert(html.includes('Your proposal defines the services'), `${slug}: qualified scope`);
  assert(html.includes(`/contact?interest=${id}`), `${slug}: contextual consultation`);
  assert(html.includes('sms:+15022088747'), `${slug}: text action`);
  assert(html.includes('Elizabethtown'), `${slug}: service area`);
  assert(html.includes('https://support.rnbcloud.com'), `${slug}: support routing`);
  assert((html.match(/<details[ >]/g) || []).length >= 5, `${slug}: FAQs`);
  assert(html.includes(`rel="canonical" href="https://rnbcloud.com${path}"`), `${slug}: canonical`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].flatMap(match => { const parsed = JSON.parse(match[1]); return Array.isArray(parsed) ? parsed : [parsed]; });
  assert(schemas.some(item => item['@type'] === 'Service' && item.url.endsWith(path)), `${slug}: service schema`);
  assert(schemas.some(item => item['@type'] === 'BreadcrumbList'), `${slug}: breadcrumbs`);
  assert(sitemap.includes(`https://rnbcloud.com${path}`), `${slug}: sitemap`);
  const image = await fetch(`${base}${path}/opengraph-image`);
  assert.equal(image.status, 200, `${slug}: sharing image`);
  assert(image.headers.get('content-type').includes('image/png'));
  const bytes = Buffer.from(await image.arrayBuffer());
  assert.equal(bytes.readUInt32BE(16), 1200);
  assert.equal(bytes.readUInt32BE(20), 630);
  const contact = await (await fetch(`${base}/contact?interest=${id}`)).text();
  assert(contact.includes(`<option value="${id}" selected=""`), `${slug}: selected interest`);
}
for (const old of ['cloud-microsoft-365', 'cloud-business-email']) {
  const response = await fetch(`${base}/services/${old}`, { redirect: 'manual' });
  assert.equal(response.status, 308);
  assert(response.headers.get('location').endsWith('/services/cloud-collaboration'));
}
assert.equal((await fetch(`${base}/services/not-a-service`)).status, 404);
for (const path of ['/', '/services', '/industries']) {
  const html = await (await fetch(base + path)).text();
  assert(!html.includes('href="/services#'), `${path}: links go to dedicated pages`);
}
const security = await (await fetch(base + '/services/cybersecurity')).text();
assert.equal((security.match(/class="security-layer"/g) || []).length, 7);
const managed = await (await fetch(base + '/services/managed-it')).text();
for (const label of ['Full managed IT', 'Co-managed IT', 'Discovery', 'Assessment', 'Transition', 'Onboarding', 'Ongoing Improvement']) assert(managed.includes(label));
console.log('PASS: seven service pages, scopes, FAQs, service-specific contact selection, seven PNG sharing images, schema, sitemap, two redirects, 404, seven security layers, managed/co-managed models and onboarding.');
