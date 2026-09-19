# Pre-deployment checklist

Things that must be done outside this environment, before the site goes live.


---

## 0. UPLOAD LIST — 19 September  (NEWEST — do this one)

Icons, share previews, sitemap, keyboard focus, image loading and the social
links. See CLAUDE.md, "Findable, shareable, keyboard-navigable — 19 September".

### THE HOST IS THE VERCEL ONE — confirmed 19 September

Every canonical, `og:url` and share-image URL on all 13 pages reads
**`https://da-oasis-website.vercel.app`**. Verified: all 17 published URLs
return 200 on that host, including `/images/og-card.jpg`, `/sitemap.xml`,
`/robots.txt` and `/favicon.ico`.

**THE LIVE SITE CURRENTLY POINTS AT THE WRONG DOMAIN AND NEEDS THIS UPLOAD.**
An earlier build went up carrying `https://daoasis.xyz` in every canonical and
every `og:image`. That domain **does** resolve — but to a DIFFERENT DAOasis
site (title *"DAOasis | Behavioural Wellness Ecosystem"*, 93KB, not this
codebase, served from 185.158.133.1), and `daoasis.xyz/images/og-card.jpg`
**404s** there.

So as it stands the live site is telling Google that the canonical version of
every one of its pages is a different website, and every share preview points
at a missing image. Re-uploading the 13 HTML files plus `sitemap.xml` and
`robots.txt` fixes both.

> **There are two DAOasis websites live.** Which one is canonical is a business
> decision, not a technical one — but they must not point at each other the way
> they currently do.

**To move to the custom domain later**, the origin appears exactly 4 times per
HTML page, 13 times in `sitemap.xml` and once in `robots.txt`. Swap that one
string, re-upload, then re-scrape on Facebook's Sharing Debugger and LinkedIn's
Post Inspector — both cache hard.

### Files — REPLACE
```
all 13 .html files      every one gained the icon links, the share tags and
                        the footer community block; index, app, sanctuary and
                        web3 also gained the skip link and the focus ring
css/trust.css           footer community styles for the seven trust pages
```

### Files — NEW, upload to the ROOT (not into images/)
```
favicon.ico
favicon-32.png
apple-touch-icon.png
icon-192.png
icon-512.png
site.webmanifest
robots.txt
sitemap.xml
```

### Files — NEW, upload into images/
```
images/og-card.jpg      the 1200x630 share card
```

**`js/cine.js` and `js/smooth.js` did NOT change in this pass.**

The eight root files must sit at the ROOT, beside `index.html`. Every page
references them with a leading slash (`/favicon.ico`), so putting them in
`images/` would 404 exactly as the missing favicon has been doing since
August.


### Also in this batch — the legal pass (19 September, later)

Governing law set to England and Wales, the company-number placeholders replaced
with a Companies House pointer, an entity line added to the five trust pages that
named none, the BVI and Thai entities reframed as post-operational on
`investors.html`, and the SAFE stated. **`css/trust.css` changed again** (the
`.entity-note` rule). Visible 'to be confirmed' markers: 30 -> 23.

**`terms.html` section 23 still wants a lawyer's read before launch.** Two values
were filled into existing scaffolding; no provision was drafted.

Also: three mobile fixes on the home page (the 'why now' blank space, the
ecosystem plate divides, the full-bleed community photograph) — **`index.html`
changed again**. Desktop verified untouched.

Also: Dan's portrait (`images/team-dan.jpg` — NEW, upload it), Uchenna's quote
and the CTO recruitment card + role dialog — **`about.html`
and `contact.html` changed**. jamie@daoasis.xyz is now live on both.

### After go-live
- Re-scrape the share card on Facebook, LinkedIn and Slack.
- Submit https://da-oasis-website.vercel.app/sitemap.xml in Google Search Console.
- Check the three social links actually land: instagram.com/thedaoasis,
  x.com/thedaoasis, linkedin.com/company/daoasis. **The LinkedIn one was
  inferred from "@daoasis"** — confirm it is a company page and not a
  personal profile (/in/daoasis).

---

## 0A. UPLOAD LIST — 3 September  (SUPERSEDED by section 0 above)

Hero pin removed, pinned scroll cut back and re-paced, wellness-shift cards
now take the centre, and seven fixes from the review list. See CLAUDE.md from
"Pinned scroll cut back site-wide — 3 September 2026" onward.

### Four page files — REPLACE
```
index.html
app.html
sanctuary.html
web3.html
```
`investors.html`, `about.html` and the seven trust pages did NOT change.
**`js/cine.js` DID change — it must be uploaded with them.** `css/trust.css` did not.

---

## 0A-BLOCKER. TWO APP MOCKUPS CONTRADICT THE CONTENT RULES

**This is the one thing on the site that is a stated-position problem rather
than a polish problem, and both instances have just been made more prominent.**

| where | file | what it shows |
|---|---|---|
| `index.html` — "Track what matters" | `images/img-10.jpg` | **Reward Credits · $0.100 · 24H change ↑24%** |
| `app.html` — "The Living Ecosystem" | `images/19.png` | **DVT Price · $0.100 · 24H change ↑24% · "Buy DVT" · "DRT earned"** |

Both are now the visual centrepiece of their section — the app phone was
enlarged 2.35x on 3 September, and the index dashboard is flanked by four
annotation cards pointing at it.

Every one of these contradicts a rule already written down:
- **DRC must never be shown with a monetary price** — it is a recognition
  layer with no monetary guarantee.
- **$DVT must not be presented with a price or a 24h move**, and "Buy DVT"
  frames it as a speculative instrument.
- **DRT is retired terminology** and appears nowhere in the site's copy.

`images/img-06.jpg`, `img-10.jpg`, `06.png`, `19.png`, `img-04.png`,
`img-05.png`, `img-08.jpg`, `11.png`, `18.png`, `Brathing_quest.png` and
`Hydration.png` are all already on the do-not-use list for the same reasons.
**The only clean mockups in the project are `14.png` (Marketplace) and
`17.png` / `img-03.png` (Learning) — and none of them is a wellness
dashboard.** There is no clean replacement in the repository.

**Three ways out, all needing a decision:**
1. Re-render both dashboard screens without the price header — the correct
   fix, needs design time.
2. Swap in a clean mockup and reword the sections around it — changes what
   those two sections are about.
3. Ship as-is and accept that the two most prominent product shots on the
   site say something the rest of the site explicitly denies.

Do not "fix" this by editing the PNGs' pixels — the Business Plan reached the
same conclusion and reconciled it in text instead.

---

## 0B. Still open, lower priority
- ~~**The seven-day 3D ride on `sanctuary.html`** reads as synthetic
  ("very fake, nothing there is real").~~ **Closed 19 September 2026** — the
  section was removed outright, along with the three.js dependency. The page
  now has no WebGL at all. See the note at the top of `CLAUDE.md`.
- **Mobile pin heights have not been re-paced.** Every `@media` override still
  carries its pre-3-September value.
- `about-hero-mobile.jpg` is still missing (documented, degrades gracefully),
  and so are three team portraits — `team-nelson`, `team-uchenna` and
  `team-etiosa`. Four 404s on `about.html`. Jamie and Dan are in; the rest are
  being collected.
- ~~There is still **no favicon** anywhere in the project.~~ **Closed 19
  September** — `favicon.ico` plus the PNG and apple-touch sizes are generated
  from the palm mark and linked on all 13 pages. See section 0 above; they
  must be uploaded to the ROOT.
- **No form backend anywhere.** The waitlist is a `mailto:` and the investor
  request panel hands off to the reader's own email client. Both say so.

---

## 0z. UPLOAD LIST — the 1 September motion rebuild  (NEWEST — do this one)

Site-wide rebuild of animation, transitions and scroll pacing, plus the
pin3 two-phase composition and the investor route diagram (2 Sept). See CLAUDE.md,
"Motion rebuilt site-wide — 1 September 2026".

### Six page files — REPLACE

```
index.html
app.html
sanctuary.html
web3.html
investors.html
about.html
```

### Two shared files — REPLACE  (do not miss these)

```
js/cine.js
css/trust.css
```

`js/cine.js` carries the scroll engine itself. Without it every page falls back
to direct scroll mapping rather than breaking, but none of the pacing exists —
and every section now scrubs `pos()`/`lead()`, so the per-page fallback shims
matter more than they used to. `css/trust.css` carries the shared motion tokens
(`--ease`, `--ease-soft`) for the seven trust pages.

**The seven trust HTML pages did not change and do not need re-uploading.**
**No image changed.**

---

## 0a. UPLOAD LIST — the 25 August investor-document alignment pass

Editorial pass only: copy, figures and meta tags. **No image changed**, so
section 0 below (the whole `images/` folder, plus the ten deletions) is a
SEPARATE, still-outstanding job — do that one too if it has not been done yet.

### Seven page files — REPLACE

```
index.html
app.html
web3.html
investors.html
about.html
privacy.html
terms.html
```

`sanctuary.html` is **byte-identical** to the 22 August version and does not
need re-uploading — it is still in section 0's list if that batch is outstanding.
No stylesheet, no script and no image changed in this pass: `css/trust.css` and
`js/cine.js` are untouched.

`CONTENT_REQUIRED.md` and `CLAUDE.md` also changed, but they are project notes
rather than site files; upload them only if the repo carries them.

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
images-unused/       16 MB of images nothing on the site references (19 Sep)
baseline/            8.3 MB local A/B copy
original-backup/     1.3 MB local safety copy
CLAUDE.md            working notes (harmless, but not part of the site)
PRE_DEPLOY.md        this file
CONTENT_REQUIRED.md  tracking
README.md            optional
```

`images-original/` exists so the compression is reversible and
`images-unused/` so nothing is lost; both are local safety copies, and
`images-unused/` has a README listing what is in it and how it was decided.
Together with `baseline/` and `original-backup/` that is **75 MB that must
not be uploaded** — the deployable site is about **11 MB** without them.

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
- **Three team portraits are still monogram plates** (`team-nelson`,
  `team-uchenna`, `team-etiosa`). **Jamie's and Dan's are in.** `team-trong` is
  gone — Trong was removed from the team on 25 August.
  Dropping a file into a marked slot needs no code change beyond wiring the
  `<img>`; copy the pattern from Jamie's or Dan's card.
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
