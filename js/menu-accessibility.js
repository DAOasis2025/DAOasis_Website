/* Enhance the existing drawer without changing navigation or scroll scripts. */
(function () {
  'use strict';
  var drawer = document.getElementById('navDrawer');
  var burger = document.getElementById('navBurger');
  var backdrop = document.getElementById('navDrawerBackdrop');
  if (!drawer || !burger) return;
  var blocked = [];
  var active = false;
  drawer.setAttribute('aria-modal', 'true');

  function controls() {
    return Array.from(drawer.querySelectorAll('a[href], button, input, select, textarea, [tabindex]'))
      .filter(function (el) { return !el.disabled && el.tabIndex >= 0 && el.getClientRects().length && !el.closest('[inert]'); });
  }
  function sync() {
    var open = drawer.classList.contains('open');
    if (open === active) return;
    active = open;
    if (open) {
      // Inert every background branch, preserving any pre-existing inert state.
      for (var branch = drawer; branch.parentElement && branch !== document.body; branch = branch.parentElement) {
        Array.from(branch.parentElement.children).forEach(function (el) {
          if (el !== branch && el !== backdrop && !el.hasAttribute('inert') && !/^(SCRIPT|STYLE|LINK)$/.test(el.tagName)) {
            blocked.push(el);
            el.setAttribute('inert', '');
          }
        });
      }
      if (!drawer.contains(document.activeElement)) {
        var first = controls()[0];
        if (first) first.focus({ preventScroll: true });
      }
    } else {
      blocked.forEach(function (el) { el.removeAttribute('inert'); });
      blocked = [];
      // The existing close handler may have tried to focus the inert burger.
      if (drawer.contains(document.activeElement) || document.activeElement === document.body) burger.focus({ preventScroll: true });
    }
  }
  new MutationObserver(sync).observe(drawer, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Tab' || !drawer.classList.contains('open')) return;
    var items = controls();
    if (!items.length) { event.preventDefault(); return; }
    var first = items[0], last = items[items.length - 1];
    if (event.shiftKey && (document.activeElement === first || !drawer.contains(document.activeElement))) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !drawer.contains(document.activeElement))) {
      event.preventDefault(); first.focus();
    }
  }, true);
  document.addEventListener('focusin', function (event) {
    if (active && !drawer.contains(event.target)) {
      var first = controls()[0];
      if (first) first.focus({ preventScroll: true });
    }
  });
  sync();
})();
