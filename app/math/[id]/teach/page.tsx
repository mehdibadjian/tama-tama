'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MATH_LESSONS, TEACH_SLIDES } from '@/lib/math-data';
import { useSpeech } from '@/hooks/useSpeech';

function BeadRow({ count, color }: { count: number; color: string }) {
  return (
    <div className="flex gap-1.5 justify-center flex-wrap">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.06, type: 'spring', bounce: 0.5 }}
          className="w-8 h-8 rounded-full shadow-md"
          style={{ backgroundColor: color }}
        />
      ))}
    </div>
  );
}

function BeadVisual({ groups, color }: { groups: number[]; color: string }) {
  const ops = ['+', '+', '+'];
  const total = groups.reduce((s, n) => s + n, 0);
  return (
    <div className="flex flex-col items-center gap-3 bg-white/20 rounded-2xl p-4 w-full">
      <div className="flex items-center gap-3 flex-wrap justify-center">
        {groups.map((n, i) => (
          <div key={i} className="flex items-center gap-2">
            <BeadRow count={n} color={color} />
            {i < groups.length - 1 && (
              <span className="text-2xl font-black text-white">{ops[i]}</span>
            )}
          </div>
        ))}
      </div>
      <div className="text-white/60 font-black text-lg">= {total}</div>
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
          {lesson.emoji} {lesson.title} — Learn
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
            <BeadVisual groups={slide.beadGroups} color={lesson.color} />
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
