import type { P1ActivityTrack } from './p1-curriculum-types';

// Seed curriculum for Singapore MOE Primary 1 readiness.
//   English  — STELLAR high-frequency sight words + phonics blends/digraphs
//   Math     — CPA number bonds (part-part-whole) and Singapore canteen money
//   Chinese  — Hanyu Pinyin tones + school-topic vocabulary
//   PAL      — People of Other Cultures / Social & Emotional: school routines
// No Science track: the MOE Primary Science syllabus begins at P3.

export const P1_CURRICULUM_DATA: P1ActivityTrack[] = [
  // ═══════════════════════ ENGLISH TRACK ═══════════════════════
  {
    id: 'sg_p1_english',
    subject: 'english',
    title: 'English Explorer',
    icon: '📘',
    description: 'STELLAR sight words, phonics blends, and sentence building',
    accentColor: '#3B82F6',
    questions: [
      {
        id: 'eng_01',
        type: 'sight_word_audio',
        prompt: 'Listen to the word and tap the matching balloon!',
        audioPromptText: 'because',
        targetVisual: '🎈',
        payload: {
          multipleChoice: {
            options: ['became', 'because', 'before', 'belong'],
            correctIndex: 1,
            explanation: '"because" is a high-frequency STELLAR connective word!',
          },
        },
      },
      {
        id: 'eng_02',
        type: 'phonics_blend',
        prompt: 'Choose the blend that starts this word:',
        audioPromptText: 'Ship. Which blend starts ship?',
        targetVisual: '🚢',
        payload: {
          multipleChoice: {
            options: ['ch', 'sh', 'th', 'wh'],
            correctIndex: 1,
            explanation: 'SH makes the /ʃ/ sound as in Ship!',
          },
        },
      },
      {
        id: 'eng_03',
        type: 'sight_word_audio',
        prompt: 'Find the plural form of "child":',
        audioPromptText: 'One child, many...',
        targetVisual: '🧒',
        payload: {
          multipleChoice: {
            options: ['childs', 'children', 'childrens', 'childes'],
            correctIndex: 1,
            explanation: 'Child is irregular! One child, two children.',
          },
        },
      },
      {
        id: 'eng_04',
        type: 'sight_word_audio',
        prompt: 'Which sentence has the correct punctuation?',
        audioPromptText: 'Which sentence has the correct punctuation?',
        payload: {
          multipleChoice: {
            options: [
              'i go to school on Monday',
              'I go to school on Monday.',
              'I go to school on monday?',
              'i go to School on monday.',
            ],
            correctIndex: 1,
            explanation: 'Capital letter for "I" and "Monday", plus a full stop at the end.',
          },
        },
      },
    ],
  },

  // ═════════════════════ MATHEMATICS TRACK ═════════════════════
  {
    id: 'sg_p1_math',
    subject: 'mathematics',
    title: 'Math Champion',
    icon: '🔢',
    description: 'Number bonds, addition and subtraction within 20, and Singapore coins',
    accentColor: '#10B981',
    questions: [
      {
        id: 'math_nb_01',
        type: 'number_bond',
        prompt: 'Complete the Number Bond for 8:',
        audioPromptText: 'The whole is eight. One part is five. What is the missing part?',
        payload: {
          numberBond: {
            whole: 8,
            partA: 5,
            partB: null, // the slot to solve
            options: [2, 3, 4, 5],
            correctAnswer: 3,
          },
        },
      },
      {
        id: 'math_nb_02',
        type: 'number_bond',
        prompt: 'Complete the Number Bond for 10:',
        audioPromptText: 'The whole is ten. One part is four. What makes ten with four?',
        payload: {
          numberBond: {
            whole: 10,
            partA: null, // the slot to solve
            partB: 4,
            options: [5, 6, 7, 8],
            correctAnswer: 6,
          },
        },
      },
      {
        id: 'math_money_01',
        type: 'singapore_money',
        prompt: 'Recess time! Pay 80¢ for a bowl of noodle soup:',
        audioPromptText: 'Tap coins to make eighty cents.',
        targetVisual: '🍜',
        payload: {
          moneyCanteen: {
            itemName: 'Fishball Noodles',
            itemPriceCents: 80,
            availableCoins: [5, 10, 20, 50, 100],
          },
        },
      },
      {
        id: 'math_money_02',
        type: 'singapore_money',
        prompt: 'Buy a warm cup of Milo for $1.20:',
        audioPromptText: 'Tap coins to pay one dollar and twenty cents.',
        targetVisual: '☕',
        payload: {
          moneyCanteen: {
            itemName: 'Hot Milo',
            itemPriceCents: 120,
            availableCoins: [10, 20, 50, 100],
          },
        },
      },
    ],
  },

  // ═══════════════ CHINESE / MOTHER TONGUE TRACK ═══════════════
  {
    id: 'sg_p1_chinese',
    subject: 'chinese',
    title: '华文小达人 (Mother Tongue)',
    titleChinese: '华文小达人',
    icon: '🇨🇳',
    description: 'Hanyu Pinyin tones, foundational strokes, and school words',
    accentColor: '#EF4444',
    questions: [
      {
        id: 'chi_01',
        type: 'pinyin_tone_match',
        prompt: 'Listen and choose the matching tone for "mā" (Mother / 妈):',
        audioPromptText: '妈',
        audioLang: 'zh-CN',
        payload: {
          multipleChoice: {
            options: ['mā (第一声)', 'má (第二声)', 'mǎ (第三声)', 'mà (第四声)'],
            correctIndex: 0,
            explanation: '第一声 (first tone) is high and flat: mā!',
          },
        },
      },
      {
        id: 'chi_02',
        type: 'chinese_char_match',
        prompt: 'Which word means "Teacher" at school?',
        audioPromptText: '老师',
        audioLang: 'zh-CN',
        targetVisual: '👩‍🏫',
        payload: {
          multipleChoice: {
            options: ['同学 (classmate)', '老师 (teacher)', '学校 (school)', '朋友 (friend)'],
            correctIndex: 1,
            explanation: '老师 (lǎoshī) is teacher!',
          },
        },
      },
      {
        id: 'chi_03',
        type: 'chinese_char_match',
        prompt: 'Tap the character for "cat" (māo):',
        audioPromptText: '猫',
        audioLang: 'zh-CN',
        targetVisual: '🐱',
        payload: {
          multipleChoice: {
            options: ['狗', '鸟', '猫', '鱼'],
            correctIndex: 2,
            explanation: '猫 (māo) is cat!',
          },
        },
      },
    ],
  },

  // ══════════════════ PAL & SCHOOL LIFE TRACK ══════════════════
  {
    id: 'sg_p1_pal',
    subject: 'pal_life',
    title: 'P1 School Life & PAL',
    icon: '🎒',
    description: 'Pack your school bag, recess etiquette, and healthy habits',
    accentColor: '#8B5CF6',
    questions: [
      {
        id: 'pal_01',
        type: 'school_bag_packer',
        prompt: "Today's timetable is English and Math. Pick the 4 things to pack:",
        audioPromptText: "Today you have English and Math. Pack four things for school.",
        payload: {
          bagPacker: {
            targetSubjects: ['English', 'Math'],
            validItems: ['English Workbook', 'Math Textbook', 'Pencil Case', 'Water Bottle'],
            decoyItems: ['Video Game Console', 'Pajamas', 'Giant Pillow'],
          },
        },
      },
      {
        id: 'pal_02',
        type: 'sight_word_audio',
        prompt: 'What should you do after finishing your food at recess?',
        audioPromptText: 'What do you do with your tray at recess?',
        targetVisual: '🍽️',
        payload: {
          multipleChoice: {
            options: [
              'Leave it on the table',
              'Return the bowl and tray to the tray return rack',
              'Give it to another friend',
              'Put it on the floor',
            ],
            correctIndex: 1,
            explanation: 'In Singapore primary schools we always return our trays to keep tables clean!',
          },
        },
      },
    ],
  },
];

export function getP1Track(trackId: string): P1ActivityTrack | undefined {
  return P1_CURRICULUM_DATA.find(t => t.id === trackId);
}
