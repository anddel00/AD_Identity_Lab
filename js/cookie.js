document.addEventListener("DOMContentLoaded", () => {
  const cookieBanner = document.getElementById("cookieBanner");
  const acceptBtn = document.getElementById("acceptCookies");
  const rejectBtn = document.getElementById("rejectCookies");

  // Il tuo VERO ID di Google Analytics 4
  const GA_TRACKING_ID = "G-L8WQCDWVV4";

  // Funzione per iniettare Google Analytics SOLO se accettato
  function loadGoogleAnalytics() {
    if(!GA_TRACKING_ID) return; // Controllo base (si ferma solo se l'ID è vuoto)

    // 1. Inizializza le variabili di GA PRIMA di caricare lo script esterno
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    // Configura il tracciamento (con IP anonimizzato per il GDPR)
    gtag('config', GA_TRACKING_ID, { 'anonymize_ip': true });

    // 2. Inietta lo script esterno di Google
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script);
  }

  // Controlla se l'utente ha già fatto una scelta salvata nel browser
  const cookieConsent = localStorage.getItem("ad_cookie_consent");

  if (cookieConsent === "accepted") {
    // Ha già accettato in passato: carica GA senza mostrare il banner
    loadGoogleAnalytics();
  } else if (!cookieConsent) {
    // Non ha mai scelto: mostra il banner
    if(cookieBanner) {
      setTimeout(() => {
        cookieBanner.classList.add("show");
      }, 1500); // Appare 1.5 secondi dopo il caricamento della pagina
    }
  }

  // Se l'utente clicca ACCETTA TUTTI
  if(acceptBtn) {
    acceptBtn.addEventListener("click", () => {
      localStorage.setItem("ad_cookie_consent", "accepted");
      if(cookieBanner) cookieBanner.classList.remove("show");
      loadGoogleAnalytics(); // Carica subito le statistiche!
    });
  }

  // Se l'utente clicca SOLO ESSENZIALI (Rifiuta)
  if(rejectBtn) {
    rejectBtn.addEventListener("click", () => {
      localStorage.setItem("ad_cookie_consent", "rejected");
      if(cookieBanner) cookieBanner.classList.remove("show");
      // NON carica GA, rispetta la privacy al 100%
    });
  }
});
