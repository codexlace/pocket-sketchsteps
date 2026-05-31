import { state, saveState, markStepComplete } from './state.js';
import { loadLesson, nextStep, prevStep, jumpToStep } from './lessons.js';
import { byId, titleCase } from './utils.js';
import { renderOverlay, toggleOverlay } from './overlays.js';
import { getPaletteForLesson } from './palettes.js';
import { generateLivingObject, generateMagicItem } from './generator.js';

const els = {};

export function initUi() {
  [
    'lesson-sections','lesson-search','lesson-title','lesson-category','step-image','overlay-svg',
    'step-dots','step-count','step-title','step-instruction','step-hint','palette-swatches',
    'prev-step','next-step','jump-step','complete-step','overlay-toggle','palette-button','bio-button',
    'layer-tip-toggle','layer-tip','image-zoom-button','modal','modal-content','modal-close',
    'menu-toggle','close-menu','lesson-panel','welcome-note','generator-button','install-button'
  ].forEach(id => els[id] = byId(id));

  bindStaticEvents();
}

function bindStaticEvents() {
  els['prev-step'].addEventListener('click', () => { prevStep(); renderAll(); });
  els['next-step'].addEventListener('click', () => { nextStep(); renderAll(); });
  els['jump-step'].addEventListener('change', event => { jumpToStep(event.target.value); renderAll(); });
  els['complete-step'].addEventListener('click', () => {
    markStepComplete(state.currentLessonId, state.currentStepIndex);
    renderAll();
  });
  els['overlay-toggle'].addEventListener('click', () => {
    const enabled = toggleOverlay(els['overlay-svg']);
    els['overlay-toggle'].setAttribute('aria-pressed', String(enabled));
    saveState();
  });
  els['layer-tip-toggle'].addEventListener('change', event => {
    state.uiPreferences.layerTipsEnabled = event.target.checked;
    saveState();
    renderStep();
  });
  els['palette-button'].addEventListener('click', renderPaletteModal);
  els['bio-button'].addEventListener('click', renderBioModal);
  els['image-zoom-button'].addEventListener('click', renderZoomModal);
  els['modal-close'].addEventListener('click', () => els.modal.close());
  els['menu-toggle'].addEventListener('click', () => els['lesson-panel'].classList.add('open'));
  els['close-menu'].addEventListener('click', () => els['lesson-panel'].classList.remove('open'));
  els['lesson-search'].addEventListener('input', () => renderLessonList());
  els['generator-button'].addEventListener('click', renderGeneratorModal);

  let touchStartX = 0;
  els['image-zoom-button'].addEventListener('touchstart', event => {
    touchStartX = event.changedTouches[0].clientX;
  }, { passive: true });
  els['image-zoom-button'].addEventListener('touchend', event => {
    const dx = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) < 48) return;
    dx < 0 ? nextStep() : prevStep();
    renderAll();
  }, { passive: true });
}

export function renderLessonList() {
  const index = state.lessonsIndex;
  const query = els['lesson-search'].value.trim().toLowerCase();
  els['lesson-sections'].innerHTML = '';

  index.sections.forEach(section => {
    const lessons = section.lesson_ids
      .map(id => index.lessons.find(lesson => lesson.id === id))
      .filter(Boolean)
      .filter(lesson => {
        const text = `${lesson.title} ${lesson.character_name} ${lesson.category}`.toLowerCase();
        return !query || text.includes(query);
      });

    const wrapper = document.createElement('section');
    wrapper.className = 'lesson-section';
    wrapper.innerHTML = `<h3>${section.title}</h3>`;

    const list = document.createElement('div');
    list.className = 'lesson-list';

    if (!lessons.length) {
      list.innerHTML = `<p class="hint-text">No lessons here yet. Add lesson JSON files and update data/lessons-index.json.</p>`;
    }

    lessons.forEach(lesson => {
      const button = document.createElement('button');
      button.className = `lesson-card ${lesson.id === state.currentLessonId ? 'active' : ''}`;
      button.innerHTML = `
        <img src="${lesson.thumbnail}" alt="">
        <span>
          <strong>${lesson.title}</strong>
          <span>${lesson.character_name} • ${lesson.estimated_minutes} min • ${lesson.difficulty}</span>
        </span>
      `;
      button.addEventListener('click', async () => {
        await loadLesson(lesson.id, 0);
        els['lesson-panel'].classList.remove('open');
        renderAll();
      });
      list.append(button);
    });

    wrapper.append(list);
    els['lesson-sections'].append(wrapper);
  });
}

export function renderStep() {
  const lesson = state.lessonData;
  const step = lesson.steps[state.currentStepIndex];
  const total = lesson.steps.length;

  els['lesson-title'].textContent = lesson.title;
  els['lesson-category'].textContent = `${titleCase(lesson.category)} • ${lesson.estimated_minutes} min`;
  els['step-count'].textContent = `Step ${state.currentStepIndex + 1} of ${total}`;
  els['step-title'].textContent = step.title;
  els['step-instruction'].textContent = step.instruction;
  els['step-hint'].textContent = `Hint: ${step.hint}`;
  els['step-image'].src = step.image;
  els['step-image'].alt = `${lesson.title}, step ${step.step}: ${step.title}`;
  els['prev-step'].disabled = state.currentStepIndex === 0;
  els['next-step'].textContent = state.currentStepIndex === total - 1 ? 'Finish' : 'Next';
  els['next-step'].disabled = false;

  const key = `${state.currentLessonId}:${state.currentStepIndex}`;
  els['complete-step'].textContent = state.completedSteps[key] ? 'Completed ✓' : 'Mark Complete';

  els['layer-tip-toggle'].checked = state.uiPreferences.layerTipsEnabled;
  els['layer-tip'].hidden = !state.uiPreferences.layerTipsEnabled;
  els['layer-tip'].textContent = `Procreate layer tip: ${step.layer_tip || step.procreate_layer || 'Sketch layer'}`;

  els['overlay-toggle'].setAttribute('aria-pressed', String(state.uiPreferences.overlaysEnabled));
  renderOverlay(els['overlay-svg']);
  renderStepDots();
  renderJumpSelect();
  renderPaletteSwatches();
  renderWelcome();
}

function renderStepDots() {
  els['step-dots'].innerHTML = '';
  state.lessonData.steps.forEach((step, index) => {
    const button = document.createElement('button');
    button.className = `step-dot ${index === state.currentStepIndex ? 'active' : ''}`;
    button.textContent = step.step;
    button.setAttribute('aria-label', `Jump to step ${step.step}: ${step.title}`);
    button.addEventListener('click', () => {
      jumpToStep(index);
      renderAll();
    });
    els['step-dots'].append(button);
  });
}

function renderJumpSelect() {
  els['jump-step'].innerHTML = '';
  state.lessonData.steps.forEach((step, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${step.step}. ${step.title}`;
    option.selected = index === state.currentStepIndex;
    els['jump-step'].append(option);
  });
}

function renderPaletteSwatches() {
  els['palette-swatches'].innerHTML = '';
  getPaletteForLesson(state.lessonData).forEach(item => {
    const swatch = document.createElement('span');
    swatch.className = 'swatch';
    swatch.style.background = item.color;
    swatch.title = `${item.name}: ${item.color}`;
    els['palette-swatches'].append(swatch);
  });
}

function renderWelcome() {
  els['welcome-note'].textContent = `Welcome back. You are on Step ${state.currentStepIndex + 1} of ${state.lessonData.character_name}.`;
}

function showModal(html) {
  els['modal-content'].innerHTML = html;
  els.modal.showModal();
}

function renderPaletteModal() {
  const swatches = getPaletteForLesson(state.lessonData).map(item => `
    <div style="display:flex;align-items:center;gap:.7rem;margin:.45rem 0">
      <span class="swatch" style="background:${item.color}"></span>
      <strong>${item.name}</strong>
      <code>${item.color}</code>
    </div>
  `).join('');
  showModal(`<h2>${state.lessonData.character_name} palette</h2>${swatches}`);
}

function renderBioModal() {
  showModal(`
    <h2>${state.lessonData.character_name}</h2>
    <p class="instruction-text">${state.lessonData.bio}</p>
    <p class="hint-text">Use this personality to exaggerate pose, eyebrows, accessories, and texture marks.</p>
  `);
}

function renderZoomModal() {
  const step = state.lessonData.steps[state.currentStepIndex];
  showModal(`<h2>${step.title}</h2><img class="zoomed-image" src="${step.image}" alt="${step.title}">`);
}

function renderGeneratorModal() {
  const living = generateLivingObject();
  const magic = generateMagicItem();
  showModal(`
    <div class="generated-card">
      <h2>Deterministic Idea Generator</h2>
      <p class="hint-text">This is not AI. It uses templates, weighted random picks, and beginner-safe drawing constraints.</p>
      <h3>${living.title}</h3>
      <ol>${living.recipe.map(item => `<li>${item}</li>`).join('')}</ol>
      <pre>${living.logic}</pre>
      <h3>${magic.title}</h3>
      <p>${magic.prompt}</p>
      <pre>${magic.constraints.join(' • ')}</pre>
    </div>
  `);
}

export function renderAll() {
  renderLessonList();
  renderStep();
}
