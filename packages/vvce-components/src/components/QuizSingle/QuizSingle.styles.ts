/**
 * QuizSingle Component Styles
 */

import type { CSSProperties } from 'react';

/**
 * QuizSingle container styles
 */
export const quizStyles: Record<string, CSSProperties> = {
  container: {
    padding: '16px',
    margin: '8px 0',
    backgroundColor: 'var(--vvce-quiz-bg, #ffffff)',
    borderRadius: 'var(--vvce-border-radius, 8px)',
    boxShadow: 'var(--vvce-shadow-sm, 0 1px 3px rgba(0,0,0,0.1))',
  },
  question: {
    margin: '0 0 16px 0',
    fontSize: '18px',
    fontWeight: 600,
    color: 'var(--vvce-text-color, #212529)',
    lineHeight: 1.4,
  },
  optionsList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  optionItem: {
    position: 'relative' as const,
  },
};

/**
 * Option button base styles
 */
export const optionBaseStyles: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  padding: '12px 16px',
  fontSize: '16px',
  textAlign: 'left',
  backgroundColor: 'var(--vvce-option-bg, #f8f9fa)',
  border: '2px solid var(--vvce-option-border, #e9ecef)',
  borderRadius: 'var(--vvce-border-radius, 8px)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  outline: 'none',
};

/**
 * Option state styles
 */
export const optionStateStyles: Record<string, CSSProperties> = {
  default: {
    backgroundColor: 'var(--vvce-option-bg, #f8f9fa)',
    borderColor: 'var(--vvce-option-border, #e9ecef)',
    color: 'var(--vvce-text-color, #212529)',
  },
  hover: {
    backgroundColor: 'var(--vvce-option-hover-bg, #e9ecef)',
    borderColor: 'var(--vvce-option-hover-border, #dee2e6)',
  },
  selected: {
    backgroundColor: 'var(--vvce-option-selected-bg, #e8f4f8)',
    borderColor: 'var(--vvce-option-selected-border, #4f46e5)',
    color: 'var(--vvce-option-selected-color, #4f46e5)',
  },
  correct: {
    backgroundColor: 'var(--vvce-option-correct-bg, #d4edda)',
    borderColor: 'var(--vvce-option-correct-border, #28a745)',
    color: 'var(--vvce-option-correct-color, #155724)',
  },
  incorrect: {
    backgroundColor: 'var(--vvce-option-incorrect-bg, #f8d7da)',
    borderColor: 'var(--vvce-option-incorrect-border, #dc3545)',
    color: 'var(--vvce-option-incorrect-color, #721c24)',
  },
  disabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
};

/**
 * Radio indicator styles
 */
export const radioIndicatorStyles: Record<string, CSSProperties> = {
  base: {
    width: '20px',
    height: '20px',
    marginRight: '12px',
    borderRadius: '50%',
    border: '2px solid var(--vvce-radio-border, #adb5bd)',
    backgroundColor: 'var(--vvce-radio-bg, #ffffff)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.2s ease',
  },
  selected: {
    borderColor: 'var(--vvce-radio-selected-border, #4f46e5)',
    backgroundColor: 'var(--vvce-radio-selected-bg, #4f46e5)',
  },
  inner: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
  },
};

/**
 * Get option styles based on state
 */
export function getOptionStyles(
  isSelected: boolean,
  isCorrect?: boolean,
  isIncorrect?: boolean,
  isHovered?: boolean,
  isDisabled?: boolean
): CSSProperties {
  let styles: CSSProperties = {
    ...optionBaseStyles,
    ...optionStateStyles.default,
  };

  if (isHovered && !isSelected && !isDisabled) {
    styles = { ...styles, ...optionStateStyles.hover };
  }

  if (isSelected) {
    styles = { ...styles, ...optionStateStyles.selected };
  }

  if (isCorrect) {
    styles = { ...styles, ...optionStateStyles.correct };
  }

  if (isIncorrect) {
    styles = { ...styles, ...optionStateStyles.incorrect };
  }

  if (isDisabled) {
    styles = { ...styles, ...optionStateStyles.disabled };
  }

  return styles;
}

/**
 * Get radio indicator styles
 */
export function getRadioStyles(isSelected: boolean): CSSProperties {
  return isSelected
    ? { ...radioIndicatorStyles.base, ...radioIndicatorStyles.selected }
    : radioIndicatorStyles.base;
}
