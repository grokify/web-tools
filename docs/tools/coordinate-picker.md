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

## Guide: Cleaning Up Coordinates

When tracing logos or precise geometric shapes, raw click coordinates are approximate. This guide shows how to refine them into exact geometry.

### Step 1: Trace the Shape

Use the Coordinate Picker to click approximate points on your reference image. Don't worry about precision—just capture the general shape.

**Example raw output:**

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <rect width="400" height="400" fill="#000000"/>
  <polygon points="199,52 328,126 265,162 135,88" fill="#00FF00"/>
  <polygon points="265,162 199,199 328,272 329,200" fill="#00FF00"/>
  <polygon points="199,199 134,237 69,198 70,126" fill="#00FF00"/>
  <polygon points="134,237 262,310 200,347 70,272" fill="#00FF00"/>
</svg>
```

### Step 2: Analyze the Geometry

Look for patterns in your coordinates:

1. **X-coordinate clusters** - Find repeating X values (e.g., 70, 135, 200, 265, 330)
2. **Spacing** - Calculate the interval between clusters (e.g., 65 units)
3. **Diagonal slopes** - Measure rise/run for diagonal lines (e.g., 37/65 ≈ 0.569)
4. **Vertical edges** - Identify lines that should be exactly vertical

### Step 3: Build a Coordinate Grid

Create a reference grid based on your analysis:

| Property | Value |
|----------|-------|
| X-coordinates | 70, 135, 200, 265, 330 (spacing: 65) |
| Diagonal slope | ±37/65 (≈0.569) |
| Vertical edges | x=70 and x=330 |
| Y-step per X-unit | 37 per 65 units |

### Step 4: Snap to Grid

Rewrite coordinates using exact values from your grid:

**Cleaned output:**

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
  <rect width="400" height="400" fill="#000000"/>
  <!-- Shape 1: Top center -->
  <polygon points="200,50 330,124 265,161 135,87" fill="#00FF00"/>
  <!-- Shape 2: Right side (vertical edge at x=330) -->
  <polygon points="265,161 200,198 330,272 330,198" fill="#00FF00"/>
  <!-- Shape 3: Left side (vertical edge at x=70) -->
  <polygon points="200,198 135,235 70,198 70,124" fill="#00FF00"/>
  <!-- Shape 4: Bottom center -->
  <polygon points="135,235 265,309 200,346 70,272" fill="#00FF00"/>
</svg>
```

### Step 5: Verify Shared Vertices

Ensure shapes that touch share exact coordinates:

| Vertex | Shared By |
|--------|-----------|
| (265, 161) | Shape 1 ↔ Shape 2 |
| (200, 198) | Shape 2 ↔ Shape 3 |
| (135, 235) | Shape 3 ↔ Shape 4 |

### Tips for Clean Geometry

- **Parallelograms**: Opposite sides must have identical slope
- **Vertical lines**: All points share the same X value
- **Horizontal lines**: All points share the same Y value
- **Shared edges**: Adjacent shapes must use identical point coordinates
- **Symmetry**: Use a center axis and mirror coordinates

### Common Patterns

**Isometric shapes** (30° angles):

- Slope: ±0.577 (1/√3)
- Y-step: 57.7 per 100 X-units

**45° angles**:

- Slope: ±1.0
- Y-step: 100 per 100 X-units

**Hexagonal shapes**:

- Interior angles: 120°
- Slope: ±1.732 (√3)
