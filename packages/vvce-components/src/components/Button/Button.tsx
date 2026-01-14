/**
 * Button Component
 *
 * Interactive button with click event support
 */

import React, { useCallback, useState } from 'react';
import type { ButtonProps } from '@vv-education/vvce-schema';
import type { VVCEComponentProps } from '../../types/component';
import { useInterpolation } from '../../hooks/useInterpolation';
import { createVVCEEvent } from '../../types/events';
import { getButtonStyles, buttonHoverStyles, buttonActiveStyles } from './Button.styles';
import clsx from 'clsx';

/**
 * Button Component Props (extends VVCEComponentProps)
 */
export type ButtonComponentProps = VVCEComponentProps<ButtonProps, object>;

/**
 * Button Component - Interactive button with click events
 */
export const Button: React.FC<ButtonComponentProps> = ({
  id,
  props,
  style,
  styleClass,
  visible = true,
  onEvent,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  // Don't render if not visible
  if (!visible) {
    return null;
  }

  // Get props with defaults
  const variant = props.variant || 'primary';
  const disabled = props.disabled || false;

  // Interpolate text content
  const interpolatedText = useInterpolation(props.text);

  // Handle click
  const handleClick = useCallback(() => {
    if (disabled) return;

    const event = createVVCEEvent('click', id);
    onEvent(event);
  }, [id, disabled, onEvent]);

  // Handle hover
  const handleMouseEnter = useCallback(() => {
    if (!disabled) setIsHovered(true);
  }, [disabled]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setIsActive(false);
  }, []);

  // Handle active state
  const handleMouseDown = useCallback(() => {
    if (!disabled) setIsActive(true);
  }, [disabled]);

  const handleMouseUp = useCallback(() => {
    setIsActive(false);
  }, []);

  // Build class names
  const className = clsx(
    'vvce-button',
    `vvce-button--${variant}`,
    {
      'vvce-button--disabled': disabled,
    },
    styleClass
  );

  // Build styles
  let buttonStyle = {
    ...getButtonStyles(variant, disabled),
    ...style,
  };

  // Apply hover styles
  if (isHovered && !disabled) {
    buttonStyle = {
      ...buttonStyle,
      ...buttonHoverStyles[variant],
    };
  }

  // Apply active styles
  if (isActive && !disabled) {
    buttonStyle = {
      ...buttonStyle,
      ...buttonActiveStyles[variant],
    };
  }

  return (
    <button
      data-vvce-id={id}
      data-vvce-type="Button"
      type="button"
      className={className}
      style={buttonStyle}
      disabled={disabled}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      aria-disabled={disabled}
    >
      {interpolatedText}
    </button>
  );
};

Button.displayName = 'VVCEButton';
