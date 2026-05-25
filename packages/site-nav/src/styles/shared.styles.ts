import { css } from 'lit';
import { generateCSSVariables } from './design-system.js';

/**
 * Color palette - CSS custom properties
 *
 * These properties integrate with the design system specification.
 * The resolution order is:
 * 1. --wt-theme-* (explicit override from consuming app)
 * 2. --ds-* (design system variables, set by wt-theme-toggle or theme attribute)
 * 3. Hardcoded fallback values
 *
 * Theming API:
 * - Colors: --wt-nav-bg-primary, --wt-nav-bg-secondary, --wt-nav-bg-tertiary,
 *           --wt-nav-border, --wt-nav-text-primary, --wt-nav-text-secondary,
 *           --wt-nav-text-muted, --wt-nav-accent
 * - Spacing: --wt-nav-spacing-xs, --wt-nav-spacing-sm, --wt-nav-spacing-md, --wt-nav-spacing-lg
 * - Radius: --wt-nav-radius-sm, --wt-nav-radius-md, --wt-nav-radius-lg
 * - Fonts: --wt-nav-font-sans, --wt-nav-font-size-sm/md/lg
 * - Shadows: --wt-nav-shadow-sm, --wt-nav-shadow-md
 *
 * To use design system theming:
 * 1. Include <wt-theme-toggle> in your page
 * 2. Or set theme="light" or theme="dark" on the html element
 * 3. Components will automatically pick up the design system variables
 */
export const colors = css`
  :host {
    /* Light theme - using design system as primary, with hardcoded fallbacks */
    ${generateCSSVariables('light')}

    /* Component-level variables that reference design system */
    --wt-nav-bg-primary: var(--wt-theme-bg-primary, var(--ds-bg-primary, #ffffff));
    --wt-nav-bg-secondary: var(--wt-theme-bg-secondary, var(--ds-bg-secondary, #f8fafc));
    --wt-nav-bg-tertiary: var(--wt-theme-bg-tertiary, var(--ds-bg-tertiary, #f1f5f9));
    --wt-nav-border: var(--wt-theme-border, var(--ds-border-default, #e2e8f0));
    --wt-nav-text-primary: var(--wt-theme-text-primary, var(--ds-text-primary, #1e293b));
    --wt-nav-text-secondary: var(--wt-theme-text-secondary, var(--ds-text-secondary, #475569));
    --wt-nav-text-muted: var(--wt-theme-text-muted, var(--ds-text-muted, #94a3b8));
    --wt-nav-accent: var(--wt-theme-accent, var(--ds-accent, #06b6d4));
    --wt-nav-accent-hover: var(--wt-theme-accent-hover, var(--ds-accent-hover, #0891b2));

    /* Status colors from design system */
    --wt-nav-status-success: var(--ds-status-success, #10b981);
    --wt-nav-status-warning: var(--ds-status-warning, #f59e0b);
    --wt-nav-status-error: var(--ds-status-error, #ef4444);
    --wt-nav-status-info: var(--ds-status-info, #3b82f6);

    /* Maturity colors from design system */
    --wt-nav-maturity-m1: var(--ds-maturity-m1, #ef4444);
    --wt-nav-maturity-m2: var(--ds-maturity-m2, #f59e0b);
    --wt-nav-maturity-m3: var(--ds-maturity-m3, #eab308);
    --wt-nav-maturity-m4: var(--ds-maturity-m4, #22c55e);
    --wt-nav-maturity-m5: var(--ds-maturity-m5, #3b82f6);

    /* Spacing - from design system */
    --wt-nav-spacing-xs: var(--wt-theme-spacing-xs, var(--ds-space-1, 4px));
    --wt-nav-spacing-sm: var(--wt-theme-spacing-sm, var(--ds-space-2, 8px));
    --wt-nav-spacing-md: var(--wt-theme-spacing-md, var(--ds-space-4, 16px));
    --wt-nav-spacing-lg: var(--wt-theme-spacing-lg, var(--ds-space-6, 24px));

    /* Border radius - from design system */
    --wt-nav-radius-sm: var(--wt-theme-radius-sm, var(--ds-radius-sm, 4px));
    --wt-nav-radius-md: var(--wt-theme-radius-md, var(--ds-radius-md, 8px));
    --wt-nav-radius-lg: var(--wt-theme-radius-lg, var(--ds-radius-lg, 12px));

    /* Font - from design system */
    --wt-nav-font-sans: var(--wt-theme-font-sans, var(--ds-font-sans, system-ui, -apple-system, sans-serif));
    --wt-nav-font-size-sm: var(--wt-theme-font-size-sm, var(--ds-text-sm, 0.75rem));
    --wt-nav-font-size-md: var(--wt-theme-font-size-md, var(--ds-text-base, 0.875rem));
    --wt-nav-font-size-lg: var(--wt-theme-font-size-lg, var(--ds-text-lg, 1rem));

    /* Shadows - from design system */
    --wt-nav-shadow-sm: var(--wt-theme-shadow-sm, var(--ds-shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.05)));
    --wt-nav-shadow-md: var(--wt-theme-shadow-md, var(--ds-shadow-md, 0 4px 6px rgba(0, 0, 0, 0.1)));

    /* Transitions - from design system */
    --wt-nav-transition-fast: var(--ds-transition-fast, 150ms ease);
    --wt-nav-transition-normal: var(--ds-transition-normal, 200ms ease);
  }

  :host([theme='dark']) {
    ${generateCSSVariables('dark')}

    --wt-nav-bg-primary: var(--wt-theme-bg-primary, var(--ds-bg-primary, #0f172a));
    --wt-nav-bg-secondary: var(--wt-theme-bg-secondary, var(--ds-bg-secondary, #1e293b));
    --wt-nav-bg-tertiary: var(--wt-theme-bg-tertiary, var(--ds-bg-tertiary, #334155));
    --wt-nav-border: var(--wt-theme-border, var(--ds-border-default, #475569));
    --wt-nav-text-primary: var(--wt-theme-text-primary, var(--ds-text-primary, #f1f5f9));
    --wt-nav-text-secondary: var(--wt-theme-text-secondary, var(--ds-text-secondary, #cbd5e1));
    --wt-nav-text-muted: var(--wt-theme-text-muted, var(--ds-text-muted, #64748b));
    --wt-nav-accent: var(--wt-theme-accent, var(--ds-accent, #22d3ee));
    --wt-nav-accent-hover: var(--wt-theme-accent-hover, var(--ds-accent-hover, #67e8f9));
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
    font-family: var(--wt-nav-font-sans);
    font-size: var(--wt-nav-font-size-md);
    color: var(--wt-nav-text-primary);
  }
`;

/**
 * Focus styles for accessibility
 */
export const focusStyles = css`
  :focus-visible {
    outline: 2px solid var(--wt-nav-accent);
    outline-offset: 2px;
  }

  button:focus-visible {
    outline: 2px solid var(--wt-nav-accent);
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
    gap: var(--wt-nav-spacing-sm);
    padding: var(--wt-nav-spacing-sm) var(--wt-nav-spacing-md);
    border: 1px solid var(--wt-nav-border);
    border-radius: var(--wt-nav-radius-sm);
    background: var(--wt-nav-bg-primary);
    color: var(--wt-nav-text-primary);
    font-family: inherit;
    font-size: var(--wt-nav-font-size-md);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.15s ease;
  }

  button:hover {
    background: var(--wt-nav-bg-secondary);
    border-color: var(--wt-nav-text-muted);
  }

  button:active {
    background: var(--wt-nav-bg-tertiary);
  }

  button[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
  }

  button.primary {
    background: var(--wt-nav-accent);
    border-color: var(--wt-nav-accent);
    color: var(--wt-nav-bg-primary);
  }

  button.primary:hover {
    background: var(--wt-nav-accent-hover);
    border-color: var(--wt-nav-accent-hover);
  }

  button.ghost {
    background: transparent;
    border-color: transparent;
  }

  button.ghost:hover {
    background: var(--wt-nav-bg-secondary);
  }
`;

/**
 * Combined shared styles
 */
export const sharedStyles = [colors, typography, focusStyles, buttonStyles];
