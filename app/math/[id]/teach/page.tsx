'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MATH_LESSONS, TEACH_SLIDES } from '@/lib/math-data';
import { Emoji } from '@/components/Emoji';
import { useSpeech } from '@/hooks/useSpeech';

function BeadRow({ count, color, baseDelay = 0 }: { count: number; color: string; baseDelay?: number }) {
  return (
    <div className="flex gap-1.5 justify-center items-center flex-wrap">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ x: 24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: baseDelay + i * 0.07, type: 'spring', stiffness: 180, damping: 14 }}
          className="w-8 h-8 rounded-full shadow-md"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}

function BeadVisual({ groups, color, lessonId }: { groups: number[]; color: string; lessonId: number }) {
  const isSubtraction = lessonId === 2;
  const secondary = '#FBBF24';
  const removed   = '#9CA3AF';

  const total = isSubtraction ? groups[0] : groups.reduce((s, n) => s + n, 0);

  let runningDelay = 0;
  const rowDelays = groups.map(n => {
    const d = runningDelay;
    runningDelay += n * 0.07 + 0.15;
    return d;
  });

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      {/* Abacus frame */}
      <div className="w-full rounded-2xl p-4 border-2 border-amber-800/25" style={{ background: 'rgba(120,53,15,0.12)' }}>
        <div className="h-2 bg-amber-800/40 rounded-full mb-3" />

        <div className="flex flex-col gap-3">
          {groups.map((n, i) => {
            const beadColor = isSubtraction && i === 1 ? removed
              : groups.length > 1 && i % 2 === 1 ? secondary
              : color;

            return (
              <div key={i} className="relative flex items-center gap-2 flex-wrap">
                {/* rod */}
                <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-amber-900/20 rounded-full -z-10" />
                <BeadRow count={n} color={beadColor} baseDelay={rowDelays[i]} />
                {i < groups.length - 1 && !isSubtraction && (
                  <motion.span
                    className="text-white font-black text-xl z-10"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: rowDelays[i] + n * 0.07 + 0.05, type: 'spring' }}
                  >
                    +
                  </motion.span>
                )}
              </div>
            );
          })}
        </div>

        <div className="h-2 bg-amber-800/40 rounded-full mt-3" />
      </div>

      {isSubtraction && groups.length === 2 && (
        <motion.p
          className="text-white/60 text-xs font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: rowDelays[1] + groups[1] * 0.07 + 0.1 }}
        >
          {groups[1]} taken away — {groups[0]} remain
        </motion.p>
      )}

      <motion.div
        className="text-white font-black text-2xl"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: runningDelay }}
      >
        = {total}
      </motion.div>
    </div>
  );
}

export default function TeachPage() {
  const params  = useParams<{ id: string }>();
  const router  = useRouter();
  const lessonId = Number(params.id);
  const { speakMandarin } = useSpeech();

  const lesson = MATH_LESSONS.find(l => l.id === lessonId);
  const slides = TEACH_SLIDES[lessonId] ?? [];
  const [idx, setIdx] = useState(0);

  const slide = slides[idx];
  const isLast = idx === slides.length - 1;

  function next() {
    if (isLast) router.push(`/math/${lessonId}/quiz`);
    else setIdx(i => i + 1);
  }

  if (!lesson || !slide) return null;

  const pct = ((idx + 1) / slides.length) * 100;

  return (
    <main className="min-h-screen flex flex-col p-6" style={{ background: '#7DD3FC' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => router.push('/math')}
          className="text-white text-2xl font-black w-10 h-10 flex items-center justify-center"
        >
          ←
        </button>
        <h1 className="text-lg font-black text-white flex-1">
          <Emoji emoji={lesson.emoji} size={20} className="mr-1" /> {lesson.title} — Learn
        </h1>
        <div className="text-white font-bold text-sm">{idx + 1}/{slides.length}</div>
      </div>

      {/* Progress */}
      <div className="h-3 bg-white/25 rounded-full mb-6">
        <motion.div
          className="h-3 rounded-full"
          style={{ backgroundColor: lesson.color }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Slide card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-3xl shadow-2xl p-6 flex flex-col gap-5 flex-1"
        >
          {/* Chinese term */}
          <button
            onClick={() => speakMandarin(slide.hanzi)}
            className="flex flex-col items-center gap-1 self-center"
          >
            <span className="text-6xl font-black text-tama-ink leading-none">{slide.hanzi}</span>
            <span className="text-tama-purple font-black text-lg">{slide.pinyin}</span>
            <span className="text-tama-ink/50 font-semibold">{slide.english}</span>
            <span className="text-tama-purple/40 text-sm mt-1">🔊 tap to hear</span>
          </button>

          <p className="text-tama-ink font-semibold text-center text-base leading-relaxed">
            {slide.body}
          </p>

          {/* Bead visual */}
          {slide.beadGroups && slide.beadGroups.length > 0 && (
            <BeadVisual groups={slide.beadGroups} color={lesson.color} lessonId={lessonId} />
          )}

          {/* Nine-Nine Rhyme entries */}
          {slide.rhymeEntries && (
            <div className="flex flex-col gap-2 overflow-y-auto max-h-64">
              {slide.rhymeEntries.map((entry, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => speakMandarin(entry.hanzi)}
                  className="flex items-center justify-between bg-tama-blue/10 rounded-xl px-4 py-2.5 text-left"
                >
                  <div>
                    <span className="text-xl font-black text-tama-ink">{entry.hanzi}</span>
                    <span className="block text-xs font-semibold text-tama-purple/70">{entry.pinyin}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-tama-ink/50 font-bold text-sm">{entry.eq}</span>
                    <span className="text-tama-purple/40 text-lg">🔊</span>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Next button */}
      <motion.button
        onClick={next}
        className="mt-6 text-white font-black text-xl py-4 rounded-2xl shadow-xl w-full"
        style={{ backgroundColor: lesson.color }}
        whileTap={{ scale: 0.95 }}
      >
        {isLast ? 'Start Quiz! ▶' : 'Next →'}
      </motion.button>
    </main>
  );
}
