/**
 * FallbackComponent - Displayed when a component type is not found
 */

import React from 'react';
import type { VVCEComponentProps } from '../types/component';

/**
 * Fallback props
 */
export interface FallbackProps {
  /** The unknown component type */
  unknownType: string;
}

/**
 * FallbackComponent - Renders when a component type is not registered
 */
export const FallbackComponent: React.FC<VVCEComponentProps<FallbackProps>> = ({
  id,
  props,
  visible = true,
}) => {
  if (!visible) {
    return null;
  }

  return (
    <div
      data-vvce-id={id}
      data-vvce-type="Fallback"
      style={{
        padding: '16px',
        margin: '8px 0',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffc107',
        borderRadius: '4px',
        color: '#856404',
      }}
    >
      <strong>Unknown Component</strong>
      <p style={{ margin: '8px 0 0 0' }}>
        Component type &quot;{props.unknownType}&quot; is not registered.
      </p>
      <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6c757d' }}>
        Node ID: {id}
      </p>
    </div>
  );
};

FallbackComponent.displayName = 'VVCEFallbackComponent';
