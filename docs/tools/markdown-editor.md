# Markdown Editor

A client-side Markdown editor with live preview and export capabilities.

## Features

- Split-pane editor and preview layout
- GitHub Flavored Markdown support
- Live preview as you type
- PDF export (optional dependency)
- DOCX export (optional dependency)
- Syntax highlighting in code blocks
- Autosave to localStorage
- Dark and light theme support

## Installation

=== "CDN"

    ```html
    <script src="https://unpkg.com/@grokify/markdown-editor/dist/markdown-editor.min.js"></script>
    ```

=== "npm"

    ```bash
    npm install @grokify/markdown-editor
    ```

### Optional Dependencies

For PDF/DOCX export, install peer dependencies:

```bash
# PDF export
npm install html2pdf.js

# DOCX export
npm install docx
```

## Usage

### Basic

```html
<markdown-editor></markdown-editor>
```

### With Options

```html
<!-- Light theme -->
<markdown-editor theme="light"></markdown-editor>

<!-- Pre-filled content -->
<markdown-editor id="editor"></markdown-editor>
<script>
  document.getElementById('editor').setValue('# Hello World');
</script>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `theme` | `'dark'` \| `'light'` | `'dark'` | Color theme |

## Properties & Methods

```typescript
interface MarkdownEditor {
  theme: 'dark' | 'light';

  // Get/set markdown content
  getValue(): string;
  setValue(markdown: string): void;

  // Export (requires optional dependencies)
  exportPDF(): Promise<void>;
  exportDOCX(): Promise<void>;
}
```

## Events

```typescript
// Content changed
editor.addEventListener('change', (e) => {
  console.log(e.detail.value);
});

// Export completed
editor.addEventListener('export', (e) => {
  console.log(e.detail.format); // 'pdf' or 'docx'
});
```

## Styling

```css
markdown-editor {
  /* Backgrounds */
  --mde-bg-primary: #0a0e1a;
  --mde-bg-secondary: #1e293b;

  /* Text */
  --mde-text-primary: #f1f5f9;
  --mde-accent: #06b6d4;

  /* Fonts */
  --mde-font-sans: 'Inter', system-ui, sans-serif;
  --mde-font-mono: 'JetBrains Mono', monospace;
}
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+B` | Bold |
| `Ctrl+I` | Italic |
| `Ctrl+K` | Link |
| `Ctrl+S` | Save (triggers autosave) |

## Markdown Support

The editor supports:

- Headings (# to ######)
- **Bold** and *italic*
- [Links](url) and ![Images](url)
- `Inline code` and code blocks
- Lists (ordered and unordered)
- Blockquotes
- Tables
- Task lists
- Strikethrough
- Syntax highlighting

## Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Markdown Editor</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
    }
    markdown-editor {
      height: 100vh;
    }
  </style>
</head>
<body>
  <markdown-editor theme="dark"></markdown-editor>
  <script src="https://unpkg.com/@grokify/markdown-editor/dist/markdown-editor.min.js"></script>
  <script>
    const editor = document.querySelector('markdown-editor');

    // Set initial content
    editor.setValue(`# Welcome

Start typing your markdown here!

- Supports **bold** and *italic*
- Code blocks with syntax highlighting
- And much more...
`);
  </script>
</body>
</html>
```

## PDF Export

To enable PDF export:

1. Install html2pdf.js:
   ```bash
   npm install html2pdf.js
   ```

2. Import before using:
   ```html
   <script src="https://unpkg.com/html2pdf.js/dist/html2pdf.bundle.min.js"></script>
   <script src="https://unpkg.com/@grokify/markdown-editor/dist/markdown-editor.min.js"></script>
   ```

3. Use export button or API:
   ```javascript
   editor.exportPDF();
   ```

## DOCX Export

To enable DOCX export:

1. Install docx:
   ```bash
   npm install docx
   ```

2. Use export API:
   ```javascript
   editor.exportDOCX();
   ```
