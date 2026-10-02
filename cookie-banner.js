/**
 * Troilo Digital — Cookie Consent Manager
 * RGPD conforme : GA4 bloqué jusqu'au consentement explicite
 */
(function () {
  var COOKIE_NAME = 'td_cookie_consent';
  var GA4_ID = 'G-LW314GTBSZ';
  var CLARITY_ID = 'w3tmcesoy0';
  var META_PIXEL_ID = '2207782226698486';
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

  function loadClarity() {
    if (window._clarityLoaded) return;
    window._clarityLoaded = true;
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments);};
      t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, 'clarity', 'script', CLARITY_ID);
  }

  function loadMetaPixel() {
    if (window._metaPixelLoaded) return;
    window._metaPixelLoaded = true;
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){
      n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments);
    };if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;
    s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s);}
    (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', META_PIXEL_ID);
    var eventId = 'pv-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9);
    fbq('track', 'PageView', {}, { eventID: eventId });

    var userData = {};
    var fbp = getCookie('_fbp');
    var fbc = getCookie('_fbc');
    if (fbp) userData.fbp = fbp;
    if (fbc) userData.fbc = fbc;

    fetch('/.netlify/functions/meta-capi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: 'PageView',
        event_id: eventId,
        event_source_url: window.location.href,
        user_data: Object.keys(userData).length ? userData : undefined,
      }),
    }).catch(function() {});
  }

  function loadFacebookChat() {
    if (window._fbCustomerChatLoaded) return;
    if (!document.querySelector('.fb-customerchat')) return;
    window._fbCustomerChatLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.defer = true;
    s.crossOrigin = 'anonymous';
    s.src = 'https://connect.facebook.net/fr_FR/sdk/xfbml.customerchat.js';
    document.body.appendChild(s);
  }

  function loadTracking() {
    loadGA4();
    loadClarity();
    loadMetaPixel();
    loadFacebookChat();
  }

  function hideBanner() {
    var b = document.getElementById('td-cookie-banner');
    if (b) b.remove();
  }

  function acceptCookies() {
    setCookie(COOKIE_NAME, 'accepted', CONSENT_DURATION_DAYS);
    hideBanner();
    loadTracking();
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
    loadTracking();
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
      '#td-cookie-banner{position:fixed;bottom:0;left:0;right:0;z-index:99999;background:#0B0D0F;color:#F5F5F2;padding:1rem 5%;',
      'display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;',
      'box-shadow:0 -4px 20px rgba(0,0,0,0.3);font-family:Inter,sans-serif;font-size:0.88rem;line-height:1.5;}',
      '#td-cookie-banner p{margin:0;color:rgba(255,255,255,0.8);max-width:680px;}',
      '#td-cookie-banner a{color:#D4A03A;text-decoration:underline;}',
      '#td-cookie-banner .td-cb-btns{display:flex;gap:0.75rem;flex-shrink:0;flex-wrap:wrap;}',
      '#td-cookie-banner .td-cb-accept{background:#D4A03A;color:#0B0D0F;border:none;padding:0.55rem 1.25rem;',
      'border-radius:6px;font-weight:700;font-size:0.88rem;cursor:pointer;white-space:nowrap;}',
      '#td-cookie-banner .td-cb-accept:hover{background:#f4d85c;}',
      '#td-cookie-banner .td-cb-decline{background:transparent;color:rgba(255,255,255,0.55);border:1px solid rgba(255,255,255,0.25);',
      'padding:0.55rem 1.25rem;border-radius:6px;font-weight:600;font-size:0.88rem;cursor:pointer;white-space:nowrap;}',
      '#td-cookie-banner .td-cb-decline:hover{color:#fff;border-color:rgba(255,255,255,0.5);}',
      '@media(max-width:600px){#td-cookie-banner{flex-direction:column;align-items:flex-start;}}',
      '</style>',
      '<p>Ce site utilise des cookies de mesure d’audience et d’amélioration.',
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
