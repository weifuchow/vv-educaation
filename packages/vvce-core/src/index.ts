/**
 * @vv-education/vvce-core
 * VVCE 交互式课件场景渲染引擎 - 核心运行时
 *
 * v1.1 增强: 支持样式系统、动画引擎、主题管理
 */

// 主运行时
export { VVCERuntime } from './runtime/Runtime';
export type { CourseDSL, SceneDSL } from './runtime/Runtime';

// 存储
export { Store } from './store/Store';

// 事件总线
export { EventBus } from './event-bus/EventBus';

// 解释器
export { ReferenceResolver } from './interpreter/ReferenceResolver';
export { ConditionEvaluator } from './interpreter/ConditionEvaluator';
export { TriggerInterpreter } from './interpreter/TriggerInterpreter';

// 执行器
export { ActionExecutor } from './executor/ActionExecutor';
export type {
  ActionExecutorCallbacks,
  ActionExecutorOptions,
  UIAction,
  ToastUIAction,
  ModalUIAction,
  AnimationAction,
  StyleAction,
  SoundAction,
  HapticAction,
} from './executor/ActionExecutor';

// 日志
export { Logger } from './logger/Logger';

// ============ 新增: 样式系统 ============
export { StyleManager, BREAKPOINTS } from './style/StyleManager';
export type { StyleManagerOptions, Breakpoint } from './style/StyleManager';

export { ThemeProvider } from './style/ThemeProvider';
export type { ThemeProviderOptions, ResolvedTheme } from './style/ThemeProvider';

// ============ 新增: 动画系统 ============
export { TransitionEngine } from './animation/TransitionEngine';
export type {
  TransitionState,
  TransitionOptions,
  TransitionResult,
  TransitionStyle,
} from './animation/TransitionEngine';

export { AnimationEngine } from './animation/AnimationEngine';
export type {
  AnimationState,
  AnimationInstance,
  PlayAnimationOptions,
} from './animation/AnimationEngine';

// ============ 新增: 预设资源 ============
export {
  // 主题预设
  BUILTIN_THEMES,
  getThemeList,
  getThemePreset,
  // 动画预设
  BUILTIN_ANIMATIONS,
  getAnimationList,
  getAnimationDefinition,
  ANIMATION_CATEGORIES,
  // 过渡预设
  BUILTIN_TRANSITIONS,
  TRANSITION_CATEGORIES,
  SCENE_TRANSITION_MODES,
  getTransitionDefinition,
  getTransitionTypes,
  getSceneTransitionMode,
  getSceneTransitionModes,
} from './presets';
export type { ThemePreset, SceneTransitionMode } from './presets';

// 类型
export type {
  VVEvent,
  EventListener,
  RuntimeState,
  NodeState,
  RefExpression,
  ValueOrRef,
  Condition,
  ConditionOperator,
  Action,
  ActionType,
  GotoSceneAction,
  SetVarAction,
  IncVarAction,
  AddScoreAction,
  ToastAction,
  ModalAction,
  ResetNodeAction,
  Trigger,
  LogEntry,
  LogLevel,
  RuntimeOptions,
  StartOptions,
  IStore,
} from './types';
