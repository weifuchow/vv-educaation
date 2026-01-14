/**
 * ComponentFactory - Creates component instances from DSL nodes
 */

import type { ComponentType } from 'react';
import type { NodeDSL } from '@vv-education/vvce-schema';
import type {
  VVCEComponentMeta,
  VVCEComponentProps,
  ComponentInstance,
} from '../types/component';
import type { ComponentRegistry } from '../registry/ComponentRegistry';
import { componentRegistry as defaultRegistry } from '../registry/ComponentRegistry';
import { FallbackComponent, type FallbackProps } from './FallbackComponent';

/**
 * ComponentFactory options
 */
export interface ComponentFactoryOptions {
  /** Component registry to use (defaults to global registry) */
  registry?: ComponentRegistry;
  /** Whether to throw when component not found (default: false, renders Fallback) */
  strict?: boolean;
}

/**
 * ComponentFactory - Creates component instances from DSL nodes
 */
export class ComponentFactory {
  private registry: ComponentRegistry;
  private strict: boolean;

  constructor(options: ComponentFactoryOptions = {}) {
    this.registry = options.registry || defaultRegistry;
    this.strict = options.strict || false;
  }

  /**
   * Create a component instance from a DSL node
   *
   * @param node - DSL node definition
   * @returns ComponentInstance with resolved component and props
   * @throws {Error} If strict mode is enabled and component not found
   */
  create<P = Record<string, unknown>, S = Record<string, unknown>>(
    node: NodeDSL
  ): ComponentInstance<P, S> {
    const registered = this.registry.get<P, S>(node.type);

    if (!registered) {
      if (this.strict) {
        throw new Error(`Component type "${node.type}" is not registered`);
      }

      // Return fallback component instance
      return this.createFallbackInstance(node) as unknown as ComponentInstance<P, S>;
    }

    const { meta, component } = registered;

    // Merge default props with node props
    const resolvedProps = {
      ...(meta.defaultProps || {}),
      ...(node.props || {}),
    } as P;

    // Initialize state from defaults
    const initialState = {
      ...(meta.defaultState || {}),
    } as S;

    return {
      id: node.id,
      type: node.type,
      props: resolvedProps,
      state: initialState,
      meta,
      Component: component,
    };
  }

  /**
   * Create a component instance directly from type and props
   *
   * @param type - Component type
   * @param id - Node ID
   * @param props - Component props
   * @returns ComponentInstance
   */
  createFromType<P = Record<string, unknown>, S = Record<string, unknown>>(
    type: string,
    id: string,
    props: P
  ): ComponentInstance<P, S> {
    return this.create<P, S>({
      id,
      type,
      props: props as Record<string, unknown>,
    });
  }

  /**
   * Check if a component type is available
   */
  hasComponent(type: string): boolean {
    return this.registry.has(type);
  }

  /**
   * Get component metadata
   */
  getComponentMeta(type: string): VVCEComponentMeta | undefined {
    return this.registry.get(type)?.meta;
  }

  /**
   * Create fallback instance for unknown components
   */
  private createFallbackInstance(
    node: NodeDSL
  ): ComponentInstance<FallbackProps, object> {
    const fallbackMeta: VVCEComponentMeta<FallbackProps, object> = {
      type: 'Fallback',
      displayName: 'Fallback',
      description: 'Displayed when component type is not found',
      propsSchema: {
        type: 'object',
        properties: {
          unknownType: { type: 'string' },
        },
        required: ['unknownType'],
      },
      stateShape: null,
      events: [],
    };

    return {
      id: node.id,
      type: 'Fallback',
      props: { unknownType: node.type },
      state: {},
      meta: fallbackMeta,
      Component: FallbackComponent as ComponentType<
        VVCEComponentProps<FallbackProps, object>
      >,
    };
  }
}

/**
 * Default factory instance using global registry
 */
export const componentFactory = new ComponentFactory();
