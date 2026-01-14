/**
 * Button Component Metadata
 */

import type { VVCEComponentMeta, JSONSchema } from '../../types/component';
import type { ButtonProps } from '@vv-education/vvce-schema';

/**
 * Button props JSON Schema
 */
export const ButtonPropsSchema: JSONSchema = {
  type: 'object',
  properties: {
    text: {
      type: 'string',
      description: 'Button text (supports {{ref}} interpolation)',
    },
    variant: {
      type: 'string',
      enum: ['primary', 'secondary', 'text'],
      default: 'primary',
      description: 'Button variant style',
    },
    disabled: {
      type: 'boolean',
      default: false,
      description: 'Whether the button is disabled',
    },
  },
  required: ['text'],
};

/**
 * Button component metadata
 */
export const ButtonMeta: VVCEComponentMeta<ButtonProps, object> = {
  type: 'Button',
  displayName: '按钮',
  description: '可点击的交互按钮',
  propsSchema: ButtonPropsSchema,
  stateShape: null, // Button is stateless
  events: [
    {
      type: 'click',
      description: '点击事件',
    },
  ],
  defaultProps: {
    text: '按钮',
    variant: 'primary',
    disabled: false,
  },
};
