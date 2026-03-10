# AGENTS.md - Development Guidelines

## Project Overview
React + Vite + TypeScript SPA for IT consulting homepage with interactive solutions/tools.

## Build & Development Commands

```bash
npm run dev       # Start dev server (Vite)
npm run build     # Build for production
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

**Note:** No test framework configured. Project uses manual/visual testing.

## Single Test Execution
No automated tests exist. For manual testing of specific components:
1. Run `npm run dev`
2. Navigate to specific route (e.g., `/tools/solution/openclaw-iac`)

## Code Style Guidelines

### Imports
- React hooks first: `import { useState, useEffect } from 'react'`
- Third-party libraries next
- Local imports last (use `@/` alias for `src/`)
- Named imports preferred over default

### File Extensions
- `.tsx` for React components
- `.ts` for utilities/types/configs
- `.jsx` for existing JS files (legacy, migrate to TSX)

### TypeScript
- Strict mode enabled (`strict: true`)
- No unused locals/parameters allowed
- Define interfaces/types for component props
- Use `type` for unions/intersections, `interface` for objects

### Naming Conventions
- **Components**: PascalCase (`SolutionLanding`, `CodeBlock`)
- **Functions/Variables**: camelCase (`handleClick`, `selectedFile`)
- **Types/Interfaces**: PascalCase (`TerraformFile`, `ToolConfig`)
- **Constants**: UPPER_CASE for true constants
- **Files**: PascalCase for components, camelCase for utilities

### Component Structure
```tsx
// Named export for components
export function ComponentName({ prop }: Props) {
  // Hooks first
  const [state, setState] = useState()
  
  // Handler functions
  const handleClick = () => {}
  
  // Render
  return <div />
}
```

### Formatting
- Single quotes for strings
- Semicolons required
- Trailing commas in multiline objects
- 2-space indentation
- Max line length: ~100 chars (soft)

### CSS/Styling
- Inline styles with `style={{}}` for dynamic values
- CSS variables for theming (`var(--accent-blue)`)
- Tailwind classes for utilities (`className="flex items-center gap-2"`)
- Glassmorphism design pattern (`.glass` class)

### Error Handling
- TypeScript strict mode catches type errors
- Runtime errors: minimal error boundaries
- Form/input validation: defensive checks

### React Patterns
- Functional components only
- Hooks for state management
- `useCallback` for memoized handlers
- React Router v7 for routing

### Git/Commit Convention
- Conventional Commits: `type(scope): message`
- Types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`
- Example: `feat(openclaw): add download all button`

## Project Structure
```
src/
  components/     # Shared components
  tools/solution/ # Tool-specific features
  App.jsx         # Main app + routing
  main.jsx        # Entry point
  index.css       # Global styles
```

## Deployment
- **Netlify**: `npm run build` → `dist/`
- **Docker**: Multi-stage build (Node → Nginx)
- **Coolify**: Docker-compose with Nginx

## Key Dependencies
- React 19.2, React Router 7.13
- Tailwind CSS 4.1 (Vite plugin)
- TypeScript 5.9 (strict mode)
- ESLint 9.39 (flat config)

## Cursor/Copilot Rules
No specific rules configured. Follow existing patterns:
- Match component structure in `src/tools/solution/`
- Use existing CSS variables from `index.css`
- Follow routing pattern in `App.jsx`
