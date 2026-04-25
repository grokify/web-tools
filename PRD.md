# Product Requirements Document (PRD)

## web-tools Monorepo

**Version:** 0.1.0
**Date:** 2026-04-25
**Status:** Draft

## 1. Overview

### 1.1 Problem Statement

Multiple standalone browser-based developer tools exist across separate repositories:

- `grokify/markdown-editor` - Markdown editing with live preview
- `grokify/jwt-editor` - JWT token decoding and inspection
- `grokify/brandkit/tools` - SVG coordinate picker for polygon creation

These tools share common patterns (Lit Web Components, theming, build tooling) but are maintained separately, leading to:

- Duplicated build configuration
- Inconsistent dependency versions
- Higher maintenance overhead for low-activity projects
- No shared theming infrastructure

### 1.2 Solution

Consolidate all browser-based developer tools into a single monorepo (`grokify/web-tools`) with:

- Shared build tooling and configuration
- Unified theming system via CSS custom properties
- Consistent package structure across all tools
- Single dependency management

### 1.3 Target Users

- Developers needing browser-based utilities
- PlexusOne website visitors (tools hosted at plexusone.dev/tools/)
- Contributors who want to add new tools

## 2. Product Goals

| Goal | Success Metric |
|------|----------------|
| Reduce maintenance overhead | Single build config, shared dependencies |
| Consistent user experience | Unified theming across all tools |
| Easy tool addition | New tool scaffolding in < 30 minutes |
| PlexusOne integration | All tools deployable to plexusone.dev/tools/ |

## 3. Tools Inventory

### 3.1 Markdown Editor

**Description:** Client-side Markdown editor with live preview and export capabilities.

**Features:**

- Split-pane editor/preview layout
- GitHub Flavored Markdown support
- PDF export (via html2pdf.js)
- DOCX export (via docx library)
- Syntax highlighting in preview
- Autosave to localStorage

**Current State:** Functional Lit Web Component in `grokify/markdown-editor/web/`

### 3.2 JWT Editor

**Description:** JWT token decoder and inspector for debugging authentication.

**Features:**

- Paste JWT to decode
- Header/payload/signature breakdown
- Timestamp field conversion (iat, exp, nbf)
- Copy decoded sections
- Validation status display

**Current State:** Functional Lit Web Component in `grokify/jwt-editor/web/`

### 3.3 Coordinate Picker

**Description:** Image-based coordinate picker for creating SVG polygons.

**Features:**

- Image upload (drag & drop or file picker)
- Click to place coordinate pins
- Multiple shape support (up to 20 polygons)
- Pin sharing between shapes
- Zoom controls
- Live SVG preview
- Copy individual polygon or full SVG output

**Current State:** Plain TypeScript + HTML in `grokify/brandkit/tools/`. Requires conversion to Lit Web Component.

## 4. Requirements

### 4.1 Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1 | All tools must work as standalone Web Components | P0 |
| FR-2 | Tools must support dark/light theme switching | P1 |
| FR-3 | Tools must be usable without build step (CDN/script tag) | P0 |
| FR-4 | Tools must work offline after initial load | P2 |
| FR-5 | Each tool must be independently publishable to npm | P1 |

### 4.2 Non-Functional Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| NFR-1 | Bundle size < 100KB gzipped per tool (excluding optional deps) | P1 |
| NFR-2 | First paint < 500ms on 3G connection | P2 |
| NFR-3 | WCAG 2.1 AA accessibility compliance | P2 |
| NFR-4 | Works in Chrome, Firefox, Safari, Edge (latest 2 versions) | P0 |

### 4.3 Integration Requirements

| ID | Requirement | Priority |
|----|-------------|----------|
| IR-1 | PlexusOne theming via `--plexus-*` CSS custom properties | P0 |
| IR-2 | Each tool provides IIFE bundle for script tag usage | P0 |
| IR-3 | ESM bundle for modern bundler integration | P1 |
| IR-4 | TypeScript type definitions included | P1 |

## 5. Out of Scope

- Server-side functionality
- User accounts or authentication
- Data persistence beyond localStorage
- Mobile-native apps
- Electron/desktop packaging

## 6. Success Criteria

1. All three tools migrated and functional in monorepo
2. Shared build produces correct bundles for each tool
3. PlexusOne integration works with existing tools page
4. Documentation covers tool usage and contribution

## 7. Timeline

| Phase | Deliverable | Target |
|-------|-------------|--------|
| Phase 1 | Monorepo structure + markdown-editor migration | Week 1 |
| Phase 2 | jwt-editor migration | Week 1 |
| Phase 3 | coordinate-picker conversion + migration | Week 2 |
| Phase 4 | Shared theming + PlexusOne integration | Week 2 |
