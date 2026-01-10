/**
 * VVCE Core - 核心类型定义
 */

// ============ 事件类型 ============

export interface VVEvent {
  type: string;         // 事件类型：click, change, submit, sceneEnter, sceneExit 等
  target?: string;      // 目标节点 ID
  payload?: any;        // 事件载荷
  ts: number;           // 时间戳
}

export type EventListener = (event: VVEvent) => void;

// ============ 状态类型 ============

export interface RuntimeState {
  globals: {
    vars: Record<string, any>;
  };
  scene: {
    vars: Record<string, any>;
  };
  nodes: Record<string, NodeState>;
}

export interface NodeState {
  [key: string]: any;
}

// ============ 引用类型 ============

export interface RefExpression {
  ref: string;  // 如 "globals.vars.score" 或 "q1.state.selected"
}

export type ValueOrRef = any | RefExpression;

// ============ 条件类型 ============

export type ConditionOperator =
  | 'equals'
  | 'notEquals'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'and'
  | 'or'
  | 'not';

export interface Condition {
  op: ConditionOperator;
  left?: ValueOrRef;
  right?: ValueOrRef;
  conditions?: Condition[];  // 用于 and/or/not
}

// ============ 动作类型 ============

export type ActionType =
  | 'gotoScene'
  | 'setVar'
  | 'incVar'
  | 'addScore'
  | 'toast'
  | 'modal'
  | 'resetNode';

export interface Action {
  action: ActionType;
  [key: string]: any;
}

export interface GotoSceneAction extends Action {
  action: 'gotoScene';
  sceneId: string;
}

export interface SetVarAction extends Action {
  action: 'setVar';
  path: string;
  value: any;
}

export interface IncVarAction extends Action {
  action: 'incVar';
  path: string;
  by: number;
}

export interface AddScoreAction extends Action {
  action: 'addScore';
  value: number;
}

export interface ToastAction extends Action {
  action: 'toast';
  text: string;
}

export interface ModalAction extends Action {
  action: 'modal';
  text: string;
}

export interface ResetNodeAction extends Action {
  action: 'resetNode';
  nodeId: string;
}

// ============ 触发器类型 ============

export interface Trigger {
  on: {
    event: string;
    target?: string;
  };
  if?: Condition[];
  then: Action[];
  else?: Action[];
}

// ============ 日志类型 ============

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  type: 'event' | 'condition' | 'action' | 'state' | 'scene';
  message: string;
  data?: any;
  ts: number;
}

// ============ 运行时选项 ============

export interface RuntimeOptions {
  onSceneChange?: (sceneId: string) => void;
  onStateChange?: (state: RuntimeState) => void;
  onUIAction?: (action: ToastAction | ModalAction) => void;
  debug?: boolean;
}

export interface StartOptions {
  startSceneId?: string;
  initialState?: Partial<RuntimeState>;
}

// ============ 存储接口 ============

export interface IStore {
  get(path: string): any;
  set(path: string, value: any): void;
  getAll(): any;
  reset(): void;
}
