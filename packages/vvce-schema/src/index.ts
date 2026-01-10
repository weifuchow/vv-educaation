/**
 * @vv-education/vvce-schema
 * VVCE DSL 定义和校验器
 */

// 类型定义
export type {
  CourseDSL,
  CourseMeta,
  CourseGlobals,
  SceneDSL,
  LayoutConfig,
  NodeDSL,
  TriggerDSL,
  EventMatcher,
  ConditionDSL,
  ComparisonCondition,
  LogicalCondition,
  ValueOrRef,
  RefExpression,
  ActionDSL,
  GotoSceneAction,
  SetVarAction,
  IncVarAction,
  AddScoreAction,
  ToastAction,
  ModalAction,
  ResetNodeAction,
  DialogProps,
  QuizSingleProps,
  ButtonProps,
} from './types/dsl';

// 校验器
export { Validator, validateCourse } from './validator/Validator';
export type { ValidationResult, ValidationError } from './validator/Validator';
