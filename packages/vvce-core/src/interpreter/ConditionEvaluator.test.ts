/**
 * ConditionEvaluator 单元测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ConditionEvaluator } from './ConditionEvaluator';
import { ReferenceResolver } from './ReferenceResolver';
import { Store } from '../store/Store';
import type { Condition } from '../types';

describe('ConditionEvaluator', () => {
  let store: Store;
  let resolver: ReferenceResolver;
  let evaluator: ConditionEvaluator;

  beforeEach(() => {
    store = new Store();
    resolver = new ReferenceResolver(store);
    evaluator = new ConditionEvaluator(resolver);
  });

  describe('equals operator', () => {
    it('should return true for equal values', () => {
      store.set('globals.vars.score', 100);

      const condition: Condition = {
        op: 'equals',
        left: { ref: 'globals.vars.score' },
        right: 100,
      };

      expect(evaluator.evaluate(condition)).toBe(true);
    });

    it('should return false for unequal values', () => {
      store.set('globals.vars.score', 100);

      const condition: Condition = {
        op: 'equals',
        left: { ref: 'globals.vars.score' },
        right: 200,
      };

      expect(evaluator.evaluate(condition)).toBe(false);
    });

    it('should compare strings', () => {
      store.set('globals.vars.answer', 'A');

      const condition: Condition = {
        op: 'equals',
        left: { ref: 'globals.vars.answer' },
        right: 'A',
      };

      expect(evaluator.evaluate(condition)).toBe(true);
    });

    it('should use strict equality', () => {
      store.set('globals.vars.value', '100');

      const condition: Condition = {
        op: 'equals',
        left: { ref: 'globals.vars.value' },
        right: 100,
      };

      expect(evaluator.evaluate(condition)).toBe(false);
    });
  });

  describe('notEquals operator', () => {
    it('should return true for different values', () => {
      store.set('globals.vars.score', 100);

      const condition: Condition = {
        op: 'notEquals',
        left: { ref: 'globals.vars.score' },
        right: 200,
      };

      expect(evaluator.evaluate(condition)).toBe(true);
    });

    it('should return false for equal values', () => {
      store.set('globals.vars.score', 100);

      const condition: Condition = {
        op: 'notEquals',
        left: { ref: 'globals.vars.score' },
        right: 100,
      };

      expect(evaluator.evaluate(condition)).toBe(false);
    });
  });

  describe('gt operator (greater than)', () => {
    it('should return true when left > right', () => {
      store.set('globals.vars.score', 100);

      const condition: Condition = {
        op: 'gt',
        left: { ref: 'globals.vars.score' },
        right: 50,
      };

      expect(evaluator.evaluate(condition)).toBe(true);
    });

    it('should return false when left <= right', () => {
      store.set('globals.vars.score', 50);

      expect(
        evaluator.evaluate({
          op: 'gt',
          left: { ref: 'globals.vars.score' },
          right: 50,
        })
      ).toBe(false);

      expect(
        evaluator.evaluate({
          op: 'gt',
          left: { ref: 'globals.vars.score' },
          right: 100,
        })
      ).toBe(false);
    });

    it('should handle string numbers', () => {
      store.set('globals.vars.score', '100');

      const condition: Condition = {
        op: 'gt',
        left: { ref: 'globals.vars.score' },
        right: 50,
      };

      expect(evaluator.evaluate(condition)).toBe(true);
    });

    it('should return false for non-numeric values', () => {
      store.set('globals.vars.value', 'not a number');

      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const condition: Condition = {
        op: 'gt',
        left: { ref: 'globals.vars.value' },
        right: 50,
      };

      expect(evaluator.evaluate(condition)).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('gte operator (greater than or equal)', () => {
    it('should return true when left >= right', () => {
      store.set('globals.vars.score', 100);

      expect(
        evaluator.evaluate({
          op: 'gte',
          left: { ref: 'globals.vars.score' },
          right: 100,
        })
      ).toBe(true);

      expect(
        evaluator.evaluate({
          op: 'gte',
          left: { ref: 'globals.vars.score' },
          right: 50,
        })
      ).toBe(true);
    });

    it('should return false when left < right', () => {
      store.set('globals.vars.score', 50);

      const condition: Condition = {
        op: 'gte',
        left: { ref: 'globals.vars.score' },
        right: 100,
      };

      expect(evaluator.evaluate(condition)).toBe(false);
    });
  });

  describe('lt operator (less than)', () => {
    it('should return true when left < right', () => {
      store.set('globals.vars.score', 50);

      const condition: Condition = {
        op: 'lt',
        left: { ref: 'globals.vars.score' },
        right: 100,
      };

      expect(evaluator.evaluate(condition)).toBe(true);
    });

    it('should return false when left >= right', () => {
      store.set('globals.vars.score', 100);

      expect(
        evaluator.evaluate({
          op: 'lt',
          left: { ref: 'globals.vars.score' },
          right: 100,
        })
      ).toBe(false);

      expect(
        evaluator.evaluate({
          op: 'lt',
          left: { ref: 'globals.vars.score' },
          right: 50,
        })
      ).toBe(false);
    });
  });

  describe('lte operator (less than or equal)', () => {
    it('should return true when left <= right', () => {
      store.set('globals.vars.score', 100);

      expect(
        evaluator.evaluate({
          op: 'lte',
          left: { ref: 'globals.vars.score' },
          right: 100,
        })
      ).toBe(true);

      expect(
        evaluator.evaluate({
          op: 'lte',
          left: { ref: 'globals.vars.score' },
          right: 150,
        })
      ).toBe(true);
    });

    it('should return false when left > right', () => {
      store.set('globals.vars.score', 100);

      const condition: Condition = {
        op: 'lte',
        left: { ref: 'globals.vars.score' },
        right: 50,
      };

      expect(evaluator.evaluate(condition)).toBe(false);
    });
  });

  describe('and operator', () => {
    it('should return true when all conditions are true', () => {
      store.set('globals.vars.a', 10);
      store.set('globals.vars.b', 20);

      const condition: Condition = {
        op: 'and',
        conditions: [
          { op: 'gt', left: { ref: 'globals.vars.a' }, right: 5 },
          { op: 'lt', left: { ref: 'globals.vars.b' }, right: 30 },
        ],
      };

      expect(evaluator.evaluate(condition)).toBe(true);
    });

    it('should return false when any condition is false', () => {
      store.set('globals.vars.a', 10);
      store.set('globals.vars.b', 20);

      const condition: Condition = {
        op: 'and',
        conditions: [
          { op: 'gt', left: { ref: 'globals.vars.a' }, right: 5 },
          { op: 'gt', left: { ref: 'globals.vars.b' }, right: 30 },
        ],
      };

      expect(evaluator.evaluate(condition)).toBe(false);
    });

    it('should return true for empty conditions', () => {
      const condition: Condition = {
        op: 'and',
        conditions: [],
      };

      expect(evaluator.evaluate(condition)).toBe(true);
    });

    it('should return true when conditions is undefined', () => {
      const condition: Condition = {
        op: 'and',
      };

      expect(evaluator.evaluate(condition)).toBe(true);
    });
  });

  describe('or operator', () => {
    it('should return true when any condition is true', () => {
      store.set('globals.vars.a', 10);
      store.set('globals.vars.b', 20);

      const condition: Condition = {
        op: 'or',
        conditions: [
          { op: 'gt', left: { ref: 'globals.vars.a' }, right: 100 },
          { op: 'lt', left: { ref: 'globals.vars.b' }, right: 30 },
        ],
      };

      expect(evaluator.evaluate(condition)).toBe(true);
    });

    it('should return false when all conditions are false', () => {
      store.set('globals.vars.a', 10);
      store.set('globals.vars.b', 20);

      const condition: Condition = {
        op: 'or',
        conditions: [
          { op: 'gt', left: { ref: 'globals.vars.a' }, right: 100 },
          { op: 'gt', left: { ref: 'globals.vars.b' }, right: 100 },
        ],
      };

      expect(evaluator.evaluate(condition)).toBe(false);
    });

    it('should return false for empty conditions', () => {
      const condition: Condition = {
        op: 'or',
        conditions: [],
      };

      expect(evaluator.evaluate(condition)).toBe(false);
    });
  });

  describe('not operator', () => {
    it('should negate true condition', () => {
      store.set('globals.vars.score', 100);

      const condition: Condition = {
        op: 'not',
        conditions: [{ op: 'equals', left: { ref: 'globals.vars.score' }, right: 100 }],
      };

      expect(evaluator.evaluate(condition)).toBe(false);
    });

    it('should negate false condition', () => {
      store.set('globals.vars.score', 100);

      const condition: Condition = {
        op: 'not',
        conditions: [{ op: 'equals', left: { ref: 'globals.vars.score' }, right: 200 }],
      };

      expect(evaluator.evaluate(condition)).toBe(true);
    });

    it('should return false for empty conditions', () => {
      const condition: Condition = {
        op: 'not',
        conditions: [],
      };

      expect(evaluator.evaluate(condition)).toBe(false);
    });
  });

  describe('unknown operator', () => {
    it('should return false and warn for unknown operators', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      const condition = {
        op: 'unknown' as any,
        left: 1,
        right: 2,
      };

      expect(evaluator.evaluate(condition)).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Unknown condition operator')
      );

      consoleSpy.mockRestore();
    });
  });

  describe('evaluateAll', () => {
    it('should return true when all conditions pass', () => {
      store.set('globals.vars.a', 10);
      store.set('globals.vars.b', 20);

      const conditions: Condition[] = [
        { op: 'gt', left: { ref: 'globals.vars.a' }, right: 5 },
        { op: 'lt', left: { ref: 'globals.vars.b' }, right: 30 },
      ];

      expect(evaluator.evaluateAll(conditions)).toBe(true);
    });

    it('should return false when any condition fails', () => {
      store.set('globals.vars.a', 10);
      store.set('globals.vars.b', 20);

      const conditions: Condition[] = [
        { op: 'gt', left: { ref: 'globals.vars.a' }, right: 5 },
        { op: 'gt', left: { ref: 'globals.vars.b' }, right: 100 },
      ];

      expect(evaluator.evaluateAll(conditions)).toBe(false);
    });

    it('should return true for empty conditions array', () => {
      expect(evaluator.evaluateAll([])).toBe(true);
    });
  });

  describe('nested conditions', () => {
    it('should evaluate complex nested conditions', () => {
      store.set('globals.vars.age', 25);
      store.set('globals.vars.score', 80);

      // (age > 18 AND score >= 60) OR score >= 90
      const condition: Condition = {
        op: 'or',
        conditions: [
          {
            op: 'and',
            conditions: [
              { op: 'gt', left: { ref: 'globals.vars.age' }, right: 18 },
              { op: 'gte', left: { ref: 'globals.vars.score' }, right: 60 },
            ],
          },
          { op: 'gte', left: { ref: 'globals.vars.score' }, right: 90 },
        ],
      };

      expect(evaluator.evaluate(condition)).toBe(true);
    });
  });
});
