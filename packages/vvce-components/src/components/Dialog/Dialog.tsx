/**
 * Dialog Component
 *
 * Displays text content with optional avatar and speaker name
 */

import React from 'react';
import type { DialogProps } from '@vv-education/vvce-schema';
import type { VVCEComponentProps } from '../../types/component';
import { useInterpolation } from '../../hooks/useInterpolation';
import { dialogStyles, getContainerStyle } from './Dialog.styles';
import clsx from 'clsx';

/**
 * Dialog Component Props (extends VVCEComponentProps)
 */
export type DialogComponentProps = VVCEComponentProps<DialogProps, object>;

/**
 * Dialog Component - Displays text with optional speaker and avatar
 */
export const Dialog: React.FC<DialogComponentProps> = ({
  id,
  props,
  style,
  styleClass,
  visible = true,
}) => {
  // Don't render if not visible
  if (!visible) {
    return null;
  }

  // Interpolate text content
  const interpolatedText = useInterpolation(props.text);
  const interpolatedSpeaker = useInterpolation(props.speaker || '');

  const hasAvatar = Boolean(props.avatar || props.speaker);

  // Build class names
  const className = clsx('vvce-dialog', styleClass);

  // Merge styles
  const containerStyle = {
    ...getContainerStyle(hasAvatar),
    ...style,
  };

  return (
    <div
      data-vvce-id={id}
      data-vvce-type="Dialog"
      className={className}
      style={containerStyle}
    >
      {hasAvatar && (
        <div style={dialogStyles.avatarContainer}>
          {props.avatar ? (
            <img
              src={props.avatar}
              alt={interpolatedSpeaker || 'Speaker avatar'}
              style={dialogStyles.avatar}
            />
          ) : (
            <div style={dialogStyles.avatarPlaceholder}>
              {interpolatedSpeaker?.charAt(0).toUpperCase() || '?'}
            </div>
          )}
        </div>
      )}
      <div style={dialogStyles.content}>
        {interpolatedSpeaker && <p style={dialogStyles.speaker}>{interpolatedSpeaker}</p>}
        <p style={dialogStyles.text}>{interpolatedText}</p>
      </div>
    </div>
  );
};

Dialog.displayName = 'VVCEDialog';
