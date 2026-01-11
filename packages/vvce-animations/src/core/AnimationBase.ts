/**
 * AnimationBase - 动画基类
 * 提供通用的动画控制逻辑
 */

import type { AnimationState, AnimationEvent, AnimationInstance } from '../types';

export abstract class AnimationBase implements AnimationInstance {
  protected container: HTMLElement;
  protected state: AnimationState;
  protected eventHandlers: Map<AnimationEvent, Set<(data?: any) => void>>;
  protected animationFrame: number | null = null;
  protected startTime: number = 0;
  protected pauseTime: number = 0;

  constructor(container: HTMLElement) {
    this.container = container;
    this.state = {
      playing: false,
      progress: 0,
      speed: 1,
      scale: 1,
    };
    this.eventHandlers = new Map();
  }

  // 抽象方法 - 子类必须实现
  protected abstract renderFrame(progress: number): void;
  protected abstract getDuration(): number;

  // 播放控制
  play(): void {
    if (this.state.playing) return;

    this.state.playing = true;
    this.emit('play');

    if (this.pauseTime > 0) {
      // 从暂停处继续
      this.startTime = Date.now() - this.pauseTime;
      this.pauseTime = 0;
    } else {
      this.startTime = Date.now();
    }

    this.animate();
  }

  pause(): void {
    if (!this.state.playing) return;

    this.state.playing = false;
    this.pauseTime = Date.now() - this.startTime;
    this.emit('pause');

    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  reset(): void {
    this.pause();
    this.state.progress = 0;
    this.startTime = 0;
    this.pauseTime = 0;
    this.renderFrame(0);
    this.emit('reset');
  }

  seek(progress: number): void {
    const clamped = Math.max(0, Math.min(1, progress));
    this.state.progress = clamped;
    const elapsed = clamped * this.getDuration();
    this.startTime = Date.now() - elapsed;
    this.pauseTime = elapsed;
    this.renderFrame(clamped);
    this.emit('progress', clamped);
  }

  setSpeed(speed: number): void {
    this.state.speed = Math.max(0.1, Math.min(5, speed));
  }

  zoom(scale: number): void {
    this.state.scale = Math.max(0.5, Math.min(3, scale));
    this.updateTransform();
  }

  rotate(x: number, y: number, z: number): void {
    this.state.rotation = { x, y, z };
    this.updateTransform();
  }

  // 状态管理
  getState(): AnimationState {
    return { ...this.state };
  }

  setState(newState: Partial<AnimationState>): void {
    this.state = { ...this.state, ...newState };
    this.emit('stateChange', this.state);
  }

  // 事件系统
  on(event: AnimationEvent, handler: (data?: any) => void): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);
  }

  off(event: AnimationEvent, handler: (data?: any) => void): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }

  protected emit(event: AnimationEvent, data?: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach((handler) => handler(data));
    }
  }

  // 动画循环
  private animate = (): void => {
    if (!this.state.playing) return;

    const elapsed = (Date.now() - this.startTime) * this.state.speed;
    const duration = this.getDuration();
    const progress = Math.min(elapsed / duration, 1);

    this.state.progress = progress;
    this.renderFrame(progress);
    this.emit('progress', progress);

    if (progress < 1) {
      this.animationFrame = requestAnimationFrame(this.animate);
    } else {
      this.state.playing = false;
      this.emit('end');
    }
  };

  protected updateTransform(): void {
    // 子类可以重写此方法来应用变换
  }

  destroy(): void {
    this.pause();
    this.eventHandlers.clear();
    this.container.innerHTML = '';
  }
}
