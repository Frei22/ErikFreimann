type Listener = (progress: number) => void;

const listeners = new Set<Listener>();
let current = 0;

/**
 * The hero's 0 → 1 flight progress, published for the few bits of chrome
 * that have to get out of its way (the nav, the altimeter). Deliberately not
 * React state: this changes every frame, and nothing that reads it needs a
 * re-render — they all write straight to a style.
 */
export function setHeroProgress(progress: number) {
  if (progress === current) return;
  current = progress;
  for (const listener of listeners) listener(progress);
}

export function onHeroProgress(listener: Listener) {
  listeners.add(listener);
  listener(current);
  return () => void listeners.delete(listener);
}
