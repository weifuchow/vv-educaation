/**
 * VVCE Animation Library
 * 动画资源库入口
 */

// ============= 类型和标准定义 =============
export * from './types';
export * from './standards/AnimationStandard';
export { webAnimationRegistry } from './standards/WebAnimationRegistry';

// ============= 核心动画库（非Web） =============
export { AnimationBase } from './core/AnimationBase';
export { AnimationRegistry, animationRegistry } from './core/registry';

// ============= 通用动画效果 =============
export * from './common';
export { commonModuleInfo } from './common';

// ============= 学科动画模块 =============
// 物理
export { pisaTowerModule } from './physics/pisa-tower/index';
// 地理
export { earthSystemModule } from './geography/earth-system/index';
// 数学
export { bezierCurveModule } from './math/bezier-curve/index';
export { mathModuleInfo, mathAnimations } from './math/index';

// ============= 自动注册 =============
import { webAnimationRegistry } from './standards/WebAnimationRegistry';
import { pisaTowerModule } from './physics/pisa-tower/index';
import { earthSystemModule } from './geography/earth-system/index';
import { bezierCurveModule } from './math/bezier-curve/index';

// 自动注册所有Web动画模块
webAnimationRegistry.registerBatch([
  pisaTowerModule,
  earthSystemModule,
  bezierCurveModule,
]);

// ============= 便捷函数 =============

/**
 * 获取动画模块
 */
export function getAnimationModule(id: string) {
  return webAnimationRegistry.getModule(id);
}

/**
 * 搜索动画
 */
export function searchAnimations(query: string) {
  return webAnimationRegistry.search(query);
}

/**
 * 按分类获取动画
 */
export function getAnimationsByCategory(category: string) {
  return webAnimationRegistry.getByCategory(category);
}

/**
 * 获取所有动画
 */
export function getAllAnimations() {
  return webAnimationRegistry.getModules();
}

/**
 * 检查动画是否存在
 */
export function hasAnimation(id: string) {
  return webAnimationRegistry.has(id);
}
