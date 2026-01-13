/**
 * Animation Registry - 动画注册表
 * 管理所有可用的动画资源
 */

import type { AnimationDefinition, AnimationLibraryEntry } from '../types';

export class AnimationRegistry {
  private static instance: AnimationRegistry;
  private animations: Map<string, AnimationLibraryEntry>;

  private constructor() {
    this.animations = new Map();
  }

  static getInstance(): AnimationRegistry {
    if (!AnimationRegistry.instance) {
      AnimationRegistry.instance = new AnimationRegistry();
    }
    return AnimationRegistry.instance;
  }

  /**
   * 注册动画
   */
  register(definition: AnimationDefinition): void {
    const { id } = definition.metadata;

    if (this.animations.has(id)) {
      console.warn(`Animation "${id}" is already registered. Overwriting.`);
    }

    this.animations.set(id, {
      definition,
      usageCount: 0,
      lastUsed: Date.now(),
    });
  }

  /**
   * 批量注册动画
   */
  registerBatch(definitions: AnimationDefinition[]): void {
    definitions.forEach((def) => this.register(def));
  }

  /**
   * 获取动画定义
   */
  get(id: string): AnimationDefinition | undefined {
    const entry = this.animations.get(id);

    if (entry) {
      // 更新使用统计
      entry.usageCount++;
      entry.lastUsed = Date.now();
      return entry.definition;
    }

    return undefined;
  }

  /**
   * 检查动画是否存在
   */
  has(id: string): boolean {
    return this.animations.has(id);
  }

  /**
   * 获取所有动画ID
   */
  getAllIds(): string[] {
    return Array.from(this.animations.keys());
  }

  /**
   * 按类别获取动画
   */
  getByCategory(category: string): AnimationDefinition[] {
    const results: AnimationDefinition[] = [];

    this.animations.forEach((entry) => {
      if (entry.definition.metadata.category === category) {
        results.push(entry.definition);
      }
    });

    return results;
  }

  /**
   * 搜索动画（按标签、名称、描述）
   */
  search(query: string): AnimationDefinition[] {
    const lowerQuery = query.toLowerCase();
    const results: AnimationDefinition[] = [];

    this.animations.forEach((entry) => {
      const { metadata } = entry.definition;
      const searchText = [metadata.name, metadata.description, ...metadata.tags]
        .join(' ')
        .toLowerCase();

      if (searchText.includes(lowerQuery)) {
        results.push(entry.definition);
      }
    });

    return results;
  }

  /**
   * 获取使用统计
   */
  getStats(id: string): Pick<AnimationLibraryEntry, 'usageCount' | 'lastUsed'> | null {
    const entry = this.animations.get(id);
    return entry
      ? {
          usageCount: entry.usageCount,
          lastUsed: entry.lastUsed,
        }
      : null;
  }

  /**
   * 获取热门动画
   */
  getPopular(limit: number = 10): AnimationDefinition[] {
    return Array.from(this.animations.values())
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit)
      .map((entry) => entry.definition);
  }

  /**
   * 获取最近使用的动画
   */
  getRecent(limit: number = 10): AnimationDefinition[] {
    return Array.from(this.animations.values())
      .sort((a, b) => b.lastUsed - a.lastUsed)
      .slice(0, limit)
      .map((entry) => entry.definition);
  }

  /**
   * 注销动画
   */
  unregister(id: string): boolean {
    return this.animations.delete(id);
  }

  /**
   * 清空所有动画
   */
  clear(): void {
    this.animations.clear();
  }

  /**
   * 导出注册表数据（用于分析）
   */
  export(): any {
    const data: any = {};

    this.animations.forEach((entry, id) => {
      data[id] = {
        metadata: entry.definition.metadata,
        usageCount: entry.usageCount,
        lastUsed: new Date(entry.lastUsed).toISOString(),
      };
    });

    return data;
  }
}

// 导出单例实例
export const animationRegistry = AnimationRegistry.getInstance();
