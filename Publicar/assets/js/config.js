/* ════════════════════════════════════════════════════════════
   KREO VIRAL — CONFIGURACIÓN DEL SITIO
   Edita SOLO este archivo. Los cambios se aplican en todas las páginas.
   ════════════════════════════════════════════════════════════ */
window.KV_CONFIG = {

  /* ── Contacto ─────────────────────────────────────────────── */
  whatsapp:  '51944718584',          // solo dígitos, con código de país
  instagram: 'kreo.viral',           // sin @
  tiktok:    '',                     // ej: 'kreo.viral' (vacío = se oculta el enlace)
  email:     'kreoviral1@gmail.com',

  /* ── Datos legales del titular ──────────────────────────────── */
  legal: {
    razonSocial: 'KREO VIRAL / Mijhail Maqui Barreto',
    domicilio:   'Jr. Hualcan, Lima, Perú',
    emailLegal:  'kreoviral1@gmail.com',
    actualizado: '2 de octubre de 2026'
  },

  /* ── Privacidad y cumplimiento ─────────────────────────────── */
  ageMinimum: 18,
  sessionRecording: false,
  maskSessionFields: true,
  marketing: {
    unsubscribeUrl: 'mailto:kreoviral1@gmail.com?subject=Baja%20de%20comunicaciones',
    postalAddress: 'Jr. Hualcan, Lima, Perú'
  },
  subscription: {
    enabled: false,
    price: '',
    currency: '',
    interval: '',
    renewalTerms: '',
    cancellationTerms: ''
  },

  /* ── Recepción de formularios ────────────────────────────────
     Pega aquí la URL de tu formulario de Formspree, Getform, Make
     o un webhook de n8n/Zapier. Si lo dejas vacío, las aplicaciones
     solo se envían por WhatsApp (puedes perder leads).
     Ej: 'https://formspree.io/f/abcdwxyz'                         */
  formEndpoint:        '',
  reclamosEndpoint:    '',   // puede ser el mismo u otro formulario

  /* ── Medición (se cargan solo si el visitante acepta cookies) ─ */
  ga4Id:       '',   // ej: 'G-XXXXXXXXXX'
  metaPixelId: '',   // ej: '123456789012345'
  tiktokPixelId: '',

  /* ── Casos de clientes ───────────────────────────────────────
     Cuando tengas un caso, súbelo aquí y aparece en la web solo.
     Con la lista vacía [] se muestran los dos marcos "Próximamente".
     Imagen recomendada: 1200×900 px, en materiales/casos/
     Publica casos solo con autorización escrita del cliente.      */
  casos: [
    /*
    {
      nombre:   'Clínica Dental Sonríe',
      sector:   'Salud · Negocio físico',
      antes:    '1.200 seguidores, 0 citas desde Instagram',
      despues:  '+38 citas agendadas por DM en 60 días',
      metrica:  '+38',
      metricaTexto: 'citas en 60 días',
      imagen:   'materiales/casos/clinica-sonrie.jpg',
      cita:     'Antes publicábamos por publicar. Ahora cada video nos trae pacientes.'
    },
    */
  ],

  /* ── Testimonios ─────────────────────────────────────────────
     Con la lista vacía [] la sección entera no se muestra.
     Usa frases reales y pide permiso antes de publicar el nombre. */
  testimonios: [
    /*
    { texto: 'En dos meses pasamos de 3 a 14 clientes al mes sin gastar en anuncios.',
      autor: 'Nombre Apellido',
      negocio: 'Nombre del negocio · Lima' },
    */
  ]
};
