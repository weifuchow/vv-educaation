/**
 * Entrance Animation Effects
 * 入场动画效果
 */

import type { EffectDefinition } from './types';

export const fadeIn: EffectDefinition = {
  id: 'common.fadeIn',
  name: '淡入',
  description: '元素从透明渐变为不透明',
  category: 'entrance',
  keyframes: [
    { offset: 0, properties: { opacity: 0 } },
    { offset: 100, properties: { opacity: 1 } },
  ],
  duration: 400,
  easing: 'ease-out',
  fillMode: 'forwards',
};

export const fadeInUp: EffectDefinition = {
  id: 'common.fadeInUp',
  name: '向上淡入',
  description: '元素从下方淡入',
  category: 'entrance',
  keyframes: [
    { offset: 0, properties: { opacity: 0, translateY: 20 } },
    { offset: 100, properties: { opacity: 1, translateY: 0 } },
  ],
  duration: 400,
  easing: 'ease-out',
  fillMode: 'forwards',
};

export const fadeInDown: EffectDefinition = {
  id: 'common.fadeInDown',
  name: '向下淡入',
  description: '元素从上方淡入',
  category: 'entrance',
  keyframes: [
    { offset: 0, properties: { opacity: 0, translateY: -20 } },
    { offset: 100, properties: { opacity: 1, translateY: 0 } },
  ],
  duration: 400,
  easing: 'ease-out',
  fillMode: 'forwards',
};

export const fadeInLeft: EffectDefinition = {
  id: 'common.fadeInLeft',
  name: '从左淡入',
  description: '元素从左侧淡入',
  category: 'entrance',
  keyframes: [
    { offset: 0, properties: { opacity: 0, translateX: -20 } },
    { offset: 100, properties: { opacity: 1, translateX: 0 } },
  ],
  duration: 400,
  easing: 'ease-out',
  fillMode: 'forwards',
};

export const fadeInRight: EffectDefinition = {
  id: 'common.fadeInRight',
  name: '从右淡入',
  description: '元素从右侧淡入',
  category: 'entrance',
  keyframes: [
    { offset: 0, properties: { opacity: 0, translateX: 20 } },
    { offset: 100, properties: { opacity: 1, translateX: 0 } },
  ],
  duration: 400,
  easing: 'ease-out',
  fillMode: 'forwards',
};

export const slideInLeft: EffectDefinition = {
  id: 'common.slideInLeft',
  name: '左侧滑入',
  description: '元素从左侧滑入',
  category: 'entrance',
  keyframes: [
    { offset: 0, properties: { opacity: 0, translateX: -50 } },
    { offset: 100, properties: { opacity: 1, translateX: 0 } },
  ],
  duration: 400,
  easing: 'ease-out',
  fillMode: 'forwards',
};

export const slideInRight: EffectDefinition = {
  id: 'common.slideInRight',
  name: '右侧滑入',
  description: '元素从右侧滑入',
  category: 'entrance',
  keyframes: [
    { offset: 0, properties: { opacity: 0, translateX: 50 } },
    { offset: 100, properties: { opacity: 1, translateX: 0 } },
  ],
  duration: 400,
  easing: 'ease-out',
  fillMode: 'forwards',
};

export const slideInUp: EffectDefinition = {
  id: 'common.slideInUp',
  name: '底部滑入',
  description: '元素从底部滑入',
  category: 'entrance',
  keyframes: [
    { offset: 0, properties: { opacity: 0, translateY: 50 } },
    { offset: 100, properties: { opacity: 1, translateY: 0 } },
  ],
  duration: 400,
  easing: 'ease-out',
  fillMode: 'forwards',
};

export const slideInDown: EffectDefinition = {
  id: 'common.slideInDown',
  name: '顶部滑入',
  description: '元素从顶部滑入',
  category: 'entrance',
  keyframes: [
    { offset: 0, properties: { opacity: 0, translateY: -50 } },
    { offset: 100, properties: { opacity: 1, translateY: 0 } },
  ],
  duration: 400,
  easing: 'ease-out',
  fillMode: 'forwards',
};

export const bounceIn: EffectDefinition = {
  id: 'common.bounceIn',
  name: '弹跳入场',
  description: '元素以弹跳效果入场',
  category: 'entrance',
  keyframes: [
    { offset: 0, properties: { scale: 0, opacity: 0 } },
    { offset: 60, properties: { scale: 1.15, opacity: 1 } },
    { offset: 80, properties: { scale: 0.9 } },
    { offset: 100, properties: { scale: 1 } },
  ],
  duration: 600,
  easing: 'ease-out',
  fillMode: 'forwards',
};

export const bounceInUp: EffectDefinition = {
  id: 'common.bounceInUp',
  name: '向上弹跳入场',
  description: '元素从底部弹跳入场',
  category: 'entrance',
  keyframes: [
    { offset: 0, properties: { translateY: 100, opacity: 0 } },
    { offset: 60, properties: { translateY: -20, opacity: 1 } },
    { offset: 80, properties: { translateY: 10 } },
    { offset: 100, properties: { translateY: 0 } },
  ],
  duration: 600,
  easing: 'ease-out',
  fillMode: 'forwards',
};

export const bounceInDown: EffectDefinition = {
  id: 'common.bounceInDown',
  name: '向下弹跳入场',
  description: '元素从顶部弹跳入场',
  category: 'entrance',
  keyframes: [
    { offset: 0, properties: { translateY: -100, opacity: 0 } },
    { offset: 60, properties: { translateY: 20, opacity: 1 } },
    { offset: 80, properties: { translateY: -10 } },
    { offset: 100, properties: { translateY: 0 } },
  ],
  duration: 600,
  easing: 'ease-out',
  fillMode: 'forwards',
};

export const zoomIn: EffectDefinition = {
  id: 'common.zoomIn',
  name: '缩放入场',
  description: '元素从小到大缩放入场',
  category: 'entrance',
  keyframes: [
    { offset: 0, properties: { scale: 0.5, opacity: 0 } },
    { offset: 100, properties: { scale: 1, opacity: 1 } },
  ],
  duration: 400,
  easing: 'ease-out',
  fillMode: 'forwards',
};

export const zoomInUp: EffectDefinition = {
  id: 'common.zoomInUp',
  name: '向上缩放入场',
  description: '元素从底部缩放入场',
  category: 'entrance',
  keyframes: [
    { offset: 0, properties: { scale: 0.5, translateY: 100, opacity: 0 } },
    { offset: 100, properties: { scale: 1, translateY: 0, opacity: 1 } },
  ],
  duration: 400,
  easing: 'ease-out',
  fillMode: 'forwards',
};

export const rotateIn: EffectDefinition = {
  id: 'common.rotateIn',
  name: '旋转入场',
  description: '元素旋转入场',
  category: 'entrance',
  keyframes: [
    { offset: 0, properties: { rotate: -180, opacity: 0 } },
    { offset: 100, properties: { rotate: 0, opacity: 1 } },
  ],
  duration: 500,
  easing: 'ease-out',
  fillMode: 'forwards',
};

export const flipInX: EffectDefinition = {
  id: 'common.flipInX',
  name: 'X轴翻转入场',
  description: '元素沿X轴翻转入场',
  category: 'entrance',
  keyframes: [
    { offset: 0, properties: { rotateX: 90, opacity: 0 } },
    { offset: 40, properties: { rotateX: -20 } },
    { offset: 60, properties: { rotateX: 10, opacity: 1 } },
    { offset: 80, properties: { rotateX: -5 } },
    { offset: 100, properties: { rotateX: 0 } },
  ],
  duration: 600,
  easing: 'ease-out',
  fillMode: 'forwards',
};

export const flipInY: EffectDefinition = {
  id: 'common.flipInY',
  name: 'Y轴翻转入场',
  description: '元素沿Y轴翻转入场',
  category: 'entrance',
  keyframes: [
    { offset: 0, properties: { rotateY: 90, opacity: 0 } },
    { offset: 40, properties: { rotateY: -20 } },
    { offset: 60, properties: { rotateY: 10, opacity: 1 } },
    { offset: 80, properties: { rotateY: -5 } },
    { offset: 100, properties: { rotateY: 0 } },
  ],
  duration: 600,
  easing: 'ease-out',
  fillMode: 'forwards',
};

// 导出所有入场动画
export const entranceEffects: EffectDefinition[] = [
  fadeIn,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  slideInLeft,
  slideInRight,
  slideInUp,
  slideInDown,
  bounceIn,
  bounceInUp,
  bounceInDown,
  zoomIn,
  zoomInUp,
  rotateIn,
  flipInX,
  flipInY,
];
