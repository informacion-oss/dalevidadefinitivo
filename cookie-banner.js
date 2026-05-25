// cookie-banner.js — Banner de cookies GDPR para DaleVida
// Cumple con la normativa española/europea (LSSI-CE + RGPD)

(function () {
  'use strict';
  var STORAGE_KEY = 'dv_cookie_consent';
  var POLICY_URL = '/cookies.html';

  try {
    if (localStorage.getItem(STORAGE_KEY)) return;
  } catch (e) {}

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    var banner = document.createElement('div');
    banner.id = 'dv-cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Aviso de cookies');
    banner.innerHTML = [
      '<div class="dv-cookie-inner">',
      '  <p class="dv-cookie-text">',
      '    🍪 <strong>Usamos cookies</strong> para mejorar tu experiencia en DaleVida. ',
      '    Las cookies esenciales son necesarias para el funcionamiento del carrito. ',
      '    Puedes aceptar todas o rechazar las opcionales. ',
      '    <a href="' + POLICY_URL + '" class="dv-cookie-link">Más información</a>.',
      '  </p>',
      '  <div class="dv-cookie-buttons">',
      '    <button type="button" class="dv-cookie-btn dv-cookie-btn-reject" data-choice="reject">Rechazar</button>',
      '    <button type="button" class="dv-cookie-btn dv-cookie-btn-accept" data-choice="accept">Aceptar</button>',
      '  </div>',
      '</div>'
    ].join('');

    var style = document.createElement('style');
    style.textContent = [
      '#dv-cookie-banner { position: fixed; bottom: 0; left: 0; right: 0; background: #2B5A3E; color: #fff; padding: 16px 20px; z-index: 99999; box-shadow: 0 -4px 16px rgba(0,0,0,0.18); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; animation: dvCookieSlideUp 0.4s ease-out; }',
      '@keyframes dvCookieSlideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }',
      '.dv-cookie-inner { max-width: 1200px; margin: 0 auto; display: flex; flex-wrap: wrap; align-items: center; gap: 16px; justify-content: space-between; }',
      '.dv-cookie-text { margin: 0; flex: 1; min-width: 260px; font-size: 14px; line-height: 1.5; }',
      '.dv-cookie-link { color: #7DC142; text-decoration: underline; font-weight: bold; }',
      '.dv-cookie-link:hover { color: #fff; }',
      '.dv-cookie-buttons { display: flex; gap: 8px; flex-wrap: wrap; }',
      '.dv-cookie-btn { padding: 10px 22px; border-radius: 24px; cursor: pointer; font-size: 14px; font-weight: bold; transition: transform 0.15s; font-family: inherit; }',
      '.dv-cookie-btn:hover { transform: translateY(-2px); }',
      '.dv-cookie-btn-reject { border: 1px solid #fff; background: transparent; color: #fff; }',
      '.dv-cookie-btn-reject:hover { background: rgba(255,255,255,0.1); }',
      '.dv-cookie-btn-accept { border: none; background: #7DC142; color: #2B5A3E; }',
      '.dv-cookie-btn-accept:hover { background: #8fd054; }',
      '@media (max-width: 640px) { .dv-cookie-inner { flex-direction: column; align-items: stretch; } .dv-cookie-buttons { justify-content: stretch; } .dv-cookie-btn { flex: 1; } }'
    ].join('\n');

    document.head.appendChild(style);
    document.body.appendChild(banner);

    banner.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-choice]');
      if (!btn) return;
      var choice = btn.getAttribute('data-choice');
      try {
        localStorage.setItem(STORAGE_KEY, choice);
        localStorage.setItem(STORAGE_KEY + '_date', new Date().toISOString());
      } catch (e) {}
      banner.style.transition = 'transform 0.3s, opacity 0.3s';
      banner.style.transform = 'translateY(100%)';
      banner.style.opacity = '0';
      setTimeout(function () {
        if (banner.parentNode) banner.parentNode.removeChild(banner);
      }, 300);
    });
  });
})();
