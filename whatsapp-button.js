// whatsapp-button.js — Botón flotante de WhatsApp para contacto rápido
// Carga en el lateral inferior derecho con animación al cargar

(function () {
  'use strict';

  // ⚠️ CAMBIA ESTE NÚMERO por el real (formato internacional sin + ni espacios)
  // Ejemplo: 34612345678 para España
  var PHONE = '34600000000';
  var MESSAGE = 'Hola, tengo una consulta sobre vuestros suplementos DaleVida';

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    // Crear el botón
    var btn = document.createElement('a');
    btn.id = 'dv-whatsapp-btn';
    btn.href = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(MESSAGE);
    btn.target = '_blank';
    btn.rel = 'noopener noreferrer';
    btn.setAttribute('aria-label', 'Contactar por WhatsApp');
    btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>';

    // Estilos
    var style = document.createElement('style');
    style.textContent = [
      '#dv-whatsapp-btn {',
      '  position: fixed;',
      '  bottom: 24px; right: 24px;',
      '  width: 60px; height: 60px;',
      '  background: #25D366;',
      '  border-radius: 50%;',
      '  display: flex; align-items: center; justify-content: center;',
      '  box-shadow: 0 4px 16px rgba(37, 211, 102, 0.4);',
      '  z-index: 9998;',
      '  text-decoration: none;',
      '  transition: transform 0.2s, box-shadow 0.2s;',
      '  animation: dvWaPulse 2.5s ease-in-out infinite;',
      '}',
      '#dv-whatsapp-btn:hover {',
      '  transform: scale(1.08);',
      '  box-shadow: 0 6px 20px rgba(37, 211, 102, 0.55);',
      '}',
      '@keyframes dvWaPulse {',
      '  0%, 100% { box-shadow: 0 4px 16px rgba(37, 211, 102, 0.4); }',
      '  50% { box-shadow: 0 4px 20px rgba(37, 211, 102, 0.7), 0 0 0 12px rgba(37, 211, 102, 0.15); }',
      '}',
      '@media (max-width: 640px) {',
      '  #dv-whatsapp-btn { bottom: 16px; right: 16px; width: 54px; height: 54px; }',
      '}',
      /* Si está el cookie banner visible, sube el botón */
      'body:has(#dv-cookie-banner) #dv-whatsapp-btn { bottom: 110px; }'
    ].join('\n');

    document.head.appendChild(style);
    document.body.appendChild(btn);
  });
})();
