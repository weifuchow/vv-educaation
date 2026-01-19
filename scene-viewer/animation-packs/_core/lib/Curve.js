/**
 * Curve - 曲线绘制工具
 * 支持多种曲线类型：直线、贝塞尔、样条、函数曲线等
 */
export class Curve {
  constructor(ctx, options = {}) {
    this.ctx = ctx;
    this.options = {
      color: '#4ecdc4',
      width: 3,
      lineCap: 'round',
      lineJoin: 'round',
      dash: [],

      // 发光效果
      glow: false,
      glowColor: null,
      glowBlur: 10,

      ...options,
    };
  }

  /**
   * 设置样式
   */
  setStyle(options) {
    Object.assign(this.options, options);
  }

  /**
   * 开始绘制路径
   */
  beginPath() {
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
  stroke() {
    this.ctx.stroke();
    this.ctx.restore();
  }

  /**
   * 绘制直线
   */
  drawLine(x1, y1, x2, y2) {
    this.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.stroke();
  }

  /**
   * 绘制折线
   */
  drawPolyline(points) {
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
   * @param {Function} paramFn - 参数方程 (t) => {x, y}
   * @param {number} tStart - 起始参数值
   * @param {number} tEnd - 结束参数值
   * @param {number} steps - 采样点数
   */
  drawParametric(paramFn, tStart = 0, tEnd = 1, steps = 100) {
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
  drawFunction(fn, xStart, xEnd, steps = 100) {
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
  drawArc(cx, cy, radius, startAngle, endAngle, counterclockwise = false) {
    this.beginPath();
    this.ctx.arc(cx, cy, radius, startAngle, endAngle, counterclockwise);
    this.stroke();
  }

  /**
   * 绘制圆
   */
  drawCircle(cx, cy, radius) {
    this.drawArc(cx, cy, radius, 0, Math.PI * 2);
  }

  /**
   * 绘制椭圆
   */
  drawEllipse(cx, cy, radiusX, radiusY, rotation = 0, startAngle = 0, endAngle = Math.PI * 2) {
    this.beginPath();
    this.ctx.ellipse(cx, cy, radiusX, radiusY, rotation, startAngle, endAngle);
    this.stroke();
  }
}

export default Curve;
