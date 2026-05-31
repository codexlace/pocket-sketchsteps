import { readStorage, mergeStorage } from './storage.js';

const saved = readStorage();

export const state = {
  currentLessonId: saved.currentLessonId || 'grumpy-book',
  currentStepIndex: saved.currentStepIndex || 0,
  completedLessons: saved.completedLessons || {},
  completedSteps: saved.completedSteps || {},
  favoriteLessons: saved.favoriteLessons || [],
  uiPreferences: {
    overlaysEnabled: saved.uiPreferences?.overlaysEnabled ?? false,
    layerTipsEnabled: saved.uiPreferences?.layerTipsEnabled ?? false,
    theme: saved.uiPreferences?.theme || 'blueprint'
  },
  lessonsIndex: null,
  lessonData: null
};

export function saveState() {
  mergeStorage({
    currentLessonId: state.currentLessonId,
    currentStepIndex: state.currentStepIndex,
    completedLessons: state.completedLessons,
    completedSteps: state.completedSteps,
    favoriteLessons: state.favoriteLessons,
    uiPreferences: state.uiPreferences
  });
}

export function markStepComplete(lessonId, stepIndex) {
  const key = `${lessonId}:${stepIndex}`;
  state.completedSteps[key] = true;
  if (state.lessonData && Object.keys(state.completedSteps).filter(k => k.startsWith(`${lessonId}:`)).length >= state.lessonData.steps.length) {
    state.completedLessons[lessonId] = true;
  }
  saveState();
}

export function resetLessonProgress(id) {
  Object.keys(state.completedSteps).forEach(key => {
    if (key.startsWith(`${id}:`)) delete state.completedSteps[key];
  });
  delete state.completedLessons[id];
  saveState();
}
