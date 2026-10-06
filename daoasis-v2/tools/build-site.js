// DAOasis Journey V2 — builds the website review copy in daoasis-v2/site.
//   1. Assembles site/journeys.html from site/about.html's chrome + src/journeys-main.html + src/journeys.css
//   2. Fills every <!--JV2:name-->…<!--/JV2:name--> marker in site/*.html from journeys.json
//   3. Marks every V2 page noindex, drops its canonical, and adds the small "V2 review copy" tag
// Idempotent: safe to run again after editing the data or the src fragments.
// Run: node tools/build-site.js
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), SITE = path.join(ROOT, 'site'), SRC = path.join(ROOT, 'src');
const A = require('./journey-art.js');
const D = JSON.parse(fs.readFileSync(path.join(ROOT, 'journeys/journeys.json'), 'utf8'));
const J = Object.fromEntries(D.journeys.map(j => [j.id, j]));
const ev = J['everest-base-camp'], le = J['lands-end-john-o-groats'];
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

/* 1 — journeys.html */
(function assemble() {
  const about = fs.readFileSync(path.join(SITE, 'about.html'), 'utf8');
  const main = fs.readFileSync(path.join(SRC, 'journeys-main.html'), 'utf8');
  const css = fs.readFileSync(path.join(SRC, 'journeys.css'), 'utf8');
  const a = about.indexOf('<main'), b = about.indexOf('<footer class="site-footer">');
  if (a < 0 || b < 0) throw new Error('about.html markers not found');
  let page = about.slice(0, a) + main + '\n\n' + about.slice(b);
  page = page
    .replace(/<title>[^<]*<\/title>/, '<title>DAOasis Journeys | Walk the best parts of the world</title>')
    .replace(/(<meta name="description" content=")[^"]*/, '$1Imagine walking the best parts of the world, from anywhere. DAOasis Journeys turn everyday progress — movement, rest, learning — into extraordinary routes, from Everest Base Camp to Thailand.')
    .replace(/(<meta property="og:title" content=")[^"]*/, '$1DAOasis Journeys | Walk the best parts of the world')
    .replace(/(<meta name="twitter:title" content=")[^"]*/, '$1DAOasis Journeys | Walk the best parts of the world')
    .replace(/(<meta property="og:description" content=")[^"]*/, '$1Your everyday progress becomes part of a Journey — from Thailand to the foot of Everest.')
    .replace(/(<meta name="twitter:description" content=")[^"]*/, '$1Your everyday progress becomes part of a Journey — from Thailand to the foot of Everest.')
    .replace(/(<meta property="og:url" content="[^"]*)\/about"/, '$1/journeys"')
    .replace('</head>', '<style>/*JV2-CSS*/\n' + css + '\n/*/JV2-CSS*/</style>\n</head>');
  // the CTO dialog belongs to about.html only — drop its script block if present
  page = page.replace(/<script>\s*\/\* ── THE CTO ROLE PANEL[\s\S]*?<\/script>/, '').replace('<a class="skip-link" href="#team">', '<a class="skip-link" href="#mainContent">');
  fs.writeFileSync(path.join(SITE, 'journeys.html'), page);
})();

/* 2 — generated fragments */
const stagesList = ev.stages.map((s, i) => `<li><span class="n">${String(i + 1).padStart(2, '0')}</span><span class="t">${esc(s.name)}${s.rest_stage ? '<span class="r">Rest stage</span>' : ''}<span class="s">${esc(s.title)}</span></span><span class="k">${s.altitude_m.toLocaleString('en-GB')} m · ${s.km} km</span></li>`).join('');
const FRAG = {
  'everest-map': A.routeMap(ev, { W: 620, H: 860, km: 0, marker: false, labels: 'stages', id: 'web-ev', pad: { l: 185, r: 150, t: 90, b: 70 } }),
  'everest-profile': A.profile(ev, { W: 760, H: 330, km: 0, marker: false, id: 'web-evp', pad: { l: 64, r: 30, t: 70, b: 40 } }),
  'everest-stages': stagesList,
  'lejog-map': A.routeMap(le, { W: 800, H: 500, km: 0, marker: false, labels: 'none', id: 'web-le', pad: { l: 40, r: 40, t: 40, b: 40 } }),
  'everest-mini': A.routeMap(ev, { W: 520, H: 640, km: 0, marker: false, labels: 'stages', peakLabels: false, id: 'web-evm', pad: { l: 130, r: 130, t: 60, b: 50 } })
};

/* 3 — every page */
const TAG = '<!--JV2-TAG--><a href="../" class="jv2-tag" style="position:fixed;right:14px;bottom:14px;z-index:9999;font:500 10.5px/1 \'Frank Ruhl Libre\',Georgia,serif;letter-spacing:.16em;text-transform:uppercase;color:#171412;background:#E3B98C;padding:8px 12px;border-radius:99px;text-decoration:none;box-shadow:0 6px 18px rgba(0,0,0,.25)">Journey V2 · review copy</a><!--/JV2-TAG-->';
for (const f of fs.readdirSync(SITE).filter(f => f.endsWith('.html'))) {
  const p = path.join(SITE, f); let s = fs.readFileSync(p, 'utf8'), n = 0;
  s = s.replace(/<!--JV2:([\w-]+)-->[\s\S]*?<!--\/JV2:\1-->/g, (m, k) => { if (!FRAG[k]) throw new Error('No fragment ' + k + ' in ' + f); n++; return `<!--JV2:${k}-->${FRAG[k]}<!--/JV2:${k}-->`; });
  s = s.replace(/\s*<link rel="canonical"[^>]*>/, '');
  if (!s.includes('content="noindex,nofollow"')) s = s.replace(/<meta charset="UTF-8"\s*\/?>/i, m => m + '\n<meta name="robots" content="noindex,nofollow" />');
  s = s.replace(/\s*<!--JV2-TAG-->[\s\S]*?<!--\/JV2-TAG-->\s*(?=<\/body>)/, '\n');
  s = s.replace(/<\/body>(?![\s\S]*<\/body>)/, TAG + '\n</body>');
  fs.writeFileSync(p, s);
  if (n) console.log(f + ': ' + n + ' generated fragment(s)');
}
console.log('site built');
