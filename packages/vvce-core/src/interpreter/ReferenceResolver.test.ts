/**
 * ReferenceResolver 单元测试
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ReferenceResolver } from './ReferenceResolver';
import { Store } from '../store/Store';

describe('ReferenceResolver', () => {
  let store: Store;
  let resolver: ReferenceResolver;

  beforeEach(() => {
    store = new Store();
    resolver = new ReferenceResolver(store);
  });

  describe('isRef', () => {
    it('should return true for ref objects', () => {
      expect(resolver.isRef({ ref: 'globals.vars.score' })).toBe(true);
    });

    it('should return false for non-ref objects', () => {
      expect(resolver.isRef({ value: 100 })).toBe(false);
      expect(resolver.isRef({ foo: 'bar' })).toBe(false);
    });

    it('should return false for primitives', () => {
      expect(resolver.isRef(100)).toBe(false);
      expect(resolver.isRef('string')).toBe(false);
      expect(resolver.isRef(true)).toBe(false);
      expect(resolver.isRef(null)).toBeFalsy();
      expect(resolver.isRef(undefined)).toBeFalsy();
    });

    it('should return false for arrays', () => {
      expect(resolver.isRef([1, 2, 3])).toBe(false);
    });
  });

  describe('resolve', () => {
    it('should resolve ref expressions to store values', () => {
      store.set('globals.vars.score', 100);

      const result = resolver.resolve({ ref: 'globals.vars.score' });
      expect(result).toBe(100);
    });

    it('should return undefined for non-existent refs', () => {
      const result = resolver.resolve({ ref: 'globals.vars.nonexistent' });
      expect(result).toBeUndefined();
    });

    it('should return primitive values as-is', () => {
      expect(resolver.resolve(100)).toBe(100);
      expect(resolver.resolve('hello')).toBe('hello');
      expect(resolver.resolve(true)).toBe(true);
      expect(resolver.resolve(null)).toBe(null);
    });

    it('should return non-ref objects as-is', () => {
      const obj = { foo: 'bar' };
      expect(resolver.resolve(obj)).toEqual(obj);
    });

    it('should resolve nested store paths', () => {
      store.set('globals.vars.user.name', 'Alice');

      const result = resolver.resolve({ ref: 'globals.vars.user.name' });
      expect(result).toBe('Alice');
    });

    it('should resolve node state refs', () => {
      store.setNodeState('q1', { selected: 'option2' });

      // Access via nodes path
      store.set('nodes.q1.selected', 'option2');
      const result = resolver.resolve({ ref: 'nodes.q1.selected' });
      expect(result).toBe('option2');
    });
  });

  describe('interpolate', () => {
    it('should interpolate template variables', () => {
      store.set('globals.vars.score', 100);

      const result = resolver.interpolate('你的分数是 {{globals.vars.score}}');
      expect(result).toBe('你的分数是 100');
    });

    it('should interpolate multiple variables', () => {
      store.set('globals.vars.name', 'Alice');
      store.set('globals.vars.score', 95);

      const result = resolver.interpolate(
        '{{globals.vars.name}} 得了 {{globals.vars.score}} 分'
      );
      expect(result).toBe('Alice 得了 95 分');
    });

    it('should preserve unresolved variables', () => {
      const result = resolver.interpolate('Value: {{globals.vars.unknown}}');
      expect(result).toBe('Value: {{globals.vars.unknown}}');
    });

    it('should handle whitespace in template', () => {
      store.set('globals.vars.score', 100);

      const result = resolver.interpolate('Score: {{ globals.vars.score }}');
      expect(result).toBe('Score: 100');
    });

    it('should return non-string values as-is', () => {
      expect(resolver.interpolate(100 as any)).toBe(100);
      expect(resolver.interpolate(null as any)).toBe(null);
    });

    it('should handle text with no templates', () => {
      const result = resolver.interpolate('No templates here');
      expect(result).toBe('No templates here');
    });

    it('should convert values to strings', () => {
      store.set('globals.vars.count', 42);
      store.set('globals.vars.flag', true);

      expect(resolver.interpolate('Count: {{globals.vars.count}}')).toBe('Count: 42');
      expect(resolver.interpolate('Flag: {{globals.vars.flag}}')).toBe('Flag: true');
    });
  });

  describe('resolveObject', () => {
    it('should resolve refs in object properties', () => {
      store.set('globals.vars.score', 100);

      const obj = {
        value: { ref: 'globals.vars.score' },
        label: 'Score',
      };

      const result = resolver.resolveObject(obj);
      expect(result).toEqual({
        value: 100,
        label: 'Score',
      });
    });

    it('should interpolate strings in object', () => {
      store.set('globals.vars.name', 'Alice');

      const obj = {
        message: 'Hello, {{globals.vars.name}}!',
        plain: 'No template',
      };

      const result = resolver.resolveObject(obj);
      expect(result.message).toBe('Hello, Alice!');
      expect(result.plain).toBe('No template');
    });

    it('should resolve refs in arrays', () => {
      store.set('globals.vars.a', 1);
      store.set('globals.vars.b', 2);

      const obj = {
        values: [{ ref: 'globals.vars.a' }, { ref: 'globals.vars.b' }, 3],
      };

      const result = resolver.resolveObject(obj);
      expect(result.values).toEqual([1, 2, 3]);
    });

    it('should resolve nested objects recursively', () => {
      store.set('globals.vars.city', 'Beijing');

      const obj = {
        user: {
          profile: {
            location: { ref: 'globals.vars.city' },
            bio: 'Lives in {{globals.vars.city}}',
          },
        },
      };

      const result = resolver.resolveObject(obj);
      expect(result.user.profile.location).toBe('Beijing');
      expect(result.user.profile.bio).toBe('Lives in Beijing');
    });

    it('should preserve primitive values', () => {
      const obj = {
        num: 42,
        bool: true,
        nil: null,
        str: 'plain',
      };

      const result = resolver.resolveObject(obj);
      expect(result).toEqual(obj);
    });

    it('should handle empty objects', () => {
      const result = resolver.resolveObject({});
      expect(result).toEqual({});
    });

    it('should not mutate original object', () => {
      store.set('globals.vars.value', 100);

      const original = {
        data: { ref: 'globals.vars.value' },
      };

      const result = resolver.resolveObject(original);

      expect(result.data).toBe(100);
      expect(original.data).toEqual({ ref: 'globals.vars.value' });
    });
  });
});
