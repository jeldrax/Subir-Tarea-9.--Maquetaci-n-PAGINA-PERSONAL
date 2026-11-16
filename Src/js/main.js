(function () {
  'use strict';

  /*Desplazamiento de la pildora de navegacion*/
  function updateNavIndicator(activeLink, indicator, list) {
    if (!activeLink || !indicator || !list) return;

    const listRect = list.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();

    if (linkRect.width === 0 || linkRect.height === 0) return;

    const offsetLeft = linkRect.left - listRect.left;
    const width = linkRect.width;

    indicator.style.width = `${width}px`;
    indicator.style.transform = `translate3d(${offsetLeft}px, -50%, 0)`;

    if (!indicator.classList.contains('listo')) {
      indicator.classList.add('listo');
    }
  }

  /*Sistema de navegacion y seguimiento de lectura, control del menu movil*/
  function initNavigationAndScrollSpy() {
    const mobileDetails = document.getElementById('contenedorNavMovil');
    const mobileToggleLabel = mobileDetails ? mobileDetails.querySelector('.alternador-nav-movil span:first-child') : null;
    const desktopList = document.getElementById('listaNavEscritorio');
    const navIndicator = document.getElementById('indicadorNavActivo');
    const desktopLinks = Array.from(document.querySelectorAll('.navegacion-escritorio .enlace-nav[data-section]'));
    const mobileLinks = Array.from(document.querySelectorAll('.menu-desplegable-movil .enlace-nav-movil'));

    const sectionIds = desktopLinks.map((link) => link.getAttribute('data-section'));
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    let currentActiveId = 'bio';

    /*    asignacion de  la clase activo al enlace correspondiente, mueve la pildora flotante */
    function setActiveSection(sectionId) {
      if (!sectionId || !sectionIds.includes(sectionId)) return;
      currentActiveId = sectionId;

      let activeDesktopLink = null;
      desktopLinks.forEach((link) => {
        const isActive = link.getAttribute('data-section') === sectionId;
        link.classList.toggle('activo', isActive);
        if (isActive) {
          activeDesktopLink = link;
        }
      });

      if (activeDesktopLink && navIndicator && desktopList) {
        updateNavIndicator(activeDesktopLink, navIndicator, desktopList);
      }

      mobileLinks.forEach((link) => {
        const hrefId = (link.getAttribute('href') || '').replace('#', '');
        const isActive = hrefId === sectionId;
        link.classList.toggle('activo', isActive);
        if (isActive && mobileToggleLabel) {
          mobileToggleLabel.textContent = link.textContent.trim();
        }
      });
    }

    /* clic en enlaces de escritorio*/
    desktopLinks.forEach((link) => {
      link.addEventListener('click', () => {
        const targetSection = link.getAttribute('data-section');
        setActiveSection(targetSection);
      });
    });

    /*cierre automatico del menu desplegable movil*/
    if (mobileDetails) {
      mobileLinks.forEach((link) => {
        link.addEventListener('click', () => {
          mobileDetails.removeAttribute('open');
        });
      });

      document.addEventListener('click', (e) => {
        if (mobileDetails.hasAttribute('open') && !mobileDetails.contains(e.target)) {
          mobileDetails.removeAttribute('open');
        }
      });
    }

    /*Deteccion de seccion por desplazamiento*/
    let scrollTicking = false;
    function syncActiveOnScroll() {
      scrollTicking = false;
      const activationLine = 120;
      const scrollY = window.scrollY;

      if (scrollY <= 12) {
        if (currentActiveId !== 'bio') {
          setActiveSection('bio');
        }
        return;
      }

      let matchedId = sections[0] ? sections[0].id : currentActiveId;
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= activationLine) {
          matchedId = section.id;
        }
      }

      if (matchedId !== currentActiveId) {
        setActiveSection(matchedId);
      }
    }

    /*listener optimizada de scroll*/
    window.addEventListener(
      'scroll',
      () => {
        if (!scrollTicking) {
          scrollTicking = true;
          window.requestAnimationFrame(syncActiveOnScroll);
        }
      },
      { passive: true }
    );

    /*Recalculo de posicion de la pildora al cambiar de medua quey*/
    window.addEventListener('resize', () => {
      const activeLink = desktopLinks.find((link) => link.getAttribute('data-section') === currentActiveId);
      if (activeLink && navIndicator && desktopList) {
        updateNavIndicator(activeLink, navIndicator, desktopList);
      }
    });

    /*Posicionamiento inicial de la pildora*/
    const initialLink = desktopLinks.find((link) => link.getAttribute('data-section') === currentActiveId) || desktopLinks[0];
    if (initialLink && navIndicator && desktopList) {
      updateNavIndicator(initialLink, navIndicator, desktopList);
    }

    /*Ajuste fino de la pildora*/
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        const activeLink = desktopLinks.find((link) => link.getAttribute('data-section') === currentActiveId);
        if (activeLink && navIndicator && desktopList) {
          updateNavIndicator(activeLink, navIndicator, desktopList);
        }
      });
    }
  }

  /*==== Orbita eliptica de habilidades tecnicas ====*/
  function initSkillsOrbit() {
    const contenedor = document.querySelector('.elementos-orbita-habilidades');
    const elementos = document.querySelectorAll('.pildora-habilidad-orbital');
    if (!contenedor || elementos.length === 0) return;

    let angulo = -Math.PI / 2 - (Math.PI * 2) / elementos.length;

    let radioX = contenedor.clientWidth / 2;
    let radioY = contenedor.clientHeight / 2;

    /*adaptavilidad de la elipse según el cambio de tamaño de la ventana*/
    window.addEventListener('resize', () => {
      radioX = contenedor.clientWidth / 2;
      radioY = contenedor.clientHeight / 2;
    });

    /*Ciclo de renderizado orbital*/
    function animarOrbita() {
      const esMovil = window.innerWidth <= 480;

      angulo += esMovil ? 0.011 : 0.0075;

      elementos.forEach((el, index) => {
        const desfase = ((Math.PI * 2) / elementos.length) * index;
        const anguloElemento = angulo + desfase;

        if (esMovil) {
          const profundidad = (-Math.cos(anguloElemento) + 1) * 0.5;
          const x = Math.cos(anguloElemento) * radioX * 0.34;
          const y = Math.sin(anguloElemento) * radioY;
          const escala = 0.76 + 0.28 * profundidad;

          el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${escala})`;
          el.style.opacity = 0.52 + 0.48 * profundidad;
          el.style.zIndex = Math.round(1 + 20 * profundidad);
        } else {
          const x = Math.cos(anguloElemento) * radioX;
          const y = Math.sin(anguloElemento) * radioY;
          const escala = el.matches(':hover') ? 1.07 : 1;

          el.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${escala})`;
          el.style.opacity = '';
          el.style.zIndex = el.matches(':hover') ? 15 : '';
        }
      });

      requestAnimationFrame(animarOrbita);
    }

    animarOrbita();
  }

  /*Arranque inicializador*/
  document.addEventListener('DOMContentLoaded', () => {
    initNavigationAndScrollSpy();
    initSkillsOrbit();
    initContactForm();
  });
})();
