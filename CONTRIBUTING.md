# Contributing to APITester

Thanks for your interest in contributing! Here's how to get started.

## Development Setup

```bash
git clone https://github.com/yourusername/APITester.git
cd APITester
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript 5**
- **Tailwind CSS v4**
- **Zustand** (state management with persistence)
- **Lucide React** (icons)

## Project Structure

```
src/
├── app/             # Next.js app router pages
├── components/      # React components
├── lib/             # HTTP client, utilities
├── store/           # Zustand store with localStorage persistence
└── types/           # TypeScript interfaces
```

## Guidelines

### Code Style
- Use TypeScript strict mode — no `any` types
- Functional components with hooks only
- Use Zustand for shared state; local `useState` for component-only state
- Tailwind CSS for all styling — no CSS modules or inline styles

### Commits
- Use clear, descriptive commit messages
- One feature/fix per commit
- Run `npm run build` before pushing to catch type errors

### Adding Features
1. Fork the repo and create a feature branch
2. Add types to `src/types/index.ts` if needed
3. Update the Zustand store if adding new state
4. Build and test locally
5. Open a PR with a description of what you changed and why

### Testing
- Manual testing in the browser — no test framework currently set up
- Test both dark and light mode
- Test with various HTTP methods and response types
- Verify localStorage persistence survives page reload

## Areas for Contribution

- Additional HTTP methods (HEAD, OPTIONS)
- WebSocket support
- GraphQL mode
- Request scripting (pre-request / post-response)
- Import from Postman/Insomnia collections
- Keyboard shortcuts

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
