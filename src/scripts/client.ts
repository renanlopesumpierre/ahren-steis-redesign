import { animate, lockScroll, motion, resizeScroll } from './motion';

const header = document.querySelector<HTMLElement>('.site-header');
const readingProgress = document.querySelector<HTMLElement>('.reading-progress');
const menuButton = document.querySelector<HTMLButtonElement>('.menu-toggle');
const menu = document.querySelector<HTMLElement>('.mobile-nav');
const background = [...document.querySelectorAll<HTMLElement>('main, footer')];
const headerLinks = [...document.querySelectorAll<HTMLElement>('.site-header > a, .desktop-nav')];
let menuOpen = false;
let menuRevision = 0;
let menuAnimations: Animation[] = [];

function cancelMenuAnimations() {
  menuAnimations.forEach(animation => animation.cancel());
  menuAnimations = [];
}

async function closeMenu(immediate = false) {
  if (!menu || !menuButton || menu.hidden) return;
  const revision = ++menuRevision;
  menuOpen = false;
  cancelMenuAnimations();
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
  menuButton.querySelector('.menu-label')!.textContent = 'Menu';
  if (menu.contains(document.activeElement)) menuButton.focus({ preventScroll: true });
  menu.inert = true;
  if (!immediate) {
    menu.querySelectorAll('a, p').forEach(element => {
      const animation = animate(element, [{ opacity: 1 }, { opacity: 0 }], 150);
      if (animation) menuAnimations.push(animation);
    });
    await Promise.allSettled(menuAnimations.map(animation => animation.finished));
  }
  if (revision !== menuRevision) return;
  menu.hidden = true;
  background.forEach(element => { element.inert = false; });
  headerLinks.forEach(element => { element.inert = false; });
  document.body.classList.remove('menu-open');
  lockScroll('menu', false);
}

function openMenu() {
  if (!menu || !menuButton) return;
  ++menuRevision;
  cancelMenuAnimations();
  menuOpen = true;
  menu.hidden = false;
  menu.inert = false;
  menuButton.setAttribute('aria-expanded', 'true');
  menuButton.setAttribute('aria-label', 'Close menu');
  menuButton.querySelector('.menu-label')!.textContent = 'Close';
  document.body.classList.add('menu-open');
  background.forEach(element => { element.inert = true; });
  headerLinks.forEach(element => { element.inert = true; });
  lockScroll('menu', true);
  const curtain = animate(menu, [{ clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0)' }], 480);
  if (curtain) menuAnimations.push(curtain);
  menu.querySelectorAll('a, p').forEach((element, i) => {
    const item = animate(element, [{ opacity: 0, transform: 'translateY(25px)' }, { opacity: 1, transform: 'none' }], 420, 70 + i * 40);
    if (item) menuAnimations.push(item);
  });
  menu.querySelector<HTMLElement>('a')?.focus({ preventScroll: true });
}

menuButton?.addEventListener('click', () => { if (menuOpen) void closeMenu(); else openMenu(); });
menu?.addEventListener('click', event => { if ((event.target as HTMLElement).closest('a')) void closeMenu(true); });
document.addEventListener('keydown', event => {
  if (!menu || !menuOpen) return;
  if (event.key === 'Escape') { event.preventDefault(); void closeMenu(); }
  if (event.key === 'Tab') {
    const items = [menuButton!, ...menu.querySelectorAll<HTMLAnchorElement>('a')];
    const first = items[0], last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
});
window.addEventListener('pagehide', () => { void closeMenu(true); });
let headerFrame = 0;
function updateHeader() {
  headerFrame = 0;
  const scrollTop = Math.max(0, window.scrollY);
  const scrollRange = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const progress = scrollRange > 0 ? Math.min(1, scrollTop / scrollRange) : 0;
  header?.classList.toggle('is-scrolled', scrollTop > 40);
  if (readingProgress) readingProgress.style.transform = `scaleX(${progress})`;
}
function requestHeaderUpdate() {
  if (!headerFrame) headerFrame = requestAnimationFrame(updateHeader);
}
window.addEventListener('scroll', requestHeaderUpdate, { passive: true });
window.addEventListener('resize', requestHeaderUpdate, { passive: true });
window.addEventListener('pageshow', requestHeaderUpdate);
// Keep progress accurate when fonts, filters or expandable content change the page height.
if ('ResizeObserver' in window) new ResizeObserver(requestHeaderUpdate).observe(document.body);
updateHeader();

document.querySelectorAll<HTMLElement>('[data-gallery]').forEach(gallery => {
  const dialog = document.querySelector<HTMLDialogElement>(`[data-lightbox="${gallery.dataset.gallery}"]`);
  const frames = [...gallery.querySelectorAll<HTMLAnchorElement>('[data-frame]')];
  if (!dialog || !frames.length) return;
  let current = 0;
  let opener: HTMLElement | null = null;
  let closing = false;
  let imageAnimation: Animation | undefined;
  const image = dialog.querySelector<HTMLImageElement>('[data-gallery-image]')!;

  const show = (index: number) => {
    current = (index + frames.length) % frames.length;
    const frame = frames[current];
    imageAnimation?.cancel();
    image.src = frame.href;
    image.toggleAttribute('data-capture-edge', frame.hasAttribute('data-capture-edge'));
    image.alt = frame.querySelector('img')?.alt || '';
    dialog.querySelector('[data-gallery-caption]')!.textContent = frame.dataset.caption || '';
    dialog.querySelector('[data-frame-count]')!.textContent = `${current + 1} / ${frames.length}`;
    dialog.querySelectorAll<HTMLButtonElement>('[data-gallery-thumb]').forEach((thumb, i) => thumb.setAttribute('aria-pressed', String(i === current)));
    const fade = () => { if (dialog.open && !closing) imageAnimation = animate(image, [{ opacity: .45 }, { opacity: 1 }], 240); };
    image.onload = fade;
    if (image.complete) fade();
  };
  const open = (index: number, element: HTMLElement) => {
    opener = element;
    closing = false;
    show(index);
    dialog.showModal();
    document.body.classList.add('gallery-open');
    lockScroll('gallery', true);
    animate(dialog, [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], 280);
  };
  const close = async () => {
    if (closing) return;
    closing = true;
    imageAnimation?.cancel();
    const animation = animate(dialog, [{ opacity: 1 }, { opacity: 0 }], 160);
    if (animation) await animation.finished.catch(() => {});
    dialog.close();
  };
  frames.forEach((frame, i) => frame.addEventListener('click', event => { event.preventDefault(); open(i, frame); }));
  document.querySelectorAll<HTMLElement>(`[data-open-gallery="${gallery.dataset.gallery}"]`).forEach(element => element.addEventListener('click', event => { event.preventDefault(); open(0, element); }));
  dialog.querySelector('[data-gallery-close]')?.addEventListener('click', () => { void close(); });
  dialog.querySelector('[data-gallery-prev]')?.addEventListener('click', () => { if (!closing) show(current - 1); });
  dialog.querySelector('[data-gallery-next]')?.addEventListener('click', () => { if (!closing) show(current + 1); });
  dialog.querySelectorAll<HTMLButtonElement>('[data-gallery-thumb]').forEach((thumb, i) => thumb.addEventListener('click', () => { if (!closing) show(i); }));
  dialog.addEventListener('keydown', event => {
    if (closing) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault(); show(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  dialog.addEventListener('cancel', event => { event.preventDefault(); void close(); });
  dialog.addEventListener('click', event => { if (event.target === dialog) void close(); });
  dialog.addEventListener('close', () => {
    closing = false;
    document.body.classList.remove('gallery-open');
    lockScroll('gallery', false);
    opener?.focus({ preventScroll: true });
  });
});

const filters = [...document.querySelectorAll<HTMLButtonElement>('[data-filter]')];
filters.forEach(button => button.addEventListener('click', () => {
  if (button.getAttribute('aria-pressed') === 'true') return;
  filters.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  let count = 0;
  document.querySelectorAll<HTMLElement>('[data-category]').forEach(element => {
    element.hidden = button.dataset.filter !== 'All' && element.dataset.category !== button.dataset.filter;
    if (!element.hidden) {
      element.classList.remove('reveal-ready');
      element.getAnimations().forEach(animation => animation.cancel());
      animate(element, [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], 320, Math.min(count, 2) * 40);
      count++;
    }
  });
  const status = document.querySelector('[data-filter-status]');
  if (status) status.textContent = `${count} ${count === 1 ? 'project' : 'projects'} shown`;
  resizeScroll();
}));

motion.addEventListener('change', () => { if (motion.matches && !menuOpen) void closeMenu(true); });
