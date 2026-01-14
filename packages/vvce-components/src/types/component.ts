/**
 * VVCE Component Protocol Definitions
 */

import type { ComponentType, ReactNode, CSSProperties } from 'react';
import type { VVCEEvent, EventDefinition } from './events';
import type { StateShapeDefinition } from './state';

/**
 * JSON Schema definition (simplified for component props validation)
 */
export interface JSONSchema {
  type?: string;
  properties?: Record<string, JSONSchema>;
  required?: string[];
  additionalProperties?: boolean;
  items?: JSONSchema;
  enum?: unknown[];
  default?: unknown;
  description?: string;
}

/**
 * Component metadata - describes a VVCE component
 */
export interface VVCEComponentMeta<
  P = Record<string, unknown>,
  S = Record<string, unknown>,
> {
  /** Unique component type identifier */
  type: string;
  /** Human-readable display name */
  displayName: string;
  /** Component description */
  description?: string;
  /** JSON Schema for props validation */
  propsSchema: JSONSchema;
  /** State shape definition (null if stateless) */
  stateShape: StateShapeDefinition;
  /** Supported events */
  events: EventDefinition[];
  /** Default props values */
  defaultProps?: Partial<P>;
  /** Default state values */
  defaultState?: Partial<S>;
}

/**
 * Base props interface for all VVCE components
 */
export interface VVCEComponentProps<
  P = Record<string, unknown>,
  S = Record<string, unknown>,
> {
  /** Unique node ID */
  id: string;
  /** Component-specific props */
  props: P;
  /** Component state (from Runtime Store) */
  state?: S;
  /** Inline style properties (React CSSProperties) */
  style?: CSSProperties;
  /** Style class name(s) */
  styleClass?: string | string[];
  /** Visibility flag */
  visible?: boolean;
  /** Event callback - called when component emits an event */
  onEvent: (event: VVCEEvent) => void;
  /** State change callback - called when component's internal state changes */
  onStateChange: (state: S) => void;
  /** Children (for container components) */
  children?: ReactNode;
}

/**
 * Registered component entry in the registry
 */
export interface RegisteredComponent<
  P = Record<string, unknown>,
  S = Record<string, unknown>,
> {
  /** Component metadata */
  meta: VVCEComponentMeta<P, S>;
  /** React component implementation */
  component: ComponentType<VVCEComponentProps<P, S>>;
}

/**
 * Component instance created by the factory
 */
export interface ComponentInstance<
  P = Record<string, unknown>,
  S = Record<string, unknown>,
> {
  /** Node ID */
  id: string;
  /** Component type */
  type: string;
  /** Resolved props */
  props: P;
  /** Current state */
  state: S;
  /** Component metadata */
  meta: VVCEComponentMeta<P, S>;
  /** React component */
  Component: ComponentType<VVCEComponentProps<P, S>>;
}

/**
 * Type helper: Extract props type from a registered component
 */
export type ExtractProps<T> = T extends RegisteredComponent<infer P, unknown> ? P : never;

/**
 * Type helper: Extract state type from a registered component
 */
export type ExtractState<T> = T extends RegisteredComponent<unknown, infer S> ? S : never;
