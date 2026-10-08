import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { pageImages, serviceImages } from '../src/lib/page-images.ts';
import { martin } from '../src/lib/leadership.ts';
const root = new URL('../', import.meta.url);
const images = [...Object.values(pageImages), ...Object.values(serviceImages), { src: martin.image }];
const ignore = await readFile(new URL('.vercelignore', root), 'utf8');
assert(!/^Images\/$/m.test(ignore), 'An unanchored Images rule can exclude nested public/images assets');
assert(/^\/Images\/$/m.test(ignore), 'Only the root concept-board directory should be excluded');
assert(/^!\/public\/\*\*$/m.test(ignore), 'Public assets must be explicitly included');
for (const { src } of images) {
  let folder = new URL('public/', root);
  for (const part of src.slice(1).split('/')) {
    assert((await readdir(folder)).includes(part), `Exact case-sensitive file path: ${src}`);
    folder = new URL(part + '/', folder);
  }
  const bytes = await readFile(new URL('public' + src, root));
  if (src.endsWith('.webp')) { assert.equal(bytes.toString('ascii', 0, 4), 'RIFF'); assert.equal(bytes.toString('ascii', 8, 12), 'WEBP'); }
  else if (src.endsWith('.jpeg')) assert.equal(bytes.readUInt16BE(0), 0xffd8);
}
const base = process.argv.find(arg => arg.startsWith('--base='))?.slice(7);
if (base) {
  for (const { src } of images) {
    const raw = await fetch(new URL(src, base));
    assert.equal(raw.status, 200, `Deployed file: ${src}`);
    assert(raw.headers.get('content-type')?.startsWith('image/'), src);
    const optimized = await fetch(new URL(`/_next/image?url=${encodeURIComponent(src)}&w=1080&q=75`, base));
    assert.equal(optimized.status, 200, `Optimized file: ${src}`);
    assert(optimized.headers.get('content-type')?.startsWith('image/'), src);
  }
}
console.log(`PASS: ${images.length} valid image assets, exact file-name casing, and root-scoped deployment exclusions${base ? ', including deployed files and optimized responses' : ''}.`);
