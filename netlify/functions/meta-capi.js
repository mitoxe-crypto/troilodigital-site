/**
 * Troilo Digital — Meta Conversions API (CAPI) via Netlify Function
 *
 * Envoie les events PageView et Lead côté serveur à Meta CAPI.
 * Fonctionne en parallèle du Pixel navigateur pour dédupliquer via event_id.
 *
 * CONFIGURATION REQUISE :
 * Dans Netlify UI → Site settings → Environment variables :
 *   META_CAPI_TOKEN = votre token d'accès
 *
 * Comment obtenir le token :
 *   1. Business Manager → Paramètres des données → Sources de données
 *   2. Choisir votre Ensemble de données (Pixel)
 *   3. Onglet "Paramètres" → section "Token d'accès"
 *   4. Cliquer "Générer un token" → Copier → Coller dans Netlify
 *
 * Pixel ID : 2207782226698486
 * Endpoint : https://graph.facebook.com/v18.0/2207782226698486/events
 */

const crypto = require('crypto');

const PIXEL_ID = '2207782226698486';
const API_VERSION = 'v18.0';
const META_API_URL = `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events`;

/**
 * Hash SHA-256 d'une valeur normalisée (lowercase + trim).
 * Meta exige ce format pour toutes les PII.
 */
function sha256(value) {
  if (!value) return undefined;
  return crypto
    .createHash('sha256')
    .update(value.toLowerCase().trim())
    .digest('hex');
}

/**
 * Parse l'IP du client depuis les headers Netlify.
 * On n'envoie pas l'IP brute — Meta l'utilise pour le geo uniquement.
 */
function getClientIP(headers) {
  return (
    headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    headers['client-ip'] ||
    null
  );
}

exports.handler = async function (event, context) {
  // Bloquer tout sauf POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  // Vérifier la présence du token
  const capiToken = process.env.META_CAPI_TOKEN;
  if (!capiToken) {
    console.error('[meta-capi] META_CAPI_TOKEN manquant dans les variables env');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server configuration error' }),
    };
  }

  // Parser le body
  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON body' }),
    };
  }

  const {
    event_name,   // 'PageView' | 'Lead'
    event_id,     // UUID unique généré côté navigateur (pour déduplication)
    event_source_url,
    user_data,    // { em?, ph?, fn?, ln?, external_id? } — PII en clair, hashées ici
    custom_data,  // données métier optionnelles
  } = payload;

  // Valider l'event_name
  const allowedEvents = ['PageView', 'Lead', 'Contact', 'ViewContent'];
  if (!event_name || !allowedEvents.includes(event_name)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `event_name invalide. Valeurs acceptées : ${allowedEvents.join(', ')}` }),
    };
  }

  if (!event_id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'event_id manquant (requis pour déduplication)' }),
    };
  }

  // Construire le user_data avec PII hashées
  const hashedUserData = {
    client_ip_address: getClientIP(event.headers),
    client_user_agent: event.headers['user-agent'] || null,
  };

  if (user_data) {
    // Champs PII — toujours hashés en SHA-256
    if (user_data.em) hashedUserData.em = sha256(user_data.em);
    if (user_data.ph) hashedUserData.ph = sha256(user_data.ph);
    if (user_data.fn) hashedUserData.fn = sha256(user_data.fn);
    if (user_data.ln) hashedUserData.ln = sha256(user_data.ln);

    // external_id : identifiant interne non-PII (peut être hashé aussi)
    if (user_data.external_id) {
      hashedUserData.external_id = sha256(user_data.external_id);
    }

    // fbp et fbc sont des identifiants Meta non-PII, passés tels quels
    if (user_data.fbp) hashedUserData.fbp = user_data.fbp;
    if (user_data.fbc) hashedUserData.fbc = user_data.fbc;
  }

  // Construire l'event Meta CAPI
  const metaEvent = {
    event_name,
    event_time: Math.floor(Date.now() / 1000),
    event_source_url: event_source_url || 'https://troilodigital.be/',
    event_id,
    action_source: 'website',
    user_data: hashedUserData,
  };

  if (custom_data && Object.keys(custom_data).length > 0) {
    metaEvent.custom_data = custom_data;
  }

  // Payload final pour l'API Meta
  const metaPayload = {
    data: [metaEvent],
    // test_event_code: 'TEST12345', // décommenter pour tester dans Events Manager
  };

  // Envoyer à Meta CAPI
  try {
    const response = await fetch(
      `${META_API_URL}?access_token=${capiToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metaPayload),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error('[meta-capi] Erreur API Meta:', JSON.stringify(result));
      return {
        statusCode: 502,
        body: JSON.stringify({ error: 'Meta API error', details: result }),
      };
    }

    console.log(`[meta-capi] Event "${event_name}" envoyé — event_id: ${event_id}`);
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, event_name, event_id }),
    };
  } catch (err) {
    console.error('[meta-capi] Erreur réseau:', err.message);
    return {
      statusCode: 502,
      body: JSON.stringify({ error: 'Network error', message: err.message }),
    };
  }
};
