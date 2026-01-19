/**
 * Vector Math Utilities
 * 2D/3D 向量数学工具
 */

/**
 * 2D 向量类
 */
export class Vec2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  static from(obj) {
    return new Vec2(obj.x, obj.y);
  }

  static fromAngle(angle, length = 1) {
    return new Vec2(Math.cos(angle) * length, Math.sin(angle) * length);
  }

  clone() {
    return new Vec2(this.x, this.y);
  }

  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  add(v) {
    return new Vec2(this.x + v.x, this.y + v.y);
  }

  sub(v) {
    return new Vec2(this.x - v.x, this.y - v.y);
  }

  mul(scalar) {
    return new Vec2(this.x * scalar, this.y * scalar);
  }

  div(scalar) {
    if (scalar === 0) return new Vec2(0, 0);
    return new Vec2(this.x / scalar, this.y / scalar);
  }

  dot(v) {
    return this.x * v.x + this.y * v.y;
  }

  cross(v) {
    return this.x * v.y - this.y * v.x;
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  lengthSq() {
    return this.x * this.x + this.y * this.y;
  }

  normalize() {
    const len = this.length();
    if (len === 0) return new Vec2(0, 0);
    return this.div(len);
  }

  angle() {
    return Math.atan2(this.y, this.x);
  }

  rotate(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vec2(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
  }

  perpendicular() {
    return new Vec2(-this.y, this.x);
  }

  lerp(v, t) {
    return new Vec2(this.x + (v.x - this.x) * t, this.y + (v.y - this.y) * t);
  }

  distanceTo(v) {
    return this.sub(v).length();
  }

  angleTo(v) {
    return Math.atan2(v.y - this.y, v.x - this.x);
  }

  reflect(normal) {
    const d = this.dot(normal) * 2;
    return this.sub(normal.mul(d));
  }

  toObject() {
    return { x: this.x, y: this.y };
  }

  toArray() {
    return [this.x, this.y];
  }

  toString() {
    return `Vec2(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`;
  }
}

// ============= 向量工具函数 =============

/**
 * 计算两点之间的距离
 */
export function distance(p1, p2) {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}

/**
 * 计算两点之间的角度
 */
export function angle(p1, p2) {
  return Math.atan2(p2.y - p1.y, p2.x - p1.x);
}

/**
 * 角度转弧度
 */
export function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

/**
 * 弧度转角度
 */
export function toDegrees(radians) {
  return (radians * 180) / Math.PI;
}

/**
 * 计算多边形的中心点
 */
export function centroid(points) {
  if (points.length === 0) return { x: 0, y: 0 };

  let sumX = 0;
  let sumY = 0;

  for (const p of points) {
    sumX += p.x;
    sumY += p.y;
  }

  return {
    x: sumX / points.length,
    y: sumY / points.length,
  };
}

/**
 * 计算包围盒
 */
export function boundingBox(points) {
  if (points.length === 0) {
    return { min: { x: 0, y: 0 }, max: { x: 0, y: 0 } };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const p of points) {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  }

  return {
    min: { x: minX, y: minY },
    max: { x: maxX, y: maxY },
    width: maxX - minX,
    height: maxY - minY,
    center: { x: (minX + maxX) / 2, y: (minY + maxY) / 2 },
  };
}

/**
 * 点是否在多边形内（射线法）
 */
export function pointInPolygon(point, polygon) {
  let inside = false;
  const n = polygon.length;

  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = polygon[i].x;
    const yi = polygon[i].y;
    const xj = polygon[j].x;
    const yj = polygon[j].y;

    if (yi > point.y !== yj > point.y && point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }

  return inside;
}

/**
 * 点到线段的最近点
 */
export function closestPointOnSegment(point, lineStart, lineEnd) {
  const line = Vec2.from(lineEnd).sub(Vec2.from(lineStart));
  const len = line.length();

  if (len === 0) return lineStart;

  const t = Math.max(0, Math.min(1, Vec2.from(point).sub(Vec2.from(lineStart)).dot(line) / (len * len)));

  return {
    x: lineStart.x + t * line.x,
    y: lineStart.y + t * line.y,
    t,
  };
}

export default {
  Vec2,
  distance,
  angle,
  toRadians,
  toDegrees,
  centroid,
  boundingBox,
  pointInPolygon,
  closestPointOnSegment,
};
