'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import type { P1ActivityTrack, P1QuestionItem, PetState } from '@/lib/p1-curriculum-types';
import { starsForAttempt } from '@/lib/p1-curriculum-logic';
import { applyP1Rewards } from '@/lib/pet-state';
import { playP1Audio } from '@/hooks/useSpeech';
import { playFanfare } from '@/lib/sfx';
import { Emoji } from '@/components/Emoji';
import { TamaCharacter } from '@/components/TamaCharacter';
import { P1AudioButton } from '@/components/P1AudioButton';
import { P1ChoiceWidget } from '@/components/P1ChoiceWidget';
import { NumberBondWidget } from '@/components/P1NumberBondWidget';
import { P1CoinTrayWidget } from '@/components/P1CoinTrayWidget';
import { P1BagPackerWidget } from '@/components/P1BagPackerWidget';

interface Props {
  track: P1ActivityTrack;
}

/**
 * Plays one P1 track end to end: prompt, widget, zero-penalty retries, then the
 * reward hand-off into the pet's core stats.
 */
export function P1ActivityRunner({ track }: Props) {
  const router = useRouter();
  const questions = track.questions;

  const [index, setIndex] = useState(0);
  const [missedIds, setMissedIds] = useState<string[]>([]); // questions needing a retry
  const [solved, setSolved] = useState(false);
  const [finished, setFinished] = useState<{ stars: number; pet: PetState } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const question: P1QuestionItem | undefined = questions[index];
  const missed = missedIds.length;

  useEffect(() => {
    if (!question) return;
    timer.current = setTimeout(
      () => playP1Audio(question.audioPromptText ?? question.prompt, question.audioLang ?? 'en-SG'),
      350,
    );
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [question]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function handleResult(correct: boolean) {
    if (!question) return;
    if (correct) {
      setSolved(true);
      if (index === questions.length - 1) {
        // Reward on the winning tap itself, never in an effect, so a re-render
        // cannot grant the coins twice.
        const stars = starsForAttempt(questions.length, missed);
        const { pet } = applyP1Rewards(track.id, stars);
        playFanfare();
        setFinished({ stars, pet });
      }
    } else {
      setMissedIds(ids => (ids.includes(question.id) ? ids : [...ids, question.id]));
    }
  }

  function next() {
    setSolved(false);
    setIndex(i => i + 1);
  }

  function restart() {
    setFinished(null);
    setSolved(false);
    setMissedIds([]);
    setIndex(0);
  }

  if (finished) {
    return (
      <main className="min-h-screen bg-tama-blue flex flex-col items-center justify-center gap-5 p-8">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.6 }}>
          <TamaCharacter size={180} uniform />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white text-tama-ink font-bold text-center rounded-2xl px-5 py-3 shadow-lg max-w-xs"
        >
          {finished.pet.speech}
        </motion.p>

        <h2 className="text-3xl font-black text-white text-center">Brilliant!</h2>

        <div className="flex gap-1">
          {[1, 2, 3].map(i => (
            <motion.span key={i} initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ delay: i * 0.15, type: 'spring' }}>
              <Emoji emoji="⭐" size={40} />
            </motion.span>
          ))}
        </div>

        <div className="bg-white/25 rounded-2xl px-5 py-3 text-white font-bold text-sm flex flex-col gap-1 items-center">
          <p>
            {finished.stars === 3
              ? 'Perfect! Every answer right on the first try.'
              : `${questions.length - missed}/${questions.length} right on the first try.`}
          </p>
          <p>
            🪙 +5 Star Coins (now {finished.pet.starCoins}) · 🧠 Wisdom {finished.pet.wisdom} · 💖 Happy {finished.pet.happiness}
          </p>
        </div>

        <div className="flex gap-3 mt-1">
          <button
            onClick={() => router.push('/p1-school')}
            className="bg-white text-tama-ink font-black px-6 py-3 rounded-2xl shadow text-lg"
          >
            🎒 School Hub
          </button>
          <button
            onClick={restart}
            className="text-white font-black px-6 py-3 rounded-2xl shadow text-lg"
            style={{ backgroundColor: track.accentColor }}
          >
            Again
          </button>
        </div>
      </main>
    );
  }

  if (!question) return null;

  const pct = (index / questions.length) * 100;
  const { numberBond, moneyCanteen, multipleChoice, bagPacker } = question.payload;

  return (
    <main className="h-dvh flex flex-col p-6 overflow-hidden" style={{ background: '#7DD3FC' }}>
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => router.push('/p1-school')}
          className="text-white text-2xl font-black w-10 h-10 flex items-center justify-center"
          aria-label="Back to school hub"
        >
          ←
        </button>
        <h1 className="text-lg font-black text-white flex-1 flex items-center gap-1.5">
          <Emoji emoji={track.icon} size={20} /> {track.title}
        </h1>
        <div className="text-white font-bold text-sm">{index + 1}/{questions.length}</div>
      </div>

      <div className="h-3 bg-white/25 rounded-full mb-5">
        <motion.div
          className="h-3 rounded-full"
          style={{ backgroundColor: track.accentColor }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pb-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-5 flex flex-col items-center gap-4"
          >
            <h2 className="text-xl font-black text-tama-ink text-center leading-snug">{question.prompt}</h2>

            <P1AudioButton
              text={question.audioPromptText ?? question.prompt}
              lang={question.audioLang ?? 'en-SG'}
            />

            {numberBond && (
              <NumberBondWidget bond={numberBond} locked={solved} onResult={handleResult} />
            )}
            {moneyCanteen && (
              <P1CoinTrayWidget order={moneyCanteen} locked={solved} onResult={handleResult} />
            )}
            {multipleChoice && (
              <P1ChoiceWidget
                choices={multipleChoice}
                activityType={question.type}
                visual={question.targetVisual}
                locked={solved}
                onResult={handleResult}
              />
            )}
            {bagPacker && (
              <P1BagPackerWidget bag={bagPacker} locked={solved} onResult={handleResult} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {solved && (
        <motion.button
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={next}
          className="max-w-xs mx-auto w-full bg-tama-pink text-white font-black py-4 rounded-2xl shadow-2xl text-xl flex-shrink-0"
          whileTap={{ scale: 0.94 }}
        >
          {index === questions.length - 1 ? 'Finish! 🎉' : 'Next →'}
        </motion.button>
      )}
    </main>
  );
}
