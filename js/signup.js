/* ══ SIGN-UP — js/signup.js (9 October 2026) ══════════════════════════════
   One behaviour for every sign-up form on the site (<form data-su>).

   ┌─────────────────────────────────────────────────────────────────────┐
   │  THE ONLY THING TO EDIT IS SIGNUP_CONFIG BELOW.                     │
   │                                                                     │
   │  endpoint  The "action" address of your MailerLite embedded form.   │
   │            It looks like                                            │
   │  https://assets.mailerlite.com/jsonp/1234567/forms/987654321098765432/subscribe
   │            Leave it as '' and the site falls back to opening the    │
   │            visitor's own email app (nothing is collected).          │
   │                                                                     │
   │  groups    OPTIONAL. MailerLite group IDs, one per interest. Leave  │
   │            any of them '' to skip. Interests are ALWAYS also sent   │
   │            as text in the custom field "interests", so groups are   │
   │            only needed if you want automatic segments.              │
   └─────────────────────────────────────────────────────────────────────┘

   WHAT IS SENT (only when endpoint is set, only when the visitor presses
   the button): fields[email], fields[name] (if given), fields[interests]
   (comma-separated text), groups[] (for any interest with a group ID),
   ml-submit=1 and anticsrf=true — the same fields MailerLite's own embed
   posts. No MailerLite script is loaded and no cookie is set.

   NEVER CLAIMS SUCCESS IT DID NOT GET. "You're on the list" is shown only
   when MailerLite answers {"success": true}. Anything else — a network
   error, a blocked request, an error reply — says so and offers email.
   ═══════════════════════════════════════════════════════════════════════ */
var SIGNUP_CONFIG = {
  endpoint: '',
  groups: {
    'Companion App':      '',
    'Sanctuary':          '',
    'Community':          '',
    'Investor / partner': ''
  }
};

(function(){
  var ADDRESS = 'info@daoasis.xyz';
  var forms = document.querySelectorAll('form[data-su]');
  if(!forms.length) return;
  var LIVE = !!(SIGNUP_CONFIG.endpoint && /^https:\/\/[a-z0-9.-]*mailerlite\.com\/\S+$/i.test(SIGNUP_CONFIG.endpoint.trim()));

  function esc(t){ return String(t).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

  Array.prototype.forEach.call(forms, function(form){
    var email = form.querySelector('input[name="email"]');
    var name  = form.querySelector('input[name="name"]');
    var btn   = form.querySelector('.su-b');
    var msg   = form.querySelector('.su-msg');
    var first = form.querySelector('[data-su-first]');

    /* Until MailerLite is connected, say plainly what pressing the button does. */
    if(!LIVE){
      if(btn && btn.dataset.fallback) btn.textContent = btn.dataset.fallback;
      if(first) first.innerHTML = 'Your email app opens with your details. <strong>Send it and we add you to the list by hand</strong>, then email you when early access opens.';
    }

    function say(html){ msg.innerHTML = html; msg.classList.add('show'); }
    function interests(){
      return Array.prototype.map.call(form.querySelectorAll('input[name="interests"]:checked'), function(c){ return c.value; });
    }
    function mailtoHref(list){
      var body = 'Please add me to the DAOasis early access list.\n\n' +
        'Email: ' + email.value.trim() + '\n' +
        (name && name.value.trim() ? 'First name: ' + name.value.trim() + '\n' : '') +
        'Interested in: ' + (list.length ? list.join(', ') : 'not specified') + '\n';
      return 'mailto:' + ADDRESS + '?subject=' + encodeURIComponent('Early access — DAOasis') + '&body=' + encodeURIComponent(body);
    }
    function fallbackNote(list, reason){
      var href = mailtoHref(list);
      say((reason ? esc(reason) + ' ' : '') +
        'Your email app should have opened with your details. <strong>Nothing has been sent or stored by this website</strong> — send that email and we will add you to the list by hand. ' +
        'If nothing opened, <a href="' + href + '">try again</a> or write to <a href="mailto:' + ADDRESS + '">' + ADDRESS + '</a>.');
      try { window.location.href = href; } catch(e){}
    }

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var v = email.value.trim();
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)){
        email.setAttribute('aria-invalid','true');
        say('Please enter a valid email address.');
        email.focus();
        return;
      }
      email.removeAttribute('aria-invalid');
      var list = interests();

      if(!LIVE){ fallbackNote(list, ''); return; }

      var data = new URLSearchParams();
      data.append('fields[email]', v);
      if(name && name.value.trim()) data.append('fields[name]', name.value.trim());
      data.append('fields[interests]', list.join(', '));
      list.forEach(function(i){ var g = SIGNUP_CONFIG.groups[i]; if(g) data.append('groups[]', g); });
      data.append('ml-submit', '1');
      data.append('anticsrf', 'true');

      btn.disabled = true;
      var label = btn.textContent;
      btn.textContent = 'Sending…';
      fetch(SIGNUP_CONFIG.endpoint.trim(), { method: 'POST', mode: 'cors', body: data, headers: { 'Accept': 'application/json' } })
        .then(function(r){ return r.json().catch(function(){ return {}; }).then(function(j){ return { ok: r.ok, j: j }; }); })
        .then(function(res){
          if(res.ok && res.j && res.j.success === true){
            form.reset();
            Array.prototype.forEach.call(form.querySelectorAll('input[name="interests"][data-default]'), function(c){ c.checked = true; });
            say('<strong>You are on the list.</strong> We will email you when early access opens. If a confirmation email arrives, open it to finish joining.');
          } else {
            say('The sign-up service did not accept that just now, so <strong>you have not been added yet</strong>. Please try again, or <a href="' + mailtoHref(list) + '">send your details by email</a> instead.');
          }
        })
        .catch(function(){
          say('We could not reach the sign-up service, so <strong>you have not been added yet</strong>. Please try again, or <a href="' + mailtoHref(list) + '">send your details by email</a> instead.');
        })
        .then(function(){ btn.disabled = false; btn.textContent = label; });
    });
  });
})();
