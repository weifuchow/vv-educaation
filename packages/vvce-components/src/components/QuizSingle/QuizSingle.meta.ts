/**
 * QuizSingle Component Metadata
 */

import type { VVCEComponentMeta, JSONSchema } from '../../types/component';
import type { QuizSingleProps } from '@vv-education/vvce-schema';

/**
 * QuizSingle state type
 */
export interface QuizSingleState {
  /** Currently selected option */
  selected: string | null;
}

/**
 * QuizSingle props JSON Schema
 */
export const QuizSinglePropsSchema: JSONSchema = {
  type: 'object',
  properties: {
    question: {
      type: 'string',
      description: 'Question text (supports {{ref}} interpolation)',
    },
    options: {
      type: 'array',
      items: { type: 'string' },
      description: 'Array of option strings',
    },
    answerKey: {
      type: 'string',
      description: 'Correct answer (optional, for local validation)',
    },
  },
  required: ['question', 'options'],
};

/**
 * QuizSingle component metadata
 */
export const QuizSingleMeta: VVCEComponentMeta<QuizSingleProps, QuizSingleState> = {
  type: 'QuizSingle',
  displayName: '单选题',
  description: '单选测验组件',
  propsSchema: QuizSinglePropsSchema,
  stateShape: {
    selected: {
      type: 'string',
      nullable: true,
      description: '当前选中的选项',
    },
  },
  events: [
    {
      type: 'change',
      description: '选择变更事件',
      payload: {
        selected: {
          type: 'string',
          description: '选中的选项值',
        },
      },
    },
  ],
  defaultProps: {
    question: '',
    options: [],
  },
  defaultState: {
    selected: null,
  },
};
