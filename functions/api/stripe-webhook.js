// /functions/api/stripe-webhook.js
// Cloudflare Pages Function — Recibe eventos de Stripe Webhook.
// Cuando el pago se completa, envía DOS emails vía Resend:
//   1) Al dueño (informacion@mbmonlinecommerce.com) con TODA la info del pedido
//   2) Al cliente con confirmación bonita branded DaleVida
//
// Usa fetch directo + Web Crypto API para verificar la firma de Stripe.
// No requiere instalar dependencias.

export async function onRequestPost(context) {
  const { request, env } = context;

  // Config / variables de entorno
  const stripeSecret = env.STRIPE_SECRET_KEY;
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
  const resendKey = env.RESEND_API_KEY;
  const ownerEmail = env.OWNER_EMAIL || 'informacion@mbmonlinecommerce.com';
  const fromEmail = env.FROM_EMAIL || 'onboarding@resend.dev';

  if (!stripeSecret || !webhookSecret || !resendKey) {
    console.error('Faltan variables de entorno');
    return new Response('Missing env vars', { status: 500 });
  }

  // 1) Leer el body RAW (importante para verificar la firma)
  const rawBody = await request.text();
  const sigHeader = request.headers.get('stripe-signature');

  if (!sigHeader) {
    return new Response('No stripe-signature header', { status: 400 });
  }

  // 2) Verificar la firma con HMAC-SHA256 (Web Crypto)
  try {
    await verifyStripeSignature(rawBody, sigHeader, webhookSecret);
  } catch (err) {
    console.error('Firma inválida:', err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // 3) Parsear el evento
  let stripeEvent;
  try {
    stripeEvent = JSON.parse(rawBody);
  } catch (e) {
    return new Response('Invalid JSON', { status: 400 });
  }

  // Sólo nos interesa el pago completado
  if (stripeEvent.type !== 'checkout.session.completed') {
    return new Response(
      JSON.stringify({ received: true, ignored: stripeEvent.type }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const session = stripeEvent.data.object;

  try {
    // 4) Pedir la sesión completa con line_items para tener todos los detalles
    const fullSession = await getStripeSession(stripeSecret, session.id);

    const customer = fullSession.customer_details || {};
    const shipping =
      fullSession.shipping_details ||
      fullSession.collected_information?.shipping_details ||
      {};
    const address = shipping.address || customer.address || {};

    const lineItems = fullSession.line_items?.data || [];

    const productsHtml = lineItems
      .map(
        (it) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee;">${
            it.description || it.price?.product?.name || 'Producto'
          }</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center;">${
            it.quantity
          }</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">${(
            it.amount_total / 100
          )
            .toFixed(2)
            .replace('.', ',')} €</td>
        </tr>`
      )
      .join('');

    const productsText = lineItems
      .map(
        (it) =>
          `- ${it.quantity} x ${
            it.description || 'Producto'
          } = ${(it.amount_total / 100).toFixed(2).replace('.', ',')} €`
      )
      .join('\n');

    const total = (fullSession.amount_total / 100).toFixed(2).replace('.', ',');
    const subtotal = (fullSession.amount_subtotal / 100)
      .toFixed(2)
      .replace('.', ',');
    const shippingCost = (
      (fullSession.shipping_cost?.amount_total || 0) / 100
    )
      .toFixed(2)
      .replace('.', ',');

    const nombreCliente = shipping.name || customer.name || 'Cliente';
    const primerNombre = nombreCliente.split(' ')[0];
    const emailCliente = customer.email || '';
    const telefonoCliente = customer.phone || shipping.phone || '—';

    const direccionCompleta =
      [
        address.line1,
        address.line2,
        address.postal_code && address.city
          ? `${address.postal_code} ${address.city}`
          : address.city || address.postal_code,
        address.state,
        address.country,
      ]
        .filter(Boolean)
        .join(', ') || '(sin dirección)';

    // 5a) EMAIL AL DUEÑO
    const emailOwner = {
      from: `DaleVida Pedidos <${fromEmail}>`,
      to: [ownerEmail],
      reply_to: emailCliente || ownerEmail,
      subject: `🆕 Nuevo pedido DaleVida — ${nombreCliente} — ${total} €`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#2B5A3E;">
          <div style="background:#2B5A3E;color:#fff;padding:24px;border-radius:12px 12px 0 0;">
            <h1 style="margin:0;font-size:24px;">🌿 DaleVida — Nuevo pedido recibido</h1>
          </div>
          <div style="background:#F7F5EE;padding:24px;border-radius:0 0 12px 12px;">
            <p style="font-size:18px;margin:0 0 16px;"><strong>Total cobrado: ${total} €</strong></p>
            <p>Acaba de entrar un nuevo pedido en la web. Aquí tienes toda la información para reenviar al laboratorio:</p>

            <h2 style="color:#2B5A3E;border-bottom:2px solid #7DC142;padding-bottom:8px;">📦 Datos de envío</h2>
            <p>
              <strong>Cliente:</strong> ${nombreCliente}<br>
              <strong>Email:</strong> ${emailCliente}<br>
              <strong>Teléfono:</strong> ${telefonoCliente}<br>
              <strong>Dirección:</strong> ${direccionCompleta}
            </p>

            <h2 style="color:#2B5A3E;border-bottom:2px solid #7DC142;padding-bottom:8px;">🛒 Productos del pedido</h2>
            <table style="width:100%;border-collapse:collapse;">
              <thead>
                <tr style="background:#7DC142;color:#2B5A3E;">
                  <th style="padding:10px;text-align:left;">Producto</th>
                  <th style="padding:10px;text-align:center;">Cantidad</th>
                  <th style="padding:10px;text-align:right;">Importe</th>
                </tr>
              </thead>
              <tbody>${productsHtml}</tbody>
            </table>

            <div style="margin-top:16px;padding:16px;background:#fff;border-radius:8px;">
              <p style="margin:4px 0;"><strong>Subtotal:</strong> ${subtotal} €</p>
              <p style="margin:4px 0;"><strong>Envío:</strong> ${
                shippingCost === '0,00' ? 'GRATIS' : shippingCost + ' €'
              }</p>
              <p style="margin:4px 0;font-size:18px;color:#2B5A3E;"><strong>TOTAL: ${total} €</strong></p>
            </div>

            <p style="margin-top:20px;color:#717a6d;font-size:13px;">
              Ref. Stripe: <code>${session.id}</code><br>
              <a href="https://dashboard.stripe.com/payments/${session.payment_intent}" style="color:#2B5A3E;">Ver pago en Stripe →</a>
            </p>
          </div>
        </div>
      `,
      text: `Nuevo pedido DaleVida\n\nCliente: ${nombreCliente}\nEmail: ${emailCliente}\nTeléfono: ${telefonoCliente}\nDirección: ${direccionCompleta}\n\nProductos:\n${productsText}\n\nSubtotal: ${subtotal} €\nEnvío: ${shippingCost} €\nTOTAL: ${total} €\n\nRef. Stripe: ${session.id}`,
    };

    // 5b) EMAIL AL CLIENTE
    let emailCustomer = null;
    if (emailCliente) {
      emailCustomer = {
        from: `DaleVida <${fromEmail}>`,
        to: [emailCliente],
        reply_to: ownerEmail,
        subject: `Gracias por tu pedido en DaleVida 🌿`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#2B5A3E;">
            <div style="background:#2B5A3E;color:#fff;padding:32px 24px;border-radius:12px 12px 0 0;text-align:center;">
              <h1 style="margin:0 0 8px;font-size:30px;letter-spacing:1px;">🌿 DaleVida</h1>
              <p style="margin:0;opacity:0.9;font-size:14px;">Vitalidad natural · Hecho en España</p>
            </div>
            <div style="background:#F7F5EE;padding:32px 24px;border-radius:0 0 12px 12px;">
              <h2 style="color:#2B5A3E;margin:0 0 16px;font-size:24px;">¡Gracias por tu pedido, ${primerNombre}! 💚</h2>
              <p style="font-size:16px;line-height:1.6;margin:0 0 24px;">
                Acabamos de recibir tu pedido y lo estamos preparando con cariño en nuestro laboratorio en España. En <strong>1-2 días laborables</strong> tendrás tus productos en casa.
              </p>

              <h3 style="color:#2B5A3E;border-bottom:2px solid #7DC142;padding-bottom:8px;margin-top:24px;">Resumen de tu pedido</h3>
              <table style="width:100%;border-collapse:collapse;">
                <thead>
                  <tr style="background:#7DC142;color:#2B5A3E;">
                    <th style="padding:10px;text-align:left;">Producto</th>
                    <th style="padding:10px;text-align:center;">Cant.</th>
                    <th style="padding:10px;text-align:right;">Importe</th>
                  </tr>
                </thead>
                <tbody>${productsHtml}</tbody>
              </table>

              <div style="margin-top:16px;padding:16px;background:#fff;border-radius:8px;">
                <p style="margin:4px 0;"><strong>Subtotal:</strong> ${subtotal} €</p>
                <p style="margin:4px 0;"><strong>Envío:</strong> ${
                  shippingCost === '0,00' ? 'GRATIS 🎉' : shippingCost + ' €'
                }</p>
                <p style="margin:8px 0 0;font-size:18px;color:#2B5A3E;"><strong>TOTAL: ${total} €</strong></p>
              </div>

              <h3 style="color:#2B5A3E;border-bottom:2px solid #7DC142;padding-bottom:8px;margin-top:24px;">📦 Enviaremos a</h3>
              <p style="font-size:15px;line-height:1.6;margin:8px 0 0;">
                <strong>${nombreCliente}</strong><br>
                ${direccionCompleta}
              </p>

              <div style="margin-top:32px;padding:20px;background:#fff;border-radius:8px;border-left:4px solid #7DC142;">
                <p style="margin:0 0 8px;font-weight:bold;color:#2B5A3E;">¿Tienes alguna duda sobre tu pedido?</p>
                <p style="margin:0;font-size:15px;line-height:1.6;">
                  Simplemente <strong>responde a este email</strong> y te ayudaremos lo antes posible. También puedes escribirnos a <a href="mailto:informacion@mbmonlinecommerce.com" style="color:#2B5A3E;">informacion@mbmonlinecommerce.com</a>.
                </p>
              </div>

              <p style="margin-top:32px;font-size:14px;color:#717a6d;text-align:center;line-height:1.6;">
                🌿 <em>Cuidarte no debería alejarte de vivir, sino acercarte más a ello.</em><br>
                Gracias por confiar en DaleVida.
              </p>

              <p style="margin-top:24px;font-size:12px;color:#9b9b9b;text-align:center;">
                Ref. pedido: ${session.id.slice(-12)}
              </p>
            </div>
          </div>
        `,
        text: `¡Gracias por tu pedido, ${primerNombre}!\n\nAcabamos de recibir tu pedido y lo estamos preparando. En 1-2 días laborables tendrás tus productos en casa.\n\nResumen:\n${productsText}\n\nSubtotal: ${subtotal} €\nEnvío: ${shippingCost} €\nTOTAL: ${total} €\n\nDirección de envío:\n${nombreCliente}\n${direccionCompleta}\n\n¿Dudas? Responde a este email o escríbenos a informacion@mbmonlinecommerce.com\n\nGracias por confiar en DaleVida 🌿\n\nRef: ${session.id.slice(-12)}`,
      };
    }

    // 6) Enviar emails en paralelo
    const emailsToSend = [sendEmail(resendKey, emailOwner)];
    if (emailCustomer) emailsToSend.push(sendEmail(resendKey, emailCustomer));

    const results = await Promise.allSettled(emailsToSend);

    results.forEach((r, i) => {
      const who = i === 0 ? 'Owner' : 'Customer';
      if (r.status === 'fulfilled') {
        console.log(`✓ Email ${who} enviado:`, r.value?.id);
      } else {
        console.error(`❌ Email ${who} falló:`, r.reason?.message || r.reason);
      }
    });

    return new Response(
      JSON.stringify({
        received: true,
        emails_sent: results.filter((r) => r.status === 'fulfilled').length,
        emails_failed: results.filter((r) => r.status === 'rejected').length,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('Error procesando webhook:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// Helpers

async function verifyStripeSignature(payload, sigHeader, secret, tolerance = 300) {
  const parts = sigHeader.split(',').reduce((acc, part) => {
    const [k, v] = part.split('=');
    if (k && v) acc[k] = (acc[k] ? acc[k] + ',' : '') + v;
    return acc;
  }, {});

  const timestamp = parts.t;
  const signatures = (parts.v1 || '').split(',').filter(Boolean);

  if (!timestamp || signatures.length === 0) {
    throw new Error('Cabecera stripe-signature inválida');
  }

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp, 10)) > tolerance) {
    throw new Error('Timestamp fuera de tolerancia');
  }

  const signedPayload = `${timestamp}.${payload}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sigBytes = await crypto.subtle.sign('HMAC', key, encoder.encode(signedPayload));
  const expectedSig = Array.from(new Uint8Array(sigBytes))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  const ok = signatures.some((sig) => safeCompare(sig, expectedSig));
  if (!ok) throw new Error('Firma no coincide');

  return true;
}

function safeCompare(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function getStripeSession(secretKey, sessionId) {
  const url = `https://api.stripe.com/v1/checkout/sessions/${sessionId}?expand[]=line_items&expand[]=customer_details`;
  const resp = await fetch(url, {
    headers: { Authorization: `Bearer ${secretKey}` },
  });
  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(`Stripe getSession ${resp.status}: ${data.error?.message || 'error'}`);
  }
  return data;
}

async function sendEmail(apiKey, payload) {
  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(`Resend ${resp.status}: ${data.message || JSON.stringify(data)}`);
  }
  return data;
}
