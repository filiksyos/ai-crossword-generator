import { NextRequest, NextResponse } from 'next/server';
import { generateCrossword } from '@/utils/openrouterClient';
import { generateGrid } from '@/utils/crosswordUtils';
import { z } from 'zod';

const RequestSchema = z.object({
  prompt: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt } = RequestSchema.parse(body);

    // Generate crossword clues using OpenRouter
    const clues = await generateCrossword(prompt);

    // Generate grid layout
    const grid = generateGrid(clues);

    return NextResponse.json({ clues, grid });
  } catch (error) {
    console.error('Error generating crossword:', error);
    return NextResponse.json(
      { error: 'Failed to generate crossword' },
      { status: 500 }
    );
  }
}
