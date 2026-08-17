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
- **Trong appears once.** He is profiled in the founding-team row; the Technology
  section names his remit and gives Etiosa the full profile, so no bio is repeated.
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

## Next planned work
**`web3.html` is done — built, numerically verified and judged by eye** (August 14).
Layout audited with zero issues at 1920×1080, 1440×900, 1280×800, 1280×720, 768×1024,
430×932, 390×844 and 375×667; every scene screenshotted and tuned. A fresh load logs
exactly one console error, the site-wide missing favicon.

**`sanctuary.html` still has not been judged by eye.** Its 3D scenes, hero sequence and
scroll behaviour were verified numerically only. Expect the pavilion camera and the hero
plate-pass timing to want tuning — and note that the web3 pass found four real problems
that the numbers had passed clean, so budget for the same there.

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
