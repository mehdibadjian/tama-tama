'use client';
import { motion } from 'framer-motion';
import type { PetState } from '@/lib/p1-curriculum-types';
import { Emoji } from '@/components/Emoji';

/** Pet mood strip — makes the P1 reward loop visible between activities. */
export function P1PetStats({ pet }: { pet: PetState }) {
  const bars = [
    { emoji: '🧠', label: 'Wisdom', value: pet.wisdom, color: '#A855F7' },
    { emoji: '💖', label: 'Happiness', value: pet.happiness, color: '#FF8EAF' },
    { emoji: '⚡', label: 'Energy', value: pet.energy, color: '#FBBF24' },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg flex flex-col gap-3">
      {bars.map(b => (
        <div key={b.label} className="flex items-center gap-3">
          <Emoji emoji={b.emoji} size={20} />
          <span className="text-tama-ink text-xs font-black w-24">{b.label}</span>
          <div className="flex-1 h-3 bg-tama-blue/20 rounded-full overflow-hidden">
            <motion.div
              className="h-3 rounded-full"
              style={{ backgroundColor: b.color }}
              initial={{ width: 0 }}
              animate={{ width: `${b.value}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
          <span className="text-tama-ink/50 text-xs font-bold w-8 text-right">{b.value}</span>
        </div>
      ))}
    </div>
  );
}
