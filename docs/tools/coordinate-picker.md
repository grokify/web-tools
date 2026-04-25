# Coordinate Picker

A web component for picking coordinates from images to create SVG polygons.

## Features

- Upload images (drag & drop or file picker)
- Click to place coordinate pins
- Multiple shape support (up to 20 polygons)
- Pin sharing between shapes
- Zoom controls (0.5x to 4x)
- Live SVG preview
- Copy individual polygon or full SVG
- Dark and light theme support

## Installation

=== "CDN"

    ```html
    <script src="https://unpkg.com/@grokify/coordinate-picker/dist/coordinate-picker.min.js"></script>
    ```

=== "npm"

    ```bash
    npm install @grokify/coordinate-picker
    ```

## Usage

### Basic

```html
<coordinate-picker></coordinate-picker>
```

### With Options

```html
<!-- Light theme -->
<coordinate-picker theme="light"></coordinate-picker>

<!-- Custom number of shapes -->
<coordinate-picker num-shapes="6"></coordinate-picker>
```

## Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `theme` | `'dark'` \| `'light'` | `'dark'` | Color theme |
| `num-shapes` | `number` | `4` | Initial number of shape slots |

## Events

```typescript
// Fired when SVG output changes
picker.addEventListener('svg-generated', (e) => {
  console.log(e.detail.svg);
});
```

## Workflow

1. **Load Image** - Click the upload area or drag & drop an image
2. **Select Shape** - Click a shape card to make it active
3. **Place Pins** - Click on the image to place coordinate pins
4. **Switch Shapes** - Click another shape card to add pins to it
5. **Share Pins** - Click an existing pin to add it to the current shape
6. **Copy Output** - Click polygon code or full SVG to copy

## Styling

```css
coordinate-picker {
  /* Backgrounds */
  --cp-theme-bg-primary: #1a1a2e;
  --cp-theme-bg-secondary: #2a2a4a;

  /* Text */
  --cp-theme-text-primary: #eee;
  --cp-theme-accent: #4a4a8a;

  /* Borders */
  --cp-theme-border: #4a4a8a;
}
```

## Pin Management

### Adding Pins

- Click on the image to add a new pin
- The pin is automatically added to the active shape

### Reusing Pins

- Click an existing pin to open the context menu
- Select "Add to Shape X" to share the pin

### Removing Pins

- Click a pin to open the context menu
- Select "Remove from Shape X" or "Delete Pin"

## Shape Colors

Shapes are assigned colors in order:

| Shape | Color |
|-------|-------|
| 1 | Red (#e74c3c) |
| 2 | Blue (#3498db) |
| 3 | Green (#2ecc71) |
| 4 | Orange (#f39c12) |
| 5 | Purple (#9b59b6) |
| 6+ | Cycles through palette |

## SVG Output

The component generates clean SVG code:

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <rect width="400" height="300" fill="#000000"/>
  <polygon points="10,20 50,60 90,20" fill="#00FF00"/>
  <polygon points="100,120 150,160 190,120" fill="#00FF00"/>
</svg>
```

## Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SVG Coordinate Picker</title>
  <style>
    body {
      margin: 0;
      background: #1a1a2e;
    }
  </style>
</head>
<body>
  <coordinate-picker theme="dark"></coordinate-picker>
  <script src="https://unpkg.com/@grokify/coordinate-picker/dist/coordinate-picker.min.js"></script>
  <script>
    document.querySelector('coordinate-picker')
      .addEventListener('svg-generated', (e) => {
        console.log('SVG:', e.detail.svg);
      });
  </script>
</body>
</html>
```

## Use Cases

- Creating image maps
- Defining clickable regions
- Building SVG masks
- Tracing shapes from reference images
- Game development (collision shapes)
