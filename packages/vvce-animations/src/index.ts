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

// 物理动画（核心定义）
export { pisaTowerAnimation } from './physics/pisa-tower';

// 地理动画（核心定义）
export { earthSystemAnimation } from './geography/earth-system';

// ============= Web标准动画模块 =============
export { pisaTowerModule } from './physics/pisa-tower/index';
export { earthSystemModule } from './geography/earth-system/index';

// ============= 自动注册 =============
import { webAnimationRegistry } from './standards/WebAnimationRegistry';
import { pisaTowerModule } from './physics/pisa-tower/index';
import { earthSystemModule } from './geography/earth-system/index';

// 自动注册所有Web动画模块
webAnimationRegistry.registerBatch([pisaTowerModule, earthSystemModule]);

// 核心动画库自动注册（用于非Web环境）
import { animationRegistry } from './core/registry';
import { pisaTowerAnimation } from './physics/pisa-tower';
import { earthSystemAnimation } from './geography/earth-system';

animationRegistry.registerBatch([pisaTowerAnimation, earthSystemAnimation]);

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
