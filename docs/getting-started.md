# Getting Started

This guide covers installation and basic usage of web-tools components.

## Installation

### Via CDN (Recommended for Quick Start)

Add a script tag to load the component directly:

=== "JWT Editor"

    ```html
    <script src="https://unpkg.com/@grokify/jwt-editor/dist/jwt-editor.min.js"></script>
    <jwt-editor></jwt-editor>
    ```

=== "Markdown Editor"

    ```html
    <script src="https://unpkg.com/@grokify/markdown-editor/dist/markdown-editor.min.js"></script>
    <markdown-editor></markdown-editor>
    ```

=== "Coordinate Picker"

    ```html
    <script src="https://unpkg.com/@grokify/coordinate-picker/dist/coordinate-picker.min.js"></script>
    <coordinate-picker></coordinate-picker>
    ```

### Via npm

Install the package you need:

```bash
# Install specific tools
npm install @grokify/jwt-editor
npm install @grokify/markdown-editor
npm install @grokify/coordinate-picker
```

Import in your JavaScript/TypeScript:

```typescript
// Import registers the custom element automatically
import '@grokify/jwt-editor';

// Or import the class for advanced usage
import { JwtEditor } from '@grokify/jwt-editor';
```

## Basic Usage

### HTML

Simply add the custom element to your HTML:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My App</title>
</head>
<body>
  <jwt-editor></jwt-editor>
  <script src="https://unpkg.com/@grokify/jwt-editor/dist/jwt-editor.min.js"></script>
</body>
</html>
```

### With Attributes

Configure components via attributes:

```html
<!-- Dark theme (default) -->
<jwt-editor theme="dark"></jwt-editor>

<!-- Light theme -->
<jwt-editor theme="light"></jwt-editor>

<!-- With autosave -->
<jwt-editor autosave></jwt-editor>
```

### JavaScript API

Interact with components programmatically:

```javascript
const editor = document.querySelector('jwt-editor');

// Set value
editor.value = 'eyJhbGciOiJIUzI1NiIs...';

// Get current theme
console.log(editor.theme); // 'dark' or 'light'

// Toggle theme
editor.theme = editor.theme === 'dark' ? 'light' : 'dark';
```

## Framework Integration

### React

```tsx
import '@grokify/jwt-editor';

function App() {
  return (
    <div>
      <jwt-editor theme="dark"></jwt-editor>
    </div>
  );
}
```

For TypeScript, add type declarations:

```typescript
// custom-elements.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    'jwt-editor': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & { theme?: 'dark' | 'light' },
      HTMLElement
    >;
  }
}
```

### Vue

```vue
<template>
  <jwt-editor :theme="theme"></jwt-editor>
</template>

<script setup>
import '@grokify/jwt-editor';
import { ref } from 'vue';

const theme = ref('dark');
</script>
```

### Svelte

```svelte
<script>
  import '@grokify/jwt-editor';
  let theme = 'dark';
</script>

<jwt-editor {theme}></jwt-editor>
```

## Next Steps

- [Theming Guide](development/theming.md) - Customize colors and styles
- [Testing](development/testing.md) - Run automated tests
- [Contributing](development/contributing.md) - Help improve web-tools
