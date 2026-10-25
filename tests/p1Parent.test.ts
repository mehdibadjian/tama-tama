import { describe, expect, test } from 'vitest';
import { P1_CURRICULUM_DATA } from '../lib/p1-curriculum-data';
import {
  dateKeyFrom,
  describePlayedOn,
  p1ParentSummary,
} from '../lib/p1-parent';
import { EMPTY_P1_PROGRESS } from '../lib/p1-progress';
import type { P1UserProgress } from '../lib/p1-curriculum-types';

// Local midnight, so these assertions hold whatever timezone the runner is in.
const at = (y: number, month: number, day: number) => new Date(y, month - 1, day, 9, 0, 0).getTime();

describe('P1 parent dashboard reporting', () => {
  test('every curriculum track gets a row, in syllabus order', () => {
    const rows = p1ParentSummary(EMPTY_P1_PROGRESS, P1_CURRICULUM_DATA, '2026-10-25');
    expect(rows.map(r => r.trackId)).toEqual(P1_CURRICULUM_DATA.map(t => t.id));
    expect(rows).toHaveLength(4);
  });

  test('an untouched track reports zero progress rather than being hidden', () => {
    const [english] = p1ParentSummary(EMPTY_P1_PROGRESS, P1_CURRICULUM_DATA, '2026-10-25');
    expect(english.stars).toBe(0);
    expect(english.plays).toBe(0);
    expect(english.lastPlayed).toBe('Not yet');
    expect(english.title).toBe('English Explorer');
    expect(english.questionCount).toBe(4);
  });

  test('a played track reports its best stars, play count, and a friendly date', () => {
    const progress: P1UserProgress = {
      ...EMPTY_P1_PROGRESS,
      completedActivityIds: {
        sg_p1_math: { count: 3, starsEarned: 2, lastPlayedTimestamp: at(2026, 10, 25) },
      },
    };
    const math = p1ParentSummary(progress, P1_CURRICULUM_DATA, '2026-10-25').find(r => r.trackId === 'sg_p1_math')!;
    expect(math.stars).toBe(2);
    expect(math.plays).toBe(3);
    expect(math.lastPlayed).toBe('Today');
  });

  test('yesterday and older dates read the way a parent expects', () => {
    expect(describePlayedOn('2026-10-24', '2026-10-25')).toBe('Yesterday');
    expect(describePlayedOn('2026-10-18', '2026-10-25')).toBe('18 Oct 2026');
    expect(describePlayedOn('', '2026-10-25')).toBe('Not yet');
  });

  test('a future-dated record still reads as today, never as a negative streak', () => {
    expect(describePlayedOn('2026-12-01', '2026-10-25')).toBe('Today');
  });

  test('date keys are local and zero-padded', () => {
    expect(dateKeyFrom(at(2026, 10, 5))).toBe('2026-10-05');
    expect(dateKeyFrom(at(1970, 1, 1))).toBe('1970-01-01');
  });

  test('the summary is stable when a record references an unknown track', () => {
    const progress: P1UserProgress = {
      ...EMPTY_P1_PROGRESS,
      completedActivityIds: { retired_track: { count: 9, starsEarned: 3, lastPlayedTimestamp: at(2026, 10, 20) } },
    };
    const rows = p1ParentSummary(progress, P1_CURRICULUM_DATA, '2026-10-25');
    expect(rows.every(r => r.plays === 0)).toBe(true);
  });
});
