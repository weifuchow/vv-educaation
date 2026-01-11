/**
 * TriggerInterpreter 单元测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TriggerInterpreter } from './TriggerInterpreter';
import { ConditionEvaluator } from './ConditionEvaluator';
import { ReferenceResolver } from './ReferenceResolver';
import { ActionExecutor } from '../executor/ActionExecutor';
import { Store } from '../store/Store';
import { Logger } from '../logger/Logger';
import type { Trigger, VVEvent } from '../types';

describe('TriggerInterpreter', () => {
  let store: Store;
  let resolver: ReferenceResolver;
  let conditionEvaluator: ConditionEvaluator;
  let actionExecutor: ActionExecutor;
  let logger: Logger;
  let interpreter: TriggerInterpreter;

  beforeEach(() => {
    store = new Store();
    resolver = new ReferenceResolver(store);
    conditionEvaluator = new ConditionEvaluator(resolver);
    actionExecutor = new ActionExecutor(store, resolver, {});
    logger = new Logger({ debug: false });
    interpreter = new TriggerInterpreter(conditionEvaluator, actionExecutor, logger);
  });

  const createEvent = (type: string, target?: string, payload?: any): VVEvent => ({
    type,
    target,
    payload,
    ts: Date.now(),
  });

  describe('handleEvent', () => {
    it('should match and execute trigger when event type matches', () => {
      const executeAllSpy = vi.spyOn(actionExecutor, 'executeAll');

      const triggers: Trigger[] = [
        {
          on: { event: 'click' },
          then: [{ action: 'toast', text: 'Clicked!' }],
        },
      ];

      interpreter.handleEvent(createEvent('click'), triggers);

      expect(executeAllSpy).toHaveBeenCalledWith([{ action: 'toast', text: 'Clicked!' }]);
    });

    it('should not execute trigger when event type does not match', () => {
      const executeAllSpy = vi.spyOn(actionExecutor, 'executeAll');

      const triggers: Trigger[] = [
        {
          on: { event: 'click' },
          then: [{ action: 'toast', text: 'Clicked!' }],
        },
      ];

      interpreter.handleEvent(createEvent('change'), triggers);

      expect(executeAllSpy).not.toHaveBeenCalled();
    });

    it('should match trigger with specific target', () => {
      const executeAllSpy = vi.spyOn(actionExecutor, 'executeAll');

      const triggers: Trigger[] = [
        {
          on: { event: 'click', target: 'button1' },
          then: [{ action: 'toast', text: 'Button 1 clicked!' }],
        },
      ];

      interpreter.handleEvent(createEvent('click', 'button1'), triggers);

      expect(executeAllSpy).toHaveBeenCalledWith([{ action: 'toast', text: 'Button 1 clicked!' }]);
    });

    it('should not execute trigger when target does not match', () => {
      const executeAllSpy = vi.spyOn(actionExecutor, 'executeAll');

      const triggers: Trigger[] = [
        {
          on: { event: 'click', target: 'button1' },
          then: [{ action: 'toast', text: 'Button 1 clicked!' }],
        },
      ];

      interpreter.handleEvent(createEvent('click', 'button2'), triggers);

      expect(executeAllSpy).not.toHaveBeenCalled();
    });

    it('should execute multiple matching triggers', () => {
      const executeAllSpy = vi.spyOn(actionExecutor, 'executeAll');

      const triggers: Trigger[] = [
        {
          on: { event: 'click' },
          then: [{ action: 'toast', text: 'First trigger' }],
        },
        {
          on: { event: 'click' },
          then: [{ action: 'toast', text: 'Second trigger' }],
        },
      ];

      interpreter.handleEvent(createEvent('click'), triggers);

      expect(executeAllSpy).toHaveBeenCalledTimes(2);
    });
  });

  describe('condition evaluation', () => {
    it('should execute then actions when condition is true', () => {
      store.set('globals.vars.score', 100);
      const executeAllSpy = vi.spyOn(actionExecutor, 'executeAll');

      const triggers: Trigger[] = [
        {
          on: { event: 'click' },
          if: [{ op: 'gte', left: { ref: 'globals.vars.score' }, right: 60 }],
          then: [{ action: 'toast', text: 'Pass!' }],
          else: [{ action: 'toast', text: 'Fail!' }],
        },
      ];

      interpreter.handleEvent(createEvent('click'), triggers);

      expect(executeAllSpy).toHaveBeenCalledWith([{ action: 'toast', text: 'Pass!' }]);
    });

    it('should execute else actions when condition is false', () => {
      store.set('globals.vars.score', 50);
      const executeAllSpy = vi.spyOn(actionExecutor, 'executeAll');

      const triggers: Trigger[] = [
        {
          on: { event: 'click' },
          if: [{ op: 'gte', left: { ref: 'globals.vars.score' }, right: 60 }],
          then: [{ action: 'toast', text: 'Pass!' }],
          else: [{ action: 'toast', text: 'Fail!' }],
        },
      ];

      interpreter.handleEvent(createEvent('click'), triggers);

      expect(executeAllSpy).toHaveBeenCalledWith([{ action: 'toast', text: 'Fail!' }]);
    });

    it('should execute then actions when no conditions specified', () => {
      const executeAllSpy = vi.spyOn(actionExecutor, 'executeAll');

      const triggers: Trigger[] = [
        {
          on: { event: 'click' },
          then: [{ action: 'toast', text: 'Always!' }],
        },
      ];

      interpreter.handleEvent(createEvent('click'), triggers);

      expect(executeAllSpy).toHaveBeenCalledWith([{ action: 'toast', text: 'Always!' }]);
    });

    it('should not execute anything when condition is false and no else', () => {
      store.set('globals.vars.score', 50);
      const executeAllSpy = vi.spyOn(actionExecutor, 'executeAll');

      const triggers: Trigger[] = [
        {
          on: { event: 'click' },
          if: [{ op: 'gte', left: { ref: 'globals.vars.score' }, right: 60 }],
          then: [{ action: 'toast', text: 'Pass!' }],
        },
      ];

      interpreter.handleEvent(createEvent('click'), triggers);

      expect(executeAllSpy).not.toHaveBeenCalled();
    });

    it('should evaluate multiple conditions as AND', () => {
      store.set('globals.vars.score', 80);
      store.set('globals.vars.attempt', 3);
      const executeAllSpy = vi.spyOn(actionExecutor, 'executeAll');

      const triggers: Trigger[] = [
        {
          on: { event: 'click' },
          if: [
            { op: 'gte', left: { ref: 'globals.vars.score' }, right: 60 },
            { op: 'lte', left: { ref: 'globals.vars.attempt' }, right: 5 },
          ],
          then: [{ action: 'toast', text: 'Both conditions met!' }],
        },
      ];

      interpreter.handleEvent(createEvent('click'), triggers);

      expect(executeAllSpy).toHaveBeenCalledWith([{ action: 'toast', text: 'Both conditions met!' }]);
    });
  });

  describe('logging', () => {
    it('should log events when logger is provided', () => {
      const debugSpy = vi.spyOn(logger, 'debug');

      const triggers: Trigger[] = [
        {
          on: { event: 'click' },
          then: [{ action: 'toast', text: 'test' }],
        },
      ];

      interpreter.handleEvent(createEvent('click'), triggers);

      expect(debugSpy).toHaveBeenCalledWith('event', expect.any(String), expect.any(Object));
    });

    it('should work without logger', () => {
      const interpreterNoLogger = new TriggerInterpreter(conditionEvaluator, actionExecutor);
      const executeAllSpy = vi.spyOn(actionExecutor, 'executeAll');

      const triggers: Trigger[] = [
        {
          on: { event: 'click' },
          then: [{ action: 'toast', text: 'test' }],
        },
      ];

      expect(() => {
        interpreterNoLogger.handleEvent(createEvent('click'), triggers);
      }).not.toThrow();

      expect(executeAllSpy).toHaveBeenCalled();
    });
  });

  describe('setTriggers', () => {
    it('should log trigger count', () => {
      const debugSpy = vi.spyOn(logger, 'debug');

      const triggers: Trigger[] = [
        { on: { event: 'click' }, then: [] },
        { on: { event: 'change' }, then: [] },
      ];

      interpreter.setTriggers(triggers);

      expect(debugSpy).toHaveBeenCalledWith('trigger', expect.stringContaining('2'));
    });
  });

  describe('complex scenarios', () => {
    it('should handle quiz submission scenario', () => {
      // 模拟选择题提交场景
      store.setNodeState('q1', { selected: 'B' });
      store.set('nodes.q1.selected', 'B');

      const executeAllSpy = vi.spyOn(actionExecutor, 'executeAll');

      const triggers: Trigger[] = [
        {
          on: { event: 'click', target: 'submitBtn' },
          if: [
            { op: 'equals', left: { ref: 'nodes.q1.selected' }, right: 'B' },
          ],
          then: [
            { action: 'addScore', value: 10 },
            { action: 'toast', text: '正确！' },
          ],
          else: [
            { action: 'toast', text: '错误，请重试' },
          ],
        },
      ];

      interpreter.handleEvent(createEvent('click', 'submitBtn'), triggers);

      expect(executeAllSpy).toHaveBeenCalledWith([
        { action: 'addScore', value: 10 },
        { action: 'toast', text: '正确！' },
      ]);
    });
  });
});
