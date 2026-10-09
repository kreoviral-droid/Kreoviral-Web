/* KREO VIRAL — teléfono dinámico por país (copia revisada) */
(function () {
  'use strict';
  var RULES = {
    PE:{country:'Perú',prefix:'+51',length:9,example:'+51 912 345 678'},
    MX:{country:'México',prefix:'+52',length:10,example:'+52 55 1234 5678'},
    ES:{country:'España',prefix:'+34',length:9,example:'+34 600 123 456'},
    CO:{country:'Colombia',prefix:'+57',length:10,example:'+57 300 123 4567'},
    AR:{country:'Argentina',prefix:'+54',length:10,example:'+54 11 1234 5678'},
    CL:{country:'Chile',prefix:'+56',length:9,example:'+56 9 1234 5678'},
    US:{country:'Estados Unidos',prefix:'+1',length:10,example:'+1 202 555 0123'},
    EC:{country:'Ecuador',prefix:'+593',length:9,example:'+593 99 123 4567'},
    BO:{country:'Bolivia',prefix:'+591',length:8,example:'+591 712 34567'},
    PY:{country:'Paraguay',prefix:'+595',length:9,example:'+595 981 123 456'},
    UY:{country:'Uruguay',prefix:'+598',length:8,example:'+598 94 123 456'},
    VE:{country:'Venezuela',prefix:'+58',length:10,example:'+58 412 123 4567'},
    CR:{country:'Costa Rica',prefix:'+506',length:8,example:'+506 8123 4567'},
    PA:{country:'Panamá',prefix:'+507',length:8,example:'+507 6123 4567'},
    GT:{country:'Guatemala',prefix:'+502',length:8,example:'+502 5123 4567'},
    HN:{country:'Honduras',prefix:'+504',length:8,example:'+504 9123 4567'},
    NI:{country:'Nicaragua',prefix:'+505',length:8,example:'+505 8123 4567'},
    SV:{country:'El Salvador',prefix:'+503',length:8,example:'+503 7123 4567'},
    DO:{country:'República Dominicana',prefix:'+1',length:10,example:'+1 809 123 4567'},
    CU:{country:'Cuba',prefix:'+53',length:8,example:'+53 5123 4567'}
  };
  var fallback = RULES.PE;
  function localDigits(value, rule) {
    var digits = String(value || '').replace(/\D/g, '');
    var prefix = rule.prefix.replace('+', '');
    if (digits.indexOf(prefix) === 0) digits = digits.slice(prefix.length);
    return digits;
  }
  function apply(input, rule) {
    window.KV_PHONE_RULE = rule;
    input.placeholder = 'Ej: ' + rule.example;
    input.setAttribute('aria-describedby', 'f-wa-help');
    function validate() {
      var digits = localDigits(input.value, rule);
      if (digits && digits.length !== rule.length) {
        input.setCustomValidity('El número debe tener ' + rule.length + ' dígitos para ' + rule.country + '.');
      } else input.setCustomValidity('');
    }
    input.addEventListener('input', validate);
    validate();
  }
  function start() {
    var input = document.querySelector('#f-wa, input[type="tel"]');
    if (!input) return;
    apply(input, fallback);
    fetch('https://ipapi.co/json/', {headers:{Accept:'application/json'}})
      .then(function (response) { if (!response.ok) throw new Error('country lookup'); return response.json(); })
      .then(function (data) { apply(input, RULES[data.country_code] || fallback); })
      .catch(function () { apply(input, fallback); });
  }
  document.addEventListener('DOMContentLoaded', start);
}());
