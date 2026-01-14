/**
 * Bezier Curve Animation Module
 * 贝塞尔曲线动画模块
 *
 * 提供线性、二次、三次贝塞尔曲线的可视化教学动画
 * 展示De Casteljau递归分割算法的生成过程
 */

import type { AnimationMetadata } from '../../types';
import type {
  AnimationModule,
  AnimationAssets,
  WebAnimationConfig,
  IAnimationRenderer,
} from '../../standards/AnimationStandard';
import { BezierCurveRenderer } from './renderer';
import { bezierCurveStyles } from './styles';

/**
 * 动画元数据
 */
export const metadata: AnimationMetadata = {
  id: 'math.bezier-curve',
  category: 'math',
  name: '贝塞尔曲线生成',
  description:
    '可视化展示贝塞尔曲线的生成过程，包括线性、二次、三次贝塞尔曲线，以及De Casteljau算法的递归分割原理',
  author: 'VV Education',
  version: '1.0.0',
  tags: [
    '贝塞尔曲线',
    'Bezier Curve',
    'De Casteljau',
    '计算机图形学',
    '数学可视化',
    'CSS动画',
    '参数曲线',
  ],
  thumbnail: 'bezier-curve-thumbnail.png',
};

/**
 * 动画资源
 */
export const assets: AnimationAssets = {
  styles: bezierCurveStyles,
};

/**
 * 创建渲染器实例
 */
export function createRenderer(config: WebAnimationConfig): IAnimationRenderer {
  return new BezierCurveRenderer(config);
}

/**
 * 加载样式
 */
export function loadStyles(): void {
  const styleId = `vvce-animation-${metadata.id}`;
  if (document.getElementById(styleId)) return;

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = bezierCurveStyles;
  document.head.appendChild(style);
}

/**
 * 贝塞尔曲线动画模块
 */
export const bezierCurveModule: AnimationModule = {
  metadata,
  assets,
  createRenderer,
  loadStyles,
};

// 默认导出
export default bezierCurveModule;

// 导出渲染器类（便于扩展）
export { BezierCurveRenderer } from './renderer';
export type { BezierCurveConfig } from './renderer';
