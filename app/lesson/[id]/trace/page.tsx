'use client';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { VOCAB, LESSONS } from '@/lib/seed-data';
import { Emoji } from '@/components/Emoji';
import { useSpeech } from '@/hooks/useSpeech';
import type { VocabItem } from '@/lib/types';

export default function TracePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const lessonId = Number(params.id);
  const { speakMandarin } = useSpeech();

  const lesson = LESSONS.find(l => l.id === lessonId);
  const lessonVocab = VOCAB.filter(v => v.lessonId === lessonId);

  const [active, setActive]       = useState<VocabItem | null>(null);
  const [heard, setHeard]         = useState<Set<number>>(new Set());
  const [glowing, setGlowing]     = useState(false);

  function handleCardTap(vocab: VocabItem) {
    speakMandarin(vocab.hanzi);
    setActive(vocab);
    setHeard(prev => new Set(prev).add(vocab.id));
    setGlowing(true);
    setTimeout(() => setGlowing(false), 900);
  }

  function handleClose() {
    setActive(null);
  }

  if (!lesson) return null;

  const allHeard = lessonVocab.every(v => heard.has(v.id));

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
          <Emoji emoji={lesson.emoji} size={20} className="mr-1" /> Listen &amp; Trace
        </h1>
        <div className="text-white font-bold text-sm">
          {heard.size}/{lessonVocab.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-3 bg-white/25 rounded-full mb-6">
        <motion.div
          className="h-3 bg-tama-purple rounded-full"
          animate={{ width: `${(heard.size / lessonVocab.length) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <p className="text-white/70 font-semibold text-center mb-6">
        Tap any word to hear it!
      </p>

      {/* Grid of vocab cards — scrolls inside the viewport */}
      <div className="flex-1 min-h-0 overflow-y-auto">
      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto w-full pb-2">
        {lessonVocab.map((vocab) => {
          const done = heard.has(vocab.id);
          return (
            <motion.button
              key={vocab.id}
              onClick={() => handleCardTap(vocab)}
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
              <div className={`text-lg mt-1 ${done ? 'text-white/60' : 'text-tama-purple/40'}`}>🔊</div>
            </motion.button>
          );
        })}
      </div>
      </div>

      {/* Done CTA — pinned below the grid, slides up when all words heard */}
      <AnimatePresence>
        {allHeard && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-3 pt-4 pb-2 flex-shrink-0"
          >
            <p className="text-white font-black text-lg">You heard them all! 🎉</p>
            <button
              onClick={() => router.push(`/lesson/${lessonId}/match`)}
              className="bg-tama-pink text-white font-black text-xl px-12 py-4 rounded-2xl shadow-xl"
            >
              Start Exercise! ▶
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-screen detail overlay on tap */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-tama-blue/90 flex flex-col items-center justify-center gap-6 p-8 z-50"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                boxShadow: glowing
                  ? '0 0 0 20px #A855F755, 0 0 0 40px #A855F722'
                  : '0 24px 64px rgba(0,0,0,0.2)',
              }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => { e.stopPropagation(); handleCardTap(active); }}
              className="bg-tama-white rounded-3xl border-4 border-tama-purple p-10 flex flex-col items-center gap-4 cursor-pointer"
            >
              <Emoji emoji={active.emoji} size={80} />
              <span className="text-[100px] leading-none font-black text-tama-ink select-none">
                {active.hanzi}
              </span>
              <span className="text-tama-purple font-black text-2xl">{active.pinyin}</span>
              <span className="text-tama-ink/50 font-semibold text-lg">{active.english}</span>
              <p className="text-tama-purple/60 text-sm font-semibold mt-1">Tap to hear again</p>
            </motion.div>

            <button
              onClick={handleClose}
              className="text-white/60 font-bold text-lg"
            >
              Close
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
