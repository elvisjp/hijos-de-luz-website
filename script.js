// script.js - funcionalidades básicas para la página:
// - preloader hide
// - mobile nav toggle
// - video modal open/close (inserta embed de YouTube)
// - cookie consent (localStorage)
// - scroll-to-top (smooth) y mostrar/ocultar botón

document.addEventListener('DOMContentLoaded', function () {

    const navToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNav = document.getElementById('primary-navigation');

    if (navToggle && primaryNav) {
        navToggle.addEventListener('click', () => {
            const isVisible = primaryNav.getAttribute('data-visible') === 'true';
            navToggle.setAttribute('aria-expanded', !isVisible);
            primaryNav.setAttribute('data-visible', !isVisible);
        });
    }

  // VIDEO MODAL
  const videoTrigger = document.getElementById('video-trigger');
  const videoModal = document.getElementById('video-modal');
  const videoClose = document.querySelector('.video-modal-close');
  const youtubeIframe = document.getElementById('youtube-video');

  function openVideoModal(videoId) {
    if (!videoModal || !youtubeIframe) return;
    youtubeIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    videoModal.classList.add('show');
    videoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeVideoModal() {
    if (!videoModal || !youtubeIframe) return;
    youtubeIframe.src = '';
    videoModal.classList.remove('show');
    videoModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (videoTrigger) {
    videoTrigger.addEventListener('click', () => {
      const id = videoTrigger.dataset.videoId;
      if (id) openVideoModal(id);
    });
  }
  if (videoClose) videoClose.addEventListener('click', closeVideoModal);
  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeVideoModal();
    });
  }

  // COOKIE CONSENT
  const cookieBanner = document.getElementById('cookie-consent-banner');
  const acceptBtn = document.getElementById('cookie-accept-btn');
  const declineBtn = document.getElementById('cookie-decline-btn');

  const COOKIE_KEY = 'hijosdeluz_cookie_consent';
  function hideCookieBanner() {
    if (!cookieBanner) return;
    cookieBanner.style.display = 'none';
  }
  const saved = localStorage.getItem(COOKIE_KEY);
  if (saved === 'accepted' || saved === 'declined') hideCookieBanner();

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem(COOKIE_KEY, 'accepted');
      hideCookieBanner();
      // Aquí podrías inicializar analytics si aplica
    });
  }
  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      localStorage.setItem(COOKIE_KEY, 'declined');
      hideCookieBanner();
    });
  }

  // SCROLL TO TOP
  const scrollBtn = document.getElementById('scroll-to-top-btn');
  if (scrollBtn) {
    scrollBtn.style.display = 'none';
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) scrollBtn.style.display = 'block';
      else scrollBtn.style.display = 'none';
    });
    scrollBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Accessibility: close modal with ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (videoModal && videoModal.classList.contains('show')) {
        closeVideoModal();
      }
    }
  });

  // Optional: smooth scroll for internal anchors (if hay enlaces a #id)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
});
