/**
 * State shape definitions for VVCE components
 */

/**
 * State field definition
 */
export interface StateFieldDefinition {
  /** Field type */
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  /** Whether the field can be null */
  nullable?: boolean;
  /** Human-readable description */
  description?: string;
  /** Default value */
  default?: unknown;
}

/**
 * State shape definition for component metadata
 */
export type StateShapeDefinition = Record<string, StateFieldDefinition> | null;
