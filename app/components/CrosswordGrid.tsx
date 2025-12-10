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
    <div ref={gridRef} className="inline-block bg-white p-4 rounded-lg shadow-lg">
      <div className="grid gap-0" style={{ gridTemplateColumns: 'repeat(12, 1fr)' }}>
        {grid.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${x}-${y}`}
              onClick={() => !cell.isBlank && onCellSelect(x, y)}
              className={`w-10 h-10 border border-gray-400 relative cursor-pointer ${
                cell.isBlank
                  ? 'bg-black'
                  : selectedCell?.x === x && selectedCell?.y === y
                  ? 'bg-yellow-200'
                  : 'bg-white hover:bg-gray-100'
              }`}
            >
              {!cell.isBlank && (
                <>
                  {cell.number && (
                    <span className="absolute top-0 left-0 text-[8px] font-bold px-0.5">
                      {cell.number}
                    </span>
                  )}
                  <div className="w-full h-full flex items-center justify-center text-lg font-bold">
                    {cell.userInput || ''}
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
