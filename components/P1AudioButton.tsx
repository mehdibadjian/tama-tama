'use client';
import { motion } from 'framer-motion';
import { playP1Audio } from '@/hooks/useSpeech';
import type { P1AudioLang } from '@/lib/p1-curriculum-types';

interface Props {
  text: string;
  lang?: P1AudioLang;
  /** Optional second line, e.g. the Mandarin word under the English instruction. */
  secondary?: { text: string; lang: P1AudioLang };
}

/** Every P1 question gets a speaker so a child who cannot read yet can still play. */
export function P1AudioButton({ text, lang = 'en-SG', secondary }: Props) {
  return (
    <div className="flex items-center justify-center gap-2">
      <motion.button
        onClick={() => playP1Audio(text, lang)}
        className="bg-tama-purple/10 text-tama-purple rounded-2xl px-4 py-2 font-black text-sm flex items-center gap-2"
        whileTap={{ scale: 0.9 }}
        aria-label="Listen again"
      >
        🔊 Listen
      </motion.button>

      {secondary && (
        <motion.button
          onClick={() => playP1Audio(secondary.text, secondary.lang)}
          className="bg-tama-pink/15 text-tama-pink rounded-2xl px-4 py-2 font-black text-sm"
          whileTap={{ scale: 0.9 }}
          aria-label="Listen in Mandarin"
        >
          🀄 中文
        </motion.button>
      )}
    </div>
  );
}
