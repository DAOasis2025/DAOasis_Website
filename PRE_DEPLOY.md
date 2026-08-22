# Pre-deployment checklist

Things that must be done outside this environment, before the site goes live.

---

## 0. UPLOAD LIST — the 22 August changes

Everything below is ready. Upload to `DAOasis2025/DAOasis_Website`; Vercel
redeploys in ~60 seconds.

### A. Six page files — REPLACE

```
index.html
app.html
sanctuary.html
web3.html
investors.html
about.html
```

### B. One shared stylesheet — REPLACE

```
css/trust.css
```

`js/cine.js` did **not** change on 22 August and does not need re-uploading.
(It still must exist in the repo — see §3.)

### C. The whole `images/` folder — REPLACE

All 41 raster files were re-encoded; `images/` went **48.4 MB → 7.1 MB**.
Upload the entire folder.

### D. DELETE these 10 files from `images/` in the repo — IMPORTANT

Uploading through the GitHub web UI **adds and overwrites, it never deletes**.
These were renamed, so their old versions will linger as dead weight (~16 MB)
and the repo will still look heavy even though nothing references them:

```
images/Journey image.png
images/Journey image mobile.png
images/Quest map.png
images/Sunrise.png
images/clarity.png
images/team-jamie.png          (only if a previous upload included it)
images/Web3.png
images/Journey image.jpg       (only if an interim upload included it)
images/Journey image mobile.jpg
images/Quest map.jpg
```

The last three exist only if you uploaded between the JPEG conversion and the
space-removing rename. If you never did, they will not be there — skip them.

Delete in the GitHub UI: open the file → bin icon → commit.

### E. DO NOT upload

```
images-original/     49 MB local backup of the pre-compression originals
CLAUDE.md            working notes (harmless, but not part of the site)
PRE_DEPLOY.md        this file
CONTENT_REQUIRED.md  tracking
README.md            optional
```

`images-original/` exists so the compression is reversible. Delete it locally
once the live site has been checked.

### F. Changed earlier on 22 August, before this batch

`js/trust.js` and the seven trust pages (`privacy`, `accessibility`, `contact`,
`cookies`, `health-data`, `terms`, `token-disclaimer`) carry a 17:43 timestamp —
earlier than this batch. If you have already uploaded those, nothing to do. If
not, include them.

---

## 1. Convert the background photographs — DONE (22 August)

**Status: resolved.** All 41 raster assets were re-encoded, not just the three
originally listed here.

| | before | after |
|---|---|---|
| `images/` total | 48.4 MB | **7.1 MB** (−86%) |
| index.html payload | ~10 MB | **0.65 MB** |
| sanctuary.html payload | ~17 MB | **2.63 MB** |
| app.html payload | ~8 MB | **1.69 MB** |

> **The claim that was in this section — "there is no image tooling available in
> this environment" — was wrong.** `convert` on the PATH really is the Windows
> disk utility and `python` is a Microsoft Store stub, but **npm works**, so
> `npm install sharp` provides a full libvips build. Install it into a scratch
> directory, never into this folder: a stray `node_modules/` would be uploaded.
> The script used is documented in `CLAUDE.md`.

Photographs became JPEG q82 (progressive, mozjpeg); assets with genuine
transparency stayed PNG; long edges were capped at 2× the largest box each asset
actually occupies. Seven files changed extension and all 16 references were
rewritten and verified.

---

## 2. Rename image files to remove spaces — DONE (22 August)

**Status: resolved.**

```
Journey image.png        ->  journey-image.jpg
Journey image mobile.png ->  journey-image-mobile.jpg
Quest map.png            ->  quest-map.jpg
```

No filename in `images/` contains a space any more, so nothing depends on
`%20` encoding and there is nothing to fumble when drag-dropping into the
GitHub UI. All four references in `index.html` and `app.html` were updated and
verified loading 200.

---

## 3. Files that must be in the repo

Easy to miss because they are not page files:

- `js/cine.js` — the shared cinematic-scroll controller, loaded by
  `index.html`, `app.html`, `sanctuary.html` and `web3.html`. **If it is
  missing, every page falls back to direct scroll mapping** — it degrades
  rather than breaking, but the pacing is simply absent. Unchanged on
  22 August; it only needs to already be there.
- `css/trust.css` and `js/trust.js` — shared by the seven trust-layer pages.
  **`css/trust.css` changed on 22 August and must be re-uploaded.**

---

## 4. Known, accepted, not bugs

- **No favicon anywhere in the project**, so every page logs one 404 on load.
  Pre-existing and site-wide.
- **`about.html` expects `images/about-hero.jpg` and
  `images/about-hero-mobile.jpg`.** `about-hero.jpg` exists;
  `about-hero-mobile.jpg` still does not. The page degrades to a colour field by
  design — it never shows a broken image. This is the only unresolved image
  reference on the site.
- **Five team portraits are still monogram plates** (`team-nelson`, `team-dan`,
  `team-trong`, `team-uchenna`, `team-etiosa`). Jamie's is in.
  Dropping a file into the marked slot needs no code change.
- **No signup or form backend exists anywhere.** The Sanctuary early-access
  form and the investor request panel both say so on submit. Do not wire either
  to a fake confirmation.
- **Every remaining `<span class="tbc">` marker is a genuine legal or business
  unknown** (legal entity, registered address, governing law, retention
  schedule, and the response-time commitment). They are deliberately visible
  rather than silently omitted. Tracked in `CONTENT_REQUIRED.md`.

---

## 5. If analytics are ever added

`cookies.html` currently states **as fact** that the site sets no cookies and
runs no analytics, and that was verified against the source. If any analytics
or cookie-setting script is added, `cookies.html` §04/§07 and `privacy.html`
§09 **must be updated before the script goes live.**
