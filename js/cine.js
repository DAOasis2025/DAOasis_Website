/* ══════════════════════════════════════════════════════════════════════
   DAOASIS — CONTROLLED CINEMATIC SCROLL                      (site-wide)

   Scrolling is never intercepted. No wheel handler, no touch handler,
   no overflow lock, no scroll engine, no library. The browser scrolls
   natively at all times, so normal sections are completely untouched
   and the user can always leave a section.

   What this decouples is PACE.

     Scroll position  =  USER INTENT   — where the story should be
     Rendered value   =  DAOASIS PACE  — how fast it gets there

   A section reads scroll as a target and advances the value it actually
   renders toward that target over a CONFIGURED DURATION. A violent
   flick therefore sets a distant target, and the story still unfolds at
   the intended speed. Because the paced value always converges on true
   scroll progress, nothing is ever stranded and no one is ever trapped.

   Wheel/trackpad normalisation falls out for free: delta size is never
   read. Pace is set by duration, so a 300px wheel notch and a 4px
   trackpad glide produce identical narrative behaviour.

   Keyboard support likewise falls out: arrows, PageUp/PageDown and
   space scroll the page natively, which moves the target, which the
   pacer follows. Nothing to intercept.

   MODES
     'sticky'  Quantised. The track commits to whole narrative states
               and eases between them over a fixed duration. One
               meaningful scroll = one state. Used for state machines.
     'guided'  Continuous. Follows scroll with a hard speed cap, so
               pace is bounded but motion stays fluid. Used for
               continuous cinematography (camera moves, zooms, draws).

   Anything not given a track keeps ordinary scrolling.
══════════════════════════════════════════════════════════════════════ */
window.DAO = window.DAO || {};
DAO.cine = (function(){
  'use strict';

  /* ── CENTRAL TIMING — tune the feel of the whole site from here ──
     step  ms for one state forward      back  ms for one state in reverse
     hold  ms a state is held before it will depart (gives states a beat) */
  /* Raised on 3 September (epic 1150->1500, major 950->1250, simple
     720->950). Reported twice as "way too rapid ... should feel smooth and
     premium". These are the ms allowed for ONE state, and they are the real
     brake: for any gap bigger than ~1.4% of a section the speed cap binds,
     so this number — not the section's height — is what sets the pace of a
     transition once the reader is inside it. */
  var TIMING = {
    epic:   { step: 1500, back: 1150, hold: 90 },   /* major cinematic beats */
    major:  { step: 1250, back:  960, hold: 70 },   /* standard narrative     */
    simple: { step:  950, back:  780, hold: 50 },   /* light transitions      */

    /* Reduced motion keeps the pacing (see the note in tick()) but loses the
       long cinematic dwell — the holds are what read as scroll-jacking, and
       they are the part someone asking for less motion actually wants gone.
       Still damped, so nothing ever snaps. */
    reducedScale: 0.55,

    /* Touch already carries its own momentum, and a phone is held closer
       to the eye — the same durations that read as cinematic on a desktop
       read as lag on a handset. */
    /* Was 0.70 - every duration on a handset ran 30% FASTER than desktop.
       The original reasoning (touch carries its own momentum, a phone is
       held closer) is not wrong, but mobile is this product's MVP and the
       brief is that it should feel the most considered surface, not the
       most hurried. 0.9 keeps a slight concession to touch without making
       the phone the fastest place the story is told. */
    mobileScale: 0.9,
    mobileAt: 900,

    /* A jump is never allowed to take longer than step * maxSpan, so a
       page-anchor or a fast flick through several states resolves
       promptly instead of grinding through them one at a time. */
    maxSpan: 2.4,
    minDur: 150,

    /* Damping of the follow, before the speed cap is applied. 0.15 closed
       85% of a small gap in ten frames, so short moves — the ones the cap
       never touches — arrived almost instantly and read as snappy against
       the long ones. 0.11 keeps the same shape and takes the edge off. */
    /* THIS, NOT `step`, IS WHAT MAKES THE SITE FEEL FAST.

       `step` is per BEAT (span = 1/N below), and the speed cap it drives
       only binds on a flick. During ordinary reading the gap between scroll
       and scene is small, the cap never engages, and this damping constant
       is the only thing setting the pace. At 0.11 a gap closes 90% in about
       twenty frames - roughly 330ms - which is a snap, not a settle. Every
       previous attempt to slow the site down adjusted heights and durations
       and left this alone, which is why none of them moved the needle much.

       0.05 settles in ~750ms. Paired with the plateau, near a stop there is
       nothing left to chase, so the longer tail costs no responsiveness
       where it would be felt. */
    /* 0.06, not 0.05, BECAUSE js/smooth.js NOW EXISTS. 0.05 was measured
       and chosen when native scroll was instant and this was the only
       damping in the chain: it put one wheel notch at ~1.7s to rest. The
       scroll damper then added ~350ms of its own glide in front of it and
       the same constant measured 2.06s end to end, which is past the point
       where the scene visibly trails the page. 0.06 puts it back to the
       ~1.7s that was actually signed off.

       THE TWO ARE A PAIR. If js/smooth.js is ever removed, this wants to go
       back to ~0.05 or the site returns to feeling snappy. */
    follow: 0.06
  };

  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced  = mqReduce.matches;
  if(mqReduce.addEventListener) mqReduce.addEventListener('change', function(e){ reduced = e.matches; });
  else if(mqReduce.addListener) mqReduce.addListener(function(e){ reduced = e.matches; });

  function isMobile(){ return window.innerWidth <= TIMING.mobileAt; }
  function cl01(v){ return v < 0 ? 0 : v > 1 ? 1 : v; }

  /* ── CONSUMER HELPERS ────────────────────────────────────────────────
     A sticky track eases its value smoothly from one stop to the next over
     `step` ms. That easing is the whole point of the controller — but it is
     thrown away by any consumer that does `Math.floor(p * n)`, because an
     integer cannot express a transition. A section written that way renders
     exactly as many frames as it has states, no matter how much scroll it
     holds, and the pacing is invisible.

     `pos()` gives the CONTINUOUS position along the stops (2.4 = 40% of the
     way from state 2 to state 3), correct for unevenly spaced stops too.
     `weigh()` turns that into a per-item 0..1 so items cross-fade instead
     of cutting. Consumers scrub these; they never floor them. */
  function ramp(v, a, b){ return b === a ? (v >= b ? 1 : 0) : cl01((v - a) / (b - a)); }
  /* smoothstep — used where a linear ramp reads mechanical */
  function smooth(t){ t = cl01(t); return t * t * (3 - 2 * t); }

  /* How lit item `n` is at continuous position `pos`, for a LIST whose items
     sit side by side and are all visible at once.

     A plain triangular cross-fade puts both neighbours at exactly 0.5 half
     way between them, so the section passes through a frame in which nothing
     is at full strength — the least confident moment a sequence like this
     can show, and the exact problem the Principle section was rebuilt to
     remove. Two constraints pull against each other:

       at rest on an item, its neighbours must be at ZERO   (one live row)
       between two items, one of them must still read as live (no dead frame)

     A linear ramp cannot satisfy both: hold the outgoing item longer and it
     is still lit when the next one is resting. Raising the triangle to a
     power below one satisfies both exactly — 0 at the neighbours, 1 on the
     item, and 0.66 rather than 0.50 at the crossover, so the handover always
     has something at nearly full strength in it.

     Symmetric, and a pure function of pos, so scrolling back up retraces the
     same frames rather than playing a different animation in reverse. */
  function lead(pos, n, sharp){
    var d = Math.abs(pos - n);
    return d >= 1 ? 0 : Math.pow(1 - d, sharp == null ? 0.6 : sharp);
  }
  /* NOTE — there is deliberately no keyframed transition curve here any
     more. Both modes now follow a target with a damped, speed-capped
     follow, which answers within a frame, has no fixed duration to expire,
     and re-targets mid-flight without the kink a re-based keyframed ease
     produced. The shaping that used to live in the curve now lives in the
     magnet mapping (sticky) — see Track.prototype.snap. */

  /* identical maths to the pages' own progressOf(), kept here so the
     controller has no dependency on page-level helpers */
  function rawOf(el){
    var r = el.getBoundingClientRect();
    var s = el.offsetHeight - window.innerHeight;
    if(s > 0) return cl01(-r.top / s);
    return r.top < 0 ? 1 : 0;
  }

/* ── REMOVED 20 Aug: one-way progress + auto-release ──────────────────
   Both were added 19 Aug and were never judged by eye. They are the
   cause of "every animation completes instantly".

   AUTO-RELEASE trimmed a finished pin's wrapper down to one viewport.
   On index.html that is 3600px -> 900px for the hero and 4644px -> 900px
   for the palm-logo section. The page therefore SHRANK BY 2700px UNDER
   THE READER the moment the hero finished. Scroll position does not move
   when the document shortens, so the reader was silently teleported
   2700px further down — landing 72% of the way into the palm-logo pin,
   which consequently "completed instantly". That section then finished,
   collapsed by another 3744px, and threw the reader through the next
   one. It cascaded through every pinned section on the page.

   ONE-WAY (`peak`) then made it unrecoverable: any section skipped by a
   collapse latched at progress 1 and could never play again.

   If a pin ever genuinely needs to stop holding the viewport, the fix is
   to give it less height — never to mutate its height at runtime while
   the reader is inside it. Do not reintroduce either behaviour.
──────────────────────────────────────────────────────────────────────── */

  function Track(el, o){
    o = o || {};
    this.el      = el;
    this.mode    = o.mode || 'sticky';
    this.pace    = TIMING[o.pace] ? o.pace : 'major';
    this.o       = o;

    /* The narrative states, as positions along the track. Evenly spaced
       unless the section supplies its own — the quest map's waypoints,
       for instance, sit at uneven fractions of the route, and snapping
       those to even thirds would skip one entirely. */
    if(o.stops && o.stops.length > 1){
      this.stops = o.stops.slice().sort(function(a,b){ return a - b; });
    } else {
      var n = Math.max(2, o.states || 2);
      this.stops = [];
      for(var i = 0; i < n; i++) this.stops.push(i / (n - 1));
    }
    /* N = number of transitions, used to size the guided speed cap */
    this.N       = this.stops.length - 1;

    var v        = rawOf(el);
    this.rawV    = v;
    this.goalIdx = this.nearest(v);
    /* entering mid-section starts on the frame that belongs there */
    this.goal    = this.mode === 'sticky' ? this.snap(v) : v;
    this.value   = this.goal;
    this.from    = this.goal;
    this.t0      = 0;
    this.dur     = 1;
    this.arrived = 0;
    this.subs    = [];
    this.emitted = -1;
    this.near    = true;

    var self = this;
    if('IntersectionObserver' in window){
      this.near = false;
      new IntersectionObserver(function(list){
        list.forEach(function(e){
          self.near = e.isIntersecting;
          /* Out of view: settle instantly on the true scroll position, so
             re-entry from either direction is always clean and a section
             scrolled past is never left half-played. */
          if(!e.isIntersecting) self.settle();
        });
      }, { rootMargin: '25% 0px 25% 0px', threshold: 0 }).observe(el);
    }
    tracks.push(this);
    start();
  }

  Track.prototype.times = function(){
    var p = TIMING[this.pace];
    var s = isMobile() ? TIMING.mobileScale : 1;
    if(reduced) s *= TIMING.reducedScale;
    var o = this.o;
    return {
      step: (o.step != null ? o.step : p.step) * s,
      back: (o.back != null ? o.back : p.back) * s,
      hold: (o.hold != null ? o.hold : p.hold) * s
    };
  };

  Track.prototype.nearest = function(v){
    var st = this.stops, ni = 0, bd = Infinity;
    for(var i = 0; i < st.length; i++){
      var d = Math.abs(st[i] - v);
      if(d < bd){ bd = d; ni = i; }
    }
    return ni;
  };

  /* Come to rest on the true scroll position — used when the section
     leaves the viewport and on resize. A sticky track settles onto its
     nearest state, not between two of them, so .get() and subscribers
     never disagree about where the story currently is. */
  Track.prototype.settle = function(){
    var v = this.rawV = rawOf(this.el);
    this.goalIdx = this.nearest(v);
    /* sticky settles on the magnet-mapped position, not on the bare stop —
       otherwise leaving and re-entering a section mid-transition would snap
       the scene to a state the scroll position does not correspond to */
    this.goal = this.mode === 'sticky' ? this.snap(v) : v;
    this.value = this.from = this.goal;
    this.emit(this.goal);
  };

  /* PASS 1 of the frame — every track's scroll position is read here, before
     any subscriber has written a style. Reading and writing used to be
     interleaved: track 0 emitted, its subscribers wrote inline styles, then
     track 1 called getBoundingClientRect and forced the browser to lay the
     whole document out again to answer it. On index.html that is four forced
     synchronous layouts per frame, every frame, for the entire time any
     pinned section is moving. Separating the passes removes all of them. */
  Track.prototype.read = function(){
    if(this.near) this.rawV = rawOf(this.el);
  };

  /* PASS 2 — compute and emit. Reads nothing from the DOM. */
  Track.prototype.tick = function(now, dt){
    if(!this.near) return;
    /* Bidirectional, straight off true scroll position. Scrolling back up
       unwinds a section exactly the way it played.

       `padded` is applied HERE, once, so every consumer — sticky, guided,
       get(), pos(), and the o.off passthrough below — sees the same value
       and the settle cannot be bypassed by one of them. */
    var raw = padded(this.rawV);

    /* Explicitly opted out (o.off): the value IS the scroll position.
       That is a per-section decision made in the page, and it stands.

       REDUCED MOTION NO LONGER BYPASSES THE PACING, and that is a fix, not
       a regression. Measured on index.html's journey at 1440x900, one 100px
       wheel notch used to move the rendered animation 40.6px and settle in
       ~1ms under `prefers-reduced-motion: reduce`, against 10.2px over
       ~321ms without it. Four times the movement, delivered instantly. The
       bypass was not reducing motion — it was removing the damping and
       making exactly the same motion happen faster and more abruptly, which
       is worse for vestibular sensitivity, not better.

       This is scroll-LINKED motion: it only moves while the reader is
       actively scrolling and stops the instant they stop. It is their own
       input played back, not motion the page performs by itself. The
       considerate response is to shorten the cinematic holds, not to strip
       the smoothing out. index.html's palm section already reasoned exactly
       this way ("a great many people have it set without ever intending to
       opt out of scroll-linked storytelling"); cine.js simply had not been
       brought into line with it.

       Anything genuinely autonomous — the intro, the ambient loops, the
       decorative pulses — is still switched off by the @media blocks in
       each page, which is where that belongs. */
    if(this.o.off){ this.emit(raw); return; }

    var t = this.times();
    var span = 1 / this.N;                    /* one state, in 0..1 */

    /* ── GUIDED — continuous, speed-capped ── */
    if(this.mode === 'guided'){
      var gap = raw - this.value;
      var ag  = Math.abs(gap);
      if(ag < 0.0004){ this.value = raw; this.emit(raw); return; }
      var cap = (span / (gap > 0 ? t.step : t.back)) * dt;
      /* Relax the cap once the user is far beyond what pacing can
         justify — an anchor jump, a resize, a hard flick. Without this
         the scene would trail the page instead of leading it. */
      var over = ag / span - TIMING.maxSpan;
      if(over > 0) cap *= 1 + over * 3;
      var want = gap * TIMING.follow;         /* damped, so it eases in */
      this.value += Math.max(-cap, Math.min(cap, want));
      this.emit(this.value);
      return;
    }

    /* ── STICKY — the stops are MAGNETS, not steps ──────────────────────
       This used to quantise: the track picked a whole state and eased to
       it, so the value was motionless except during the ~950ms after a
       commit. Measured across the site, that rendered 3 to 12 distinct
       frames per section no matter how much scroll the pin held — 73% to
       95% of every pinned section was a frame that did not change while
       the page was moving under the reader. That is the whole of the
       "I keep scrolling and nothing happens, then it rushes" complaint.

       Raw scroll is now remapped through a curve that DWELLS near each
       stop and moves briskly between them, and the result is paced with
       the same speed cap guided mode uses. A state therefore still lands
       and holds, one firm scroll still carries one beat — but the scene
       is never frozen while the page is scrolling. */
    var target = this.snap(raw);
    var sgap = target - this.value;
    var sag  = Math.abs(sgap);
    if(sag < 0.0002){ this.value = target; this.arrived = now; this.emit(this.value); return; }

    var scap = (span / (sgap > 0 ? t.step : t.back)) * dt;
    var sover = sag / span - TIMING.maxSpan;
    if(sover > 0) scap *= 1 + sover * 3;
    var swant = sgap * TIMING.follow;
    this.value += Math.max(-scap, Math.min(scap, swant));
    this.emit(this.value);
  };

  /* THE CURVE: A REAL PLATEAU, NOT A SLOW DRIFT.

     This used to be a pure power curve — motion concentrated in the middle
     of a segment, slow near each stop. It never actually stopped, and that
     is what was reported as "no pause before or after": measured, 14.5% of
     a segment's scroll produced the first 2% of the move. A drift of a few
     per cent is not a held frame; the eye reads it as still-moving.

     Now each segment is HOLD / move / HOLD. The first and last 15% are
     exactly 0 and exactly 1 — nothing changes, at all, while the reader
     keeps scrolling — and the middle 70% is a plain smoothstep. So 30% of
     every segment is a genuine pause and a state lands and SITS there.

     The ramp is smoothstep and NOT the old 2.6 power. Stacking a plateau
     on top of a curve that is already near-still at its ends would give a
     hold of roughly half the segment and a lurch through the middle. With
     the plateau doing the holding, the ramp only has to be smooth.

     A plateau was tried once before, on 1 September, and rejected because
     it "put web3 participation back to 50% static". That was the right
     call THEN: the sections were 288-690px per beat, so a plateau spent
     scroll the transitions could not spare. It only works paired with
     enough height, which is why both landed together — see the pin-height
     table in CLAUDE.md. Do not reintroduce one without the other. */
  var HOLD = 0.15;
  function magnet(u){
    if(u <= HOLD) return 0;
    if(u >= 1 - HOLD) return 1;
    var t = (u - HOLD) / (1 - 2 * HOLD);
    return t * t * (3 - 2 * t);
  }

  /* THE SETTLE PAD. Stops sit at 0 and 1, so every pinned section used to
     be already moving on the frame it pinned and still moving on the frame
     it released — the reader never saw the opening or closing state at
     rest. The first and last 8% of every track now hold at the endpoint.
     Applied to BOTH modes: a guided hero settles the same way a sticky
     list does. This is what index's three-plate ecosystem section was
     missing — at 1,020px per beat it was never short of distance, it just
     started animating the instant it arrived. */
  var PAD = 0.08;
  function padded(v){
    if(v <= PAD) return 0;
    if(v >= 1 - PAD) return 1;
    return (v - PAD) / (1 - 2 * PAD);
  }
  Track.prototype.snap = function(raw){
    var st = this.stops, i;
    if(raw <= st[0]) return st[0];
    for(i = 0; i < st.length - 1; i++){
      if(raw <= st[i + 1]){
        var w = st[i + 1] - st[i];
        if(w <= 0) return st[i];
        return st[i] + magnet((raw - st[i]) / w) * w;
      }
    }
    return st[st.length - 1];
  };

  Track.prototype.emit = function(v){
    if(v === this.emitted) return;
    this.emitted = v;
    var s = this.state();
    for(var i = 0; i < this.subs.length; i++) this.subs[i](v, s);
  };

  /* The paced value — a drop-in replacement for progressOf(outer).

     `reduced` is deliberately NOT tested here any more. It used to be, and
     that was the bypass that actually mattered: tick() can pace all it likes,
     but every consumer reads the scene through get() and pos(), so returning
     rawV here handed them the unpaced scroll position regardless. Removing
     the branch in tick() alone changed nothing measurable — the reduced-motion
     path stayed at 30.7px of movement per wheel notch, settling in 15ms.

     Reduced motion is now handled in ONE place, times(), where it shortens
     the durations (see reducedScale). Everything still moves with the reader's
     scroll; it simply arrives sooner. */
  Track.prototype.get   = function(){ return this.o.off ? this.rawV : this.value; };
  Track.prototype.raw   = function(){ return this.rawV; };
  Track.prototype.state = function(){ return this.nearest(this.get()); };

  /* Continuous position along the stops: 0 .. stops.length-1, fractional
     between them. This is what a consumer should scrub; state() is only for
     labels and counters that genuinely must be a whole number. */
  Track.prototype.pos = function(){
    var v = this.get(), st = this.stops, i;
    if(v <= st[0]) return 0;
    for(i = 0; i < st.length - 1; i++){
      if(v <= st[i + 1]){
        var w = st[i + 1] - st[i];
        return w > 0 ? i + (v - st[i]) / w : i;
      }
    }
    return st.length - 1;
  };
  /* How lit item `n` is, given the continuous position. `spread` is how many
     item-widths the cross-fade occupies — 1 means adjacent items hand over
     exactly, below 1 leaves a beat where one item is alone at full strength,
     which is usually what a narrative section wants. */
  Track.prototype.weigh = function(n, spread){
    var d = Math.abs(this.pos() - n) / (spread || 1);
    return d >= 1 ? 0 : 1 - d;
  };
  /* subscribe — needed by sections that repaint on 'scroll' events, since
     a paced value keeps moving after the scrolling has stopped */
  Track.prototype.on = function(fn){
    this.subs.push(fn);
    fn(this.get(), this.state());
    return this;
  };
  Track.prototype.refresh = function(){ this.emitted = -1; };

  /* one rAF loop for every track on the page */
  var tracks = [], running = false, last = 0;
  function loop(now){
    var dt = now - last;
    last = now;
    if(!(dt > 0)) dt = 16;
    if(dt > 64) dt = 64;               /* tab-return / long frame guard */
    /* read every track, THEN emit to every track — see Track.read */
    for(var i = 0; i < tracks.length; i++) tracks[i].read();
    for(var j = 0; j < tracks.length; j++) tracks[j].tick(now, dt);
    requestAnimationFrame(loop);
  }
  function start(){
    if(running) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(loop);
  }

  /* Settling on resize snaps every track instantly to the true scroll
     position. That is right for a real resize and WRONG on a handset, where
     scrolling itself fires `resize` continuously as the browser's URL bar
     collapses and expands — which would jolt every pinned section on the
     page mid-scroll. Width changes always count; height changes only count
     when they are larger than a URL bar. */
  var lastW = window.innerWidth, lastH = window.innerHeight;
  window.addEventListener('resize', function(){
    var w = window.innerWidth, h = window.innerHeight;
    var real = w !== lastW || Math.abs(h - lastH) > 140;
    lastW = w; lastH = h;
    if(!real) return;
    for(var i = 0; i < tracks.length; i++){ tracks[i].settle(); tracks[i].refresh(); }
  }, { passive: true });

  return {
    track:  function(el, o){ return el ? new Track(el, o) : null; },
    TIMING: TIMING,
    ramp:   ramp,
    smooth: smooth,
    lead:   lead,
    clamp01: cl01,
    reduced: function(){ return reduced; }
  };
})();
