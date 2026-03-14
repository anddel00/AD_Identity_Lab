
  // --- LOGICA PRELOADER ---
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

  // --- LOGICA INTERSECTION OBSERVER ---
  document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
  if (entry.isIntersecting) {
  entry.target.classList.add('revealed');
  observer.unobserve(entry.target);
}
});
}, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

  document.querySelectorAll('.revealed-element').forEach(item => observer.observe(item));

  // --- MOBILE MENU LOGIC ---
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

  // --- HEADER SCROLL LOGIC ---
  let lastScrollTop = 0;
  const header = document.querySelector('header');
  window.addEventListener('scroll', () => {
  requestAnimationFrame(() => {
  let scrollY = window.pageYOffset || document.documentElement.scrollTop;
  if (scrollY > lastScrollTop && scrollY > 100) {
  header.classList.add('header-hidden');
} else {
  header.classList.remove('header-hidden');
}
  lastScrollTop = scrollY <= 0 ? 0 : scrollY;
});
});
});

