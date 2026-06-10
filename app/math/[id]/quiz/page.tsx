'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MATH_LESSONS, MATH_PROBLEMS } from '@/lib/math-data';
import { setMathProgress } from '@/lib/progress';
import { useSpeech } from '@/hooks/useSpeech';
import type { MathProblem } from '@/lib/math-data';

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function wrongChoices(answer: number): number[] {
  const cands = new Set<number>();
  for (let d = 1; d <= 5; d++) {
    if (answer - d > 0) cands.add(answer - d);
    cands.add(answer + d);
    if (cands.size >= 3) break;
  }
  while (cands.size < 3) cands.add(answer + cands.size + 5);
  return [...cands].slice(0, 3);
}

function buildChoices(answer: number): number[] {
  return shuffle([answer, ...wrongChoices(answer)]);
}

type State = 'idle' | 'correct' | 'wrong';

export default function MathQuizPage() {
  const params   = useParams<{ id: string }>();
  const router   = useRouter();
  const lessonId = Number(params.id);
  const { speakEnglish, speakMandarin } = useSpeech();

  const lesson   = MATH_LESSONS.find(l => l.id === lessonId);
  const allProbs = MATH_PROBLEMS[lessonId] ?? [];

  const [queue,    setQueue]    = useState<MathProblem[]>([]);
  const [choices,  setChoices]  = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [state,    setState]    = useState<State>('idle');
  const [score,    setScore]    = useState(0);
  const [done,     setDone]     = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function loadRound(remaining: MathProblem[]) {
    if (remaining.length === 0) { setDone(true); return; }
    const p = remaining[0];
    setChoices(buildChoices(p.answer));
    setSelected(null);
    setState('idle');
    const prompt = p.op === '×' && p.rhyme
      ? `What is ${p.a} times ${p.b}?`
      : `What is ${p.a} ${p.op === '+' ? 'plus' : p.op === '-' ? 'minus' : p.op === '×' ? 'times' : 'divided by'} ${p.b}?`;
    timer.current = setTimeout(() => speakEnglish(prompt), 400);
  }

  useEffect(() => {
    const q = shuffle(allProbs);
    setQueue(q);
    loadRound(q);
    return () => { if (timer.current) clearTimeout(timer.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  function pick(val: number) {
    if (selected !== null) return;
    setSelected(val);
    const p = queue[0];

    if (val === p.answer) {
      setState('correct');
      setScore(s => s + 1);
      if (p.rhyme) speakMandarin(p.rhyme);
      timer.current = setTimeout(() => {
        const remaining = queue.slice(1);
        setQueue(remaining);
        loadRound(remaining);
      }, 1200);
    } else {
      setState('wrong');
      timer.current = setTimeout(() => { setSelected(null); setState('idle'); }, 750);
    }
  }

  useEffect(() => {
    if (!done) return;
    const stars = score === allProbs.length ? 3 : score >= Math.ceil(allProbs.length * 0.6) ? 2 : 1;
    setMathProgress(lessonId, stars);
  }, [done, lessonId, score, allProbs.length]);

  function replay() {
    const q = shuffle(allProbs);
    setQueue(q);
    setScore(0);
    setDone(false);
    loadRound(q);
  }

  if (!lesson) return null;

  if (done) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8" style={{ background: '#7DD3FC' }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.6 }} className="text-8xl">🎉</motion.div>
        <h2 className="text-3xl font-black text-white text-center">Brilliant!</h2>
        <p className="text-white/70 font-semibold">{score}/{allProbs.length} correct</p>
        <div className="flex gap-1 text-4xl">
          {[1, 2, 3].map(i => (
            <motion.span key={i} initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ delay: i * 0.15, type: 'spring' }}>⭐</motion.span>
          ))}
        </div>
        <div className="flex gap-3 mt-2">
          <button onClick={replay} className="bg-white text-tama-ink font-black px-6 py-3 rounded-2xl shadow text-lg">Again</button>
          <button onClick={() => router.push('/math')} className="text-white font-black px-6 py-3 rounded-2xl shadow text-lg" style={{ backgroundColor: lesson.color }}>Map →</button>
        </div>
      </main>
    );
  }

  const current  = queue[0];
  const answered = allProbs.length - queue.length;
  const pct      = (answered / allProbs.length) * 100;

  return (
    <main className="min-h-screen flex flex-col p-6" style={{ background: '#7DD3FC' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => router.push('/math')} className="text-white text-2xl font-black w-10 h-10 flex items-center justify-center">←</button>
        <h1 className="text-lg font-black text-white flex-1">{lesson.emoji} {lesson.title} — Quiz</h1>
        <div className="text-white font-bold text-sm">{answered}/{allProbs.length}</div>
      </div>

      {/* Progress */}
      <div className="h-3 bg-white/25 rounded-full mb-6">
        <motion.div className="h-3 rounded-full" style={{ backgroundColor: lesson.color }} animate={{ width: `${pct}%` }} transition={{ duration: 0.4 }} />
      </div>

      {/* Problem display */}
      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={current.id + '-' + answered}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-8 mb-6 flex flex-col items-center gap-3"
          >
            <button
              onClick={() => {
                const prompt = `What is ${current.a} ${current.op === '+' ? 'plus' : current.op === '-' ? 'minus' : current.op === '×' ? 'times' : 'divided by'} ${current.b}?`;
                speakEnglish(prompt);
              }}
              className="text-tama-purple/40 text-2xl"
            >
              🔊
            </button>
            <div className="text-6xl font-black text-tama-ink">
              {current.a} {current.op} {current.b} = ?
            </div>
            {/* Show Nine-Nine rhyme hint for multiplication */}
            {current.rhyme && (
              <button
                onClick={() => speakMandarin(current.rhyme!)}
                className="text-tama-purple font-black text-lg bg-tama-purple/10 px-4 py-2 rounded-xl"
              >
                🎵 {current.rhyme}
                <span className="block text-xs font-semibold text-tama-purple/60">{current.rhymePinyin}</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Answer choices */}
      <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto w-full">
        {choices.map((val) => {
          const isSelected = selected === val;
          const correct    = isSelected && state === 'correct';
          const wrong      = isSelected && state === 'wrong';

          return (
            <motion.button
              key={val}
              onClick={() => pick(val)}
              className={`py-6 rounded-2xl shadow-lg text-3xl font-black border-4 transition-colors ${
                correct ? 'border-transparent text-white'
                : wrong ? 'bg-white border-gray-200 text-tama-ink'
                :         'bg-white border-transparent text-tama-ink'
              }`}
              style={correct ? { backgroundColor: lesson.color } : {}}
              animate={
                wrong   ? { x: [-8, 8, -6, 6, 0] } :
                correct ? { scale: [1, 1.08, 1] } : {}
              }
              transition={{ duration: 0.35 }}
              whileTap={{ scale: 0.94 }}
            >
              {val}
              {correct && <span className="block text-base">✓</span>}
            </motion.button>
          );
        })}
      </div>
    </main>
  );
}
