/**
 * Common Animation Effects
 * 通用动画效果入口
 */

// 类型导出
export * from './types';

// 入场动画
export * from './entrance';
export { entranceEffects } from './entrance';

// 强调动画
export * from './emphasis';
export { emphasisEffects } from './emphasis';

// 退场动画
export * from './exit';
export { exitEffects } from './exit';

// 导入所有效果
import { entranceEffects } from './entrance';
import { emphasisEffects } from './emphasis';
import { exitEffects } from './exit';
import type { EffectDefinition } from './types';

// 所有动画效果合集
export const allEffects: EffectDefinition[] = [
  ...entranceEffects,
  ...emphasisEffects,
  ...exitEffects,
];

// 动画效果注册表
export const effectsRegistry: Map<string, EffectDefinition> = new Map(
  allEffects.map((effect) => [effect.id, effect])
);

// 便捷函数
export function getEffect(id: string): EffectDefinition | undefined {
  return effectsRegistry.get(id);
}

export function getEffectsByCategory(
  category: 'entrance' | 'emphasis' | 'exit'
): EffectDefinition[] {
  return allEffects.filter((effect) => effect.category === category);
}

export function hasEffect(id: string): boolean {
  return effectsRegistry.has(id);
}

export function listEffectIds(): string[] {
  return Array.from(effectsRegistry.keys());
}
