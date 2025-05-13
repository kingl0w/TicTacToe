import React from 'react';
import type { SquareValue } from '../types';

interface SquareProps {
  value: SquareValue;
  onClick: () => void;
  isWinningSquare: boolean;
}

const Square: React.FC<SquareProps> = ({ value, onClick, isWinningSquare }) => {
  let displayValue = value;
  let className = "square";
  if (value === 'X') className += " x-symbol";
  if (value === 'O') className += " o-symbol";
  if (isWinningSquare) className += " winning-square";

  //O is slightly different for fun
  if (value === 'O') displayValue = 'O'; 


  return (
    <button className={className} onClick={onClick} disabled={!!value}>
      {displayValue}
    </button>
  );
};

export default Square;