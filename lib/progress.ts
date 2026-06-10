import type { LessonProgress } from './types';

const KEY      = 'tama-tama-progress';
const MATH_KEY = 'tama-tama-math-progress';

export function getProgress(): LessonProgress[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

export function setLessonProgress(lessonId: number, stars: number) {
  const all = getProgress();
  const idx = all.findIndex(p => p.lessonId === lessonId);
  const entry: LessonProgress = { lessonId, completed: true, stars };
  if (idx >= 0) {
    // Only upgrade stars, never downgrade
    if (stars >= all[idx].stars) all[idx] = entry;
  } else {
    all.push(entry);
  }
  localStorage.setItem(KEY, JSON.stringify(all));
}

function store(key: string, lessonId: number, stars: number) {
  const all: LessonProgress[] = (() => {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch { return []; }
  })();
  const idx = all.findIndex(p => p.lessonId === lessonId);
  const entry: LessonProgress = { lessonId, completed: true, stars };
  if (idx >= 0) { if (stars >= all[idx].stars) all[idx] = entry; }
  else all.push(entry);
  localStorage.setItem(key, JSON.stringify(all));
}

export function getMathProgress(): LessonProgress[] {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(localStorage.getItem(MATH_KEY) || '[]'); } catch { return []; }
}

export function setMathProgress(lessonId: number, stars: number) {
  store(MATH_KEY, lessonId, stars);
}
