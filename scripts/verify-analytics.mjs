import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
const source = (await readFile(new URL('../src/lib/analytics.ts', import.meta.url), 'utf8')).replace("'@/lib/content'", JSON.stringify(new URL('../src/lib/content.ts', import.meta.url).href));
const module = await import('data:text/javascript;base64,' + Buffer.from(stripTypeScriptTypes(source)).toString('base64'));
const { analyticsPage, analyticsConversion } = module;
assert.deepEqual(analyticsPage('/contact'), { page_location: 'https://rnbcloud.com/contact', page_title: 'Contact', page_referrer: '' });
for (const unsafe of ['/contact?email=private@example.com', '/unknown/private@example.com', '/contact#private']) {
  assert.equal(analyticsPage(unsafe).page_location, 'https://rnbcloud.com/not-found');
}
assert.deepEqual(analyticsConversion({ name: 'consultation_form_submit', service: 'cloud-microsoft-365', email: 'private@example.com', message: 'private', organization: 'private' }), { name: 'consultation_form_submit', parameters: { service: 'cloud-microsoft-365' } });
assert.deepEqual(analyticsConversion({ name: 'booking_click', service: 'private@example.com' }), { name: 'booking_click', parameters: {} });
assert.equal(analyticsConversion({ name: 'private@example.com' }), null);
assert.equal(analyticsConversion(null), null);
console.log('PASS: analytics allowlists discard unknown events, personal fields, arbitrary service values, query strings, hashes, and unknown paths.');
