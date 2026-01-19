/**
 * Grid - 网格绘制
 * 支持多种网格样式：点阵、线格、等距线等
 */

export interface GridOptions {
  type?: 'lines' | 'dots' | 'crosses';
  size?: number;
  color?: string;
  lineWidth?: number;
  showSubGrid?: boolean;
  subGridDivisions?: number;
  subGridColor?: string;
  showOrigin?: boolean;
  originColor?: string;
}

export class Grid {
  private ctx: CanvasRenderingContext2D;
  private options: Required<GridOptions>;

  constructor(ctx: CanvasRenderingContext2D, options: GridOptions = {}) {
    this.ctx = ctx;
    this.options = {
      type: 'lines',
      size: 50,
      color: 'rgba(255, 255, 255, 0.08)',
      lineWidth: 1,
      showSubGrid: false,
      subGridDivisions: 5,
      subGridColor: 'rgba(255, 255, 255, 0.03)',
      showOrigin: false,
      originColor: 'rgba(255, 255, 255, 0.3)',
      ...options,
    };
  }

  /**
   * 绘制网格
   */
  draw(width: number, height: number, offsetX = 0, offsetY = 0): void {
    const { type } = this.options;

    switch (type) {
      case 'lines':
        this._drawLines(width, height, offsetX, offsetY);
        break;
      case 'dots':
        this._drawDots(width, height, offsetX, offsetY);
        break;
      case 'crosses':
        this._drawCrosses(width, height, offsetX, offsetY);
        break;
    }
  }

  /**
   * 绘制线格
   */
  private _drawLines(
    width: number,
    height: number,
    offsetX: number,
    offsetY: number
  ): void {
    const ctx = this.ctx;
    const { size, color, lineWidth, showSubGrid, subGridDivisions, subGridColor } =
      this.options;

    // 次网格
    if (showSubGrid) {
      const subSize = size / subGridDivisions;
      ctx.strokeStyle = subGridColor;
      ctx.lineWidth = lineWidth * 0.5;

      // 垂直线
      for (let x = offsetX % subSize; x < width; x += subSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // 水平线
      for (let y = offsetY % subSize; y < height; y += subSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    }

    // 主网格
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    // 垂直线
    for (let x = offsetX % size; x < width; x += size) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // 水平线
    for (let y = offsetY % size; y < height; y += size) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  /**
   * 绘制点阵
   */
  private _drawDots(
    width: number,
    height: number,
    offsetX: number,
    offsetY: number
  ): void {
    const ctx = this.ctx;
    const { size, color } = this.options;

    ctx.fillStyle = color;

    for (let x = offsetX % size; x < width; x += size) {
      for (let y = offsetY % size; y < height; y += size) {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  /**
   * 绘制十字标记
   */
  private _drawCrosses(
    width: number,
    height: number,
    offsetX: number,
    offsetY: number
  ): void {
    const ctx = this.ctx;
    const { size, color, lineWidth } = this.options;
    const crossSize = 4;

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;

    for (let x = offsetX % size; x < width; x += size) {
      for (let y = offsetY % size; y < height; y += size) {
        ctx.beginPath();
        ctx.moveTo(x - crossSize, y);
        ctx.lineTo(x + crossSize, y);
        ctx.moveTo(x, y - crossSize);
        ctx.lineTo(x, y + crossSize);
        ctx.stroke();
      }
    }
  }
}
