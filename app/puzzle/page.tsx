'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CrosswordGrid from '../components/CrosswordGrid';
import ClueList from '../components/ClueList';
import ScoreBoard from '../components/ScoreBoard';
import { CrosswordData, CrosswordCell } from '../types/types';

export default function PuzzlePage() {
  const router = useRouter();
  const [crosswordData, setCrosswordData] = useState<CrosswordData | null>(null);
  const [grid, setGrid] = useState<CrosswordCell[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ x: number; y: number } | null>(null);
  const [completedClues, setCompletedClues] = useState<Set<number>>(new Set());

  useEffect(() => {
    const data = sessionStorage.getItem('crosswordData');
    if (!data) {
      router.push('/');
      return;
    }

    const parsed = JSON.parse(data) as CrosswordData;
    setCrosswordData(parsed);
    setGrid(parsed.grid.map(row => row.map(cell => ({ ...cell, userInput: '' }))));
  }, [router]);

  const handleCellChange = (x: number, y: number, value: string) => {
    const newGrid = grid.map((row, rowIdx) =>
      row.map((cell, colIdx) =>
        rowIdx === y && colIdx === x ? { ...cell, userInput: value } : cell
      )
    );
    setGrid(newGrid);
  };

  const handleCellSelect = (x: number, y: number) => {
    setSelectedCell({ x, y });
  };

  const checkAnswers = () => {
    if (!crosswordData) return;

    const completed = new Set<number>();
    
    crosswordData.clues.forEach((clue) => {
      const { answer, startx, starty, direction } = clue;
      let isCorrect = true;

      for (let i = 0; i < answer.length; i++) {
        const x = direction === 'across' ? startx + i : startx;
        const y = direction === 'down' ? starty + i : starty;
        
        if (grid[y][x].userInput !== answer[i].toUpperCase()) {
          isCorrect = false;
          break;
        }
      }

      if (isCorrect) {
        completed.add(clue.number);
      }
    });

    setCompletedClues(completed);
  };

  const showAnswers = () => {
    if (!crosswordData) return;

    const newGrid = grid.map((row, y) =>
      row.map((cell, x) => ({
        ...cell,
        userInput: cell.letter,
      }))
    );
    setGrid(newGrid);
    
    // Mark all as completed
    const allClues = new Set(crosswordData.clues.map(c => c.number));
    setCompletedClues(allClues);
  };

  const resetPuzzle = () => {
    router.push('/');
  };

  if (!crosswordData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          🧩 Your AI-Generated Crossword
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex justify-center">
            <CrosswordGrid
              grid={grid}
              onCellChange={handleCellChange}
              selectedCell={selectedCell}
              onCellSelect={handleCellSelect}
              clues={crosswordData.clues}
            />
          </div>

          <div className="space-y-6">
            <ScoreBoard
              totalWords={crosswordData.clues.length}
              completedWords={completedClues.size}
              onCheckAnswers={checkAnswers}
              onShowAnswers={showAnswers}
              onReset={resetPuzzle}
            />
          </div>
        </div>

        <div className="mt-8">
          <ClueList clues={crosswordData.clues} completedClues={completedClues} />
        </div>
      </div>
    </div>
  );
}
