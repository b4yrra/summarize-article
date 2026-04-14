export interface Quiz {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

export interface Article {
  id: number;
  title: string;
  content: string;
  summary: string;
  quizzes: Quiz[];
}

export type AppView = "form" | "article" | "quiz" | "confirm" | "result";
