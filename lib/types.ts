export interface Lesson {
  id: number;
  title: string;
  titleZh: string;
  emoji: string;
  position: number;
}

export interface VocabItem {
  id: number;
  hanzi: string;
  pinyin: string;
  english: string;
  emoji: string;
  lessonId: number;
}

export interface LessonProgress {
  lessonId: number;
  completed: boolean;
  stars: number;
}
