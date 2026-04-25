# Implementation Plan

## web-tools Monorepo

**Version:** 0.1.0
**Date:** 2026-04-25
**Status:** Draft

## Phase 1: Repository Setup

### 1.1 Initialize Monorepo

1. Initialize git repository
2. Create root `package.json` with pnpm workspaces
3. Create `pnpm-workspace.yaml`
4. Create shared TypeScript config (`tsconfig.base.json`)
5. Create shared Vite config (`vite.config.shared.ts`)
6. Add `.gitignore`, `.npmrc`, `LICENSE`, `README.md`

### 1.2 Directory Structure

```bash
mkdir -p packages/{markdown-editor,jwt-editor,coordinate-picker}/src
mkdir -p shared/{theming,build}
mkdir -p examples docs .github/workflows
```

### 1.3 Root Configuration Files

**package.json:**
```json
{
  "name": "web-tools",
  "private": true,
  "scripts": {
    "build": "pnpm -r build",
    "dev": "pnpm -r --parallel dev",
    "test": "pnpm -r test",
    "clean": "pnpm -r clean"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "vite": "^6.0.0",
    "vitest": "^2.1.0"
  }
}
```

**pnpm-workspace.yaml:**
```yaml
packages:
  - 'packages/*'
  - 'shared/*'
```

## Phase 2: Migrate markdown-editor

### 2.1 Copy Source Files

```bash
# From grokify/markdown-editor/web/
cp -r src/* packages/markdown-editor/src/
cp package.json packages/markdown-editor/
cp tsconfig.json packages/markdown-editor/
cp vite.config.ts packages/markdown-editor/
```

### 2.2 Update Configuration

1. Update `package.json`:
   - Change name to `@grokify/markdown-editor`
   - Update build scripts for monorepo
   - Add workspace protocol for shared deps if needed

2. Update `tsconfig.json`:
   - Extend from `../../tsconfig.base.json`

3. Update `vite.config.ts`:
   - Import shared config from `../../vite.config.shared.ts`

### 2.3 Verify Build

```bash
cd packages/markdown-editor
pnpm build
# Verify dist/ contains: es.js, umd.js, min.js, d.ts
```

### 2.4 Create Example

Create `examples/markdown-editor.html` that loads the built component.

## Phase 3: Migrate jwt-editor

### 3.1 Copy Source Files

```bash
# From grokify/jwt-editor/web/
cp -r src/* packages/jwt-editor/src/
cp package.json packages/jwt-editor/
cp tsconfig.json packages/jwt-editor/
cp vite.config.ts packages/jwt-editor/
```

### 3.2 Update Configuration

Same pattern as markdown-editor:

1. Rename package to `@grokify/jwt-editor`
2. Extend base configs
3. Update vite config

### 3.3 Verify Build

```bash
cd packages/jwt-editor
pnpm build
```

### 3.4 Create Example

Create `examples/jwt-editor.html`.

## Phase 4: Convert and Migrate coordinate-picker

### 4.1 Extract Core Logic

Copy existing pure functions from `grokify/brandkit/tools/src/coordinate-picker.ts`:

```bash
cp brandkit/tools/src/coordinate-picker.ts packages/coordinate-picker/src/utils/state.ts
```

Refactor `state.ts` to export only pure functions (already done in source).

### 4.2 Create Lit Components

**Main component (`coordinate-picker.ts`):**

```typescript
import { LitElement, html, css } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { createInitialState, CoordinatePickerState } from '../utils/state';

@customElement('coordinate-picker')
export class CoordinatePicker extends LitElement {
  @property({ type: String, reflect: true })
  theme: 'light' | 'dark' = 'dark';

  @state()
  private _state: CoordinatePickerState = createInitialState(4);

  @state()
  private _imageLoaded = false;

  @state()
  private _imageSrc = '';

  // ... implementation
}
```

**Sub-components to create:**

| Component | File | Responsibility |
|-----------|------|----------------|
| `<cp-toolbar>` | `cp-toolbar.ts` | File input, zoom, shape count |
| `<cp-canvas>` | `cp-canvas.ts` | Image display, click handling, markers |
| `<cp-shape-cards>` | `cp-shape-cards.ts` | Shape list, active selection |
| `<cp-output>` | `cp-output.ts` | SVG preview, code output, copy |

### 4.3 Component Communication

Use custom events for child-to-parent communication:

```typescript
// cp-canvas.ts
this.dispatchEvent(new CustomEvent('pin-click', {
  detail: { x, y },
  bubbles: true,
  composed: true
}));

// coordinate-picker.ts
<cp-canvas @pin-click=${this._handlePinClick}></cp-canvas>
```

### 4.4 Styling

Convert existing CSS to Lit CSS-in-JS with theming support:

```typescript
static styles = css`
  :host {
    --cp-bg-primary: var(--plexus-bg-primary, #1a1a2e);
    --cp-bg-secondary: var(--plexus-bg-secondary, #2a2a4a);
    --cp-accent: var(--plexus-accent, #4a4a8a);
    --cp-text: var(--plexus-text, #eee);
  }

  :host([theme='light']) {
    --cp-bg-primary: var(--plexus-bg-primary, #ffffff);
    --cp-bg-secondary: var(--plexus-bg-secondary, #f5f5f5);
  }

  .container {
    background: var(--cp-bg-primary);
    color: var(--cp-text);
  }
`;
```

### 4.5 Create Package Config

Create `packages/coordinate-picker/package.json`:

```json
{
  "name": "@grokify/coordinate-picker",
  "version": "0.1.0",
  "description": "Web component for picking coordinates from images to create SVG polygons",
  "type": "module",
  "main": "dist/coordinate-picker.umd.js",
  "module": "dist/coordinate-picker.es.js",
  "types": "dist/coordinate-picker.d.ts",
  "exports": {
    ".": {
      "types": "./dist/coordinate-picker.d.ts",
      "import": "./dist/coordinate-picker.es.js",
      "require": "./dist/coordinate-picker.umd.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "keywords": ["svg", "coordinate", "picker", "polygon", "web-component", "lit"],
  "dependencies": {
    "lit": "^3.2.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "vite": "^6.0.0"
  }
}
```

### 4.6 Verify Build

```bash
cd packages/coordinate-picker
pnpm build
```

### 4.7 Create Example

Create `examples/coordinate-picker.html` with:

- File upload functionality
- Full component demonstration
- Theme toggle

## Phase 5: Shared Theming

### 5.1 Create Theme CSS

Create `shared/theming/plexus-theme.css`:

```css
:root {
  /* PlexusOne Design Tokens */
  --plexus-dark: #0a0e1a;
  --plexus-slate: #1e293b;
  --plexus-cyan: #06b6d4;
  --plexus-text: #f1f5f9;
  --plexus-text-muted: #94a3b8;

  /* Semantic Mappings */
  --plexus-bg-primary: var(--plexus-dark);
  --plexus-bg-secondary: var(--plexus-slate);
  --plexus-accent: var(--plexus-cyan);
}

[data-theme='light'] {
  --plexus-bg-primary: #ffffff;
  --plexus-bg-secondary: #f8fafc;
  --plexus-text: #1e293b;
  --plexus-text-muted: #64748b;
}
```

### 5.2 Theme Utilities

Create `shared/theming/theme-utils.ts`:

```typescript
export function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function watchSystemTheme(callback: (theme: 'light' | 'dark') => void) {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = (e: MediaQueryListEvent) => callback(e.matches ? 'dark' : 'light');
  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
}
```

## Phase 6: PlexusOne Integration

### 6.1 Build for PlexusOne

```bash
# In web-tools root
pnpm build

# Copy bundles to plexusone.github.io
cp packages/markdown-editor/dist/markdown-editor.min.js \
   ../plexusone.github.io/apps/web/public/tools/markdown-editor/

cp packages/jwt-editor/dist/jwt-editor.min.js \
   ../plexusone.github.io/apps/web/public/tools/jwt-editor/

cp packages/coordinate-picker/dist/coordinate-picker.min.js \
   ../plexusone.github.io/apps/web/public/tools/coordinate-picker/
```

### 6.2 Create Coordinate Picker Tool Page

Create `plexusone.github.io/apps/web/public/tools/coordinate-picker/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SVG Coordinate Picker - PlexusOne Tools</title>
  <link rel="stylesheet" href="/css/plexusone-tools.css">
  <style>
    coordinate-picker {
      --cp-bg-primary: var(--plexus-dark);
      --cp-bg-secondary: var(--plexus-slate);
      --cp-accent: var(--plexus-cyan);
    }
  </style>
</head>
<body>
  <div id="plexus-nav-root"></div>
  <script src="/js/plexus-nav.js"></script>

  <main class="tool-container">
    <coordinate-picker theme="dark"></coordinate-picker>
  </main>

  <script src="./coordinate-picker.min.js"></script>
</body>
</html>
```

### 6.3 Update Tools Index

Add coordinate-picker card to `apps/web/public/tools/index.html`.

### 6.4 Update Vite Config

Add `/tools/coordinate-picker/` to `staticPaths` in `apps/web/vite.config.ts`.

## Phase 7: Documentation

### 7.1 README.md

- Overview of monorepo
- Quick start for each tool
- Development instructions
- Contributing guidelines

### 7.2 Per-Package Documentation

Each package includes:

- `README.md` with usage examples
- API documentation
- Theming guide

### 7.3 docs/ Directory

- `getting-started.md` - Installation and setup
- `theming.md` - Theming system documentation
- `contributing.md` - How to add new tools

## Phase 8: CI/CD Setup

### 8.1 GitHub Actions

Create `.github/workflows/ci.yml` for:

- Install dependencies
- Lint (if eslint added)
- Type check
- Build all packages
- Run tests

### 8.2 Release Workflow

Create `.github/workflows/release.yml` for npm publishing on tag.

## Verification Checklist

### Per-Package Verification

- [ ] `pnpm build` produces all bundle formats
- [ ] TypeScript types exported correctly
- [ ] Component renders in example HTML
- [ ] Theme switching works (dark/light)
- [ ] PlexusOne CSS properties override internal styles

### Integration Verification

- [ ] All tools load on plexusone.dev/tools/
- [ ] Navigation component appears
- [ ] Theme consistent with PlexusOne design
- [ ] No console errors
- [ ] Mobile responsive (basic)

## Rollback Plan

If migration fails:

1. Keep original repos functional
2. PlexusOne tools page falls back to original bundle locations
3. Document issues for retry

## Post-Migration Cleanup

After successful migration:

1. Archive `grokify/markdown-editor` (or delete if never pushed)
2. Archive `grokify/jwt-editor`
3. Update `grokify/brandkit` to remove tools/ directory
4. Update PlexusOne CLAUDE.md with new tool source locations
