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
  var TIMING = {
    epic:   { step: 1150, back: 880, hold: 90 },    /* major cinematic beats */
    major:  { step:  950, back: 740, hold: 70 },    /* standard narrative     */
    simple: { step:  720, back: 600, hold: 50 },    /* light transitions      */

    /* Touch already carries its own momentum, and a phone is held closer
       to the eye — the same durations that read as cinematic on a desktop
       read as lag on a handset. */
    mobileScale: 0.70,
    mobileAt: 900,

    /* A jump is never allowed to take longer than step * maxSpan, so a
       page-anchor or a fast flick through several states resolves
       promptly instead of grinding through them one at a time. */
    maxSpan: 2.4,
    minDur: 150,

    /* guided: damping of the follow, before the speed cap is applied */
    follow: 0.15
  };

  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced  = mqReduce.matches;
  if(mqReduce.addEventListener) mqReduce.addEventListener('change', function(e){ reduced = e.matches; });
  else if(mqReduce.addListener) mqReduce.addListener(function(e){ reduced = e.matches; });

  function isMobile(){ return window.innerWidth <= TIMING.mobileAt; }
  function cl01(v){ return v < 0 ? 0 : v > 1 ? 1 : v; }
  /* The transition curve, and it is a considered choice.

     A symmetrical ease-in-out is only ~1% complete 150ms after the user
     scrolls: the scene looks frozen and the section reads as laggy.
     A pure ease-out answers instantly but leaves at full velocity, and
     because a transition is re-based on its current value whenever the
     user retargets mid-flight, that shows up as a visible kink.

     This is a 30/70 blend: motion is legible within ~80ms, yet starts
     from a moderate velocity, so retargeting stays smooth. */
  function easeIO(t){
    var io  = t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t + 2, 2)/2;
    var out = 1 - (1 - t) * (1 - t);
    return io * 0.3 + out * 0.7;
  }

  /* identical maths to the pages' own progressOf(), kept here so the
     controller has no dependency on page-level helpers */
  function rawOf(el){
    var r = el.getBoundingClientRect();
    var s = el.offsetHeight - window.innerHeight;
    if(s > 0) return cl01(-r.top / s);
    return r.top < 0 ? 1 : 0;
  }

  /* Every pin wrapper on the site follows the same shape: an outer div
     tall enough to give the animation scroll room, holding one
     position:sticky stage that actually holds the viewport. Finding it
     generically means the release-on-completion behaviour below needs
     no per-page wiring. */
  function findSticky(el){
    var kids = el.querySelectorAll('*');
    for(var i = 0; i < kids.length; i++){
      if(getComputedStyle(kids[i]).position === 'sticky') return kids[i];
    }
    return null;
  }

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
    this.value   = v;
    this.rawV    = v;
    this.goalIdx = this.nearest(v);
    this.goal    = this.stops[this.goalIdx];
    this.from    = v;
    this.t0      = 0;
    this.dur     = 1;
    this.arrived = 0;
    this.subs    = [];
    this.emitted = -1;
    this.near    = true;

    /* One-way: once scroll has carried the story forward, scrolling back
       up leaves it exactly where it finished rather than replaying it in
       reverse. peak is the highest true scroll progress seen so far and
       is the only thing goals are ever computed from. */
    this.peak     = v;
    /* Once the story reaches its last state AND the user's real scroll
       has actually caught up to it, the pin releases: the sticky stage
       drops back into normal flow and the wrapper's remaining scroll
       room collapses, so the section does not keep holding the viewport
       after it is finished. */
    this.unpinned = false;
    this.stickyEl = findSticky(el);

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
    if(this.unpinned) return;
    var trueV = rawOf(this.el);
    if(trueV > this.peak) this.peak = trueV;
    var v = this.peak;
    this.rawV = v;
    this.goalIdx = this.nearest(v);
    this.goal = this.mode === 'sticky' ? this.stops[this.goalIdx] : v;
    this.value = this.from = this.goal;
    this.emit(this.goal);
    this.maybeUnpin();
  };

  /* Drop the sticky stage into normal flow and trim the wrapper's
     remaining scroll room down to the current scroll position, so the
     section stops holding the viewport now that its story is finished.
     Nothing below the fold moves, and since this only ever fires once
     the story is one-way there is nothing left to re-pin for. */
  Track.prototype.maybeUnpin = function(){
    if(this.unpinned || !this.stickyEl) return;
    /* Read the authoritative displayed value/state rather than the
       internal pacing fields — under reduced motion (or o.off) those
       are never touched, since pacing is bypassed entirely. */
    var last = this.stops.length - 1;
    var atLastState = this.state() === last;
    var converged   = Math.abs(this.get() - this.stops[last]) < 0.002;
    if(!atLastState || !converged || this.peak < 0.999) return;
    this.unpinned = true;
    var el = this.el, stage = this.stickyEl;
    stage.style.position = 'relative';
    stage.style.top = '';
    var rect = el.getBoundingClientRect();
    var extra = rect.bottom - window.innerHeight;
    if(extra > 1){
      el.style.height = Math.max(el.offsetHeight - extra, window.innerHeight) + 'px';
    }
  };

  Track.prototype.tick = function(now, dt){
    if(!this.near || this.unpinned) return;
    var trueRaw = rawOf(this.el);
    if(trueRaw > this.peak) this.peak = trueRaw;
    var raw = this.rawV = this.peak;

    /* Reduced motion, or explicitly opted out: the value is the scroll
       position. Content still changes state, just without the pacing —
       and still one-way, per the peak clamp above. */
    if(reduced || this.o.off){ this.emit(raw); this.maybeUnpin(); return; }

    var t = this.times();
    var span = 1 / this.N;                    /* one state, in 0..1 */

    /* ── GUIDED — continuous, speed-capped ── */
    if(this.mode === 'guided'){
      var gap = raw - this.value;
      var ag  = Math.abs(gap);
      if(ag < 0.0004){ this.value = raw; this.emit(raw); this.maybeUnpin(); return; }
      var cap = (span / (gap > 0 ? t.step : t.back)) * dt;
      /* Relax the cap once the user is far beyond what pacing can
         justify — an anchor jump, a resize, a hard flick. Without this
         the scene would trail the page instead of leading it. */
      var over = ag / span - TIMING.maxSpan;
      if(over > 0) cap *= 1 + over * 3;
      var want = gap * TIMING.follow;         /* damped, so it eases in */
      this.value += Math.max(-cap, Math.min(cap, want));
      this.emit(this.value);
      this.maybeUnpin();
      return;
    }

    /* ── STICKY — quantised to whole narrative states ── */
    var st = this.stops, gi = this.goalIdx;
    var ni = this.nearest(raw);

    /* Hysteresis: commit to the next state only once the scroll is 55%
       of the way to it, so the story does not flicker between two states
       on a trackpad wobble. Measured against the adjacent stop, so
       unevenly spaced states get a proportionate deadband. */
    if(ni !== gi){
      var adj   = gi + (ni > gi ? 1 : -1);
      var reach = Math.abs(st[adj] - st[gi]) || 1;
      if(Math.abs(raw - st[gi]) < 0.55 * reach) ni = gi;
    }

    if(ni !== gi){
      var settled = Math.abs(this.value - this.goal) < 0.001;
      var far     = Math.abs(ni - gi) > 1.5;
      /* Dwell so a state reads as a state — but never dwell when the
         user has plainly asked for more than one step. */
      if(!(settled && !far && now - this.arrived < t.hold)){
        this.from    = this.value;
        this.goalIdx = ni;
        this.goal    = st[ni];
        this.t0      = now;
        var d   = Math.abs(ni - gi);                  /* states to cross */
        var per = this.goal > this.from ? t.step : t.back;
        this.dur = Math.max(TIMING.minDur,
                   Math.min(per * Math.max(d, 0.4), per * TIMING.maxSpan));
      }
    }

    if(Math.abs(this.value - this.goal) > 1e-5){
      var k = cl01((now - this.t0) / this.dur);
      this.value = this.from + (this.goal - this.from) * easeIO(k);
      if(k >= 1){ this.value = this.goal; this.arrived = now; }
    }
    this.emit(this.value);
    this.maybeUnpin();
  };

  Track.prototype.emit = function(v){
    if(v === this.emitted) return;
    this.emitted = v;
    var s = this.state();
    for(var i = 0; i < this.subs.length; i++) this.subs[i](v, s);
  };

  /* the paced value — a drop-in replacement for progressOf(outer) */
  Track.prototype.get   = function(){ return (reduced || this.o.off) ? this.rawV : this.value; };
  Track.prototype.raw   = function(){ return this.rawV; };
  Track.prototype.state = function(){ return this.nearest(this.get()); };
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
    for(var i = 0; i < tracks.length; i++) tracks[i].tick(now, dt);
    requestAnimationFrame(loop);
  }
  function start(){
    if(running) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', function(){
    for(var i = 0; i < tracks.length; i++){ tracks[i].settle(); tracks[i].refresh(); }
  }, { passive: true });

  return {
    track:  function(el, o){ return el ? new Track(el, o) : null; },
    TIMING: TIMING,
    reduced: function(){ return reduced; }
  };
})();
