import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { sharedStyles } from '../styles/shared.styles.js';
import type { HeaderAction, HeaderActionEventDetail, Theme } from '../types.js';

/**
 * A page header component with title, version badge, description, and action buttons.
 *
 * @fires wt-header-action - Fired when an action button is clicked
 *
 * @example
 * ```html
 * <wt-header
 *   title="My Application"
 *   version="1.0.0"
 *   description="A description of the application"
 *   .actions=${[
 *     { id: 'save', label: 'Save', variant: 'primary' },
 *     { id: 'settings', label: 'Settings' }
 *   ]}
 *   theme="dark"
 * ></wt-header>
 * ```
 */
@customElement('wt-header')
export class WtHeader extends LitElement {
  static styles = [
    ...sharedStyles,
    css`
      :host {
        display: block;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: var(--wt-nav-spacing-lg);
        padding-bottom: var(--wt-nav-spacing-lg);
        border-bottom: 1px solid var(--wt-nav-border);
      }

      .header-info {
        flex: 1;
        min-width: 0;
      }

      .header-title-row {
        display: flex;
        align-items: center;
        gap: var(--wt-nav-spacing-sm);
        flex-wrap: wrap;
      }

      .header-title {
        font-size: 1.75rem;
        font-weight: 700;
        margin: 0;
        color: var(--wt-nav-text-primary);
        letter-spacing: -0.025em;
      }

      .header-version {
        display: inline-block;
        padding: 4px 8px;
        font-size: var(--wt-nav-font-size-sm);
        font-weight: 500;
        background: var(--wt-nav-accent);
        color: var(--wt-nav-bg-primary);
        border-radius: var(--wt-nav-radius-sm);
      }

      .header-description {
        font-size: var(--wt-nav-font-size-lg);
        color: var(--wt-nav-text-secondary);
        margin: var(--wt-nav-spacing-sm) 0 0;
        max-width: 600px;
        line-height: 1.5;
      }

      .header-actions {
        display: flex;
        gap: var(--wt-nav-spacing-sm);
        align-items: center;
        flex-shrink: 0;
      }

      /* Responsive: stack on small screens */
      @media (max-width: 640px) {
        .header {
          flex-direction: column;
          align-items: stretch;
        }

        .header-actions {
          justify-content: flex-start;
        }
      }
    `,
  ];

  /**
   * Page/section title
   */
  @property({ type: String })
  title = '';

  /**
   * Version badge text (optional)
   */
  @property({ type: String })
  version = '';

  /**
   * Description text (optional)
   */
  @property({ type: String })
  description = '';

  /**
   * Action buttons to display
   */
  @property({ type: Array })
  actions: HeaderAction[] = [];

  /**
   * Theme variant
   */
  @property({ type: String, reflect: true })
  theme: Theme = 'light';

  private _handleAction(action: HeaderAction) {
    if (action.disabled) return;

    const detail: HeaderActionEventDetail = {
      actionId: action.id,
    };

    this.dispatchEvent(
      new CustomEvent('wt-header-action', {
        detail,
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <header class="header">
        <div class="header-info">
          <div class="header-title-row">
            <h1 class="header-title">${this.title}</h1>
            ${this.version
              ? html`<span class="header-version">v${this.version}</span>`
              : nothing}
          </div>
          ${this.description
            ? html`<p class="header-description">${this.description}</p>`
            : nothing}
        </div>

        ${this.actions.length > 0
          ? html`
              <div class="header-actions">
                ${this.actions.map(
                  (action) => html`
                    <button
                      class="${action.variant || 'default'}"
                      ?disabled="${action.disabled}"
                      @click="${() => this._handleAction(action)}"
                    >
                      ${action.icon ? html`<span>${action.icon}</span>` : nothing}
                      ${action.label}
                    </button>
                  `
                )}
              </div>
            `
          : nothing}
      </header>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wt-header': WtHeader;
  }
}
