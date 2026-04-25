# Theming

All web-tools components support theming via CSS custom properties and a `theme` attribute.

## Quick Start

### Theme Attribute

Toggle between light and dark modes:

```html
<!-- Dark theme (default) -->
<jwt-editor theme="dark"></jwt-editor>

<!-- Light theme -->
<jwt-editor theme="light"></jwt-editor>
```

### JavaScript Toggle

```javascript
const editor = document.querySelector('jwt-editor');

// Toggle theme
function toggleTheme() {
  editor.theme = editor.theme === 'dark' ? 'light' : 'dark';
}
```

## CSS Custom Properties

Each component exposes CSS custom properties for customization.

### JWT Editor

```css
jwt-editor {
  /* Backgrounds */
  --jwt-theme-bg-primary: #0a0e1a;
  --jwt-theme-bg-secondary: #1e293b;
  --jwt-theme-bg-tertiary: #334155;

  /* Text */
  --jwt-theme-text-primary: #f1f5f9;
  --jwt-theme-text-secondary: #94a3b8;
  --jwt-theme-text-muted: #64748b;

  /* Borders */
  --jwt-theme-border: #334155;

  /* Accent */
  --jwt-theme-accent: #06b6d4;
  --jwt-theme-accent-hover: #22d3ee;

  /* Status */
  --jwt-theme-error: #ef4444;
  --jwt-theme-warning: #f59e0b;
  --jwt-theme-success: #10b981;

  /* Fonts */
  --jwt-theme-font-sans: 'Inter', system-ui, sans-serif;
}
```

### Coordinate Picker

```css
coordinate-picker {
  /* Backgrounds */
  --cp-theme-bg-primary: #1a1a2e;
  --cp-theme-bg-secondary: #2a2a4a;
  --cp-theme-bg-tertiary: #3a3a5a;

  /* Text */
  --cp-theme-text-primary: #eee;
  --cp-theme-text-secondary: #aaa;
  --cp-theme-text-muted: #888;

  /* Borders */
  --cp-theme-border: #4a4a8a;

  /* Accent */
  --cp-theme-accent: #4a4a8a;

  /* Fonts */
  --cp-theme-font-sans: system-ui, sans-serif;
}
```

### Markdown Editor

```css
markdown-editor {
  /* Backgrounds */
  --mde-bg-primary: #0a0e1a;
  --mde-bg-secondary: #1e293b;
  --mde-bg-tertiary: #334155;

  /* Text */
  --mde-text-primary: #f1f5f9;
  --mde-text-secondary: #94a3b8;
  --mde-text-muted: #64748b;

  /* Accent */
  --mde-accent: #06b6d4;

  /* Fonts */
  --mde-font-sans: 'Inter', system-ui, sans-serif;
  --mde-font-mono: 'JetBrains Mono', 'Fira Code', monospace;
}
```

## PlexusOne Integration

When embedding in PlexusOne, map design tokens to component properties:

```css
/* PlexusOne Design System to component mapping */
jwt-editor,
markdown-editor {
  --jwt-theme-bg-primary: var(--plexus-dark, #0a0e1a);
  --jwt-theme-bg-secondary: var(--plexus-slate, #1e293b);
  --jwt-theme-accent: var(--plexus-cyan, #06b6d4);
  --jwt-theme-text-primary: var(--plexus-text, #f1f5f9);

  --mde-bg-primary: var(--plexus-dark);
  --mde-accent: var(--plexus-cyan);
}

coordinate-picker {
  --cp-theme-bg-primary: var(--plexus-dark);
  --cp-theme-bg-secondary: var(--plexus-slate);
  --cp-theme-accent: var(--plexus-cyan);
}
```

## Theme Switching

### System Theme Detection

Detect and follow system theme preference:

```javascript
function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

// Apply to component
const editor = document.querySelector('jwt-editor');
editor.theme = getSystemTheme();

// Watch for changes
window.matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', (e) => {
    editor.theme = e.matches ? 'dark' : 'light';
  });
```

### Persist Theme Choice

```javascript
// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'dark';
editor.theme = savedTheme;

// Save on change
function setTheme(theme) {
  editor.theme = theme;
  localStorage.setItem('theme', theme);
}
```

## Creating Custom Themes

### Brand Theme Example

```css
/* Corporate blue theme */
.brand-theme jwt-editor {
  --jwt-theme-bg-primary: #001f3f;
  --jwt-theme-bg-secondary: #003366;
  --jwt-theme-accent: #0074d9;
  --jwt-theme-text-primary: #ffffff;
}
```

### High Contrast Theme

```css
/* High contrast for accessibility */
.high-contrast jwt-editor {
  --jwt-theme-bg-primary: #000000;
  --jwt-theme-bg-secondary: #1a1a1a;
  --jwt-theme-text-primary: #ffffff;
  --jwt-theme-accent: #00ff00;
  --jwt-theme-border: #ffffff;
}
```

## Best Practices

1. **Use semantic names** - Use `--*-bg-primary` not `--*-dark-blue`
2. **Provide fallbacks** - Components have sensible defaults
3. **Test both themes** - Verify light and dark modes
4. **Consider contrast** - Ensure text is readable
5. **Be consistent** - Use the same tokens across components
