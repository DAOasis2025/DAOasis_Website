# Pre-deployment checklist

Things that must be done outside this environment, before the site goes live.

---

## 1. Convert the background photographs to JPEG or WebP

**Status: outstanding.** These are PNGs, and they are photographs — PNG is the
wrong format for continuous-tone imagery. Converting to JPEG (quality ~82) or
WebP should cut each by roughly **10×**, with no visible difference once the
scrim is over them.

| file | current size | dimensions | used by |
|---|---|---|---|
| `images/Journey image.png` | **2.38 MB** | 1774 × 887 | `index.html` — Journey section, desktop (`.stage4`) |
| `images/Journey image mobile.png` | **2.15 MB** | 1254 × 1254 | `index.html` — Journey section, mobile (`.journey-mobile-section`) |
| `images/Quest map.png` | **2.05 MB** | 1716 × 917 | `app.html` — Quest map section (`.quest-map-sticky`) |

That is **~6.6 MB of background imagery** across two pages as things stand.

**Why it has to happen on your side:** there is no image tooling available in
this environment. There is no ImageMagick, no `ffmpeg`, no `cwebp`, and no
`sharp` — the `convert` that appears on the PATH is the *Windows disk
conversion utility*, not ImageMagick, and running it errors out.

### After converting
Update the three CSS `url()` references to the new extensions:
- `index.html` — `.stage4` and `.journey-mobile-section`
- `app.html` — `.quest-map-sticky`

Each rule also sets `background-color: var(--mineral)` as a fallback, so a
missing or renamed file degrades to the section's original ground rather than
breaking the layout.

---

## 2. Consider renaming the image files to remove spaces

**Status: outstanding, lower priority.**

`Journey image.png`, `Journey image mobile.png` and `Quest map.png` all contain
spaces. The CSS references them `%20`-encoded, which is correct and works on
Vercel — but hyphenated names (`journey-image.jpg`, `quest-map.jpg`) are more
robust across hosts and CDNs and avoid a class of path-handling bug entirely.

If renamed, update the same three `url()` references listed above.

---

## 3. Files that must be uploaded to GitHub

Easy to miss because they are not page files:

- `js/cine.js` — the shared cinematic-scroll controller, loaded by
  `index.html`, `app.html`, `sanctuary.html` and `web3.html`. **If it is
  missing, every page falls back to direct scroll mapping** — it degrades
  rather than breaking, but the pacing is simply absent.
- `css/trust.css` and `js/trust.js` — shared by the seven trust-layer pages.
- The three image files above.

---

## 4. Known, accepted, not bugs

- **No favicon anywhere in the project**, so every page logs one 404 on load.
  Pre-existing and site-wide.
- **`about.html` expects `images/about-hero.jpg` and
  `images/about-hero-mobile.jpg`**, which do not exist. The page degrades to a
  colour field by design — it never shows a broken image.
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
