/**
 * Troilo Digital — Bouton WhatsApp flottant
 * Aucun cookie, aucun tracking, RGPD neutre.
 */
(function () {
  var PHONE = '32492222677';
  var MESSAGE = encodeURIComponent('Bonjour, je souhaite un audit SEO gratuit pour mon activité.');

  function createButton() {
    var btn = document.createElement('a');
    btn.href = 'https://wa.me/' + PHONE + '?text=' + MESSAGE;
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
    btn.setAttribute('aria-label', 'Contacter Troilo Digital sur WhatsApp');
    btn.id = 'td-whatsapp-btn';
    btn.innerHTML = [
      '<style>',
      '#td-whatsapp-btn{',
        'position:fixed;bottom:5.5rem;right:1.25rem;z-index:9998;', /* au-dessus du chatbot */
        'width:56px;height:56px;border-radius:50%;',
        'background:#25D366;',
        'display:flex;align-items:center;justify-content:center;',
        'box-shadow:0 4px 16px rgba(0,0,0,0.25);',
        'transition:transform 0.2s,box-shadow 0.2s;',
        'text-decoration:none;',
      '}',
      '#td-whatsapp-btn:hover{transform:scale(1.08);box-shadow:0 6px 24px rgba(0,0,0,0.3);}',
      '#td-whatsapp-btn svg{width:30px;height:30px;fill:#fff;}',
      '#td-whatsapp-tooltip{',
        'position:absolute;right:64px;top:50%;transform:translateY(-50%);',
        'background:#1a1a1a;color:#fff;font-size:0.78rem;font-family:Inter,sans-serif;',
        'white-space:nowrap;padding:0.4rem 0.75rem;border-radius:6px;',
        'opacity:0;pointer-events:none;transition:opacity 0.2s;',
      '}',
      '#td-whatsapp-btn:hover #td-whatsapp-tooltip{opacity:1;}',
      '@media(max-width:600px){#td-whatsapp-btn{bottom:6.5rem;right:1rem;width:50px;height:50px;}}',
      '</style>',
      '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">',
        '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15',
        '-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475',
        '-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52',
        '.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207',
        '-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372',
        '-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2',
        ' 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413',
        '.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>',
        '<path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.847L.057 23.882',
        'a.5.5 0 0 0 .611.61l6.222-1.633A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z',
        'M12 22a9.956 9.956 0 0 1-5.038-1.362l-.361-.214-3.741.981.999-3.648-.235-.374A9.956 9.956',
        ' 0 0 1 2 12C2 6.478 6.478 2 12 2s10 4.478 10 10-4.478 10-10 10z"/>',
      '</svg>',
      '<span id="td-whatsapp-tooltip">WhatsApp</span>'
    ].join('');

    document.body.appendChild(btn);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createButton);
  } else {
    createButton();
  }
})();
