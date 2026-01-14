/**
 * VVCEProvider - React context provider for VVCE components
 */

import React, {
  createContext,
  useContext,
  useMemo,
  useCallback,
  type ReactNode,
} from 'react';
import type { VVCERuntime, VVEvent } from '@vv-education/vvce-core';
import type { ThemeConfig, CourseResources } from '@vv-education/vvce-schema';
import type { RenderContext } from './RenderContext';
import { defaultRenderContext } from './RenderContext';
import type { VVCEEvent } from '../types/events';
import { ComponentRegistry, componentRegistry } from '../registry/ComponentRegistry';
import { ComponentFactory, componentFactory } from '../factory/ComponentFactory';

/**
 * React context for VVCE
 */
const VVCEContext = createContext<RenderContext>(defaultRenderContext);

/**
 * VVCEProvider props
 */
export interface VVCEProviderProps {
  /** VVCE Runtime instance */
  runtime: VVCERuntime;
  /** Theme configuration (optional) */
  theme?: ThemeConfig;
  /** Course resources (optional) */
  resources?: CourseResources;
  /** Custom component registry (defaults to global) */
  registry?: ComponentRegistry;
  /** Custom component factory (defaults to global) */
  factory?: ComponentFactory;
  /** Children to render */
  children: ReactNode;
}

/**
 * VVCEProvider - Provides VVCE context to component tree
 */
export const VVCEProvider: React.FC<VVCEProviderProps> = ({
  runtime,
  theme,
  resources,
  registry = componentRegistry,
  factory = componentFactory,
  children,
}) => {
  /**
   * Dispatch an event to the runtime
   */
  const dispatch = useCallback(
    (event: VVCEEvent) => {
      if (!runtime) {
        console.warn('VVCEProvider: runtime is not available');
        return;
      }

      // Convert VVCEEvent to VVEvent (runtime format)
      const runtimeEvent: VVEvent = {
        type: event.type,
        target: event.target,
        payload: event.payload,
        ts: event.timestamp,
      };

      runtime.emit(runtimeEvent);
    },
    [runtime]
  );

  /**
   * Get node state from runtime
   */
  const getState = useCallback(
    (nodeId: string): unknown => {
      if (!runtime) {
        return undefined;
      }
      return runtime.getNodeState(nodeId);
    },
    [runtime]
  );

  /**
   * Set node state in runtime
   */
  const setState = useCallback(
    (nodeId: string, state: unknown): void => {
      if (!runtime) {
        console.warn('VVCEProvider: runtime is not available');
        return;
      }
      runtime.updateNodeState(nodeId, state);
    },
    [runtime]
  );

  /**
   * Resolve a reference path
   */
  const resolveRef = useCallback(
    (path: string): unknown => {
      if (!runtime) {
        return undefined;
      }

      const state = runtime.getState();

      // Parse the path and resolve
      const parts = path.split('.');

      // Handle different path types
      if (parts[0] === 'globals' && parts[1] === 'vars') {
        const varName = parts.slice(2).join('.');
        return state.globals?.vars?.[varName];
      }

      if (parts[0] === 'scene' && parts[1] === 'vars') {
        const varName = parts.slice(2).join('.');
        return state.scene?.vars?.[varName];
      }

      // Node state: nodeId.state.property
      if (parts.length >= 2 && parts[1] === 'state') {
        const nodeId = parts[0];
        const nodeState = state.nodes?.[nodeId];
        if (!nodeState) return undefined;

        const propPath = parts.slice(2).join('.');
        if (!propPath) return nodeState;

        return getNestedValue(nodeState, propPath);
      }

      return undefined;
    },
    [runtime]
  );

  /**
   * Build context value
   */
  const contextValue = useMemo<RenderContext>(
    () => ({
      runtime,
      theme: theme ?? null,
      resources: resources ?? null,
      registry,
      factory,
      dispatch,
      getState,
      setState,
      resolveRef,
    }),
    [
      runtime,
      theme,
      resources,
      registry,
      factory,
      dispatch,
      getState,
      setState,
      resolveRef,
    ]
  );

  return <VVCEContext.Provider value={contextValue}>{children}</VVCEContext.Provider>;
};

VVCEProvider.displayName = 'VVCEProvider';

/**
 * Hook to access VVCE context
 */
export function useVVCEContext(): RenderContext {
  const context = useContext(VVCEContext);

  if (context === defaultRenderContext) {
    console.warn('useVVCEContext: called outside of VVCEProvider');
  }

  return context;
}

/**
 * Hook to access specific parts of context
 */
export function useVVCERuntime(): VVCERuntime | null {
  const { runtime } = useVVCEContext();
  return runtime;
}

export function useVVCEDispatch(): (event: VVCEEvent) => void {
  const { dispatch } = useVVCEContext();
  return dispatch;
}

export function useVVCETheme(): ThemeConfig | null {
  const { theme } = useVVCEContext();
  return theme;
}

export function useVVCEResources(): CourseResources | null {
  const { resources } = useVVCEContext();
  return resources;
}

/**
 * Helper: Get nested value from object using dot-notation path
 */
function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split('.');
  let current: unknown = obj;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return current;
}
