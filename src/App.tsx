import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import Board from './components/Board';
import GameInfo from './components/GameInfo';
import Settings from './components/Settings';
import type { BoardState, PlayerSymbol, Difficulty, Score, SquareValue } from './types';
import { calculateWinner, WINNING_COMBINATIONS } from './utils/gameLogic';
import { getAIMove } from './utils/aiLogic';

const initialBoard = (): BoardState => Array(9).fill(null);

const App: React.FC = () => {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [playerSymbol, setPlayerSymbol] = useState<PlayerSymbol>('X');
  const [aiSymbol, setAiSymbol] = useState<PlayerSymbol>('O');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');

  const [board, setBoard] = useState<BoardState>(initialBoard());
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true); //x always starts if chosen
  const [winnerInfo, setWinnerInfo] = useState<{ winner: SquareValue | 'Draw' | null, line: number[] | null }>({ winner: null, line: null });
  
  const [score, setScore] = useState<Score>({ player: 0, ai: 0, draws: 0 });
  const [statusMessage, setStatusMessage] = useState<string>('');

  const updateStatus = useCallback(() => {
    if (winnerInfo.winner) {
      if (winnerInfo.winner === 'Draw') {
        setStatusMessage("It's a Draw!");
      } else if (winnerInfo.winner === playerSymbol) {
        setStatusMessage(`You (${playerSymbol}) won!`);
      } else {
        setStatusMessage(`AI (${aiSymbol}) won!`);
      }
    } else {
      setStatusMessage(`Turn: ${isPlayerTurn ? `Player (${playerSymbol})` : `AI (${aiSymbol})`}`);
    }
  }, [winnerInfo, isPlayerTurn, playerSymbol, aiSymbol]);


  useEffect(() => {
    updateStatus();
  }, [updateStatus]);

  const handleStartGame = (pSymbol: PlayerSymbol, diff: Difficulty) => {
    setPlayerSymbol(pSymbol);
    setAiSymbol(pSymbol === 'X' ? 'O' : 'X');
    setDifficulty(diff);
    setIsPlayerTurn(pSymbol === 'X'); //x always starts the first game
    setGameStarted(true);
    resetBoardState();
  };

  const resetBoardState = (keepTurnOrder: boolean = false) => {
    setBoard(initialBoard());
    setWinnerInfo({ winner: null, line: null });
    if (!keepTurnOrder) {
      setIsPlayerTurn(playerSymbol === 'X'); 
    } else {
      setIsPlayerTurn(playerSymbol === 'X');
    }
  };
  
  const handleResetBoard = () => { //play Again
    resetBoardState(false); //reset turn order for new round
  };

  const handleNewGame = () => { //back to settings
    setGameStarted(false);
    setScore({ player: 0, ai: 0, draws: 0 }); //reset score for a new game
    resetBoardState();
  };

  const checkGameEnd = (currentBoard: BoardState): boolean => {
    const gameWinner = calculateWinner(currentBoard);
    if (gameWinner) {
      let winningLine: number[] | null = null;
      if (gameWinner !== 'Draw') {
        for (const line of WINNING_COMBINATIONS) {
          const [a, b, c] = line;
          if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
            winningLine = line;
            break;
          }
        }
      }

      setWinnerInfo({ winner: gameWinner, line: winningLine });
      setScore(prevScore => {
        if (gameWinner === playerSymbol) return { ...prevScore, player: prevScore.player + 1 };
        if (gameWinner === aiSymbol) return { ...prevScore, ai: prevScore.ai + 1 };
        if (gameWinner === 'Draw') return { ...prevScore, draws: prevScore.draws + 1 };
        return prevScore;
      });
      return true;
    }
    return false;
  };

  const handleSquareClick = (i: number) => {
    if (winnerInfo.winner || board[i] || !isPlayerTurn) {
      return;
    }

    const newBoard = [...board];
    newBoard[i] = playerSymbol;
    setBoard(newBoard);

    if (!checkGameEnd(newBoard)) {
      setIsPlayerTurn(false);
    }
  };

  //ai turn logic
  useEffect(() => {
    if (!isPlayerTurn && !winnerInfo.winner && gameStarted) {
      //add small delay for ai move to feel natural
      const aiMoveTimeout = setTimeout(() => {
        const aiMoveIndex = getAIMove(board, aiSymbol, playerSymbol, difficulty);
        
        if (aiMoveIndex !== -1 && board[aiMoveIndex] === null) { //ensure valid move
          const newBoard = [...board];
          newBoard[aiMoveIndex] = aiSymbol;
          setBoard(newBoard);

          if (!checkGameEnd(newBoard)) {
            setIsPlayerTurn(true);
          }
        } else if (aiMoveIndex === -1 && !calculateWinner(board)) {
          //might happen if logic has a bug or board is full but no winner
          //(basically if getAIMove returns -1 unexpectedly)
          //for safety, checks for draw if no move possible.
          if (board.every(sq => sq !== null)) {
            checkGameEnd(board); //this SHOULD call calculateWinner which can return 'draw'
          }
        }
      }, 500 + Math.random() * 500); //random delay between 0.5s and 1s

      return () => clearTimeout(aiMoveTimeout);
    }
  }, [isPlayerTurn, board, aiSymbol, playerSymbol, difficulty, winnerInfo.winner, gameStarted, checkGameEnd]);
  
  //effect to handle ai starting the game if ai is 'x'
  useEffect(() => {
    if (gameStarted && aiSymbol === 'X' && isPlayerTurn === false && getEmptySquares(board).length === 9 && !winnerInfo.winner) {
      //this means ai is x and it's its turn to make the first move.
      //main ai turn useEffect will handle this.
      //no action needed here, just ensuring the condition is right for the other useEffect.
    }
  }, [gameStarted, aiSymbol, isPlayerTurn, board, winnerInfo.winner]);


  if (!gameStarted) {
    return <Settings onStartGame={handleStartGame} />;
  }

  return (
    <div className="game">
      <h1>Tic-Tac-Toe</h1>
      <div className="game-layout">
        <Board squares={board} onClick={handleSquareClick} winnerInfo={winnerInfo} />
        <GameInfo
          status={statusMessage}
          score={score}
          onResetBoard={handleResetBoard}
          onNewGame={handleNewGame}
          playerSymbol={playerSymbol}
          aiSymbol={aiSymbol}
          difficulty={difficulty}
        />
      </div>
    </div>
  );
};

//helper function (already in gameLogic but thought it might be useful here for initial ai start)
function getEmptySquares(board: BoardState): number[] {
  return board.reduce((acc, val, idx) => (val === null ? [...acc, idx] : acc), [] as number[]);
}


export default App;