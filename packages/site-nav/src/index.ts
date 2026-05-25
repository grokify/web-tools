// Components
export { WtNav } from './components/wt-nav.js';
export { WtHeader } from './components/wt-header.js';
export { WtBadge } from './components/wt-badge.js';
export { WtFilterGroup } from './components/wt-filter-group.js';
export { WtThemeToggle } from './components/wt-theme-toggle.js';

// Navbar Components
export { WtNavbar } from './components/wt-navbar.js';
export { WtMegaMenu } from './components/wt-mega-menu.js';
export { WtMobileMenu } from './components/wt-mobile-menu.js';

// Types
export type {
  NavItem,
  HeaderAction,
  Theme,
  NavChangeEventDetail,
  HeaderActionEventDetail,
} from './types.js';

// Navbar Types
export type {
  MenuItem,
  DropdownItem,
  DropdownMenu,
  MegaMenuCategory,
  MegaMenuItem,
  MegaMenuConfig,
  MobileMenuSection,
  NavbarBrand,
  NavbarConfig,
  NavbarNavigateEventDetail,
} from './types/navbar.js';

// Icons (for custom usage)
export {
  chevronDownIcon,
  chevronRightIcon,
  hamburgerIcon,
  closeIcon,
  externalLinkIcon,
  githubIcon,
  rssIcon,
  searchIcon,
} from './icons.js';

export type {
  FilterOption,
  FilterChangeEventDetail,
} from './components/wt-filter-group.js';

export type { BadgeVariant } from './components/wt-badge.js';

export type {
  ThemeMode,
  ThemeChangeEventDetail,
} from './components/wt-theme-toggle.js';

// Design System
export {
  designSystem,
  generateCSSVariables,
  themeCSS,
} from './styles/design-system.js';

export type {
  DesignSystemSpec,
  SemanticColors,
  ColorPalette,
  Typography,
  Spacing,
  Radius,
  Shadow,
  Transition,
} from './styles/design-system.js';

// Styles (for extension/customization)
export { sharedStyles, colors, typography, focusStyles, buttonStyles } from './styles/shared.styles.js';
