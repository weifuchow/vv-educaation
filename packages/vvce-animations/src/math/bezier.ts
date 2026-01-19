/**
 * Bezier Math Utilities
 * 贝塞尔曲线数学计算工具
 */

import type { Point2D } from './vector';

export interface ClosestPointResult {
  t: number;
  point: Point2D;
  distance: number;
}

export interface SampledPoint extends Point2D {
  t: number;
}

/**
 * 计算二项式系数 C(n, k)
 */
export function binomial(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;

  let result = 1;
  for (let i = 1; i <= k; i++) {
    result = (result * (n - i + 1)) / i;
  }
  return result;
}

/**
 * 计算贝塞尔曲线上的点 (Bernstein 多项式形式)
 * B(t) = Σ C(n,i) * (1-t)^(n-i) * t^i * P_i
 *
 * @param controlPoints - 控制点数组
 * @param t - 参数 t (0-1)
 * @returns 曲线上的点
 */
export function bezierPoint(controlPoints: Point2D[], t: number): Point2D {
  const n = controlPoints.length - 1;
  let x = 0;
  let y = 0;

  for (let i = 0; i <= n; i++) {
    const b = binomial(n, i) * Math.pow(1 - t, n - i) * Math.pow(t, i);
    x += b * controlPoints[i].x;
    y += b * controlPoints[i].y;
  }

  return { x, y };
}

/**
 * 2D 线性插值
 */
export function lerp2D(p1: Point2D, p2: Point2D, t: number): Point2D {
  return {
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t,
  };
}

/**
 * 使用 de Casteljau 算法计算贝塞尔曲线上的点
 * 递归地在控制线段上取比例点
 *
 * @param controlPoints - 控制点数组
 * @param t - 参数 t (0-1)
 * @returns 曲线上的点
 */
export function deCasteljau(controlPoints: Point2D[], t: number): Point2D {
  if (controlPoints.length === 1) {
    return controlPoints[0];
  }

  const newPoints: Point2D[] = [];
  for (let i = 0; i < controlPoints.length - 1; i++) {
    newPoints.push(lerp2D(controlPoints[i], controlPoints[i + 1], t));
  }

  return deCasteljau(newPoints, t);
}

/**
 * 获取 de Casteljau 算法的所有中间层
 * 用于可视化构造过程
 *
 * @param controlPoints - 控制点数组
 * @param t - 参数 t (0-1)
 * @returns 所有层级的点
 */
export function deCasteljauLevels(controlPoints: Point2D[], t: number): Point2D[][] {
  const levels: Point2D[][] = [controlPoints];
  let currentLevel = controlPoints;

  while (currentLevel.length > 1) {
    const newLevel: Point2D[] = [];
    for (let i = 0; i < currentLevel.length - 1; i++) {
      newLevel.push(lerp2D(currentLevel[i], currentLevel[i + 1], t));
    }
    levels.push(newLevel);
    currentLevel = newLevel;
  }

  return levels;
}

/**
 * 计算贝塞尔曲线的一阶导数（切向量）
 *
 * @param controlPoints - 控制点数组
 * @param t - 参数 t (0-1)
 * @returns 切向量
 */
export function bezierDerivative(controlPoints: Point2D[], t: number): Point2D {
  const n = controlPoints.length - 1;
  if (n < 1) return { x: 0, y: 0 };

  // 导数控制点
  const derivativePoints: Point2D[] = [];
  for (let i = 0; i < n; i++) {
    derivativePoints.push({
      x: n * (controlPoints[i + 1].x - controlPoints[i].x),
      y: n * (controlPoints[i + 1].y - controlPoints[i].y),
    });
  }

  return bezierPoint(derivativePoints, t);
}

/**
 * 计算曲线在某点的法向量
 *
 * @param controlPoints - 控制点数组
 * @param t - 参数 t (0-1)
 * @returns 单位法向量
 */
export function bezierNormal(controlPoints: Point2D[], t: number): Point2D {
  const derivative = bezierDerivative(controlPoints, t);
  const length = Math.sqrt(derivative.x ** 2 + derivative.y ** 2);

  if (length === 0) return { x: 0, y: 1 };

  // 法向量垂直于切向量
  return {
    x: -derivative.y / length,
    y: derivative.x / length,
  };
}

/**
 * 计算曲线的总弧长（数值积分）
 *
 * @param controlPoints - 控制点数组
 * @param steps - 积分步数
 * @returns 弧长
 */
export function bezierArcLength(controlPoints: Point2D[], steps = 100): number {
  let length = 0;
  let prevPoint = bezierPoint(controlPoints, 0);

  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const point = bezierPoint(controlPoints, t);
    length += Math.sqrt((point.x - prevPoint.x) ** 2 + (point.y - prevPoint.y) ** 2);
    prevPoint = point;
  }

  return length;
}

/**
 * 查找曲线上最近的 t 值
 *
 * @param controlPoints - 控制点数组
 * @param target - 目标点
 * @param samples - 采样数
 * @returns 最近点信息
 */
export function findClosestT(
  controlPoints: Point2D[],
  target: Point2D,
  samples = 100
): ClosestPointResult {
  let minDist = Infinity;
  let closestT = 0;
  let closestPoint: Point2D = { x: 0, y: 0 };

  // 粗搜索
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const point = bezierPoint(controlPoints, t);
    const dist = Math.sqrt((point.x - target.x) ** 2 + (point.y - target.y) ** 2);

    if (dist < minDist) {
      minDist = dist;
      closestT = t;
      closestPoint = point;
    }
  }

  // 精细搜索
  const refineSamples = 20;
  const range = 1 / samples;

  for (let i = -refineSamples; i <= refineSamples; i++) {
    const t = Math.max(0, Math.min(1, closestT + (i * range) / refineSamples));
    const point = bezierPoint(controlPoints, t);
    const dist = Math.sqrt((point.x - target.x) ** 2 + (point.y - target.y) ** 2);

    if (dist < minDist) {
      minDist = dist;
      closestT = t;
      closestPoint = point;
    }
  }

  return {
    t: closestT,
    point: closestPoint,
    distance: minDist,
  };
}

/**
 * 生成贝塞尔曲线的采样点数组
 *
 * @param controlPoints - 控制点数组
 * @param samples - 采样数
 * @returns 采样点数组
 */
export function sampleBezier(controlPoints: Point2D[], samples = 100): SampledPoint[] {
  const points: SampledPoint[] = [];

  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const point = bezierPoint(controlPoints, t);
    points.push({ ...point, t });
  }

  return points;
}
