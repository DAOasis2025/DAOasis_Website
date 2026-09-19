# DAOasis Website — Status (as of 2026-08-14)

## Active working location — ONLY copy
**`C:\Users\Lenovo x270\Desktop\Website updates 2.0`**

This is the ONLY active working copy of the DAOasis website. Do not read from or write to any other location.

Files in this folder:
- `index.html` — home page
- `app.html` — Companion App page
- `sanctuary.html` — The Sanctuary page
- `web3.html` — The Web3 Layer page
- `investors.html` — Investor Overview page
- `about.html` — About Us / team page
- `images/` — all assets the pages use
- `vercel.json` — enables clean URLs (`/app`, `/sanctuary`, `/web3`). It now contains **no redirects at all**; every nav destination has a real page.
- `.claude/launch.json` — local static preview servers. `daoasis-static` on 8791, plus `daoasis-static-alt` on 8792 for when a second session needs its own server (`npx serve` hardcodes its port, so autoPort cannot be used).

---

## Previous location (August 12) — archived, no longer active
`G:\My Drive\From Computer\DAOasis\Website\Website updates\site\`
There was also an older, unlinked copy one level up (outside `site/`) with extra unused images — not part of the deployable site, ignore it.

---

## Deployment
- **Repo:** `DAOasis2025/DAOasis_Website` on GitHub
- **Live URL:** `https://da-oasis-website.vercel.app`
- **Auto-deploy:** Vercel redeploys (~60 seconds) on every file upload to the GitHub repo.
- **Workflow:** Edit files locally → save to `Website updates 2.0` desktop folder → upload to GitHub via browser → Vercel redeploys automatically. No CLI involved.

---

## What was completed (August 12)
- Home page never linked to the app page (nav + footer "The App" were dead `#` links). Fixed: nav, footer, and hero CTAs now point to `app.html` / in-page sections (`#waitlistSection`, `#ecoSection`).
- Browser tab title on the home page was a leftover dev label ("DAOasis Hero Prototype v5"). Fixed to a real title, and added meta description + Open Graph tags so shared links preview properly (Slack/email).
- App page hero sub-copy tightened to state the core loop explicitly (track habits/learning → earn rewards).

## The Sanctuary hero is four plates now — September 19

Three landscape plates (centre + a left/right pair) became **four portrait
plates in a left-to-right fan**, on `sanctuary 1–4`: dawn on the terrace, the
room waking, the long table at midday, the fire at night. That order is the
content — it is one day, read left to right — so the plates are in that order
in the DOM as well as on screen.

- **The bug this fixed.** The departure and the statement shared one ramp:
  `bp` faded the plates out and "Immersion creates *acceleration.*" in at the
  same time, so the wording was legible over the photographs. They are now
  two beats — plates reach opacity 0 at `raw 0.82`, the bridge does not leave
  0 until `0.84`. **Do not let those two ranges touch again.** The ~14vh of
  black between them is the point.
- Track 620 → **700vh** (mobile 800 → 880), `states: 3` → **4**. The fourth
  plate and the held black frame both need scroll to spend; taking it out of
  the existing track would only have made everything before it faster.
- Plates are **2:3** and the renders are 1024×1536, so `cover` crops nothing
  and there is no per-plate `background-position` any more — there used to be
  one per image.
- The fan is parameterised as `LANE/SETTLE/LIFT/TILT`, four entries each, with
  lanes measured **in plate widths** so the spacing scales with the plates.
  Width comes from the span of the whole fan (`4.10w` desktop, `2.10w` mobile
  where they overlap into a fanned hand), not from one plate.
- **The supplied PNGs were 2.3–2.6MB each, 9.6MB for the set, all of it in the
  hero** — against a 608KB largest image everywhere else in the project. They
  ship as `sanctuary-0N.jpg`, mozjpeg q82 4:4:4, ~320KB each, 1.25MB total.
  The `.png` originals are still in `images/` and are not referenced.
- Verified by pulling the real `applyFrame` source out of the served page and
  driving it by hand at fixed `raw` values, because the Browser pane freezes
  `requestAnimationFrame` when hidden. Settled fan measures 65px clear of both
  edges at 1280×860, 24px at 375×812, 21px at 320×640.

## The WebGL sections are gone from sanctuary.html — September 19

**Read this before any of the 3D material below.** Everything in this file
about `stage3D`, `TROPIC`, `whenTHREE`, the pavilion ("3D one") and the
lantern walk ("3D two") is history, not a description of the live page.

- *3D one* had already been cut before today; the structure list above still
  named it, which is now corrected.
- *3D two — "The Seven Day Journey"* was removed on 19 September 2026 at the
  owner's request. With it went the three.js CDN tag, the `?shot=1` capture
  hook, the `.three-*` / `.loop-*` CSS, `whenTHREE()`, `stage3D()`, the whole
  `TROPIC` vocabulary and the scene builder — roughly 1,200 lines. There is
  no `<canvas>` and no WebGL on the page any more.
- The `.divider.solo` that followed the pinned stage went with it, and the
  divider above it dropped `to-bleed`, because the block it now introduces is
  Transformation, an ordinary padded section, not a full-bleed canvas.
- The seven days themselves are untouched. **Section 5 — Seven Days** is a
  separate, non-WebGL sticky section and is still the page's account of them.
- The August 21 rebuild notes, the r128 shadow-frustum finding and the
  screenshot harness notes are kept deliberately: they are the reasoning, and
  they are the only record of it if the scenes are ever rebuilt.

## What was completed (August 13) — the Sanctuary page
Built `sanctuary.html` as a new standalone page. `index.html` and `app.html` were **not** modified.
Only other change: removed the `/sanctuary → /` redirect from `vercel.json` so the page is reachable at its own URL.

Page structure, in scroll order:
hero → The Sanctuary → Philosophy → Four Foundations → Seven Days → An Average Day →
Immersion → The Experience → The Place → Transformation →
Phuket 2027 → Early Access form → closing.

Key decisions worth keeping:
- **Hero** reuses the App page's scroll architecture (tall pinned outer → sticky 100vh stage → rAF loop lerping one 0–1 scroll value through phases). Three photographic plates replace the App's three phone mockups: darkness → plates emerge from depth → plates accelerate past the camera → "Immersion creates *acceleration.*"
- **Both 3D scenes deliberately avoid particle systems.** That language belongs to the homepage palm assembly. An earlier draft reused it twice and was rejected as derivative.
  - *3D one — the pavilion:* real meshes, real lights, real shadows. The building never moves; the sun crosses the sky as you scroll and drives light colour, shadows, sky bounce, fog and the pool's specular. Seven-key palette, 05:00 → 21:00.
  - *3D two — the loop:* a closed `CatmullRomCurve3` extruded as a tube, seven waypoint gates, thick fog and a lamp that travels with the camera, so you only see the stretch you are on. At 82% the camera rises out and the fog clears, revealing a closed ring — "It was never a line. It was always a loop."
- **Dividers** are the homepage system (26px palm mark, 24px gap, 1200px inner), drawing outward from the mark on entry. 11 of them; each sits on an opaque background matched to the section it bridges. `img-09.png` (black mark) on light joins, `img-09-white.png` on dark.
- **Reveals** are line-masks — headlines rise out of their own baseline. `<span class="ln"><i>…</i></span>` inside a `.rv` container. `.rv` gets `.show` from an IntersectionObserver. There is a `<noscript>` block and an IO-absent guard, because without them the page serves invisible type.
- **All photography is referenced from one CSS variable block** at the top of the stylesheet (`--img-hero-01`, `--img-day-morning`, …). To swap a holding image, change the path there only. All current images are existing project assets used as holding images.
- **Light theme** adapts chrome only (nav, drawer, footer toggle). The body is a fixed dark → ivory → green → ivory → dark sequence, the same way app.html keeps its Ecosystem/Quest/Footer as fixed anchors.

### Three bugs found and fixed during that build — do not reintroduce
1. In three.js r128, `LightShadow.updateMatrices()` does **not** rebuild the projection matrix. Widening `sun.shadow.camera.left/right/top/bottom` does nothing until you call `camera.updateProjectionMatrix()` yourself. Without it the frustum stays at the ±5 default and shadows silently vanish.
2. `.grain` uses `::after`. `.hero-stage` already owned `::after` for its vignette, so the two collided and the grain's `opacity: 0.038` flattened the vignette. The hero now has its own `.hero-grain` element.
3. The loop's pull-back originally lerped the camera straight across the ring's empty interior while the fog was still thick, producing a completely black frame mid-reveal. Fixed by arcing outward-and-upward from the current position, with the vantage distance derived from the live camera aspect (`vantageFor()`).

---

## How the Sanctuary page is linked — DONE (August 13)

The page is fully wired. Every Sanctuary entry point across all three pages resolves (verified 200 on the local server):

| Location | State |
|---|---|
| `index.html` nav "The Sanctuary" | `sanctuary.html` — was a `<span>`, now a link |
| `index.html` footer "The Sanctuary" | `sanctuary.html` — was `href="#"` |
| `index.html` ecosystem card "Learn more →" | `/sanctuary` — already worked once the redirect was removed |
| `app.html` nav / drawer / footer | `sanctuary.html` — all three were `href="#"` |
| `sanctuary.html` nav / drawer / footer | `sanctuary.html`, marked `.active` in nav |

Converting the homepage nav `<span>` to an `<a>` is visually identical — `.nav .links a` uses `color: inherit`, so it renders at the same colour, size, font and baseline as the remaining `<span>` items, and simply gains the hover state that "The App" already had.

**Note on `/web3`:** resolved August 14 — the page exists, the redirect is gone, and `index.html`'s ecosystem card link to `/web3` now lands on the real page.

---

## What was completed (August 14) — the Web3 Layer page
Built `web3.html`. `index.html`, `app.html` and `sanctuary.html` were changed **only** to
turn their dead "The Web3 Layer" nav / drawer / footer entries into real links.
`vercel.json` lost its last redirect.

### Deliberate departures from sanctuary.html
The chrome is identical (nav, drawer, dividers, `.rv`/`.ln` reveals, `.par` parallax,
buttons, footer, light-theme block, noscript fallback). The *scene language* is not,
on purpose — Sanctuary is volumetric and photographic, Web3 is flat, precise and
editorial.

- **No three.js.** There is no CDN script tag on this page at all. The one canvas is
  2D. This is a deliberate choice, not an omission: it keeps the page fast on mobile
  and gives it its own identity next to Sanctuary's two WebGL scenes.
- **No particle systems and no loop-closing reveal.** Both belong elsewhere — particles
  to the homepage palm assembly, "it was never a line, it was always a loop" to
  Sanctuary's 3D two. Reusing either here would have read as derivative.

### The three signature moments
1. **Hero — the fabric** (`#heroCanvas`). One gold thread draws left to right, then the
   camera pulls back and it turns out to be one thread among ~45, woven into a field.
   Says "what you do here becomes part of something bigger" without a word of copy.
   Threads are deterministic (`rnd(i)` off a sine hash) so the field is identical every
   load. Zoom is a single value `z` lerped 7.4 → 0.34; world coordinates are divided by
   it, so wave amplitude flattens and wavelength shortens as you pull back — a real
   zoom, not a fake one.
2. **The Bridge** (`#bhStack`). ~17 separate hairlines of varying width converge, equalise
   and resolve into one solid gold rule labelled $DVT. Conversion shown as consolidation.
   No arrows anywhere on the page, and deliberately nothing that looks like a token swap UI.
3. **The complete loop** (`#loopSvg`). A nine-stage ring with a travelling arc that closes
   exactly at the top. Flat and typographic, so it does not compete with Sanctuary's
   first-person 3D loop.

### Four things the visual pass changed — all were invisible to the numbers
The layout audit passed at every breakpoint *before* any of these. They were only
findable by looking, which is why the eye pass is not optional on this kind of page.
1. **The hero's middle was empty.** `Z0` was 7.4, which put the nearest neighbouring
   thread ~960px off screen, and the pull-back used smoothstep, which barely moves
   early. Between p≈0.30 and p≈0.55 — about 1.5 viewport-heights of scrolling — the
   frame was one line and nothing else. `Z0` is now 4.8 and the pull uses ease-out
   (`outQuad`), so the field starts arriving immediately and the densest frame lands
   at p≈0.70, comfortably before the statement covers it at 0.80.
2. **Ecosystem labels sat on the line.** Sides were alternating by index, so wherever
   the curve happened to head the same way the label landed inside the wave. Side now
   comes from the node's own height — crests label up, troughs label down.
3. **Loop labels rendered at 8.6px.** The SVG is scaled to ~0.8, so 11 viewBox units
   is not 11px. Now 14 units (10.6–13.6px depending on viewport), ring nodes r=5.5,
   and `.loop-wrap` grew to `min(80vh, 100%)` / max 740px.
4. **The hero caption wrapped on mobile.** `left: 50%` with no width leaves only half
   the stage to shrink-to-fit into. Fixed with `white-space: nowrap`.

### Four bugs found and fixed during the build — do not reintroduce
1. **The device mockups are not what they look like.** `17/18/14/11.png` are 2250×2250
   transparent PNGs in which the phone occupies only x 30.5–69.5%, y 9.9–90%. Setting
   `width: 100%` on the image renders a phone about a third of the intended size floating
   in dead space. `.dev` crops to exactly that window (`width: 257.73%; left: -78.69%;
   top: -12.31%` inside an `aspect-ratio: 873/1803` box). Do not size the `<img>` directly.
2. **Sticky sections must be sized off viewport height, not column width.** At 1280×720
   the participation device was 620px tall inside a 720px sticky and pushed the headline
   to `top: -70px`. `.part-grid .dev` is now `height: min(52vh, 580px)` with `width: auto`.
3. **The bridge hairline spread was a fixed 14px × 21 = 280px** inside a stage that is only
   ~246px tall at 720px height, so the stack overran the headline and the rail. The gap is
   now measured from the stage each resize (`(stageH * 0.46) / (N-1)`, clamped 6–15px) and
   the ticker's offset is derived from it.
4. **The loop copy was absolutely positioned over the ring** (copied from Sanctuary's
   `.three-copy`, which works only because a 3D canvas is full-bleed). At 1280 wide it sat
   on top of the ring's left-hand labels. `.loop-sticky` is now a two-column grid.

### Hero layer labels (August 17)
The hero's tick marks along thread zero are now labelled with the eight layers the
thread runs through: Companion App · Learning · Community · Reward Credits · $DVT ·
Marketplace · Governance · Sanctuary. The ticks keep their original meaning —
individual acts of participation — and the labels name the layer each act belongs to.

- **Deliberately not Section 6's treatment**, which names the same parts. Section 6 is
  the diagram (stems, two-line labels, SVG); the hero is the close-up (inline, no
  stems, no sub-labels, dissolves). Do not converge the two.
- **DRC and $DVT are separate entries** on purpose, per the content rules below.
- **The label window is geometry, not taste.** The set spans 7 × 78 world units, so all
  eight only fit once `z <= (W - 100) / 546` — about 3.2 at desktop width. An earlier
  ramp keyed off the ticks' own alpha put that moment at ~50% opacity for barely a
  tenth of the hero, so the full set was never actually readable. `labA` is now
  `clamp01((z - 2.0) / 0.65)`: full strength while all eight are visible, gone by
  z = 2.0. The floor is 2.0 rather than 1.7 because **adjacent labels start touching at
  z ≈ 1.95** — they must be fully gone by then, not merely faint.
- **Mobile is a different composition, not the desktop one shrunk.** At a legible zoom
  the ticks are 78 × z apart, so a 375px screen physically holds about two of them —
  labelling every tick showed 1 of 8 and read as broken. Mobile names **one layer at a
  time**, advancing as the camera pulls back, with a short stamp in/out at each change.
  Same eight layers, read in sequence instead of all at once.
- Canvas letter-spacing is not reliable across engines, so tracking is applied by hand
  in `trackedText()`; it also yields the exact width that centres a label on its tick.
- Verified by driving `draw(p)` by hand (pane hidden, rAF frozen): 8/8 labels at full
  alpha at p≈0.40 with a 53px minimum gap, none overlapping, all clear by p=0.46.
  Mobile cycles APP → COMMUNITY → DRC → $DVT → MARKETPLACE → SANCTUARY within the
  viewport at 375 and 390. **Not yet judged by eye.**

### Content rules for this page — these are firm
- **DRC and $DVT must never blur together.** DRC = DAOasis Reward Credits, the recognition
  layer, earned through participation, held inside the app. $DVT = DAOasis Value Token, the
  on-chain layer. DRC converts to $DVT. That distinction is the whole page.
- **Never describe DRC as a token to speculate on**, and never present $DVT as an investment
  or a store of value. No prices, no yields, no APY, no user counts, no market data.
- **Do not use `images/06.png`, `19.png` or `img-08.jpg` on this page.** They are lovely
  mockups but they show a DVT price chart with "$0.100 ↑24%", and an 18.6% APY with
  projected USD earnings. That is exactly the speculative framing the page is built to
  avoid. `13.png` is a MetaMask tutorial screen — third-party branding, also out.
  `Web3.png` is unusable anywhere: it is 24-bit with a checkerboard baked into the
  background, not a transparent PNG.
- Where a mechanic is not built yet the page says so on the page ("The marketplace is in
  development", "Mechanics in design · no returns are promised"). Do not quietly upgrade
  those to the present tense.
- Digital sovereignty is **future direction only**, and the section says in plain words that
  DAOasis does not store health data on a blockchain. Do not soften that disclaimer.

### Dead code worth deleting sometime
`index.html` contains a complete lightbox — CSS (lines ~252–272), markup (~1243–1255) and a `url:` field on every `cardData` entry — with **zero JavaScript references**. Nothing opens it, populates it, or adds `.open`. It was superseded by the inline `.card-more` expand. Its `href="#"` CTA is therefore unreachable, not a live bug. Safe to remove as cleanup; do not waste time "fixing" it.

---

## Known gaps
- ~~Nav items "About Us" and "Investors" are unlinked everywhere.~~ — **fixed August 17.**
  Both now resolve to `about.html` / `investors.html` in nav, drawer and footer on all
  six pages.
- `about.html` needs `images/about-hero.jpg` and `images/about-hero-mobile.jpg`, plus
  six team portraits. All are marked in the markup; the page degrades gracefully.
- There is no public investor contact address, so `investors.html` ends with a plain
  statement rather than a mailto. The exact insertion point is marked with an HTML
  comment. No investor PDFs exist in the repo either — the resources grid renders from
  one `DOCS` array; setting a `file` on an entry turns that card into a download.
- There is no `favicon.ico` anywhere in the project, so every page logs one 404 in the
  console on load. Pre-existing and site-wide, not a page bug.
- No signup backend anywhere. The Sanctuary early-access form is front end only and says so on submit: nothing is sent or stored. Do not wire it to a fake confirmation.
- ~~`app.html` has CSS for `.int-section-inner` / `.int-section-left` / `.int-section-right` / `.whoop-img` missing~~ — **fixed August 14.** Section 9 (Integrations) is now a deliberate two-column editorial spread. See "Integrations section" below.

---

## Integrations section (app.html, Section 9) — reworked August 14

`.int-section-inner` / `-left` / `-right` had no rules, so the section rendered as
three stacked full-width blocks. It is now one editorial spread.

Markup moved (nothing was added or removed except one `.int-visual` wrapper):
the six cards moved into `.int-section-right`; `whoop.png` moved into
`.int-section-left`, below the copy. The `#intGrid` id is unchanged, so the
existing stagger observer still finds it.

- **Statement column** — kicker, headline, body, then the Whoop band as the
  visual that closes the column. **Content column** — the six platform cards, 2×3.
- **Breakpoint is 1180px, not 900.** Below that the content column gives 274px
  cards and ~31-character description lines. Measured, not guessed.
- **Invariant worth keeping:** `.whoop-img` is always `width: 100%` of
  `.int-visual`, so the band and the hairline rule above it share an edge at
  every width. `.int-visual`'s `max-width` is the *single* place the plate is
  sized (none on desktop = fills the column; 460px stacked). Do not set a width
  on the image itself — that is what produced the unfinished edge originally.
- No `position: sticky` on the statement column. It was tried; once the band
  fills the column the two columns are within ~40px of each other, so there is
  no travel to sticky through, and it only added a viewport-height gate.
- **Contrast:** `.int-card-desc` was `#5f5a52` on `#211D1A` — 2.4:1, effectively
  decorative. Now `#8a8377` (~4.5:1). `.int-card-tag` gold went 0.5 → 0.72 alpha.

Still open here: each card shows the brand name twice — once as `<text>` inside
the `.int-logo` SVG, once as `.int-card-name`. `.int-logo text { display: none; }`
would fix it in one line, but it is a content/branding call, so it was left alone.

---

---

## Controlled Cinematic Scroll — site-wide system (August 14)

`js/cine.js` — the **only** new file. Loaded by all four pages with a plain
`<script src="js/cine.js"></script>` immediately before each page's inline script.
**It must be uploaded to GitHub along with the pages**, inside a `js/` folder.

### What it actually does
It does **not** touch scrolling. There is no wheel handler, no touch handler, no
`overflow: hidden`, no scroll engine and no library. The browser scrolls natively
at all times. What it decouples is *pace*:

> scroll position = **user intent** · rendered value = **DAOasis pace**

A section reads scroll as a *target* and moves the value it actually renders toward
that target over a **configured duration**. A violent flick sets a distant target,
and the story still unfolds at the intended speed. Because the paced value always
converges on true scroll progress, nothing is ever stranded and no one is ever trapped.

Two consequences worth knowing, because they are why the design is this shape:
- **Wheel/trackpad normalisation is free.** Delta size is never read. Pace comes from
  duration, so a mouse notch and a trackpad glide behave identically.
- **Keyboard support is free.** Arrows, PageUp/PageDown and space scroll natively,
  which moves the target, which the pacer follows. There is nothing to intercept.

### The two modes
- **`sticky`** — quantised. Commits to whole narrative states and eases between them
  over a fixed duration. One meaningful scroll = one state. For state machines.
- **`guided`** — continuous, hard speed-capped. For continuous cinematography
  (camera moves, zooms, path draws) where quantising would look steppy.

Sections given no track keep completely ordinary scrolling.

### Where it is applied
| Page | Section | Mode | States |
|---|---|---|---|
| index | hero journey route (`pinContainer`) | guided · epic | 5 waypoints |
| index | principle (`pin5`) | guided · epic | 4 |
| app | hero phone fan-out | guided · epic | 3 |
| app | quest map route | sticky · major | 6 **uneven** stops |
| app | marketplace scenes | sticky · major | 4 |
| sanctuary | hero plate fan | guided · epic | 4 |
| sanctuary | four foundations | sticky · major | 4 |
| sanctuary | seven days arc | sticky · epic | 7 |
| web3 | hero fabric | guided · epic | 3 |
| web3 | participation | sticky · major | per item |
| web3 | the bridge | sticky · epic | 5 |
| web3 | the complete loop | sticky · epic | 9 |

Deliberately left on **normal scrolling**: all text/card/FAQ/footer sections, the
integrations spread, the DRC tally marks, the average-day two-column scroll, every
`.rv` line-mask reveal, the `.par` parallax and the nav hide-on-scroll.

### Tuning — one place
`DAO.cine.TIMING` in `js/cine.js`. `epic` 1150/880/90ms, `major` 950/740/70,
`simple` 720/600/50 (step / back / hold). `mobileScale: 0.70` shortens every
duration on handsets. `maxSpan: 2.4` caps how long a multi-state jump may take.
Per-section overrides go in the `cine(el, {...})` options.

### Four things that are load-bearing — do not undo
1. **The transition curve is a 30/70 blend of ease-in-out and ease-out**, not a
   symmetrical ease. A symmetrical cubic ease-in-out is ~1% complete 150ms after the
   user scrolls, which reads as lag. A pure ease-out answers instantly but leaves at
   full velocity, and since a transition is re-based on its current value whenever
   the user retargets mid-flight, that shows as a visible kink. The blend is legible
   within ~80ms and still retargets smoothly. Measured, not guessed.
2. **The quest map's states are its own waypoint thresholds, not even sixths.** The
   waypoints sit at 0/.084/.221/.604/.869/1. Snapping to even sixths lands at .825,
   which is below Khao Lak's .869 — that waypoint would be **skipped entirely**.
   `stops:` exists on the controller for exactly this reason.
3. **Sections that repaint on a `scroll` listener must subscribe via `.on()`.** The
   paced value keeps moving after the scrolling has stopped, and a scroll listener
   would never repaint those frames. This is why several sections changed from
   `addEventListener('scroll', update)` to `cine(...).on(update)`.
4. **The old fixed-alpha lerps (`lerp(cur, target, 0.1)`) were not pacing.** They are
   *proportional* — a large gap closes fast — so a hard flick still raced. They were
   replaced, not wrapped.

### Verified
Controller driven frame-by-frame against real page geometry (the pane was hidden, so
rAF was frozen — see the note below): a full-aggression flick across web3's 9-stage
loop visits **all nine stages** over ~2.8s instead of one frame, and reverse visits
all nine back down. One nudge = exactly one state in ~1.1s. Direction reversal
mid-transition has a max single-frame hop of 0.012% — no glitch, no state jumping.
180 frames of jiggling under the commit threshold produce **zero** state changes.
Entering a section at 60% initialises there rather than snapping from zero. A small
scroll still tracks to 62% within 96ms, so ordinary scrolling is unaffected.
Zero JS errors on all four pages after scrolling the full document.

**Not yet judged by eye** — the Browser pane was hidden throughout, which freezes rAF.
The pacing maths is verified; how the tuned durations *feel* is not.

### Pre-existing, not caused by this work
`app.html` overflows horizontally by ~18px at 375, ~16px at 390, ~11px at 430 and
~6px at 768. Confirmed identical with the controller removed, so it predates this
change. The escaping element sits inside an `overflow:hidden` ancestor, which makes
it awkward to pin down; worth a separate look.

---

---

## Three homepage fixes (August 17)

### 1. `.scroll-hint` was 80px right of centre
It was centred with `left:50%; transform:translateX(-50%)`, but its `fadeUp`
animation ends on `transform:translateY(0)` and `animation-fill-mode:forwards`
keeps that final keyframe applied — which **replaced** the -50% shift, leaving the
hint offset by exactly half its own width. `body.intro-skipped`'s
`transform:none !important` did the same thing.
Now centred with `left:0; right:0; text-align:center`, so the transform belongs
solely to the animation. **Do not reintroduce translateX for centring on any
element that also runs a transform animation** — the same trap applies site-wide.

### 2. Dividers are transparent and overlay the section above
They used to paint an opaque band matched to the section they bridge, but a flat
band can only match one side: the hero→stage divider was `--mineral` (#171412)
between a photograph above and `--space` (#030609) below, so it matched neither
and read as a lighter stripe across the join.

- `.divider` is now `background: transparent` with
  `margin-top: calc(-1 * var(--divider-h))`, so it takes no flow height and sits
  entirely inside the tail of the section above, borrowing that section's own
  background — photograph, gradient or flat colour.
- The `.bg-*` classes are **still on the markup** and are overridden by
  `.divider.bg-*{background:transparent}`. They are now only a record of which
  colour the divider sits on, which is what picks the mark.
- **Padding is asymmetric, 11vh / 3vh.** With a symmetric 7vh the mark floated
  70px up inside the section above and one divider had only **16px** of clearance
  below that section's last line. Loading the top padding drops the mark to ~3vh
  above the join; minimum clearance is now 49px.
- Keep `--divider-h` equal to the real height (`14vh + 26px`) if the padding
  changes, or the overlay will not cancel.
- Applied to `index.html`, `sanctuary.html`, `web3.html`. **`app.html` was already
  `background: transparent`** and was left alone.
- Verified: all 26 dividers across the three pages still have a correctly
  contrasting mark against what they now sit on (black on ivory/stone, white on
  green/dark/photograph), and no mark or rule overlaps any visible text at 390 or
  1440.

### 3. Mobile "Why DAOasis matters now" — copy and palm now take turns
On desktop the copy is a narrow left column and the palm sits centre-right, so
they coexist. On a handset the copy spans the full width and the palm assembled
directly behind it, which made the body text unreadable.

The copy's opacity was **hardcoded to 1** for the whole section, so it never
cleared. On mobile it now hands over: the dust holds at 0.16 while there is copy
to read, then across t 0.22→0.38 the copy fades out as the palm comes to full
strength. Measured (frame-driven, pane hidden): t≤0.22 copy 1 / palm 0.16 · t=0.30
copy 0.40 / palm 0.58 · t=0.34 copy 0 / palm 0.79 · t≥0.38 palm 1.
Desktop is untouched. Under reduced motion the copy stays up and the palm holds at
0.22, so nothing is ever lost behind it.

**None of the three has been judged by eye** — the pane stayed hidden, so this is
geometry and opacity verified numerically, not a visual sign-off.

---

## Principle section rebuilt + homepage sticky lifecycle (August 17)
**Built, numerically verified and judged by eye.**

Scope: `index.html` only. Nothing on app/sanctuary/web3 was touched.

### The Principle section is now scroll-scrubbed, not timer-driven
The old section was a 300vh pin whose entire content was produced by
`setTimeout`: a `triggered` flag latched the first time `pin5` reached the top,
then a 55ms-per-character typewriter ran on wall-clock time, then the glass card
faded in. Two consequences, both of which the redesign removes:
- **Scroll did nothing.** The story took ~2.5 seconds and the pin was 300vh, so
  roughly 200vh of the section was a frozen pinned frame. That is the
  "sticky whenever the browser happens to be near this section" failure.
- **It never reset.** `triggered` was one-way, so scrolling back up showed the
  completed headline and card with no way to replay, and a typewriter could
  still be running after the reader had left.

**`render(t)` is now a pure function** — reads nothing but the paced scroll
value, writes nothing but inline styles. There is no timer and no latched class
anywhere in the section. That is what makes the lifecycle residue-free by
construction rather than by cleanup: reversing the scroll reverses the section
exactly, and whatever frame is on screen when the pin releases is the frame that
belongs there.

- **The typewriter is gone on purpose.** Character-by-character is a terminal
  metaphor; it reads mechanical no matter how it is eased. Replaced with a
  **word-mask reveal** — one `.pr-w` mask per word, each rising out of its own
  baseline with blur resolving to sharp. That is the site's existing `.ln`
  line-mask vocabulary applied at word scale, not a new idiom.
- **The glass card is gone too** — `backdrop-filter`, inset highlight, sheen
  gradient and a `rotateY/rotateX` mouse tilt are the tech-landing-page
  register the page is moving away from. The three statements are now set as
  plain editorial type against a 1px spine whose gold fill tracks progress.
- **Statements arrive one at a time and recede rather than leave.** A statement
  that has had its moment drops to 0.28 and picks up 0.6px of blur; it does not
  disappear. The section therefore closes on the complete thought instead of an
  orphan paragraph, and the column never reflows.
- **All copy is verbatim.** Headline, three statements, emphasis spans and the
  photograph are unchanged.

**Track is `guided`, not `sticky`, and that is deliberate.** Quantising makes
masked type and blur read as stepping. What this section needs is not "commit
to a state" but "never move faster than this", which is exactly guided's speed
cap. The dwell that lets each statement land is in the timeline, not the
controller: every statement gets a wide plateau and a narrow arrival band.

**Two things the numbers caught, both invisible until measured:**
1. Receding a statement *concurrently* with the next one's arrival produced a
   frame at t=0.50 with one paragraph at 0.58 and another at 0.37 — nothing at
   full strength, the least confident moment in the section. A statement now
   recedes only after the next has essentially landed.
2. **Mobile was 663px tall at 390×844 — shorter than one viewport**, so all
   three statements crossed the reading line together and the sequence
   collapsed into a single reveal. The 9vh gap between statements is
   load-bearing pacing, not decoration; do not tighten it.

Height went 300vh → 340vh because the section now has four beats to spend
scroll on where before it had none.

Mobile keeps the same narrative with no sticky at all: `.pin5` is still
`display:none` below 900px, and each part is revealed by its own
IntersectionObserver as it reaches the reading line, so the reader's own scroll
does the pacing. The dead `.stage5` mobile rules (including an `overflow-y:auto`
inside a sticky) were removed.

### The journey track was a one-way ratchet — fixed
`pin4`'s tick read `target = Math.max(target, computeT())`. Once the route
reached Phuket it stayed there, so scrolling back up through **760vh** of pinned
journey showed a frozen completed route, a comet parked at the end and the
stage-07 popcard — a finished animation left pinned on a section the reader was
leaving. It now follows scroll in both directions.

### Left alone deliberately
- **The hero route's `maxProgress` latch.** It is a trail being drawn across a
  map; leaving it drawn is defensible, it is documented as intentional, and it
  is the homepage's signature. Flagged, not changed.
- **`.stage3`'s callouts overhang the stage by 22px above / 40px below** because
  `overflow-y:visible` is required for them to escape the dashboard. Pre-existing
  and small.

### Verified (numerically — see the eye-pass caveat)
Full-aggression flick across the whole section takes **3.23s** down and 2.51s up,
max single-frame hop 1.3%, visiting every beat — it cannot flash through. One
120px wheel notch resolves in **320ms** and a 40px nudge in 160ms, so ordinary
scrolling is not held back. Direction reversal mid-flight has a max hop of 0.6%
and lands cleanly. Sweeping the whole document at 400px steps, **no stage ever
paints outside its own pin** (0 escapes). Scrolling past the Principle and back
returns it to a true zero state — statements 0/0/0, words at 108% — with no
leftover `.pr-card`, cursor or `.visible` class. Zero console errors on a full
sweep down and back up. No horizontal overflow at 375, 390, 430, 1024, 1280 or
1920; headline stays on one line on mobile; statements become eligible 160–200px
of scroll apart.

Note that **the pane reports `prefers-reduced-motion: reduce`**, under which
`cine` emits raw scroll and all pacing is bypassed; the pacing figures above came
from driving a copy of `js/cine.js` with `reduced` forced to false against this
section's real geometry.

### The eye pass — four things the numbers had passed clean (August 17)
Same lesson as the web3 build: the layout audit was green at every breakpoint
before any of these, and all four were only findable by looking.

1. **The column was designed for the finished stack, so the early beats were a
   hole rather than whitespace.** With only the headline up, it sat in the upper
   third with the statements' reserved space empty beneath it. `.pr-left` is now
   shifted down at the start and rises to its layout position as the statements
   fill in — so whatever is actually visible reads as optically centred. The
   shift is **clamped to the room available** (`(stageH - leftH)/2 - 12`), because
   at 1280×720 half the stack is more than the stage has to give; measured, the
   clamp binds at 79px there and 119px at 1280×800.
2. **The rule trailed off into empty column.** It was a full-height track with a
   gold fill inside it, eased smoothly over the whole section — at t=0.44 it was
   54% long with only the first statement on screen. It is now a single hairline
   whose length comes from **real geometry**: `reach[i]` is measured per
   statement, so the rule ends within a few px of the last arrived statement at
   every beat (0/1/-9px at the three resting frames).
3. **The rule's gradient ran the wrong way** — strongest at the top, beside the
   two statements that had already receded, faintest beside the live one. The
   live statement is always the lowest, so the gradient now strengthens downward.
4. **The mobile section crowded the divider.** A `padding-bottom: 6vh` override
   (added in this same pass) cut `.section`'s 16vh tail, and since the divider
   overlays that tail by its own full height, the palm mark's box landed **1px
   into the last line of the statement** against a 49px minimum. The override is
   gone; clearance is now 68px at 390×844 and 61px at 375×667. **Do not set a
   bottom padding on `.principle-mobile-section`** — the mark sits at
   `(section bottom − 3vh − 26px)`, so any tail shorter than ~16vh collides.

Body type also went 15px → 16.5px; at 15px on a 380–460px measure it read as a
caption next to a 72px display headline. Statement rise dropped 20px → 14px,
since the column is now rising too and the two movements stacked read as
overshoot.

Re-verified after all of the above: pacing figures unchanged (3.23s / 2.51s /
320ms / 160ms / 0.6% reversal hop), 0 stage escapes across the document, the
column fits the stage at all 11 sampled frames with a 12px worst-case bottom
margin, scroll-past-and-return still resets to a true zero state, 0px horizontal
overflow anywhere at 1280×720, and 0 console errors on a full sweep.

---

## Investors page + About page + sitewide consistency pass (August 17)

Two new pages — `investors.html` and `about.html` — plus a surgical terminology
pass across the four existing pages. Numerically verified; **not yet judged by eye**
(the Browser pane stayed hidden throughout).

### Both new pages deliberately have no pinned sections at all
No `cine` track, no sticky, no scroll scrubbing, no three.js. Every animation is a
one-shot IntersectionObserver reveal, so there is no state that can be stranded when
the reader scrolls back up. This is a design decision for these two pages
specifically — an investor memorandum and a team page earn their authority from
typography and hierarchy, not motion. Do not add scroll choreography to either.

### SVG diagram text does not scale the way it looks like it does
The single most useful lesson from this build, and it bit three times:

> A `font-size: 11px` inside an SVG is **11 viewBox units**, not 11 pixels. The
> rendered size is `11 × (renderedWidth / viewBoxWidth)`.

On investors.html the route, the participation ring and the metrics flow all had
sub-labels rendering between **7.9px and 8.6px** at 1024 — present, but not readable,
and completely invisible to a layout audit (zero overflow, zero collisions). Fixed
two ways together, and both halves are needed:
1. **viewBoxes sized close to the width the diagram actually gets.** Route 1200 → 1040
   (capped at `max-width: 1200px` so 1920 does not inflate it), ring 560 → 520 with
   `r` 196 → 180, metrics flow 1100 → 900.
2. **Each diagram hands over to a recomposed vertical version below 1100px** rather
   than shrinking further — the route to an itinerary list, the ring to its numbered
   list, the flow to a stacked sequence. 1100, not 900: between 900 and 1100 the
   labels were still under 10px.

Also: a small label sitting directly **above** a large Cormorant name needs ~30 units
of clearance, not 20 — the ascent box reaches nearly a full em above the baseline. The
reverse order (large name above small label) is fine at 20.

### Two more images are now banned, for the same reason as the others
`images/img-06.jpg` and `images/img-10.jpg` join `06.png` / `19.png` / `img-08.jpg` on
the do-not-use list. Both show the app dashboard with **"Reward Credits · $0.100 ·
24H change ↑24%"** — a dollar price and a 24-hour move on DRC. DRC is explicitly not a
tradeable instrument and carries no monetary guarantee, so those two frames contradict
the product design, not just the page tone. They are fine as historical mockups; they
must not appear on investors, web3 or about.

### Terminology fixes applied across index / app / web3
P0 pass against the canonical model (participation → DRC → convert → $DVT → utility →
contribution). What changed:
- **DRC no longer implies monetary value anywhere.** "a balance that grows in value",
  "real value attached", "earning real value", "a habit with real value" are gone —
  replaced with recognition language. DRC is introduced by name (`DAOasis Reward
  Credits — DRC`) rather than only as "Reward Credits".
- **$DVT is no longer described as tradeable with a price.** The app's Web3 card said
  DVT "can be held, used … or traded" and that the wallet shows "your balance, price,
  and transaction history". Both removed.
- **Governance is no longer present tense.** index.html said "DVT holders participate
  in decentralised governance — voting on product direction, treasury use". Now
  "designed to carry governance … introduced in stages".
- **The Sanctuary is no longer bookable.** app.html's marketplace scene said retreats
  were "bookable with $DVT" and tagged "$DVT redeemable". Now "planned for 2027 — with
  $DVT designed to carry access". This was the sharpest violation of the Sanctuary
  content rules already in this file.
- index's journey nodes went "Own DVT (Optional)" → "Convert to $DVT (Optional)", which
  is the actual mechanic.

`sanctuary.html` needed no terminology changes. `web3.html` was already almost fully
compliant (its status labels predate this pass); only two tense fixes.

### Navigation — every nav entry on the site now resolves
"About Us" and "Investors" were dead `<span>`s on all four pages. Both are now real
links in nav, drawer and footer across all six pages, following the same pattern used
for Sanctuary and Web3. `<span>` is still the convention for genuinely unbuilt
destinations (Careers, Team on some pages, Legal, social).

### about.html — what is a placeholder and why
- **No team photography exists in the project.** Each profile has a portrait plate
  (`.pt`) showing a set monogram and a "Portrait to follow" caption. Dropping an
  `<img>` inside the `<figure>` covers the monogram automatically — no CSS change.
  Every slot is marked with an HTML comment giving the intended filename. Do **not**
  fill these with stock photography or generated portraits.
- **The hero image is not in the repository.** `about.html` expects
  `images/about-hero.jpg` (the raked-sand garden with six stones, landscape) and
  `images/about-hero-mobile.jpg` (portrait crop of the same image). Until they exist
  the hero paints `--sand` (#E7E0D4) and still reads as designed — it degrades to a
  colour field, never to a broken image. Mobile gets its own asset because a landscape
  frame centre-cropped into a 390×844 viewport loses the outer ring of the composition,
  which is the part that makes it read.
- **Nelson's quote was updated for current terminology.** The supplied source says
  "$DRT rewards your wellness journey" — DRT is the retired name. It now reads "DRC
  rewards your participation." Meaning preserved, terminology current. There is no DRT
  anywhere on the site.
- **Team structure was corrected on 18 August 2026.** Trong is **not** a founder and no
  longer appears in the founding-team row. Founding team = **Nelson** (Co-Founder, COO &
  Token Strategy) and **Dan** (Co-Founder, Company Strategy) only. Technology =
  **Trong** (Chief Technology Officer), **Uchenna** (App Developer) and **Etiosa**
  (Smart Contract Development). Trong's bio and quote moved verbatim; nothing was
  invented for him. Uchenna is placeholder copy with no quote.
  - The founding row uses a new `.team.team-2` two-up variant. Two cards dropped into
    the three-column `.team` grid left a visible hole that read as a deleted card, so
    the row is two columns with the portrait plate capped at 430px — without the cap a
    half-width column renders the 4:5 plate ~60% taller than the three-up cards and the
    founding team becomes louder than the founder section above it. The stagger is kept.
    **The mobile `gap` has to be restated inside the `@media(max-width:1000px)` block**,
    because `.team.team-2` (0,2,0) outranks the mobile `.team` rule (0,1,0).
  - Technology reuses the plain three-up `.team` grid with no new CSS: `.pt`, `.pf-name`,
    `.pf-role`, `.pf-bio` and `.pf-q` all already have `.on-dark` variants, so identical
    markup renders correctly on the dark ground.
  - `.pf-soon` ("Quote to follow") is a new placeholder that carries `.pf-q`'s rule and
    spacing in `.pt-tag`'s micro-label treatment. It exists because Uchenna has no quote
    and one card ending early leaves a ragged hole in a three-up row. **Do not resolve
    that by writing a quote for a real person.**
  - The **disciplines block** and the **"Six remits" diagram** were deliberately left
    alone. They name remit leads, not full rosters, and Trong still leads Technology.
- The systems diagram in "Six remits. One ecosystem." is **CSS, not SVG** — deliberately,
  given the scaling problem above. It stacks cleanly to 375px.

### Verified
All six pages: every internal link, in-page anchor, `<img>` and CSS `url()` asset
resolves (only the two About hero files 404, by design). Zero console errors on
index, app, sanctuary, web3 and investors; about logs only the missing hero.
investors.html and about.html audited at 375, 390, 430, 768, 1024, 1280, 1440 and
1920 — **0px horizontal overflow and zero escaping elements at every width**, no SVG
text collisions, and no text below the site's own 10px footer-label convention.

---

## Journey section (index.html, `pin4`) redesigned — August 20

Visual only. **The scroll logic was not touched**: the script still just
toggles `.done/.active/.tease` on `.j-node`, writes `.j-line-fill`'s width
and `.j-comet`'s left/opacity. All seven titles and descriptions are
verbatim, the seven-stage sequence, the pop card and the hover-to-preview
all behave exactly as before.

- **Seven numbered discs → seven engraved medallions.** `.j-dot` keeps its
  class name deliberately — every state rule the script drives still
  matches — but now holds an icon, with the stage number lifted out into a
  `.j-num` serif folio above the ring. Icons are the site's existing
  24-unit line set (stage 02 reuses app.html's Steps path).
- **Weight now goes UP with state.** The old design filled a disc with
  solid gold the moment a stage was *reached*, so six completed stages were
  louder than the one being read. Progression is now quiet ring → warm ring
  → lit ring, and only `.active` is scaled (1.10).
- **`--medal` and `--numh` on `.j-track-wrap` drive all the geometry.** The
  rule, the fill and the comet are positioned from the *same* expression as
  the ring's centre — `calc(var(--numh) + var(--medal) / 2)`. If those fall
  out of step the path stops running through the rings. Verified aligned to
  within 1.5px at 1110, 1280 and 1440.
- **Column separators are one repeating gradient on `.j-track::before`**,
  not seven elements. The pseudo is shifted left by half a column
  (`calc(-100% / 12)`) precisely so the gradient's periodic lines land on
  the midpoints between stages instead of on the medallions themselves.
- **Titles are Cormorant, not 12px tracked sans.** Under a 64px Cormorant
  headline the old labels read as UI chrome; that was most of why the row
  looked like a widget rather than part of the page.
- The stage card is dark glass (matching `.panel` in the palm section), not
  the previous flat ivory box.

Verified at 1110×700, 1280×720 and 1440×900: 0 horizontal overflow, labels
clear the stage floor by 105–170px, all seven stages reachable in order
01→07 with the fill and comet tracking, hover preview reverts to the
scroll-driven stage on mouseleave.

**`.pin4` is `display:none` below 1100px** — none of the above affects the
mobile fallback, which is untouched.

### The Journey photograph (August 20)

`images/Journey image.png` (1774x887, desktop) and
`images/Journey image mobile.png` (1254x1254, mobile). Applied as CSS
`background-image` per the working constraints — never an `<img>` with a
filter.

**Desktop and mobile use different `background-size`, and that is the whole
point.** Desktop is `cover` on `.stage4`. Mobile is **`100% auto`** — a band,
not a cover — because a 1:1 image cover-ed into a 390x1169 column renders
1169x1169 and shows only its centre 390px, which is a sliver of the stone
slab; and that slice is bright enough that the quiet `.jm-label` needed alpha
0.935 to clear AA, by which point the photograph was a black smudge carrying
no image at all. `100% auto` shows the full square uncropped in the top 100vw
and then hands over to solid ground.

**The mobile veil colour is `--mineral` (23,20,18), not the desktop veil's
darker (16,13,11).** Below the band the mobile gradient sits at alpha 1, so
the veil colour *is* the section's ground for the lower two thirds — at
16,13,11 that would paint #100D0B against neighbouring sections' #171412, a
visible seam.

**The scrim stops are measured, not eyeballed.** They sit on the bands the
content actually occupies, so the veil opens where nothing is set and closes
over every band that carries type:

| | desktop (1440x900) | mobile (390x844, section 1169px) |
|---|---|---|
| kicker | 8.5 – 10.2% | 12.7 – 14.0% |
| headline | 13.3 – 20.8% | 15.4 – 21.9% |
| card | 26.2 – 46.0% | — |
| medallions | 60.1 – 68.2% | — |
| labels / list | to 81.2% | 28.4 – 88.4% |

**Verified by decoding the actual PNGs and compositing the exact scrim over
them** (`scratchpad/scrim-solve.js`, `scrim-mobile.js` — plain zlib, no image
library). Every band carrying live text clears WCAG AA against the *brightest*
pixel it covers: desktop kicker 4.84, headline 9.05, active/done titles
13.7/14.3, active/done subs 7.86; mobile kicker 4.73, headline 12.85, labels
5.96/4.68, text 6.53.

> `.j-sub` in its **upcoming** state (#5F5A52) sits at 2.45 and cannot reach
> AA at any alpha. It measured **2.64 on the old flat background**, so this is
> the pre-existing "recedes by design" state, not a regression the photo
> introduced. Do not fix it by lightening the colour — the whole point of that
> state is that unreached stages are quiet.

`background-color: var(--mineral)` is set on both as the fallback: if a file
is ever missing, the section paints its original ground and reads exactly as
it did before.

**Two open risks, both flagged to the user and neither yet acted on:**
1. **The filenames contain spaces.** CSS references them `%20`-encoded, which
   is correct, but hyphenated names would be more robust across hosts.
2. **They are 2.38MB and 2.15MB PNGs** — very heavy for a background. These
   are photographs and belong in JPEG or WebP. No image tooling is available
   in this environment (the `convert` on PATH is the Windows disk utility, not
   ImageMagick), so the conversion has to happen elsewhere.

> **Tip for eye-checking this without a browser:** the Browser pane serves
> local files as `data:` URLs, so it never loads the background image at all.
> `scratchpad/render-composite.js` decodes the PNG, applies the exact haze and
> veil, and writes the composite out as a PNG that can simply be read — which
> is how the mobile "black smudge" problem was caught.

---

## Quest map section rebuilt + Ecosystem cycle sped up (August 20)

`app.html` only. **All quest copy is verbatim** — the six names, status
labels, route labels, descriptions and distances are untouched, and so is
the header ("One journey ends. / Another begins.").

### The section this refers to
It is **Section 5, `<section id="quests">`** — the six next-quest cards.
Not `.quest-map-outer`, the scroll-driven SVG route above it, which was not
changed. Both are called "the quest map"; the cards are the one with the
photograph.

- **`images/Quest map.png`** (1716x917) as a `background-image` on
  `.quest-map-section`. The photograph already carries the glowing waypoint
  route, so nothing in CSS or SVG draws one.
- **`--qm-bg` is a custom property, and that is load-bearing.**
  `html[data-theme="light"] .s-dark` sets the `background` **shorthand**,
  which resets `background-image` to none — so in light theme the photo
  would vanish. Custom properties are not touched by the shorthand, so the
  light-theme override restores the whole stack with `background-image:
  var(--qm-bg)` instead of duplicating it. The section stays dark in light
  theme, the same way the Living Ecosystem does.
- **The veil stops are measured against the real photo**, by decoding the
  PNG and compositing (`scratchpad/quest-check.js`). The body copy's ink
  runs to x 51.6% of the section, and an earlier ramp (0.20 by 54%) left it
  at **4.46:1** — a hair under AA — because the sunlit ridge sits right
  there. Holding the horizontal veil to 0.68 at 34% and 0.22 at 60% takes it
  to **5.71** while leaving the right-hand half open for the route to read
  through. Final: kicker 6.44, headline 16.28, gold headline em 6.07, body
  5.71 — all pass.
- **Cards are dark glass on a two-column grid**: a gutter holding the icon
  medallion on row 1 only, and the content column for everything else.
  `grid-template-rows: auto auto auto 1fr auto` puts the `1fr` on the
  description — **that is what pushes the distance to the card's floor** so
  all six distances align across a row however unevenly the descriptions
  wrap. Verified aligned in both rows at 1440.
- **Each card gained a `.qc-icon`** — temple, mountains, cliffs, cathedral,
  torii, acacia — in the site's existing 24-unit line style.
- **The hover animation is unchanged**: `.quest-card::before` still scales
  its gold rule in from the left, and the active card still holds it open.
  Verified: non-active bar at `scaleX(0)`, active at `scaleX(1)`, hover rule
  intact. The `#questsGrid` stagger observer still finds all six cards.
- Below 600px the icon moves **above** the content rather than beside it —
  the 70px medallion gutter is too much of a 320px card.

### Living Ecosystem auto-cycle is 30% faster
`CYCLE_MS` 4000 → **2800**. The progress bar reads from the same constant,
so bar and advance stay in step automatically. Verified live: the bar's
inline transition is `width 2800ms linear`.

### Not caused by this work
`app.html`'s ~11px horizontal overflow at 430–495px is **pre-existing** and
documented above. Re-confirmed after this change: **zero** overflowing
elements come from `#quests`; the offenders are the nav and an SVG
elsewhere on the page.

---

## Sanctuary content rules — these are firm
The Sanctuary is **planned, not operational**. Never imply otherwise.
- Never use: "Book now", "Now open", "Open for bookings", "Available now", "Reserve your room", "Live in Phuket".
- Use: "Coming to Phuket in 2027", "Pilot programme", "Planned for 2027", "Join the early access list", "Expressions of interest".
- Do not invent a confirmed property, exact facilities, prices, or dates beyond the planned Phuket 2027 pilot.
- The seven day programme is **rolling** — no fixed cohort start date. People arrive and join the rhythm already in motion.
- The "average day" timings are illustrative, not a published timetable. The page states this.

---

## Working constraints
- Use `background-image` CSS for photo backgrounds — never `<img>` tags with filter overlays.
- Use full device mockup PNGs (iPhone frame baked in), not raw screenshot PNGs.
- The "Living Ecosystem" and "Quest 01" sections on `app.html` are working — do not touch them.
- `index.html` is the visual quality benchmark. Do not modify `index.html` or `app.html` without being asked.
- Confirm which file is being edited before making any change.
- Verify in the browser before claiming something works. Note that when the Browser pane is hidden the page reports `visibilityState: "hidden"`, which freezes `requestAnimationFrame` and IntersectionObserver — so scroll animations and all 3D silently never run and cannot be verified. Ask for the pane to be displayed, or drive frames manually with a temporary harness.

## Trust & legal layer (August 18) — seven new pages

`privacy.html` · `health-data.html` · `terms.html` · `cookies.html` ·
`token-disclaimer.html` · `accessibility.html` · `contact.html`

Plus **two new shared files that must be uploaded to GitHub**: `css/trust.css` and
`js/trust.js`. Unlike the marketing pages these seven do **not** inline their CSS —
one document design across seven documents is the one case where a shared sheet is
right, and it is one upload instead of seven diffs.

### Register
A dark cover plate, then ivory pages set for reading — an annual report, not a
cinematic page. **No `cine.js`, no pinned sections, no scroll scrubbing, no canvas
anywhere in the trust layer.** Do not add scroll choreography to these pages.

### Load-bearing decisions — do not undo
1. **Fail-visible by default.** Every hidden reveal start-state is gated on `html.js`,
   a class added by the inline `<head>` script. The resting state of `trust.css` is
   fully visible; animation is opted into. The marketing pages do the opposite and lean
   on `<noscript>`, which covers "JS disabled" but **not** "`trust.js` 404'd". The head
   script also arms a 2.5s failsafe that drops the class if `trust.js` never sets
   `data-trust="ready"`. Verified in all three modes: normal (22/22 reveals, 0 invisible),
   script missing (failsafe fires, 26,121 characters readable), no JS at all (0 invisible).
   **A legal page must never be able to render as invisible type.**
2. **The measure is 34em (~75 characters), set by counting.** 40em gave **88 characters**
   per line, because Frank Ruhl Libre at 16.5px averages ~7.27px/char. The mobile rule
   was worse — 44em ≈ 97 characters, wider than desktop.
3. **`.doc-grid` is capped at `rail + gap + measure` and centred**, not stretched to
   1360px. Stretched, the column stayed 640px while the container grew, leaving a 229px
   empty gutter at 1440 and 379px at 1920.
4. **The contents rail is scroll-position driven, not IntersectionObserver.** A legal
   section is often three viewports tall, so it is never wholly intersecting and an
   observer-driven rail goes blank mid-section.
5. **`.cx-i.here` is an opaque `#251F1D`, not a tint.** As `rgba(196,138,90,0.07)` it
   composited over `.cx-grid`'s own `rgba(247,244,238,0.1)` gap colour and dropped the
   body text to 3.5:1.

### Verified
271 text styles across all 13 pages at **0 contrast failures** (WCAG AA, alpha-composited
backgrounds). 49 responsive checks (7 pages × 375/390/430/768/1024/1440/1920): **0
horizontal overflow, 0 escaping elements, 10px minimum type**. Every internal link,
anchor and asset resolves. Scroll-spy 5/5, theme toggle, drawer + Escape, accordions,
print-expands-all-details, and deep-link-into-collapsed-accordion all pass.

**The eye pass is partial.** The Browser pane's compositor only painted a fraction of
the viewport for most captures. The cover and the document body at desktop were seen and
are right; the rest is verified numerically.

### Content rules
- Every unresolved legal input is a **visible** `<span class="tbc">` marker, not a
  silent omission, and is tracked in `CONTENT_REQUIRED.md`. A policy that quietly omits
  its own contact address is worse than one that admits it is not settled.
- **No entity name, address, jurisdiction, retention period, processor, analytics
  vendor or certification was invented.**
- `cookies.html` states as fact that the site sets **no cookies and runs no analytics**
  — verified against the source. **If analytics are ever added, `cookies.html` §04/§07
  and `privacy.html` §09 must be updated before the script goes live.**

### Footer — now identical on all 13 pages
Four columns: brand + **Explore / Resources / Trust**. The old Legal column of dead
`<span>`s and the "Follow Us" column of dead `#` links are gone. Footer label, tagline,
toggle and bottom-line colours were raised for contrast **on all 13 pages** so the shared
component stays identical (`#5f5a52`→`#8f887d`, `#4a4540`→`#8a8377`, `#7a746a`→`#9a9285`).

### Watch out
`Get-Content -Raw` + `Set-Content` in Windows PowerShell 5.1 **double-encoded this
project's UTF-8 box-drawing characters into mojibake.** Use the Edit tool, or
`[System.IO.File]::ReadAllBytes` + explicit `UTF8.GetString`/`GetBytes`. Never round-trip
these files through `Get-Content`/`Set-Content`.

---

## One-way + auto-release REVERTED (August 20) — they broke every animation

**Symptom reported:** "all animations complete instantly", "the palm logo
animation completes instantly", "the transition between sections with
animations is still broken".

**Cause: auto-release collapsed the document under the reader.**
`maybeUnpin()` trimmed a finished pin's wrapper to one viewport height. On
`index.html` at a 900px viewport that is:

| pin | before | after release | page shrinks by |
|---|---|---|---|
| `pinContainer` (hero) | 3600px | 900px | **2700px** |
| `.pin` (palm logo) | 4644px | 900px | **3744px** |

Scroll position does **not** move when the document shortens. So the instant
the hero finished, the reader was silently teleported 2700px further down —
landing ~72% of the way into the palm-logo pin, which therefore appeared to
"complete instantly". That section then finished, collapsed by another
3744px, and threw the reader through the next one. **It cascaded through
every pinned section on the page**, which is why *all* animations appeared
to complete at once rather than just one.

The one-way `peak` latch then made it unrecoverable: any section skipped by
a collapse latched at progress 1 and could never play again on that load.

**Both were removed outright on 20 August.** `js/cine.js` no longer contains
`maybeUnpin`, `peak`, `unpinned`, `stickyEl` or `findSticky`. Tracks are
bidirectional again and never touch their element's height. The
`release:false` opt-out added to `app.html`'s hero the same week is gone too
— removing auto-release fixed that section's stuck-frame bug globally, since
that bug was the *same* mechanism (a two-sticky-stage pin whose first stage
was the one being unpinned).

> **Do not reintroduce either behaviour.** If a pin genuinely needs to stop
> holding the viewport, give it less height in CSS — never mutate its height
> at runtime while the reader is inside it.

**Verified** with a node harness driving the real `js/cine.js` against the
real 4644px pin geometry, with `reduced` patched to false so pacing actually
runs (`scratchpad/cine-harness.js`): height values ever written = *none*;
progress reaches 0.96 at the bottom and returns to 0.04 on scroll-up
(bidirectional); a full-aggression flick from 0 to 1 is **0.025 after one
frame** and takes **3.6s** to converge, so it cannot flash through.

> **Testing note:** the Browser pane renders local files as `data:` URLs, so
> **`js/cine.js` never loads there** (`window.DAO` is undefined) and every
> page silently falls back to direct scroll mapping. Pane testing therefore
> cannot exercise cine.js at all. Drive it in node instead. The pane also
> reports `prefers-reduced-motion: reduce`, which bypasses pacing even when
> the file does load.

---

## Cinematic scroll made one-way + auto-release (August 19) — SUPERSEDED, see above

`js/cine.js` only — no page HTML touched, no per-call-site changes needed. Applies
automatically to all 13 tracked sections sitewide (the table under "Where it is
applied" above).

**Two behaviors, both now the default for every `Track`:**
1. **One-way.** Each track keeps `this.peak`, the highest true scroll progress it
   has ever seen, and all goal/state computation now reads from `peak` instead of
   the instantaneous scroll value. Scrolling back up no longer replays a section in
   reverse — it holds exactly at the furthest frame reached. This generalises the
   pattern the hero route's `maxProgress` latch already used (see "Left alone
   deliberately" below the Principle section notes) into the engine itself, so
   every pinned section behaves the same way, not just that one.
2. **Auto-release.** Once a track's displayed state reaches its last stop and the
   real scroll has actually caught up (`peak >= 0.999`), `Track.maybeUnpin()` finds
   the section's `position:sticky` stage (auto-detected by scanning for computed
   `position:sticky` inside the tracked element — every pin wrapper site-wide
   follows the same outer-wrapper-holds-one-sticky-stage shape, so no per-page
   wiring was needed) and switches it to `position:relative`, then trims the outer
   wrapper's remaining height down to the current scroll position. The section
   stops holding the viewport the moment its story finishes, and — because it's
   one-way — it never re-pins on a later pass.

**One real bug worth remembering if this is touched again:** under
`prefers-reduced-motion: reduce` (or `o.off`), pacing is bypassed and `tick()`
returns before touching `this.value`/`goalIdx`, so the completion check inside
`maybeUnpin()` must read `this.get()`/`this.state()` (the authoritative displayed
value), never the internal pacing fields — those are simply never updated in that
branch. A first pass that checked `this.value` silently never unpinned anything
under reduced motion. A second bug in the same pass: `this.rawV` was being
assigned the *unclamped* instantaneous scroll before the peak latch was applied,
so `get()` under reduced motion (which reads `rawV` directly, bypassing `value`)
still reversed on scroll-up despite `peak` itself being correct. Fixed by
assigning `this.rawV = this.peak` — `rawV` must always be the peak-clamped value,
never the raw instantaneous one. **Note the Browser pane itself reports
`prefers-reduced-motion: reduce`**, so this exact bug is invisible unless you
either test with reduced motion forced off or (as done here) drive `tick()`
directly via a temporary debug export and inspect `get()`/`peak`/`unpinned` by
hand — screenshots and rAF are unavailable while the pane is hidden regardless.

**Verified (numerically, via a temporary `DAO.cine._debugTick()` export removed
after testing):** on index.html's `pin3` (sticky, 4 states) — scrolling to 70%
then back to 10% holds at state 2 / 0.6997, does not reverse; scrolling to 100%
reaches state 3, `unpinned:true`, stage computed position `relative`; scrolling
back up again afterward stays frozen at state 3. `pinContainer` (guided) confirmed
the same shape. Resize after completion leaves the unpinned/frozen state
untouched. Zero console errors on all four pages after the change. **Not yet
judged by eye** — same Browser-pane-hidden limitation as everything else in this
project; the visual release (does the shrink read as a jump anywhere) has not
been watched happen.

---

## Investor page: responsive fix + resource-request UX (August 19)

### The clipping bug was the divider overlay, and it was on two pages
**Root cause.** `.divider` declares `background: transparent`, but every divider
also carries a `.bg-*` class, and `.bg-ivory`/`.bg-stone`/… sit later in the same
sheet at the same specificity (0,1,0) — so they win. The divider therefore painted
an **opaque band** over the tail of the section it overlays via
`margin-top: calc(-1 * var(--divider-h))`.

The overlap is `(14vh + 26px) − 16vh` = **`26 − 2vh` pixels**, so it is present at
every viewport and gets *worse as the window gets shorter*: 13px at 640px tall,
10px at 812px, 8px at 900px, 4px at 1080px. That is why it read as a
"certain laptop widths" bug.

Measured before the fix on `investors.html` at 375×812: **18 of 18 dividers
opaque**, and **16 sections had closing text painted over** — mostly the bottom
few pixels of the last line, but three whole lines were completely invisible
(a 25px line, a 22px line and a 16px line). The "Status · $DVT" disclosure was one
of the sliced ones.

**Fix:** add the `.divider.bg-*{background:transparent}` override that
`index.html` (line ~487), `sanctuary.html` and `web3.html` have carried since
17 August. `investors.html` and `about.html` were built afterwards and copied the
overlay geometry **without** it. `app.html` never needed it.

> **If a new page is ever built from one of these templates, this override must
> come with the `margin-top: calc(-1 * var(--divider-h))`.** They are one
> mechanism. The geometry without the override is a text-eating bug, and it is
> invisible to a layout audit — `overflow` is `visible` everywhere, `scrollHeight
> === clientHeight`, nothing escapes the viewport. Only `elementFromPoint` or an
> eye pass finds it.

Re-verified after: 0 opaque dividers on both pages, 0 text covered, all 18
investor dividers still have a correctly contrasting mark against what they now
sit on, minimum clearance 62px (floor is 49px).

### Two more real clipping defects, both systemic
1. **`.ln` masked only its descender end — fixed on all five pages that use it.**
   Cormorant's glyph box is ~1.25em but the display sizes set `line-height` near
   1.05, so the half-leading is negative and the font box pokes ~0.095em out of the
   line box at *both* ends. Only `padding-bottom: 0.14em` existed, so every masked
   headline's **first line** could lose the top of a tall ascender — 4px at 375
   rising to 10px at 1920, because it scales with font-size. Now symmetric:
   `padding-top: 0.14em; margin-top: -0.14em` as well. **Keep the two paddings
   equal.** Applied to `investors.html`, `index.html`, `sanctuary.html`,
   `web3.html` and `about.html`; **`app.html` does not use `.ln` at all** and was
   not touched. Verified: **154 line-masks across the five pages, 0 clipped** at
   both 375 and 1440 (every page had clipping before).
2. **`<caption>` inherits the table's box.** `.pm` is `min-width: 860px` inside a
   `.pm-scroll` overflow-x scroller, so below ~1000px the 146-character caption
   was laid out 860px wide in a 743px window — you had to scroll sideways to
   finish reading a paragraph. It is now a `<p class="pm-cap">` sibling *before*
   the scroller, with `aria-describedby` preserving the association.

### Resources — two tiers of CTA
- **Level 2, per card:** every `file: null` card gets a `Request this resource`
  button (gold hairline pill). Cards with a `file` become downloads and
  deliberately get **no** request button, and drop out of the panel's select
  automatically — both branches render from the one `DOCS` config.
- **Level 1, per section:** one filled warm-white `Request Investor Information`
  pill centred beneath the grid. The closing section's contact line and a third
  entry point in the final `.btn-row` open the same panel.
- **`#reqPanel`** is the only interactive surface on the page: resource (preselected
  from the card you clicked), name, email, company, message. Focus trap, Escape,
  focus restore, body scroll lock, `#request` deep link.

**`INVESTOR_CONTACT` is the single source of truth** — one constant at the top of
the script, **now set to `info@daoasis.xyz`** (supplied 19 August). The panel, the
note under the form, the done-state and the closing line all read from it. Set it
back to `null` and the whole page reverts to composing the request for **Copy
request** with a `<span class="tbc">` wherever the address would print — no other
edit needed. **Nothing is ever reported as sent that was not sent**: the done-state
says the email client "should have opened" and offers the text to copy. There is
still no form backend anywhere in this project. `.tbc` and `.sr-only` were added to
investors.html because it does not load `css/trust.css`.

**`contact.html` was brought into line in the same pass.** `info@daoasis.xyz` is
**the one address for every route** — general, investors, partnerships, privacy,
contributors and careers all resolve to it. What changed there:
- All five `tbc` address markers became `mailto:` links; route 06 (careers) gained
  an address so it is no longer the only route without one.
- The "No contact addresses are published yet" card became **"One address, not
  six"** (`chip-live`), explaining that a small team would rather publish one
  address that is read than six that are not, and asking for the route in the
  subject line.
- The "There is no contact form" card became **"Nothing on this website posts to a
  server"** — because the investor request panel *is* form-shaped, and a page whose
  whole job is honesty about this must not be read as denying it exists. It now
  says the panel hands the request to your own email client, which is why it says
  the client "should have opened" rather than claiming receipt.
- The closing note and the hero's "Investor materials" row were rewritten; the
  latter now points at `investors.html#request`.

The only `tbc` left on the page is the **response-time commitment**, which is
genuinely still unresolved.

Verified: 10 width×height combinations (320×640 → 1920×1080) with **0 horizontal
scroll, 0 clipped text, 0 escaping elements, 0 sub-10px type, 0 trapped
paragraphs, 0 opaque dividers**. Panel: card fits on X at every width, shell
scrolls (never the card), submit reachable at 640px tall. Flow tested end to end —
per-card open preselects that document, main CTA preselects the pack, validation,
compose, copy, Escape, scrim, focus trap both directions, focus restore.
**Judged by eye** at mobile (375) and at the resources grid; see the note below on
the pane's partial compositing at large viewports.

### The pane composites only part of a large viewport
New constraint worth knowing: with the Browser pane **displayed**, screenshots at
375–442px wide paint the full viewport, but at 1024×768 only ~350×260 painted and
at 1440×900 only ~245×155. Scaling the page into the painted region with a
`transform` does not help — the compositor clips before the transform. To eye-pass
a desktop layout, **drive the viewport at ≤440px and accept mobile composition, or
read geometry numerically.** The `_shot`/iframe-scaling tricks tried here did not
work.

---

## `css/trust.css` — card and route links were rendering browser-blue (August 19)

The trust layer's body-link rule is `.doc a:not(.btn):not(.xl-i):not(.cx-i)`, and
**`contact.html` is the only trust page with no element carrying `class="doc"`** —
its wrapper is `.doc-wrap` / `#doc`. So its links fell through to the UA default and
rendered as **blue underlined text on an ivory legal page**. Thirteen in total across
three pages:

- `contact.html` — route 04's "Privacy Policy" and "health data" (`.path-b`), and the
  five "Where to go instead" card links (`.card-m-v`)
- `privacy.html` — "Cookie Policy", and `health-data.html` — three cross-references
  (those pages *do* have `.doc`, but these links sit outside it, in `.card-b`)

Fixed by adding `.path-b a, .card-b a, .card-m-v a { … }` next to `.ct-s-b a`, with
the same colour the `.doc` rule already gives, so nothing looks different where both
apply. **One more upload of `css/trust.css`.**

> Watch for this if a new trust page is added: `class="doc"` on the document wrapper
> is what switches body-link styling on. `contact.html` never had it.

Re-verified after: **1,096 text elements across all seven trust pages — 0 blue
links, 0 contrast failures** (WCAG AA, alpha-composited backgrounds). Fail-visible
mode still intact on `contact.html` (**0 invisible elements, 6,218 readable
characters** with `html.js` dropped), and 0 horizontal scroll / 0 escaping elements /
0 sub-10px type at 320, 375, 390, 414, 768, 1024, 1440 and 1920.

> **Audit note:** a contrast checker that reads `backgroundColor` without compositing
> alpha will report false failures here. `.pt` is `rgba(43,38,35,0.035)` over ivory;
> naively parsed as `rgb(43,38,35)` it makes a passing 4.9:1 link look like 2.68:1.
> Composite the whole stack down to the first opaque layer.

### The address on the other trust pages
`info@daoasis.xyz` also replaced the `tbc` contact markers on `privacy.html`
(privacy enquiries), `accessibility.html` (accessibility reports), `cookies.html`
and `terms.html` §24 — each with a subject-line hint, since one inbox serves every
route. `terms.html` now also states that a notice sent to that address is treated as
received, because it is the only route for formal notice until the legal entity and
registered address exist.

**Every remaining `tbc` on the site is a genuine legal or business unknown** — legal
entity, registered address, governing law, jurisdiction, liability cap, minimum age,
retention schedule, processor list, certification status, hosting locations,
technical architecture, consent mechanism, the accessibility audit and the response
time commitment. **No contact address is unresolved any more.**

---

## The compounding-journey thread (August 19)

The core idea, stated once so it does not have to be pasted everywhere:

> Every positive action moves you forward. Steps **and** sleep **and** hydration
> **and** breathing **and** learning all feed the *same* journey, and together
> they compound. Nothing you do well is wasted.

Where it stands after the crawl:

| Page | Before | Action |
|---|---|---|
| `investors.html` | **Strongest** — "Six inputs → One output → The journey → Participation → DRC" | Left alone; it is the reference |
| `app.html` | **Strongest** — "Six habits. One connected world.", the habit-boost grid, "your steps are the engine and every other habit makes you faster" | Left alone (also protected by the working-constraints rule) |
| `index.html` | **Weak** — the metrics were framed as a *dashboard* ("rolled into one ring… feel on top of your day"), never as inputs to one journey | 4 copy edits |
| `web3.html` | Partial — named the verbs but not that they converge | 1 copy edit (`.part-foot`) |
| `about.html` | Weak — listed the layers, not the compounding | 1 copy edit |
| `sanctuary.html` | Missing — no link back to the daily practice | 1 clause, in Transformation |

**Copy only. No layout, structure or CSS was changed for this.** Each page says it
in its own register rather than repeating one sentence — that was the explicit
brief. Do not add a seventh restatement; the thread is carried, and more would
read as a slogan.

---

## Sanctuary rebuilt section by section — August 21

`sanctuary.html` only. Nothing on index / app / web3 / investors / about or
the trust layer was touched. **Judged by eye this time**, at 1920x1080,
1440x900, 1280x800, 1366x625, 1024x768, 768x1024, 430x932 and 375x667 —
see "How the 3D was finally seen" below for how that became possible.

### 1. One type ladder for the whole page
The page carried nine unrelated Cormorant sizes. At 1280 a section headline
was 69px while the day-verb beneath it was **71.7px** — an item outranking
the headline it belonged to — and the same editorial role ran 32 / 43.5 /
46 / 56 in four different sections. Every Cormorant size now resolves to one
of five `--t-*` steps declared at the top of the sheet, and every running
size to one of five more.

| token | role | 1440 | 375 |
|---|---|---|---|
| `--t-hero` | hero + bridge statements | 95 | 42 |
| `--t-display` | **every** section headline | 61.9 | 33 |
| `--t-accent` | the italic line continuing a headline | 50 | 27 |
| `--t-lead` | item names, verbs, day titles | 41.8 | 26 |
| `--t-sub` | list statements, index | 30 | 21 |
| body / meta / note / micro | 16.5 / 14 / 13.5 / 10.5 at every width |

- `--t-display`, `--t-accent` and `--t-lead` clamp against **viewport height
  as well as width** (`min(4.3vw, 8.2vh)`). Pinned stages sized only off
  width overflow their own `overflow:hidden` on a short laptop, which is
  literally how the Four Foundations footnote came to be sliced in half.
- `.three-copy .display` was the last headline off the ladder (its own
  `clamp(30px,3.6vw,54px)`), which is most of why the two 3D sections read
  as a different document from the rest of the page.
- The mobile block had its own `.seven-verb { font-size: 34px }`, which
  reproduced the outranking bug on handsets. Gone.

### 2. Divider system v2 — the spacing was never balanced
Driven entirely by `--dv-*` tokens now. The identity that matters:

> `tail − drop − mark  ==  drop + head`

so the palm mark lands optically centred in the gap. Measured at 1440x900:
**126px above / 126px below** on every standard divider (was 68 above and
137 below at 1280x720, drifting to 114/167 at 1080 tall — the mark read as
belonging to the section it was about to introduce, not the one it closed).

**Two hard collisions existed and were invisible to a layout audit.**
`#theSanctuary` and `.day-outer` both set `padding-bottom: 0`, so the mark
landed **40px inside their last line of type**. Nothing overflows, nothing
escapes the viewport, `scrollHeight === clientHeight`; only measuring the
mark against the last text box finds it.

Three variants, and the rule for choosing:
- `.divider` — next block is a normal padded section.
- `.divider.to-bleed` — next block is a photograph or a canvas and supplies
  no head padding, so the drop grows to keep the mark centred (90/90).
- `.divider.solo` — the block **above** is a pinned 100vh stage. An overlay
  divider there draws a rule straight across the stage's last live frame,
  which is exactly what the reported screenshot showed. Solo takes real flow
  height and paints its own band in the pin's ground colour — this is the
  one case where the `.bg-*` classes are live again.

`.sect:has(+ .divider)` grants the tail and `.divider:not(.solo) + .sect`
takes the head back, so new sections inherit the geometry automatically. If
`:has()` were ever unsupported the divider sits tighter — it does not
collide. **Every ad-hoc inline `padding` on a divider is gone**; they were
what made the spacing look arbitrary.

### 3. Pinned sections no longer clip themselves
`.found-sticky` needed **920px inside a 720px stage** at 1280x720 and lost
the difference to `overflow:hidden`. Fixed three ways together:
- every padding, gap and row inside a pin is `clamp()`ed on `vh`;
- `.found-foot` moved **out** of the pin into its own `.found-close` beat,
  and `.seven-rolling` joined the closing ivory section. Both are summaries,
  not items — they earn a beat after the stage scrolls away;
- verified with all four rows expanded (the worst case): **153px of slack at
  1440x900, 86px at 1280x720, 50px at 1366x625**.

### 4. Section 2 was genuinely squeezed
Two equal 557px columns holding one two-line headline and two short
paragraphs gave the section **218px of content inside 350px of padding** —
the first thing after a 620vh hero. Now an asymmetric spread (0.92fr / 1fr),
the opening sentence promoted to a Cormorant lede at `--t-sub`, and a larger
head because of what it follows.

### 5. Four Foundations — clearer, not just fixed
The reader could previously see one lit row and three at `opacity: 0.3`,
which is barely legible green-on-green — three quarters of a section whose
whole claim is that the four are **one system**. Weight now carries state
(0.4 → `.done` 0.66 → `.active` 1.0), the live row gets a soft wash and a
scaled gold dot, and the spine is measured off the active row's own bottom
edge rather than a computed height. Verified stepping 01→02→03→04 with the
spine at 90/180/271/361px.

---

## The two 3D scenes rebuilt — August 21

Both now share `TROPIC`, a small vocabulary of sky dome, still water, sala,
palm, island, karst, timber palette and planar reflection. Before it existed
the page's two WebGL sections had nothing in common but a canvas element,
which is how a page ends up looking like two documents.

### 3D one: "One Place, All Day" — a sala on still water
What was there was a grey massing model — plinth, deck, two blank walls, a
flat slab roof, six cylinders, **no sky at all** — floating in the clear
colour. Replaced with a timber sala on posts over water, palms on real
shorelines, limestone karsts on the horizon and a gradient sky dome, with
the sun crossing dawn → night driving every colour in the frame.

### 3D two: "The seven day journey" — the lantern walk
The concept was kept: you travel the week in first person and the route
turns out to have been closed. The **language** was the problem — a glowing
gold tube through a black starfield with torus gates you flew through was a
racing line in deep space. It is now a timber boardwalk a hand's breadth
above still water at blue hour, walked at eye height, with seven lanterns on
pilings (one per day) and marker lamps between them, circling **the same
sala from 3D one on its island** — which is what makes the reveal land: you
were never on a track, you were circling the Sanctuary the whole time.

### Nine things that were only findable by looking — do not reintroduce
1. **The sky was clipped by the camera's far plane.** The dome sits at
   radius 600 and `stage3D`'s camera was `far: 400`, so a crisp circular arc
   was drawn across the sky. It looked like a deliberate vignette and was
   the frustum. Far is now **1600**; any geometry added here must stay
   inside it.
2. **Ripple direction matters more than ripple strength.** Three sines all
   running roughly the same way made the sea read as **corduroy**. The wave
   set now spans six angles including near-perpendicular pairs.
3. **Tile count is the difference between glitter and blotches.** At 26
   tiles the sun broke into white amoebas; at 64 it aliased into a visible
   grid. 300 with mipmaps and full anisotropy is stable at every depth.
4. **A mirrored reflection needs its normals negated by hand.**
   `scale.y = -1` flips the normal matrix, so the sun lands on what were the
   undersides: at golden hour the real roof was a dark silhouette while its
   reflection was **brighter than the sky**. Pre-negate `normal.y` on the
   mirrored geometry and use `DoubleSide`.
   > The obvious alternative — own layer, own mirrored sun — **does not work
   > in r128**: a light's `layers` are tested against the CAMERA, not against
   > each mesh, so the second sun simply lit the whole scene twice.
5. **`MeshLambertMaterial` ignores `emissiveMap` in r128.** The boardwalk's
   visible tone at blue hour is almost entirely its emissive floor
   (measured: 43 of 47 red), so board joints never appeared. Phong honours
   it — but the joints are now vertex colour anyway, see next.
6. **A 32×1 stripe texture renders as a flat field.** Its mip chain reduces
   to 1×1 within five levels, so every sample past the first mip returns the
   average of the whole strip. Measured flat to within 1/255 across the
   entire near deck. Board joints are now **vertex colour** — in the
   geometry, where nothing can filter them away.
7. **A swept ribbon's winding depends on which way the curve runs.**
   `computeVertexNormals()` gave the boardwalk a top face pointing DOWN, so
   it was back-face culled from a camera standing on it and the ride showed
   nothing underfoot. Normals are set explicitly (+Y on the deck ring).
8. **Aim the walking camera at a fixed ARC DISTANCE along the path** (30
   units), not a fixed fraction of it and not down the tangent. A fraction
   changes meaning when the ring is resized; the pure tangent never turns,
   so the walk left frame and the ride became a dark wedge.
9. **Linear fog, not exponential, on the loop.** The ride must show ~30
   units of boardwalk while hiding the far side of the ring 100 units away —
   or you see it is a loop before the reveal says so. No exponential density
   separates those two distances. The far plane is also what the lift opens.

### Other decisions worth keeping
- **Palms stand on land.** An early pass had six rooted in open water in
  front of a full-width sandbar — palms growing out of the sea, and a bar
  that met the sky in one hard line across the frame and read as a hedge.
- **Islands shelve.** A straight cylinder's wall catches the sun broadside
  and reads as a slice of cake sitting on the sea; the top ring is inset.
- **Marker lamps on the walk are ALWAYS lit.** Making them light as you
  reach them was wrong twice: you walk forwards, so everything reached is
  behind you, and the ride showed a receding line of dead lamps. They are
  path lighting; the seven day lanterns are the milestones, and leaving them
  as the only thing that changes is what makes reaching one register.
- **An unreached day lantern is dim WARM, not cool blue** — in a line of
  warm lamps a blue box reads as a broken light.
- **Lanterns stand in the water on pilings, clear of the walking line.** On
  the deck edge a 4m post filled the middle of the frame every time.
- **The lift clears the HAZE; it does not turn the lights on.** Tripling the
  ambient at the reveal brought the outer islands up as bright green lily
  pads and lost the ring among them.
- **Mobile is a different composition, not the desktop one shrunk.**
  `stage3D` widens the vertical fov as the frame narrows (a portrait
  viewport is a narrower frame, not a smaller one — at aspect 0.46 the
  horizontal field is otherwise less than a third of desktop), the pavilion
  camera pulls back, and the walk lifts to just above head height.
- **`.pav-veil` is measured, not decorative.** The pavilion runs from a near
  black dawn to a bright midday sky under white copy, so a flat scrim is
  either invisible at 05:00 or opaque at noon. It is directional on desktop
  (left column + bottom readout only) and vertical on mobile. An earlier
  mobile ramp protected the type perfectly and turned three in the afternoon
  into dusk.

### How the 3D was finally seen — keep this
The Browser pane composites only a fraction of a large viewport (~490×310 of
1440×900), so a desktop 3D scene cannot be screenshotted. `stage3D` now
carries a **test hook, off by default**: set `localStorage['daoasis-shot']`
to `'1'` (or load with `?shot=1`) and each stage exposes
`window.__STAGES[canvasId](p)`, which renders one exact scroll value and
returns a PNG data URL. `preserveDrawingBuffer` is only enabled when the
flag is set, so it costs nothing in production. Posting those to a throwaway
local node receiver writes real PNGs that can simply be opened and looked
at. **This is how all nine problems above were found.** Every one of them
passed the numeric audit.

> Also worth remembering: `window.scrollTo` in a synchronous loop reads
> **stale** section state, because the `cine` callbacks run on rAF. Wait
> ~40 frames between the scroll and the assertion or the section will look
> frozen on its first state when it is fine.

### Verified
Zero console errors on a 156-position sweep of the full 33,931px document
and back. At 1920x1080, 1440x900, 1024x768, 768x1024, 430x932 and 375x667:
**0 clipped text, 0 horizontal overflow, 0 divider collisions**, and the
type ladder identical across every section at each width. Foundations steps
01→04 with the spine tracking each row; mobile keeps all four open.

---
## Next planned work
**`web3.html` is done — built, numerically verified and judged by eye** (August 14).
Layout audited with zero issues at 1920×1080, 1440×900, 1280×800, 1280×720, 768×1024,
430×932, 390×844 and 375×667; every scene screenshotted and tuned. A fresh load logs
exactly one console error, the site-wide missing favicon.

**`sanctuary.html` has now been judged by eye** (August 21) — dividers, type,
both 3D scenes, desktop and mobile. See the two August 21 sections above. As
predicted, the numbers had passed nine real problems clean.

**The hero plate-pass timing is the one part still not tuned by eye.** The
rest of the page has been; the hero sequence was left alone in that pass.

**Verifying animation needs the Browser pane displayed.** When it is hidden the page
reports `visibilityState: "hidden"`, which freezes `requestAnimationFrame` and
IntersectionObserver — screenshots time out and nothing animated runs. Two workarounds
that worked here: copy the page, patch its rAF loops to expose their frame functions on
`window`, and drive them by hand (canvas state can then be read back with `getImageData`);
and note that plain `scroll` listeners keep firing even when rAF does not. Also, the
pane's `resize_window` does **not** dispatch a `resize` event to the page — dispatch one
manually after resizing or every measurement is stale.

Then upload `index.html`, `app.html`, `sanctuary.html`, `web3.html`, `vercel.json`
**and `js/cine.js`** to GitHub to deploy. `js/cine.js` is new — if it is missed, every
page falls back to direct scroll mapping (today's pre-pacing behaviour) rather than
breaking, but the cinematic pacing simply will not be there.

---

## "A Day at the Sanctuary" — nine plates, and the pacing fixed (August 21)

`sanctuary.html` only, Section 6 (`#dayOuter`). Design, copy, typography and the
sticky concept are untouched — this is the same interaction given room to breathe.

### One photograph per time slot
Was four `--img-day-*` plates (morning/midday/afternoon/evening) shared across nine
entries; now nine, keyed by slot name (`wake` … `rest`). 07:00 keeps `img-01.jpg`.
The four old vars are gone; `data-media` on both the layers and the entries carries
the new keys, and `current` in the observer initialises to `wake`.

**Every plate is `background-size: cover` — nothing is stretched.** Eight of the nine
sources are portrait (0.56–0.75) and the frames are not: the desktop column is ~0.88
and the mobile band ~1.10 at 390x844 but **1.34 at 375x667**. So the crop is always
vertical, and `background-position` is the focal point, measured per photograph
against the frame the slot actually gets:

- **The mobile band is a different composition, not the desktop frame shrunk.**
  `move` and `integrate` need their own position inside the `max-width:900px` block —
  at the desktop value the mobile band cuts the head off one and the standing figures
  off the other. The rest hold at one value.
- `move` is 18% on desktop because the raised hands start at **6.7% of the source**
  (measured by scanning the decoded pixels, not guessed); at 30% they clipped.
- `learn` is 85% — the laptop lives in the bottom third of a 4000x6000 frame.
- Crops were judged by eye by drawing each one to a canvas at the real frame size and
  posting the PNG to a throwaway local receiver, the same trick the Journey photograph
  used. The Browser pane will not composite, so this is the only way to see them.

### Pacing — the section was flashing through nine stages in ~2400px
Each entry was ~264px tall (8vh padding + content), so a stage lasted about a third
of a viewport. `.day-entry` is now `min-height: 88vh` (68vh mobile) with its content
centred in the box, which gives **0.98 viewport of scroll per stage** — 882px at
1440x900, 706px at 1280x720. The entries are contiguous, so the handover is a 0.1vh
overlap (the observer band itself) and there is never a frame with nothing lit.

- **Content is centred in the box on purpose.** Top-aligned, the text would rise out
  of the frame while the box — and therefore the photograph — was still lit.
- `.day-list` gained a **24vh tail** (26vh mobile). Without it the sticky plate
  unpins while 21:00 is still the live stage. With it the plate releases 178–210px
  *after* the last title crosses the reading line, so the day finishes before the
  page moves on. The trailing gap now matches the gap between entries (458 vs 470px
  at 1280).
- The observer is unchanged: same `-45%/-45%` band, same class toggles. Nothing was
  converted to `cine`; this section has never been tracked and still is not.

### Descriptions
A `<p class="day-desc">` sits between `.day-title` and `.day-detail` on all nine —
under the subheading, above the tag row. `--t-body` at `rgba(247,244,238,0.62)` on
`--dark-surface` = **6.4:1**. Two lines at every desktop width, 2–3 on a handset.
No existing time, heading, tag, size or spacing value was changed.

### Verified
Nine layers resolve 200, nine `.day-desc`, exactly one entry in the observer band at
every stage midpoint with the right image and the right clock (replayed
deterministically — the pane was hidden, so the real observer is frozen). 0 horizontal
overflow sweeping the whole document at 1440x900; 0 at 1280x800, 1024x768, 390x844 and
375x667. 0 console errors. Divider below the section still clears the footnote by 80px.
**The live scroll has not been watched happen** — the pane would not display.

### Open risk
The eight new photographs total **15.1 MB** and all nine layers are painted into one
sticky container, so the browser fetches every one on approach. They want resizing to
about 1600px on the long edge and re-encoding (WebP or quality-80 JPEG) before this
ships; there is no image tooling in this environment to do it here.

---

## Investor Business Plan 2026 — built as a print document (August 21)

**Delivered:** `DAOasis Investor Ready Business Plan 2026.pdf` — 48 pages, A4, 6.5MB.
**Source:** originally built in this folder under `bp/`; moved out on 21 August 2026 to
`C:\Users\Lenovo x270\Desktop\DAOasis Business Plan 2026\`, a fully independent project
(it copied the 20 photographs it needs into its own `source-images/` and no longer reads
anything from this website folder). **This directory no longer contains the plan or its
build.** See that project's own `README.md` for build notes; only the findings that
generalise to the website itself are repeated below.

Built as HTML + CSS printed by headless Chrome rather than as a Word file, so it uses
the site's own palette, type ladder and idiom. Word was rejected because it reflows on
the recipient's machine and cannot hold full-bleed pages or a baseline grid — the brief
required a document that needs no formatting work on arrival.

### Four findings that apply to the website too

1. **An SVG `font-size` is viewBox units, not points** — already recorded for
   `investors.html`, and it bit again here. `bp/pages/dg.js` now exports a `U(pt)`
   converter so diagram type stays on the document's ladder by construction.
2. **A flex item with `min-height: 0` spills silently.** `flex: 1` + `min-height: 0`
   let a diagram draw straight across the paragraph beneath it on four separate pages,
   and **every numeric check passed** — no overflow, no escape, nothing outside the
   page box. Only a pairwise text-collision test found it. `bp/render.js audit` has one;
   the site has no equivalent and the same shape exists in several pinned sections.
3. **An `feTurbulence` grain filter costs 120MB in print.** Chrome rasterises the filter
   once per page at print resolution: the same document was 126MB with the site's grain
   and 6.5MB with a pre-rendered 128px PNG tile. Irrelevant on screen, fatal in a PDF.
4. **The `<<'EOF'` heredoc in this environment collapses `\` to `\`.** A Windows path
   written `'C:\Program Files\...'` inside a heredoc arrives as a single backslash and
   the JS string eats it. Use forward slashes, or write the file with the Write tool.

### Six more app mockups are unusable — same reason as the existing bans
`11.png` and `18.png` (onboarding and quest screens) say **"Earn DRT tokens"** and
"+45 DRT"; `Brathing_quest.png` and `Hydration.png` say "+20 DRT" / "+45 DRT";
`img-04.png` is a wallet with "DVT Price $0.100 ↑24%" and Buy/Stake; `img-05.png`
carries the same "$0.100 · 24h change ↑24%" header as the already-banned `img-06`/`img-10`.
**DRT is retired terminology and appears nowhere in the site's copy — but it is still
baked into six image assets.** Only `14.png` (Marketplace) and `17.png` / `img-03.png`
(Learning, 42/128) are clean. All six want re-rendering before further external use.

### What the plan could not resolve
No Investor Pack, Business Plan, Whitepaper, Tokenomics paper, Feasibility Study,
Competitor Analysis or Quarterly Update exists as a file in this project — the website
is the only source. Fourteen gaps are recorded as visible **OPEN ITEM A1–A14** in the
document's Annex A rather than filled by inference. The largest are: no company financial
model, no tokenomics (supply, allocation, vesting, conversion rate), no unit economics,
no instrument or valuation for either raise, and neither entity incorporated.

**Annex A7 is a website defect, not a document one:** `index.html`'s waitlist form is
still wired to nothing while every nav, drawer and footer CTA points at it.

---

## Scroll smoothness, mobile hero, Sanctuary rework — August 22

Changes across `index.html`, `app.html` and `sanctuary.html`, plus the mobile nav
on all 13 pages. Verified in the browser at 360/375/414/768/1440; **zero console
errors on a full scroll sweep of every page touched**.

### 1. The real cause of "it loads, you keep scrolling, then it rushes past"

Reported against the mobile "Why DAOasis matters now" section. It was not a pacing
bug in `cine.js` — it was **three separate places where a scroll-driven section
could not draw until something slow had finished, while the section was already
scrollable.** The reader met a pinned section that appeared dead, scrolled on, and
it then initialised at whatever position they had already reached.

**a. `three.js` was a render-blocking `<script>` in `<head>`** on `index.html` and
`sanctuary.html` — ~600KB from a CDN before anything on the page could paint.
Now `defer`red on both. Everything that uses THREE waits for it:
- `index.html` — the palm IIFE is now `initPalm`, which re-arms itself on
  `DOMContentLoaded` if `THREE` is undefined. If three.js fails outright it
  returns and the section keeps its CSS resting state, where all the copy is
  `opacity:1` — it degrades to readable type, never to a blank 516vh pin.
- `sanctuary.html` — a `whenTHREE()` gate wraps the `stage3D('loopCanvas', ...)`
  call. **This gate is mandatory:** `stage3D()` treats a missing `THREE` as
  "no WebGL" and swaps in the static text fallback permanently, so deferring
  without it would have given every visitor the fallback.
- `app.html` and `web3.html` do not load three.js at all. Nothing to do.

**b. The palm section started its story before it could tell it.** Only
`assemblyT` was gated on `logoReady`; the copy fade, the three stat cards and the
progress rail all ran off `t` regardless. So the section visibly "started" while
the palm could not appear, and when `rasterizeLogo()` finally landed (it waits on
an Image decode, then reads back 810,000 pixels) `assemblyT` jumped straight to
`clamp01(t/SHAPE_END)` — often already 1. The palm popped fully formed.
Now the **section's** clock waits for readiness, and on arrival eases from 0 up to
the reader's true position (`CATCH_MAX_MS` 1300, re-based on the live scroll value
each frame so it tracks a reader who is still moving). Common case is invisible;
worst case is a controlled catch-up that *shows* the assembly instead of cutting
to the end of it. The initial synchronous paint is now `render(0)`, not
`render(currentT)` — 0 is the only frame the section can honestly show yet.

**c. Two sticky sections were gated on `window.onload`, which waits for every
image on the page.**
- `app.html` quest route — `initPath()` (2.38MB `Journey image.png` et al).
- `sanctuary.html` Seven Days arc — `build()` (~15MB of day photography).

Both now run on `DOMContentLoaded`, with the `load` pass kept as a harmless
re-measure. `getTotalLength()`/`getPointAtLength()` read the path's own **user
units** — they need the element parsed, not the images decoded, so `load` was
never the correct gate. `web3.html` already called `build()` immediately; correct
as-is.

> **The pattern to watch for:** any pinned/sticky section whose visual state is
> produced by JS that waits on an async asset. The section reserves its scroll
> height from first layout, so it is scrollable long before it is drawable. Gate
> the *whole* section's timeline on readiness, and ease into the true position —
> never let a late init snap to it.

### 2. Mobile home hero — journey animation removed, and the rest given room
- `#journeyMobileHero` (five stops + filling spine) is **gone**, with its CSS, its
  `jmStops`/`jhFill`/`jmHero` JS and its entries in the `intro-skipped` /
  `return-visit` / `<noscript>` selector lists. It only ever displayed below
  800px, so removing it on mobile removed it entirely. The desktop SVG route
  (`.journey-wrap`) is untouched.
- **`.journey-mobile-section` further down the page is a DIFFERENT element and was
  deliberately left in place** — the full journey still has its own mobile telling
  (7 stops). Do not confuse the two.
- The freed ~200px went into the headline and the space around it:
  `clamp(25px,6.9vw,36px)` -> `clamp(38px,11vw,60px)`. The old stack bottomed the
  headline out at 25px, so the one element that should carry the page arrived as
  the smallest thing on screen.
- **The kicker is measured, not guessed.** At 9.5px/0.26em plus two 20px rules and
  two 14px gaps it needs ~320px inside a 322px column at 375 — so it wrapped to
  two lines while the rules stayed on the first, which read as a broken element.
  Now 9px/0.22em with 14px rules (~275px) plus `white-space:nowrap`.
- Drama comes from contrast, not more elements: the mobile vignette is pulled in
  and deepened and the warm bloom lifted, so the type sits in a pool of light.
- Measured at 375x812 the stack is ~470px of 663px available — it still compresses
  rather than clips on a short screen.

### 3. Mobile nav — waitlist CTA removed, logo enlarged
`@media(max-width:768px){.nav>.nav-cta{display:none;}}` on all 13 pages (six
marketing pages inline, seven trust pages via `css/trust.css`). The child
combinator matters: the drawer's own copy of `.nav-cta` must survive.
With the pill gone the mark is the only branding up there, so `.nav-brand img`
goes 24px -> **34px** (<=768) -> 30px (<=420) -> 27px (<=360). The old rule
*shrank* it to 19px at 360, which was backwards.

### 4. "One Place, All Day" (3D one, the pavilion) — removed completely
Markup, `.pav-veil`, the whole `.sun-*` readout block, its mobile overrides and
the ~210-line `stage3D('pavilionCanvas', ...)` scene are all gone.
**Its trailing `.divider.solo` went with it.** `solo` exists only to stop a divider
drawing a rule across a pinned stage's last live frame; with no pinned stage there,
the divider above (`dark bg-surface to-bleed`) already bridges the Day section into
the Immersion photograph, and two dividers back to back would have read as a
double rule. `TROPIC` stays — 3D two still uses the sala, water, palms and karsts.

### 5. Sanctuary Life — photography now matches the content, plus a sixth row
`img-01.jpg` was running as **both** Learning and Community, and Recovery was a
sunrise-journal shot with no sleep in it.

| row | was | now |
|---|---|---|
| 01 Movement | img-11.jpg | img-11.jpg (kept) |
| 02 Recovery | img-07.jpg | **rest.jpg** — the bedroom |
| 03 Learning | img-01.jpg | **Learn.jpg** |
| 04 Nature & Reflection | pexels beach | **clarity.png** |
| 05 Community | img-01.jpg *(dupe)* | **connect.jpg** — actual people |
| 06 Nourishment | — | **Nourish.jpg** *(new row)* |

Focal points are the ones already measured for these same files in the Day section.
The new row's copy is drawn from what the page already establishes (long table,
simple food, eaten together) — no facility was invented.
`--img-sanctuary-wide` also moved img-01 -> **Sunrise.png**.

### 6. Phuket 2027 plate, and the seven-day loop made less "gamy"
- `--img-place` -> **`images/PHUKET.jpg`** (the map poster). **The gold pin and its
  "Phuket" label were removed**: the plate labels itself, and dropping a pin on a
  specific spot would claim a located site while that same section says the
  location is still in development. `.place-pin*` CSS deleted with it.
- **The camera was what read as a video game, not the geometry.** It travelled the
  ring perfectly smoothly and its only movement was a 1.6cm rise on a *wall-clock*
  sine — so it drifted while standing still and did not change when moving. That
  is a drone on a spline. The gait is now driven by **distance walked**:
  `gaitPhase += |dT| * CURVE_LEN / STEP_LEN * PI`, with a seam guard because `t` is
  modulo 1 and the wrap would otherwise spin the phase through a whole lap in one
  frame. Vertical uses `|sin|` (two falls per stride, at each heel strike); sway
  and roll run at half that and a quarter-cycle out. Standing still is genuinely
  still; step rate falls out of scroll speed. Sway is applied along the deck's own
  side vector, and the whole gait is multiplied by `(1-k)` so footfalls do not
  carry into the lifted reveal frame.
- **Gaze lag** — the look target trails its ideal by ~110ms, framerate-independent
  (`1 - exp(-dt/0.11)`), so bends are entered and left a fraction late the way a
  walker's head does. `dtSec` is clamped to 50ms so a backgrounded tab does not
  snap the gaze on its first frame back.
- **The three near palms were built with `M.frond` — the DAYLIGHT frond colour** —
  while the distant ring was already night-graded to `0x1d3024`. Three bright
  mid-green cut-outs in a blue-hour scene, and the eye reads "wrong green" as
  "rendered" instantly. Now `mLeafNear` `0x2a4133` with trunks at 0.58x; lighter
  than the far ring because they sit in the lantern light, but foliage in the dark.
- Water `shininess` during the ride 62 -> **38**: at 62 each lantern landed as a
  short stack of hard white dashes.
- Local variables in the loop's frame closure are named `fwdV`/`sideV`, not
  `fwd`/`side` — the build code above declares its own block-scoped `side` in four
  places and shadowing it there reads as the same variable.

> Judged by eye using the existing `?shot=1` / `localStorage['daoasis-shot']`
> capture hook, posting PNGs to a throwaway local receiver — the Browser pane will
> not composite a large viewport. The flag was cleared afterwards.

### 7. Founder quote + portrait slot wired (about.html)

- Jamie's `.pf-q` now reads: *"DAOasis is about helping people reset, reconnect
  and reimagine their future — and rewarding them for every step they take."*
- The portrait is in: `images/team-jamie.png` (1023x1537, RGB PNG, 2.17MB).
  Supplied as `ME 3.png` and **renamed** — the space in the filename is the
  portability risk already flagged for the Journey photographs, and nothing
  referenced the old name. Three things guard the slot:
  - the `<img>` carries `onerror="this.remove();"`, so a missing or renamed file
    falls back to the standard monogram plate rather than a broken-image icon on
    the founder's own portrait;
  - `.pt:has(img) .pt-tag { display: none; }` hides "Portrait to follow" only when
    a portrait actually loaded — `.pt-tag` is z-index 4 and the image is 2, so
    without this the caption printed across the bottom of every real photograph;
  - `#founder .pt img { object-position: center 30%; }` — the supplied portrait is
    a tall frame (~0.66) in a 4:5 plate, so a centred `cover` crops ~8.9% off the
    top and the top of the head sits at about 8% of the source. 30% takes that to
    ~5.4% and spends the difference on the jacket. **Re-check this if the
    photograph is replaced.**
- The monogram and caption are deliberately left in the markup underneath the
  image, not deleted — they are the fallback, not dead code.

> Verified rendering at 456x571 on desktop and 315x394 on mobile — ratio 0.800 in
> both, i.e. the plate exactly. about.html now 404s only on the pre-existing
> `about-hero-mobile.jpg` plus the site-wide missing favicon.
>
> **It is a 2.17MB PNG of an opaque photograph** (colorType 2, no alpha), so it
> belongs in JPEG — roughly a tenth the size for the same result. Same open issue
> as the Journey and Sanctuary plates, same blocker: no image tooling here.

### Still open (not addressed here)
- **The heavy images remain the biggest smoothness risk left.** `Journey image.png`
  2.38MB, `Journey image mobile.png` 2.15MB, and ~15MB across the nine Sanctuary
  day plates. The `load`-gating fixes above mean a slow decode no longer *breaks* a
  section's initialisation, but the plates still all fetch on approach. They want
  resizing to ~1600px on the long edge and re-encoding to WebP/q80. There is still
  no image tooling in this environment (`convert` on PATH is the Windows disk
  utility).
- The loop's reveal frame still shows fairly hard white lantern pools on the water,
  and the centre island is a flat tan mass. Improved, not finished.
- The hero plate-pass timing on sanctuary.html is still the one part never tuned
  by eye (carried over from the August 21 note).

---

## Images compressed site-wide — August 22

**`images/` went 48.4MB -> 7.1MB (86% smaller, 42MB saved).** Every page's total
image payload, measured live by scrolling the whole document:

| page | images fetched | payload |
|---|---|---|
| index | 11 | **0.91 MB** |
| sanctuary | 16 | **2.63 MB** |
| app | 12 | **1.69 MB** |
| web3 | 8 | **0.73 MB** |
| about | 6 | **0.42 MB** |
| investors | 5 | **0.16 MB** |

Zero 404s and zero broken `<img>` tags on all six.

### There IS image tooling here after all — this was wrong before
Earlier notes said no image tooling exists. `convert` on PATH really is the
Windows disk utility and `python` is a Microsoft Store stub, but **npm works**,
so `npm install sharp` gives a full libvips build (JPEG, PNG, WebP, AVIF).
Install it into the scratchpad, never the project folder.

> **`ln -s` does not make a symlink here.** Linking scratchpad `node_modules`
> into the project produced a real 20MB copy. Either run the script from the
> scratchpad with a path argument, or copy the script in and delete
> `node_modules` afterwards. A stray `node_modules/` in this folder would go
> straight to GitHub.

The script is `scratchpad/optimise.js` — `report` measures and writes nothing,
`apply` writes to `images-optimised/` and never touches `images/`.

### The rules it applies
- **Photographs -> JPEG** q82, progressive, mozjpeg, 4:2:0.
- **Real transparency stays PNG.** `hasAlpha` is not the test — plenty of these
  PNGs carry a fully opaque alpha channel and are simply heavy. The script reads
  the alpha channel's actual minimum and only keeps PNG when it is genuinely
  transparent. That is what let `clarity.png`, `Sunrise.png`, the two Journey
  plates, `Quest map.png` and `team-jamie.png` become JPEGs.
- **Long edge capped by role**, at 2x the largest CSS box the asset ever occupies:
  hero 2400 · plate 1800 · mockup 1800 · logo 1400 · portrait 1200 · icon 512.
- Never writes a "saving" larger than the original (PHUKET.jpg was already
  optimal and was left byte-identical).

**Two caps are load-bearing and were both wrong on the first pass:**
1. **`img-02.png` is not an icon.** It is the intro lockup, rendered at
   `width:min(52vw,680px)` — so it needs ~1360px, not the 512 icon cap. It has
   its own `logo` role at 1400.
2. **Mockups are 1800, not 1400.** The phone occupies only ~80% of those
   2250x2250 canvases (see the `.dev` crop note), and `.part-grid .dev` is a
   580px-tall box — 1400 gave just 1.93x on retina. 1800 gives 2.5x.

### Seven files changed extension
`clarity` · `Journey image` · `Journey image mobile` · `Quest map` · `Sunrise` ·
`team-jamie` · `Web3` all went `.png` -> `.jpg`. **16 references were rewritten**
across `about/app/index/investors/sanctuary.html` (both raw and `%20`-encoded
forms). Verified afterwards: 182 image references parsed, **only
`about-hero-mobile.jpg` unresolved — the pre-existing gap**, not a regression.
The `team-*.jpg` and `06.png` "misses" a naive scan reports are inside HTML
comments.

### The backup
**`images-original/` holds all 42 original files (49MB). It is a local safety
copy and must NOT be uploaded to GitHub** — it would quadruple the repo for no
benefit. Delete it once the compressed set has been seen live.

`about.html`'s portrait `width`/`height` were updated 1023x1537 -> **799x1200** to
match the resized file; the ratio is unchanged (0.666) so the reserved box and
the `object-position: center 30%` crop still hold.

### Filenames de-spaced (same pass)
`Journey image.jpg` -> `journey-image.jpg`, `Journey image mobile.jpg` ->
`journey-image-mobile.jpg`, `Quest map.jpg` -> `quest-map.jpg`. **No filename in
`images/` contains a space any more**, so nothing depends on %20 encoding and
there is nothing to fumble when drag-dropping into the GitHub UI. Four
references updated across index.html and app.html, verified 200.
This closes PRE_DEPLOY items 1 and 2, both of which are now marked DONE there;
PRE_DEPLOY section 0 is the concrete upload list for this batch.

---

## Investor-document alignment pass — August 25

Editorial only. The two investor documents were revised on 25 August 2026 and are
now the **source of truth**; they live in
`C:\Users\Lenovo x270\Desktop\DAOasis Business Plan 2026\` (`pages/*.js` for the
plan, `investor-pack/pages.js` for the pack) and were **not** edited by this pass.
Eight files changed: `index` · `app` · `web3` · `investors` · `about` · `privacy` ·
`terms` · `CONTENT_REQUIRED.md`. **`sanctuary.html` is byte-identical** (verified by
diff) and the trust layer apart from privacy/terms is untouched.

### The vocabulary, stated once
- **DAOasis** is the ongoing ecosystem. A member never finishes it.
- **Journeys** are the repeatable immersive experiences inside it. Completing one
  opens the next.
- **The launch Journey** is Bangkok → Phuket — the first of them, not the product.
- **The Sanctuary** is the **optional** physical expression, planned for Phuket 2027.
  Not somewhere every member is expected to reach.
- **The Companion App** is the *core operating environment* and the scalable
  foundation every later product launches through. It is **not** "the only near-term
  scalable product" — that phrasing is retired and was removed from `investors.html`
  (x3) and `about.html`.
- Members move **user → participant → contributor → stakeholder**.

**Banned on the marketing pages:** terminate / terminates / termination · endpoint ·
final destination · end of the journey. Use *complete a Journey · reach a milestone ·
arrive at a destination · unlock the next Journey · the ecosystem continues*.
**`terms.html` is the sole exception** — its five uses of "termination" are correct
account-termination law and must be left alone. Note that a naive grep for
`terminat` also matches **self-de·terminat·ion** in `index.html`'s closing copy;
that is a false positive, not a violation. Use `\bterminat[a-z]*\b`.

### quest → Journey: what was renamed and what was NOT
Route-level "quest" became "Journey" **in visible copy only**. Every CSS class, id
and JS identifier is unchanged — `.quest-card`, `.quest-map-section`, `#questsGrid`,
`#questMapOuter`, `questScroll()`, `.quest-desc`, `.qc-icon` — so the stagger
observer, the scroll-driven SVG route and the hover states all still bind.

| app.html, visible | was | now |
|---|---|---|
| hero bridge sub | The Bangkok → Phuket Quest awaits | …**Journey** awaits |
| how-tag | The Bangkok → Phuket Quest | …**Journey** |
| Section 4 kicker | Quest 01 | **The launch Journey** |
| sticky header kicker | FEATURED QUEST · SCROLL | **LAUNCH JOURNEY** · SCROLL |
| waypoint 01 tag (JS `WAYPOINTS`) | QUEST BEGINS | **JOURNEY BEGINS** |
| Section 5 kicker | The Quest Map | **The Journey Map** |
| Kilimanjaro desc | one of the shorter quests | one of the shorter **Journeys** |

**The daily five keep the word "quests"** — Rest, Move, Learn, Reflect, Community.
So "Complete daily quests", "Sleep and breathing quests have amplified rewards",
"Quest bonus" and the community-quest copy on `index.html` are all correct usage and
were deliberately left. Do not sweep them.

`app.html` ~1661 ("Bangkok to Phuket is just the beginning. Once completed, the next
Journey unlocks") is the best Journey copy on the site — the documents were raised to
*its* level, not the reverse. Only the one word changed there.

### Trong removed from about.html
Profile card, bio, quote, portrait-slot comment, the disciplines block and the
six-remits diagram (including its `aria-label`). Technology is now **Uchenna +
Etiosa** plus an open CTO role. `grep -oE '\bTrong\b' *.html` returns nothing — a
case-insensitive `trong` substring search matches `<strong>` and is useless here.

**`.team-i.open` is a new variant and is the one CSS addition in this pass.** It
mirrors the Investor Pack's `.mem.open`: a gold hairline on the portrait plate, a
centred gold `OPEN ROLE` label instead of a monogram, a gold rule above the text
block, and a gold name. The card keeps the 4:5 plate so the three-up row stays
aligned — only the plate's contents change. It closes on `.pf-soon`
("Appointment to follow") because a three-up row with one card ending early leaves
exactly the ragged hole `.pf-soon` was invented for.
- The plate's `.pt-tag` was **dropped from this card only**. With it the card said
  "Appointment planned" in the plate and "Appointment to follow" 200px below — the
  same sentence twice. Judged by eye at 1440 and 390 (headless screenshot of
  `#technology`; see the capture note below).
- **Do not put a name in this card.** The six-remits diagram reads
  "Technology — CTO (TBC)" for the same reason.

### Learning: 128 → 20, and the mockup contradiction
The pilot ships **twenty lessons, ten per track**, framed as disciplined MVP scope.
The curriculum stays **specified across four depth levels per track**; the library
expands on what the first cohorts show.

`app.html` had "128" four times. The stat bar went `128 Total lessons / 2 Tracks` →
**`20 Pilot lessons / 4 Depth levels`**, which is exactly the plan's own figure row
(20 / 4 / 100% / 0). Both new labels measured single-line (h15) at all seven widths,
and the bar's geometry is identical to baseline.

**The mockup is reconciled in text, not retouched.** `img-03.png` visibly shows
"42/128", so the section body now says *"App screens here preview the full specified
library, not the pilot scope."* Same fix the Business Plan uses. **Do not edit the
PNG.** `17.png` / `img-03.png` remain the only clean learning mockups — the
banned-image list above is unchanged by this pass.

### Corporate structure — one wording everywhere
- **DAOasis Global Ltd (UK)** — incorporated and live. Holds brand, website, app
  development today.
- **BVI parent** — *planned*. Intended group parent, UK company beneath it.
- **Thai operating company** — *planned*. Holds the Sanctuary pilot.
- **Sequencing is still being settled with counsel — never state firm timing.**

`investors.html`'s hero strip read "BVI · Thailand", omitting the live UK entity; it
is now "UK · BVI · Thailand / UK company live. BVI parent and Thai entity planned."
Three uses of "incorporation across both jurisdictions" are gone, and the legal foot
now names the UK company and says plainly that the other two are not yet formed and
that there are no users, no revenue and nothing validated in market.

### The entity name is published; nothing else was
`privacy.html` §01/§19 and `terms.html` §01/§24 now print **DAOasis Global Ltd**,
registered in the United Kingdom, as plain text. **The company number and the
registered address stay visible `<span class="tbc">` markers**, and governing law and
jurisdiction stay TBC. Neither was invented. `CONTENT_REQUIRED.md`'s LEGAL ENTITY
table was rewritten to match. `privacy.html` §19 gained a **Company number** row so
the card does not imply the address alone is outstanding.

### Company status — the tone changed, the honesty did not
"DAOasis has moved beyond concept development and is progressing through structured
product build", never "still planning to". `investors.html`'s roadmap Today column
gained *DAOasis Global Ltd (UK) — incorporated and live* and *Experience Map — the
full product specification — written*, and "four pages" became **thirteen** (the real
page count). Building gained *MVP build — design handoff underway* and *BVI parent
and Thai operating company formation*. `about.html`'s "Building deliberately" section
opens on the same three facts.
**Every existing honesty disclosure was kept** — no users, no revenue, nothing
validated in market, no property contracted, dates are working internal targets.

### Taglines
Tagline 1 (positioning) — *Traditional wellness apps create users. DAOasis creates
stakeholders.* — is on `index.html` (hero, already there) and now `investors.html`
(the `.tri-joint` and the closing). It was **not** wrapped in `<em>` inside
`.tri-joint`: that rule is already fully italic Cormorant, so an `<em>` adds nothing
and risks italic-cancelling. Tagline 2 — *Rest. Learn. Earn. Return.* — was already
on all 13 pages and is untouched. Neither was shoehorned anywhere else.

### Verified — and how
A real headless Chrome is available at
`C:/Program Files/Google/Chrome/Application/chrome.exe`, driven through the
**`puppeteer-core` already installed in the Business Plan project**. Run the harness
*from that folder* so the require resolves. For this kind of work it beats the
Browser pane outright: it composites a full 1920 viewport, loads `js/cine.js` over
real HTTP, and screenshots individual elements.

- **13 pages × 7 widths (375/390/430/768/1024/1440/1920) = 91 measurements: 0
  horizontal overflow** (`documentElement.scrollWidth === clientWidth` in all 91) and
  **0 clipped `.ln` line-masks** in all 91.
- **Console: only the two documented pre-existing 404s** — the site-wide missing
  `favicon.ico` and `about-hero-mobile.jpg`. Zero new errors, zero page errors.
- **298 internal links, anchors and assets re-resolved**; the only miss is
  `about-hero-mobile.jpg`, the known gap.
- `investors.html`'s request panel still works end to end: 12 entry points, panel
  opens, 10 resource options, address printed from `INVESTOR_CONTACT`, Escape closes,
  no page errors.
- The learning section's grid, cards and stat bar are **geometrically identical to
  baseline at every width**; the only change is `.learn-header`'s paragraph growing
  from one line to two at desktop (58px → 115px), which is the copy doing its job. No
  CSS, no layout and no animation code was touched on `index.html` or `app.html`.

> **The measurement trap, worth keeping.** Auditing by *sweeping the document at 1440,
> then `setViewport` to 375* leaves a **stale layout**: `app.html` reported a 20px
> overflow that a fresh load at 375 did not show. Running it five times against the
> pre-edit backup **and** the current build settled it — the **baseline** tripped it 2
> times in 5 and the current build **0 in 5**. It is a pre-existing non-deterministic
> race (the same one documented above as app.html's ~11–18px narrow-width overflow),
> not a regression. The same artefact makes `index.html`'s intro `.headline` measure
> 400px wide on a 390 viewport mid-reveal. **Diff a baseline copy of the site served
> on a second port before believing any geometry regression**, and load each width
> fresh.

---

## Cross-document alignment pass — August 26

Audit of all five surfaces (Business Plan · Investor Pack · Tokenomics Paper ·
Whitepaper · the 13-page website) against each other, then nine fixes applied.
**Every genuine contradiction was between the website and the documents** — the
four PDFs already agreed with each other. Thirteen load-bearing claims were
verified aligned and left alone (supply, allocation, vesting, Sanctuary payment
and status, entity structure, team, raise staging, 20 pilot lessons, the five
quest categories, Journey vocabulary, zero price/yield leakage, zero banned words).

### What changed, and why it is load-bearing

1. **`index.html` waitlist was `href="#"`** — a dead link that the nav, drawer and
   hero CTAs all pointed at, and the Business Plan's A7 launch blocker. Now a
   `mailto:info@daoasis.xyz` plus a `.wl-note` saying the list is not automated.
   **There is still no form backend anywhere in this project.** Because a mailto
   collects nothing, this did **not** change the privacy/cookie position — but if
   real capture is ever built, `privacy.html` §09 and `cookies.html` §04/§07 must
   change in the same release. Both currently assert the site collects nothing.
2. **`app.html` showed six device integrations as live**; investors.html said two.
   Business Plan A1 had recorded the decision as "correct the website" and it had
   never been done. New `.int-card-status` on all six — Apple Health and Google
   Health Connect `first`, the other four `planned` — plus a corrected section
   lede. Colours measured against `--dark-surface`: `#D49B69` is 6.1:1, the muted
   white 5.3:1. **The Whitepaper already stated this position exactly** and needed
   no change.
3. **`investors.html` claimed detailed financial models exist.** Business Plan A12
   quoted that very sentence in order to contradict it. The website now says no
   model is published anywhere and that a three-year model is a Stage 2
   precondition. **The Business Plan was right; the website was the thing to fix.**
4. **Conversion was stated as fact site-wide** while the papers treat it as
   designed-but-unresolved (Tokenomics Annex B1 unresolved, T1 records the
   superseded study recommending *against* it, T2 has rate/caps/eligibility unset).
   Ten sentences across `app.html` and `web3.html` — including two meta
   descriptions — now say **designed to convert**. The tell that found it: on
   web3.html the marketplace, governance, staking and Stake to Create rows all
   carry a status label and **Convert was the only one without**. It now has
   `.bridge-status` — "In design · rate and eligibility not set".
5. **The Whitepaper exists but two documents said it was "in preparation."**
   Fixed in four places in Tokenomics `g-back.js` (Annex B2, Annex B6, the
   read-alongside note, the closing) and one in `investor-pack/pages.js`.
6. **The investor resources list offered nine documents; four exist.**
   **`Brand Kit` was REMOVED and must not be reinstated** without a new one being
   produced — the May 2026 kit is retired (retreat-first positioning, Annex B6)
   and sending it would contradict the whole set. A new `soon: true` flag on
   `DOCS` renders "In preparation", drops the request button and drops the entry
   from the request select, so **nothing can be requested that cannot be sent**.
   The Whitepaper card description was also wrong (it promised token reasoning;
   the actual Whitepaper defers every token figure to the Tokenomics Paper).
7. **Governance's four phases** (Founders-led → Community advisory → Partial DAO →
   Full DAO) were published in the Tokenomics Paper §14 and Whitepaper §13 and
   nowhere else. Added as `.gov-phases` on web3.html (Phase 01 marked "Where we
   are") and named in the Business Plan's utility table.
8. **`sanctuary.html` never said how a stay is paid for**, or how big the pilot is.
   Now states sixteen rooms, adults only, and that stays are booked and paid in
   ordinary currency through the Thai company with $DVT carrying access, not
   payment. **Do not soften or remove this** — the Tokenomics Paper calls it "a
   regulatory difference, not an editorial one."
9. **Investor Pack cover said "Feasibility Stage 2"** two pages above a section
   whose whole content is Stage 1/2/3 of the *raise*. Now "Pre-launch · Pre-revenue".

### Cascade the audit itself created
Correcting the website made three Business Plan open items stale, since they
described a website that no longer says those things. **A1** is now "resolved
26 Aug 2026 / Closed", **A7** is retitled "The waitlist is manual, not automated"
(still a launch blocker — real capture is still outstanding), and **A12**'s long
form now records that the website was corrected rather than quoting it as an
unverifiable public position. The substantive disclosures were kept intact.

### Rebuilt
Tokenomics 24pp 2.02MB · Investor Pack 4pp 2.84MB · Business Plan 48pp 8.03MB.
**All three audits report HARD ISSUES: 0.** The Whitepaper needed no change and
was not re-rendered.

### Verified
Real headless Chrome over real HTTP (`scratchpad/verify.js`) — the Browser pane
serves local files as `data:` URLs so `js/cine.js` never loads there. Six
marketing pages at 375×812 and 1440×900: **0 horizontal overflow on five of six,
0 console errors, 12/12 alignment assertions pass.**

**Three flags investigated and all pre-existing, none caused by this pass**
(`scratchpad/diag.js`):
- The only 404s are the documented two — site-wide `favicon.ico` and
  `about-hero-mobile.jpg`.
- Sub-9px type is `div.source` (8.5px) on index, `div.quest-prog-label` (8.0px)
  and the collapsed `span.market-nav-item` on app. **None is an element added
  here** — the new labels are 9.5px, 10px and 13.5px.
- `app.html`'s 20px overflow at 375 is the quest-route SVG (`#questPathFill`,
  `#wpC2`, `right=1050` in a 375 viewport). Measured on **5 fresh loads: 21
  escaping elements, 0 of them inside `#integrations`.** This is the offender
  already documented above as "the nav and an SVG elsewhere on the page".

### Still open after this pass
- **Real waitlist capture** (A7) — needs a backend; nothing in this project has one.
- **Publishing the four PDFs as downloads.** They exist but sit behind the request
  form. Setting `file:` turns the cards into downloads automatically — but that
  removes the gate that tells you who asked, which is a **business decision, not a
  technical one**, and the PDFs would have to be copied into the site repo.
- The app mockups still carrying "DRT" and a DRC unit price (Annex B8).

## Motion rebuilt site-wide — 1 September 2026

Reported as: timing issues, scrolling issues, "many issues between sections and
animations". All of it traced to **one root cause plus two consistency failures**,
and all of it is measurable. Changed: `index` · `app` · `sanctuary` · `web3` ·
`investors` · `about` · **`js/cine.js`** · **`css/trust.css`**. The seven trust
HTML pages are byte-identical (they inherit the motion tokens from `trust.css`).

### The root cause: sticky sections rendered as many frames as they had states

`cine`'s sticky mode quantised — it picked a whole state and eased to it — and
**every consumer then did `Math.floor(p * n)`**, which throws the eased value
away. An integer cannot express a transition, so the pacing was invisible and a
class flip handed the actual motion to a CSS transition running on its own clock.

Measured at 1440x900, driving each pin to 41 scroll positions, letting the pacing
settle at each, and fingerprinting the rendered DOM (`scratchpad/states.js`):

| section | pin height | distinct frames BEFORE | AFTER |
|---|---|---|---|
| `index` pin3 — daily experience | 3348px | **9 / 41**  (80% frozen) | 20–23 / 41 |
| `index` pin4 — the journey | 5184px | 12 / 41  (73%) | **38 / 41** |
| `index` pinContainer / palm / pin5 | — | 41 / 41 / 36 | 41 / 41 / 36 |
| `app` quest map | 5400px | 11 / 41  (75%) | **41 / 41** |
| `app` marketplace | 4500px | **7 / 41**  (85%) | **41 / 41** |
| `sanctuary` four foundations | 3240px | **4 / 41**  (93%) | **37 / 41** |
| `sanctuary` seven days | 5220px | 7 / 41  (85%) | **41 / 41** |
| `sanctuary` an average day | 7344px | 9 / 41  (80%) | **41 / 41** |
| `web3` participation | 5040px | **6 / 41**  (88%) | **41 / 41** |
| `web3` the bridge | 4140px | 11 / 41  (75%) | **38 / 41** |
| `web3` the complete loop | 3780px | 23 / 41  (45%) | **41 / 41** |

> The proof of diagnosis was already in the file: **`pin5`, the Principle section
> rebuilt in August as a pure function of the paced value, scored 36/41. Every
> section still flooring a state index scored 3 to 12.** The fix was to do to the
> other fifteen what had already been done to that one.

**`web3`'s hero fabric** was frozen for its last **1.17 viewports** (the pull-back
finished at p=0.76, the section ran to 1.0). Canvas-sampled: 22/31 distinct frames
→ **29/31**, no frozen range. The camera now keeps easing back very slightly
through the statement.

### `js/cine.js` — four changes, all load-bearing

1. **The stops are MAGNETS, not steps.** Raw scroll is remapped per segment
   through `magnet(u) = u<0.5 ? 0.5(2u)^k : 1-0.5(2(1-u))^k`, `k = 2.6`, then
   followed with the same damped speed cap guided mode uses. Motion concentrates
   in the middle of a segment and dwells near each stop, so **a state still lands
   and holds, one firm scroll still carries one beat, but the scene is never
   motionless while the page is moving.** Verified in node against real geometry
   (`scratchpad/engine.js`): steady read = **2 of 26 samples with no visible
   change** (was effectively 24 of 26); a full-aggression flick 0→1 still takes
   **2.07s** so it cannot flash through; direction reversal mid-transition has a
   max single-frame hop of **0.75%**; guided mode is unchanged at 3.61s.
2. **`pos()`, `weigh()`, `lead()`, `ramp()`, `smooth()` — the consumer helpers.**
   `pos()` is the continuous position along the stops (2.4 = 40% of the way from
   state 2 to state 3, correct for uneven stops). **Consumers scrub these; they
   never floor them.** All three page-level `cine()` shims answer them too, so a
   missing controller file still degrades rather than breaks.
3. **Read and write are two passes per frame.** `Track.read()` collects every
   track's scroll position *before* any subscriber writes a style. They used to
   interleave, so track 1's `getBoundingClientRect` forced a full synchronous
   layout after track 0's subscribers had written — four forced layouts per frame
   on index, every frame, for as long as anything was moving.
4. **Resize no longer settles on a phone's URL bar.** `settle()` snaps every track
   to true scroll; scrolling on a handset fires `resize` continuously as the bar
   collapses. Width changes always count, height changes only above 140px.

The keyframed 30/70 transition curve is **gone** — both modes now follow a target
with a damped speed cap, which answers within a frame, has no duration to expire,
and re-targets mid-flight without the kink a re-based keyframed ease produced.

### `lead()` — why it is a triangle raised to a power, not a hold

For a list whose rows are all on screen together, two constraints pull against
each other: **at rest on a row its neighbours must be at zero** (one live row),
and **between two rows one of them must still read as live** (no dead frame — the
same "least confident moment" the Principle section was rebuilt to remove).

A linear ramp cannot satisfy both, and an asymmetric hold does not either: holding
the outgoing row longer only moves the 0.5/0.5 crossover later (it lands at
`d = (1+hold)/2` with the same value), while adding a plateau that put `web3`
participation back to 50% static. **`(1-|d|)^0.6`** satisfies both exactly — 0 at
the neighbours, 1 on the row, **0.66 at the crossover** — with no plateau.

The remaining muddiness at a crossover is solved separately, in CSS: **the
sub-items are gated high (`--sd` starts at 0.62)** so only the row that has
actually arrived is annotated. Two rows may be similarly bright mid-handover; only
one carries its list, which is what makes the handover legible.

### Scrubbing, in CSS

Every converted section writes `--w` (how live) and where relevant `--p` (how far
past) as inline custom properties, and the CSS is a pure function of them:

```css
.found-item .found-name { opacity: calc(0.4 + 0.26*var(--p,0) + 0.6*var(--w,0)); }
```

**There is deliberately no CSS transition on any scrubbed property.** A transition
there is a second clock running against the paced scroll value — that is the bug,
not a nicety. Where a scrubbed element also needs a discrete class (the callout
arrival pulse, the mobile plate path), the class carries *only* the discrete part;
`.callout.show{opacity:1}` was removed because it outranked the scrubbed opacity.

Two `transition: all` declarations were animating SVG geometry (`.arc-dot`'s `r`,
`.loop-node`) on a 0.45–0.5s clock, re-rasterising every frame. Both gone.

### Text never changes under the reader

`web3`'s loop centre copy and `sanctuary`'s day readout are text, so they cannot
cross-fade with their successor. Both now **fade out across the midpoint between
two nodes — where the arc never rests — and swap while invisible.**

### A real geometry bug this exposed: web3's loop had nine stops for nine nodes

Nine equally spaced nodes on a full circle need a **tenth** stop for the arc to
close back onto the first. With nine, every resting position landed *between* two
nodes (stop 5 sat 0.02 from a stage boundary, so the centre copy rested at 20%
opacity, and stages 4 and 6 were never rested on at all). It is now
`states: STAGES.length + 1`, and `sp = p * STAGES.length` is an exact integer at
every stop.

### One reveal line for the whole site

29 content-reveal observers across six pages used **eight different trigger
points** — thresholds of 0.08, 0.1, 0.12, 0.15, 0.16, 0.2, 0.25, 0.4, 0.5 and 0.6
— so a short card appeared the instant it peeked over the fold while a tall
section waited until it was half way up the screen. **A ratio threshold depends on
the element's own height, which is why it could never be consistent.** All 29 are
now `{ threshold: 0, rootMargin: '0px 0px -15% 0px' }` — content commits when its
top crosses 85% of the viewport. The four remaining `threshold: 0` observers are
functional visibility gates and the day section's reading line; leave them.

### One motion language

The site carried **five easing curves and 161 distinct transition declarations**,
and **`app.html` had no `--ease` token at all** — it had drifted onto Material's
`cubic-bezier(.4,0,.2,1)` for the drawer and bare `ease` elsewhere, while the
other five pages shared `cubic-bezier(0.22,1,0.36,1)`. `index` also carried an
overshoot bounce (`0.34,1.56,0.64,1`), the one springy thing on the site.

Now, on all 13 pages and `trust.css`:

```css
--ease:      cubic-bezier(0.22, 1, 0.36, 1);   /* signature, decelerating   */
--ease-soft: cubic-bezier(0.16, 1, 0.30, 1);   /* longer tail, longer moves */
```

**Zero off-system curves and zero `transition: all` remain anywhere in the
project.** Durations were deliberately NOT mass-snapped: several are tied to JS
constants (`CYCLE_MS` and its `width 2800ms` rail), and a 100ms duration
difference is far less perceptible than a different curve.

### Frame cost — what was running the whole time

Profiled with real headless Chrome over real HTTP during a scripted 900-frame read
(`scratchpad/perf.js`, `profile.js`). Software rendering, so absolute figures are
pessimistic; the ratios are what matter.

| | before | after |
|---|---|---|
| `index` mean frame | 20.9ms | **18.2–18.7ms** |
| `index` p95 | **33.6ms** | 16.9–33.2ms |
| `index` frames >32ms (of 899) | **123** | **36–49** |
| `sanctuary` worst frame | **817–901ms** | 167–183ms |

Four things were running regardless of where the reader was:

1. **The palm's three.js scene rendered every frame for the whole page** — the
   largest single piece of work on the site, drawing sixty times a second while
   its section was twenty thousand pixels away. Now gated on a 60%-margin
   observer.
2. **The first `render()` of a 3D scene compiled every shader at once.** On
   sanctuary's loop that was a **901ms freeze at the exact moment the reader
   arrived** — the section froze solid for most of a second as it came into view.
   Both scenes now `renderer.compile()` and render once at 2x2 during
   `requestIdleCallback` after `load`, with a guard in the loop if the reader
   beats it. **If a third 3D scene is ever added, warm it the same way.**
3. **`animateTraveler` called `getPointAtLength` sixty times a second forever** —
   third most expensive thing in a CPU profile of an ordinary scroll. The route is
   now sampled once into a 260-point lookup table and the loop is gated on
   visibility. `getPointAtLength` no longer appears in the profile at all.
4. **The starfield built ~32 radial gradients per frame plus a rotated nine-screen
   fill, for the whole page.** The Milky Way is rendered once per resize onto its
   own canvas and blitted; glows are two pre-rendered sprites drawn with
   `globalAlpha`; the loop is gated on visibility.

`sanctuary`'s Four Foundations spine also read `offsetTop` in the same frame it
wrote `height` — a read-after-write layout thrash every frame. Row bottoms are
cached and re-measured on resize/load/fonts-ready. **The cache is built BEFORE the
track is created, because `cine`'s `.on()` fires its callback immediately on
subscribe.**

### Verified

- **42 responsive checks** (6 pages x 375/390/430/768/1024/1440/1920): **0
  horizontal overflow, 0 invisible content, 0 JS errors** at every one.
- **0 JS errors** on a full scroll of all six pages, down and back up. The only
  404 anywhere is the documented site-wide missing `favicon.ico`.
- **Every reveal fires**: index 8/8 dividers + 5/5 `.rv`, investors 18/18 + 55/56
  (the miss is the `display:none` mobile route fallback), sanctuary 10/10 + 25/25,
  web3 7/7 + 51/51, about 7/7 + 17/17.
- **Mobile paths intact at 390**: the day plates advance correctly with the clock
  (wake/07:00 → move/08:00 → learn/10:30 → reset/13:00 → connect/17:00 →
  integrate/19:00) on the class-driven path; all four foundations and all seven
  days render at opacity 1.
- **3D scenes animate throughout**: sanctuary's loop is **25/25 distinct frames**
  across the ride, captured through the existing `?shot=1` hook.
- **Judged by eye** at 1440x900: the Four Foundations resting frame and crossover,
  web3 participation, the web3 loop ring landing exactly on its CONVERT node, and
  index's pin3 callouts. **`index.html`'s intro locks scroll for ~1.65s — set
  `localStorage['daoasis-visited-at']` to `Date.now()` before navigating or every
  screenshot of that page is of the intro overlay.**

### Known, and deliberately not changed

- ~~`index` pin3's callout cards overlap the section's own lede copy.~~ —
  **fixed 2 September**, see the section directly below.
- `index` remains the most expensive page (its palm is a real three.js scene).
  Under software rendering it still shows ~40 frames over 32ms in a 900-frame
  sweep; on a real GPU this is a different picture.
- The hero plate-pass timing on `sanctuary.html` is **still** the one sequence
  never tuned by eye, unchanged from the August note.

### pin3 given a two-phase composition — 2 September 2026

`index.html` only. The callout collision listed as "known, and deliberately not
changed" above is fixed, and the section is better for it rather than merely
un-broken.

**The collision, measured.** `co2` points at the wellness ring on the LEFT of the
dashboard, so its card hangs left out of the frame and lands on the copy column.
At six widths (`scratchpad/overlap2.js` — the geometry of every card against every
text block, at nine points along the section):

| width | over the HEADLINE | over the lede |
|---|---|---|
| 1280 | 171 x 48px | 78 x 86px |
| 1366 | 158 x 74px | 65 x 68px |
| 1440 | 152 x 73px | 59 x 69px |
| 1680 | 172 x 73px | 79 x 69px |
| 1920 | 160 x 73px | 67 x 69px |

Present at **every width from 1280 up**, and because callouts latch once reached it
**never cleared** — the headline sat under a card for the last half of the section.
Only 1101–1200 was clean, and only because the narrower dashboard changes the sums.

**The geometry does not allow both.** The card would have to lose 172 of its 288px
to clear the column, and the column cannot go below ~380px without wrecking a 52px
Cormorant headline. Moving `co2`'s dot is not available either — it is pointing at
a specific feature of the photograph.

**So the copy hands over, which is what the lede's own last clause already
promises** ("see how, as you scroll"):

- **Phase 1** — the claim. Copy left, dashboard right, no callouts.
- **Phase 2** — the evidence. The copy steps aside (`--recede`, opacity plus a
  46px drift) and **the dashboard travels into the space it leaves**, so the
  annotated frame is centred rather than the same off-centre one with a hole in
  it. All four cards then sit around a centred dashboard.

`--recede` is scrubbed across **0.16 → 0.32**, closing just as `co2` begins to
arrive at 0.28. At the widest point of the crossover the column is at 0.125 and
the card at 0.09, so the two are never both legible.

`--shift` is **measured from the real column width and flex gap on resize**
(`(overlay.offsetWidth + gap) / 2`), not computed from the breakpoints — 217.5px
at 1101 rising to 238px at 1920. Never read per frame.

The three copy elements also lost their `transition: opacity 0.6s ease`. They are
written inline every frame, so that transition was the same second-clock bug
being fixed everywhere else in this pass.

**Verified: 108 frames across nine widths (1101/1150/1200/1280/1366/1440/1536/1680/1920)
x twelve points along the section — 0 overlaps, 0 cards off-screen**, and all four
callouts confirmed reaching full strength at every width. pin3's distinct-frame
count went **9/41 → 26/41**. 0 horizontal overflow at ten widths including both
sides of the 1100px breakpoint where `.pin3` becomes `display:none`.

> **Testing note, and it invalidated two earlier runs of this same check.** The
> paced value needs ~2s to cross this section, so a script that jumps to a scroll
> position and waits a fixed number of frames measures an **unconverged** frame —
> `co3` and `co4` read 0.00 at the very bottom of the pin and the check passes
> "clean" because the cards it should be testing were never drawn. Poll until the
> value stops moving, and **poll on a metric that actually changes late** (the sum
> of all four callout opacities). A first attempt polled `co1 + co4 + overlay`,
> which is constant from early on, so it exited immediately and reported a clean
> result for frames that had not been rendered yet.


### The investor route diagram — waypoints rebuilt from the data — 2 September 2026

`investors.html` only, section 05 ("Your habits become a Journey."). The six
waypoints were hand-placed with hardcoded SVG coordinates and were wrong in four
independent ways at once. Measured before the fix (`scratchpad/wp.js` reads the
node attributes and samples the real path with `getPointAtLength`):

| | km | x drawn | x true | error | node y | curve y | off route | stem |
|---|---|---|---|---|---|---|---|---|
| Bangkok | 0 | 52 | 52.0 | 0 | 190 | 190 | 0 | 36 |
| Ayutthaya | 76 | 218 | 130.3 | **+87.7** | 180 | 190.9 | **−10.9** | 38 |
| Hua Hin | 199 | 364 | 257.0 | **+107.0** | 132 | 132 | 0 | **94** |
| Surat Thani | 544 | 537 | 612.3 | **−75.3** | 212 | 156.2 | **+55.8** | **70** |
| Khao Lak | 782 | 780 | 857.5 | **−77.5** | 130 | 115.9 | **+14.1** | **96** |
| Phuket | 900 | 979 | 979.0 | 0 | 118 | 118 | 0 | 38 |

1. **x did not correspond to the kilometres.** The diagram's entire subject is
   distance, and it drew the 76km opening leg longer than the 238km run down the
   peninsula. x is now `52 + 927 * km / 900`, exactly.
2. **Three of the six nodes floated off the route line** — Surat Thani by 55.8
   units, which is visible. The route is now drawn THROUGH the nodes, so this
   cannot recur.
3. **The label side was arbitrary, not read off the curve.** Hua Hin and Khao Lak
   sit on crests and were labelled *below*, giving 94- and 96-unit stems that
   crossed the whole chart; Surat Thani sits in a trough and was labelled above.
   (The same lesson was learned on `web3.html` in August — "side comes from the
   node's own height" — and never applied here.)
4. **The above-line names did not share a baseline.** Ayutthaya 126, Surat Thani
   126, **Phuket 70** — 56 units higher than its own row.

**How it is built now.** Six data rows (name, km, role, side); x from km; a
**centripetal** Catmull-Rom through the six points converted to cubic Béziers.
Centripetal (alpha 0.5), not uniform: the spacing is very uneven — 78 units
between the first pair and 355 between the middle pair — and uniform
Catmull-Rom overshoots badly on spacing like that. The phantom end points are
**extrapolated, not duplicated**; duplicating makes the first control point equal
the start point and flattens both ends of the route into stubs.

Sides alternate, and each side has **one shared baseline**, so the names read
across as a row and the stems are the leader lines — which is the right way round
for a distance chart. `scratchpad/route.js` is the generator; if a waypoint ever
changes, regenerate rather than nudging the numbers.

The 30-unit gap between a small label and the Cormorant name ABOVE it is kept —
that is the documented minimum from the August build (the ascent box reaches
nearly a full em above the baseline). 20 is enough everywhere else.

**Verified** at 1101/1200/1280/1440/1680/1920: x error 0.0 and node-off-curve 0.0
at all six waypoints, stems 24–30 units (were 36–96), **0 text collisions** and 0
elements escaping the viewBox at every width. Smallest rendered type is 10.67px at
1101, above the site's 10px floor. 0 horizontal overflow at ten widths including
both sides of the 1100px breakpoint where the diagram hands over to the itinerary
list; that list is a vertical stack and carries the same six km values, so it was
not affected. 0 JS errors sitewide; all 18 investor dividers and 55/56 `.rv` still
reveal (the miss is the `display:none` mobile route fallback, as before).

> **The same route data lives on three pages.** `app.html`'s quest map was already
> correct — its waypoint thresholds are exactly km/900 (0, 0.084, 0.221, 0.604,
> 0.869, 1.0). **`index.html`'s hero route is a different set of towns** —
> Bangkok, Hua Hin, Krabi, Phang Nga, Phuket, with day-based subs rather than
> kilometres, and Krabi and Phang Nga are not on the canonical route at all. It
> makes no distance claim so it is not self-contradictory, but it does depict the
> same journey with different stops. That is a content decision, not a geometry
> defect, and it was left alone.


### Upload

`index.html` · `app.html` · `sanctuary.html` · `web3.html` · `investors.html` ·
`about.html` · **`js/cine.js`** · **`css/trust.css`**. The seven trust HTML pages
did not change. No image changed.

---

## Brand Kit 2026 built — August 26

**`C:\Users\Lenovo x270\Desktop\DAOasis Brand Kit 2026\`** — a fifth sibling
project, same pipeline as the Whitepaper. 15 pages, **A4 landscape**, 1.88 MB,
audit clean at 0, all 15 pages looked at. See that project's own `README.md`.

It exists because the alignment audit removed the Brand Kit card from
`investors.html`: the only kit then in existence was the retired May 2026 one
(retreat-first positioning, Annex B6). **The card is now reinstated and points
at the new kit**, which is app-first. The `DOCS` comment in `investors.html`
records this so the entry is not removed or restored blindly again.

### Two findings that apply beyond that project
1. **`optimise.js`'s `hasAlpha()` is wrong for indexed PNGs, in all five
   projects.** It tests only colour types 4 and 6. `img-02.png`, `img-09.png`
   and `img-09-white.png` — the lockup and both palm marks — are **colour type
   3 with a `tRNS` chunk**, so they were called opaque and flattened onto JPEG,
   which puts a solid box behind the logo. Fixed in the Brand Kit's copy by
   walking the chunk list; **the other four copies still carry the bug.** It has
   never bitten there only because none of them puts a logo on a plate.
2. **The ivory ink weights fail on warm stone.** `--ink-3`, `--ink-4` and
   `--gold-ink` are tuned for #F7F4EE; on #E8E1D6 they measure 4.29 / 4.06 /
   3.81, all short of AA. Any page using a stone ground needs its own weighted
   set — the Brand Kit uses #5A544A / #5F594F / #7F4F22.

### The eye pass caught four things the clean audit did not
Mislabelled type specimens (slabs said 62pt/31pt, specimens rendered 34pt/22pt);
hex codes set in Cormorant's default old-style figures, so `#F7F4EE` hung its 7
and 4 below the baseline; the warm-white swatch reading as an empty box against
its own page ground; and "sand" named in two captions when the palette page
lists six grounds and sand is not one of them.

**`--sand` (#E7E0D4) is an `about.html`-only value**, two points off warm stone,
and is deliberately NOT in the kit's six. Do not promote it.

---

## Pinned scroll cut back site-wide — 3 September 2026

Reported as "the animation isn't quite hitting", with a specific complaint that
the home hero "is still there when users scroll back up". Both were real, and
they were the same problem seen from two angles.

### The measurement that drove everything

How much of each page is **held** — the viewport frozen while something plays:

| page | before | after |
|---|---|---|
| index | 30.0 screens, **75% held** | 19.6 screens, 56% |
| app | 27.3 screens, 59% | 18.6 screens, 40% |
| sanctuary | 45.4 screens, 62% | 34.7 screens, 51% |
| web3 | 35.4 screens, 58% | 25.9 screens, 42% |
| investors | 39.1 screens, **0%** | untouched |
| about | 14.2 screens, **0%** | untouched |

**35,307px of scrolling removed across the four pages.** No section was
redesigned, no copy changed, no animation logic rewritten.

For scale: the Rockstar GTA VI page is ~9 screens with **nothing** pinned
(measured 3 Sep — it runs GSAP 3.12.5 + Lenis 1.3.17). And this project's own
`investors.html` / `about.html` pin nothing and are the most composed pages
here. The problem was never the individual animations; it was five pinned
sequences in a row on the homepage with almost no ordinary reading between.

### The home hero: pin AND route removed

`maxProgress = Math.max(maxProgress, raw)` meant the route only ever advanced.
Measured: fresh load `strokeDashoffset` 737.8px; after scrolling past, 0px;
**scroll back to the very top, still 0px.** Once anyone passed the hero it was
frozen on its finished frame for the rest of the visit — and the 400vh pin held
them for 2,700px of that dead frame on the way back up.

Removing the latch would have fixed the freeze but not the hold, and the route
was the only reason the section needed four screens. Gone: `.journey-wrap`, the
SVG, `.wp-*`, `#routeMaskPath`, `waypoints`, `wpEls`, `placeLabels()`,
`buildJourney()`, the traveller LUT and the whole route timeline (209 lines of
JS). Kept: the background's wall-clock `breathe`.

**The hero is now one unpinned viewport** — photograph, headline, two CTAs —
and it is much stronger for it. The journey is still told twice further down
(`.pin4` desktop, `.journey-mobile-section` mobile), so nothing was lost.

`__startHeroWaypointsNow` is deliberately not redefined; both call sites are
`if(window.__...)`-guarded and simply never fire. `#pinContainer` survives as a
plain `position:relative` wrapper — harmless, and removing it is pure churn.

### The house rate was halved, 62-68vh/beat -> 32-36vh

Section height is still `beats x rate + 100vh`. Desktop values only — every
mobile override was left for the mobile pass.

| | before | after | beats |
|---|---|---|---|
| index palm | 516vh | 290 | 6 |
| index daily | 372 | 230 | 4 |
| index journey | 576 | **350** | 7 |
| index principle | 372 | 230 | 4 |
| app hero | 515 | 200 | 3 |
| app quest route | 600 | 320 | 6 |
| app marketplace | 500 | 230 | 4 |
| sanctuary hero | 620 | 200 | 3 |
| sanctuary foundations | 360 | 230 | 4 |
| sanctuary seven days | 580 | 350 | 7 |
| sanctuary 3D loop | 460 | 330 | 7 |
| sanctuary `.day-entry` | 88vh each | 70vh | 9 slots |
| web3 hero | 600 | 200 | 3 |
| web3 participation | 560 | 290 | 6 |
| web3 bridge | 460 | 260 | 5 |
| web3 loop | 420 | 340 | 9+1 |

The two seven-stage sequences keep the most room per beat (36vh) on purpose.

### Verified
Every beat still reached on all four pages. Smoothness (the 1 Sep distinct-frame
metric, 41 samples per pin): index palm 34/41, daily **39/41** (was 20-23),
journey 30/41, principle 36/41 — all far above the ~12 steppy threshold.
0 JS errors and 0 horizontal overflow at 1101/1280/1440/1680/1920 on all six
pages. Reveals and dividers unchanged from the 1 Sep baseline: index 5/5 + 8/8,
sanctuary 25/25 + 10/10, web3 51/51 + 7/7, investors 55/56 + 18/18, about 17/17
+ 7/7. Only 404 anywhere is the site-wide missing `favicon.ico`.

> **Measurement trap, and it produced three false regressions before it was
> caught.** Sweeping a pin on a fixed pixel grid and taking each item's peak
> opacity is *not* a correctness test: shortening a section means the same grid
> samples fewer points per beat, so items get caught mid-transition and read
> low. `.market-scene` measured min 0.81 and `.seven-day` min 0.60 that way —
> both "regressions" evaporated (1.00 and 0.96) once each sample **polled until
> the rendered values stopped changing** before reading. Always let the pacing
> converge, and A/B against a backup served on a second port before believing
> any regression.

### Still to do
- **Mobile has not been touched.** Every `@media` pin-height override still
  carries its old value (`app.html` 320/420/400vh, `sanctuary.html` 500vh,
  `web3.html` 480/380vh, `.day-entry` 68vh).
- `index.html`'s daily-experience section is still a UI screenshot floating in
  black, and the mockup it uses (`img-10.jpg`) shows **"Reward Credits $0.100 ·
  24H change ↑24%"** — a price and a 24h move on DRC, which contradicts the
  content rules. Flagged and deliberately deferred; it is a content job.
- Pre-change copies of all four pages are in the session scratchpad under
  `backup/`, not in the project folder.

### Corrected the same day — the first cut was far too aggressive

Reported back as "scrolling seems too rapid on every animation now, way too
fast". Correct, and the cause was a bad assumption: **the site never had one
house rate.** Forcing every section to 32-36vh/beat was not a trim, it was a
5-6x speed-up on the sections that mattered most.

| | original vh/beat |
|---|---|
| index palm / journey / principle | 82 - 93 |
| app quest / marketplace | 100 - 125 |
| **app hero** | **172** |
| **web3 hero** | **200** |
| **sanctuary hero** | **207** |

The three heroes were the slowest, most cinematic things on the site, and the
flat rate compressed them hardest. Replaced with **~80% of each section's own
original height**, so every sequence keeps its intended character and is only
modestly tighter:

index palm 415 · daily 300 · journey 460 · principle 300 · app hero 410 ·
quest 480 · marketplace 400 · sanctuary hero 495 · foundations 290 ·
seven days 465 · loop 370 · `.day-entry` 78vh · web3 hero 480 ·
participation 450 · bridge 370 · loop 340.

Result: index 20,990px (78% of original — the extra is the removed hero pin),
app 88%, sanctuary 89%, web3 89%. Held: index 63%, app 54%, sanctuary 58%,
web3 52%.

> **The lesson: a per-beat rate is a property of a section, not of a site.**
> Do not normalise these to a single number again. If they need to move,
> scale each one against its own previous value.

### The palm was ~150px left of centre on wide screens

`placeLogo()` had `centreXpx = w * 0.43`, tuned at ~1440. The two things the
mark sits between do not scale together — the copy column is a fixed 460px
inside an 8% pad, while the card dock is pinned to the right edge at
`min(30vw,380px)` — so the true centre of the gap drifts from 0.54 at 1280 to
0.53 at 2560 while a fixed 0.43 drifts the other way. At 1820 the mark sat
185px left of the gap centre and its fronds ran through the "Why DAOasis
matters now" headline.

Now measured from the same numbers the layout uses:

```
copyRight = w*0.08 + 460          cardsLeft = w - w*0.06 - min(w*0.30, 380)
centreXpx = min((copyRight+cardsLeft)/2,  cardsLeft - sizePx/2 - 12)
```

The clamp matters: below ~1500 the gap is narrower than the mark, so centring
would push it under the cards. Clamped, it sits over the copy instead — the
right way round, because `.overlay::before` already scrims the left 58% and
nothing protects the cards. At 1280 the clamp binds at 0.41, so narrow
desktops are unchanged and only wide screens are corrected. Verified by eye at
1820 and 1440.

### The landing now plays on arrival, not on a timer

Was a 3-day localStorage window (`daoasis-visited-at`), which meant a genuine
fresh visit within three days — from a link, a search result or a bookmark —
silently lost the landing.

It is now a **same-origin referrer test**, in both the `<head>` (pre-paint, to
avoid a flash) and the body script (`cameFromWithinSite`). **The two must stay
in step.** The landing plays on every arrival from outside; it is skipped only
when the reader came from another page on this site, so "Home" lands on the
home page. A missing or stripped referrer reads as an outside arrival and the
intro plays — the safe direction. `daoasis-visited-at` is gone entirely.

> **Testing note:** scripts can no longer skip the intro by seeding
> `localStorage['daoasis-visited-at']`. Pass a same-origin referrer instead —
> in puppeteer, `page.goto(url, { referer: 'http://localhost:PORT/app.html' })`.

Verified: fresh arrival SHOW · external referrer SHOW · from app.html SKIP ·
from sanctuary.html SKIP. Re-swept after all three fixes — 0 JS errors, 0
horizontal overflow at 1280/1440/1920 on all six pages, reveals and dividers
unchanged (index 5/5 + 8/8, sanctuary 25/25 + 10/10, web3 51/51 + 7/7,
investors 55/56 + 18/18, about 17/17 + 7/7).

### The wellness-shift stat cards now take the centre — 3 September 2026

`index.html`, the `.pin` (palm) section only. Requested: the cards should
"pop to the center nice and smooth, allow scroll time to read and then settle
on their place on the right."

Four phases per card, driven entirely by the paced scroll value:

```
inStart -> inEnd    flies in from the right and lands at frame centre
inEnd   -> holdEnd  HELD at centre, full size — the reading beat
holdEnd -> setEnd   travels out to its dock slot and scales back to rest
after               sits in the right-hand dock with the others
```

`CARD_WINS` = `{0.10,0.20,0.32,0.40}` · `{0.36,0.46,0.58,0.66}` ·
`{0.62,0.72,0.84,0.92}`. Section height went **415vh -> 480vh** to pay for the
holds; each hold is ~12% of the scrub, about **510px of scrolling** at
1440x900. **If this section is ever shortened again, shorten the travel
phases and leave the holds alone** — the hold is the entire point.

**The old code refused to do this on purpose**, and the objection was sound: a
large opaque card parked over the mark hides the mark exactly when it is worth
looking at, three times running. It is handled rather than ignored —
`centredK` (the max `k` across the three cards) dims the dust to 45% while a
card holds the frame, and releases it as the card leaves. Measured: dust 0.48
between cards, 0.38 while one is centred, 0.85 once all three have settled.

**The centre target is the same free-gap formula the palm uses**, not the raw
viewport centre — `(copyRight + cardsLeft) / 2`, which at 1440 is x=774. The
viewport centre (720) would put the card over the copy column's right edge.

**`panelHome` is measured with the card's transform cleared.** The dock is a
`space-between` flex column, so all three sit at different heights and each
needs its own `dy`; and `getBoundingClientRect` reports the *transformed* box,
which is useless here because every card is mid-transform for most of the
section. Re-measured on resize, on `load` and on `fonts.ready` — never per
frame.

Verified at 1440x900 by driving the section at 21 positions with the pacing
allowed to converge at each: card 1 centred at x=774 across t 0.20-0.30, card 2
0.45-0.60, card 3 0.70-0.85, all three resting at x=1164 from t=0.95. Judged by
eye at 1440 and 1820. 0 JS errors, 0 horizontal overflow at 1101-1920, reveals
5/5 and dividers 8/8, every callout / journey node / principle statement still
reaching full strength. Home page is now 21,575px (24.0 screens).

## Seven section fixes from the review list — 3 September 2026

### 1. The Rhythm section was genuinely broken (sanctuary)
The seven days are `position:absolute; inset:0` — stacked in ONE box — and the
cross-fade was `1 - |pos - n|`. At the midpoint between two days that puts both
at 0.5, so "Day Six / Connect" printed straight through "Day Seven / Integrate"
with the numerals ghosting into each other. Present for a third of every
handover.

**A cross-fade is right for a LIST whose rows occupy different places, and
wrong for stacked type.** Now: full within 0.30 of its own stop, gone by 0.44,
so there is a brief clear frame — the page turning — and never two days
legible at once. Same rule already used by web3's loop copy and this page's day
readout. Verified: max days legible at once across 41 samples = **1**.

### 2. "Sanctuary Life" removed (sanctuary)
Six rows — Movement, Recovery, Learning, Nature & Reflection, Community,
Nourishment — that were **the third telling of one taxonomy**. The Structure
already names Recovery / Learning / Accountability / Community; A Day already
walks Wake / Move / Nourish / Learn / Reset / Explore / Connect / Integrate /
Rest. Every row restated one of those and added nothing.

The divider below it now bridges the IMMERSION photograph into The Place, so it
changed `light bg-ivory` -> `dark bg-mineral` with the white mark. **A black
palm mark on a dark photograph is invisible** — check this whenever a section
between two dividers is removed. Page 40,894px -> 32,199px.

### 3. The Structure got photography (sanctuary)
It was a highlighted list on flat green — correct content, but it read as a
table of contents on a page where every other section carries an image. A
plate now sits in the right of the stage and cross-fades per foundation
(rest / Learn / Integrate / connect), driven by the same paced value as the
rows. **A plain triangle cross-fade is correct here** — two photographs at
half strength read as a dissolve; two blocks of type read as a double
exposure. That is the whole difference from item 1.

`.found-list` reserves the plate's column with `padding-right`, so no row
geometry changed and the spine's cached measurements still hold. **The list's
opening rule moved to `.found-item:first-child`** — padding does not shrink a
border box, so a `border-top` on `.found-list` drew a hairline across the
photograph.

### 4. Living Ecosystem — the phone was never the size it looked (app)
`19.png` is an 1800x1800 transparent canvas in which the phone occupies only
**x 30.56-69.33%, y 9.89-90.11%** (measured with sharp, matching the figures
already recorded for web3's `.dev`). With `width:100%` the phone rendered
**122px wide inside a 315px box** — that, not the container, was why it read as
a thumbnail. Now cropped (`width:257.88%; left:-78.80%; top:-12.33%` in a
`698/1444` box) and **287px wide, 2.35x larger**. The column also went
1fr -> 1.15fr.

> **`overflow-x: clip` on `.eco-layout` is load-bearing.** The canvas overhangs
> its wrap by ~79% each side; on a handset that pushed the document
> **113-121px** wider than the viewport. `clip`, not `hidden` — it contains the
> overhang without creating a scroll container, so the drop-shadow below the
> phone survives. Re-verified against the baseline on a second port: mobile
> overflow is now **20/16/13/6 at 375/390/430/768, identical to baseline**.

New `.eco-tiles-head` above the grid — "The six habits" + "Select one — or
watch them cycle". The tiles cycle on a timer AND are clickable, and nothing
said so.

### 5. Track what matters — cards off the image, and a running head (index)
**Three of the four cards were printed over the product shot.** Measured at
1440x900: co1 covered the top 60px, co3 overlapped by 156px, co4 sat on the
bottom 40px. The dots were right — they annotate features — but the connectors
were 22-30px, nowhere near enough to carry a card past a 558px-wide dashboard.

Connectors are now sized against the largest `.dash-wrap` can be, so clearance
holds at every width: co2 104px, co3 200px, co1 100px. **co1 changed direction
entirely** — it pointed UP, and there is no room up there: the dashboard is
vertically centred in a 100vh stage, so a 168px card above it lands at y=-55.
Off-screen at every width from 1101 to 1920. It joined co2 on the left flank at
`left:16%`, on the same top band it always named.

**`.track-runhead` is new.** The copy column receded to nothing and handed the
frame to a screenshot alone in black for the whole second half of the section —
that was the "very bare" complaint. The running head fades in on the same
`--recede`, so it is one hand-over, not two animations on separate clocks.

Verified at 1101/1280/1440/1680/1920: **card-over-image overlap 0px at every
width, 0 cards off-screen**, co1 clears co2 by 82px.

### 6. Web3 hero — the eight layers are drawn in the brand now
Every mark was the same 1px warm-white tick and every label the same white
caps, so the eight NAMED layers were indistinguishable from the anonymous
participation ticks either side of them and read as scale marks on a ruler.

A named layer now gets a gold node with the page's own glow, a heavier
gold-tinted stem, and a gold rule under its name drawn to the name's own width.
Unnamed ticks are unchanged — the contrast between the two is what makes the
layers read as layers. `trackedText()` now RETURNS its drawn width; canvas
letter-spacing is unreliable across engines, so that function is the only place
that knows how wide a tracked label actually ends up.

### 7. Still open — the seven-day 3D ride
Reported as "I love it, but it's very fake, nothing there is real." Not
actioned: making a procedural three.js scene read as photographic is a
different order of work from everything above, and the options (improve
materials and lighting / replace with photography / leave it) are a design
decision, not a defect. Flagged for a decision.

### Verified after all six
13 pages x 7 widths = 91 measurements: **0 horizontal overflow except
app.html's documented pre-existing mobile figure, which is byte-identical to
the baseline**. 0 JS errors anywhere. Only 404s are the known `favicon.ico` and
`about-hero-mobile.jpg`. Reveals and dividers: index 5/5 + 8/8, sanctuary
18/18 + 10/10 (was 25/25 — the seven removed reveals are the deleted section),
web3 51/51 + 7/7, investors 55/56 + 18/18, about 17/17 + 7/7.

## "Way too rapid" — the real cause was reduced motion — 3 September 2026

Reported three times, and the first two fixes barely touched it because they
were aimed at the wrong thing. Adjusting pin heights could not fix this.

### The measurement that found it

`index.html`'s journey (`pin4`), 1440x900, one 100px wheel notch, measuring the
rendered fill:

| | movement per notch | time to settle |
|---|---|---|
| `prefers-reduced-motion: no-preference` | 10.2px | 321ms |
| **`prefers-reduced-motion: reduce`** | **40.6px** | **1ms** |

**Four times the movement, delivered instantly.** Under reduced motion
`cine.js` emitted the raw scroll position and the entire pacing engine — the
speed cap, the damping, the magnet curve — never ran at all.

**"Show animations in Windows = off" reports `prefers-reduced-motion: reduce`,
and a great many people have it set** without intending to opt out of
scroll-linked storytelling. `index.html`'s palm section already said exactly
this in a comment; `cine.js` had never been brought into line with it.

This also explains why the earlier height changes disappointed: with pacing
bypassed, the ONLY thing setting the speed is the raw scroll mapping, so
shortening the pins made it 4-5x worse and restoring them to 80% still left it
a quarter faster than it had ever been.

### Two bypasses, and the second one was the one that mattered

1. `tick()` — `if(reduced || this.o.off){ this.emit(raw); return; }`
2. **`get()` — `return (reduced || this.o.off) ? this.rawV : this.value;`**

Removing (1) alone changed **nothing measurable** — still 30.7px in 15ms —
because every consumer reads the scene through `get()`/`pos()`, so the unpaced
value reached them anyway. Both had to go.

> **If a paced value ever appears not to be pacing, check the READ path, not
> just the write path.** `tick()` can be perfect and still be invisible.

### The reasoning for keeping pacing under reduced motion

This is scroll-LINKED motion: it moves only while the reader is actively
scrolling and stops the instant they stop. It is their own input played back,
not motion the page performs by itself. The pacing *damps* it — so bypassing
it did not reduce motion, it removed the smoothing and made the same motion
happen faster and more abruptly, which is worse for vestibular sensitivity,
not better.

Reduced motion is now handled in ONE place, `Track.prototype.times()`, where
`reducedScale: 0.55` shortens the durations. The long cinematic dwell is what
reads as scroll-jacking, and that is the part someone asking for less motion
actually wants gone. Genuinely autonomous motion — the intro, ambient loops,
decorative pulses — is still switched off by each page's `@media` blocks,
which is where that belongs.

Result: **30.7px / 15ms -> 9.8px / 335ms.** Reduced motion now behaves within
noise of the normal path.

### Also slowed, for everyone

- `TIMING` step/back raised ~30%: epic 1150/880 -> **1500/1150**, major
  950/740 -> **1250/960**, simple 720/600 -> **950/780**. For any gap larger
  than ~1.4% of a section the speed cap binds, so this — not section height —
  is what sets the pace once the reader is inside a section.
- `follow` 0.15 -> **0.11**. At 0.15 a small gap closed 85% in ten frames, so
  short moves (the ones the cap never touches) arrived almost instantly and
  read as snappy next to the long ones.
- **Every pin height restored to its original value.** index palm 580 (516
  original + 65 for the card holds), daily 372, journey 576, principle 372;
  app 515 / 600 / 500; sanctuary 620 / 360 / 580 / 460 and `.day-entry` 88vh;
  web3 600 / 560 / 460 / 420. The home hero stays unpinned — that was a
  separate fix and is not part of the pacing.

### Verified
Every beat still reaches full strength on all four pages **in both motion
modes**, confirmed with convergence polling (the coarse fixed-grid sweep now
reports false zeros, because the slower pacing needs far longer than 85ms to
settle — same trap as before, and it produced four more false regressions).
0 JS errors, 0 horizontal overflow at seven widths on five of six pages, and
app.html's mobile figure is byte-identical to baseline. Reveals and dividers
unchanged.

---

## Mobile pass — 4 September 2026

Brought mobile up to the desktop work of 3 September. Changed: `app.html` ·
`sanctuary.html` · `web3.html`. **`index.html` and `js/cine.js` were not
touched** — index's pins are all `display:none` below 1100px and already had
their mobile fallbacks, and the pacing engine is width-agnostic.

Verified with real headless Chrome over real HTTP, A/B against a copy of the
3 September build served on a second port. **42 mobile checks (6 pages x
320/360/375/390/414/430/768): 0 horizontal overflow, 0 JS errors.** Only 404s
are the documented `favicon.ico` and `about-hero-mobile.jpg`. Desktop
re-audited at 1280/1440/1920: 0 overflow, 0 errors, no new sub-10px type.

### 1. app.html was rendering 3-5% ZOOMED OUT on every phone

The horizontal overflow documented against this page for weeks — "~11-20px at
narrow widths", "the quest-route SVG (`#questPathFill`, `#wpC2`)",
"non-deterministic", "a pre-existing race" — **is none of those things, and
the recorded diagnosis was wrong.** It is one element.

`.learn-track-card` opens at `perspective(700px) rotateX(22deg)`. A rotateX
under perspective brings the near edge toward the camera and **scales it up**,
so the element's painted box is wider than its layout box: a 328px card paints
422px. `.learn-track-grid` is the one card container with no padding of its own
(`max-width:1200px; margin:0 auto`), so its cards fill the section's content
width exactly and the surplus goes straight past the viewport edge.

It read as non-deterministic because `.show` sets `rotateX(0deg)` — the
overflow exists from load until the learning section reveals, then disappears.
Scrolling past and back returns the document to its true width.

**The consequence was much worse than a sideways scroll.** A mobile browser
scales the layout viewport down to fit an overflowing document, so:

| viewport | 360 | 375 | 390 | 430 |
|---|---|---|---|---|
| layout viewport before | 379 | 395 | 406 | 443 |
| effective scale | **0.950** | **0.949** | **0.961** | **0.971** |
| after | 360 | 375 | 390 | 430 — all 1.000 |

Every element on the page — all type, the Living Ecosystem phone, every card —
was rendered **3-5% smaller than designed on every mobile device**, purely
because one card's pre-reveal transform was 16px too wide.

**Fix:** on mobile the tilt is dropped for all four card reveals on the page
(`.learn-track-card`, `.reward-use`, `.reward-pipe-node`, `.booster-card`) in
favour of a plain `translateY` rise. The other three only escaped the bug
because they sit inside padded containers — one padding change and it is back.
It is also right on its own terms: at full-bleed width a 22deg card flip reads
as a wobble, not depth, and it costs a low-power device a 3D composite on four
elements.

> **The block sits at the END of the stylesheet deliberately.** `.reward-use`
> and `.reward-pipe-node` are defined below `.learn-track-card`, so an
> override next to the learning rules would lose to them at equal specificity.
> Both the resting AND the `.show` state are restated, because
> `.learn-track-card.show` is (0,2,0) and outranks a single-class override.

**`docH` is byte-identical before and after (27,929px).** The page did not get
longer; it stopped being zoomed out. A "screens" count that RISES after a fix
like this is the viewport returning to 1:1, not a regression — compare
`window.innerWidth` against the emulated width before believing it.

### 2. The Structure had no photography on mobile at all

`.found-plate { display: none }` below 900px, so the section the 3 September
pass was asked to make less bland was still four rows of type on flat green on
the device most people will read it on.

The old comment was right that a single cross-fading plate has nothing to
track when mobile opens all four foundations at once — but that is an argument
against the desktop COMPOSITION, not against photography. Each row now carries
its own plate.

- **No new markup.** `.found-item::before` is the live row's wash on desktop
  and is switched off on mobile anyway, so the pseudo is free here; and
  because `.found-item` is a grid, the pseudo participates as its first grid
  item and reserves its own height with no positioning at all. The green wash
  the desktop plate gets from `.found-plate::after` is a second background
  layer here rather than a second element.
- **16/10, not the desktop plate's portrait.** A tall plate in a 328px column
  runs most of a viewport on its own and pushes the name it belongs to off the
  bottom of the screen.
- **The wash is deeper than desktop's** (0.20->0.52 becomes 0.34->0.64). The
  desktop plate is a 25vw accent beside the type; mobile gives the same
  photograph the whole column, so the same alpha is not equivalent. Judged by
  eye at 390.
- Revealed by an IntersectionObserver on the site's one reveal line
  (`threshold 0, rootMargin 0 0 -15% 0`), registered unconditionally — `.in`
  does nothing outside the mobile media query, so it needs no resize handling
  and cannot strand a row if the reader rotates the device. `<noscript>`
  forces the plates visible.
- Verified 4/4 revealed on a continuous sweep at 390.

> **Still open, and it is a content call, not a defect.** `Integrate.jpg` is
> mapped to **Accountability** (Tracking · Reflection · Behavioural
> implementation) and it is a bonfire at sunset. At 25vw on desktop it is a
> small accent; at full width on mobile the flame is a near-white specular
> that no dark-green overlay can subdue, and it takes the section over. It is
> also the wrong subject — and `connect.jpg` (Community) is a second
> group-at-dusk frame, so the two read as near-duplicates. `clarity.jpg` came
> free when Sanctuary Life was removed and fits Accountability far better.
> **Not changed: the mapping is shared with desktop and swapping it is a
> brand decision.**

### 3. The 3D loop was the one pin with no mobile height at all

Its height was an inline `style="height:460vh"`, **which no media query can
reach without `!important`** — that is why it was missed. Every other pin is
cut for a handset (sanctuary hero 620->500, app hero 515->320, quest 600->420,
market 500->400, web3 hero 600->480); this one held a phone reader for the
full desktop 460vh, 4.6 screens of first-person WebGL.

Height moved to CSS on `#loopOuter` and given **370vh** on mobile (80% of
desktop, in line with the two heroes). Verified all seven day readouts still
reached at the new height, 0 JS errors.

> web3's `.part-outer` / `.bridge-outer` / `.loop-outer` look like they have
> the same gap but do not — they go `height:auto` and unpin below 1000px.
> sanctuary's `.found-outer` / `.seven-outer` likewise. Only `#loopOuter` was
> genuinely unhandled.

### 4. web3's hero: the named layer had no node for half the sequence

The 3 September gold-node treatment reached mobile only by accident and was
internally inconsistent there.

- **The bug.** The node's weight came from `labA = clamp01((z - 2.0) / 0.65)`,
  which is zero below z = 2.0 — but the mobile name walk runs down to z = 1.2.
  So for the back half of the sequence the page named a layer with **no node
  lit anywhere**, and for the front half the name (drawn at frame centre) and
  the node (at its own x) were two unrelated objects that happened to share an
  x coordinate.
- **The fix.** The centre tick is the only mark always on screen (its world x
  is 0, so its screen x is exactly `cx` at every zoom), and measured, at most
  three ticks are on screen at any point in the walk — so neighbours can never
  carry a label of their own on a narrow frame. On mobile the centre tick is
  now the **reading head**: name on it, gold rule under the name, node lit
  beneath, and the eight layers pass through it as the camera pulls back. One
  object instead of three, and ONE label-drawing path for both compositions
  instead of a separate mobile block with no rule and no brand colour.
- **The field was nearly empty.** `Z0 = 4.8` was measured against a 1440px
  frame and never re-checked; a 390px frame is 3.7x narrower, so at the same
  `GAP` the nearest neighbour sits 312px off centre in the middle of the
  pull-back. Measured at p=0.42 the mobile hero carried one gold thread and
  two hairlines for most of a viewport of scrolling — the same failure the
  desktop `Z0` fix was for. Mobile now gets `GAP 85` / `Z0 3.2`; at p=0.60 the
  field is twelve threads with no crossings.
- **`GAP` is bounded, not chosen freely:** a thread's excursion is amp (16-38)
  plus amp2 (6-14), up to 52 world units, so any spacing near that lets
  neighbours cross and the weave turns to noise. 85 keeps a clear margin.
- `tickA` is keyed to `Z0` on mobile. Hard-coded `/3.2` against a desktop `Z0`
  of 4.8 gives 1.19 at the open (clamped to 1); the same 3.2 against a mobile
  `Z0` of 3.2 gives 0.69, so the marks would arrive already faded.

> **`GAP` and `Z0` are now `let`, set in `resize()`, and DECLARED ABOVE IT.**
> `resize()` is called immediately below its own definition, which is before
> the point these used to sit — a `let` read from a function running during
> its temporal dead zone throws rather than reading undefined. Do not move
> them back down.

Verified by wrapping `CanvasRenderingContext2D.fillText` and recording what is
actually painted across 61 scroll positions: **8/8 layers painted on mobile,
8/8 on desktop** (desktop unregressed).

### 5. Mobile type raised to the site's own 10px floor

`.hero-plate-cap` (sanctuary) and `.hero-mark` (web3) dropped to **9px** in
their mobile blocks, purely so a `white-space: nowrap` line would fit.

**Spend the tracking, not the type size.** Both are now 10px at 0.14em instead
of 9px at 0.2em, and centred with `left:0; right:0` rather than `left:50%` +
`translateX(-50%)` — half the stage is not enough room to centre a nowrap line
in, and the overflow is silent. Measured ink extents (Range client rects, NOT
a clone — a clone inherits the class's `right:0` and reports nonsense):

| | 320 | 360 | 390 |
|---|---|---|---|
| `.hero-mark` | 239px ink, 41..279 | 239px | 239px |
| `.hero-plate-cap` | 271px ink, 25..295 | 271px | 271px |

Both hold on a 320px screen with margin to spare.

`.eco-tiles-hint` lost its `nowrap` below 520px — at 10px/0.22em it needs
~278px, inside 3px of the column at 320. The nowrap existed so the hint did
not break awkwardly BESIDE the title; once the pair has wrapped onto two lines
that reason is gone.

**Deliberately left at 9px:** `index.html`'s `.kicker` and `.scroll-hint`.
Those are the measured 22 August decision (at 9.5px/0.26em the kicker wrapped
while its rules stayed on the first line and read as a broken element) and
must not be "fixed".

### Mobile page length — measured, and left alone by decision

At 390x844, after this pass: index 21.3 screens · about 23.2 · app 33.1 ·
sanctuary 33.0 · web3 32.8 · investors 63.1. Held (viewport frozen while
something plays): sanctuary 50%, app 34%, web3 26%, index 27%.

Sanctuary is **net flat** — the four new plates cost almost exactly what the
loop reduction saved (docH 27,787 -> 27,846, +0.2%) — so it gained photography
and lost 0.9 screens of WebGL ride for nothing.

The rest was **not** changed, by decision: mobile overrides sit at 62-83% of
their desktop values and the 3 September lesson stands — a per-beat rate is a
property of a section, not of a site. Reducing app/sanctuary/web3 below ~33
screens on a phone means cutting content (sanctuary's nine day-entries alone
are 7.75 screens), which is a separate call.

### Pre-existing on mobile, confirmed NOT caused by this pass
- **Sanctuary's divider marks clear their nearest text by only 16px at 375 and
  390**, against the documented 49px floor. Identical on both builds when
  measured side by side. The 49px figure was established on desktop and never
  re-checked on a handset.
- 9px type that is the same on desktop and therefore a site-wide type-scale
  question, not a mobile regression: `.quest-hd-kicker`, `.wp-info-num` and
  `.wp-label-km` (app), `.bh-sub` and `.bridge-step-i` at 9.5px (web3),
  `.source` at 8.5px (index).
- `investors.html`'s `.pm` table reports as "escaping" to any audit that only
  treats `overflow:hidden`/`clip` as clipping — it sits in a `.pm-scroll` with
  `overflow-x:auto`. Not a defect.

### Still open — unchanged by this pass
**The two mockups still contradict the content rules, and mobile has made it
worse.** Enlarging the Living Ecosystem phone means `app.html`'s mobile view
now leads with **"DVT Price $0.100 · 24H change up 24% · Buy DVT · DRT
earned"** as the single largest element on the page; `index.html`'s "Track
what matters" still uses `img-10.jpg` ("Reward Credits $0.100, 24H up 24%").
DRC has no price, $DVT is not a traded instrument, DRT is retired terminology.
There is still no clean dashboard mockup in the repo — only `14.png`
(Marketplace) and `17.png`/`img-03.png` (Learning) are clean. **Flagged and
deliberately left: this needs a re-render, not a website edit.**

### Upload
`app.html` · `sanctuary.html` · `web3.html`. No image, no JS file and no other
page changed.

---

## "Why DAOasis matters now" — mobile rewritten from scratch — 13 September 2026

`index.html` only. **Desktop is byte-identical in behaviour** — verified by
diffing computed styles against a pre-change copy served on a second port
(1 difference, the new hidden `.why-mark` child) and by re-running the card
choreography (peak opacity 1.00/1.00/1.00, peak centre scale 1.125, dust 1.00,
14/25 distinct frames — identical on both builds at 1280/1440/1920).

### Why it was rebuilt rather than repaired

Reported as not working on a phone, repeatedly, over many rounds. Every
previous attempt kept the desktop composition and shrank it. That composition
is three paper cards flying to the centre of a sticky 100vh stage and docking
to the right of a mark assembling out of sand — it needs two columns and a
viewport-height frame, and a handset has neither. Three consequences:

1. **The mark rendered into a 172px band** — about 120px of dust. The one
   piece of motion in the section was too small to register as motion.
2. **The statistics were 24px figures inside bordered plates**, so the
   section's actual argument arrived looking like interface.
3. **All of it depended on a WebGL scene compiling on a phone.** A section
   that can render as *nothing* is not an acceptable shape for the page's
   central claim.

### What it is now

Four beats in ordinary flow — no pin, no sticky, no `cine` track:

**statement → 01 → 02 → 03 → the mark**

- Each statistic owns a **66vh beat** (74vh under 740px tall) with the figure
  at `clamp(37px,11.2vw,54px)` — 43.9px at 390, against 24px before.
- A **spine down the left** fills as the reader descends, with a node on each
  beat's rule. Without it three statistics on three screens read as three
  unrelated slides; the line is what makes them one argument with three parts,
  and it tells the reader how much is left.
- Per beat, staggered off one scrubbed value: the rule draws left to right,
  the figure **writes itself along the same axis** (a `clip-path` wipe — the
  only true mask available without a wrapper element around the type), then
  the sentence rises, then the citation.
- **The section ends on the mark**, not on the third card. The argument is
  made, then the thing being argued for assembles out of the sand, alone and
  wordless, before the divider.

### Load-bearing decisions — do not undo

1. **The WebGL scene does not run below 900px at all.** `initPalm` returns
   before it constructs a renderer, so a phone never creates the context. It
   re-arms through a `matchMedia('(min-width:901px)')` listener, so a desktop
   browser resized up still gets it — verified in both directions (mobile →
   desktop brings the canvas from `none` 300x150 to `block` 1440x900 with the
   cards animating and the mobile `--b` properties cleared; desktop → mobile
   hands over to the beats with all three statistics reaching 1.00).
2. **Every CSS window falls back to `--b:1`.** The resting state is fully
   visible and the script only ever takes things away and puts them back. The
   animation is an enhancement, never a precondition for the content
   existing — this section has rendered as a blank screen on a phone before.
3. **No IntersectionObserver anywhere in it.** An observer that exists but
   never fires leaves what it gates invisible forever, with no error. That was
   the actual bug the last time.
4. **…and replacing it with a scroll listener re-created the same bug one
   layer down.** Reproduced by suppressing window scroll events: `--b` is
   written once, at load, where it is 0, and all three statistics stay
   invisible permanently — stats 0.00/0.00/0.00, no error. **A fallback that
   depends on the thing it is a fallback FOR is not a fallback.** The section
   is now pumped on rAF from load until three scroll events have actually been
   observed, then the pump retires and the listeners carry it at no idle cost.
   If the listeners never work the pump never retires, which is the right
   trade in the one case where it matters.
5. **No CSS transition on any scrubbed property** — a transition there is a
   second clock running against the reader's scroll.
6. **Reduced motion keeps this animation.** It is scroll-linked: it moves only
   while the reader scrolls and stops when they stop. Same position as
   `js/cine.js`.

### The 2D mark, and three things that were only findable by looking

`images/img-09.png` is sampled into ~3400 grains which converge from a
scattered ring. The PNG is also the band's **CSS background**, i.e. the
resting state; the script adds `.live` only after it has actually painted a
frame, and that is what hands over to the canvas. The band can never be empty.

1. **`getImageData` throws on a canvas that has had a `file://` image drawn
   into it.** Over http (what ships) the full assembly runs; opened as a bare
   local file the same band still animates, by scale and fade, using the image
   directly. Both paths verified.
2. **Scan-order subsampling renders the mark as vertical DASHES.** Taking
   every k-th filled pixel walks a whole row before moving down, so grains
   land ~3px apart horizontally and 1px apart vertically. Sampling on a square
   fractional stride fixes it; the stride is fractional so the grid never
   lands on an exact pixel lattice and moirés against the mark's own edges.
3. **Grain size must be computed, not chosen.** At 1150 grains the resolved
   mark was measurably correct — ring, trunk and horizon all in the right
   places — and still read as a scatter of dots, because mean spacing was
   5.2px against a 2.3px grain. It now uses the desktop scene's own formula,
   `1.25 * sqrt(0.68 * size² / N)`, so density is identical at every band
   height and pixel ratio.

Also: the scattered phase reaches ~1.5x the mark's radius, so the cloud was
being sliced off in mid-air at the band's edges — which reads as a clipping
bug, not as dust. Grains now fade out over the outer 14%, which is also what
hides the band's hard edges entirely.

### Two collisions the numbers caught

- **The assembled mark and the divider's palm mark were printing on each
  other** — 0 to −7px. The divider overlays the section by its own full height
  (`margin-top: calc(-1 * var(--divider-h))`), so the tail is load-bearing
  geometry, not spacing. It is now `calc(6vh + 34px)`, and `calc(6vh + 52px)`
  under 740px tall where the band is height-constrained and the mark nearly
  fills it. Ink-to-mark clearance is **53–85px** at 320x640 / 360x740 /
  375x667 / 390x659 / 390x844 / 430x932, against the site's 49px floor.
- **The stage gradient ended on `#EAE3D7`** and drew a hard horizontal band
  edge across the frame the divider sits in. It now returns to `#F7F6F2`, the
  Ecosystem section's own ground, so the join is invisible.

### Ecosystem "Learn more" — a bar on mobile, not a chip

Measured at 390x844 the desktop pill rendered **166px wide inside a 336px
column**, left-aligned and translucent over the photograph. On plate one —
whose copy sits at the top — it hung in mid-air with 435px of photograph below
it and read as a sticker dropped on the image; on plates two and three it sat
44px off the plate floor, on the seam with the next plate. It is also the only
thing on a full-bleed photograph the reader can act on, and a hairline chip
over a 0.74-alpha veil has almost nothing to define it.

Now full column width (335 of 390), solid warm-white with charcoal ink, the
arrow pushed to the far edge so the bar reads as a row rather than a centred
label, and the panel lifted clear of the plate floor (6% → 9%, and plate one's
top 5% → 6%) so the bar closes the copy block instead of hanging off it.
`:hover` is neutralised on mobile — a sticky hover after a tap would leave the
bar lifted 2px out of its own block.

### Verified
- **18/18 failure scenarios PASS** at 390x659 and 390x844: normal · rAF
  removed · IntersectionObserver removed · IO present but never firing ·
  `getContext` returning null · `getImageData` throwing · `THREE` undefined ·
  reduced motion · scroll events never firing. A scenario passes only if all
  three statistics reach full legibility and the mark band shows something.
- **36 sitewide checks clean** (6 pages x 375/390/768/1280/1440/1920): 0
  horizontal overflow, 0 JS errors, no unexpected 404s.
- Section length 2.88–3.38 screens at six handset sizes (was 1.6, but as a
  frame that could not be read); index at 390x844 is 19.4 screens.
- Judged by eye at 390x844 and 390x659, deviceScaleFactor 2.

> **Testing trap, and it cost a full diagnostic detour.** A static server from
> an EARLIER session was still bound to port 8802 serving a months-old build.
> The new baseline server failed with `EADDRINUSE`, the log was not read, and
> the A/B reported a confident, perfectly reproducible "desktop regression"
> that did not exist — dark starfield background, 8.5px citations, a 5220px
> pin. **Check the server's own log, and assert something build-specific in
> the served HTML, before trusting any A/B on a second port.**

### Ecosystem "Learn more" made prominent, and the mobile hero recomposed — 13 September 2026

`index.html` only. **Desktop is unchanged apart from the hero eyebrow's
copy** — computed styles diff against a pre-session copy on a second port
returns one difference at 1280/1440/1920, the new `display:none` icon span.

#### The CTA was losing to the chips it sat under

`.eco-learn` had already been raised once from tracked caps on an underline
to a bordered pill, and it still did not read as the action. The reason was
not its size: the four `.eco-feat` chips directly above it carry the **same
hairline, the same tracked caps and the same translucent dark fill**, so the
eye read five near-identical chips in a stack and nothing said which one was
clickable. Outlining it harder could never fix that — it had to leave the
chips' register entirely.

It is now the site's own primary button, `.btn-light`: solid warm-white,
charcoal ink, a soft shadow so the plate sits ON the photograph, lifting on
hover. Larger than the standard `.btn` (14.5px against 11.5px, 62px tall
against 48px, 211px wide against 166px) because it sits under a 52px
Cormorant headline with a whole frame to hold its own against. Mobile keeps
the full-width bar, raised to match.

Its arrival window was also pulled earlier and tightened — `(--tw - 0.29) /
0.30`, was `0.33 / 0.38`. It still lands last, because it is the payoff, but
starting at 0.33 meant it only reached full strength in the tail of the
plate's hold, which is the opposite of prominent.

Verified at 1280/1440/1920 with convergence polling: every part of every
plate reaches 1.00, and the CTA is at full strength for 7/14/16 of 41
samples per plate.

#### The mobile hero — where the room came from

Reported as "the wording is above everything and looks shit", with a
reference composition. Three things were wrong and one of them was the
reason the other two could not be fixed:

1. **The type block had ZERO clearance above the phone.** Measured at
   390x844 on the pre-session build, the stack ended on the exact pixel the
   product started, and at 360x740 and 390x659 it was already printing 58px
   and 1px INTO the photograph. Nothing could grow by a point.
2. **The headline was a 21-character line and an 8-character orphan.**
   "A healthier tomorrow," filled the column and "together" sat alone under
   it — the weakest shape a three-word headline can take.
3. **The two buttons were 176px and 221px wide**, 41px and 43px tall, at
   11.5px: a ragged right edge, two different sizes for two actions, neither
   big enough to read as a target on a photograph.

**The room came from the photograph, not from the type.** `hero-mobile.jpg`
carries 67-89px of dead foreground BELOW the watch at every handset size
(products at source y 35.5%-88.3%, painted `100% auto` anchored bottom), and
all of it was being spent on empty stone. The plate is now anchored
**`center bottom -6.5vh`**, which crops that ground and hands the band
32-60px. The product base still clears the viewport floor by 25-38px
everywhere. **Re-measure both numbers if `hero-mobile.jpg` is replaced.**

What that bought:

| | before | after |
|---|---|---|
| headline | 35.9px, 2 lines | 36.7px, **3 lines** |
| buttons | 176x41 + 221x43 | **258x52 + 258x54, equal, pill** |
| clearance above the phone | **0 / -1 / -58** at 844 / 659 / 740 | **+23 / +23 / +35** |

- **Pills, equal width, with their direction on them.** `align-items:stretch`
  makes them equal; the column is capped at `min(78%,300px)` so they do not
  become a full-bleed slab — the stylesheet's earlier objection to pills was
  that at full column width they became the loudest thing in the frame, and
  that still holds. The primary sends you onward (→), the secondary sends
  you down the page (↓). **The icon spans are hidden above 900px**, so the
  approved desktop hero is untouched.
- **The ghost carries its own ground** (`rgba(8,7,6,0.34)` + 3px backdrop
  blur) rather than the scrim being extended. The scrim clears to zero by
  48% so the phone keeps its own light, and the calls to action sit at
  36-45% — right where it is thinnest, over open water. Darkening that band
  would have dimmed the product; giving one button a fill does not.
- **The three-line headline is gated at `min-height:801px`.** It costs ~40px
  over two lines and below 800 the band does not have 40px to give —
  measured, applying it unconditionally printed the CTAs 10-35px into the
  photograph at 375x667, 390x659 and 360x740. The measure is `max-width:
  6.4em`, in em so it scales with the clamp: Cormorant Light runs ~0.365em
  per lowercase character here, so "A healthier tomorrow," is 7.7em and
  "A healthier" is 4.0em, and any measure between the two breaks in the same
  place. `em{display:block}` puts `together` on its own line — **on desktop
  it stays inline**, where a wide column makes continuing the line stronger.
- **A new 700-800 tier**, which is where most Android handsets live
  (360x740, 360x780, 393x786). Everything steps down one notch; both actions
  and the sub-copy survive.
- **The eyebrow was the first four words of the sub-copy beneath it** — the
  same phrase twice in one glance, 32 characters wide, running the full
  column on a handset. It is now Tagline 2. An older note argued against the
  four movements here because they also appeared as a strip under the calls
  to action; **that strip was removed on 13 September, so the objection is
  spent.** This is the one change that reaches desktop. To revert, put
  "A behavioural wellness ecosystem" back in `.kicker`.

#### Tablet portrait was broken before this and is fixed in passing
At 768 the portrait plate renders **1364px tall**, so the phone's top edge
landed at y=210 in a 1024 viewport with 126px of band for a stack needing
374 — the type printed 234px into the photograph on the pre-session build
too. The plate is now anchored to the TOP between 601 and 900px wide, so the
products run off the bottom of the fold rather than climbing into the type,
which is how the reference crops them anyway. Clearance 26px.

> Still open there: `hero-mobile.jpg` is 941px wide and a 768 viewport at
> 2x asks for 1536, so the tablet hero is upscaled ~1.6x and reads soft. A
> wider render would fix it; no other size is affected.

#### Verified
- **8 viewport sizes** (320x640, 360x740, 375x667, 390x659, 390x844,
  412x915, 430x932, 768x1024): clearance above the product **+23 to +67px**,
  product base clears the viewport floor by 25-38px, 0 horizontal overflow.
  The pre-session build collided at three of the eight.
- **Desktop hero identical** at 1280/1440/1920 — 1 diff, the hidden span.
- **36 sitewide checks clean**, why-now mobile still **18/18** on the failure
  matrix, ecosystem plates still reach 1.00 on every part.

### Upload
`index.html` only. No image, no JS file and no other page changed.

---

## Mobile hero recomposed — the buttons come off the photograph — 15 September 2026

`index.html` only, and **only below 481px wide**. Reported as: the calls to
action should sit under the hero image, the headline should be larger, and
REST · LEARN · EARN · RETURN should sit under the headline. Everything from
481px up — desktop, tablet portrait and the awkward 481-600 band — is
**byte-identical in behaviour**, proved rather than assumed (see Verified).

### The composition

    nav → headline (large) → the four movements → the photograph → two buttons

The buttons are off the photograph and onto the hero's own ground for the
first time. That is what pays for the rest of it: the band above the phone
used to carry a kicker, a headline, a sub AND two buttons, so the one
element that should have carried the page was the smallest thing it could
be. At 390x844 the headline goes **36.7px → 43.3px and two lines → three**;
at 375x667, the tightest screen, **29.25px → 33px**.

### It is a GRID, and display:contents is why no markup changed

The three things that had to move are not siblings. `.hero-plate` is a child
of `.hero`; the kicker, the headline and the buttons are grandchildren two
wrappers down (`.content > .hero-type`). **`order` cannot lift a grandchild
past its own parent**, so it was either duplicate the buttons in the markup
or stop the two wrappers generating boxes. `display:contents` on `.content`
and `.hero-type` makes every one of those elements a direct grid item of
`.hero`, placeable by row. **Not one line of markup changed** — which is the
whole reason the signed-off desktop hero could be left alone.

Rows: `1` nav clearance · `2` headline · `3` kicker · `4` the photograph's
own room (the `1fr`) · `5` the buttons. **The plate spans rows 1-4, so its
bottom edge IS the top of the button band by construction** — no constant
holds the two in step, so there is no viewport at which they can drift
apart. All slack lands in row 4: the products get whatever the type does not
need, never the reverse.

**Two things `display:contents` takes away, and both are load-bearing:**
1. `.content`'s **padding** — the side gutters are grid COLUMNS now
   (`7% 1fr 7%`), which is what lets the plate run edge to edge while the
   type stays in the measure.
2. `.content`'s **`z-index:10`**, the single thing that was lifting all the
   type above `.hero-grain` (z-index 3) and the vignette (z-index 2). Each
   item carries its own now. Drop it and the type goes under the grain.

### Row 4's floor is the one number the layout cannot do without

The photograph is painted to the WIDTH, so the products are **0.938 x 100vw
tall at every width** — the source is 941x1672 with the phone, band and
watch at y 35.5%-88.3%, and 0.528 x 1.7768 = 0.938. Row 4's minimum is
`93.8vw + --hero-ground + --hero-clear`, which means the phone's top edge
can never climb into the kicker: if the viewport cannot pay for it the
**hero grows** instead. `.hero` is therefore `height:auto; min-height:100vh`
and **not** `height:100vh` — a fixed height with a `1fr` row collapses row 4
on a short screen and slides the photograph straight up through the type,
which is exactly what the first build did.

Growing is bounded and safe: worst case measured is 375x667 at 11px over,
and only the tail of the melt goes under — both buttons stay above the fold
with 15px to spare.

Four variables, one set per tier, all tied together: `--hero-top` (clearance
under the nav) · `--hero-ground` (stone left showing below the watch) ·
`--hero-clear` (minimum sky between kicker and phone) · `--hero-melt` (the
ramp to the ivory the next section opens on) · `--hero-feather` (the scrim's
tail). The anchor is `bottom calc(var(--hero-ground) - 20.8vw)`: **20.8vw is
0.117 x 1.7768 x 100vw, the source's OWN headroom below the products**, so
that offset alone puts the watch base exactly on the plate's bottom edge and
the ground is what is handed back. **Re-measure 20.8vw and 93.8vw together
if `hero-mobile.jpg` is ever replaced.**

### Three things the first build got wrong, all found by measuring

1. **The anchor's sign was inverted.** `bottom calc(20.8vw - 14px)` is a
   POSITIVE offset, which lifts the image's bottom above the container's;
   the old rule's `bottom -6.5vh` was negative. The phone climbed 111px into
   the kicker and 148px of dead stone appeared underneath. It must be
   `calc(<ground> - 20.8vw)`.
2. **Two older height tiers silently won.** `@media (max-width:900px) and
   (max-height:700px)` sits ~640 lines further down the sheet than the new
   block, and **media queries add no specificity**, so the later rule took
   the headline back to 7.8vw. The three old tiers are now gated
   `min-width:481px`, which also states the split explicitly.
3. **The plate's tail stopped at 0.62 alpha**, so the photograph met the
   button band at a 38% step and read as a straight cut through the stone.
   The tail now reaches `var(--mineral)` at 100% — the same colour as the
   band — so the join is seamless by construction, not by matching.

### The type scrim is a GRID ITEM, not a percentage of the plate

**This is the part that is easy to get wrong.** A veil written as a
percentage of the plate cannot know where the type ends — and the type
moved: with the buttons gone the headline is half again bigger and reaches
38% of the plate, where the old ramp had already cleared to 0.10. Measured
against the real frame (type hidden, frame captured, contrast computed
against the brightest pixel each box covers) the kicker fell **6.7:1 → 1.8:1**
and the gold italic to **1.36:1** — the sun on the water printing straight
through the word.

`.hero::before` is a pseudo of the grid container, so **it is a grid item**.
Placed on rows 1-3 it is exactly as deep as the nav clearance, the headline
and the kicker at every viewport, with no number to keep in step; a negative
bottom margin stretches its box past its own area so the fade lands in the
gap above the phone rather than on the phone. z-index 5, between the plate
(0) and the type (10). Deep where there is only sky, gone before the
product — which is the one thing a flat veil over this photograph cannot do,
and the reason a flat one was rejected back in August.

The plate's own top ramp went back to being atmosphere (0.42 → 0 by 46%).
`.hero::after`'s vignette and the warm bloom moved to `.hero-plate`'s own
pseudos so they stop at the photograph's edge instead of washing over the
buttons.

### Other decisions

- **The sub is dropped below 481px.** It restated the headline, and with the
  buttons off the photograph there is no band left that does not belong to
  either the type or the product. Untouched on desktop.
- **The buttons go full measure and equal**, one per row. On a ground of
  their own there is nothing behind them to compete with, and the ghost lost
  its `backdrop-filter` — that existed to lift it off open water and is a
  real compositing cost on a handset for nothing. Its label went from a
  measured **1.2-1.96:1 to 16:1**.
- **Three tiers, because height decides what the type can be.** ≥801 tall
  gets three lines at 11.1vw; 701-800 (most Android) steps down to 8.8vw and
  keeps three lines; ≤700 goes to **two** lines — `together` rejoins the
  sentence — because 93.8vw of product plus a button band leaves ~170px of
  sky at 375x667 and three lines of a headline worth reading do not fit in
  it. Better a 33px two-line headline than a 27px three-line one.
- **The measure is what guarantees the line breaks, not the column.** At 390
  the full line measures 333px inside a 335px column — two pixels of font
  metric from flipping to two lines and an orphan. `max-width:6.6em` (three
  lines) and `9.2em` (two lines, ≤700) break in the same place on every
  device.
- **481px, not 600px, is the ceiling.** The composition needs a viewport
  taller than about 1.8x its width; measured, 540x720 (1.33) and 600x900
  (1.5) push the buttons 119-159px below the fold. No phone in portrait is
  wider than 430, so 481 up keeps the composition it already had.

### Verified
- **Contrast against the real photograph** (type hidden, frame screenshotted,
  PNG decoded, worst pixel in each box) at six handset sizes: headline
  **7.08-8.94**, gold italic **4.19-5.77** (floor 3.0, large text), kicker
  **4.97-6.40** (floor 4.5), ghost button **15.9-16.0**. **0 failures.** The
  pre-change build failed 10 of 24 — the gold italic at three sizes and the
  ghost button at all six.
- **A/B against a copy of the pre-change build on port 8792**, with a
  build-specific assertion on each served page first: **1,495 property
  comparisons at 1280x800 / 1440x900 / 1920x1080 / 768x1024 / 820x1180 /
  900x700 / 600x900 / 540x720 / 481x800 — the only difference at any size is
  the port number inside the image URL.** Desktop, tablet and the 481-600
  band are untouched.
- **12 arrival-path checks, 0 failing** at 375x667 / 390x844 / 430x932:
  normal (same-origin referrer, intro skipped) · fresh arrival with the full
  intro and its fly-to-hero handoff · `prefers-reduced-motion: reduce` ·
  JavaScript disabled entirely. A mode passes only if the headline, the
  kicker and BOTH buttons are visible at full opacity, the kicker is under
  the headline, the buttons are clear of the photograph and nothing overflows.
- **60 sitewide checks** (index · app · sanctuary · web3 · investors · about
  x 320/360/375/390/430/768/1024/1280/1440/1920, each loaded fresh):
  **0 horizontal overflow, 0 JS errors, 0 unexpected 404s.**
- **Geometry at twelve sizes** (320x640 · 360x740 · 360x780 · 375x667 ·
  375x812 · 390x844 · 393x786 · 412x915 · 430x932 · 540x720 · 600x900 ·
  768x1024): kicker-to-phone clearance **18-71px**, ground under the watch
  20-30px, no element escaping the viewport.
- **Judged by eye** at 320x640, 360x740, 375x667, 375x812, 390x844, 393x786,
  412x915 and 430x932, plus the hero → "Why DAOasis matters now" join.

### Diff
3 existing lines changed — the three media-query gates — plus one new block.
**No markup, no image, no JS file and no other page.**

### Upload
`index.html` only.

---

## Mobile header rebuilt — 15 September 2026

`index.html` only, and **only the `.nav` bar below 600px wide**. Reported as
too small and compressed — "like a desktop navigation bar that has simply
been compressed for mobile." Nothing else changed: not the hero image, crop,
positioning, typography, copy, the REST · LEARN · EARN · RETURN line, any
app imagery, colours, desktop layout, section spacing or navigation
behaviour.

### What changed

Five width tiers (≤600 / ≤480 / ≤390 / ≤360 / ≤320), each dropping
horizontal padding faster than it drops the logo, per the brief:

| viewport | bar height | logo width | h-padding |
|---|---|---|---|
| ≤600 | 96px | 162px | 28px |
| ≤480 | 94px | 155px | 26px |
| ≤390 | 90px | 150px | 24px |
| ≤360 | 88px | 142px | 20px |
| ≤320 | 86px | 140px | 18px |

Every tier sets `min-height` rather than leaning on padding alone —
padding plus the logo's own height falls 8-14px short of the target at
every tier, so `min-height` is what actually delivers the bar's presence;
the existing flex centring places the logo and burger inside whatever that
height turns out to be. Logo width never drops below 140px (the brief's
stated minimum); `height:auto` keeps the mark's true 1400:429 proportions,
so only the width is ever set and it is never stretched.

The burger is one size across all five tiers — a 40x40 touch box with
27px bars — rather than its own ladder, which is what keeps it and the
162→140px logo in proportion with each other at the narrow end instead of
both shrinking out of step. The open-state X was retuned to match: the
distance a bar travels to close the gap is its own height plus the gap
above it, so the two outer bars now move 9px (was 6.5px) — get this wrong
and the X draws short of centre. The text label next to the burger is
hidden across the whole ≤600 band (previously ≤420 only), for the calm
two-element `[ burger ] [ logo ]` composition the brief describes.

### Why nothing else had to move

`--nav-h` is measured live off the rendered bar's own height (see the
script by `#siteNav`), and the hero's mobile grid already reads that
variable for its first row. A taller bar therefore pushes the photograph
down by exactly its own height with no hero edit at all — verified,
`.hero-plate`'s top edge sits flush against the bar's bottom edge at every
tier.

**Everything outside ≤600px is untouched.** 768 (tablet portrait) and
desktop widths render byte-identical to before — the new tiers simply don't
reach them, and 768's own existing rules (which already predate this
change) are undisturbed.

### Verified
- Logo optically centred at the exact viewport centre at every one of the
  four requested widths (320/375/390/430) — it uses the existing
  `position:absolute; left:50%` mechanism, untouched, so it centres on the
  viewport regardless of the burger's width, per the brief's instruction
  not to centre around the burger.
- Bar height 86-96px at every tier (320 sits at 86, the narrowest case;
  never below the 80px floor). Logo 140-155px at the four requested widths,
  all within or at the stated minimum. Burger 40x40, never overlapping the
  logo (32-72px of clear gap at every width tested).
- 0 horizontal overflow, 0 JS errors, 0 unexpected 404s at 320/360/375/390/
  430/768/1024/1280/1440/1920.
- The burger's open (X) state and the drawer it opens were both re-tested
  at 320 and 390 — the X forms cleanly with the retuned offset and the
  drawer opens exactly as before.
- Judged by eye at 320, 390, 430 and 768 (tablet, to confirm it is
  unchanged).

### Upload
`index.html` only.

---

## Mobile spacing and joins — 15 September 2026

`index.html` only. Reported as: the gap between "Explore the ecosystem" and
the next section needs better spacing, ideally a divider, and the mobile page
generally wants to feel more premium. Agreed scope was spacing, dividers and
dead gaps — **type scale was deliberately excluded**, because the page's
problem was never size, and several mobile sizes are documented measured
decisions.

### 1. The hero join — divider restored, and the plinth ends on an EDGE

The divider between the hero and "Why DAOasis matters now" was removed on
13 September because the hero then ran full bleed to the bottom of the
viewport and a rule across a photograph is exactly the hard line the
transition exists to avoid. **That objection is spent on mobile**: since the
hero rebuild the mobile hero ends on a flat dark band carrying the two
buttons, not on the photograph. The divider is back below 600px and
`display:none` above it, where the original objection still holds.

**It is the one divider on the page that takes real flow height.** Every
other divider is transparent with `margin-top: calc(-1 * var(--divider-h))`,
so it overlays the tail of the section above and borrows that section's
background. Measured at 390x844 the overlay would put the palm mark at y=814
with the buttons at 688-808 — **the mark prints on the "Explore the
ecosystem" bar**. So the negative margin is cancelled for this one, and it
paints its own band between --warm-white and #FDFCF9, the two grounds it
bridges. If either of those colours changes, change it here too.

**The dark-to-ivory melt is gone.** The hero's last 30px used to ramp
#171412 → ivory, and over that distance a dark-to-light ramp does not read as
a dissolve — it reads as a grey stripe under the button, which is what was
reported. Lengthening it was tried and is worse: any dark-to-light ramp
passes through mid-grey, so a longer one just makes a taller stripe. The
plinth now ends on a clean edge. The melt was right when the hero ended on
the PHOTOGRAPH; it ends on a built element now, and built elements are
allowed edges.

> **The rule this pass established, and it decided three separate joins:**
> **light meeting dark is an EDGE; dark meeting dark is a FOLD.**

### 2. `.overlay`'s top padding was sized off the navigation

`padding: calc(var(--nav-h) + 3.5vh)` on mobile — written when `.stage` was a
sticky 100vh frame whose top edge genuinely sat under the fixed bar. On a
handset `.stage` is `position:static` and the section opens several hundred
pixels down the page, so the nav's height was buying dead space in a section
nowhere near the nav. It was also **live**: the same-day header rebuild took
`--nav-h` 61px → 90px and this gap silently grew 29px with it. Now a flat
8vh, with the divider above carrying the breath between the two.

### 3. The ecosystem plates — folded, not butted

Unpinned, the three plates are three photographs stacked in a column meeting
on hard lines; the page read as three cards rather than one sequence. Each
plate now fades down into `rgba(8,7,6,0.88)` over its last 6vh and the next
rises out of the same value over its first 6vh, so the two frames share one
dark fold. Measured across a seam: **RGB 14 on one side, 19 on the other** —
the luminance step is gone. 6vh and not more, because the copy on plates two
and three sits at `bottom:9%` (67px up) and a longer tail starts eating the
panel.

**A real bug this exposed, and it is the reason those melts were off in the
first place.** `.eco-outer` carries an ivory melt at each end for desktop,
where the sections above and below are both warm-white. Below 1100px `.pin3`
is `display:none`, so the run's real neighbours on mobile are:

| | desktop | mobile |
|---|---|---|
| above | ivory section | `.section.on-light` #F7F6F2 — same |
| below | `.pin3` (ivory) | `.track-mobile-section` **#171412 dark** |

Re-enabling both melts wholesale therefore painted a **warm-white stripe
across the top of a dark section**. The bottom now uses the dark fold
resolved to `--mineral` so it lands exactly on the next section's own colour;
the top is left as a clean edge (the ivory melt there was the same grey-fog
failure as the hero's, 42px of it across the top of the photograph).

**Read a section's real neighbours off the rendered page before melting into
them.** On this page the neighbours differ between desktop and mobile in
three places, because `.pin3`, `.pin4` and `.pin5` all vanish below 1100px.

### 4. One divider was classed for a section that is not there

**A defect, not a taste call, and it is not mobile-specific.** A divider
borrows the background of the section it overlays, so its class has to match
whatever is above it. Below 1100px `.pin3` is `display:none` and
`.track-mobile-section` takes its place — and that section is `--mineral`
where pin3's tail is ivory. The divider between them is classed `light`,
i.e. the **black** palm mark, so from 1100px down it had been painting a
black mark on a near-black ground.

Measured against the rendered page: ground `rgb(26,23,21)`, **contrast
1.03:1**. Not faint — invisible, at every width from 1100 down, including
1024 and 768.

Fixed at **1100px, the exact width where the ground changes**, not at a
mobile breakpoint that would have left 601-1100 broken. `.track-mobile-section
+ .divider` is the honest way to say it — the selector only matches when that
section exists. The mark is inverted with a filter rather than swapped for
`img-09-white.png`, so no markup and no second asset is involved.

> **How it was found, and the method is the point.** A divider audit that
> reads the mark's `src` and infers black-or-white is wrong twice over: it
> cannot see a CSS filter, and it cannot see what the mark actually sits on.
> `scratchpad/divaudit2.js` captures each divider twice — mark visible, mark
> hidden — and compares the mark's own rendered pixels with the ground
> underneath. Filters, opacity and blending are all included by construction.

Weight was also raised on mobile generally: dark rules 0.16 → 0.26 alpha and
mark 0.8 → 0.95; light rules 0.2 → 0.28 and mark 0.55 → 0.72. A 26px mark on
a 1440px frame is quiet punctuation inside a wide rule; on 390px the rule is
a quarter as long and the same alphas disappear. **`--divider-h` is
untouched**, so no overlay geometry or measured clearance moved.

### 5. The short-screen tier rebalanced

The header rebuild took `--nav-h` 61px → 90px, and the hero's first row is
`calc(var(--nav-h) + --hero-top)`, so every hero grew 29px. At 375x667 that
pushed the second button 15px below the fold. Rebalanced **above** the
buttons, since trimming below them moves the hero and the button together and
gains nothing: `--hero-top` 0.8vh → 0.3vh, `--hero-clear` 18 → 12,
`--hero-ground` 20 → 16, headline 8.8vw → 8.4vw (33px → 31.5px, still well
above the 29.25px this tier rendered before the hero rebuild). Second button
now lands at 664 against a 667 viewport.

### Verified
- **All 7 dividers visible at 375, 390 and 430** — measured as painted, not
  as classed. The broken one went **1.03 → 14.09**; the range is now
  4.82-14.09 with 0 invisible.
- **Desktop untouched.** 780 property comparisons at 1280x800 / 1440x900 /
  1920x1080 / 1101x800 against the pre-session build, and **docH is identical
  at every one** (23318 / 25789 / 30265 / 23079). Every rule added is inside a
  max-width query at or below 1100px; `.divider-hero` computes `display:none`
  at all four. The only reported diffs are `querySelector('.divider')` now
  matching the new hidden element instead of the first visible one.
- **Hero type contrast still passes at six handset sizes**: headline
  6.75-7.99, gold italic 3.94-5.27 (floor 3.0), kicker 4.76-5.87 (floor 4.5),
  ghost button 15.9-16.1. **0 failures.**
- **12/12 arrival-path checks pass** at 375x667 / 390x844 / 430x932 — normal,
  fresh intro, reduced motion, and JavaScript disabled entirely.
- **0 horizontal overflow, 0 JS errors, 0 unexpected 404s** at 320/360/375/
  390/430/768/1024/1280/1440/1920.
- Judged by eye top to bottom at 390x844 (23 frames), plus 3x captures of all
  four joins and both tight screens.

### Flagged, not changed
- The waitlist section's "Join the waitlist" button is a 206px centred
  rectangle on a full-width mobile section, while the hero's two actions are
  full-measure bars. That is a composition decision, not spacing.
- The assembled palm mark closing "Why now" is visibly dithered on a handset
  (it is a 2D grain canvas) and sits directly above the next divider's own
  palm mark — two marks in a row.

### Upload
`index.html` only.

---

## The assembled palm mark, rebuilt — 15 September 2026

`index.html` only, the mobile close of "Why DAOasis matters now". Reported as
dithered, completing too quickly, and not as detailed as the logo — plus the
doubled palm mark flagged in the previous pass. Four separate causes.

### 1. The dithering was the SAMPLE RESOLUTION, not the grain size

The mark is sampled out of `images/img-09.png` into a square mask and one
grain is placed per grid cell. That mask was **160x160** while the mark is
drawn at **~500 device px** — a 3.1x upscale, so every fine feature of the
logo was thrown away *before a single grain was placed*. No amount of grain
tuning can recover detail the sampler never captured. `R` is now **320**,
at or above the drawn size at every band height this page uses, and `GRAINS`
went 3400 → **6800**.

### 2. It now ENDS ON THE ARTWORK, which is what "as detailed as the logo" means

A point cloud can only ever approximate the mark. Across the last fifth of
the scrub the real PNG is cross-faded in over the settled field, so what the
mark *rests* as is the artwork, pixel for pixel — verified by reading the
canvas back: **flat `rgb(58,50,38)` at alpha 255** across the solid runs.

It is **tinted, not drawn black**. The grains are `rgb(58,50,38)`, a warm
dark; `img-09.png` is a near-black silhouette, so cross-fading straight to it
shifts colour as well as sharpness and reads as the mark *changing* rather
than resolving. `source-in` keeps the PNG's alpha and replaces its colour, so
both are the same ink and only the resolution changes. Built once and cached
against its own pixel size.

**The sand has to leave as the artwork arrives.** Drawing the crisp mark over
a field still at full strength leaves a ~1px fringe of grain around the
silhouette — every grain carries up to half a sample cell of jitter, so the
ones on the edge settle just outside the artwork's ink and are never covered
by it. Grain alpha is now multiplied by `1 - sharpen²`: squared, so the sand
holds its density through most of the hand-over and only clears at the end.
A linear pair thins the mark in the middle of the cross-fade, which is the
one moment it must not.

### 3. "Completes too quick" — two changes, because one was not enough

The window went `0.71vh` → **`0.92vh` of travel**, and now starts the moment
the band's top crosses the fold: **776px of scroll at 390x844, against 600px.**
It cannot simply be widened further — the band is 330px in an 844px viewport,
so a window beyond ~0.92vh finishes the assembly after the mark has already
left the top of the screen.

The rest of the extra duration is the **sharpen, which is a second beat
rather than a longer first one**. The stagger was also pulled in (`d*0.55`,
length 0.22-0.40, landing by ~0.95) so the sand is down before the sharpen
starts: a sharpen has nothing to sharpen if the grains are still in the air
underneath it.

The mark also went from `cw*0.60` to **`cw*0.66`** of the band.

### 4. Two palm marks in a row

Below 900px the section closes on the assembled mark at ~250px, and the very
next thing was the divider following `.pin`, whose own 26px mark is the same
palm — two of the same mark inside ~100px, the second a twentieth the size of
the first. **The divider goes, not the mark**: the assembled mark is the
better punctuation at that join. Nothing else moves — that divider is
transparent and takes no flow height, and the grounds either side of it are
both `#F7F6F2`, so it was never marking a change of ground. Desktop keeps it;
`.why-mark` is `display:none` there and the doubling does not exist.

### THE TESTING TRAP, and it cost most of the time on this

> **A page screenshot of a `<canvas>` in headless Chrome can be a stale
> composite.** Captured through the page, this mark appeared grainy with a
> left-to-right luminance gradient at every scroll position — including
> frames where the sharpen was provably at full alpha. Three consecutive
> captures measured an *identical* neighbour-delta to two decimal places
> while the underlying PNGs differed, which is what gave it away.
>
> `canvas.toDataURL()` shows what the canvas actually holds, and it held a
> perfectly crisp mark. Confirmed independently by reading pixels back with
> `getImageData`: flat ink, alpha 255, no gradient. The only layers over the
> band are the stage's own vertical gradient and `.grain` at 0.038.
>
> **Dump the canvas, do not screenshot the page** when judging canvas work
> here. Measuring "graininess" as mean neighbour delta also needs the two
> images at the SAME device resolution — comparing a 487px render against a
> 974px one made the reference look 2x smoother purely from upscaling, and
> sent the first diagnosis down the wrong path entirely.

### Verified
- Canvas read back at `t≈1`: **flat `rgb(58,50,38)` @ alpha 255** across the
  horizon band; a 94px fully-opaque run; soft-edged pixels 100% → 10.8%
  across the scrub.
- **Frame cost 16.7ms median, 16.9 p95, 16.9 max** at 6800 grains mid-assembly
  — locked to 60fps, no dropped frames. 0 JS errors.
- Assembly sequence driven at t = 0 / 0.15 / 0.30 / 0.45 / 0.60 / 0.75 / 0.85
  / 0.92 / 1.0 with the real `t` read back off the live rect at each step; all
  nine frames distinct.
- **6 dividers rendered, 0 invisible** at 390x844 (the seventh correctly
  reported as not rendered — it is the one removed here).
- **12/12 arrival paths pass**; 0 horizontal overflow, 0 JS errors, 0
  unexpected 404s at 320/360/375/390/430/768/1024/1280/1440/1920.

### Upload
`index.html` only.

---

## Three content gaps closed on the home page — 15 September 2026

`index.html`. Copy and three small blocks, **not mobile-only**: these are
content gaps, and content should not differ by breakpoint. Nothing invented —
every fact added is already published elsewhere on this site.

The brief was to close the gaps **without adding length**, so all three are
additions of a few lines rather than new sections. Mobile went 19.6 → 20.0
screens; desktop 25,789 → 26,023px.

### 1. Who it is for — `.eco-for`, in the Ecosystem section

The page named its audience for the first time in the Principle section,
**fifteen screens down and in the quietest type on the page**. A reader had
to commit most of the page before finding out whether it was for them. That
same sentence, shortened, now sits at the first point where the reader knows
what DAOasis actually is.

Deliberately NOT inside `.eco-sub`: three long sentences in a centred 620px
column at 1.9 line-height is a wall, and this is a different kind of
statement from the two above it — so it gets a short rule and its own
lighter treatment. `--clay-ink`, because `--clay` itself is 2.2:1 on ivory
and the carry is the site's own answer to exactly that. Measured 6.12:1.

It rides `.section.in-view` with its siblings, so it needs no observer of its
own — **and it is in the `<noscript>` visible-everything list**, which the
reveal-gated siblings are too.

### 2. What actually happens when you join — `.wl-next`

The page argued for eleven screens and then asked for an email without ever
saying what the email gets you or when. Three numbered steps now sit **before
the button**, because that is the question a reader has at the moment they
are deciding, not after.

**Step two absorbs `.wl-note`** — "the list is not automated, we add you by
hand" — the same disclosure, moved from a footnote under the button into the
sequence, where it reads as part of the process rather than as an apology for
the button. `.wl-note` is gone from the markup; its CSS rule stays so nothing
regresses if it ever returns.

**No date is given, because none is settled. Do not add one.** There is still
no form backend anywhere in this project.

### 3. Where things actually stand — `.wl-status`

Every other page is scrupulous about this — investors.html and the trust
layer both state plainly that there are no users and no revenue — and the
home page was the one place a reader could come away assuming all three
experiences exist today. Three facts under the button:

    Companion App — in build
    The Sanctuary — planned for Phuket, 2027
    DAOasis Global Ltd — incorporated in the UK

Each is already published: the UK company on `privacy.html` §01/§19 and
`terms.html` §01/§24, the build status and the 2027 pilot on `investors.html`
and `sanctuary.html`. **The Sanctuary line must keep the word "planned"** —
it is not operational, not bookable, and no property is contracted.

**It stacks below 900px, not 700, and the cap is 780px.** The three facts
measure 157 + 249 + 265 = 671px plus two 26px gaps = 723px, so anything
narrower wraps — and when this row wraps the separator belongs to the item it
precedes, so it lands at the START of the second line as an orphaned rule.
That is exactly what a 640px cap did at 1440. The row now only exists at
widths that can hold it in one line (a 900px viewport gives 756px of content
against the 723 needed). Verified at 375/390/430/768/900/1024/1280/1440/1920:
**one line wherever it is a row, stacked everywhere else, 0 orphans.**

### Verified
Contrast on every new element at 390 and 1440: `.eco-for` **6.12**,
`.wl-next li` **5.71**, `.wl-status span` **5.13** — floor 4.5, 0 failures.
0 horizontal overflow, 0 JS errors, 0 unexpected 404s at 320/360/375/390/430/
768/1024/1280/1440/1920. 12/12 arrival paths still pass. 6 dividers rendered,
0 invisible. Judged by eye at 390 and 1440.

### Still flagged, still not changed
The waitlist's own "Join the Waitlist" button is a 206px centred rectangle
while the hero's two actions are full-measure bars. With a stronger block
around it, it is now visibly the weakest element in that section. Composition
call, not spacing.

---

## Read-only mobile audit, all six marketing pages — 15 September 2026

Measured at 390x844 against the rendered page, not the markup
(`scratchpad/pageaudit.js`). **Nothing was changed as a result of this.**

| page | length | overflow | JS errors | dividers | invisible | sub-10px type |
|---|---|---|---|---|---|---|
| index | 20.0 screens | 0 | 0 | 6 | **0** | 0 |
| app | 33.7 | 0 | 0 | **0** | – | 1 (SVG `<text>` 9px) |
| sanctuary | 33.3 | 0 | 0 | 10 | **0** | 1 (SVG `<text>` 9.5px) |
| web3 | 33.0 | 0 | 0 | 7 | **0** | 0 |
| investors | **62.1** | 0 | 0 | 18 | **0** | 0 |
| about | 22.7 | 0 | 0 | 7 | **0** | 0 |

**The site is structurally clean on mobile.** No horizontal overflow, no JS
errors, and — after the index fix — **not one invisible divider mark
anywhere**. The two sub-10px hits are SVG `<text>` inside diagrams and match
the pre-existing list already recorded in this file; they are not new.

Three observations worth a decision, none of them defects:

1. **`app.html` has no dividers at all** — 0 rendered. It is the only
   marketing page with no divider system, so its section joins have no
   punctuation. Whether that is a gap or a deliberate difference is a design
   call; it has been that way since the page was built.
2. **`investors.html` is 62 screens on mobile**, nearly twice the next
   longest. It pins nothing, so it is not slow — but it is a very long read
   on a handset.
3. **Hard light/dark joins are common and mostly BY DESIGN** — the site
   alternates ivory / stone / green / dark grounds and a divider marks each
   change. The ones without a divider on either side are where a PHOTOGRAPH
   meets a flat ground, which is the same class of join softened on index's
   ecosystem plates: sanctuary y=5057 and y=5547 (ivory → wide photo →
   stone), y=23796 and y=24775 (the pilot band), web3 y=20454 (ivory →
   sanctuary band), investors y=46306. Six in total. Worth looking at
   together if the ecosystem treatment is liked.

---

## Mobile: slower scroll, slimmer header, the palm pinned, the Journey rebuilt — 15 September 2026

Five things, **all mobile-only**. `index.html` · `app.html` · `sanctuary.html` ·
`web3.html`. Verified afterwards that **0 desktop values changed** — every rule
added or altered is inside a mobile media query, and the two markup edits are in
blocks that are `display:none` above 1100px.

### 1. Everything slowed ×1.6

Reported as moving way too fast. **Scroll distance per beat is the only lever
every mechanism obeys** — `cine` pacing, raw-scroll scrubs and
IntersectionObservers all key off position — so it is the one that slows all of
them together. Each value scaled against its own previous number, never
normalised to a shared one (the 3 September lesson: a per-beat rate is a
property of a section).

| | was | now |
|---|---|---|
| `app` hero / quest map / marketplace | 320 / 420 / 400vh | **512 / 672 / 640vh** |
| `sanctuary` hero / 3D loop / `.day-entry` | 500 / 370 / 68vh | **800 / 592 / 109vh** |
| `web3` hero / bridge | 480 / 380vh | **768 / 608vh** |
| `index` why-now statistic beats | 66 / 74vh | **106 / 118vh** |

**The cost is length, and it is large.** At 390x844: index 20.0 → **28.8**
screens, app 33.7 → **40.5**, sanctuary 33.3 → **42.2**, web3 33.0 → **38.2**.
That is what "slower" buys; ×1.6 is the single knob if it needs tuning either
way. Every beat on every page still reaches full strength — verified by sweeping
each document at 70 positions and taking each beat's peak: minimum 0.98.

### 2. The header, and a real buffer under it

"Too fat." Logo **−30%** across all five tiers and the bar came down with it:

| | was | now |
|---|---|---|
| bar height | 86–96px | **66–77px** |
| logo width | 140–162px | **98–113px** |
| buffer, bar to headline | 13–15px | **17–47px** |

`--hero-top` went 1.6vh → 4.2vh (and 4vh / 2.6vh on the shorter tiers) — the
buffer comes from BOTH sides: a shorter bar and a bigger gap.

> **This breaches the brand floor stated in the 15 September header brief**,
> which set a 140px target minimum and a 120px absolute minimum for the mark.
> 105px at 390 is below both. It was done as asked and is flagged here rather
> than silently clamped; 120px is a one-line change if the floor wins.

### 3. The palm mark is a pinned stage with a hold and a pop

Reported as starting too early and being over too fast. Both were the same
cause: it was a 330px band **in the flow**, so the assembly started the moment
the band's top edge crossed the fold — while it was still 330px of dust at the
bottom of the screen — and finished before the band reached the middle. The
animation was keyed to a small element travelling past, not to a frame the
reader is held in.

`.why-mark` is now the **runway** (300vh) and the canvas is the **stage**
(`position:sticky; top:0; height:100vh`). Nothing moves until the mark owns the
whole screen. Two viewport-heights of scroll, in three beats:

    0.00 - 0.42   ASSEMBLE   sand gathers, resolves, sharpens into the artwork
    0.42 - 0.62   HOLD       nothing moves at all
    0.62 - 1.00   POP        comes forward to fill the frame

**The HOLD is the point.** An animation that resolves and is immediately taken
away never gets looked at. 20% of the runway is ~40vh of scroll — verified
identical ink geometry (242x255) at t = 0.42, 0.52 and 0.62, so it is a genuine
pause and not a couple of frames. The POP then hands the frame to the Ecosystem
section at full size: measured **242px → 389px wide on a 390px screen**, edge to
edge.

Two things that had to move with it:
- **The resting PNG went onto the CANVAS's own background**, not the wrapper's —
  on a 300vh wrapper a centred background sits a viewport and a half down the
  page. A canvas paints its background behind its drawn content, so the
  fail-visible guarantee is unchanged.
- **The tinted artwork is cached at the POPPED size and drawn down**, not built
  at the resting size and scaled up. Keyed on the live size it would rebuild a
  canvas every frame of the pop; built small and scaled up it would soften
  exactly as it came forward.
- `.stage`'s `padding-bottom` went to 0. It existed to clear the palm mark of
  the divider below, and that divider is `display:none` on mobile now.

### 4. The Journey section, rebuilt

It was a static checklist: seven rows in flow, each fading up as it crossed 55%
of the screen, with a one-way `done` latch — seven stages of the product's
central story delivered as a to-do list, all readable at once, none of it given
a moment.

It is now a **pinned, scrubbed sequence, one stage per screen**:
`.journey-mobile-section` is the runway (7 × 78vh + 100vh = **6.5 screens**) and
`.jm-list` is the stage, stuck at `top:0`. The kicker and headline stay in flow
above it, so the title scrolls away and hands the whole screen to the sequence.

Four things carry it, and **every element already existed in the markup**:
1. a **chapter numeral** from a CSS counter — which is why the `01 — ` prefixes
   came out of the labels (the only markup change);
2. the **title and its line**, one stage at a time, in Cormorant at 30–42px
   where they were 10px tracked caps;
3. the **photograph** as a band at the top, pushing in 8.5% across the whole
   section — the one thing that does not reset per stage, so it reads as one
   move rather than seven;
4. the **rail**: `.jm-line-base` / `.jm-line-fill` turned on their side into a
   progress bar, with the seven `.jm-dot`s as its stops.

**Not one-way.** The old `furthestActive` latch could only go forwards, so
scrolling back up left the section on its finished state — the same fault
removed from `js/cine.js` in August. This reverses exactly.

**Three bugs found by measuring, each invisible to a layout audit:**
1. **The sticky stage was inset 8% by `.section`'s own padding** — the rail ran
   275px inside a 327px box and the photograph band was inset by 31px. The side
   padding came off the section and onto the kicker and headline.
2. **`.jm-item:nth-child(3){opacity:1}` as a fail-visible rule outranked the
   scrub** — (0,2,0) against `.jm-item`'s (0,1,0) — and held stage one at full
   strength for the whole section: two stages legible at every crossover. A
   default inside `var(--w,1)` cannot win that fight, which is the point.
3. **Opacity on `.jm-item` took its `.jm-dot` with it** (opacity applies to the
   whole subtree), so one rail stop showed instead of seven. The fade moved onto
   the three pieces of type. The dots also needed a NEGATIVE `bottom` to reach
   the rail — they are positioned against their own item, whose box ends at
   13vh, and the rail is at 6vh. Measured 93px adrift before that.

Plus one composition fix by eye: the numeral was absolutely positioned behind
the title and collided with it (42–77px into the first line of every stage). It
is in flow above the title now — `.jm-item` is a flex column, so `::before` is
simply its first item.

**The text window is the site's own rule**: full within 0.34 of a stage's stop
and gone by 0.50 — the midpoint exactly, so neighbours hand over on a single
frame. At 0.44 there was 12% of a stage (~9vh of scroll) with no type on screen.
Verified: **all 7 stages reach full strength, maximum 1 legible at any time.**

### Verified
- **60 sitewide checks** (6 pages × 320/360/375/390/430/768/1024/1280/1440/1920):
  **0 horizontal overflow, 0 JS errors, 0 unexpected 404s.**
- **0 desktop values changed** at 1440x900 across index/app/sanctuary/web3 —
  bar height, the two mobile-only sections' `display:none`, and all seven
  desktop pin heights are their originals.
- Every mobile beat lands: 3 why-now statistics, 4 marketplace scenes, 9 day
  entries, 7 seven-days, 6 participation items — **minimum peak opacity 0.98**.
- Journey: 7/7 stages at full strength, max 1 legible at once, rail stops within
  **1px** of the rail, rail fill 0 → 328px.
- Palm: hold verified as identical geometry across three sample points; pop to
  389px on a 390px screen; canvas sticks at top 0 throughout; 0 JS errors.
- 12/12 arrival paths, 6 dividers 0 invisible.

### Upload
`index.html` · `app.html` · `sanctuary.html` · `web3.html`.

---

## App page rebuilt on the 2026 screen set · Living Ecosystem redesigned · the route settled at seven stops — 16 September 2026

`app.html` and `investors.html`. Thirteen new screens in `images/`. Nothing on
index / sanctuary / web3 / about or the trust layer was touched.

### The screens

`G:\My Drive\From Computer\DAOasis\APP\App Design-Claude\Screen Mockups\` — 40
PNGs at 1239x2616, exported from the MVP Design Blueprint, device frame baked
in and the corners genuinely transparent. Thirteen are now on the site as
`images/app-*.webp`.

- **WebP, not PNG or JPEG.** The corners are real alpha (`alpha min 0`), so a
  JPEG would put a black box behind the frame. But PNG is brutal on these:
  the same screen is **1448 KB as PNG, 373 KB as a palette PNG and 125 KB as
  WebP q88** with `alphaQuality: 100`. All thirteen together are **908 KB**,
  which is less than the seven mockups they replace. Long edge 1600 (the
  largest box any of them occupies is ~380px, so that is comfortably 2x).
- **Every mockup this page carried was on the do-not-use list except
  `img-03`.** `img-04`/`img-05` showed "$0.100 ↑24%", `18.png`/`11.png` said
  "Earn DRT", `06.png` was a price chart, `19.png` read "DVT Price $0.100 ·
  24H change up 24% · Buy DVT · DRT earned", and the `og:image` was
  `img-10.jpg`. **There are now zero live references to a banned mockup in
  `app.html`** — the two that grep finds are inside explanatory comments.
  The new screens carry no price, no 24-hour change, no APY and no DRT.

Mapping: hero = breathing · home-morning · journey-map. How It Works = quests ·
approaching-a-waypoint · reward-credits. Living Ecosystem = the three home states.
Learning = module-detail + lesson. Rewards = where-credits-came-from +
what-credits-open. Marketplace scene 0 = marketplace.

### The route is now SEVEN stops, everywhere

The blueprint's own README had flagged this as unsettled: the app draws
Bangkok 0 · Ayutthaya 80 · Hua Hin 200 · **Chumphon 380** · Surat Thani 500 ·
Khao Lak 700 · Phuket 900, while the website drew six with different
distances. Dropping `HM-01` onto this page would have put a phone saying
"Chumphon 380 km" directly above a map saying "Surat Thani 544 km".

**The app's route won.** Both website diagrams were regenerated from the data
rather than edited — `scratchpad/route7.js` is the generator, and it is the
same centripetal Catmull-Rom (alpha 0.5, extrapolated phantom ends) already
used for `investors.html` in September.

> **`app.html`'s quest map had the identical defect `investors.html` was fixed
> for in September, and nobody had looked.** Its waypoint x coordinates were
> placed by eye: measured against x = 60 + 985·km/900, **Ayutthaya sat 82
> units right of its true position and Hua Hin 144** — so the 76 km opening
> leg was drawn longer than the 238 km run down the peninsula, on a diagram
> whose entire subject is distance. Worst x error across the six was **274.8
> units**; it is now **0.04**. Label sides now come from each node's own
> height (crest labels up, trough labels down) with one shared baseline per
> side, so adjacent labels are never on the same side.

`WPS[].threshold` is the waypoint's km as a fraction of 900 and the SVG x
comes from the same figure, so the marker, the labels and the paced stops
cannot disagree. The controller derives its `stops:` from `WPS`, so the
seventh waypoint flowed through with no change to the pacing code.

### The Living Ecosystem — why it did not work, and what replaced it

Reported as "the animation that loops to the next habit isn't really working,
people won't get it". Three faults, and they compounded:

1. **The phone was inert.** `19.png` sat there through all six states, so the
   one object that looked like the subject of the section did nothing when you
   picked a habit.
2. **It ran on a 2,800 ms wall-clock timer** — the only non-scroll animation
   left on the site. The reader arrived mid-cycle with no idea what state they
   were in, and it moved while they were reading.
3. **Structurally it was a tab switcher** — six things shown one at a time,
   each replacing the last. That is precisely what the section's own copy says
   other apps get wrong ("track your metrics in isolation"). **The interaction
   argued against the headline.**

It is now **one day, accumulating**: a 440vh pin, seven stops, the phone
carrying the app's three real home states (morning → midday → evening close)
and the six habits arriving one at a time and **staying**. Watching the list
fill while the same marker advances *is* the claim. `render(pos)` is a pure
function of the paced value — no timer, no latched class, nothing that can be
stranded, and scrolling back up reverses the day exactly.

**Two rules this section is built on — do not undo either:**

1. **Every number lives on the phone.** A draft ran a kilometre readout in the
   right-hand column. The screens state 0.0 / 4.1 / 6.4 km and *hold* each
   figure for as long as they are shown, so a continuously ticking counter
   beside them disagreed with the product for most of the section. The column
   carries no figures at all, and **every habit line is verbatim from the
   screen next to it** ("Last night gave you 0.6 km", "Seven days opens the
   coastal route") — so the page and the app cannot drift apart.
2. **The phone HARD-SWAPS; it does not cross-fade.** The three home states are
   near-identical layouts differing mainly in their numerals, so dissolving one
   into another ghosts the digits — the same failure fixed in sanctuary's
   Rhythm section. The frame dips to 0.42 and the swap happens at the bottom of
   the dip. Verified across 81 scroll samples: **maximum screens visible at
   once = 1.**

Mobile is a different composition, not the desktop one shrunk: no pin, no
scrub, no state machine. The six habits are a list — scrolling a list already
*is* accumulation — and the payoff is the evening screen at the end, the one
screen that makes the whole argument on its own ("Credits earned today · 26",
from four different things). Morning and midday are desktop-only. Everything
is forced visible in the media query, so a missing `cine.js` or a thrown error
cannot leave the section blank.

**The cost is length: desktop `app.html` goes 24,679 → 27,934px (+3,255px,
+13%). Mobile is essentially flat (+115px)** because the pin is `height:auto`
there. 440vh over seven stops is ~63vh per beat, which is faster than anything
else on this page (hero 172, quest 100, marketplace 125) — deliberately, because
a row arriving is a small event, not a camera move. **Per-beat rate is a
property of a section; do not normalise it.**

### `.how-phone-wrap` — the third instance of the square-canvas trap, and the only one never fixed

`18/11/06.png` are **1800x1800** transparent canvases in which the phone
occupies about 39% of the width. `.how-phone-wrap` set `width: 100%` on the
image inside a 320px box, so it drew a **~125px phone floating in dead space**
— and the rounded rectangle, the `overflow:hidden` and the box-shadow were all
drawn around the *canvas* rather than around the device. The same trap is
documented for web3's `.dev` and for the Living Ecosystem's own phone; this was
the third and it had never been caught.

The box now draws nothing of its own — the shadow is a `drop-shadow` on the
image, which follows the alpha and therefore the real silhouette. A whole
1600px screen at card width would be ~530px of phone in a three-up row, and at
a width that fits, the screen content is mush — so the box shows the **top** of
the screen and a mask fades the rest out (758/1090, solid to 73%).

> **A top-cropped box only works for a top-loaded screen, and that has to be
> checked per screen.** Card 02 was first given `JO-05` (arrival in Phuket),
> which carries its headline about 48% down behind a tall map — so the card
> rendered as an almost empty dark plate, and no numeric check had anything to
> say about it. `JO-02` leads with APPROACHING / Hua Hin and is the better
> illustration of "walk a real-world journey" anyway: the journey in progress
> rather than its end. **Check where a screen carries its title before putting
> it in this box.**

> Related, and it nearly shipped a wrong `alt`: the contact sheet used to pick
> the screens renders each one about 250px wide, at which **"Hua Hin" and
> "Chumphon" are not distinguishable.** JO-02 was noted as Chumphon from the
> sheet and is actually Hua Hin. Read the real file before writing a caption
> or an `alt` off a thumbnail — `sharp().extract()` on the region is enough.

### New shared component: `.scr-strip`

Learning and the Reward System each explained a mechanic in words and then
showed nothing, despite four good screens each. One component, two uses: a
figure and a caption in a narrower measure than the section above it —
deliberately not a third card grid, because the cards carry the argument and
this carries the evidence.

> **Both host sections carry `padding-bottom: 0`**, so the first version ended
> flush against the divider that follows and its palm mark landed **7–19px**
> off the last caption, against this project's 49px floor and against 124–152px
> on every neighbouring divider. The tail is on `.scr-strip` itself, not on the
> section, so it travels with the component. Clearance is now 128–136px.

### The marketplace phone, and a collision only findable by looking

Scene 0 is the only marketplace scene with no photograph behind it — just a
radial plate — and its copy is capped at 620px on the left, so the right half
was empty. **`right: 7%` put the phone straight underneath `.market-nav`**
(INTRO / SANCTUARY / PARTNERS / GOODS), which printed across the screen. The
nav is `right: 6%` with a ~90px label column, so the phone sits at
`calc(6% + 120px)` and is hidden below 1200px, where the copy and the nav close
up and there is no band left. Verified: **46px to the nav at every width from
1280 to 1920**, hidden at 1200 and below.

### Two contrast fixes

- `.edy-cue` was `rgba(247,244,238,0.34)` — **2.94:1**, mine, now `#8f887d` at
  5.23:1.
- **`.how-text` was `#7a746a` — 3.32–3.66:1, pre-existing and byte-identical to
  baseline.** Body copy below the floor. Raised to **`#9b9488`** (4.84–5.53).
  `#8a8377` and `#8f887d` were both tried first and both **oscillated either
  side of 4.5 between runs** — the three cards composite over the orbit-ring
  gradient differently, so the measured minimum lands on a different card each
  time. When a ratio sits *on* the floor, move it clear of the floor rather
  than re-running until it passes.
  `.booster-text` keeps `#7a746a`; it sits on a different ground and was not
  measured here.

### Verified

Real headless Chrome over real HTTP, A/B against a pre-change copy on port
8802 (build asserted on both servers first, per the documented trap).

- **48 responsive checks** (6 pages × 375/390/430/768/1024/1280/1440/1920):
  **0 horizontal overflow everywhere.** Escaping elements on `app.html` are 6
  at every width and **identical to baseline** — all of them the closed,
  off-canvas nav drawer.
- **0 JS errors.** The only non-200s site-wide are the two documented ones,
  `favicon.ico` and `about-hero-mobile.jpg`.
- **Ecosystem**, driven stop by stop with the pacing polled to convergence:
  habits accumulate 1→6 and stay, **peak `--w` = 1.00 on all six**, the clock
  tracks the screen, the close lands at 0.97, and **1 screen visible at a time
  across 81 samples**.
- **Route**, both diagrams at 1101/1280/1440/1920: 7 nodes, **max node-off-curve
  0.22 units, max x error 0.04**, 0 text collisions between waypoints, 0
  escaping the viewBox.
- **Contrast** on every new text style at 390 and 1440: **0 failures.**
- **Divider clearance** at 390 and 1440: 0 below the 49px floor.

### Pre-existing, confirmed not caused by this pass

- `.wp-label-km` renders at **7.6–9px** — below the 10px floor. It is an SVG
  `font-size`, so it is viewBox units scaled by the render width, and raising
  it widens every label. Already recorded here as a site-wide type-scale
  question, and unchanged by this pass.
- `THE SANCTUARY` on `investors.html`'s route overshoots the viewBox by **1.2
  units in 1040** (~1.6px). Identical to baseline; not worth an asymmetry.
- Each city label overlaps its own km line at 1920 on `app.html`'s map. These
  are inline siblings of one block, which the blueprint's own `screencheck.js`
  explicitly skips. **Baseline had 6, this build has 4.**
- **`app.html` has no `<noscript>` block at all**, while `.reveal` starts at
  `opacity: 0` — so if JavaScript fails, most of the page is invisible type.
  That is true of the kicker, every headline and every card and predates this
  work; the new `.scr-strip` uses `.reveal` for consistency with the page
  rather than being the one always-visible thing on it. The Living Ecosystem
  is the exception — it is fail-visible by construction. **Worth a separate
  look: the trust layer solved exactly this with an `html.js` gate and a 2.5s
  failsafe.**

### Open — content decisions, not defects

1. **The Learn tracks are named differently in the app and on the site.** The
   app says **Behavioural wellness (12 modules)** and **Digital sovereignty
   (8 modules)**; the site says **Wellness Track** / **Web3 Track** with
   "twenty pilot lessons — ten per track". Totals agree at 20; the split does
   not, and a module is not a lesson (`LE-02` shows one module containing four).
   **`LE-01` was deliberately not used on the site for this reason** — the two
   screens that are used state no totals. Settle the naming and the split
   before `LE-01` goes anywhere near the page.
2. **The old `ECO_HABITS` copy contradicted the app and is gone with it** —
   "10,000 steps ≈ 5km", "+1 km every completed session", "+2 km for 7+ hours".
   The app's own model is **8,000 steps a day ≈ 6 km** (`ON-05`). If those
   boost figures are wanted back anywhere, reconcile them first — note
   `app.html`'s booster grid further down the page still carries its own set.
3. `index.html`'s "Track what matters" still uses **`img-10.jpg`** ("Reward
   Credits $0.100 · 24H ↑24%") and `investors.html` still references `06.png`
   and `19.png`. **The clean 2026 screens now exist for all of these** — the
   same fix could be applied to those two pages.

### Upload

`app.html` · `investors.html` · the thirteen `images/app-*.webp`. No JS file,
no CSS file and no other page changed.

---

## The blueprint moved again the same night — route reverted, screens refreshed, Home is four states — 16 September 2026 (later)

The Companion App blueprint was rebuilt at 22:11, four hours after the pass
above. **51 screens now, not 40, every PNG re-rendered, and the README tripled
in size.** Three things shipped earlier the same day are superseded by it.
Changed: `app.html` · `investors.html` · `web3.html` · 15 `images/app-*.webp`.

### 1. THE ROUTE IS BACK TO THE CANONICAL SIX — undo the seven

`map.js`'s `WAY` is now **Bangkok 0 · Ayutthaya 76 · Hua Hin 199 · Surat Thani
544 · Khao Lak 782 · Phuket 900** — the figures this site has always published.
The blueprint dropped Chumphon rather than the website adopting it, which is
the opposite of the call made earlier that day.

> **The decision was right and the direction was wrong.** The two surfaces had
> to agree; they now agree on the website's numbers. If this ever comes up
> again: the website's six are canonical, and the app is the thing that moved.

- `investors.html` was **restored wholesale from the pre-session backup** — the
  route was the only thing that pass had changed there, verified by diff.
- `app.html`'s map was **regenerated for six** rather than restored, so the
  km-proportional x and the label-side rule from the earlier pass are kept.
  `scratchpad/route6.js` is the generator. Verified: 6 nodes, **max
  node-off-curve 0.25 units, max x error 0.04** at 1101/1280/1440/1920.
- **Chumphon is still a bend in the road** — it is a point in the app's `LINE`
  and its marketplace still sells a guided walk from it. It is simply not one
  of the six milestones. Do not re-add it as a waypoint.
- The worked example moved with it: Jamie is **186 km in, 21%, between
  Ayutthaya and Hua Hin**, and the document now tells one coherent moment
  across Home, the map, the quest list, the learning suggestion and the
  community wall. The old set never did.

### 2. Home is FOUR states across one day, and the ecosystem follows

`HM-01..04` are **morning · afternoon · evening · night** — not the
morning/midday/evening-close trio, and not the Day one / Week one / Month one
month-axis that an intermediate pass tried. The evening-close screen with its
itemised credit total is **gone**; that content lives on RC-02 now.

The Living Ecosystem section takes the fourth state **at no extra height**: the
four states ride the same seven stops the six habits already use, with
boundaries at `pos` 1.5 / 3.2 / 4.8. The section stays at 440vh.

- The journey bar now visibly advances **186 km → 192 km** across the day, so
  the phone itself proves the claim the column is making.
- **The column's sub line must not be the screen's own copy.** A first draft
  used the screens' subs verbatim, and the frame then said *"the road is open
  ahead of you"* twice — once on the phone and once beside it. The greeting
  marks the hour; the sub reports the LIST's state (*nothing logged yet · the
  day filling in · the walking done · tomorrow already starting*), which is the
  column's own job.
- **The habit lines came off the quest screens, not the Home tiles.** Home's
  tile verbs are deliberately generic (*Build momentum*, *Recharge deeper*) and
  say nothing about the route. `QU-02..QU-05` and `QU-01`'s two ambient tiles
  say what each habit does to the JOURNEY, which is the section's whole claim.
- Two lines named **Chumphon** and had to change regardless — it is no longer
  the next stop. Mobile still shows one screen; it is now **evening** (the day
  closed, the distance banked), with morning, afternoon and night desktop-only.

### 3. Every screen was stale — 15 re-exported

All thirteen shipped earlier that day came from the pre-22:11 renders. Same
pipeline (`height 1600`, WebP q88, `alphaQuality: 100`, alpha genuinely
transparent on every one), **15 screens, 1.3 MB**.

> **`QU-03` is no longer the breathing session.** Quests went from 4 screens to
> 10 and the numbering shifted: breathing is `QU-05`, and `QU-03` is now sleep.
> Re-check the mapping by name, never by code, when this set is rebuilt.

`app-home-midday.webp` is gone, replaced by `app-home-afternoon.webp` plus the
new `app-home-night.webp`. `app-community.webp` (CO-01) is new, for web3.

### 4. web3.html — four device shots, and one that had never rendered

`18.png` and `11.png` were on the do-not-use list; `17.png` and `14.png` were
clean but retired, and two old screens beside two new ones reads as a broken
set. All four now carry 2026 screens. **Shot 2 also changed subject**: it held
an onboarding screen while the two rows pointing at it are *Take part* and
*Help others*, so the community screen is what those sentences always meant.

The square-canvas crop went with them — `.dev` was `aspect-ratio: 873/1803`
with the image at `width: 257.73%; left: -78.69%; top: -12.31%` to pull a phone
out of a 2250×2250 canvas. On a 758×1600 screen that magnifies a device which
is already the right shape. Now `758/1600` and `width/height: 100%`, and
`overflow:hidden` is gone so the drop-shadow follows the real silhouette.

> **A pre-existing bug this exposed: the marketplace device on web3 had never
> rendered.** `.dev-single .dev-shot` is `position:relative`, and its only
> child is absolutely positioned — so the box measured **300×0** and
> `overflow:hidden` clipped the image away completely. **Measured identical on
> the pre-change build**, so it was live, not introduced here. The
> `position:relative` override is removed; the shot fills `.dev` like the
> animated ones and the phone is 300×633.

### 5. index.html was deliberately NOT touched — and here is why

`img-10.jpg` is the last banned mockup in live use ("Reward Credits **$0.100**
· 24H change ↑24%", plus "Earnings **$140**", a cartoon avatar and a gamified
Level/Streak panel). It cannot be swapped.

**It is a 1000×897 LANDSCAPE dashboard, and the 2026 app has no landscape
dashboard at all.** Its four callouts are hand-anchored to its four quadrants
(`co1` 16%/12% the credits header, `co2` 17%/62% the ring, `co3` 66%/47% the
Progress panel, `co4` 50%/92% the Keep It Up band), inside a
`aspect-ratio: 1004/901` box with connector lengths measured against it.
Dropping a 758×1600 portrait phone in there changes the box ratio, all four
dot anchors, all four connector lengths and all four card labels — which is a
section rework, not an image swap, and `index.html` is the page CLAUDE.md says
not to modify unasked.

**What a proper pass would need to decide:** three of the four callouts have a
home on `HM-01` (the six tiles → *Daily Wellness Metrics*, the journey bar →
*Progress*, the closing band → *Keep It Up*), and **Reward Credits has no
anchor on Home at all** — it is its own screen now (`RC-01`). So either that
callout points somewhere else, or the section becomes two screens.

### Verified

Real headless Chrome over real HTTP, A/B against the pre-session backup on
8802 with the build asserted on both ports first.

- **48 responsive checks** (6 pages × 375/390/430/768/1024/1280/1440/1920).
- **Ecosystem**: four states cycle across the seven stops, all six habits peak
  at `--w` 1.00, **one screen visible at a time across 81 samples** (no
  ghosting), close lands at 0.99.
- **Route**: 6 nodes on both diagrams, off-curve ≤0.25, x error ≤0.04.
- **web3**: all four devices render at the true 758/1600 ratio.

### The cost, stated plainly

`app.html` against the **pre-session** baseline: **24,679 → 29,768px desktop
(+20.6%)**, 34,362 → 37,599px mobile (+9.4%). The earlier note in this file
said +13%; that figure was measured *before* the two `.scr-strip` tails were
added and was therefore understated. The growth is the 440vh ecosystem pin
(replacing a ~1,100px flow section) plus two screen strips at ~850px each.
**If this needs trimming, the strips are the cheap cut** — they are evidence,
not argument, and one screen each instead of two would give back ~1,100px.

### Still open

1. **`index.html`'s "Track what matters"** — see section 5. The only banned
   mockup left in live use anywhere on the site.
2. **The Learn track split is now settled; the names are not.** `LE-01` states
   *"Twenty lessons ship in the pilot, ten per track"* — exactly the site's
   figure, so the 12/8 mismatch flagged earlier is resolved in the site's
   favour. The app still calls the tracks **Behavioural wellness** and
   **Digital sovereignty** where the site says **Wellness Track** and **Web3
   Track**. The app's names are the better ones.
3. **`PR-01` says 306 km / 3 waypoints** while every other screen says 186 km /
   Hua Hin. A document-internal inconsistency, not a website one — flagged
   upstream rather than worked around.
4. `app.html` still has **no `<noscript>`** while `.reveal` starts at
   `opacity: 0` (carried from the earlier note).

### Upload

`app.html` · `investors.html` · `web3.html` · the 15 `images/app-*.webp`.
No JS file, no CSS file, and `index.html` is untouched.

---

## Scroll pacing overhauled site-wide · `js/smooth.js` added · the route reverted to six — 16–17 September 2026

Reported, in escalating terms, as: sticky sections "way too fast and not smooth
like apple premium", "no pause before or after, cards flash up too fast", then
"IT ALL STILL POPS WAY TO FAST … EXITING FROM ONE SECTION TO THE OTHER IS ALSO
NOT SMOOTH, TOO RAPID", then "CHECK MOBILE, THAT'S OUR MVP".

Three previous attempts at this had failed, and the reason each failed is the
useful part of this entry.

### The diagnosis took three rounds, and the first two were aimed wrong

1. **Round one — pin heights.** Measured px per beat on every pinned section.
   Worst offenders: web3 loop **288px (0.32 of a screen) per beat**, index
   principle 371, index daily 412, index journey 424, app ecosystem 437,
   sanctuary loop 463. Heights were raised. It helped, and it was nowhere near
   enough.
2. **Round two — the magnet curve.** `magnet()` was a power curve (`k = 2.6`)
   which *slowed* near a stop but never *stopped*: measured, the first 14.5% of
   a segment produced the first 2% of the move. That is a drift, not a hold —
   which is exactly what "no pause before or after" describes.
3. **Round three — and this was the actual governor.** `TIMING.follow` was
   `0.11`. **`step`/`back` are per-BEAT and their speed cap only binds on a
   flick; during ordinary reading `follow` alone sets the pace.** At 0.11 a
   notch settled in ~333ms. Every earlier fix had been adjusting things that
   only mattered when the reader was already moving fast.

> **If a section feels too fast during ordinary scrolling, `follow` is the
> knob. `step`, `back` and section height are what you reach for when a FLICK
> races.** They are different failure modes and the earlier passes conflated
> them. Note also `span = 1/this.N` — `step: 1500` is 1.5s *per beat*, not per
> section; I misread this at first and corrected it.

### What changed in `js/cine.js`

**A plateau replaced the drift.** The magnet now has genuinely still ends:

```js
var HOLD = 0.15;
function magnet(u){
  if(u <= HOLD) return 0;
  if(u >= 1 - HOLD) return 1;
  var t = (u - HOLD) / (1 - 2 * HOLD);
  return t * t * (3 - 2 * t);          /* smoothstep */
}
var PAD = 0.08;                        /* dead band at each END of a track */
function padded(v){ … }
```

`padded()` is applied **once**, in `tick()`, as `var raw = padded(this.rawV)` —
so sticky, guided, `get()`, `pos()` and the `o.off` passthrough all see the same
value. Applying it per-mode was tried and drifts the modes apart.

**`follow: 0.11 -> 0.06`** and **`mobileScale: 0.70 -> 0.9`** (mobile had been
running 30% *faster* than desktop, which is backwards for the MVP surface).

### `js/smooth.js` — a new file, and it reverses a documented decision

"Exiting from one section to the other" is **native page scroll between pinned
sections**. No amount of per-section pacing can reach it — a wheel notch is an
instant ~100px jump. So the scroll position itself is now damped: a ~80-line
Lenis-style easing of `window.scrollTo` toward a target.

This contradicts `cine.js`'s own "the browser scrolls natively at all times".
That statement remains true **of cine.js** — the damping lives in a separate
file specifically so it can be removed by deleting one `<script>` tag per page
and nothing else changes. **It is loaded on all 13 pages.**

**What it deliberately does not touch, and why each one matters:**
- **Touch / `pointer: coarse`** — iOS and Android already carry momentum, and
  intercepting it is how smooth-scroll libraries earn their bad name. Verified
  disarmed on every touch viewport.
- **`prefers-reduced-motion`** — off entirely. Unlike cine's pacing (which is
  scroll-LINKED, i.e. the reader's own input played back, and is therefore
  deliberately KEPT under reduced motion — see the 3 September entry), this
  moves the page *after* input has stopped. That is the class of motion someone
  asking for less of it actually means.
- **Nested scrollers** (`scrollableAncestor()`), anchor jumps, find-in-page and
  any programmatic `scrollTo`. `onScroll()` notices a position it did not cause
  and adopts it rather than dragging the page back.

> **`follow` and `smooth.js` are a PAIR and must be tuned together.** The
> damper adds ~350ms of its own glide. `follow: 0.05` alone measured 2,057ms to
> rest, which was too loose; **`0.06` measures 1,727ms**, which is the figure
> signed off. **If `js/smooth.js` is ever removed, put `follow` back to ~0.05**
> or the page will feel abrupt again.

### The numbers

| | before | after |
|---|---|---|
| minimum screens per beat | 0.32 | **0.70** |
| still portion of a segment | ~0 (a drift) | **30%** |
| settle per wheel notch | 333ms | **1,727ms** |
| index docH | 25,855 | 32,065 (+24%) |
| app docH | 29,869 | 32,074 (+7.4%) |
| sanctuary docH | 36,695 | 40,340 (+9.9%) |
| web3 docH | 31,885 | 37,420 (+17.4%) |

Measured hold on sticky sections: **339–340px (0.38 viewports) per beat**,
17–18 of 27 distinct frames. Mobile settles in 1.52–1.59s against desktop's
1.73s — correctly slightly quicker, because the damper is off on touch and
native momentum does that job instead.

Pin heights changed: index `.pin` 560->600, `.pin3` 375->600, `.pin4` 430->685,
`.pin5` 265->435; sanctuary `.found-outer` 360->435, `.seven-outer` 580->685,
`#loopOuter` 460->685; web3 `.part-outer` 560->600, `.bridge-outer` 460->520,
`.loop-outer` 420->**935**; app `.edy-outer` 440->685. **All desktop-only —
mobile overrides all resolve to `height:auto` and were verified unreached
(mobile docH is byte-identical to baseline on both pages A/B'd).**

---

## The app page on the 2026 screens, continued — 16 September 2026

### THE STRETCH TRAP — `<img width height>` sets a real HEIGHT

Reported twice ("the 3 hero screens are still stretched, sort it out"). The
cause was mine, from the previous session:

> `width="758" height="1600"` on an `<img>` are **presentational hints that set
> an actual CSS height**, not merely an aspect ratio. Combined with
> `max-height: 78vh` the height was clamped while the width hint stayed, so the
> phone was squashed horizontally — measured **−7.7% on the centre phone and
> −19.2% on the sides, at every viewport.**

Fix: `.hero-phone-shot { height: auto; object-fit: contain; max-height: 78vh; }`.
Now measured 0.471–0.474 against the source's 0.474 at 390/430/1440.

`scratchpad/stretch.js` scans every `<img>` site-wide for this. **It flags only
computed `object-fit: fill` and compares the computed box, not
`getBoundingClientRect`** — a bounding rect makes every 3D-rotated element a
false positive. Clean on all pages at nine widths.

> **The route reversion and the `web3` `.dev-single` fix are NOT repeated here** —
> both are recorded in "The blueprint moved again the same night" above, and that
> entry is the authoritative one. Re-verified in this pass and still correct: six
> nodes on both diagrams, max x error 0.04, max node-off-curve 0.25.

### Other app.html work in this pass

- **How It Works** — the top-crop-plus-mask made the phones look cut in half and
  the tilt made it look accidental. Now whole phones, square-on, smaller, no
  mask, `drop-shadow` on the image so the shadow follows the real silhouette.
- **Living Ecosystem rebuilt again, and this SUPERSEDES the four-Home-states
  design** described in the entry above. It is now **7 screens, one per beat** —
  Home → steps → sleep → breathing → hydration → quests → lesson — so each beat
  shows the screen its own habit line is about, rather than cycling four Home
  states behind six habits. `.edy-outer` **440 -> 685vh** (that is also what pays
  for the new pacing), `BOUND = [0.4,1.4,2.4,3.4,4.4,5.4]`, `GLOW[7]`,
  `DIP_W = 0.16`, static header. Mobile still shows only `data-s="0"`.
- **Quest map** made photographic — `--qm2-bg` from `images/img-11.jpg` with a
  two-axis veil resolving to `--dark-surface` at both ends, gold `.path-fill`
  with glow, lamp-fill waypoints, `paint-order: stroke` label halos. This is the
  "LAUNCH JOURNEY · SCROLL … currently very bland" fix.
- `.how-text` `#7a746a` -> `#9b9488`. **A ratio that sits ON 4.5 oscillates
  between runs** — these cards composite over the orbit-ring gradient
  differently each time, so the measured minimum lands on a different card.
  Move it clear of the floor rather than re-running until it passes.

### index.html

- **Daily experience redesigned** on the 2026 home screen. `.dash-wrap` is now
  `width: min(310px, 23vw, 64vh * 0.4738)` with `aspect-ratio: 758/1600` and
  `margin-top: 8vh`; the box-shadow and `::after` border are gone in favour of a
  `drop-shadow`. Callouts re-anchored to real features of the new screen.
  > The height cap is load-bearing: `.track-runhead` is z-index 14 against
  > `.dash-wrap`'s 10, and `.stage3`'s `padding-bottom: 11vh` puts the
  > flex-centred dashboard ~5.5vh high — the running head printed **across** the
  > journey card by 26px at 1440, 30px at 1280, 21px at 1101 (clear at 1920).
- **Journey section reworked** — hover-to-preview removed entirely
  (`const hoverIndex = -1`), the `.pop` keyframe deleted, and the card is now
  **light** (`#FDFCF9`, hairline border, deep shadow, no backdrop-filter)
  instead of the same colour as the section behind it. `--pc`'s arrival window
  widened from `(0.42 - half)/0.12` to `(0.46 - half)/0.30` — the old window
  gave the whole card arrival about **76px of scroll**.
- The three-step waitlist block removed from the markup (CSS retained).

### Images
Fifteen `images/app-*.webp` at 758×1600, WebP q88 / `alphaQuality: 100`. The
corners are real alpha so JPEG would black-box them and PNG is ~10x the size.
Unused screens deleted.

---

## Deep mobile pass — 17 September 2026

Mobile is the MVP and was checked accordingly: six pages × **320/360/375/390/
414/430/768**, each loaded fresh (never resized into — the documented stale
layout trap), reduced motion emulated OFF so the damper is armed, and
`isMobile`/`hasTouch` set so touch behaviour is real.

**0 horizontal overflow, 0 JS errors, and `innerWidth` exactly the emulated
width at all 42 combinations** (that last check is what catches a page being
silently zoomed out, as `app.html` was in September).

Every animated element reaches full strength: index `.jm-item` 7/7, `.eco-item`
3/3, `.tm-item` 4/4, `.pr-para` 3/3; app `.edy-row` 6/6, `.quest-card` 6/6,
`.scr` 4/4, `.how-card` 3/3; sanctuary `.found-item` 4/4, `.seven-day` 7/7,
`.day-entry` 9/9, `.rv` 18/18; web3 `.part-item` 6/6, `.loop-node` 9/9, `.rv`
51/51 — **minimum peak 1.00**.

> **The coarse sweep produced two false failures again** — `.bridge-step` read
> 0.30 and `.market-scene` 0.96 on a 190ms grid. Both are **1.00** once each
> sample polls until the rendered values stop changing. The pacing now needs
> ~1.7s to settle, so *any* fixed-delay grid reads mid-transition frames. This
> is the fourth time this trap has been recorded; **always poll to convergence.**

### Two real divider defects, both pre-existing, both fixed

A divider overlays the tail of the section above by its own full height, so a
section with no tail gets its palm mark printed into its own last line.

| | before | after |
|---|---|---|
| `sanctuary` `.immersion` (mobile) | 24px at 390, **1px at 430** | 84–98px |
| `web3` `#dvt` (mobile) | 8px at 390, **4px at 360** | 55–71px |

Both confirmed **byte-identical on the pre-session build** before being touched.

- **`.immersion` is not a `.sect`**, so `.sect:has(+ .divider)` never granted it
  `--dv-tail`. It is the third instance of the same fault (`#theSanctuary` and
  `.day-outer` are recorded above) and the only one that survived on a handset.
- **On `web3`, `--divider-h` (`14vh + 26px`) EXCEEDS `.sect`'s `16vh` bottom
  padding on any viewport shorter than ~1300px** — so the mark eats into the
  closing paragraph on every phone. web3 has no `--dv-tail` system, so the
  sections that actually precede a divider take the tail directly:
  `.sect:has(+ .divider){ padding-bottom: calc(16vh + 60px) }`, mobile only.

**Both edits verified not to reach desktop**: `immersion-inner` padding and
every `.sect` padding computed identical to baseline at 1280/1440/1920.
All 45 divider marks across five pages now clear the 49px floor at 360/390/430;
app.html's nine clear by 121px or more.

> **`app.html` DOES have dividers — nine of them.** The 15 September audit
> recorded "app.html has no dividers at all, 0 rendered"; that was a wrong
> selector. This page uses `.divider-dark` / `.divider-mid` with
> `.divider-line-d`, **not** the `.divider` / `.divider-line` system the other
> five pages share. Any site-wide divider audit must query both.

### Verified
- 42 mobile checks: 0 overflow, 0 JS errors, viewport 1:1 at every size.
- 48 sitewide responsive checks (375–1920): 0 overflow. Only non-200s anywhere
  are the documented `favicon.ico` and `about-hero-mobile.jpg`.
- Damper: 53 distinct scroll positions for one 300px notch; `scrollTo` lands
  exactly (so the test harness is safe); anchors land within 0–79px; both page
  ends reachable on all 8 pages; inner scrollers unaffected; **armed on all 8
  desktop pages and disarmed on touch and under reduced motion.**
- No stretched images anywhere, at nine widths.
- Judged by eye at 390×844 across `app.html`.

### Still open — content decisions, not defects
- Learn track naming still differs: the app says "Behavioural wellness" /
  "Digital sovereignty", the site says "Wellness Track" / "Web3 Track".
- `app.html`'s booster grid still carries `+1 km / target hit` and
  `+2 km / quality night`, which the app's own model (8,000 steps ≈ 6 km)
  contradicts. Recorded above as open item 2 and still open.
- `PR-01` says 306 km where everything else says 186.
- **`app.html` still has no `<noscript>` block** while `.reveal` starts at
  `opacity: 0`. The trust layer solved exactly this with an `html.js` gate and a
  2.5s failsafe; this page has neither.
- Nourish has no dedicated screen in the blueprint (QU-01 stands in).

### Upload
`index.html` · `app.html` · `sanctuary.html` · `web3.html` · `investors.html` ·
**`js/cine.js`** · **`js/smooth.js` (NEW)** · the fifteen `images/app-*.webp`.
**All 13 HTML pages** changed — every one gained the `js/smooth.js` script tag.
If `js/smooth.js` is missed, the pages fall back to undamped native scrolling
rather than breaking.

---

## Half the site's transitions were on the browser's default curve — 17 September 2026

Reported as: the site's transitions still do not feel premium or smooth.
Changed: all six marketing pages · the seven trust pages (via `css/trust.css`)
· **`js/cine.js`**. The cause was not the pacing engine, which has been tuned
repeatedly — it was that **52% of the site's transitions were never on the
site's curve at all.**

### The finding

`CLAUDE.md` has claimed since 1 September that "zero off-system curves remain
anywhere in the project". That audit searched for OTHER `cubic-bezier` values,
and it could not see the two ways a transition ends up on the default:

- a transition that names **no timing function at all** (`transition: color 0.2s`)
- a transition that names the **CSS keyword `ease`** (`transition: opacity 0.9s ease`)

Both resolve to `cubic-bezier(0.25, 0.1, 0.25, 1)` — a symmetric ease-in-out
that is not the site's decelerating signature. So every hover, border, colour,
drawer, card and button on the site moved on a different curve from its own
scroll motion, which is exactly what "doesn't feel of a piece" is.

| | declarations |
|---|---|
| bare keyword `ease` replaced | **99** |
| no curve at all, given one | **81** |
| already on-system | 168 |
| **off-system before this pass** | **180 of 348 — 52%** |

`index.html` was the worst: 46 bare `ease` plus 4 with nothing, against 68
correct. `css/trust.css` had 17 of 31 wrong, so the whole trust layer's
micro-motion was off-system too.

`scratchpad/unify.js` did it — it splits transition values on **top-level
commas only**, so `cubic-bezier(0.22, 1, 0.36, 1)` is never cut in half, and
it leaves `linear`, `ease-out`, existing `cubic-bezier` and `var(--ease*)`
exactly as they were. It also rewrites the four `style.transition = '…'`
strings in JS, which carried bare `ease` as well.

**Verified: one curve site-wide.** The easings histogram on every page is now
a single entry. The one surviving `ease-out` is `index.html`'s intro headline,
which is a deliberate decelerating curve and was left.

### Three transitions were animating LAYOUT or a full-width blur

Found by reading every element's computed `transition-property` and
classifying it (`scratchpad/smooth.js`). Each frame of these costs a reflow or
a re-blur:

1. **`app.html` `.market-nav-item` transitioned `letter-spacing`** — a reflow
   of the nav on every frame — and `.active` changes nothing but the colour,
   so it was driving **no visual result at all**. Removed.
2. **`index.html` `.nav` transitioned `backdrop-filter`** — re-blurring the
   full width of the bar for half a second every time the nav crossed into or
   out of `nav-solid`, which happens on ordinary scrolling. The blur still
   applies; it just arrives with the background instead of ramping. This was
   also the only change the ablation could resolve above the noise floor.
3. **`index.html` `.nav-brand img` transitioned `height`** — animates layout,
   and the only thing that ever changes it is a media query, so it fired on
   resize and nowhere a reader would see.

**0 layout-animating transitions remain on any page.**

### Durations were deliberately NOT snapped

The spread is wide (index carries 12 distinct values). The existing note is
right that a 100ms duration difference is far less perceptible than a
different curve, and several durations are load-bearing elsewhere. The curve
was the perceptible fault; it is fixed. Snapping durations would be a large,
risky change for a small return and is left alone on purpose.

### THE MEASUREMENT CAVEAT — read this before chasing frame times here

Headless Chrome on this machine renders in software, and **the baseline itself
drifted 34.5ms → 50.9ms across a single interleaved run**. An ablation that
switches one feature off per run therefore cannot resolve anything below about
30%: a first pass showed *every* candidate "improving" the page by 20%, which
was warm-up, not the feature.

> **Interleave baselines and compare against their mean; a single
> before/after pair on this machine is worthless.** Median frame time is the
> only stable figure (16.7ms — i.e. 60fps — on all four pinned pages); p95 and
> max swing by 3x between identical runs. The CPU profile is trustworthy and
> says JS is not the bottleneck: **72% idle, 15.6% browser rendering, 5.7%
> getBoundingClientRect.**

---

## "· SCROLL" removed, and one cue that knows when to speak — 17 September 2026

Reported as: remove the word scroll, and teach people to keep scrolling across
the whole site rather than in two arbitrary places.

### What was there

Three literal instructions, all on two pages: `LAUNCH JOURNEY · SCROLL` and
`Six habits, six screens · scroll` on `app.html`, plus "Scroll to continue ↓"
on both `app.html` and `index.html`. They were wrong twice over — **permanent**
(still shouting SCROLL at a reader three quarters of the way through the
section) and **per-section**, so most of the site had no affordance at all
while two arbitrary places had a shouted one.

### `app.html` was the only page with no read-progress bar

Every other page has carried `.scroll-prog` — the 2px gold rule across the
top — since August. `app.html` never had it, which is very likely *why* this
page in particular ended up writing "· SCROLL" into its own kickers. It now
has it, driven from the scroll handler that was already reading `scrollY`
every frame. **A page that shows you how far through you are does not need to
tell you to keep going.**

### The cue lives in `js/cine.js`, and it reads the track registry

Not in four page stylesheets — the four pages with scrubbed sections cannot
drift apart, and pages without a track never build it at all. It works because
`cine` already keeps every `Track`, each with `near` and `get()`: a pinned
section only holds the viewport while its own progress is below 1, so the cue
knows **which** scrubbed section owns the frame and **how far through it** the
reader is.

Four rules, and each one is why it does not nag:

- shown only while a scrubbed section covers **≥72% of the viewport** and its
  own progress is **under 88%** — past that the reader is leaving anyway;
- **hidden the instant the reader scrolls**, returning only after ~900ms of
  stillness. A cue that stays up while you are already scrolling is telling
  you something you are doing;
- **the words appear once per session and never again** — after that the
  travelling hairline carries it, because by then it has been taught;
- it **inherits `color` from the section it stands in front of**, so it reads
  on a photograph, on ivory and on the dark grounds with no per-page rule.

Pure enhancement: if `cine.js` fails to load, no cue appears — which is
exactly the state the site was in before. Reduced motion gets the mark
without the travelling animation.

**Verified** at 26 scroll stops per page: built on all four pinned pages, **0
JS errors**, shown at 13/26 stops on app, 12/26 sanctuary, 8/26 web3 and 2/26
on index at 390 (correct — index's pins are `display:none` on mobile, so there
is almost nothing to cue).

### Nourish — the app has no Nourish screen, and that is the app

`Six habits, six screens` was **never true**. The blueprint ships quest detail
screens for four habits only — QU-02 Steps, QU-03 Sleep, QU-04 Hydration,
QU-05 Breathing. Its README calls Nourish and Learn the two **ambient
habits**, added to QU-01 deliberately so they had somewhere to live. Learn at
least has LE-03; **Nourish genuinely has none.** So the row was promising a
tracker that does not exist and the phone answered with a list headed "Today's
quests".

**Reframing it in copy was the wrong answer and was rejected** — asked twice,
the complaint was the IMAGE, and no wording makes a frame headed "Today's
quests / Walk to the ridge" read as Nourish.

**Nourish now shows `HM-03` evening**, exported as `images/app-home-evening.webp`
(the standard pipeline: height 1600, WebP q88, `alphaQuality: 100`, alpha min 0,
121 KB). It is the best frame the set actually contains: the **Nourish tile sits
centre-bottom with a real food photograph**, and the evening framing — "Today is
closed", 192 of 900 km banked — is exactly when the meals have been logged. It
is a home screen and not a Nourish screen, and the `alt` says so plainly.
The kicker is now "One day, habit by habit", which is true and drops the count.
`app-quests.webp` keeps its one remaining use in the How It Works card, so
nothing is orphaned.

> **Checked and rejected, all four for concrete reasons:** `MK-01` marketplace
> (a MERCH hero photograph, and already used in the marketplace section below),
> `MK-02` item detail (it is *The Wind-Down*, a SLEEP course), `MK-04` your
> purchases (a receipts list), `HM-01` morning home (already used twice on this
> page — the hero and the section opener).
> **If a Nourish screen is ever added to the blueprint, it takes this slot.**

### Verified
- **60 sitewide checks** (6 pages × 320/360/375/390/430/768/1024/1280/1440/1920):
  **0 horizontal overflow, 0 JS errors, 0 unexpected 404s.**
- One easing curve on every page; **0 layout-animating transitions** anywhere.
- Median frame time **16.7ms on all four pinned pages**.
- `js/cine.js` parses clean; cue built with 0 errors on all four pages.

### Flagged, not changed
**Six photograph joins are still hard cuts** — sanctuary ×4, web3 ×1,
investors ×1 — the same class softened on index's ecosystem plates in
September (light meets dark is an EDGE, dark meets dark is a FOLD). Every
other light/dark step on the site has a divider marking it. This is the
remaining "transition between sections" work and is a bigger, page-by-page
job than this pass.

### Upload
`index.html` · `app.html` · `sanctuary.html` · `web3.html` · `investors.html` ·
`about.html` · **`js/cine.js`** · **`css/trust.css`** · **one new image,
`images/app-home-evening.webp`**. The seven trust HTML pages are unchanged
(they inherit from `trust.css`).

---

## The transitions made premium — the damping was frame-rate dependent — 17 September 2026

Reported, after four previous rounds at this, as "the entire site's transitions
are still not feeling premium and smooth enough". `js/smooth.js` and
`js/cine.js` only. **No HTML, no CSS, no image, no section height and no
narrative duration changed.**

The four earlier rounds all read "not smooth" as "too fast" and slowed things
down — pin heights, then the magnet curve, then `follow` plus a whole new
scroll damper. The site duly got slower and still was not premium, which is
the tell that the diagnosis was wrong every time.

### What was actually wrong — measured, not guessed

Both dampers applied **a fixed fraction per FRAME** (`cur += d * 0.075` in
smooth.js, `gap * TIMING.follow` in cine.js) instead of an exponential on real
elapsed time. That is the commonest bug in hand-rolled smooth scrolling and it
produced three separate defects at once.

**1. The site ran at a different speed on every display.** Isolated in
`scratchpad/sim.js`, one 100px notch to rest:

| display | old (per-frame) | now (dt-based) |
|---|---|---|
| 60Hz | 1183ms | 617ms |
| 120Hz | **592ms** | 608ms |
| 144Hz | **493ms** | 611ms |

**The old code was 2.4x faster on a 144Hz monitor than on 60Hz.** Every timing
decision in this file was made at 60Hz, so nobody on a high-refresh display had
ever seen the site that was designed.

**2. Velocity chatter.** Frame intervals on this site measure 16.5ms median but
20.7ms at p95, so a per-frame constant makes the easing rate swing ~27% frame to
frame — continuously, for the whole of every glide. Under that real measured
jitter: **old 19.9% velocity chatter, now 3.5%.** That wobble *is* what "not
smooth" was, and no retuning of a per-frame constant can remove it, because the
wobble is the per-frame constant meeting a variable frame time.

**3. The scene was deliberately tuned to trail the page.** The note being
replaced in `cine.js` says so outright: 2.06s end to end was rejected as "past
the point where the scene visibly trails the page" and `follow: 0.06` was chosen
to return to "the ~1.7s that was actually signed off". **But 1.7s trails too.**
Measured before this change: after one wheel notch the scroll settled at ~0.9s
and the scene it drives at 1.5-1.8s, and on web3 the scene did not begin to move
for **255ms**. Content arriving half a second behind its own scroll position
does not read as slow and considered — it reads as laggy, because the page and
the thing painted on it are moving at different times.

### The fix

Both constants are now **time constants in milliseconds**, applied as
`1 - Math.exp(-dt / TAU)`. `smooth.js` `TAU = 110`; `cine.js` `followTau = 120`
via a new `followAlpha(dt)`. `dt` is already clamped to 64ms by cine's loop and
to the same in smooth.js.

> **THE SEPARATION OF CONCERNS THAT MAKES TIGHTENING SAFE, and the thing every
> earlier round conflated.** The brake on a FLICK is the speed cap
> (`step`/`back`, per beat) — untouched. The HOLD plateau — untouched. Section
> heights — untouched. `follow` only ever decided how far behind the page the
> scene sits during ORDINARY scrolling, and the right answer to that is "barely
> at all". The input is now damped once, in `smooth.js`; damping it a second
> time in `cine.js` bought nothing but lag.

### The numbers

| | before | after |
|---|---|---|
| scroll settles after one notch | ~950ms | **~470-510ms** |
| scene settles after one notch | 1.5-1.8s | **0.69-0.84s** |
| scene starts moving (web3) | 255ms | **125ms** |
| page trails the hand, sustained scroll | 213-266px | **142-152px** |
| glide continues after last notch | ~1330ms | **~640ms** |
| velocity chatter under real frame jitter | 19.9% | **3.5%** |
| speed difference 60Hz vs 144Hz | **2.4x** | **none** |

### Two measurement traps this pass, both of which produced false results first

1. **Raw `|v[i]-v[i-1]|` is not a smoothness metric.** It made the new build
   look 2-3x *worse* (0.36 vs 0.18), purely because a curve that settles in half
   the time has twice the legitimate velocity decay per frame. A 5-point moving
   average of position has the same bias — it reported 1.56px of "wobble" against
   0.51px. **Run the new damper at the OLD speed and the two are identical
   (0.52px vs 0.51px), which is the only way to isolate dt-compensation from the
   speed change.** Compare like for like or the metric measures the wrong thing.
2. **Latency measured through a CDP round-trip is not page latency.** Timing
   from the `page.mouse.wheel()` call gave 81-88ms; recording
   `performance.now()` inside the page's own wheel listener gives **17-28ms**.
   The first number would have sent this pass chasing an input-latency problem
   that does not exist.

### Verified
- **Flick safety — the thing that must not regress.** A full-aggression flick
  across a whole pinned section (jump from the pin's top to its bottom) still
  takes **3.8-4.4s** and visits every beat: app 6/6, web3 6/6, sanctuary 4/4,
  182-241 distinct rendered frames. It cannot flash through. web3 actually
  **improved from 5/6 to 6/6** — the old follow was so slow one beat never fully
  arrived during a flick.
- **No lurch.** Max single-frame change in a scrubbed `--w` during a steady
  read: 0.071 / 0.034 / 0.071, against the old build's 0.073 / 0.033 / 0.067.
- **No backward steps** in the glide on any page (a re-sync stutter would show
  as one); settle time held constant under 4x CPU throttle (1155 -> 1180ms),
  which is the frame-rate independence confirmed in the real browser.
- **Sitewide identical to baseline**: 6 pages x 375/390/430/768/1024/1280/1440/
  1920 = 48 checks, **0 horizontal overflow**, same two documented 404s
  (`favicon.ico`, `about-hero-mobile.jpg`), same two pre-existing sub-10px SVG
  `<text>` contrast entries. Nothing new.
- **Mobile beats all land** at 390x844 — index `.jm-item` 7/7, `.eco-item` 3/3,
  `.tm-item` 4/4, `.pr-para` 3/3; app `.edy-row` 6/6, `.quest-card` 6/6;
  sanctuary `.found-item` 4/4, `.seven-day` 7/7, `.day-entry` 9/9, `.rv` 18/18;
  web3 `.part-item` 6/6, `.loop-node` 9/9, `.rv` 51/51.
  `.bridge-step-i` read 0.30 and `.market-scene` 0.98 on the coarse grid and are
  **both 1.00 when polled to convergence** — the fifth time that trap is
  recorded.
- **Damper arms correctly**: on desktop with motion allowed, **off** under
  `prefers-reduced-motion`, **off** on touch. Both page ends exactly reachable
  on all 8 damped pages; anchors land within the documented 0-79px.
- **Judged by eye** at 1440x900 (app Living Ecosystem, sanctuary Four
  Foundations, web3 participation) and 390x844 (index, app).

> If `js/smooth.js` is ever removed, raise `followTau` toward ~200ms — the two
> are still a pair, they are just both honest about time now.

### Flagged, not changed — three backup folders are inside the deployable folder
`images-original/` (49MB, already documented as do-not-upload), plus
**`baseline/` (8.3MB) and `original-backup/` (1.3MB)**, which are not documented
anywhere. 58.6MB of local safety copies sitting in the folder that gets dragged
into GitHub. They are not referenced by any page. Worth removing before an
upload, but they are a safety net so they were left alone.

### Upload
**`js/smooth.js` · `js/cine.js`** — nothing else changed.

---

## Nourish removed from the Living Ecosystem — it is not a data point — 17 September 2026

`app.html` only. Reported as "nourish is still this screen, its wrong", then
resolved by the user as **"remove nourish, it's not a data point"** — which is
the correct diagnosis and explains why three separate attempts to find it a
screen had all failed.

### Why no screen ever fitted

The section shows habits the app **measures**, one screen each. Nourish is not
measured. The blueprint ships quest detail screens for four habits only (QU-02
Steps, QU-03 Sleep, QU-04 Hydration, QU-05 Breathing) and its own README calls
Nourish an **ambient** habit, with no figure of its own.

**All 51 screens were checked by name and every plausible candidate was opened
and looked at.** There is no Nourish screen in the set:

| candidate | what it actually is |
|---|---|
| QU-01 today's quests | headed "Today's quests" over walking and breathing; the Nourish card is a footnote at the bottom |
| HM-03 evening | a **home screen** — so beside the word Nourish it repeated the section's own opening frame. This was the shipped state and is what was reported as wrong |
| MK-01 marketplace | merch hero, "Made by members"; already used in the marketplace section |
| MK-02 item-detail | **The Wind-Down — a SLEEP course** |
| MK-03 checkout | the same sleep course, and a payment screen |
| JO-04 waypoint-content | a rest story about Hua Hin |
| RC-03 what-credits-open | a list of what credits unlock; no food |

> The row's own copy, "Unlocks local food experiences", is verbatim from QU-01's
> ambient Nourish card — which is exactly the point. It is a *card*, not a
> screen, because there is no figure behind it.

### What changed

Six screens and five rows: **Home → Move → Rest → Breathe → Hydrate → Learn.**

- The Nourish `<li>` and the `app-home-evening.webp` `<img>` are gone; Learn
  moved `data-s="6"` -> `data-s="5"`.
- `shots.length !== 7` -> `!== 6`, `GLOW` lost its nourish entry, `BOUND` is
  `[0.4, 1.4, 2.4, 3.4, 4.4]`, the shot loop runs `< 6`, `states: 7` -> `6`,
  and the closing line's window moved `(pos - 5.35)` -> `(pos - 4.35)`.
- **`.edy-outer` 685vh -> 588vh.** One fewer beat at the SAME per-beat rate
  (685 = 6 x 97.5 + 100; 588 = 5 x 97.5 + 100), per the standing rule that a
  per-beat rate is a property of a section. Measured: app.html desktop
  32,074 -> **31,201px**, i.e. 873px = exactly the 97vh removed. Mobile is
  unaffected (`height: auto`).
- **Headline "Six habits." -> "Nothing counts alone."** A count could not stay:
  five rows under "Six habits" is the same error in reverse. "Five habits."
  was rejected because the phone beside it visibly shows **six** tiles — Nourish
  is still on the home screen, it is simply not a tracked input. "Every habit."
  was drafted and rejected too: `app.html` already carries "Every habit earns.
  Every credit counts." further down the same page. The line that shipped makes
  no count claim and carries the section's own body copy ("Most wellness apps
  track your metrics in isolation").
- The home screen's `alt` lost "all six habits as tiles" for "the day's actions
  as tiles" — the count clashed with the column beside it.

### Deliberately NOT changed — and this is a real inconsistency to decide on
`index.html` names Nourish twice as one of six ("Move, Rest, Breathe, Hydrate,
Nourish and Learn. Six habits on one screen"), and `investors.html` has a
"Six habits." line-mask. **Those are describing the home SCREEN, which genuinely
does show six tiles, so they are not false** — but the site now says six in two
places and shows five tracked habits in a third. Whether Nourish should also
come out of those is a positioning call, not a defect.

### Verified
- Section driven at 41 positions with the pacing polled to convergence: **all
  five rows reach `--w` 1.00**, the closing line reaches 1.00, **exactly one
  screen visible at a time** (no ghosting), and the screens shown are exactly
  `home-morning | steps | sleep | breathing | hydration | lesson` — no
  home-evening anywhere.
- **Sitewide identical to baseline**: 6 pages x 8 widths = 48 checks, 0
  horizontal overflow, the same two documented 404s, the same two pre-existing
  sub-10px SVG `<text>` entries. 0 new JS errors.
- **Judged by eye** at 1440x900 (the late and final beats) and 390x844 (the
  mobile list, which shows all five rows and the closing line).

> A pleasing accident worth keeping: the Learn beat's screen (LE-03) is a lesson
> called "Timing, not counting" — about **when to eat** — so the nourishment idea
> survives in the section, correctly framed as a lesson, which *is* a data point.

### Now unused
`images/app-home-evening.webp` (124KB) is referenced nowhere. Left in place
rather than deleted; it is the frame a future Nourish screen would replace.

### Upload
`app.html` only.
