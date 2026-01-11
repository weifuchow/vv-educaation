/**
 * EventBus 单元测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { EventBus } from './EventBus';
import type { VVEvent } from '../types';

describe('EventBus', () => {
  let eventBus: EventBus;

  beforeEach(() => {
    eventBus = new EventBus();
  });

  const createEvent = (type: string, target?: string, payload?: any): VVEvent => ({
    type,
    target,
    payload,
    ts: Date.now(),
  });

  describe('on', () => {
    it('should register a listener for event type', () => {
      const listener = vi.fn();
      eventBus.on('click', listener);

      expect(eventBus.getListenerCount('click')).toBe(1);
    });

    it('should return unsubscribe function', () => {
      const listener = vi.fn();
      const unsubscribe = eventBus.on('click', listener);

      expect(typeof unsubscribe).toBe('function');
      unsubscribe();
      expect(eventBus.getListenerCount('click')).toBe(0);
    });

    it('should allow multiple listeners for same event type', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      eventBus.on('click', listener1);
      eventBus.on('click', listener2);

      expect(eventBus.getListenerCount('click')).toBe(2);
    });
  });

  describe('onAll', () => {
    it('should register a global listener', () => {
      const listener = vi.fn();
      eventBus.onAll(listener);

      const event = createEvent('click', 'button1');
      eventBus.emit(event);

      expect(listener).toHaveBeenCalledWith(event);
    });

    it('should return unsubscribe function', () => {
      const listener = vi.fn();
      const unsubscribe = eventBus.onAll(listener);

      unsubscribe();
      eventBus.emit(createEvent('click'));

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('off', () => {
    it('should remove a specific listener', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      eventBus.on('click', listener1);
      eventBus.on('click', listener2);
      eventBus.off('click', listener1);

      eventBus.emit(createEvent('click'));

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });

    it('should handle removing non-existent listener gracefully', () => {
      const listener = vi.fn();
      expect(() => eventBus.off('click', listener)).not.toThrow();
    });

    it('should clean up empty listener sets', () => {
      const listener = vi.fn();
      eventBus.on('click', listener);
      eventBus.off('click', listener);

      expect(eventBus.getListenerCount('click')).toBe(0);
    });
  });

  describe('offAll', () => {
    it('should remove global listener', () => {
      const listener = vi.fn();
      eventBus.onAll(listener);
      eventBus.offAll(listener);

      eventBus.emit(createEvent('click'));

      expect(listener).not.toHaveBeenCalled();
    });
  });

  describe('emit', () => {
    it('should call listeners for matching event type', () => {
      const listener = vi.fn();
      eventBus.on('click', listener);

      const event = createEvent('click', 'button1', { value: 1 });
      eventBus.emit(event);

      expect(listener).toHaveBeenCalledWith(event);
      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should not call listeners for non-matching event type', () => {
      const clickListener = vi.fn();
      eventBus.on('click', clickListener);

      eventBus.emit(createEvent('change', 'input1'));

      expect(clickListener).not.toHaveBeenCalled();
    });

    it('should call global listeners for all events', () => {
      const globalListener = vi.fn();
      eventBus.onAll(globalListener);

      eventBus.emit(createEvent('click'));
      eventBus.emit(createEvent('change'));
      eventBus.emit(createEvent('submit'));

      expect(globalListener).toHaveBeenCalledTimes(3);
    });

    it('should call both specific and global listeners', () => {
      const specificListener = vi.fn();
      const globalListener = vi.fn();

      eventBus.on('click', specificListener);
      eventBus.onAll(globalListener);

      const event = createEvent('click');
      eventBus.emit(event);

      expect(specificListener).toHaveBeenCalledWith(event);
      expect(globalListener).toHaveBeenCalledWith(event);
    });

    it('should catch and log listener errors without breaking', () => {
      const errorListener = vi.fn(() => {
        throw new Error('Test error');
      });
      const normalListener = vi.fn();

      eventBus.on('click', errorListener);
      eventBus.on('click', normalListener);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => eventBus.emit(createEvent('click'))).not.toThrow();
      expect(normalListener).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    it('should catch errors in global listeners', () => {
      const errorListener = vi.fn(() => {
        throw new Error('Test error');
      });

      eventBus.onAll(errorListener);

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => eventBus.emit(createEvent('click'))).not.toThrow();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('clear', () => {
    it('should remove all listeners', () => {
      eventBus.on('click', vi.fn());
      eventBus.on('change', vi.fn());
      eventBus.onAll(vi.fn());

      eventBus.clear();

      expect(eventBus.getListenerCount()).toBe(0);
    });
  });

  describe('getListenerCount', () => {
    it('should return count for specific event type', () => {
      eventBus.on('click', vi.fn());
      eventBus.on('click', vi.fn());
      eventBus.on('change', vi.fn());

      expect(eventBus.getListenerCount('click')).toBe(2);
      expect(eventBus.getListenerCount('change')).toBe(1);
      expect(eventBus.getListenerCount('submit')).toBe(0);
    });

    it('should return total count when no type specified', () => {
      eventBus.on('click', vi.fn());
      eventBus.on('change', vi.fn());
      eventBus.onAll(vi.fn());

      expect(eventBus.getListenerCount()).toBe(3);
    });
  });

  describe('event flow', () => {
    it('should maintain event order', () => {
      const order: number[] = [];

      eventBus.on('click', () => order.push(1));
      eventBus.on('click', () => order.push(2));
      eventBus.on('click', () => order.push(3));

      eventBus.emit(createEvent('click'));

      expect(order).toEqual([1, 2, 3]);
    });

    it('should pass event with all properties', () => {
      const listener = vi.fn();
      eventBus.on('click', listener);

      const event: VVEvent = {
        type: 'click',
        target: 'button1',
        payload: { x: 100, y: 200 },
        ts: 1234567890,
      };

      eventBus.emit(event);

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'click',
          target: 'button1',
          payload: { x: 100, y: 200 },
          ts: 1234567890,
        })
      );
    });
  });
});
