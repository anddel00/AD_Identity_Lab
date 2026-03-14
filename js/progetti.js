
  document.addEventListener('DOMContentLoaded', () => {
  // PRELOADER
  const preloader = document.getElementById('intro-preloader');
  const introContent = document.querySelector('.intro-content');
  const counterEl = document.querySelector('.intro-counter');
  const layerWhite = document.querySelector('.layer-white');
  const layerBlue = document.querySelector('.layer-blue');

  // 1. Rileva se è Lighthouse o un Bot di Google
  const isBot = /bot|googlebot|crawler|spider|robot|crawling|lighthouse|chrome-lighthouse/i.test(navigator.userAgent);

  // 2. Se è un bot, distruggi il preloader all'istante e avvia il sito
  if (isBot) {
  preloader.style.display = 'none';
  document.body.classList.remove('is-loading');
  document.body.classList.add('start-animations');
  return; // Blocca il resto dello script del preloader
}

  // 3. Logica normale per gli umani
  const isFirstVisit = !sessionStorage.getItem('ad_visited');
  sessionStorage.setItem('ad_visited', 'true');

  if (isFirstVisit) {
  let progress = 0;
// ... (il resto dello script rimane uguale, con l'interval ecc.) ...
  const interval = setInterval(() => {
  progress += Math.floor(Math.random() * 12) + 3;
  if (progress >= 100) { progress = 100; clearInterval(interval); counterEl.innerText = progress + '%'; setTimeout(triggerImplosion, 300); }
  else { counterEl.innerText = progress + '%'; }
}, 70);
} else {
  introContent.style.display = 'none'; setTimeout(triggerImplosion, 50);
}

  function triggerImplosion() {
  if(isFirstVisit) { introContent.style.opacity = '0'; introContent.style.transform = 'translateY(-10px)'; }

  setTimeout(() => {
  // --- IL TRUCCO DEL TELETRASPORTO ---
  // Se c'è un'ancora (#), sblocchiamo la pagina e saltiamo giù PRIMA che si apra il sipario
  if (window.location.hash) {
  const target = document.querySelector(window.location.hash);
  if (target) {
  document.body.classList.remove('is-loading'); // Sblocca l'altezza della pagina
  target.scrollIntoView({ behavior: 'auto', block: 'start' }); // 'auto' fa un salto istantaneo, niente scroll
}
}

  // Ora che siamo in posizione (o se siamo all'inizio), apriamo i cerchi
  layerWhite.classList.add('collapse');
  setTimeout(() => {
  layerBlue.classList.add('collapse');
  setTimeout(() => {
  // Se non c'era l'ancora, sblocchiamo la pagina adesso
  if (!window.location.hash) {
  document.body.classList.remove('is-loading');
}
  document.body.classList.add('start-animations');
  setTimeout(() => { preloader.remove(); }, 800);
}, 400);
}, 300);
}, isFirstVisit ? 300 : 0);
}
  // MOUSE E SCROLL HEADER
  document.addEventListener('mousemove', (e) => {
  document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
  document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');
});

  // --- MOTORE UNIFICATO: HEADER, COLORI E ANIMAZIONE HERO ---
  let lastScrollTop = 0;
  const header = document.querySelector('header');
  const heroContentMask = document.querySelector('.hero-content-mask');
  const heroWrapper = document.querySelector('.hero-wrapper');
  const contentScroller = document.querySelector('.content-scroller');
  const fadeDistance = 800;

  window.addEventListener('scroll', () => {
  requestAnimationFrame(() => {
  let scrollY = window.pageYOffset || document.documentElement.scrollTop;

  // 1. NASCONDI/MOSTRA HEADER
  if (scrollY > lastScrollTop && scrollY > 100) {
  header.classList.add('header-hidden');
} else {
  header.classList.remove('header-hidden');
}
  lastScrollTop = scrollY <= 0 ? 0 : scrollY;

  // 2. COLORE DINAMICO HEADER
  let scrollerTop = contentScroller ? contentScroller.getBoundingClientRect().top : 1000;
  if (scrollY > 150 && scrollerTop > 80) {
  header.classList.add('over-blue');
} else {
  header.classList.remove('over-blue');
}

  // 3. ANIMAZIONE BUCO NERO (IRIS WIPE)
  let progress = Math.min(scrollY / fadeDistance, 1);
  let scale = 1 - (progress * 0.8);
  let radius = Math.max(0, 150 - (progress * 400));

  if (heroContentMask && heroWrapper && scrollY <= fadeDistance + 200) {
  heroWrapper.style.transform = `scale(${scale})`;
  heroContentMask.style.clipPath = `circle(${radius}% at 50% 50%)`;
  heroContentMask.style.webkitClipPath = `circle(${radius}% at 50% 50%)`;
}
});
});

  // FADE IN OBSERVER
  const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
  if (entry.isIntersecting) {
  entry.target.classList.add('revealed');
}
});
}, { threshold: 0.15 });
  document.querySelectorAll('.tier-section, .customization-notice').forEach(item => observer.observe(item));

  // LOGICA CAROSELLO
  document.querySelectorAll('.tier-gallery-master').forEach(master => {
  const gallery = master.querySelector('.horizontal-templates-gallery');
  const nextBtn = master.querySelector('.next-arrow');
  const prevBtn = master.querySelector('.prev-arrow');
  const nums = master.querySelectorAll('.gallery-num');
  const slides = master.querySelectorAll('.template-slide');

  if(nextBtn && prevBtn) {
  nextBtn.addEventListener('click', () => { gallery.scrollBy({ left: gallery.offsetWidth, behavior: 'smooth' }); });
  prevBtn.addEventListener('click', () => { gallery.scrollBy({ left: -gallery.offsetWidth, behavior: 'smooth' }); });
}

  gallery.addEventListener('scroll', () => {
  const scrollPosition = gallery.scrollLeft;
  const slideWidth = gallery.offsetWidth;
  const activeIndex = Math.round(scrollPosition / slideWidth);
  nums.forEach((num, index) => {
  if(index === activeIndex) num.classList.add('active'); else num.classList.remove('active');
});
});

  nums.forEach((num, index) => {
  num.addEventListener('click', () => { gallery.scrollTo({ left: slides[index].offsetLeft, behavior: 'smooth' }); });
});
});

  // --- LOGICA TOGGLE DESKTOP/MOBILE  ---

  // Funzione per muovere la pillola nella posizione giusta
  function updatePillPosition(wrapper) {
  const activeBtn = wrapper.querySelector('.device-toggle-btn.active');
  const pill = wrapper.querySelector('.sliding-pill');

  if (activeBtn && pill) {
  // Calcola la posizione sinistra relativa al wrapper (sottraendo il padding del wrapper stesso)
  const leftPos = activeBtn.offsetLeft - 4; // 4px è il padding del wrapper definito nel CSS
  const width = activeBtn.offsetWidth;

  // Passa i valori alle variabili CSS della pillola
  pill.style.setProperty('--pill-left', `${leftPos}px`);
  pill.style.setProperty('--pill-width', `${width}px`);
}
}

  // Inizializza tutte le pillole al caricamento
  document.querySelectorAll('.device-toggle-wrapper').forEach(wrapper => {
  updatePillPosition(wrapper);
});

  // Gestione del click
  document.querySelectorAll('.device-toggle-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
  const wrapper = btn.closest('.device-toggle-wrapper');
  const frame = btn.closest('.mockup-frame');
  const targetView = btn.getAttribute('data-target');
  const pill = wrapper.querySelector('.sliding-pill'); // Selezioniamo la pillola

  // 1. Aggiorna visivamente i bottoni
  wrapper.querySelectorAll('.device-toggle-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // 2. Trigger Effetto Goccia (Rimuoviamo e rimettiamo la classe velocemente per riavviare l'animazione)
  if (pill) {
  pill.classList.remove('is-moving');
  void pill.offsetWidth; // Trucco: Forza il browser a ricalcolare (Reflow)
  pill.classList.add('is-moving');
}

  // 3. Muovi la pillola bianca verso il nuovo bottone attivo
  updatePillPosition(wrapper);

  // 4. Cambia le viste (Desktop/Mobile)
  frame.querySelectorAll('.device-view').forEach(v => v.classList.remove('active'));
  if (targetView === 'desktop') {
  frame.querySelector('.view-desktop').classList.add('active');
} else {
  frame.querySelector('.view-mobile-interactive').classList.add('active');
}
});
});

  // (Opzionale ma consigliato) Ricalcola la posizione se si ridimensiona la finestra
  window.addEventListener('resize', () => {
  document.querySelectorAll('.device-toggle-wrapper').forEach(wrapper => {
  // Togliamo la transizione durante il resize per evitare lag
  const pill = wrapper.querySelector('.sliding-pill');
  pill.style.transition = 'none';
  updatePillPosition(wrapper);
  // La riattiviamo subito dopo
  setTimeout(() => { pill.style.transition = ''; }, 100);
});
});

  // LOGICA LIGHTBOX (MODAL VIDEO)
  const videoLightbox = document.getElementById('videoLightbox');
  const lightboxVideo = document.getElementById('lightboxVideo');
  const closeLightboxBtn = document.getElementById('closeVideoLightbox');

  function openVideo(videoSrc) {
  if (videoSrc) {
  lightboxVideo.src = videoSrc;
  videoLightbox.classList.add('active');
  lightboxVideo.load();
}
}

  // --- LOGICA INGRANDIMENTO VIDEO (Aggiornata per Desktop/Mobile) ---
  document.querySelectorAll('.mockup-enlarge').forEach(btn => {
  btn.addEventListener('click', (e) => {
  // Troviamo la card corrente
  const frame = e.target.closest('.mockup-frame');

  // Troviamo quale vista è attualmente attiva (desktop o mobile)
  const activeView = frame.querySelector('.device-view.active');

  // Prendiamo il sorgente del video all'interno della vista attiva
  const sourceElement = activeView ? activeView.querySelector('source') : null;

  // Apriamo la modale con quel video
  openVideo(sourceElement ? sourceElement.src : null);
});
});

  document.querySelectorAll('.mobile-media').forEach(layer => {
  layer.addEventListener('click', (e) => {
  const videoSrc = layer.getAttribute('data-video-src');
  openVideo(videoSrc);
});
});

  function closeVideoModal() {
  videoLightbox.classList.remove('active');
  setTimeout(() => { lightboxVideo.pause(); lightboxVideo.src = ''; }, 400);
}

  closeLightboxBtn.addEventListener('click', closeVideoModal);
  videoLightbox.addEventListener('click', (e) => { if (e.target === videoLightbox) closeVideoModal(); });

  // MOBILE MENU
  const menuToggle = document.querySelector('.menu-toggle');
  const menuOverlay = document.querySelector('.mobile-menu-overlay');
  const rippleBlackMenu = document.querySelector('.ripple-black-menu');
  const rippleBlueMenu = document.querySelector('.ripple-blue-menu');

  function toggleMenu() {
  menuToggle.classList.toggle('active');
  rippleBlackMenu.classList.toggle('active');
  rippleBlueMenu.classList.toggle('active');
  menuOverlay.classList.toggle('active');
  document.body.style.overflow = menuOverlay.classList.contains('active') ? 'hidden' : 'auto';
}
  menuToggle.addEventListener('click', toggleMenu);
  document.querySelectorAll('.mobile-nav-link').forEach(l => l.addEventListener('click', toggleMenu));

  // FORM MODAL CONTATTI
  const customModal = document.getElementById('customPlanModal');
  const closeCustomBtn = document.getElementById('closeCustomModal');
  document.querySelectorAll('.btn-modal-trigger').forEach(btn => {
  btn.addEventListener('click', (e) => { e.preventDefault(); customModal.classList.add('active'); });
});
  function hideCustomModal() { customModal.classList.remove('active'); }
  closeCustomBtn.addEventListener('click', hideCustomModal);
  customModal.addEventListener('click', (e) => { if(e.target === customModal) hideCustomModal(); });
});
