import { LitElement, html, css, nothing } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { sharedStyles } from '../styles/shared.styles.js';
import type { Theme } from '../types.js';

/**
 * Filter option definition
 */
export interface FilterOption {
  /** Unique value for this option */
  value: string;
  /** Display label */
  label: string;
  /** Color indicator (hex color) */
  color?: string;
  /** Whether initially checked */
  checked?: boolean;
}

/**
 * Filter change event detail
 */
export interface FilterChangeEventDetail {
  /** Filter group name */
  filterName: string;
  /** Currently selected values */
  selectedValues: string[];
  /** All available values */
  allValues: string[];
}

/**
 * A filter group component with toggle buttons for filtering data.
 *
 * @fires wt-filter-change - Fired when filter selection changes
 *
 * @example
 * ```html
 * <wt-filter-group
 *   name="status"
 *   label="Status"
 *   .options=${[
 *     { value: 'operational', label: 'Operational', color: '#10b981', checked: true },
 *     { value: 'planned', label: 'Planned', color: '#9ca3af', checked: true }
 *   ]}
 *   theme="dark"
 * ></wt-filter-group>
 * ```
 */
@customElement('wt-filter-group')
export class WtFilterGroup extends LitElement {
  static styles = [
    ...sharedStyles,
    css`
      :host {
        display: block;
      }

      .filter-group {
        display: flex;
        flex-direction: column;
        gap: var(--wt-nav-spacing-sm);
      }

      .filter-label {
        font-size: var(--wt-nav-font-size-sm);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--wt-nav-text-muted);
      }

      .filter-options {
        display: flex;
        flex-wrap: wrap;
        gap: var(--wt-nav-spacing-sm);
      }

      .filter-btn {
        display: flex;
        align-items: center;
        gap: var(--wt-nav-spacing-sm);
        padding: var(--wt-nav-spacing-sm) var(--wt-nav-spacing-md);
        border-radius: var(--wt-nav-radius-md);
        font-size: var(--wt-nav-font-size-md);
        font-weight: 500;
        cursor: pointer;
        transition: all 0.15s ease;
        border: 1px solid var(--wt-nav-border);
        background: transparent;
        color: var(--wt-nav-text-primary);
        user-select: none;
      }

      .filter-btn:hover {
        background: var(--wt-nav-bg-secondary);
      }

      .filter-btn input {
        display: none;
      }

      .filter-btn--inactive {
        opacity: 0.4;
      }

      .filter-color {
        width: 14px;
        height: 14px;
        border-radius: var(--wt-nav-radius-sm);
        flex-shrink: 0;
      }

      .filter-actions {
        display: flex;
        gap: var(--wt-nav-spacing-sm);
        margin-top: var(--wt-nav-spacing-sm);
        padding-top: var(--wt-nav-spacing-sm);
        border-top: 1px solid var(--wt-nav-border);
      }

      .filter-actions button {
        padding: var(--wt-nav-spacing-xs) var(--wt-nav-spacing-sm);
        font-size: var(--wt-nav-font-size-sm);
      }
    `,
  ];

  /**
   * Filter group name (used in events)
   */
  @property({ type: String })
  name = '';

  /**
   * Label displayed above the filter options
   */
  @property({ type: String })
  label = '';

  /**
   * Array of filter options
   */
  @property({ type: Array })
  options: FilterOption[] = [];

  /**
   * Whether to show Select All / Clear All buttons
   */
  @property({ type: Boolean })
  showActions = false;

  /**
   * Theme variant
   */
  @property({ type: String, reflect: true })
  theme: Theme = 'light';

  @state()
  private _selectedValues: Set<string> = new Set();

  connectedCallback() {
    super.connectedCallback();
    // Initialize selected values from options
    this._selectedValues = new Set(
      this.options.filter((o) => o.checked !== false).map((o) => o.value)
    );
  }

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('options')) {
      // Re-initialize when options change
      this._selectedValues = new Set(
        this.options.filter((o) => o.checked !== false).map((o) => o.value)
      );
    }
  }

  private _toggleOption(value: string) {
    if (this._selectedValues.has(value)) {
      this._selectedValues.delete(value);
    } else {
      this._selectedValues.add(value);
    }
    this._selectedValues = new Set(this._selectedValues); // Trigger reactivity
    this._dispatchChange();
  }

  private _selectAll() {
    this._selectedValues = new Set(this.options.map((o) => o.value));
    this._dispatchChange();
  }

  private _clearAll() {
    this._selectedValues = new Set();
    this._dispatchChange();
  }

  private _dispatchChange() {
    const detail: FilterChangeEventDetail = {
      filterName: this.name,
      selectedValues: Array.from(this._selectedValues),
      allValues: this.options.map((o) => o.value),
    };

    this.dispatchEvent(
      new CustomEvent('wt-filter-change', {
        detail,
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div class="filter-group">
        ${this.label ? html`<div class="filter-label">${this.label}</div>` : nothing}

        <div class="filter-options">
          ${this.options.map((option) => {
            const isSelected = this._selectedValues.has(option.value);
            return html`
              <label
                class="filter-btn ${isSelected ? '' : 'filter-btn--inactive'}"
                @click="${() => this._toggleOption(option.value)}"
              >
                <input type="checkbox" ?checked="${isSelected}" />
                ${option.color
                  ? html`<span
                      class="filter-color"
                      style="background-color: ${option.color}"
                    ></span>`
                  : nothing}
                <span>${option.label}</span>
              </label>
            `;
          })}
        </div>

        ${this.showActions
          ? html`
              <div class="filter-actions">
                <button class="ghost" @click="${this._selectAll}">Select All</button>
                <button class="ghost" @click="${this._clearAll}">Clear All</button>
              </div>
            `
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wt-filter-group': WtFilterGroup;
  }
}
