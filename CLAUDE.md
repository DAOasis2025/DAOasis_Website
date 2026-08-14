# DAOasis Website — Status (as of 2026-08-14)

## Active working location — ONLY copy
**`C:\Users\Lenovo x270\Desktop\Website updates 2.0`**

This is the ONLY active working copy of the DAOasis website. Do not read from or write to any other location.

Files in this folder:
- `index.html` — home page
- `app.html` — Companion App page
- `sanctuary.html` — The Sanctuary page
- `web3.html` — The Web3 Layer page
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
- Nav items "About Us" and "Investors" are unlinked everywhere.
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
