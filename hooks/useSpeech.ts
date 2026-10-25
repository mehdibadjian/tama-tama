'use client';
import { useCallback } from 'react';

export type SpeechLang = 'en-US' | 'en-SG' | 'zh-CN';

interface SpeakOptions {
  rate?: number;
  pitch?: number;
}

// Voices a child tends to like: Mandarin Tingting/Meijia, English Samantha/Karen.
const FEMALE_KEYWORDS = ['tingting', 'meijia', 'mei-jia', 'samantha', 'karen', 'victoria', 'female'];

function pickVoice(voices: SpeechSynthesisVoice[], lang: SpeechLang): SpeechSynthesisVoice | null {
  const prefix = lang === 'zh-CN' ? 'zh' : 'en';
  const isFemale = (v: SpeechSynthesisVoice) =>
    FEMALE_KEYWORDS.some(k => v.name.toLowerCase().includes(k));

  // Exact locale first (a real en-SG voice), then any voice of the same language.
  return (
    voices.find(v => v.lang === lang && isFemale(v)) ??
    voices.find(v => v.lang.startsWith(prefix) && isFemale(v)) ??
    voices.find(v => v.lang === lang) ??
    voices.find(v => v.lang.startsWith(prefix)) ??
    null
  );
}

/**
 * Core TTS. `getVoices()` is often empty on the very first call, so we wait for
 * `onvoiceschanged` once before giving up and speaking with the default voice.
 */
function speakText(text: string, lang: SpeechLang = 'en-SG', options: SpeakOptions = {}): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel(); // stop whatever is still playing

  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  // A slightly slower cadence and warmer pitch reads better to a 6-7 year old.
  u.rate = options.rate ?? 0.85;
  u.pitch = options.pitch ?? 1.1;

  const trySpeak = () => {
    u.voice = pickVoice(window.speechSynthesis.getVoices(), lang);
    window.speechSynthesis.speak(u);
  };

  if (window.speechSynthesis.getVoices().length > 0) {
    trySpeak();
  } else {
    window.speechSynthesis.onvoiceschanged = () => trySpeak();
  }
}

/** P1 Hub helper: reads a question prompt aloud in Singapore English or Mandarin. */
export function playP1Audio(text: string, lang: 'en-SG' | 'zh-CN' = 'en-SG'): void {
  speakText(text, lang);
}

export function useSpeech() {
  const speak = useCallback((text: string, lang: SpeechLang = 'en-US') => {
    // Existing lessons keep their original pacing.
    speakText(text, lang, {
      rate: lang === 'zh-CN' ? 0.65 : 0.75,
      pitch: 1.25,
    });
  }, []);

  const speakMandarin = useCallback((text: string) => speak(text, 'zh-CN'), [speak]);
  const speakEnglish  = useCallback((text: string) => speak(text, 'en-US'), [speak]);

  return { speak, speakMandarin, speakEnglish };
}
