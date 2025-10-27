export type Difficulty = 'łatwy' | 'średni' | 'trudny' | 'mieszany';

export interface Question {
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
}

// Typ dla obiektu bazy danych pytań
export type QuestionDatabase = {
  [key in 'łatwy' | 'średni' | 'trudny']: Question[];
};
