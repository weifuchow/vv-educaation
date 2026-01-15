/**
 * Math Animation Module
 * 数学动画模块
 *
 * 用于数学教学的交互式动画，如：
 * - 贝塞尔曲线（已实现）
 * - 几何图形变换
 * - 函数图像绘制
 * - 数列可视化
 * - 概率统计演示
 */

// 已实现的动画模块
export { bezierCurveModule } from './bezier-curve/index';

// 模块元数据
export const mathModuleInfo = {
  id: 'math',
  name: '数学动画',
  description: '用于数学教学的交互式动画库',
  version: '1.0.0',
  status: 'active',
  implementedAnimations: [
    {
      id: 'math.bezier-curve',
      name: '贝塞尔曲线',
      description: '交互式贝塞尔曲线演示',
    },
  ],
  plannedAnimations: [
    {
      id: 'math.geometry-transform',
      name: '几何变换',
      description: '平移、旋转、缩放、对称变换演示',
    },
    {
      id: 'math.function-graph',
      name: '函数图像',
      description: '一次函数、二次函数、三角函数图像绘制',
    },
    {
      id: 'math.pythagorean',
      name: '勾股定理',
      description: '勾股定理几何证明动画',
    },
    {
      id: 'math.fraction-visual',
      name: '分数可视化',
      description: '分数概念和运算可视化',
    },
    {
      id: 'math.number-line',
      name: '数轴演示',
      description: '数轴上的数字和运算',
    },
    {
      id: 'math.probability',
      name: '概率模拟',
      description: '掷骰子、抛硬币等概率实验',
    },
  ],
};

// 导出所有数学动画
import { bezierCurveModule } from './bezier-curve/index';

export const mathAnimations = [bezierCurveModule];
