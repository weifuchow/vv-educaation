/**
 * ComponentRegistry - Central registry for VVCE components
 *
 * Manages component registration, lookup, and validation
 */

import type { ComponentType } from 'react';
import type {
  VVCEComponentMeta,
  VVCEComponentProps,
  RegisteredComponent,
} from '../types/component';

/**
 * Registration validation errors
 */
export class ComponentRegistrationError extends Error {
  constructor(
    message: string,
    public readonly type: string
  ) {
    super(message);
    this.name = 'ComponentRegistrationError';
  }
}

/**
 * ComponentRegistry - Manages VVCE component registration and lookup
 */
export class ComponentRegistry {
  private components: Map<string, RegisteredComponent> = new Map();

  /**
   * Register a new component
   *
   * @param meta - Component metadata
   * @param component - React component implementation
   * @throws {ComponentRegistrationError} If meta is invalid or type already registered
   */
  register<P = Record<string, unknown>, S = Record<string, unknown>>(
    meta: VVCEComponentMeta<P, S>,
    component: ComponentType<VVCEComponentProps<P, S>>
  ): void {
    // Validate meta
    this.validateMeta(meta);

    // Check for existing registration
    if (this.components.has(meta.type)) {
      throw new ComponentRegistrationError(
        `Component type "${meta.type}" is already registered. Use replace() to override.`,
        meta.type
      );
    }

    // Register the component
    this.components.set(meta.type, {
      meta: meta as VVCEComponentMeta,
      component: component as ComponentType<VVCEComponentProps>,
    });
  }

  /**
   * Replace an existing component registration
   *
   * @param meta - Component metadata
   * @param component - React component implementation
   * @throws {ComponentRegistrationError} If meta is invalid
   */
  replace<P = Record<string, unknown>, S = Record<string, unknown>>(
    meta: VVCEComponentMeta<P, S>,
    component: ComponentType<VVCEComponentProps<P, S>>
  ): void {
    // Validate meta
    this.validateMeta(meta);

    // Replace the component
    this.components.set(meta.type, {
      meta: meta as VVCEComponentMeta,
      component: component as ComponentType<VVCEComponentProps>,
    });
  }

  /**
   * Get a registered component by type
   *
   * @param type - Component type identifier
   * @returns RegisteredComponent or undefined if not found
   */
  get<P = Record<string, unknown>, S = Record<string, unknown>>(
    type: string
  ): RegisteredComponent<P, S> | undefined {
    return this.components.get(type) as RegisteredComponent<P, S> | undefined;
  }

  /**
   * Check if a component type is registered
   *
   * @param type - Component type identifier
   */
  has(type: string): boolean {
    return this.components.has(type);
  }

  /**
   * List all registered component metadata
   */
  list(): VVCEComponentMeta[] {
    return Array.from(this.components.values()).map((c) => c.meta);
  }

  /**
   * List all registered component types
   */
  listTypes(): string[] {
    return Array.from(this.components.keys());
  }

  /**
   * Unregister a component by type
   *
   * @param type - Component type identifier
   * @returns true if component was unregistered, false if not found
   */
  unregister(type: string): boolean {
    return this.components.delete(type);
  }

  /**
   * Clear all registered components
   */
  clear(): void {
    this.components.clear();
  }

  /**
   * Get the number of registered components
   */
  get size(): number {
    return this.components.size;
  }

  /**
   * Validate component metadata
   */
  private validateMeta(meta: VVCEComponentMeta): void {
    if (!meta) {
      throw new ComponentRegistrationError('Component meta is required', 'unknown');
    }

    if (!meta.type || typeof meta.type !== 'string') {
      throw new ComponentRegistrationError(
        'Component meta.type must be a non-empty string',
        meta.type || 'unknown'
      );
    }

    if (!meta.displayName || typeof meta.displayName !== 'string') {
      throw new ComponentRegistrationError(
        `Component "${meta.type}" meta.displayName must be a non-empty string`,
        meta.type
      );
    }

    if (!meta.propsSchema || typeof meta.propsSchema !== 'object') {
      throw new ComponentRegistrationError(
        `Component "${meta.type}" meta.propsSchema must be an object`,
        meta.type
      );
    }

    if (!Array.isArray(meta.events)) {
      throw new ComponentRegistrationError(
        `Component "${meta.type}" meta.events must be an array`,
        meta.type
      );
    }
  }
}

/**
 * Default global component registry singleton
 */
export const componentRegistry = new ComponentRegistry();
