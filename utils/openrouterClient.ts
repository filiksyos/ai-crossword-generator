import axios from 'axios';
import { CrosswordClue } from '@/app/types/types';
import { z } from 'zod';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const CrosswordResponseSchema = z.object({
  clues: z.array(
    z.object({
      clue: z.string(),
      answer: z.string(),
    })
  ),
});

export async function generateCrossword(prompt: string): Promise<CrosswordClue[]> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY not found in environment variables');
  }

  const systemPrompt = `You are a crossword puzzle generator. Generate exactly 12-15 crossword clues and answers based on the user's request.

Rules:
- Answers must be 3-12 letters long
- Use only letters (no spaces, hyphens, or special characters)
- Clues should be clear and solvable
- Mix of easy and challenging clues
- Diverse answer lengths for good grid layout

Respond ONLY with valid JSON in this exact format:
{
  "clues": [
    {"clue": "First question", "answer": "ANSWER1"},
    {"clue": "Second question", "answer": "ANSWER2"}
  ]
}`;

  try {
    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data.choices[0].message.content;
    
    // Parse the JSON response
    const parsed = JSON.parse(content);
    const validated = CrosswordResponseSchema.parse(parsed);

    // Convert to CrosswordClue format (grid placement will be done by generateGrid)
    return validated.clues.map((item, index) => ({
      number: index + 1,
      clue: item.clue,
      answer: item.answer.toUpperCase().replace(/[^A-Z]/g, ''),
      direction: 'across' as const, // Will be updated by generateGrid
      startx: 0, // Will be updated by generateGrid
      starty: 0, // Will be updated by generateGrid
    }));
  } catch (error) {
    console.error('OpenRouter API error:', error);
    throw new Error('Failed to generate crossword with AI');
  }
}
