// script.js - funcionalidades básicas para la página:
// - header con scroll
// - mobile nav toggle
// - video modal open/close (inserta embed de YouTube)
// - cookie consent (localStorage)
// - scroll-to-top (smooth) y mostrar/ocultar botón

document.addEventListener('DOMContentLoaded', function () {

    const navToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNav = document.getElementById('primary-navigation');

    if (navToggle && primaryNav) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            primaryNav.setAttribute('data-visible', !isExpanded);

            // Mover el foco al primer enlace cuando se abre el menú
            if (!isExpanded) {
                primaryNav.querySelector('a').focus();
            }
        });
    }

  // VIDEO MODAL
    function setupPipPlayer() {
        const videoTriggers = document.querySelectorAll('.js-video-trigger');
        let pipPlayer = null;

        const createPlayer = () => {
            if (document.getElementById('pip-player')) return;

            const playerDiv = document.createElement('div');
            playerDiv.id = 'pip-player';
            playerDiv.className = 'pip-player';
            playerDiv.innerHTML = `
                <div class="pip-player-header">
                    <button class="pip-player-close" aria-label="Cerrar video">&times;</button>
                </div>
                <div class="video-container">
                    <iframe id="pip-youtube-video" width="560" height="315" src="" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                </div>
            `;
            document.body.appendChild(playerDiv);

            pipPlayer = playerDiv;
            pipPlayer.querySelector('.pip-player-close').addEventListener('click', closePlayer);
        };

        const openPlayer = (videoId) => {
            if (!pipPlayer) createPlayer();
            const iframe = pipPlayer.querySelector('#pip-youtube-video');
            iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&origin=${window.location.origin}`;
            pipPlayer.classList.add('show');
            pipPlayer.querySelector('.pip-player-close').focus(); // Mover foco al botón de cerrar
        };

        const closePlayer = () => {
            if (!pipPlayer) return;
            const iframe = pipPlayer.querySelector('#pip-youtube-video');
            iframe.src = '';
            pipPlayer.classList.remove('show');
            // Devolver el foco al elemento que abrió el video
            document.querySelector('.js-video-trigger.last-focused')?.focus();
        };

        videoTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const videoId = trigger.dataset.videoId;
                trigger.classList.add('last-focused'); // Marcar el trigger
                if (videoId) openPlayer(videoId);
            });
        });
    }
    setupPipPlayer();

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
    scrollBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // OPTIMIZED SCROLL EVENTS
  const header = document.querySelector('.main-header');
  let ticking = false;

  function handleScroll() {
    const scrollY = window.scrollY;

    // 1. Header scroll effect
    if (header) {
      header.classList.toggle('scrolled', scrollY > 50);
    }

    // 2. Scroll-to-top button visibility
    if (scrollBtn) {
      scrollBtn.classList.toggle('is-visible', scrollY > 300);
    }
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
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

  // FADE-IN ANIMATIONS ON SCROLL
  const fadeInElements = document.querySelectorAll('.fade-in-element, .gallery-item');

  if (fadeInElements.length > 0) {
    const observerOptions = {
      root: null, // Observa la intersección con el viewport
      rootMargin: '0px',
      threshold: 0.1 // Se activa cuando el 10% del elemento es visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        // Si el elemento está intersectando (visible)
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Dejar de observar el elemento una vez que es visible para no repetir la animación
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observar cada uno de los elementos
    fadeInElements.forEach(el => observer.observe(el));

    // Aplicar retraso escalonado a los elementos agrupados
    const animatedGroups = document.querySelectorAll('.features-grid, .testimonials-slider, .process-steps, .team-grid, .gallery-grid, .academic-grid, .model-grid');
    animatedGroups.forEach(group => {
      const elements = group.querySelectorAll('.fade-in-element');
      elements.forEach((el, index) => {
        // Aplicar un retraso de 150ms por cada elemento
        el.style.transitionDelay = `${index * 150}ms`;
      });
    });
  }

  // GALLERY FILTER
  const filterContainer = document.querySelector('.gallery-filters');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterContainer && galleryItems.length > 0) {
    filterContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('filter-btn')) {
        // Manejar el botón activo
        filterContainer.querySelector('.active').classList.remove('active');
        e.target.classList.add('active');

        const filterValue = e.target.getAttribute('data-filter');

        galleryItems.forEach(item => {
          if (item.dataset.category === filterValue || filterValue === 'all') {
            item.classList.remove('hide');
          } else {
            item.classList.add('hide');
          }
        });
      }
    });
  }

  // SCROLLSPY - ACTIVE LINK ON SCROLL
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.main-header__nav-link');

  if (sections.length > 0 && navLinks.length > 0) {
    const scrollSpyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Obtener el ID de la sección visible
          const id = entry.target.getAttribute('id');
          const activeLink = document.querySelector(`.main-header__nav-link[href="#${id}"]`);

          // Quitar la clase activa de todos los enlaces
          navLinks.forEach(link => link.classList.remove('main-header__nav-link--active'));

          // Añadir la clase activa al enlace correspondiente
          if (activeLink) {
            activeLink.classList.add('main-header__nav-link--active');
          }
        }
      });
    }, {
      rootMargin: '-50% 0px -50% 0px' // Activa cuando la sección está en el centro de la pantalla
    });

    sections.forEach(section => scrollSpyObserver.observe(section));
  }

  // Asegurar que el enlace activo se establezca en la carga de la página
  // (para cuando se carga con un hash en la URL)
  const currentHash = window.location.hash;
  if (currentHash) {
      const activeLinkOnLoad = document.querySelector(`.main-header__nav-link[href="${currentHash}"]`);
      if (activeLinkOnLoad) {
          navLinks.forEach(link => link.classList.remove('main-header__nav-link--active'));
          activeLinkOnLoad.classList.add('main-header__nav-link--active');
      }
  }

  // TYPEWRITER EFFECT FOR MAIN TITLE
  const titleElement = document.getElementById('typewriter-title');
  if (titleElement) {
    const originalHTML = 'Educación con <strong>Valores</strong> y <strong>Excelencia</strong>';
    const textToType = [];
    // Convertir el HTML en un array de caracteres y etiquetas
    for (let i = 0; i < originalHTML.length; i++) {
        if (originalHTML[i] === '<') {
            const closingTagIndex = originalHTML.indexOf('>', i);
            textToType.push(originalHTML.substring(i, closingTagIndex + 1));
            i = closingTagIndex;
        } else {
            textToType.push(originalHTML[i]);
        }
    }

    let charIndex = 0;
    titleElement.classList.add('typewriter-text');

    function type() {
      if (charIndex < textToType.length) {
        titleElement.innerHTML += textToType[charIndex];
        charIndex++;
        setTimeout(type, 70); // Velocidad de escritura (en ms)
      } else {
        // Cuando termina, el cursor deja de parpadear
        titleElement.classList.remove('typewriter-text');
      }
    }

    // Iniciar la animación
    type();
  }
});
