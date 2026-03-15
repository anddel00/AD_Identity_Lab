// CONFIGURATION
const CONFIG = {
  preloader: {
    progressInterval: 70,
    minIncrement: 3,
    maxIncrement: 12,
    implosionDelay: 300,
    whiteLayerDelay: 300,
    blueLayerDelay: 400,
    preloaderRemoveDelay: 800
  },
  scroll: {
    headerHideThreshold: 100,
    blueBackgroundThreshold: 150,
    headerOverlapThreshold: 80,
    fadeDistance: 800,
    observerThreshold: 0.15
  },
  animation: {
    modalCloseDelay: 400,
    pillTransitionReset: 100,
    pillPadding: 4
  },
  form: {
    endpoint: "https://formspree.io/f/xykddzpe"
  }
};

const BOT_USER_AGENTS = /bot|googlebot|crawler|spider|robot|crawling|lighthouse|chrome-lighthouse/i;

// DOM ELEMENTS CACHE
const elements = {
  preloader: null,
  introContent: null,
  counterEl: null,
  layerWhite: null,
  layerBlue: null,
  header: null,
  heroContentMask: null,
  heroWrapper: null,
  contentScroller: null,
  videoLightbox: null,
  lightboxVideo: null,
  closeLightboxBtn: null,
  menuToggle: null,
  menuOverlay: null,
  rippleBlackMenu: null,
  rippleBlueMenu: null,
  // Modale Piani
  planModal: null,
  closePlanBtn: null,
  planFormContainer: null,
  // Modale Custom
  customModal: null,
  closeCustomBtn: null,
  customFormContainer: null
};

// UTILITIES
function isBotUserAgent() { return BOT_USER_AGENTS.test(navigator.userAgent); }
function isFirstVisit() { return !sessionStorage.getItem('ad_visited'); }
function markVisited() { sessionStorage.setItem('ad_visited', 'true'); }

// PRELOADER MODULE
const PreloaderModule = {
  updateProgress(progress) { if(elements.counterEl) elements.counterEl.innerText = progress + '%'; },
  animateProgress(onComplete) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * CONFIG.preloader.maxIncrement) + CONFIG.preloader.minIncrement;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        this.updateProgress(progress);
        setTimeout(onComplete, CONFIG.preloader.implosionDelay);
      } else {
        this.updateProgress(progress);
      }
    }, CONFIG.preloader.progressInterval);
  },
  handleAnchorScroll() {
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) {
        document.body.classList.remove('is-loading');
        target.scrollIntoView({ behavior: 'auto', block: 'start' });
        return true;
      }
    }
    return false;
  },
  triggerImplosion(shouldFadeContent) {
    if (shouldFadeContent && elements.introContent) {
      elements.introContent.style.opacity = '0';
      elements.introContent.style.transform = 'translateY(-10px)';
    }
    const delayCollasso = shouldFadeContent ? CONFIG.preloader.implosionDelay : 0;
    setTimeout(() => {
      const hasAnchor = this.handleAnchorScroll();
      if(elements.layerWhite) elements.layerWhite.classList.add('collapse');
      setTimeout(() => {
        if(elements.layerBlue) elements.layerBlue.classList.add('collapse');
        setTimeout(() => {
          if (!hasAnchor) document.body.classList.remove('is-loading');
          document.body.classList.add('start-animations');
          setTimeout(() => { if(elements.preloader) elements.preloader.remove(); }, CONFIG.preloader.preloaderRemoveDelay);
        }, CONFIG.preloader.blueLayerDelay);
      }, CONFIG.preloader.whiteLayerDelay);
    }, delayCollasso);
  },
  skipForBots() {
    if(elements.preloader) elements.preloader.style.display = 'none';
    document.body.classList.remove('is-loading');
    document.body.classList.add('start-animations');
  },
  init() {
    if (isBotUserAgent()) { this.skipForBots(); return; }
    const firstVisit = isFirstVisit();
    markVisited();
    if (firstVisit) { this.animateProgress(() => this.triggerImplosion(true)); }
    else {
      if(elements.introContent) elements.introContent.style.display = 'none';
      setTimeout(() => this.triggerImplosion(false), 50);
    }
  }
};

// MOUSE FLASHLIGHT EFFECT
const MouseFlashlightModule = {
  init() {
    document.addEventListener('mousemove', (e) => {
      document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
      document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');
    });
  }
};

// SCROLL ENGINE MODULE
const ScrollEngineModule = {
  lastScrollTop: 0,
  updateHeaderVisibility(scrollY) {
    if(!elements.header) return;
    if (scrollY > this.lastScrollTop && scrollY > CONFIG.scroll.headerHideThreshold) { elements.header.classList.add('header-hidden'); }
    else { elements.header.classList.remove('header-hidden'); }
    this.lastScrollTop = scrollY <= 0 ? 0 : scrollY;
  },
  updateHeaderColor(scrollY) {
    if(!elements.header) return;
    const scrollerTop = elements.contentScroller ? elements.contentScroller.getBoundingClientRect().top : 1000;
    const isOverBlue = scrollY > CONFIG.scroll.blueBackgroundThreshold && scrollerTop > CONFIG.scroll.headerOverlapThreshold;
    elements.header.classList.toggle('over-blue', isOverBlue);
  },
  updateHeroAnimation(scrollY) {
    if (!elements.heroContentMask || !elements.heroWrapper || scrollY > CONFIG.scroll.fadeDistance + 200) return;
    const progress = Math.min(scrollY / CONFIG.scroll.fadeDistance, 1);
    const scale = 1 - (progress * 0.8);
    const radius = Math.max(0, 150 - (progress * 400));
    elements.heroWrapper.style.transform = `scale(${scale})`;
    elements.heroContentMask.style.clipPath = `circle(${radius}% at 50% 50%)`;
    elements.heroContentMask.style.webkitClipPath = `circle(${radius}% at 50% 50%)`;
  },
  handleScroll() {
    requestAnimationFrame(() => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      this.updateHeaderVisibility(scrollY);
      this.updateHeaderColor(scrollY);
      this.updateHeroAnimation(scrollY);
    });
  },
  init() { window.addEventListener('scroll', () => this.handleScroll()); }
};

// REVEAL OBSERVER MODULE
const RevealObserverModule = {
  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: CONFIG.scroll.observerThreshold });
    document.querySelectorAll('.tier-section, .customization-notice, .why-item, .section-title, .pricing-wrapper, .custom-plan-banner')
      .forEach(item => observer.observe(item));
  }
};

// CAROUSEL MODULE
const CarouselModule = {
  updateActiveIndicator(gallery, nums) {
    const scrollPosition = gallery.scrollLeft;
    const slideWidth = gallery.offsetWidth;
    const activeIndex = Math.round(scrollPosition / slideWidth);
    nums.forEach((num, index) => { num.classList.toggle('active', index === activeIndex); });
  },
  initGallery(master) {
    const gallery = master.querySelector('.horizontal-templates-gallery');
    const nextBtn = master.querySelector('.next-arrow');
    const prevBtn = master.querySelector('.prev-arrow');
    const nums = master.querySelectorAll('.gallery-num');
    const slides = master.querySelectorAll('.template-slide');

    if (nextBtn && prevBtn && gallery) {
      nextBtn.addEventListener('click', () => { gallery.scrollBy({ left: gallery.offsetWidth, behavior: 'smooth' }); });
      prevBtn.addEventListener('click', () => { gallery.scrollBy({ left: -gallery.offsetWidth, behavior: 'smooth' }); });
      gallery.addEventListener('scroll', () => this.updateActiveIndicator(gallery, nums));
      nums.forEach((num, index) => {
        num.addEventListener('click', () => {
          if(slides[index]) gallery.scrollTo({ left: slides[index].offsetLeft, behavior: 'smooth' });
        });
      });
    }
  },
  init() { document.querySelectorAll('.tier-gallery-master').forEach(master => this.initGallery(master)); }
};

// DEVICE TOGGLE MODULE
const DeviceToggleModule = {
  updatePillPosition(wrapper) {
    const activeBtn = wrapper.querySelector('.device-toggle-btn.active');
    const pill = wrapper.querySelector('.sliding-pill');
    if (activeBtn && pill) {
      const leftPos = activeBtn.offsetLeft - CONFIG.animation.pillPadding;
      const width = activeBtn.offsetWidth;
      pill.style.setProperty('--pill-left', `${leftPos}px`);
      pill.style.setProperty('--pill-width', `${width}px`);
    }
  },
  triggerPillAnimation(pill) {
    if (!pill) return;
    pill.classList.remove('is-moving');
    void pill.offsetWidth;
    pill.classList.add('is-moving');
  },
  switchDeviceView(frame, targetView) {
    frame.querySelectorAll('.device-view').forEach(v => v.classList.remove('active'));
    const viewSelector = targetView === 'desktop' ? '.view-desktop' : '.view-mobile-interactive';
    const target = frame.querySelector(viewSelector);
    if(target) target.classList.add('active');
  },
  handleToggleClick(btn) {
    const wrapper = btn.closest('.device-toggle-wrapper');
    const frame = btn.closest('.mockup-frame');
    const targetView = btn.getAttribute('data-target');
    const pill = wrapper.querySelector('.sliding-pill');
    if(!wrapper || !frame) return;
    wrapper.querySelectorAll('.device-toggle-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    this.triggerPillAnimation(pill);
    this.updatePillPosition(wrapper);
    this.switchDeviceView(frame, targetView);
  },
  handleResize() {
    document.querySelectorAll('.device-toggle-wrapper').forEach(wrapper => {
      const pill = wrapper.querySelector('.sliding-pill');
      if(pill) {
        pill.style.transition = 'none';
        this.updatePillPosition(wrapper);
        setTimeout(() => { pill.style.transition = ''; }, CONFIG.animation.pillTransitionReset);
      }
    });
  },
  init() {
    document.querySelectorAll('.device-toggle-wrapper').forEach(wrapper => { this.updatePillPosition(wrapper); });
    document.querySelectorAll('.device-toggle-btn').forEach(btn => { btn.addEventListener('click', () => this.handleToggleClick(btn)); });
    window.addEventListener('resize', () => this.handleResize());
  }
};

// VIDEO LIGHTBOX MODULE
const VideoLightboxModule = {
  openVideo(videoSrc) {
    if (!videoSrc || !elements.videoLightbox || !elements.lightboxVideo) return;
    elements.lightboxVideo.src = videoSrc;
    elements.videoLightbox.classList.add('active');
    elements.lightboxVideo.load();
  },
  closeVideo() {
    if (!elements.videoLightbox || !elements.lightboxVideo) return;
    elements.videoLightbox.classList.remove('active');
    setTimeout(() => {
      elements.lightboxVideo.pause();
      elements.lightboxVideo.src = '';
    }, CONFIG.animation.modalCloseDelay);
  },
  handleEnlargeClick(e) {
    const frame = e.target.closest('.mockup-frame');
    if(!frame) return;
    const activeView = frame.querySelector('.device-view.active');
    const sourceElement = activeView ? activeView.querySelector('source') : null;
    this.openVideo(sourceElement ? sourceElement.src : null);
  },
  handleMobileMediaClick(layer) {
    const videoSrc = layer.getAttribute('data-video-src');
    this.openVideo(videoSrc);
  },
  init() {
    document.querySelectorAll('.mockup-enlarge').forEach(btn => { btn.addEventListener('click', (e) => this.handleEnlargeClick(e)); });
    document.querySelectorAll('.mobile-media').forEach(layer => { layer.addEventListener('click', () => this.handleMobileMediaClick(layer)); });
    if(elements.closeLightboxBtn) { elements.closeLightboxBtn.addEventListener('click', () => this.closeVideo()); }
    if(elements.videoLightbox) {
      elements.videoLightbox.addEventListener('click', (e) => { if (e.target === elements.videoLightbox) this.closeVideo(); });
    }
  }
};

// MOBILE MENU MODULE
const MobileMenuModule = {
  toggleMenu() {
    if(!elements.menuToggle || !elements.menuOverlay) return;
    elements.menuToggle.classList.toggle('active');
    if(elements.rippleBlackMenu) elements.rippleBlackMenu.classList.toggle('active');
    if(elements.rippleBlueMenu) elements.rippleBlueMenu.classList.toggle('active');
    elements.menuOverlay.classList.toggle('active');
    document.body.style.overflow = elements.menuOverlay.classList.contains('active') ? 'hidden' : 'auto';
  },
  init() {
    if(elements.menuToggle) { elements.menuToggle.addEventListener('click', () => this.toggleMenu()); }
    document.querySelectorAll('.mobile-nav-link').forEach(link => { link.addEventListener('click', () => this.toggleMenu()); });
  }
};

// MODALS AND FORMS MANAGER
const FormManagerModule = {
  originalPlanHTML: "",
  originalCustomHTML: "",

  // Universal Hide Modal
  hideModal(modalEl, containerEl, originalHTML) {
    if(!modalEl) return;
    modalEl.classList.remove('active');
    if(containerEl && originalHTML) {
      setTimeout(() => {
        containerEl.innerHTML = originalHTML;
        this.rebindPrivacyEvents();
      }, CONFIG.animation.modalCloseDelay);
    }
  },

  // Privacy Check Logic
  validatePrivacy(checkboxId, checkmarkId, errorId) {
    const checkbox = document.getElementById(checkboxId);
    const checkmark = document.getElementById(checkmarkId);
    const errorMsg = document.getElementById(errorId);

    if (checkbox && !checkbox.checked) {
      if(checkmark) checkmark.classList.add('error-border');
      if(errorMsg) errorMsg.classList.add('show');
      return false;
    }
    return true;
  },

  // Generic Submit Handler
  handleSubmit(e, formId, containerEl, btnId, successMsg, privacyIds) {
    if(e.target.id !== formId) return;
    e.preventDefault();

    if(!this.validatePrivacy(privacyIds.check, privacyIds.mark, privacyIds.err)) return;

    const btn = document.getElementById(btnId);
    if(btn) { btn.innerText = "Invio in corso..."; btn.style.opacity = "0.7"; btn.style.pointerEvents = "none"; }

    fetch(CONFIG.form.endpoint, {
      method: 'POST',
      body: new FormData(e.target),
      headers: { 'Accept': 'application/json' }
    }).then(response => {
      if (response.ok) {
        if(containerEl) {
          containerEl.innerHTML = `
            <div style='text-align:center; padding: 30px 0;'>
              <svg width='60' height='60' style='color:var(--accent-color); margin-bottom:20px;' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'>
                <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'></path>
                <polyline points='22 4 12 14.01 9 11.01'></polyline>
              </svg>
              <h3 style='color:var(--text-color); font-family:var(--font-tech); font-size:1.5rem; margin-bottom:10px;'>${successMsg.title}</h3>
              <p style='color:var(--secondary-text); font-size:1rem;'>${successMsg.desc}</p>
            </div>`;
        }
      } else {
        if(btn) { btn.innerText = "Errore. Riprova."; btn.style.opacity = "1"; btn.style.pointerEvents = "auto"; }
      }
    }).catch(error => {
      if(btn) { btn.innerText = "Errore di rete."; btn.style.opacity = "1"; btn.style.pointerEvents = "auto"; }
    });
  },

  rebindPrivacyEvents() {
    const bindClear = (checkId, markId, errId) => {
      const checkbox = document.getElementById(checkId);
      if(checkbox) {
        checkbox.addEventListener('change', function() {
          if(this.checked) {
            const mark = document.getElementById(markId);
            const err = document.getElementById(errId);
            if(mark) mark.classList.remove('error-border');
            if(err) err.classList.remove('show');
          }
        });
      }
    };
    bindClear('privacyConsentPlan', 'privacyCheckmarkPlan', 'privacyErrorPlan');
    bindClear('privacyConsentCustom', 'privacyCheckmarkCustom', 'privacyErrorCustom');
  },

  init() {
    // 1. INIT PLAN MODAL
    if(elements.planModal && elements.closePlanBtn && elements.planFormContainer) {
      this.originalPlanHTML = elements.planFormContainer.innerHTML;

      document.querySelectorAll('.btn-modal-trigger').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();

          // Fallback intelligente per i piani (Come nell'index.js)
          let plan = btn.getAttribute('data-plan') || btn.getAttribute('data-template');
          if (!plan) {
            const card = btn.closest('.tier-info, .template-slide');
            if (card) {
              const titleEl = card.querySelector('h2, .template-label');
              if (titleEl) plan = titleEl.innerText;
            }
          }
          if(!plan) plan = "Richiesta da Sito";

          const input = document.getElementById('selectedPlanInput');
          if(input && plan) {
            input.value = plan;
            input.setAttribute('value', plan);
          }

          elements.planModal.classList.add('active');
        });
      });

      elements.closePlanBtn.addEventListener('click', () => this.hideModal(elements.planModal, elements.planFormContainer, this.originalPlanHTML));
      elements.planModal.addEventListener('click', (e) => { if (e.target === elements.planModal) this.hideModal(elements.planModal, elements.planFormContainer, this.originalPlanHTML); });

      elements.planFormContainer.addEventListener('submit', (e) => this.handleSubmit(
        e, 'planForm', elements.planFormContainer, 'generatePlanBtn',
        { title: "Richiesta Inviata!", desc: "Abbiamo ricevuto i tuoi dati. Ti contatteremo a brevissimo." },
        { check: 'privacyConsentPlan', mark: 'privacyCheckmarkPlan', err: 'privacyErrorPlan' }
      ));
    }

    // 2. INIT CUSTOM MODAL (Analisi Personalizzata)
    if(elements.customModal && elements.closeCustomBtn && elements.customFormContainer) {
      this.originalCustomHTML = elements.customFormContainer.innerHTML;

      // Selettore espanso: Cerca l'ID o la nuova classe .open-custom-modal
      document.querySelectorAll('#openCustomModalBtn, .open-custom-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          elements.customModal.classList.add('active');
        });
      });

      elements.closeCustomBtn.addEventListener('click', () => this.hideModal(elements.customModal, elements.customFormContainer, this.originalCustomHTML));
      elements.customModal.addEventListener('click', (e) => { if (e.target === elements.customModal) this.hideModal(elements.customModal, elements.customFormContainer, this.originalCustomHTML); });

      elements.customFormContainer.addEventListener('submit', (e) => this.handleSubmit(
        e, 'customForm', elements.customFormContainer, 'sendCustomEmailBtn',
        { title: "Messaggio Inviato!", desc: "Analizzeremo la tua situazione e ti scriveremo presto." },
        { check: 'privacyConsentCustom', mark: 'privacyCheckmarkCustom', err: 'privacyErrorCustom' }
      ));
    }

    this.rebindPrivacyEvents();
  }
};

// DOM INITIALIZATION
function cacheElements() {
  elements.preloader = document.getElementById('intro-preloader');
  elements.introContent = document.querySelector('.intro-content');
  elements.counterEl = document.querySelector('.intro-counter');
  elements.layerWhite = document.querySelector('.layer-white');
  elements.layerBlue = document.querySelector('.layer-blue');
  elements.header = document.querySelector('header');
  elements.heroContentMask = document.querySelector('.hero-content-mask');
  elements.heroWrapper = document.querySelector('.hero-wrapper');
  elements.contentScroller = document.querySelector('.content-scroller');
  elements.videoLightbox = document.getElementById('videoLightbox');
  elements.lightboxVideo = document.getElementById('lightboxVideo');
  elements.closeLightboxBtn = document.getElementById('closeVideoLightbox');
  elements.menuToggle = document.querySelector('.menu-toggle');
  elements.menuOverlay = document.querySelector('.mobile-menu-overlay');

  // Gestione classe menu
  elements.rippleBlackMenu = document.querySelector('.ripple-black-menu') || document.querySelector('.ripple-white-menu');
  elements.rippleBlueMenu = document.querySelector('.ripple-blue-menu');

  // Modali
  elements.planModal = document.getElementById('planModal');
  elements.closePlanBtn = document.getElementById('closePlanModal');
  elements.planFormContainer = document.getElementById('planFormContainer');

  elements.customModal = document.getElementById('customPlanModal');
  elements.closeCustomBtn = document.getElementById('closeCustomModal');
  elements.customFormContainer = document.getElementById('customFormContainer');
}

// MAIN INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
  cacheElements();

  PreloaderModule.init();
  MouseFlashlightModule.init();
  ScrollEngineModule.init();
  RevealObserverModule.init();
  CarouselModule.init();
  DeviceToggleModule.init();
  VideoLightboxModule.init();
  MobileMenuModule.init();
  FormManagerModule.init();
});
