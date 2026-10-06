/* DAOasis Journey V2 — artwork generator.
 * One file, used by the build (Node) and by the app prototype (browser).
 * Everything is DRAWN FROM THE JOURNEY DATA: route maps from stage coordinates,
 * altitude profiles from stage + landmark altitudes. No Journey is special-cased.
 * Returns SVG strings. Text inside uses the page's own fonts (inline SVG only).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.JourneyArt = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  var GOLD = '#C48A5A', GOLD_HI = '#E3B98C', MINT = '#6DBF9E', INK = '#0F1C21', IVORY = '#F4EFE6';

  /* ---------- small helpers ---------- */
  function rng(seed) { var s = seed >>> 0; return function () { s = (s + 0x6D2B79F5) >>> 0; var t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function hashStr(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function f(n) { return Math.round(n * 10) / 10; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function lerp(a, b, t) { return a + (b - a) * t; }

  /* ---------- Journey route points: stages + landmarks sorted by km ---------- */
  function routePoints(j) {
    var pts = [];
    (j.stages || []).forEach(function (s, i) { pts.push({ km: s.km, coords: s.coords, alt: s.altitude_m, name: s.name, kind: 'stage', idx: i, stage: s }); });
    (j.landmarks || []).forEach(function (l) { pts.push({ km: l.km, coords: l.coords, alt: l.altitude_m, name: l.name, kind: 'landmark', note: l.note }); });
    pts.sort(function (a, b) { return a.km - b.km; });
    return pts;
  }

  /* ---------- Route map (plan view) ---------- */
  function project(j, W, H, pad) {
    var pts = routePoints(j).filter(function (p) { return p.coords; });
    var lats = pts.map(function (p) { return p.coords[0]; }), lons = pts.map(function (p) { return p.coords[1]; });
    (j.peaks || []).forEach(function (p) { lats.push(p.coords[0]); lons.push(p.coords[1]); });
    var minLat = Math.min.apply(0, lats), maxLat = Math.max.apply(0, lats), minLon = Math.min.apply(0, lons), maxLon = Math.max.apply(0, lons);
    var midLat = (minLat + maxLat) / 2, k = Math.cos(midLat * Math.PI / 180);
    var wUnits = (maxLon - minLon) * k || 1, hUnits = (maxLat - minLat) || 1;
    var sc = Math.min((W - pad.l - pad.r) / wUnits, (H - pad.t - pad.b) / hUnits);
    var offX = pad.l + ((W - pad.l - pad.r) - wUnits * sc) / 2, offY = pad.t + ((H - pad.t - pad.b) - hUnits * sc) / 2;
    return function (c) { return [offX + (c[1] - minLon) * k * sc, offY + (maxLat - c[0]) * sc]; };
  }

  // Catmull-Rom samples between consecutive points; returns [{x,y,km}]
  function splineSamples(P, kms) {
    var out = [], n = P.length;
    function pt(i) { if (i < 0) return [2 * P[0][0] - P[1][0], 2 * P[0][1] - P[1][1]]; if (i >= n) return [2 * P[n - 1][0] - P[n - 2][0], 2 * P[n - 1][1] - P[n - 2][1]]; return P[i]; }
    for (var i = 0; i < n - 1; i++) {
      var p0 = pt(i - 1), p1 = pt(i), p2 = pt(i + 1), p3 = pt(i + 2), steps = 18;
      for (var s = 0; s < steps; s++) {
        var t = s / steps, t2 = t * t, t3 = t2 * t;
        var x = 0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3);
        var y = 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);
        out.push({ x: x, y: y, km: lerp(kms[i], kms[i + 1], t) });
      }
    }
    out.push({ x: P[n - 1][0], y: P[n - 1][1], km: kms[n - 1] });
    return out;
  }
  function pathD(samples) { return samples.map(function (s, i) { return (i ? 'L' : 'M') + f(s.x) + ' ' + f(s.y); }).join(''); }
  function posAt(samples, km) { for (var i = 1; i < samples.length; i++) { if (samples[i].km >= km) { var a = samples[i - 1], b = samples[i], t = (km - a.km) / ((b.km - a.km) || 1); return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), i: i }; } } var l = samples[samples.length - 1]; return { x: l.x, y: l.y, i: samples.length - 1 }; }

  // Procedural relief field + marching squares contours.
  function contours(W, H, seed, hills, ridgy, levels) {
    var R = rng(seed), gx = 70, gy = Math.round(70 * H / W), cw = W / gx, ch = H / gy;
    var ph = []; for (var i = 0; i < 6; i++) ph.push([R() * 6.28, R() * 6.28, 0.6 + R() * 1.6, 0.6 + R() * 1.6]);
    function z(x, y) {
      var u = x / W, v = y / H, a = 0;
      for (var i = 0; i < ph.length; i++) a += Math.sin(u * ph[i][2] * 6 + ph[i][0]) * Math.cos(v * ph[i][3] * 6 + ph[i][1]) / (1 + i * 0.55);
      a = ridgy ? 1 - Math.abs(a) * 0.9 : a * 0.5 + 0.5;
      for (var h = 0; h < hills.length; h++) { var dx = (x - hills[h][0]) / hills[h][2], dy = (y - hills[h][1]) / hills[h][2]; a += hills[h][3] * Math.exp(-(dx * dx + dy * dy)); }
      return a;
    }
    var grid = []; for (var j = 0; j <= gy; j++) { grid[j] = []; for (var i2 = 0; i2 <= gx; i2++) grid[j][i2] = z(i2 * cw, j * ch); }
    var lo = 1e9, hi = -1e9; grid.forEach(function (r) { r.forEach(function (v) { if (v < lo) lo = v; if (v > hi) hi = v; }); });
    var paths = [];
    for (var L = 1; L <= levels; L++) {
      var th = lo + (hi - lo) * L / (levels + 1), d = '';
      for (var y = 0; y < gy; y++) for (var x = 0; x < gx; x++) {
        var a = grid[y][x], b = grid[y][x + 1], c = grid[y + 1][x + 1], e = grid[y + 1][x];
        var idx = (a > th ? 8 : 0) | (b > th ? 4 : 0) | (c > th ? 2 : 0) | (e > th ? 1 : 0);
        if (idx === 0 || idx === 15) continue;
        var x0 = x * cw, y0 = y * ch;
        var T = [x0 + cw * (th - a) / (b - a), y0], Rr = [x0 + cw, y0 + ch * (th - b) / (c - b)], B = [x0 + cw * (th - e) / (c - e), y0 + ch], Lf = [x0, y0 + ch * (th - a) / (e - a)];
        var segs = { 1: [Lf, B], 2: [B, Rr], 3: [Lf, Rr], 4: [T, Rr], 5: [Lf, T, B, Rr], 6: [T, B], 7: [Lf, T], 8: [Lf, T], 9: [T, B], 10: [Lf, B, T, Rr], 11: [T, Rr], 12: [Lf, Rr], 13: [B, Rr], 14: [Lf, B] }[idx];
        for (var s = 0; s < segs.length; s += 2) d += 'M' + f(segs[s][0]) + ' ' + f(segs[s][1]) + 'L' + f(segs[s + 1][0]) + ' ' + f(segs[s + 1][1]);
      }
      paths.push({ d: d, major: L % 4 === 0 });
    }
    return paths;
  }

  /* routeMap(journey, {W,H, km, labels:'all'|'stages'|'none', id}) -> svg */
  function routeMap(j, o) {
    o = o || {}; var W = o.W || 720, H = o.H || 900, km = o.km != null ? o.km : (j.demo ? j.demo.km : 0);
    var pad = o.pad || { l: 150, r: 150, t: 80, b: 80 }, labels = o.labels || 'stages', uid = (o.id || j.id) + '-rm';
    var proj = project(j, W, H, pad), pts = routePoints(j).filter(function (p) { return p.coords; });
    var P = pts.map(function (p) { return proj(p.coords); }), kms = pts.map(function (p) { return p.km; });
    var S = splineSamples(P, kms), now = posAt(S, km);
    var done = S.slice(0, now.i).concat([{ x: now.x, y: now.y, km: km }]), todo = [{ x: now.x, y: now.y, km: km }].concat(S.slice(now.i));
    // relief
    var hills = (j.peaks || []).map(function (pk) { var p = proj(pk.coords); return [p[0], p[1], W * 0.11, (pk.m - 6000) / 3500]; });
    var ridgy = j.kind === 'altitude';
    var cs = contours(W, H, hashStr(j.id), hills, ridgy, ridgy ? 26 : 20);
    var g = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Route map of ' + esc(j.name) + '" class="jv2-map" font-family="\'Frank Ruhl Libre\',\'DM Sans\',Georgia,serif">';
    g += '<defs><radialGradient id="' + uid + '-bg" cx="50%" cy="46%" r="75%"><stop offset="0" stop-color="#16262a"/><stop offset="1" stop-color="' + INK + '"/></radialGradient>' +
      '<filter id="' + uid + '-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>' +
      '<linearGradient id="' + uid + '-fade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + INK + '" stop-opacity=".85"/><stop offset=".22" stop-color="' + INK + '" stop-opacity="0"/><stop offset=".78" stop-color="' + INK + '" stop-opacity="0"/><stop offset="1" stop-color="' + INK + '" stop-opacity=".9"/></linearGradient></defs>';
    g += '<rect width="' + W + '" height="' + H + '" fill="url(#' + uid + '-bg)"/>';
    g += '<g fill="none" stroke-linecap="round">';
    cs.forEach(function (c) { g += '<path d="' + c.d + '" stroke="' + (c.major ? 'rgba(130,170,150,.30)' : 'rgba(130,170,150,.14)') + '" stroke-width="' + (c.major ? 1 : 0.7) + '"/>'; });
    g += '</g><rect width="' + W + '" height="' + H + '" fill="url(#' + uid + '-fade)"/>';
    // peaks
    (j.peaks || []).forEach(function (pk, i) {
      var p = proj(pk.coords), big = i === 0;
      g += '<path d="M' + f(p[0] - 6) + ' ' + f(p[1] + 4) + 'L' + f(p[0]) + ' ' + f(p[1] - 7) + 'L' + f(p[0] + 6) + ' ' + f(p[1] + 4) + 'Z" fill="none" stroke="rgba(244,239,230,.55)" stroke-width="1.1" stroke-linejoin="round"/>';
      if (pk.label === 'none' || labels === 'none' || o.peakLabels === false) return;
      if (pk.label === 'below') { g += '<text x="' + f(p[0]) + '" y="' + f(p[1] + 22) + '" text-anchor="middle" font-size="13" fill="rgba(244,239,230,.78)" letter-spacing=".04em">' + esc(pk.name) + ' <tspan fill-opacity=".6">' + pk.m.toLocaleString('en-GB') + ' m</tspan></text>'; return; }
      g += '<text x="' + f(p[0] + 11) + '" y="' + f(p[1] + 3) + '" font-size="' + (big ? 14 : 12) + '" fill="rgba(244,239,230,' + (big ? .8 : .5) + ')" letter-spacing=".04em">' + esc(pk.name) + ' <tspan fill-opacity=".6">' + pk.m.toLocaleString('en-GB') + ' m</tspan></text>';
    });
    // route
    g += '<path d="' + pathD(todo) + '" fill="none" stroke="rgba(244,239,230,.55)" stroke-width="1.6" stroke-dasharray="2 7" stroke-linecap="round"/>';
    g += '<path d="' + pathD(done) + '" fill="none" stroke="' + GOLD + '" stroke-width="9" opacity=".5" filter="url(#' + uid + '-glow)"/>';
    g += '<path d="' + pathD(done) + '" fill="none" stroke="' + GOLD_HI + '" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>';
    // landmarks
    if (labels === 'all') pts.forEach(function (p, i) { if (p.kind !== 'landmark') return; g += '<circle cx="' + f(P[i][0]) + '" cy="' + f(P[i][1]) + '" r="2.6" fill="' + INK + '" stroke="rgba(244,239,230,.6)" stroke-width="1"/>'; });
    // stages
    pts.forEach(function (p, i) {
      if (p.kind !== 'stage') return; var s = p.stage, reached = p.km <= km + 0.001, x = P[i][0], y = P[i][1], rest = s.rest_stage || s.type === 'rest', dest = s.type === 'destination';
      g += '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + (dest ? 9 : 7) + '" fill="' + INK + '" stroke="' + (reached ? GOLD_HI : 'rgba(244,239,230,.7)') + '" stroke-width="' + (reached ? 2.2 : 1.4) + '"/>';
      if (reached) g += '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="3.2" fill="' + GOLD_HI + '"/>';
      if (rest) g += '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="12.5" fill="none" stroke="' + MINT + '" stroke-width="1" stroke-dasharray="2 3" opacity=".9"/>';
      if (labels === 'none') return;
      var left = s.label_side === 'l', tx = left ? x - 17 : x + 17, anchor = left ? 'end' : 'start';
      g += '<text x="' + f(tx) + '" y="' + f(y - 1) + '" text-anchor="' + anchor + '" font-size="17" fill="' + IVORY + '" fill-opacity="' + (reached ? 1 : .86) + '" font-family="\'Cormorant Garamond\',Georgia,serif" font-weight="500">' + esc(s.name) + '</text>';
      g += '<text x="' + f(tx) + '" y="' + f(y + 15) + '" text-anchor="' + anchor + '" font-size="11.5" fill="' + IVORY + '" fill-opacity=".62" letter-spacing=".1em">' + (s.altitude_m ? s.altitude_m.toLocaleString('en-GB') + ' M · ' : '') + s.km + ' KM' + (rest ? ' · REST' : '') + '</text>';
    });
    // you are here
    if (o.marker !== false) {
      g += '<circle cx="' + f(now.x) + '" cy="' + f(now.y) + '" r="22" fill="' + GOLD + '" opacity=".22" filter="url(#' + uid + '-glow)"/>';
      g += '<circle cx="' + f(now.x) + '" cy="' + f(now.y) + '" r="9.5" fill="' + INK + '" stroke="' + GOLD_HI + '" stroke-width="2.4"/><circle cx="' + f(now.x) + '" cy="' + f(now.y) + '" r="4.2" fill="' + GOLD_HI + '"/>';
    }
    g += '</svg>';
    return g;
  }

  /* ---------- Altitude profile ---------- */
  function monotone(xs, ys) { // monotone cubic -> function path
    var n = xs.length, d = [], m = [], i;
    for (i = 0; i < n - 1; i++) d[i] = (ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]);
    m[0] = d[0]; m[n - 1] = d[n - 2];
    for (i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
    for (i = 0; i < n - 1; i++) { if (d[i] === 0) { m[i] = 0; m[i + 1] = 0; } else { var a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b; if (s > 9) { var t = 3 / Math.sqrt(s); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; } } }
    return function (x) { var k = n - 2; for (var q = 0; q < n - 1; q++) if (x <= xs[q + 1]) { k = q; break; } var h = xs[k + 1] - xs[k], t = (x - xs[k]) / h, t2 = t * t, t3 = t2 * t; return (2 * t3 - 3 * t2 + 1) * ys[k] + (t3 - 2 * t2 + t) * h * m[k] + (-2 * t3 + 3 * t2) * ys[k + 1] + (t3 - t2) * h * m[k + 1]; };
  }
  function hasAltitude(j) { return (j.stages || []).filter(function (s) { return s.altitude_m; }).length >= 3; }

  function profile(j, o) {
    o = o || {}; var W = o.W || 1000, H = o.H || 360, km = o.km != null ? o.km : (j.demo ? j.demo.km : 0), uid = (o.id || j.id) + '-pf';
    var pad = o.pad || { l: 56, r: 56, t: 64, b: 70 }, total = j.distance_km;
    var pts = routePoints(j).filter(function (p) { return p.alt; });
    var xs = pts.map(function (p) { return p.km; }), ys = pts.map(function (p) { return p.alt; }), fn = monotone(xs, ys);
    var aMin = Math.floor((Math.min.apply(0, ys) - 250) / 500) * 500, aMax = Math.ceil((Math.max.apply(0, ys) + 150) / 500) * 500;
    function X(v) { return pad.l + (v / total) * (W - pad.l - pad.r); } function Y(a) { return pad.t + (1 - (a - aMin) / (aMax - aMin)) * (H - pad.t - pad.b); }
    var steps = 160, line = [], all = []; for (var i = 0; i <= steps; i++) { var kk = total * i / steps, a = fn(kk); all.push([X(kk), Y(a), kk]); }
    var d = all.map(function (p, i) { return (i ? 'L' : 'M') + f(p[0]) + ' ' + f(p[1]); }).join('');
    var doneArr = all.filter(function (p) { return p[2] <= km; }); var xNow = X(km), yNow = Y(fn(km));
    var dDone = doneArr.map(function (p, i) { return (i ? 'L' : 'M') + f(p[0]) + ' ' + f(p[1]); }).join('') + 'L' + f(xNow) + ' ' + f(yNow);
    var base = H - pad.b, g = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Altitude profile of ' + esc(j.name) + '" class="jv2-profile" font-family="\'Frank Ruhl Libre\',\'DM Sans\',Georgia,serif">';
    g += '<defs><linearGradient id="' + uid + '-a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + GOLD + '" stop-opacity=".34"/><stop offset="1" stop-color="' + GOLD + '" stop-opacity="0"/></linearGradient><linearGradient id="' + uid + '-b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8e2d4" stop-opacity=".10"/><stop offset="1" stop-color="#e8e2d4" stop-opacity="0"/></linearGradient><filter id="' + uid + '-g" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="4"/></filter><clipPath id="' + uid + '-c"><rect x="0" y="0" width="' + f(xNow) + '" height="' + H + '"/></clipPath></defs>';
    for (var a2 = aMin; a2 <= aMax; a2 += 1000) if (a2 > aMin) g += '<line x1="' + pad.l + '" x2="' + (W - pad.r) + '" y1="' + f(Y(a2)) + '" y2="' + f(Y(a2)) + '" stroke="rgba(244,239,230,.09)"/><text x="' + (pad.l - 10) + '" y="' + f(Y(a2) + 4) + '" text-anchor="end" font-size="11" fill="rgba(244,239,230,.5)" letter-spacing=".08em">' + a2.toLocaleString('en-GB') + ' M</text>';
    g += '<path d="' + d + 'L' + f(X(total)) + ' ' + base + 'L' + f(X(0)) + ' ' + base + 'Z" fill="url(#' + uid + '-b)"/>';
    g += '<path d="' + d + 'L' + f(X(total)) + ' ' + base + 'L' + f(X(0)) + ' ' + base + 'Z" fill="url(#' + uid + '-a)" clip-path="url(#' + uid + '-c)"/>';
    g += '<path d="' + d + '" fill="none" stroke="rgba(244,239,230,.45)" stroke-width="1.4"/>';
    g += '<path d="' + dDone + '" fill="none" stroke="' + GOLD + '" stroke-width="7" opacity=".45" filter="url(#' + uid + '-g)"/><path d="' + dDone + '" fill="none" stroke="' + GOLD_HI + '" stroke-width="2.4" stroke-linejoin="round"/>';
    // landmarks (small)
    routePoints(j).forEach(function (p) { if (p.kind === 'landmark' && p.alt) g += '<circle cx="' + f(X(p.km)) + '" cy="' + f(Y(fn(p.km))) + '" r="2.4" fill="' + INK + '" stroke="rgba(244,239,230,.55)"/>'; });
    // stages
    (j.stages || []).forEach(function (s, i) {
      var x = X(s.km), y = Y(fn(s.km)), reached = s.km <= km + .001, rest = s.rest_stage || s.type === 'rest', up = (i % 2 === 0);
      g += '<line x1="' + f(x) + '" x2="' + f(x) + '" y1="' + f(y) + '" y2="' + base + '" stroke="rgba(244,239,230,' + (reached ? .28 : .14) + ')" stroke-dasharray="2 4"/>';
      g += '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="6.5" fill="' + INK + '" stroke="' + (reached ? GOLD_HI : 'rgba(244,239,230,.75)') + '" stroke-width="' + (reached ? 2 : 1.3) + '"/>';
      if (rest) g += '<circle cx="' + f(x) + '" cy="' + f(y) + '" r="11.5" fill="none" stroke="' + MINT + '" stroke-dasharray="2 3"/>';
      var anchor = i === 0 ? 'start' : (i === j.stages.length - 1 ? 'end' : 'middle'), tx = i === 0 ? x - 4 : (i === j.stages.length - 1 ? x + 4 : x);
      var prevX = i ? X(j.stages[i - 1].km) : -1e9, crowded = i && (x - prevX) < (W - pad.l - pad.r) * 0.14 && !j.stages[i - 1]._below;
      s._below = !!crowded; var ty = crowded ? y + 32 : y - 30;
      if (o.names === false) return;
      g += '<text x="' + f(tx) + '" y="' + f(ty) + '" text-anchor="' + anchor + '" font-size="13" fill="' + IVORY + '" fill-opacity="' + (reached ? 1 : .8) + '" font-family="\'Cormorant Garamond\',Georgia,serif" font-weight="500" style="font-size:16px">' + esc(s.name) + '</text>';
      g += '<text x="' + f(tx) + '" y="' + f(ty + 14) + '" text-anchor="' + anchor + '" font-size="10.5" fill="' + IVORY + '" fill-opacity=".55" letter-spacing=".1em">' + s.altitude_m.toLocaleString('en-GB') + ' M' + (rest ? ' · REST' : '') + '</text>';
      g += '<text x="' + f(x) + '" y="' + (base + 20) + '" text-anchor="middle" font-size="10.5" fill="' + IVORY + '" fill-opacity=".5" letter-spacing=".1em">' + s.km + ' KM</text>';
    });
    if (o.marker !== false) g += '<circle cx="' + f(xNow) + '" cy="' + f(yNow) + '" r="20" fill="' + GOLD + '" opacity=".25" filter="url(#' + uid + '-g)"/><circle cx="' + f(xNow) + '" cy="' + f(yNow) + '" r="8.5" fill="' + INK + '" stroke="' + GOLD_HI + '" stroke-width="2.4"/><circle cx="' + f(xNow) + '" cy="' + f(yNow) + '" r="3.6" fill="' + GOLD_HI + '"/>';
    g += '</svg>';
    return g;
  }

  /* ---------- Route strip (for Journeys with no altitude data) ---------- */
  function strip(j, o) {
    o = o || {}; var W = o.W || 1000, H = o.H || 150, km = o.km != null ? o.km : (j.demo ? j.demo.km : 0), pad = 56, total = j.distance_km;
    function X(v) { return pad + (v / total) * (W - pad * 2); } var y = H * 0.42;
    var g = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Route of ' + esc(j.name) + '" class="jv2-strip" font-family="\'Frank Ruhl Libre\',Georgia,serif">';
    g += '<line x1="' + pad + '" x2="' + (W - pad) + '" y1="' + y + '" y2="' + y + '" stroke="rgba(244,239,230,.35)" stroke-width="1.4" stroke-dasharray="2 6" stroke-linecap="round"/>';
    g += '<line x1="' + pad + '" x2="' + f(X(km)) + '" y1="' + y + '" y2="' + y + '" stroke="' + GOLD_HI + '" stroke-width="2.6" stroke-linecap="round"/>';
    (j.stages || []).forEach(function (s, i) {
      var x = X(s.km), reached = s.km <= km + .001, anchor = i === 0 ? 'start' : (i === j.stages.length - 1 ? 'end' : 'middle'), tx = i === 0 ? x - 6 : (i === j.stages.length - 1 ? x + 6 : x);
      g += '<circle cx="' + f(x) + '" cy="' + y + '" r="6.5" fill="' + INK + '" stroke="' + (reached ? GOLD_HI : 'rgba(244,239,230,.75)') + '" stroke-width="' + (reached ? 2 : 1.3) + '"/>';
      var up = i % 2 === 0;
      g += '<text x="' + f(tx) + '" y="' + (up ? y - 18 : y + 30) + '" text-anchor="' + anchor + '" fill="' + IVORY + '" fill-opacity="' + (reached ? 1 : .8) + '" font-family="\'Cormorant Garamond\',Georgia,serif" font-weight="500" style="font-size:16px">' + esc(s.name) + '</text>';
      g += '<text x="' + f(tx) + '" y="' + (up ? y - 33 : y + 45) + '" text-anchor="' + anchor + '" font-size="10.5" fill="' + IVORY + '" fill-opacity=".55" letter-spacing=".1em">' + s.km + ' KM</text>';
    });
    g += '<circle cx="' + f(X(km)) + '" cy="' + y + '" r="9" fill="' + INK + '" stroke="' + GOLD_HI + '" stroke-width="2.4"/><circle cx="' + f(X(km)) + '" cy="' + y + '" r="3.6" fill="' + GOLD_HI + '"/></svg>';
    return g;
  }

  /* ---------- Ridgeline plate (generated atmosphere, NOT photography) ---------- */
  function ridge(j, o) {
    o = o || {}; var W = o.W || 1200, H = o.H || 700, P = j.palette || {}, R = rng(hashStr((o.seed || j.id) + 'r')), uid = (o.id || j.id) + '-rg';
    var sky0 = P.sky_top || '#0d1a22', sky1 = P.sky_mid || '#2a3a3f', hor = P.horizon || '#c98a58', cols = P.ridge || ['#1a2b30', '#142226', '#0e191c', '#0a1214'];
    var g = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid slice" role="img" aria-label="' + esc(o.alt || j.name) + '" class="jv2-ridge">';
    g += '<defs><linearGradient id="' + uid + '-s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + sky0 + '"/><stop offset=".55" stop-color="' + sky1 + '"/><stop offset=".86" stop-color="' + hor + '"/><stop offset="1" stop-color="' + hor + '"/></linearGradient><radialGradient id="' + uid + '-sun" cx="' + (o.sunx || 0.64) + '" cy=".6" r=".45"><stop offset="0" stop-color="' + hor + '" stop-opacity=".55"/><stop offset="1" stop-color="' + hor + '" stop-opacity="0"/></radialGradient>';
    for (var i = 0; i < 4; i++) g += '<linearGradient id="' + uid + '-h' + i + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + cols[i] + '"/><stop offset="1" stop-color="' + cols[Math.min(3, i + 1)] + '"/></linearGradient>';
    g += '<linearGradient id="' + uid + '-v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + INK + '" stop-opacity=".35"/><stop offset=".5" stop-color="' + INK + '" stop-opacity="0"/><stop offset="1" stop-color="' + INK + '" stop-opacity=".55"/></linearGradient></defs>';
    g += '<rect width="' + W + '" height="' + H + '" fill="url(#' + uid + '-s)"/><rect width="' + W + '" height="' + H + '" fill="url(#' + uid + '-sun)"/>';
    // stars
    for (var s = 0; s < 70; s++) { var sy = R() * H * 0.42; g += '<circle cx="' + f(R() * W) + '" cy="' + f(sy) + '" r="' + f(0.5 + R() * 0.8) + '" fill="#f4efe6" opacity="' + f(0.15 + R() * 0.45 * (1 - sy / (H * 0.45))) + '"/>'; }
    var layers = [{ base: H * 0.60, amp: H * 0.22, rough: 7, peaks: o.peaks == null ? 1 : o.peaks, mist: .55 }, { base: H * 0.70, amp: H * 0.14, rough: 6, peaks: 0, mist: .38 }, { base: H * 0.80, amp: H * 0.09, rough: 5, peaks: 0, mist: .22 }, { base: H * 0.90, amp: H * 0.05, rough: 4, peaks: 0, mist: 0 }];
    layers.forEach(function (L, li) {
      var pts = [], n = 64, ph = R() * 10, f1 = 1.2 + R() * 1.2, f2 = 3 + R() * 2, peakAt = 0.3 + R() * 0.35;
      for (var k = 0; k <= n; k++) {
        var u = k / n, y = L.base - L.amp * (0.5 + 0.5 * Math.sin(u * f1 * 6.28 + ph)) * 0.6 - L.amp * 0.25 * Math.sin(u * f2 * 6.28 + ph * 2) - (R() - 0.5) * L.rough * 3;
        if (L.peaks) { var dd = (u - peakAt) / 0.07; y -= L.amp * 1.15 * Math.exp(-dd * dd) * (0.85 + 0.3 * Math.abs(Math.sin(u * 90))) ; }
        pts.push([u * W, y]);
      }
      var d = 'M0 ' + H + 'L' + pts.map(function (p) { return f(p[0]) + ' ' + f(p[1]); }).join('L') + 'L' + W + ' ' + H + 'Z';
      g += '<path d="' + d + '" fill="url(#' + uid + '-h' + li + ')"/>';
      if (L.peaks) { var top = pts.reduce(function (a, b) { return b[1] < a[1] ? b : a; }); g += '<path d="M' + f(top[0] - W * 0.045) + ' ' + f(top[1] + L.amp * 0.55) + 'L' + f(top[0]) + ' ' + f(top[1]) + 'L' + f(top[0] + W * 0.05) + ' ' + f(top[1] + L.amp * 0.6) + 'L' + f(top[0] + W * 0.015) + ' ' + f(top[1] + L.amp * 0.3) + 'L' + f(top[0] - W * 0.01) + ' ' + f(top[1] + L.amp * 0.5) + 'Z" fill="' + (P.snow || '#e8e2d4') + '" opacity=".55"/>'; }
      if (L.mist) { g += '<linearGradient id="' + uid + '-m' + li + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + hor + '" stop-opacity="0"/><stop offset=".55" stop-color="' + hor + '" stop-opacity="' + f(L.mist * 0.22) + '"/><stop offset="1" stop-color="' + hor + '" stop-opacity="0"/></linearGradient><rect x="0" y="' + f(L.base - L.amp * 0.2) + '" width="' + W + '" height="' + f(L.amp * 1.6) + '" fill="url(#' + uid + '-m' + li + ')"/>'; }
    });
    g += '<rect width="' + W + '" height="' + H + '" fill="url(#' + uid + '-v)"/></svg>';
    return g;
  }

  /* ---------- Small contribution icons (app's 24-unit line set) ---------- */
  var ICON = {
    move: '<path d="M4 17c2.4-1 3.6-4 5-4 1.8 0 1.7 4 5 4 2 0 3-1.6 5.6-1.6"/><path d="M5 20h14"/>',
    rest: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
    breathe: '<path d="M12 20c-4.5-2-7-5-7-9 3 0 5.5 1.4 7 4 1.5-2.6 4-4 7-4 0 4-2.5 7-7 9z"/><path d="M12 4v11"/>',
    hydrate: '<path d="M12 3.5s6 6.2 6 10.4a6 6 0 0 1-12 0C6 9.700 12 3.500 12 3.500z"/>',
    nourish: '<path d="M6 20c0-8 5-13 13-14 0 8-5 13-13 14z"/><path d="M6 20c2-5 5-8 9-10"/>',
    learn: '<path d="M3.5 5.5c3-.8 6 0 8.500 2 2.500-2 5.500-2.800 8.500-2v13c-3-.8-6 0-8.500 2-2.500-2-5.500-2.800-8.500-2z"/><path d="M12 7.500v13"/>',
    reflect: '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.600 5.600l1.400 1.400M17 17l1.400 1.400M5.600 18.400L7 17M17 7l1.400-1.400"/>',
    recover: '<path d="M4 15c1.5 2.500 4.500 4 8 4s6.500-1.500 8-4"/><path d="M7 11c.5-2 2.500-3.500 5-3.500S16.500 9 17 11"/><circle cx="12" cy="5" r="1"/>',
    rhythm: '<path d="M3 12h3l2.500-6 4 12 2.500-6H21"/>'
  };
  function icon(id, size, color) { return '<svg viewBox="0 0 24 24" width="' + (size || 22) + '" height="' + (size || 22) + '" fill="none" stroke="' + (color || 'currentColor') + '" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICON[id] || '') + '</svg>'; }

  return { routeMap: routeMap, profile: profile, strip: strip, ridge: ridge, icon: icon, hasAltitude: hasAltitude, routePoints: routePoints, rng: rng, colors: { GOLD: GOLD, GOLD_HI: GOLD_HI, MINT: MINT, INK: INK, IVORY: IVORY } };
});
