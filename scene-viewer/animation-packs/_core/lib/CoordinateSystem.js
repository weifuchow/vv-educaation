/**
 * CoordinateSystem - 坐标系绘制
 * 支持笛卡尔坐标系、极坐标系，可配置轴线、刻度、标签
 */
export class CoordinateSystem {
  constructor(ctx, options = {}) {
    this.ctx = ctx;
    this.options = {
      // 坐标系类型
      type: 'cartesian', // 'cartesian' | 'polar'

      // 原点位置（相对于 canvas）
      origin: { x: 0, y: 0 },

      // 坐标范围
      xRange: [-10, 10],
      yRange: [-10, 10],

      // 缩放（像素/单位）
      scale: { x: 1, y: 1 },

      // 轴线样式
      axisColor: 'rgba(255, 255, 255, 0.6)',
      axisWidth: 2,

      // 刻度
      showTicks: true,
      tickSize: 6,
      tickInterval: { x: 1, y: 1 },

      // 标签
      showLabels: true,
      labelFont: '11px sans-serif',
      labelColor: 'rgba(255, 255, 255, 0.8)',

      // 箭头
      showArrows: true,
      arrowSize: 8,

      ...options,
    };
  }

  /**
   * 设置原点
   */
  setOrigin(x, y) {
    this.options.origin = { x, y };
  }

  /**
   * 设置缩放
   */
  setScale(scaleX, scaleY = scaleX) {
    this.options.scale = { x: scaleX, y: scaleY };
  }

  /**
   * 世界坐标转屏幕坐标
   */
  worldToScreen(wx, wy) {
    const { origin, scale } = this.options;
    return {
      x: origin.x + wx * scale.x,
      y: origin.y - wy * scale.y, // Y轴翻转
    };
  }

  /**
   * 屏幕坐标转世界坐标
   */
  screenToWorld(sx, sy) {
    const { origin, scale } = this.options;
    return {
      x: (sx - origin.x) / scale.x,
      y: (origin.y - sy) / scale.y,
    };
  }

  /**
   * 绘制坐标系
   */
  draw(width, height) {
    const ctx = this.ctx;
    const { origin, xRange, yRange, scale } = this.options;

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
  _drawAxis(axis, width, height) {
    const ctx = this.ctx;
    const { origin, axisColor, axisWidth, showArrows, arrowSize } = this.options;

    ctx.strokeStyle = axisColor;
    ctx.lineWidth = axisWidth;
    ctx.lineCap = 'round';

    ctx.beginPath();

    if (axis === 'x') {
      // X 轴：从左到右
      ctx.moveTo(0, origin.y);
      ctx.lineTo(width, origin.y);
    } else {
      // Y 轴：从下到上
      ctx.moveTo(origin.x, height);
      ctx.lineTo(origin.x, 0);
    }

    ctx.stroke();

    // 绘制箭头
    if (showArrows) {
      this._drawArrow(axis, width, height);
    }

    // 绘制刻度
    if (this.options.showTicks) {
      this._drawTicks(axis, width, height);
    }
  }

  /**
   * 绘制箭头
   */
  _drawArrow(axis, width, height) {
    const ctx = this.ctx;
    const { origin, axisColor, arrowSize } = this.options;

    ctx.fillStyle = axisColor;
    ctx.beginPath();

    if (axis === 'x') {
      // X 轴箭头（右侧）
      ctx.moveTo(width, origin.y);
      ctx.lineTo(width - arrowSize, origin.y - arrowSize / 2);
      ctx.lineTo(width - arrowSize, origin.y + arrowSize / 2);
    } else {
      // Y 轴箭头（顶部）
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
  _drawTicks(axis, width, height) {
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

export default CoordinateSystem;
