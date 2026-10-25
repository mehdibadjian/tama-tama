import type { P1UserProgress, P1TrackRecord } from './p1-curriculum-types';
import { readStore, subscribeStore, writeStore } from './local-store';

export const P1_PROGRESS_KEY = 'tama-tama-p1-progress';

export const EMPTY_P1_PROGRESS: P1UserProgress = {
  completedActivityIds: {},
  dailyStreak: 0,
  lastActiveDate: '',
};

/** Local YYYY-MM-DD — the child's day, not UTC. */
export function todayKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function dayDifference(from: string, to: string): number {
  const a = new Date(`${from}T00:00:00`);
  const b = new Date(`${to}T00:00:00`);
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

/** +1 if the child played yesterday, reset to 1 after a skipped day, unchanged same-day. */
export function nextStreak(prevStreak: number, lastActiveDate: string, today: string): number {
  if (!lastActiveDate) return 1;
  if (lastActiveDate === today) return Math.max(prevStreak, 1);
  return dayDifference(lastActiveDate, today) === 1 ? prevStreak + 1 : 1;
}

export function getP1Progress(): P1UserProgress {
  return readStore<P1UserProgress>(
    P1_PROGRESS_KEY,
    parsed => ({ ...EMPTY_P1_PROGRESS, ...(parsed as P1UserProgress) }),
    EMPTY_P1_PROGRESS,
  );
}

export function saveP1Progress(progress: P1UserProgress): void {
  writeStore(P1_PROGRESS_KEY, progress);
}

export function subscribeP1Progress(listener: () => void): () => void {
  return subscribeStore(P1_PROGRESS_KEY, listener);
}

/** Called when a track is finished. Keeps the best star count and play count. */
export function recordTrackCompletion(
  trackId: string,
  stars: number,
  now: Date = new Date(),
): P1UserProgress {
  const progress = getP1Progress();
  const today = todayKey(now);
  const previous: P1TrackRecord = progress.completedActivityIds[trackId] ?? {
    count: 0,
    starsEarned: 0,
    lastPlayedTimestamp: 0,
  };

  const next: P1UserProgress = {
    completedActivityIds: {
      ...progress.completedActivityIds,
      [trackId]: {
        count: previous.count + 1,
        starsEarned: Math.max(previous.starsEarned, stars),
        lastPlayedTimestamp: now.getTime(),
      },
    },
    dailyStreak: nextStreak(progress.dailyStreak, progress.lastActiveDate, today),
    lastActiveDate: today,
  };

  saveP1Progress(next);
  return next;
}
