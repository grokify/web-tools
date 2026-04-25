# JWT Editor

A web component for decoding and inspecting JWT tokens.

## Features

- Decode JWT tokens instantly
- View header, payload, and signature sections
- Automatic timestamp conversion (iat, exp, nbf)
- Validation status with warnings and errors
- Dark and light theme support
- Copy decoded JSON to clipboard
- Autosave option for persistence

## Installation

=== "CDN"

    ```html
    <script src="https://unpkg.com/@grokify/jwt-editor/dist/jwt-editor.min.js"></script>
    ```

=== "npm"

    ```bash
    npm install @grokify/jwt-editor
    ```

## Usage

### Basic

```html
<jwt-editor></jwt-editor>
```

### With Options

```html
<!-- Light theme -->
<jwt-editor theme="light"></jwt-editor>

<!-- With autosave to localStorage -->
<jwt-editor autosave></jwt-editor>

<!-- Pre-filled value -->
<jwt-editor id="editor"></jwt-editor>
<script>
  document.getElementById('editor').value = 'eyJhbGciOi...';
</script>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `theme` | `'dark'` \| `'light'` | `'dark'` | Color theme |
| `autosave` | `boolean` | `false` | Persist token in localStorage |
| `value` | `string` | `''` | JWT token to decode |

## Properties

```typescript
interface JwtEditor {
  theme: 'dark' | 'light';
  autosave: boolean;
  value: string;
}
```

## Styling

```css
jwt-editor {
  /* Backgrounds */
  --jwt-theme-bg-primary: #0a0e1a;
  --jwt-theme-bg-secondary: #1e293b;

  /* Text */
  --jwt-theme-text-primary: #f1f5f9;
  --jwt-theme-accent: #06b6d4;

  /* Status colors */
  --jwt-theme-error: #ef4444;
  --jwt-theme-warning: #f59e0b;
  --jwt-theme-success: #10b981;
}
```

## Token Validation

The component validates:

| Check | Level | Description |
|-------|-------|-------------|
| Format | Error | Must have 3 dot-separated parts |
| Algorithm | Warning | Warns if `alg: none` |
| Expiration | Error | Checks if token has expired |
| Not Before | Error | Checks if token is not yet valid |
| Issued At | Warning | Warns if iat is in the future |

## Security

!!! note "Client-Side Only"
    The JWT is decoded entirely in the browser. No data is sent to any server.

!!! warning "No Signature Verification"
    This tool decodes JWTs for inspection only. It does not verify signatures.

## Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>JWT Decoder</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
    }
    jwt-editor {
      height: 100vh;
    }
  </style>
</head>
<body>
  <jwt-editor theme="dark"></jwt-editor>
  <script src="https://unpkg.com/@grokify/jwt-editor/dist/jwt-editor.min.js"></script>
</body>
</html>
```
