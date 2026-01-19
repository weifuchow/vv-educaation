/**
 * Interpolation Utilities
 * 插值和缓动函数工具
 */

/**
 * 线性插值
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * 反向线性插值（计算 t 值）
 */
export function inverseLerp(a, b, value) {
  if (a === b) return 0;
  return (value - a) / (b - a);
}

/**
 * 范围映射
 */
export function mapRange(value, inMin, inMax, outMin, outMax) {
  const t = inverseLerp(inMin, inMax, value);
  return lerp(outMin, outMax, t);
}

/**
 * 限制值在范围内
 */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * 平滑步进（Hermite 插值）
 */
export function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/**
 * 更平滑的步进（五次多项式）
 */
export function smootherstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * t * (t * (t * 6 - 15) + 10);
}

// ============= 缓动函数 (Easing Functions) =============

export const easing = {
  // 线性
  linear: (t) => t,

  // 二次
  easeInQuad: (t) => t * t,
  easeOutQuad: (t) => t * (2 - t),
  easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),

  // 三次
  easeInCubic: (t) => t * t * t,
  easeOutCubic: (t) => --t * t * t + 1,
  easeInOutCubic: (t) =>
    t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

  // 四次
  easeInQuart: (t) => t * t * t * t,
  easeOutQuart: (t) => 1 - --t * t * t * t,
  easeInOutQuart: (t) => (t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t),

  // 五次
  easeInQuint: (t) => t * t * t * t * t,
  easeOutQuint: (t) => 1 + --t * t * t * t * t,
  easeInOutQuint: (t) =>
    t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,

  // 正弦
  easeInSine: (t) => 1 - Math.cos((t * Math.PI) / 2),
  easeOutSine: (t) => Math.sin((t * Math.PI) / 2),
  easeInOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,

  // 指数
  easeInExpo: (t) => (t === 0 ? 0 : Math.pow(2, 10 * t - 10)),
  easeOutExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  easeInOutExpo: (t) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
    return (2 - Math.pow(2, -20 * t + 10)) / 2;
  },

  // 圆形
  easeInCirc: (t) => 1 - Math.sqrt(1 - t * t),
  easeOutCirc: (t) => Math.sqrt(1 - --t * t),
  easeInOutCirc: (t) =>
    t < 0.5
      ? (1 - Math.sqrt(1 - Math.pow(2 * t, 2))) / 2
      : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2,

  // 弹性
  easeInElastic: (t) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    return -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * ((2 * Math.PI) / 3));
  },
  easeOutElastic: (t) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    return Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1;
  },
  easeInOutElastic: (t) => {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (t < 0.5) {
      return (
        -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * ((2 * Math.PI) / 4.5))) /
        2
      );
    }
    return (
      (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * ((2 * Math.PI) / 4.5))) /
        2 +
      1
    );
  },

  // 回弹
  easeInBack: (t) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
  },
  easeOutBack: (t) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  easeInOutBack: (t) => {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;
    return t < 0.5
      ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
      : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
  },

  // 弹跳
  easeOutBounce: (t) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },
  easeInBounce: (t) => 1 - easing.easeOutBounce(1 - t),
  easeInOutBounce: (t) =>
    t < 0.5
      ? (1 - easing.easeOutBounce(1 - 2 * t)) / 2
      : (1 + easing.easeOutBounce(2 * t - 1)) / 2,
};

/**
 * 获取缓动函数
 */
export function getEasing(name) {
  return easing[name] || easing.linear;
}

/**
 * 创建贝塞尔缓动函数（CSS cubic-bezier 兼容）
 */
export function cubicBezier(x1, y1, x2, y2) {
  return function (t) {
    // 简化实现，使用数值方法
    const epsilon = 0.0001;
    let x = t;

    // Newton-Raphson 迭代求解 x(t)
    for (let i = 0; i < 8; i++) {
      const currentX = bezierX(x, x1, x2) - t;
      if (Math.abs(currentX) < epsilon) break;
      const derivative = bezierXDerivative(x, x1, x2);
      if (Math.abs(derivative) < epsilon) break;
      x -= currentX / derivative;
    }

    return bezierY(x, y1, y2);
  };

  function bezierX(t, x1, x2) {
    return 3 * x1 * t * (1 - t) * (1 - t) + 3 * x2 * t * t * (1 - t) + t * t * t;
  }

  function bezierY(t, y1, y2) {
    return 3 * y1 * t * (1 - t) * (1 - t) + 3 * y2 * t * t * (1 - t) + t * t * t;
  }

  function bezierXDerivative(t, x1, x2) {
    return (
      3 * x1 * (1 - t) * (1 - t) +
      6 * x2 * t * (1 - t) -
      3 * x1 * 2 * t * (1 - t) +
      3 * t * t
    );
  }
}

export default {
  lerp,
  inverseLerp,
  mapRange,
  clamp,
  smoothstep,
  smootherstep,
  easing,
  getEasing,
  cubicBezier,
};
