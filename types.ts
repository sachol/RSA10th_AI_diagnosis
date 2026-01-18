
export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface Question {
  id: number;
  category: 'AI_BASICS' | 'CHATBOT' | 'AUTOMATION' | 'ETHICS' | 'STRATEGY';
  difficulty: Difficulty;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizResult {
  score: number;
  total: number;
  answers: {
    questionId: number;
    selectedOption: number;
    isCorrect: boolean;
  }[];
  userName: string;
}

export type AppState = 'START' | 'QUIZ' | 'RESULTS';
