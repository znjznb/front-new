// Scroll-triggered reveal animations
function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

document.addEventListener('DOMContentLoaded', () => {
  // Gate CSS opacity:0 behind this class — content visible without JS
  document.documentElement.classList.add('js-reveal');

  const revealElements = document.querySelectorAll('.reveal');

  if (!revealElements.length) return;

  // Eagerly reveal elements already in the viewport
  // This prevents a flash-then-disappear when CSS (opacity:0) arrives
  // after first paint — common in dev mode (Vite CSS injection).
  revealElements.forEach((el) => {
    if (isInViewport(el)) el.classList.add('visible');
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  revealElements.forEach((el) => {
    if (!el.classList.contains('visible')) observer.observe(el);
  });
});
