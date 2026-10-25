import { describe, expect, test } from 'vitest';
import { P1_CURRICULUM_DATA } from '../lib/p1-curriculum-data';
import type { P1QuestionItem } from '../lib/p1-curriculum-types';
import {
  bagShelfItems,
  coinsTotal,
  expectedBondAnswer,
  formatCents,
  isAnswerCorrect,
  isBondConsistent,
  judgePayment,
  missingBondSlot,
  starsForAttempt,
} from '../lib/p1-curriculum-logic';
import { nextStreak } from '../lib/p1-progress';

const allQuestions = (): P1QuestionItem[] => P1_CURRICULUM_DATA.flatMap(t => t.questions);

describe('Singapore P1 Curriculum & Logic Suite', () => {
  test('Strictly includes P1 tracks and explicitly excludes Science', () => {
    const subjects = P1_CURRICULUM_DATA.map(t => t.subject);
    expect(subjects).toContain('english');
    expect(subjects).toContain('mathematics');
    expect(subjects).toContain('chinese');
    expect(subjects).toContain('pal_life');
    expect(subjects).not.toContain('science'); // Science only in P3
    expect(subjects).toHaveLength(4);
  });

  test('Every track carries at least one question and a unique id', () => {
    for (const track of P1_CURRICULUM_DATA) {
      expect(track.questions.length).toBeGreaterThan(0);
      expect(track.accentColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
    const ids = allQuestions().map(q => q.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(P1_CURRICULUM_DATA.map(t => t.id)).size).toBe(P1_CURRICULUM_DATA.length);
  });

  test('Number bond math consistency across every bond in the syllabus', () => {
    const bonds = allQuestions()
      .map(q => q.payload.numberBond)
      .filter(b => b !== undefined);

    expect(bonds.length).toBeGreaterThan(0);
    for (const bond of bonds) {
      expect(isBondConsistent(bond)).toBe(true);
      if (bond.whole === null) {
        expect((bond.partA ?? 0) + (bond.partB ?? 0)).toBe(bond.correctAnswer);
      } else if (bond.partA === null) {
        expect(bond.whole - (bond.partB ?? 0)).toBe(bond.correctAnswer);
      } else if (bond.partB === null) {
        expect(bond.whole - (bond.partA ?? 0)).toBe(bond.correctAnswer);
      }
    }
  });

  test('A bond always opens exactly one slot for the child to solve', () => {
    const bond = P1_CURRICULUM_DATA.find(t => t.subject === 'mathematics')!
      .questions.find(q => q.type === 'number_bond')!.payload.numberBond!;
    expect(missingBondSlot(bond)).toBe('partB');
    expect(expectedBondAnswer(bond)).toBe(3);
  });

  test('Canteen money sum calculator calculates cents correctly', () => {
    expect(coinsTotal([50, 20, 10])).toBe(80);
    expect(coinsTotal([100, 20])).toBe(120);
    expect(coinsTotal([])).toBe(0);
    expect(formatCents(80)).toBe('80¢');
    expect(formatCents(120)).toBe('$1.20');
  });

  test('Every canteen order can actually be paid with its own coin set', () => {
    const orders = allQuestions()
      .map(q => q.payload.moneyCanteen)
      .filter(o => o !== undefined);

    expect(orders.length).toBeGreaterThan(0);
    for (const order of orders) {
      // Greedy from the largest coin down — a P1-sized proof of solvability.
      let remaining = order.itemPriceCents;
      for (const cent of [...order.availableCoins].sort((a, b) => b - a)) {
        while (remaining >= cent) remaining -= cent;
      }
      expect(remaining).toBe(0);
      expect(judgePayment(order.itemPriceCents, order.itemPriceCents)).toBe('exact');
      expect(judgePayment(50, order.itemPriceCents)).toBe('short');
      expect(judgePayment(order.itemPriceCents + 100, order.itemPriceCents)).toBe('over');
    }
  });

  test('the syllabus pays with a $2 coin as well, so children meet every circulating denomination', () => {
    const orders = allQuestions()
      .map(q => q.payload.moneyCanteen)
      .filter(o => o !== undefined);

    expect(orders.some(o => o.availableCoins.includes(200))).toBe(true);
    expect(orders.some(o => o.itemPriceCents >= 200)).toBe(true);
    expect(formatCents(200)).toBe('$2.00');
  });

  test('Multiple choice payloads point at a real option', () => {
    const choices = allQuestions()
      .map(q => q.payload.multipleChoice)
      .filter(c => c !== undefined);

    expect(choices.length).toBeGreaterThan(0);
    for (const c of choices) {
      expect(c.options.length).toBeGreaterThan(1);
      expect(c.correctIndex).toBeGreaterThanOrEqual(0);
      expect(c.correctIndex).toBeLessThan(c.options.length);
      expect(c.explanation).toBeTruthy();
    }
  });

  test('Bag packer keeps valid items and decoys apart', () => {
    const bags = allQuestions()
      .map(q => q.payload.bagPacker)
      .filter(b => b !== undefined);

    expect(bags.length).toBeGreaterThan(0);
    for (const bag of bags) {
      expect(bag.validItems.length).toBeGreaterThan(0);
      expect(bag.decoyItems.length).toBeGreaterThan(0);
      expect(bag.validItems.some(i => bag.decoyItems.includes(i))).toBe(false);

      const shelf = bagShelfItems(bag);
      expect(shelf).toHaveLength(bag.validItems.length + bag.decoyItems.length);

      const answer = [...bag.validItems];
      expect(isAnswerCorrect({ id: 'x', type: 'school_bag_packer', prompt: '', payload: { bagPacker: bag } }, answer)).toBe(true);
      expect(isAnswerCorrect({ id: 'x', type: 'school_bag_packer', prompt: '', payload: { bagPacker: bag } }, [...answer, bag.decoyItems[0]])).toBe(false);
    }
  });

  test('isAnswerCorrect judges each payload type', () => {
    const byId = (id: string) => allQuestions().find(q => q.id === id)!;

    expect(isAnswerCorrect(byId('eng_01'), 1)).toBe(true);
    expect(isAnswerCorrect(byId('eng_01'), 0)).toBe(false);
    expect(isAnswerCorrect(byId('math_nb_01'), 3)).toBe(true);
    expect(isAnswerCorrect(byId('math_money_01'), [50, 20, 10])).toBe(true);
    expect(isAnswerCorrect(byId('math_money_01'), [50, 20])).toBe(false);
  });

  test('Stars never hit zero — finishing always earns one', () => {
    expect(starsForAttempt(4, 0)).toBe(3);
    expect(starsForAttempt(4, 1)).toBe(2);
    expect(starsForAttempt(4, 4)).toBe(1);
    expect(starsForAttempt(0, 0)).toBe(1);
  });

  test('Streak grows day by day and resets after a skipped day', () => {
    expect(nextStreak(0, '', '2026-10-25')).toBe(1);
    expect(nextStreak(3, '2026-10-25', '2026-10-25')).toBe(3);
    expect(nextStreak(3, '2026-10-24', '2026-10-25')).toBe(4);
    expect(nextStreak(9, '2026-10-20', '2026-10-25')).toBe(1);
  });
});
