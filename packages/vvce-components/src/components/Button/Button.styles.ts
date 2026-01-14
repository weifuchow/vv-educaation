/**
 * Button Component Styles
 */

import type { CSSProperties } from 'react';

/**
 * Base button styles
 */
export const buttonBaseStyles: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px 20px',
  fontSize: '16px',
  fontWeight: 500,
  lineHeight: 1.5,
  borderRadius: 'var(--vvce-border-radius, 8px)',
  border: 'none',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  outline: 'none',
  userSelect: 'none',
};

/**
 * Button variant styles
 */
export const buttonVariantStyles: Record<string, CSSProperties> = {
  primary: {
    backgroundColor: 'var(--vvce-button-primary-bg, #4f46e5)',
    color: 'var(--vvce-button-primary-color, #ffffff)',
  },
  secondary: {
    backgroundColor: 'var(--vvce-button-secondary-bg, #e5e7eb)',
    color: 'var(--vvce-button-secondary-color, #374151)',
  },
  text: {
    backgroundColor: 'transparent',
    color: 'var(--vvce-button-text-color, #4f46e5)',
    padding: '10px 12px',
  },
};

/**
 * Disabled state styles
 */
export const buttonDisabledStyles: CSSProperties = {
  opacity: 0.5,
  cursor: 'not-allowed',
  pointerEvents: 'none',
};

/**
 * Hover styles (applied via CSS custom properties or inline :hover)
 */
export const buttonHoverStyles: Record<string, CSSProperties> = {
  primary: {
    backgroundColor: 'var(--vvce-button-primary-hover-bg, #4338ca)',
  },
  secondary: {
    backgroundColor: 'var(--vvce-button-secondary-hover-bg, #d1d5db)',
  },
  text: {
    backgroundColor: 'var(--vvce-button-text-hover-bg, rgba(79, 70, 229, 0.1))',
  },
};

/**
 * Active (pressed) styles
 */
export const buttonActiveStyles: Record<string, CSSProperties> = {
  primary: {
    backgroundColor: 'var(--vvce-button-primary-active-bg, #3730a3)',
    transform: 'scale(0.98)',
  },
  secondary: {
    backgroundColor: 'var(--vvce-button-secondary-active-bg, #9ca3af)',
    transform: 'scale(0.98)',
  },
  text: {
    backgroundColor: 'var(--vvce-button-text-active-bg, rgba(79, 70, 229, 0.2))',
    transform: 'scale(0.98)',
  },
};

/**
 * Get button styles for a specific variant
 */
export function getButtonStyles(
  variant: 'primary' | 'secondary' | 'text' = 'primary',
  disabled: boolean = false
): CSSProperties {
  const baseStyles = {
    ...buttonBaseStyles,
    ...buttonVariantStyles[variant],
  };

  if (disabled) {
    return {
      ...baseStyles,
      ...buttonDisabledStyles,
    };
  }

  return baseStyles;
}
