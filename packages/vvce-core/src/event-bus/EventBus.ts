/**
 * EventBus - 事件总线
 * 负责事件的派发、监听和管理
 */

import type { VVEvent, EventListener } from '../types';

export class EventBus {
  private listeners: Map<string, Set<EventListener>> = new Map();
  private allListeners: Set<EventListener> = new Set();

  /**
   * 监听特定类型的事件
   */
  on(eventType: string, listener: EventListener): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(listener);

    // 返回取消监听函数
    return () => this.off(eventType, listener);
  }

  /**
   * 监听所有事件
   */
  onAll(listener: EventListener): () => void {
    this.allListeners.add(listener);
    return () => this.offAll(listener);
  }

  /**
   * 取消监听特定事件
   */
  off(eventType: string, listener: EventListener): void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.delete(listener);
      if (listeners.size === 0) {
        this.listeners.delete(eventType);
      }
    }
  }

  /**
   * 取消监听所有事件
   */
  offAll(listener: EventListener): void {
    this.allListeners.delete(listener);
  }

  /**
   * 派发事件
   */
  emit(event: VVEvent): void {
    // 触发特定类型的监听器
    const listeners = this.listeners.get(event.type);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(event);
        } catch (error) {
          console.error(`Error in event listener for ${event.type}:`, error);
        }
      });
    }

    // 触发全局监听器
    this.allListeners.forEach((listener) => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in global event listener:', error);
      }
    });
  }

  /**
   * 清空所有监听器
   */
  clear(): void {
    this.listeners.clear();
    this.allListeners.clear();
  }

  /**
   * 获取监听器数量（用于调试）
   */
  getListenerCount(eventType?: string): number {
    if (eventType) {
      return this.listeners.get(eventType)?.size ?? 0;
    }
    let total = this.allListeners.size;
    this.listeners.forEach((listeners) => {
      total += listeners.size;
    });
    return total;
  }
}
