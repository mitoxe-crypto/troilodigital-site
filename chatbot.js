/**
 * Troilo Digital — Chatbot Qualification Prospects
 * Démo "The 1% Challenge" — version standalone (sans backend requis)
 * Données collectées → WhatsApp Michel avec résumé pré-rempli
 *
 * Position : bouton fixe bas-droite, au-dessus du bouton WhatsApp
 * Design : navy #0F3460 + teal #1D9E75, police Satoshi
 */
(function () {
  'use strict';

  var PHONE_MICHEL = '32492222677';

  /* ─── ARBRE DE CONVERSATION ─────────────────────────────────── */
  var steps = [
    {
      id: 'welcome',
      msg: 'Bonjour\u00a0! Je suis un assistant automatisé Troilo Digital. Vous cherchez plus de clients depuis Google\u00a0?',
      choices: [
        { label: 'Oui, c\'est mon objectif', next: 'sector' },
        { label: 'Je regarde juste', next: 'soft' }
      ]
    },
    {
      id: 'soft',
      msg: 'Pas de problème. Si vous avez des questions sur le SEO pour artisans, je suis là.',
      choices: [
        { label: 'Finalement, dites-m\'en plus', next: 'sector' },
        { label: 'Merci, à bientôt', next: 'bye' }
      ]
    },
    {
      id: 'sector',
      msg: 'Vous travaillez dans quel secteur\u00a0?',
      choices: [
        { label: 'Plomberie', next: 'hassite', value: 'plombier' },
        { label: 'Chauffage / HVAC', next: 'hassite', value: 'chauffagiste' },
        { label: 'Électricité', next: 'hassite', value: 'électricien' },
        { label: 'Menuiserie / Rénovation', next: 'hassite', value: 'menuisier' },
        { label: 'Autre', next: 'hassite', value: 'autre' }
      ]
    },
    {
      id: 'hassite',
      msg: 'Vous avez déjà un site web\u00a0?',
      choices: [
        { label: 'Oui', next: 'city', value: 'oui' },
        { label: 'Non, juste Facebook', next: 'city', value: 'facebook-only' },
        { label: 'Rien du tout', next: 'city', value: 'rien' }
      ]
    },
    {
      id: 'city',
      msg: 'Quelle est votre ville principale\u00a0?',
      input: true,
      placeholder: 'Ex\u00a0: Liège, Namur, Charleroi…',
      next: 'contact'
    },
    {
      id: 'contact',
      msg: 'Dernière étape — votre prénom et numéro\u00a0? Je vous rappelle dans les 24h.',
      inputs: [
        { key: 'prenom', placeholder: 'Votre prénom' },
        { key: 'tel', placeholder: 'Votre téléphone', type: 'tel' }
      ],
      next: 'done'
    },
    {
      id: 'done',
      msg: null // généré dynamiquement
    },
    {
      id: 'bye',
      msg: 'À bientôt\u00a0! N\'hésitez pas à revenir si vous avez des questions. 👋'
    }
  ];

  /* ─── STATE ─────────────────────────────────────────────────── */
  var state = { sector: '', site: '', city: '', prenom: '', tel: '' };
  var currentStep = 'welcome';
  var isOpen = false;

  /* ─── STYLES ─────────────────────────────────────────────────── */
  var css = `
    #td-chat-btn {
      position: fixed; bottom: 1.4rem; left: 1.25rem; z-index: 9997;
      width: 56px; height: 56px; border-radius: 50%;
      background: #0a0a0a;
      border: 2px solid #e8c547;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 4px 20px rgba(232,197,71,0.2);
      cursor: pointer; transition: transform .2s, box-shadow .2s;
    }
    #td-chat-btn:hover { transform: scale(1.08); box-shadow: 0 6px 28px rgba(232,197,71,0.4); }
    #td-chat-btn svg { width: 26px; height: 26px; fill: #e8c547; }
    /* Pulse ring sonar */
    #td-chat-btn::before, #td-chat-btn::after {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 50%;
      border: 2px solid #e8c547;
      animation: td-sonar 2.4s ease-out infinite;
      pointer-events: none;
    }
    #td-chat-btn::after { animation-delay: 1.2s; }
    @keyframes td-sonar {
      0%   { transform: scale(1); opacity: 0.6; }
      100% { transform: scale(2); opacity: 0; }
    }
    #td-chat-badge {
      position: absolute; top: -4px; right: -4px;
      width: 18px; height: 18px; border-radius: 50%;
      background: #e8c547; color: #0a0a0a; font-size: 11px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      font-family: sans-serif; border: 2px solid #0a0a0a;
    }
    #td-chat-tooltip {
      position: absolute; left: 64px; top: 50%; transform: translateY(-50%);
      background: #0a0a0a; color: #e8c547; font-size: .75rem; font-family: 'Satoshi', sans-serif;
      white-space: nowrap; padding: .35rem .7rem; border-radius: 6px;
      border: 1px solid rgba(232,197,71,0.25);
      opacity: 0; pointer-events: none; transition: opacity .4s;
    }
    #td-chat-btn:hover #td-chat-tooltip { opacity: 1; }
    #td-chat-tooltip.td-tooltip-show { opacity: 1; }
    #td-chat-window {
      position: fixed; bottom: 5.5rem; left: 1.25rem; z-index: 9997;
      width: min(360px, calc(100vw - 2.5rem));
      background: #fff; border-radius: 16px;
      box-shadow: 0 8px 40px rgba(0,0,0,.2);
      display: flex; flex-direction: column;
      overflow: hidden; transition: opacity .25s, transform .25s;
      font-family: 'Satoshi', 'DM Sans', sans-serif;
      max-height: calc(100vh - 8rem);
    }
    #td-chat-window.td-hidden { opacity: 0; transform: translateY(12px) scale(.97); pointer-events: none; }
    #td-chat-header {
      background: #0F3460; color: #fff;
      padding: .9rem 1.1rem; display: flex; align-items: center; gap: .75rem;
      flex-shrink: 0;
    }
    #td-chat-header .td-avatar {
      width: 38px; height: 38px; border-radius: 50%;
      background: #1D9E75; display: flex; align-items: center; justify-content: center;
      font-size: 1rem; font-weight: 700; color: #fff; flex-shrink: 0;
    }
    #td-chat-header .td-hinfo { flex: 1; }
    #td-chat-header .td-hname { font-size: .9rem; font-weight: 700; line-height: 1.2; }
    #td-chat-header .td-hstatus { font-size: .72rem; color: rgba(255,255,255,.7); }
    #td-chat-header .td-hstatus::before {
      content: ''; display: inline-block; width: 7px; height: 7px; border-radius: 50%;
      background: #1D9E75; margin-right: .35rem; vertical-align: middle;
    }
    #td-chat-close {
      background: none; border: none; color: rgba(255,255,255,.7);
      cursor: pointer; font-size: 1.3rem; line-height: 1; padding: .2rem; flex-shrink: 0;
    }
    #td-chat-close:hover { color: #fff; }
    #td-chat-msgs {
      flex: 1; overflow-y: auto; padding: 1rem;
      display: flex; flex-direction: column; gap: .6rem;
      scroll-behavior: smooth;
    }
    .td-msg {
      max-width: 85%; padding: .65rem .9rem; border-radius: 14px;
      font-size: .85rem; line-height: 1.5; animation: td-fadein .2s ease;
    }
    @keyframes td-fadein { from{opacity:0;transform:translateY(4px)} to{opacity:1;transform:none} }
    .td-msg.td-bot {
      background: #f0f4f8; color: #1a1a1a; border-bottom-left-radius: 4px; align-self: flex-start;
    }
    .td-msg.td-user {
      background: #0F3460; color: #fff; border-bottom-right-radius: 4px; align-self: flex-end;
    }
    #td-chat-actions {
      padding: .75rem 1rem; border-top: 1px solid #eee; flex-shrink: 0;
      display: flex; flex-direction: column; gap: .5rem;
    }
    .td-choice {
      background: #fff; border: 1.5px solid #0F3460; color: #0F3460;
      border-radius: 20px; padding: .5rem 1rem; font-size: .8rem;
      font-family: 'Satoshi', sans-serif; font-weight: 600;
      cursor: pointer; text-align: left; transition: background .15s, color .15s;
    }
    .td-choice:hover { background: #0F3460; color: #fff; }
    .td-input-row { display: flex; gap: .5rem; }
    .td-input {
      flex: 1; border: 1.5px solid #ddd; border-radius: 8px;
      padding: .5rem .75rem; font-size: .82rem; font-family: 'Satoshi', sans-serif;
      outline: none; transition: border-color .15s;
    }
    .td-input:focus { border-color: #0F3460; }
    .td-send {
      background: #1D9E75; color: #fff; border: none; border-radius: 8px;
      padding: .5rem .9rem; font-size: .82rem; font-family: 'Satoshi', sans-serif;
      font-weight: 700; cursor: pointer; white-space: nowrap;
      transition: background .15s;
    }
    .td-send:hover { background: #168a64; }
    .td-typing {
      display: flex; gap: 4px; align-items: center;
      padding: .65rem .9rem; background: #f0f4f8; border-radius: 14px;
      border-bottom-left-radius: 4px; align-self: flex-start; width: 52px;
    }
    .td-typing span {
      width: 7px; height: 7px; border-radius: 50%; background: #aaa;
      animation: td-blink 1.2s infinite;
    }
    .td-typing span:nth-child(2) { animation-delay: .2s; }
    .td-typing span:nth-child(3) { animation-delay: .4s; }
    @keyframes td-blink { 0%,80%,100%{opacity:.3} 40%{opacity:1} }
    @media(max-width:768px) {
      #td-chat-btn { bottom: 5.5rem; left: 1.25rem; }
      #td-chat-window { bottom: 10rem; left: 1rem; }
    }
  `;

  /* ─── DOM ────────────────────────────────────────────────────── */
  function inject() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // Bouton
    var btn = document.createElement('button');
    btn.id = 'td-chat-btn';
    btn.setAttribute('aria-label', 'Ouvrir le chat');
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z"/>
      </svg>
      <span id="td-chat-badge">1</span>
      <span id="td-chat-tooltip">On vous répond en 24h</span>
    `;
    document.body.appendChild(btn);

    // Fenêtre
    var win = document.createElement('div');
    win.id = 'td-chat-window';
    win.className = 'td-hidden';
    win.innerHTML = `
      <div id="td-chat-header">
        <div class="td-avatar">T</div>
        <div class="td-hinfo">
          <div class="td-hname">Troilo Digital</div>
          <div class="td-hstatus">En ligne — réponse en 24h</div>
        </div>
        <button id="td-chat-close" aria-label="Fermer">&times;</button>
      </div>
      <div id="td-chat-msgs"></div>
      <div id="td-chat-actions"></div>
    `;
    document.body.appendChild(win);

    btn.addEventListener('click', toggleChat);
    document.getElementById('td-chat-close').addEventListener('click', toggleChat);

    // Auto-show tooltip after 8s, hide after 3s
    setTimeout(function () {
      var tip = document.getElementById('td-chat-tooltip');
      if (tip && !isOpen) {
        tip.classList.add('td-tooltip-show');
        setTimeout(function () { tip.classList.remove('td-tooltip-show'); }, 3000);
      }
    }, 8000);
  }

  /* ─── TOGGLE ─────────────────────────────────────────────────── */
  function toggleChat() {
    isOpen = !isOpen;
    var win = document.getElementById('td-chat-window');
    var badge = document.getElementById('td-chat-badge');
    if (isOpen) {
      win.classList.remove('td-hidden');
      if (badge) badge.style.display = 'none';
      if (currentStep === 'welcome') renderStep('welcome');
    } else {
      win.classList.add('td-hidden');
    }
  }

  /* ─── MESSAGES ───────────────────────────────────────────────── */
  function addMsg(text, isBot) {
    var msgs = document.getElementById('td-chat-msgs');
    var div = document.createElement('div');
    div.className = 'td-msg ' + (isBot ? 'td-bot' : 'td-user');
    div.textContent = text;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping(callback) {
    var msgs = document.getElementById('td-chat-msgs');
    var typing = document.createElement('div');
    typing.className = 'td-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    msgs.appendChild(typing);
    msgs.scrollTop = msgs.scrollHeight;
    setTimeout(function () {
      msgs.removeChild(typing);
      callback();
    }, 800);
  }

  function clearActions() {
    document.getElementById('td-chat-actions').innerHTML = '';
  }

  /* ─── RENDU ÉTAPE ────────────────────────────────────────────── */
  function renderStep(stepId) {
    currentStep = stepId;
    var step = steps.find(function (s) { return s.id === stepId; });
    if (!step) return;
    clearActions();

    if (step.id === 'done') {
      var msg = 'Merci ' + (state.prenom || '') + '\u00a0! Je vous contacte dans les 24h ouvrables. 🎯';
      showTyping(function () {
        addMsg(msg, true);
        sendToWhatsApp();
      });
      return;
    }
    if (step.id === 'bye') {
      showTyping(function () { addMsg(step.msg, true); });
      return;
    }

    showTyping(function () {
      addMsg(step.msg, true);

      // Choix multiples
      if (step.choices) {
        var actions = document.getElementById('td-chat-actions');
        step.choices.forEach(function (choice) {
          var btn = document.createElement('button');
          btn.className = 'td-choice';
          btn.textContent = choice.label;
          btn.addEventListener('click', function () {
            addMsg(choice.label, false);
            if (choice.value) {
              if (stepId === 'sector') state.sector = choice.value;
              if (stepId === 'hassite') state.site = choice.value;
            }
            clearActions();
            setTimeout(function () { renderStep(choice.next); }, 300);
          });
          actions.appendChild(btn);
        });
      }

      // Input unique (ville)
      if (step.input) {
        var actions = document.getElementById('td-chat-actions');
        var row = document.createElement('div');
        row.className = 'td-input-row';
        var input = document.createElement('input');
        input.className = 'td-input';
        input.type = 'text';
        input.placeholder = step.placeholder || '';
        var sendBtn = document.createElement('button');
        sendBtn.className = 'td-send';
        sendBtn.textContent = 'OK';
        function submitInput() {
          var val = input.value.trim();
          if (!val) { input.focus(); return; }
          addMsg(val, false);
          if (stepId === 'city') state.city = val;
          clearActions();
          setTimeout(function () { renderStep(step.next); }, 300);
        }
        sendBtn.addEventListener('click', submitInput);
        input.addEventListener('keydown', function (e) { if (e.key === 'Enter') submitInput(); });
        row.appendChild(input);
        row.appendChild(sendBtn);
        actions.appendChild(row);
        setTimeout(function () { input.focus(); }, 100);
      }

      // Inputs multiples (prénom + tel)
      if (step.inputs) {
        var actions = document.getElementById('td-chat-actions');
        var fields = {};
        step.inputs.forEach(function (f) {
          var input = document.createElement('input');
          input.className = 'td-input';
          input.type = f.type || 'text';
          input.placeholder = f.placeholder || '';
          actions.appendChild(input);
          fields[f.key] = input;
        });
        var rgpd = document.createElement('p');
        rgpd.style.cssText = 'font-size:.7rem;color:#888;margin:.4rem 0 .25rem;line-height:1.4;';
        rgpd.textContent = 'Vos coordonnées sont transmises via WhatsApp à Michel Troilo (Troilo Digital) et utilisées uniquement pour vous recontacter. Aucun stockage tiers.';
        actions.appendChild(rgpd);
        var sendBtn = document.createElement('button');
        sendBtn.className = 'td-send';
        sendBtn.textContent = 'Envoyer';
        sendBtn.style.marginTop = '.25rem';
        sendBtn.addEventListener('click', function () {
          var prenom = fields.prenom.value.trim();
          var tel = fields.tel.value.trim();
          if (!prenom || !tel) {
            fields.prenom.focus();
            return;
          }
          state.prenom = prenom;
          state.tel = tel;
          addMsg(prenom + ' — ' + tel, false);
          clearActions();
          setTimeout(function () { renderStep(step.next); }, 300);
        });
        actions.appendChild(sendBtn);
        setTimeout(function () { fields.prenom.focus(); }, 100);
      }
    });
  }

  /* ─── ENVOI WHATSAPP ─────────────────────────────────────────── */
  function sendToWhatsApp() {
    var siteLabel = {
      'oui': 'a un site web',
      'facebook-only': 'Facebook uniquement',
      'rien': 'aucune présence en ligne'
    }[state.site] || state.site;

    var msg = [
      '🤖 Nouveau lead Troilo Digital',
      '',
      'Prénom : ' + state.prenom,
      'Téléphone : ' + state.tel,
      'Secteur : ' + state.sector,
      'Présence web : ' + siteLabel,
      'Ville : ' + state.city,
      '',
      'Contact depuis le chatbot troilodigital.be'
    ].join('\n');

    var actions = document.getElementById('td-chat-actions');
    var link = document.createElement('a');
    link.href = 'https://wa.me/' + PHONE_MICHEL + '?text=' + encodeURIComponent(msg);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'td-send';
    link.style.textAlign = 'center';
    link.style.textDecoration = 'none';
    link.style.display = 'block';
    link.style.marginTop = '.5rem';
    link.textContent = '📞 Appeler directement';
    actions.appendChild(link);
  }

  /* ─── INIT ───────────────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
