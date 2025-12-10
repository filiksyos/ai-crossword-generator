# 🧩 AI Crossword Generator

Generate custom crossword puzzles instantly using AI! Simply describe what kind of crossword you want in natural language, and watch as GPT-4 Mini creates a playable puzzle just for you.

## ✨ Features

- **Natural Language Input**: Just describe your crossword idea (e.g., "Create a crossword about space exploration")
- **AI-Powered Generation**: Uses OpenRouter + GPT-4 Mini to generate clues and answers
- **Interactive Grid**: Play directly in your browser with keyboard navigation
- **Progress Tracking**: See your score and completed words in real-time
- **Answer Hints**: Get help when you're stuck with the reveal answers feature

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- OpenRouter API key ([Get one free here](https://openrouter.ai/))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/filiksyos/ai-crossword-generator.git
   cd ai-crossword-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your OpenRouter API key
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000`

## 🎯 Usage

1. Enter your crossword idea in natural language (e.g., "Science fiction movies from the 80s")
2. Click "Generate Crossword"
3. Wait for AI to create your puzzle
4. Play the crossword with keyboard navigation
5. Check your answers and see your score
6. Use "Show Answers" if you need help

## 🛠️ Tech Stack

- **Next.js 15** with App Router
- **React 19** for UI components
- **OpenRouter API** with GPT-4 Mini for AI generation
- **Tailwind CSS** for styling
- **TypeScript** for type safety
- **Zod** for schema validation

## 📁 Project Structure

```
ai-crossword-generator/
├── app/
│   ├── api/
│   │   └── generate-crossword/
│   │       └── route.ts          # AI generation endpoint
│   ├── components/
│   │   ├── LandingPage.tsx       # Home page with input
│   │   ├── CrosswordGrid.tsx     # Interactive grid
│   │   ├── ClueList.tsx          # Clue display
│   │   ├── ScoreBoard.tsx        # Progress tracking
│   │   └── Footer.tsx            # Footer component
│   ├── puzzle/
│   │   └── page.tsx              # Puzzle gameplay page
│   ├── types/
│   │   └── types.ts              # TypeScript definitions
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
├── utils/
│   ├── crosswordUtils.ts         # Grid generation logic
│   └── openrouterClient.ts       # API client
└── package.json
```

## 🔐 Environment Variables

Create a `.env.local` file:

```env
OPENROUTER_API_KEY=your_openrouter_api_key
```

## 📝 License

MIT License - feel free to use this project for personal and commercial purposes.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- AI powered by [OpenRouter](https://openrouter.ai/) + GPT-4 Mini
- UI inspiration from [CrosswordGPT](https://github.com/0xmetaschool/CrosswordGPT)

---

**Made with ❤️ using AI**
