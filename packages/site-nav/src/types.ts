/**
 * Navigation item definition
 */
export interface NavItem {
  /** Unique identifier for the nav item */
  id: string;
  /** Display label */
  label: string;
  /** Optional count badge (e.g., number of items) */
  count?: number;
  /** Optional icon (emoji or icon name) */
  icon?: string;
  /** Whether this item is disabled */
  disabled?: boolean;
  /** Optional href for link-based navigation */
  href?: string;
}

/**
 * Header action button definition
 */
export interface HeaderAction {
  /** Unique identifier */
  id: string;
  /** Button label */
  label: string;
  /** Button variant */
  variant?: 'default' | 'primary' | 'ghost';
  /** Optional icon */
  icon?: string;
  /** Whether disabled */
  disabled?: boolean;
}

/**
 * Theme variants
 */
export type Theme = 'light' | 'dark';

/**
 * Navigation change event detail
 */
export interface NavChangeEventDetail {
  /** ID of the newly selected item */
  itemId: string;
  /** Previously selected item ID */
  previousItemId?: string;
}

/**
 * Header action event detail
 */
export interface HeaderActionEventDetail {
  /** ID of the clicked action */
  actionId: string;
}
