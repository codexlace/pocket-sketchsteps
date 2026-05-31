import { state } from './state.js';
import { loadLessonsIndex, loadLesson } from './lessons.js';
import { loadPaletteData } from './palettes.js';
import { initUi, renderAll } from './ui.js';

let deferredInstallPrompt = null;

async function boot() {
  initUi();

  await Promise.all([
    loadLessonsIndex(),
    loadPaletteData()
  ]);

  await loadLesson(state.currentLessonId, state.currentStepIndex);

  renderAll();
  setupInstallPrompt();
}

function setupInstallPrompt() {
  const installButton = document.getElementById('install-button');

  if (!installButton) {
    return;
  }

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    installButton.hidden = false;
  });

  installButton.addEventListener('click', async () => {
    if (!deferredInstallPrompt) return;

    try {
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
    } catch (error) {
      console.warn('Install prompt could not open:', error);
    }

    deferredInstallPrompt = null;
    installButton.hidden = true;
  });
}

function showStartupError(error) {
  console.error(error);

  const safeMessage = error?.message || 'Unknown startup error';

  document.body.innerHTML = `
    <main style="
      min-height:100vh;
      padding:2rem;
      color:#22303c;
      background:
        radial-gradient(circle at 20% 20%, rgba(139,191,232,.28), transparent 32rem),
        radial-gradient(circle at 85% 75%, rgba(244,167,188,.28), transparent 34rem),
        #f8efe3;
      font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
      line-height:1.5;
    ">
      <section style="
        max-width:680px;
        padding:1.5rem;
        border-radius:24px;
        background:rgba(255,255,255,.78);
        box-shadow:0 16px 50px rgba(34,48,60,.12);
        border:1px solid rgba(34,48,60,.12);
      ">
        <h1 style="margin-top:0;">Pocket SketchSteps could not start</h1>
        <p><strong>Error:</strong> ${safeMessage}</p>
        <p>
          Try refreshing once. If this keeps happening, clear Safari website data
          for this site and reload.
        </p>
        <p style="font-size:.95rem;opacity:.8;">
          Also check that GitHub Pages is serving from the project root and that
          <code>index.html</code>, <code>js/</code>, <code>css/</code>,
          <code>data/</code>, <code>lessons/</code>, and <code>assets/</code>
          were uploaded together.
        </p>
      </section>
    </main>
  `;
}

boot().catch(showStartupError);
