/**
 * VVCE DSL TypeScript 类型定义
 *
 * v1.1 增强: 支持样式资源、主题系统、动画和过渡效果
 */

// ============ 课程结构 ============

export interface CourseDSL {
  schema: 'vvce.dsl.v1';
  meta: CourseMeta;
  globals?: CourseGlobals;
  resources?: CourseResources; // 样式资源定义
  theme?: ThemeConfig | string; // 主题配置或预设主题名
  startSceneId: string;
  scenes: SceneDSL[];
}

// ============ 资源定义 ============

export interface CourseResources {
  /** 样式变量定义 */
  variables?: StyleVariables;
  /** 自定义动画定义 */
  animations?: Record<string, AnimationDefinition>;
  /** 自定义过渡效果定义 */
  transitions?: Record<string, TransitionDefinition>;
  /** 样式类定义（可复用） */
  styles?: Record<string, StyleDefinition>;
  /** 资源引用（图片、字体等） */
  assets?: AssetDefinition[];
}

/** 样式变量 - 支持设计 Token */
export interface StyleVariables {
  /** 颜色变量 */
  colors?: Record<string, string>;
  /** 间距变量 */
  spacing?: Record<string, number | string>;
  /** 字体大小 */
  fontSizes?: Record<string, number | string>;
  /** 字体族 */
  fontFamilies?: Record<string, string>;
  /** 圆角 */
  radii?: Record<string, number | string>;
  /** 阴影 */
  shadows?: Record<string, string>;
  /** 自定义变量 */
  custom?: Record<string, any>;
}

/** 动画定义 */
export interface AnimationDefinition {
  /** 关键帧 */
  keyframes: AnimationKeyframe[];
  /** 持续时间(ms) */
  duration?: number;
  /** 缓动函数 */
  easing?: EasingFunction;
  /** 延迟(ms) */
  delay?: number;
  /** 重复次数，-1 为无限 */
  iterations?: number;
  /** 方向 */
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  /** 填充模式 */
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

export interface AnimationKeyframe {
  /** 帧位置 0-100 */
  offset: number;
  /** 样式属性 */
  properties: Record<string, any>;
}

/** 过渡效果定义 */
export interface TransitionDefinition {
  /** 过渡类型 */
  type: TransitionType;
  /** 持续时间(ms) */
  duration?: number;
  /** 缓动函数 */
  easing?: EasingFunction;
  /** 方向 */
  direction?: TransitionDirection;
  /** 自定义参数 */
  params?: Record<string, any>;
}

/** 内置过渡类型 */
export type TransitionType =
  | 'none'
  | 'fade'
  | 'slide'
  | 'scale'
  | 'flip'
  | 'rotate'
  | 'zoom'
  | 'bounce'
  | 'blur'
  | 'morph'
  | 'wipe'
  | 'reveal'
  | 'cube'
  | 'carousel'
  | 'stack'
  | 'shuffle'
  | 'custom';

/** 过渡方向 */
export type TransitionDirection = 'left' | 'right' | 'up' | 'down' | 'center' | 'random';

/** 缓动函数 */
export type EasingFunction =
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'spring'
  | 'bounce'
  | 'elastic'
  | `cubic-bezier(${number},${number},${number},${number})`;

/** 样式定义（可复用） */
export interface StyleDefinition {
  /** 基础样式 */
  base?: StyleProperties;
  /** 悬停状态 */
  hover?: StyleProperties;
  /** 激活状态 */
  active?: StyleProperties;
  /** 禁用状态 */
  disabled?: StyleProperties;
  /** 聚焦状态 */
  focus?: StyleProperties;
  /** 响应式样式 */
  responsive?: ResponsiveStyles;
}

/** 响应式断点样式 */
export interface ResponsiveStyles {
  sm?: StyleProperties;
  md?: StyleProperties;
  lg?: StyleProperties;
  xl?: StyleProperties;
}

/** 样式属性 */
export interface StyleProperties {
  // 布局
  width?: number | string;
  height?: number | string;
  minWidth?: number | string;
  maxWidth?: number | string;
  minHeight?: number | string;
  maxHeight?: number | string;
  padding?: number | string | number[];
  margin?: number | string | number[];

  // Flex
  flex?: number | string;
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  alignItems?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  gap?: number | string;

  // 定位
  position?: 'relative' | 'absolute' | 'fixed' | 'sticky';
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
  zIndex?: number;

  // 背景
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: 'cover' | 'contain' | string;
  backgroundPosition?: string;
  backgroundGradient?: GradientDefinition;

  // 边框
  borderWidth?: number | string;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'none';
  borderRadius?: number | string;

  // 阴影
  boxShadow?: string;
  textShadow?: string;

  // 文字
  color?: string;
  fontSize?: number | string;
  fontWeight?: number | string;
  fontFamily?: string;
  lineHeight?: number | string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  letterSpacing?: number | string;

  // 变换
  transform?: TransformProperties;
  transformOrigin?: string;

  // 透明度与可见性
  opacity?: number;
  visibility?: 'visible' | 'hidden';
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';

  // 过渡
  transition?: string | TransitionConfig;

  // 动画
  animation?: string | AnimationConfig;

  // 其他
  cursor?: string;
  pointerEvents?: 'auto' | 'none';
  userSelect?: 'auto' | 'none' | 'text' | 'all';
}

/** 渐变定义 */
export interface GradientDefinition {
  type: 'linear' | 'radial' | 'conic';
  angle?: number;
  colors: GradientStop[];
}

export interface GradientStop {
  color: string;
  position?: number;
}

/** 变换属性 */
export interface TransformProperties {
  translateX?: number | string;
  translateY?: number | string;
  translateZ?: number | string;
  rotate?: number | string;
  rotateX?: number | string;
  rotateY?: number | string;
  rotateZ?: number | string;
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  skewX?: number | string;
  skewY?: number | string;
  perspective?: number | string;
}

/** 过渡配置 */
export interface TransitionConfig {
  property?: string | string[];
  duration?: number;
  easing?: EasingFunction;
  delay?: number;
}

/** 动画配置 */
export interface AnimationConfig {
  name: string;
  duration?: number;
  easing?: EasingFunction;
  delay?: number;
  iterations?: number;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
  playState?: 'running' | 'paused';
}

/** 资源引用 */
export interface AssetDefinition {
  id: string;
  type: 'image' | 'font' | 'audio' | 'video' | 'lottie' | 'spine';
  url: string;
  preload?: boolean;
  fallback?: string;
}

// ============ 主题配置 ============

export interface ThemeConfig {
  /** 主题名称 */
  name?: string;
  /** 继承预设主题 */
  extends?: BuiltinTheme;
  /** 颜色模式 */
  mode?: 'light' | 'dark' | 'auto';
  /** 主题变量 */
  variables?: StyleVariables;
  /** 组件样式覆盖 */
  components?: Record<string, StyleDefinition>;
}

/** 内置主题 */
export type BuiltinTheme =
  | 'default'
  | 'playful' // 童趣风格
  | 'academic' // 学术风格
  | 'minimal' // 极简风格
  | 'vibrant' // 鲜艳活泼
  | 'dark' // 暗色主题
  | 'nature' // 自然风格
  | 'tech' // 科技风格
  | 'retro'; // 复古风格

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
  /** 场景样式 */
  style?: StyleProperties;
  /** 场景进入过渡效果 */
  enterTransition?: SceneTransition;
  /** 场景退出过渡效果 */
  exitTransition?: SceneTransition;
  /** 场景背景 */
  background?: BackgroundConfig;
  vars?: Record<string, any>;
  nodes?: NodeDSL[];
  triggers?: TriggerDSL[];
}

/** 场景过渡配置 */
export interface SceneTransition {
  /** 过渡类型 */
  type: TransitionType;
  /** 持续时间(ms) */
  duration?: number;
  /** 缓动函数 */
  easing?: EasingFunction;
  /** 方向 */
  direction?: TransitionDirection;
  /** 自定义过渡名（引用 resources.transitions） */
  custom?: string;
}

/** 背景配置 */
export interface BackgroundConfig {
  /** 背景颜色 */
  color?: string;
  /** 背景图片 */
  image?: string;
  /** 背景渐变 */
  gradient?: GradientDefinition;
  /** 视频背景 */
  video?: string;
  /** 背景尺寸 */
  size?: 'cover' | 'contain' | 'auto' | string;
  /** 背景位置 */
  position?: string;
  /** 背景模糊 */
  blur?: number;
  /** 背景叠加层 */
  overlay?: string;
  /** 视差效果 */
  parallax?: boolean;
}

export interface LayoutConfig {
  type: 'stack' | 'grid' | 'flex' | 'absolute' | 'masonry';
  padding?: number | string | number[];
  gap?: number | string;
  columns?: number;
  rows?: number;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  /** 反向排列 */
  reverse?: boolean;
  /** 换行 */
  wrap?: boolean;
}

// ============ 节点定义 ============

export interface NodeDSL {
  id: string;
  type: string;
  props?: Record<string, any>;
  /** 内联样式 */
  style?: StyleProperties;
  /** 引用样式类（在 resources.styles 中定义） */
  styleClass?: string | string[];
  /** 进入动画 */
  enterAnimation?: NodeAnimation;
  /** 退出动画 */
  exitAnimation?: NodeAnimation;
  /** 交互动画 */
  interactions?: NodeInteraction[];
  /** 条件显示 */
  visible?: boolean | ConditionDSL;
}

/** 节点动画 */
export interface NodeAnimation {
  /** 动画类型（内置动画名或自定义动画名） */
  type: BuiltinAnimation | string;
  /** 持续时间(ms) */
  duration?: number;
  /** 缓动函数 */
  easing?: EasingFunction;
  /** 延迟(ms) */
  delay?: number;
  /** 自定义参数 */
  params?: Record<string, any>;
}

/** 内置动画类型 */
export type BuiltinAnimation =
  | 'fadeIn'
  | 'fadeOut'
  | 'slideInLeft'
  | 'slideInRight'
  | 'slideInUp'
  | 'slideInDown'
  | 'slideOutLeft'
  | 'slideOutRight'
  | 'slideOutUp'
  | 'slideOutDown'
  | 'scaleIn'
  | 'scaleOut'
  | 'rotateIn'
  | 'rotateOut'
  | 'bounceIn'
  | 'bounceOut'
  | 'flipInX'
  | 'flipInY'
  | 'flipOutX'
  | 'flipOutY'
  | 'zoomIn'
  | 'zoomOut'
  | 'pulse'
  | 'shake'
  | 'wobble'
  | 'swing'
  | 'tada'
  | 'heartbeat'
  | 'rubber'
  | 'jello'
  | 'float'
  | 'glow';

/** 交互动画 */
export interface NodeInteraction {
  /** 触发条件 */
  trigger: 'hover' | 'click' | 'focus' | 'active' | 'visible';
  /** 动画类型 */
  animation?: BuiltinAnimation | string;
  /** 样式变化 */
  style?: StyleProperties;
  /** 持续时间 */
  duration?: number;
  /** 缓动函数 */
  easing?: EasingFunction;
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

export type ConditionDSL = ComparisonCondition | LogicalCondition;

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
  | ResetNodeAction
  // 新增: 样式和动画动作
  | PlayAnimationAction
  | StopAnimationAction
  | SetStyleAction
  | AddClassAction
  | RemoveClassAction
  | SetThemeAction
  | ShowNodeAction
  | HideNodeAction
  | ParallelAction
  | SequenceAction
  | DelayAction
  | SoundAction
  | HapticAction;

export interface GotoSceneAction {
  action: 'gotoScene';
  sceneId: string;
  /** 过渡效果覆盖 */
  transition?: SceneTransition;
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
  /** 持续时间(ms) */
  duration?: number;
  /** 位置 */
  position?: 'top' | 'center' | 'bottom';
  /** 样式变体 */
  variant?: 'info' | 'success' | 'warning' | 'error';
  /** 图标 */
  icon?: string;
}

export interface ModalAction {
  action: 'modal';
  text: string;
  /** 标题 */
  title?: string;
  /** 按钮 */
  buttons?: ModalButton[];
  /** 样式 */
  style?: StyleProperties;
  /** 进入动画 */
  enterAnimation?: NodeAnimation;
}

export interface ModalButton {
  text: string;
  variant?: 'primary' | 'secondary' | 'danger';
  /** 点击后执行的动作 */
  actions?: ActionDSL[];
}

export interface ResetNodeAction {
  action: 'resetNode';
  nodeId: string;
}

// ============ 新增动作类型 ============

/** 播放动画 */
export interface PlayAnimationAction {
  action: 'playAnimation';
  /** 目标节点ID */
  target: string;
  /** 动画类型 */
  animation: BuiltinAnimation | string;
  /** 持续时间(ms) */
  duration?: number;
  /** 缓动函数 */
  easing?: EasingFunction;
  /** 延迟(ms) */
  delay?: number;
  /** 重复次数 */
  iterations?: number;
}

/** 停止动画 */
export interface StopAnimationAction {
  action: 'stopAnimation';
  /** 目标节点ID */
  target: string;
}

/** 设置节点样式 */
export interface SetStyleAction {
  action: 'setStyle';
  /** 目标节点ID */
  target: string;
  /** 样式属性 */
  style: StyleProperties;
  /** 是否使用过渡动画 */
  animate?: boolean;
  /** 过渡持续时间 */
  duration?: number;
  /** 缓动函数 */
  easing?: EasingFunction;
}

/** 添加样式类 */
export interface AddClassAction {
  action: 'addClass';
  /** 目标节点ID */
  target: string;
  /** 样式类名 */
  className: string | string[];
  /** 过渡持续时间 */
  duration?: number;
}

/** 移除样式类 */
export interface RemoveClassAction {
  action: 'removeClass';
  /** 目标节点ID */
  target: string;
  /** 样式类名 */
  className: string | string[];
  /** 过渡持续时间 */
  duration?: number;
}

/** 切换主题 */
export interface SetThemeAction {
  action: 'setTheme';
  /** 主题名称 */
  theme: BuiltinTheme | string;
  /** 过渡持续时间 */
  duration?: number;
}

/** 显示节点 */
export interface ShowNodeAction {
  action: 'showNode';
  /** 目标节点ID */
  target: string;
  /** 显示动画 */
  animation?: BuiltinAnimation | string;
  /** 持续时间 */
  duration?: number;
}

/** 隐藏节点 */
export interface HideNodeAction {
  action: 'hideNode';
  /** 目标节点ID */
  target: string;
  /** 隐藏动画 */
  animation?: BuiltinAnimation | string;
  /** 持续时间 */
  duration?: number;
}

/** 并行执行多个动作 */
export interface ParallelAction {
  action: 'parallel';
  /** 同时执行的动作 */
  actions: ActionDSL[];
}

/** 顺序执行多个动作 */
export interface SequenceAction {
  action: 'sequence';
  /** 顺序执行的动作 */
  actions: ActionDSL[];
}

/** 延迟执行 */
export interface DelayAction {
  action: 'delay';
  /** 延迟时间(ms) */
  duration: number;
}

/** 播放音效 */
export interface SoundAction {
  action: 'sound';
  /** 音频资源ID或URL */
  src: string;
  /** 音量 0-1 */
  volume?: number;
  /** 是否循环 */
  loop?: boolean;
}

/** 触觉反馈（移动端） */
export interface HapticAction {
  action: 'haptic';
  /** 反馈类型 */
  type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';
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
  answerKey?: string; // M0 可包含答案，后续可移到后端
}

export interface ButtonProps {
  text: string;
  variant?: 'primary' | 'secondary' | 'text';
  disabled?: boolean;
}
