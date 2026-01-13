/**
 * Earth System Animation Module
 * 地球公转自转系统动画模块
 *
 * 标准动画模块结构示例
 */

import {
  AnimationModuleBase,
  WebAnimationConfig,
  IAnimationRenderer,
} from '../../standards/AnimationStandard';
import { EarthSystemRenderer } from './renderer';
import { earthSystemStyles } from './styles';

/**
 * 地球系统动画模块
 */
class EarthSystemModule extends AnimationModuleBase {
  metadata = {
    id: 'geography.earth-system',
    category: 'geography' as const,
    name: '地球公转自转',
    description: '演示地球的自转和公转运动，理解昼夜交替和四季变化',
    tags: ['公转', '自转', '天文', '地球运动'],
    version: '1.0.0',
    author: 'VV Education',
  };

  assets = {
    styles: earthSystemStyles,
    images: {},
    sounds: {},
    videos: {},
  };

  createRenderer(config: WebAnimationConfig): IAnimationRenderer {
    // 自动加载样式
    this.loadStyles();

    return new EarthSystemRenderer(config);
  }
}

// 导出模块实例
export const earthSystemModule = new EarthSystemModule();

// 导出渲染器（用于直接使用）
export { EarthSystemRenderer } from './renderer';
