import { fetchJson } from './utils.js';

let paletteData = null;

export async function loadPaletteData() {
  paletteData = await fetchJson('./data/palettes.json');
  return paletteData;
}

export function getPaletteForLesson(lesson) {
  return Object.entries(lesson.palette || {}).map(([name, color]) => ({ name, color }));
}

export function generateEmotionPalette(emotion = 'cozy') {
  const values = paletteData?.emotion_palettes?.[emotion] || paletteData?.emotion_palettes?.cozy || ['#F7D774', '#211934'];
  return values.map((color, index) => ({ name: `${emotion}-${index + 1}`, color }));
}

export function generateMagicPalette(theme = 'soft-spell') {
  const values = paletteData?.magic_palettes?.[theme] || ['#E4C7FF', '#F7D774', '#A7F3D0'];
  return values.map((color, index) => ({ name: `${theme}-${index + 1}`, color }));
}
