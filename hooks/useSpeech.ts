'use client';
import { useCallback } from 'react';

export function useSpeech() {
  const speak = useCallback((text: string, lang: 'en-US' | 'zh-CN' = 'en-US') => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate  = lang === 'zh-CN' ? 0.65 : 0.75;
    u.pitch = 1.25; // softer, higher = friendlier for kids

    // getVoices() may be empty on first call; retry after onvoiceschanged fires
    const trySpeak = () => {
      const voices = window.speechSynthesis.getVoices();
      const langPrefix = lang === 'zh-CN' ? 'zh' : 'en';

      // Prefer female voices: Tingting / Meijia for zh, Samantha / Karen for en
      const femaleKeywords = ['tingting', 'meijia', 'mei-jia', 'samantha', 'karen', 'victoria', 'female'];
      const female = voices.find(v =>
        v.lang.startsWith(langPrefix) &&
        femaleKeywords.some(k => v.name.toLowerCase().includes(k))
      );
      // Fall back to any voice for the language
      const fallback = voices.find(v => v.lang.startsWith(langPrefix));
      u.voice = female ?? fallback ?? null;
      window.speechSynthesis.speak(u);
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      trySpeak();
    } else {
      window.speechSynthesis.onvoiceschanged = () => { trySpeak(); };
    }
  }, []);

  const speakMandarin = useCallback((text: string) => speak(text, 'zh-CN'), [speak]);
  const speakEnglish  = useCallback((text: string) => speak(text, 'en-US'), [speak]);

  return { speak, speakMandarin, speakEnglish };
}
