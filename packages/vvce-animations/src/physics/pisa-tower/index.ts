/**
 * Pisa Tower Animation Module
 * 比萨斜塔自由落体实验动画模块
 *
 * 标准动画模块结构示例
 */

import {
  AnimationModuleBase,
  WebAnimationConfig,
  IAnimationRenderer,
} from '../../standards/AnimationStandard';
import { PisaTowerRenderer } from './renderer';
import { pisaTowerStyles } from './styles';

/**
 * 比萨斜塔动画模块
 */
class PisaTowerModule extends AnimationModuleBase {
  metadata = {
    id: 'physics.pisa-tower',
    category: 'physics' as const,
    name: '比萨斜塔实验',
    description: '伽利略的自由落体实验，验证不同质量的物体下落速度相同',
    tags: ['自由落体', '重力', '经典力学', '伽利略'],
    version: '1.0.0',
    author: 'VV Education',
  };

  assets = {
    styles: pisaTowerStyles,
    images: {},
    sounds: {},
    videos: {},
  };

  createRenderer(config: WebAnimationConfig): IAnimationRenderer {
    // 自动加载样式
    this.loadStyles();

    return new PisaTowerRenderer(config);
  }
}

// 导出模块实例
export const pisaTowerModule = new PisaTowerModule();

// 导出渲染器（用于直接使用）
export { PisaTowerRenderer } from './renderer';
