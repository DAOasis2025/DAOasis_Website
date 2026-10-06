/* DAOasis Companion App — Journey V2 prototype screens.
 * Every screen is rendered from window.DAO_JOURNEYS (journeys/journeys.json) by the
 * same functions. Switching Journey re-renders all seven screens with no special case —
 * that is the architecture claim: Journey 1 and Journey 20 use the same screens.
 * Figures come from each Journey's `demo` block and are ILLUSTRATIVE, not a scoring model.
 */
(function () {
  var D = window.DAO_JOURNEYS, A = window.JourneyArt, IMG = (window.DAO_IMG_ROOT || '../site/images/');
  var byId = {}; D.journeys.forEach(function (j) { byId[j.id] = j; });
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function km(n) { return (Math.round(n * 10) / 10).toLocaleString('en-GB'); }
  function ic(id, s) { return A.icon(id, s || 22); }

  function ctx(j) {
    var d = j.demo, st = j.stages, cur = 0;
    for (var i = 0; i < st.length; i++) if (st[i].km <= d.km + 1e-6) cur = i;
    var at = st[cur], next = st[cur + 1] || null, onStage = Math.abs(at.km - d.km) < 0.05;
    var resting = onStage && (at.rest_stage || at.type === 'rest');
    return { j: j, d: d, cur: cur, at: at, next: next, onStage: onStage, resting: resting,
      pct: Math.round(d.km / j.distance_km * 100), togo: j.distance_km - d.km, toNext: next ? next.km - d.km : 0,
      ready: Math.round((d.readiness || 0) * 100), altitude: j.kind === 'altitude' };
  }
  function plate(j, h, cls) {
    var im = j.imagery || {};
    var inner = im.plate === 'photo' ? '<img src="' + IMG + im.photo.replace(/^images\//, '') + '" alt="">' : A.ridge(j, { W: 780, H: h * 2, id: j.id + '-' + (cls || 'p') + h, peaks: j.kind === 'altitude' ? 1 : 0 });
    return '<div class="plate ' + (cls || '') + '" style="height:' + h + 'px">' + inner + '</div>';
  }
  function where(c) {
    if (c.resting) return c.at.name + ' · rest day';
    if (c.onStage) return 'At ' + c.at.name;
    return 'Between ' + c.at.name + ' and ' + c.next.name;
  }

  var TABS = [['Home', '<path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z"/>'], ['Journey', '<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>'], ['Learn', '<path d="M3.5 5.5c3-.8 6 0 8.5 2 2.5-2 5.5-2.8 8.5-2v13c-3-.8-6 0-8.5 2-2.5-2-5.5-2.8-8.5-2z"/><path d="M12 7.5v13"/>'], ['Community', '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.4"/><path d="M3.5 19c.6-3.3 2.8-5 5.5-5s4.9 1.7 5.5 5M14.5 14.4c2.6-.6 5.2.6 6 4.1"/>'], ['More', '<circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/>']];
  function tabs(on) { return '<nav class="tabs">' + TABS.map(function (t) { return '<div class="tab' + (t[0] === on ? ' on' : '') + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + t[1] + '</svg>' + t[0] + '</div>'; }).join('') + '</nav>'; }
  function phone(inner, tab) {
    return '<div class="phone-wrap"><div class="phone-scale"><div class="phone"><div class="screen"><div class="sb"><span>9:41</span><i></i><span class="ic"><svg width="18" height="12" viewBox="0 0 18 12" fill="#fff"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5" width="3" height="7" rx="1"/><rect x="10" y="2.5" width="3" height="9.5" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/></svg><b></b></span></div><div class="body">' + inner + '</div>' + (tab ? tabs(tab) : '') + '<div class="hi"></div></div></div></div></div>';
  }

  /* 1 — HOME: Journey visible, balanced with the day */
  function home(c) {
    var j = c.j, d = c.d, st = j.stages, fillPct = d.km / j.distance_km * 100;
    var head = c.resting ? (c.altitude ? 'Rest is part<br>of the climb.' : 'Rest is part<br>of the Journey.') : (c.next ? 'On the way<br>to ' + esc(c.next.name) + '.' : 'You have<br>arrived.');
    var chain = '<div class="chain"><div class="fill" style="width:calc(' + fillPct + '% - 24px * ' + (fillPct / 100) + ')"></div>' + st.map(function (s, i) {
      var cls = i < c.cur || (i === c.cur && !c.onStage) ? 'done' : (i === c.cur ? 'here' : ''); if (s.rest_stage) cls += ' rest';
      return '<div class="cn ' + cls + '"><b></b></div>'; }).join('') + '</div>';
    var nextLine = c.resting && c.next ? '<div class="row" style="margin-top:14px"><span style="font-size:13.5px">' + esc(c.next.name) + ' opens when you are ready</span><span class="pill rest">Readiness ' + c.ready + '%</span></div><div class="bar rest" style="margin-top:10px"><i style="width:' + c.ready + '%"></i></div>'
      : (c.next ? '<div class="row" style="margin-top:14px"><span style="font-family:var(--serif);font-size:36px;line-height:1">' + km(c.toNext) + '<small style="font-family:var(--sans);font-size:14px;color:var(--muted)"> km</small></span><span style="font-size:13px;color:var(--muted);text-align:right">to ' + esc(c.next.name) + '<br><span class="mint">' + esc(c.next.title) + '</span></span></div>' : '');
    var t = d.today, tiles = [['move', 'Move', km(t.movement_km) + ' km', t.movement_km / d.daily_comfortable_km], ['breathe', 'Breathe', t.breathing_min + ' min', t.breathing_min / 10], ['hydrate', 'Hydrate', t.hydration_l + ' L', t.hydration_l / 2.5], ['rest', 'Rest', Math.floor(t.sleep_h) + 'h ' + Math.round((t.sleep_h % 1) * 60) + 'm', t.sleep_h / 8], ['nourish', 'Nourish', '2 meals', .66], ['learn', 'Learn', t.learning + ' lesson', t.learning ? 1 : 0]];
    var tl = tiles.map(function (x) { var p = Math.max(0, Math.min(1, x[3])); return '<div class="tile"><div class="r ' + (p >= 1 ? 'ok' : '') + '">' + ic(x[0], 21) + '</div><b>' + x[1] + '</b><small>' + x[2] + '</small></div>'; }).join('');
    var done = tiles.filter(function (x) { return x[3] >= 1; }).length;
    return phone(plate(j, 330) +
      '<div class="scroll" style="padding:62px 22px 0">' +
      '<div class="row" style="align-items:flex-start"><div><div class="eyebrow" style="color:#fff;letter-spacing:.32em;font-size:10.5px">Rest · Learn · Earn · Return</div><div style="font-size:17px;margin-top:22px;color:#fff">Good morning, Jamie</div></div></div>' +
      '<h2 class="title" style="font-size:42px;margin-top:8px;color:#fff;max-width:260px">' + head + '</h2>' +
      '<div class="card" style="margin-top:34px"><div class="row"><span class="eyebrow">Your Journey</span><span class="mint" style="font-size:14px">View journey ›</span></div>' +
      '<div style="font-size:21px;margin-top:6px">' + esc(j.name) + '</div><div class="small" style="margin-top:2px">' + esc(where(c)) + ' · ' + c.pct + '%</div>' + chain + nextLine + '</div>' +
      '<div class="card"><div class="row"><span class="eyebrow">Today’s actions</span><span style="font-size:13px">' + done + ' of 6 complete ›</span></div><div class="tiles">' + tl + '</div></div>' +
      '</div>', 'Home');
  }

  /* 2 — JOURNEY: the expedition view */
  function journey(c) {
    var j = c.j, d = c.d, idx = D.journeys.indexOf(j) + 1;
    var stat = function (v, l) { return '<div><div style="font-family:var(--serif);font-size:30px;line-height:1">' + v + '</div><div style="font-size:12px;color:var(--muted);margin-top:4px">' + l + '</div></div>'; };
    var third = c.altitude ? stat(c.at.altitude_m.toLocaleString('en-GB') + '<small style="font-size:15px"> m</small>', 'altitude') : stat(km(c.toNext), 'to ' + esc(c.next ? c.next.name : ''));
    return phone('<div class="map">' + A.routeMap(j, { W: 390, H: 560, km: d.km, labels: 'stages', peakLabels: false, id: j.id + '-jm', pad: { l: 138, r: 118, t: j.name.length > 20 ? 168 : 136, b: 112 } }) + '</div>' +
      '<div style="position:absolute;top:66px;left:22px;right:22px;z-index:3"><div class="eyebrow">' + esc(j.label || j.region) + '</div><h2 class="title" style="font-size:' + (j.name.length > 20 ? 29 : 35) + 'px;margin-top:6px;max-width:330px">' + esc(j.name) + '</h2></div>' +
      '<div style="position:absolute;left:14px;right:14px;bottom:108px;z-index:3" class="card">' +
      '<div class="row"><div><div class="eyebrow">You are here</div><div style="font-size:18px;margin-top:4px">' + esc(where(c)) + '</div></div><div style="font-family:var(--serif);font-size:36px">' + c.pct + '<small style="font-size:16px">%</small></div></div>' +
      '<div class="bar" style="margin:12px 0 14px"><i style="width:' + c.pct + '%"></i></div>' +
      '<div style="display:grid;grid-template-columns:repeat(3,1fr)">' + stat(km(d.km), 'km walked') + stat(km(c.togo), 'km to go') + third + '</div>' +
      (c.resting ? '<div class="row" style="border-top:1px solid var(--line);margin-top:14px;padding-top:12px"><span style="font-size:13px;color:var(--muted)">Acclimatisation day. The route waits; your readiness builds.</span><span class="pill rest">' + c.ready + '%</span></div>'
        : '<div style="border-top:1px solid var(--line);margin-top:14px;padding-top:12px;font-size:13px;color:var(--muted)">The community’s shared marker is at <span class="mint">' + km(d.community_marker_km) + ' km</span></div>') +
      '</div>', 'Journey');
  }

  /* 3 — TODAY ON THE JOURNEY: how behaviour becomes progress */
  function today(c) {
    var j = c.j, d = c.d, t = d.today, R = 56, C = 2 * Math.PI * R;
    var parts = [['sleep', t.sleep_h / 8], ['breath', t.breathing_min / 10], ['water', t.hydration_l / 2.5], ['recovery', c.resting ? 1 : .6]];
    var tot = parts.reduce(function (a, b) { return a + Math.min(1, b[1]); }, 0) || 1, off = 0;
    var segs = parts.map(function (p, i) { var len = C * (c.ready / 100) * Math.min(1, p[1]) / tot; var s = '<circle cx="66" cy="66" r="' + R + '" fill="none" stroke="' + ['#9fb8d8', '#6dbf9e', '#7fb6c9', '#b9a4d6'][i] + '" stroke-width="9" stroke-dasharray="' + Math.max(0, len - 4).toFixed(1) + ' ' + C.toFixed(1) + '" stroke-dashoffset="' + (-off).toFixed(1) + '" stroke-linecap="round"/>'; off += len; return s; }).join('');
    var week = [3.6, 6.8, 5.2, 7.4, 4.1, c.resting ? 0 : 5.9, t.movement_km], labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    var restDay = c.resting ? [5, 6] : [];
    var wk = week.map(function (v, i) { var r = restDay.indexOf(i) > -1; return '<div><i class="' + (r ? 'rest' : '') + (i === 6 ? ' today' : '') + '" style="height:' + (r ? 34 : Math.max(8, v / 8 * 50)) + 'px"></i><small>' + labels[i] + '</small></div>'; }).join('');
    return phone('<div class="scroll" style="padding:66px 20px 0">' +
      '<div class="eyebrow">Today on the Journey</div><h2 class="title" style="font-size:34px;margin-top:6px">Everything you did<br>counted.</h2><div class="small" style="margin-top:6px">Concept · illustrative figures · no scoring formula approved</div>' +
      '<div class="card" style="margin-top:18px">' +
      '<div class="layer"><div class="ico">' + ic('move') + '</div><div><b>Route</b><span>Movement · ' + (c.resting ? 'a short acclimatisation walk' : 'carried you along the trail') + '</span></div><em>' + km(t.movement_km) + '<small style="font-size:13px"> km</small></em></div>' +
      '<div class="layer rest"><div class="ico">' + ic('rest') + '</div><div><b>Readiness</b><span>Sleep, breath, water, recovery</span></div><em>' + c.ready + '<small style="font-size:13px">%</small></em></div>' +
      '<div class="layer disc"><div class="ico">' + ic('learn') + '</div><div><b>Discovery</b><span>' + t.learning + ' lesson · ' + t.reflection + ' reflection</span></div><em>' + (t.learning + t.reflection) + '<small style="font-size:13px">/2</small></em></div></div>' +
      '<div class="card"><div class="row" style="align-items:center"><div class="ring"><svg viewBox="0 0 132 132"><circle cx="66" cy="66" r="' + R + '" fill="none" stroke="rgba(236,231,222,.08)" stroke-width="9"/>' + segs + '</svg><div class="c"><div><b>' + c.ready + '</b><br><span>Ready</span></div></div></div>' +
      '<div style="flex:1;font-size:12.5px;line-height:1.9;color:var(--muted)"><div><b style="color:#9fb8d8">●</b> Sleep ' + Math.floor(t.sleep_h) + 'h ' + Math.round((t.sleep_h % 1) * 60) + 'm</div><div><b style="color:#6dbf9e">●</b> Breathing ' + t.breathing_min + ' min</div><div><b style="color:#7fb6c9">●</b> Water ' + t.hydration_l + ' L</div><div><b style="color:#b9a4d6">●</b> Recovery ' + (c.resting ? 'rest day' : 'light day') + '</div></div></div>' +
      (c.next ? '<div class="small" style="margin-top:10px">' + (c.resting ? esc(c.next.name) + ' opens at 100%. Pushing harder will not open it sooner.' : 'Readiness keeps the next stage open. Rest well and the route stays ahead of you.') + '</div>' : '') + '</div>' +
      '<div class="card"><div class="row"><span class="eyebrow">This week</span><span class="small">' + d.rhythm_days + '-day rhythm</span></div><div class="week" style="height:70px">' + wk + '</div></div>' +
      '</div>', 'Journey');
  }

  /* 4 — STAGE: the place, its story, what it asks of you */
  function stage(c) {
    var j = c.j, s = c.at, n = j.stages.indexOf(s) + 1;
    return phone(plate(j, 360, 'stg') +
      '<div class="scroll" style="padding:62px 22px 0"><div style="height:24px"></div>' +
      '<div class="eyebrow" style="color:#fff">Stage ' + n + ' of ' + j.stages.length + ' · ' + esc(j.name) + '</div>' +
      '<h2 class="title" style="font-size:46px;margin-top:8px;color:#fff">' + esc(s.name) + '</h2>' +
      '<div style="font-size:13px;color:rgba(255,255,255,.75);margin-top:6px">' + (s.altitude_m ? s.altitude_m.toLocaleString('en-GB') + ' m · ' : '') + s.km + ' km from ' + esc(j.stages[0].name) + (s.approx ? ' · indicative' : '') + '</div>' +
      '<div style="margin-top:120px"></div>' +
      '<p class="quote">' + esc(s.title) + '</p><p style="font-size:14px;line-height:1.6;color:var(--muted);margin-top:8px">' + esc(s.story) + '</p>' +
      (s.rest_stage ? '<div class="card" style="margin-top:16px;border-color:rgba(159,184,216,.35)"><div class="row"><span class="pill rest">' + ic('rest', 14) + ' Acclimatisation</span><span class="small">Rest is part of the Journey</span></div><p style="font-size:13.5px;line-height:1.55;margin-top:10px">Today the route waits. Sleep, breathe and drink well — the next stage opens when you are ready, not when you push.</p></div>' : '') +
      '<div class="card" style="margin-top:12px"><div class="row"><span class="eyebrow">Learn here</span><span class="mint" style="font-size:13px">4 min ›</span></div><p style="font-size:15px;margin-top:8px;line-height:1.4">' + esc(s.learning) + '</p></div>' +
      '</div>', 'Journey');
  }

  /* 5 — ROUTE: whole Journey, stage by stage */
  function route(c) {
    var j = c.j, d = c.d;
    var viz = A.hasAltitude(j) ? A.profile(j, { W: 400, H: 190, km: d.km, id: j.id + '-rp', names: false, pad: { l: 68, r: 14, t: 18, b: 14 } }) : A.strip(j, { W: 560, H: 160, km: d.km, id: j.id + '-rs' });
    var list = j.stages.map(function (s, i) {
      var cls = i < c.cur || (i === c.cur && !c.onStage) ? 'done' : (i === c.cur ? 'here' : '');
      return '<div class="st ' + cls + '"><div class="d"></div><div><b>' + esc(s.name) + '</b><span>' + esc(s.title) + (s.rest_stage ? ' · <span style="display:inline;color:var(--rest)">rest stage</span>' : '') + '</span></div><div class="k">' + s.km + ' km' + (s.altitude_m ? '<br>' + s.altitude_m.toLocaleString('en-GB') + ' m' : '') + '</div></div>';
    }).join('');
    return phone('<div class="scroll" style="padding:66px 20px 0"><div class="eyebrow">The route</div><h2 class="title" style="font-size:32px;margin-top:6px">' + esc(j.short) + '</h2><div class="small" style="margin-top:4px">' + km(j.distance_km) + ' km · ' + j.stages.length + ' stages' + (j.kind === 'altitude' ? ' · 2 rest stages' : '') + '</div>' +
      '<div style="margin:12px -8px 4px">' + viz + '</div><div class="card" style="padding:6px 16px">' + list + '</div></div>', 'Journey');
  }

  /* 6 — MILESTONES */
  function milestones(c) {
    var j = c.j, d = c.d, ms = j.milestones.slice().sort(function (a, b) { return a.at_km - b.at_km; });
    var got = ms.filter(function (m) { return m.at_km <= d.km; }).length;
    var rows = ms.map(function (m, i) { var g = m.at_km <= d.km; return '<div class="ms' + (g ? ' got' : '') + '"><div class="m">' + (i + 1) + '</div><div><b>' + esc(m.name) + '</b><span>' + (g ? 'Reached' : km(m.at_km - d.km) + ' km to go') + '</span></div>' + (g ? '<span class="pill gold">Recognised</span>' : '') + '</div>'; }).join('');
    return phone('<div class="scroll" style="padding:66px 20px 0"><div class="eyebrow">Milestones</div><h2 class="title" style="font-size:34px;margin-top:6px">' + got + ' of ' + ms.length + ' along<br>' + esc(j.name) + '</h2>' +
      '<div class="card" style="margin-top:18px;padding:6px 16px">' + rows + '</div>' +
      '<div class="card" style="text-align:center"><div class="eyebrow">At the destination</div><p class="quote" style="margin-top:8px">' + esc(j.stages[j.stages.length - 1].milestone) + '</p><p class="small" style="margin-top:8px">Milestones are recognised in DRC. Amounts are not set.</p></div></div>', 'Journey');
  }

  /* 7 — CHOOSE A JOURNEY: the library */
  function library(c) {
    var cur = c.j, live = D.journeys.filter(function (j) { return !j.template; }), soon = D.journeys.filter(function (j) { return j.template; });
    function card(j, big) {
      var tag = j.status === 'flagship-demo' ? '<span class="pill gold">Flagship</span>' : j.status === 'launch' ? '<span class="pill mint">Launch Journey</span>' : j.concept ? '<span class="pill concept">Concept · optional</span>' : '<span class="pill">New</span>';
      return '<div class="jc' + (big ? ' big' : '') + '"><div class="pl">' + (j.imagery && j.imagery.plate === 'photo' ? '<img src="' + IMG + j.imagery.photo.replace(/^images\//, '') + '" alt="">' : A.ridge(j, { W: 760, H: big ? 340 : 240, id: j.id + '-lib', peaks: j.kind === 'altitude' ? 1 : 0 })) + '</div>' +
        '<div class="tx"><div class="row"><div class="nm">' + esc(j.name) + '</div>' + (j === cur ? '<span class="pill gold">Current</span>' : '') + '</div><div class="mt">' + esc(j.region) + ' · ' + km(j.distance_km) + ' km · ' + j.stages.length + ' stages</div><div class="tags">' + tag + (j.emphasis || []).slice(0, 3).map(function (e) { return '<span class="pill">' + e + '</span>'; }).join('') + '</div></div></div>';
    }
    var ordered = [byId['everest-base-camp']].concat(live.filter(function (j) { return j.id !== 'everest-base-camp'; }));
    return phone('<div class="scroll" style="padding:66px 20px 0"><div class="eyebrow">Journeys</div><h2 class="title" style="font-size:33px;margin-top:6px">Where will your<br>everyday take you?</h2><div style="margin-top:16px">' +
      ordered.map(function (j, i) { return card(j, i === 0); }).join('') +
      '<div class="eyebrow" style="margin-top:18px">Coming</div><div class="soon">' + soon.map(function (j) { return '<div><b>' + esc(j.name) + '</b><span>' + km(j.distance_km) + ' km</span></div>'; }).join('') + '</div></div></div>', 'Journey');
  }

  var SCREENS = [
    ['home', home, 'Home', 'Your Journey is visible at a glance: where you are, how far along, and what opens next. The day’s actions stay exactly where they were.', 'upd'],
    ['journey', journey, 'Journey', 'The expedition view. The route is drawn from the Journey’s real coordinates, with peaks, stages and the shared community marker.', 'upd'],
    ['today', today, 'Today on the Journey', 'How everyday behaviour becomes progress: movement moves the route, rest builds readiness, learning and reflection unlock the story. Concept — no formula approved.', 'new'],
    ['stage', stage, 'Stage detail', 'Each stage is a place with a story, a lesson and a reflection. At acclimatisation stages the route waits and readiness builds.', 'new'],
    ['route', route, 'The route', 'The whole Journey on one screen: altitude profile where a route has one, a route line where it does not, and every stage with its status.', 'new'],
    ['milestones', milestones, 'Milestones', 'What you have achieved on this Journey. Recognition, not rewards with a price — DRC amounts are not set.', 'new'],
    ['library', library, 'Choose a Journey', 'Everest leads as the flagship, Thailand stays as the launch Journey, Land’s End to John o’ Groats shows another country, and the library grows from the same data.', 'new']
  ];
  window.DAO_APP_V2 = { ctx: ctx, screens: SCREENS, journeys: D.journeys };

  function fit() { document.querySelectorAll('.phone-scale').forEach(function (s) { var p = s.firstChild; p.style.transform = 'scale(' + (s.clientWidth / 410) + ')'; }); }
  function render(id) {
    var j = byId[id], c = ctx(j), g = document.getElementById('grid'); if (!g) return;
    var only = new URLSearchParams(location.search).get('screen');
    g.innerHTML = SCREENS.filter(function (s) { return !only || s[0] === only; }).map(function (s) { return '<figure class="rv-item" id="s-' + s[0] + '">' + s[1](c) + '<figcaption><b>' + s[2] + '</b><span>' + s[3] + '</span><span class="chg ' + s[4] + '">' + (s[4] === 'new' ? 'New screen' : 'Updated screen') + '</span></figcaption></figure>'; }).join('');
    document.querySelectorAll('.rv-switch button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.j === id ? 'true' : 'false'); });
    fit();
  }
  window.addEventListener('resize', fit);
  document.addEventListener('DOMContentLoaded', function () {
    var sw = document.getElementById('switch');
    if (sw) D.journeys.filter(function (j) { return !j.template; }).forEach(function (j) { var b = document.createElement('button'); b.type = 'button'; b.dataset.j = j.id; b.textContent = j.name + (j.concept ? ' (concept)' : ''); b.onclick = function () { history.replaceState(null, '', '?journey=' + j.id); render(j.id); }; sw.appendChild(b); });
    render(new URLSearchParams(location.search).get('journey') || 'everest-base-camp');
  });
})();
