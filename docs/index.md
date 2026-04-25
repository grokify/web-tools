# web-tools

Browser-based developer tools built with [Lit](https://lit.dev/) Web Components.

## Overview

web-tools is a monorepo containing standalone, themeable web components for common developer tasks. Each tool works offline after initial load and can be embedded in any web page.

## Available Tools

| Tool | Description | Size |
|------|-------------|------|
| [Markdown Editor](tools/markdown-editor.md) | Markdown editor with live preview and PDF/DOCX export | ~159KB |
| [JWT Editor](tools/jwt-editor.md) | JWT token decoder and inspector | ~36KB |
| [Coordinate Picker](tools/coordinate-picker.md) | Image-based SVG polygon coordinate picker | ~43KB |

## Quick Start

### Using via CDN

Each tool is available as a standalone script:

```html
<!-- JWT Editor -->
<script src="https://unpkg.com/@grokify/jwt-editor/dist/jwt-editor.min.js"></script>
<jwt-editor></jwt-editor>
```

### Using via npm

```bash
npm install @grokify/jwt-editor
```

```typescript
import '@grokify/jwt-editor';
```

## Features

- **Standalone** - Each tool is a self-contained Web Component
- **Themeable** - CSS custom properties for easy theming
- **Offline-capable** - Works without network after initial load
- **Accessible** - Built with accessibility in mind
- **Small footprint** - Minimal bundle sizes

## Links

- [GitHub Repository](https://github.com/grokify/web-tools)
- [Getting Started](getting-started.md)
- [Theming Guide](development/theming.md)
- [Contributing](development/contributing.md)
