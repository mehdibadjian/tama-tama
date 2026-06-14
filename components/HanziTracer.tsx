'use client';
// Finger-tracing of a single Chinese character. Shows the character outline as
// a guide; each stroke fills in with colour as the child traces it correctly,
// using the hanzi-writer stroke-order quiz.
import { useEffect, useRef } from 'react';
import HanziWriter from 'hanzi-writer';

interface Props {
  char: string;
  size: number;
  onComplete: () => void;
}

export function HanziTracer({ char, size, onComplete }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriter | null>(null);
  // Keep the latest callback without re-creating the writer on every render.
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    host.innerHTML = '';

    const writer = HanziWriter.create(host, char, {
      width: size,
      height: size,
      padding: 12,
      showCharacter: false,   // start blank — the child fills it in
      showOutline: true,      // faint guide to trace along
      strokeColor: '#2D2A45',
      outlineColor: '#C4B5FD',
      drawingColor: '#A855F7',
      drawingWidth: 26,
      highlightOnComplete: true,
      highlightColor: '#FF8EAF',
    });
    writerRef.current = writer;

    function startQuiz() {
      writer.quiz({
        showHintAfterMisses: 2,           // gently highlight the stroke after 2 tries
        onComplete: () => onCompleteRef.current(),
      });
    }
    startQuiz();

    return () => {
      try { writer.cancelQuiz(); } catch { /* empty */ }
      host.innerHTML = '';
      writerRef.current = null;
    };
  }, [char, size]);

  function showMe() {
    const writer = writerRef.current;
    if (!writer) return;
    writer.cancelQuiz();
    writer.animateCharacter({
      onComplete: () => {
        writer.quiz({
          showHintAfterMisses: 2,
          onComplete: () => onCompleteRef.current(),
        });
      },
    });
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        ref={hostRef}
        style={{ width: size, height: size, touchAction: 'none' }}
        className="rounded-2xl bg-white shadow-inner"
      />
      <button
        onClick={showMe}
        className="text-tama-purple font-bold text-sm bg-tama-purple/10 px-4 py-2 rounded-xl active:scale-95 transition-transform"
      >
        ✍️ Show me how
      </button>
    </div>
  );
}
