/**
 * Bezier Math Utilities
 * 贝塞尔曲线数学计算工具
 */

/**
 * 计算二项式系数 C(n, k)
 */
export function binomial(n, k) {
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
 * @param {Array<{x: number, y: number}>} controlPoints - 控制点数组
 * @param {number} t - 参数 t (0-1)
 * @returns {{x: number, y: number}} 曲线上的点
 */
export function bezierPoint(controlPoints, t) {
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
 * 使用 de Casteljau 算法计算贝塞尔曲线上的点
 * 递归地在控制线段上取比例点
 *
 * @param {Array<{x: number, y: number}>} controlPoints - 控制点数组
 * @param {number} t - 参数 t (0-1)
 * @returns {{x: number, y: number}} 曲线上的点
 */
export function deCasteljau(controlPoints, t) {
  if (controlPoints.length === 1) {
    return controlPoints[0];
  }

  const newPoints = [];
  for (let i = 0; i < controlPoints.length - 1; i++) {
    newPoints.push(lerp2D(controlPoints[i], controlPoints[i + 1], t));
  }

  return deCasteljau(newPoints, t);
}

/**
 * 获取 de Casteljau 算法的所有中间层
 * 用于可视化构造过程
 *
 * @param {Array<{x: number, y: number}>} controlPoints - 控制点数组
 * @param {number} t - 参数 t (0-1)
 * @returns {Array<Array<{x: number, y: number}>>} 所有层级的点
 */
export function deCasteljauLevels(controlPoints, t) {
  const levels = [controlPoints];
  let currentLevel = controlPoints;

  while (currentLevel.length > 1) {
    const newLevel = [];
    for (let i = 0; i < currentLevel.length - 1; i++) {
      newLevel.push(lerp2D(currentLevel[i], currentLevel[i + 1], t));
    }
    levels.push(newLevel);
    currentLevel = newLevel;
  }

  return levels;
}

/**
 * 2D 线性插值
 */
export function lerp2D(p1, p2, t) {
  return {
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t,
  };
}

/**
 * 计算贝塞尔曲线的一阶导数（切向量）
 *
 * @param {Array<{x: number, y: number}>} controlPoints - 控制点数组
 * @param {number} t - 参数 t (0-1)
 * @returns {{x: number, y: number}} 切向量
 */
export function bezierDerivative(controlPoints, t) {
  const n = controlPoints.length - 1;
  if (n < 1) return { x: 0, y: 0 };

  // 导数控制点
  const derivativePoints = [];
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
 * @param {Array<{x: number, y: number}>} controlPoints - 控制点数组
 * @param {number} t - 参数 t (0-1)
 * @returns {{x: number, y: number}} 单位法向量
 */
export function bezierNormal(controlPoints, t) {
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
 * @param {Array<{x: number, y: number}>} controlPoints - 控制点数组
 * @param {number} steps - 积分步数
 * @returns {number} 弧长
 */
export function bezierArcLength(controlPoints, steps = 100) {
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
 * @param {Array<{x: number, y: number}>} controlPoints - 控制点数组
 * @param {{x: number, y: number}} target - 目标点
 * @param {number} samples - 采样数
 * @returns {{t: number, point: {x: number, y: number}, distance: number}}
 */
export function findClosestT(controlPoints, target, samples = 100) {
  let minDist = Infinity;
  let closestT = 0;
  let closestPoint = null;

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
 * @param {Array<{x: number, y: number}>} controlPoints - 控制点数组
 * @param {number} samples - 采样数
 * @returns {Array<{x: number, y: number, t: number}>}
 */
export function sampleBezier(controlPoints, samples = 100) {
  const points = [];

  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const point = bezierPoint(controlPoints, t);
    points.push({ ...point, t });
  }

  return points;
}

export default {
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
};
