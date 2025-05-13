import type { BoardState, PlayerSymbol } from '../types';
import { calculateWinner, getEmptySquares } from './gameLogic';

//minmax algo for unbeatable ai
function minimax(newBoard: BoardState, player: PlayerSymbol, aiSymbol: PlayerSymbol, humanSymbol: PlayerSymbol): { score: number, index?: number } {
  const availableSpots = getEmptySquares(newBoard);
  const winner = calculateWinner(newBoard);

  if (winner === humanSymbol) return { score: -10 };
  if (winner === aiSymbol) return { score: 10 };
  if (winner === 'Draw' || availableSpots.length === 0) return { score: 0 };

  const moves: { index: number, score: number }[] = [];

  for (let i = 0; i < availableSpots.length; i++) {
    const move: { index: number, score: number } = { index: availableSpots[i], score: 0 };
    newBoard[availableSpots[i]] = player;

    if (player === aiSymbol) {
      const result = minimax(newBoard, humanSymbol, aiSymbol, humanSymbol);
      move.score = result.score;
    } else {
      const result = minimax(newBoard, aiSymbol, aiSymbol, humanSymbol);
      move.score = result.score;
    }

    newBoard[availableSpots[i]] = null; //undo move
    moves.push(move);
  }

  let bestMove: number | undefined;
  if (player === aiSymbol) {
    let bestScore = -Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  //bestMove here is the index in the 'moves' array, not on the board index.
  //need to return the move with its original board index.
  if (bestMove !== undefined) {
    return moves[bestMove];
  }
  //should not happen if availableSpots > 0
  return { score: 0 }; 
}


//AI move logic
export function getAIMove(
  board: BoardState,
  aiSymbol: PlayerSymbol,
  humanSymbol: PlayerSymbol,
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Unbeatable'
): number {
  const emptySquares = getEmptySquares(board);
  if (emptySquares.length === 0) return -1; //shouldn't happen

  //easy ai logic - basically just random moves
  if (difficulty === 'Easy') {
    return emptySquares[Math.floor(Math.random() * emptySquares.length)];
  }

  //medium ai logic -win if possible, block if possible, otherwise its just random moves
  if (difficulty === 'Medium') {
    //checks for a winning move for the ai player
    for (const index of emptySquares) {
      const tempBoard = [...board];
      tempBoard[index] = aiSymbol;
      if (calculateWinner(tempBoard) === aiSymbol) return index;
    }
    //checks for blocking move against player
    for (const index of emptySquares) {
      const tempBoard = [...board];
      tempBoard[index] = humanSymbol;
      if (calculateWinner(tempBoard) === humanSymbol) return index;
    }
    //else random bs
    return emptySquares[Math.floor(Math.random() * emptySquares.length)];
  }

  //hard ai logic -  win, block, center, corner, side (heuristic)
  if (difficulty === 'Hard') {
     //1. win if possible
    for (const index of emptySquares) {
      const tempBoard = [...board];
      tempBoard[index] = aiSymbol;
      if (calculateWinner(tempBoard) === aiSymbol) return index;
    }
    //2. block opponent win
    for (const index of emptySquares) {
      const tempBoard = [...board];
      tempBoard[index] = humanSymbol;
      if (calculateWinner(tempBoard) === humanSymbol) return index;
    }
    //3. take center if available
    if (board[4] === null) return 4;
    
    //4. take a corner if available
    const corners = [0, 2, 6, 8].filter(idx => board[idx] === null);
    if (corners.length > 0) return corners[Math.floor(Math.random() * corners.length)];
    
    //5. take a side if available
    const sides = [1, 3, 5, 7].filter(idx => board[idx] === null);
    if (sides.length > 0) return sides[Math.floor(Math.random() * sides.length)];
    
    //fallback (shouldn't happen if logic works the way its supposed to)
    return emptySquares[0];
  }


  //unbeatable ai logic - minimax 
  if (difficulty === 'Unbeatable') {
    const bestMove = minimax([...board], aiSymbol, aiSymbol, humanSymbol);
    return bestMove.index !== undefined ? bestMove.index : emptySquares[0]; 
  }

  return emptySquares[Math.floor(Math.random() * emptySquares.length)];
}