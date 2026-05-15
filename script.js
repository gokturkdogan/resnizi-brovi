/* =========================================================
   Beauty Space — narrow vertical mobile-card landing
   - Drawer (mobile/full nav)
   - Smooth scroll
   - Reveal-on-scroll
   - Footer year
   ========================================================= */

(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ----- Footer year ----- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const topbar = $('#topbar');
  const setTopbarScrolled = () => {
    if (!topbar) return;
    topbar.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  setTopbarScrolled();
  window.addEventListener('scroll', setTopbarScrolled, { passive: true });

  /* ----- Drawer / menu ----- */
  const btn = $('#menuBtn');
  const drawer = $('#drawer');

  const closeDrawer = () => {
    if (!btn || !drawer) return;
    btn.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (topbar) topbar.classList.remove('is-menu-open');
  };

  if (btn && drawer) {
    btn.addEventListener('click', () => {
      const open = !drawer.classList.contains('is-open');
      drawer.classList.toggle('is-open', open);
      btn.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
      drawer.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
      if (topbar) topbar.classList.toggle('is-menu-open', open);
    });

    drawer.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') closeDrawer();
    });
  }

  /* ----- Smooth scroll with sticky-bar offset ----- */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;

      e.preventDefault();
      const topbar = $('.topbar');
      const offset = topbar ? topbar.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset - 8;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ----- Services accordions ----- */
  $$('[data-services-accordion]').forEach((list) => {
    list.querySelectorAll('.services__trigger').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.services__item');
        if (!item) return;
        const wasOpen = item.classList.contains('is-open');

        list.querySelectorAll('.services__item').forEach((el) => {
          el.classList.remove('is-open');
          const t = el.querySelector('.services__trigger');
          if (t) t.setAttribute('aria-expanded', 'false');
        });

        if (!wasOpen) {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  });

  /* ----- Autoplay inline videos (intro, heroes, why tile, works grid) ----- */
  $$('video').forEach((v) => {
    v.play().catch(() => {});
  });

  /* ----- Reveal on scroll ----- */
  const revealSelectors = [
    '.intro__badge',
    '.intro__title',
    '.intro__sub',
    '.intro__tagline',
    '.intro__buttons',
    '.studio-about',
    '.card',
    '.card-block',
    '.why-tile',
    '.works-grid__cell',
    '.price',
    '.review',
    '.atmosphere__list li',
    '.contact__buttons .btn',
  ];
  const els = $$(revealSelectors.join(','));
  els.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 6) * 50}ms`;
  });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
    els.forEach((el) => io.observe(el));
  } else {
    els.forEach((el) => el.classList.add('is-visible'));
  }
})();
