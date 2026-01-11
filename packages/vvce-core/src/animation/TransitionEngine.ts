/**
 * TransitionEngine - 过渡动画引擎
 * 提供场景切换和节点动画的过渡效果
 */

import type {
  TransitionType,
  TransitionDirection,
  EasingFunction,
  SceneTransition,
  TransitionDefinition,
} from '@vv-education/vvce-schema';

// requestAnimationFrame polyfill for non-browser environments
declare const requestAnimationFrame: ((callback: (time: number) => void) => number) | undefined;

const now = (): number =>
  typeof performance !== 'undefined' && typeof performance.now === 'function'
    ? performance.now()
    : Date.now();

const raf: (callback: (time: number) => void) => number | ReturnType<typeof setTimeout> =
  typeof requestAnimationFrame !== 'undefined'
    ? requestAnimationFrame
    : (callback: (time: number) => void) => setTimeout(() => callback(now()), 16);

export interface TransitionState {
  /** 过渡是否进行中 */
  isTransitioning: boolean;
  /** 当前进度 0-1 */
  progress: number;
  /** 过渡类型 */
  type: TransitionType;
  /** 过渡方向 */
  direction: TransitionDirection;
}

export interface TransitionOptions {
  /** 过渡配置 */
  transition: SceneTransition | TransitionDefinition;
  /** 完成回调 */
  onComplete?: () => void;
  /** 进度回调 */
  onProgress?: (progress: number) => void;
  /** 取消回调 */
  onCancel?: () => void;
}

export interface TransitionResult {
  /** 离开元素的样式 */
  exitStyle: TransitionStyle;
  /** 进入元素的样式 */
  enterStyle: TransitionStyle;
}

export interface TransitionStyle {
  opacity?: number;
  transform?: string;
  filter?: string;
  clipPath?: string;
  perspective?: string;
}

/** 缓动函数映射 */
const EASING_FUNCTIONS: Record<string, string> = {
  'linear': 'linear',
  'ease': 'ease',
  'ease-in': 'ease-in',
  'ease-out': 'ease-out',
  'ease-in-out': 'ease-in-out',
  'spring': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  'elastic': 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
};

export class TransitionEngine {
  private activeTransitions: Map<string, {
    cancel: () => void;
    state: TransitionState;
  }> = new Map();

  private customTransitions: Map<string, TransitionDefinition> = new Map();

  /**
   * 注册自定义过渡效果
   */
  registerTransition(name: string, definition: TransitionDefinition): void {
    this.customTransitions.set(name, definition);
  }

  /**
   * 获取过渡效果的 CSS 缓动函数
   */
  getEasingCSS(easing: EasingFunction = 'ease-out'): string {
    if (easing.startsWith('cubic-bezier')) {
      return easing;
    }
    return EASING_FUNCTIONS[easing] || EASING_FUNCTIONS.ease;
  }

  /**
   * 计算过渡样式（基于进度）
   */
  calculateTransitionStyles(
    type: TransitionType,
    direction: TransitionDirection,
    progress: number,
    isEntering: boolean
  ): TransitionStyle {
    const p = isEntering ? progress : 1 - progress;

    switch (type) {
      case 'none':
        return {};

      case 'fade':
        return { opacity: p };

      case 'slide':
        return this.calculateSlideStyle(direction, p, isEntering);

      case 'scale':
        return this.calculateScaleStyle(p, isEntering);

      case 'flip':
        return this.calculateFlipStyle(direction, p, isEntering);

      case 'rotate':
        return this.calculateRotateStyle(direction, p, isEntering);

      case 'zoom':
        return this.calculateZoomStyle(p, isEntering);

      case 'bounce':
        return this.calculateBounceStyle(p, isEntering);

      case 'blur':
        return this.calculateBlurStyle(p, isEntering);

      case 'wipe':
        return this.calculateWipeStyle(direction, p, isEntering);

      case 'reveal':
        return this.calculateRevealStyle(direction, p, isEntering);

      case 'cube':
        return this.calculateCubeStyle(direction, p, isEntering);

      case 'carousel':
        return this.calculateCarouselStyle(direction, p, isEntering);

      case 'stack':
        return this.calculateStackStyle(direction, p, isEntering);

      case 'shuffle':
        return this.calculateShuffleStyle(p, isEntering);

      case 'morph':
        return this.calculateMorphStyle(p, isEntering);

      default:
        return { opacity: p };
    }
  }

  private calculateSlideStyle(
    direction: TransitionDirection,
    progress: number,
    isEntering: boolean
  ): TransitionStyle {
    const offset = (1 - progress) * 100;
    const sign = isEntering ? 1 : -1;

    let transform: string;
    switch (direction) {
      case 'left':
        transform = `translateX(${sign * offset}%)`;
        break;
      case 'right':
        transform = `translateX(${-sign * offset}%)`;
        break;
      case 'up':
        transform = `translateY(${sign * offset}%)`;
        break;
      case 'down':
        transform = `translateY(${-sign * offset}%)`;
        break;
      default:
        transform = `translateX(${sign * offset}%)`;
    }

    return { transform, opacity: progress };
  }

  private calculateScaleStyle(
    progress: number,
    isEntering: boolean
  ): TransitionStyle {
    const scale = isEntering ? 0.8 + progress * 0.2 : 1 - (1 - progress) * 0.2;
    return {
      transform: `scale(${scale})`,
      opacity: progress,
    };
  }

  private calculateFlipStyle(
    direction: TransitionDirection,
    progress: number,
    isEntering: boolean
  ): TransitionStyle {
    const degrees = (1 - progress) * (isEntering ? -90 : 90);
    const axis = direction === 'up' || direction === 'down' ? 'X' : 'Y';

    return {
      transform: `perspective(1000px) rotate${axis}(${degrees}deg)`,
      opacity: progress > 0.5 ? 1 : progress * 2,
    };
  }

  private calculateRotateStyle(
    _direction: TransitionDirection,
    progress: number,
    isEntering: boolean
  ): TransitionStyle {
    const degrees = (1 - progress) * (isEntering ? -180 : 180);
    const scale = 0.5 + progress * 0.5;

    return {
      transform: `rotate(${degrees}deg) scale(${scale})`,
      opacity: progress,
    };
  }

  private calculateZoomStyle(
    progress: number,
    isEntering: boolean
  ): TransitionStyle {
    const scale = isEntering ? progress : 1 + (1 - progress) * 0.5;

    return {
      transform: `scale(${scale})`,
      opacity: progress,
    };
  }

  private calculateBounceStyle(
    progress: number,
    isEntering: boolean
  ): TransitionStyle {
    // 弹性效果
    const bounceProgress = this.bounceEasing(progress);
    const scale = isEntering
      ? 0.3 + bounceProgress * 0.7
      : 1 - (1 - bounceProgress) * 0.7;

    return {
      transform: `scale(${scale})`,
      opacity: progress,
    };
  }

  private calculateBlurStyle(
    progress: number,
    _isEntering: boolean
  ): TransitionStyle {
    const blur = (1 - progress) * 20;

    return {
      opacity: progress,
      filter: `blur(${blur}px)`,
    };
  }

  private calculateWipeStyle(
    direction: TransitionDirection,
    progress: number,
    _isEntering: boolean
  ): TransitionStyle {
    let clipPath: string;

    switch (direction) {
      case 'left':
        clipPath = `inset(0 ${(1 - progress) * 100}% 0 0)`;
        break;
      case 'right':
        clipPath = `inset(0 0 0 ${(1 - progress) * 100}%)`;
        break;
      case 'up':
        clipPath = `inset(0 0 ${(1 - progress) * 100}% 0)`;
        break;
      case 'down':
        clipPath = `inset(${(1 - progress) * 100}% 0 0 0)`;
        break;
      default:
        clipPath = `inset(0 ${(1 - progress) * 100}% 0 0)`;
    }

    return { clipPath };
  }

  private calculateRevealStyle(
    direction: TransitionDirection,
    progress: number,
    _isEntering: boolean
  ): TransitionStyle {
    const size = progress * 150; // 150% 以确保完全覆盖

    let clipPath: string;
    switch (direction) {
      case 'center':
        clipPath = `circle(${size}% at 50% 50%)`;
        break;
      case 'left':
        clipPath = `circle(${size}% at 0% 50%)`;
        break;
      case 'right':
        clipPath = `circle(${size}% at 100% 50%)`;
        break;
      case 'up':
        clipPath = `circle(${size}% at 50% 0%)`;
        break;
      case 'down':
        clipPath = `circle(${size}% at 50% 100%)`;
        break;
      default:
        clipPath = `circle(${size}% at 50% 50%)`;
    }

    return { clipPath };
  }

  private calculateCubeStyle(
    direction: TransitionDirection,
    progress: number,
    isEntering: boolean
  ): TransitionStyle {
    const degrees = (1 - progress) * (isEntering ? 90 : -90);
    const translateZ = 200;
    const axis = direction === 'up' || direction === 'down' ? 'X' : 'Y';

    return {
      transform: `perspective(1000px) translateZ(${translateZ * (1 - progress)}px) rotate${axis}(${degrees}deg)`,
      opacity: progress > 0.2 ? 1 : progress * 5,
      perspective: '1000px',
    };
  }

  private calculateCarouselStyle(
    _direction: TransitionDirection,
    progress: number,
    isEntering: boolean
  ): TransitionStyle {
    const translateX = (1 - progress) * (isEntering ? 100 : -100);
    const rotateY = (1 - progress) * (isEntering ? 45 : -45);
    const scale = 0.8 + progress * 0.2;

    return {
      transform: `perspective(1000px) translateX(${translateX}%) rotateY(${rotateY}deg) scale(${scale})`,
      opacity: 0.5 + progress * 0.5,
    };
  }

  private calculateStackStyle(
    _direction: TransitionDirection,
    progress: number,
    isEntering: boolean
  ): TransitionStyle {
    const scale = isEntering ? 0.9 + progress * 0.1 : 1;
    const translateY = isEntering ? (1 - progress) * 30 : 0;

    return {
      transform: `translateY(${translateY}px) scale(${scale})`,
      opacity: isEntering ? progress : 1 - progress * 0.3,
    };
  }

  private calculateShuffleStyle(
    progress: number,
    isEntering: boolean
  ): TransitionStyle {
    const rotate = (1 - progress) * (isEntering ? 15 : -15);
    const translateX = (1 - progress) * (isEntering ? 50 : -50);
    const scale = 0.9 + progress * 0.1;

    return {
      transform: `translateX(${translateX}px) rotate(${rotate}deg) scale(${scale})`,
      opacity: progress,
    };
  }

  private calculateMorphStyle(
    progress: number,
    _isEntering: boolean
  ): TransitionStyle {
    // 形变效果 - 结合多种变换
    const scale = 0.95 + progress * 0.05;
    const blur = (1 - progress) * 5;

    return {
      transform: `scale(${scale})`,
      opacity: progress,
      filter: `blur(${blur}px)`,
    };
  }

  /**
   * 弹性缓动函数
   */
  private bounceEasing(t: number): number {
    if (t < 0.5) {
      return 4 * t * t * t;
    }
    const f = 2 * t - 2;
    return 0.5 * f * f * f + 1;
  }

  /**
   * 启动过渡动画
   */
  startTransition(
    id: string,
    options: TransitionOptions
  ): TransitionState {
    // 取消已有的同 ID 过渡
    this.cancelTransition(id);

    const { transition, onComplete, onProgress, onCancel } = options;
    const duration = transition.duration || 300;
    const type = transition.type || 'fade';
    const direction = transition.direction || 'left';

    const state: TransitionState = {
      isTransitioning: true,
      progress: 0,
      type,
      direction,
    };

    let startTime: number | null = null;
    let cancelled = false;

    const animate = (currentTime: number) => {
      if (cancelled) {
        return;
      }

      if (startTime === null) {
        startTime = currentTime;
      }
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      state.progress = progress;
      onProgress?.(progress);

      if (progress < 1) {
        raf(animate);
      } else {
        state.isTransitioning = false;
        this.activeTransitions.delete(id);
        onComplete?.();
      }
    };

    const cancel = () => {
      cancelled = true;
      state.isTransitioning = false;
      this.activeTransitions.delete(id);
      onCancel?.();
    };

    this.activeTransitions.set(id, { cancel, state });
    raf(animate);

    return state;
  }

  /**
   * 取消过渡动画
   */
  cancelTransition(id: string): void {
    const transition = this.activeTransitions.get(id);
    if (transition) {
      transition.cancel();
    }
  }

  /**
   * 取消所有过渡动画
   */
  cancelAllTransitions(): void {
    for (const [id] of this.activeTransitions) {
      this.cancelTransition(id);
    }
  }

  /**
   * 获取过渡状态
   */
  getTransitionState(id: string): TransitionState | undefined {
    return this.activeTransitions.get(id)?.state;
  }

  /**
   * 是否有活动的过渡
   */
  hasActiveTransitions(): boolean {
    return this.activeTransitions.size > 0;
  }

  /**
   * 生成过渡 CSS 属性
   */
  generateTransitionCSS(
    transition: SceneTransition | TransitionDefinition,
    properties: string[] = ['all']
  ): string {
    const duration = transition.duration || 300;
    const easing = this.getEasingCSS(transition.easing);

    return properties
      .map((prop) => `${prop} ${duration}ms ${easing}`)
      .join(', ');
  }

  /**
   * 获取默认场景过渡配置
   */
  static getDefaultTransition(): SceneTransition {
    return {
      type: 'fade',
      duration: 300,
      easing: 'ease-out',
      direction: 'left',
    };
  }
}
