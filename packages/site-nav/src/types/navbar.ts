/**
 * Navbar Types
 *
 * Types for the navbar component and its subcomponents (dropdowns, mega menus, mobile menu).
 */

/**
 * Base menu item interface
 */
export interface MenuItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** URL for navigation */
  href?: string;
  /** Icon (emoji or SVG string) */
  icon?: string;
  /** Open in new tab */
  external?: boolean;
  /** Whether this item is disabled */
  disabled?: boolean;
}

/**
 * Simple dropdown menu item
 */
export interface DropdownItem extends MenuItem {
  /** Optional description text */
  description?: string;
}

/**
 * Dropdown menu configuration
 */
export interface DropdownMenu {
  /** Unique identifier */
  id: string;
  /** Trigger label */
  label: string;
  /** Menu items */
  items: DropdownItem[];
  /** Optional divider + extra items (e.g., RSS feed link) */
  extraItems?: DropdownItem[];
}

/**
 * Mega menu category
 */
export interface MegaMenuCategory {
  /** Category identifier */
  id: string;
  /** Category label */
  label: string;
  /** Category description */
  description?: string;
  /** Display order */
  order?: number;
  /** URL for "View all" link */
  href?: string;
}

/**
 * Mega menu item (product, feature, etc.)
 */
export interface MegaMenuItem extends MenuItem {
  /** Category this item belongs to */
  categoryId: string;
  /** Short tagline or description */
  tagline?: string;
  /** Whether this is a featured item (shown in mega menu) */
  featured?: boolean;
}

/**
 * Mega menu configuration
 */
export interface MegaMenuConfig {
  /** Trigger label (e.g., "Products") */
  label: string;
  /** Categories to display */
  categories: MegaMenuCategory[];
  /** Items grouped by category */
  items: MegaMenuItem[];
  /** Maximum featured items per category */
  maxFeaturedPerCategory?: number;
  /** Footer links */
  footerLinks?: MenuItem[];
  /** Footer text */
  footerText?: string;
}

/**
 * Mobile menu section
 */
export interface MobileMenuSection {
  /** Section identifier */
  id: string;
  /** Section label (optional, renders as header) */
  label?: string;
  /** Section items */
  items: MenuItem[];
}

/**
 * Brand/logo configuration
 */
export interface NavbarBrand {
  /** Brand name */
  name: string;
  /** Logo image URL */
  logoUrl?: string;
  /** Logo alt text */
  logoAlt?: string;
  /** Home URL */
  href?: string;
  /** Custom HTML for brand (overrides name/logo) */
  html?: string;
}

/**
 * Complete navbar configuration
 */
export interface NavbarConfig {
  /** Brand configuration */
  brand?: NavbarBrand;
  /** Simple navigation links */
  links?: MenuItem[];
  /** Dropdown menus */
  dropdowns?: DropdownMenu[];
  /** Mega menu (typically one) */
  megaMenu?: MegaMenuConfig;
  /** Mobile menu sections */
  mobileSections?: MobileMenuSection[];
  /** Right-side actions (e.g., GitHub link) */
  actions?: MenuItem[];
  /** Base URL for relative links */
  baseUrl?: string;
}

/**
 * Navbar events
 */
export interface NavbarNavigateEventDetail {
  /** Item that was clicked */
  item: MenuItem;
  /** Original click event */
  originalEvent: MouseEvent;
}
