# @grokify/site-nav

Reusable site navigation components built with Lit Web Components. These components provide consistent navigation, headers, filters, badges, and theming across multiple websites.

## Features

- **Design System Integration** - All components use CSS custom properties from a centralized design system spec
- **Dark/Light Theme Support** - Automatic theme switching with system preference detection
- **Accessible** - Proper ARIA attributes and keyboard navigation
- **Customizable** - Override any design token via CSS custom properties

## Components

### `<wt-nav>`

Tab-style navigation component with support for counts and icons.

```html
<wt-nav
  .items=${[
    { id: 'overview', label: 'Overview' },
    { id: 'colors', label: 'Colors', count: 12 },
    { id: 'components', label: 'Components', count: 8 }
  ]}
  active="overview"
  theme="dark"
></wt-nav>
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `items` | `NavItem[]` | Array of navigation items |
| `active` | `string` | ID of the active item |
| `theme` | `'light' \| 'dark'` | Theme variant |
| `orientation` | `'horizontal' \| 'vertical'` | Layout direction |

**Events:**

- `wt-nav-change` - Fired when active item changes

### `<wt-header>`

Page header with title, version badge, description, and action buttons.

```html
<wt-header
  title="My Application"
  version="1.0.0"
  description="Application description"
  .actions=${[
    { id: 'save', label: 'Save', variant: 'primary' },
    { id: 'settings', label: 'Settings' }
  ]}
  theme="dark"
></wt-header>
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `title` | `string` | Page title |
| `version` | `string` | Version badge text |
| `description` | `string` | Description text |
| `actions` | `HeaderAction[]` | Action buttons |
| `theme` | `'light' \| 'dark'` | Theme variant |

**Events:**

- `wt-header-action` - Fired when an action button is clicked

### `<wt-filter-group>`

Filter toggle buttons for filtering data by categories.

```html
<wt-filter-group
  name="status"
  label="Status"
  .options=${[
    { value: 'active', label: 'Active', color: '#10b981', checked: true },
    { value: 'pending', label: 'Pending', color: '#f59e0b', checked: true }
  ]}
  showActions
  theme="dark"
></wt-filter-group>
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Filter group name |
| `label` | `string` | Label above options |
| `options` | `FilterOption[]` | Filter options |
| `showActions` | `boolean` | Show Select All / Clear All buttons |
| `theme` | `'light' \| 'dark'` | Theme variant |

**Events:**

- `wt-filter-change` - Fired when selection changes

### `<wt-badge>`

Badge for displaying status, counts, or maturity levels.

```html
<wt-badge variant="success">Active</wt-badge>
<wt-badge variant="m3">M3</wt-badge>
<wt-badge count="42"></wt-badge>
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `variant` | `BadgeVariant` | Color variant |
| `count` | `number` | Display a number |
| `size` | `'sm' \| 'md' \| 'lg'` | Size variant |
| `outline` | `boolean` | Use outline style |
| `theme` | `'light' \| 'dark'` | Theme variant |

**Variants:** `default`, `primary`, `success`, `warning`, `error`, `info`, `m1`, `m2`, `m3`, `m4`, `m5`

### `<wt-theme-toggle>`

Theme toggle control supporting light/dark/system modes with localStorage persistence.

```html
<!-- Simple icon toggle -->
<wt-theme-toggle></wt-theme-toggle>

<!-- Segmented control with all three options -->
<wt-theme-toggle variant="segmented"></wt-theme-toggle>

<!-- With labels -->
<wt-theme-toggle variant="segmented" show-label></wt-theme-toggle>
```

**Properties:**

| Property | Type | Description |
|----------|------|-------------|
| `mode` | `'light' \| 'dark' \| 'system'` | Current theme mode |
| `variant` | `'icon' \| 'segmented'` | Toggle style |
| `show-label` | `boolean` | Show text labels |
| `persist` | `boolean` | Save preference to localStorage (default: true) |
| `target-selector` | `string` | Element to apply theme attribute to (default: 'html') |

**Events:**

- `wt-theme-change` - Fired when theme changes, includes `{ theme, resolvedTheme }`

## Design System

The package includes a comprehensive design system specification that defines:

- **Color Palette** - Slate, cyan, emerald, amber, red, blue scales
- **Semantic Colors** - Background, text, border, accent, status, maturity colors for light/dark themes
- **Typography** - Font families, sizes, weights, line heights
- **Spacing** - Consistent spacing scale
- **Border Radius** - Small to full radius options
- **Shadows** - Theme-aware shadow definitions
- **Transitions** - Fast, normal, slow timing

### Using the Design System

```typescript
import { designSystem, generateCSSVariables, themeCSS } from '@grokify/site-nav';

// Access design tokens programmatically
console.log(designSystem.colors.dark.accent.default); // '#22d3ee'

// Generate CSS variables for a theme
const darkVars = generateCSSVariables('dark');

// Include theme CSS in your styles
const styles = `${themeCSS}`;
```

### CSS Custom Properties

All components use `--ds-*` prefixed variables from the design system:

```css
/* Example: Override accent color */
:root {
  --ds-accent: #ff6b6b;
  --ds-accent-hover: #ee5a5a;
}
```

## Installation

```bash
pnpm add @grokify/site-nav
```

## Usage

```typescript
import { WtNav, WtHeader, WtBadge, WtFilterGroup } from '@grokify/site-nav';

// Components are automatically registered as custom elements
// Use them in your HTML:
// <wt-nav>, <wt-header>, <wt-badge>, <wt-filter-group>
```

## Theming

Components use CSS custom properties for theming. Override these properties to customize:

```css
wt-nav {
  --wt-theme-bg-primary: #1a1a2e;
  --wt-theme-accent: #ff6b6b;
  --wt-theme-text-primary: #eaeaea;
}
```

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build
pnpm build
```

## License

MIT
