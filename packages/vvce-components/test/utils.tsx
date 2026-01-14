/**
 * Test Utilities
 */

import React, { type ReactNode } from 'react';
import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import { VVCEProvider } from '../src/context/VVCEProvider';
import type { VVCERuntime } from '@vv-education/vvce-core';

/**
 * Mock VVCERuntime for testing
 */
export function createMockRuntime(overrides: Partial<VVCERuntime> = {}): VVCERuntime {
  const state = {
    globals: { vars: {} },
    scene: { vars: {} },
    nodes: {} as Record<string, unknown>,
  };

  return {
    emit: vi.fn(),
    getState: () => state,
    getNodeState: (nodeId: string) => state.nodes[nodeId],
    updateNodeState: (nodeId: string, nodeState: unknown) => {
      state.nodes[nodeId] = nodeState;
    },
    getCurrentSceneId: () => 'test-scene',
    getCurrentScene: () => null,
    loadCourse: vi.fn(),
    start: vi.fn(),
    gotoScene: vi.fn(),
    setState: vi.fn(),
    getLogs: () => [],
    exportLogs: () => '[]',
    reset: vi.fn(),
    destroy: vi.fn(),
    ...overrides,
  } as unknown as VVCERuntime;
}

/**
 * Custom render function with VVCE context
 */
export interface RenderWithVVCEOptions extends Omit<RenderOptions, 'wrapper'> {
  runtime?: VVCERuntime;
}

export function renderWithVVCE(
  ui: React.ReactElement,
  options: RenderWithVVCEOptions = {}
): RenderResult {
  const { runtime = createMockRuntime(), ...renderOptions } = options;

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <VVCEProvider runtime={runtime}>{children}</VVCEProvider>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * Create a mock store for testing
 */
export function createMockStore(initialState: Record<string, unknown> = {}) {
  const state = { ...initialState };

  return {
    get: (path: string) => {
      const parts = path.split('.');
      let current: unknown = state;
      for (const part of parts) {
        if (current === null || current === undefined) return undefined;
        current = (current as Record<string, unknown>)[part];
      }
      return current;
    },
    set: (path: string, value: unknown) => {
      const parts = path.split('.');
      let current: Record<string, unknown> = state;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) {
          current[parts[i]] = {};
        }
        current = current[parts[i]] as Record<string, unknown>;
      }
      current[parts[parts.length - 1]] = value;
    },
    getAll: () => state,
    reset: () => {
      Object.keys(state).forEach((key) => delete state[key]);
    },
  };
}
