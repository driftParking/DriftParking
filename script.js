const meter = document.querySelector('.scroll-meter');
const revealItems = document.querySelectorAll('.reveal');
const counters = document.querySelectorAll('[data-count]');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const formatCounterValue = (value, format) => {
  if (format === 'decimal') {
    return Number(value).toFixed(4).replace(/\.0+$|(?<=\.[0-9]*?)0+$/, '');
  }

  if (format === 'percent') {
    return Number(value).toFixed(2);
  }

  return Math.round(value).toString();
};

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = Number(el.dataset.count);
      const format = el.dataset.format || 'integer';
      const duration = 900;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        el.textContent = formatCounterValue(value, format);
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  },
  { threshold: 0.55 }
);

counters.forEach((counter) => countObserver.observe(counter));

const updateMeter = () => {
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const progress = height > 0 ? window.scrollY / height : 0;
  meter.style.width = `${progress * 100}%`;
};

window.addEventListener('scroll', updateMeter, { passive: true });
window.addEventListener('resize', updateMeter);
updateMeter();
