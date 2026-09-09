import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import { ref, uploadBytes, getBytes } from 'firebase/storage';
import { readFileSync } from 'node:fs';

const testEnv = await initializeTestEnvironment({
  projectId: 'sarsulut-rules-test',
  storage: { rules: readFileSync('storage.rules', 'utf8'), host: '127.0.0.1', port: 9199 },
});
const admin = testEnv.authenticatedContext('a', { email: 'crpmovie@gmail.com' }).storage();
const anon = testEnv.unauthenticatedContext().storage();
const jpg = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
const meta = { contentType: 'image/jpeg' };

let pass = 0, fail = 0;
const check = async (n, p) => { try { await p; console.log('  PASS  ' + n); pass++; } catch (e) { console.log('  FAIL  ' + n + '\n        ' + String(e).split('\n')[0]); fail++; } };

await check('admin uploads gallery image', assertSucceeds(uploadBytes(ref(admin, 'galleries/x.jpg'), jpg, meta)));
await check('admin uploads news image', assertSucceeds(uploadBytes(ref(admin, 'news/x.jpg'), jpg, meta)));
await check('anon upload denied', assertFails(uploadBytes(ref(anon, 'galleries/y.jpg'), jpg, meta)));
await check('non-image denied', assertFails(uploadBytes(ref(admin, 'galleries/z.pdf'), jpg, { contentType: 'application/pdf' })));
await check('unknown folder denied', assertFails(uploadBytes(ref(admin, 'secret/z.jpg'), jpg, meta)));
await check('public can read image', assertSucceeds(getBytes(ref(anon, 'galleries/x.jpg'))));

await testEnv.cleanup();
console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
