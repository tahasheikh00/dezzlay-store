/**
 * Shared site behavior: mobile nav, search panel, footer year,
 * newsletter + contact form handling (demo only — no backend).
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  const navScrim = document.querySelector('.nav-scrim');

  function closeNav() {
    mainNav && mainNav.classList.remove('open');
    navScrim && navScrim.classList.remove('open');
    menuToggle && menuToggle.setAttribute('aria-expanded', 'false');
  }

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navScrim && navScrim.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navScrim && navScrim.addEventListener('click', closeNav);
    mainNav.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeNav));
  }

  // Search panel toggle
  const searchToggle = document.querySelector('[data-search-toggle]');
  const searchPanel = document.querySelector('.search-panel');
  if (searchToggle && searchPanel) {
    searchToggle.addEventListener('click', () => {
      searchPanel.classList.toggle('open');
      if (searchPanel.classList.contains('open')) {
        searchPanel.querySelector('input').focus();
      }
    });
  }

  const searchForm = document.querySelector('.search-panel form');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = searchForm.querySelector('input').value.trim();
      window.location.href = `shop.html${q ? `?q=${encodeURIComponent(q)}` : ''}`;
    });
  }

  // Cart drawer
  const cartTriggers = document.querySelectorAll('[data-cart-toggle]');
  const cartDrawer = document.querySelector('.cart-drawer');
  const cartScrim = document.querySelector('.cart-drawer-scrim');
  const cartClose = document.querySelector('[data-cart-close]');

  function openDrawer() {
    cartDrawer && cartDrawer.classList.add('open');
    cartScrim && cartScrim.classList.add('open');
    if (typeof renderCartDrawer === 'function') renderCartDrawer();
  }
  function closeDrawer() {
    cartDrawer && cartDrawer.classList.remove('open');
    cartScrim && cartScrim.classList.remove('open');
  }
  cartTriggers.forEach((btn) => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openDrawer();
  }));
  cartClose && cartClose.addEventListener('click', closeDrawer);
  cartScrim && cartScrim.addEventListener('click', closeDrawer);

  // Footer year
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  // Newsletter form (demo — no backend wired up)
  document.querySelectorAll('.newsletter form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast("You're on the list. Welcome to Dezzlay.");
      form.reset();
    });
  });

  // Contact form (demo — no backend wired up)
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Message sent — we\'ll reply within 1–2 business days.');
      contactForm.reset();
    });
  }
});
