/**
 * @vv-education/vvce-core
 * VVCE 交互式课件场景渲染引擎 - 核心运行时
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
export type { ActionExecutorCallbacks } from './executor/ActionExecutor';

// 日志
export { Logger } from './logger/Logger';

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
