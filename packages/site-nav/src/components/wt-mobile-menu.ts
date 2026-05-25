/**
 * WtMobileMenu Component
 *
 * Mobile slide-out menu with collapsible sections.
 */

import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { mobileMenuStyles } from '../styles/navbar.styles.js';
import type { NavbarConfig, MobileMenuSection, MenuItem } from '../types/navbar.js';

@customElement('wt-mobile-menu')
export class WtMobileMenu extends LitElement {
  static override styles = mobileMenuStyles;

  /**
   * Whether the mobile menu is open
   */
  @property({ type: Boolean, reflect: true })
  open = false;

  /**
   * Navbar configuration (used to generate mobile sections if not explicit)
   */
  @property({ type: Object })
  config: NavbarConfig = {};

  /**
   * Theme (light/dark)
   */
  @property({ type: String, reflect: true })
  theme: 'light' | 'dark' = 'dark';

  private _handleLinkClick = () => {
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  };

  private _getUrl(href?: string): string {
    if (!href) return '#';
    if (href.startsWith('http') || href.startsWith('/')) return href;
    const baseUrl = this.config.baseUrl || '';
    return `${baseUrl}${href.startsWith('/') ? '' : '/'}${href}`;
  }

  /**
   * Generate mobile sections from navbar config if not explicitly provided
   */
  private _getSections(): MobileMenuSection[] {
    // If explicit mobile sections provided, use them
    if (this.config.mobileSections?.length) {
      return this.config.mobileSections;
    }

    // Otherwise, generate from navbar config
    const sections: MobileMenuSection[] = [];

    // Mega menu categories become a section
    if (this.config.megaMenu) {
      const megaItems: MenuItem[] = this.config.megaMenu.categories.map((cat) => ({
        id: cat.id,
        label: cat.label,
        href: cat.href,
      }));
      sections.push({
        id: 'mega-menu',
        label: this.config.megaMenu.label,
        items: megaItems,
      });
    }

    // Simple links become a section
    if (this.config.links?.length) {
      sections.push({
        id: 'links',
        items: this.config.links,
      });
    }

    // Each dropdown becomes a section
    this.config.dropdowns?.forEach((dropdown) => {
      const items: MenuItem[] = [...dropdown.items];
      if (dropdown.extraItems) {
        items.push(...dropdown.extraItems);
      }
      sections.push({
        id: dropdown.id,
        label: dropdown.label,
        items,
      });
    });

    // Actions become a section
    if (this.config.actions?.length) {
      sections.push({
        id: 'actions',
        items: this.config.actions,
      });
    }

    return sections;
  }

  override render() {
    const sections = this._getSections();

    return html`
      <div class="mobile-menu" role="navigation" aria-label="Mobile navigation">
        ${sections.map((section) => this._renderSection(section))}
      </div>
    `;
  }

  private _renderSection(section: MobileMenuSection) {
    return html`
      <div class="mobile-section">
        ${section.label
          ? html`<span class="mobile-label">${section.label}</span>`
          : nothing}
        ${section.items.map((item) => this._renderLink(item))}
      </div>
    `;
  }

  private _renderLink(item: MenuItem) {
    return html`
      <a
        href=${this._getUrl(item.href)}
        class="mobile-link"
        ?target=${item.external ? '_blank' : nothing}
        ?rel=${item.external ? 'noopener noreferrer' : nothing}
        @click=${this._handleLinkClick}
      >
        ${item.icon
          ? html`<span class="mobile-link-icon" .innerHTML=${item.icon}></span>`
          : nothing}
        ${item.label}
      </a>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wt-mobile-menu': WtMobileMenu;
  }
}
