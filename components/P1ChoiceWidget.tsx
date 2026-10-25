'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import type { MultipleChoicePayload, P1ActivityType } from '@/lib/p1-curriculum-types';
import { Emoji } from '@/components/Emoji';
import { playChime, playRetry } from '@/lib/sfx';

interface Props {
  choices: MultipleChoicePayload;
  activityType: P1ActivityType;
  visual?: string;
  locked: boolean;
  onResult: (correct: boolean) => void;
}

/** Options presented as balloons, sound-proof cards, or plain word chips. */
export function P1ChoiceWidget({ choices, activityType, visual, locked, onResult }: Props) {
  const [picked, setPicked] = useState<number | null>(null);
  const [missed, setMissed] = useState<number | null>(null);

  const solved = picked === choices.correctIndex;
  const balloon = activityType === 'sight_word_audio';

  function tap(index: number) {
    if (locked || solved) return;
    const correct = index === choices.correctIndex;
    setPicked(index);
    setMissed(correct ? null : index);
    if (correct) playChime();
    else playRetry();
    onResult(correct);
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {visual && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
          <Emoji emoji={visual} size={64} />
        </motion.div>
      )}

      <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
        {choices.options.map((option, i) => {
          const isPicked = picked === i;
          const showCorrect = solved && i === choices.correctIndex;
          const showMiss = isPicked && !solved;

          return (
            <motion.button
              key={option}
              onClick={() => tap(i)}
              disabled={locked || solved}
              className={`min-h-[72px] rounded-2xl px-3 py-3 shadow-lg border-4 font-black text-tama-ink flex items-center justify-center gap-2 text-center leading-tight transition-colors ${
                showCorrect
                  ? 'bg-tama-purple border-tama-purple text-white'
                  : showMiss
                    ? 'bg-white border-gray-200'
                    : 'bg-white border-tama-purple/15'
              } disabled:opacity-70`}
              style={balloon && !showCorrect && !showMiss ? { borderRadius: '50% 50% 45% 45%', minHeight: 92 } : {}}
              animate={showMiss ? { x: [-8, 8, -6, 6, 0] } : showCorrect ? { scale: [1, 1.1, 1] } : {}}
              onAnimationComplete={() => { if (showMiss) setPicked(null); }}
              whileTap={{ scale: 0.93 }}
            >
              {balloon && <span className="text-lg">🎈</span>}
              <span className={option.length > 14 ? 'text-sm' : 'text-xl'}>{option}</span>
            </motion.button>
          );
        })}
      </div>

      {missed !== null && !solved && (
        <p className="text-tama-ink/50 text-sm font-bold">Almost! Listen again and try another card.</p>
      )}
      {solved && choices.explanation && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-tama-purple/10 text-tama-purple text-sm font-bold rounded-2xl px-4 py-3 text-center"
        >
          {choices.explanation}
        </motion.p>
      )}
    </div>
  );
}
