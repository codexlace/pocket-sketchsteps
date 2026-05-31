const KEY = 'pocket-sketchsteps-state-v1';

export function readStorage() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

export function writeStorage(value) {
  localStorage.setItem(KEY, JSON.stringify(value));
}

export function mergeStorage(patch) {
  const next = { ...readStorage(), ...patch, updatedAt: new Date().toISOString() };
  writeStorage(next);
  return next;
}
