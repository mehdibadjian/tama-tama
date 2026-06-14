'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { VOCAB, LESSONS } from '@/lib/seed-data';
import { Emoji } from '@/components/Emoji';
import { HanziTracer } from '@/components/HanziTracer';
import { useSpeech } from '@/hooks/useSpeech';
import type { VocabItem } from '@/lib/types';

export default function TracePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const lessonId = Number(params.id);
  const { speakMandarin } = useSpeech();

  const lesson = LESSONS.find(l => l.id === lessonId);
  const lessonVocab = VOCAB.filter(v => v.lessonId === lessonId);

  const [active, setActive]         = useState<VocabItem | null>(null);
  const [charIndex, setCharIndex]   = useState(0);
  const [finished, setFinished]     = useState(false);
  const [traced, setTraced]         = useState<Set<number>>(new Set());

  const chars = active ? Array.from(active.hanzi) : [];

  function openWord(vocab: VocabItem) {
    speakMandarin(vocab.hanzi);
    setActive(vocab);
    setCharIndex(0);
    setFinished(false);
  }

  function handleCharComplete() {
    if (!active) return;
    if (charIndex < chars.length - 1) {
      setCharIndex(i => i + 1);
    } else {
      setTraced(prev => new Set(prev).add(active.id));
      setFinished(true);
      speakMandarin(active.hanzi);
    }
  }

  function retrace() {
    setCharIndex(0);
    setFinished(false);
  }

  function handleClose() {
    setActive(null);
  }

  if (!lesson) return null;

  const allTraced = lessonVocab.every(v => traced.has(v.id));

  return (
    <main className="h-dvh bg-tama-blue flex flex-col p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => router.push('/map')}
          className="text-white text-2xl font-black w-10 h-10 flex items-center justify-center"
        >
          ←
        </button>
        <h1 className="text-lg font-black text-white flex-1">
          <Emoji emoji={lesson.emoji} size={20} className="mr-1" /> Trace the Words
        </h1>
        <div className="text-white font-bold text-sm">
          {traced.size}/{lessonVocab.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-white/25 rounded-full mb-6">
        <motion.div
          className="h-3 bg-tama-purple rounded-full"
          animate={{ width: `${(traced.size / lessonVocab.length) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <p className="text-white/70 font-semibold text-center mb-6">
        Tap a word, then trace it with your finger! ✍️
      </p>

      {/* Grid of vocab cards — scrolls inside the viewport */}
      <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto w-full pb-2">
        {lessonVocab.map((vocab) => {
          const done = traced.has(vocab.id);
          return (
            <motion.button
              key={vocab.id}
              onClick={() => openWord(vocab)}
              className={`relative p-4 rounded-2xl shadow-md border-4 flex flex-col items-center gap-1 transition-colors ${
                done
                  ? 'bg-tama-pink border-tama-pink text-white'
                  : 'bg-tama-white border-tama-purple text-tama-ink'
              }`}
              whileTap={{ scale: 0.93 }}
              animate={done ? { scale: [1, 1.06, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Emoji emoji={vocab.emoji} size={40} />
              <span className="text-3xl font-black leading-tight">{vocab.hanzi}</span>
              <span className={`text-xs font-bold ${done ? 'text-white/80' : 'text-tama-purple'}`}>
                {vocab.pinyin}
              </span>
              <span className={`text-xs font-semibold ${done ? 'text-white/70' : 'text-tama-ink/50'}`}>
                {vocab.english}
              </span>
              {done && (
                <div className="absolute top-2 right-2 text-white text-sm">✓</div>
              )}
              <div className={`text-lg mt-1 ${done ? 'text-white/60' : 'text-tama-purple/40'}`}>✍️</div>
            </motion.button>
          );
        })}
      </div>
      </div>

      {/* Done CTA — pinned below the grid, slides up when all words traced */}
      <AnimatePresence>
        {allTraced && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 pt-4 pb-2 flex-shrink-0"
          >
            <p className="text-white font-black text-lg">You traced them all! 🎉</p>
            <button
              onClick={() => router.push(`/lesson/${lessonId}/match`)}
              className="bg-tama-pink text-white font-black text-xl px-12 py-4 rounded-2xl shadow-xl"
            >
              Start Exercise! ▶
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-screen tracing overlay */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-tama-blue/95 flex flex-col items-center justify-center gap-5 p-8 z-50"
          >
            {/* Word context */}
            <div className="flex flex-col items-center gap-1">
              <Emoji emoji={active.emoji} size={56} />
              <button
                onClick={() => speakMandarin(active.hanzi)}
                className="flex items-center gap-2 text-white font-black text-2xl"
              >
                {active.pinyin} <span className="text-xl opacity-70">🔊</span>
              </button>
              <span className="text-white/60 font-semibold">{active.english}</span>
            </div>

            {/* Per-character progress (for multi-character words) */}
            {chars.length > 1 && (
              <div className="flex gap-2">
                {chars.map((c, i) => (
                  <span
                    key={i}
                    className={`text-lg font-black w-9 h-9 rounded-lg flex items-center justify-center ${
                      i < charIndex || finished
                        ? 'bg-tama-pink text-white'
                        : i === charIndex
                        ? 'bg-white text-tama-ink ring-2 ring-tama-purple'
                        : 'bg-white/30 text-white/70'
                    }`}
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}

            {/* Tracer or celebration */}
            {!finished ? (
              <HanziTracer
                key={`${active.id}-${charIndex}`}
                char={chars[charIndex]}
                size={260}
                onComplete={handleCharComplete}
              />
            ) : (
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-4 bg-white rounded-3xl p-8"
              >
                <span className="text-7xl font-black text-tama-ink leading-none">{active.hanzi}</span>
                <p className="text-tama-pink font-black text-xl">Great writing! 🎉</p>
                <div className="flex gap-3">
                  <button
                    onClick={retrace}
                    className="bg-tama-purple/10 text-tama-purple font-black px-6 py-2.5 rounded-xl"
                  >
                    Again
                  </button>
                  <button
                    onClick={handleClose}
                    className="bg-tama-pink text-white font-black px-6 py-2.5 rounded-xl"
                  >
                    Done ✓
                  </button>
                </div>
              </motion.div>
            )}

            <button onClick={handleClose} className="text-white/60 font-bold text-lg">
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
