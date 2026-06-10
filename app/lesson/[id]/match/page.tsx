'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { VOCAB, LESSONS } from '@/lib/seed-data';
import { Emoji } from '@/components/Emoji';
import { setLessonProgress } from '@/lib/progress';
import { useSpeech } from '@/hooks/useSpeech';
import type { VocabItem } from '@/lib/types';

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function pickChoices(target: VocabItem, pool: VocabItem[]): VocabItem[] {
  const distractors = shuffle(pool.filter(v => v.id !== target.id)).slice(0, 2);
  return shuffle([target, ...distractors]);
}

type RoundState = 'idle' | 'correct' | 'wrong';

export default function MatchPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const lessonId = Number(params.id);
  const { speakEnglish, speakMandarin } = useSpeech();

  const lesson = LESSONS.find(l => l.id === lessonId);
  const lessonVocab = VOCAB.filter(v => v.lessonId === lessonId);

  const [queue, setQueue]       = useState<VocabItem[]>([]);
  const [target, setTarget]     = useState<VocabItem | null>(null);
  const [choices, setChoices]   = useState<VocabItem[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [roundState, setRound]  = useState<RoundState>('idle');
  const [score, setScore]       = useState(0);
  const [done, setDone]         = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function startRound(remaining: VocabItem[]) {
    if (remaining.length === 0) {
      setDone(true);
      return;
    }
    const next = remaining[0];
    setTarget(next);
    setChoices(pickChoices(next, lessonVocab));
    setSelected(null);
    setRound('idle');
    // Delay so navigation animation settles before TTS fires
    timerRef.current = setTimeout(() => speakEnglish(`Find the ${next.english}`), 500);
  }

  useEffect(() => {
    const shuffled = shuffle(lessonVocab);
    setQueue(shuffled);
    startRound(shuffled);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  function handleSelect(vocab: VocabItem) {
    if (selected !== null || roundState !== 'idle') return;
    setSelected(vocab.id);
    speakMandarin(vocab.hanzi);

    if (vocab.id === target?.id) {
      setRound('correct');
      setScore(s => s + 1);
      timerRef.current = setTimeout(() => {
        const remaining = queue.slice(1);
        setQueue(remaining);
        startRound(remaining);
      }, 1100);
    } else {
      setRound('wrong');
      timerRef.current = setTimeout(() => {
        setSelected(null);
        setRound('idle');
      }, 750);
    }
  }

  useEffect(() => {
    if (!done) return;
    const total = lessonVocab.length;
    const stars = score === total ? 3 : score >= Math.ceil(total * 0.6) ? 2 : 1;
    setLessonProgress(lessonId, stars);
  }, [done, lessonId, score, lessonVocab.length]);

  function replay() {
    const shuffled = shuffle(lessonVocab);
    setQueue(shuffled);
    setScore(0);
    setDone(false);
    startRound(shuffled);
  }

  if (!lesson) return null;

  if (done) {
    return (
      <main className="min-h-screen bg-tama-blue flex flex-col items-center justify-center gap-6 p-8">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', bounce: 0.6 }}
        >
          <Emoji emoji="🎉" size={80} />
        </motion.div>
        <h2 className="text-3xl font-black text-white text-center">Amazing job!</h2>
        <div className="flex gap-1">
          {[1, 2, 3].map(i => (
            <motion.span
              key={i}
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.15, type: 'spring' }}
            >
              <Emoji emoji="⭐" size={40} />
            </motion.span>
          ))}
        </div>
        <div className="flex gap-4 mt-4">
          <button
            onClick={replay}
            className="bg-white text-tama-ink font-black px-7 py-3 rounded-2xl shadow text-lg"
          >
            Again
          </button>
          <button
            onClick={() => router.push(`/lesson/${lessonId}/trace`)}
            className="bg-tama-purple text-white font-black px-7 py-3 rounded-2xl shadow text-lg"
          >
            Trace ✏️
          </button>
          <button
            onClick={() => router.push('/map')}
            className="bg-tama-pink text-white font-black px-7 py-3 rounded-2xl shadow text-lg"
          >
            Map →
          </button>
        </div>
      </main>
    );
  }

  const answered = lessonVocab.length - queue.length;
  const pct = (answered / lessonVocab.length) * 100;

  return (
    <main className="min-h-screen bg-tama-blue flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => router.push('/map')}
          className="text-white text-2xl font-black w-10 h-10 flex items-center justify-center"
        >
          ←
        </button>
        <h1 className="text-lg font-black text-white flex-1 flex items-center gap-1.5">
          <Emoji emoji={lesson.emoji} size={20} /> {lesson.title}
        </h1>
        <div className="text-white font-bold text-sm">
          {answered}/{lessonVocab.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-white/25 rounded-full mb-8">
        <motion.div
          className="h-3 bg-tama-purple rounded-full"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Prompt */}
      <AnimatePresence mode="wait">
        {target && (
          <motion.div
            key={target.id}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center mb-6"
          >
            <button
              onClick={() => speakEnglish(`Find the ${target.english}`)}
              className="inline-flex items-center gap-2 bg-white/20 text-white font-bold text-xl px-6 py-3 rounded-2xl"
            >
              🔊 Find the <span className="font-black">{target.english}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Choice cards */}
      <div className="flex flex-col gap-4 items-center flex-1 justify-center">
        {choices.map((vocab) => {
          const isSelected = selected === vocab.id;
          const correct = isSelected && roundState === 'correct';
          const wrong   = isSelected && roundState === 'wrong';

          return (
            <motion.div
              key={vocab.id}
              role="button"
              tabIndex={0}
              onClick={() => handleSelect(vocab)}
              onKeyDown={(e) => e.key === 'Enter' && handleSelect(vocab)}
              className={`w-full max-w-xs p-5 rounded-2xl shadow-lg border-4 flex items-center gap-4 transition-colors cursor-pointer ${
                correct
                  ? 'bg-tama-pink border-tama-pink text-white'
                  : wrong
                  ? 'bg-white border-gray-200 text-tama-ink'
                  : 'bg-tama-white border-tama-purple text-tama-ink'
              }`}
              animate={
                wrong   ? { x: [-10, 10, -8, 8, 0] } :
                correct ? { scale: [1, 1.06, 1] }    : {}
              }
              transition={{ duration: 0.35 }}
              whileTap={{ scale: 0.95 }}
            >
              <Emoji emoji={vocab.emoji} size={52} />
              <div className="flex-1 text-left">
                <div className="text-3xl font-black leading-tight">{vocab.hanzi}</div>
                <div className="text-sm font-semibold opacity-60">{vocab.pinyin}</div>
              </div>
              {correct && <span className="text-2xl">✓</span>}
              <button
                onClick={(e) => { e.stopPropagation(); speakMandarin(vocab.hanzi); }}
                className="text-tama-purple opacity-50 text-xl ml-1"
                aria-label={`Hear ${vocab.hanzi}`}
              >
                🔊
              </button>
            </motion.div>
          );
        })}
      </div>
    </main>
  );
}
