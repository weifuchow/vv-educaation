/**
 * Store 单元测试
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Store } from './Store';

describe('Store', () => {
  let store: Store;

  beforeEach(() => {
    store = new Store();
  });

  describe('constructor', () => {
    it('should initialize with empty state', () => {
      const state = store.getAll();
      expect(state.globals.vars).toEqual({});
      expect(state.scene.vars).toEqual({});
      expect(state.nodes).toEqual({});
    });

    it('should accept initial state', () => {
      const initialStore = new Store({
        globals: { vars: { score: 100 } },
      });
      expect(initialStore.get('globals.vars.score')).toBe(100);
    });
  });

  describe('get', () => {
    it('should get value at path', () => {
      store.set('globals.vars.score', 100);
      expect(store.get('globals.vars.score')).toBe(100);
    });

    it('should return undefined for non-existent path', () => {
      expect(store.get('globals.vars.nonexistent')).toBeUndefined();
    });

    it('should return undefined for deeply nested non-existent path', () => {
      expect(store.get('a.b.c.d.e')).toBeUndefined();
    });

    it('should handle null in path gracefully', () => {
      store.set('globals.vars.nullValue', null);
      expect(store.get('globals.vars.nullValue.nested')).toBeUndefined();
    });
  });

  describe('set', () => {
    it('should set value at simple path', () => {
      store.set('globals.vars.name', 'test');
      expect(store.get('globals.vars.name')).toBe('test');
    });

    it('should create intermediate objects', () => {
      store.set('custom.nested.deep.value', 42);
      expect(store.get('custom.nested.deep.value')).toBe(42);
    });

    it('should overwrite existing values', () => {
      store.set('globals.vars.score', 100);
      store.set('globals.vars.score', 200);
      expect(store.get('globals.vars.score')).toBe(200);
    });

    it('should handle object values', () => {
      store.set('globals.vars.user', { name: 'Alice', age: 25 });
      expect(store.get('globals.vars.user')).toEqual({ name: 'Alice', age: 25 });
    });

    it('should handle array values', () => {
      store.set('globals.vars.items', [1, 2, 3]);
      expect(store.get('globals.vars.items')).toEqual([1, 2, 3]);
    });
  });

  describe('getAll', () => {
    it('should return complete state', () => {
      store.set('globals.vars.score', 100);
      store.set('scene.vars.temp', 'data');

      const state = store.getAll();
      expect(state.globals.vars.score).toBe(100);
      expect(state.scene.vars.temp).toBe('data');
    });
  });

  describe('getGlobalVars', () => {
    it('should return global variables', () => {
      store.set('globals.vars.score', 100);
      store.set('globals.vars.name', 'test');

      const globalVars = store.getGlobalVars();
      expect(globalVars).toEqual({ score: 100, name: 'test' });
    });
  });

  describe('getSceneVars', () => {
    it('should return scene variables', () => {
      store.set('scene.vars.temp', 'data');
      store.set('scene.vars.count', 5);

      const sceneVars = store.getSceneVars();
      expect(sceneVars).toEqual({ temp: 'data', count: 5 });
    });
  });

  describe('node state management', () => {
    it('should set and get node state', () => {
      store.setNodeState('q1', { selected: 'option2' });
      expect(store.getNodeState('q1')).toEqual({ selected: 'option2' });
    });

    it('should return empty object for non-existent node', () => {
      expect(store.getNodeState('nonexistent')).toEqual({});
    });

    it('should update node state partially', () => {
      store.setNodeState('q1', { selected: 'option1', value: 10 });
      store.updateNodeState('q1', { selected: 'option2' });

      const state = store.getNodeState('q1');
      expect(state.selected).toBe('option2');
      expect(state.value).toBe(10);
    });

    it('should create node state if not exists when updating', () => {
      store.updateNodeState('newNode', { value: 'test' });
      expect(store.getNodeState('newNode')).toEqual({ value: 'test' });
    });
  });

  describe('resetSceneState', () => {
    it('should reset scene vars and nodes', () => {
      store.set('globals.vars.score', 100);
      store.set('scene.vars.temp', 'data');
      store.setNodeState('q1', { selected: 'option1' });

      store.resetSceneState();

      // Global vars should remain
      expect(store.get('globals.vars.score')).toBe(100);
      // Scene vars should be cleared
      expect(store.getSceneVars()).toEqual({});
      // Nodes should be cleared
      expect(store.getNodeState('q1')).toEqual({});
    });
  });

  describe('reset', () => {
    it('should reset all state', () => {
      store.set('globals.vars.score', 100);
      store.set('scene.vars.temp', 'data');
      store.setNodeState('q1', { selected: 'option1' });

      store.reset();

      const state = store.getAll();
      expect(state.globals.vars).toEqual({});
      expect(state.scene.vars).toEqual({});
      expect(state.nodes).toEqual({});
    });
  });

  describe('clone', () => {
    it('should create a deep copy of state', () => {
      store.set('globals.vars.score', 100);
      store.set('globals.vars.user', { name: 'Alice' });

      const cloned = store.clone();

      // Modify original
      store.set('globals.vars.score', 200);
      store.get('globals.vars.user').name = 'Bob';

      // Clone should be unchanged
      expect(cloned.globals.vars.score).toBe(100);
      expect(cloned.globals.vars.user.name).toBe('Alice');
    });
  });

  describe('restore', () => {
    it('should restore state from snapshot', () => {
      const snapshot = {
        globals: { vars: { score: 500 } },
        scene: { vars: { temp: 'restored' } },
        nodes: { q1: { selected: 'option3' } },
      };

      store.restore(snapshot);

      expect(store.get('globals.vars.score')).toBe(500);
      expect(store.get('scene.vars.temp')).toBe('restored');
      expect(store.getNodeState('q1')).toEqual({ selected: 'option3' });
    });

    it('should create deep copy when restoring', () => {
      const snapshot = {
        globals: { vars: { user: { name: 'Alice' } } },
        scene: { vars: {} },
        nodes: {},
      };

      store.restore(snapshot);

      // Modify snapshot
      snapshot.globals.vars.user.name = 'Bob';

      // Store should be unchanged
      expect(store.get('globals.vars.user.name')).toBe('Alice');
    });
  });

  describe('path access patterns', () => {
    it('should support globals.vars paths', () => {
      store.set('globals.vars.score', 100);
      expect(store.get('globals.vars.score')).toBe(100);
    });

    it('should support scene.vars paths', () => {
      store.set('scene.vars.temp', 'value');
      expect(store.get('scene.vars.temp')).toBe('value');
    });

    it('should support node state paths via set', () => {
      store.set('nodes.q1.selected', 'option1');
      expect(store.get('nodes.q1.selected')).toBe('option1');
    });

    it('should handle deeply nested paths', () => {
      store.set('globals.vars.user.profile.address.city', 'Beijing');
      expect(store.get('globals.vars.user.profile.address.city')).toBe('Beijing');
    });
  });
});
