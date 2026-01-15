/**
 * Emphasis Animation Effects
 * 强调动画效果
 */

import type { EffectDefinition } from './types';

export const pulse: EffectDefinition = {
  id: 'common.pulse',
  name: '脉冲',
  description: '元素脉冲式放大缩小，用于提示可点击',
  category: 'emphasis',
  keyframes: [
    { offset: 0, properties: { scale: 1 } },
    { offset: 50, properties: { scale: 1.08 } },
    { offset: 100, properties: { scale: 1 } },
  ],
  duration: 800,
  easing: 'ease-in-out',
  iterations: 3,
};

export const shake: EffectDefinition = {
  id: 'common.shake',
  name: '抖动',
  description: '元素左右抖动，用于错误反馈',
  category: 'emphasis',
  keyframes: [
    { offset: 0, properties: { translateX: 0 } },
    { offset: 20, properties: { translateX: -10 } },
    { offset: 40, properties: { translateX: 10 } },
    { offset: 60, properties: { translateX: -10 } },
    { offset: 80, properties: { translateX: 10 } },
    { offset: 100, properties: { translateX: 0 } },
  ],
  duration: 500,
  easing: 'ease-out',
};

export const shakeX: EffectDefinition = {
  id: 'common.shakeX',
  name: '水平抖动',
  description: '元素水平方向剧烈抖动',
  category: 'emphasis',
  keyframes: [
    { offset: 0, properties: { translateX: 0 } },
    { offset: 10, properties: { translateX: -15 } },
    { offset: 20, properties: { translateX: 15 } },
    { offset: 30, properties: { translateX: -15 } },
    { offset: 40, properties: { translateX: 15 } },
    { offset: 50, properties: { translateX: -10 } },
    { offset: 60, properties: { translateX: 10 } },
    { offset: 70, properties: { translateX: -5 } },
    { offset: 80, properties: { translateX: 5 } },
    { offset: 90, properties: { translateX: -2 } },
    { offset: 100, properties: { translateX: 0 } },
  ],
  duration: 600,
  easing: 'ease-out',
};

export const shakeY: EffectDefinition = {
  id: 'common.shakeY',
  name: '垂直抖动',
  description: '元素垂直方向抖动',
  category: 'emphasis',
  keyframes: [
    { offset: 0, properties: { translateY: 0 } },
    { offset: 20, properties: { translateY: -10 } },
    { offset: 40, properties: { translateY: 10 } },
    { offset: 60, properties: { translateY: -10 } },
    { offset: 80, properties: { translateY: 10 } },
    { offset: 100, properties: { translateY: 0 } },
  ],
  duration: 500,
  easing: 'ease-out',
};

export const bounce: EffectDefinition = {
  id: 'common.bounce',
  name: '弹跳',
  description: '元素上下弹跳，用于吸引注意',
  category: 'emphasis',
  keyframes: [
    { offset: 0, properties: { translateY: 0 } },
    { offset: 40, properties: { translateY: -25 } },
    { offset: 60, properties: { translateY: 0 } },
    { offset: 80, properties: { translateY: -15 } },
    { offset: 100, properties: { translateY: 0 } },
  ],
  duration: 600,
  easing: 'ease-out',
};

export const wobble: EffectDefinition = {
  id: 'common.wobble',
  name: '摇摆',
  description: '元素左右摇摆，趣味强调效果',
  category: 'emphasis',
  keyframes: [
    { offset: 0, properties: { translateX: 0, rotate: 0 } },
    { offset: 15, properties: { translateX: -15, rotate: -5 } },
    { offset: 30, properties: { translateX: 10, rotate: 3 } },
    { offset: 45, properties: { translateX: -10, rotate: -3 } },
    { offset: 60, properties: { translateX: 5, rotate: 2 } },
    { offset: 75, properties: { translateX: -5, rotate: -1 } },
    { offset: 100, properties: { translateX: 0, rotate: 0 } },
  ],
  duration: 800,
  easing: 'ease-out',
};

export const swing: EffectDefinition = {
  id: 'common.swing',
  name: '摆动',
  description: '元素像钟摆一样摆动',
  category: 'emphasis',
  keyframes: [
    { offset: 0, properties: { rotate: 0 } },
    { offset: 20, properties: { rotate: 15 } },
    { offset: 40, properties: { rotate: -10 } },
    { offset: 60, properties: { rotate: 5 } },
    { offset: 80, properties: { rotate: -5 } },
    { offset: 100, properties: { rotate: 0 } },
  ],
  duration: 800,
  easing: 'ease-out',
};

export const tada: EffectDefinition = {
  id: 'common.tada',
  name: '惊喜',
  description: '惊喜奖励效果，适合完成时使用',
  category: 'emphasis',
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
  duration: 1000,
  easing: 'ease-out',
};

export const heartbeat: EffectDefinition = {
  id: 'common.heartbeat',
  name: '心跳',
  description: '模拟心跳效果，用于重要提示',
  category: 'emphasis',
  keyframes: [
    { offset: 0, properties: { scale: 1 } },
    { offset: 14, properties: { scale: 1.3 } },
    { offset: 28, properties: { scale: 1 } },
    { offset: 42, properties: { scale: 1.3 } },
    { offset: 70, properties: { scale: 1 } },
    { offset: 100, properties: { scale: 1 } },
  ],
  duration: 1200,
  easing: 'ease-in-out',
};

export const celebrate: EffectDefinition = {
  id: 'common.celebrate',
  name: '庆祝',
  description: '庆祝效果，适合答对题目时使用',
  category: 'emphasis',
  keyframes: [
    { offset: 0, properties: { scale: 1, rotate: 0 } },
    { offset: 25, properties: { scale: 1.2, rotate: -10 } },
    { offset: 50, properties: { scale: 1.2, rotate: 10 } },
    { offset: 75, properties: { scale: 1.1, rotate: -5 } },
    { offset: 100, properties: { scale: 1, rotate: 0 } },
  ],
  duration: 800,
  easing: 'ease-out',
};

export const flash: EffectDefinition = {
  id: 'common.flash',
  name: '闪烁',
  description: '元素快速闪烁，用于警告提示',
  category: 'emphasis',
  keyframes: [
    { offset: 0, properties: { opacity: 1 } },
    { offset: 25, properties: { opacity: 0 } },
    { offset: 50, properties: { opacity: 1 } },
    { offset: 75, properties: { opacity: 0 } },
    { offset: 100, properties: { opacity: 1 } },
  ],
  duration: 600,
  easing: 'linear',
};

export const rubberBand: EffectDefinition = {
  id: 'common.rubberBand',
  name: '橡皮筋',
  description: '橡皮筋弹性效果',
  category: 'emphasis',
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
  easing: 'ease-out',
};

export const jello: EffectDefinition = {
  id: 'common.jello',
  name: '果冻',
  description: '果冻般的弹性扭曲效果',
  category: 'emphasis',
  keyframes: [
    { offset: 0, properties: { skewX: 0, skewY: 0 } },
    { offset: 22, properties: { skewX: -12.5, skewY: -12.5 } },
    { offset: 33, properties: { skewX: 6.25, skewY: 6.25 } },
    { offset: 44, properties: { skewX: -3.125, skewY: -3.125 } },
    { offset: 55, properties: { skewX: 1.5625, skewY: 1.5625 } },
    { offset: 66, properties: { skewX: -0.78125, skewY: -0.78125 } },
    { offset: 77, properties: { skewX: 0.39, skewY: 0.39 } },
    { offset: 88, properties: { skewX: -0.195, skewY: -0.195 } },
    { offset: 100, properties: { skewX: 0, skewY: 0 } },
  ],
  duration: 900,
  easing: 'ease-out',
};

export const headShake: EffectDefinition = {
  id: 'common.headShake',
  name: '摇头',
  description: '摇头否定效果',
  category: 'emphasis',
  keyframes: [
    { offset: 0, properties: { translateX: 0 } },
    { offset: 6.5, properties: { translateX: -6, rotate: -9 } },
    { offset: 18.5, properties: { translateX: 5, rotate: 7 } },
    { offset: 31.5, properties: { translateX: -3, rotate: -5 } },
    { offset: 43.5, properties: { translateX: 2, rotate: 3 } },
    { offset: 50, properties: { translateX: 0, rotate: 0 } },
    { offset: 100, properties: { translateX: 0, rotate: 0 } },
  ],
  duration: 800,
  easing: 'ease-in-out',
};

export const attention: EffectDefinition = {
  id: 'common.attention',
  name: '注意',
  description: '吸引注意力的脉冲效果',
  category: 'emphasis',
  keyframes: [
    { offset: 0, properties: { scale: 1, opacity: 1 } },
    { offset: 25, properties: { scale: 1.1, opacity: 0.8 } },
    { offset: 50, properties: { scale: 1, opacity: 1 } },
    { offset: 75, properties: { scale: 1.1, opacity: 0.8 } },
    { offset: 100, properties: { scale: 1, opacity: 1 } },
  ],
  duration: 1000,
  easing: 'ease-in-out',
  iterations: 2,
};

// 导出所有强调动画
export const emphasisEffects: EffectDefinition[] = [
  pulse,
  shake,
  shakeX,
  shakeY,
  bounce,
  wobble,
  swing,
  tada,
  heartbeat,
  celebrate,
  flash,
  rubberBand,
  jello,
  headShake,
  attention,
];
