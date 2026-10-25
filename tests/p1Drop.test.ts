import { describe, expect, test } from 'vitest';
import { didLandOnTarget } from '../lib/p1-curriculum-logic';

// A 6-year-old's finger lands "close enough" far more often than dead-centre,
// so the drop zone is forgiving. These numbers drive drag-and-drop on the
// canteen tray and the school bag.

const tray = { left: 100, top: 200, width: 300, height: 90 };

describe('drag-and-drop target resolution', () => {
  test('a release inside the target counts as a drop', () => {
    expect(didLandOnTarget(250, 245, tray)).toBe(true);
  });

  test('a release well outside the target does not', () => {
    expect(didLandOnTarget(40, 30, tray)).toBe(false);
    expect(didLandOnTarget(250, 600, tray)).toBe(false);
  });

  test('the default tolerance forgives a finger that stops just short of the edge', () => {
    expect(didLandOnTarget(92, 245, tray)).toBe(true);   // 8px left of the tray
    expect(didLandOnTarget(412, 288, tray)).toBe(true);  // 12px past bottom-right
  });

  test('the tolerance can be widened for a very small target, and set to none', () => {
    const tiny = { left: 50, top: 50, width: 10, height: 10 };
    expect(didLandOnTarget(5, 5, tiny, 50)).toBe(true);
    expect(didLandOnTarget(49, 55, tiny, 0)).toBe(false);
  });

  test('a zero-size target still accepts a dead-centre release', () => {
    expect(didLandOnTarget(100, 100, { left: 100, top: 100, width: 0, height: 0 }, 0)).toBe(true);
  });
});
