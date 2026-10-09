/* ════════════════════════════════════════════════════════════
   KREO VIRAL — comportamiento compartido          v2.0.0
   No necesitas editar este archivo: todo lo configurable está
   en assets/js/config.js
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var C = window.KV_CONFIG || {};
  var doc = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  doc.classList.add('js');

  /* ── Protección de sesiones y campos ─────────────────────────
     No se inicia ninguna grabación. Si en el futuro se añade una herramienta,
     estas marcas le indican que no debe capturar el contenido de los campos. */
  window.__KV_SESSION_RECORDING__ = false;
  if (C.sessionRecording === false || C.maskSessionFields !== false) {
    document.querySelectorAll('input, textarea, select').forEach(function (field) {
      field.setAttribute('data-hj-suppress', '');
      field.setAttribute('data-private', '');
      field.setAttribute('data-recording-ignore', '');
    });
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ── 1. Enlaces y datos desde config ─────────────────────── */
  var waBase = 'https://wa.me/' + (C.whatsapp || '');
  window.KV_WA = function (text) {
    return waBase + (text ? '?text=' + encodeURIComponent(text) : '');
  };
  document.querySelectorAll('[data-wa]').forEach(function (a) {
    a.href = window.KV_WA(a.getAttribute('data-wa') || 'Hola KREO VIRAL, quiero más información.');
    a.target = '_blank'; a.rel = 'noopener';
  });
  document.querySelectorAll('[data-ig]').forEach(function (a) {
    a.href = 'https://instagram.com/' + C.instagram; a.target = '_blank'; a.rel = 'noopener';
  });
  document.querySelectorAll('[data-tt]').forEach(function (a) {
    if (!C.tiktok) { a.remove(); return; }
    a.href = 'https://www.tiktok.com/@' + C.tiktok; a.target = '_blank'; a.rel = 'noopener';
  });
  document.querySelectorAll('[data-mail]').forEach(function (a) {
    var m = a.getAttribute('data-mail') === 'legal' ? (C.legal && C.legal.emailLegal) : C.email;
    a.href = 'mailto:' + m; if (!a.textContent.trim()) a.textContent = m;
  });
  document.querySelectorAll('[data-legal]').forEach(function (el) {
    var k = el.getAttribute('data-legal');
    if (C.legal && C.legal[k]) el.textContent = C.legal[k];
  });
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  document.querySelectorAll('[data-phone-text]').forEach(function (el) {
    if (!C.whatsapp) return;
    var n = String(C.whatsapp);
    el.textContent = '+' + n.slice(0, 2) + ' ' + n.slice(2, 5) + ' ' + n.slice(5, 8) + ' ' + n.slice(8);
  });

  /* ── 2. Entrada del hero (un único momento orquestado) ─────
     Doble red: requestAnimationFrame no se dispara en pestañas en
     segundo plano, así que un temporizador garantiza que el hero
     siempre acabe visible. */
  var heroShown = false;
  function showHero() { if (heroShown) return; heroShown = true; doc.classList.add('is-loaded'); }
  requestAnimationFrame(function () { setTimeout(showHero, 60); });
  setTimeout(showHero, 1200);

  /* ── 3. Navegación: fondo, barra móvil, menú ─────────────── */
  var nav = document.querySelector('.nav');
  var mbar = document.querySelector('.mbar');
  var hero = document.querySelector('.hero');
  var sprog = document.querySelector('.sprog i');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    if (nav) nav.classList.toggle('is-scrolled', y > 24);
    if (mbar) {
      var limit = hero ? hero.offsetHeight * 0.6 : 400;
      var nearEnd = (window.innerHeight + y) >= (document.body.scrollHeight - 40);
      mbar.classList.toggle('is-on', y > limit && !nearEnd);
    }
    if (sprog) {
      var docH = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docH > 0 ? Math.min(100, Math.max(0, (y / docH) * 100)) : 0;
      if (window.matchMedia('(min-width:1101px)').matches) { sprog.style.height = pct + '%'; sprog.style.width = '100%'; }
      else { sprog.style.width = pct + '%'; sprog.style.height = '100%'; }
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  var burger = document.getElementById('burger');
  var menu = document.getElementById('mobileMenu');
  function setMenu(open) {
    doc.classList.toggle('menu-open', open);
    if (burger) { burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú'); }
    if (menu) { menu.setAttribute('aria-hidden', !open); menu.inert = !open; }
  }
  if (burger && menu) {
    menu.inert = true;
    burger.addEventListener('click', function () { setMenu(!doc.classList.contains('menu-open')); });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* ── 4. Revelado al entrar en pantalla ───────────────────── */
  var revs = document.querySelectorAll('.rv');
  if (revs.length) {
    if (!hasIO || reduce) {
      revs.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var rio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('is-in'); rio.unobserve(e.target); }
        });
      }, { threshold: 0.06, rootMargin: '0px 0px -60px 0px' });
      revs.forEach(function (el) { rio.observe(el); });
      /* red de seguridad: si algo falla, nada queda invisible */
      setTimeout(function () { revs.forEach(function (el) { el.classList.add('is-in'); }); }, 4000);
    }
  }

  /* ── 5. Enlace activo en la navegación ───────────────────── */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));
  if (navLinks.length && hasIO) {
    var targets = navLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.toggle('is-current', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    targets.forEach(function (t) { sio.observe(t); });
  }

  /* ── 6. Contadores de métricas ───────────────────────────── */
  function fmtNum(v, dec) {
    return v.toLocaleString('es-PE', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  }
  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) return;
    var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
    var pre = el.getAttribute('data-prefix') || '';
    var suf = el.getAttribute('data-suffix') || '';
    var unit = el.getAttribute('data-unit') || '';
    var dur = 1400, t0 = null;
    function frame(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.innerHTML = pre + fmtNum(target * eased, dec) + suf + (unit ? '<span class="u">' + esc(unit) + '</span>' : '');
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && hasIO && !reduce) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCounter(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.35 });
    counters.forEach(function (el) { cio.observe(el); });
  }

  /* ── 7. Fotos opcionales: aparecen solo si existe el archivo ── */
  /* a) marcos con placeholder (.img-frame[data-img]) */
  document.querySelectorAll('.img-frame[data-img]').forEach(function (frame) {
    var src = frame.getAttribute('data-img');
    var img = new Image();
    img.onload = function () {
      img.alt = frame.getAttribute('data-alt') || '';
      img.loading = 'lazy'; img.decoding = 'async';
      frame.appendChild(img);
      frame.classList.add('has-img');
      var lbl = frame.querySelector('.img-label');
      if (lbl) lbl.hidden = true;
    };
    img.src = src;
  });
  /* b) figuras que sencillamente no existen hasta que hay foto */
  document.querySelectorAll('[data-optional-src]').forEach(function (fig) {
    var src = fig.getAttribute('data-optional-src');
    var img = new Image();
    img.onload = function () {
      img.alt = fig.getAttribute('data-alt') || '';
      img.loading = 'lazy'; img.decoding = 'async';
      img.width = img.naturalWidth; img.height = img.naturalHeight;
      fig.appendChild(img); fig.hidden = false;
      var host = fig.closest('[data-photo-host]');
      if (host) host.classList.add('has-photo');
    };
    img.src = src;
  });

  /* ── 8. Casos de clientes desde config ───────────────────── */
  var casesHost = document.getElementById('cases');
  if (casesHost && Array.isArray(C.casos) && C.casos.length) {
    casesHost.innerHTML = C.casos.map(function (k) {
      return '<article class="case">' +
        (k.imagen ? '<img src="' + esc(k.imagen) + '" alt="Resultados de ' + esc(k.nombre) + '" loading="lazy" width="1200" height="900">' : '') +
        '<div class="case-body"><div class="case-top"><div><span class="case-sector">' + esc(k.sector) + '</span>' +
        '<h3 class="h3" style="margin-top:.3rem">' + esc(k.nombre) + '</h3></div>' +
        (k.metrica ? '<div class="case-metric"><b>' + esc(k.metrica) + '</b><span>' + esc(k.metricaTexto) + '</span></div>' : '') +
        '</div><dl class="case-ba"><div><dt>Antes</dt><dd>' + esc(k.antes) + '</dd></div><div><dt>Después</dt><dd>' + esc(k.despues) + '</dd></div></dl>' +
        (k.cita ? '<blockquote>&ldquo;' + esc(k.cita) + '&rdquo;</blockquote>' : '') +
        '</div></article>';
    }).join('');
    casesHost.hidden = false;
    var ch = document.getElementById('casesHead'); if (ch) ch.hidden = false;
    var slots = document.getElementById('caseSlots'); if (slots) slots.hidden = true;
    var slotNote = document.getElementById('caseSlotsNote'); if (slotNote) slotNote.hidden = true;
  }

  /* ── 9. Testimonios desde config ─────────────────────────── */
  var quotesHost = document.getElementById('quotes');
  if (quotesHost && Array.isArray(C.testimonios) && C.testimonios.length) {
    quotesHost.innerHTML = C.testimonios.map(function (t) {
      return '<figure class="quote"><blockquote><p>' + esc(t.texto) + '</p></blockquote>' +
        '<footer><cite>' + esc(t.autor) + '</cite><small>' + esc(t.negocio) + '</small></footer></figure>';
    }).join('');
    var qs = document.getElementById('testimonios');
    if (qs) qs.hidden = false;
  }

  /* ── 10. Calculadora: atención → conversaciones → clientes → $ ── */
  var calc = document.getElementById('calc');
  if (calc) {
    var VIEWS = [10000, 25000, 50000, 75000, 100000, 150000, 250000, 400000, 600000, 1000000];
    var RATE_DM = 0.002;   // 0,2 % de las visualizaciones escribe por DM
    var RATE_CLOSE = 0.10; // 10 % de esas conversaciones compra
    var rv = document.getElementById('rViews'), rt = document.getElementById('rTicket');
    var ov = document.getElementById('oViews'), ot = document.getElementById('oTicket');
    var fV = document.getElementById('fViews'), fC = document.getElementById('fConv'),
        fK = document.getElementById('fClients'), fM = document.getElementById('fMoney');
    var NB = ' ';
    var group = function (n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };
    var money = function (n) { return 'US$' + NB + group(n); };
    var short = function (n) {
      return n >= 1e6 ? (n / 1e6).toLocaleString('es-PE', { maximumFractionDigits: 1 }) + NB + 'M'
           : n >= 1e3 ? Math.round(n / 1e3) + NB + 'mil' : String(n);
    };
    function pct(r) { return ((r.value - r.min) / (r.max - r.min) * 100) + '%'; }
    function render() {
      var views = VIEWS[+rv.value], ticket = +rt.value;
      var conv = Math.round(views * RATE_DM),
          clients = Math.max(0, Math.round(conv * RATE_CLOSE)),
          revenue = clients * ticket;
      ov.textContent = short(views); ot.textContent = money(ticket);
      rv.style.setProperty('--pct', pct(rv)); rt.style.setProperty('--pct', pct(rt));
      rv.setAttribute('aria-valuetext', group(views) + ' visualizaciones');
      rt.setAttribute('aria-valuetext', group(ticket) + ' dólares');
      var m = money(revenue);
      fV.textContent = short(views); fC.textContent = group(conv); fK.textContent = group(clients); fM.textContent = m;
      fM.classList.toggle('is-long', m.length > 10);
    }
    rv.addEventListener('input', render); rt.addEventListener('input', render); render();
  }

  /* ── 11. Consentimiento y medición ───────────────────────── */
  var hasTracking = !!(C.ga4Id || C.metaPixelId || C.tiktokPixelId);
  var KEY = 'kv_consent';
  function getConsent() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setConsent(v) { try { localStorage.setItem(KEY, v); } catch (e) {} }
  function loadScript(src) { var s = document.createElement('script'); s.async = true; s.src = src; document.head.appendChild(s); }
  function loadTracking() {
    if (C.ga4Id) {
      loadScript('https://www.googletagmanager.com/gtag/js?id=' + C.ga4Id);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { dataLayer.push(arguments); };
      gtag('js', new Date()); gtag('config', C.ga4Id, { anonymize_ip: true });
    }
    if (C.metaPixelId) {
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s) }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', C.metaPixelId); fbq('track', 'PageView');
    }
    if (C.tiktokPixelId) {
      !function (w, d, t) { w.TiktokAnalyticsObject = t; var ttq = w[t] = w[t] || []; ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie']; ttq.setAndDefer = function (t, e) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))) } }; for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]); ttq.load = function (e) { var n = 'https://analytics.tiktok.com/i18n/pixel/events.js'; ttq._i = ttq._i || {}; ttq._i[e] = []; ttq._u = n; var o = d.createElement('script'); o.async = !0; o.src = n + '?sdkid=' + e + '&lib=' + t; var a = d.getElementsByTagName('script')[0]; a.parentNode.insertBefore(o, a) }; ttq.load(C.tiktokPixelId); ttq.page(); }(window, document, 'ttq');
    }
  }
  /* Evento de conversión reutilizable (lead, reclamo, etc.) */
  window.KV_track = function (name, params) {
    try {
      if (window.gtag) gtag('event', name, params || {});
      if (window.fbq) fbq('track', name === 'generate_lead' ? 'Lead' : name, params || {});
      if (window.ttq) ttq.track(name === 'generate_lead' ? 'SubmitForm' : name, params || {});
    } catch (e) {}
  };

  var banner = document.getElementById('consent');
  if (hasTracking) {
    var state = getConsent();
    if (state === 'yes') loadTracking();
    else if (!state && banner) banner.hidden = false;
    if (banner) {
      banner.querySelector('[data-consent="yes"]').addEventListener('click', function () { setConsent('yes'); banner.hidden = true; loadTracking(); });
      banner.querySelector('[data-consent="no"]').addEventListener('click', function () { setConsent('no'); banner.hidden = true; });
    }
  }
  document.querySelectorAll('[data-reset-consent]').forEach(function (b) {
    b.addEventListener('click', function () {
      try { localStorage.removeItem(KEY); } catch (e) {}
      if (banner && hasTracking) banner.hidden = false;
      b.textContent = hasTracking ? 'Preferencias reiniciadas' : 'Este sitio no usa cookies de medición';
    });
  });

  /* ── 12. Clics a WhatsApp como evento de medición ────────── */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="https://wa.me/"]');
    if (a && window.KV_track) window.KV_track('contact_whatsapp', { origen: location.pathname });
  });
})();
