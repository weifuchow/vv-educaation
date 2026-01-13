/**
 * Web Animation Registry
 * 浏览器环境动画注册表 - 管理所有标准动画模块
 */

import {
  AnimationModule,
  WebAnimationConfig,
  IAnimationRenderer,
} from './AnimationStandard';

/**
 * Web动画注册表
 */
export class WebAnimationRegistry {
  private modules: Map<string, AnimationModule>;

  constructor() {
    this.modules = new Map();
  }

  /**
   * 注册动画模块
   */
  register(module: AnimationModule): void {
    this.modules.set(module.metadata.id, module);
    console.log(
      `✓ Registered animation: ${module.metadata.id} - ${module.metadata.name}`
    );
  }

  /**
   * 批量注册动画模块
   */
  registerBatch(modules: AnimationModule[]): void {
    modules.forEach((module) => this.register(module));
  }

  /**
   * 创建动画实例
   */
  create(id: string, config: WebAnimationConfig): IAnimationRenderer | null {
    const module = this.modules.get(id);
    if (!module) {
      console.warn(`Animation module "${id}" not found`);
      return null;
    }
    return module.createRenderer(config);
  }

  /**
   * 获取HTML模板
   */
  getHtml(id: string): string {
    const module = this.modules.get(id);
    if (!module) {
      return `<div style="padding: 40px; text-align: center;">Animation "${id}" not found</div>`;
    }

    // Create temporary instance to get HTML
    const tempContainer = document.createElement('div');
    const renderer = module.createRenderer({ container: tempContainer });
    return renderer.getHtml();
  }

  /**
   * 获取动画模块
   */
  getModule(id: string): AnimationModule | undefined {
    return this.modules.get(id);
  }

  /**
   * 检查动画是否存在
   */
  has(id: string): boolean {
    return this.modules.has(id);
  }

  /**
   * 获取所有注册的动画ID
   */
  getIds(): string[] {
    return Array.from(this.modules.keys());
  }

  /**
   * 获取所有注册的动画模块
   */
  getModules(): AnimationModule[] {
    return Array.from(this.modules.values());
  }

  /**
   * 按分类获取动画
   */
  getByCategory(category: string): AnimationModule[] {
    return Array.from(this.modules.values()).filter(
      (module) => module.metadata.category === category
    );
  }

  /**
   * 搜索动画
   */
  search(query: string): AnimationModule[] {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.modules.values()).filter((module) => {
      return (
        module.metadata.name.toLowerCase().includes(lowerQuery) ||
        module.metadata.description.toLowerCase().includes(lowerQuery) ||
        module.metadata.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      );
    });
  }
}

// 全局注册表实例
export const webAnimationRegistry = new WebAnimationRegistry();
