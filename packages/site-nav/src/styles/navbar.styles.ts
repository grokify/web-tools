/**
 * Navbar Styles
 *
 * Styles for wt-navbar, wt-mega-menu, and wt-mobile-menu components.
 */

import { css } from 'lit';
import { themeCSS } from './design-system.js';

/**
 * Common icon styles
 */
export const iconStyles = css`
  .icon {
    width: 1em;
    height: 1em;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .icon svg {
    width: 100%;
    height: 100%;
    fill: currentColor;
  }

  .chevron {
    width: 0.75em;
    height: 0.75em;
    transition: transform var(--ds-transition-fast);
  }

  .chevron.open {
    transform: rotate(180deg);
  }
`;

/**
 * Main navbar styles
 */
export const navbarStyles = css`
  ${themeCSS}
  ${iconStyles}

  :host {
    display: block;
    font-family: var(--ds-font-sans);
  }

  /* Skip link for accessibility */
  .skip-link {
    position: absolute;
    left: -9999px;
    top: 0;
    z-index: 9999;
    padding: var(--ds-space-2) var(--ds-space-4);
    background: var(--ds-accent);
    color: var(--ds-text-inverse);
    text-decoration: none;
    font-weight: 500;
  }

  .skip-link:focus {
    left: 0;
  }

  /* Main nav container */
  .navbar {
    position: relative;
    background: var(--ds-bg-primary);
    border-bottom: 1px solid var(--ds-border-default);
  }

  .navbar-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 var(--ds-space-4);
    height: 64px;
  }

  /* Brand */
  .navbar-brand {
    display: flex;
    align-items: center;
    gap: var(--ds-space-2);
    text-decoration: none;
    color: var(--ds-text-primary);
    font-weight: 600;
    font-size: var(--ds-text-lg);
  }

  .navbar-brand:hover {
    text-decoration: none;
  }

  .navbar-logo {
    height: 32px;
    width: auto;
  }

  .navbar-title {
    display: flex;
    align-items: baseline;
  }

  /* Desktop links */
  .navbar-links {
    display: flex;
    align-items: center;
    gap: var(--ds-space-1);
  }

  .navbar-link {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-1);
    padding: var(--ds-space-2) var(--ds-space-3);
    color: var(--ds-text-secondary);
    text-decoration: none;
    font-size: var(--ds-text-sm);
    font-weight: 500;
    border-radius: var(--ds-radius-md);
    border: none;
    background: transparent;
    cursor: pointer;
    transition: all var(--ds-transition-fast);
  }

  .navbar-link:hover {
    color: var(--ds-text-primary);
    background: var(--ds-bg-secondary);
  }

  .navbar-link[aria-expanded="true"] {
    color: var(--ds-text-primary);
    background: var(--ds-bg-secondary);
  }

  /* Dropdown container */
  .navbar-dropdown {
    position: relative;
  }

  .navbar-dropdown-menu {
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 200px;
    padding: var(--ds-space-2);
    background: var(--ds-bg-primary);
    border: 1px solid var(--ds-border-default);
    border-radius: var(--ds-radius-lg);
    box-shadow: var(--ds-shadow-lg);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-8px);
    transition: all var(--ds-transition-fast);
    z-index: 100;
  }

  .navbar-dropdown.open .navbar-dropdown-menu {
    opacity: 1;
    visibility: visible;
    transform: translateY(4px);
  }

  .navbar-dropdown-item {
    display: flex;
    align-items: center;
    gap: var(--ds-space-2);
    padding: var(--ds-space-2) var(--ds-space-3);
    color: var(--ds-text-secondary);
    text-decoration: none;
    font-size: var(--ds-text-sm);
    border-radius: var(--ds-radius-md);
    transition: all var(--ds-transition-fast);
  }

  .navbar-dropdown-item:hover {
    color: var(--ds-text-primary);
    background: var(--ds-bg-secondary);
  }

  .navbar-dropdown-divider {
    height: 1px;
    margin: var(--ds-space-2) 0;
    background: var(--ds-border-subtle);
  }

  /* Action buttons (e.g., GitHub) */
  .navbar-action {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-2);
    padding: var(--ds-space-2) var(--ds-space-4);
    color: var(--ds-text-primary);
    text-decoration: none;
    font-size: var(--ds-text-sm);
    font-weight: 500;
    background: var(--ds-bg-secondary);
    border: 1px solid var(--ds-border-default);
    border-radius: var(--ds-radius-md);
    transition: all var(--ds-transition-fast);
  }

  .navbar-action:hover {
    background: var(--ds-bg-tertiary);
    border-color: var(--ds-border-strong);
  }

  /* Mobile toggle button */
  .navbar-mobile-toggle {
    display: none;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: 0;
    background: transparent;
    border: none;
    border-radius: var(--ds-radius-md);
    cursor: pointer;
    color: var(--ds-text-primary);
  }

  .navbar-mobile-toggle:hover {
    background: var(--ds-bg-secondary);
  }

  .navbar-mobile-toggle .icon-hamburger,
  .navbar-mobile-toggle .icon-close {
    width: 24px;
    height: 24px;
  }

  .navbar-mobile-toggle .icon-close {
    display: none;
  }

  .navbar-mobile-toggle[aria-expanded="true"] .icon-hamburger {
    display: none;
  }

  .navbar-mobile-toggle[aria-expanded="true"] .icon-close {
    display: block;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .navbar-links {
      display: none;
    }

    .navbar-mobile-toggle {
      display: flex;
    }
  }
`;

/**
 * Mega menu styles
 */
export const megaMenuStyles = css`
  ${themeCSS}
  ${iconStyles}

  :host {
    display: block;
    font-family: var(--ds-font-sans);
  }

  :host(:not([open])) .mega-menu {
    display: none;
  }

  .mega-menu {
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 50;
  }

  .mega-menu-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.3);
  }

  .mega-menu-panel {
    position: relative;
    background: var(--ds-bg-primary);
    border-bottom: 1px solid var(--ds-border-default);
    box-shadow: var(--ds-shadow-lg);
    max-height: calc(100vh - 64px - 48px);
    overflow-y: auto;
  }

  .mega-menu-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: var(--ds-space-6) var(--ds-space-4);
  }

  .mega-menu-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--ds-space-6);
  }

  /* Category */
  .category {
    display: flex;
    flex-direction: column;
  }

  .category-header {
    margin-bottom: var(--ds-space-4);
  }

  .category-title {
    margin: 0 0 var(--ds-space-1);
    font-size: var(--ds-text-sm);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .category-title a {
    color: var(--ds-text-primary);
    text-decoration: none;
  }

  .category-title a:hover {
    color: var(--ds-accent);
  }

  .category-desc {
    margin: 0;
    font-size: var(--ds-text-xs);
    color: var(--ds-text-muted);
  }

  /* Products list */
  .items-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-1);
  }

  .item-link {
    display: block;
    padding: var(--ds-space-2) var(--ds-space-3);
    border-radius: var(--ds-radius-md);
    text-decoration: none;
    transition: all var(--ds-transition-fast);
  }

  .item-link:hover {
    background: var(--ds-bg-secondary);
  }

  .item-name {
    display: block;
    font-size: var(--ds-text-sm);
    font-weight: 500;
    color: var(--ds-text-primary);
  }

  .item-tagline {
    margin: 2px 0 0;
    font-size: var(--ds-text-xs);
    color: var(--ds-text-muted);
  }

  .view-more {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-1);
    margin-top: var(--ds-space-3);
    padding: var(--ds-space-2) var(--ds-space-3);
    font-size: var(--ds-text-xs);
    font-weight: 500;
    color: var(--ds-accent);
    text-decoration: none;
    border-radius: var(--ds-radius-md);
    transition: all var(--ds-transition-fast);
  }

  .view-more:hover {
    background: var(--ds-accent-muted);
  }

  /* Footer */
  .mega-menu-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: var(--ds-space-6);
    padding-top: var(--ds-space-4);
    border-top: 1px solid var(--ds-border-subtle);
  }

  .footer-links {
    display: flex;
    align-items: center;
    gap: var(--ds-space-4);
  }

  .footer-link {
    font-size: var(--ds-text-sm);
    color: var(--ds-text-secondary);
    text-decoration: none;
    transition: color var(--ds-transition-fast);
  }

  .footer-link:hover {
    color: var(--ds-text-primary);
  }

  .footer-divider {
    color: var(--ds-text-muted);
  }

  .footer-link-legal {
    font-size: var(--ds-text-xs);
    color: var(--ds-text-muted);
  }

  .mega-menu-stats {
    font-size: var(--ds-text-xs);
    color: var(--ds-text-muted);
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .mega-menu-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .mega-menu-grid {
      grid-template-columns: 1fr;
    }

    .mega-menu-footer {
      flex-direction: column;
      gap: var(--ds-space-3);
      text-align: center;
    }

    .footer-links {
      flex-wrap: wrap;
      justify-content: center;
    }
  }
`;

/**
 * Mobile menu styles
 */
export const mobileMenuStyles = css`
  ${themeCSS}
  ${iconStyles}

  :host {
    display: block;
    font-family: var(--ds-font-sans);
  }

  :host(:not([open])) .mobile-menu {
    display: none;
  }

  .mobile-menu {
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--ds-bg-primary);
    overflow-y: auto;
    z-index: 40;
    padding: var(--ds-space-4);
  }

  .mobile-section {
    padding: var(--ds-space-3) 0;
    border-bottom: 1px solid var(--ds-border-subtle);
  }

  .mobile-section:last-child {
    border-bottom: none;
  }

  .mobile-label {
    display: block;
    padding: var(--ds-space-2) var(--ds-space-3);
    font-size: var(--ds-text-xs);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--ds-text-muted);
  }

  .mobile-link {
    display: flex;
    align-items: center;
    gap: var(--ds-space-3);
    padding: var(--ds-space-3) var(--ds-space-3);
    font-size: var(--ds-text-base);
    font-weight: 500;
    color: var(--ds-text-primary);
    text-decoration: none;
    border-radius: var(--ds-radius-md);
    transition: all var(--ds-transition-fast);
  }

  .mobile-link:hover {
    background: var(--ds-bg-secondary);
  }

  .mobile-link-icon {
    width: 20px;
    height: 20px;
    color: var(--ds-text-secondary);
  }
`;
