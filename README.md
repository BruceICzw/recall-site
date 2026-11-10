# Recall website

Landing page and privacy policy for [Recall](https://github.com/BruceICzw/recall), the private, natural-language search for your browsing history.

Plain HTML and CSS with no dependencies and no third-party requests (no analytics, fonts or embeds).

```
src/               index.html · privacy.html · styles.css · icon.svg · og.png
site.config.json   the four links/addresses filled into the pages
build.mjs          src/ → dist/ with placeholders filled (no npm install needed)
```

## Setup

1. Edit `site.config.json`:
   - `siteUrl`: where this site will live, e.g. `https://recall-search.netlify.app`. Pick the name on Netlify/Vercel first.
   - `repoUrl`: the extension's GitHub repo
   - `contactEmail`: shown in the privacy policy
   - `storeUrl`: where the download buttons point. Until the store approves Recall it's the GitHub release (`…/releases/latest`), and the buttons say "Download". Once it's a Chrome Web Store URL, they switch to "Add to Chrome".
2. Preview locally: run `node build.mjs`, then open `dist/index.html`.
3. Push to GitHub and import the repo:
   - **Netlify:** Add new site → Import from Git. `netlify.toml` sets the build to `node build.mjs` and publishes `dist`.
   - **Vercel:** Add New → Project, Framework preset "Other". `vercel.json` sets the build to `node build.mjs`, publishes `dist`, and turns on `cleanUrls`.

The build fails on purpose while any placeholder in `site.config.json` is still unfilled.

`/privacy` must load before you submit the extension, because the Chrome Web Store asks for that URL.

## After the store approves Recall

Put the listing URL in `storeUrl`, then commit and push. Every "Add to Chrome" button switches from the README install steps to the store.

## Keep the privacy policy in sync

`src/privacy.html` must match what the extension actually does, and the store checks this. When a change to the extension alters what it collects, stores, or sends, update the policy here in the same week. Bump its "Effective" date too.
