'use client';

import { CrosswordCell, CrosswordClue } from '../types/types';
import { useEffect, useRef, useState } from 'react';

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
  const [direction, setDirection] = useState<'across' | 'down'>('across');

  // Helper function to find next cell in a direction
  const findNextCell = (x: number, y: number, dir: 'across' | 'down'): { x: number; y: number } | null => {
    if (dir === 'across') {
      let nextX = x + 1;
      while (nextX < 12 && grid[y][nextX].isBlank) nextX++;
      if (nextX < 12) return { x: nextX, y };
    } else {
      let nextY = y + 1;
      while (nextY < 12 && grid[nextY][x].isBlank) nextY++;
      if (nextY < 12) return { x, y: nextY };
    }
    return null;
  };

  // Helper function to find previous cell in a direction
  const findPreviousCell = (x: number, y: number, dir: 'across' | 'down'): { x: number; y: number } | null => {
    if (dir === 'across') {
      let prevX = x - 1;
      while (prevX >= 0 && grid[y][prevX].isBlank) prevX--;
      if (prevX >= 0) return { x: prevX, y };
    } else {
      let prevY = y - 1;
      while (prevY >= 0 && grid[prevY][x].isBlank) prevY--;
      if (prevY >= 0) return { x, y: prevY };
    }
    return null;
  };

  // Determine initial direction when cell is selected
  useEffect(() => {
    if (!selectedCell) return;

    const { x, y } = selectedCell;
    
    // Find which clue(s) this cell belongs to
    const activeClues = clues.filter(clue => {
      const { startx, starty, direction: clueDir, answer } = clue;
      if (clueDir === 'across') {
        return starty === y && x >= startx && x < startx + answer.length;
      } else {
        return startx === x && y >= starty && y < starty + answer.length;
      }
    });

    // If cell belongs to both across and down, prefer the one that's longer or has more filled cells
    if (activeClues.length > 0) {
      // Prefer across if both exist, or use the only one
      const acrossClue = activeClues.find(c => c.direction === 'across');
      const downClue = activeClues.find(c => c.direction === 'down');
      
      if (acrossClue && downClue) {
        // If both exist, check which direction has more progress
        const acrossProgress = acrossClue.answer.split('').filter((_, i) => {
          const cellX = acrossClue.startx + i;
          return grid[acrossClue.starty][cellX].userInput;
        }).length;
        const downProgress = downClue.answer.split('').filter((_, i) => {
          const cellY = downClue.starty + i;
          return grid[cellY][downClue.startx].userInput;
        }).length;
        
        setDirection(acrossProgress >= downProgress ? 'across' : 'down');
      } else if (acrossClue) {
        setDirection('across');
      } else if (downClue) {
        setDirection('down');
      }
    }
  }, [selectedCell, grid, clues]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedCell) return;

      const { x, y } = selectedCell;

      // Handle arrow keys - set direction and move
      if (e.key === 'ArrowRight' && x < 11) {
        e.preventDefault();
        setDirection('across');
        let nextX = x + 1;
        while (nextX < 12 && grid[y][nextX].isBlank) nextX++;
        if (nextX < 12) onCellSelect(nextX, y);
      } else if (e.key === 'ArrowLeft' && x > 0) {
        e.preventDefault();
        setDirection('across');
        let nextX = x - 1;
        while (nextX >= 0 && grid[y][nextX].isBlank) nextX--;
        if (nextX >= 0) onCellSelect(nextX, y);
      } else if (e.key === 'ArrowDown' && y < 11) {
        e.preventDefault();
        setDirection('down');
        let nextY = y + 1;
        while (nextY < 12 && grid[nextY][x].isBlank) nextY++;
        if (nextY < 12) onCellSelect(x, nextY);
      } else if (e.key === 'ArrowUp' && y > 0) {
        e.preventDefault();
        setDirection('down');
        let nextY = y - 1;
        while (nextY >= 0 && grid[nextY][x].isBlank) nextY--;
        if (nextY >= 0) onCellSelect(x, nextY);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        onCellChange(x, y, '');
        // Move backwards in current direction
        const prevCell = findPreviousCell(x, y, direction);
        if (prevCell) {
          onCellSelect(prevCell.x, prevCell.y);
        }
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault();
        onCellChange(x, y, e.key.toUpperCase());
        // Auto-advance to next cell in current direction
        const nextCell = findNextCell(x, y, direction);
        if (nextCell) {
          onCellSelect(nextCell.x, nextCell.y);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, grid, onCellChange, onCellSelect, direction]);

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
