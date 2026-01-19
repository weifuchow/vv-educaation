/**
 * CoordinateSystem - 坐标系绘制
 * 支持笛卡尔坐标系、极坐标系，可配置轴线、刻度、标签
 */

import type { Point2D } from '../math/vector';

export interface CoordinateSystemOptions {
  type?: 'cartesian' | 'polar';
  origin?: Point2D;
  xRange?: [number, number];
  yRange?: [number, number];
  scale?: Point2D;
  axisColor?: string;
  axisWidth?: number;
  showTicks?: boolean;
  tickSize?: number;
  tickInterval?: Point2D;
  showLabels?: boolean;
  labelFont?: string;
  labelColor?: string;
  showArrows?: boolean;
  arrowSize?: number;
}

export class CoordinateSystem {
  private ctx: CanvasRenderingContext2D;
  private options: Required<CoordinateSystemOptions>;

  constructor(ctx: CanvasRenderingContext2D, options: CoordinateSystemOptions = {}) {
    this.ctx = ctx;
    this.options = {
      type: 'cartesian',
      origin: { x: 0, y: 0 },
      xRange: [-10, 10],
      yRange: [-10, 10],
      scale: { x: 1, y: 1 },
      axisColor: 'rgba(255, 255, 255, 0.6)',
      axisWidth: 2,
      showTicks: true,
      tickSize: 6,
      tickInterval: { x: 1, y: 1 },
      showLabels: true,
      labelFont: '11px sans-serif',
      labelColor: 'rgba(255, 255, 255, 0.8)',
      showArrows: true,
      arrowSize: 8,
      ...options,
    };
  }

  /**
   * 设置原点
   */
  setOrigin(x: number, y: number): void {
    this.options.origin = { x, y };
  }

  /**
   * 设置缩放
   */
  setScale(scaleX: number, scaleY = scaleX): void {
    this.options.scale = { x: scaleX, y: scaleY };
  }

  /**
   * 世界坐标转屏幕坐标
   */
  worldToScreen(wx: number, wy: number): Point2D {
    const { origin, scale } = this.options;
    return {
      x: origin.x + wx * scale.x,
      y: origin.y - wy * scale.y, // Y轴翻转
    };
  }

  /**
   * 屏幕坐标转世界坐标
   */
  screenToWorld(sx: number, sy: number): Point2D {
    const { origin, scale } = this.options;
    return {
      x: (sx - origin.x) / scale.x,
      y: (origin.y - sy) / scale.y,
    };
  }

  /**
   * 绘制坐标系
   */
  draw(width: number, height: number): void {
    const ctx = this.ctx;

    ctx.save();

    // 绘制 X 轴
    this._drawAxis('x', width, height);

    // 绘制 Y 轴
    this._drawAxis('y', width, height);

    ctx.restore();
  }

  /**
   * 绘制单个轴
   */
  private _drawAxis(axis: 'x' | 'y', width: number, height: number): void {
    const ctx = this.ctx;
    const { origin, axisColor, axisWidth, showArrows } = this.options;

    ctx.strokeStyle = axisColor;
    ctx.lineWidth = axisWidth;
    ctx.lineCap = 'round';

    ctx.beginPath();

    if (axis === 'x') {
      ctx.moveTo(0, origin.y);
      ctx.lineTo(width, origin.y);
    } else {
      ctx.moveTo(origin.x, height);
      ctx.lineTo(origin.x, 0);
    }

    ctx.stroke();

    if (showArrows) {
      this._drawArrow(axis, width, height);
    }

    if (this.options.showTicks) {
      this._drawTicks(axis, width, height);
    }
  }

  /**
   * 绘制箭头
   */
  private _drawArrow(axis: 'x' | 'y', width: number, _height: number): void {
    const ctx = this.ctx;
    const { origin, axisColor, arrowSize } = this.options;

    ctx.fillStyle = axisColor;
    ctx.beginPath();

    if (axis === 'x') {
      ctx.moveTo(width, origin.y);
      ctx.lineTo(width - arrowSize, origin.y - arrowSize / 2);
      ctx.lineTo(width - arrowSize, origin.y + arrowSize / 2);
    } else {
      ctx.moveTo(origin.x, 0);
      ctx.lineTo(origin.x - arrowSize / 2, arrowSize);
      ctx.lineTo(origin.x + arrowSize / 2, arrowSize);
    }

    ctx.closePath();
    ctx.fill();
  }

  /**
   * 绘制刻度
   */
  private _drawTicks(axis: 'x' | 'y', width: number, height: number): void {
    const ctx = this.ctx;
    const { origin, scale, tickSize, tickInterval, labelColor, labelFont, showLabels } =
      this.options;

    ctx.strokeStyle = this.options.axisColor;
    ctx.lineWidth = 1;
    ctx.fillStyle = labelColor;
    ctx.font = labelFont;

    if (axis === 'x') {
      const interval = tickInterval.x * scale.x;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      // 正方向
      for (let x = origin.x + interval; x < width - 10; x += interval) {
        ctx.beginPath();
        ctx.moveTo(x, origin.y - tickSize / 2);
        ctx.lineTo(x, origin.y + tickSize / 2);
        ctx.stroke();

        if (showLabels) {
          const value = Math.round((x - origin.x) / scale.x);
          ctx.fillText(String(value), x, origin.y + tickSize + 2);
        }
      }

      // 负方向
      for (let x = origin.x - interval; x > 10; x -= interval) {
        ctx.beginPath();
        ctx.moveTo(x, origin.y - tickSize / 2);
        ctx.lineTo(x, origin.y + tickSize / 2);
        ctx.stroke();

        if (showLabels) {
          const value = Math.round((x - origin.x) / scale.x);
          ctx.fillText(String(value), x, origin.y + tickSize + 2);
        }
      }
    } else {
      const interval = tickInterval.y * scale.y;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';

      // 正方向（向上）
      for (let y = origin.y - interval; y > 10; y -= interval) {
        ctx.beginPath();
        ctx.moveTo(origin.x - tickSize / 2, y);
        ctx.lineTo(origin.x + tickSize / 2, y);
        ctx.stroke();

        if (showLabels) {
          const value = Math.round((origin.y - y) / scale.y);
          ctx.fillText(String(value), origin.x - tickSize - 4, y);
        }
      }

      // 负方向（向下）
      for (let y = origin.y + interval; y < height - 10; y += interval) {
        ctx.beginPath();
        ctx.moveTo(origin.x - tickSize / 2, y);
        ctx.lineTo(origin.x + tickSize / 2, y);
        ctx.stroke();

        if (showLabels) {
          const value = Math.round((origin.y - y) / scale.y);
          ctx.fillText(String(value), origin.x - tickSize - 4, y);
        }
      }
    }
  }
}
