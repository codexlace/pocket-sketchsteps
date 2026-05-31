const KEY = 'pocket-sketchsteps-state-v1';

let memoryFallback = {};

function storageAvailable() {
  try {
    const testKey = '__pocket_sketchsteps_storage_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

const canUseLocalStorage = storageAvailable();

export function readStorage() {
  if (!canUseLocalStorage) {
    return memoryFallback;
  }

  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw) || {};
  } catch (error) {
    console.warn('Pocket SketchSteps could not read local storage:', error);
    return {};
  }
}

export function writeStorage(value) {
  memoryFallback = value || {};

  if (!canUseLocalStorage) {
    return memoryFallback;
  }

  try {
    window.localStorage.setItem(KEY, JSON.stringify(memoryFallback));
  } catch (error) {
    console.warn('Pocket SketchSteps switched to memory-only storage:', error);
  }

  return memoryFallback;
}

export function mergeStorage(patch) {
  const next = {
    ...readStorage(),
    ...(patch || {}),
    updatedAt: new Date().toISOString()
  };

  return writeStorage(next);
}
