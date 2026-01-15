/**
 * Exit Animation Effects
 * 退场动画效果
 */

import type { EffectDefinition } from './types';

export const fadeOut: EffectDefinition = {
  id: 'common.fadeOut',
  name: '淡出',
  description: '元素从不透明渐变为透明',
  category: 'exit',
  keyframes: [
    { offset: 0, properties: { opacity: 1 } },
    { offset: 100, properties: { opacity: 0 } },
  ],
  duration: 400,
  easing: 'ease-out',
  fillMode: 'forwards',
};

export const fadeOutUp: EffectDefinition = {
  id: 'common.fadeOutUp',
  name: '向上淡出',
  description: '元素向上淡出',
  category: 'exit',
  keyframes: [
    { offset: 0, properties: { opacity: 1, translateY: 0 } },
    { offset: 100, properties: { opacity: 0, translateY: -20 } },
  ],
  duration: 400,
  easing: 'ease-in',
  fillMode: 'forwards',
};

export const fadeOutDown: EffectDefinition = {
  id: 'common.fadeOutDown',
  name: '向下淡出',
  description: '元素向下淡出',
  category: 'exit',
  keyframes: [
    { offset: 0, properties: { opacity: 1, translateY: 0 } },
    { offset: 100, properties: { opacity: 0, translateY: 20 } },
  ],
  duration: 400,
  easing: 'ease-in',
  fillMode: 'forwards',
};

export const fadeOutLeft: EffectDefinition = {
  id: 'common.fadeOutLeft',
  name: '向左淡出',
  description: '元素向左淡出',
  category: 'exit',
  keyframes: [
    { offset: 0, properties: { opacity: 1, translateX: 0 } },
    { offset: 100, properties: { opacity: 0, translateX: -20 } },
  ],
  duration: 400,
  easing: 'ease-in',
  fillMode: 'forwards',
};

export const fadeOutRight: EffectDefinition = {
  id: 'common.fadeOutRight',
  name: '向右淡出',
  description: '元素向右淡出',
  category: 'exit',
  keyframes: [
    { offset: 0, properties: { opacity: 1, translateX: 0 } },
    { offset: 100, properties: { opacity: 0, translateX: 20 } },
  ],
  duration: 400,
  easing: 'ease-in',
  fillMode: 'forwards',
};

export const slideOutLeft: EffectDefinition = {
  id: 'common.slideOutLeft',
  name: '左侧滑出',
  description: '元素从左侧滑出',
  category: 'exit',
  keyframes: [
    { offset: 0, properties: { opacity: 1, translateX: 0 } },
    { offset: 100, properties: { opacity: 0, translateX: -50 } },
  ],
  duration: 400,
  easing: 'ease-in',
  fillMode: 'forwards',
};

export const slideOutRight: EffectDefinition = {
  id: 'common.slideOutRight',
  name: '右侧滑出',
  description: '元素从右侧滑出',
  category: 'exit',
  keyframes: [
    { offset: 0, properties: { opacity: 1, translateX: 0 } },
    { offset: 100, properties: { opacity: 0, translateX: 50 } },
  ],
  duration: 400,
  easing: 'ease-in',
  fillMode: 'forwards',
};

export const slideOutUp: EffectDefinition = {
  id: 'common.slideOutUp',
  name: '顶部滑出',
  description: '元素从顶部滑出',
  category: 'exit',
  keyframes: [
    { offset: 0, properties: { opacity: 1, translateY: 0 } },
    { offset: 100, properties: { opacity: 0, translateY: -50 } },
  ],
  duration: 400,
  easing: 'ease-in',
  fillMode: 'forwards',
};

export const slideOutDown: EffectDefinition = {
  id: 'common.slideOutDown',
  name: '底部滑出',
  description: '元素从底部滑出',
  category: 'exit',
  keyframes: [
    { offset: 0, properties: { opacity: 1, translateY: 0 } },
    { offset: 100, properties: { opacity: 0, translateY: 50 } },
  ],
  duration: 400,
  easing: 'ease-in',
  fillMode: 'forwards',
};

export const bounceOut: EffectDefinition = {
  id: 'common.bounceOut',
  name: '弹跳退场',
  description: '元素以弹跳效果退场',
  category: 'exit',
  keyframes: [
    { offset: 0, properties: { scale: 1, opacity: 1 } },
    { offset: 20, properties: { scale: 0.9 } },
    { offset: 50, properties: { scale: 1.1, opacity: 1 } },
    { offset: 100, properties: { scale: 0, opacity: 0 } },
  ],
  duration: 600,
  easing: 'ease-in',
  fillMode: 'forwards',
};

export const zoomOut: EffectDefinition = {
  id: 'common.zoomOut',
  name: '缩放退场',
  description: '元素缩小退场',
  category: 'exit',
  keyframes: [
    { offset: 0, properties: { scale: 1, opacity: 1 } },
    { offset: 100, properties: { scale: 0.5, opacity: 0 } },
  ],
  duration: 400,
  easing: 'ease-in',
  fillMode: 'forwards',
};

export const zoomOutUp: EffectDefinition = {
  id: 'common.zoomOutUp',
  name: '向上缩放退场',
  description: '元素向上缩放退场',
  category: 'exit',
  keyframes: [
    { offset: 0, properties: { scale: 1, translateY: 0, opacity: 1 } },
    { offset: 100, properties: { scale: 0.5, translateY: -100, opacity: 0 } },
  ],
  duration: 400,
  easing: 'ease-in',
  fillMode: 'forwards',
};

export const rotateOut: EffectDefinition = {
  id: 'common.rotateOut',
  name: '旋转退场',
  description: '元素旋转退场',
  category: 'exit',
  keyframes: [
    { offset: 0, properties: { rotate: 0, opacity: 1 } },
    { offset: 100, properties: { rotate: 180, opacity: 0 } },
  ],
  duration: 500,
  easing: 'ease-in',
  fillMode: 'forwards',
};

export const flipOutX: EffectDefinition = {
  id: 'common.flipOutX',
  name: 'X轴翻转退场',
  description: '元素沿X轴翻转退场',
  category: 'exit',
  keyframes: [
    { offset: 0, properties: { rotateX: 0, opacity: 1 } },
    { offset: 30, properties: { rotateX: -20, opacity: 1 } },
    { offset: 100, properties: { rotateX: 90, opacity: 0 } },
  ],
  duration: 500,
  easing: 'ease-in',
  fillMode: 'forwards',
};

export const flipOutY: EffectDefinition = {
  id: 'common.flipOutY',
  name: 'Y轴翻转退场',
  description: '元素沿Y轴翻转退场',
  category: 'exit',
  keyframes: [
    { offset: 0, properties: { rotateY: 0, opacity: 1 } },
    { offset: 30, properties: { rotateY: -20, opacity: 1 } },
    { offset: 100, properties: { rotateY: 90, opacity: 0 } },
  ],
  duration: 500,
  easing: 'ease-in',
  fillMode: 'forwards',
};

// 导出所有退场动画
export const exitEffects: EffectDefinition[] = [
  fadeOut,
  fadeOutUp,
  fadeOutDown,
  fadeOutLeft,
  fadeOutRight,
  slideOutLeft,
  slideOutRight,
  slideOutUp,
  slideOutDown,
  bounceOut,
  zoomOut,
  zoomOutUp,
  rotateOut,
  flipOutX,
  flipOutY,
];
