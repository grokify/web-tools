//go:build integration

package e2e

import (
	"context"
	"strings"
	"testing"
	"time"

	"github.com/plexusone/w3pilot"
)

func TestCoordinatePicker_Loads(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), DefaultTimeout)
	defer cancel()

	pilot, err := w3pilot.Browser.Launch(ctx, &w3pilot.LaunchOptions{
		Headless: true,
	})
	if err != nil {
		t.Fatalf("Failed to launch browser: %v", err)
	}
	defer func() { _ = pilot.Quit(ctx) }()

	if err := pilot.Go(ctx, BaseURL+"/coordinate-picker.html"); err != nil {
		t.Fatalf("Failed to navigate: %v", err)
	}

	// Verify coordinate-picker component exists
	picker, err := pilot.Find(ctx, "coordinate-picker", nil)
	if err != nil {
		t.Fatalf("Failed to find coordinate-picker component: %v", err)
	}

	info := picker.Info()
	if !strings.EqualFold(info.Tag, "coordinate-picker") {
		t.Errorf("Expected coordinate-picker tag, got %q", info.Tag)
	}
}

func TestCoordinatePicker_HasFileInput(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), DefaultTimeout)
	defer cancel()

	pilot, err := w3pilot.Browser.Launch(ctx, &w3pilot.LaunchOptions{
		Headless: true,
	})
	if err != nil {
		t.Fatalf("Failed to launch browser: %v", err)
	}
	defer func() { _ = pilot.Quit(ctx) }()

	if err := pilot.Go(ctx, BaseURL+"/coordinate-picker.html"); err != nil {
		t.Fatalf("Failed to navigate: %v", err)
	}

	// Find file input area
	fileArea, err := pilot.Find(ctx, ".file-input-area", nil)
	if err != nil {
		t.Fatalf("Failed to find file input area: %v", err)
	}

	areaText := fileArea.Info().Text
	if !strings.Contains(strings.ToLower(areaText), "image") {
		t.Errorf("Expected file input area to mention 'image', got %q", areaText)
	}
}

func TestCoordinatePicker_ShapeCards(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), DefaultTimeout)
	defer cancel()

	pilot, err := w3pilot.Browser.Launch(ctx, &w3pilot.LaunchOptions{
		Headless: true,
	})
	if err != nil {
		t.Fatalf("Failed to launch browser: %v", err)
	}
	defer func() { _ = pilot.Quit(ctx) }()

	if err := pilot.Go(ctx, BaseURL+"/coordinate-picker.html"); err != nil {
		t.Fatalf("Failed to navigate: %v", err)
	}

	// Find shape cards container
	shapesContainer, err := pilot.Find(ctx, ".shapes-container", nil)
	if err != nil {
		t.Fatalf("Failed to find shapes container: %v", err)
	}

	// Should have at least one shape card
	if shapesContainer.Info().Tag == "" {
		t.Error("Expected shapes container to exist")
	}

	// Find individual shape cards
	shapeCard, err := pilot.Find(ctx, ".shape-card", nil)
	if err != nil {
		t.Fatalf("Failed to find shape card: %v", err)
	}

	cardText := shapeCard.Info().Text
	if !strings.Contains(cardText, "Shape") {
		t.Errorf("Expected shape card to contain 'Shape', got %q", cardText)
	}
}

func TestCoordinatePicker_ZoomControls(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), DefaultTimeout)
	defer cancel()

	pilot, err := w3pilot.Browser.Launch(ctx, &w3pilot.LaunchOptions{
		Headless: true,
	})
	if err != nil {
		t.Fatalf("Failed to launch browser: %v", err)
	}
	defer func() { _ = pilot.Quit(ctx) }()

	if err := pilot.Go(ctx, BaseURL+"/coordinate-picker.html"); err != nil {
		t.Fatalf("Failed to navigate: %v", err)
	}

	// Find zoom controls
	zoomControls, err := pilot.Find(ctx, ".zoom-controls", nil)
	if err != nil {
		t.Fatalf("Failed to find zoom controls: %v", err)
	}

	controlsText := zoomControls.Info().Text
	if !strings.Contains(controlsText, "Zoom") {
		t.Errorf("Expected zoom controls to contain 'Zoom', got %q", controlsText)
	}

	// Find zoom level display
	zoomLevel, err := pilot.Find(ctx, ".zoom-level", nil)
	if err != nil {
		t.Fatalf("Failed to find zoom level: %v", err)
	}

	levelText := zoomLevel.Info().Text
	if !strings.Contains(levelText, "100%") {
		t.Errorf("Expected initial zoom level to be 100%%, got %q", levelText)
	}
}

func TestCoordinatePicker_ThemeToggle(t *testing.T) {
	ctx, cancel := context.WithTimeout(context.Background(), DefaultTimeout)
	defer cancel()

	pilot, err := w3pilot.Browser.Launch(ctx, &w3pilot.LaunchOptions{
		Headless: true,
	})
	if err != nil {
		t.Fatalf("Failed to launch browser: %v", err)
	}
	defer func() { _ = pilot.Quit(ctx) }()

	if err := pilot.Go(ctx, BaseURL+"/coordinate-picker.html"); err != nil {
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
	picker, err := pilot.Find(ctx, "coordinate-picker", nil)
	if err != nil {
		t.Fatalf("Failed to find coordinate-picker: %v", err)
	}

	theme, err := picker.Attribute(ctx, "theme")
	if err != nil {
		t.Fatalf("Failed to get theme attribute: %v", err)
	}
	if theme != "light" {
		t.Errorf("Expected theme 'light' after toggle, got %q", theme)
	}
}
