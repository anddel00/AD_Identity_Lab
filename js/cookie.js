document.addEventListener("DOMContentLoaded", () => {
  const cookieBanner = document.getElementById("cookieBanner");
  const acceptBtn = document.getElementById("acceptCookies");
  const rejectBtn = document.getElementById("rejectCookies");

  // Inserisci qui il tuo ID di Google Analytics (se lo hai)
  const GA_TRACKING_ID = "G-L8WQCDWVV4";

  // Funzione per iniettare Google Analytics SOLO se accettato
  function loadGoogleAnalytics() {
    if(!GA_TRACKING_ID || GA_TRACKING_ID === "G-L8WQCDWVV4") return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', GA_TRACKING_ID, { 'anonymize_ip': true });
  }

  // Controlla se l'utente ha già fatto una scelta
  const cookieConsent = localStorage.getItem("ad_cookie_consent");

  if (cookieConsent === "accepted") {
    // Ha già accettato in passato: carica GA senza mostrare il banner
    loadGoogleAnalytics();
  } else if (!cookieConsent) {
    // Non ha mai scelto: mostra il banner
    setTimeout(() => {
      cookieBanner.classList.add("show");
    }, 1500); // Appare 1.5 secondi dopo il caricamento della pagina
  }

  // Se l'utente clicca ACCETTA
  if(acceptBtn) {
    acceptBtn.addEventListener("click", () => {
      localStorage.setItem("ad_cookie_consent", "accepted");
      cookieBanner.classList.remove("show");
      loadGoogleAnalytics(); // Carica subito le statistiche
    });
  }

  // Se l'utente clicca RIFIUTA
  if(rejectBtn) {
    rejectBtn.addEventListener("click", () => {
      localStorage.setItem("ad_cookie_consent", "rejected");
      cookieBanner.classList.remove("show");
      // NON carica GA, rispetta la privacy
    });
  }
});
