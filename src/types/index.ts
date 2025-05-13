export type SquareValue = 'X' | 'O' | null;
export type BoardState = SquareValue[];
export type PlayerSymbol = 'X' | 'O';
export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Unbeatable';

export interface Score {
  player: number;
  ai: number;
  draws: number;
}