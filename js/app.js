import { state } from './state.js';
import { loadLessonsIndex, loadLesson } from './lessons.js';
import { loadPaletteData } from './palettes.js';
import { initUi, renderAll } from './ui.js';

let deferredInstallPrompt = null;

async function boot() {
  initUi();
  await Promise.all([loadLessonsIndex(), loadPaletteData()]);
  await loadLesson(state.currentLessonId, state.currentStepIndex);
  renderAll();
  setupInstallPrompt();
}

function setupInstallPrompt() {
  const installButton = document.getElementById('install-button');

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    installButton.hidden = false;
  });

  installButton.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    installButton.hidden = true;
  });
}

boot().catch(error => {
  console.error(error);
  document.body.innerHTML = `
    <main style="padding:2rem;color:white;font-family:system-ui">
      <h1>Pocket SketchSteps could not start</h1>
      <p>${error.message}</p>
      <p>Check that all files were uploaded together and that GitHub Pages is serving from the project root.</p>
    </main>
  `;
});
