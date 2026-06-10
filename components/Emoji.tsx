// Renders any emoji as a Twemoji SVG image for consistent cross-platform appearance.
// Handles simple emojis, FE0F variants, ZWJ sequences, and keycap emojis.
import { memo } from 'react';

const CDN = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/';

function toUrl(emoji: string): string {
  const codes = [...emoji].map(c => c.codePointAt(0)!.toString(16));
  const filtered: string[] = [];
  for (let i = 0; i < codes.length; i++) {
    if (codes[i] === 'fe0f') {
      // Keep FE0F only inside keycap sequences (digit/# + fe0f + 20e3)
      if (i + 1 < codes.length && codes[i + 1] === '20e3') filtered.push(codes[i]);
    } else {
      filtered.push(codes[i]);
    }
  }
  return CDN + filtered.join('-') + '.svg';
}

interface EmojiProps {
  emoji: string;
  size?: number;
  className?: string;
}

export const Emoji = memo(function Emoji({ emoji, size = 32, className = '' }: EmojiProps) {
  return (
    <img
      src={toUrl(emoji)}
      alt={emoji}
      width={size}
      height={size}
      draggable={false}
      className={`inline-block ${className}`}
      style={{ verticalAlign: '-0.1em' }}
      // Fall back to native emoji if CDN image fails
      onError={e => {
        const t = e.currentTarget;
        t.onerror = null;
        t.style.display = 'none';
        const span = document.createElement('span');
        span.textContent = emoji;
        span.style.fontSize = `${size}px`;
        t.parentNode?.insertBefore(span, t);
      }}
    />
  );
});
