# Changelog

All notable changes to web-tools will be documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-04-25

### Added

- Initial monorepo setup with pnpm workspaces
- **@grokify/markdown-editor** - Markdown editor with live preview
  - Split-pane layout
  - GitHub Flavored Markdown support
  - PDF and DOCX export (optional)
  - Theming support
- **@grokify/jwt-editor** - JWT token decoder
  - Automatic token parsing
  - Header/payload/signature display
  - Timestamp conversion
  - Validation with warnings/errors
  - Theming support
- **@grokify/coordinate-picker** - SVG coordinate picker
  - Image upload (drag & drop)
  - Multi-shape support
  - Pin placement and sharing
  - Zoom controls
  - Live SVG preview
  - Theming support
- E2E testing infrastructure with w3pilot
- MkDocs documentation site
- GitHub Actions CI/CD workflows

### Migration Notes

This release consolidates three tools into a single monorepo:

| Previous Location | New Package |
|-------------------|-------------|
| `grokify/markdown-editor` | `@grokify/markdown-editor` |
| `grokify/jwt-editor` | `@grokify/jwt-editor` |
| `grokify/brandkit/tools` | `@grokify/coordinate-picker` |

[0.1.0]: https://github.com/grokify/web-tools/releases/tag/v0.1.0
