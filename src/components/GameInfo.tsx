import React from 'react';
import type { Score, PlayerSymbol, Difficulty } from '../types';

interface GameInfoProps {
  status: string;
  score: Score;
  onResetBoard: () => void;
  onNewGame: () => void;
  playerSymbol: PlayerSymbol;
  aiSymbol: PlayerSymbol;
  difficulty: Difficulty;
}

const GameInfo: React.FC<GameInfoProps> = ({ status, score, onResetBoard, onNewGame, playerSymbol, difficulty }) => {
  return (
    <div className="game-info">
      <div className="status">{status}</div>
      <div className="score-board">
        <h3>Score</h3>
        <p>Player ({playerSymbol}): {score.player}</p>
        <p>AI ({playerSymbol === 'X' ? 'O' : 'X'}): {score.ai}</p>
        <p>Draws: {score.draws}</p>
      </div>
      <p>Difficulty: {difficulty}</p>
      <div className="game-actions">
        <button onClick={onResetBoard}>Play Again</button>
        <button onClick={onNewGame}>New Game (Change Settings)</button>
      </div>
    </div>
  );
};

export default GameInfo;