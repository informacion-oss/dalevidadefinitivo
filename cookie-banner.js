 / ─── COOKIE CONSENT ────────────────────────────────────────────────────────
(function () {
  const CONSENT_KEY = "dalevida_cookie_consent";
 
  function getConsent() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
  }
  function setConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (e) {}
  }
  function enableAnalytics() {
    if (typeof gtag === "function") {
      gtag("consent", "update", { analytics_storage: "granted", ad_storage: "denied" });
    }
  }
  function disableAnalytics() {
    if (typeof gtag === "function") {
      gtag("consent", "update", { analytics_storage: "denied", ad_storage: "denied" });
    }
  }
  function removeBanner() {
    const banner = document.getElementById("dv-cookie-banner");
    if (banner) {
      banner.style.transform = "translateY(120%)";
      banner.style.opacity = "0";
      setTimeout(() => banner.remove(), 400);
    }
  }
  function acceptAll() { setConsent("all"); enableAnalytics(); removeBanner(); }
  function acceptEssential() { setConsent("essential"); disableAnalytics(); removeBanner(); }
 
  function showBanner() {
    const banner = document.createElement("div");
    banner.id = "dv-cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Aviso de cookies");
    banner.style.cssText = `
      position:fixed; bottom:24px; left:50%;
      transform:translateX(-50%) translateY(120%);
      width:calc(100% - 32px); max-width:680px;
      background:#ffffff; border:1px solid #c0c9bb; border-radius:20px;
      padding:20px 24px; z-index:9999;
      box-shadow:0 8px 32px rgba(43,90,62,0.15);
      display:flex; flex-direction:column; gap:14px;
      transition:transform 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.4s;
      font-family:'DM Sans','Plus Jakarta Sans',system-ui,sans-serif;
    `;
    banner.innerHTML = `
      <div style="display:flex;align-items:flex-start;gap:12px;">
        <span style="font-size:24px;flex-shrink:0;">🍪</span>
        <div>
          <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#2B5A3E;font-family:'Plus Jakarta Sans',sans-serif;">Usamos cookies</p>
          <p style="margin:0;font-size:13px;color:#41493e;line-height:1.5;">
            Utilizamos cookies propias y de terceros para analizar el uso de la web y mejorar tu experiencia. Puedes aceptarlas todas o solo las esenciales.
            <a href="cookies.html" style="color:#7DC142;font-weight:600;text-decoration:none;">Más información</a>
          </p>
        </div>
      </div>
      <div style="display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap;">
        <button id="dv-cookie-essential" style="
          background:transparent;border:1.5px solid #2B5A3E;color:#2B5A3E;
          padding:10px 20px;border-radius:999px;font-size:13px;font-weight:600;
          cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;white-space:nowrap;
          transition:background 0.2s;">Solo esenciales</button>
        <button id="dv-cookie-accept" style="
          background:#2B5A3E;border:none;color:white;
          padding:10px 24px;border-radius:999px;font-size:13px;font-weight:700;
          cursor:pointer;font-family:'Plus Jakarta Sans',sans-serif;white-space:nowrap;
          transition:opacity 0.2s;">Aceptar todo</button>
      </div>
    `;
    document.body.appendChild(banner);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        banner.style.transform = "translateX(-50%) translateY(0)";
        banner.style.opacity = "1";
      });
    });
    document.getElementById("dv-cookie-accept").addEventListener("click", acceptAll);
    document.getElementById("dv-cookie-essential").addEventListener("click", acceptEssential);
    const essBtn = document.getElementById("dv-cookie-essential");
    essBtn.addEventListener("mouseenter", () => essBtn.style.background = "#f7faf3");
    essBtn.addEventListener("mouseleave", () => essBtn.style.background = "transparent");
    const accBtn = document.getElementById("dv-cookie-accept");
    accBtn.addEventListener("mouseenter", () => accBtn.style.opacity = "0.88");
    accBtn.addEventListener("mouseleave", () => accBtn.style.opacity = "1");
  }
 
  if (typeof gtag === "function") {
    gtag("consent", "default", { analytics_storage: "denied", ad_storage: "denied" });
  }
  const existing = getConsent();
  if (existing === "all") { enableAnalytics(); }
  else if (existing === "essential") { disableAnalytics(); }
  else {
    if (document.readyState === "loading") { document.addEventListener("DOMContentLoaded", showBanner); }
    else { setTimeout(showBanner, 800); }
  }
})();
 
 
// ─── SCHEMA MARKUP (JSON-LD) ────────────────────────────────────────────────
(function () {
  const BASE_URL = "https://dalevidatienda.com";
 
  // Datos de cada página de producto
  const PRODUCTS = {
    "/espino-amarillo.html": {
      name: "Espino Amarillo 500mg — Omega 3/6/7/9",
      description: "Aceite de Espino Amarillo en perlas, rico en Omega 7 natural. 110 perlas de 500mg para la salud de la piel, mucosas y sistema cardiovascular. Sin gluten, vegano.",
      image: BASE_URL + "/assets/img/espino-amarillo.jpg",
      price: "16.00",
      sku: "DV-ESPINO-001",
      rating: "5",
      reviewCount: "20",
      category: "Suplementos naturales"
    },
    "/nad-resveratrol.html": {
      name: "NAD+ Trans Resveratrol 300mg",
      description: "Fórmula avanzada anti-envejecimiento celular con NAD+ y Trans Resveratrol. 60 cápsulas veganas para energía celular y longevidad.",
      image: BASE_URL + "/assets/img/nad-resveratrol.png",
      price: "18.00",
      sku: "DV-NAD-001",
      rating: "5",
      reviewCount: "15",
      category: "Suplementos naturales"
    },
    "/ashwagandha.html": {
      name: "Ashwagandha KSM-66® 600mg",
      description: "Ashwagandha certificada KSM-66® con 5% de withanólidos para reducir el estrés y el cortisol. 60 cápsulas veganas.",
      image: BASE_URL + "/assets/img/ashwagandha.jpg",
      price: "18.00",
      sku: "DV-ASHWA-001",
      rating: "5",
      reviewCount: "10",
      category: "Suplementos naturales"
    },
    "/vitamina-d3-k2.html": {
      name: "Vitamina D3 4000 UI + K2 MK-7 200mcg",
      description: "El dúo esencial de Vitamina D3 y K2 MK-7 para huesos, sistema inmune y salud cardiovascular. 120 cápsulas.",
      image: BASE_URL + "/assets/img/vitamina-d3-k2.jpg",
      price: "14.00",
      sku: "DV-D3K2-001",
      rating: "5",
      reviewCount: "12",
      category: "Suplementos naturales"
    },
    "/citrato-magnesio.html": {
      name: "Citrato de Magnesio 800mg",
      description: "Magnesio en forma de citrato de máxima absorción para combatir el cansancio, los calambres y mejorar el sueño. 120 cápsulas.",
      image: BASE_URL + "/assets/img/citrato-magnesio.png",
      price: "18.00",
      sku: "DV-MAG-001",
      rating: "5",
      reviewCount: "25",
      category: "Suplementos naturales"
    },
    "/maca.html": {
      name: "Maca Andina 10:1 — Concentrado Premium",
      description: "Extracto concentrado 10:1 de Maca andina peruana para energía, vitalidad, libido y equilibrio hormonal natural. 90 cápsulas veganas.",
      image: BASE_URL + "/assets/img/maca.png",
      price: "15.00",
      sku: "DV-MACA-001",
      rating: "4",
      reviewCount: "8",
      category: "Suplementos naturales"
    }
  };
 
  function injectSchema(schema) {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);
  }
 
  function init() {
    const path = window.location.pathname;
 
    // ── Organization schema (todas las páginas) ──
    injectSchema({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "DaleVida",
      "url": BASE_URL,
      "logo": BASE_URL + "/favicon.svg",
      "description": "Suplementos naturales de grado farmacéutico para vitalidad y bienestar. Hecho en España.",
      "email": "informacion@mbmonlinecommerce.com",
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "informacion@mbmonlinecommerce.com",
        "contactType": "customer service",
        "availableLanguage": "Spanish"
      },
      "sameAs": []
    });
 
    // ── WebSite schema (homepage) ──
    if (path === "/" || path === "/index.html") {
      injectSchema({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "DaleVida",
        "url": BASE_URL,
        "description": "Suplementos naturales premium — Espino Amarillo, Ashwagandha KSM-66, NAD+ Resveratrol, Vitamina D3+K2, Maca y Magnesio.",
        "potentialAction": {
          "@type": "SearchAction",
          "target": BASE_URL + "/productos.html?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      });
    }
 
    // ── ItemList schema (catálogo) ──
    if (path === "/productos.html") {
      injectSchema({
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Suplementos Naturales DaleVida",
        "description": "Catálogo completo de suplementos naturales premium de DaleVida.",
        "url": BASE_URL + "/productos.html",
        "numberOfItems": 6,
        "itemListElement": Object.entries(PRODUCTS).map(([url, p], i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "name": p.name,
          "url": BASE_URL + url
        }))
      });
    }
 
    // ── Product schema (páginas individuales) ──
    const product = PRODUCTS[path];
    if (product) {
      injectSchema({
        "@context": "https://schema.org",
        "@type": "Product",
        "name": product.name,
        "description": product.description,
        "image": product.image,
        "sku": product.sku,
        "brand": {
          "@type": "Brand",
          "name": "DaleVida"
        },
        "category": product.category,
        "offers": {
          "@type": "Offer",
          "price": product.price,
          "priceCurrency": "EUR",
          "availability": "https://schema.org/InStock",
          "url": BASE_URL + path,
          "seller": {
            "@type": "Organization",
            "name": "DaleVida"
          },
          "shippingDetails": {
            "@type": "OfferShippingDetails",
            "shippingRate": {
              "@type": "MonetaryAmount",
              "value": "4.99",
              "currency": "EUR"
            },
            "shippingDestination": {
              "@type": "DefinedRegion",
              "addressCountry": "ES"
            },
            "deliveryTime": {
              "@type": "ShippingDeliveryTime",
              "handlingTime": {
                "@type": "QuantitativeValue",
                "minValue": 0,
                "maxValue": 1,
                "unitCode": "DAY"
              },
              "transitTime": {
                "@type": "QuantitativeValue",
                "minValue": 1,
                "maxValue": 2,
                "unitCode": "DAY"
              }
            }
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": product.rating,
          "bestRating": "5",
          "worstRating": "1",
          "reviewCount": product.reviewCount
        }
      });
 
      // ── BreadcrumbList schema ──
      injectSchema({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Inicio", "item": BASE_URL + "/" },
          { "@type": "ListItem", "position": 2, "name": "Productos", "item": BASE_URL + "/productos.html" },
          { "@type": "ListItem", "position": 3, "name": product.name, "item": BASE_URL + path }
        ]
      });
    }
 
    // ── FAQPage schema (página de reseñas) ──
    if (path === "/resenas.html") {
      injectSchema({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Reseñas de clientes — DaleVida",
        "description": "Opiniones verificadas de clientes de DaleVida sobre suplementos naturales.",
        "url": BASE_URL + "/resenas.html",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "bestRating": "5",
          "worstRating": "1",
          "reviewCount": "90"
        }
      });
    }
  }
 
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
