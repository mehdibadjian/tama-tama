import { describe, expect, test } from 'vitest';
import { P1_MAX_STARS, p1StarBadge } from '../lib/p1-curriculum-logic';

describe('P1 hub completion badge', () => {
  test('a track the child has not finished yet reads as zero of three', () => {
    expect(p1StarBadge(0)).toBe('0 / 3 Completed');
  });

  test('a finished track reports its best stars out of three', () => {
    expect(p1StarBadge(2)).toBe('2 / 3 Completed');
    expect(p1StarBadge(3)).toBe('3 / 3 Completed');
  });

  test('stars are clamped so the badge can never overflow the max', () => {
    expect(P1_MAX_STARS).toBe(3);
    expect(p1StarBadge(9)).toBe('3 / 3 Completed');
    expect(p1StarBadge(-1)).toBe('0 / 3 Completed');
  });
});
