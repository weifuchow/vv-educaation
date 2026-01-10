/**
 * 内置过渡效果预设
 * 提供场景切换的过渡效果配置
 */

import type { TransitionType, TransitionDefinition } from '@vv-education/vvce-schema';

/**
 * 内置过渡效果定义
 */
export const BUILTIN_TRANSITIONS: Record<TransitionType, TransitionDefinition> = {
  none: {
    type: 'none',
    duration: 0,
  },

  fade: {
    type: 'fade',
    duration: 300,
    easing: 'ease-out',
  },

  slide: {
    type: 'slide',
    duration: 400,
    easing: 'ease-out',
    direction: 'left',
  },

  scale: {
    type: 'scale',
    duration: 350,
    easing: 'ease-out',
  },

  flip: {
    type: 'flip',
    duration: 600,
    easing: 'ease-in-out',
    direction: 'left',
  },

  rotate: {
    type: 'rotate',
    duration: 500,
    easing: 'ease-in-out',
  },

  zoom: {
    type: 'zoom',
    duration: 400,
    easing: 'ease-out',
  },

  bounce: {
    type: 'bounce',
    duration: 500,
    easing: 'bounce',
  },

  blur: {
    type: 'blur',
    duration: 400,
    easing: 'ease-out',
  },

  morph: {
    type: 'morph',
    duration: 500,
    easing: 'ease-in-out',
  },

  wipe: {
    type: 'wipe',
    duration: 500,
    easing: 'ease-in-out',
    direction: 'right',
  },

  reveal: {
    type: 'reveal',
    duration: 600,
    easing: 'ease-out',
    direction: 'center',
  },

  cube: {
    type: 'cube',
    duration: 700,
    easing: 'ease-in-out',
    direction: 'left',
  },

  carousel: {
    type: 'carousel',
    duration: 600,
    easing: 'ease-out',
    direction: 'left',
  },

  stack: {
    type: 'stack',
    duration: 400,
    easing: 'ease-out',
    direction: 'up',
  },

  shuffle: {
    type: 'shuffle',
    duration: 500,
    easing: 'ease-in-out',
  },

  custom: {
    type: 'custom',
    duration: 300,
    easing: 'ease-out',
  },
};

/**
 * 过渡效果分类
 */
export const TRANSITION_CATEGORIES = {
  /** 基础过渡 */
  basic: ['none', 'fade', 'slide', 'scale'] as TransitionType[],
  /** 3D 过渡 */
  threed: ['flip', 'rotate', 'cube', 'carousel'] as TransitionType[],
  /** 特效过渡 */
  effects: ['blur', 'morph', 'wipe', 'reveal'] as TransitionType[],
  /** 动态过渡 */
  dynamic: ['bounce', 'stack', 'shuffle', 'zoom'] as TransitionType[],
};

/**
 * 获取过渡效果定义
 */
export function getTransitionDefinition(type: TransitionType): TransitionDefinition {
  return BUILTIN_TRANSITIONS[type] || BUILTIN_TRANSITIONS.fade;
}

/**
 * 获取所有过渡类型
 */
export function getTransitionTypes(): TransitionType[] {
  return Object.keys(BUILTIN_TRANSITIONS) as TransitionType[];
}

/**
 * 场景切换模式预设
 */
export const SCENE_TRANSITION_MODES = {
  /** 快速切换 - 无动画 */
  instant: {
    enterTransition: { type: 'none' as TransitionType, duration: 0 },
    exitTransition: { type: 'none' as TransitionType, duration: 0 },
  },

  /** 渐变切换 - 淡入淡出 */
  crossfade: {
    enterTransition: { type: 'fade' as TransitionType, duration: 300, easing: 'ease-out' as const },
    exitTransition: { type: 'fade' as TransitionType, duration: 300, easing: 'ease-in' as const },
  },

  /** 滑动切换 - 左右滑动 */
  slideHorizontal: {
    enterTransition: { type: 'slide' as TransitionType, direction: 'left' as const, duration: 400 },
    exitTransition: { type: 'slide' as TransitionType, direction: 'left' as const, duration: 400 },
  },

  /** 滑动切换 - 上下滑动 */
  slideVertical: {
    enterTransition: { type: 'slide' as TransitionType, direction: 'up' as const, duration: 400 },
    exitTransition: { type: 'slide' as TransitionType, direction: 'up' as const, duration: 400 },
  },

  /** 缩放切换 */
  zoomTransition: {
    enterTransition: { type: 'zoom' as TransitionType, duration: 400, easing: 'ease-out' as const },
    exitTransition: { type: 'zoom' as TransitionType, duration: 300, easing: 'ease-in' as const },
  },

  /** 翻页切换 */
  pageFlip: {
    enterTransition: { type: 'flip' as TransitionType, direction: 'left' as const, duration: 600 },
    exitTransition: { type: 'flip' as TransitionType, direction: 'left' as const, duration: 600 },
  },

  /** 3D 立方体 */
  cube3d: {
    enterTransition: { type: 'cube' as TransitionType, direction: 'left' as const, duration: 700 },
    exitTransition: { type: 'cube' as TransitionType, direction: 'left' as const, duration: 700 },
  },

  /** 旋转木马 */
  carousel: {
    enterTransition: { type: 'carousel' as TransitionType, direction: 'left' as const, duration: 600 },
    exitTransition: { type: 'carousel' as TransitionType, direction: 'left' as const, duration: 600 },
  },

  /** 堆叠卡片 */
  cardStack: {
    enterTransition: { type: 'stack' as TransitionType, direction: 'up' as const, duration: 400 },
    exitTransition: { type: 'scale' as TransitionType, duration: 300 },
  },

  /** 揭示效果 */
  circleReveal: {
    enterTransition: { type: 'reveal' as TransitionType, direction: 'center' as const, duration: 600 },
    exitTransition: { type: 'fade' as TransitionType, duration: 200 },
  },

  /** 擦除效果 */
  wipeRight: {
    enterTransition: { type: 'wipe' as TransitionType, direction: 'right' as const, duration: 500 },
    exitTransition: { type: 'wipe' as TransitionType, direction: 'left' as const, duration: 500 },
  },

  /** 弹跳效果 */
  bouncy: {
    enterTransition: { type: 'bounce' as TransitionType, duration: 600, easing: 'bounce' as const },
    exitTransition: { type: 'scale' as TransitionType, duration: 300 },
  },

  /** 模糊过渡 */
  blurFade: {
    enterTransition: { type: 'blur' as TransitionType, duration: 400, easing: 'ease-out' as const },
    exitTransition: { type: 'blur' as TransitionType, duration: 300, easing: 'ease-in' as const },
  },

  /** 洗牌效果 */
  shuffle: {
    enterTransition: { type: 'shuffle' as TransitionType, duration: 500 },
    exitTransition: { type: 'shuffle' as TransitionType, duration: 500 },
  },
};

export type SceneTransitionMode = keyof typeof SCENE_TRANSITION_MODES;

/**
 * 获取场景切换模式
 */
export function getSceneTransitionMode(mode: SceneTransitionMode) {
  return SCENE_TRANSITION_MODES[mode];
}

/**
 * 获取所有场景切换模式
 */
export function getSceneTransitionModes(): SceneTransitionMode[] {
  return Object.keys(SCENE_TRANSITION_MODES) as SceneTransitionMode[];
}
