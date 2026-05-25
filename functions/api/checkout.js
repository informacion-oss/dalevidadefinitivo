// /functions/api/checkout.js
// Cloudflare Pages Function — Crea una sesión de Stripe Checkout
// y devuelve la URL de pago. El frontend redirige a esa URL.
//
// Usa fetch directo a la API de Stripe (no requiere npm install).

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.STRIPE_SECRET_KEY) {
    return jsonResponse(
      { error: 'Falta STRIPE_SECRET_KEY en las variables de entorno' },
      500
    );
  }

  // 1) Leer el carrito que envía el frontend
  let payload;
  try {
    payload = await request.json();
  } catch (e) {
    return jsonResponse({ error: 'JSON inválido' }, 400);
  }

  const { items, customer } = payload || {};

  if (!items || !Array.isArray(items) || items.length === 0) {
    return jsonResponse({ error: 'Carrito vacío' }, 400);
  }

  // 2) Calcular subtotal para decidir si el envío es gratis
  const subtotal = items.reduce(
    (sum, it) => sum + parseFloat(it.price) * parseInt(it.quantity, 10),
    0
  );

  // 3) Detectar origen para los success/cancel URLs
  const origin =
    request.headers.get('origin') ||
    new URL(request.url).origin;

  // 4) Construir el body de la petición a Stripe (x-www-form-urlencoded)
  const form = new URLSearchParams();
  form.append('mode', 'payment');
  form.append('payment_method_types[]', 'card');
  form.append('success_url', `${origin}/success.html?session_id={CHECKOUT_SESSION_ID}`);
  form.append('cancel_url', `${origin}/productos.html`);
  form.append('locale', 'es');
  form.append('billing_address_collection', 'auto');
  form.append('allow_promotion_codes', 'true');

  // Países a los que enviamos
  ['ES', 'PT', 'FR', 'IT', 'AD'].forEach((code, i) => {
    form.append(`shipping_address_collection[allowed_countries][${i}]`, code);
  });

  // Line items (productos)
  items.forEach((item, i) => {
    const unitAmount = Math.round(parseFloat(item.price) * 100); // céntimos
    form.append(`line_items[${i}][price_data][currency]`, 'eur');
    form.append(`line_items[${i}][price_data][product_data][name]`, item.name);
    form.append(`line_items[${i}][price_data][unit_amount]`, String(unitAmount));
    form.append(`line_items[${i}][quantity]`, String(parseInt(item.quantity, 10)));
  });

  // Opción de envío: gratis si ≥ 40€, si no 4,99€
  if (subtotal >= 40) {
    appendShipping(form, 0, 'Envío GRATIS');
  } else {
    appendShipping(form, 499, 'Envío estándar');
  }

  if (customer && customer.email) {
    form.append('customer_email', customer.email);
  }

  // 5) Llamar a Stripe
  try {
    const stripeResp = await fetch(
      'https://api.stripe.com/v1/checkout/sessions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: form.toString(),
      }
    );

    const session = await stripeResp.json();

    if (!stripeResp.ok) {
      console.error('Stripe error:', session);
      return jsonResponse(
        { error: session.error?.message || 'Error de Stripe' },
        500
      );
    }

    return jsonResponse({ url: session.url, id: session.id }, 200);
  } catch (err) {
    console.error('Checkout exception:', err);
    return jsonResponse({ error: err.message || 'Error al crear sesión' }, 500);
  }
}

// Helper para añadir el shipping option
function appendShipping(form, amountCents, displayName) {
  form.append('shipping_options[0][shipping_rate_data][type]', 'fixed_amount');
  form.append('shipping_options[0][shipping_rate_data][fixed_amount][amount]', String(amountCents));
  form.append('shipping_options[0][shipping_rate_data][fixed_amount][currency]', 'eur');
  form.append('shipping_options[0][shipping_rate_data][display_name]', displayName);
  form.append('shipping_options[0][shipping_rate_data][delivery_estimate][minimum][unit]', 'business_day');
  form.append('shipping_options[0][shipping_rate_data][delivery_estimate][minimum][value]', '1');
  form.append('shipping_options[0][shipping_rate_data][delivery_estimate][maximum][unit]', 'business_day');
  form.append('shipping_options[0][shipping_rate_data][delivery_estimate][maximum][value]', '2');
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
