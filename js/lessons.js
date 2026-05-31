import { state, saveState } from './state.js';
import { fetchJson, clamp, preloadImages } from './utils.js';

export async function loadLessonsIndex() {
  state.lessonsIndex = await fetchJson('./data/lessons-index.json');
  return state.lessonsIndex;
}

export function validateLesson(lesson) {
  const required = ['id', 'title', 'character_name', 'steps', 'palette'];
  const missing = required.filter(key => !(key in lesson));
  if (missing.length) throw new Error(`Lesson is missing: ${missing.join(', ')}`);
  lesson.steps.forEach((step, index) => {
    ['title', 'instruction', 'hint', 'image'].forEach(key => {
      if (!(key in step)) throw new Error(`Step ${index + 1} missing ${key}`);
    });
  });
  return lesson;
}

export async function loadLesson(id, preferredStep = 0) {
  const lesson = validateLesson(await fetchJson(`./lessons/${id}.json`));
  state.currentLessonId = id;
  state.lessonData = lesson;
  state.currentStepIndex = clamp(preferredStep, 0, lesson.steps.length - 1);
  saveState();
  preloadImages(lesson.steps.map(step => step.image));
  return lesson;
}

export function getCurrentStep() {
  return state.lessonData.steps[state.currentStepIndex];
}

export function nextStep() {
  state.currentStepIndex = clamp(state.currentStepIndex + 1, 0, state.lessonData.steps.length - 1);
  saveState();
  return getCurrentStep();
}

export function prevStep() {
  state.currentStepIndex = clamp(state.currentStepIndex - 1, 0, state.lessonData.steps.length - 1);
  saveState();
  return getCurrentStep();
}

export function jumpToStep(index) {
  state.currentStepIndex = clamp(Number(index), 0, state.lessonData.steps.length - 1);
  saveState();
  return getCurrentStep();
}
