/**
 * ActionExecutor - 动作执行器
 * 执行 DSL 中定义的各种动作
 *
 * v1.1 增强: 支持动画、样式、主题等新动作类型
 */

import type { Action, UIAction } from '../types';
import type { Store } from '../store/Store';
import type { ReferenceResolver } from '../interpreter/ReferenceResolver';
import type { AnimationEngine } from '../animation/AnimationEngine';
import type { ThemeProvider } from '../style/ThemeProvider';
import type {
  SceneTransition,
  StyleProperties,
  BuiltinAnimation,
  BuiltinTheme,
} from '@vv-education/vvce-schema';

export interface ActionExecutorCallbacks {
  onSceneChange?: (sceneId: string, transition?: SceneTransition) => void;
  onUIAction?: (action: UIAction) => void;
  onAnimationAction?: (action: AnimationAction) => void;
  onStyleAction?: (action: StyleAction) => void;
  onSoundAction?: (action: SoundAction) => void;
  onHapticAction?: (action: HapticAction) => void;
}

// UIAction, ToastUIAction, ModalUIAction 从 '../types' 导入
export type { UIAction, ToastUIAction, ModalUIAction } from '../types';

/** 动画动作 */
export interface AnimationAction {
  type: 'play' | 'stop';
  target: string;
  animation?: BuiltinAnimation | string;
  duration?: number;
  easing?: string;
  delay?: number;
  iterations?: number;
}

/** 样式动作 */
export interface StyleAction {
  type: 'setStyle' | 'addClass' | 'removeClass' | 'show' | 'hide';
  target: string;
  style?: StyleProperties;
  className?: string | string[];
  animation?: BuiltinAnimation | string;
  duration?: number;
  animate?: boolean;
}

/** 音效动作 */
export interface SoundAction {
  type: 'sound';
  src: string;
  volume?: number;
  loop?: boolean;
}

/** 触觉反馈动作 */
export interface HapticAction {
  type: 'haptic';
  feedbackType: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';
}

export interface ActionExecutorOptions {
  store: Store;
  resolver: ReferenceResolver;
  callbacks?: ActionExecutorCallbacks;
  animationEngine?: AnimationEngine;
  themeProvider?: ThemeProvider;
}

export class ActionExecutor {
  private store: Store;
  private resolver: ReferenceResolver;
  private callbacks: ActionExecutorCallbacks;
  private animationEngine?: AnimationEngine;
  private themeProvider?: ThemeProvider;

  constructor(options: ActionExecutorOptions);
  constructor(
    store: Store,
    resolver: ReferenceResolver,
    callbacks?: ActionExecutorCallbacks
  );
  constructor(
    storeOrOptions: Store | ActionExecutorOptions,
    resolver?: ReferenceResolver,
    callbacks: ActionExecutorCallbacks = {}
  ) {
    if ('store' in storeOrOptions) {
      // 新的构造函数签名
      this.store = storeOrOptions.store;
      this.resolver = storeOrOptions.resolver;
      this.callbacks = storeOrOptions.callbacks || {};
      this.animationEngine = storeOrOptions.animationEngine;
      this.themeProvider = storeOrOptions.themeProvider;
    } else {
      // 兼容旧的构造函数签名
      this.store = storeOrOptions;
      this.resolver = resolver!;
      this.callbacks = callbacks;
    }
  }

  /**
   * 设置引擎实例（用于延迟注入）
   */
  setEngines(engines: {
    animationEngine?: AnimationEngine;
    themeProvider?: ThemeProvider;
  }): void {
    if (engines.animationEngine) this.animationEngine = engines.animationEngine;
    if (engines.themeProvider) this.themeProvider = engines.themeProvider;
  }

  /**
   * 执行单个动作
   */
  async execute(action: Action): Promise<void> {
    switch (action.action) {
      // ===== 原有动作 =====
      case 'gotoScene':
        this.executeGotoScene(action.sceneId, action.transition);
        break;
      case 'setVar':
        this.executeSetVar(action.path, action.value);
        break;
      case 'incVar':
        this.executeIncVar(action.path, action.by ?? 1);
        break;
      case 'addScore':
        this.executeAddScore(action.value);
        break;
      case 'toast':
        this.executeToast(action);
        break;
      case 'modal':
        this.executeModal(action);
        break;
      case 'resetNode':
        this.executeResetNode(action.nodeId);
        break;

      // ===== 新增动画动作 =====
      case 'playAnimation':
        this.executePlayAnimation(action);
        break;
      case 'stopAnimation':
        this.executeStopAnimation(action.target);
        break;

      // ===== 新增样式动作 =====
      case 'setStyle':
        this.executeSetStyle(action);
        break;
      case 'addClass':
        this.executeAddClass(action);
        break;
      case 'removeClass':
        this.executeRemoveClass(action);
        break;
      case 'setTheme':
        this.executeSetTheme(action.theme, action.duration);
        break;
      case 'showNode':
        this.executeShowNode(action);
        break;
      case 'hideNode':
        this.executeHideNode(action);
        break;

      // ===== 流程控制动作 =====
      case 'parallel':
        await this.executeParallel(action.actions);
        break;
      case 'sequence':
        await this.executeSequence(action.actions);
        break;
      case 'delay':
        await this.executeDelay(action.duration);
        break;

      // ===== 多媒体动作 =====
      case 'sound':
        this.executeSound(action);
        break;
      case 'haptic':
        this.executeHaptic(action.type);
        break;

      default:
        console.warn(`Unknown action type: ${(action as any).action}`);
    }
  }

  /**
   * 执行多个动作
   */
  async executeAll(actions: Action[]): Promise<void> {
    for (const action of actions) {
      await this.execute(action);
    }
  }

  // ===== 原有动作实现 =====

  private executeGotoScene(sceneId: string, transition?: SceneTransition): void {
    this.callbacks.onSceneChange?.(sceneId, transition);
  }

  private executeSetVar(path: string, value: any): void {
    const resolvedValue = this.resolver.resolve(value);
    this.store.set(path, resolvedValue);
  }

  private executeIncVar(path: string, by: number): void {
    const currentValue = this.store.get(path) || 0;
    const newValue = Number(currentValue) + by;
    this.store.set(path, newValue);
  }

  private executeAddScore(value: number): void {
    const currentScore = this.store.get('globals.vars.score') || 0;
    this.store.set('globals.vars.score', currentScore + value);
  }

  private executeToast(action: any): void {
    const resolvedText = this.resolver.interpolate(action.text);
    this.callbacks.onUIAction?.({
      type: 'toast',
      text: resolvedText,
      duration: action.duration,
      position: action.position,
      variant: action.variant,
      icon: action.icon,
    });
  }

  private executeModal(action: any): void {
    const resolvedText = this.resolver.interpolate(action.text);
    this.callbacks.onUIAction?.({
      type: 'modal',
      text: resolvedText,
      title: action.title,
      buttons: action.buttons,
      style: action.style,
    });
  }

  private executeResetNode(nodeId: string): void {
    this.store.setNodeState(nodeId, {});
  }

  // ===== 新增动画动作实现 =====

  private executePlayAnimation(action: any): void {
    if (this.animationEngine) {
      this.animationEngine.playAnimation({
        nodeId: action.target,
        animation: action.animation,
        duration: action.duration,
        easing: action.easing,
        delay: action.delay,
        iterations: action.iterations,
      });
    }

    this.callbacks.onAnimationAction?.({
      type: 'play',
      target: action.target,
      animation: action.animation,
      duration: action.duration,
      easing: action.easing,
      delay: action.delay,
      iterations: action.iterations,
    });
  }

  private executeStopAnimation(target: string): void {
    if (this.animationEngine) {
      this.animationEngine.stopAnimationOnNode(target);
    }

    this.callbacks.onAnimationAction?.({
      type: 'stop',
      target,
    });
  }

  // ===== 新增样式动作实现 =====

  private executeSetStyle(action: any): void {
    this.callbacks.onStyleAction?.({
      type: 'setStyle',
      target: action.target,
      style: action.style,
      duration: action.duration,
      animate: action.animate,
    });
  }

  private executeAddClass(action: any): void {
    this.callbacks.onStyleAction?.({
      type: 'addClass',
      target: action.target,
      className: action.className,
      duration: action.duration,
    });
  }

  private executeRemoveClass(action: any): void {
    this.callbacks.onStyleAction?.({
      type: 'removeClass',
      target: action.target,
      className: action.className,
      duration: action.duration,
    });
  }

  private executeSetTheme(theme: BuiltinTheme | string, _duration?: number): void {
    if (this.themeProvider) {
      this.themeProvider.setTheme(theme as BuiltinTheme);
    }
  }

  private executeShowNode(action: any): void {
    // 更新节点可见性状态
    this.store.set(`nodes.${action.target}.visible`, true);

    this.callbacks.onStyleAction?.({
      type: 'show',
      target: action.target,
      animation: action.animation,
      duration: action.duration,
    });
  }

  private executeHideNode(action: any): void {
    // 更新节点可见性状态
    this.store.set(`nodes.${action.target}.visible`, false);

    this.callbacks.onStyleAction?.({
      type: 'hide',
      target: action.target,
      animation: action.animation,
      duration: action.duration,
    });
  }

  // ===== 流程控制动作实现 =====

  private async executeParallel(actions: Action[]): Promise<void> {
    await Promise.all(actions.map((action) => this.execute(action)));
  }

  private async executeSequence(actions: Action[]): Promise<void> {
    for (const action of actions) {
      await this.execute(action);
    }
  }

  private executeDelay(duration: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, duration));
  }

  // ===== 多媒体动作实现 =====

  private executeSound(action: any): void {
    this.callbacks.onSoundAction?.({
      type: 'sound',
      src: action.src,
      volume: action.volume,
      loop: action.loop,
    });
  }

  private executeHaptic(feedbackType: string): void {
    this.callbacks.onHapticAction?.({
      type: 'haptic',
      feedbackType: feedbackType as HapticAction['feedbackType'],
    });
  }
}
