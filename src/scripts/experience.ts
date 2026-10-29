import { animate, motion, resizeScroll } from './motion';

const cinema = document.querySelector<HTMLElement>('[data-cinema]');
const sceneButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-scene-button]')];
const scenes = [...document.querySelectorAll<HTMLElement>('[data-scene]')];
const credits = [...document.querySelectorAll<HTMLElement>('[data-scene-credit]')];
if (cinema) {
  cinema.querySelector<HTMLElement>('.scene-picker')!.hidden = false;
  sceneButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      sceneButtons.forEach((item, i) => item.setAttribute('aria-pressed', String(index === i)));
      scenes.forEach((scene, i) => {
        scene.classList.toggle('is-active', i === index);
        scene.setAttribute('aria-hidden', String(i !== index));
      });
      credits.forEach((credit, i) => { credit.hidden = i !== index; });
      animate(credits[index], [{opacity: 0, transform: 'translateY(7px)'}, {opacity: 1, transform: 'none'}], 250);
    });
    button.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? sceneButtons.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + sceneButtons.length) % sceneButtons.length;
      sceneButtons[next].focus();
      sceneButtons[next].click();
    });
  });
}

const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
document.querySelectorAll<HTMLElement>('[data-project-media]').forEach(media => {
  const alternate = media.querySelector<HTMLImageElement>('.project-alternate img');
  const prepareAlternate = async () => {
    if (!alternate) return;
    try {
      await alternate.decode();
      if (alternate.naturalWidth) media.dataset.alternateReady = 'true';
    } catch { /* Keep the cover visible if the alternate cannot be decoded. */ }
  };
  alternate?.addEventListener('load', prepareAlternate);
  if (alternate?.complete && alternate.naturalWidth) void prepareAlternate();
  const action = media.querySelector<HTMLElement>('.image-action');
  if (!action) return;
  let raf = 0;
  let clientX = 0, clientY = 0;
  let pointerX = 0, pointerY = 0, currentX = 0, currentY = 0, lastTime = 0;
  const renderPointer = (time: number) => {
    // Time-based damping stays consistent on 60 Hz and high-refresh displays.
    const elapsed = lastTime ? Math.min(40, time - lastTime) : 16.7;
    const ease = 1 - Math.exp(-elapsed / 55);
    currentX += (pointerX - currentX) * ease;
    currentY += (pointerY - currentY) * ease;
    action.style.setProperty('--cursor-x', `${currentX.toFixed(2)}px`);
    action.style.setProperty('--cursor-y', `${currentY.toFixed(2)}px`);
    lastTime = time;
    if (Math.abs(pointerX - currentX) + Math.abs(pointerY - currentY) > .15) {
      raf = requestAnimationFrame(renderPointer);
    } else {
      raf = 0;
      lastTime = 0;
    }
  };
  const clearPointer = () => { delete media.dataset.pointer; if (raf) cancelAnimationFrame(raf); raf = 0; lastTime = 0; };
  const positionPointer = () => {
    if (!finePointer.matches || motion.matches) { clearPointer(); return; }
    const rect = media.getBoundingClientRect();
    if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
      clearPointer();
      return;
    }
    const marginX = Math.min(94, rect.width / 2);
    pointerX = Math.max(marginX, Math.min(rect.width - marginX, clientX - rect.left));
    pointerY = Math.max(44, Math.min(rect.height - 44, clientY - rect.top));
    if (!media.dataset.pointer) {
      currentX = pointerX;
      currentY = pointerY;
      action.style.setProperty('--cursor-x', `${currentX}px`);
      action.style.setProperty('--cursor-y', `${currentY}px`);
    }
    media.dataset.pointerPositioned = 'true';
    media.dataset.pointer = 'true';
    if (!raf) raf = requestAnimationFrame(renderPointer);
  };
  const trackPointer = (event: PointerEvent) => {
    if (event.pointerType === 'touch') return;
    clientX = event.clientX;
    clientY = event.clientY;
    positionPointer();
  };
  media.addEventListener('pointerenter', trackPointer);
  media.addEventListener('pointermove', trackPointer);
  media.addEventListener('pointerleave', clearPointer);
  media.addEventListener('pointercancel', clearPointer);
  // Scrolling moves the image under the pointer; it must not restart the fade.
  const repositionActivePointer = () => { if (media.dataset.pointer) positionPointer(); };
  window.addEventListener('scroll', repositionActivePointer, { passive: true });
  window.addEventListener('resize', repositionActivePointer, { passive: true });
  window.addEventListener('blur', clearPointer);
  finePointer.addEventListener('change', clearPointer);
  motion.addEventListener('change', clearPointer);
});

document.querySelectorAll<HTMLAnchorElement>('[data-menu-scene]').forEach(link => {
  const show = () => document.querySelectorAll<HTMLElement>('[data-menu-photo]').forEach(photo => photo.classList.toggle('is-active', photo.dataset.menuPhoto === link.dataset.menuScene));
  link.addEventListener('pointerenter', show);
  link.addEventListener('focus', show);
});

const collection = document.querySelector<HTMLElement>('.work-grid');
const viewButtons = [...document.querySelectorAll<HTMLButtonElement>('[data-work-view]')];
if (collection && viewButtons.length) {
  document.querySelector<HTMLElement>('.view-switch')!.hidden = false;
  viewButtons.forEach(button => button.addEventListener('click', () => {
    if (button.getAttribute('aria-pressed') === 'true') return;
    collection.dataset.view = button.dataset.workView;
    viewButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    animate(collection, [{ opacity: .2, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], 300);
    resizeScroll();
  }));
}

let cinemaFrame = 0;
const updateCinema = () => {
  cinemaFrame = 0;
  if (!cinema) return;
  if (motion.matches || !finePointer.matches) {
    cinema.style.removeProperty('--scene-scale');
    cinema.style.removeProperty('--title-shift');
    return;
  }
  const rect = cinema.getBoundingClientRect();
  if (rect.bottom < 0) return;
  const progress = Math.max(0, Math.min(1, -rect.top / rect.height));
  cinema.style.setProperty('--scene-scale', String(1 + progress * .065));
  cinema.style.setProperty('--title-shift', `${progress * -55}px`);
};
const requestCinema = () => { if (cinema && !cinemaFrame) cinemaFrame = requestAnimationFrame(updateCinema); };
window.addEventListener('scroll', requestCinema, { passive: true });
window.addEventListener('resize', requestCinema, { passive: true });
motion.addEventListener('change', requestCinema);
finePointer.addEventListener('change', requestCinema);
requestCinema();
