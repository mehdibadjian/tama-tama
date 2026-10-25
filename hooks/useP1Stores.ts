'use client';
import { useSyncExternalStore } from 'react';
import type { P1UserProgress, PetState } from '@/lib/p1-curriculum-types';
import {
  EMPTY_P1_PROGRESS,
  getP1Progress,
  subscribeP1Progress,
} from '@/lib/p1-progress';
import { DEFAULT_PET_STATE, getPetState, subscribePetState } from '@/lib/pet-state';

/**
 * The hub reads progress and pet mood straight from the store, so finishing a
 * track repaints the streak and stat bars without a manual refresh.
 */
export function useP1Progress(): P1UserProgress {
  return useSyncExternalStore(subscribeP1Progress, getP1Progress, () => EMPTY_P1_PROGRESS);
}

export function usePetState(): PetState {
  return useSyncExternalStore(subscribePetState, getPetState, () => DEFAULT_PET_STATE);
}
