import React, { useState } from 'react';
import type { PlayerSymbol, Difficulty } from '../types';

interface SettingsProps {
  onStartGame: (playerSymbol: PlayerSymbol, difficulty: Difficulty) => void;
}

const Settings: React.FC<SettingsProps> = ({ onStartGame }) => {
  const [playerSymbol, setPlayerSymbol] = useState<PlayerSymbol>('X');
  const [difficulty, setDifficulty] = useState<Difficulty>('Medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStartGame(playerSymbol, difficulty);
  };

  return (
    <div className="settings-screen">
      <h2>Tic-Tac-Toe Settings</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="playerSymbol">Choose your symbol:</label>
          <select
            id="playerSymbol"
            value={playerSymbol}
            onChange={(e) => setPlayerSymbol(e.target.value as PlayerSymbol)}
          >
            <option value="X">X</option>
            <option value="O">O</option>
          </select>
        </div>
        <div>
          <label htmlFor="difficulty">Select AI Difficulty:</label>
          <select
            id="difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
            <option value="Unbeatable">Unbeatable (Minimax)</option>
          </select>
        </div>
        <button type="submit">Start Game</button>
      </form>
    </div>
  );
};

export default Settings;