// Security-rules regression tests for firestore.rules.
//
// These exist because the rules and src/types.ts drifted apart: the rules
// validated fields (title/description/aspectRatio) that the app never sends
// (label/caption/aspect), so every admin write was rejected with
// permission-denied while the UI reported success.
//
// Run (deps are not in package.json, to keep them out of production builds):
//   npm i --no-save firebase-tools @firebase/rules-unit-testing
//   npx firebase emulators:exec --only firestore \
//     --config firebase.emulator.json --project sarsulut-rules-test \
//     "node rules.test.mjs"
//
// Set RULES_FILE to point at a different rules file.

import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} from '@firebase/rules-unit-testing';
import { doc, setDoc, getDocs, collection } from 'firebase/firestore';
import { readFileSync } from 'node:fs';

const testEnv = await initializeTestEnvironment({
  projectId: 'sarsulut-rules-test',
  firestore: { rules: readFileSync(process.env.RULES_FILE || 'firestore.rules', 'utf8'), host: '127.0.0.1', port: 8080 },
});

const admin = testEnv.authenticatedContext('admin-uid', { email: 'crpmovie@gmail.com' }).firestore();
const stranger = testEnv.authenticatedContext('rando-uid', { email: 'nope@example.com' }).firestore();
const anon = testEnv.unauthenticatedContext().firestore();

const stamp = { createdAt: '2026-09-09T00:00:00.000Z', updatedAt: '2026-09-09T00:00:00.000Z' };
const url = 'https://firebasestorage.googleapis.com/v0/b/x.appspot.com/o/galleries%2F1-a.jpg?alt=media&token=abc';

// Exactly the shapes src/context/AdminDataContext.tsx writes.
const gallery = { id: 'galeri-1', label: 'Latihan SAR Laut', aspect: 'r1610', caption: 'Uji coba', category: 'Dokumentasi Operasi', location: 'Manado', date: 'Agustus 2026', image: url, ...stamp };
const news = { id: 'berita-1', title: 'Operasi SAR Talaud', category: 'Operasi', date: '9 September 2026', author: 'Humas', location: 'Talaud', summary: 'Ringkasan', content: 'Isi berita', image: url, status: 'published', pinned: false, views: 0, tags: ['sar'], ...stamp };
const activity = { id: 'keg-1', title: 'Apel Siaga', type: 'Latihan', date: '10 September 2026', location: 'Kaasar', status: 'selesai', desc: 'Apel gelar pasukan', participants: '65 Personel', image: url, ...stamp };

let pass = 0, fail = 0;
const check = async (name, p) => {
  try { await p; console.log(`  PASS  ${name}`); pass++; }
  catch (e) { console.log(`  FAIL  ${name}\n        ${String(e).split('\n')[0]}`); fail++; }
};

console.log('\nAdmin writes the shapes the app actually sends:');
await check('gallery create', assertSucceeds(setDoc(doc(admin, 'galleries/galeri-1'), gallery)));
await check('news create', assertSucceeds(setDoc(doc(admin, 'news/berita-1'), news)));
await check('activity create', assertSucceeds(setDoc(doc(admin, 'activities/keg-1'), activity)));

console.log('\nPublic can read the site content:');
await check('anon list news', assertSucceeds(getDocs(collection(anon, 'news'))));
await check('anon list galleries', assertSucceeds(getDocs(collection(anon, 'galleries'))));

console.log('\nNon-admins cannot write:');
await check('anon gallery create denied', assertFails(setDoc(doc(anon, 'galleries/galeri-2'), gallery)));
await check('stranger news create denied', assertFails(setDoc(doc(stranger, 'news/berita-2'), news)));

console.log('\nBad payloads are rejected:');
await check('base64 image denied', assertFails(setDoc(doc(admin, 'galleries/galeri-3'), { ...gallery, id: 'galeri-3', image: 'data:image/jpeg;base64,' + 'A'.repeat(6000) })));
await check('bad aspect denied', assertFails(setDoc(doc(admin, 'galleries/galeri-4'), { ...gallery, id: 'galeri-4', aspect: 'landscape' })));
await check('bad status denied', assertFails(setDoc(doc(admin, 'activities/keg-2'), { ...activity, id: 'keg-2', status: 'Selesai' })));
await check('empty title denied', assertFails(setDoc(doc(admin, 'news/berita-3'), { ...news, id: 'berita-3', title: '' })));

console.log('\nContact form (public submit):');
await check('anon contact create', assertSucceeds(setDoc(doc(anon, 'contacts/kontak-1'), { name: 'Budi', email: 'b@x.com', category: 'Permohonan informasi publik', message: 'Halo' })));
await check('anon contact read denied', assertFails(getDocs(collection(anon, 'contacts'))));

await testEnv.cleanup();
console.log(`\n${pass} passed, ${fail} failed\n`);
process.exit(fail ? 1 : 0);
