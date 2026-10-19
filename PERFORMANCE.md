# Website delivery

Run `npm ci`, `npm run build`, then `npm test`. Vercel runs the build and serves `dist/`.
Source HTML remains usable with an ordinary static server; deployment inlines the
local font declarations and signup CSS to avoid their blocking stylesheet requests.

- `fonts/` contains the same Google Fonts WOFF2 binaries, character subsets and
  weights previously requested remotely. Font licenses are included. Only fonts
  matching text on the page are downloaded; the two normal Latin fonts are preloaded.
- Responsive derivatives are used for the static mobile dashboard and drawer logo.
  The mobile hero photograph retains its dimensions and crop in a smaller WebP.
- CSS receives whitespace/comment minification only (all CleanCSS optimizations
  disabled except whitespace removal). Signup,
  trust and menu accessibility JS is minified without compression or name mangling.
- `js/cine.js`, `js/smooth.js`, all inline scripts, introduction imagery and the
  animated desktop dashboard remain unchanged. HTML whitespace is preserved.

`npm test` compares inline scripts and original layout/animation CSS against the
merge of PR #27 (`9ee9021`), checks scrolling scripts, parses delivered JavaScript,
and checks local HTML asset references. `node scripts/size-report.cjs` prints
source and delivered sizes. Browser checks are still needed for keyboard focus,
form validation and appearance. Do not submit real signup data during checks.
