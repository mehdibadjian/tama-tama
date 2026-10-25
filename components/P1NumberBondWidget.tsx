'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import type { NumberBondPayload } from '@/lib/p1-curriculum-types';
import { expectedBondAnswer, missingBondSlot } from '@/lib/p1-curriculum-logic';
import { playChime, playRetry } from '@/lib/sfx';

interface Props {
  bond: NumberBondPayload;
  locked: boolean;
  onResult: (correct: boolean) => void;
}

const R = 34;

function BondCircle({
  cx, cy, label, isOpen, revealed,
}: {
  cx: number;
  cy: number;
  label: number | string;
  isOpen: boolean;
  revealed: boolean;
}) {
  const asking = isOpen && label === '?';
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={R}
        fill={isOpen ? '#FFF1F5' : '#FFFFFF'}
        stroke={isOpen ? '#FF8EAF' : '#A855F7'}
        strokeWidth={isOpen ? 5 : 4}
        strokeDasharray={isOpen ? '7 6' : undefined}
      />
      <motion.text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={asking ? 34 : 30}
        fontWeight={900}
        fill={asking ? '#FF8EAF' : '#334155'}
        animate={asking ? { opacity: [1, 0.25, 1] } : revealed ? { scale: [0.4, 1.25, 1] } : {}}
        transition={{ duration: asking ? 1.1 : 0.4, repeat: asking ? Infinity : 0 }}
      >
        {label}
      </motion.text>
    </g>
  );
}

/**
 * Singapore CPA "part-part-whole" number bond tree.
 *
 *         [ whole ]
 *        /         \
 *   [ part A ]   [ part B ]
 *
 * The slot the child must solve is null in the payload and shows a blinking "?".
 */
export function NumberBondWidget({ bond, locked, onResult }: Props) {
  const [placed, setPlaced] = useState<number | null>(null);
  const [shake, setShake] = useState<number | null>(null);

  const slot   = missingBondSlot(bond);
  const answer = expectedBondAnswer(bond) ?? bond.correctAnswer;

  function valueFor(which: 'whole' | 'partA' | 'partB'): number | string {
    if (which === slot) return placed ?? '?';
    return bond[which] ?? 0;
  }

  function tap(option: number) {
    if (locked || placed !== null) return;
    if (option === answer) {
      setPlaced(option);
      playChime();
      onResult(true);
    } else {
      playRetry();
      setShake(option);
      onResult(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <svg viewBox="0 0 300 200" className="w-full max-w-[300px]" role="img" aria-label="Number bond tree">
        <line x1={150} y1={45 + R - 6} x2={70}  y2={155 - R + 6} stroke="#A855F7" strokeWidth={4} />
        <line x1={150} y1={45 + R - 6} x2={230} y2={155 - R + 6} stroke="#A855F7" strokeWidth={4} />
        <BondCircle cx={150} cy={45}  label={valueFor('whole')} isOpen={slot === 'whole'} revealed={placed !== null && slot === 'whole'} />
        <BondCircle cx={70}  cy={155} label={valueFor('partA')} isOpen={slot === 'partA'} revealed={placed !== null && slot === 'partA'} />
        <BondCircle cx={230} cy={155} label={valueFor('partB')} isOpen={slot === 'partB'} revealed={placed !== null && slot === 'partB'} />
      </svg>

      <div className="flex gap-3 flex-wrap justify-center">
        {bond.options.map(n => {
          const used = placed === n;
          return (
            <motion.button
              key={n}
              onClick={() => tap(n)}
              disabled={locked || used}
              className={`w-16 h-16 rounded-full text-2xl font-black shadow-lg border-4 transition-colors ${
                used
                  ? 'bg-tama-purple border-tama-purple text-white opacity-60'
                  : 'bg-white border-tama-purple/20 text-tama-ink'
              }`}
              animate={shake === n ? { x: [-8, 8, -6, 6, 0] } : {}}
              onAnimationComplete={() => { if (shake === n) setShake(null); }}
              whileTap={{ scale: 0.9 }}
            >
              {n}
            </motion.button>
          );
        })}
      </div>

      <p className="text-tama-ink/50 text-xs font-bold">
        {placed === null ? 'Tap the number that fills the ? box' : '✓ Well done!'}
      </p>
    </div>
  );
}
