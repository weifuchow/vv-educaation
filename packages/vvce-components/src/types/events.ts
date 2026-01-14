/**
 * VVCEEvent - Component event interface
 */

/**
 * Event emitted by VVCE components
 */
export interface VVCEEvent {
  /** Event type (click, change, submit, etc.) */
  type: string;
  /** Target node ID */
  target: string;
  /** Event payload data */
  payload?: Record<string, unknown>;
  /** Timestamp when event occurred */
  timestamp: number;
}

/**
 * Event definition for component metadata
 */
export interface EventDefinition {
  /** Event type identifier */
  type: string;
  /** Human-readable description */
  description?: string;
  /** Payload schema definition */
  payload?: Record<string, PayloadFieldDefinition>;
}

/**
 * Payload field definition
 */
export interface PayloadFieldDefinition {
  /** Field type */
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  /** Whether the field is required */
  required?: boolean;
  /** Field description */
  description?: string;
}

/**
 * Create a VVCEEvent with automatic timestamp
 */
export function createVVCEEvent(
  type: string,
  target: string,
  payload?: Record<string, unknown>
): VVCEEvent {
  return {
    type,
    target,
    payload,
    timestamp: Date.now(),
  };
}
