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
    /* Was 0.9, and before that 0.70. The 0.9 reasoning — that mobile is the
       MVP and should read as the most considered surface, not the most
       hurried — was sound while the mobile GOVERNOR existed to hold the
       page still long enough for these durations to play out. The governor
       is gone (it took the scroll away from the finger to buy that time,
       and was reported three times as a page that would not scroll), so
       these numbers now meet a native flick instead of a speed-capped one,
       and 0.9 stopped meaning "considered" and started meaning "late".

       WHAT THIS NUMBER ACTUALLY CONTROLS. It scales the per-state SPEED
       CAP. The cap only binds when the gap between scroll and scene is
       large — a flick — which is exactly the case the governor used to
       absorb. Ordinary reading never reaches it: there the pace is set by
       followTau, which is untouched. So lowering this does NOT make the
       phone feel hurried while someone is reading; it only stops the scene
       arriving seconds after the reader does.

       The arithmetic, on .quest-map-outer at 672vh / 375x812. One state is
       ~929px of scroll. A normal flick runs 3-5px/ms, so the finger crosses
       that state in roughly 230ms. At 0.9 the cap allowed the scene one
       state per 1125ms — five times slower than the hand — so the reader
       was two states past the screen before it rendered. That is the
       "scrolls through before the app screens and sanctuary images land"
       report, and no pin height fixes it, because the brake is time.

       At 0.30 the cap allows a state per ~375ms. The scene still trails a
       hard flick slightly, which is what makes it read as settling rather
       than snapping, but it arrives within about a third of a second of
       the finger stopping — so the state LANDS, on the screen the reader
       stopped on, instead of somewhere behind them.

       Desktop is untouched: this multiplier is mobile-only. */
    mobileScale: 0.30,
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
    /* SUPERSEDED — now `followTau`, a TIME CONSTANT IN ms. The old value was
       a fraction applied once per frame and carried two separate faults.

       1. FRAME-RATE DEPENDENT, exactly like the old smooth.js constant.
          Measured frame intervals here are 16.5ms median / 20.7ms p95, so
          the damping swung ~27% frame to frame, and on a 120Hz display
          every scene on the site ran at double speed.

       2. IT WAS DELIBERATELY TUNED TO TRAIL THE PAGE. The note above says
          so: 2.06s end to end was rejected as "past the point where the
          scene visibly trails the page", and 0.06 was chosen to return to
          "the ~1.7s that was actually signed off". But 1.7s trails too.
          Measured on the build before this change, after one wheel notch
          the scroll settled at ~0.9s and the scene it drives at 1.5-1.8s;
          on web3 the scene did not begin to move for 255ms after the
          wheel. Content arriving half a second behind its own scroll
          position does not read as slow and considered. It reads as laggy,
          because the page and the thing painted on it are moving at
          different times.

       WHY RAISING THIS IS SAFE — THE SEPARATION OF CONCERNS.
       The brake on a FLICK is the speed cap below (`step`/`back`, per
       beat) and it is untouched: one beat still cannot arrive in less than
       1500ms. The HOLD plateau is untouched, so a state still lands and
       sits. Section heights are untouched. All this constant decides is how
       far behind the page the scene sits during ORDINARY scrolling, and the
       right answer to that is "barely at all".

       Every previous pass conflated the two and slowed both together. The
       input is now damped once, in js/smooth.js; damping it a second time
       here only ever bought lag. */
    followTau: 120,  /* ms */
  };

  /* Frame-rate independent damping factor for THIS frame. Identical feel at
     60, 120 and 144Hz; a long frame takes a correspondingly larger step
     rather than stalling. dt is already clamped to 64ms by the loop. */
  function followAlpha(dt){ return 1 - Math.exp(-dt / TIMING.followTau); }

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
      var want = gap * followAlpha(dt);      /* damped, so it eases in */
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
    var swant = sgap * followAlpha(dt);
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

  /* ── THE SCROLL CUE ────────────────────────────────────────────────────
     Replaces the literal "· SCROLL" labels that were written into two
     section kickers on app.html. Those were wrong twice over: they were
     permanent (still shouting SCROLL at a reader already three quarters of
     the way through the section), and they were per-section, so most of the
     site had no such affordance at all while two arbitrary places did.

     This knows what it is talking about, because it reads the track
     registry directly: a pinned section only holds the viewport while its
     own progress is below 1, so the cue can appear exactly when there is
     genuinely more of THIS section to see, and retire the moment there is
     not. Nothing on the page needs to declare anything.

     FOUR RULES, and each one is why it does not nag:
       · shown only while a scrubbed section owns the viewport AND its own
         progress is under 88% — past that the reader is leaving anyway;
       · hidden the instant the reader actually scrolls, and only returning
         after ~900ms of stillness. A cue that stays up while you are
         already scrolling is telling you something you are doing;
       · the WORDS appear once per session and never again — after that the
         mark alone carries it, because by then it has been taught;
       · it lives in js/cine.js rather than in four page stylesheets, so the
         four pages that have scrubbed sections cannot drift apart. Pages
         without a track never build it at all.

     It is a pure enhancement: if this file fails to load, no cue appears,
     which is exactly the state the site was in before. */
  /* ══════════════════════════════════════════════════════════════════════
     THE MOBILE SCROLL GOVERNOR                          (touch only, opt-in)

     THE PROBLEM IT EXISTS FOR. Everything above paces the VALUE a section
     renders. It cannot pace the PAGE, and on a handset the page is the
     thing that runs away: js/smooth.js is deliberately disarmed on
     `pointer: coarse`, so one hard flick moves the document two or three
     thousand pixels on its own momentum. The app hero is 512vh and the
     sanctuary hero 1120vh, so a reader who flicks twice is through the
     whole sequence before the first beat has finished handing over to the
     second — and once the section leaves the viewport the
     IntersectionObserver settles the track on its end state, which is the
     "if someone scrolls fast they skip straight through" that was reported.

     Damping the value harder cannot fix this. If the section is no longer
     on screen there is nothing left to pace.

     WHAT THIS DOES. On touch viewports, and only while a section that has
     opted in (`govern: true`) owns the viewport, the page's own scroll
     position is driven from the rAF loop at a bounded speed:

         finger / fling  ->  INTENT   (where the reader asked to be)
         governor        ->  POSITION (how fast they are allowed to get there)

     So the traversal takes the same wall-clock time whatever the gesture
     was — which is the whole request — and the magnet plateaus in snap()
     become real pauses measured in time rather than in scroll distance.

     THE SPEED IS NOT A MAGIC NUMBER. It is derived per section from the
     track's own timing: a section of N transitions at `step` ms each is
     allowed exactly the scroll length it has, over N * step * slack ms.
     Change TIMING.epic and the governed pass changes with it. A track
     whose wrapper holds no sticky stage at this width is not a pin and is
     never governed, however tall it is — see isPinned(). `slack`
     keeps the scroll fractionally slower than the value's own speed cap,
     so the two do not compound into a scene that trails further behind the
     page the longer the section runs.

     FIVE THINGS THAT KEEP IT FROM BEING SCROLL-JACKING
       · It is scoped to sections that opt in, on touch, under 900px.
         REDUCED MOTION KEEPS IT, and that is deliberate — see the note on
         govOn() below.
       · INTENT ALWAYS WINS EVENTUALLY. The position converges on it at a
         bounded but non-zero speed, so the section always completes and
         releases. There is no state in which the reader is held.
       · THE ESCAPE VALVE. Intent thrown well past the end of the section
         is someone leaving, not someone reading, and the cap is relaxed in
         proportion — the same reasoning as TIMING.maxSpan in tick().
       · A finger down stops what is in flight, exactly as a finger down
         stops native momentum.
       · Taps, links and inner scrollers are untouched: touchstart is
         passive and never prevented, and only a move that begins inside a
         governed section is.

     If this file fails to load, or a page never passes `govern`, the
     browser scrolls natively and nothing here runs at all.
  ══════════════════════════════════════════════════════════════════════ */
  var GOV = {
    /* How far ahead of the pin's own scrub range the governor takes the
       wheel, in viewports. A fling has to be caught BEFORE it is inside
       the section — catching it at the boundary would mean clamping the
       page backwards, which is the one thing that must never happen. */
    lead:    0.30,
    /* Governed scroll runs this much slower than the value's own speed
       cap, so the cap never binds and the scene does not drift further
       behind the page the longer the section runs. */
    slack:   1.15,
    /* px/ms floor and ceiling on governed scroll, whatever the arithmetic
       says. The ceiling is what stops a very tall pin (sanctuary's hero is
       1120vh) from being allowed to fly; the floor stops a short one from
       becoming a wall. */
    minV:    0.25,
    maxV:    1.50,
    /* AND A CEILING ON THE TIME, WHICH IS THE ONE THE READER FEELS.

       maxV is a velocity, and a velocity alone cannot say how long anybody
       is held: multiply it by a tall enough pin and it becomes a wall.
       That is what happened. Measured at 375x812 with the governor on:

         sanctuary  .hero-outer     8282px of travel   5.5s
         app        .hero-outer     3345px             2.7s
         app        .quest-map      4645px             3.6s
         app        .market-outer   4385px             2.9s

       Both of those pages open with a governed hero at scroll 0, so the
       first thing a phone reader meets is 2.7 or 5.5 seconds of dragging
       in which the page answers at a fixed rate no matter how hard it is
       thrown — every touchmove is preventDefault'd, so there is no way to
       ask for more. It reads as a page that does not scroll, and that is
       exactly how it was reported. index.html and web3.html pass `govern`
       nowhere, have no governed tracks at all, and were never reported.

       The note on maxV above reasoned about sanctuary's 1120vh hero and
       concluded the ceiling should hold it down. The arithmetic that
       reasoning implies was never done; 1120vh at 1.50px/ms is 5.5s.

       So bound the wall clock directly. A section may still be paced —
       short ones keep the cap the formula gives them, which is well inside
       this — but no section may take longer than this to cross, however
       tall it is. A native fling would cross sanctuary's hero in about
       half a second, so at 1.4s this is still unmistakably governed. */
    maxCrossMs: 1400,
    /* A lifted flick is worth this many ms of its own velocity. Native
       momentum on both platforms decays over roughly this long, so intent
       ends up where the page would have gone had we not intercepted. */
    flingMs: 480,
    /* Damping of the governed follow, before the cap. Gives the move an
       ease-out rather than stopping dead on arrival. */
    ease:    110,
    /* Once the governed section is behind us but the gesture's intent is
       not spent, what is left glides out on this time constant. This is
       the momentum we blocked, handed back. */
    freeTau: 170,
    /* How hard the cap relaxes per viewport of intent past the section. */
    escape:  0.9
  };

  var mqCoarse = window.matchMedia('(pointer: coarse)');

  /* REDUCED MOTION IS NOT EXCLUDED, and the distinction from js/smooth.js
     is not a fudge. smooth.js turns an input that moved the page and
     stopped into one that keeps gliding afterwards — it ADDS motion that
     was not asked for, which is exactly what someone setting that flag
     means. The governor adds none: the page travels the same distance the
     native fling was going to travel anyway, it is simply not allowed to
     travel it as fast. Slower is the direction vestibular sensitivity
     wants, and times() has already shortened every duration by
     TIMING.reducedScale, so a reduced-motion reader gets a governed pass
     that is about 45% quicker than everyone else's — controlled, but not
     made to wait. Excluding them would have left them with the original
     fault and nothing else. */
  function govOn(){
    if(!mqCoarse.matches) return false;
    if(window.innerWidth > TIMING.mobileAt) return false;
    /* the nav drawer and index's intro both lock the page this way */
    if(document.body && document.body.style.overflow === 'hidden') return false;
    return true;
  }

  /* A drag over anything with its own overflow belongs to that thing, not
     to the page. Same rule js/smooth.js applies to the wheel. */
  function innerScroller(el){
    while(el && el !== document.body && el !== document.documentElement){
      if(el.nodeType === 1){
        var cs;
        try { cs = getComputedStyle(el); } catch(e){ return null; }
        if(/(auto|scroll)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 2) return el;
      }
      el = el.parentNode;
    }
    return null;
  }

  var g = {
    own: false,        /* we are driving window scroll                    */
    touch: false,      /* a finger is down and its deltas are ours        */
    pos: 0,            /* the scroll position we are rendering            */
    intent: 0,         /* the scroll position the reader has asked for    */
    wrote: 0,          /* the last position we wrote, to tell ours apart  */
    fy: 0, ft: 0, fv: 0,   /* finger: y, time, velocity px/ms             */
    oy: 0, ot: 0, ov: 0    /* observed native scroll, the same three      */
  };

  function sy(){ return window.pageYOffset || document.documentElement.scrollTop || 0; }
  function vhNow(){ return window.innerHeight || 1; }
  function maxY(){ return Math.max(0, document.documentElement.scrollHeight - window.innerHeight); }
  function clampY(v){ var m = maxY(); return v < 0 ? 0 : v > m ? m : v; }

  /* IS THIS WRAPPER ACTUALLY A PIN AT THIS WIDTH?

     "Taller than the viewport" is not the test, and assuming it was is a
     mistake worth recording: sanctuary's .found-outer and .seven-outer
     collapse to `height:auto` on mobile, but their CONTENT is still 1,647
     and 1,584px tall — nearly twice a phone viewport. On that test they
     would both have been governed, and the reader would have been
     speed-capped through two sections of ordinary prose that do not
     animate at all on a handset.

     A pin is a wrapper with a STICKY STAGE in it, and nothing else is. The
     stage is always a direct child (.hero + .hero-bridge, .market-sticky,
     .quest-map-sticky, .hero-stage), so this reads a handful of elements,
     and the answer is cached per width — a media query is the only thing
     that can change it. */
  function isPinned(t){
    var w = window.innerWidth;
    if(t._pinW === w) return t._pin;
    t._pinW = w; t._pin = false;
    var vh = window.innerHeight || 1, kids = t.el.children || [];
    for(var i = 0; i < kids.length; i++){
      var cs;
      try { cs = getComputedStyle(kids[i]); } catch(e){ continue; }
      var p = cs.position;
      if((p === 'sticky' || p === '-webkit-sticky') && kids[i].offsetHeight >= vh * 0.6){
        t._pin = true; break;
      }
    }
    return t._pin;
  }

  /* The governed section that owns the viewport right now, if any. */
  function governedTrack(){
    var vh = window.innerHeight || 1;
    for(var i = 0; i < tracks.length; i++){
      var t = tracks[i];
      if(!t.o.govern) continue;
      if(t.el.offsetHeight - vh <= 0) continue;
      if(!isPinned(t)) continue;
      var r;
      try { r = t.el.getBoundingClientRect(); } catch(e){ continue; }
      if(r.top    >  vh * GOV.lead)       continue;   /* not ours yet */
      if(r.bottom <  vh * (1 - GOV.lead)) continue;   /* behind us    */
      return t;
    }
    return null;
  }

  /* px/ms this section is allowed, derived from its own pacing. */
  function govCaps(t){
    var len = t.el.offsetHeight - window.innerHeight;
    if(!(len > 0)) return null;
    var tm = t.times();
    /* the velocity below which THIS section becomes a wall — see maxCrossMs */
    var floor = Math.max(GOV.minV, len / GOV.maxCrossMs);
    function bound(v){
      if(v > GOV.maxV) v = GOV.maxV;
      return v < floor ? floor : v;
    }
    return {
      fwd:  bound(len / (t.N * tm.step * GOV.slack)),
      back: bound(len / (t.N * tm.back * GOV.slack))
    };
  }

  /* The only place the page is moved. It writes nothing when the page is
     already where it should be, which matters: a governed section that the
     reader is simply sitting in must not be issuing a scrollTo every frame,
     or a gesture the governor decided not to take (an inner scroller, a
     second finger) would be fought instead of left alone. */
  function govWrite(){
    g.pos = clampY(g.pos);
    var cur = sy();
    if(Math.abs(cur - g.pos) > 0.5){
      window.scrollTo(0, g.pos);
      cur = sy();
      /* the browser refused the position (document end, rubber band) —
         adopt it rather than pushing against it every frame */
      if(Math.abs(cur - g.pos) > 2) g.pos = g.intent = cur;
    }
    g.wrote = cur;
  }

  function govRelease(y){
    g.own = false; g.touch = false;
    g.pos = g.intent = g.oy = y;
    g.ov = 0; g.ot = performance.now();
  }

  /* PASS 0 of the frame — runs before any track reads its rect, so a track
     sees the governed position in the same frame it was written. */
  function govTick(now, dt){
    if(!tracks.length) return;
    if(!govOn()){ if(g.own) govRelease(sy()); return; }

    var y = sy();

    /* Watch how fast the page is moving whenever we are NOT the one moving
       it. By the time a fling reaches the section the gesture is long over,
       so this is the only record of how hard it was thrown. */
    if(!g.own){
      var odt = now - g.ot, ody = y - g.oy;
      /* a jump is not a speed — see the note on `jump` below */
      if(odt > 0 && odt < 300 && Math.abs(ody) < vhNow() * 1.2){
        g.ov = g.ov * 0.55 + (ody / odt) * 0.45;
      } else if(Math.abs(ody) >= vhNow() * 1.2){
        g.ov = 0;
      }
      g.oy = y; g.ot = now;
    }

    var t = governedTrack();

    if(!t){
      if(!g.own) return;
      /* Past the section. We blocked the native fling to get here, so what
         is left of the reader's intent is ours to spend. */
      if(g.touch){ g.pos = g.intent; govWrite(); return; }
      var fgap = g.intent - g.pos;
      if(Math.abs(fgap) < 0.5){ govRelease(y); return; }
      g.pos += fgap * (1 - Math.exp(-dt / GOV.freeTau));
      govWrite();
      return;
    }

    var caps = govCaps(t);
    if(!caps){ if(g.own) govRelease(y); return; }

    if(!g.own){
      /* TAKE THE WHEEL. Never by moving the page — only by refusing to let
         it go further this frame than the cap allows. Intent inherits the
         fling, so a hard throw still means "a long way"; it just no longer
         means "instantly". */
      g.own = true;
      g.pos = y;
      g.intent = clampY(y + g.ov * GOV.flingMs);
    } else if(!g.touch && !down && Math.abs(y - g.wrote) > 3){
      /* The page moved and it was not us. Two very different things look
         like this and they must not be treated alike.

         A JUMP — an in-page anchor, scroll restoration on back, a focus
         scroll, scrollIntoView — lands somewhere in one frame. Nobody
         scrolls at a viewport and a half per frame, so a displacement that
         large is not input and must simply be ADOPTED. Pacing it would
         drag the reader back out of the place the page just sent them,
         then re-approach it over several seconds, which is the single
         worst thing a governor can do.

         MOMENTUM we never saw start is the other: read it as intent and
         take the position back. One programmatic scroll cancels a fling on
         both platforms, so that happens once, not every frame. */
      var jump = Math.abs(y - g.wrote) > vhNow() * 1.2;
      if(jump){
        g.pos = g.intent = y;
      } else {
        var nv = dt > 0 ? (y - g.wrote) / dt : 0;
        g.intent = clampY(Math.abs(nv) > 0.05 ? y + nv * GOV.flingMs : y);
      }
    }

    var gap = g.intent - g.pos;
    if(Math.abs(gap) < 0.4){ g.pos = g.intent; govWrite(); return; }

    var v = gap > 0 ? caps.fwd : caps.back;

    /* THE ESCAPE VALVE. Intent a long way past the section is a reader
       leaving, not a reader reading. Same shape as TIMING.maxSpan. */
    var vh = window.innerHeight || 1;
    var r  = t.el.getBoundingClientRect();
    var over = gap > 0 ? (g.intent - (y + r.bottom - vh)) / vh
                       : ((y + r.top) - g.intent) / vh;
    if(over > 0) v *= 1 + Math.min(over, 4) * GOV.escape;

    var capPx = v * dt;
    var want  = gap * (1 - Math.exp(-dt / GOV.ease));
    g.pos += Math.max(-capPx, Math.min(capPx, want));
    govWrite();
  }

  /* ── the finger ─────────────────────────────────────────────────────── */
  /* `down` is any finger, including one on a gesture the governor has not
     taken. It matters because a drag that STARTS above the section and
     carries into it must be adopted as a drag, not mistaken for momentum
     by the frame loop and clamped while the finger is still on the glass. */
  var down = false, blocked = false;

  function govGrab(y){
    g.touch = true;
    g.fy = y; g.ft = performance.now(); g.fv = 0;
    if(!g.own){ g.own = true; g.pos = sy(); }
    g.intent = g.pos;          /* a finger down stops what is in flight */
  }

  function govStart(e){
    g.touch = false; down = false; blocked = false;
    if(!govOn()) return;
    if(e.touches && e.touches.length > 1) return;
    down = true;
    if(innerScroller(e.target)){ blocked = true; return; }
    /* Not governed yet is not the same as never: the gesture may drag into
       a governed section, and govMove picks it up when it does. */
    if(!governedTrack()) return;
    govGrab(e.touches[0].clientY);
  }

  function govMove(e){
    if(!down || blocked) return;
    if(e.touches.length > 1){ govEnd(); return; }
    if(!g.touch){
      if(!govOn() || !governedTrack()) return;
      govGrab(e.touches[0].clientY);      /* dragged in — take it from here */
      return;
    }
    var y = e.touches[0].clientY, now = performance.now(), dt = now - g.ft;
    var dy = g.fy - y;                       /* finger up = page down */
    if(dt > 0) g.fv = g.fv * 0.6 + (dy / dt) * 0.4;
    g.fy = y; g.ft = now;
    g.intent = clampY(g.intent + dy);
    /* Chrome marks a move uncancelable once native scrolling has begun; the
       per-frame cap covers that case, so this is never load-bearing. */
    if(e.cancelable) e.preventDefault();
  }

  function govEnd(){
    down = false; blocked = false;
    if(!g.touch) return;
    g.touch = false;
    /* held still before lifting — that is a stop, not a throw */
    if(performance.now() - g.ft > 90) g.fv = 0;
    g.intent = clampY(g.intent + g.fv * GOV.flingMs);
  }

  if('ontouchstart' in window || navigator.maxTouchPoints > 0){
    window.addEventListener('touchstart',  govStart, { passive: true  });
    window.addEventListener('touchmove',   govMove,  { passive: false });
    window.addEventListener('touchend',    govEnd,   { passive: true  });
    window.addEventListener('touchcancel', govEnd,   { passive: true  });
  }

  var cue = (function(){
    var el = null, label = null, shown = false, lastY = -1, still = 0, built = false;
    var TAUGHT = 'daoasis-scroll-taught';

    function build(){
      if(built) return; built = true;
      var css = document.createElement('style');
      css.textContent =
        '.dao-cue{position:fixed;left:50%;bottom:26px;transform:translate(-50%,10px);' +
        'z-index:80;pointer-events:none;opacity:0;' +
        'transition:opacity .55s var(--ease,cubic-bezier(.22,1,.36,1)),transform .55s var(--ease,cubic-bezier(.22,1,.36,1));' +
        'display:flex;flex-direction:column;align-items:center;gap:9px;}' +
        '.dao-cue.on{opacity:1;transform:translate(-50%,0);}' +
        '.dao-cue-t{font-family:"Frank Ruhl Libre",Georgia,serif;font-size:10px;letter-spacing:.24em;' +
        'text-transform:uppercase;color:currentColor;opacity:.62;white-space:nowrap;' +
        'transition:opacity .5s var(--ease,cubic-bezier(.22,1,.36,1));}' +
        '.dao-cue-r{width:1px;height:34px;background:currentColor;opacity:.22;position:relative;overflow:hidden;}' +
        '.dao-cue-r::after{content:"";position:absolute;left:0;top:-34px;width:1px;height:34px;' +
        'background:linear-gradient(180deg,transparent,currentColor);animation:daoCueRun 2.1s var(--ease,cubic-bezier(.22,1,.36,1)) infinite;}' +
        '@keyframes daoCueRun{0%{transform:translateY(0)}60%,100%{transform:translateY(68px)}}' +
        '@media (prefers-reduced-motion: reduce){.dao-cue-r::after{animation:none;transform:translateY(34px);}}';
      document.head.appendChild(css);

      el = document.createElement('div');
      el.className = 'dao-cue';
      el.setAttribute('aria-hidden', 'true');
      label = document.createElement('div');
      label.className = 'dao-cue-t';
      label.textContent = 'Keep scrolling';
      var rule = document.createElement('div');
      rule.className = 'dao-cue-r';
      var taught = false;
      try { taught = sessionStorage.getItem(TAUGHT) === '1'; } catch(e){}
      if(taught) label.style.display = 'none';
      el.appendChild(label); el.appendChild(rule);
      document.body.appendChild(el);
    }

    /* The cue inherits `color` from the section it is standing in front of,
       so it reads on a photograph, on ivory and on the dark grounds without
       a per-page rule. Sampling the section's own computed colour is what
       makes that automatic. */
    function tint(t){
      try {
        var c = getComputedStyle(t.el).color;
        if(c) el.style.color = c;
      } catch(e){}
    }

    function show(on, t){
      if(on === shown) return;
      shown = on;
      el.classList.toggle('on', on);
      if(on && t) tint(t);
      if(on && label.style.display !== 'none'){
        /* taught once, then the mark carries it for the rest of the visit */
        try { sessionStorage.setItem(TAUGHT, '1'); } catch(e){}
        setTimeout(function(){ if(label) label.style.opacity = '0'; }, 4200);
        setTimeout(function(){ if(label) label.style.display = 'none'; }, 4900);
      }
    }

    return function(now){
      if(!tracks.length) return;
      build();
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      if(y !== lastY){ lastY = y; still = now; show(false); return; }
      if(now - still < 900) return;             /* only once they have stopped */

      /* the scrubbed section that actually owns the viewport */
      var vh = window.innerHeight || 1, best = null, bestCover = 0;
      for(var i = 0; i < tracks.length; i++){
        var t = tracks[i];
        if(!t.near) continue;
        var r; try { r = t.el.getBoundingClientRect(); } catch(e){ continue; }
        var cover = Math.min(r.bottom, vh) - Math.max(r.top, 0);
        if(cover > bestCover){ bestCover = cover; best = t; }
      }
      if(!best || bestCover < vh * 0.72){ show(false); return; }
      var p = best.get();
      show(p < 0.88, best);
    };
  })();

  /* one rAF loop for every track on the page */
  var tracks = [], running = false, last = 0;
  function loop(now){
    var dt = now - last;
    last = now;
    if(!(dt > 0)) dt = 16;
    if(dt > 64) dt = 64;               /* tab-return / long frame guard */
    /* PASS 0 — the governor writes window.scrollY BEFORE anything reads a
       rect, so every track sees the governed position in the same frame */
    govTick(now, dt);
    /* read every track, THEN emit to every track — see Track.read */
    for(var i = 0; i < tracks.length; i++) tracks[i].read();
    for(var j = 0; j < tracks.length; j++) tracks[j].tick(now, dt);
    cue(now);
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
    /* Hand the scroll back before the tracks settle. A real resize
       relaid the document out under us, so every position the governor
       is holding is now meaningless; it re-takes the wheel on the next
       frame from wherever the browser actually left the reader. */
    govRelease(sy());
    for(var i = 0; i < tracks.length; i++){ tracks[i].settle(); tracks[i].refresh(); }
  }, { passive: true });

  return {
    track:  function(el, o){ return el ? new Track(el, o) : null; },
    TIMING: TIMING,
    GOV:    GOV,
    /* the governed section right now, or null — for measurement only */
    governing: function(){ return govOn() ? governedTrack() : null; },
    ramp:   ramp,
    smooth: smooth,
    lead:   lead,
    clamp01: cl01,
    reduced: function(){ return reduced; }
  };
})();
