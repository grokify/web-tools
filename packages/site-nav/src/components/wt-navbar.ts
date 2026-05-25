/**
 * WtNavbar Component
 *
 * Main navigation bar with brand, links, dropdowns, mega menu trigger, and mobile toggle.
 * Designed to be data-driven and customizable.
 */

import { LitElement, html, nothing } from 'lit';
import { customElement, property, state, query } from 'lit/decorators.js';
import { navbarStyles } from '../styles/navbar.styles.js';
import { chevronDownIcon, hamburgerIcon, closeIcon } from '../icons.js';
import type {
  NavbarConfig,
  DropdownMenu,
  MenuItem,
} from '../types/navbar.js';
import './wt-mega-menu.js';
import './wt-mobile-menu.js';

@customElement('wt-navbar')
export class WtNavbar extends LitElement {
  static override styles = navbarStyles;

  /**
   * Navbar configuration
   */
  @property({ type: Object })
  config: NavbarConfig = {};

  /**
   * Theme (light/dark)
   */
  @property({ type: String, reflect: true })
  theme: 'light' | 'dark' = 'dark';

  @state() private _megaMenuOpen = false;
  @state() private _mobileMenuOpen = false;
  @state() private _activeDropdown: string | null = null;

  @query('.navbar-mobile-toggle') private _mobileToggle!: HTMLButtonElement;
  @query('.megamenu-trigger') private _megaMenuTrigger!: HTMLButtonElement;

  private _boundHandleKeydown: (e: KeyboardEvent) => void;
  private _boundHandleClickOutside: (e: MouseEvent) => void;

  constructor() {
    super();
    this._boundHandleKeydown = this._handleKeydown.bind(this);
    this._boundHandleClickOutside = this._handleClickOutside.bind(this);
  }

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener('keydown', this._boundHandleKeydown);
    document.addEventListener('mousedown', this._boundHandleClickOutside);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this._boundHandleKeydown);
    document.removeEventListener('mousedown', this._boundHandleClickOutside);
  }

  private _handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      if (this._activeDropdown) {
        this._activeDropdown = null;
      } else if (this._megaMenuOpen) {
        this._megaMenuOpen = false;
        this._megaMenuTrigger?.focus();
      } else if (this._mobileMenuOpen) {
        this._mobileMenuOpen = false;
        this._mobileToggle?.focus();
      }
    }
  }

  private _handleClickOutside(e: MouseEvent) {
    const target = e.target as Node;

    // Check if click is outside dropdowns
    if (this._activeDropdown) {
      const dropdownEl = this.shadowRoot?.querySelector(
        `[data-dropdown="${this._activeDropdown}"]`
      );
      if (dropdownEl && !dropdownEl.contains(target)) {
        this._activeDropdown = null;
      }
    }
  }

  private _toggleMegaMenu() {
    this._activeDropdown = null;
    this._megaMenuOpen = !this._megaMenuOpen;
  }

  private _toggleDropdown(id: string) {
    this._megaMenuOpen = false;
    this._activeDropdown = this._activeDropdown === id ? null : id;
  }

  private _toggleMobileMenu() {
    this._mobileMenuOpen = !this._mobileMenuOpen;
  }

  private _closeMegaMenu() {
    this._megaMenuOpen = false;
  }

  private _closeMobileMenu() {
    this._mobileMenuOpen = false;
  }

  private _closeDropdowns() {
    this._activeDropdown = null;
  }

  private _getUrl(href?: string): string {
    if (!href) return '#';
    if (href.startsWith('http') || href.startsWith('/')) return href;
    const baseUrl = this.config.baseUrl || '';
    return `${baseUrl}${href.startsWith('/') ? '' : '/'}${href}`;
  }

  override render() {
    return html`
      <nav class="navbar" aria-label="Main navigation">
        <a href="#main-content" class="skip-link">Skip to main content</a>

        <div class="navbar-container">
          ${this._renderBrand()}
          ${this._renderDesktopLinks()}
          ${this._renderMobileToggle()}
        </div>

        ${this.config.megaMenu
          ? html`
              <wt-mega-menu
                ?open=${this._megaMenuOpen}
                .config=${this.config.megaMenu}
                .baseUrl=${this.config.baseUrl || ''}
                theme=${this.theme}
                @close=${this._closeMegaMenu}
              ></wt-mega-menu>
            `
          : nothing}

        <wt-mobile-menu
          ?open=${this._mobileMenuOpen}
          .config=${this.config}
          theme=${this.theme}
          @close=${this._closeMobileMenu}
        ></wt-mobile-menu>
      </nav>
    `;
  }

  private _renderBrand() {
    const brand = this.config.brand;
    if (!brand) return nothing;

    const href = brand.href || this.config.baseUrl || '/';

    // If custom HTML is provided, use it
    if (brand.html) {
      return html`
        <a href=${href} class="navbar-brand">
          <span .innerHTML=${brand.html}></span>
        </a>
      `;
    }

    return html`
      <a href=${href} class="navbar-brand">
        ${brand.logoUrl
          ? html`<img
              src=${brand.logoUrl}
              alt=${brand.logoAlt || brand.name}
              class="navbar-logo"
            />`
          : nothing}
        <span class="navbar-title">${brand.name}</span>
      </a>
    `;
  }

  private _renderDesktopLinks() {
    return html`
      <div class="navbar-links">
        <!-- Mega menu trigger -->
        ${this.config.megaMenu
          ? html`
              <button
                class="navbar-link megamenu-trigger"
                aria-expanded=${this._megaMenuOpen}
                aria-haspopup="true"
                @click=${this._toggleMegaMenu}
              >
                ${this.config.megaMenu.label} ${chevronDownIcon}
              </button>
            `
          : nothing}

        <!-- Simple links -->
        ${this.config.links?.map(
          (link) => html`
            <a
              href=${this._getUrl(link.href)}
              class="navbar-link"
              ?target=${link.external ? '_blank' : nothing}
              ?rel=${link.external ? 'noopener noreferrer' : nothing}
            >
              ${link.label}
            </a>
          `
        )}

        <!-- Dropdown menus -->
        ${this.config.dropdowns?.map((dropdown) =>
          this._renderDropdown(dropdown)
        )}

        <!-- Action buttons -->
        ${this.config.actions?.map(
          (action) => html`
            <a
              href=${this._getUrl(action.href)}
              class="navbar-action"
              ?target=${action.external ? '_blank' : nothing}
              ?rel=${action.external ? 'noopener noreferrer' : nothing}
            >
              ${action.icon
                ? html`<span class="icon" .innerHTML=${action.icon}></span>`
                : nothing}
              ${action.label}
            </a>
          `
        )}
      </div>
    `;
  }

  private _renderDropdown(dropdown: DropdownMenu) {
    const isOpen = this._activeDropdown === dropdown.id;

    return html`
      <div
        class="navbar-dropdown ${isOpen ? 'open' : ''}"
        data-dropdown=${dropdown.id}
      >
        <button
          class="navbar-link"
          aria-expanded=${isOpen}
          aria-haspopup="true"
          @click=${() => this._toggleDropdown(dropdown.id)}
        >
          ${dropdown.label} ${chevronDownIcon}
        </button>
        <div class="navbar-dropdown-menu">
          ${dropdown.items.map(
            (item) => html`
              <a
                href=${this._getUrl(item.href)}
                class="navbar-dropdown-item"
                ?target=${item.external ? '_blank' : nothing}
                ?rel=${item.external ? 'noopener noreferrer' : nothing}
                @click=${this._closeDropdowns}
              >
                ${item.icon
                  ? html`<span class="icon" .innerHTML=${item.icon}></span>`
                  : nothing}
                ${item.label}
              </a>
            `
          )}
          ${dropdown.extraItems
            ? html`
                <div class="navbar-dropdown-divider"></div>
                ${dropdown.extraItems.map(
                  (item) => html`
                    <a
                      href=${this._getUrl(item.href)}
                      class="navbar-dropdown-item"
                      ?target=${item.external ? '_blank' : nothing}
                      ?rel=${item.external ? 'noopener noreferrer' : nothing}
                      @click=${this._closeDropdowns}
                    >
                      ${item.icon
                        ? html`<span class="icon" .innerHTML=${item.icon}></span>`
                        : nothing}
                      ${item.label}
                    </a>
                  `
                )}
              `
            : nothing}
        </div>
      </div>
    `;
  }

  private _renderMobileToggle() {
    return html`
      <button
        class="navbar-mobile-toggle"
        aria-label="Toggle navigation menu"
        aria-expanded=${this._mobileMenuOpen}
        aria-controls="mobile-menu"
        @click=${this._toggleMobileMenu}
      >
        ${hamburgerIcon} ${closeIcon}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wt-navbar': WtNavbar;
  }
}
