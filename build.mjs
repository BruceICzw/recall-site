#!/usr/bin/env node
/**
 * Builds the site: copies src/ to dist/ and fills the __PLACEHOLDERS__ from site.config.json.
 * No dependencies. Netlify and Vercel run this automatically (see netlify.toml / vercel.json).
 *
 *   node build.mjs            → dist/
 *
 * Leave "storeUrl" empty until the Chrome Web Store approves Recall; the "Add to Chrome"
 * buttons then link to the install instructions in the extension's README.
 */
import { cpSync, existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const src = join(root, 'src');
const dist = join(root, 'dist');
const cfg = JSON.parse(readFileSync(join(root, 'site.config.json'), 'utf8'));

const clean = (s) => String(s ?? '').trim().replace(/\/$/, '');
const SITE = clean(process.env.SITE_URL || cfg.siteUrl);
const REPO = clean(process.env.REPO_URL || cfg.repoUrl);
const EMAIL = clean(process.env.CONTACT_EMAIL || cfg.contactEmail);
const STORE = clean(process.env.STORE_URL || cfg.storeUrl) || `${REPO}#quick-start-windows-macos-linux`;
// Button wording follows where it points: the Chrome Web Store, or a GitHub download.
const IN_STORE = /chromewebstore\.google\.com|chrome\.google\.com\/webstore/.test(STORE);
const CTA_SHORT = IN_STORE ? 'Add to Chrome' : 'Download';
const CTA_LONG = IN_STORE ? "Add to Chrome, it's free" : 'Download for Chrome, free';

const problems = [];
if (!SITE || /your-recall-site/.test(SITE)) problems.push('siteUrl');
if (!REPO || /your-username/.test(REPO)) problems.push('repoUrl');
if (!EMAIL || /you@example\.com/.test(EMAIL)) problems.push('contactEmail');
if (problems.length) {
  console.error(`✗ Fill in ${problems.join(', ')} in site.config.json before building.`);
  process.exit(1);
}

if (existsSync(dist)) rmSync(dist, { recursive: true });
cpSync(src, dist, { recursive: true });
for (const f of readdirSync(dist).filter((f) => f.endsWith('.html'))) {
  const p = join(dist, f);
  const out = readFileSync(p, 'utf8')
    .replaceAll('__SITE_URL__', SITE)
    .replaceAll('__REPO_URL__', REPO)
    .replaceAll('__CONTACT_EMAIL__', EMAIL)
    .replaceAll('__STORE_URL__', STORE)
    .replaceAll('__CTA_SHORT__', CTA_SHORT)
    .replaceAll('__CTA_LONG__', CTA_LONG);
  const left = out.match(/__[A-Z_]+__/g);
  if (left) {
    console.error(`✗ ${f}: unfilled placeholders ${[...new Set(left)].join(', ')}`);
    process.exit(1);
  }
  writeFileSync(p, out);
  console.log(`✓ ${f}`);
}
if (!clean(process.env.STORE_URL || cfg.storeUrl)) console.log('ℹ storeUrl empty: "Add to Chrome" links to the README install steps for now.');
console.log('Built dist/');
