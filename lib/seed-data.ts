import type { Lesson, VocabItem } from './types';

export const LESSONS: Lesson[] = [
  { id: 1, title: 'Animals',  titleZh: '动物', emoji: '🐱', position: 1 },
  { id: 2, title: 'Food',     titleZh: '食物', emoji: '🍎', position: 2 },
  { id: 3, title: 'Colors',   titleZh: '颜色', emoji: '🌈', position: 3 },
  { id: 4, title: 'Numbers',  titleZh: '数字', emoji: '🔢', position: 4 },
  { id: 5, title: 'Family',   titleZh: '家人', emoji: '👨‍👩‍👧', position: 5 },
];

export const VOCAB: VocabItem[] = [
  // Animals
  { id: 1,  hanzi: '猫',   pinyin: 'māo',       english: 'cat',        emoji: '🐱', lessonId: 1 },
  { id: 2,  hanzi: '狗',   pinyin: 'gǒu',       english: 'dog',        emoji: '🐶', lessonId: 1 },
  { id: 3,  hanzi: '鱼',   pinyin: 'yú',        english: 'fish',       emoji: '🐟', lessonId: 1 },
  { id: 4,  hanzi: '鸟',   pinyin: 'niǎo',      english: 'bird',       emoji: '🐦', lessonId: 1 },
  { id: 5,  hanzi: '兔',   pinyin: 'tù',        english: 'rabbit',     emoji: '🐰', lessonId: 1 },
  // Food
  { id: 6,  hanzi: '苹果', pinyin: 'píngguǒ',  english: 'apple',      emoji: '🍎', lessonId: 2 },
  { id: 7,  hanzi: '香蕉', pinyin: 'xiāngjiāo', english: 'banana',     emoji: '🍌', lessonId: 2 },
  { id: 8,  hanzi: '饺子', pinyin: 'jiǎozi',   english: 'dumpling',   emoji: '🥟', lessonId: 2 },
  { id: 9,  hanzi: '米饭', pinyin: 'mǐfàn',    english: 'rice',       emoji: '🍚', lessonId: 2 },
  { id: 10, hanzi: '水',   pinyin: 'shuǐ',      english: 'water',      emoji: '💧', lessonId: 2 },
  // Colors
  { id: 11, hanzi: '红',   pinyin: 'hóng',      english: 'red',        emoji: '🔴', lessonId: 3 },
  { id: 12, hanzi: '蓝',   pinyin: 'lán',       english: 'blue',       emoji: '🔵', lessonId: 3 },
  { id: 13, hanzi: '绿',   pinyin: 'lǜ',        english: 'green',      emoji: '🟢', lessonId: 3 },
  { id: 14, hanzi: '黄',   pinyin: 'huáng',     english: 'yellow',     emoji: '🟡', lessonId: 3 },
  { id: 15, hanzi: '紫',   pinyin: 'zǐ',        english: 'purple',     emoji: '🟣', lessonId: 3 },
  // Numbers
  { id: 16, hanzi: '一',   pinyin: 'yī',        english: 'one',        emoji: '1️⃣', lessonId: 4 },
  { id: 17, hanzi: '二',   pinyin: 'èr',        english: 'two',        emoji: '2️⃣', lessonId: 4 },
  { id: 18, hanzi: '三',   pinyin: 'sān',       english: 'three',      emoji: '3️⃣', lessonId: 4 },
  { id: 19, hanzi: '四',   pinyin: 'sì',        english: 'four',       emoji: '4️⃣', lessonId: 4 },
  { id: 20, hanzi: '五',   pinyin: 'wǔ',        english: 'five',       emoji: '5️⃣', lessonId: 4 },
  // Family
  { id: 21, hanzi: '妈妈', pinyin: 'māma',      english: 'mom',        emoji: '👩', lessonId: 5 },
  { id: 22, hanzi: '爸爸', pinyin: 'bàba',      english: 'dad',        emoji: '👨', lessonId: 5 },
  { id: 23, hanzi: '哥哥', pinyin: 'gēge',      english: 'big brother', emoji: '👦', lessonId: 5 },
  { id: 24, hanzi: '姐姐', pinyin: 'jiějie',    english: 'big sister', emoji: '👧', lessonId: 5 },
  { id: 25, hanzi: '宝宝', pinyin: 'bǎobao',    english: 'baby',       emoji: '👶', lessonId: 5 },
];
