# web-tools v0.1.0 Release Notes

**Release Date:** 2026-05-25

This is the initial release of `web-tools`, a monorepo containing browser-based developer tools built with [Lit](https://lit.dev/) Web Components. Each tool works offline after initial load and can be embedded in any web page.

## Highlights

- **Standalone Developer Tools**: Three production-ready tools for common developer tasks
- **Lit Web Components**: Modern, lightweight components with excellent performance
- **Offline-First**: All tools work without network connectivity after initial load
- **Themeable**: Light and dark theme support across all components
- **Embeddable**: Use as standalone pages or embed in any web application

## Tools

### Markdown Editor

Live preview editor with GitHub Flavored Markdown support.

- Syntax highlighting with CodeMirror
- Real-time preview rendering
- Export to HTML, PDF, and raw Markdown
- Copy rendered HTML to clipboard

```bash
npm install @grokify/markdown-editor
```

### JWT Editor

Decode, edit, and re-sign JSON Web Tokens.

- Support for HS256, HS384, and HS512 algorithms
- Live payload editing with JSON validation
- Signature verification
- Token expiration display

```bash
npm install @grokify/jwt-editor
```

### Coordinate Picker

Interactive map tool for geographic coordinate selection.

- Click-to-select coordinates on map
- Manage multiple coordinate sets
- Export coordinates as JSON or CSV
- Leaflet-based map with multiple tile layers

```bash
npm install @grokify/coordinate-picker
```

## Components

### site-nav

Reusable navigation components for building consistent site UIs.

| Component | Description |
|-----------|-------------|
| `wt-navbar` | Main navigation bar with brand, links, dropdowns, mobile menu |
| `wt-header` | Page header with title, version badge, description |
| `wt-badge` | Status and maturity level badges |
| `wt-theme-toggle` | Light/dark theme toggle button |
| `wt-mega-menu` | Full-width dropdown menu for product navigation |
| `wt-mobile-menu` | Mobile-responsive navigation menu |

```bash
npm install @grokify/site-nav
```

## Infrastructure

- **Monorepo**: pnpm workspaces for efficient package management
- **Testing**: w3pilot E2E testing infrastructure
- **CI/CD**: GitHub Actions workflows for automated builds and tests
- **Documentation**: MkDocs site with Material theme

## Documentation

- [Getting Started](https://grokify.github.io/web-tools/getting-started/)
- [Theming Guide](https://grokify.github.io/web-tools/development/theming/)
- [Local Development](https://grokify.github.io/web-tools/development/local-development/)
- [Contributing](https://grokify.github.io/web-tools/development/contributing/)

## Installation

Install individual packages via npm:

```bash
npm install @grokify/markdown-editor
npm install @grokify/jwt-editor
npm install @grokify/coordinate-picker
npm install @grokify/site-nav
```

Or use via CDN:

```html
<script type="module" src="https://unpkg.com/@grokify/markdown-editor"></script>
```

## License

`web-tools` is released under the MIT License.
