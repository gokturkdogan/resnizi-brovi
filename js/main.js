/* ============================================================
   Зорге 9 · Beauty Atelier — native-style interactions (pure JS)
   ============================================================ */

(() => {
  'use strict';

  /* -------------------------------------------------------
     1) Splash screen
  ------------------------------------------------------- */
  const splash = document.getElementById('splash');
  const hideSplash = () => splash && splash.classList.add('is-out');
  if (document.readyState === 'complete') {
    setTimeout(hideSplash, 1400);
  } else {
    window.addEventListener('load', () => setTimeout(hideSplash, 1400));
  }

  /* -------------------------------------------------------
     2) Footer year
  ------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* -------------------------------------------------------
     3) Story-style progress segments (one per section)
  ------------------------------------------------------- */
  const screen = document.getElementById('screen');
  const sections = Array.from(document.querySelectorAll('.section'));
  const progressBar = document.getElementById('storyProgress');

  if (progressBar) {
    sections.forEach(() => {
      const seg = document.createElement('div');
      seg.className = 'story-progress__seg';
      progressBar.appendChild(seg);
    });
  }

  const segments = progressBar
    ? Array.from(progressBar.querySelectorAll('.story-progress__seg'))
    : [];

  /* -------------------------------------------------------
     4) Tab bar wiring
  ------------------------------------------------------- */
  const tabs = Array.from(document.querySelectorAll('.tab'));
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;
      const targetEl = document.querySelector(`[data-section="${target}"]`);
      if (!targetEl || !screen) return;
      screen.scrollTo({
        top: targetEl.offsetTop - 4,
        behavior: 'smooth'
      });
      hapticBuzz(8);
    });
  });

  /* -------------------------------------------------------
     5) Anchor scroll inside the screen
  ------------------------------------------------------- */
  document.querySelectorAll('a[data-scroll]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href') || '';
      if (!href.startsWith('#')) return;
      const id = href.slice(1);
      const t = document.querySelector(`[data-section="${id}"]`);
      if (!t || !screen) return;
      e.preventDefault();
      screen.scrollTo({ top: t.offsetTop - 4, behavior: 'smooth' });
    });
  });

  /* -------------------------------------------------------
     6) Active section detection (scroll-driven)
  ------------------------------------------------------- */
  // Tabs only highlight when their target is the currently visible section.
  // Multiple tabs can share a target (e.g. center FAB and Контакты).
  let activeIdx = 0;
  let ticking = false;

  function onScroll() {
    if (!screen) return;
    const sTop = screen.scrollTop;
    const sH = screen.clientHeight;
    let bestIdx = 0;
    let bestVis = 0;

    sections.forEach((sec, i) => {
      const top = sec.offsetTop - sTop;
      const bottom = top + sec.offsetHeight;
      const visible = Math.max(0, Math.min(sH, bottom) - Math.max(0, top));
      if (visible > bestVis) { bestVis = visible; bestIdx = i; }

      if (segments[i]) {
        let p = 0;
        if (bottom <= 0) p = 1;
        else if (top >= sH) p = 0;
        else {
          const total = sec.offsetHeight + sH;
          const passed = sH - top;
          p = Math.min(1, Math.max(0, passed / total));
        }
        segments[i].classList.toggle('is-active', p >= 0.999);
        segments[i].classList.toggle('is-current', p > 0 && p < 0.999);
        segments[i].style.setProperty('--p', p.toFixed(3));
      }
    });

    if (bestIdx !== activeIdx) {
      activeIdx = bestIdx;
      const sectName = sections[activeIdx].dataset.section;
      tabs.forEach(t => t.classList.toggle('is-active', t.dataset.target === sectName));
    }
    ticking = false;
  }

  if (screen) {
    screen.addEventListener('scroll', () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScroll);
      }
    }, { passive: true });
  }

  /* -------------------------------------------------------
     7) Reveal-on-scroll (IntersectionObserver)
  ------------------------------------------------------- */
  const reveals = document.querySelectorAll('.reveal, .reveal-line');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      }
    });
  }, { root: screen, threshold: 0.15, rootMargin: '0px 0px -10% 0px' });
  reveals.forEach(el => io.observe(el));

  setTimeout(() => {
    document.querySelectorAll('.section--hero .reveal-line').forEach(el => el.classList.add('is-in'));
    document.querySelectorAll('.section--hero .reveal').forEach(el => el.classList.add('is-in'));
  }, 200);

  /* -------------------------------------------------------
     8) Counter animation for hero stats
  ------------------------------------------------------- */
  const counters = document.querySelectorAll('[data-count]');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const dur = 1600;
      const start = performance.now();
      const easeOut = t => 1 - Math.pow(1 - t, 3);
      const step = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const v = Math.round(target * easeOut(t));
        el.textContent = v.toLocaleString('ru-RU') + suffix;
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      counterIO.unobserve(el);
    });
  }, { root: screen, threshold: 0.5 });
  counters.forEach(c => counterIO.observe(c));

  /* -------------------------------------------------------
     9) Ripple effect for buttons / contacts
  ------------------------------------------------------- */
  document.querySelectorAll('.ripple').forEach(el => {
    el.addEventListener('pointerdown', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const dot = document.createElement('span');
      dot.className = 'ripple__dot';
      const size = Math.max(rect.width, rect.height) * 0.4;
      dot.style.width = dot.style.height = `${size}px`;
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      el.appendChild(dot);
      setTimeout(() => dot.remove(), 700);
    });
  });

  /* -------------------------------------------------------
     10) Magnetic + Tilt effect on feature cards (pointer)
  ------------------------------------------------------- */
  document.querySelectorAll('.tilt').forEach(card => {
    let raf = 0;
    card.addEventListener('pointermove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.transform =
          `translateY(-2px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 8).toFixed(2)}deg)`;
      });
    });
    card.addEventListener('pointerleave', () => {
      cancelAnimationFrame(raf);
      card.style.transform = '';
    });
  });

  /* -------------------------------------------------------
     11) Parallax for hero blobs
  ------------------------------------------------------- */
  const blobs = document.querySelectorAll('.blob');
  if (blobs.length && screen) {
    let pTick = false;
    screen.addEventListener('scroll', () => {
      if (pTick) return;
      pTick = true;
      requestAnimationFrame(() => {
        const y = screen.scrollTop;
        blobs.forEach((b, i) => {
          const factor = (i + 1) * 0.12;
          b.style.transform = `translate3d(0, ${(-y * factor).toFixed(1)}px, 0)`;
        });
        pTick = false;
      });
    }, { passive: true });
  }

  /* -------------------------------------------------------
     12) Gallery tabs (Lashes / Hair)
  ------------------------------------------------------- */
  const gTabs = document.querySelectorAll('.g-tab');
  const gPanes = document.querySelectorAll('[data-gpane]');
  gTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const key = tab.dataset.gtab;
      gTabs.forEach(t => t.classList.toggle('is-active', t === tab));
      gPanes.forEach(p => p.classList.toggle('is-hidden', p.dataset.gpane !== key));
      hapticBuzz(6);
    });
  });

  /* -------------------------------------------------------
     13) Share button (Web Share API fallback)
  ------------------------------------------------------- */
  const shareBtn = document.getElementById('shareBtn');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const data = {
        title: 'Зорге 9 · Beauty Atelier',
        text: 'Экспертное beauty-пространство · Карина Фельдбуш & Анастасия Лукашкина',
        url: location.href
      };
      try {
        if (navigator.share) {
          await navigator.share(data);
        } else if (navigator.clipboard) {
          await navigator.clipboard.writeText(location.href);
          toast('Ссылка скопирована');
        }
      } catch (_) {/* cancelled */}
    });
  }

  /* -------------------------------------------------------
     14) Toast helper
  ------------------------------------------------------- */
  function toast(msg) {
    const t = document.createElement('div');
    t.textContent = msg;
    Object.assign(t.style, {
      position: 'fixed',
      left: '50%',
      bottom: 'calc(96px + env(safe-area-inset-bottom, 0px))',
      transform: 'translateX(-50%) translateY(20px)',
      background: 'rgba(20, 17, 13, .92)',
      color: '#e8d5ad',
      padding: '10px 16px',
      borderRadius: '99px',
      fontSize: '12.5px',
      fontWeight: 500,
      letterSpacing: '.5px',
      zIndex: 200,
      opacity: '0',
      transition: 'opacity .25s ease, transform .25s ease'
    });
    document.body.appendChild(t);
    requestAnimationFrame(() => {
      t.style.opacity = '1';
      t.style.transform = 'translateX(-50%) translateY(0)';
    });
    setTimeout(() => {
      t.style.opacity = '0';
      t.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(() => t.remove(), 300);
    }, 1800);
  }

  /* -------------------------------------------------------
     15) Lightweight haptic feedback (if supported)
  ------------------------------------------------------- */
  function hapticBuzz(ms = 6) {
    if (navigator.vibrate) navigator.vibrate(ms);
  }

  /* -------------------------------------------------------
     16) Pointer-following spotlight on hero
  ------------------------------------------------------- */
  const hero = document.querySelector('.section--hero');
  if (hero) {
    hero.addEventListener('pointermove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      hero.style.setProperty('--mx', `${x}%`);
      hero.style.setProperty('--my', `${y}%`);
    });
  }

  /* -------------------------------------------------------
     17) Gallery items: tap → toast (placeholder)
  ------------------------------------------------------- */
  document.querySelectorAll('.g-item').forEach((g, i) => {
    g.addEventListener('click', () => {
      hapticBuzz(6);
      toast(`Работа ${i + 1} · скоро`);
    });
  });
})();
