/**
 * VVCE Components - Type Definitions
 */

// Component types
export type {
  JSONSchema,
  VVCEComponentMeta,
  VVCEComponentProps,
  RegisteredComponent,
  ComponentInstance,
  ExtractProps,
  ExtractState,
} from './component';

// Event types
export type { VVCEEvent, EventDefinition, PayloadFieldDefinition } from './events';
export { createVVCEEvent } from './events';

// State types
export type { StateShapeDefinition, StateFieldDefinition } from './state';

// Lifecycle types
export type { VVCEComponentLifecycle, UseVVCEComponentResult } from './lifecycle';
