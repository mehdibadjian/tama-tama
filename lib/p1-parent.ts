import type { P1ActivityTrack, P1UserProgress, P1Subject } from './p1-curriculum-types';
import { dayDifference, todayKey } from './p1-progress';

// Read-only reporting for the Parent Dashboard. Nothing here writes to storage,
// so a parent can see what their child actually did without touching it.

export interface P1TrackSummaryRow {
  trackId: string;
  title: string;
  icon: string;
  subject: P1Subject;
  stars: number;       // best stars earned, 0-3
  plays: number;       // how many times the track was finished
  questionCount: number;
  lastPlayed: string;  // "Today" | "Yesterday" | "18 Oct 2026" | "Not yet"
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Local YYYY-MM-DD for a stored timestamp, matching the streak key format. */
export function dateKeyFrom(timestamp: number): string {
  if (!timestamp) return '';
  return todayKey(new Date(timestamp));
}

/** Dates a parent can read at a glance; a clock ahead of today never reads backwards. */
export function describePlayedOn(dateKey: string, today: string): string {
  if (!dateKey) return 'Not yet';
  const age = dayDifference(dateKey, today);
  if (age <= 0) return 'Today';
  if (age === 1) return 'Yesterday';
  const [y, m, d] = dateKey.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** One row per track, in syllabus order, whether or not it has been played. */
export function p1ParentSummary(
  progress: P1UserProgress,
  tracks: P1ActivityTrack[],
  today: string,
): P1TrackSummaryRow[] {
  return tracks.map(track => {
    const record = progress.completedActivityIds[track.id];
    return {
      trackId: track.id,
      title: track.title,
      icon: track.icon,
      subject: track.subject,
      stars: record?.starsEarned ?? 0,
      plays: record?.count ?? 0,
      questionCount: track.questions.length,
      lastPlayed: describePlayedOn(dateKeyFrom(record?.lastPlayedTimestamp ?? 0), today),
    };
  });
}
