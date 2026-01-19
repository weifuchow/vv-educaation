/**
 * Common Animation Effects Types
 * 通用动画效果类型定义
 */

export interface KeyframeProperties {
  opacity?: number;
  translateX?: number;
  translateY?: number;
  translateZ?: number;
  scale?: number;
  scaleX?: number;
  scaleY?: number;
  rotate?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  skewX?: number;
  skewY?: number;
}

export interface AnimationKeyframe {
  offset: number; // 0-100
  properties: KeyframeProperties;
}

export type EasingFunction =
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'spring'
  | 'bounce'
  | 'elastic';

export type AnimationDirection = 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';

export type AnimationFillMode = 'none' | 'forwards' | 'backwards' | 'both';

export interface EffectDefinition {
  id: string;
  name: string;
  description: string;
  category: 'entrance' | 'emphasis' | 'exit' | 'special';
  keyframes: AnimationKeyframe[];
  duration: number;
  easing: EasingFunction;
  delay?: number;
  iterations?: number;
  direction?: AnimationDirection;
  fillMode?: AnimationFillMode;
}

export interface EffectOptions {
  duration?: number;
  delay?: number;
  easing?: EasingFunction;
  iterations?: number;
  onComplete?: () => void;
}
