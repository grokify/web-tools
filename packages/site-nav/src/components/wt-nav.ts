import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../styles/shared.styles.js';
import type { NavItem, NavChangeEventDetail, Theme } from '../types.js';

/**
 * A tab-style navigation component.
 *
 * @fires wt-nav-change - Fired when the active item changes
 *
 * @example
 * ```html
 * <wt-nav
 *   .items=${[
 *     { id: 'overview', label: 'Overview' },
 *     { id: 'colors', label: 'Colors', count: 12 },
 *     { id: 'components', label: 'Components', count: 8 }
 *   ]}
 *   active="overview"
 *   theme="dark"
 * ></wt-nav>
 * ```
 */
@customElement('wt-nav')
export class WtNav extends LitElement {
  static styles = [
    ...sharedStyles,
    css`
      :host {
        display: block;
      }

      .nav {
        display: flex;
        gap: var(--wt-nav-spacing-xs);
        padding: var(--wt-nav-spacing-xs);
        background: var(--wt-nav-bg-secondary);
        border-radius: var(--wt-nav-radius-md);
        overflow-x: auto;
        scrollbar-width: thin;
      }

      .nav::-webkit-scrollbar {
        height: 4px;
      }

      .nav::-webkit-scrollbar-track {
        background: transparent;
      }

      .nav::-webkit-scrollbar-thumb {
        background: var(--wt-nav-border);
        border-radius: 2px;
      }

      .nav-btn {
        display: flex;
        align-items: center;
        gap: var(--wt-nav-spacing-sm);
        padding: var(--wt-nav-spacing-sm) var(--wt-nav-spacing-md);
        font-size: var(--wt-nav-font-size-md);
        font-weight: 500;
        background: transparent;
        color: var(--wt-nav-text-secondary);
        border: none;
        border-radius: var(--wt-nav-radius-sm);
        cursor: pointer;
        white-space: nowrap;
        transition: all 0.2s ease;
      }

      .nav-btn:hover:not([disabled]) {
        background: var(--wt-nav-bg-tertiary);
        color: var(--wt-nav-text-primary);
      }

      .nav-btn--active {
        background: var(--wt-nav-bg-primary);
        color: var(--wt-nav-text-primary);
        box-shadow: var(--wt-nav-shadow-sm);
      }

      .nav-btn[disabled] {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .nav-icon {
        font-size: 1rem;
      }

      .nav-count {
        font-size: var(--wt-nav-font-size-sm);
        padding: 2px 6px;
        background: var(--wt-nav-bg-tertiary);
        border-radius: var(--wt-nav-radius-sm);
        color: var(--wt-nav-text-muted);
      }

      .nav-btn--active .nav-count {
        background: var(--wt-nav-accent);
        color: var(--wt-nav-bg-primary);
      }

      /* Vertical variant */
      :host([orientation='vertical']) .nav {
        flex-direction: column;
        overflow-x: visible;
        overflow-y: auto;
      }

      :host([orientation='vertical']) .nav-btn {
        justify-content: flex-start;
      }
    `,
  ];

  /**
   * Array of navigation items to display
   */
  @property({ type: Array })
  items: NavItem[] = [];

  /**
   * ID of the currently active item
   */
  @property({ type: String, reflect: true })
  active = '';

  /**
   * Theme variant
   */
  @property({ type: String, reflect: true })
  theme: Theme = 'light';

  /**
   * Orientation of the nav (horizontal or vertical)
   */
  @property({ type: String, reflect: true })
  orientation: 'horizontal' | 'vertical' = 'horizontal';

  private _handleClick(item: NavItem) {
    if (item.disabled) return;

    const previousActive = this.active;
    this.active = item.id;

    // If item has href, let the browser handle navigation
    if (item.href) {
      window.location.href = item.href;
      return;
    }

    // Dispatch change event
    const detail: NavChangeEventDetail = {
      itemId: item.id,
      previousItemId: previousActive || undefined,
    };

    this.dispatchEvent(
      new CustomEvent('wt-nav-change', {
        detail,
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <nav class="nav" role="tablist">
        ${this.items.map(
          (item) => html`
            <button
              class="nav-btn ${this.active === item.id ? 'nav-btn--active' : ''}"
              role="tab"
              aria-selected="${this.active === item.id}"
              ?disabled="${item.disabled}"
              @click="${() => this._handleClick(item)}"
            >
              ${item.icon ? html`<span class="nav-icon">${item.icon}</span>` : nothing}
              <span class="nav-label">${item.label}</span>
              ${item.count !== undefined
                ? html`<span class="nav-count">${item.count}</span>`
                : nothing}
            </button>
          `
        )}
      </nav>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wt-nav': WtNav;
  }
}
