'use client';
import { motion } from 'framer-motion';

interface Props {
  size?: number;
  bounce?: boolean;
  className?: string;
  /** Singapore school uniform: white collar + red tie, for the P1 School hub. */
  uniform?: boolean;
}

export function TamaCharacter({ size = 200, bounce = false, className = '', uniform = false }: Props) {
  return (
    <motion.div
      className={className}
      style={{ width: size, height: size }}
      animate={bounce ? { y: [0, -14, 0] } : {}}
      transition={bounce ? { repeat: Infinity, duration: 2.2, ease: 'easeInOut' } : {}}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
        {/* Sky background with squircle shape */}
        <rect width="512" height="512" rx="120" fill="#7DD3FC" />

        {/* Purple sparkles */}
        <g fill="#A855F7">
          <path d="M 120 150 Q 140 150 140 130 Q 140 150 160 150 Q 140 150 140 170 Q 140 150 120 150 Z" />
          <path d="M 380 120 Q 395 120 395 105 Q 395 120 410 120 Q 395 120 395 135 Q 395 120 380 120 Z" />
          <path d="M 340 200 Q 350 200 350 190 Q 350 200 360 200 Q 350 200 350 210 Q 350 200 340 200 Z" />
        </g>

        {/* Pink pet body */}
        <circle cx="256" cy="270" r="140" fill="#FF8EAF" stroke="#A855F7" strokeWidth="12" />

        {/* Eyes */}
        <circle cx="206" cy="240" r="14" fill="#334155" />
        <circle cx="306" cy="240" r="14" fill="#334155" />
        {/* Eye shine */}
        <circle cx="212" cy="234" r="5" fill="white" />
        <circle cx="312" cy="234" r="5" fill="white" />

        {/* Blush */}
        <ellipse cx="180" cy="258" rx="14" ry="9" fill="#F43F5E" opacity="0.35" />
        <ellipse cx="332" cy="258" rx="14" ry="9" fill="#F43F5E" opacity="0.35" />

        {/* Smile */}
        <path d="M 238 258 Q 256 278 274 258" fill="none" stroke="#334155" strokeWidth="8" strokeLinecap="round" />

        {/* White eggshell at bottom */}
        <path
          d="M 90 320 L 140 270 L 190 330 L 256 260 L 322 330 L 372 270 L 422 320 L 410 400 Q 256 460 102 400 Z"
          fill="#FAFAFA"
          stroke="#A855F7"
          strokeWidth="12"
          strokeLinejoin="round"
        />

        {/* School uniform: white collar and red tie */}
        {uniform && (
          <g>
            <path d="M 216 336 L 256 366 L 296 336 L 296 318 L 216 318 Z" fill="#FFFFFF" stroke="#334155" strokeWidth="6" strokeLinejoin="round" />
            <path d="M 256 348 L 244 366 L 256 412 L 268 366 Z" fill="#EF4444" stroke="#334155" strokeWidth="5" strokeLinejoin="round" />
            <path d="M 246 342 L 266 342 L 262 352 L 250 352 Z" fill="#B91C1C" />
          </g>
        )}
      </svg>
    </motion.div>
  );
}
