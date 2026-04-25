# Testing

web-tools uses a multi-layer testing strategy to ensure reliability:

| Layer | Tool | Purpose |
|-------|------|---------|
| Unit Tests | Vitest | Test pure functions and utilities |
| Component Tests | @open-wc/testing | Test Lit component behavior |
| E2E Tests | w3pilot | Full browser integration tests |

## Quick Start

### Manual Testing

The fastest way to test during development:

```bash
# Build all packages
pnpm build

# Serve examples locally
npx serve examples -p 3000

# Open in browser
open http://localhost:3000/jwt-editor.html
```

### Run E2E Tests Locally

```bash
# Prerequisites: Chrome for Testing
cd tests/e2e
clicker install  # Install Chrome for Testing

# Start server in background
npx serve examples -p 3000 &

# Run tests
go test -tags=integration -v ./...
```

## E2E Testing with w3pilot

web-tools uses [w3pilot](https://github.com/plexusone/w3pilot) for end-to-end browser testing. w3pilot is a Go-based browser automation library that uses Chrome DevTools Protocol.

### Test Structure

```
tests/e2e/
├── go.mod                      # Go module for tests
├── e2e_test.go                 # Test setup and helpers
├── jwt_editor_test.go          # JWT Editor tests
├── coordinate_picker_test.go   # Coordinate Picker tests
└── markdown_editor_test.go     # Markdown Editor tests
```

### Writing E2E Tests

Basic test pattern:

```go
//go:build integration

package e2e

import (
    "context"
    "testing"
    "time"

    "github.com/plexusone/w3pilot"
)

func TestJwtEditor_DecodeToken(t *testing.T) {
    ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
    defer cancel()

    // Launch browser
    pilot, err := w3pilot.Browser.Launch(ctx, &w3pilot.LaunchOptions{
        Headless: true,
    })
    if err != nil {
        t.Fatalf("Failed to launch browser: %v", err)
    }
    defer func() { _ = pilot.Quit(ctx) }()

    // Navigate to component
    if err := pilot.Go(ctx, "http://localhost:3000/jwt-editor.html"); err != nil {
        t.Fatalf("Failed to navigate: %v", err)
    }

    // Find and interact with elements
    textarea, err := pilot.Find(ctx, "textarea", nil)
    if err != nil {
        t.Fatalf("Failed to find textarea: %v", err)
    }

    // Type JWT token
    if err := textarea.Type(ctx, "eyJhbGciOi...", nil); err != nil {
        t.Fatalf("Failed to type: %v", err)
    }

    // Wait and verify
    time.Sleep(500 * time.Millisecond)

    headerBadge, err := pilot.Find(ctx, ".badge-header", nil)
    if err != nil {
        t.Fatalf("Token not decoded: %v", err)
    }
}
```

### Finding Elements

w3pilot supports multiple selector strategies:

```go
// CSS selector
elem, _ := pilot.Find(ctx, "#my-id", nil)
elem, _ := pilot.Find(ctx, ".my-class", nil)
elem, _ := pilot.Find(ctx, "button[type='submit']", nil)

// Semantic selector (ARIA roles)
elem, _ := pilot.Find(ctx, "", &w3pilot.FindOptions{
    Role: "button",
    Text: "Submit",
})

// Combined
elem, _ := pilot.Find(ctx, "", &w3pilot.FindOptions{
    Role: "link",
    Text: "Learn More",
})
```

### Element Interactions

```go
// Click
elem.Click(ctx, nil)

// Type text
elem.Type(ctx, "hello world", nil)

// Fill (clears first, then types)
elem.Fill(ctx, "new value", nil)

// Get text content
info := elem.Info()
text := info.Text

// Get attribute
value, _ := elem.Attribute(ctx, "theme")
```

### Testing Shadow DOM

w3pilot automatically pierces Shadow DOM boundaries, so you can find elements inside Web Components:

```go
// This finds textarea inside jwt-editor's shadow DOM
textarea, _ := pilot.Find(ctx, "textarea", nil)
```

## CI Pipeline

E2E tests run automatically in GitHub Actions:

```yaml
# .github/workflows/e2e-tests.yaml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Build components first
      - name: Build
        run: pnpm install && pnpm build

      # Install browser
      - name: Install Chrome
        run: clicker install

      # Start server
      - name: Start Server
        run: npx serve examples -p 3000 &

      # Run tests
      - name: Run E2E Tests
        run: |
          cd tests/e2e
          go test -tags=integration -v ./...
```

## Test Categories

### Smoke Tests

Verify basic functionality:

- Component loads without errors
- Expected elements are present
- Theme toggle works

### Interaction Tests

Test user workflows:

- Input handling
- Button clicks
- Keyboard navigation

### Validation Tests

Test error handling:

- Invalid input handling
- Error message display
- Edge cases

## Debugging Tests

### Run with Debug Output

```bash
W3PILOT_DEBUG=1 go test -tags=integration -v ./... -run TestJwtEditor
```

### Take Screenshots on Failure

```go
func TestSomething(t *testing.T) {
    // ... test code ...

    if t.Failed() {
        pilot.Screenshot(ctx, "failure.png", nil)
    }
}
```

### Run Headed (Non-Headless)

```bash
W3PILOT_HEADLESS=0 go test -tags=integration -v ./... -run TestJwtEditor
```

## Best Practices

1. **Use timeouts** - Always use context with timeout
2. **Clean up** - Use `defer pilot.Quit(ctx)` to close browser
3. **Wait for updates** - Add small delays after interactions
4. **Check prerequisites** - Verify server is running in TestMain
5. **Isolate tests** - Each test should start fresh
6. **Use semantic selectors** - Prefer ARIA roles over CSS when possible

## Adding New Tests

1. Create a new file: `tests/e2e/{component}_test.go`
2. Add build tag: `//go:build integration`
3. Import w3pilot and test package
4. Write tests following patterns above
5. Run: `go test -tags=integration -v ./... -run TestNewComponent`
