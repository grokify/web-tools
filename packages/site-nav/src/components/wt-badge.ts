import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../styles/shared.styles.js';
import type { Theme } from '../types.js';

/**
 * Badge variants with associated colors
 */
export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'm1'
  | 'm2'
  | 'm3'
  | 'm4'
  | 'm5';

/**
 * A badge component for displaying status, counts, or maturity levels.
 *
 * @example
 * ```html
 * <wt-badge variant="success">Active</wt-badge>
 * <wt-badge variant="m3">M3</wt-badge>
 * <wt-badge count="12"></wt-badge>
 * ```
 */
@customElement('wt-badge')
export class WtBadge extends LitElement {
  static styles = [
    ...sharedStyles,
    css`
      :host {
        display: inline-flex;
      }

      .badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 2px 8px;
        font-size: var(--wt-nav-font-size-sm);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.025em;
        border-radius: var(--wt-nav-radius-sm);
        white-space: nowrap;
      }

      /* Variants */
      .badge--default {
        background: var(--wt-nav-bg-tertiary);
        color: var(--wt-nav-text-secondary);
      }

      .badge--primary {
        background: var(--wt-nav-accent);
        color: var(--wt-nav-bg-primary);
      }

      .badge--success {
        background: #10b981;
        color: #ffffff;
      }

      .badge--warning {
        background: #f59e0b;
        color: #000000;
      }

      .badge--error {
        background: #ef4444;
        color: #ffffff;
      }

      .badge--info {
        background: #3b82f6;
        color: #ffffff;
      }

      /* Maturity level variants */
      .badge--m1 {
        background: #ef4444;
        color: #ffffff;
      }

      .badge--m2 {
        background: #f59e0b;
        color: #000000;
      }

      .badge--m3 {
        background: #eab308;
        color: #000000;
      }

      .badge--m4 {
        background: #22c55e;
        color: #ffffff;
      }

      .badge--m5 {
        background: #3b82f6;
        color: #ffffff;
      }

      /* Outline variant */
      :host([outline]) .badge {
        background: transparent;
        border: 1px solid currentColor;
      }

      :host([outline]) .badge--default {
        color: var(--wt-nav-text-secondary);
        border-color: var(--wt-nav-border);
      }

      :host([outline]) .badge--success {
        color: #10b981;
      }

      :host([outline]) .badge--warning {
        color: #f59e0b;
      }

      :host([outline]) .badge--error {
        color: #ef4444;
      }

      :host([outline]) .badge--info {
        color: #3b82f6;
      }

      /* Size variants */
      :host([size='sm']) .badge {
        padding: 1px 4px;
        font-size: 0.625rem;
      }

      :host([size='lg']) .badge {
        padding: 4px 12px;
        font-size: var(--wt-nav-font-size-md);
      }
    `,
  ];

  /**
   * Badge variant/color
   */
  @property({ type: String, reflect: true })
  variant: BadgeVariant = 'default';

  /**
   * If set, displays a number instead of slot content
   */
  @property({ type: Number })
  count?: number;

  /**
   * Theme variant
   */
  @property({ type: String, reflect: true })
  theme: Theme = 'light';

  /**
   * Size variant
   */
  @property({ type: String, reflect: true })
  size: 'sm' | 'md' | 'lg' = 'md';

  /**
   * Whether to use outline style
   */
  @property({ type: Boolean, reflect: true })
  outline = false;

  render() {
    return html`
      <span class="badge badge--${this.variant}">
        ${this.count !== undefined ? this.count : html`<slot></slot>`}
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wt-badge': WtBadge;
  }
}
