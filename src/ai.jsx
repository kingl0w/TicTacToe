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

function findBestMoveEasy(board) {
  const emptySqaures = [];

  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      emptySquares.push(i);
    }
  }
  const randomIndex = Math.floor(Math.random() * emptySqaures.length);
  return emptySqaures[randomIndex];
}

function findBestMoveMedium(board) {
  const emptySquares = [];

  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      emptySquares.push(i);
    }
  }
  //checks to see if the ai can win in the next move
  for (let i = 0; i < emptySquares.length; i++) {
    const testBoard = [...board];
    testBoard[emptySquares[i]] = 'O';
    if (calculateWinner(testBoard) === 'O') {
      return emptySquares[i];
    }
  }

  //Checks if the player can win in the next move and block them
  for (let i = 0; i < emptySquares.length; i++) {
    const testBoard = [...board];
    testBoard[emptySquares[i]] = 'X';
    if (calculateWinner(testBoard) === 'X') {
      return emptySquares[i];
    }
  }
  //If no immediate winning moves, make a random move
  const randomIndex = Math.floor(Math.random() * emptySquares.length);
  return emptySquares[randomIndex];
}

function findBestMoveHard(board) {
  const emptySquares = [];
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      emptySquares.push(i);
    }
  }

  let bestScore = -Infinity;
  let bestMove = null;

  for (let i = 0; i < emptySquares.length; i++) {
    const testBoard = [...board];
    testBoard[emptySquares[i]] = 'O';
    const moveScore = minimax(testBoard, 'X', 'O', false);
    if (moveScore > bestScore) {
      bestScore = moveScore;
      bestMove = emptySquares[i];
    }
  }

  return bestMove;
}

function emptySquares(board) {
  const emptySquares = [];
  for (let i = 0; i < board.length; i++) {
    if (!board[i]) {
      emptySquares.push(i);
    }
  }
  return emptySquares;
}

function calculateWinner(squares) {
  //Define winning combinations (rows, columns, diagonals)
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], //Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], //Columns
    [0, 4, 8],
    [2, 4, 6], //Diagonals
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]; //Return the winning symbol ('X' or 'O')
    }
  }

  if (squares.every((square) => square !== null)) {
    return 'draw'; //Return 'draw' if all squares are filled (no winner)
  }

  return null; //Return null if the game is still ongoing
}

export {
  findBestMove,
  minimax,
  evaluate,
  findBestMoveEasy,
  findBestMoveMedium,
  findBestMoveHard,
  emptySquares,
  calculateWinner,
};
