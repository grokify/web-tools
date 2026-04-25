# Technical Requirements Document (TRD)

## web-tools Monorepo

**Version:** 0.1.0
**Date:** 2026-04-25
**Status:** Draft

## 1. Architecture Overview

### 1.1 Monorepo Structure

```
grokify/web-tools/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # Lint, test, build all packages
│       └── release.yml               # Publish to npm on tag
├── package.json                      # Workspace root
├── pnpm-workspace.yaml               # pnpm workspace config
├── tsconfig.base.json                # Shared TypeScript config
├── vite.config.shared.ts             # Shared Vite config
├── packages/
│   ├── markdown-editor/
│   │   ├── package.json              # @grokify/markdown-editor
│   │   ├── tsconfig.json             # Extends base
│   │   ├── vite.config.ts            # Extends shared
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── components/
│   │   │   ├── utils/
│   │   │   └── styles/
│   │   └── dist/                     # Build output
│   ├── jwt-editor/
│   │   ├── package.json              # @grokify/jwt-editor
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   └── jwt-editor.ts
│   │   └── dist/
│   └── coordinate-picker/
│       ├── package.json              # @grokify/coordinate-picker
│       ├── tsconfig.json
│       ├── vite.config.ts
│       ├── src/
│       │   ├── index.ts
│       │   ├── components/
│       │   │   ├── coordinate-picker.ts
│       │   │   ├── cp-canvas.ts
│       │   │   ├── cp-toolbar.ts
│       │   │   ├── cp-shape-cards.ts
│       │   │   └── cp-output.ts
│       │   ├── utils/
│       │   │   ├── state.ts          # From existing coordinate-picker.ts
│       │   │   └── svg.ts
│       │   └── styles/
│       └── dist/
├── shared/
│   ├── theming/
│   │   ├── plexus-theme.css          # PlexusOne CSS custom properties
│   │   └── theme-utils.ts            # Theme detection helpers
│   └── build/
│       └── vite-plugin-bundle.ts     # Shared bundle config
├── examples/
│   ├── markdown-editor.html
│   ├── jwt-editor.html
│   └── coordinate-picker.html
└── docs/
    ├── getting-started.md
    ├── theming.md
    └── contributing.md
```

### 1.2 Package Manager

**Choice:** pnpm with workspaces

**Rationale:**

- Efficient disk usage (symlinked node_modules)
- Strict dependency resolution
- Built-in workspace support
- Faster than npm/yarn for monorepos

### 1.3 Build System

**Choice:** Vite + esbuild

**Rationale:**

- Fast development server with HMR
- esbuild for production builds (fast, small output)
- Native TypeScript support
- Library mode for Web Component bundles

## 2. Package Specifications

### 2.1 Common Package Structure

Each package produces:

| Output | Format | Purpose |
|--------|--------|---------|
| `dist/[name].es.js` | ESM | Modern bundlers (Vite, webpack, Rollup) |
| `dist/[name].umd.js` | UMD | Legacy bundlers, AMD loaders |
| `dist/[name].min.js` | IIFE (minified) | Direct `<script>` tag usage |
| `dist/[name].d.ts` | TypeScript declarations | Type support |
| `dist/[name].css` | CSS (if applicable) | Optional external styles |

### 2.2 Package.json Template

```json
{
  "name": "@grokify/[tool-name]",
  "version": "0.1.0",
  "type": "module",
  "main": "dist/[tool-name].umd.js",
  "module": "dist/[tool-name].es.js",
  "types": "dist/[tool-name].d.ts",
  "exports": {
    ".": {
      "types": "./dist/[tool-name].d.ts",
      "import": "./dist/[tool-name].es.js",
      "require": "./dist/[tool-name].umd.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "dev": "vite",
    "build": "vite build && tsc --emitDeclarationOnly",
    "preview": "vite preview"
  },
  "dependencies": {
    "lit": "^3.2.0"
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "vite": "^6.0.0"
  }
}
```

### 2.3 Shared Vite Configuration

```typescript
// vite.config.shared.ts
import { defineConfig } from 'vite';

export function createLibraryConfig(name: string, entry: string) {
  return defineConfig({
    build: {
      lib: {
        entry,
        name: toPascalCase(name),
        formats: ['es', 'umd', 'iife'],
        fileName: (format) => {
          if (format === 'iife') return `${name}.min.js`;
          return `${name}.${format}.js`;
        },
      },
      rollupOptions: {
        external: [], // Bundle all dependencies for IIFE
        output: {
          globals: {},
        },
      },
      minify: 'esbuild',
      sourcemap: true,
    },
  });
}
```

## 3. Theming System

### 3.1 CSS Custom Properties API

All tools expose theming via CSS custom properties with consistent naming:

```css
/* Component-specific (tool sets these internally) */
--[tool]-bg-primary
--[tool]-bg-secondary
--[tool]-text-primary
--[tool]-text-secondary
--[tool]-accent
--[tool]-border
--[tool]-font-sans
--[tool]-font-mono

/* Example: markdown-editor */
--mde-bg-primary: var(--plexus-bg-primary, #0a0e1a);
--mde-accent: var(--plexus-accent, #06b6d4);
```

### 3.2 PlexusOne Theme Integration

```css
/* shared/theming/plexus-theme.css */
:root {
  /* PlexusOne Design System tokens */
  --plexus-dark: #0a0e1a;
  --plexus-slate: #1e293b;
  --plexus-cyan: #06b6d4;
  --plexus-text: #f1f5f9;
  --plexus-text-muted: #94a3b8;

  /* Semantic mappings */
  --plexus-bg-primary: var(--plexus-dark);
  --plexus-bg-secondary: var(--plexus-slate);
  --plexus-accent: var(--plexus-cyan);
}
```

### 3.3 Theme Attribute

Each component supports a `theme` attribute for explicit theme control:

```html
<markdown-editor theme="dark"></markdown-editor>
<jwt-editor theme="light"></jwt-editor>
```

Implementation pattern:

```typescript
@property({ type: String, reflect: true })
theme: 'light' | 'dark' | 'auto' = 'dark';

static styles = css`
  :host([theme='dark']) {
    --internal-bg: var(--mde-bg-primary, #0a0e1a);
  }
  :host([theme='light']) {
    --internal-bg: var(--mde-bg-primary, #ffffff);
  }
`;
```

## 4. Coordinate Picker Conversion

### 4.1 Component Architecture

Convert from monolithic HTML + inline JS to Lit component hierarchy:

```
<coordinate-picker>
├── <cp-toolbar>          # File input, zoom controls, shape selector
├── <cp-canvas>           # Image display, pin placement, markers
├── <cp-shape-cards>      # Shape list with points display
└── <cp-output>           # SVG preview and code output
```

### 4.2 State Management

Extract existing state logic from `coordinate-picker.ts` into `utils/state.ts`:

```typescript
// packages/coordinate-picker/src/utils/state.ts
export interface CoordinatePickerState { ... }  // Existing types
export function createInitialState(...) { ... }  // Existing functions
export function addPinToShape(...) { ... }
// ... rest of pure functions
```

Component uses reactive controller or simple state object:

```typescript
// packages/coordinate-picker/src/components/coordinate-picker.ts
@customElement('coordinate-picker')
export class CoordinatePicker extends LitElement {
  @state()
  private _state = createInitialState(4);

  // Methods delegate to pure functions from utils/state.ts
}
```

### 4.3 Event API

```typescript
// Events emitted by coordinate-picker
interface CoordinatePickerEventMap {
  'pin-added': CustomEvent<{ pin: Pin; shapeIndex: number }>;
  'pin-removed': CustomEvent<{ pinId: number }>;
  'shape-changed': CustomEvent<{ shapeIndex: number; pins: Pin[] }>;
  'svg-generated': CustomEvent<{ svg: string }>;
}
```

## 5. Dependencies

### 5.1 Shared Dependencies (workspace root)

| Dependency | Version | Purpose |
|------------|---------|---------|
| lit | ^3.2.0 | Web Component framework |
| typescript | ^5.7.0 | Type checking |
| vite | ^6.0.0 | Build tool |
| vitest | ^2.1.0 | Testing |

### 5.2 Package-Specific Dependencies

| Package | Dependency | Purpose |
|---------|------------|---------|
| markdown-editor | markdown-it | Markdown parsing |
| markdown-editor | html2pdf.js (peer) | PDF export |
| markdown-editor | docx (peer) | DOCX export |
| jwt-editor | (none) | Pure JS decoding |
| coordinate-picker | (none) | Pure JS/Canvas |

## 6. Testing Strategy

### 6.1 Test Structure

```
packages/[tool]/
├── src/
└── tests/
    ├── unit/           # Pure function tests
    ├── component/      # Lit component tests
    └── e2e/            # Playwright browser tests (optional)
```

### 6.2 Test Tools

| Tool | Purpose |
|------|---------|
| vitest | Unit and component tests |
| @open-wc/testing | Web Component test helpers |
| playwright | E2E tests (optional) |

## 7. CI/CD

### 7.1 CI Pipeline (ci.yml)

```yaml
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm -r build
      - run: pnpm -r test
```

### 7.2 Release Pipeline (release.yml)

```yaml
on:
  push:
    tags: ['@grokify/*@*']  # e.g., @grokify/markdown-editor@0.2.0
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm -r build
      - run: pnpm publish --filter "@grokify/*" --access public
```

## 8. PlexusOne Integration

### 8.1 Deployment to plexusone.dev/tools/

Each tool's minified IIFE bundle is copied to PlexusOne:

```
plexusone.github.io/
├── apps/web/public/tools/
│   ├── markdown-editor/
│   │   ├── index.html
│   │   └── markdown-editor.min.js  # From web-tools build
│   ├── jwt-editor/
│   │   ├── index.html
│   │   └── jwt-editor.min.js
│   └── coordinate-picker/
│       ├── index.html
│       └── coordinate-picker.min.js
```

### 8.2 Integration HTML Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tool Name - PlexusOne Tools</title>
  <link rel="stylesheet" href="/css/plexusone-tools.css">
</head>
<body>
  <div id="plexus-nav-root"></div>
  <script src="/js/plexus-nav.js"></script>

  <main>
    <tool-element theme="dark"></tool-element>
  </main>

  <script src="./tool-name.min.js"></script>
</body>
</html>
```
