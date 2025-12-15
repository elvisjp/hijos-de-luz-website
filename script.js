// script.js - funcionalidades básicas para la página:
// - preloader hide
// - mobile nav toggle
// - video modal open/close (inserta embed de YouTube)
// - cookie consent (localStorage)
// - scroll-to-top (smooth) y mostrar/ocultar botón
// - *NUEVO: Animación de elementos al hacer scroll*

document.addEventListener('DOMContentLoaded', function () {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            // Utilizamos setTimeout para asegurarnos de que el preloader se muestre el tiempo suficiente
            setTimeout(() => {
                preloader.classList.add('hidden');
            }, 300); // 300ms de retraso mínimo
        });
    }

    const navToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNav = document.getElementById('primary-navigation');

    if (navToggle && primaryNav) {
        navToggle.addEventListener('click', () => {
            const isVisible = primaryNav.getAttribute('data-visible') === 'true';
            navToggle.setAttribute('aria-expanded', !isVisible);
            primaryNav.setAttribute('data-visible', !isVisible);
        });
    }

  // ====================================================
  // NUEVO: ANIMACIÓN DE ELEMENTOS (FADE-IN ON SCROLL)
  // ====================================================
  const faders = document.querySelectorAll('.fade-in-element');

  const appearOptions = {
      threshold: 0.2, // Disparar cuando el 20% del elemento es visible
      rootMargin: "0px 0px -50px 0px" // Empezar a observar 50px antes del final del viewport
  };

  const appearOnScroll = new IntersectionObserver(function (entries, appearOnScroll) {
      entries.forEach(entry => {
          if (!entry.isIntersecting) {
              return; // Si no está visible, no hacemos nada
          } else {
              entry.target.classList.add('visible'); // Lo hacemos visible
              appearOnScroll.unobserve(entry.target); // Dejamos de observarlo
          }
      });
  }, appearOptions);

  faders.forEach(fader => {
      appearOnScroll.observe(fader);
  });
  // ====================================================

  // VIDEO MODAL
  // Nota: El botón para el modal está en index.html, pero la lógica debe estar aquí.
  const videoTriggers = document.querySelectorAll('.play-button'); // Apunta a todos los botones con esa clase
  const videoModal = document.getElementById('video-modal');
  const videoClose = document.querySelector('.video-modal-close');
  const youtubeIframe = document.getElementById('youtube-video');

  function openVideoModal(videoId) {
    if (!videoModal || !youtubeIframe) return;
    youtubeIframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    videoModal.classList.add('show');
    document.body.style.overflow = 'hidden';
  }
  function closeVideoModal() {
    if (!videoModal || !youtubeIframe) return;
    youtubeIframe.src = '';
    videoModal.classList.remove('show');
    document.body.style.overflow = '';
  }

  // Iterar sobre los posibles triggers
  if (videoTriggers.length > 0) {
    videoTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const id = trigger.dataset.youtubeId; // Usar data-youtube-id como en index.html
            if (id) openVideoModal(id);
        });
    });
  }

  if (videoClose) videoClose.addEventListener('click', closeVideoModal);
  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) closeVideoModal();
    });
  }
  // Fin de la corrección del modal (usa .play-button y data-youtube-id como en index.html)


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

  // SCROLL TO TOP y HEADER SCROLL
  const scrollBtn = document.getElementById('scroll-to-top-btn');
  const header = document.querySelector('.main-header'); // Para la clase 'scrolled'

  // Función combinada para scroll
  window.addEventListener('scroll', () => {
      // 1. Mostrar/Ocultar botón de scroll
      if (scrollBtn) {
          if (window.scrollY > 300) scrollBtn.style.display = 'flex'; // Usar flex para que se centre
          else scrollBtn.style.display = 'none';
      }
      
      // 2. Cambiar estilo del header
      if (header) {
          if (window.scrollY > 50) header.classList.add('scrolled');
          else header.classList.remove('scrolled');
      }
  });

  if (scrollBtn) {
    scrollBtn.style.display = 'none';
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