'use client';

import { CrosswordClue } from '../types/types';

interface ClueListProps {
  clues: CrosswordClue[];
  completedClues: Set<number>;
}

export default function ClueList({ clues, completedClues }: ClueListProps) {
  const acrossClues = clues.filter((c) => c.direction === 'across').sort((a, b) => a.number - b.number);
  const downClues = clues.filter((c) => c.direction === 'down').sort((a, b) => a.number - b.number);

  const renderClues = (clueList: CrosswordClue[], title: string) => (
    <div className="mb-6">
      <h3 className="text-xl font-bold mb-3 text-black">{title}</h3>
      <div className="space-y-2">
        {clueList.map((clue) => (
          <div
            key={`${clue.direction}-${clue.number}`}
            className={`p-2 rounded ${
              completedClues.has(clue.number) ? 'bg-green-100 text-green-800' : 'bg-gray-50'
            }`}
          >
            <span className="font-bold text-black">{clue.number}.</span> <span className="text-gray-700">{clue.clue}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg max-h-[600px] overflow-y-auto">
      {renderClues(acrossClues, 'Across')}
      {renderClues(downClues, 'Down')}
    </div>
  );
}
