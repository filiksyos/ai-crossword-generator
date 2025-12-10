'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-crossword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error('Failed to generate crossword');

      const data = await response.json();
      // Store in sessionStorage and navigate to puzzle page
      sessionStorage.setItem('crosswordData', JSON.stringify(data));
      router.push('/puzzle');
    } catch (error) {
      console.error('Error generating crossword:', error);
      alert('Failed to generate crossword. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const gridPattern = {
    backgroundImage: 'linear-gradient(90deg,rgba(0,0,0,.03) 1px,transparent 0),linear-gradient(180deg,rgba(0,0,0,.03) 1px,transparent 0)',
    backgroundSize: '40px 40px'
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4" style={gridPattern}>
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-black via-gray-700 to-black text-transparent bg-clip-text">
            🧩 AI Crossword Generator
          </h1>
          <p className="text-gray-600 text-xl">
            Describe your crossword idea in natural language and let AI create it for you
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <label className="block mb-4">
            <span className="text-gray-700 font-semibold text-lg">What kind of crossword do you want?</span>
            <textarea
              className="mt-2 block w-full rounded-lg border border-gray-300 p-4 text-gray-900 focus:border-black focus:ring-2 focus:ring-black transition-all"
              rows={4}
              placeholder="e.g., 'Create a crossword about space exploration and famous astronauts' or 'I want a puzzle about 90s pop culture'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
            />
          </label>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="w-full bg-black text-white font-bold py-4 px-6 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating Your Crossword...
              </span>
            ) : (
              '✨ Generate Crossword'
            )}
          </button>
        </div>

        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">Examples:</p>
          <div className="flex flex-wrap gap-2 justify-center mt-2">
            {['Science fiction movies', 'Ancient civilizations', 'Computer programming terms', 'Famous inventors'].map((example) => (
              <button
                key={example}
                onClick={() => setPrompt(`Create a crossword about ${example}`)}
                className="text-xs bg-white px-3 py-1 rounded-full border border-gray-300 hover:border-black hover:text-black transition-all"
                disabled={isLoading}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
