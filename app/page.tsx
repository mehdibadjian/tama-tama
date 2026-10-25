'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { TamaCharacter } from '@/components/TamaCharacter';
import { Emoji } from '@/components/Emoji';
import { useSpeech } from '@/hooks/useSpeech';

export default function SplashPage() {
  const router = useRouter();
  const { speak, speakEnglish } = useSpeech();

  function handleMandarin() {
    // Required user gesture to unlock AudioContext for the session
    speakEnglish("Welcome to Tama-Tama! Let's learn Mandarin!");
    router.push('/map');
  }

  function handleMath() {
    speakEnglish("Let's do Chinese mental math!");
    router.push('/math');
  }

  function handleP1School() {
    speak("Welcome to P1 School! Let's get ready for Primary One!", 'en-SG');
    router.push('/p1-school');
  }

  return (
    <main className="min-h-screen bg-tama-blue flex flex-col items-center justify-center gap-5 p-8">
      <motion.h1
        className="text-5xl font-black text-white drop-shadow-lg tracking-tight"
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Tama-Tama
      </motion.h1>

      <motion.p
        className="text-base font-bold text-white/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Learn Mandarin &amp; Math with your pet!
      </motion.p>

      <TamaCharacter size={220} bounce />

      {/* Two subject buttons */}
      <motion.div
        className="flex flex-col gap-3 w-full max-w-xs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: 'spring', bounce: 0.3 }}
      >
        <motion.button
          onClick={handleMandarin}
          className="bg-tama-pink text-white text-xl font-black py-5 rounded-2xl shadow-2xl flex items-center justify-center gap-3"
          whileTap={{ scale: 0.93 }}
        >
          <Emoji emoji="🈶" size={26} /> Mandarin
        </motion.button>

        <motion.button
          onClick={handleMath}
          className="text-white text-xl font-black py-5 rounded-2xl shadow-2xl flex items-center justify-center gap-3"
          style={{ backgroundColor: '#FB923C' }}
          whileTap={{ scale: 0.93 }}
        >
          <Emoji emoji="🧮" size={26} /> 心算 Math
        </motion.button>

        <motion.button
          onClick={handleP1School}
          className="text-white text-xl font-black py-5 rounded-2xl shadow-2xl flex items-center justify-center gap-3"
          style={{ backgroundColor: '#A855F7' }}
          whileTap={{ scale: 0.93 }}
        >
          <Emoji emoji="🎒" size={26} /> P1 School · 小学堂
        </motion.button>
      </motion.div>

      <motion.button
        onClick={() => router.push('/parent')}
        className="text-white/40 text-sm font-semibold mt-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Parent Area
      </motion.button>
    </main>
  );
}
