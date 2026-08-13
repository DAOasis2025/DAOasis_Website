# DAOasis Website — Status (as of 2026-08-13)

## Active working location — ONLY copy
**`C:\Users\Lenovo x270\Desktop\Website updates 2.0`**

This is the ONLY active working copy of the DAOasis website. Do not read from or write to any other location.

Files in this folder:
- `index.html` — home page
- `app.html` — Companion App page
- `images/` — all assets both pages use
- `vercel.json` — enables clean URLs (`/app` instead of `/app.html`), redirects `/sanctuary` and `/web3` to `/` since those pages don't exist yet.

---

## Previous location (August 12) — archived, no longer active
`G:\My Drive\From Computer\DAOasis\Website\Website updates\site\`
There was also an older, unlinked copy one level up (outside `site/`) with extra unused images — not part of the deployable site, ignore it.

---

## What was completed (August 12)
- Home page never linked to the app page (nav + footer "The App" were dead `#` links). Fixed: nav, footer, and hero CTAs now point to `app.html` / in-page sections (`#waitlistSection`, `#ecoSection`).
- Browser tab title on the home page was a leftover dev label ("DAOasis Hero Prototype v5"). Fixed to a real title, and added meta description + Open Graph tags to both pages so shared links preview properly (Slack/email).
- App page hero sub-copy tightened to state the core loop explicitly (track habits/learning → earn rewards) for 30-second clarity.
- Packaged the whole `site/` folder into a zip and delivered to the user for deployment.

---

## Deployment
- **Repo:** `DAOasis2025/DAOasis_Website` on GitHub
- **Live URL:** `https://da-oasis-website.vercel.app`
- **Auto-deploy:** Vercel redeploys (~60 seconds) on every file upload to the GitHub repo.
- **Workflow:** Edit files locally → save to `Website updates 2.0` desktop folder → upload to GitHub via browser → Vercel redeploys automatically. No CLI involved.

---

## Known gaps
- "The Sanctuary" and "The Web3 Layer" nav items / footer links are still placeholder `#` — those pages don't exist yet.
- "Join the Waitlist" buttons have no real signup form/backend yet (just links to the waitlist section on the home page).
- Nav items "About Us" and "Investors" are unlinked.

---

## Next planned work
Build out the `app.html` Companion App page hero section to homepage quality standard — the primary active build goal. Treat each session as fresh and focused. This file is the handoff between sessions.

### Key constraints for app.html work
- Use `background-image` CSS for photo backgrounds — never `<img>` tags with filter overlays.
- Use full device mockup PNGs (iPhone frame baked in), not raw screenshot PNGs.
- The "Living Ecosystem" and "Quest 01" sections on app.html are working — do not touch them.
- `index.html` is the visual quality benchmark — do not modify it.
- Confirm which file is being edited before making any change.
