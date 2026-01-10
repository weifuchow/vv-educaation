/**
 * VVCE DSL TypeScript 类型定义
 */

// ============ 课程结构 ============

export interface CourseDSL {
  schema: 'vvce.dsl.v1';
  meta: CourseMeta;
  globals?: CourseGlobals;
  startSceneId: string;
  scenes: SceneDSL[];
}

export interface CourseMeta {
  id: string;
  version: string;
  title?: string;
  description?: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseGlobals {
  vars?: Record<string, any>;
}

// ============ 场景结构 ============

export interface SceneDSL {
  id: string;
  title?: string;
  layout?: LayoutConfig;
  vars?: Record<string, any>;
  nodes?: NodeDSL[];
  triggers?: TriggerDSL[];
}

export interface LayoutConfig {
  type: 'stack' | 'grid' | 'flex';
  padding?: number;
  gap?: number;
  columns?: number;
  align?: 'start' | 'center' | 'end';
  justify?: 'start' | 'center' | 'end' | 'between';
}

// ============ 节点定义 ============

export interface NodeDSL {
  id: string;
  type: string;
  props?: Record<string, any>;
  style?: Record<string, any>;
}

// ============ 触发器定义 ============

export interface TriggerDSL {
  on: EventMatcher;
  if?: ConditionDSL[];
  then: ActionDSL[];
  else?: ActionDSL[];
}

export interface EventMatcher {
  event: string;
  target?: string;
}

// ============ 条件定义 ============

export type ConditionDSL =
  | ComparisonCondition
  | LogicalCondition;

export interface ComparisonCondition {
  op: 'equals' | 'notEquals' | 'gt' | 'gte' | 'lt' | 'lte';
  left: ValueOrRef;
  right: ValueOrRef;
}

export interface LogicalCondition {
  op: 'and' | 'or' | 'not';
  conditions: ConditionDSL[];
}

export type ValueOrRef = any | RefExpression;

export interface RefExpression {
  ref: string;
}

// ============ 动作定义 ============

export type ActionDSL =
  | GotoSceneAction
  | SetVarAction
  | IncVarAction
  | AddScoreAction
  | ToastAction
  | ModalAction
  | ResetNodeAction;

export interface GotoSceneAction {
  action: 'gotoScene';
  sceneId: string;
}

export interface SetVarAction {
  action: 'setVar';
  path: string;
  value: any;
}

export interface IncVarAction {
  action: 'incVar';
  path: string;
  by?: number;
}

export interface AddScoreAction {
  action: 'addScore';
  value: number;
}

export interface ToastAction {
  action: 'toast';
  text: string;
}

export interface ModalAction {
  action: 'modal';
  text: string;
}

export interface ResetNodeAction {
  action: 'resetNode';
  nodeId: string;
}

// ============ 组件属性定义（M0 基础组件） ============

export interface DialogProps {
  text: string;
  avatar?: string;
  speaker?: string;
}

export interface QuizSingleProps {
  question: string;
  options: string[];
  answerKey?: string;  // M0 可包含答案，后续可移到后端
}

export interface ButtonProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'text';
  disabled?: boolean;
}
