'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MATH_LESSONS, MATH_PROBLEMS } from '@/lib/math-data';
import { Emoji } from '@/components/Emoji';
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

// ── Abacus components ────────────────────────────────────────────────────────

function Bead({ color, delay, sz }: { color: string; delay: number; sz: string }) {
  return (
    <motion.div
      className={`${sz} rounded-full shadow`}
      style={{ backgroundColor: color }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: 'spring', bounce: 0.5, stiffness: 260 }}
    />
  );
}

function TenBlock({ color, delay }: { color: string; delay: number }) {
  return (
    <motion.div
      className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-[10px] shadow border-2 border-white/40 leading-none"
      style={{ backgroundColor: color }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: 'spring', bounce: 0.4, stiffness: 200 }}
    >
      10
    </motion.div>
  );
}

// Renders n as ten-blocks + unit beads, returns total animation duration
function NumberBeads({
  value,
  color,
  baseDelay = 0,
  unitSz = 'w-6 h-6',
}: {
  value: number;
  color: string;
  baseDelay?: number;
  unitSz?: string;
}) {
  if (value <= 0) return null;
  const tens = Math.floor(value / 10);
  const ones = value % 10;
  const items: React.ReactNode[] = [];
  let d = baseDelay;

  for (let i = 0; i < tens; i++) {
    items.push(<TenBlock key={`t${i}`} color={color} delay={d} />);
    d += 0.055;
  }
  if (tens > 0 && ones > 0) {
    items.push(
      <motion.span
        key="sep"
        className="text-white/40 text-xs font-bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: d }}
      >
        +
      </motion.span>
    );
  }
  for (let i = 0; i < ones; i++) {
    items.push(<Bead key={`o${i}`} color={color} delay={d} sz={unitSz} />);
    d += 0.055;
  }

  return <div className="flex items-center gap-1.5 flex-wrap justify-center">{items}</div>;
}

// Total delay needed for n items starting at baseDelay
function totalDelay(value: number, baseDelay: number): number {
  const count = Math.floor(value / 10) + (value % 10);
  return baseDelay + count * 0.055 + 0.1;
}

function QuizAbacus({
  a, b, op, color,
}: {
  a: number; b: number; op: '+' | '-' | '×' | '÷'; color: string;
}) {
  const secondary = '#FBBF24';
  const gray      = '#9CA3AF';

  if (op === '+') {
    const afterA = totalDelay(a, 0.1);
    return (
      <div className="bg-white/20 rounded-2xl p-4 flex flex-col items-center gap-3">
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-white/70 font-bold text-sm">{a}</span>
            <NumberBeads value={a} color={color} baseDelay={0.1} />
          </div>
          <motion.span
            className="text-white text-2xl font-black"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: afterA - 0.05, type: 'spring' }}
          >
            +
          </motion.span>
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-white/70 font-bold text-sm">{b}</span>
            <NumberBeads value={b} color={secondary} baseDelay={afterA} />
          </div>
        </div>
        <motion.p
          className="text-white/50 text-xs font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: totalDelay(b, afterA) }}
        >
          Count all the beads together!
        </motion.p>
      </div>
    );
  }

  if (op === '-') {
    const afterRemain = totalDelay(a - b, 0.1);
    return (
      <div className="bg-white/20 rounded-2xl p-4 flex flex-col items-center gap-3">
        <span className="text-white/70 font-bold text-sm">Start with {a}</span>
        <NumberBeads value={a - b} color={color} baseDelay={0.1} />
        <motion.div
          className="flex flex-col items-center gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: afterRemain }}
        >
          <span className="text-white/50 text-xs font-semibold">take away {b} →</span>
          <NumberBeads value={b} color={gray} baseDelay={afterRemain + 0.05} />
        </motion.div>
        <motion.p
          className="text-white/50 text-xs font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: totalDelay(b, afterRemain + 0.05) }}
        >
          How many {color === gray ? '' : '🔵'} beads are left?
        </motion.p>
      </div>
    );
  }

  if (op === '×') {
    const numGroups = a;
    const perGroup  = b;
    const sz = perGroup <= 5 ? 'w-6 h-6' : perGroup <= 7 ? 'w-5 h-5' : 'w-4 h-4';
    return (
      <div className="bg-white/20 rounded-2xl p-4 flex flex-col items-center gap-2">
        <span className="text-white/70 font-bold text-sm">{numGroups} groups of {perGroup}</span>
        <div className="flex flex-col gap-1.5">
          {Array.from({ length: numGroups }).map((_, gi) => (
            <div key={gi} className="flex items-center gap-1">
              {Array.from({ length: perGroup }).map((_, bi) => (
                <Bead
                  key={bi}
                  color={gi % 2 === 0 ? color : secondary}
                  delay={gi * 0.18 + bi * 0.06 + 0.1}
                  sz={sz}
                />
              ))}
            </div>
          ))}
        </div>
        <motion.p
          className="text-white/50 text-xs font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: numGroups * 0.18 + perGroup * 0.06 + 0.2 }}
        >
          Count all the beads!
        </motion.p>
      </div>
    );
  }

  if (op === '÷') {
    const numGroups = b;
    return (
      <div className="bg-white/20 rounded-2xl p-4 flex flex-col items-center gap-3">
        <span className="text-white/70 font-bold text-sm">Share {a} into {numGroups} groups</span>
        <NumberBeads value={a} color={color} baseDelay={0.1} />
        <motion.div
          className="flex gap-2 flex-wrap justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: totalDelay(a, 0.1) }}
        >
          {Array.from({ length: numGroups }).map((_, gi) => (
            <motion.div
              key={gi}
              className="w-11 h-11 rounded-xl border-2 border-dashed border-white/50 flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: totalDelay(a, 0.1) + gi * 0.1, type: 'spring', bounce: 0.5 }}
            >
              <span className="text-white/60 font-black text-lg">?</span>
            </motion.div>
          ))}
        </motion.div>
        <motion.p
          className="text-white/50 text-xs font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: totalDelay(a, 0.1) + numGroups * 0.1 + 0.15 }}
        >
          How many beads in each box?
        </motion.p>
      </div>
    );
  }

  return null;
}

// ── Quiz page ────────────────────────────────────────────────────────────────

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
    const opWord = p.op === '+' ? 'plus' : p.op === '-' ? 'minus' : p.op === '×' ? 'times' : 'divided by';
    const prompt = `What is ${p.a} ${opWord} ${p.b}?`;
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
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.6 }}><Emoji emoji="🎉" size={80} /></motion.div>
        <h2 className="text-3xl font-black text-white text-center">Brilliant!</h2>
        <p className="text-white/70 font-semibold">{score}/{allProbs.length} correct</p>
        <div className="flex gap-1">
          {[1, 2, 3].map(i => (
            <motion.span key={i} initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0 }} transition={{ delay: i * 0.15, type: 'spring' }}>
              <Emoji emoji="⭐" size={40} />
            </motion.span>
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
    <main className="h-dvh flex flex-col p-6 overflow-hidden" style={{ background: '#7DD3FC' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => router.push('/math')} className="text-white text-2xl font-black w-10 h-10 flex items-center justify-center">←</button>
        <h1 className="text-lg font-black text-white flex-1 flex items-center gap-1.5"><Emoji emoji={lesson.emoji} size={20} /> {lesson.title} — Quiz</h1>
        <div className="text-white font-bold text-sm">{answered}/{allProbs.length}</div>
      </div>

      {/* Progress */}
      <div className="h-3 bg-white/25 rounded-full mb-6">
        <motion.div className="h-3 rounded-full" style={{ backgroundColor: lesson.color }} animate={{ width: `${pct}%` }} transition={{ duration: 0.4 }} />
      </div>

      {/* Problem card + abacus — scrollable so it never pushes answer buttons off screen */}
      <div className="flex-1 min-h-0 overflow-y-auto pb-4">
      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={current.id + '-' + answered}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-6 flex flex-col items-center gap-4"
          >
            <button
              onClick={() => {
                const opWord = current.op === '+' ? 'plus' : current.op === '-' ? 'minus' : current.op === '×' ? 'times' : 'divided by';
                speakEnglish(`What is ${current.a} ${opWord} ${current.b}?`);
              }}
              className="text-tama-purple/40 text-2xl"
            >
              🔊
            </button>

            <div className="text-5xl font-black text-tama-ink">
              {current.a} {current.op} {current.b} = ?
            </div>

            {/* Nine-Nine rhyme hint for multiplication */}
            {current.rhyme && (
              <button
                onClick={() => speakMandarin(current.rhyme!)}
                className="text-tama-purple font-black text-lg bg-tama-purple/10 px-4 py-2 rounded-xl"
              >
                🎵 {current.rhyme}
                <span className="block text-xs font-semibold text-tama-purple/60">{current.rhymePinyin}</span>
              </button>
            )}

            {/* Animated abacus visual */}
            <QuizAbacus a={current.a} b={current.b} op={current.op} color={lesson.color} />
          </motion.div>
        )}
      </AnimatePresence>
      </div>

      {/* Answer choices — always pinned at bottom */}
      <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto w-full flex-shrink-0">
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
