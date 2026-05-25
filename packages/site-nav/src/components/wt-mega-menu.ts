/**
 * WtMegaMenu Component
 *
 * Multi-column mega menu with categories and featured items.
 */

import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { megaMenuStyles } from '../styles/navbar.styles.js';
import { chevronRightIcon } from '../icons.js';
import type { MegaMenuConfig, MegaMenuCategory, MegaMenuItem } from '../types/navbar.js';

@customElement('wt-mega-menu')
export class WtMegaMenu extends LitElement {
  static override styles = megaMenuStyles;

  /**
   * Whether the mega menu is open
   */
  @property({ type: Boolean, reflect: true })
  open = false;

  /**
   * Mega menu configuration
   */
  @property({ type: Object })
  config: MegaMenuConfig | null = null;

  /**
   * Base URL for links
   */
  @property({ type: String })
  baseUrl = '';

  /**
   * Theme (light/dark)
   */
  @property({ type: String, reflect: true })
  theme: 'light' | 'dark' = 'dark';

  private _handleBackdropClick = () => {
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  };

  private _handleLinkClick = () => {
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  };

  private _getItemsByCategory(categoryId: string): MegaMenuItem[] {
    if (!this.config) return [];
    const maxItems = this.config.maxFeaturedPerCategory ?? 5;
    return this.config.items
      .filter((item) => item.categoryId === categoryId && item.featured !== false)
      .slice(0, maxItems);
  }

  private _getCategoryCount(categoryId: string): number {
    if (!this.config) return 0;
    return this.config.items.filter((item) => item.categoryId === categoryId).length;
  }

  private _getUrl(href?: string): string {
    if (!href) return '#';
    if (href.startsWith('http') || href.startsWith('/')) return href;
    return `${this.baseUrl}${href.startsWith('/') ? '' : '/'}${href}`;
  }

  override render() {
    if (!this.config) return nothing;

    const totalItems = this.config.items.length;
    const totalCategories = this.config.categories.length;

    return html`
      <div class="mega-menu">
        <div class="mega-menu-backdrop" @click=${this._handleBackdropClick}></div>
        <div class="mega-menu-panel">
          <div class="mega-menu-content">
            <div class="mega-menu-grid">
              ${this.config.categories
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                .map((category) => this._renderCategory(category))}
            </div>
            ${this._renderFooter(totalItems, totalCategories)}
          </div>
        </div>
      </div>
    `;
  }

  private _renderCategory(category: MegaMenuCategory) {
    const items = this._getItemsByCategory(category.id);
    const totalCount = this._getCategoryCount(category.id);
    const remainingCount = totalCount - items.length;

    return html`
      <div class="category">
        <div class="category-header">
          <h3 class="category-title">
            ${category.href
              ? html`<a href=${this._getUrl(category.href)} @click=${this._handleLinkClick}>
                  ${category.label}
                </a>`
              : category.label}
          </h3>
          ${category.description
            ? html`<p class="category-desc">${category.description}</p>`
            : nothing}
        </div>
        <ul class="items-list">
          ${items.map(
            (item) => html`
              <li>
                <a
                  href=${this._getUrl(item.href)}
                  class="item-link"
                  @click=${this._handleLinkClick}
                >
                  <span class="item-name">${item.label}</span>
                  ${item.tagline
                    ? html`<p class="item-tagline">${item.tagline}</p>`
                    : nothing}
                </a>
              </li>
            `
          )}
        </ul>
        ${remainingCount > 0 && category.href
          ? html`
              <a
                href=${this._getUrl(category.href)}
                class="view-more"
                @click=${this._handleLinkClick}
              >
                +${remainingCount} more ${category.label.toLowerCase()}
                ${chevronRightIcon}
              </a>
            `
          : nothing}
      </div>
    `;
  }

  private _renderFooter(totalItems: number, totalCategories: number) {
    const footerLinks = this.config?.footerLinks;
    const footerText = this.config?.footerText;

    if (!footerLinks?.length && !footerText) return nothing;

    return html`
      <div class="mega-menu-footer">
        ${footerLinks?.length
          ? html`
              <div class="footer-links">
                ${footerLinks.map(
                  (link, index) => html`
                    ${index > 0 && link.id?.startsWith('legal-')
                      ? html`<span class="footer-divider">|</span>`
                      : nothing}
                    <a
                      href=${this._getUrl(link.href)}
                      class="footer-link ${link.id?.startsWith('legal-')
                        ? 'footer-link-legal'
                        : ''}"
                      ?target=${link.external ? '_blank' : nothing}
                      ?rel=${link.external ? 'noopener noreferrer' : nothing}
                      @click=${this._handleLinkClick}
                    >
                      ${link.label}
                    </a>
                  `
                )}
              </div>
            `
          : nothing}
        ${footerText
          ? html`<span class="mega-menu-stats">${footerText}</span>`
          : totalItems > 0
          ? html`<span class="mega-menu-stats">
              ${totalItems} items across ${totalCategories} categories
            </span>`
          : nothing}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wt-mega-menu': WtMegaMenu;
  }
}
