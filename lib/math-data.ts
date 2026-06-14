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

// 九九 (nine-nine) song lines, keyed by "smaller×larger" so 5×2 reuses 2×5.
// Used to attach a chant hint to generated multiplication problems.
const NINE_NINE: Record<string, { rhyme: string; pinyin: string }> = {
  '2x2': { rhyme: '二二得四',   pinyin: 'èr èr dé sì' },
  '2x3': { rhyme: '二三得六',   pinyin: 'èr sān dé liù' },
  '2x4': { rhyme: '二四得八',   pinyin: 'èr sì dé bā' },
  '2x5': { rhyme: '二五一十',   pinyin: 'èr wǔ yī shí' },
  '2x6': { rhyme: '二六十二',   pinyin: "èr liù shí'èr" },
  '2x7': { rhyme: '二七十四',   pinyin: 'èr qī shísì' },
  '2x8': { rhyme: '二八十六',   pinyin: 'èr bā shíliù' },
  '2x9': { rhyme: '二九十八',   pinyin: 'èr jiǔ shíbā' },
  '3x3': { rhyme: '三三得九',   pinyin: 'sān sān dé jiǔ' },
  '3x4': { rhyme: '三四十二',   pinyin: "sān sì shí'èr" },
  '3x5': { rhyme: '三五十五',   pinyin: 'sān wǔ shíwǔ' },
  '3x6': { rhyme: '三六十八',   pinyin: 'sān liù shíbā' },
  '3x7': { rhyme: '三七二十一', pinyin: 'sān qī èrshíyī' },
  '3x8': { rhyme: '三八二十四', pinyin: 'sān bā èrshísì' },
  '3x9': { rhyme: '三九二十七', pinyin: 'sān jiǔ èrshíqī' },
  '4x4': { rhyme: '四四十六',   pinyin: 'sì sì shíliù' },
  '4x5': { rhyme: '四五二十',   pinyin: 'sì wǔ èrshí' },
  '4x6': { rhyme: '四六二十四', pinyin: 'sì liù èrshísì' },
  '4x7': { rhyme: '四七二十八', pinyin: 'sì qī èrshíbā' },
  '4x8': { rhyme: '四八三十二', pinyin: "sì bā sānshí'èr" },
  '4x9': { rhyme: '四九三十六', pinyin: 'sì jiǔ sānshíliù' },
  '5x5': { rhyme: '五五二十五', pinyin: 'wǔ wǔ èrshíwǔ' },
  '5x6': { rhyme: '五六三十',   pinyin: 'wǔ liù sānshí' },
  '5x7': { rhyme: '五七三十五', pinyin: 'wǔ qī sānshíwǔ' },
  '5x8': { rhyme: '五八四十',   pinyin: 'wǔ bā sìshí' },
  '5x9': { rhyme: '五九四十五', pinyin: 'wǔ jiǔ sìshíwǔ' },
  '6x6': { rhyme: '六六三十六', pinyin: 'liù liù sānshíliù' },
  '6x7': { rhyme: '六七四十二', pinyin: "liù qī sìshí'èr" },
  '6x8': { rhyme: '六八四十八', pinyin: 'liù bā sìshíbā' },
  '6x9': { rhyme: '六九五十四', pinyin: 'liù jiǔ wǔshísì' },
  '7x7': { rhyme: '七七四十九', pinyin: 'qī qī sìshíjiǔ' },
  '7x8': { rhyme: '七八五十六', pinyin: 'qī bā wǔshíliù' },
  '7x9': { rhyme: '七九六十三', pinyin: 'qī jiǔ liùshísān' },
  '8x8': { rhyme: '八八六十四', pinyin: 'bā bā liùshísì' },
  '8x9': { rhyme: '八九七十二', pinyin: "bā jiǔ qīshí'èr" },
  '9x9': { rhyme: '九九八十一', pinyin: 'jiǔ jiǔ bāshíyī' },
};

// ── Difficulty settings (parent-configurable, tuned for a 6-year-old) ─────────────

export interface MathSettings {
  addMax: number;   // addition: each number is 1..addMax
  subMax: number;   // subtraction: the starting number is 2..subMax
  mulMax: number;   // multiplication: times tables up to this number
  divMax: number;   // division: divisor and quotient up to this number
  count:  number;   // how many questions per quiz
}

export const DEFAULT_MATH_SETTINGS: MathSettings = {
  addMax: 10,
  subMax: 10,
  mulMax: 5,
  divMax: 5,
  count:  8,
};

export const MATH_SETTINGS_KEY = 'tama-tama-math-settings';

export function loadMathSettings(): MathSettings {
  if (typeof window === 'undefined') return DEFAULT_MATH_SETTINGS;
  try {
    const raw = localStorage.getItem(MATH_SETTINGS_KEY);
    if (raw) return { ...DEFAULT_MATH_SETTINGS, ...JSON.parse(raw) };
  } catch { /* empty */ }
  return DEFAULT_MATH_SETTINGS;
}

export function saveMathSettings(s: MathSettings): void {
  try { localStorage.setItem(MATH_SETTINGS_KEY, JSON.stringify(s)); } catch { /* empty */ }
}

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Builds a fresh set of quiz problems for a lesson, sized and bounded by the
// parent's difficulty settings. Avoids duplicate questions within a quiz.
export function generateProblems(lessonId: number, s: MathSettings = DEFAULT_MATH_SETTINGS): MathProblem[] {
  const want = Math.max(1, Math.min(20, Math.round(s.count)));
  const seen = new Set<string>();
  const out: MathProblem[] = [];
  let guard = 0;

  while (out.length < want && guard < want * 60) {
    guard++;
    let a: number, b: number;
    let op: MathProblem['op'];
    let rhyme: string | undefined;
    let rhymePinyin: string | undefined;

    if (lessonId === 1) {
      op = '+';
      a = rand(1, Math.max(1, s.addMax));
      b = rand(1, Math.max(1, s.addMax));
    } else if (lessonId === 2) {
      op = '-';
      a = rand(2, Math.max(2, s.subMax));
      b = rand(1, a);                       // never goes below zero
    } else if (lessonId === 3) {
      op = '×';
      const lo = Math.min(2, Math.max(1, s.mulMax));
      a = rand(lo, Math.max(lo, s.mulMax));
      b = rand(lo, Math.max(lo, s.mulMax));
      const hit = NINE_NINE[`${Math.min(a, b)}x${Math.max(a, b)}`];
      if (hit) { rhyme = hit.rhyme; rhymePinyin = hit.pinyin; }
    } else {
      op = '÷';
      const d = rand(2, Math.max(2, s.divMax));   // divisor
      const q = rand(1, Math.max(1, s.divMax));   // quotient
      a = d * q;
      b = d;
    }

    const key = `${a}${op}${b}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(prob(out.length + 1, a, op, b, rhyme, rhymePinyin));
  }

  return out;
}
