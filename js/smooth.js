/* ============================================================================
   DAOasis — smooth scroll (js/smooth.js)

   Damps the SCROLL POSITION ITSELF. A wheel notch is normally an instant
   ~100px jump, and no amount of per-section pacing can hide that: it is the
   reason section-to-section movement read as "too rapid" while every pinned
   sequence had already been slowed down. This turns each notch into an eased
   glide, which is what Apple's product pages and the GTA VI page do (the
   latter measured in this project as GSAP + Lenis).

   IT REVERSES A DOCUMENTED DECISION. js/cine.js says, correctly for its own
   scope, that "there is no wheel handler, no touch handler ... the browser
   scrolls natively at all times". That stays true of cine.js — the damping
   lives here instead, in one small file, so it can be removed by deleting one
   <script> tag from each page and nothing else changes.

   WHAT IT DELIBERATELY DOES NOT TOUCH
   - Touch. iOS and Android already carry momentum, and intercepting it is how
     smooth-scroll libraries earn their reputation for fighting the user.
     Pointer-coarse devices keep the native behaviour entirely. (This is also
     what keeps us out of cine.js's mobile governor, which is coarse-only: the
     two are mutually exclusive by construction, never both driving at once.)
   - Reduced motion. Off completely. Unlike cine's pacing — which is scroll-
     LINKED and therefore the reader's own input played back — this moves the
     page itself after the input has stopped, which is exactly the class of
     motion someone asking for less of it means.
   - Nested scrollers. A wheel over anything with its own overflow scrolls
     that, natively.
   - Anchor jumps, find-in-page, devtools, focus scrolling and any programmatic
     scrollTo. Those move the page by other means; the damper notices and
     re-syncs rather than fighting or snapping back.
   - A page that is locked (nav drawer, modal). See LOCKED PAGES below.

   The page is never trapped: the target always converges on a real scroll
   position, the loop stops the moment it arrives, and if the loop ever fails
   to move the page the damper takes itself out of the way (see WATCHDOG).
   ========================================================================= */
(function () {
  'use strict';

  /* A TIME CONSTANT IN MILLISECONDS — NOT A PER-FRAME FRACTION.

     This was `EASE = 0.075` applied once per frame, which is the commonest
     bug in hand-rolled smooth scrolling, and its cost was measured here.
     Frame intervals on this site run 16.5ms median but 20.7ms at p95, so a
     per-frame constant makes the easing rate swing about 27% frame to
     frame. That is velocity chatter: measured at 0.12-0.24 px/ms of change
     per frame against a mean glide of 0.55-0.64 px/ms, i.e. the speed
     wobbling by 20-40% continuously, for the whole of every glide. That is
     what "not smooth" actually was, and no retuning of a per-frame constant
     can remove it — the wobble IS the per-frame constant meeting a variable
     frame time.

     It also made the site a different product on every display: at 120Hz
     the same constant runs twice as fast, at 144Hz nearly two and a half
     times. It was only ever tuned at 60Hz.

     An exponential on real elapsed time is frame-rate independent by
     construction: identical at 60, 120 and 144Hz, and a long frame takes a
     correspondingly larger step instead of stalling.

     TAU closes 63% of the remaining distance; about 4.6x TAU to rest.
     The old value's equivalent was 214ms, which left the page trailing the
     hand by 213-266px during a sustained scroll and still gliding 1.3s
     after the last notch. That is ice, not precision. */
  var TAU   = 110;    /* ms */
  var MIN   = 0.4;    /* px: below this, snap and stop the loop */
  var MAXDT = 64;     /* ms: tab-return / long-frame guard */
  var STALL = 400;    /* ms: see WATCHDOG */

  var target = 0, cur = 0, running = false, armed = false, lastT = 0;
  var wrote = 0;          /* last position WE wrote — see onScroll */
  var selfWrite = false;  /* true for the duration of our own scrollTo */
  var stallTimer = null, stallFrom = 0;
  var prevBehavior = null;

  function reduced() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
  function coarse() {
    return window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  }
  function maxScroll() {
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  }
  function clamp(v) { var m = maxScroll(); return v < 0 ? 0 : v > m ? m : v; }

  /* ── the loop ─────────────────────────────────────────────────────────── */
  function step(now) {
    if (!armed) { running = false; return; }
    var dt = now - lastT;
    lastT = now;
    if (!(dt > 0)) dt = 16;
    if (dt > MAXDT) dt = MAXDT;

    var d = target - cur;
    if (Math.abs(d) < MIN) {
      cur = target;
      write(cur);
      running = false;
      return;
    }
    cur += d * (1 - Math.exp(-dt / TAU));
    write(cur);
    requestAnimationFrame(step);
  }

  /* Every write goes through here so onScroll can recognise our own work.

     TWO markers, because a scroll event can arrive either way round.
     Normally it is queued and delivered at the next rendering opportunity,
     by which time `wrote` is already updated and the comparison in onScroll
     is the one that matters. But a browser (or a test harness) is free to
     dispatch it SYNCHRONOUSLY from inside scrollTo — at which point `wrote`
     still holds the previous frame's position, the comparison reads its own
     write as an outside interruption, and the glide is killed on its first
     frame. The flag closes that window; the value covers everything after.

     Recording the position we ASKED for is not enough either — the browser
     lands sub-pixel and clamps at the document end — so we record where it
     actually went. */
  function write(y) {
    selfWrite = true;
    window.scrollTo(0, y);
    wrote = window.scrollY;
    selfWrite = false;
  }

  function start() {
    if (running) return;
    running = true;
    lastT = performance.now();
    armWatchdog();
    requestAnimationFrame(step);
  }

  /* ── WATCHDOG ─────────────────────────────────────────────────────────
     onWheel calls preventDefault() BEFORE it can know that the loop will
     ever deliver a frame. If requestAnimationFrame is throttled or stalled
     — an occluded or backgrounded window, battery saver, a remote session,
     a compositor hiccup — the native scroll has been cancelled and nothing
     replaces it, and the page is simply dead under the wheel. That is not a
     degraded glide, it is a site that does not scroll, and it is not a
     failure mode worth risking for an easing curve.

     So: whenever a glide starts, check back. If the page has not moved at
     all by then and we were asking it to, this damper is not working on
     this machine — disarm for the session and let the browser scroll the
     way it always could.

     Two things it must not mistake for a stall. A backgrounded tab has no
     animation frames by design and is not a broken machine — and nobody is
     reading it either, so it is left alone. And the move has to have been a
     real one: a half-pixel request that rounds to the same integer position
     has not failed at all, it has arrived. */
  function armWatchdog() {
    stallFrom = window.scrollY;
    if (stallTimer) clearTimeout(stallTimer);
    stallTimer = setTimeout(function () {
      stallTimer = null;
      if (!running || !armed) return;
      if (document.hidden) return;
      if (window.scrollY === stallFrom && Math.abs(target - stallFrom) > 8) disarm();
    }, STALL);
  }

  /* ── anything that moves the page by other means wins ─────────────────
     scrollTo from an anchor, find-in-page, a focus jump, the scrollbar, or a
     test harness. If the real position has diverged from where we believe we
     are, we were not the cause — adopt it rather than dragging the page back.

     The comparison is against the last position WE wrote, not against `cur`.
     Comparing to `cur` was wrong whenever the browser did not land exactly
     where we asked, and CSS `scroll-behavior: smooth` on <html> makes that
     the normal case rather than the exception: it turns each of our ~60
     writes per second into its own animated scroll, so the real position
     trails `cur` by far more than the tolerance, this guard reads its own
     damper as an outside interruption, and kills the glide several times a
     second. The page then crawls — a few pixels per notch. arm() removes
     the conflict at the source (below); this makes the guard correct
     regardless.

     3px of tolerance because our own scrollTo lands sub-pixel. */
  function onScroll() {
    if (selfWrite) return;                               /* that was us */
    if (Math.abs(window.scrollY - wrote) <= 3) return;   /* that was us */
    cur = target = wrote = window.scrollY;
    running = false;
  }

  /* ── wheel ────────────────────────────────────────────────────────────── */
  function scrollableAncestor(el) {
    while (el && el !== document.body && el !== document.documentElement) {
      if (el.nodeType === 1) {
        var cs;
        try { cs = getComputedStyle(el); } catch (e) { return null; }
        if (/(auto|scroll)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 2) return el;
      }
      el = el.parentNode;
    }
    return null;
  }

  /* LOCKED PAGES. The nav drawer and every modal on the site lock the page
     with `document.body.style.overflow = 'hidden'`; index's intro locks
     <html> the same way. The viewport takes its overflow from those, so the
     page stops scrolling — but note what does NOT happen, because assuming
     it did is what made the first version of this guard useless: the
     document does not collapse. Measured on app.html with the drawer shut
     and open, documentElement.scrollHeight is 31860 both times and
     maxScroll() stays 30960. A locked page is not a short page, and cannot
     be detected by measuring one.

     So ask the overflow directly. It matters because while the lock is on,
     every scrollTo we issue is silently discarded: `cur` converges on a
     target the page never reaches, and the two come apart by however far
     the reader spun the wheel. They close the drawer, give it one notch,
     and the damper glides them to that stale target instead — hundreds of
     pixels away, and if they happened to scroll up while it was open, back
     at the top of the page. Re-basing `cur` on the way in could not save
     it, because the value left behind was `target`; rebase() now takes
     both, and this keeps us out of it in the first place.

     It also stops us swallowing wheel events the open panel should get, and
     stops the watchdog reading a deliberate lock as a broken machine.

     Hands off: no preventDefault, no target change. */
  function hidesOverflow(el) {
    if (!el) return false;
    var cs;
    try { cs = getComputedStyle(el); } catch (e) { return false; }
    return cs.overflowY === 'hidden' || cs.overflowY === 'clip';
  }
  function locked() {
    return hidesOverflow(document.body) ||
           hidesOverflow(document.documentElement) ||
           maxScroll() <= 0;
  }

  function onWheel(e) {
    if (e.ctrlKey) return;                       /* pinch-zoom */
    if (e.defaultPrevented) return;
    if (locked()) return;                        /* drawer / modal open */
    if (scrollableAncestor(e.target)) return;    /* let inner scrollers work */

    var d = e.deltaY;
    if (e.deltaMode === 1) d *= 16;              /* lines  */
    else if (e.deltaMode === 2) d *= window.innerHeight;  /* pages */
    if (!d) return;

    e.preventDefault();
    rebase();
    target = clamp(target + d);
    start();
  }

  /* Re-base BOTH ends on the live position when we are at rest. `cur` alone
     was not enough: target is the value a clamp or an outside jump can have
     left somewhere else entirely, and a stale target is a page that yanks. */
  function rebase() {
    if (!running) cur = target = wrote = window.scrollY;
  }

  /* ── keyboard ─────────────────────────────────────────────────────────── */
  function onKey(e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
    if (locked()) return;
    var h = window.innerHeight, d = null, abs = null;
    switch (e.key) {
      case 'ArrowDown':  d =  90; break;
      case 'ArrowUp':    d = -90; break;
      case 'PageDown':   d =  h * 0.88; break;
      case 'PageUp':     d = -h * 0.88; break;
      case ' ':          d = e.shiftKey ? -h * 0.88 : h * 0.88; break;
      case 'Home':       abs = 0; break;
      case 'End':        abs = maxScroll(); break;
      default: return;
    }
    e.preventDefault();
    rebase();
    target = abs !== null ? abs : clamp(target + d);
    start();
  }

  /* ── arm / disarm ─────────────────────────────────────────────────────── */
  function arm() {
    if (armed || reduced() || coarse()) return;
    armed = true;
    cur = target = wrote = window.scrollY;

    /* Four places carry `@media (prefers-reduced-motion: no-preference) {
       html { scroll-behavior: smooth } }` — about.html, index.html,
       investors.html and css/trust.css. That media query and this damper
       select for the SAME readers, so on those pages the two were always
       both on, and the CSS animated every one of our per-frame writes. See
       onScroll for what that did. The two cannot both drive; the damper is
       the one with the finer control, so it wins while it is armed and
       hands the declaration straight back on the way out.

       Note the media query is why this was invisible in-house and showed up
       for "other people visiting": anyone with reduce-motion set never
       armed this damper and never saw the fault. */
    var de = document.documentElement;
    prevBehavior = de.style.scrollBehavior;
    de.style.scrollBehavior = 'auto';

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey, { passive: false });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }
  function disarm() {
    if (!armed) return;
    armed = false; running = false;
    if (stallTimer) { clearTimeout(stallTimer); stallTimer = null; }
    document.documentElement.style.scrollBehavior = prevBehavior || '';
    window.removeEventListener('wheel', onWheel, { passive: false });
    window.removeEventListener('keydown', onKey, { passive: false });
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onScroll);
  }

  if (window.matchMedia) {
    var mqR = window.matchMedia('(prefers-reduced-motion: reduce)');
    var mqC = window.matchMedia('(pointer: coarse)');
    var sync = function () { (reduced() || coarse()) ? disarm() : arm(); };
    mqR.addEventListener ? mqR.addEventListener('change', sync) : mqR.addListener(sync);
    mqC.addEventListener ? mqC.addEventListener('change', sync) : mqC.addListener(sync);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', arm, { once: true });
  } else {
    arm();
  }

  /* exposed only so a page can opt out (index.html's intro locks scroll) */
  window.DAOsmooth = {
    pause: disarm,
    resume: arm,
    get armed() { return armed; }
  };
})();
