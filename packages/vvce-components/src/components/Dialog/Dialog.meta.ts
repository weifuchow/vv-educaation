/**
 * Dialog Component Metadata
 */

import type { VVCEComponentMeta, JSONSchema } from '../../types/component';
import type { DialogProps } from '@vv-education/vvce-schema';

/**
 * Dialog props JSON Schema
 */
export const DialogPropsSchema: JSONSchema = {
  type: 'object',
  properties: {
    text: {
      type: 'string',
      description: 'Text content to display (supports {{ref}} interpolation)',
    },
    speaker: {
      type: 'string',
      description: 'Speaker name to display',
    },
    avatar: {
      type: 'string',
      description: 'Avatar image URL',
    },
  },
  required: ['text'],
};

/**
 * Dialog component metadata
 */
export const DialogMeta: VVCEComponentMeta<DialogProps, object> = {
  type: 'Dialog',
  displayName: '对话框',
  description: '显示文本内容，支持头像和说话者',
  propsSchema: DialogPropsSchema,
  stateShape: null, // Dialog is stateless
  events: [], // Dialog has no events
  defaultProps: {
    text: '',
  },
};
