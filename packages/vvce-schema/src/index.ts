/**
 * @vv-education/vvce-schema
 * VVCE DSL 定义和校验器
 *
 * v1.1 增强: 支持样式资源、主题系统、动画和过渡效果
 */

// ============ 核心类型 ============
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
} from './types/dsl';

// ============ 资源和样式类型 ============
export type {
  CourseResources,
  StyleVariables,
  AnimationDefinition,
  AnimationKeyframe,
  TransitionDefinition,
  TransitionType,
  TransitionDirection,
  EasingFunction,
  StyleDefinition,
  ResponsiveStyles,
  StyleProperties,
  GradientDefinition,
  GradientStop,
  TransformProperties,
  TransitionConfig,
  AnimationConfig,
  AssetDefinition,
} from './types/dsl';

// ============ 主题类型 ============
export type {
  ThemeConfig,
  BuiltinTheme,
} from './types/dsl';

// ============ 场景和节点扩展类型 ============
export type {
  SceneTransition,
  BackgroundConfig,
  NodeAnimation,
  BuiltinAnimation,
  NodeInteraction,
} from './types/dsl';

// ============ 动作类型 ============
export type {
  ActionDSL,
  GotoSceneAction,
  SetVarAction,
  IncVarAction,
  AddScoreAction,
  ToastAction,
  ModalAction,
  ModalButton,
  ResetNodeAction,
  // 样式和动画动作
  PlayAnimationAction,
  StopAnimationAction,
  SetStyleAction,
  AddClassAction,
  RemoveClassAction,
  SetThemeAction,
  ShowNodeAction,
  HideNodeAction,
  ParallelAction,
  SequenceAction,
  DelayAction,
  SoundAction,
  HapticAction,
} from './types/dsl';

// ============ 组件属性类型 ============
export type {
  DialogProps,
  QuizSingleProps,
  ButtonProps,
} from './types/dsl';

// ============ 校验器 ============
export { Validator, validateCourse } from './validator/Validator';
export type { ValidationResult, ValidationError } from './validator/Validator';
