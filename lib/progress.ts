import type { LessonProgress } from './types';

const KEY = 'tama-tama-progress';

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
