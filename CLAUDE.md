# DAOasis Website — Status (as of 2026-08-13)

## Active working location — ONLY copy
**`C:\Users\Lenovo x270\Desktop\Website updates 2.0`**

This is the ONLY active working copy of the DAOasis website. Do not read from or write to any other location.

Files in this folder:
- `index.html` — home page
- `app.html` — Companion App page
- `sanctuary.html` — The Sanctuary page
- `images/` — all assets the pages use
- `vercel.json` — enables clean URLs (`/app`, `/sanctuary`). Still redirects `/web3` to `/` because that page does not exist yet.
- `.claude/launch.json` — local static preview server (`npx serve` on port 8791)

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

**Note on `/web3`:** `index.html` has a card link to `/web3`. It 404s on the local `serve` preview because `serve` ignores `vercel.json`, but on Vercel it redirects to `/` as intended. Not a bug.

### Dead code worth deleting sometime
`index.html` contains a complete lightbox — CSS (lines ~252–272), markup (~1243–1255) and a `url:` field on every `cardData` entry — with **zero JavaScript references**. Nothing opens it, populates it, or adds `.open`. It was superseded by the inline `.card-more` expand. Its `href="#"` CTA is therefore unreachable, not a live bug. Safe to remove as cleanup; do not waste time "fixing" it.

---

## Known gaps
- "The Web3 Layer" has no page; nav/footer links are placeholders and `vercel.json` still redirects `/web3` to `/`.
- Nav items "About Us" and "Investors" are unlinked everywhere.
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
Do a visual pass over `sanctuary.html` at desktop and mobile width. The 3D scenes, hero sequence and all scroll behaviour have been verified numerically (no errors, correct light cycle, correct framing, no dead frames) but **have not yet been judged by eye** — expect the pavilion camera and the hero plate-pass timing to want tuning.

Then upload `index.html`, `app.html`, `sanctuary.html`, `vercel.json` to GitHub to deploy.
