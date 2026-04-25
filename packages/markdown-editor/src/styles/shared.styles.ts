import { css } from 'lit';

/**
 * Color palette - CSS custom properties
 *
 * These properties can be overridden by the consuming application by setting
 * them on the <markdown-editor> element or in a parent scope. The component
 * uses var(--mde-*, fallback) pattern to allow external theming.
 *
 * Theming API:
 * - Colors: --mde-bg-primary, --mde-bg-secondary, --mde-bg-tertiary, --mde-border,
 *           --mde-text-primary, --mde-text-secondary, --mde-text-muted,
 *           --mde-accent, --mde-accent-hover, --mde-success, --mde-error
 * - Spacing: --mde-spacing-xs, --mde-spacing-sm, --mde-spacing-md, --mde-spacing-lg
 * - Radius: --mde-radius-sm, --mde-radius-md, --mde-radius-lg
 * - Fonts: --mde-font-sans, --mde-font-mono, --mde-font-size-sm/md/lg
 * - Shadows: --mde-shadow-sm, --mde-shadow-md
 */
export const colors = css`
  :host {
    /* Light theme defaults - use inherited values if set by consumer */
    --mde-bg-primary: var(--mde-theme-bg-primary, #ffffff);
    --mde-bg-secondary: var(--mde-theme-bg-secondary, #f8fafc);
    --mde-bg-tertiary: var(--mde-theme-bg-tertiary, #f1f5f9);
    --mde-border: var(--mde-theme-border, #e2e8f0);
    --mde-text-primary: var(--mde-theme-text-primary, #1e293b);
    --mde-text-secondary: var(--mde-theme-text-secondary, #475569);
    --mde-text-muted: var(--mde-theme-text-muted, #94a3b8);
    --mde-accent: var(--mde-theme-accent, #3b82f6);
    --mde-accent-hover: var(--mde-theme-accent-hover, #2563eb);
    --mde-success: var(--mde-theme-success, #22c55e);
    --mde-error: var(--mde-theme-error, #ef4444);

    /* Spacing */
    --mde-spacing-xs: var(--mde-theme-spacing-xs, 4px);
    --mde-spacing-sm: var(--mde-theme-spacing-sm, 8px);
    --mde-spacing-md: var(--mde-theme-spacing-md, 16px);
    --mde-spacing-lg: var(--mde-theme-spacing-lg, 24px);

    /* Border radius */
    --mde-radius-sm: var(--mde-theme-radius-sm, 4px);
    --mde-radius-md: var(--mde-theme-radius-md, 8px);
    --mde-radius-lg: var(--mde-theme-radius-lg, 12px);

    /* Font */
    --mde-font-sans: var(--mde-theme-font-sans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif);
    --mde-font-mono: var(--mde-theme-font-mono, 'SF Mono', Monaco, 'Cascadia Code', monospace);
    --mde-font-size-sm: var(--mde-theme-font-size-sm, 13px);
    --mde-font-size-md: var(--mde-theme-font-size-md, 14px);
    --mde-font-size-lg: var(--mde-theme-font-size-lg, 16px);

    /* Shadows */
    --mde-shadow-sm: var(--mde-theme-shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.05));
    --mde-shadow-md: var(--mde-theme-shadow-md, 0 4px 6px rgba(0, 0, 0, 0.1));
  }

  :host([theme='dark']) {
    --mde-bg-primary: var(--mde-theme-bg-primary, #0f172a);
    --mde-bg-secondary: var(--mde-theme-bg-secondary, #1e293b);
    --mde-bg-tertiary: var(--mde-theme-bg-tertiary, #334155);
    --mde-border: var(--mde-theme-border, #475569);
    --mde-text-primary: var(--mde-theme-text-primary, #f1f5f9);
    --mde-text-secondary: var(--mde-theme-text-secondary, #cbd5e1);
    --mde-text-muted: var(--mde-theme-text-muted, #64748b);
    --mde-accent: var(--mde-theme-accent, #60a5fa);
    --mde-accent-hover: var(--mde-theme-accent-hover, #3b82f6);
  }
`;

/**
 * Typography styles
 */
export const typography = css`
  * {
    box-sizing: border-box;
  }

  :host {
    font-family: var(--mde-font-sans);
    font-size: var(--mde-font-size-md);
    color: var(--mde-text-primary);
  }
`;

/**
 * Focus styles for accessibility
 */
export const focusStyles = css`
  :focus-visible {
    outline: 2px solid var(--mde-accent);
    outline-offset: 2px;
  }

  button:focus-visible {
    outline: 2px solid var(--mde-accent);
    outline-offset: 2px;
  }
`;

/**
 * Button base styles
 */
export const buttonStyles = css`
  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: var(--mde-spacing-xs) var(--mde-spacing-sm);
    border: 1px solid var(--mde-border);
    border-radius: var(--mde-radius-sm);
    background: var(--mde-bg-primary);
    color: var(--mde-text-primary);
    font-family: inherit;
    font-size: var(--mde-font-size-sm);
    cursor: pointer;
    transition: all 0.15s ease;
  }

  button:hover {
    background: var(--mde-bg-secondary);
    border-color: var(--mde-text-muted);
  }

  button:active {
    background: var(--mde-bg-tertiary);
  }

  button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  button.primary {
    background: var(--mde-accent);
    border-color: var(--mde-accent);
    color: white;
  }

  button.primary:hover {
    background: var(--mde-accent-hover);
    border-color: var(--mde-accent-hover);
  }
`;

/**
 * Combined shared styles
 */
export const sharedStyles = [colors, typography, focusStyles, buttonStyles];
