# AGENTS.md - Development Guidelines

## Project Overview
Next.js 15 + TypeScript SPA for IT consulting homepage with interactive solutions/tools.
Uses App Router architecture with server components.

## Build & Development Commands

```bash
npm run dev          # Start dev server (Next.js) - http://localhost:3000
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Run ESLint with auto-fix
npm run typecheck    # TypeScript type checking
```

### Cache & Troubleshooting
```bash
# Clear Next.js cache (fixes build errors)
rm -rf .next && npm run dev

# Kill dev server
pkill -f "next dev"

# Clean install
rm -rf node_modules .next && npm install && npm run dev
```

### Single Page/Component Testing
No automated test framework. Manual testing workflow:
1. Start dev server: `npm run dev`
2. Navigate to route: `http://localhost:3000/tools/solution/openclaw-iac`
3. Verify in browser + check console for errors
4. For component changes: Hot reload is automatic

### Production Build Testing
```bash
npm run build && npm run start  # Test production build locally
```

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

### Error Handling
- TypeScript strict mode catches type errors
- Runtime errors: error boundaries in `app/global-error.tsx`
- Form/input validation: defensive checks
- Sentry integration for error tracking
- Never expose secrets in client code (use server actions for API keys)

### CSS/Styling
- Tailwind CSS 4.1 for utilities
- CSS variables for theming (`var(--accent-blue)`)
- `clsx` and `tailwind-merge` for conditional classes
- Global styles in `app/globals.css`

### Card Design Standards
Standard padding für alle Glass/Cards: `2.5rem` (40px)

**Card-Struktur:**
```tsx
<div
  className="glass"
  style={{
    padding: "2.5rem",
    borderRadius: "12px",
  }}
>
  {/* Icon mit margin-bottom */}
  <div style={{ marginBottom: "1.5rem" }}>
    <Icon size={48} />
  </div>

  {/* Title */}
  <h4 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
    {title}
  </h4>

  {/* Content */}
  <ul>
    {items.map(item => (
      <li style={{ marginBottom: "0.75rem" }}>{item}</li>
    ))}
  </ul>
</div>
```

**Icon-Animation bei Hover:**
```tsx
style={{
  transform: isHovered ? "scale(1.15) rotate(5deg)" : "scale(1) rotate(0deg)",
  transition: "all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
}}
```

**Standard-Abstände:**
| Element | Wert |
|---------|------|
| Card Padding | `2.5rem` |
| Icon margin-bottom | `1.5rem` |
| Title font-size | `1.5rem` |
| Title margin-bottom | `1rem` |
| List item margin-bottom | `0.75rem` |
| Border radius | `12px` |

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

## AI Assistant Guidelines

### UI/UX Pro Max Skill
The project has UI/UX Pro Max skill installed (`.opencode/skills/ui-ux-pro-max/`).
Use it for UI/UX design decisions by mentioning "UI/UX Pro Max" in requests.

### Component Implementation
When adding new components:
1. Check existing components in `components/` for patterns
2. Use Lucide React for icons: `import { Icon } from "lucide-react"`
3. Add proper TypeScript types for all props
4. Include `use client` directive for client components
5. Follow glassmorphism design system (use `.glass` class)

### Animation Guidelines
- Use CSS animations from `globals.css` (e.g., `animate-float`, `animate-pulse-glow`)
- Respect `prefers-reduced-motion` media query
- Keep animations subtle and performant (200-300ms transitions)
- Use cubic-bezier for smooth easing: `cubic-bezier(0.68, -0.55, 0.265, 1.55)`

### Common Tasks

**Add new page:**
1. Create folder in `app/` (e.g., `app/new-page/page.tsx`)
2. Add `export default function Page()` component
3. Use `use client` if interactive
4. Add to Navbar if needed

**Add new component:**
1. Create file in `components/` (e.g., `MyComponent.tsx`)
2. Use named export: `export function MyComponent()`
3. Define props interface
4. Import in pages as needed

**Add icons:**
```bash
npm install lucide-react
```
```tsx
import { Server, Cloud } from "lucide-react"
<Server size={24} strokeWidth={1.5} />
```

**Add animations:**
```tsx
// Use existing CSS animations
<div className="animate-float">Content</div>

// Or add custom hover effects
const [isHovered, setIsHovered] = useState(false)
<div style={{ 
  transition: "all 0.3s ease",
  transform: isHovered ? "scale(1.1)" : "scale(1)"
}}>
```
