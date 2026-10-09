# DAOasis Website — Setup Notes

Read this before asking Claude (or anyone else) to redeploy. It exists so we stop re-explaining the same setup every time.

## Accounts (already set up — don't ask again)
- GitHub: have it.
- Vercel: have it, log in via "Sign in with GitHub" (so Vercel already sees our repos — no separate Vercel password/token needed).
- No CLI, no tokens, no API keys used anywhere in this workflow. Everything below is browser clicks only.

## What's live where
- GitHub repo: **DAOasis2025/DAOasis_Website** — https://github.com/DAOasis2025/DAOasis_Website
- Vercel project: **da-oasis-website** — imported from that repo. Once this exists, pushing changed files to the repo auto-redeploys. Nobody needs to touch the Vercel dashboard for routine updates.
- Live URL: **https://da-oasis-website.vercel.app**

## How to ship an update (every time, after this first setup)
1. Get the updated files (this README plus `index.html`, `app.html`, `images/`, `vercel.json`).
2. On GitHub, open the repo above → **Add file → Upload files** → drag in the changed files (this overwrites the old versions at those paths).
3. Commit. Vercel picks it up and redeploys automatically within a minute or two — that's the whole update process.
4. Don't create a new GitHub repo or a new Vercel project for updates — only for the very first deploy.

## What's in this folder
- `index.html` — home page
- `app.html` — Companion App page
- `sanctuary.html` — The Sanctuary page
- `web3.html` — The Web3 Layer page
- `images/` — everything the pages reference
- `vercel.json` — makes `/app`, `/sanctuary` and `/web3` work instead of requiring the `.html`. No redirects remain; every nav destination is a real page now.

## Known gaps (not bugs — just not built yet, don't re-flag these)
- The sign-up form (home, App and Sanctuary pages) needs the MailerLite address pasted in — see below. Until then it opens the visitor's email app.
- "About Us" and "Investors" nav links are unlinked.
- There's no `favicon.ico`, so every page logs one 404 in the browser console.

## Connecting the sign-up form to MailerLite (one-time, about 15 minutes)

The sign-up form on the home, App and Sanctuary pages is ready. Until you finish
these steps it opens the visitor's own email app instead (nothing is lost, nothing
is pretended). Once you paste one address in, it adds people to MailerLite directly.

**A. Create a group** (this is your list)
1. Log in to MailerLite → **Subscribers** → **Groups** tab → **Create group**.
2. Name it `Early access` → **Save**.

**B. Create the "interests" field** (so you can see what each person ticked)
1. **Subscribers** → **Fields** tab → **Create field**.
2. Field name: `interests` (exactly that, lower case). Type: **Text** → **Save**.

**C. Create the form**
1. **Forms** → **Embedded forms** → **Create embedded form**.
2. Name it `Website sign-up`, choose the **Early access** group → **Save**.
3. In the form editor, add the **Name** field and the **interests** field (drag them in
   from the left). You do not need to style it — the website uses its own design.
4. Click **Save and publish**.

**D. Copy one address**
1. On the published form, open **Overview** → **Embed form** → choose **HTML code**.
2. In that code find the line starting `<form` and copy the address inside
   `action="..."`. It looks like
   `https://assets.mailerlite.com/jsonp/1234567/forms/987654321098765432/subscribe`.

**E. Paste it into the website**
1. On GitHub open `js/signup.js` → click the pencil (Edit).
2. Near the top find `endpoint: '',` and paste the address between the quotes:
   `endpoint: 'https://assets.mailerlite.com/jsonp/.../subscribe',`
3. **Commit changes**. Vercel redeploys in about a minute.

**F. Test it**
Open the site, sign up with your own email, and check the person appears in the
**Early access** group with their interests filled in. If double opt-in is switched
on in MailerLite, you will get a confirmation email first — that is expected.

*Optional — automatic segments.* If you would rather have one group per interest,
create groups named Companion App, Sanctuary, Community and Investor / partner, then
put each group's ID (Subscribers → Groups → click the group; the number in the web
address) next to its name under `groups:` in the same file. Interests are always
also saved as text in the `interests` field, so this step is not required.

## For Claude
Full project history and decisions live in the DAOasis CEO project doc `daoasis-website-status.md` — read that first in a new session instead of asking the user to re-explain any of the above.
