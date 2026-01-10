/**
 * 内置动画预设
 * 提供丰富的预设动画效果
 */

import type { AnimationDefinition, BuiltinAnimation } from '@vv-education/vvce-schema';

/**
 * 内置动画定义
 */
export const BUILTIN_ANIMATIONS: Record<BuiltinAnimation, AnimationDefinition> = {
  // ============ 淡入淡出 ============
  fadeIn: {
    keyframes: [
      { offset: 0, properties: { opacity: 0 } },
      { offset: 100, properties: { opacity: 1 } },
    ],
    duration: 300,
    easing: 'ease-out',
    fillMode: 'forwards',
  },

  fadeOut: {
    keyframes: [
      { offset: 0, properties: { opacity: 1 } },
      { offset: 100, properties: { opacity: 0 } },
    ],
    duration: 300,
    easing: 'ease-in',
    fillMode: 'forwards',
  },

  // ============ 滑入滑出 ============
  slideInLeft: {
    keyframes: [
      { offset: 0, properties: { translateX: -100, opacity: 0 } },
      { offset: 100, properties: { translateX: 0, opacity: 1 } },
    ],
    duration: 400,
    easing: 'ease-out',
    fillMode: 'forwards',
  },

  slideInRight: {
    keyframes: [
      { offset: 0, properties: { translateX: 100, opacity: 0 } },
      { offset: 100, properties: { translateX: 0, opacity: 1 } },
    ],
    duration: 400,
    easing: 'ease-out',
    fillMode: 'forwards',
  },

  slideInUp: {
    keyframes: [
      { offset: 0, properties: { translateY: 50, opacity: 0 } },
      { offset: 100, properties: { translateY: 0, opacity: 1 } },
    ],
    duration: 400,
    easing: 'ease-out',
    fillMode: 'forwards',
  },

  slideInDown: {
    keyframes: [
      { offset: 0, properties: { translateY: -50, opacity: 0 } },
      { offset: 100, properties: { translateY: 0, opacity: 1 } },
    ],
    duration: 400,
    easing: 'ease-out',
    fillMode: 'forwards',
  },

  slideOutLeft: {
    keyframes: [
      { offset: 0, properties: { translateX: 0, opacity: 1 } },
      { offset: 100, properties: { translateX: -100, opacity: 0 } },
    ],
    duration: 400,
    easing: 'ease-in',
    fillMode: 'forwards',
  },

  slideOutRight: {
    keyframes: [
      { offset: 0, properties: { translateX: 0, opacity: 1 } },
      { offset: 100, properties: { translateX: 100, opacity: 0 } },
    ],
    duration: 400,
    easing: 'ease-in',
    fillMode: 'forwards',
  },

  slideOutUp: {
    keyframes: [
      { offset: 0, properties: { translateY: 0, opacity: 1 } },
      { offset: 100, properties: { translateY: -50, opacity: 0 } },
    ],
    duration: 400,
    easing: 'ease-in',
    fillMode: 'forwards',
  },

  slideOutDown: {
    keyframes: [
      { offset: 0, properties: { translateY: 0, opacity: 1 } },
      { offset: 100, properties: { translateY: 50, opacity: 0 } },
    ],
    duration: 400,
    easing: 'ease-in',
    fillMode: 'forwards',
  },

  // ============ 缩放 ============
  scaleIn: {
    keyframes: [
      { offset: 0, properties: { scale: 0.5, opacity: 0 } },
      { offset: 100, properties: { scale: 1, opacity: 1 } },
    ],
    duration: 350,
    easing: 'spring',
    fillMode: 'forwards',
  },

  scaleOut: {
    keyframes: [
      { offset: 0, properties: { scale: 1, opacity: 1 } },
      { offset: 100, properties: { scale: 0.5, opacity: 0 } },
    ],
    duration: 300,
    easing: 'ease-in',
    fillMode: 'forwards',
  },

  // ============ 旋转 ============
  rotateIn: {
    keyframes: [
      { offset: 0, properties: { rotate: -180, opacity: 0, scale: 0.5 } },
      { offset: 100, properties: { rotate: 0, opacity: 1, scale: 1 } },
    ],
    duration: 500,
    easing: 'spring',
    fillMode: 'forwards',
  },

  rotateOut: {
    keyframes: [
      { offset: 0, properties: { rotate: 0, opacity: 1, scale: 1 } },
      { offset: 100, properties: { rotate: 180, opacity: 0, scale: 0.5 } },
    ],
    duration: 400,
    easing: 'ease-in',
    fillMode: 'forwards',
  },

  // ============ 弹跳 ============
  bounceIn: {
    keyframes: [
      { offset: 0, properties: { scale: 0.3, opacity: 0 } },
      { offset: 50, properties: { scale: 1.1, opacity: 0.8 } },
      { offset: 70, properties: { scale: 0.9, opacity: 0.9 } },
      { offset: 100, properties: { scale: 1, opacity: 1 } },
    ],
    duration: 600,
    easing: 'ease-out',
    fillMode: 'forwards',
  },

  bounceOut: {
    keyframes: [
      { offset: 0, properties: { scale: 1, opacity: 1 } },
      { offset: 20, properties: { scale: 0.9, opacity: 0.9 } },
      { offset: 50, properties: { scale: 1.1, opacity: 0.8 } },
      { offset: 100, properties: { scale: 0.3, opacity: 0 } },
    ],
    duration: 600,
    easing: 'ease-in',
    fillMode: 'forwards',
  },

  // ============ 翻转 ============
  flipInX: {
    keyframes: [
      { offset: 0, properties: { rotateX: 90, opacity: 0 } },
      { offset: 40, properties: { rotateX: -20, opacity: 0.6 } },
      { offset: 60, properties: { rotateX: 10, opacity: 0.8 } },
      { offset: 80, properties: { rotateX: -5, opacity: 0.9 } },
      { offset: 100, properties: { rotateX: 0, opacity: 1 } },
    ],
    duration: 600,
    easing: 'ease-out',
    fillMode: 'forwards',
  },

  flipInY: {
    keyframes: [
      { offset: 0, properties: { rotateY: 90, opacity: 0 } },
      { offset: 40, properties: { rotateY: -20, opacity: 0.6 } },
      { offset: 60, properties: { rotateY: 10, opacity: 0.8 } },
      { offset: 80, properties: { rotateY: -5, opacity: 0.9 } },
      { offset: 100, properties: { rotateY: 0, opacity: 1 } },
    ],
    duration: 600,
    easing: 'ease-out',
    fillMode: 'forwards',
  },

  flipOutX: {
    keyframes: [
      { offset: 0, properties: { rotateX: 0, opacity: 1 } },
      { offset: 30, properties: { rotateX: -20, opacity: 0.8 } },
      { offset: 100, properties: { rotateX: 90, opacity: 0 } },
    ],
    duration: 500,
    easing: 'ease-in',
    fillMode: 'forwards',
  },

  flipOutY: {
    keyframes: [
      { offset: 0, properties: { rotateY: 0, opacity: 1 } },
      { offset: 30, properties: { rotateY: -20, opacity: 0.8 } },
      { offset: 100, properties: { rotateY: 90, opacity: 0 } },
    ],
    duration: 500,
    easing: 'ease-in',
    fillMode: 'forwards',
  },

  // ============ 缩放进出 ============
  zoomIn: {
    keyframes: [
      { offset: 0, properties: { scale: 0, opacity: 0 } },
      { offset: 50, properties: { opacity: 0.5 } },
      { offset: 100, properties: { scale: 1, opacity: 1 } },
    ],
    duration: 400,
    easing: 'ease-out',
    fillMode: 'forwards',
  },

  zoomOut: {
    keyframes: [
      { offset: 0, properties: { scale: 1, opacity: 1 } },
      { offset: 50, properties: { scale: 0.5, opacity: 0.5 } },
      { offset: 100, properties: { scale: 0, opacity: 0 } },
    ],
    duration: 400,
    easing: 'ease-in',
    fillMode: 'forwards',
  },

  // ============ 注意力动画 ============
  pulse: {
    keyframes: [
      { offset: 0, properties: { scale: 1 } },
      { offset: 50, properties: { scale: 1.05 } },
      { offset: 100, properties: { scale: 1 } },
    ],
    duration: 500,
    easing: 'ease-in-out',
    iterations: -1,
  },

  shake: {
    keyframes: [
      { offset: 0, properties: { translateX: 0 } },
      { offset: 10, properties: { translateX: -10 } },
      { offset: 20, properties: { translateX: 10 } },
      { offset: 30, properties: { translateX: -10 } },
      { offset: 40, properties: { translateX: 10 } },
      { offset: 50, properties: { translateX: -10 } },
      { offset: 60, properties: { translateX: 10 } },
      { offset: 70, properties: { translateX: -10 } },
      { offset: 80, properties: { translateX: 10 } },
      { offset: 90, properties: { translateX: -10 } },
      { offset: 100, properties: { translateX: 0 } },
    ],
    duration: 500,
    easing: 'ease-in-out',
  },

  wobble: {
    keyframes: [
      { offset: 0, properties: { translateX: 0, rotate: 0 } },
      { offset: 15, properties: { translateX: -25, rotate: -5 } },
      { offset: 30, properties: { translateX: 20, rotate: 3 } },
      { offset: 45, properties: { translateX: -15, rotate: -3 } },
      { offset: 60, properties: { translateX: 10, rotate: 2 } },
      { offset: 75, properties: { translateX: -5, rotate: -1 } },
      { offset: 100, properties: { translateX: 0, rotate: 0 } },
    ],
    duration: 800,
    easing: 'ease-in-out',
  },

  swing: {
    keyframes: [
      { offset: 0, properties: { rotate: 0 } },
      { offset: 20, properties: { rotate: 15 } },
      { offset: 40, properties: { rotate: -10 } },
      { offset: 60, properties: { rotate: 5 } },
      { offset: 80, properties: { rotate: -5 } },
      { offset: 100, properties: { rotate: 0 } },
    ],
    duration: 600,
    easing: 'ease-in-out',
  },

  tada: {
    keyframes: [
      { offset: 0, properties: { scale: 1, rotate: 0 } },
      { offset: 10, properties: { scale: 0.9, rotate: -3 } },
      { offset: 20, properties: { scale: 0.9, rotate: -3 } },
      { offset: 30, properties: { scale: 1.1, rotate: 3 } },
      { offset: 40, properties: { scale: 1.1, rotate: -3 } },
      { offset: 50, properties: { scale: 1.1, rotate: 3 } },
      { offset: 60, properties: { scale: 1.1, rotate: -3 } },
      { offset: 70, properties: { scale: 1.1, rotate: 3 } },
      { offset: 80, properties: { scale: 1.1, rotate: -3 } },
      { offset: 90, properties: { scale: 1.1, rotate: 3 } },
      { offset: 100, properties: { scale: 1, rotate: 0 } },
    ],
    duration: 800,
    easing: 'ease-in-out',
  },

  heartbeat: {
    keyframes: [
      { offset: 0, properties: { scale: 1 } },
      { offset: 14, properties: { scale: 1.3 } },
      { offset: 28, properties: { scale: 1 } },
      { offset: 42, properties: { scale: 1.3 } },
      { offset: 70, properties: { scale: 1 } },
      { offset: 100, properties: { scale: 1 } },
    ],
    duration: 1000,
    easing: 'ease-in-out',
    iterations: -1,
  },

  rubber: {
    keyframes: [
      { offset: 0, properties: { scaleX: 1, scaleY: 1 } },
      { offset: 30, properties: { scaleX: 1.25, scaleY: 0.75 } },
      { offset: 40, properties: { scaleX: 0.75, scaleY: 1.25 } },
      { offset: 50, properties: { scaleX: 1.15, scaleY: 0.85 } },
      { offset: 65, properties: { scaleX: 0.95, scaleY: 1.05 } },
      { offset: 75, properties: { scaleX: 1.05, scaleY: 0.95 } },
      { offset: 100, properties: { scaleX: 1, scaleY: 1 } },
    ],
    duration: 800,
    easing: 'ease-in-out',
  },

  jello: {
    keyframes: [
      { offset: 0, properties: { skewX: 0, skewY: 0 } },
      { offset: 11, properties: { skewX: 0, skewY: 0 } },
      { offset: 22, properties: { skewX: -12.5, skewY: -12.5 } },
      { offset: 33, properties: { skewX: 6.25, skewY: 6.25 } },
      { offset: 44, properties: { skewX: -3.125, skewY: -3.125 } },
      { offset: 55, properties: { skewX: 1.5625, skewY: 1.5625 } },
      { offset: 66, properties: { skewX: -0.78125, skewY: -0.78125 } },
      { offset: 77, properties: { skewX: 0.390625, skewY: 0.390625 } },
      { offset: 88, properties: { skewX: -0.1953125, skewY: -0.1953125 } },
      { offset: 100, properties: { skewX: 0, skewY: 0 } },
    ],
    duration: 900,
    easing: 'ease-in-out',
  },

  // ============ 浮动和发光 ============
  float: {
    keyframes: [
      { offset: 0, properties: { translateY: 0 } },
      { offset: 50, properties: { translateY: -10 } },
      { offset: 100, properties: { translateY: 0 } },
    ],
    duration: 2000,
    easing: 'ease-in-out',
    iterations: -1,
  },

  glow: {
    keyframes: [
      { offset: 0, properties: { boxShadowBlur: 0, boxShadowSpread: 0 } },
      { offset: 50, properties: { boxShadowBlur: 20, boxShadowSpread: 5 } },
      { offset: 100, properties: { boxShadowBlur: 0, boxShadowSpread: 0 } },
    ],
    duration: 1500,
    easing: 'ease-in-out',
    iterations: -1,
  },
};

/**
 * 获取动画列表
 */
export function getAnimationList(): BuiltinAnimation[] {
  return Object.keys(BUILTIN_ANIMATIONS) as BuiltinAnimation[];
}

/**
 * 获取动画定义
 */
export function getAnimationDefinition(name: BuiltinAnimation): AnimationDefinition {
  return BUILTIN_ANIMATIONS[name];
}

/**
 * 动画分类
 */
export const ANIMATION_CATEGORIES = {
  entrance: ['fadeIn', 'slideInLeft', 'slideInRight', 'slideInUp', 'slideInDown', 'scaleIn', 'rotateIn', 'bounceIn', 'flipInX', 'flipInY', 'zoomIn'] as BuiltinAnimation[],
  exit: ['fadeOut', 'slideOutLeft', 'slideOutRight', 'slideOutUp', 'slideOutDown', 'scaleOut', 'rotateOut', 'bounceOut', 'flipOutX', 'flipOutY', 'zoomOut'] as BuiltinAnimation[],
  attention: ['pulse', 'shake', 'wobble', 'swing', 'tada', 'heartbeat', 'rubber', 'jello'] as BuiltinAnimation[],
  loop: ['float', 'glow', 'pulse', 'heartbeat'] as BuiltinAnimation[],
};
