/**
 * VVCE Component Hooks
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type { UseVVCEComponentResult } from '../types/lifecycle';
import { createVVCEEvent } from '../types/events';
import { useVVCEContext } from './VVCEProvider';

/**
 * Hook for VVCE component state and event management
 *
 * @param nodeId - Node ID for this component
 * @param initialState - Initial state if not in store
 */
export function useVVCEComponent<
  P = Record<string, unknown>,
  S = Record<string, unknown>,
>(nodeId: string, props: P, initialState: S): UseVVCEComponentResult<P, S> {
  const { dispatch, getState, setState: setRuntimeState, runtime } = useVVCEContext();

  // Get current state from runtime or use initial
  const runtimeState = getState(nodeId) as S | undefined;
  const [localState, setLocalState] = useState<S>(runtimeState ?? initialState);

  // Track if we've synced with runtime
  const hasSyncedRef = useRef(false);

  // Sync local state with runtime state
  useEffect(() => {
    if (runtime && !hasSyncedRef.current) {
      const currentState = getState(nodeId) as S | undefined;
      if (currentState) {
        setLocalState(currentState);
      } else {
        // Initialize runtime state with initial state
        setRuntimeState(nodeId, initialState);
      }
      hasSyncedRef.current = true;
    }
  }, [runtime, nodeId, getState, setRuntimeState, initialState]);

  /**
   * Update state - updates both local and runtime state
   */
  const setState = useCallback(
    (newState: Partial<S>) => {
      setLocalState((prev) => {
        const merged = { ...prev, ...newState };
        // Sync to runtime
        setRuntimeState(nodeId, merged);
        return merged;
      });
    },
    [nodeId, setRuntimeState]
  );

  /**
   * Emit an event
   */
  const emitEvent = useCallback(
    (type: string, payload?: Record<string, unknown>) => {
      const event = createVVCEEvent(type, nodeId, payload);
      dispatch(event);
    },
    [nodeId, dispatch]
  );

  return {
    props,
    state: localState,
    setState,
    emitEvent,
    visible: true,
  };
}

/**
 * Hook for node state management
 *
 * @param nodeId - Node ID
 */
export function useNodeState<S = Record<string, unknown>>(
  nodeId: string,
  initialState: S
): [S, (newState: Partial<S>) => void] {
  const { getState, setState: setRuntimeState, runtime } = useVVCEContext();

  // Get current state from runtime or use initial
  const runtimeState = getState(nodeId) as S | undefined;
  const [localState, setLocalState] = useState<S>(runtimeState ?? initialState);

  // Sync with runtime on mount
  useEffect(() => {
    if (runtime) {
      const currentState = getState(nodeId) as S | undefined;
      if (currentState) {
        setLocalState(currentState);
      } else {
        setRuntimeState(nodeId, initialState);
      }
    }
  }, [runtime, nodeId, getState, setRuntimeState, initialState]);

  /**
   * Update state
   */
  const setState = useCallback(
    (newState: Partial<S>) => {
      setLocalState((prev) => {
        const merged = { ...prev, ...newState };
        setRuntimeState(nodeId, merged);
        return merged;
      });
    },
    [nodeId, setRuntimeState]
  );

  return [localState, setState];
}

/**
 * Hook for emitting events
 *
 * @param nodeId - Node ID for event target
 */
export function useEventEmitter(
  nodeId: string
): (type: string, payload?: Record<string, unknown>) => void {
  const { dispatch } = useVVCEContext();

  return useCallback(
    (type: string, payload?: Record<string, unknown>) => {
      const event = createVVCEEvent(type, nodeId, payload);
      dispatch(event);
    },
    [nodeId, dispatch]
  );
}

/**
 * Hook for resolving references
 */
export function useResolveRef(): (path: string) => unknown {
  const { resolveRef } = useVVCEContext();
  return resolveRef;
}
