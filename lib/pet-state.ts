import type { P1UserProgress, PetState } from './p1-curriculum-types';
import { recordTrackCompletion } from './p1-progress';
import { readStore, subscribeStore, writeStore } from './local-store';

export const PET_STATE_KEY = 'tama-tama-pet';

export const DEFAULT_PET_STATE: PetState = {
  wisdom: 10,
  happiness: 70,
  energy: 100,
  starCoins: 0,
  speech: '',
};

const ENCOURAGEMENT_LINES = [
  'Wah, you are so clever! Primary 1 will be super easy for you! 🌟',
  'Good job! Your teacher will be so proud! 🎒',
  'Yum! You paid the canteen uncle correctly! 🍜',
  'Look at you, solving number bonds like a math wizard! 🧙',
];

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

export function getPetState(): PetState {
  return readStore<PetState>(
    PET_STATE_KEY,
    parsed => ({ ...DEFAULT_PET_STATE, ...(parsed as PetState) }),
    DEFAULT_PET_STATE,
  );
}

export function savePetState(state: PetState): void {
  writeStore(PET_STATE_KEY, state);
}

export function subscribePetState(listener: () => void): () => void {
  return subscribeStore(PET_STATE_KEY, listener);
}

/**
 * The reward loop for one finished P1 track: the pet grows wiser and happier,
 * spending a little energy, the child earns Star Coins, and progress persists.
 * Learning is never punished — nothing here ever subtracts coins or happiness.
 */
export function applyP1Rewards(
  trackId: string,
  starsEarned: number,
  now: Date = new Date(),
): { pet: PetState; progress: P1UserProgress } {
  const pet = getPetState();

  const rewarded: PetState = {
    wisdom: clamp(pet.wisdom + 15, 0, 100),
    happiness: clamp(pet.happiness + 10, 0, 100),
    energy: clamp(pet.energy - 5, 0, 100),
    starCoins: pet.starCoins + 5,
    speech: ENCOURAGEMENT_LINES[Math.floor(Math.random() * ENCOURAGEMENT_LINES.length)],
  };

  savePetState(rewarded);
  const progress = recordTrackCompletion(trackId, starsEarned, now);
  return { pet: rewarded, progress };
}
