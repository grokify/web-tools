# Local Development

This guide covers how to develop with `@grokify/site-nav` locally before it's published to npm, and how downstream projects can consume it.

## Overview

When developing site-nav or consuming it from a project that needs the latest unpublished changes, you have two options:

1. **Local file reference** (`file:` protocol) - For active development
2. **npm link** - Alternative for local development
3. **Published npm package** - For production

## Project Structure

```
~/go/src/github.com/grokify/
├── web-tools/
│   └── packages/
│       └── site-nav/           # @grokify/site-nav source
│           ├── src/
│           ├── dist/           # Built output (after npm run build)
│           └── package.json
│
└── plexusone/
    └── plexusone.github.io/
        └── packages/
            └── plexus-nav/     # Consumes @grokify/site-nav
                └── package.json
```

## Option 1: File Protocol (Recommended)

Use the `file:` protocol in `package.json` to reference the local package:

```json
{
  "dependencies": {
    "@grokify/site-nav": "file:../../../../grokify/web-tools/packages/site-nav"
  }
}
```

### Workflow

1. **Build site-nav** (required after any changes):

    ```bash
    cd ~/go/src/github.com/grokify/web-tools/packages/site-nav
    npm install
    npm run build
    ```

2. **Install in consuming project**:

    ```bash
    cd ~/go/src/github.com/plexusone/plexusone.github.io/packages/plexus-nav
    npm install
    ```

3. **Rebuild when site-nav changes**:

    ```bash
    # After making changes to site-nav
    cd ~/go/src/github.com/grokify/web-tools/packages/site-nav
    npm run build

    # Then rebuild consuming project
    cd ~/go/src/github.com/plexusone/plexusone.github.io/packages/plexus-nav
    npm run build
    ```

### TypeScript Support

When using `file:` protocol, TypeScript may not find type declarations. Create a declaration file in the consuming project:

```typescript
// src/site-nav.d.ts
declare module '@grokify/site-nav' {
  import { CSSResult } from 'lit';

  export interface MenuItem {
    id: string;
    label: string;
    href?: string;
    icon?: string;
    external?: boolean;
  }

  export interface NavbarConfig {
    brand?: NavbarBrand;
    links?: MenuItem[];
    dropdowns?: DropdownMenu[];
    // ... other types
  }

  export function generateCSSVariables(theme: 'light' | 'dark'): CSSResult;
  export const themeCSS: CSSResult;
}
```

## Option 2: npm link

Alternative approach using npm's linking feature:

```bash
# In site-nav directory
cd ~/go/src/github.com/grokify/web-tools/packages/site-nav
npm install
npm run build
npm link

# In consuming project
cd ~/go/src/github.com/plexusone/plexusone.github.io/packages/plexus-nav
npm link @grokify/site-nav
npm install
```

!!! warning "npm link caveats"
    - Links are global and can conflict across projects
    - Must re-link after `npm install`
    - Can cause issues with peer dependencies

## Production: Published npm Package

Once `@grokify/site-nav` is published to npm, switch to the published version:

### Publishing to npm

```bash
cd ~/go/src/github.com/grokify/web-tools/packages/site-nav

# Ensure clean build
npm run clean
npm install
npm run build

# Login and publish
npm login
npm publish --access public
```

### Consuming Published Package

Update `package.json` in consuming projects:

```json
{
  "dependencies": {
    "@grokify/site-nav": "^0.1.0"
  }
}
```

Then install:

```bash
npm install
```

## Build Script for Both Modes

Create a build script that handles both local and production modes:

```bash
#!/bin/bash
# scripts/build.sh

USE_NPM=false

for arg in "$@"; do
    case $arg in
        --npm) USE_NPM=true ;;
    esac
done

if [ "$USE_NPM" = true ]; then
    echo "Using published npm packages (production mode)"
    # Switch to npm version
    sed -i.bak 's|"@grokify/site-nav": "file:[^"]*"|"@grokify/site-nav": "^0.1.0"|' package.json
    rm -f package.json.bak
else
    echo "Using local packages (development mode)"
    # Build site-nav from source
    cd ~/go/src/github.com/grokify/web-tools/packages/site-nav
    npm install && npm run build

    # Ensure file: reference
    cd -
    sed -i.bak 's|"@grokify/site-nav": "[^"]*"|"@grokify/site-nav": "file:path/to/site-nav"|' package.json
    rm -f package.json.bak
fi

npm install
npm run build
```

Usage:

```bash
./scripts/build.sh           # Local development
./scripts/build.sh --npm     # Production (uses npm)
```

## Troubleshooting

### "Cannot find module '@grokify/site-nav'"

- Ensure site-nav is built: `cd site-nav && npm run build`
- Check the `file:` path is correct and the `dist/` directory exists
- For TypeScript, add a declaration file (see above)

### "EUNSUPPORTEDPROTOCOL: link:"

- Use `file:` protocol instead of `link:` in package.json
- `link:` is not supported by all npm versions

### Changes not reflected

- Rebuild site-nav after changes: `npm run build`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear build cache in consuming project

### TypeScript errors about missing types

- Create a `.d.ts` declaration file (see TypeScript Support above)
- Or wait for the package to be published to npm (includes types)
