/**
 * Troilo Digital — Barre mobile sticky (Appeler + WhatsApp)
 * Visible uniquement sur mobile (≤768px). RGPD neutre.
 */
(function () {
  var PHONE = '+32492222677';
  var WA_MSG = encodeURIComponent('Bonjour, je souhaite un audit SEO gratuit pour mon activité.');

  function createBar() {
    var bar = document.createElement('div');
    bar.id = 'td-mobile-bar';
    bar.innerHTML = [
      '<style>',
      '#td-mobile-bar{',
        'display:none;position:fixed;bottom:0;left:0;right:0;z-index:9999;',
        'background:#0a0a0a;border-top:1px solid rgba(255,255,255,0.08);',
        'padding:0.6rem 1rem;gap:0.75rem;',
      '}',
      '#td-mobile-bar a{',
        'flex:1;display:flex;align-items:center;justify-content:center;gap:0.5rem;',
        'padding:0.75rem 1rem;border-radius:8px;',
        'font-family:"Satoshi",sans-serif;font-weight:700;font-size:0.95rem;',
        'text-decoration:none;transition:opacity 0.15s;',
      '}',
      '#td-mobile-bar a:active{opacity:0.8;}',
      '#td-mobile-bar .mb-call{background:#e8c547;color:#0a0a0a;}',
      '#td-mobile-bar .mb-call svg{fill:#0a0a0a;}',
      '#td-mobile-bar .mb-whatsapp{background:transparent;color:#e8c547;border:1.5px solid #e8c547;}',
      '#td-mobile-bar .mb-whatsapp svg{fill:#e8c547;}',
      '#td-mobile-bar svg{width:20px;height:20px;flex-shrink:0;}',
      '@media(max-width:768px){',
        '#td-mobile-bar{display:flex;}',
        '#td-chat-btn{bottom:5.5rem !important;}',
      '}',
      '</style>',
      '<a href="tel:' + PHONE + '" class="mb-call">',
        '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">',
          '<path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>',
        '</svg>',
        'Appeler',
      '</a>',
      '<a href="https://wa.me/32492222677?text=' + WA_MSG + '" target="_blank" rel="noopener noreferrer" class="mb-whatsapp">',
        '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">',
          '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>',
          '<path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.847L.057 23.882a.5.5 0 0 0 .611.61l6.222-1.633A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zM12 22a9.956 9.956 0 0 1-5.038-1.362l-.361-.214-3.741.981.999-3.648-.235-.374A9.956 9.956 0 0 1 2 12C2 6.478 6.478 2 12 2s10 4.478 10 10-4.478 10-10 10z"/>',
        '</svg>',
        'WhatsApp',
      '</a>'
    ].join('');

    document.body.appendChild(bar);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createBar);
  } else {
    createBar();
  }
})();
