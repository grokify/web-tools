//go:build integration

// Package e2e provides end-to-end browser tests for web-tools components.
//
// These tests require:
// - Chrome for Testing (installed via `clicker install`)
// - Built component bundles (run `pnpm build` from repo root)
// - A local server serving the examples (run `npx serve examples -p 3000`)
//
// Run tests:
//
//	go test -tags=integration -v ./...
package e2e

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"testing"
	"time"
)

const (
	// BaseURL is the local server URL for examples
	BaseURL = "http://localhost:3000"

	// DefaultTimeout for browser operations
	DefaultTimeout = 30 * time.Second
)

// TestMain checks prerequisites before running tests
func TestMain(m *testing.M) {
	// Check if server is running
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	req, _ := http.NewRequestWithContext(ctx, http.MethodGet, BaseURL, nil)
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error: Local server not running at %s\n", BaseURL)
		fmt.Fprintf(os.Stderr, "Start server with: npx serve examples -p 3000\n")
		os.Exit(1)
	}
	resp.Body.Close()

	os.Exit(m.Run())
}
