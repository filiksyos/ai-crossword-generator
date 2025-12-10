'use client';

interface ScoreBoardProps {
  totalWords: number;
  completedWords: number;
  onCheckAnswers: () => void;
  onShowAnswers: () => void;
  onReset: () => void;
}

export default function ScoreBoard({
  totalWords,
  completedWords,
  onCheckAnswers,
  onShowAnswers,
  onReset,
}: ScoreBoardProps) {
  const percentage = totalWords > 0 ? Math.round((completedWords / totalWords) * 100) : 0;

  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-black">Your Progress</h2>
      
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Completed:</span>
          <span className="font-bold text-black">
            {completedWords} / {totalWords}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-black h-4 rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="text-center mt-2 text-2xl font-bold text-black">
          {percentage}%
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={onCheckAnswers}
          className="w-full bg-black text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-800 transition-all"
        >
          ✓ Check Answers
        </button>
        
        <button
          onClick={onShowAnswers}
          className="w-full bg-black text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-800 transition-all"
        >
          💡 Show Answers
        </button>
        
        <button
          onClick={onReset}
          className="w-full bg-gray-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-700 transition-all"
        >
          🔄 New Puzzle
        </button>
      </div>

      {completedWords === totalWords && totalWords > 0 && (
        <div className="mt-6 p-4 bg-green-100 border-2 border-green-500 rounded-lg text-center">
          <p className="text-green-800 font-bold text-lg">🎉 Congratulations!</p>
          <p className="text-green-700">You completed the crossword!</p>
        </div>
      )}
    </div>
  );
}
