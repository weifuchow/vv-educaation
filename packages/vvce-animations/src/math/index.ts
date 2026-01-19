/**
 * Math Animation Module
 * 数学动画模块
 *
 * 包含数学相关的交互式动画：
 * - 贝塞尔曲线 (Bezier Curve)
 * - 更多待添加...
 */

export { BezierCurveModule } from './BezierCurve';

// 模块元数据
export const mathModuleInfo = {
  id: 'math',
  name: '数学动画',
  description: '数学相关的交互式可视化动画',
  version: '1.0.0',
  animations: ['math.bezier-curve'],
};
