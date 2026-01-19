/**
 * Curve - 曲线绘制工具
 * 支持多种曲线类型：直线、贝塞尔、样条、函数曲线等
 */

import type { Point2D } from '../math/vector';

export interface CurveOptions {
  color?: string;
  width?: number;
  lineCap?: CanvasLineCap;
  lineJoin?: CanvasLineJoin;
  dash?: number[];
  glow?: boolean;
  glowColor?: string | null;
  glowBlur?: number;
}

export class Curve {
  private ctx: CanvasRenderingContext2D;
  private options: Required<CurveOptions>;

  constructor(ctx: CanvasRenderingContext2D, options: CurveOptions = {}) {
    this.ctx = ctx;
    this.options = {
      color: '#4ecdc4',
      width: 3,
      lineCap: 'round',
      lineJoin: 'round',
      dash: [],
      glow: false,
      glowColor: null,
      glowBlur: 10,
      ...options,
    };
  }

  /**
   * 设置样式
   */
  setStyle(options: Partial<CurveOptions>): void {
    Object.assign(this.options, options);
  }

  /**
   * 开始绘制路径
   */
  beginPath(): void {
    const ctx = this.ctx;
    const { color, width, lineCap, lineJoin, dash, glow, glowColor, glowBlur } =
      this.options;

    ctx.save();

    // 发光效果
    if (glow) {
      ctx.shadowColor = glowColor || color;
      ctx.shadowBlur = glowBlur;
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = lineCap;
    ctx.lineJoin = lineJoin;

    if (dash.length > 0) {
      ctx.setLineDash(dash);
    }

    ctx.beginPath();
  }

  /**
   * 结束绘制路径
   */
  stroke(): void {
    this.ctx.stroke();
    this.ctx.restore();
  }

  /**
   * 绘制直线
   */
  drawLine(x1: number, y1: number, x2: number, y2: number): void {
    this.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.stroke();
  }

  /**
   * 绘制折线
   */
  drawPolyline(points: Point2D[]): void {
    if (points.length < 2) return;

    this.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);

    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }

    this.stroke();
  }

  /**
   * 绘制参数化曲线
   * @param paramFn - 参数方程 (t) => {x, y}
   * @param tStart - 起始参数值
   * @param tEnd - 结束参数值
   * @param steps - 采样点数
   */
  drawParametric(
    paramFn: (t: number) => Point2D,
    tStart = 0,
    tEnd = 1,
    steps = 100
  ): void {
    this.beginPath();

    const dt = (tEnd - tStart) / steps;
    const startPoint = paramFn(tStart);
    this.ctx.moveTo(startPoint.x, startPoint.y);

    for (let i = 1; i <= steps; i++) {
      const t = tStart + i * dt;
      const point = paramFn(t);
      this.ctx.lineTo(point.x, point.y);
    }

    this.stroke();
  }

  /**
   * 绘制函数曲线 y = f(x)
   */
  drawFunction(
    fn: (x: number) => number,
    xStart: number,
    xEnd: number,
    steps = 100
  ): void {
    this.drawParametric(
      (t) => ({
        x: t,
        y: fn(t),
      }),
      xStart,
      xEnd,
      steps
    );
  }

  /**
   * 绘制圆弧
   */
  drawArc(
    cx: number,
    cy: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    counterclockwise = false
  ): void {
    this.beginPath();
    this.ctx.arc(cx, cy, radius, startAngle, endAngle, counterclockwise);
    this.stroke();
  }

  /**
   * 绘制圆
   */
  drawCircle(cx: number, cy: number, radius: number): void {
    this.drawArc(cx, cy, radius, 0, Math.PI * 2);
  }

  /**
   * 绘制椭圆
   */
  drawEllipse(
    cx: number,
    cy: number,
    radiusX: number,
    radiusY: number,
    rotation = 0,
    startAngle = 0,
    endAngle = Math.PI * 2
  ): void {
    this.beginPath();
    this.ctx.ellipse(cx, cy, radiusX, radiusY, rotation, startAngle, endAngle);
    this.stroke();
  }
}
