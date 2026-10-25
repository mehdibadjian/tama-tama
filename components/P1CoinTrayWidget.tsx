'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import type { MoneyCanteenPayload } from '@/lib/p1-curriculum-types';
import { coinsTotal, formatCents, judgePayment } from '@/lib/p1-curriculum-logic';
import { Emoji } from '@/components/Emoji';
import { playChime, playRetry } from '@/lib/sfx';

interface Props {
  order: MoneyCanteenPayload;
  locked: boolean;
  onResult: (correct: boolean) => void;
}

const VISUALS: Record<number, { label: string; size: number; face: string; ring: string }> = {
  5:   { label: '5¢',  size: 44, face: '#D98C5F', ring: '#A9663C' }, // bronze
  10:  { label: '10¢', size: 50, face: '#D6DBE0', ring: '#9AA5B1' }, // cupro-nickel
  20:  { label: '20¢', size: 56, face: '#CBD3DA', ring: '#8D99A6' },
  50:  { label: '50¢', size: 62, face: '#C2CCD6', ring: '#83919F' },
  100: { label: '$1',  size: 66, face: '#E8C87A', ring: '#B7C0C9' }, // bimetallic: brass core
  200: { label: '$2',  size: 70, face: '#F0D48A', ring: '#C9A227' },
};

function CoinFace({ cent, dimmed }: { cent: number; dimmed?: boolean }) {
  const v = VISUALS[cent] ?? { label: `${cent}¢`, size: 52, face: '#D6DBE0', ring: '#9AA5B1' };
  return (
    <div
      className={`rounded-full flex items-center justify-center font-black text-tama-ink shadow-inner border-4 ${dimmed ? 'opacity-30' : ''}`}
      style={{
        width: v.size,
        height: v.size,
        backgroundColor: v.face,
        borderColor: v.ring,
        fontSize: v.size * 0.3,
      }}
    >
      {v.label}
    </div>
  );
}

/** Canteen counter: tap coins onto the tray, then pay the uncle or auntie. */
export function P1CoinTrayWidget({ order, locked, onResult }: Props) {
  const [tray, setTray] = useState<number[]>([]);
  const [verdict, setVerdict] = useState<'exact' | 'short' | 'over' | null>(null);
  const [shaking, setShaking] = useState(false);

  const paid = coinsTotal(tray);

  function addCoin(cent: number) {
    if (locked || verdict === 'exact') return;
    setTray(t => [...t, cent]);
    setVerdict(null);
  }

  function removeCoin(index: number) {
    if (locked || verdict === 'exact') return;
    setTray(t => t.filter((_, i) => i !== index));
    setVerdict(null);
  }

  function pay() {
    if (locked || verdict === 'exact') return;
    const result = judgePayment(paid, order.itemPriceCents);
    setVerdict(result);
    if (result !== 'exact') setShaking(true);
    if (result === 'exact') playChime();
    else playRetry();
    onResult(result === 'exact');
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* The order */}
      <div className="flex items-center gap-3 bg-tama-blue/15 rounded-2xl px-4 py-2">
        <Emoji emoji={order.itemName.includes('Noodle') ? '🍜' : '☕'} size={30} />
        <div>
          <p className="font-black text-tama-ink leading-tight">{order.itemName}</p>
          <p className="text-tama-ink/60 text-xs font-bold">Target: {formatCents(order.itemPriceCents)}</p>
        </div>
      </div>

      {/* Tray */}
      <motion.div
        className="w-full max-w-xs min-h-[92px] bg-white rounded-2xl border-4 border-dashed border-tama-purple/30 p-3 flex flex-wrap gap-2 items-center justify-center"
        animate={shaking ? { x: [-8, 8, -6, 6, 0] } : {}}
        onAnimationComplete={() => setShaking(false)}
      >
        {tray.length === 0 && (
          <span className="text-tama-ink/30 text-sm font-bold">Tray is empty — tap coins below</span>
        )}
        {tray.map((cent, i) => (
          <motion.button
            key={`${cent}-${i}`}
            onClick={() => removeCoin(i)}
            initial={{ scale: 0, y: -14 }}
            animate={{ scale: 1, y: 0 }}
            whileTap={{ scale: 0.85 }}
            aria-label={`Remove ${formatCents(cent)} from tray`}
          >
            <div style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'scale(0.62)' }}>
              <CoinFace cent={cent} />
            </div>
          </motion.button>
        ))}
      </motion.div>

      <div className="flex items-center gap-2 text-lg font-black text-tama-ink">
        <span>Current: {formatCents(paid)}</span>
        <span className="text-tama-ink/30">/</span>
        <span className={paid === order.itemPriceCents ? 'text-tama-purple' : 'text-tama-ink/50'}>
          {formatCents(order.itemPriceCents)}
        </span>
      </div>

      {/* Coin purse */}
      <div className="flex gap-2 flex-wrap justify-center">
        {order.availableCoins.map(cent => (
          <motion.button
            key={cent}
            onClick={() => addCoin(cent)}
            disabled={locked || verdict === 'exact'}
            className="disabled:opacity-40"
            whileTap={{ scale: 0.88 }}
            aria-label={`Add ${formatCents(cent)}`}
          >
            <CoinFace cent={cent} />
          </motion.button>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => { setTray([]); setVerdict(null); }}
          disabled={locked || verdict === 'exact' || tray.length === 0}
          className="bg-white text-tama-ink/60 font-black px-4 py-2.5 rounded-2xl shadow disabled:opacity-40"
        >
          ↺ Reset Tray
        </button>
        <motion.button
          onClick={pay}
          disabled={locked || verdict === 'exact' || tray.length === 0}
          className="bg-tama-pink text-white font-black px-5 py-2.5 rounded-2xl shadow disabled:opacity-40"
          whileTap={{ scale: 0.93 }}
        >
          {verdict === 'exact' ? '✓ Paid!' : 'Pay Uncle / Auntie'}
        </motion.button>
      </div>

      {verdict === 'short' && (
        <p className="text-tama-ink/50 text-sm font-bold">Not enough yet — add a few more coins!</p>
      )}
      {verdict === 'over' && (
        <p className="text-tama-ink/50 text-sm font-bold">That is too much — tap a coin to take it back.</p>
      )}
      {verdict === 'exact' && (
        <p className="text-tama-purple text-sm font-black">Thank you! Exactly {formatCents(order.itemPriceCents)}! 🎉</p>
      )}
    </div>
  );
}
