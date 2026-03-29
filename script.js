/* ============================================================
   theamit.me – Portfolio JS
   Features: nav scroll, typing effect, reveal on scroll,
             mobile menu, progress bar animation
   ============================================================ */

(function () {
  'use strict';

  /* ── TYPED EFFECT ──────────────────────────────────────── */
  const phrases = [
    'AI solutions',
    'data pipelines',
    'cool software',
    'ML models',
    'the future',
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;
  let typingTimer;
  const typedEl = document.getElementById('typed');

  function type() {
    const current = phrases[phraseIndex];
    if (!typedEl) return;

    if (!deleting) {
      typedEl.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        deleting = true;
        typingTimer = setTimeout(type, 1800);
        return;
      }
    } else {
      typedEl.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingTimer = setTimeout(type, 350);
        return;
      }
    }
    const speed = deleting ? 50 : 80;
    typingTimer = setTimeout(type, speed);
  }
  setTimeout(type, 800);

  /* ── NAVBAR SCROLL ─────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  function onScroll() {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── ACTIVE NAV LINK ───────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-40% 0px -55% 0px',
    threshold: 0,
  };
  const sectionObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        navLinks.forEach(function (link) { link.classList.remove('active'); });
        const id = entry.target.getAttribute('id');
        const activeLink = document.querySelector('.nav-link[href="#' + id + '"]');
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, observerOptions);
  sections.forEach(function (section) { sectionObserver.observe(section); });

  /* ── MOBILE HAMBURGER ──────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinksList = document.getElementById('navLinks');

  if (hamburger && navLinksList) {
    hamburger.addEventListener('click', function () {
      const isOpen = navLinksList.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    navLinksList.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinksList.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ── REVEAL ON SCROLL ──────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  revealEls.forEach(function (el, index) {
    el.dataset.revealIndex = index;
  });
  const revealObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var idx = parseInt(entry.target.dataset.revealIndex, 10) || 0;
        entry.target.style.transitionDelay = (idx % 4) * 0.1 + 's';
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(function (el) { revealObserver.observe(el); });

  /* ── PROGRESS BAR (projects section) ──────────────────── */
  const progressFill = document.getElementById('progressFill');
  const progressPct  = document.getElementById('progressPct');
  const TARGET_PCT   = 42;

  if (progressFill && progressPct) {
    const progressObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        progressFill.style.width = TARGET_PCT + '%';
        let current = 0;
        const step = TARGET_PCT / 60;
        const counter = setInterval(function () {
          current = Math.min(current + step, TARGET_PCT);
          progressPct.textContent = Math.round(current) + '%';
          if (current >= TARGET_PCT) clearInterval(counter);
        }, 30);
        progressObserver.disconnect();
      }
    }, { threshold: 0.5 });
    progressObserver.observe(progressFill);
  }

  /* ── SMOOTH SCROLL POLYFILL (fallback) ────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
