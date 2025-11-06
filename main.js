// main.js
// Smooth scrolling with easing, mobile nav toggle and scroll reveal with stagger

// ---- footer year ----
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---- Smooth scroll function (easeInOutQuad) ----
function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function smoothScrollTo(targetY, duration = 650) {
  const startY = window.scrollY || window.pageYOffset;
  const diff = targetY - startY;
  let start;

  function step(timestamp) {
    if (!start) start = timestamp;
    const time = timestamp - start;
    const t = Math.min(1, time / duration);
    const eased = easeInOutQuad(t);
    window.scrollTo(0, Math.round(startY + diff * eased));
    if (time < duration) {
      window.requestAnimationFrame(step);
    }
  }
  window.requestAnimationFrame(step);
}

// intercept internal links for custom smooth scroll
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const href = a.getAttribute('href');
  if (href === '#' || href === '#!') return;
  const targetId = href.slice(1);
  const target = document.getElementById(targetId);
  if (target) {
    e.preventDefault();
    // compute offset to respect sticky header height
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const rect = target.getBoundingClientRect();
    const targetY = window.scrollY + rect.top - Math.min(headerHeight, 80) - 12; // subtle offset
    smoothScrollTo(targetY, 680);
    // if mobile menu open, close it
    closeMobileMenuIfOpen();
  }
});

// ---- Mobile nav toggle (hamburger -> X) ----
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

function openMobileMenu() {
  navToggle.classList.add('open');
  navToggle.setAttribute('aria-expanded', 'true');
  mobileMenu.classList.add('open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  // disable body scroll optionally
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  navToggle.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function toggleMobileMenu() {
  if (navToggle.classList.contains('open')) closeMobileMenu();
  else openMobileMenu();
}

function closeMobileMenuIfOpen(){
  if (navToggle && navToggle.classList.contains('open')) closeMobileMenu();
}

if (navToggle) {
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMobileMenu();
  });
  // close on outside click
  document.addEventListener('click', (e) => {
    const within = e.target.closest('.mobile-menu') || e.target.closest('.hamburger');
    if (!within) closeMobileMenuIfOpen();
  });
}

// Also close when a mobile link is clicked (they will also smooth scroll via link handler)
// links inside the mobile menu - use the actual container id/class in the markup
Array.from(document.querySelectorAll('#mobileMenu a')).forEach(a => {
  a.addEventListener('click', () => setTimeout(closeMobileMenu, 350));
});

// close mobile menu with Escape key for accessibility
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeMobileMenuIfOpen();
  }
});

// ---- Scroll reveal with IntersectionObserver + stagger ----
const reveals = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // compute an index for staggering by counting previous siblings with .reveal
        const all = Array.from(document.querySelectorAll('.reveal'));
        const index = all.indexOf(entry.target);
        // assign CSS var to control transition-delay
        entry.target.style.setProperty('--stagger-index', index);
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -10px 0px'
  });

  reveals.forEach(el => io.observe(el));
} else {
  // Fallback: show all
  reveals.forEach((el, i) => {
    el.style.setProperty('--stagger-index', i);
    el.classList.add('active');
  });
}

// ---- Improve perceived scroll (reduce abrupt flicker on load) ----
window.addEventListener('load', () => {
  // ensure header height accounted if the page loaded with a hash
  if (location.hash) {
    const id = location.hash.slice(1);
    const target = document.getElementById(id);
    if (target) {
      const header = document.querySelector('.site-header');
      const headerHeight = header ? header.getBoundingClientRect().height : 0;
      const rect = target.getBoundingClientRect();
      const targetY = window.scrollY + rect.top - Math.min(headerHeight, 80) - 12;
      // small instant scroll without animation to align then animate into view
      window.scrollTo(0, targetY);
    }
  }
});

// Función auxiliar para convertir HEX a RGB
function hexToRgb(hex) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Función principal para aplicar los colores
function applyPastelColorsToFaq() {
  
  // Paleta de colores SÓLO amarillos y verdes pasteles
  const palette = [
    '#ffc811ff', // amarillo principal (original)
    '#ffd452ff', // amarillo pálido
    '#fae188ff', // amarillo muy claro
    '#99f071ff', // verde pálido
    '#3aff5eff', // verde suave
    '#94fdc4ff', // verde muy pálido
    '#d8fd5fff'  // crema con tinte verde
  ];

  const items = document.querySelectorAll('.faq-item');
  
  items.forEach((el, idx) => {
    // Asigna un color de la paleta
    const color = palette[idx % palette.length];
    
    // Aplica un degradado suave con el color pastel
    el.style.background = `linear-gradient(180deg, ${color} 0%, rgba(255,255,255,0.92) 100%)`;
    
    // Revisa la luminosidad del color
    const rgb = hexToRgb(color) || {r:255,g:255,b:255};
    const lum = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
    
    // Si el fondo es claro (luminosidad > 0.7), pone el texto oscuro.
    // Como todos tus pasteles son claros, el texto será oscuro.
    el.style.color = lum > 0.7 ? '#111827' : '#0f172a';
    
    // Aplica el borde
    el.style.border = `1px solid rgba(16,24,40,0.04)`;

    // Asigna una variable CSS para la rotación aleatoria en el hover
    const rot = (Math.random() * 5 - 2.5).toFixed(2) + 'deg'; // Rango de rotación más sutil
    el.style.setProperty('--faq-rot', rot);
  });
}

// Ejecuta la función cuando el contenido de la página esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyPastelColorsToFaq);
} else {
  applyPastelColorsToFaq();
}