/**
 * VVCE Animation Library
 * 动画资源库入口
 */

// 类型导出
export * from './types';

// 核心导出
export { AnimationBase } from './core/AnimationBase';
export { AnimationRegistry, animationRegistry } from './core/registry';

// 物理动画
export { pisaTowerAnimation } from './physics/pisa-tower';

// 地理动画
export { earthSystemAnimation } from './geography/earth-system';

// 自动注册所有预设动画
import { animationRegistry } from './core/registry';
import { pisaTowerAnimation } from './physics/pisa-tower';
import { earthSystemAnimation } from './geography/earth-system';

animationRegistry.registerBatch([pisaTowerAnimation, earthSystemAnimation]);

// 辅助函数：获取动画
export function getAnimation(id: string) {
  return animationRegistry.get(id);
}

// 辅助函数：搜索动画
export function searchAnimations(query: string) {
  return animationRegistry.search(query);
}

// 辅助函数：获取分类动画
export function getAnimationsByCategory(category: string) {
  return animationRegistry.getByCategory(category);
}
