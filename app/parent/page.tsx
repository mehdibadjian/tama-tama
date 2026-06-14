'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LESSONS, VOCAB } from '@/lib/seed-data';
import { DEFAULT_MATH_SETTINGS, loadMathSettings, saveMathSettings } from '@/lib/math-data';
import type { MathSettings } from '@/lib/math-data';
import { Emoji } from '@/components/Emoji';
import { getProgress } from '@/lib/progress';
import type { VocabItem, LessonProgress } from '@/lib/types';

const CUSTOM_KEY = 'tama-tama-custom-vocab';
const PIN = '1234';

// A labelled row of pick-one difficulty buttons for the math settings.
function OptionRow({
  label, emoji, hint, value, options, onChange,
}: {
  label: string;
  emoji: string;
  hint: string;
  value: number;
  options: number[];
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline gap-2">
        <Emoji emoji={emoji} size={16} />
        <span className="font-bold text-tama-ink text-sm">{label}</span>
        <span className="text-tama-ink/40 text-xs">{hint}</span>
      </div>
      <div className="flex gap-2">
        {options.map(o => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`flex-1 py-2 rounded-xl font-black text-sm transition-colors ${
              value === o ? 'bg-tama-purple text-white' : 'bg-tama-blue/15 text-tama-ink'
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ParentPage() {
  const router = useRouter();
  const [unlocked, setUnlocked]     = useState(false);
  const [pin, setPin]               = useState('');
  const [pinError, setPinError]     = useState(false);
  const [progress, setProgress]     = useState<LessonProgress[]>([]);
  const [custom, setCustom]         = useState<VocabItem[]>([]);
  const [activeLesson, setActive]   = useState(1);
  const [form, setForm]             = useState({ hanzi: '', pinyin: '', english: '', emoji: '' });
  const [saved, setSaved]           = useState(false);
  const [mathSettings, setMathSettings] = useState<MathSettings>(DEFAULT_MATH_SETTINGS);

  useEffect(() => {
    setProgress(getProgress());
    setMathSettings(loadMathSettings());
    try {
      const stored = localStorage.getItem(CUSTOM_KEY);
      if (stored) setCustom(JSON.parse(stored));
    } catch { /* empty */ }
  }, []);

  function updateMath(patch: Partial<MathSettings>) {
    setMathSettings(prev => {
      const next = { ...prev, ...patch };
      saveMathSettings(next);
      return next;
    });
  }

  function handleDigit(d: string) {
    if (d === '⌫') { setPin(p => p.slice(0, -1)); return; }
    const next = pin + d;
    setPin(next);
    if (next.length < 4) return;
    if (next === PIN) {
      setUnlocked(true);
    } else {
      setPinError(true);
      setTimeout(() => { setPin(''); setPinError(false); }, 800);
    }
  }

  function saveWord() {
    if (!form.hanzi || !form.english || !form.pinyin) return;
    const word: VocabItem = {
      id: Date.now(),
      hanzi: form.hanzi,
      pinyin: form.pinyin,
      english: form.english,
      emoji: form.emoji || '📝',
      lessonId: activeLesson,
    };
    const next = [...custom, word];
    setCustom(next);
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(next));
    setForm({ hanzi: '', pinyin: '', english: '', emoji: '' });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function deleteWord(id: number) {
    const next = custom.filter(v => v.id !== id);
    setCustom(next);
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(next));
  }

  if (!unlocked) {
    return (
      <main className="min-h-screen bg-tama-blue flex flex-col items-center justify-center gap-5 p-8">
        <button
          onClick={() => router.push('/')}
          className="self-start text-white text-2xl font-black"
        >
          ←
        </button>
        <h1 className="text-2xl font-black text-white">Parent Area</h1>
        <p className="text-white/70 font-semibold">Enter your PIN</p>

        <div className="flex gap-3 mb-1">
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className={`w-5 h-5 rounded-full border-2 border-white transition-colors ${
                pin.length > i ? 'bg-tama-pink' : 'bg-transparent'
              }`}
            />
          ))}
        </div>

        {pinError && (
          <motion.p
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-red-200 font-bold text-sm"
          >
            Wrong PIN — try again
          </motion.p>
        )}

        <div className="grid grid-cols-3 gap-3 w-full max-w-[240px]">
          {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((d, i) => (
            <button
              key={i}
              onClick={() => d ? handleDigit(d) : undefined}
              className={`py-4 rounded-2xl text-xl font-black shadow transition-transform active:scale-95 ${
                d ? 'bg-white text-tama-ink' : 'invisible'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <p className="text-white/40 text-xs mt-2">Default PIN: 1234</p>
      </main>
    );
  }

  const lessonCustom = custom.filter(v => v.lessonId === activeLesson);
  const lessonSeeded = VOCAB.filter(v => v.lessonId === activeLesson);

  return (
    <main className="min-h-screen bg-tama-blue p-6 pb-20">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => router.push('/')} className="text-white text-2xl font-black">←</button>
          <h1 className="text-2xl font-black text-white">Parent Dashboard</h1>
        </div>

        {/* Progress card */}
        <section className="bg-white rounded-2xl p-5 mb-5 shadow-lg">
          <h2 className="font-black text-tama-ink text-lg mb-3">Progress</h2>
          <div className="flex flex-col gap-2">
            {LESSONS.map(lesson => {
              const p = progress.find(x => x.lessonId === lesson.id);
              return (
                <div key={lesson.id} className="flex items-center gap-3">
                  <Emoji emoji={lesson.emoji} size={24} />
                  <span className="font-semibold text-tama-ink flex-1">{lesson.title}</span>
                  <span className="text-lg">
                    {p?.completed ? '⭐'.repeat(p.stars) : <span className="text-tama-ink/30 text-sm">not started</span>}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Math difficulty card */}
        <section className="bg-white rounded-2xl p-5 mb-5 shadow-lg">
          <h2 className="font-black text-tama-ink text-lg mb-1">Math Difficulty</h2>
          <p className="text-tama-ink/50 text-xs font-semibold mb-4">
            Tune the numbers to your child. Defaults are set for a 6-year-old. Changes apply on the next quiz.
          </p>
          <div className="flex flex-col gap-4">
            <OptionRow
              label="Addition" emoji="➕" hint="numbers up to"
              value={mathSettings.addMax} options={[5, 10, 20]}
              onChange={v => updateMath({ addMax: v })}
            />
            <OptionRow
              label="Subtraction" emoji="➖" hint="numbers up to"
              value={mathSettings.subMax} options={[5, 10, 20]}
              onChange={v => updateMath({ subMax: v })}
            />
            <OptionRow
              label="Multiplication" emoji="✖️" hint="times tables up to"
              value={mathSettings.mulMax} options={[3, 5, 9]}
              onChange={v => updateMath({ mulMax: v })}
            />
            <OptionRow
              label="Division" emoji="➗" hint="numbers up to"
              value={mathSettings.divMax} options={[3, 5, 9]}
              onChange={v => updateMath({ divMax: v })}
            />
            <OptionRow
              label="Questions" emoji="❓" hint="per quiz"
              value={mathSettings.count} options={[5, 8, 10]}
              onChange={v => updateMath({ count: v })}
            />
          </div>
          <button
            onClick={() => updateMath(DEFAULT_MATH_SETTINGS)}
            className="mt-4 text-tama-purple/70 text-xs font-bold"
          >
            Reset to defaults (ages ~6)
          </button>
        </section>

        {/* Add word card */}
        <section className="bg-white rounded-2xl p-5 shadow-lg">
          <h2 className="font-black text-tama-ink text-lg mb-4">Add a Word</h2>

          {/* Lesson selector */}
          <div className="flex gap-2 overflow-x-auto pb-1 mb-4 -mx-1 px-1">
            {LESSONS.map(l => (
              <button
                key={l.id}
                onClick={() => setActive(l.id)}
                className={`flex-none px-3 py-1.5 rounded-xl font-bold text-sm whitespace-nowrap transition-colors ${
                  activeLesson === l.id
                    ? 'bg-tama-purple text-white'
                    : 'bg-tama-blue/20 text-tama-ink'
                }`}
              >
                <Emoji emoji={l.emoji} size={16} className="mr-1" /> {l.title}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 mb-4">
            <input
              placeholder="Hanzi (e.g. 猫)"
              value={form.hanzi}
              onChange={e => setForm(f => ({ ...f, hanzi: e.target.value }))}
              className="border-2 border-tama-purple/30 rounded-xl px-4 py-2 text-2xl font-black text-tama-ink focus:outline-none focus:border-tama-purple"
            />
            <input
              placeholder="Pinyin (e.g. māo)"
              value={form.pinyin}
              onChange={e => setForm(f => ({ ...f, pinyin: e.target.value }))}
              className="border-2 border-tama-purple/30 rounded-xl px-4 py-2 font-semibold text-tama-ink focus:outline-none focus:border-tama-purple"
            />
            <input
              placeholder="English (e.g. cat)"
              value={form.english}
              onChange={e => setForm(f => ({ ...f, english: e.target.value }))}
              className="border-2 border-tama-purple/30 rounded-xl px-4 py-2 font-semibold text-tama-ink focus:outline-none focus:border-tama-purple"
            />
            <input
              placeholder="Emoji (optional, e.g. 🐱)"
              value={form.emoji}
              onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))}
              className="border-2 border-tama-purple/30 rounded-xl px-4 py-2 text-2xl focus:outline-none focus:border-tama-purple"
            />
            <button
              onClick={saveWord}
              className="bg-tama-pink text-white font-black py-3 rounded-xl shadow text-lg transition-transform active:scale-95"
            >
              {saved ? '✓ Saved!' : 'Add Word'}
            </button>
          </div>

          {/* Existing seed words */}
          <details className="mb-3">
            <summary className="text-sm font-bold text-tama-ink/50 cursor-pointer">
              Built-in words ({lessonSeeded.length})
            </summary>
            <div className="mt-2 flex flex-col gap-1">
              {lessonSeeded.map(v => (
                <div key={v.id} className="flex items-center gap-2 text-sm text-tama-ink/60">
                  <Emoji emoji={v.emoji} size={18} />
                  <span className="font-black text-tama-ink">{v.hanzi}</span>
                  <span>{v.pinyin}</span>
                  <span className="flex-1">{v.english}</span>
                </div>
              ))}
            </div>
          </details>

          {/* Custom words */}
          {lessonCustom.length > 0 && (
            <div>
              <p className="text-sm font-bold text-tama-ink/50 mb-2">
                Your additions ({lessonCustom.length})
              </p>
              {lessonCustom.map(v => (
                <div key={v.id} className="flex items-center gap-2 py-1">
                  <Emoji emoji={v.emoji} size={18} />
                  <span className="font-black text-tama-ink">{v.hanzi}</span>
                  <span className="text-tama-ink/60">{v.pinyin}</span>
                  <span className="text-tama-ink/40 flex-1">{v.english}</span>
                  <button
                    onClick={() => deleteWord(v.id)}
                    className="text-red-300 text-sm font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
