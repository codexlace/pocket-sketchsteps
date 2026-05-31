import { state } from './state.js';

export function renderOverlay(svg) {
  if (!state.lessonData) return;
  const stepNumber = state.currentStepIndex + 1;
  const palette = state.lessonData.palette;
  svg.innerHTML = `
    <line x1="50" y1="8" x2="50" y2="92" stroke="#A7F3D0" stroke-width="0.7" stroke-dasharray="2 2"/>
    <line x1="15" y1="50" x2="85" y2="50" stroke="#A7F3D0" stroke-width="0.7" stroke-dasharray="2 2"/>
    <rect x="24" y="18" width="52" height="68" rx="6" fill="none" stroke="#F7D774" stroke-width="0.8"/>
    <text x="5" y="94" fill="#FFF7D6" font-size="4">Blueprint guide • step ${stepNumber}</text>
    <circle cx="88" cy="13" r="3.5" fill="${palette.accent || palette.body || '#F7D774'}"/>
  `;
  svg.classList.toggle('visible', state.uiPreferences.overlaysEnabled);
}

export function toggleOverlay(svg) {
  state.uiPreferences.overlaysEnabled = !state.uiPreferences.overlaysEnabled;
  renderOverlay(svg);
  return state.uiPreferences.overlaysEnabled;
}
