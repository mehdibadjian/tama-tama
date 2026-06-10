export interface MathLesson {
  id: number;
  title: string;
  titleZh: string;
  pinyin: string;
  emoji: string;
  position: number;
  color: string;
}

export interface TeachSlide {
  type: 'intro' | 'method' | 'example' | 'rhyme';
  hanzi: string;
  pinyin: string;
  english: string;
  body: string;
  beadGroups?: number[];            // e.g. [3, 4] → show ●●● + ●●●●
  rhymeEntries?: { hanzi: string; pinyin: string; eq: string }[];
}

export interface MathProblem {
  id: number;
  a: number;
  op: '+' | '-' | '×' | '÷';
  b: number;
  answer: number;
  rhyme?: string;   // Nine-Nine rhyme for multiplication
  rhymePinyin?: string;
}

export const MATH_LESSONS: MathLesson[] = [
  { id: 1, title: 'Addition',       titleZh: '加法', pinyin: 'jiā fǎ',   emoji: '➕', position: 1, color: '#FF8EAF' },
  { id: 2, title: 'Subtraction',    titleZh: '减法', pinyin: 'jiǎn fǎ',  emoji: '➖', position: 2, color: '#A855F7' },
  { id: 3, title: 'Multiplication', titleZh: '乘法', pinyin: 'chéng fǎ', emoji: '✖️', position: 3, color: '#FB923C' },
  { id: 4, title: 'Division',       titleZh: '除法', pinyin: 'chú fǎ',   emoji: '➗', position: 4, color: '#34D399' },
];

export const TEACH_SLIDES: Record<number, TeachSlide[]> = {
  // ── Addition ────────────────────────────────────────────────────────────────
  1: [
    {
      type: 'intro',
      hanzi: '加法',
      pinyin: 'jiā fǎ',
      english: 'Addition',
      body: 'Adding means putting groups together to make a bigger number!',
    },
    {
      type: 'method',
      hanzi: '心算',
      pinyin: 'xīn suàn',
      english: 'Mental Math',
      body: 'Chinese kids picture a Suanpan (算盘) abacus in their mind. Each bead is one. Slide beads together to add!',
      beadGroups: [5],
    },
    {
      type: 'example',
      hanzi: '三加四',
      pinyin: 'sān jiā sì',
      english: '3 + 4 = ?',
      body: 'Picture 3 beads… then slide 4 more across. Count them all — that\'s 7!',
      beadGroups: [3, 4],
    },
    {
      type: 'example',
      hanzi: '五加五',
      pinyin: 'wǔ jiā wǔ',
      english: '5 + 5 = ?',
      body: 'One whole row on each side — that makes 10! Easy to remember.',
      beadGroups: [5, 5],
    },
  ],

  // ── Subtraction ──────────────────────────────────────────────────────────────
  2: [
    {
      type: 'intro',
      hanzi: '减法',
      pinyin: 'jiǎn fǎ',
      english: 'Subtraction',
      body: 'Subtracting means taking beads away and counting what is left!',
    },
    {
      type: 'method',
      hanzi: '心算',
      pinyin: 'xīn suàn',
      english: 'Mental Abacus',
      body: 'Start with a full row of beads. Slide some away. The ones left are your answer.',
      beadGroups: [7],
    },
    {
      type: 'example',
      hanzi: '七减三',
      pinyin: 'qī jiǎn sān',
      english: '7 − 3 = ?',
      body: 'Picture 7 beads. Slide 3 away. Count what is left — 4!',
      beadGroups: [4, 3],
    },
    {
      type: 'example',
      hanzi: '十减四',
      pinyin: 'shí jiǎn sì',
      english: '10 − 4 = ?',
      body: 'A full row of 10. Slide away 4. Six beads remain!',
      beadGroups: [6, 4],
    },
  ],

  // ── Multiplication ────────────────────────────────────────────────────────────
  3: [
    {
      type: 'intro',
      hanzi: '乘法',
      pinyin: 'chéng fǎ',
      english: 'Multiplication',
      body: 'Multiplying is adding equal groups super fast — like a shortcut!',
    },
    {
      type: 'method',
      hanzi: '九九歌',
      pinyin: 'jiǔ jiǔ gē',
      english: 'The Nine-Nine Song',
      body: 'Chinese kids chant a rhythm called the Nine-Nine Song. Each line is one multiplication fact. Say it fast enough and it becomes instant memory!',
    },
    {
      type: 'rhyme',
      hanzi: '九九乘法表',
      pinyin: 'jiǔ jiǔ chéng fǎ biǎo',
      english: 'Tap each line to hear it!',
      body: 'Chant along — one line at a time:',
      rhymeEntries: [
        { hanzi: '二二得四',   pinyin: 'èr èr dé sì',      eq: '2×2=4'  },
        { hanzi: '二三得六',   pinyin: 'èr sān dé liù',     eq: '2×3=6'  },
        { hanzi: '二四得八',   pinyin: 'èr sì dé bā',       eq: '2×4=8'  },
        { hanzi: '二五一十',   pinyin: 'èr wǔ yī shí',      eq: '2×5=10' },
        { hanzi: '三三得九',   pinyin: 'sān sān dé jiǔ',    eq: '3×3=9'  },
        { hanzi: '三四十二',   pinyin: 'sān sì shí\'èr',    eq: '3×4=12' },
        { hanzi: '三五十五',   pinyin: 'sān wǔ shíwǔ',      eq: '3×5=15' },
        { hanzi: '四四十六',   pinyin: 'sì sì shíliù',      eq: '4×4=16' },
        { hanzi: '四五二十',   pinyin: 'sì wǔ èrshí',       eq: '4×5=20' },
        { hanzi: '五五二十五', pinyin: 'wǔ wǔ èrshíwǔ',     eq: '5×5=25' },
      ],
    },
    {
      type: 'example',
      hanzi: '三乘四',
      pinyin: 'sān chéng sì',
      english: '3 × 4 = ?',
      body: '"三四十二" — chant it! 3 groups of 4 beads = 12.',
      beadGroups: [4, 4, 4],
    },
  ],

  // ── Division ─────────────────────────────────────────────────────────────────
  4: [
    {
      type: 'intro',
      hanzi: '除法',
      pinyin: 'chú fǎ',
      english: 'Division',
      body: 'Dividing means sharing beads into equal groups and counting how many in each!',
    },
    {
      type: 'method',
      hanzi: '九九歌倒用',
      pinyin: 'jiǔ jiǔ gē dào yòng',
      english: 'Nine-Nine Song — backwards!',
      body: 'Chinese kids use their multiplication song in reverse. 12 ÷ 3 = ? Think: "what × 3 = 12?" → 三四十二 → 4!',
    },
    {
      type: 'example',
      hanzi: '十二除以三',
      pinyin: 'shí\'èr chú yǐ sān',
      english: '12 ÷ 3 = ?',
      body: 'Share 12 beads into 3 equal groups. Each group gets 4!',
      beadGroups: [4, 4, 4],
    },
    {
      type: 'example',
      hanzi: '二十除以四',
      pinyin: 'èrshí chú yǐ sì',
      english: '20 ÷ 4 = ?',
      body: '"四五二十" — 4 groups of 5. So 20 ÷ 4 = 5!',
      beadGroups: [5, 5, 5, 5],
    },
  ],
};

// ── Quiz problems ────────────────────────────────────────────────────────────────

function choices(answer: number, op: '+' | '-' | '×' | '÷'): number[] {
  const offsets = op === '×' || op === '÷' ? [1, 2, 3] : [1, 2, 3];
  const wrong = new Set<number>();
  for (const o of offsets) {
    if (answer - o > 0) wrong.add(answer - o);
    wrong.add(answer + o);
    if (wrong.size >= 3) break;
  }
  // Fill if needed
  let i = 4;
  while (wrong.size < 3) { wrong.add(answer + i++); }
  return [...wrong].slice(0, 3);
}

function prob(
  id: number, a: number, op: '+' | '-' | '×' | '÷', b: number,
  rhyme?: string, rhymePinyin?: string
): MathProblem {
  const answer =
    op === '+' ? a + b :
    op === '-' ? a - b :
    op === '×' ? a * b :
    a / b;
  return { id, a, op, b, answer, rhyme, rhymePinyin };
}

export const MATH_PROBLEMS: Record<number, MathProblem[]> = {
  1: [
    prob(1,  1, '+', 2), prob(2,  2, '+', 3), prob(3,  3, '+', 3),
    prob(4,  1, '+', 4), prob(5,  2, '+', 5), prob(6,  3, '+', 4),
    prob(7,  4, '+', 4), prob(8,  3, '+', 6), prob(9,  4, '+', 5),
    prob(10, 5, '+', 5),
  ],
  2: [
    prob(1,  5, '-', 2), prob(2,  7, '-', 3), prob(3,  6, '-', 2),
    prob(4,  8, '-', 5), prob(5, 10, '-', 3), prob(6,  9, '-', 4),
    prob(7,  7, '-', 4), prob(8,  8, '-', 3), prob(9, 10, '-', 6),
    prob(10, 9, '-', 5),
  ],
  3: [
    prob(1,  2, '×', 2, '二二得四',   'èr èr dé sì'),
    prob(2,  2, '×', 3, '二三得六',   'èr sān dé liù'),
    prob(3,  2, '×', 4, '二四得八',   'èr sì dé bā'),
    prob(4,  2, '×', 5, '二五一十',   'èr wǔ yī shí'),
    prob(5,  3, '×', 3, '三三得九',   'sān sān dé jiǔ'),
    prob(6,  3, '×', 4, '三四十二',   'sān sì shí\'èr'),
    prob(7,  3, '×', 5, '三五十五',   'sān wǔ shíwǔ'),
    prob(8,  4, '×', 4, '四四十六',   'sì sì shíliù'),
    prob(9,  4, '×', 5, '四五二十',   'sì wǔ èrshí'),
    prob(10, 5, '×', 5, '五五二十五', 'wǔ wǔ èrshíwǔ'),
  ],
  4: [
    prob(1,   4, '÷', 2), prob(2,  6, '÷', 2), prob(3,  8, '÷', 2),
    prob(4,  10, '÷', 2), prob(5,  9, '÷', 3), prob(6, 12, '÷', 3),
    prob(7,  15, '÷', 3), prob(8, 16, '÷', 4), prob(9, 20, '÷', 4),
    prob(10, 25, '÷', 5),
  ],
};
