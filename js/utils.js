export async function fetchJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function byId(id) {
  return document.getElementById(id);
}

export function titleCase(value = '') {
  return value.replace(/-/g, ' ').replace(/\b\w/g, match => match.toUpperCase());
}

export function preloadImages(urls) {
  return Promise.allSettled(urls.map(src => new Promise(resolve => {
    const image = new Image();
    image.onload = resolve;
    image.onerror = resolve;
    image.src = src;
  })));
}
