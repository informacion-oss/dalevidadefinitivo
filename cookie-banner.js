(function () {
  const CONSENT_KEY = "dalevida_cookie_consent";
  const GA_ID = "G-15XP79BRJJ";

  function getConsent() {
    try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; }
  }

  function setConsent(value) {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (e) {}
  }

  function enableAnalytics() {
    if (typeof gtag === "function") {
      gtag("consent", "update", {
        analytics_storage: "granted",
        ad_storage: "denied"
      });
    }
  }

  function disableAnalytics() {
    if (typeof gtag === "function") {
      gtag("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied"
      });
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

  function acceptAll() {
    setConsent("all");
    enableAnalytics();
    removeBanner();
  }

  function acceptEssential() {
    setConsent("essential");
    disableAnalytics();
    removeBanner();
  }

  function showBanner() {
    const banner = document.createElement("div");
    banner.id = "dv-cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Aviso de cookies");
    banner.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(120%);
      width: calc(100% - 32px);
      max-width: 680px;
      background: #ffffff;
      border: 1px solid #c0c9bb;
      border-radius: 20px;
      padding: 20px 24px;
      z-index: 9999;
      box-shadow: 0 8px 32px rgba(43,90,62,0.15);
      display: flex;
      flex-direction: column;
      gap: 14px;
      transition: transform 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.4s;
      font-family: 'DM Sans', 'Plus Jakarta Sans', system-ui, sans-serif;
    `;

    banner.innerHTML = `
      <div style="display:flex; align-items:flex-start; gap:12px;">
        <span style="font-size:24px; flex-shrink:0;">🍪</span>
        <div>
          <p style="margin:0 0 4px; font-size:14px; font-weight:700; color:#2B5A3E; font-family:'Plus Jakarta Sans',sans-serif;">Usamos cookies</p>
          <p style="margin:0; font-size:13px; color:#41493e; line-height:1.5;">
            Utilizamos cookies propias y de terceros para analizar el uso de la web y mejorar tu experiencia. Puedes aceptarlas todas o solo las esenciales.
            <a href="cookies.html" style="color:#7DC142; font-weight:600; text-decoration:none;">Más información</a>
          </p>
        </div>
      </div>
      <div style="display:flex; gap:10px; justify-content:flex-end; flex-wrap:wrap;">
        <button id="dv-cookie-essential" style="
          background: transparent;
          border: 1.5px solid #2B5A3E;
          color: #2B5A3E;
          padding: 10px 20px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          white-space: nowrap;
          transition: background 0.2s;
        ">Solo esenciales</button>
        <button id="dv-cookie-accept" style="
          background: #2B5A3E;
          border: none;
          color: white;
          padding: 10px 24px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          white-space: nowrap;
          transition: opacity 0.2s;
        ">Aceptar todo</button>
      </div>
    `;

    document.body.appendChild(banner);

    // Animate in
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        banner.style.transform = "translateX(-50%) translateY(0)";
        banner.style.opacity = "1";
      });
    });

    document.getElementById("dv-cookie-accept").addEventListener("click", acceptAll);
    document.getElementById("dv-cookie-essential").addEventListener("click", acceptEssential);

    // Hover states
    const essBtn = document.getElementById("dv-cookie-essential");
    essBtn.addEventListener("mouseenter", () => essBtn.style.background = "#f7faf3");
    essBtn.addEventListener("mouseleave", () => essBtn.style.background = "transparent");

    const accBtn = document.getElementById("dv-cookie-accept");
    accBtn.addEventListener("mouseenter", () => accBtn.style.opacity = "0.88");
    accBtn.addEventListener("mouseleave", () => accBtn.style.opacity = "1");
  }

  // Default consent mode (before user decides)
  if (typeof gtag === "function") {
    gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied"
    });
  }

  // Check existing consent
  const existing = getConsent();
  if (existing === "all") {
    enableAnalytics();
  } else if (existing === "essential") {
    disableAnalytics();
  } else {
    // No consent yet — show banner when DOM ready
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", showBanner);
    } else {
      setTimeout(showBanner, 800);
    }
  }
})();
