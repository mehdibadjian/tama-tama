'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LESSONS } from '@/lib/seed-data';
import { getProgress } from '@/lib/progress';
import type { LessonProgress } from '@/lib/types';

export default function MapPage() {
  const router = useRouter();
  const [progress, setProgress] = useState<LessonProgress[]>([]);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  function isUnlocked(position: number) {
    if (position === 1) return true;
    const prev = LESSONS.find(l => l.position === position - 1);
    if (!prev) return false;
    return progress.some(p => p.lessonId === prev.id && p.completed);
  }

  return (
    <main className="min-h-screen bg-tama-blue p-6 pb-20">
      <div className="max-w-sm mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-white text-2xl font-black w-10 h-10 flex items-center justify-center"
          >
            ←
          </button>
          <h1 className="text-2xl font-black text-white">My Journey</h1>
        </div>

        <div className="flex flex-col items-center gap-2">
          {LESSONS.map((lesson, index) => {
            const lp = progress.find(p => p.lessonId === lesson.id);
            const completed = lp?.completed ?? false;
            const unlocked = isUnlocked(lesson.position);

            return (
              <div key={lesson.id} className="flex flex-col items-center w-full">
                {index > 0 && (
                  <div
                    className={`w-2 h-8 rounded-full transition-colors ${
                      completed ? 'bg-tama-purple' : 'bg-white/25'
                    }`}
                  />
                )}

                <motion.button
                  onClick={() => unlocked && router.push(`/lesson/${lesson.id}/trace`)}
                  className={`w-full max-w-xs p-5 rounded-2xl shadow-lg flex items-center gap-4 transition-colors ${
                    completed
                      ? 'bg-tama-pink text-white'
                      : unlocked
                      ? 'bg-white text-tama-ink'
                      : 'bg-white/25 text-white/40 cursor-default'
                  }`}
                  whileTap={unlocked ? { scale: 0.95 } : {}}
                  animate={
                    unlocked && !completed
                      ? { scale: [1, 1.015, 1] }
                      : {}
                  }
                  transition={{ repeat: Infinity, duration: 2.5 }}
                >
                  <span className="text-4xl">{lesson.emoji}</span>
                  <div className="flex-1 text-left">
                    <div className="font-black text-lg leading-tight">{lesson.title}</div>
                    <div className="text-sm font-semibold opacity-60">{lesson.titleZh}</div>
                  </div>
                  {completed && (
                    <span className="text-xl">{'⭐'.repeat(lp?.stars ?? 1)}</span>
                  )}
                  {!unlocked && <span className="text-xl">🔒</span>}
                  {unlocked && !completed && (
                    <span className="text-tama-purple text-xl">▶</span>
                  )}
                </motion.button>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
