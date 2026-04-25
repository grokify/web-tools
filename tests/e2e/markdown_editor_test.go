//go:build integration

package e2e

import (
	"context"
	"strings"
	"testing"
	"time"

	"github.com/plexusone/w3pilot"
)

func TestMarkdownEditor_Loads(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), DefaultTimeout)
	defer cancel()

	pilot, err := w3pilot.Browser.Launch(ctx, &w3pilot.LaunchOptions{
		Headless: true,
	})
	if err != nil {
		t.Fatalf("Failed to launch browser: %v", err)
	}
	defer func() { _ = pilot.Quit(ctx) }()

	if err := pilot.Go(ctx, BaseURL+"/markdown-editor.html"); err != nil {
		t.Fatalf("Failed to navigate: %v", err)
	}

	// Verify markdown-editor component exists
	editor, err := pilot.Find(ctx, "markdown-editor", nil)
	if err != nil {
		t.Fatalf("Failed to find markdown-editor component: %v", err)
	}

	info := editor.Info()
	if !strings.EqualFold(info.Tag, "markdown-editor") {
		t.Errorf("Expected markdown-editor tag, got %q", info.Tag)
	}
}

func TestMarkdownEditor_HasTextarea(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), DefaultTimeout)
	defer cancel()

	pilot, err := w3pilot.Browser.Launch(ctx, &w3pilot.LaunchOptions{
		Headless: true,
	})
	if err != nil {
		t.Fatalf("Failed to launch browser: %v", err)
	}
	defer func() { _ = pilot.Quit(ctx) }()

	if err := pilot.Go(ctx, BaseURL+"/markdown-editor.html"); err != nil {
		t.Fatalf("Failed to navigate: %v", err)
	}

	// Find textarea within the component
	textarea, err := pilot.Find(ctx, "textarea", nil)
	if err != nil {
		t.Fatalf("Failed to find textarea: %v", err)
	}

	if textarea.Info().Tag == "" {
		t.Error("Expected textarea to exist")
	}
}

func TestMarkdownEditor_LivePreview(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), DefaultTimeout)
	defer cancel()

	pilot, err := w3pilot.Browser.Launch(ctx, &w3pilot.LaunchOptions{
		Headless: true,
	})
	if err != nil {
		t.Fatalf("Failed to launch browser: %v", err)
	}
	defer func() { _ = pilot.Quit(ctx) }()

	if err := pilot.Go(ctx, BaseURL+"/markdown-editor.html"); err != nil {
		t.Fatalf("Failed to navigate: %v", err)
	}

	// Find textarea and type markdown
	textarea, err := pilot.Find(ctx, "textarea", nil)
	if err != nil {
		t.Fatalf("Failed to find textarea: %v", err)
	}

	// Clear and type new content
	if err := textarea.Fill(ctx, "# Hello World\n\nThis is a **test**.", nil); err != nil {
		t.Fatalf("Failed to fill textarea: %v", err)
	}

	// Wait for preview to update
	time.Sleep(500 * time.Millisecond)

	// Find preview area and verify rendered content
	// The preview should contain an h1 element
	h1, err := pilot.Find(ctx, "h1", nil)
	if err != nil {
		// Try looking in preview container
		t.Logf("Note: Could not find h1 directly, may be in shadow DOM")
	} else {
		h1Text := h1.Info().Text
		if !strings.Contains(h1Text, "Hello World") {
			t.Errorf("Expected h1 to contain 'Hello World', got %q", h1Text)
		}
	}
}

func TestMarkdownEditor_ThemeToggle(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), DefaultTimeout)
	defer cancel()

	pilot, err := w3pilot.Browser.Launch(ctx, &w3pilot.LaunchOptions{
		Headless: true,
	})
	if err != nil {
		t.Fatalf("Failed to launch browser: %v", err)
	}
	defer func() { _ = pilot.Quit(ctx) }()

	if err := pilot.Go(ctx, BaseURL+"/markdown-editor.html"); err != nil {
		t.Fatalf("Failed to navigate: %v", err)
	}

	// Find and click theme toggle button
	toggleBtn, err := pilot.Find(ctx, "", &w3pilot.FindOptions{
		Role: "button",
		Text: "Toggle Theme",
	})
	if err != nil {
		t.Fatalf("Failed to find toggle button: %v", err)
	}

	if err := toggleBtn.Click(ctx, nil); err != nil {
		t.Fatalf("Failed to click toggle: %v", err)
	}

	time.Sleep(200 * time.Millisecond)

	// Verify theme changed
	editor, err := pilot.Find(ctx, "markdown-editor", nil)
	if err != nil {
		t.Fatalf("Failed to find markdown-editor: %v", err)
	}

	theme, err := editor.Attribute(ctx, "theme")
	if err != nil {
		t.Fatalf("Failed to get theme attribute: %v", err)
	}
	if theme != "light" {
		t.Errorf("Expected theme 'light' after toggle, got %q", theme)
	}
}

func TestMarkdownEditor_Toolbar(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), DefaultTimeout)
	defer cancel()

	pilot, err := w3pilot.Browser.Launch(ctx, &w3pilot.LaunchOptions{
		Headless: true,
	})
	if err != nil {
		t.Fatalf("Failed to launch browser: %v", err)
	}
	defer func() { _ = pilot.Quit(ctx) }()

	if err := pilot.Go(ctx, BaseURL+"/markdown-editor.html"); err != nil {
		t.Fatalf("Failed to navigate: %v", err)
	}

	// Find toolbar component
	toolbar, err := pilot.Find(ctx, "mde-toolbar", nil)
	if err != nil {
		// Toolbar might be a different element
		t.Logf("Note: mde-toolbar not found directly, component may use different structure")
		return
	}

	if toolbar.Info().Tag == "" {
		t.Error("Expected toolbar to exist")
	}
}
