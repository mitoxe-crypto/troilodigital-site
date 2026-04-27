/**
 * Troilo Digital — Cookie Consent Manager
 * RGPD conforme : GA4 bloqué jusqu'au consentement explicite
 */
(function () {
  var COOKIE_NAME = 'td_cookie_consent';
  var GA4_ID = 'G-LW314GTBSZ';
  var CONSENT_DURATION_DAYS = 365;

  function getCookie(name) {
    var match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  }

  function setCookie(name, value, days) {
    var expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/; SameSite=Lax';
  }

  function loadGA4() {
    if (window._ga4Loaded) return;
    window._ga4Loaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA4_ID, { anonymize_ip: true });
  }

  function hideBanner() {
    var b = document.getElementById('td-cookie-banner');
    if (b) b.remove();
  }

  function acceptCookies() {
    setCookie(COOKIE_NAME, 'accepted', CONSENT_DURATION_DAYS);
    hideBanner();
    loadGA4();
  }

  function declineCookies() {
    setCookie(COOKIE_NAME, 'declined', CONSENT_DURATION_DAYS);
    hideBanner();
  }

  // Expose reset function (used on politique page)
  window.tdResetConsent = function () {
    setCookie(COOKIE_NAME, '', -1);
    location.reload();
  };

  // Check existing consent
  var consent = getCookie(COOKIE_NAME);
  if (consent === 'accepted') {
    loadGA4();
    return;
  }
  if (consent === 'declined') {
    return;
  }

  // No consent yet — show banner
  function showBanner() {
    var banner = document.createElement('div');
    banner.id = 'td-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Consentement cookies');
    banner.innerHTML = [
      '<style>',
      '#td-cookie-banner{position:fixed;bottom:0;left:0;right:0;z-index:99999;background:#001A3F;color:#fff;padding:1rem 5%;',
      'display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;',
      'box-shadow:0 -4px 20px rgba(0,0,0,0.3);font-family:Inter,sans-serif;font-size:0.88rem;line-height:1.5;}',
      '#td-cookie-banner p{margin:0;color:rgba(255,255,255,0.8);max-width:680px;}',
      '#td-cookie-banner a{color:#C9A84C;text-decoration:underline;}',
      '#td-cookie-banner .td-cb-btns{display:flex;gap:0.75rem;flex-shrink:0;flex-wrap:wrap;}',
      '#td-cookie-banner .td-cb-accept{background:#C9A84C;color:#001A3F;border:none;padding:0.55rem 1.25rem;',
      'border-radius:6px;font-weight:700;font-size:0.88rem;cursor:pointer;white-space:nowrap;}',
      '#td-cookie-banner .td-cb-accept:hover{background:#b8943d;}',
      '#td-cookie-banner .td-cb-decline{background:transparent;color:rgba(255,255,255,0.55);border:1px solid rgba(255,255,255,0.25);',
      'padding:0.55rem 1.25rem;border-radius:6px;font-weight:600;font-size:0.88rem;cursor:pointer;white-space:nowrap;}',
      '#td-cookie-banner .td-cb-decline:hover{color:#fff;border-color:rgba(255,255,255,0.5);}',
      '@media(max-width:600px){#td-cookie-banner{flex-direction:column;align-items:flex-start;}}',
      '</style>',
      '<p>🍪 Ce site utilise Google Analytics pour mesurer son audience.',
      'Ces cookies ne sont déposés qu\'avec votre accord.',
      '<a href="/politique-de-confidentialite/#cookies">En savoir plus</a>.</p>',
      '<div class="td-cb-btns">',
      '<button class="td-cb-decline" id="td-cb-decline">Refuser</button>',
      '<button class="td-cb-accept" id="td-cb-accept">Accepter</button>',
      '</div>'
    ].join('');
    document.body.appendChild(banner);
    document.getElementById('td-cb-accept').addEventListener('click', acceptCookies);
    document.getElementById('td-cb-decline').addEventListener('click', declineCookies);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showBanner);
  } else {
    showBanner();
  }
})();
