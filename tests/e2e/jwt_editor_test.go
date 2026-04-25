//go:build integration

package e2e

import (
	"context"
	"strings"
	"testing"
	"time"

	"github.com/plexusone/w3pilot"
)

// Sample JWT for testing (expired token, safe to use in tests)
const sampleJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"

func TestJwtEditor_Loads(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), DefaultTimeout)
	defer cancel()

	pilot, err := w3pilot.Browser.Launch(ctx, &w3pilot.LaunchOptions{
		Headless: true,
	})
	if err != nil {
		t.Fatalf("Failed to launch browser: %v", err)
	}
	defer func() { _ = pilot.Quit(ctx) }()

	// Navigate to jwt-editor example
	if err := pilot.Go(ctx, BaseURL+"/jwt-editor.html"); err != nil {
		t.Fatalf("Failed to navigate: %v", err)
	}

	// Verify jwt-editor component exists
	editor, err := pilot.Find(ctx, "jwt-editor", nil)
	if err != nil {
		t.Fatalf("Failed to find jwt-editor component: %v", err)
	}

	info := editor.Info()
	if info.Tag != "jwt-editor" && info.Tag != "JWT-EDITOR" {
		t.Errorf("Expected jwt-editor tag, got %q", info.Tag)
	}
}

func TestJwtEditor_DecodeToken(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), DefaultTimeout)
	defer cancel()

	pilot, err := w3pilot.Browser.Launch(ctx, &w3pilot.LaunchOptions{
		Headless: true,
	})
	if err != nil {
		t.Fatalf("Failed to launch browser: %v", err)
	}
	defer func() { _ = pilot.Quit(ctx) }()

	if err := pilot.Go(ctx, BaseURL+"/jwt-editor.html"); err != nil {
		t.Fatalf("Failed to navigate: %v", err)
	}

	// Find textarea within shadow DOM
	// Note: w3pilot pierces shadow DOM automatically
	textarea, err := pilot.Find(ctx, "textarea", nil)
	if err != nil {
		t.Fatalf("Failed to find textarea: %v", err)
	}

	// Type JWT token
	if err := textarea.Type(ctx, sampleJWT, nil); err != nil {
		t.Fatalf("Failed to type JWT: %v", err)
	}

	// Wait for decoding
	time.Sleep(500 * time.Millisecond)

	// Verify decoded sections appear
	// Look for the header badge
	headerBadge, err := pilot.Find(ctx, ".badge-header", nil)
	if err != nil {
		t.Fatalf("Failed to find header badge (token not decoded): %v", err)
	}

	badgeText := headerBadge.Info().Text
	if !strings.Contains(strings.ToLower(badgeText), "header") {
		t.Errorf("Expected header badge, got %q", badgeText)
	}
}

func TestJwtEditor_ThemeToggle(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), DefaultTimeout)
	defer cancel()

	pilot, err := w3pilot.Browser.Launch(ctx, &w3pilot.LaunchOptions{
		Headless: true,
	})
	if err != nil {
		t.Fatalf("Failed to launch browser: %v", err)
	}
	defer func() { _ = pilot.Quit(ctx) }()

	if err := pilot.Go(ctx, BaseURL+"/jwt-editor.html"); err != nil {
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

	// Verify theme changed
	editor, err := pilot.Find(ctx, "jwt-editor", nil)
	if err != nil {
		t.Fatalf("Failed to find jwt-editor: %v", err)
	}

	// Check theme attribute changed to light
	theme, err := editor.Attribute(ctx, "theme")
	if err != nil {
		t.Fatalf("Failed to get theme attribute: %v", err)
	}
	if theme != "light" {
		t.Errorf("Expected theme 'light' after toggle, got %q", theme)
	}
}

func TestJwtEditor_InvalidToken(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), DefaultTimeout)
	defer cancel()

	pilot, err := w3pilot.Browser.Launch(ctx, &w3pilot.LaunchOptions{
		Headless: true,
	})
	if err != nil {
		t.Fatalf("Failed to launch browser: %v", err)
	}
	defer func() { _ = pilot.Quit(ctx) }()

	if err := pilot.Go(ctx, BaseURL+"/jwt-editor.html"); err != nil {
		t.Fatalf("Failed to navigate: %v", err)
	}

	textarea, err := pilot.Find(ctx, "textarea", nil)
	if err != nil {
		t.Fatalf("Failed to find textarea: %v", err)
	}

	// Type invalid JWT
	if err := textarea.Type(ctx, "not.a.valid.jwt.token", nil); err != nil {
		t.Fatalf("Failed to type: %v", err)
	}

	time.Sleep(500 * time.Millisecond)

	// Look for validation error indicator
	validationBox, err := pilot.Find(ctx, ".validation-invalid", nil)
	if err != nil {
		t.Fatalf("Failed to find validation error box: %v", err)
	}

	if validationBox.Info().Tag == "" {
		t.Error("Expected validation error to be displayed")
	}
}
