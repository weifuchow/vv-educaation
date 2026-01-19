/**
 * VVCE Animation Library
 * 动画资源库入口
 *
 * 注意：具体的动画定义已迁移到 animation-packs 目录下的 JSON 文件中
 * 本包仅保留核心基础设施和通用动画效果
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

// ============= 便捷函数 =============
import { webAnimationRegistry as registry } from './standards/WebAnimationRegistry';

/**
 * 获取动画模块
 */
export function getAnimationModule(id: string) {
  return registry.getModule(id);
}

/**
 * 搜索动画
 */
export function searchAnimations(query: string) {
  return registry.search(query);
}

/**
 * 按分类获取动画
 */
export function getAnimationsByCategory(category: string) {
  return registry.getByCategory(category);
}

/**
 * 获取所有动画
 */
export function getAllAnimations() {
  return registry.getModules();
}

/**
 * 检查动画是否存在
 */
export function hasAnimation(id: string) {
  return registry.has(id);
}
