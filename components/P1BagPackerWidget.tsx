'use client';
import { useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { BagPackerPayload } from '@/lib/p1-curriculum-types';
import { bagShelfItems, isBagItemValid } from '@/lib/p1-curriculum-logic';
import { P1Draggable } from '@/components/P1Draggable';
import { Emoji } from '@/components/Emoji';
import { playChime, playRetry } from '@/lib/sfx';

interface Props {
  bag: BagPackerPayload;
  locked: boolean;
  onResult: (correct: boolean) => void;
}

// Kid-readable picture for each timetable / shelf item.
const ITEM_EMOJI: Record<string, string> = {
  'English Workbook': '📕',
  'Math Textbook': '📘',
  'Pencil Case': '✏️',
  'Water Bottle': '🥤',
  'Video Game Console': '🎮',
  'Pajamas': '🩱',
  'Giant Pillow': '🛏️',
};

/** PAL: read the timetable, pack the bag, leave the silly things at home. */
export function P1BagPackerWidget({ bag, locked, onResult }: Props) {
  const shelf = useMemo(() => bagShelfItems(bag), [bag]);
  const [packed, setPacked] = useState<string[]>([]);
  const [rejected, setRejected] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [carrying, setCarrying] = useState(false);
  const bagRef = useRef<HTMLDivElement>(null);

  const needed = bag.validItems.length;

  function tap(item: string) {
    if (locked || checked) return;
    if (packed.includes(item)) {
      setPacked(p => p.filter(x => x !== item));
      return;
    }
    if (!isBagItemValid(item, bag)) {
      setRejected(item);
      playRetry();
      onResult(false);
      return;
    }
    setPacked(p => [...p, item]);
    setRejected(null);
  }

  function checkBag() {
    if (checked) return;
    const correct = packed.length === needed; // only valid items can ever be packed
    setChecked(correct);
    if (correct) playChime();
    else playRetry();
    onResult(correct);
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Timetable strip */}
      <div className="flex items-center gap-2 bg-tama-blue/15 rounded-2xl px-4 py-2">
        <span className="text-xs font-black text-tama-ink/50">TODAY</span>
        {bag.targetSubjects.map(s => (
          <span key={s} className="bg-white text-tama-ink font-black text-sm px-3 py-1 rounded-xl shadow">
            {s}
          </span>
        ))}
      </div>

      {/* The bag — the drop target */}
      <div ref={bagRef} className={`relative p-3 rounded-3xl transition-colors ${carrying ? 'bg-tama-pink/25' : ''}`}>
        <svg viewBox="0 0 120 130" className="w-28" role="img" aria-label="School bag">
          <path d="M40 22 Q60 4 80 22" fill="none" stroke="#A855F7" strokeWidth={7} strokeLinecap="round" />
          <rect x={14} y={22} width={92} height={96} rx={26} fill="#FF8EAF" stroke="#A855F7" strokeWidth={6} />
          <rect x={34} y={66} width={52} height={34} rx={12} fill="#FAFAFA" stroke="#A855F7" strokeWidth={4} />
          <rect x={52} y={88} width={16} height={12} rx={4} fill="#A855F7" />
        </svg>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-tama-purple text-white text-xs font-black px-3 py-1 rounded-full shadow">
          {packed.length} / {needed}
        </div>
      </div>

      {/* Packed items */}
      <div className="flex gap-2 flex-wrap justify-center min-h-[44px]">
        {packed.map(item => (
          <motion.div
            key={item}
            initial={{ scale: 0, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-tama-purple/10 rounded-xl px-3 py-1.5 flex items-center gap-1.5 text-xs font-black text-tama-purple"
          >
            <Emoji emoji={ITEM_EMOJI[item] ?? '🎒'} size={16} /> {item}
          </motion.div>
        ))}
      </div>

      {/* Shelf */}
      <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
        {shelf.map(item => {
          const isPacked = packed.includes(item);
          return (
            <motion.div
              key={item}
              animate={rejected === item ? { x: [-8, 8, -6, 6, 0] } : {}}
              onAnimationComplete={() => { if (rejected === item) setRejected(null); }}
            >
              <P1Draggable
                targetRef={bagRef}
                onDrop={() => tap(item)}
                onTap={() => tap(item)}
                onCarryChange={setCarrying}
                disabled={locked || checked}
                className={`w-full flex items-center gap-2 rounded-2xl px-3 py-3 shadow border-4 text-left transition-colors ${
                  isPacked
                    ? 'bg-tama-purple text-white border-tama-purple'
                    : 'bg-white text-tama-ink border-transparent'
                } disabled:opacity-50`}
                ariaLabel={`${item} — drag into the bag or tap`}
              >
                <Emoji emoji={ITEM_EMOJI[item] ?? '🎒'} size={26} />
                <span className="text-sm font-black leading-tight">{item}</span>
              </P1Draggable>
            </motion.div>
          );
        })}
      </div>

      <p className="text-tama-ink/40 text-xs font-bold">Drag an item into the bag, or tap it. Tap again to take it out.</p>

      <motion.button
        onClick={checkBag}
        disabled={checked || locked || packed.length === 0}
        className="bg-tama-pink text-white font-black px-6 py-3 rounded-2xl shadow text-lg disabled:opacity-40"
        whileTap={{ scale: 0.93 }}
      >
        {checked ? '✓ Bag Packed!' : 'Close My Bag'}
      </motion.button>

      {rejected && (
        <p className="text-tama-ink/50 text-sm font-bold">
          {rejected} stays at home — that is not for school! 😄
        </p>
      )}
    </div>
  );
}
