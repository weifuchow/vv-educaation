/**
 * QuizSingle Component
 *
 * Single-choice quiz component with state management
 */

import React, { useCallback, useState } from 'react';
import type { QuizSingleProps } from '@vv-education/vvce-schema';
import type { VVCEComponentProps } from '../../types/component';
import type { QuizSingleState } from './QuizSingle.meta';
import { useInterpolation } from '../../hooks/useInterpolation';
import { createVVCEEvent } from '../../types/events';
import {
  quizStyles,
  getOptionStyles,
  getRadioStyles,
  radioIndicatorStyles,
} from './QuizSingle.styles';
import clsx from 'clsx';

/**
 * QuizSingle Component Props (extends VVCEComponentProps)
 */
export type QuizSingleComponentProps = VVCEComponentProps<
  QuizSingleProps,
  QuizSingleState
>;

/**
 * QuizSingle Component - Single choice quiz
 */
export const QuizSingle: React.FC<QuizSingleComponentProps> = ({
  id,
  props,
  state,
  style,
  styleClass,
  visible = true,
  onEvent,
  onStateChange,
}) => {
  // Track hovered option
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Get current selection from state
  const selected = state?.selected ?? null;

  // Don't render if not visible
  if (!visible) {
    return null;
  }

  // Interpolate question text
  const interpolatedQuestion = useInterpolation(props.question);

  // Handle option selection
  const handleSelect = useCallback(
    (option: string) => {
      // Update state
      const newState: QuizSingleState = { selected: option };
      onStateChange(newState);

      // Emit change event
      const event = createVVCEEvent('change', id, { selected: option });
      onEvent(event);
    },
    [id, onEvent, onStateChange]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, option: string, index: number) => {
      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault();
          handleSelect(option);
          break;
        case 'ArrowDown':
        case 'ArrowRight': {
          event.preventDefault();
          // Focus next option
          const nextIndex = (index + 1) % props.options.length;
          const nextElement = document.querySelector(
            `[data-vvce-quiz-option="${id}-${nextIndex}"]`
          ) as HTMLElement;
          nextElement?.focus();
          break;
        }
        case 'ArrowUp':
        case 'ArrowLeft': {
          event.preventDefault();
          // Focus previous option
          const prevIndex = (index - 1 + props.options.length) % props.options.length;
          const prevElement = document.querySelector(
            `[data-vvce-quiz-option="${id}-${prevIndex}"]`
          ) as HTMLElement;
          prevElement?.focus();
          break;
        }
      }
    },
    [id, props.options.length, handleSelect]
  );

  // Build class names
  const className = clsx('vvce-quiz-single', styleClass);

  // Merge container styles
  const containerStyle = {
    ...quizStyles.container,
    ...style,
  };

  return (
    <div
      data-vvce-id={id}
      data-vvce-type="QuizSingle"
      className={className}
      style={containerStyle}
      role="radiogroup"
      aria-labelledby={`${id}-question`}
    >
      <p
        id={`${id}-question`}
        style={quizStyles.question}
        className="vvce-quiz-single__question"
      >
        {interpolatedQuestion}
      </p>
      <ul style={quizStyles.optionsList} className="vvce-quiz-single__options">
        {props.options.map((option, index) => {
          const isSelected = selected === option;
          const isHovered = hoveredIndex === index;

          return (
            <li key={index} style={quizStyles.optionItem}>
              <button
                type="button"
                role="radio"
                aria-checked={isSelected}
                data-vvce-quiz-option={`${id}-${index}`}
                className={clsx('vvce-quiz-single__option', {
                  'vvce-quiz-single__option--selected': isSelected,
                })}
                style={getOptionStyles(isSelected, false, false, isHovered)}
                onClick={() => handleSelect(option)}
                onKeyDown={(e) => handleKeyDown(e, option, index)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                tabIndex={isSelected ? 0 : index === 0 ? 0 : -1}
              >
                <span
                  style={getRadioStyles(isSelected)}
                  className="vvce-quiz-single__radio"
                  aria-hidden="true"
                >
                  {isSelected && <span style={radioIndicatorStyles.inner} />}
                </span>
                <span className="vvce-quiz-single__option-text">{option}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

QuizSingle.displayName = 'VVCEQuizSingle';
