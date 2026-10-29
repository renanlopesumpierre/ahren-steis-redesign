import type Lenis from 'lenis';

export const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const desktop = window.matchMedia('(min-width: 800px) and (pointer: fine)');
const activeAnimations = new Set<Animation>();
const locks = new Set<string>();
let lenis: Lenis | undefined;
let generation = 0;

export function animate(element: Element, frames: Keyframe[], duration = 260, delay = 0) {
  if (motion.matches || !element.animate) return undefined;
  const animation = element.animate(frames, {
    duration, delay, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards',
  });
  activeAnimations.add(animation);
  animation.finished.catch(() => {}).finally(() => activeAnimations.delete(animation));
  return animation;
}

export function lockScroll(key: string, locked: boolean) {
  if (locked) locks.add(key); else locks.delete(key);
  if (locks.size) lenis?.stop(); else lenis?.start();
}

export function resizeScroll() { lenis?.resize(); }

async function syncSmoothScroll() {
  const current = ++generation;
  if (motion.matches || !desktop.matches) {
    lenis?.destroy();
    lenis = undefined;
    return;
  }
  if (lenis) return;
  try {
    const { default: SmoothScroll } = await import('lenis');
    if (current !== generation) return;
    lenis = new SmoothScroll({
      autoRaf: true, duration: 1.05,
      easing: t => 1 - Math.pow(1 - t, 4),
      smoothWheel: true, syncTouch: false, anchors: false,
      stopInertiaOnNavigate: true, respectReducedMotion: true,
      prevent: node => !!node.closest('.mobile-nav, .lightbox, textarea, select'),
    });
    if (locks.size) lenis.stop();
  } catch {
    // Native scrolling is the complete fallback if the optional chunk cannot load.
  }
}

desktop.addEventListener('change', syncSmoothScroll);
motion.addEventListener('change', () => {
  if (motion.matches) activeAnimations.forEach(animation => animation.cancel());
  void syncSmoothScroll();
});
window.addEventListener('pagehide', () => lenis?.stop());
window.addEventListener('pageshow', () => { if (!locks.size) lenis?.start(); });
void syncSmoothScroll();

// Preserve focus and URL semantics while easing the two in-page navigation links.
document.querySelectorAll<HTMLAnchorElement>('.back-top, .cinema-work-link').forEach(link => link.addEventListener('click', event => {
  if (!lenis || motion.matches || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  const target = document.querySelector<HTMLElement>(link.hash);
  if (!target) return;
  event.preventDefault();
  lenis.scrollTo(link.hash === '#main' ? 0 : target, { duration: 1.05, onComplete: () => {
    target.tabIndex = -1;
    target.focus({ preventScroll: true });
    history.replaceState(history.state, '', `${location.pathname}${location.search}${link.hash}`);
  } });
}));

// Only elements still below the viewport are hidden. Once seen, they stay visible.
const extraReveals = '.about-story > *, .working-model > h2, .working-model article, .experience > div, .process-list > li, .faq-section > h2, .faq-section details, .credits > *, .notes-index > a, .reels-section > *, .capabilities > *, .contact-followup';
document.querySelectorAll<HTMLElement>(extraReveals).forEach(element => {
  if (!element.closest('[data-reveal]')) element.dataset.reveal = '';
});
if (!motion.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting);
    visible.forEach((entry, i) => {
      const element = entry.target as HTMLElement;
      element.style.setProperty('--reveal-delay', `${Math.min(i, 2) * 65}ms`);
      element.classList.remove('reveal-ready');
      observer.unobserve(element);
    });
  }, { threshold: .04, rootMargin: '0px 0px -20px 0px' });
  document.querySelectorAll<HTMLElement>('[data-reveal]').forEach(element => {
    if (element.getBoundingClientRect().top > innerHeight && !element.hidden) {
      element.classList.add('reveal-ready');
      observer.observe(element);
    }
  });
  document.addEventListener('focusin', event => {
    const element = (event.target as HTMLElement).closest<HTMLElement>('.reveal-ready');
    if (element) {
      element.style.setProperty('--reveal-delay', '0ms');
      element.classList.remove('reveal-ready');
      observer.unobserve(element);
    }
  });
  motion.addEventListener('change', () => {
    if (!motion.matches) return;
    document.querySelectorAll('.reveal-ready').forEach(element => element.classList.remove('reveal-ready'));
    observer.disconnect();
  });
}

// A few pixels of depth on full-width stills; no pinning, touch inertia or scroll takeover.
const depthMedia = [...document.querySelectorAll<HTMLElement>('.hero-film, .wide-photo, .services-image')];
let frame = 0;
function updateDepth() {
  frame = 0;
  if (motion.matches || !desktop.matches) return;
  const positions = depthMedia.map(container => ({ container, rect: container.getBoundingClientRect() }));
  positions.forEach(({ container, rect }) => {
    if (rect.bottom < 0 || rect.top > innerHeight) return;
    const progress = Math.max(-1, Math.min(1, (innerHeight / 2 - rect.top - rect.height / 2) / (innerHeight / 2 + rect.height / 2)));
    container.style.setProperty('--depth-y', `${(progress * 24).toFixed(2)}px`);
  });
}
function requestDepth() {
  if (!frame && !motion.matches && desktop.matches && depthMedia.length) frame = requestAnimationFrame(updateDepth);
}
function syncDepth() {
  const enabled = !motion.matches && desktop.matches;
  depthMedia.forEach(container => {
    container.classList.toggle('depth-media', enabled);
    if (!enabled) container.style.removeProperty('--depth-y');
  });
  requestDepth();
}
window.addEventListener('scroll', requestDepth, { passive: true });
window.addEventListener('resize', requestDepth, { passive: true });
motion.addEventListener('change', syncDepth);
desktop.addEventListener('change', syncDepth);
syncDepth();
