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

## What was completed (August 13) — the Sanctuary page
Built `sanctuary.html` as a new standalone page. `index.html` and `app.html` were **not** modified.
Only other change: removed the `/sanctuary → /` redirect from `vercel.json` so the page is reachable at its own URL.

Page structure, in scroll order:
hero → The Sanctuary → Philosophy → Four Foundations → Seven Days → An Average Day →
**3D one** → Immersion → The Experience → The Place → **3D two** → Transformation →
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
| sanctuary | hero plate pass | guided · epic | 3 |
| sanctuary | four foundations | sticky · major | 4 |
| sanctuary | seven days arc | sticky · epic | 7 |
| sanctuary | both 3D scenes | guided · epic | 7 |
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
