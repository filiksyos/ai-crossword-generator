'use client';

import { CrosswordCell, CrosswordClue } from '../types/types';
import { useEffect, useRef } from 'react';

interface CrosswordGridProps {
  grid: CrosswordCell[][];
  onCellChange: (x: number, y: number, value: string) => void;
  selectedCell: { x: number; y: number } | null;
  onCellSelect: (x: number, y: number) => void;
  clues: CrosswordClue[];
}

export default function CrosswordGrid({
  grid,
  onCellChange,
  selectedCell,
  onCellSelect,
  clues,
}: CrosswordGridProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell) return;

      const { x, y } = selectedCell;

      // Handle arrow keys
      if (e.key === 'ArrowRight' && x < 11) {
        e.preventDefault();
        let nextX = x + 1;
        while (nextX < 12 && grid[y][nextX].isBlank) nextX++;
        if (nextX < 12) onCellSelect(nextX, y);
      } else if (e.key === 'ArrowLeft' && x > 0) {
        e.preventDefault();
        let nextX = x - 1;
        while (nextX >= 0 && grid[y][nextX].isBlank) nextX--;
        if (nextX >= 0) onCellSelect(nextX, y);
      } else if (e.key === 'ArrowDown' && y < 11) {
        e.preventDefault();
        let nextY = y + 1;
        while (nextY < 12 && grid[nextY][x].isBlank) nextY++;
        if (nextY < 12) onCellSelect(x, nextY);
      } else if (e.key === 'ArrowUp' && y > 0) {
        e.preventDefault();
        let nextY = y - 1;
        while (nextY >= 0 && grid[nextY][x].isBlank) nextY--;
        if (nextY >= 0) onCellSelect(x, nextY);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        onCellChange(x, y, '');
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        onCellChange(x, y, e.key.toUpperCase());
        // Auto-advance to next cell
        let nextX = x + 1;
        while (nextX < 12 && grid[y][nextX].isBlank) nextX++;
        if (nextX < 12) onCellSelect(nextX, y);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, grid, onCellChange, onCellSelect]);

  return (
    <div ref={gridRef} className="border-2 border-black rounded-lg overflow-hidden">
      <div className="grid grid-cols-12 gap-0">
        {grid.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              onClick={() => !cell.isBlank && onCellSelect(x, y)}
              className={`relative ${
                cell.isBlank ? 'bg-black' : 'bg-white'
              }`}
              style={{ width: '48px', height: '48px' }}
            >
              {!cell.isBlank && (
                <div className="w-full h-full border border-gray-300 relative">
                  {cell.number && (
                    <span className="absolute top-0.5 left-1 text-xs font-black text-black z-10">
                      {cell.number}
                    </span>
                  )}
                  <div className={`w-full h-full flex items-center justify-center text-xl font-bold text-black ${
                    selectedCell?.x === x && selectedCell?.y === y ? 'bg-blue-50' : ''
                  }`}>
                    {cell.userInput || ''}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
