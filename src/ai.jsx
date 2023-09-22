function findBestMove(board) {
  let bestMove = -Infinity;
  let bestMoveIndex = -1;

  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      board[i] = 'O'; //assume AI move
      const moveValue = minimax(board, 'X', 'O', false);
      board[i] = null; //undo move

      if (moveValue > bestMove) {
        bestMove = moveValue;
        bestMoveIndex = i;
      }
    }
  }
  return bestMoveIndex;
}

function minimax(board, player, AI, isMaximizing) {
  const score = evaluate(board);

  if (score === 10) {
    return score; //AI wins
  }
  if (score === -10) {
    return score; //player wins
  }
  if (board.every((square) => square !== null)) {
    return 0; //it's a draw
  }

  if (isMaximizing) {
    let bestScore = -Infinity;

    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = AI; //assume AI's move
        const moveValue = minimax(board, player, AI, false);
        board[i] = null; //undoes the move
        bestScore = Math.max(bestScore, moveValue);
      }
    }

    return bestScore;
  } else {
    let bestScore = Infinity;

    for (let i = 0; i < board.length; i++) {
      if (!board[i]) {
        board[i] = player; //assume player's position
        const moveValue = minimax(board, player, AI, true);
        board[i] = null; //undoes the move
        bestScore = Math.min(bestScore, moveValue);
      }
    }

    return bestScore;
  }
}

function evaluate(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      if (board[a] === 'O') {
        return 10; //AI wins
      } else if (board[a] === 'X') {
        return -10; //player wins
      }
    }
  }

  return 0; //either a draw or a neutral position
}

export { findBestMove, minimax, evaluate };
