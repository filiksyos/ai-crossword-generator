export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-12">
      <div className="container mx-auto px-4 text-center text-gray-600">
        <p className="text-sm">
          Made with ❤️ using{' '}
          <a href="https://openrouter.ai/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700">
            OpenRouter
          </a>{' '}
          +{' '}
          <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700">
            Next.js
          </a>
        </p>
      </div>
    </footer>
  );
}
