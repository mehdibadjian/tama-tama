import type {
  BagPackerPayload,
  NumberBondPayload,
  P1QuestionItem,
} from './p1-curriculum-types';

// Pure P1 activity logic. No React, no DOM — safe to unit test directly.

/** Sum a tray of Singapore coins, all held in cents to avoid float drift. */
export function coinsTotal(coins: number[]): number {
  return coins.reduce((acc, cent) => acc + cent, 0);
}

/** 80 → "80¢", 120 → "$1.20" */
export function formatCents(cents: number): string {
  if (cents < 100) return `${cents}¢`;
  const dollars = Math.floor(cents / 100);
  const rem = cents % 100;
  return `$${dollars}.${String(rem).padStart(2, '0')}`;
}

export type BondSlot = 'whole' | 'partA' | 'partB';

/** Which slot the child has to solve, i.e. the one holding null. */
export function missingBondSlot(bond: NumberBondPayload): BondSlot | null {
  if (bond.whole === null) return 'whole';
  if (bond.partA === null) return 'partA';
  if (bond.partB === null) return 'partB';
  return null;
}

/** The number the child is expected to find, derived from the bond itself. */
export function expectedBondAnswer(bond: NumberBondPayload): number | null {
  switch (missingBondSlot(bond)) {
    case 'whole':
      return (bond.partA ?? 0) + (bond.partB ?? 0);
    case 'partA':
      return bond.whole! - (bond.partB ?? 0);
    case 'partB':
      return bond.whole! - (bond.partA ?? 0);
    default:
      return null;
  }
}

/** A bond is valid when exactly one slot is open and the stated answer fits. */
export function isBondConsistent(bond: NumberBondPayload): boolean {
  const derived = expectedBondAnswer(bond);
  if (derived === null) return false;
  return derived === bond.correctAnswer && bond.options.includes(bond.correctAnswer);
}

export type MoneyVerdict = 'exact' | 'short' | 'over';

export function judgePayment(trayCents: number, priceCents: number): MoneyVerdict {
  if (trayCents === priceCents) return 'exact';
  return trayCents > priceCents ? 'over' : 'short';
}

/** Which items belong in the bag, and which must stay at home. */
export function isBagItemValid(item: string, bag: BagPackerPayload): boolean {
  return bag.validItems.includes(item);
}

export function shuffled<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** The shelf the child picks from: valid items and decoys, all mixed together. */
export function bagShelfItems(bag: BagPackerPayload): string[] {
  return shuffled([...bag.validItems, ...bag.decoyItems]);
}

/**
 * 3 stars when nothing was missed, 2 when most was right, 1 for finishing.
 * A child who finishes always earns a star — never zero.
 */
export function starsForAttempt(total: number, missedFirstTry: number): number {
  if (total <= 0) return 1;
  if (missedFirstTry === 0) return 3;
  if (missedFirstTry <= Math.floor(total / 3)) return 2;
  return 1;
}

/**
 * The answer a widget must report for "correct" — the payloads differ per type,
 * so the runner asks one question instead of switching on every type itself.
 */
export function isAnswerCorrect(question: P1QuestionItem, guess: unknown): boolean {
  const { numberBond, moneyCanteen, multipleChoice, bagPacker } = question.payload;

  if (numberBond) return guess === numberBond.correctAnswer;
  if (multipleChoice) return guess === multipleChoice.correctIndex;
  if (moneyCanteen) {
    return Array.isArray(guess) && coinsTotal(guess) === moneyCanteen.itemPriceCents;
  }
  if (bagPacker) {
    return (
      Array.isArray(guess) &&
      bagPacker.validItems.every(item => guess.includes(item)) &&
      guess.length === bagPacker.validItems.length
    );
  }
  return false;
}
