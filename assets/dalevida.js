/* ============================================================
   DaleVida - Shared JavaScript
   Cart system + Navigation + UI helpers
   ============================================================ */

// ----------------- PRODUCT CATALOG -----------------
const PRODUCTS = {
  "espino-amarillo": {
    id: "espino-amarillo",
    name: "Espino Amarillo",
    price: 16.00,
    image: "https://lh3.googleusercontent.com/aida/ADBb0uiAKpRvtqzwtt2i0R9rifvLOtX3alGNpznp1OgbFCwETMBpOWlpEGqcrUKu0IliXbrpRpSL-kMHCF1_YypsEUKLn3Mgx51_AN67oce1d6ICqRYmcGLW5ndi0LCR5B21n1geHzBmji8uXdfXaZGni-Rrj4vsJd2-XjV_MAKFW0dMpwYK8EI7EXW7t6zHgQa4bertUqQ4o7EccN2GlpBAsU6pJSXBVIVSyp667u9WIBben8axV8rv-IzbN_gVACRFQRspmzyROShRCw",
    description: "Omega-7 orgánico de alta pureza para regeneración celular y salud de la piel.",
    tags: ["60 cápsulas", "500mg", "Vegano"],
    rating: 5, ratingCount: 20, badge: "Más Popular"
  },
  "vitamina-d3-k2": {
    id: "vitamina-d3-k2",
    name: "Vitamina D3 + K2",
    price: 14.00,
    image: "https://lh3.googleusercontent.com/aida/ADBb0ugVpmLSxBMuuGDHA6KJLk9l8zeQN--GEr2vGnq1E_NMI72GQcZUpRqzFJSSVIf_cSQlbBuZX6US76rsW1oaXXsHeJWK_hgmsTpwzegTsuoZBQ6zdRuO3WEztFoTiaBuGRbdVYHULjwZgGKuSCEZuXN-DSgsmMGtLdh-LSeN8BFrJqcZP4lJoCzDw43ckaMWs-pW5kgvPTTAiPVH1Lh5WdBLli9JUGtt2VJhVy6VrCNqK573HD9noDeQ3FwYMfbMVRgw0PwqoIkQSQ",
    description: "Sinergia perfecta para absorción de calcio y refuerzo del sistema inmunológico.",
    tags: ["120 cápsulas", "4000 UI"],
    rating: 5, ratingCount: 12
  },
  "maca-10-1": {
    id: "maca-10-1",
    name: "Maca 10:1",
    price: 15.00,
    image: "https://lh3.googleusercontent.com/aida/ADBb0uj4SAGEHrA91PhchDCRBxiWk3Wl1OyKihrl6jbQdo8hEeZwg8TRHvirbJ8UqCCT5mRTJocRLP9yNZvMlLWT5itqa5ydB-qRhpz1lX3bMkSuwTc0HPiN5Q2gp3Rox1cx2NG66hFks4yMlqv_-6DXgRv1iHKA-ZuFUKEXt_gf5VzSOBaI7E1hDRFOQh12oQbxYMevhIZAYpUUs7gwjvv0Da2MFkX1rWbL10fCveoYVww5zw22-ZMXD28UoN7_O0CI9iH0cGm_XM22fg",
    description: "Concentrado de maca andina para vitalidad física, equilibrio hormonal y energía natural.",
    tags: ["90 cápsulas", "Orgánico"],
    rating: 4, ratingCount: 8
  },
  "nad-resveratrol": {
    id: "nad-resveratrol",
    name: "NAD+ Trans Resveratrol",
    price: 18.00,
    image: "https://lh3.googleusercontent.com/aida/ADBb0ugBgI4CFn9T6HfA6xJXB7mQajnMAv1D8k8cPLSWIu2f2B0FpgeWlxQC6yNpMCOQ_sN8McRK0I5eP2QYPnHDXNMTN-0oh6XiDvKVkX7zZ-0zo4hekPvJuqr22EqLM4cz9QjS40lBWiHsC4zeFqJe48nTus7lk0Mm-z7ME-Ea1Grs-_di_il6p0uUR_3BRb8km3PRmonrwZZ8CsRSf_f7h8nudtWpI6bglNvvnfupBAkCkJYX6bLl6RJvwYlHCte8NAvFt6QNpgOalg",
    description: "Fórmula avanzada anti-envejecimiento celular para optimizar la longevidad.",
    tags: ["60 cápsulas", "Vegano"],
    rating: 5, ratingCount: 15
  },
  "ashwagandha": {
    id: "ashwagandha",
    name: "Ashwagandha KSM-66",
    price: 18.00,
    image: "https://lh3.googleusercontent.com/aida/ADBb0ug3hXDD2ojlvwWZMRo6_LEWDAwXhFbPdFK6eiW4IUBBrhpSrQIGp9AKpj3uSinFZfvx4jOJhIWT3BNxZB-pKj6lethgWPlwGQSVsYCik57WcLUH7q6GQyHloviXbsxuT4PJ74P0_CL2jINI98zpeKomqRM63JoK6iSsUTSSldjMFDU6euJIb5dLyC2TjMrdZ860Dr1dOqcAXeHq3H7sOTsNYen4AhMrTcUKqB0HKMWDp_RXgWZ6lg-sSjbmAqLHLFn7BSuO4gfkAg",
    description: "Adaptógeno puro para la reducción del cortisol y gestión del estrés.",
    tags: ["60 cápsulas", "KSM-66®"],
    rating: 5, ratingCount: 10
  },
  "citrato-magnesio": {
    id: "citrato-magnesio",
    name: "Citrato de Magnesio",
    price: 18.00,
    image: "https://lh3.googleusercontent.com/aida/ADBb0ujc_cDvlGQD7oyhZwwbfUZbGfyE2Z5fpsck3aLUr9H_bj_wNR71zgiric4KOsckzGXBsBzrteu_3MhznAyxJ-2DOpkbEspf7E6ryqi27nSM7V1lUZ6TMief36Rwlqik_xZttZZaviAU9rrOv94u98sYKJ2yK_hhEiSUKLj4HTLI1Urk2A0Yr899ZKT_pwdRhgFjfdkZmgFHqGVSnucn6K2EhrTA7-VenYHU3zTpTp2a4yemGlSu0MKyAeNZ_dmI_rctD3UB9xWI",
    description: "Forma altamente biodisponible de magnesio para una absorción óptima.",
    tags: ["120 cápsulas", "800 mg", "Vegano"],
    rating: 5, ratingCount: 25
  }
};

// ----------------- CART STATE -----------------
const CART_KEY = "dalevida_cart_v1";
const SHIPPING_THRESHOLD = 40.00;
const SHIPPING_COST = 4.99;

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(productId, quantity = 1) {
  const product = PRODUCTS[productId];
  if (!product) return;
  const cart = getCart();
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ id: productId, name: product.name, price: product.price, image: product.image, quantity });
  }
  saveCart(cart);
  renderCart();
  showNotification(`${product.name} añadido al carrito`);
  openCart();
}

function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
  renderCart();
}

function updateCartQuantity(productId, change) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    saveCart(cart);
    renderCart();
  }
}

function cartSubtotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function cartItemCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0);
}

function formatPrice(value) {
  return value.toFixed(2).replace('.', ',') + " €";
}

// ----------------- CART UI RENDERING -----------------
function renderCart() {
  const subtotal = cartSubtotal();
  const itemCount = cartItemCount();
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : (subtotal > 0 ? SHIPPING_COST : 0);
  const total = subtotal + shipping;

  // Update cart badges everywhere
  document.querySelectorAll('[data-cart-count]').forEach(el => {
    el.textContent = itemCount;
    if (itemCount > 0) {
      el.classList.remove('opacity-0', 'scale-0');
      el.classList.add('opacity-100', 'scale-100');
    } else {
      el.classList.add('opacity-0', 'scale-0');
      el.classList.remove('opacity-100', 'scale-100');
    }
  });

  // Update cart items list
  const itemsContainer = document.getElementById('cart-items-container');
  const emptyMsg = document.getElementById('cart-empty-msg');
  const cartFooter = document.getElementById('cart-footer');

  if (itemsContainer) {
    const cart = getCart();
    // remove old items
    itemsContainer.querySelectorAll('.cart-item-row').forEach(el => el.remove());

    if (cart.length === 0) {
      if (emptyMsg) emptyMsg.style.display = 'flex';
      if (cartFooter) cartFooter.classList.add('opacity-50', 'pointer-events-none');
    } else {
      if (emptyMsg) emptyMsg.style.display = 'none';
      if (cartFooter) cartFooter.classList.remove('opacity-50', 'pointer-events-none');

      cart.forEach(item => {
        const row = document.createElement('div');
        row.className = 'cart-item-row flex gap-3 py-4 border-b border-neutral-100 last:border-0';
        row.innerHTML = `
          <div class="w-16 h-16 rounded-lg bg-neutral-50 flex-shrink-0 overflow-hidden">
            <img src="${item.image}" alt="${item.name}" class="w-full h-full object-contain p-2"/>
          </div>
          <div class="flex-grow min-w-0">
            <div class="flex justify-between items-start gap-2">
              <h4 class="text-sm font-bold text-[#2B5A3E] truncate">${item.name}</h4>
              <button onclick="removeFromCart('${item.id}')" class="material-symbols-outlined text-neutral-400 hover:text-red-500 text-[18px] flex-shrink-0">close</button>
            </div>
            <p class="text-xs text-neutral-500 mt-0.5">${formatPrice(item.price)} c/u</p>
            <div class="flex justify-between items-center mt-2">
              <div class="flex items-center bg-neutral-100 rounded-full text-xs">
                <button onclick="updateCartQuantity('${item.id}', -1)" class="material-symbols-outlined text-[14px] p-1.5 hover:text-[#2B5A3E]">remove</button>
                <span class="mx-2 font-bold text-[#2B5A3E]">${item.quantity}</span>
                <button onclick="updateCartQuantity('${item.id}', 1)" class="material-symbols-outlined text-[14px] p-1.5 hover:text-[#2B5A3E]">add</button>
              </div>
              <span class="text-sm font-bold text-[#2B5A3E]">${formatPrice(item.price * item.quantity)}</span>
            </div>
          </div>
        `;
        itemsContainer.appendChild(row);
      });
    }
  }

  // Update totals
  const subtotalEl = document.getElementById('cart-subtotal');
  if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal);

  const shippingEl = document.getElementById('cart-shipping');
  if (shippingEl) shippingEl.textContent = subtotal === 0 ? '—' : (shipping === 0 ? 'GRATIS' : formatPrice(shipping));
  const shippingElColor = document.getElementById('cart-shipping');
  if (shippingElColor) {
    shippingElColor.classList.toggle('text-[#7DC142]', shipping === 0 && subtotal > 0);
  }

  const totalEl = document.getElementById('cart-total');
  if (totalEl) totalEl.textContent = formatPrice(total);

  // Free shipping notice
  const notice = document.getElementById('free-shipping-notice');
  if (notice) {
    if (subtotal === 0) {
      notice.style.display = 'none';
    } else {
      notice.style.display = 'flex';
      if (subtotal >= SHIPPING_THRESHOLD) {
        notice.className = 'flex items-center gap-2 bg-[#7DC142]/10 border border-[#7DC142]/30 rounded-xl p-3 text-[#2B5A3E] text-xs font-semibold';
        notice.innerHTML = '<span class="material-symbols-outlined text-[18px]">check_circle</span><span>¡Tienes ENVÍO GRATIS en este pedido!</span>';
      } else {
        const remaining = (SHIPPING_THRESHOLD - subtotal);
        notice.className = 'flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-800 text-xs font-semibold';
        notice.innerHTML = `<span class="material-symbols-outlined text-[18px]">local_shipping</span><span>Añade <strong>${formatPrice(remaining)}</strong> más para envío GRATIS</span>`;
      }
    }
  }
}

// ----------------- PANEL TOGGLES -----------------
function openCart() {
  const panel = document.getElementById('cart-panel');
  const backdrop = document.getElementById('overlay-backdrop');
  if (panel) panel.classList.add('active');
  if (backdrop) backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  const panel = document.getElementById('cart-panel');
  const backdrop = document.getElementById('overlay-backdrop');
  if (panel) panel.classList.remove('active');
  if (backdrop && !document.getElementById('mobile-menu')?.classList.contains('active')) {
    backdrop.classList.remove('active');
  }
  if (!document.getElementById('mobile-menu')?.classList.contains('active')) {
    document.body.style.overflow = '';
  }
}

function toggleCart() {
  const panel = document.getElementById('cart-panel');
  if (panel && panel.classList.contains('active')) {
    closeCart();
  } else {
    openCart();
  }
}

function openMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const backdrop = document.getElementById('overlay-backdrop');
  if (menu) menu.classList.add('active');
  if (backdrop) backdrop.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const backdrop = document.getElementById('overlay-backdrop');
  if (menu) menu.classList.remove('active');
  if (backdrop && !document.getElementById('cart-panel')?.classList.contains('active')) {
    backdrop.classList.remove('active');
  }
  if (!document.getElementById('cart-panel')?.classList.contains('active')) {
    document.body.style.overflow = '';
  }
}

function toggleMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  if (menu && menu.classList.contains('active')) {
    closeMobileMenu();
  } else {
    openMobileMenu();
  }
}

function closeAllPanels() {
  closeCart();
  closeMobileMenu();
}

// ----------------- NOTIFICATIONS -----------------
function showNotification(message) {
  let notification = document.getElementById('cart-notification');
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'cart-notification';
    notification.className = 'cart-notification';
    document.body.appendChild(notification);
  }
  notification.innerHTML = `<span class="material-symbols-outlined">check_circle</span><span>${message}</span>`;
  notification.classList.add('show');
  clearTimeout(notification._timeout);
  notification._timeout = setTimeout(() => {
    notification.classList.remove('show');
  }, 2500);
}

// ----------------- INIT -----------------
document.addEventListener('DOMContentLoaded', () => {
  renderCart();

  // Close panels on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllPanels();
  });
});
