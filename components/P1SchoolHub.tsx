'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { P1_CURRICULUM_DATA } from '@/lib/p1-curriculum-data';
import { p1StarBadge } from '@/lib/p1-curriculum-logic';
import { Emoji } from '@/components/Emoji';
import { TamaCharacter } from '@/components/TamaCharacter';
import { P1PetStats } from '@/components/P1PetStats';
import { useP1Progress, usePetState } from '@/hooks/useP1Stores';

/**
 * The P1 Readiness Hub: Singapore MOE Primary 1 tracks, the child's learning
 * streak, and the pet's current mood — reachable from the 🎒 backpack button.
 */
export function P1SchoolHub() {
  const router = useRouter();
  const progress = useP1Progress();
  const pet = usePetState();

  const streak = progress.dailyStreak;

  return (
    <main className="min-h-screen bg-tama-blue p-6 pb-20">
      <div className="max-w-sm mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={() => router.push('/')}
            className="text-white text-2xl font-black w-10 h-10 flex items-center justify-center"
            aria-label="Back home"
          >
            ←
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-white leading-tight">P1 School</h1>
            <p className="text-white/70 text-xs font-bold">小学堂 · Singapore Primary 1 readiness</p>
          </div>
          <div className="bg-white/25 text-white font-black px-3 py-1.5 rounded-full text-sm flex items-center gap-1">
            <Emoji emoji="🪙" size={16} /> {pet.starCoins}
          </div>
        </div>

        {/* Pet + streak header */}
        <div className="bg-white rounded-3xl p-4 shadow-lg mb-5 flex items-center gap-4">
          <TamaCharacter size={84} uniform wave bounce />
          <div className="flex-1">
            <motion.p
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-tama-pink text-white font-black text-sm px-3 py-2 rounded-2xl rounded-bl-none inline-block"
            >
              {pet.speech || 'Tap a subject and let us get ready for P1! 🎒'}
            </motion.p>
            <p className="text-tama-ink/60 text-xs font-bold mt-2 flex items-center gap-1">
              <Emoji emoji="🔥" size={14} />
              {streak > 0 ? `${streak}-Day Learning Streak!` : 'Start a streak today!'}
            </p>
          </div>
        </div>

        {/* Subject grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {P1_CURRICULUM_DATA.map((track, i) => {
            const record = progress.completedActivityIds[track.id];

            return (
              <motion.button
                key={track.id}
                onClick={() => router.push(`/p1-school/${track.id}`)}
                className="rounded-3xl p-4 shadow-lg text-left text-white flex flex-col gap-2 min-h-[140px]"
                style={{ backgroundColor: track.accentColor }}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, type: 'spring', bounce: 0.35 }}
                whileTap={{ scale: 0.95 }}
              >
                <Emoji emoji={track.icon} size={32} />
                <div>
                  <p className="font-black leading-tight">{track.title}</p>
                  <p className="text-white/80 text-[11px] font-semibold leading-tight mt-0.5">
                    {track.description}
                  </p>
                </div>
                <div className="mt-auto flex items-center gap-1.5">
                  <Emoji emoji="⭐" size={14} />
                  <span className="text-[11px] font-black">{p1StarBadge(record?.starsEarned ?? 0)}</span>
                  <span className="text-white/80 text-[11px] font-black ml-auto">
                    {track.questions.length} questions
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        <P1PetStats pet={pet} />

        <p className="text-white/50 text-xs font-semibold text-center mt-4 leading-relaxed">
          English (STELLAR) · Math (CPA) · 华文 Mother Tongue · PAL school life.
          Science starts in Primary 3, so there is none here yet.
        </p>
      </div>
    </main>
  );
}
