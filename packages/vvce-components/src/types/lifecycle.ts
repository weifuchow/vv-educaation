/**
 * VVCE Component Lifecycle Interfaces
 */

/**
 * Component lifecycle hooks interface
 */
export interface VVCEComponentLifecycle<
  P = Record<string, unknown>,
  S = Record<string, unknown>,
> {
  /** Called when component mounts */
  onMount?: () => void;
  /** Called when component unmounts */
  onUnmount?: () => void;
  /** Called when props change */
  onPropsChange?: (prevProps: P, nextProps: P) => void;
  /** Called when state changes */
  onStateChange?: (prevState: S, nextState: S) => void;
  /** Called when visibility changes */
  onVisibilityChange?: (visible: boolean) => void;
}

/**
 * Result from useVVCEComponent hook
 */
export interface UseVVCEComponentResult<
  P = Record<string, unknown>,
  S = Record<string, unknown>,
> {
  /** Current props */
  props: P;
  /** Current state */
  state: S;
  /** Update state function */
  setState: (newState: Partial<S>) => void;
  /** Emit event function */
  emitEvent: (type: string, payload?: Record<string, unknown>) => void;
  /** Whether component is visible */
  visible: boolean;
}
