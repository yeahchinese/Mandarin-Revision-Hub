
export interface VocabularyItem {
  character: string;
  pinyin: string;
  translation: string;
}

export interface SentenceItem {
  character: string;
  pinyin: string;
  translation: string;
}

export type VocabularyCategory = 'Body Parts & Appearance' | 'Food, Drinks & Currency' | 'Illness & Health' | 'Key Verbs' | 'All';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  timeLimit: number;
}
