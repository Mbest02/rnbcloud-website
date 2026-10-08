import assert from 'node:assert/strict';
import { services } from '../src/lib/content.ts';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
const base = 'http://127.0.0.1:3000';
const paths = ['/', '/services', '/about', '/contact', '/industries', '/privacy', ...services.map(s => `/services/${s.slug}`)];
const titles = new Set();
for (const path of paths) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200);
  const html = await response.text();
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  assert(title && !titles.has(title), `${path}: unique title`); titles.add(title);
  assert(html.includes(`rel="canonical" href="https://rnbcloud.com${path === '/' ? '' : path}"`), `${path}: apex canonical`);
  assert(/<meta name="description" content="[^"]+"/.test(html), `${path}: description`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(match => JSON.parse(match[1])).flat();
  assert(schemas.some(s => s['@type'] === 'Organization' && s.url === 'https://rnbcloud.com'), `${path}: Organization`);
  if (path.startsWith('/services/')) {
    assert(schemas.some(s => s['@type'] === 'Service' && s.url === `https://rnbcloud.com${path}`));
    assert(schemas.some(s => s['@type'] === 'BreadcrumbList' && s.itemListElement.length === 3));
    assert(html.includes(`property="og:url" content="https://rnbcloud.com${path}"`));
  }
  if (path === '/about') assert(schemas.some(s => s['@type'] === 'Person' && s.name === 'Martin Bester'));
  if (path === '/privacy') assert(html.includes('noindex'));
}
for (const [from, to, status] of [['/services/cloud-microsoft-365','/services/cloud-collaboration',308],['/services/cloud-business-email','/services/cloud-collaboration',308],['/privacy.html','/privacy',308],['/support','https://support.rnbcloud.com',307]]) {
  const response = await fetch(base + from, { redirect: 'manual' });
  assert.equal(response.status, status);
  assert.equal(new URL(response.headers.get('location'), base).href.replace(/\/$/, ''), new URL(to, base).href.replace(/\/$/, ''), `${from}: redirect destination`);
}
async function loadTs(name) {
  const source = (await readFile(new URL(`../src/app/${name}.ts`, import.meta.url), 'utf8')).replace("'@/lib/content'", JSON.stringify(new URL('../src/lib/content.ts', import.meta.url).href));
  return (await import('data:text/javascript;base64,' + Buffer.from(stripTypeScriptTypes(source)).toString('base64'))).default;
}
const robots = await loadTs('robots'); const sitemap = await loadTs('sitemap');
const saved = { VERCEL_ENV: process.env.VERCEL_ENV, PRIVACY_POLICY_APPROVED: process.env.PRIVACY_POLICY_APPROVED };
try {
  process.env.VERCEL_ENV = 'preview'; process.env.PRIVACY_POLICY_APPROVED = 'false';
  assert.deepEqual(robots().rules, { userAgent: '*', disallow: '/' });
  process.env.VERCEL_ENV = 'production';
  assert(robots().rules.disallow.includes('/privacy')); assert(!sitemap().some(s => s.url.endsWith('/privacy')));
  process.env.PRIVACY_POLICY_APPROVED = 'true';
  assert.deepEqual(robots().rules.disallow, ['/api/']); assert(sitemap().some(s => s.url.endsWith('/privacy')));
  assert.equal(sitemap().length, 13); assert(sitemap().every(s => s.url.startsWith('https://rnbcloud.com')));
} finally { for (const [key,value] of Object.entries(saved)) { if (value === undefined) delete process.env[key]; else process.env[key] = value; } }
console.log('PASS: 13 unique titles, descriptions and apex canonicals, Organization/Person/Service/Breadcrumb schema, service OG URLs, four redirects, preview robots isolation, and production privacy/sitemap approval gates. Live hostname and DNS remain staging/cutover checks.');
