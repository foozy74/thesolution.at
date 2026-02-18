# Solution Template

Use this template to create new solution pages with consistent design.

## Quick Start

1. **Create new folder**: `src/tools/solution/<solution-name>-iac/`
2. **Copy template files**:
   - `ToolTemplate.tsx` → `<SolutionName>Tool.tsx`
   - Create `components/ArchitectureDiagram.tsx` (customize)
   - Create `components/CodeBlock.tsx` (or reuse from template)
3. **Configure**: Update the config object with your solution's data
4. **Add route**: Add to `App.jsx`

## File Structure

```
_template/
├── ToolTemplate.tsx      # Main template component
├── config.ts             # Example configuration
└── components/
    ├── ArchitectureDiagram.tsx  # SVG diagram template
    └── CodeBlock.tsx            # Code display component
```

## Usage Example

```tsx
import { ToolTemplate } from '../_template/ToolTemplate';

const myConfig = {
  title: 'My Solution IaC',
  subtitle: 'Infrastructure-as-Code for My Solution.',
  icon: '🚀',
  files: [
    {
      id: 'provider',
      name: 'Provider',
      filename: 'provider.tf',
      icon: '☁️',
      description: 'Configure provider',
      category: 'core',
      securityNotes: ['Note 1'],
      content: 'provider "my" { ... }',
    },
  ],
  categories: [
    { id: 'all', label: 'All', icon: '📁' },
    { id: 'core', label: 'Core', icon: '☁️' },
  ],
  featureLayers: [
    {
      icon: '☁️',
      title: 'Cloud',
      bgClass: 'bg-blue-500/10',
      items: ['Feature 1', 'Feature 2'],
    },
  ],
};

export function MySolutionTool() {
  return <ToolTemplate config={myConfig} />;
}
```

## ArchitectureDiagram Customization

Create your own `components/ArchitectureDiagram.tsx`:

```tsx
export function ArchitectureDiagram() {
  return (
    <div className="space-y-2">
      <div className="w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[700px] p-6">
          <svg viewBox="0 0 900 520" ...>
            {/* Your custom SVG diagram */}
          </svg>
        </div>
      </div>
    </div>
  );
}
```

### Design Guidelines

- Use `var(--bg-color)` for backgrounds
- Use CSS classes for gradients and colors
- Keep consistent padding and margins
- Use icons from openclaw-iac as reference
