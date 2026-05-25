# site-nav

Reusable navigation components built with Lit Web Components. Includes navbar, header, badges, theme toggle, and more.

## Overview

`@grokify/site-nav` provides a suite of themeable navigation components designed to be used across multiple sites with consistent styling and behavior.

## Components

| Component | Description |
|-----------|-------------|
| `wt-navbar` | Main navigation bar with brand, links, dropdowns, and mobile menu |
| `wt-header` | Page header with title, version badge, and description |
| `wt-badge` | Status and maturity level badges |
| `wt-theme-toggle` | Light/dark theme toggle button |
| `wt-mega-menu` | Full-width dropdown menu for product navigation |
| `wt-mobile-menu` | Mobile-responsive navigation menu |

## Installation

### Via npm (Production)

```bash
npm install @grokify/site-nav
```

```typescript
import '@grokify/site-nav';
```

### Via CDN

```html
<script type="module" src="https://unpkg.com/@grokify/site-nav/dist/site-nav.es.js"></script>
```

## Usage

### Navbar

The `wt-navbar` component provides a complete navigation bar with support for dropdowns, mega menus, and mobile responsiveness.

```html
<wt-navbar id="navbar" theme="dark"></wt-navbar>

<script type="module">
  const navbar = document.getElementById('navbar');
  navbar.config = {
    baseUrl: '',
    brand: {
      name: 'My Site',
      href: '/',
    },
    links: [
      { id: 'docs', label: 'Docs', href: '/docs' },
      { id: 'api', label: 'API', href: '/api' },
    ],
    dropdowns: [
      {
        id: 'products',
        label: 'Products',
        items: [
          { id: 'product-a', label: 'Product A', href: '/products/a' },
          { id: 'product-b', label: 'Product B', href: '/products/b' },
        ],
      },
    ],
    actions: [
      { id: 'github', label: 'GitHub', href: 'https://github.com/...', external: true },
    ],
  };
</script>
```

#### Navbar Configuration

| Property | Type | Description |
|----------|------|-------------|
| `baseUrl` | `string` | Base URL for relative links |
| `brand` | `NavbarBrand` | Brand logo and name configuration |
| `links` | `MenuItem[]` | Simple navigation links |
| `dropdowns` | `DropdownMenu[]` | Dropdown menus |
| `megaMenu` | `MegaMenuConfig` | Full-width mega menu configuration |
| `actions` | `MenuItem[]` | Action buttons (e.g., GitHub link) |

### Header

```html
<wt-header
  title="Page Title"
  version="1.0.0"
  description="A brief description of this page"
  theme="dark"
></wt-header>
```

### Badge

```html
<!-- Status badges -->
<wt-badge variant="operational">Operational</wt-badge>
<wt-badge variant="in-progress">In Progress</wt-badge>
<wt-badge variant="planned">Planned</wt-badge>

<!-- Maturity badges -->
<wt-badge variant="m1">M1</wt-badge>
<wt-badge variant="m2">M2</wt-badge>
<wt-badge variant="m3">M3</wt-badge>
<wt-badge variant="m4">M4</wt-badge>
<wt-badge variant="m5">M5</wt-badge>

<!-- Sizes -->
<wt-badge variant="operational" size="sm">Small</wt-badge>
<wt-badge variant="operational" size="md">Medium</wt-badge>
```

### Theme Toggle

```html
<wt-theme-toggle variant="icon" theme="dark"></wt-theme-toggle>

<script>
  const toggle = document.querySelector('wt-theme-toggle');
  toggle.addEventListener('wt-theme-change', (e) => {
    const { resolvedTheme } = e.detail;
    document.documentElement.setAttribute('theme', resolvedTheme);
  });
</script>
```

## Theming

All components support light and dark themes via the `theme` attribute:

```html
<!-- Dark theme (default) -->
<wt-navbar theme="dark"></wt-navbar>

<!-- Light theme -->
<wt-navbar theme="light"></wt-navbar>
```

The components use CSS custom properties from the design system. See [Theming Guide](../development/theming.md) for customization options.

## TypeScript

Type definitions are included. Import types as needed:

```typescript
import type {
  NavbarConfig,
  MenuItem,
  DropdownMenu,
  MegaMenuConfig
} from '@grokify/site-nav';
```

## Events

### wt-theme-change

Emitted by `wt-theme-toggle` when the theme changes:

```typescript
interface ThemeChangeEventDetail {
  theme: 'light' | 'dark' | 'system';
  resolvedTheme: 'light' | 'dark';
}
```

### wt-navigate

Emitted by `wt-navbar` when a navigation item is clicked:

```typescript
interface NavigateEventDetail {
  item: MenuItem;
  originalEvent: MouseEvent;
}
```
