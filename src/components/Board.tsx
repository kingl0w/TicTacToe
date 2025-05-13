import React from 'react';
import Square from './Square';
import type { BoardState, SquareValue } from '../types';


interface BoardProps {
  squares: BoardState;
  onClick: (i: number) => void;
  winnerInfo: { winner: SquareValue | 'Draw' | null, line: number[] | null };
}

const Board: React.FC<BoardProps> = ({ squares, onClick, winnerInfo }) => {
  const renderSquare = (i: number) => {
    const isWinningSquare = !!winnerInfo.line && winnerInfo.line.includes(i);
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onClick(i)}
        isWinningSquare={isWinningSquare}
      />
    );
  };

  return (
    <div className="board">
      {[0, 1, 2].map(row => (
        <div key={row} className="board-row">
          {[0, 1, 2].map(col => renderSquare(row * 3 + col))}
        </div>
      ))}
    </div>
  );
};

export default Board;