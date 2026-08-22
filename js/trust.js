/* ══════════════════════════════════════════════════════════════
   ██  DAOASIS — TRUST LAYER SCRIPT  ██
   ──────────────────────────────────────────────────────────────
   Shared by the seven trust pages.

   MUST BE UPLOADED TO GITHUB inside the `js/` folder, alongside
   `js/cine.js`. If it is missing, every trust page still reads
   perfectly: the nav drawer stops opening and the contents rail
   stops highlighting, but nothing is hidden, because the reveal
   classes default to visible in `css/trust.css` rather than to
   invisible. That is deliberate — a legal page must never be
   able to serve blank type.

   DELIBERATELY ABSENT
   - No `cine.js`. There is no paced section on any trust page,
     because there is no pinned section to pace. Loading it here
     would add a controller with nothing to control.
   - No scroll hijacking, no pinning, no scrubbing, no canvas.
   - No IntersectionObserver-driven state that can be stranded:
     every reveal is one-shot and additive.
════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* Tell the page's inline failsafe that this file arrived and ran. Until
     this is set, a 2.5s timer in each page's <head> is waiting to drop the
     `js` class and paint every section at full strength. Set it first, so
     the failsafe never fires against a script that is merely slow. */
  document.documentElement.setAttribute('data-trust', 'ready');

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── NAV DRAWER ── */
  (function () {
    var burger = document.getElementById('navBurger');
    var drawer = document.getElementById('navDrawer');
    var backdrop = document.getElementById('navDrawerBackdrop');
    var closeBtn = document.getElementById('navDrawerClose');
    if (!burger || !drawer) return;

    function close() {
      drawer.classList.remove('open');
      burger.classList.remove('open');
      if (backdrop) backdrop.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    burger.addEventListener('click', function () {
      var open = drawer.classList.toggle('open');
      burger.classList.toggle('open', open);
      if (backdrop) backdrop.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });

    if (closeBtn) closeBtn.addEventListener('click', close);
    if (backdrop) backdrop.addEventListener('click', close);

    drawer.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', close);
    });

    /* Escape closes it. The drawer is now a left panel with a backdrop, but
       a keyboard user tabbing through it still needs a fast way out. */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) close();
    });
  })();

  /* ── NAV HIDE ON SCROLL + PROGRESS RULE ── */
  (function () {
    var nav = document.querySelector('.nav');
    var prog = document.getElementById('scrollProg');
    if (!nav) return;
    var lastY = 0, ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y > lastY && y > 80) nav.classList.add('nav-hidden');
        else nav.classList.remove('nav-hidden');
        if (prog) {
          var max = document.body.scrollHeight - window.innerHeight;
          prog.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
        }
        lastY = y;
        ticking = false;
      });
    }, { passive: true });
  })();

  /* ── REVEALS ──
     One-shot and additive. If IntersectionObserver is missing,
     everything is shown immediately rather than never. */
  (function () {
    var targets = document.querySelectorAll('.rv');
    if (!targets.length) return;
    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('show'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('show');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    targets.forEach(function (el) { obs.observe(el); });
  })();

  /* ── CONTENTS RAIL: SCROLL-SPY ──
     Marks which section the reader is in.

     Written against scroll position rather than
     IntersectionObserver on purpose. A legal section can easily be
     three viewports tall, so it is never wholly "intersecting" and
     an observer-driven rail flickers or goes blank in the middle of
     a long section. Reading the top edge of each section against a
     fixed line answers "which section am I in" correctly at any
     section length. */
  (function () {
    var rail = document.querySelector('.doc-rail');
    if (!rail) return;
    var links = [].slice.call(rail.querySelectorAll('a[href^="#"]'));
    if (!links.length) return;

    var sections = links.map(function (a) {
      return document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)));
    });

    var current = -1, ticking = false;

    function run() {
      /* The reading line sits a third of the way down the viewport:
         the section whose heading has most recently crossed it is
         the one being read. */
      var line = window.scrollY + window.innerHeight * 0.33;
      var idx = -1;
      for (var i = 0; i < sections.length; i++) {
        var s = sections[i];
        if (s && s.offsetTop <= line) idx = i;
      }
      /* Past the end of the document, hold the last section rather
         than dropping the highlight entirely. */
      if (idx === -1 && window.scrollY + window.innerHeight >= document.body.scrollHeight - 4) {
        idx = sections.length - 1;
      }
      if (idx !== current) {
        if (current >= 0 && links[current]) links[current].classList.remove('on');
        if (idx >= 0 && links[idx]) {
          links[idx].classList.add('on');
          keepVisible(links[idx]);
        }
        current = idx;
      }
      ticking = false;
    }

    /* The rail scrolls inside itself on the longer documents, so the
       active item can sit outside its own scroll window. */
    function keepVisible(a) {
      var list = a.closest('ol');
      if (!list || list.scrollHeight <= list.clientHeight + 2) return;
      var top = a.offsetTop - list.offsetTop;
      var bottom = top + a.offsetHeight;
      if (top < list.scrollTop) list.scrollTop = top - 8;
      else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight + 8;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(run); }
    }, { passive: true });
    window.addEventListener('resize', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(run); }
    }, { passive: true });
    run();
  })();

  /* ── MOBILE CONTENTS: CLOSE ON PICK ──
     Leaving the disclosure open pushes the section the reader just
     chose back off the screen. */
  (function () {
    var m = document.querySelector('.doc-toc-m');
    if (!m) return;
    m.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { m.removeAttribute('open'); });
    });
  })();

  /* ── DEEP LINKS INTO ACCORDIONS ──
     A link to a collapsed section would otherwise scroll to a
     closed summary and appear to do nothing. */
  (function () {
    function openTarget() {
      if (!location.hash) return;
      var el = null;
      try { el = document.querySelector(location.hash); } catch (err) { return; }
      if (!el) return;
      var d = el.closest ? el.closest('details') : null;
      if (d) d.setAttribute('open', '');
      if (el.tagName === 'DETAILS') el.setAttribute('open', '');
    }
    window.addEventListener('hashchange', openTarget);
    openTarget();
  })();

  /* ── PRINT: OPEN EVERY ACCORDION ──
     A printed policy with collapsed sections is an incomplete
     policy. CSS cannot force a closed <details> open, so the state
     is changed for the print and restored afterwards. */
  (function () {
    var wasOpen = [];
    function expand() {
      wasOpen = [];
      document.querySelectorAll('details').forEach(function (d) {
        wasOpen.push(d.hasAttribute('open'));
        d.setAttribute('open', '');
      });
    }
    function restore() {
      document.querySelectorAll('details').forEach(function (d, i) {
        if (!wasOpen[i]) d.removeAttribute('open');
      });
    }
    window.addEventListener('beforeprint', expand);
    window.addEventListener('afterprint', restore);
    /* Safari fires neither event, but does honour the media query. */
    if (window.matchMedia) {
      var mq = window.matchMedia('print');
      var onChange = function (e) { if (e.matches) expand(); else restore(); };
      if (mq.addEventListener) mq.addEventListener('change', onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
  })();

  /* ── THEME TOGGLE ── */
  (function () {
    var btnLight = document.getElementById('ftLight');
    var btnDark = document.getElementById('ftDark');
    if (!btnLight || !btnDark) return;
    function applyTheme(theme) {
      if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        btnLight.classList.add('active');
        btnDark.classList.remove('active');
      } else {
        document.documentElement.removeAttribute('data-theme');
        btnDark.classList.add('active');
        btnLight.classList.remove('active');
      }
      try { localStorage.setItem('daoasis-theme', theme); } catch (err) { /* private mode */ }
    }
    var stored = 'dark';
    try { stored = localStorage.getItem('daoasis-theme') || 'dark'; } catch (err) { /* private mode */ }
    applyTheme(stored);
    btnLight.addEventListener('click', function () { applyTheme('light'); });
    btnDark.addEventListener('click', function () { applyTheme('dark'); });
  })();

  /* REDUCED is read so the constant is not dead weight if a future
     section needs it; no trust page animates enough to branch on it
     beyond what CSS already handles. */
  if (REDUCED) document.documentElement.setAttribute('data-reduced', 'true');
})();
