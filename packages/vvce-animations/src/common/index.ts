/**
 * Common Animation Module
 * 通用动画模块
 *
 * 包含各种可复用的 UI 动画效果：
 * - 入场动画 (entrance): fadeIn, slideIn, bounceIn, zoomIn, rotateIn, flipIn 等
 * - 强调动画 (emphasis): pulse, shake, bounce, wobble, tada, heartbeat, celebrate 等
 * - 退场动画 (exit): fadeOut, slideOut, bounceOut, zoomOut, rotateOut, flipOut 等
 */

export * from './effects';

// 模块元数据
export const commonModuleInfo = {
  id: 'common',
  name: '通用动画效果',
  description: '可复用的 UI 动画效果库，包含入场、强调、退场三类动画',
  version: '1.0.0',
  categories: ['entrance', 'emphasis', 'exit'],
  effectCount: {
    entrance: 17,
    emphasis: 15,
    exit: 15,
    total: 47,
  },
};
