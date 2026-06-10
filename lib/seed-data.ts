import type { Lesson, VocabItem } from './types';

export const LESSONS: Lesson[] = [
  { id: 1, title: 'Animals',   titleZh: '动物', emoji: '🐱', position: 1 },
  { id: 2, title: 'Food',      titleZh: '食物', emoji: '🍎', position: 2 },
  { id: 3, title: 'Colors',    titleZh: '颜色', emoji: '🌈', position: 3 },
  { id: 4, title: 'Numbers',   titleZh: '数字', emoji: '🔢', position: 4 },
  { id: 5, title: 'Family',    titleZh: '家人', emoji: '👨‍👩‍👧', position: 5 },
  { id: 6, title: 'Body',      titleZh: '身体', emoji: '🙋', position: 6 },
  { id: 7, title: 'Greetings', titleZh: '问候', emoji: '👋', position: 7 },
  { id: 8, title: 'Weather',   titleZh: '天气', emoji: '☀️', position: 8 },
];

export const VOCAB: VocabItem[] = [
  // ── Animals (12) ──────────────────────────────────────────────────────────
  { id: 1,  hanzi: '猫',   pinyin: 'māo',       english: 'cat',        emoji: '🐱', lessonId: 1 },
  { id: 2,  hanzi: '狗',   pinyin: 'gǒu',       english: 'dog',        emoji: '🐶', lessonId: 1 },
  { id: 3,  hanzi: '鱼',   pinyin: 'yú',        english: 'fish',       emoji: '🐟', lessonId: 1 },
  { id: 4,  hanzi: '鸟',   pinyin: 'niǎo',      english: 'bird',       emoji: '🐦', lessonId: 1 },
  { id: 5,  hanzi: '兔',   pinyin: 'tù',        english: 'rabbit',     emoji: '🐰', lessonId: 1 },
  { id: 6,  hanzi: '马',   pinyin: 'mǎ',        english: 'horse',      emoji: '🐴', lessonId: 1 },
  { id: 7,  hanzi: '大象', pinyin: 'dàxiàng',   english: 'elephant',   emoji: '🐘', lessonId: 1 },
  { id: 8,  hanzi: '猴子', pinyin: 'hóuzi',     english: 'monkey',     emoji: '🐒', lessonId: 1 },
  { id: 9,  hanzi: '熊猫', pinyin: 'xióngmāo',  english: 'panda',      emoji: '🐼', lessonId: 1 },
  { id: 10, hanzi: '鸭子', pinyin: 'yāzi',      english: 'duck',       emoji: '🦆', lessonId: 1 },
  { id: 11, hanzi: '老虎', pinyin: 'lǎohǔ',     english: 'tiger',      emoji: '🐯', lessonId: 1 },
  { id: 12, hanzi: '青蛙', pinyin: 'qīngwā',    english: 'frog',       emoji: '🐸', lessonId: 1 },

  // ── Food (12) ─────────────────────────────────────────────────────────────
  { id: 13, hanzi: '苹果', pinyin: 'píngguǒ',   english: 'apple',      emoji: '🍎', lessonId: 2 },
  { id: 14, hanzi: '香蕉', pinyin: 'xiāngjiāo', english: 'banana',     emoji: '🍌', lessonId: 2 },
  { id: 15, hanzi: '饺子', pinyin: 'jiǎozi',    english: 'dumpling',   emoji: '🥟', lessonId: 2 },
  { id: 16, hanzi: '米饭', pinyin: 'mǐfàn',     english: 'rice',       emoji: '🍚', lessonId: 2 },
  { id: 17, hanzi: '水',   pinyin: 'shuǐ',      english: 'water',      emoji: '💧', lessonId: 2 },
  { id: 18, hanzi: '面条', pinyin: 'miàntiáo',  english: 'noodles',    emoji: '🍜', lessonId: 2 },
  { id: 19, hanzi: '鸡蛋', pinyin: 'jīdàn',     english: 'egg',        emoji: '🥚', lessonId: 2 },
  { id: 20, hanzi: '牛奶', pinyin: 'niúnǎi',    english: 'milk',       emoji: '🥛', lessonId: 2 },
  { id: 21, hanzi: '西瓜', pinyin: 'xīguā',     english: 'watermelon', emoji: '🍉', lessonId: 2 },
  { id: 22, hanzi: '橙子', pinyin: 'chéngzi',   english: 'orange',     emoji: '🍊', lessonId: 2 },
  { id: 23, hanzi: '蛋糕', pinyin: 'dàngāo',    english: 'cake',       emoji: '🎂', lessonId: 2 },
  { id: 24, hanzi: '茶',   pinyin: 'chá',       english: 'tea',        emoji: '🍵', lessonId: 2 },

  // ── Colors (10) ───────────────────────────────────────────────────────────
  { id: 25, hanzi: '红',   pinyin: 'hóng',      english: 'red',        emoji: '🔴', lessonId: 3 },
  { id: 26, hanzi: '蓝',   pinyin: 'lán',       english: 'blue',       emoji: '🔵', lessonId: 3 },
  { id: 27, hanzi: '绿',   pinyin: 'lǜ',        english: 'green',      emoji: '🟢', lessonId: 3 },
  { id: 28, hanzi: '黄',   pinyin: 'huáng',     english: 'yellow',     emoji: '🟡', lessonId: 3 },
  { id: 29, hanzi: '紫',   pinyin: 'zǐ',        english: 'purple',     emoji: '🟣', lessonId: 3 },
  { id: 30, hanzi: '白',   pinyin: 'bái',       english: 'white',      emoji: '⚪', lessonId: 3 },
  { id: 31, hanzi: '黑',   pinyin: 'hēi',       english: 'black',      emoji: '⚫', lessonId: 3 },
  { id: 32, hanzi: '橙',   pinyin: 'chéng',     english: 'orange',     emoji: '🟠', lessonId: 3 },
  { id: 33, hanzi: '粉红', pinyin: 'fěnhóng',   english: 'pink',       emoji: '💗', lessonId: 3 },
  { id: 34, hanzi: '棕',   pinyin: 'zōng',      english: 'brown',      emoji: '🟫', lessonId: 3 },

  // ── Numbers (10) ──────────────────────────────────────────────────────────
  { id: 35, hanzi: '一',   pinyin: 'yī',        english: 'one',        emoji: '1️⃣', lessonId: 4 },
  { id: 36, hanzi: '二',   pinyin: 'èr',        english: 'two',        emoji: '2️⃣', lessonId: 4 },
  { id: 37, hanzi: '三',   pinyin: 'sān',       english: 'three',      emoji: '3️⃣', lessonId: 4 },
  { id: 38, hanzi: '四',   pinyin: 'sì',        english: 'four',       emoji: '4️⃣', lessonId: 4 },
  { id: 39, hanzi: '五',   pinyin: 'wǔ',        english: 'five',       emoji: '5️⃣', lessonId: 4 },
  { id: 40, hanzi: '六',   pinyin: 'liù',       english: 'six',        emoji: '6️⃣', lessonId: 4 },
  { id: 41, hanzi: '七',   pinyin: 'qī',        english: 'seven',      emoji: '7️⃣', lessonId: 4 },
  { id: 42, hanzi: '八',   pinyin: 'bā',        english: 'eight',      emoji: '8️⃣', lessonId: 4 },
  { id: 43, hanzi: '九',   pinyin: 'jiǔ',       english: 'nine',       emoji: '9️⃣', lessonId: 4 },
  { id: 44, hanzi: '十',   pinyin: 'shí',       english: 'ten',        emoji: '🔟', lessonId: 4 },

  // ── Family (10) ───────────────────────────────────────────────────────────
  { id: 45, hanzi: '妈妈', pinyin: 'māma',      english: 'mom',          emoji: '👩', lessonId: 5 },
  { id: 46, hanzi: '爸爸', pinyin: 'bàba',      english: 'dad',          emoji: '👨', lessonId: 5 },
  { id: 47, hanzi: '哥哥', pinyin: 'gēge',      english: 'big brother',  emoji: '👦', lessonId: 5 },
  { id: 48, hanzi: '姐姐', pinyin: 'jiějie',    english: 'big sister',   emoji: '👧', lessonId: 5 },
  { id: 49, hanzi: '宝宝', pinyin: 'bǎobao',    english: 'baby',         emoji: '👶', lessonId: 5 },
  { id: 50, hanzi: '奶奶', pinyin: 'nǎinai',    english: 'grandma',      emoji: '👵', lessonId: 5 },
  { id: 51, hanzi: '爷爷', pinyin: 'yéye',      english: 'grandpa',      emoji: '👴', lessonId: 5 },
  { id: 52, hanzi: '弟弟', pinyin: 'dìdi',      english: 'little brother', emoji: '🧒', lessonId: 5 },
  { id: 53, hanzi: '妹妹', pinyin: 'mèimei',    english: 'little sister', emoji: '🧒', lessonId: 5 },
  { id: 54, hanzi: '老师', pinyin: 'lǎoshī',    english: 'teacher',      emoji: '👩‍🏫', lessonId: 5 },

  // ── Body (10) ─────────────────────────────────────────────────────────────
  { id: 55, hanzi: '头',   pinyin: 'tóu',       english: 'head',       emoji: '🙂', lessonId: 6 },
  { id: 56, hanzi: '眼睛', pinyin: 'yǎnjing',   english: 'eyes',       emoji: '👀', lessonId: 6 },
  { id: 57, hanzi: '鼻子', pinyin: 'bízi',      english: 'nose',       emoji: '👃', lessonId: 6 },
  { id: 58, hanzi: '嘴',   pinyin: 'zuǐ',       english: 'mouth',      emoji: '👄', lessonId: 6 },
  { id: 59, hanzi: '耳朵', pinyin: 'ěrduo',     english: 'ears',       emoji: '👂', lessonId: 6 },
  { id: 60, hanzi: '手',   pinyin: 'shǒu',      english: 'hand',       emoji: '✋', lessonId: 6 },
  { id: 61, hanzi: '脚',   pinyin: 'jiǎo',      english: 'foot',       emoji: '🦶', lessonId: 6 },
  { id: 62, hanzi: '腿',   pinyin: 'tuǐ',       english: 'leg',        emoji: '🦵', lessonId: 6 },
  { id: 63, hanzi: '牙齿', pinyin: 'yáchǐ',     english: 'teeth',      emoji: '🦷', lessonId: 6 },
  { id: 64, hanzi: '头发', pinyin: 'tóufa',     english: 'hair',       emoji: '💇', lessonId: 6 },

  // ── Greetings (9) ─────────────────────────────────────────────────────────
  { id: 65, hanzi: '你好',   pinyin: 'nǐ hǎo',   english: 'hello',         emoji: '👋', lessonId: 7 },
  { id: 66, hanzi: '再见',   pinyin: 'zàijiàn',  english: 'goodbye',       emoji: '🤚', lessonId: 7 },
  { id: 67, hanzi: '谢谢',   pinyin: 'xièxie',   english: 'thank you',     emoji: '🙏', lessonId: 7 },
  { id: 68, hanzi: '对不起', pinyin: 'duìbuqǐ',  english: 'sorry',         emoji: '😔', lessonId: 7 },
  { id: 69, hanzi: '请',     pinyin: 'qǐng',     english: 'please',        emoji: '🌸', lessonId: 7 },
  { id: 70, hanzi: '是',     pinyin: 'shì',      english: 'yes',           emoji: '✅', lessonId: 7 },
  { id: 71, hanzi: '不',     pinyin: 'bù',       english: 'no',            emoji: '❌', lessonId: 7 },
  { id: 72, hanzi: '好的',   pinyin: 'hǎo de',   english: 'OK',            emoji: '👍', lessonId: 7 },
  { id: 73, hanzi: '早',     pinyin: 'zǎo',      english: 'good morning',  emoji: '☀️', lessonId: 7 },

  // ── Weather (8) ───────────────────────────────────────────────────────────
  { id: 74, hanzi: '晴天', pinyin: 'qíngtiān', english: 'sunny',        emoji: '☀️', lessonId: 8 },
  { id: 75, hanzi: '下雨', pinyin: 'xià yǔ',  english: 'raining',      emoji: '🌧️', lessonId: 8 },
  { id: 76, hanzi: '阴天', pinyin: 'yīntiān', english: 'cloudy',       emoji: '☁️', lessonId: 8 },
  { id: 77, hanzi: '下雪', pinyin: 'xià xuě', english: 'snowing',      emoji: '❄️', lessonId: 8 },
  { id: 78, hanzi: '风',   pinyin: 'fēng',    english: 'wind',         emoji: '🌬️', lessonId: 8 },
  { id: 79, hanzi: '热',   pinyin: 'rè',      english: 'hot',          emoji: '🥵', lessonId: 8 },
  { id: 80, hanzi: '冷',   pinyin: 'lěng',    english: 'cold',         emoji: '🥶', lessonId: 8 },
  { id: 81, hanzi: '彩虹', pinyin: 'cǎihóng', english: 'rainbow',      emoji: '🌈', lessonId: 8 },
];
