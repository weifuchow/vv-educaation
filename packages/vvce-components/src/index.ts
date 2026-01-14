/**
 * @vv-education/vvce-components
 *
 * VVCE Standard Component Library
 * React components that implement the VVCE DSL component protocol
 */

// ============ Types ============
export type {
  // Component types
  JSONSchema,
  VVCEComponentMeta,
  VVCEComponentProps,
  RegisteredComponent,
  ComponentInstance,
  ExtractProps,
  ExtractState,
  // Event types
  VVCEEvent,
  EventDefinition,
  PayloadFieldDefinition,
  // State types
  StateShapeDefinition,
  StateFieldDefinition,
  // Lifecycle types
  VVCEComponentLifecycle,
  UseVVCEComponentResult,
} from './types';

export { createVVCEEvent } from './types';

// ============ Registry ============
export {
  ComponentRegistry,
  ComponentRegistrationError,
  componentRegistry,
} from './registry';

// ============ Factory ============
export { ComponentFactory, componentFactory, FallbackComponent } from './factory';
export type { ComponentFactoryOptions, FallbackProps } from './factory';

// ============ Context ============
export type { RenderContext, VVCEProviderProps } from './context';
export { defaultRenderContext } from './context';

export {
  VVCEProvider,
  useVVCEContext,
  useVVCERuntime,
  useVVCEDispatch,
  useVVCETheme,
  useVVCEResources,
  useVVCEComponent,
  useNodeState,
  useEventEmitter,
  useResolveRef,
} from './context';

// ============ Hooks ============
export { useInterpolation, useInterpolationRefs } from './hooks';

// ============ Utils ============
export { interpolate, extractRefs, hasInterpolation } from './utils';
export type { RefResolver } from './utils';

// ============ Components ============
// Dialog
export {
  Dialog,
  DialogMeta,
  DialogPropsSchema,
  dialogStyles,
  getContainerStyle,
} from './components/Dialog';
export type { DialogComponentProps } from './components/Dialog';

// Button
export {
  Button,
  ButtonMeta,
  ButtonPropsSchema,
  buttonBaseStyles,
  buttonVariantStyles,
  buttonDisabledStyles,
  buttonHoverStyles,
  buttonActiveStyles,
  getButtonStyles,
} from './components/Button';
export type { ButtonComponentProps } from './components/Button';

// QuizSingle
export {
  QuizSingle,
  QuizSingleMeta,
  QuizSinglePropsSchema,
  quizStyles,
  optionBaseStyles,
  optionStateStyles,
  radioIndicatorStyles,
  getOptionStyles,
  getRadioStyles,
} from './components/QuizSingle';
export type { QuizSingleComponentProps, QuizSingleState } from './components/QuizSingle';

// ============ Component Registration Helper ============
import { componentRegistry } from './registry';
import { Dialog, DialogMeta } from './components/Dialog';
import { Button, ButtonMeta } from './components/Button';
import { QuizSingle, QuizSingleMeta } from './components/QuizSingle';

/**
 * Register all built-in M0 components
 * Call this function to register Dialog, Button, and QuizSingle
 */
export function registerM0Components(): void {
  componentRegistry.register(DialogMeta, Dialog);
  componentRegistry.register(ButtonMeta, Button);
  componentRegistry.register(QuizSingleMeta, QuizSingle);
}
