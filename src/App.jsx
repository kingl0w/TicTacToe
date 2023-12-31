import { useState } from 'react';
import './styles/style.scss';
import { useEffect } from 'react';
import {
  findBestMoveEasy,
  findBestMoveMedium,
  findBestMoveHard,
  emptySquares,
  calculateWinner,
} from './ai';

function App() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [scores, setScores] = useState({ xScore: 0, oScore: 0 });
  const [player, setPlayer] = useState(null);
  const [showStatus, setShowStatus] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState('medium');

  useEffect(() => {
    updateScores();
  }, [squares]);

  function Square({ value, onSquareClick }) {
    return (
      <button
        className='square'
        onClick={onSquareClick}>
        {value}
      </button>
    );
  }

  function handleClick(i) {
    if (!player || squares[i] || gameOver) {
      return; //Do nothing if player not selected, square already filled, or there is a winner
    }

    const nextSquares = squares.slice();
    nextSquares[i] = player; //This assigns a player's move to a selected square

    const winner = calculateWinner(); //Check for winner after the player's move
    const empty = emptySquares(nextSquares);

    if (winner) {
      //Set gameover if there is a winner
      setGameOver(true);
    } else {
      //The opponent's turn
      if (!gameOver && player === 'X') {
        let aiMove;
        if (difficulty === 'easy') {
          aiMove = findBestMoveEasy(nextSquares); //AI logic for easy difficulty
        } else if (difficulty === 'medium') {
          aiMove = findBestMoveMedium(nextSquares); //AI logic for medium difficulty
        } else if (difficulty === 'hard') {
          aiMove = findBestMoveHard(nextSquares); //AI logic for hard difficulty
        }

        nextSquares[aiMove] = 'O'; //Assigns the next AI move
        setSquares(nextSquares);
        setXIsNext(!xIsNext); //Toggle players' turns
      }
    }
  }

  //handle difficulty section
  const handleDifficultySelect = (selectedDifficulty) => {
    setDifficulty(selectedDifficulty);
  };

  //Update scores function
  const updateScores = () => {
    const winner = calculateWinner();
    if (winner === 'X') {
      setScores((prevState) => ({
        ...prevState,
        xScore: prevState.xScore + 1,
      }));
    } else if (winner === 'O') {
      setScores((prevState) => ({
        ...prevState,
        oScore: prevState.oScore + 1,
      }));
    }
  };

  // Calculate the winner function
  const calculateWinner = () => {
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
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }

    if (squares.every((square) => square !== null)) {
      return 'draw';
    }

    return null;
  };

  //Reset board function
  const handleRestart = () => {
    setXIsNext(true);
    setSquares(Array(9).fill(null));
    setShowStatus(false);
  };

  //Player select function
  const handlePlayerSelect = (selectedPlayer) => {
    setPlayer(selectedPlayer);
    setXIsNext(selectedPlayer === 'X');
    setShowStatus(true);
  };

  let status;
  if (showStatus) {
    const winner = calculateWinner();
    if (winner === 'draw') {
      status = 'Draw!';
    } else if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }
  }

  return (
    <>
      <div className='title'>
        <h1>mello, world</h1>
      </div>
      {showStatus && <div className='status'>{status}</div>}
      {!showStatus && (
        <div className='player-select'>
          <div>Select Player:</div>
          <button
            className={`player-button ${player === 'X' ? 'active' : ''}`}
            onClick={() => handlePlayerSelect('X')}>
            X
          </button>
          <button
            className={`player-button ${player === 'O' ? 'active' : ''}`}
            onClick={() => handlePlayerSelect('O')}>
            O
          </button>
        </div>
      )}

      <div className='difficulty-select'>
        <button
          onClick={() => handleDifficultySelect('easy')}
          className={`difficulty-button ${
            difficulty === 'easy' ? 'active' : ''
          }`}>
          Easy
        </button>
        <button
          onClick={() => handleDifficultySelect('medium')}
          className={`difficulty-button ${
            difficulty === 'medium' ? 'active' : ''
          }`}>
          Medium
        </button>
        <button
          onClick={() => handleDifficultySelect('hard')}
          className={`difficulty-button ${
            difficulty === 'hard' ? 'active' : ''
          }`}>
          Hard
        </button>
      </div>

      <div className='game-board'>
        <Square
          value={squares[0]}
          onSquareClick={() => handleClick(0)}
        />
        <Square
          value={squares[1]}
          onSquareClick={() => handleClick(1)}
        />
        <Square
          value={squares[2]}
          onSquareClick={() => handleClick(2)}
        />
        <Square
          value={squares[3]}
          onSquareClick={() => handleClick(3)}
        />
        <Square
          value={squares[4]}
          onSquareClick={() => handleClick(4)}
        />
        <Square
          value={squares[5]}
          onSquareClick={() => handleClick(5)}
        />
        <Square
          value={squares[6]}
          onSquareClick={() => handleClick(6)}
        />
        <Square
          value={squares[7]}
          onSquareClick={() => handleClick(7)}
        />
        <Square
          value={squares[8]}
          onSquareClick={() => handleClick(8)}
        />
      </div>
      <div className='scores'>
        <div className='xScore'>X Score: {scores.xScore}</div>
        <div className='oScore'>O Score: {scores.oScore}</div>
      </div>
      <div className='reset'>
        <button onClick={handleRestart}>Restart</button>
      </div>
    </>
  );
}

export default App;
