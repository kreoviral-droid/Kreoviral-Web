/* KREO VIRAL — formularios (aplicación por pasos y libro de reclamaciones) */
(function () {
  'use strict';
  var C = window.KV_CONFIG || {};
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Validación de teléfono internacional ─────────────────── */
  var PHONE = {
    '51': ['Perú', 9, '912 345 678'], '52': ['México', 10, '55 1234 5678'], '54': ['Argentina', 10, '11 2345 6789'],
    '56': ['Chile', 9, '9 1234 5678'], '57': ['Colombia', 10, '320 123 4567'], '58': ['Venezuela', 10, '412 123 4567'],
    '591': ['Bolivia', 8, '7123 4567'], '593': ['Ecuador', 9, '99 123 4567'], '595': ['Paraguay', 9, '981 123 456'],
    '598': ['Uruguay', 8, '94 123 456'], '506': ['Costa Rica', 8, '8312 3456'], '507': ['Panamá', 8, '6123 4567'],
    '502': ['Guatemala', 8, '5123 4567'], '503': ['El Salvador', 8, '7123 4567'], '504': ['Honduras', 8, '9123 4567'],
    '505': ['Nicaragua', 8, '8123 4567'], '34': ['España', 9, '612 345 678'], '1': ['EE. UU./Canadá', 10, '555 123 4567'],
    '55': ['Brasil', 11, '11 91234 5678'], '53': ['Cuba', 8, '5123 4567'], '1809': ['Rep. Dominicana', 7, '123 4567']
  };
  function checkPhone(raw) {
    var dynamic = window.KV_PHONE_RULE;
    if (dynamic) {
      var digits = (raw || '').replace(/\D/g, ''), prefix = dynamic.prefix.replace('+', '');
      if (digits.indexOf(prefix) === 0) digits = digits.slice(prefix.length);
      if (!digits) return 'Escribe tu WhatsApp con código de país.';
      return digits.length === dynamic.length ? '' : 'El número debe tener ' + dynamic.length + ' dígitos para ' + dynamic.country + '.';
    }
    var v = (raw || '').replace(/[\s\-().]/g, '');
    if (!v) return 'Escribe tu WhatsApp con código de país.';
    if (v.indexOf('+') === 0) v = v.slice(1); else if (v.indexOf('00') === 0) v = v.slice(2);
    else return 'Empieza con + y el código de tu país. Ej: +51 912 345 678';
    if (!/^\d+$/.test(v)) return 'El número solo puede tener dígitos.';
    var codes = Object.keys(PHONE).sort(function (a, b) { return b.length - a.length; });
    for (var i = 0; i < codes.length; i++) {
      if (v.indexOf(codes[i]) === 0) {
        var r = PHONE[codes[i]], local = v.slice(codes[i].length);
        return local.length === r[1] ? '' : r[0] + ' (+' + codes[i] + ') lleva ' + r[1] + ' dígitos. Ej: +' + codes[i] + ' ' + r[2];
      }
    }
    return v.length >= 8 && v.length <= 15 ? '' : 'Revisa el código de país y el número.';
  }
  var checks = {
    phone: checkPhone,
    social: function (v) { return /^@[\w.\-]{2,}$/.test(v) || /^https?:\/\/\S+\.\S+/.test(v) || /^[\w\-]+\.[\w.\-]{2,}/.test(v) ? '' : 'Escribe tu @usuario o el enlace de tu web.'; },
    email: function (v) { return !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Revisa tu correo, parece incompleto.'; },
    name: function (v) { return v.trim().length >= 2 ? '' : 'Escribe tu nombre.'; },
    goal: function (v) { return v.trim().length >= 15 ? '' : 'Cuéntanos un poco más (mínimo una frase).'; },
    long: function (v) { return v.trim().length >= 20 ? '' : 'Describe el detalle con al menos 20 caracteres.'; },
    doc: function (v) { return /^[A-Za-z0-9\-]{6,15}$/.test(v.trim()) ? '' : 'Revisa el número de documento.'; },
    required: function (v) { return v.trim() ? '' : 'Este campo es obligatorio.'; }
  };

  function fieldOf(el) { return el.closest('.field'); }
  function setErr(field, msg) {
    if (!field) return;
    field.classList.toggle('has-error', !!msg);
    var e = field.querySelector('.err'); if (e && msg) e.textContent = msg;
    field.querySelectorAll('input,textarea,select').forEach(function (i) { i.setAttribute('aria-invalid', msg ? 'true' : 'false'); });
  }
  function validateScope(scope) {
    var first = null;
    scope.querySelectorAll('[data-check]').forEach(function (el) {
      if (el.closest('[hidden]')) return;
      var msg = '';
      if (el.type === 'radio') {
        var name = el.name;
        if (el !== scope.querySelector('input[name="' + name + '"]')) return;
        msg = scope.querySelector('input[name="' + name + '"]:checked') ? '' : (el.getAttribute('data-msg') || 'Elige una opción.');
      } else if (el.type === 'checkbox') {
        msg = el.checked ? '' : (el.getAttribute('data-msg') || 'Necesitamos tu aceptación para continuar.');
      } else {
        var kind = el.getAttribute('data-check'), val = el.value || '';
        if (!val.trim() && el.required) msg = el.getAttribute('data-msg') || 'Este campo es obligatorio.';
        else if (val.trim() && checks[kind]) msg = checks[kind](val);
      }
      setErr(fieldOf(el), msg);
      if (msg && !first) first = el;
    });
    if (first) {
      var f = fieldOf(first);
      if (f && f.scrollIntoView) f.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      first.focus({ preventScroll: true });
    }
    return !first;
  }
  function liveClear(form) {
    form.addEventListener('input', function (e) {
      var f = fieldOf(e.target); if (f && f.classList.contains('has-error')) {
        var kind = e.target.getAttribute('data-check');
        var msg = (e.target.type === 'radio' || e.target.type === 'checkbox') ? '' : (checks[kind] ? checks[kind](e.target.value || '') : '');
        if (!msg) setErr(f, '');
      }
    });
    form.addEventListener('change', function (e) {
      if (e.target.type === 'radio' || e.target.type === 'checkbox') setErr(fieldOf(e.target), '');
    });
  }
  function serialize(form) {
    var out = {};
    new FormData(form).forEach(function (v, k) { out[k] = typeof v === 'string' ? v.trim() : v; });
    return out;
  }
  function send(endpoint, data) {
    if (!endpoint) return Promise.resolve(false);
    return fetch(endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(data)
    }).then(function (r) { return r.ok; }).catch(function () { return false; });
  }

  /* ════════════ APLICACIÓN A CONSULTORÍA ════════════ */
  var app = document.getElementById('appForm');
  if (app) {
    var steps = Array.prototype.slice.call(app.querySelectorAll('.fstep'));
    var bar = document.getElementById('progBar'), lbl = document.getElementById('progLabel');
    var back = document.getElementById('btnBack'), next = document.getElementById('btnNext');
    var cur = 0;
    liveClear(app);

    function show(i) {
      cur = i;
      steps.forEach(function (s, k) { s.classList.toggle('is-active', k === i); s.setAttribute('aria-hidden', k !== i); });
      bar.style.width = ((i + 1) / steps.length * 100) + '%';
      lbl.textContent = 'Paso ' + (i + 1) + ' de ' + steps.length;
      back.hidden = i === 0;
      next.firstChild.nodeValue = i === steps.length - 1 ? 'Enviar aplicación ' : 'Continuar ';
      var h = steps[i].querySelector('.step-title');
      if (h && i > 0) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
      var top = app.getBoundingClientRect().top + window.scrollY - 110;
      if (window.scrollY > top) window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
    }
    back.addEventListener('click', function () { if (cur > 0) show(cur - 1); });
    app.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA' && e.target.type !== 'submit') { e.preventDefault(); next.click(); }
    });

    app.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateScope(steps[cur])) return;
      if (cur < steps.length - 1) { show(cur + 1); return; }
      if (app.querySelector('.hp input').value) return; // bot

      var d = serialize(app);
      delete d.website;
      d.origen = 'kreoviral.com/agendar';
      d.fecha = new Date().toISOString();

      var msg = [
        'Hola KREO VIRAL, soy ' + d.nombre + '. Quiero aplicar a la consultoría 1 a 1.',
        '',
        '• Negocio: ' + d.negocio,
        '• Cuenta / web: ' + d.red,
        '• Problema principal: ' + d.problema,
        '• Facturación mensual: ' + d.facturacion,
        '• Inversión disponible: ' + d.inversion,
        '• Decisión: ' + d.decision,
        '',
        'Objetivo en 6–12 meses:',
        d.objetivo
      ].join('\n');
      var wa = window.KV_WA(msg);

      next.disabled = true; next.firstChild.nodeValue = 'Enviando… ';
      send(C.formEndpoint, d).then(function (ok) {
        var done = document.getElementById('appDone');
        document.getElementById('doneName').textContent = d.nombre.split(' ')[0];
        document.getElementById('doneWa').href = wa;
        document.getElementById('doneSent').hidden = !ok;
        document.getElementById('doneManual').hidden = ok;
        app.hidden = true; done.hidden = false;
        done.querySelector('h2').setAttribute('tabindex', '-1'); done.querySelector('h2').focus();
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
        if (window.KV_track) window.KV_track('generate_lead', { inversion: d.inversion, negocio: d.negocio });
      });
    });
    show(0);
  }

  /* ════════════ LIBRO DE RECLAMACIONES ════════════ */
  var lr = document.getElementById('lrForm');
  if (lr) {
    liveClear(lr);
    var minor = document.getElementById('lrMinor'), guard = document.getElementById('lrGuardian');
    if (minor) minor.addEventListener('change', function () {
      guard.hidden = !minor.checked;
      guard.querySelectorAll('input').forEach(function (i) { i.required = minor.checked; });
    });
    var today = new Date();
    var dateEl = document.getElementById('lrDate');
    if (dateEl) dateEl.textContent = today.toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' });

    lr.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateScope(lr)) return;
      if (lr.querySelector('.hp input').value) return;
      var d = serialize(lr); delete d.website;
      var code = 'LR-' + today.getFullYear() + '-' + String(Date.now()).slice(-6);
      d.codigo = code; d.fecha = today.toISOString();
      d.proveedor = (C.legal && C.legal.razonSocial) || 'KREO VIRAL';

      var btn = lr.querySelector('[type=submit]'); btn.disabled = true; btn.firstChild.nodeValue = 'Registrando… ';
      send(C.reclamosEndpoint || C.formEndpoint, d).then(function (ok) {
        var out = document.getElementById('lrDone');
        document.getElementById('lrCode').textContent = code;
        var rows = [
          ['Código', code], ['Fecha', today.toLocaleString('es-PE')], ['Proveedor', d.proveedor],
          ['Consumidor', d.nombres], ['Documento', d.tipo_doc + ' ' + d.num_doc], ['Domicilio', d.domicilio],
          ['Teléfono', d.telefono], ['Correo', d.email], d.apoderado ? ['Padre, madre o apoderado', d.apoderado] : null,
          ['Bien contratado', d.bien], ['Monto reclamado', d.monto ? 'USD ' + d.monto : '—'], ['Descripción', d.descripcion],
          ['Tipo', d.tipo], ['Detalle', d.detalle], ['Pedido', d.pedido]
        ].filter(Boolean);
        document.getElementById('lrSummary').innerHTML = rows.map(function (r) {
          return '<tr><th scope="row">' + r[0] + '</th><td>' + String(r[1] || '—').replace(/[<>&]/g, function (c) { return { '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]; }) + '</td></tr>';
        }).join('');
        var body = rows.map(function (r) { return r[0] + ': ' + r[1]; }).join('\n');
        document.getElementById('lrMail').href = 'mailto:' + (C.legal && C.legal.emailLegal) + '?subject=' +
          encodeURIComponent('Libro de Reclamaciones ' + code) + '&body=' + encodeURIComponent(body);
        document.getElementById('lrSent').hidden = !ok;
        document.getElementById('lrManual').hidden = ok;
        lr.hidden = true; out.hidden = false;
        out.querySelector('h2').setAttribute('tabindex', '-1'); out.querySelector('h2').focus();
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      });
    });
    var pr = document.getElementById('lrPrint'); if (pr) pr.addEventListener('click', function () { window.print(); });
  }
})();
