
  // LOGICA PRELOADER INTELLIGENTE
  document.addEventListener('DOMContentLoaded', () => {
  const preloader = document.getElementById('intro-preloader');
  const introContent = document.querySelector('.intro-content');
  const counterEl = document.querySelector('.intro-counter');
  const layerWhite = document.querySelector('.layer-white');
  const layerBlue = document.querySelector('.layer-blue');

  const isFirstVisit = !sessionStorage.getItem('ad_visited');
  sessionStorage.setItem('ad_visited', 'true');

  if (isFirstVisit) {
  let progress = 0;
  const interval = setInterval(() => {
  progress += Math.floor(Math.random() * 12) + 3;
  if (progress >= 100) {
  progress = 100;
  clearInterval(interval);
  counterEl.innerText = progress + '%';
  setTimeout(triggerImplosion, 300);
} else {
  counterEl.innerText = progress + '%';
}
}, 70);
} else {
  introContent.style.display = 'none';
  setTimeout(triggerImplosion, 50);
}

  function triggerImplosion() {
  if(isFirstVisit) {
  introContent.style.opacity = '0';
  introContent.style.transform = 'translateY(-10px)';
}

  const delayCollasso = isFirstVisit ? 300 : 0;

  setTimeout(() => {
  document.body.classList.remove('is-loading');
  document.body.classList.add('start-animations');
  layerWhite.classList.add('collapse');

  setTimeout(() => {
  layerBlue.classList.add('collapse');
  setTimeout(() => { preloader.remove(); }, 1000);
}, 300);
}, delayCollasso);
}
});

  // Logica Mouse Torcia
  document.addEventListener('mousemove', (e) => {
  document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
  document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');
});

  document.addEventListener('DOMContentLoaded', () => {

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

  // 2. COLORE DINAMICO (Bianco sul blu, Nero sul bianco)
  // Calcola a che distanza si trova il "sipario" bianco superiore
  let scrollerTop = contentScroller ? contentScroller.getBoundingClientRect().top : 1000;

  // Se siamo scesi oltre i 150px (appare il blu) E il sipario bianco è ancora sotto l'header (> 80px)
  if (scrollY > 150 && scrollerTop > 80) {
  header.classList.add('over-blue'); // Testo Bianco
} else {
  header.classList.remove('over-blue'); // Torna Nero
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
  // --- FINE MOTORE UNIFICATO ---

  // Fade In Observer per le card e i titoli
  const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
  if (entry.isIntersecting) {
  entry.target.classList.add('revealed');
  observer.unobserve(entry.target);
}
});
}, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

  document.querySelectorAll('.why-item, .section-title, .pricing-wrapper, .custom-plan-banner').forEach(item => observer.observe(item));

  document.querySelectorAll('.expand-trigger').forEach(btn => {
  btn.addEventListener('click', function() {
  const item = this.closest('.why-item');
  const wrapper = item.querySelector('.text-expand-wrapper');
  const textSpan = this.querySelector('.btn-text');

  item.classList.toggle('expanded');

  if(item.classList.contains('expanded')) {
  textSpan.innerText = 'Riduci';
  // Imposta l'altezza esattamente alla misura reale del contenuto
  wrapper.style.maxHeight = wrapper.scrollHeight + "px";
} else {
  textSpan.innerText = 'Leggi tutto';
  // Riporta la card alla sua altezza di partenza tronca
  wrapper.style.maxHeight = "90px";
}
});
});

  // MOBILE MENU
  const menuToggle = document.querySelector('.menu-toggle');
  const menuOverlay = document.querySelector('.mobile-menu-overlay');
  const rippleWhiteMenu = document.querySelector('.ripple-white-menu');
  const rippleBlueMenu = document.querySelector('.ripple-blue-menu');
  const body = document.body;

  function toggleMenu() {
  menuToggle.classList.toggle('active');
  rippleWhiteMenu.classList.toggle('active');
  rippleBlueMenu.classList.toggle('active');
  menuOverlay.classList.toggle('active');
  body.style.overflow = menuOverlay.classList.contains('active') ? 'hidden' : 'auto';
}

  menuToggle.addEventListener('click', toggleMenu);
  document.querySelectorAll('.mobile-nav-link').forEach(l => l.addEventListener('click', toggleMenu));

  //FORMSPREE LINK PER INVIO EMAIL DIRETTO DA FORM
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xykddzpe";

  // --- MODAL LOGIC 1: SELEZIONE PIANO ---
  const planModal = document.getElementById('planModal');
  const closePlanModal = document.getElementById('closePlanModal');
  const planForm = document.getElementById('planForm');
  const planContainer = document.getElementById('planFormContainer');
  let originalPlanHTML = planContainer.innerHTML;

  document.querySelectorAll('.btn-modal-trigger').forEach(btn => {
  btn.addEventListener('click', (e) => {
  e.preventDefault();
  const plan = btn.getAttribute('data-plan');
  document.getElementById('selectedPlanInput').value = plan;
  planModal.classList.add('active');
});
});

  function hidePlanModal() { planModal.classList.remove('active'); setTimeout(() => planContainer.innerHTML = originalPlanHTML, 300); }
  closePlanModal.addEventListener('click', hidePlanModal);
  planModal.addEventListener('click', (e) => { if(e.target === planModal) hidePlanModal(); });

  planContainer.addEventListener('submit', (e) => {
  if(e.target.id === 'planForm') {
  e.preventDefault();
  const btn = document.getElementById('generatePlanBtn');
  btn.innerText = "Invio in corso..."; btn.style.opacity = "0.7"; btn.style.pointerEvents = "none";

  fetch(FORMSPREE_ENDPOINT, {
  method: 'POST',
  body: new FormData(e.target),
  headers: { 'Accept': 'application/json' }
}).then(response => {
  if (response.ok) {
  planContainer.innerHTML = "<div style='text-align:center; padding: 30px 0;'><svg width='60' height='60' style='color:var(--accent-color); margin-bottom:20px;' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'></path><polyline points='22 4 12 14.01 9 11.01'></polyline></svg><h3 style='color:var(--text-color); font-family:var(--font-tech); font-size:1.5rem; margin-bottom:10px;'>Richiesta Inviata!</h3><p style='color:var(--secondary-text); font-size:1rem;'>Abbiamo ricevuto i tuoi dati. Ti contatteremo a brevissimo.</p></div>";
} else {
  btn.innerText = "Errore. Riprova."; btn.style.opacity = "1"; btn.style.pointerEvents = "auto";
}
}).catch(error => {
  btn.innerText = "Errore di rete."; btn.style.opacity = "1"; btn.style.pointerEvents = "auto";
});
}
});

  // --- MODAL LOGIC 2: ANALISI PERSONALIZZATA ---
  const customModal = document.getElementById('customPlanModal');
  const openCustomBtn = document.getElementById('openCustomModalBtn');
  const closeCustomBtn = document.getElementById('closeCustomModal');
  const customContainer = document.getElementById('customFormContainer');
  let originalCustomHTML = customContainer.innerHTML;

  if(openCustomBtn) {
  openCustomBtn.addEventListener('click', (e) => {
  e.preventDefault();
  customModal.classList.add('active');
});
}

  function hideCustomModal() { customModal.classList.remove('active'); setTimeout(() => customContainer.innerHTML = originalCustomHTML, 300); }
  closeCustomBtn.addEventListener('click', hideCustomModal);
  customModal.addEventListener('click', (e) => { if(e.target === customModal) hideCustomModal(); });

  customContainer.addEventListener('submit', (e) => {
  if(e.target.id === 'customForm') {
  e.preventDefault();
  const btn = document.getElementById('sendCustomEmailBtn');
  btn.innerText = "Invio in corso..."; btn.style.opacity = "0.7"; btn.style.pointerEvents = "none";

  fetch(FORMSPREE_ENDPOINT, {
  method: 'POST',
  body: new FormData(e.target),
  headers: { 'Accept': 'application/json' }
}).then(response => {
  if (response.ok) {
  customContainer.innerHTML = "<div style='text-align:center; padding: 30px 0;'><svg width='60' height='60' style='color:var(--accent-color); margin-bottom:20px;' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'></path><polyline points='22 4 12 14.01 9 11.01'></polyline></svg><h3 style='color:var(--text-color); font-family:var(--font-tech); font-size:1.5rem; margin-bottom:10px;'>Messaggio Inviato!</h3><p style='color:var(--secondary-text); font-size:1rem;'>Analizzeremo la tua situazione e ti scriveremo presto.</p></div>";
} else {
  btn.innerText = "Errore. Riprova."; btn.style.opacity = "1"; btn.style.pointerEvents = "auto";
}
}).catch(error => {
  btn.innerText = "Errore di rete."; btn.style.opacity = "1"; btn.style.pointerEvents = "auto";
});
}
});
});
