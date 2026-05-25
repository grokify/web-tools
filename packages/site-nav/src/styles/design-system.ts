/**
 * Design System Specification
 *
 * Defines all design tokens for the site-nav component library.
 * Tokens are organized by category and support light/dark themes.
 */

import { unsafeCSS, type CSSResult } from 'lit';

export interface ColorPalette {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export interface SemanticColors {
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    inverse: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
  };
  border: {
    default: string;
    strong: string;
    subtle: string;
  };
  accent: {
    default: string;
    hover: string;
    muted: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  maturity: {
    m1: string;
    m2: string;
    m3: string;
    m4: string;
    m5: string;
  };
}

export interface Typography {
  fontFamily: {
    sans: string;
    mono: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  fontWeight: {
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface Spacing {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  8: string;
  10: string;
  12: string;
  16: string;
  20: string;
  24: string;
}

export interface Radius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

export interface Shadow {
  none: string;
  sm: string;
  md: string;
  lg: string;
}

export interface Transition {
  fast: string;
  normal: string;
  slow: string;
}

export interface DesignSystemSpec {
  name: string;
  version: string;
  colors: {
    light: SemanticColors;
    dark: SemanticColors;
    palette: {
      slate: ColorPalette;
      cyan: ColorPalette;
      emerald: ColorPalette;
      amber: ColorPalette;
      red: ColorPalette;
      blue: ColorPalette;
    };
  };
  typography: Typography;
  spacing: Spacing;
  radius: Radius;
  shadow: {
    light: Shadow;
    dark: Shadow;
  };
  transition: Transition;
}

/**
 * Default Design System Specification
 */
export const designSystem: DesignSystemSpec = {
  name: 'PRISM Design System',
  version: '1.0.0',

  colors: {
    palette: {
      slate: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
        950: '#020617',
      },
      cyan: {
        50: '#ecfeff',
        100: '#cffafe',
        200: '#a5f3fc',
        300: '#67e8f9',
        400: '#22d3ee',
        500: '#06b6d4',
        600: '#0891b2',
        700: '#0e7490',
        800: '#155e75',
        900: '#164e63',
        950: '#083344',
      },
      emerald: {
        50: '#ecfdf5',
        100: '#d1fae5',
        200: '#a7f3d0',
        300: '#6ee7b7',
        400: '#34d399',
        500: '#10b981',
        600: '#059669',
        700: '#047857',
        800: '#065f46',
        900: '#064e3b',
        950: '#022c22',
      },
      amber: {
        50: '#fffbeb',
        100: '#fef3c7',
        200: '#fde68a',
        300: '#fcd34d',
        400: '#fbbf24',
        500: '#f59e0b',
        600: '#d97706',
        700: '#b45309',
        800: '#92400e',
        900: '#78350f',
        950: '#451a03',
      },
      red: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
        950: '#450a0a',
      },
      blue: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
        950: '#172554',
      },
    },

    light: {
      background: {
        primary: '#ffffff',
        secondary: '#f8fafc',
        tertiary: '#f1f5f9',
        inverse: '#0f172a',
      },
      text: {
        primary: '#1e293b',
        secondary: '#475569',
        muted: '#94a3b8',
        inverse: '#f8fafc',
      },
      border: {
        default: '#e2e8f0',
        strong: '#cbd5e1',
        subtle: '#f1f5f9',
      },
      accent: {
        default: '#06b6d4',
        hover: '#0891b2',
        muted: '#cffafe',
      },
      status: {
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      maturity: {
        m1: '#ef4444',
        m2: '#f59e0b',
        m3: '#eab308',
        m4: '#22c55e',
        m5: '#3b82f6',
      },
    },

    dark: {
      background: {
        primary: '#0f172a',
        secondary: '#1e293b',
        tertiary: '#334155',
        inverse: '#f8fafc',
      },
      text: {
        primary: '#f1f5f9',
        secondary: '#cbd5e1',
        muted: '#64748b',
        inverse: '#0f172a',
      },
      border: {
        default: '#475569',
        strong: '#64748b',
        subtle: '#334155',
      },
      accent: {
        default: '#22d3ee',
        hover: '#67e8f9',
        muted: '#164e63',
      },
      status: {
        success: '#34d399',
        warning: '#fbbf24',
        error: '#f87171',
        info: '#60a5fa',
      },
      maturity: {
        m1: '#f87171',
        m2: '#fbbf24',
        m3: '#facc15',
        m4: '#4ade80',
        m5: '#60a5fa',
      },
    },
  },

  typography: {
    fontFamily: {
      sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
  },

  radius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },

  shadow: {
    light: {
      none: 'none',
      sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    },
    dark: {
      none: 'none',
      sm: '0 1px 2px rgba(0, 0, 0, 0.3)',
      md: '0 4px 6px rgba(0, 0, 0, 0.4)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.5)',
    },
  },

  transition: {
    fast: '150ms ease',
    normal: '200ms ease',
    slow: '300ms ease',
  },
};

/**
 * Generate CSS custom properties string from the design system spec.
 * Internal function that returns a plain string.
 */
function generateCSSVariablesString(theme: 'light' | 'dark' = 'light'): string {
  const ds = designSystem;
  const colors = ds.colors[theme];
  const shadows = ds.shadow[theme];

  return `
    /* Background */
    --ds-bg-primary: ${colors.background.primary};
    --ds-bg-secondary: ${colors.background.secondary};
    --ds-bg-tertiary: ${colors.background.tertiary};
    --ds-bg-inverse: ${colors.background.inverse};

    /* Text */
    --ds-text-primary: ${colors.text.primary};
    --ds-text-secondary: ${colors.text.secondary};
    --ds-text-muted: ${colors.text.muted};
    --ds-text-inverse: ${colors.text.inverse};

    /* Border */
    --ds-border-default: ${colors.border.default};
    --ds-border-strong: ${colors.border.strong};
    --ds-border-subtle: ${colors.border.subtle};

    /* Accent */
    --ds-accent: ${colors.accent.default};
    --ds-accent-hover: ${colors.accent.hover};
    --ds-accent-muted: ${colors.accent.muted};

    /* Status */
    --ds-status-success: ${colors.status.success};
    --ds-status-warning: ${colors.status.warning};
    --ds-status-error: ${colors.status.error};
    --ds-status-info: ${colors.status.info};

    /* Maturity */
    --ds-maturity-m1: ${colors.maturity.m1};
    --ds-maturity-m2: ${colors.maturity.m2};
    --ds-maturity-m3: ${colors.maturity.m3};
    --ds-maturity-m4: ${colors.maturity.m4};
    --ds-maturity-m5: ${colors.maturity.m5};

    /* Typography */
    --ds-font-sans: ${ds.typography.fontFamily.sans};
    --ds-font-mono: ${ds.typography.fontFamily.mono};
    --ds-text-xs: ${ds.typography.fontSize.xs};
    --ds-text-sm: ${ds.typography.fontSize.sm};
    --ds-text-base: ${ds.typography.fontSize.base};
    --ds-text-lg: ${ds.typography.fontSize.lg};
    --ds-text-xl: ${ds.typography.fontSize.xl};
    --ds-text-2xl: ${ds.typography.fontSize['2xl']};
    --ds-text-3xl: ${ds.typography.fontSize['3xl']};

    /* Spacing */
    --ds-space-1: ${ds.spacing[1]};
    --ds-space-2: ${ds.spacing[2]};
    --ds-space-3: ${ds.spacing[3]};
    --ds-space-4: ${ds.spacing[4]};
    --ds-space-5: ${ds.spacing[5]};
    --ds-space-6: ${ds.spacing[6]};
    --ds-space-8: ${ds.spacing[8]};

    /* Radius */
    --ds-radius-sm: ${ds.radius.sm};
    --ds-radius-md: ${ds.radius.md};
    --ds-radius-lg: ${ds.radius.lg};
    --ds-radius-xl: ${ds.radius.xl};
    --ds-radius-full: ${ds.radius.full};

    /* Shadow */
    --ds-shadow-sm: ${shadows.sm};
    --ds-shadow-md: ${shadows.md};
    --ds-shadow-lg: ${shadows.lg};

    /* Transition */
    --ds-transition-fast: ${ds.transition.fast};
    --ds-transition-normal: ${ds.transition.normal};
    --ds-transition-slow: ${ds.transition.slow};
  `;
}

/**
 * Generate CSS custom properties from the design system spec.
 * Can be injected into a :root or :host selector.
 * Returns a CSSResult for use in Lit's css template.
 */
export function generateCSSVariables(theme: 'light' | 'dark' = 'light'): CSSResult {
  return unsafeCSS(generateCSSVariablesString(theme));
}

/**
 * CSS that applies design system variables based on theme attribute.
 * Include this in your global styles.
 * Returns a CSSResult for use in Lit's css template.
 */
export const themeCSS: CSSResult = unsafeCSS(`
  :root,
  :host,
  :host([theme="light"]),
  [theme="light"] {
    ${generateCSSVariablesString('light')}
  }

  :host([theme="dark"]),
  [theme="dark"] {
    ${generateCSSVariablesString('dark')}
  }

  @media (prefers-color-scheme: dark) {
    :root:not([theme="light"]),
    :host:not([theme="light"]) {
      ${generateCSSVariablesString('dark')}
    }
  }
`);
