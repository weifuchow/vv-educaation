/**
 * RenderContext - Context for rendering VVCE components
 */

import type { VVCERuntime } from '@vv-education/vvce-core';
import type { ThemeConfig, CourseResources } from '@vv-education/vvce-schema';
import type { VVCEEvent } from '../types/events';
import type { ComponentRegistry } from '../registry/ComponentRegistry';
import type { ComponentFactory } from '../factory/ComponentFactory';

/**
 * Render context interface - provides access to runtime and utilities
 */
export interface RenderContext {
  /** VVCE Runtime instance */
  runtime: VVCERuntime | null;
  /** Current theme configuration */
  theme: ThemeConfig | null;
  /** Course resources */
  resources: CourseResources | null;
  /** Component registry */
  registry: ComponentRegistry;
  /** Component factory */
  factory: ComponentFactory;
  /** Dispatch an event to the runtime */
  dispatch: (event: VVCEEvent) => void;
  /** Get node state from runtime store */
  getState: (nodeId: string) => unknown;
  /** Set node state in runtime store */
  setState: (nodeId: string, state: unknown) => void;
  /** Resolve a reference path to its value */
  resolveRef: (path: string) => unknown;
}

/**
 * Default no-op context values for when provider is not present
 */
export const defaultRenderContext: RenderContext = {
  runtime: null,
  theme: null,
  resources: null,
  registry: null as unknown as ComponentRegistry,
  factory: null as unknown as ComponentFactory,
  dispatch: () => {
    console.warn('VVCEProvider not found: dispatch() called outside provider');
  },
  getState: () => {
    console.warn('VVCEProvider not found: getState() called outside provider');
    return undefined;
  },
  setState: () => {
    console.warn('VVCEProvider not found: setState() called outside provider');
  },
  resolveRef: () => {
    console.warn('VVCEProvider not found: resolveRef() called outside provider');
    return undefined;
  },
};
