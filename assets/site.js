/* Zevston site script: mobile nav, FAQ accordion, site search (+ Google), quote form.
   No dependencies. Edit CONFIG below if the contact details change. */
(function () {
  'use strict';

  var CONFIG = {
    domain: 'zevston.com',
    whatsapp: '923334434464',          // international format, no + or spaces
    email: 'contact@zevston.com'
  };

  /* ---------- Search index: add a line here when you add a page or section ---------- */
  var INDEX = [
    { t: 'Zevston: Home', u: '/', k: 'home zevston construction interior design lahore company',
      x: 'Construction, civil engineering and interior design company in Lahore, Pakistan.' },

    { t: 'Muhammad Imran Kabeer: Civil Engineer', u: '/imran-kabeer/',
      k: 'muhammad imran kabeer civil engineer construction head site supervision',
      x: 'Civil engineer in Lahore with 13 years of experience. Leads construction and project management at Zevston.' },
    { t: 'Muhammad Jabran Kabeer: Interior Designer', u: '/jabran-kabeer/',
      k: 'muhammad jabran kabeer interior designer woodwork furniture head',
      x: 'Interior designer in Lahore. Leads interior design and custom woodwork at Zevston.' },

    { t: 'Civil Engineering & Construction', u: '/imran-kabeer/#services',
      k: 'civil engineer construction builder contractor imran division',
      x: 'Structural coordination, site supervision, project management and full build execution.' },
    { t: 'Interior Design & Woodwork', u: '/jabran-kabeer/#services',
      k: 'interior designer interiors woodwork carpenter jabran division',
      x: 'Space planning, custom furniture, kitchens, wardrobes and office interiors.' },

    { t: 'Residential Construction', u: '/imran-kabeer/#services',
      k: 'house home villa renovation addition build residential',
      x: 'Custom homes, renovations and additions with attention to workmanship and finish.' },
    { t: 'Commercial Construction', u: '/imran-kabeer/#services',
      k: 'office shop plaza industrial commercial building',
      x: 'Offices, shops, commercial spaces and industrial facilities.' },
    { t: 'Project Management', u: '/imran-kabeer/#services',
      k: 'supervision planning quality control cost management handover',
      x: 'Planning, site supervision, coordination, quality control and cost management.' },
    { t: 'Sustainable Building', u: '/imran-kabeer/#services',
      k: 'eco green energy efficient materials sustainable',
      x: 'Eco-friendly materials and energy-efficient approaches where practical.' },

    { t: 'Interior Design & Space Planning', u: '/jabran-kabeer/#services',
      k: 'layout design finishes room planning decor',
      x: 'Layouts and finishes planned around how each room will actually be used.' },
    { t: 'Custom Woodwork & Furniture', u: '/jabran-kabeer/#services',
      k: 'wood furniture carpentry bespoke made to measure',
      x: 'In-house woodwork for custom furniture, built to the exact dimensions of the space.' },
    { t: 'Kitchens & Wardrobes', u: '/jabran-kabeer/#services',
      k: 'kitchen wardrobe cabinet closet storage fitted',
      x: 'Fitted kitchens and wardrobes designed for storage, workflow and finish quality.' },
    { t: 'Office Interiors', u: '/jabran-kabeer/#services',
      k: 'office workspace fit-out fitout interior',
      x: 'Workspace interiors and finishing built for practicality as much as appearance.' },

    { t: 'Our Projects', u: '/#projects', k: 'portfolio work dha grand hayat house plaza',
      x: 'Selected residential, commercial, civil and interior projects.' },
    { t: 'How We Work', u: '/#process', k: 'process steps plan build handover understand',
      x: 'From the first conversation to handover.' },
    { t: 'Frequently Asked Questions', u: '/#faq', k: 'faq questions quote areas served',
      x: 'Project types, areas served, planning to completion and how to request a quotation.' },
    { t: 'Request a Quote', u: '/#quote', k: 'quote quotation estimate price enquiry form',
      x: 'Send your project details by WhatsApp or email.' },
    { t: 'Contact Zevston', u: '/#contact', k: 'contact phone call email whatsapp address location dha phase 5 lahore',
      x: 'DHA Phase 5, Lahore. Phone 0333 4434464 and 0322 5377072. Email contact@zevston.com.' }
  ];

  /* ---------- helpers ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- footer year ---------- */
  $$('.js-year').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- mobile nav ---------- */
  var header = $('#site-header');
  var menuBtn = $('#menu-btn');
  function closeMenu() {
    if (!header || !menuBtn) return;
    header.classList.remove('mobile-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.textContent = 'Menu';
  }
  if (menuBtn && header) {
    menuBtn.addEventListener('click', function () {
      var open = header.classList.toggle('mobile-open');
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.textContent = open ? 'Close' : 'Menu';
    });
    $$('#main-nav a').forEach(function (a) { a.addEventListener('click', closeMenu); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
    window.addEventListener('resize', function () { if (window.innerWidth > 1000) closeMenu(); });
  }

  /* ---------- FAQ accordion ---------- */
  $$('.faq-item').forEach(function (item, i) {
    var btn = $('.faq-q', item), ans = $('.faq-a', item);
    if (!btn || !ans) return;
    var id = 'faq-a-' + i;
    ans.id = id;
    btn.setAttribute('aria-controls', id);
    btn.addEventListener('click', function () {
      var wasOpen = item.classList.contains('open');
      $$('.faq-item.open').forEach(function (o) {
        o.classList.remove('open');
        $('.faq-q', o).setAttribute('aria-expanded', 'false');
        $('.faq-a', o).style.maxHeight = null;
      });
      if (!wasOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
        ans.style.maxHeight = ans.scrollHeight + 'px';
      }
    });
  });
  window.addEventListener('resize', function () {
    $$('.faq-item.open .faq-a').forEach(function (a) { a.style.maxHeight = a.scrollHeight + 'px'; });
  });

  /* ---------- Site search ---------- */
  var overlay = $('#search-overlay');
  if (overlay) {
    var input = $('#search-input'), list = $('#search-results'), hint = $('#search-hint'),
        gBtn = $('#search-google'), chips = $('#search-chips'), closeBtn = $('#search-close');
    var lastFocus = null, results = [], active = -1;

    function googleUrl(q) {
      return 'https://www.google.com/search?q=' + encodeURIComponent('site:' + CONFIG.domain + (q ? ' ' + q : ''));
    }

    function run(q) {
      var tokens = q.toLowerCase().replace(/[^\w\s\u0600-\u06FF-]/g, ' ').split(/\s+/).filter(Boolean);
      if (!tokens.length) return [];
      function scoreAll(requireAll) {
        var out = [];
        INDEX.forEach(function (it) {
          var t = it.t.toLowerCase(), k = it.k.toLowerCase(), x = it.x.toLowerCase(), s = 0, miss = 0;
          tokens.forEach(function (tok) {
            var h = 0;
            if (t.indexOf(tok) > -1) h += 5;
            if (k.indexOf(tok) > -1) h += 3;
            if (x.indexOf(tok) > -1) h += 1;
            if (!h) miss++;
            s += h;
          });
          if (s > 0 && (!requireAll || miss === 0)) out.push({ it: it, s: s });
        });
        out.sort(function (a, b) { return b.s - a.s; });
        return out.map(function (r) { return r.it; });
      }
      var res = scoreAll(true);
      return res.length ? res : scoreAll(false);
    }

    function render(q) {
      q = q.trim();
      active = -1;
      gBtn.href = googleUrl(q);
      gBtn.textContent = q ? 'Search Google for “' + q + '”' : 'Search ' + CONFIG.domain + ' on Google';
      if (!q) {
        results = []; list.innerHTML = '';
        chips.hidden = false; hint.hidden = false; hint.textContent = 'Try a name, service or topic.';
        return;
      }
      chips.hidden = true;
      results = run(q).slice(0, 8);
      if (!results.length) {
        list.innerHTML = '<li class="search-empty">No matches on this site. Try a different word, or search Google.</li>';
        hint.hidden = true;
        return;
      }
      hint.hidden = false;
      hint.textContent = results.length + ' result' + (results.length > 1 ? 's' : '');
      list.innerHTML = results.map(function (r, i) {
        return '<li><a href="' + esc(r.u) + '" data-i="' + i + '"><span class="sr-title">' + esc(r.t) +
          '</span><span class="sr-text">' + esc(r.x) + '</span><span class="sr-url">' + esc(CONFIG.domain + r.u) + '</span></a></li>';
      }).join('');
    }

    function setActive(n) {
      var links = $$('#search-results a');
      if (!links.length) return;
      active = (n + links.length) % links.length;
      links.forEach(function (a, i) { a.classList.toggle('active', i === active); });
      links[active].scrollIntoView({ block: 'nearest' });
    }

    function openSearch() {
      lastFocus = document.activeElement;
      overlay.classList.add('open');
      document.body.classList.add('no-scroll');
      closeMenu();
      input.value = '';
      render('');
      setTimeout(function () { input.focus(); }, 30);
    }
    function closeSearch() {
      overlay.classList.remove('open');
      document.body.classList.remove('no-scroll');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    $$('.js-search-open').forEach(function (b) { b.addEventListener('click', openSearch); });
    closeBtn.addEventListener('click', closeSearch);
    overlay.addEventListener('mousedown', function (e) { if (e.target === overlay) closeSearch(); });
    list.addEventListener('click', function () { setTimeout(closeSearch, 0); });
    input.addEventListener('input', function () { render(input.value); });
    $$('button', chips).forEach(function (b) {
      b.addEventListener('click', function () { input.value = b.getAttribute('data-q'); render(input.value); input.focus(); });
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(active + 1); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(active < 0 ? -1 : active - 1); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        var links = $$('#search-results a');
        if (links.length) { var target = links[active > -1 ? active : 0]; closeSearch(); window.location.href = target.href; }
        else if (input.value.trim()) { window.open(googleUrl(input.value.trim()), '_blank', 'noopener'); }
      }
    });

    document.addEventListener('keydown', function (e) {
      var tag = (document.activeElement && document.activeElement.tagName) || '';
      var typing = /INPUT|TEXTAREA|SELECT/.test(tag);
      if (e.key === 'Escape' && overlay.classList.contains('open')) { closeSearch(); return; }
      if (!overlay.classList.contains('open') && ((e.key === '/' && !typing) || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k'))) {
        e.preventDefault(); openSearch();
      }
      // keep keyboard focus inside the dialog
      if (e.key === 'Tab' && overlay.classList.contains('open')) {
        var f = $$('input, button, a[href]', overlay).filter(function (n) { return n.offsetParent !== null; });
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---------- Quote form: opens WhatsApp (default) or email with the details filled in ---------- */
  var form = $('#quote-form');
  if (form) {
    function message() {
      var g = function (n) { return (form.elements[n] && form.elements[n].value || '').trim(); };
      var lines = ['Hello Zevston, I would like to request a quote.', ''];
      [['Name', 'name'], ['Phone', 'phone'], ['Service', 'service'], ['Location', 'location']].forEach(function (p) {
        if (g(p[1])) lines.push(p[0] + ': ' + g(p[1]));
      });
      if (g('details')) { lines.push('', 'Project details:', g('details')); }
      return lines.join('\n');
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      window.open('https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(message()), '_blank', 'noopener');
    });
    var mailBtn = $('#quote-mail', form);
    if (mailBtn) mailBtn.addEventListener('click', function () {
      if (!form.reportValidity()) return;
      window.location.href = 'mailto:' + CONFIG.email + '?subject=' + encodeURIComponent('Zevston Request for Quote') +
        '&body=' + encodeURIComponent(message());
    });
  }
})();
