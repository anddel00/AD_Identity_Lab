// CONFIGURATION
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xykddzpe";
const PRELOADER_CONFIG = {
  progressInterval: 70,
  minIncrement: 3,
  maxIncrement: 12,
  implosionDelay: 300,
  contentFadeDelay: 300,
  blueLayerDelay: 300,
  removeDelay: 1000
};
const SCROLL_CONFIG = {
  headerHideThreshold: 100,
  blueBackgroundThreshold: 150,
  headerOverlapThreshold: 80,
  fadeDistance: 800,
  observerThreshold: 0.15,
  observerRootMargin: "0px 0px -50px 0px"
};

// PRELOADER LOGIC
function initPreloader() {
  const preloader = document.getElementById('intro-preloader');
  const introContent = document.querySelector('.intro-content');
  const counterEl = document.querySelector('.intro-counter');
  const layerWhite = document.querySelector('.layer-white');
  const layerBlue = document.querySelector('.layer-blue');
  const isFirstVisit = !sessionStorage.getItem('ad_visited');

  sessionStorage.setItem('ad_visited', 'true');

  function updateProgress(progress) {
    if(counterEl) counterEl.innerText = progress + '%';
  }

  function animateProgress() {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * PRELOADER_CONFIG.maxIncrement) + PRELOADER_CONFIG.minIncrement;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        updateProgress(progress);
        setTimeout(() => triggerImplosion(true), PRELOADER_CONFIG.implosionDelay);
      } else {
        updateProgress(progress);
      }
    }, PRELOADER_CONFIG.progressInterval);
  }

  function triggerImplosion(shouldFadeContent) {
    if (shouldFadeContent && introContent) {
      introContent.style.opacity = '0';
      introContent.style.transform = 'translateY(-10px)';
    }

    const delayCollasso = shouldFadeContent ? PRELOADER_CONFIG.contentFadeDelay : 0;
    setTimeout(() => {
      document.body.classList.remove('is-loading');
      document.body.classList.add('start-animations');
      if(layerWhite) layerWhite.classList.add('collapse');

      setTimeout(() => {
        if(layerBlue) layerBlue.classList.add('collapse');
        setTimeout(() => { if(preloader) preloader.remove(); }, PRELOADER_CONFIG.removeDelay);
      }, PRELOADER_CONFIG.blueLayerDelay);
    }, delayCollasso);
  }

  if (isFirstVisit) {
    animateProgress();
  } else {
    if(introContent) introContent.style.display = 'none';
    setTimeout(() => triggerImplosion(false), 50);
  }
}

// MOUSE FLASHLIGHT EFFECT
function initMouseFlashlight() {
  document.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
    document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');
  });
}

// HEADER VISIBILITY
function updateHeaderVisibility(scrollY, lastScrollTop, header) {
  if (scrollY > lastScrollTop && scrollY > SCROLL_CONFIG.headerHideThreshold) {
    header.classList.add('header-hidden');
  } else {
    header.classList.remove('header-hidden');
  }
  return scrollY <= 0 ? 0 : scrollY;
}

// HEADER COLOR LOGIC
function updateHeaderColor(scrollY, header, contentScroller) {
  const scrollerTop = contentScroller ? contentScroller.getBoundingClientRect().top : 1000;
  const isOverBlue = scrollY > SCROLL_CONFIG.blueBackgroundThreshold && scrollerTop > SCROLL_CONFIG.headerOverlapThreshold;
  header.classList.toggle('over-blue', isOverBlue);
}

// HERO ANIMATION (IRIS WIPE)
function updateHeroAnimation(scrollY, heroContentMask, heroWrapper) {
  if (!heroContentMask || !heroWrapper || scrollY > SCROLL_CONFIG.fadeDistance + 200) return;

  const progress = Math.min(scrollY / SCROLL_CONFIG.fadeDistance, 1);
  const scale = 1 - (progress * 0.8);
  const radius = Math.max(0, 150 - (progress * 400));

  heroWrapper.style.transform = `scale(${scale})`;
  heroContentMask.style.clipPath = `circle(${radius}% at 50% 50%)`;
  heroContentMask.style.webkitClipPath = `circle(${radius}% at 50% 50%)`;
}

// UNIFIED SCROLL ENGINE
function initScrollEngine() {
  let lastScrollTop = 0;
  const header = document.querySelector('header');
  const heroContentMask = document.querySelector('.hero-content-mask');
  const heroWrapper = document.querySelector('.hero-wrapper');
  const contentScroller = document.querySelector('.content-scroller');

  window.addEventListener('scroll', () => {
    requestAnimationFrame(() => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      if(header) {
        lastScrollTop = updateHeaderVisibility(scrollY, lastScrollTop, header);
        updateHeaderColor(scrollY, header, contentScroller);
      }
      updateHeroAnimation(scrollY, heroContentMask, heroWrapper);
    });
  });
}

// INTERSECTION OBSERVER
function initRevealObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: SCROLL_CONFIG.observerThreshold,
    rootMargin: SCROLL_CONFIG.observerRootMargin
  });

  document.querySelectorAll('.why-item, .section-title, .pricing-wrapper, .custom-plan-banner')
    .forEach(item => observer.observe(item));
}

// EXPAND/COLLAPSE CARDS
function initExpandTriggers() {
  function toggleCardExpansion(item, wrapper, textSpan) {
    const isExpanded = item.classList.toggle('expanded');
    textSpan.innerText = isExpanded ? 'Riduci' : 'Leggi tutto';
    wrapper.style.maxHeight = isExpanded ? wrapper.scrollHeight + "px" : "90px";
  }

  document.querySelectorAll('.expand-trigger').forEach(btn => {
    btn.addEventListener('click', function() {
      const item = this.closest('.why-item');
      const wrapper = item.querySelector('.text-expand-wrapper');
      const textSpan = this.querySelector('.btn-text');
      toggleCardExpansion(item, wrapper, textSpan);
    });
  });
}

// MOBILE MENU
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const menuOverlay = document.querySelector('.mobile-menu-overlay');
  const rippleWhiteMenu = document.querySelector('.ripple-white-menu');
  const rippleBlueMenu = document.querySelector('.ripple-blue-menu');

  if(!menuToggle) return;

  function toggleMenu() {
    menuToggle.classList.toggle('active');
    rippleWhiteMenu.classList.toggle('active');
    rippleBlueMenu.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    document.body.style.overflow = menuOverlay.classList.contains('active') ? 'hidden' : 'auto';
  }

  menuToggle.addEventListener('click', toggleMenu);
  document.querySelectorAll('.mobile-nav-link').forEach(link =>
    link.addEventListener('click', toggleMenu)
  );
}

// UTILITY FORM SUBMIT (Riutilizzabile per entrambi i form)
function handleFormSubmission(e, formId, container, btnId, successHTML, privacyIds) {
  if (e.target.id !== formId) return;
  e.preventDefault();

  // Controllo Privacy
  const privacyCheckbox = document.getElementById(privacyIds.checkbox);
  const privacyCheckmark = document.getElementById(privacyIds.checkmark);
  const privacyError = document.getElementById(privacyIds.error);

  if (privacyCheckbox && !privacyCheckbox.checked) {
    privacyCheckmark.classList.add('error-border');
    privacyError.classList.add('show');
    return;
  }

  // Prepara pulsante
  const btn = document.getElementById(btnId);
  btn.innerText = "Invio in corso...";
  btn.style.opacity = "0.7";
  btn.style.pointerEvents = "none";

  // Invia a Formspree
  fetch(FORMSPREE_ENDPOINT, {
    method: 'POST',
    body: new FormData(e.target),
    headers: { 'Accept': 'application/json' }
  }).then(response => {
    if (response.ok) {
      container.innerHTML = successHTML;
    } else {
      btn.innerText = "Errore. Riprova.";
      btn.style.opacity = "1";
      btn.style.pointerEvents = "auto";
    }
  }).catch(error => {
    btn.innerText = "Errore di rete.";
    btn.style.opacity = "1";
    btn.style.pointerEvents = "auto";
  });
}

// FUNZIONE PER RIMUOVERE L'ERRORE PRIVACY AL CLICK
function initPrivacyClearError(checkboxId, checkmarkId, errorId) {
  const checkbox = document.getElementById(checkboxId);
  if(checkbox) {
    checkbox.addEventListener('change', function() {
      if(this.checked) {
        document.getElementById(checkmarkId).classList.remove('error-border');
        document.getElementById(errorId).classList.remove('show');
      }
    });
  }
}

// MODAL LOGIC: PLAN MODAL (Modello 1)
function initPlanModal() {
  const planModal = document.getElementById('planModal');
  const closePlanModal = document.getElementById('closePlanModal');
  const planContainer = document.getElementById('planFormContainer');
  if(!planModal || !planContainer) return;

  const originalPlanHTML = planContainer.innerHTML;

  function hidePlanModal() {
    planModal.classList.remove('active');
    setTimeout(() => planContainer.innerHTML = originalPlanHTML, 300);
  }

  const successHTML = `
    <div style='text-align:center; padding: 30px 0;'>
      <svg width='60' height='60' style='color:var(--accent-color); margin-bottom:20px;' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'></path><polyline points='22 4 12 14.01 9 11.01'></polyline></svg>
      <h3 style='color:var(--text-color); font-family:var(--font-tech); font-size:1.5rem; margin-bottom:10px;'>Richiesta Inviata!</h3>
      <p style='color:var(--secondary-text); font-size:1rem;'>Abbiamo ricevuto i tuoi dati. Ti contatteremo a brevissimo.</p>
    </div>`;

  document.querySelectorAll('.btn-modal-trigger').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      // Fallback intelligente per il piano (uguale a progetti.js)
      let plan = btn.getAttribute('data-plan');
      if (!plan) {
        const card = btn.closest('.pricing-card');
        if (card) {
          const titleEl = card.querySelector('h3');
          if (titleEl) plan = titleEl.innerText;
        }
      }

      const input = document.getElementById('selectedPlanInput');
      if(input && plan) {
        input.value = plan;
        input.setAttribute('value', plan);
      }

      planModal.classList.add('active');
    });
  });

  closePlanModal.addEventListener('click', hidePlanModal);
  planModal.addEventListener('click', (e) => { if (e.target === planModal) hidePlanModal(); });

  planContainer.addEventListener('submit', (e) => handleFormSubmission(
    e, 'planForm', planContainer, 'generatePlanBtn', successHTML,
    { checkbox: 'privacyConsentPlan', checkmark: 'privacyCheckmarkPlan', error: 'privacyErrorPlan' }
  ));

  initPrivacyClearError('privacyConsentPlan', 'privacyCheckmarkPlan', 'privacyErrorPlan');
}

// MODAL LOGIC: CUSTOM MODAL (Analisi Personalizzata)
function initCustomModal() {
  const customModal = document.getElementById('customPlanModal');
  const closeCustomBtn = document.getElementById('closeCustomModal');
  const customContainer = document.getElementById('customFormContainer');
  if(!customModal || !customContainer) return;

  const originalCustomHTML = customContainer.innerHTML;

  // ECCO LA MAGIA: Cerca sia l'ID del banner sia i link con la classe nel footer
  document.querySelectorAll('#openCustomModalBtn, .open-custom-modal').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      customModal.classList.add('active');
    });
  });

  function hideCustomModal() {
    customModal.classList.remove('active');
    setTimeout(() => customContainer.innerHTML = originalCustomHTML, 300);
  }

  closeCustomBtn.addEventListener('click', hideCustomModal);
  customModal.addEventListener('click', (e) => { if(e.target === customModal) hideCustomModal(); });

  const successHTML = `
    <div style='text-align:center; padding: 30px 0;'>
      <svg width='60' height='60' style='color:var(--accent-color); margin-bottom:20px;' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'></path><polyline points='22 4 12 14.01 9 11.01'></polyline></svg>
      <h3 style='color:var(--text-color); font-family:var(--font-tech); font-size:1.5rem; margin-bottom:10px;'>Messaggio Inviato!</h3>
      <p style='color:var(--secondary-text); font-size:1rem;'>Analizzeremo la tua situazione e ti scriveremo presto.</p>
    </div>`;

  customContainer.addEventListener('submit', (e) => handleFormSubmission(
    e, 'customForm', customContainer, 'sendCustomEmailBtn', successHTML,
    { checkbox: 'privacyConsentCustom', checkmark: 'privacyCheckmarkCustom', error: 'privacyErrorCustom' }
  ));

  initPrivacyClearError('privacyConsentCustom', 'privacyCheckmarkCustom', 'privacyErrorCustom');
}

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initScrollEngine();
  initRevealObserver();
  initExpandTriggers();
  initMobileMenu();
  initPlanModal();
  initCustomModal();
});

initMouseFlashlight();
