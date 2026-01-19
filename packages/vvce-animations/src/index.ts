/**
 * VVCE Animation Library
 * 动画资源库入口
 *
 * 提供：
 * - 渲染基础设施（Canvas渲染器、坐标系、网格等）
 * - 图形基元（点、曲线）
 * - 数学工具（向量、贝塞尔、插值）
 * - 动画引擎和注册表
 */

// ============= 数学工具 =============
// Re-export with namespace to avoid conflicts
export * as MathUtils from './math';
export {
  Vec2,
  distance,
  angle,
  toRadians,
  toDegrees,
  centroid,
  boundingBox,
} from './math/vector';
export type { Point2D, BoundingBox } from './math/vector';
export {
  binomial,
  bezierPoint,
  deCasteljau,
  deCasteljauLevels,
  lerp2D,
  bezierDerivative,
  bezierNormal,
  bezierArcLength,
  findClosestT,
  sampleBezier,
} from './math/bezier';
export type { ClosestPointResult, SampledPoint } from './math/bezier';
export {
  lerp,
  inverseLerp,
  mapRange,
  clamp,
  smoothstep,
  smootherstep,
  easing,
  getEasing,
  cubicBezier,
} from './math/interpolation';
export type { EasingFunction } from './math/interpolation';

// ============= 渲染基础设施 =============
export * from './renderer';

// ============= 图形基元 =============
export * from './primitives';

// ============= 类型和标准定义 =============
export * from './types';
export * from './standards/AnimationStandard';
export { webAnimationRegistry } from './standards/WebAnimationRegistry';

// ============= 核心动画库 =============
export { AnimationBase } from './core/AnimationBase';
export { AnimationRegistry, animationRegistry } from './core/registry';

// ============= 通用动画效果 =============
export {
  allEffects,
  effectsRegistry,
  getEffect,
  getEffectsByCategory,
  hasEffect,
  listEffectIds,
} from './common';
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
