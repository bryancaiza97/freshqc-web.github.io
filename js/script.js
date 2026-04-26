'use strict';

/* ─── HEADER: sombra al scroll ─── */
const header = document.getElementById('header');
if (header) {
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 48);
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ─── HAMBURGER MENU ─── */
const hamburger = document.getElementById('hamburger');
const menu      = document.getElementById('menu');
const overlay   = document.getElementById('menuOverlay');

function openMenu() {
  menu.classList.add('open');
  overlay.classList.add('active');
  hamburger.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  hamburger.setAttribute('aria-label', 'Cerrar menú de navegación');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  menu.classList.remove('open');
  overlay.classList.remove('active');
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  hamburger.setAttribute('aria-label', 'Abrir menú de navegación');
  document.body.style.overflow = '';
}

if (hamburger && menu && overlay) {
  hamburger.addEventListener('click', () =>
    menu.classList.contains('open') ? closeMenu() : openMenu()
  );
  overlay.addEventListener('click', closeMenu);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
  });

  menu.querySelectorAll('.nav-link').forEach(link =>
    link.addEventListener('click', closeMenu)
  );
}

/* ─── SCROLL REVEAL ─── */
const revealObserver = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── COUNTER ANIMATION ─── */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animateCounter(el, target, duration) {
  if (prefersReducedMotion) { el.textContent = target; return; }
  const start  = performance.now();
  const update = now => {
    const p    = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.floor(target * ease);
    if (p < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(
  entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = parseInt(el.dataset.target, 10);
      if (!isNaN(target)) animateCounter(el, target, 1400);
      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.5 }
);
document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

/* ─── SMOOTH SCROLL for anchor links ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id     = a.getAttribute('href').slice(1);
    const target = id ? document.getElementById(id) : null;
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ─── FORM VALIDATION + SUBMIT ─── */
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const formSuccess= document.getElementById('formSuccess');

if (form) {
  const fields = {
    nombre:  { el: document.getElementById('nombre'),  err: document.getElementById('nombre-error'),  msg: 'Por favor ingresa tu nombre.' },
    correo:  { el: document.getElementById('correo'),  err: document.getElementById('correo-error'),  msg: 'Por favor ingresa un correo válido.' },
    mensaje: { el: document.getElementById('mensaje'), err: document.getElementById('mensaje-error'), msg: 'Por favor escribe un mensaje.' },
  };

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateField(key) {
    const { el, err, msg } = fields[key];
    const val = el.value.trim();
    const ok  = key === 'correo' ? emailRe.test(val) : val.length > 0;
    err.textContent = ok ? '' : msg;
    el.setAttribute('aria-invalid', ok ? 'false' : 'true');
    return ok;
  }

  Object.keys(fields).forEach(key => {
    fields[key].el.addEventListener('blur', () => validateField(key));
    fields[key].el.addEventListener('input', () => {
      if (fields[key].err.textContent) validateField(key);
    });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const valid = Object.keys(fields).map(validateField).every(Boolean);
    if (!valid) {
      const firstInvalid = Object.values(fields).find(f => f.err.textContent);
      if (firstInvalid) firstInvalid.el.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.querySelector('.btn-text').hidden  = true;
    submitBtn.querySelector('.btn-loading').hidden = false;

    await new Promise(r => setTimeout(r, 1200));

    form.reset();
    submitBtn.disabled = false;
    submitBtn.querySelector('.btn-text').hidden  = false;
    submitBtn.querySelector('.btn-loading').hidden = true;

    if (formSuccess) {
      formSuccess.hidden = false;
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(() => { formSuccess.hidden = true; }, 5500);
    }
  });
}
