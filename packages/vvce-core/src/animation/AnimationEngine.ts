/**
 * AnimationEngine - 动画引擎
 * 管理节点动画的播放和控制
 */

import type {
  AnimationDefinition,
  BuiltinAnimation,
  EasingFunction,
  NodeAnimation,
} from '@vv-education/vvce-schema';
import { BUILTIN_ANIMATIONS } from '../presets/animations';

// requestAnimationFrame polyfill for non-browser environments
declare const requestAnimationFrame:
  | ((callback: (time: number) => void) => number)
  | undefined;

const now = (): number =>
  typeof performance !== 'undefined' && typeof performance.now === 'function'
    ? performance.now()
    : Date.now();

const raf: (callback: (time: number) => void) => number | ReturnType<typeof setTimeout> =
  typeof requestAnimationFrame !== 'undefined'
    ? requestAnimationFrame
    : (callback: (time: number) => void) => setTimeout(() => callback(now()), 16);

export interface AnimationState {
  /** 是否正在播放 */
  isPlaying: boolean;
  /** 当前进度 0-1 */
  progress: number;
  /** 当前迭代次数 */
  iteration: number;
  /** 动画名称 */
  name: string;
}

export interface AnimationInstance {
  id: string;
  nodeId: string;
  animation: AnimationDefinition;
  state: AnimationState;
  cancel: () => void;
  pause: () => void;
  resume: () => void;
}

export interface PlayAnimationOptions {
  /** 节点 ID */
  nodeId: string;
  /** 动画配置 */
  animation: NodeAnimation | BuiltinAnimation | string;
  /** 持续时间覆盖 */
  duration?: number;
  /** 缓动函数覆盖 */
  easing?: EasingFunction;
  /** 延迟 */
  delay?: number;
  /** 迭代次数 */
  iterations?: number;
  /** 完成回调 */
  onComplete?: () => void;
  /** 帧回调 */
  onFrame?: (progress: number, properties: Record<string, any>) => void;
}

export class AnimationEngine {
  private activeAnimations: Map<string, AnimationInstance> = new Map();
  private customAnimations: Map<string, AnimationDefinition> = new Map();
  private animationIdCounter = 0;

  /**
   * 注册自定义动画
   */
  registerAnimation(name: string, definition: AnimationDefinition): void {
    this.customAnimations.set(name, definition);
  }

  /**
   * 批量注册动画
   */
  registerAnimations(animations: Record<string, AnimationDefinition>): void {
    for (const [name, definition] of Object.entries(animations)) {
      this.registerAnimation(name, definition);
    }
  }

  /**
   * 获取动画定义
   */
  getAnimationDefinition(name: string): AnimationDefinition | undefined {
    // 先查自定义动画
    if (this.customAnimations.has(name)) {
      return this.customAnimations.get(name);
    }
    // 再查内置动画
    return BUILTIN_ANIMATIONS[name as BuiltinAnimation];
  }

  /**
   * 播放动画
   */
  playAnimation(options: PlayAnimationOptions): AnimationInstance {
    const {
      nodeId,
      animation,
      duration: durationOverride,
      easing: easingOverride,
      delay = 0,
      iterations = 1,
      onComplete,
      onFrame,
    } = options;

    // 解析动画配置
    let animDef: AnimationDefinition;
    let animName: string;

    if (typeof animation === 'string') {
      animName = animation;
      animDef = this.getAnimationDefinition(animation) || this.createFadeAnimation();
    } else if ('type' in animation) {
      animName = animation.type;
      const baseDef =
        this.getAnimationDefinition(animation.type) || this.createFadeAnimation();
      animDef = {
        ...baseDef,
        duration: animation.duration ?? baseDef.duration,
        easing: animation.easing ?? baseDef.easing,
        delay: animation.delay ?? baseDef.delay,
      };
    } else {
      animName = 'custom';
      animDef = animation as AnimationDefinition;
    }

    // 应用覆盖参数
    const finalDef: AnimationDefinition = {
      ...animDef,
      duration: durationOverride ?? animDef.duration ?? 300,
      easing: easingOverride ?? animDef.easing ?? 'ease-out',
      delay: delay ?? animDef.delay ?? 0,
      iterations: iterations ?? animDef.iterations ?? 1,
    };

    // 生成动画实例 ID
    const instanceId = `${nodeId}-${++this.animationIdCounter}`;

    // 停止该节点上已有的动画
    this.stopAnimationOnNode(nodeId);

    // 创建动画状态
    const state: AnimationState = {
      isPlaying: true,
      progress: 0,
      iteration: 0,
      name: animName,
    };

    let cancelled = false;
    let paused = false;
    let pausedAt = 0;
    let startTime = 0;

    const duration = finalDef.duration!;
    const totalIterations = finalDef.iterations === -1 ? Infinity : finalDef.iterations!;

    const animate = (currentTime: number) => {
      if (cancelled) return;

      if (paused) {
        pausedAt = currentTime;
        return;
      }

      if (startTime === 0) {
        startTime = currentTime + (finalDef.delay || 0);
      }

      if (currentTime < startTime) {
        raf(animate);
        return;
      }

      const elapsed = currentTime - startTime;
      const totalDuration = duration * totalIterations;
      const overallProgress = Math.min(elapsed / totalDuration, 1);

      // 计算当前迭代和迭代内进度
      const currentIteration = Math.floor(elapsed / duration);
      let iterationProgress = (elapsed % duration) / duration;

      // 处理动画方向
      if (finalDef.direction === 'reverse') {
        iterationProgress = 1 - iterationProgress;
      } else if (finalDef.direction === 'alternate') {
        if (currentIteration % 2 === 1) {
          iterationProgress = 1 - iterationProgress;
        }
      } else if (finalDef.direction === 'alternate-reverse') {
        if (currentIteration % 2 === 0) {
          iterationProgress = 1 - iterationProgress;
        }
      }

      // 应用缓动
      const easedProgress = this.applyEasing(iterationProgress, finalDef.easing!);

      // 计算当前帧属性
      const properties = this.interpolateKeyframes(finalDef.keyframes, easedProgress);

      state.progress = overallProgress;
      state.iteration = currentIteration;

      onFrame?.(easedProgress, properties);

      if (overallProgress < 1) {
        raf(animate);
      } else {
        state.isPlaying = false;
        this.activeAnimations.delete(instanceId);
        onComplete?.();
      }
    };

    const instance: AnimationInstance = {
      id: instanceId,
      nodeId,
      animation: finalDef,
      state,
      cancel: () => {
        cancelled = true;
        state.isPlaying = false;
        this.activeAnimations.delete(instanceId);
      },
      pause: () => {
        paused = true;
      },
      resume: () => {
        if (paused) {
          paused = false;
          startTime += now() - pausedAt;
          raf(animate);
        }
      },
    };

    this.activeAnimations.set(instanceId, instance);
    raf(animate);

    return instance;
  }

  /**
   * 停止节点上的所有动画
   */
  stopAnimationOnNode(nodeId: string): void {
    for (const [, instance] of this.activeAnimations) {
      if (instance.nodeId === nodeId) {
        instance.cancel();
      }
    }
  }

  /**
   * 停止所有动画
   */
  stopAllAnimations(): void {
    for (const [, instance] of this.activeAnimations) {
      instance.cancel();
    }
  }

  /**
   * 暂停节点上的动画
   */
  pauseAnimationOnNode(nodeId: string): void {
    for (const [, instance] of this.activeAnimations) {
      if (instance.nodeId === nodeId) {
        instance.pause();
      }
    }
  }

  /**
   * 恢复节点上的动画
   */
  resumeAnimationOnNode(nodeId: string): void {
    for (const [, instance] of this.activeAnimations) {
      if (instance.nodeId === nodeId) {
        instance.resume();
      }
    }
  }

  /**
   * 获取节点的动画状态
   */
  getAnimationState(nodeId: string): AnimationState | undefined {
    for (const [, instance] of this.activeAnimations) {
      if (instance.nodeId === nodeId) {
        return instance.state;
      }
    }
    return undefined;
  }

  /**
   * 插值关键帧
   */
  private interpolateKeyframes(
    keyframes: AnimationDefinition['keyframes'],
    progress: number
  ): Record<string, any> {
    if (keyframes.length === 0) return {};
    if (keyframes.length === 1) return keyframes[0].properties;

    // 找到当前进度所在的关键帧区间
    const progressPercent = progress * 100;
    let fromFrame = keyframes[0];
    let toFrame = keyframes[keyframes.length - 1];

    for (let i = 0; i < keyframes.length - 1; i++) {
      if (
        keyframes[i].offset <= progressPercent &&
        keyframes[i + 1].offset >= progressPercent
      ) {
        fromFrame = keyframes[i];
        toFrame = keyframes[i + 1];
        break;
      }
    }

    // 计算区间内的进度
    const range = toFrame.offset - fromFrame.offset;
    const localProgress = range === 0 ? 1 : (progressPercent - fromFrame.offset) / range;

    // 插值属性
    return this.interpolateProperties(
      fromFrame.properties,
      toFrame.properties,
      localProgress
    );
  }

  /**
   * 插值属性值
   */
  private interpolateProperties(
    from: Record<string, any>,
    to: Record<string, any>,
    progress: number
  ): Record<string, any> {
    const result: Record<string, any> = {};

    const allKeys = new Set([...Object.keys(from), ...Object.keys(to)]);

    for (const key of allKeys) {
      const fromValue = from[key];
      const toValue = to[key];

      if (fromValue === undefined) {
        result[key] = toValue;
      } else if (toValue === undefined) {
        result[key] = fromValue;
      } else if (typeof fromValue === 'number' && typeof toValue === 'number') {
        result[key] = fromValue + (toValue - fromValue) * progress;
      } else {
        // 非数值属性，使用离散切换
        result[key] = progress < 0.5 ? fromValue : toValue;
      }
    }

    return result;
  }

  /**
   * 应用缓动函数
   */
  private applyEasing(t: number, easing: EasingFunction): number {
    switch (easing) {
      case 'linear':
        return t;
      case 'ease':
        return this.easeInOutCubic(t);
      case 'ease-in':
        return this.easeInCubic(t);
      case 'ease-out':
        return this.easeOutCubic(t);
      case 'ease-in-out':
        return this.easeInOutCubic(t);
      case 'spring':
        return this.spring(t);
      case 'bounce':
        return this.bounce(t);
      case 'elastic':
        return this.elastic(t);
      default:
        // 处理 cubic-bezier
        if (easing.startsWith('cubic-bezier')) {
          const match = easing.match(/cubic-bezier\(([^)]+)\)/);
          if (match) {
            const [x1, y1, x2, y2] = match[1].split(',').map(Number);
            return this.cubicBezier(x1, y1, x2, y2, t);
          }
        }
        return t;
    }
  }

  private easeInCubic(t: number): number {
    return t * t * t;
  }

  private easeOutCubic(t: number): number {
    return 1 - Math.pow(1 - t, 3);
  }

  private easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  private spring(t: number): number {
    return 1 - Math.cos(t * Math.PI * 4) * Math.exp(-t * 6);
  }

  private bounce(t: number): number {
    if (t < 1 / 2.75) {
      return 7.5625 * t * t;
    } else if (t < 2 / 2.75) {
      return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
    } else if (t < 2.5 / 2.75) {
      return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
    } else {
      return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
    }
  }

  private elastic(t: number): number {
    if (t === 0 || t === 1) return t;
    return Math.pow(2, -10 * t) * Math.sin(((t - 0.075) * (2 * Math.PI)) / 0.3) + 1;
  }

  private cubicBezier(
    _x1: number,
    y1: number,
    _x2: number,
    y2: number,
    t: number
  ): number {
    // 简化的三次贝塞尔计算 (仅使用 Y 分量计算缓动值)
    const cy = 3 * y1;
    const by = 3 * (y2 - y1) - cy;
    const ay = 1 - cy - by;

    return ((ay * t + by) * t + cy) * t;
  }

  /**
   * 创建默认淡入动画
   */
  private createFadeAnimation(): AnimationDefinition {
    return {
      keyframes: [
        { offset: 0, properties: { opacity: 0 } },
        { offset: 100, properties: { opacity: 1 } },
      ],
      duration: 300,
      easing: 'ease-out',
    };
  }

  /**
   * 检查是否有活动动画
   */
  hasActiveAnimations(): boolean {
    return this.activeAnimations.size > 0;
  }

  /**
   * 获取活动动画数量
   */
  getActiveAnimationCount(): number {
    return this.activeAnimations.size;
  }
}
