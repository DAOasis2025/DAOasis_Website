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
     Pointer-coarse devices keep the native behaviour entirely.
   - Reduced motion. Off completely. Unlike cine's pacing — which is scroll-
     LINKED and therefore the reader's own input played back — this moves the
     page itself after the input has stopped, which is exactly the class of
     motion someone asking for less of it means.
   - Nested scrollers. A wheel over anything with its own overflow scrolls
     that, natively.
   - Anchor jumps, find-in-page, devtools, focus scrolling and any programmatic
     scrollTo. Those move the page by other means; the damper notices and
     re-syncs rather than fighting or snapping back.

   The page is never trapped: the target always converges on a real scroll
   position, and the loop stops the moment it arrives.
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

  var target = 0, cur = 0, running = false, armed = false, lastT = 0;

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
    var dt = now - lastT;
    lastT = now;
    if (!(dt > 0)) dt = 16;
    if (dt > MAXDT) dt = MAXDT;

    var d = target - cur;
    if (Math.abs(d) < MIN) {
      cur = target;
      window.scrollTo(0, cur);
      running = false;
      return;
    }
    cur += d * (1 - Math.exp(-dt / TAU));
    window.scrollTo(0, cur);
    requestAnimationFrame(step);
  }
  function start() {
    if (running) return;
    running = true;
    lastT = performance.now();
    requestAnimationFrame(step);
  }

  /* ── anything that moves the page by other means wins ─────────────────
     scrollTo from an anchor, find-in-page, a focus jump, the scrollbar, or a
     test harness. If the real position has diverged from where we believe we
     are, we were not the cause — adopt it rather than dragging the page back.
     3px of tolerance because our own scrollTo lands sub-pixel. */
  function onScroll() {
    if (Math.abs(window.scrollY - cur) > 3) {
      cur = target = window.scrollY;
      running = false;
    }
  }

  /* ── wheel ────────────────────────────────────────────────────────────── */
  function scrollableAncestor(el) {
    while (el && el !== document.body && el !== document.documentElement) {
      if (el.nodeType === 1) {
        var cs = getComputedStyle(el);
        if (/(auto|scroll)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 2) return el;
      }
      el = el.parentNode;
    }
    return null;
  }

  function onWheel(e) {
    if (e.ctrlKey) return;                       /* pinch-zoom */
    if (e.defaultPrevented) return;
    if (scrollableAncestor(e.target)) return;    /* let inner scrollers work */

    var d = e.deltaY;
    if (e.deltaMode === 1) d *= 16;              /* lines  */
    else if (e.deltaMode === 2) d *= window.innerHeight;  /* pages */
    if (!d) return;

    e.preventDefault();
    /* Re-base on the live position when we are at rest, so a native scroll
       that happened in between is not undone. */
    if (!running) cur = window.scrollY;
    target = clamp(target + d);
    start();
  }

  /* ── keyboard ─────────────────────────────────────────────────────────── */
  function onKey(e) {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    var t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
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
    if (!running) cur = window.scrollY;
    target = abs !== null ? abs : clamp(target + d);
    start();
  }

  /* ── arm / disarm ─────────────────────────────────────────────────────── */
  function arm() {
    if (armed || reduced() || coarse()) return;
    armed = true;
    cur = target = window.scrollY;
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKey, { passive: false });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
  }
  function disarm() {
    if (!armed) return;
    armed = false; running = false;
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
