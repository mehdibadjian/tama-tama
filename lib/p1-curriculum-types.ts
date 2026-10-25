// Singapore MOE Primary 1 (P1) Readiness Hub — domain models.
//
// Scope note: the four tracks below are the ones a child meets entering P1 in
// Singapore. Science is intentionally absent — MOE Primary Science starts in P3.

export type P1Subject = 'english' | 'mathematics' | 'chinese' | 'pal_life';

export type P1ActivityType =
  | 'number_bond'        // Singapore CPA part-part-whole tree
  | 'singapore_money'    // Tap-to-pay SG coins (5c, 10c, 20c, 50c, $1, $2)
  | 'sight_word_audio'   // Audio playback + balloon/card selection
  | 'phonics_blend'      // Missing digraph/blend (e.g. sh, ch, th)
  | 'pinyin_tone_match'  // Spoken syllable to tone match (mā, má, mǎ, mà)
  | 'chinese_char_match' // Tap / drag the character for a picture
  | 'school_bag_packer'; // Timetable-based bag packing

/** Language the TTS engine should use when reading a prompt aloud. */
export type P1AudioLang = 'en-SG' | 'zh-CN';

export interface NumberBondPayload {
  whole: number | null;   // null = the '?' slot the child must solve
  partA: number | null;
  partB: number | null;
  options: number[];
  correctAnswer: number;
}

export interface MoneyCanteenPayload {
  itemName: string;
  itemPriceCents: number;              // e.g. 120 for a $1.20 Milo
  availableCoins: number[];            // denominations in cents: 5, 10, 20, 50, 100, 200
}

export interface MultipleChoicePayload {
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface BagPackerPayload {
  targetSubjects: string[]; // e.g. ['English', 'Math']
  validItems: string[];     // ['English Workbook', 'Pencil Case', ...]
  decoyItems: string[];     // ['Video Game Console', 'Giant Pillow', ...]
}

export interface P1QuestionPayload {
  numberBond?: NumberBondPayload;
  moneyCanteen?: MoneyCanteenPayload;
  multipleChoice?: MultipleChoicePayload;
  bagPacker?: BagPackerPayload;
}

export interface P1QuestionItem {
  id: string;
  type: P1ActivityType;
  prompt: string;
  audioPromptText?: string;
  /** Defaults to en-SG; the Chinese track sets zh-CN. */
  audioLang?: P1AudioLang;
  targetVisual?: string;
  payload: P1QuestionPayload;
}

export interface P1ActivityTrack {
  id: string;
  subject: P1Subject;
  title: string;
  titleChinese?: string;
  icon: string;
  description: string;
  accentColor: string;
  questions: P1QuestionItem[];
}

export interface P1TrackRecord {
  count: number;
  starsEarned: number;
  lastPlayedTimestamp: number;
}

export interface P1UserProgress {
  completedActivityIds: Record<string, P1TrackRecord>;
  dailyStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
}

/** The pet's core state loop, which P1 rewards feed into. */
export interface PetState {
  wisdom: number;    // 0-100
  happiness: number; // 0-100
  energy: number;    // 0-100, learning uses a little
  starCoins: number; // in-game currency
  speech: string;    // what the pet says next
}
