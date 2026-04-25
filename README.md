# web-tools

Monorepo for browser-based developer tools built with [Lit](https://lit.dev/) Web Components.

## Packages

| Package | Description | Status |
|---------|-------------|--------|
| [@grokify/markdown-editor](./packages/markdown-editor) | Markdown editor with live preview and PDF/DOCX export | Migrating |
| [@grokify/jwt-editor](./packages/jwt-editor) | JWT token decoder and inspector | Migrating |
| [@grokify/coordinate-picker](./packages/coordinate-picker) | SVG coordinate picker for polygon creation | Converting |

## Quick Start

### Using via CDN/Script Tag

Each tool is available as a standalone script:

```html
<!-- Markdown Editor -->
<script src="https://unpkg.com/@grokify/markdown-editor/dist/markdown-editor.min.js"></script>
<markdown-editor></markdown-editor>

<!-- JWT Editor -->
<script src="https://unpkg.com/@grokify/jwt-editor/dist/jwt-editor.min.js"></script>
<jwt-editor></jwt-editor>

<!-- Coordinate Picker -->
<script src="https://unpkg.com/@grokify/coordinate-picker/dist/coordinate-picker.min.js"></script>
<coordinate-picker></coordinate-picker>
```

### Using via npm

```bash
npm install @grokify/markdown-editor
```

```typescript
import '@grokify/markdown-editor';

// Use in HTML
// <markdown-editor></markdown-editor>
```

## Development

### Prerequisites

- Node.js 20+
- pnpm 9+

### Setup

```bash
# Clone the repository
git clone https://github.com/grokify/web-tools.git
cd web-tools

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Start development server (all packages)
pnpm dev
```

### Project Structure

```
web-tools/
├── packages/
│   ├── markdown-editor/    # @grokify/markdown-editor
│   ├── jwt-editor/         # @grokify/jwt-editor
│   └── coordinate-picker/  # @grokify/coordinate-picker
├── shared/
│   ├── theming/            # Shared CSS custom properties
│   └── build/              # Shared build configuration
├── examples/               # Demo HTML pages
└── docs/                   # Documentation
```

### Building a Single Package

```bash
cd packages/markdown-editor
pnpm build
```

### Running Examples

```bash
# Serve examples directory
npx serve examples
```

## Theming

All components support theming via CSS custom properties:

```css
markdown-editor {
  --mde-bg-primary: #1a1a2e;
  --mde-accent: #06b6d4;
}
```

See [docs/theming.md](./docs/theming.md) for full theming documentation.

## License

MIT
