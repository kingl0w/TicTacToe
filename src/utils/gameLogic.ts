import type { BoardState, SquareValue } from '../types';

export const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], 
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]             
];

export function calculateWinner(squares: BoardState): SquareValue | 'Draw' | null {
  for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
    const [a, b, c] = WINNING_COMBINATIONS[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  if (squares.every(square => square !== null)) {
    return 'Draw';
  }
  return null;
}

export function getEmptySquares(board: BoardState): number[] {
  return board.reduce((acc, val, idx) => (val === null ? [...acc, idx] : acc), [] as number[]);
}

export function isBoardFull(board: BoardState): boolean {
  return board.every(square => square !== null);
}