export interface CrosswordCell {
  letter: string;
  isBlank: boolean;
  number?: number;
  userInput?: string;
}

export interface CrosswordClue {
  number: number;
  clue: string;
  answer: string;
  direction: 'across' | 'down';
  startx: number;
  starty: number;
}

export interface CrosswordData {
  clues: CrosswordClue[];
  grid: CrosswordCell[][];
}
