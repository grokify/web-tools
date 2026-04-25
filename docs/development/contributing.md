# Contributing

Thank you for your interest in contributing to web-tools!

## Development Setup

### Prerequisites

- Node.js 20+
- pnpm 9+
- Go 1.24+ (for E2E tests)

### Clone and Install

```bash
git clone https://github.com/grokify/web-tools.git
cd web-tools
pnpm install
```

### Build

```bash
# Build all packages
pnpm build

# Build specific package
cd packages/jwt-editor
pnpm build
```

### Development Server

```bash
# Start dev server for a package
cd packages/jwt-editor
pnpm dev

# Or serve examples
npx serve examples -p 3000
```

## Project Structure

```
web-tools/
├── packages/
│   ├── markdown-editor/     # @grokify/markdown-editor
│   ├── jwt-editor/          # @grokify/jwt-editor
│   └── coordinate-picker/   # @grokify/coordinate-picker
├── tests/
│   └── e2e/                 # w3pilot E2E tests
├── examples/                # Demo HTML pages
├── docs/                    # MkDocs documentation
└── shared/                  # Shared utilities (future)
```

## Making Changes

### 1. Create a Branch

```bash
git checkout -b feat/my-feature
```

### 2. Make Changes

Edit files in the appropriate package under `packages/`.

### 3. Build and Test

```bash
# Build
pnpm build

# Manual testing
npx serve examples -p 3000
# Open http://localhost:3000/[tool].html

# E2E tests (if applicable)
cd tests/e2e
go test -tags=integration -v ./...
```

### 4. Commit

Use [Conventional Commits](https://conventionalcommits.org/):

```bash
# Feature
git commit -m "feat(jwt-editor): add copy button to header"

# Bug fix
git commit -m "fix(coordinate-picker): correct zoom calculation"

# Documentation
git commit -m "docs: update theming guide"
```

### 5. Push and Create PR

```bash
git push origin feat/my-feature
# Create PR on GitHub
```

## Adding a New Tool

### 1. Create Package Structure

```bash
mkdir -p packages/my-tool/src/{components,utils,styles}
```

### 2. Create Configuration Files

**package.json:**

```json
{
  "name": "@grokify/my-tool",
  "version": "0.1.0",
  "type": "module",
  "main": "dist/my-tool.umd.js",
  "module": "dist/my-tool.es.js",
  "scripts": {
    "dev": "vite",
    "build": "vite build && tsc --emitDeclarationOnly --declaration --outDir dist"
  },
  "dependencies": {
    "lit": "^3.2.0"
  }
}
```

**vite.config.ts:**

```typescript
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MyTool',
      formats: ['es', 'umd', 'iife'],
      fileName: (format) => {
        if (format === 'iife') return 'my-tool.min.js';
        return `my-tool.${format}.js`;
      },
    },
  },
});
```

### 3. Create Component

```typescript
// src/components/my-tool.ts
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('my-tool')
export class MyTool extends LitElement {
  @property({ type: String, reflect: true })
  theme: 'dark' | 'light' = 'dark';

  static override styles = css`
    :host {
      display: block;
      /* CSS custom properties for theming */
    }
  `;

  override render() {
    return html`<div>My Tool</div>`;
  }
}
```

### 4. Add Example

Create `examples/my-tool.html` following the pattern of existing examples.

### 5. Add E2E Tests

Create `tests/e2e/my_tool_test.go`.

### 6. Add Documentation

- Create `docs/tools/my-tool.md`
- Update `mkdocs.yml` navigation

## Code Style

- **TypeScript** - Use strict mode, proper types
- **Lit** - Follow Lit best practices
- **CSS** - Use CSS custom properties for theming
- **Go** - Follow standard Go conventions

## Commit Message Guidelines

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no code change |
| `refactor` | Code restructuring |
| `test` | Adding/updating tests |
| `chore` | Maintenance tasks |

Include scope when applicable:

```
feat(jwt-editor): add feature
fix(coordinate-picker): fix bug
docs(theming): update guide
```

## Questions?

- Open an issue on GitHub
- Check existing issues and PRs
