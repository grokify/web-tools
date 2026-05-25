import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { generateCSSVariables } from '../styles/design-system.js';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeChangeEventDetail {
  theme: ThemeMode;
  resolvedTheme: 'light' | 'dark';
}

const STORAGE_KEY = 'wt-theme-preference';

/**
 * Theme toggle component with light/dark/system mode support.
 *
 * @fires wt-theme-change - Fired when theme changes
 *
 * @example
 * ```html
 * <wt-theme-toggle></wt-theme-toggle>
 * <wt-theme-toggle mode="dark"></wt-theme-toggle>
 * <wt-theme-toggle show-label></wt-theme-toggle>
 * ```
 */
@customElement('wt-theme-toggle')
export class WtThemeToggle extends LitElement {
  static override styles = css`
    :host {
      ${generateCSSVariables('dark')}
      display: inline-flex;
      align-items: center;
      gap: var(--ds-space-2);
    }

    :host([theme="light"]) {
      ${generateCSSVariables('light')}
    }

    .toggle-container {
      display: flex;
      align-items: center;
      gap: var(--ds-space-2);
    }

    .toggle-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      padding: 0;
      border: 1px solid var(--ds-border-default);
      border-radius: var(--ds-radius-md);
      background: var(--ds-bg-secondary);
      color: var(--ds-text-primary);
      cursor: pointer;
      transition: all var(--ds-transition-fast);
    }

    .toggle-button:hover {
      background: var(--ds-bg-tertiary);
      border-color: var(--ds-border-strong);
    }

    .toggle-button:focus-visible {
      outline: 2px solid var(--ds-accent);
      outline-offset: 2px;
    }

    .toggle-button svg {
      width: 20px;
      height: 20px;
    }

    .toggle-label {
      font-family: var(--ds-font-sans);
      font-size: var(--ds-text-sm);
      color: var(--ds-text-secondary);
    }

    /* Segmented control variant */
    .segmented-control {
      display: flex;
      background: var(--ds-bg-tertiary);
      border-radius: var(--ds-radius-md);
      padding: 2px;
      gap: 2px;
    }

    .segment {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--ds-space-1) var(--ds-space-2);
      border: none;
      border-radius: var(--ds-radius-sm);
      background: transparent;
      color: var(--ds-text-muted);
      cursor: pointer;
      transition: all var(--ds-transition-fast);
      font-family: var(--ds-font-sans);
      font-size: var(--ds-text-xs);
    }

    .segment:hover {
      color: var(--ds-text-secondary);
    }

    .segment[aria-pressed="true"] {
      background: var(--ds-bg-primary);
      color: var(--ds-text-primary);
      box-shadow: var(--ds-shadow-sm);
    }

    .segment:focus-visible {
      outline: 2px solid var(--ds-accent);
      outline-offset: -2px;
    }

    .segment svg {
      width: 14px;
      height: 14px;
    }

    .segment-label {
      margin-left: var(--ds-space-1);
    }
  `;

  /**
   * Current theme mode: 'light', 'dark', or 'system'.
   */
  @property({ type: String })
  mode: ThemeMode = 'system';

  /**
   * Which theme attribute is currently active for styling.
   */
  @property({ type: String, reflect: true })
  theme: 'light' | 'dark' = 'dark';

  /**
   * Whether to show labels next to icons.
   */
  @property({ type: Boolean, attribute: 'show-label' })
  showLabel = false;

  /**
   * Variant: 'icon' (single toggle button) or 'segmented' (three options).
   */
  @property({ type: String })
  variant: 'icon' | 'segmented' = 'icon';

  /**
   * Whether to persist theme preference to localStorage.
   */
  @property({ type: Boolean })
  persist = true;

  /**
   * Target element selector to apply theme attribute to.
   * Defaults to 'html' (document.documentElement).
   */
  @property({ type: String, attribute: 'target-selector' })
  targetSelector = 'html';

  @state()
  private _resolvedTheme: 'light' | 'dark' = 'dark';

  private _mediaQuery: MediaQueryList | null = null;

  override connectedCallback(): void {
    super.connectedCallback();

    // Load persisted preference
    if (this.persist) {
      const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        this.mode = stored;
      }
    }

    // Set up system preference listener
    this._mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this._mediaQuery.addEventListener('change', this._handleSystemChange);

    // Apply initial theme
    this._updateResolvedTheme();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._mediaQuery?.removeEventListener('change', this._handleSystemChange);
  }

  private _handleSystemChange = (): void => {
    if (this.mode === 'system') {
      this._updateResolvedTheme();
    }
  };

  private _updateResolvedTheme(): void {
    let resolved: 'light' | 'dark';

    if (this.mode === 'system') {
      resolved = this._mediaQuery?.matches ? 'dark' : 'light';
    } else {
      resolved = this.mode;
    }

    this._resolvedTheme = resolved;
    this.theme = resolved;

    // Apply to target element
    const target = document.querySelector(this.targetSelector);
    if (target) {
      target.setAttribute('theme', resolved);
    }

    // Dispatch event
    this.dispatchEvent(
      new CustomEvent<ThemeChangeEventDetail>('wt-theme-change', {
        detail: {
          theme: this.mode,
          resolvedTheme: resolved,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _setMode(newMode: ThemeMode): void {
    this.mode = newMode;

    if (this.persist) {
      localStorage.setItem(STORAGE_KEY, newMode);
    }

    this._updateResolvedTheme();
  }

  private _toggleTheme(): void {
    // Icon variant: toggle between light and dark (skip system)
    const newMode = this._resolvedTheme === 'dark' ? 'light' : 'dark';
    this._setMode(newMode);
  }

  private _renderSunIcon() {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    `;
  }

  private _renderMoonIcon() {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
  }

  private _renderSystemIcon() {
    return html`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
        <line x1="8" y1="21" x2="16" y2="21"></line>
        <line x1="12" y1="17" x2="12" y2="21"></line>
      </svg>
    `;
  }

  private _renderIconVariant() {
    return html`
      <button
        class="toggle-button"
        @click=${this._toggleTheme}
        aria-label=${this._resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        title=${this._resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        ${this._resolvedTheme === 'dark' ? this._renderSunIcon() : this._renderMoonIcon()}
      </button>
      ${this.showLabel
        ? html`<span class="toggle-label">${this._resolvedTheme === 'dark' ? 'Light' : 'Dark'}</span>`
        : ''}
    `;
  }

  private _renderSegmentedVariant() {
    return html`
      <div class="segmented-control" role="group" aria-label="Theme selection">
        <button
          class="segment"
          aria-pressed=${this.mode === 'light'}
          @click=${() => this._setMode('light')}
          title="Light mode"
        >
          ${this._renderSunIcon()}
          ${this.showLabel ? html`<span class="segment-label">Light</span>` : ''}
        </button>
        <button
          class="segment"
          aria-pressed=${this.mode === 'system'}
          @click=${() => this._setMode('system')}
          title="System preference"
        >
          ${this._renderSystemIcon()}
          ${this.showLabel ? html`<span class="segment-label">System</span>` : ''}
        </button>
        <button
          class="segment"
          aria-pressed=${this.mode === 'dark'}
          @click=${() => this._setMode('dark')}
          title="Dark mode"
        >
          ${this._renderMoonIcon()}
          ${this.showLabel ? html`<span class="segment-label">Dark</span>` : ''}
        </button>
      </div>
    `;
  }

  override render() {
    return html`
      <div class="toggle-container">
        ${this.variant === 'segmented'
          ? this._renderSegmentedVariant()
          : this._renderIconVariant()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wt-theme-toggle': WtThemeToggle;
  }
}
