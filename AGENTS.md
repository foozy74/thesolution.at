# AGENTS.md - Development Guidelines

## Project Overview
Next.js 15 + TypeScript SPA for IT consulting homepage with interactive solutions/tools.
Uses App Router architecture with server components.

## Build & Development Commands

```bash
npm run dev       # Start dev server (Next.js) - http://localhost:3000
npm run build     # Build for production
npm run lint      # Run ESLint
npm run start     # Start production server
npm run typecheck # TypeScript type checking (if configured)
```

**Note:** No test framework configured. Project uses manual/visual testing.

## Single Test Execution
No automated tests exist. For manual testing:
1. Run `npm run dev`
2. Navigate to specific route (e.g., `/tools/solution/openclaw-iac`)
3. Verify functionality in browser

## Code Style Guidelines

### Imports
- React hooks first: `import { useState, useEffect } from 'react'`
- Next.js components next: `import Link from 'next/link'`
- Third-party libraries
- Local imports last (use `@/` alias for root)
- Named imports preferred over default

### File Extensions
- `.tsx` for React components
- `.ts` for utilities/types/configs
- `.css` for styles

### TypeScript
- Strict mode enabled (`strict: true`)
- No unused locals/parameters (prefix with `_` to ignore)
- Define interfaces/types for component props
- Use `type` for unions/intersections, `interface` for objects
- Paths: `@/*` maps to root directory

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
- Tailwind CSS 4.1 for utilities
- CSS variables for theming (`var(--accent-blue)`)
- `clsx` and `tailwind-merge` for conditional classes
- Global styles in `app/globals.css`

### Error Handling
- TypeScript strict mode catches type errors
- Runtime errors: error boundaries in `app/global-error.tsx`
- Form/input validation: defensive checks
- Sentry integration for error tracking

### React/Next.js Patterns
- Functional components only
- App Router architecture (server components by default)
- Hooks for state management (client components)
- `use client` directive for client-side components
- `useCallback` for memoized handlers

### Git/Commit Convention
- Conventional Commits: `type(scope): message`
- Types: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`
- Example: `feat(openclaw): add download all button`

## Project Structure
```
app/              # App Router pages & layouts
  layout.tsx      # Root layout
  page.tsx        # Homepage
  globals.css     # Global styles
  tools/          # Tool routes
components/       # Shared components
  Navbar.tsx
  Footer.tsx
  CookieBanner.tsx
public/           # Static assets
```

## Deployment
- **Netlify**: `npm run build` → `.next/standalone`
- **Docker**: Multi-stage build (Node → Nginx)
- **Coolify**: Docker-compose with Nginx

## Key Dependencies
- Next.js 15.5, React 19.2
- Tailwind CSS 4.1
- TypeScript 5.9 (strict mode)
- ESLint 9.39 (flat config)
- Sentry 10.43 (error tracking)

## Cursor/Copilot Rules
No specific rules configured. Follow existing patterns:
- Match component structure in `components/`
- Use existing CSS variables from `app/globals.css`
- Follow App Router patterns in `app/`
- Use `@/` path alias for imports
