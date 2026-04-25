# Tasks

## web-tools Monorepo Migration

**Status Legend:** `[ ]` Todo | `[~]` In Progress | `[x]` Done | `[-]` Blocked

---

## Phase 1: Repository Setup

- [ ] Initialize git repository (`git init`)
- [ ] Create root `package.json` with pnpm workspaces config
- [ ] Create `pnpm-workspace.yaml`
- [ ] Create `tsconfig.base.json` (shared TypeScript config)
- [ ] Create `vite.config.shared.ts` (shared Vite library config)
- [ ] Create `.gitignore`
- [ ] Create `.npmrc` (pnpm settings)
- [ ] Create `LICENSE` (MIT)
- [ ] Create `README.md` (basic overview)
- [ ] Create directory structure:
  - [ ] `packages/markdown-editor/src/`
  - [ ] `packages/jwt-editor/src/`
  - [ ] `packages/coordinate-picker/src/`
  - [ ] `shared/theming/`
  - [ ] `shared/build/`
  - [ ] `examples/`
  - [ ] `docs/`
  - [ ] `.github/workflows/`
- [ ] Run `pnpm install` to verify workspace setup

---

## Phase 2: Migrate markdown-editor

- [ ] Copy source files from `grokify/markdown-editor/web/src/`
- [ ] Copy and update `package.json`:
  - [ ] Rename to `@grokify/markdown-editor`
  - [ ] Update scripts for monorepo
- [ ] Create `tsconfig.json` extending base
- [ ] Create `vite.config.ts` using shared config
- [ ] Run `pnpm build` and verify outputs:
  - [ ] `dist/markdown-editor.es.js`
  - [ ] `dist/markdown-editor.umd.js`
  - [ ] `dist/markdown-editor.min.js`
  - [ ] `dist/markdown-editor.d.ts`
- [ ] Create `examples/markdown-editor.html`
- [ ] Test component loads and functions in example

---

## Phase 3: Migrate jwt-editor

- [ ] Copy source files from `grokify/jwt-editor/web/src/`
- [ ] Copy and update `package.json`:
  - [ ] Rename to `@grokify/jwt-editor`
  - [ ] Update scripts for monorepo
- [ ] Create `tsconfig.json` extending base
- [ ] Create `vite.config.ts` using shared config
- [ ] Run `pnpm build` and verify outputs:
  - [ ] `dist/jwt-editor.es.js`
  - [ ] `dist/jwt-editor.umd.js`
  - [ ] `dist/jwt-editor.min.js`
  - [ ] `dist/jwt-editor.d.ts`
- [ ] Create `examples/jwt-editor.html`
- [ ] Test component loads and functions in example

---

## Phase 4: Convert and Migrate coordinate-picker

### 4.1 Setup Package Structure

- [ ] Create `packages/coordinate-picker/package.json`
- [ ] Create `packages/coordinate-picker/tsconfig.json`
- [ ] Create `packages/coordinate-picker/vite.config.ts`

### 4.2 Migrate Core Logic

- [ ] Copy `brandkit/tools/src/coordinate-picker.ts` to `src/utils/state.ts`
- [ ] Verify all exports work (types, functions)
- [ ] Create `src/utils/svg.ts` (extract SVG generation if needed)

### 4.3 Create Lit Components

- [ ] Create `src/index.ts` (main entry point with exports)
- [ ] Create `src/components/coordinate-picker.ts` (main component)
  - [ ] Define properties: theme, numShapes
  - [ ] Manage state via `@state()`
  - [ ] Compose sub-components
  - [ ] Handle events from children
- [ ] Create `src/components/cp-toolbar.ts`
  - [ ] File input (drag & drop)
  - [ ] Zoom controls
  - [ ] Shape count selector
  - [ ] Active shape indicator
- [ ] Create `src/components/cp-canvas.ts`
  - [ ] Image display
  - [ ] Click-to-place pins
  - [ ] Marker rendering
  - [ ] Pin context menu
  - [ ] Zoom scaling
- [ ] Create `src/components/cp-shape-cards.ts`
  - [ ] Shape card list
  - [ ] Active shape selection
  - [ ] Points display
  - [ ] Per-shape polygon output
- [ ] Create `src/components/cp-output.ts`
  - [ ] SVG preview
  - [ ] Full SVG code output
  - [ ] Copy to clipboard

### 4.4 Styling

- [ ] Create `src/styles/shared.styles.ts`
- [ ] Implement CSS custom properties for theming
- [ ] Support dark/light theme attribute
- [ ] Ensure PlexusOne CSS property overrides work

### 4.5 Build and Test

- [ ] Run `pnpm build` and verify outputs
- [ ] Create `examples/coordinate-picker.html`
- [ ] Test all functionality:
  - [ ] Image upload (file picker)
  - [ ] Image upload (drag & drop)
  - [ ] Pin placement
  - [ ] Pin context menu
  - [ ] Shape switching
  - [ ] Zoom in/out/reset
  - [ ] Undo last
  - [ ] Clear shape
  - [ ] Clear all
  - [ ] Copy polygon
  - [ ] Copy full SVG
  - [ ] Live preview updates

---

## Phase 5: Shared Theming

- [ ] Create `shared/theming/plexus-theme.css`
- [ ] Create `shared/theming/theme-utils.ts`
- [ ] Update all components to use shared theme properties
- [ ] Test theme switching across all tools
- [ ] Document theming API in `docs/theming.md`

---

## Phase 6: PlexusOne Integration

### 6.1 Update Existing Tools

- [ ] Copy `markdown-editor.min.js` to plexusone.github.io
- [ ] Copy `jwt-editor.min.js` to plexusone.github.io
- [ ] Verify existing tool pages still work

### 6.2 Add Coordinate Picker

- [ ] Create `apps/web/public/tools/coordinate-picker/index.html`
- [ ] Copy `coordinate-picker.min.js` to plexusone.github.io
- [ ] Add to `staticPaths` in `vite.config.ts`
- [ ] Add tool card to `apps/web/public/tools/index.html`
- [ ] Test coordinate-picker on plexusone.dev/tools/

### 6.3 Rebuild PlexusOne

- [ ] Run `npm run build` in `apps/web/`
- [ ] Verify all tools accessible
- [ ] Commit changes to plexusone.github.io

---

## Phase 7: Documentation

- [ ] Create root `README.md` with:
  - [ ] Project overview
  - [ ] Quick start for each tool
  - [ ] Development setup
  - [ ] Build instructions
- [ ] Create `docs/getting-started.md`
- [ ] Create `docs/theming.md`
- [ ] Create `docs/contributing.md`
- [ ] Create per-package README.md files:
  - [ ] `packages/markdown-editor/README.md`
  - [ ] `packages/jwt-editor/README.md`
  - [ ] `packages/coordinate-picker/README.md`

---

## Phase 8: CI/CD

- [ ] Create `.github/workflows/ci.yml`
  - [ ] Checkout
  - [ ] Setup pnpm
  - [ ] Install dependencies
  - [ ] Build all packages
  - [ ] Run tests (when added)
- [ ] Create `.github/workflows/release.yml`
  - [ ] Trigger on version tags
  - [ ] Build packages
  - [ ] Publish to npm

---

## Phase 9: Cleanup

- [ ] Delete local `grokify/markdown-editor/` directory
- [ ] Delete local `grokify/jwt-editor/` directory
- [ ] Remove `tools/` from `grokify/brandkit/`
- [ ] Update `plexusone.github.io/CLAUDE.md`:
  - [ ] Update tool source locations
  - [ ] Add web-tools monorepo reference

---

## Future Enhancements (Backlog)

- [ ] Add ESLint + Prettier
- [ ] Add vitest unit tests for utils
- [ ] Add @open-wc/testing component tests
- [ ] Add Playwright E2E tests
- [ ] Add Changesets for versioning
- [ ] Publish to npm
- [ ] Add tool: Color Picker / Palette Generator
- [ ] Add tool: Base64 Encoder/Decoder
- [ ] Add tool: JSON Formatter/Validator

---

## Notes

**Dependencies to verify before starting:**

- Node.js 20+
- pnpm 9+

**Key files to reference:**

| Source | Target |
|--------|--------|
| `grokify/markdown-editor/web/` | `packages/markdown-editor/` |
| `grokify/jwt-editor/web/` | `packages/jwt-editor/` |
| `grokify/brandkit/tools/src/coordinate-picker.ts` | `packages/coordinate-picker/src/utils/state.ts` |
| `grokify/brandkit/docs/tools/coordinate-picker.html` | Reference for UI implementation |
