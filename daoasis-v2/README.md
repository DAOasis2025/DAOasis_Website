# DAOasis Journey V2 — review sandbox

**For review only. Nothing in this folder is live, and nothing outside it was changed.**
Workflow: Current → Journey V2 → Jamie review → approved changes → production.

Open `index.html` (the hub) or `review/index.html` (the review document).

| Folder | What it is |
|---|---|
| `journeys/journeys.json` | **Source of truth.** Every Journey in one structure: Everest (flagship), Thailand (launch), Land's End to John o' Groats, Foundation (optional concept), plus Camino / Nakasendo / Kilimanjaro placeholders. |
| `journeys/journeys-data.js` | Generated from the JSON (`node tools/build-data.js`). Do not edit by hand. |
| `tools/journey-art.js` | Draws route maps, altitude profiles, route strips and ridgeline plates from the data. Used by the build and by the app prototype. |
| `app/` | App V2 prototype: seven screens, rendered from the data; `?journey=<id>` switches Journey, `&screen=<id>` shows one screen. |
| `site/` | Full copy of the website with the Journey V2 changes. Only `index.html`, `app.html` and the new `journeys.html` carry content changes. |
| `src/` | Source fragments for `site/journeys.html` (main content + CSS). |
| `review/` | The DAOasis Journey V2 Review document. |

## Rebuild after editing the data or `src/`

```
node tools/build-data.js     # journeys.json -> journeys-data.js
node tools/build-site.js     # assembles journeys.html, fills the generated maps, marks V2 pages noindex
python3 -m http.server 8899  # (from this folder) then, in another shell:
NODE_PATH=$(npm root -g) node tools/export-images.js   # re-export app screens + plates to site/images/v2
```

## Do not merge this folder into production as-is
If this branch were merged to `main`, Vercel would publish the folder at `/daoasis-v2/` (noindexed, but public).
Approved changes should be re-applied to the real files in a separate step.
