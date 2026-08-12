# DAOasis Website — Setup Notes

Read this before asking Claude (or anyone else) to redeploy. It exists so we stop re-explaining the same setup every time.

## Accounts (already set up — don't ask again)
- GitHub: have it.
- Vercel: have it, log in via "Sign in with GitHub" (so Vercel already sees our repos — no separate Vercel password/token needed).
- No CLI, no tokens, no API keys used anywhere in this workflow. Everything below is browser clicks only.

## What's live where
- GitHub repo: **[fill in repo name/URL here once created]**
- Vercel project: imported from that repo — once this exists, pushing changed files to the repo auto-redeploys. Nobody needs to touch the Vercel dashboard for routine updates.
- Live URL: **[fill in once deployed]**

## How to ship an update (every time, after this first setup)
1. Get the updated files (this README plus `index.html`, `app.html`, `images/`, `vercel.json`).
2. On GitHub, open the repo above → **Add file → Upload files** → drag in the changed files (this overwrites the old versions at those paths).
3. Commit. Vercel picks it up and redeploys automatically within a minute or two — that's the whole update process.
4. Don't create a new GitHub repo or a new Vercel project for updates — only for the very first deploy.

## What's in this folder
- `index.html` — home page
- `app.html` — Companion App page
- `images/` — everything both pages reference
- `vercel.json` — makes `/app` work instead of requiring `/app.html`, and redirects `/sanctuary` and `/web3` to `/` since those pages don't exist yet

## Known gaps (not bugs — just not built yet, don't re-flag these)
- "The Sanctuary" and "The Web3 Layer" nav/footer links are placeholders — no pages built for them yet.
- "Join the Waitlist" buttons link to the waitlist section on the home page but there's no actual signup form/backend behind them yet.
- "About Us" and "Investors" nav links are unlinked.

## For Claude
Full project history and decisions live in the DAOasis CEO project doc `daoasis-website-status.md` — read that first in a new session instead of asking the user to re-explain any of the above.
