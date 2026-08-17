/* ── Year ───────────────────────────────────────────────────── */
document.querySelectorAll('#year').forEach(el => {
  el.textContent = String(new Date().getFullYear());
});

/* ── Header: blur on scroll ─────────────────────────────────── */
const header = document.querySelector('.header');
if (header) {
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Dropdown menu ──────────────────────────────────────────── */
const menuToggle = document.querySelector('.menu-toggle');
const menuDropdown = document.querySelector('.menu-dropdown');
if (menuToggle && menuDropdown) {
  const openMenu = () => {
    menuDropdown.classList.add('is-open');
    menuToggle.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
  };
  const closeMenu = () => {
    menuDropdown.classList.remove('is-open');
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };
  menuToggle.addEventListener('click', () => {
    menuDropdown.classList.contains('is-open') ? closeMenu() : openMenu();
  });
  menuDropdown.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  /* Mark current page link as active */
  const currentPath = location.pathname.split('/').pop() || 'index.html';
  menuDropdown.querySelectorAll('a').forEach(a => {
    const href = a.getAttribute('href') || '';
    const hrefFile = href.split('#')[0].split('/').pop() || 'index.html';
    if (hrefFile === currentPath || (currentPath === '' && hrefFile === 'index.html')) {
      a.classList.add('is-current');
    }
  });
}

/* ── Name → header on scroll (homepage + CV) ───────────────── */
const headerName  = document.querySelector('.header-name');
const scrollTrigger = document.querySelector('.hero-name') || document.querySelector('.cv-hero h1');
if (headerName && scrollTrigger) {
  const nameWatcher = new IntersectionObserver(entries => {
    headerName.classList.toggle('is-visible', !entries[0].isIntersecting);
  }, { threshold: 0, rootMargin: '-54px 0px 0px 0px' });
  nameWatcher.observe(scrollTrigger);
}

/* ── Scroll reveal ──────────────────────────────────────────── */
const observer = 'IntersectionObserver' in window
  ? new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: .06 })
  : null;

document.querySelectorAll('.proj-card, .about, .chapter, .case-section, .case-header').forEach(el => {
  if (observer) observer.observe(el);
  else el.classList.add('is-visible');
});

/* ── Theme toggle (SVG icons + spin) ───────────────────────── */
const themeKey = 'amael-theme';
const themeButtons = document.querySelectorAll('.theme-toggle');
const preferredTheme = localStorage.getItem(themeKey)
  || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(themeKey, theme);
  const isLight = theme === 'light';
  const isEN    = document.documentElement.lang === 'en';
  themeButtons.forEach(btn => {
    btn.setAttribute('aria-pressed', String(isLight));
    btn.setAttribute('aria-label',
      isLight
        ? (isEN ? 'Activate dark mode'  : 'Attiva modalità scura')
        : (isEN ? 'Activate light mode' : 'Attiva modalità chiara')
    );
  });
}

applyTheme(preferredTheme);
themeButtons.forEach(btn => btn.addEventListener('click', () => {
  /* Spin animation */
  btn.classList.remove('spinning');
  void btn.offsetWidth; /* reflow to restart animation */
  btn.classList.add('spinning');
  btn.addEventListener('animationend', () => btn.classList.remove('spinning'), { once: true });

  applyTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light');
}));
