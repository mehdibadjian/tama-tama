'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { TamaCharacter } from '@/components/TamaCharacter';
import { useSpeech } from '@/hooks/useSpeech';

export default function SplashPage() {
  const router = useRouter();
  const { speakEnglish } = useSpeech();

  function handleStart() {
    // This tap is the required user gesture that unlocks AudioContext for the session
    speakEnglish("Welcome to Tama-Tama! Let's learn Mandarin!");
    router.push('/map');
  }

  return (
    <main className="min-h-screen bg-tama-blue flex flex-col items-center justify-center gap-6 p-8">
      <motion.h1
        className="text-5xl font-black text-white drop-shadow-lg tracking-tight"
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Tama-Tama
      </motion.h1>

      <motion.p
        className="text-lg font-bold text-white/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Learn Mandarin with your pet!
      </motion.p>

      <TamaCharacter size={260} bounce />

      <motion.button
        onClick={handleStart}
        className="bg-tama-pink text-white text-2xl font-black px-14 py-5 rounded-2xl shadow-2xl mt-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', bounce: 0.4 }}
        whileTap={{ scale: 0.93 }}
      >
        Tap to Play! 🌟
      </motion.button>

      <motion.button
        onClick={() => router.push('/parent')}
        className="text-white/50 text-sm font-semibold mt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Parent Area
      </motion.button>
    </main>
  );
}
