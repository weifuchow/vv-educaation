/**
 * Bezier Curve Animation Renderer
 * 贝塞尔曲线生成过程可视化渲染器
 *
 * 支持线性、二次、三次贝塞尔曲线的动态生成演示
 * 展示De Casteljau算法的递归分割过程
 */

import {
  IAnimationRenderer,
  WebAnimationConfig,
  AnimationResult,
} from '../../standards/AnimationStandard';

export interface BezierCurveConfig {
  /** 曲线阶数: 1=线性, 2=二次, 3=三次 */
  order: 1 | 2 | 3;
  /** 控制点坐标 */
  controlPoints?: { x: number; y: number }[];
  /** 是否显示控制点 */
  showControlPoints?: boolean;
  /** 是否显示辅助线 */
  showAuxiliaryLines?: boolean;
  /** 是否显示公式 */
  showFormula?: boolean;
  /** 动画速度 (秒) */
  duration?: number;
  /** 曲线颜色 */
  curveColor?: string;
  /** 是否允许交互（拖拽控制点） */
  interactive?: boolean;
}

export class BezierCurveRenderer implements IAnimationRenderer {
  public readonly id = 'math.bezier-curve';
  private container: HTMLElement;
  private config: WebAnimationConfig;
  private bezierConfig: BezierCurveConfig;
  private animationFrame: number | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private t: number = 0;
  private isPlaying: boolean = false;
  private curvePoints: { x: number; y: number }[] = [];
  private controlPoints: { x: number; y: number }[] = [];
  private draggingPoint: number | null = null;

  // 默认控制点位置（相对于画布尺寸的百分比）
  private defaultControlPoints: Record<1 | 2 | 3, { x: number; y: number }[]> = {
    1: [
      { x: 0.15, y: 0.7 },
      { x: 0.85, y: 0.3 },
    ],
    2: [
      { x: 0.1, y: 0.8 },
      { x: 0.5, y: 0.1 },
      { x: 0.9, y: 0.8 },
    ],
    3: [
      { x: 0.1, y: 0.8 },
      { x: 0.3, y: 0.1 },
      { x: 0.7, y: 0.1 },
      { x: 0.9, y: 0.8 },
    ],
  };

  constructor(config: WebAnimationConfig) {
    this.container = config.container;
    this.config = config;

    // 默认配置
    const defaults: BezierCurveConfig = {
      order: 2,
      showControlPoints: true,
      showAuxiliaryLines: true,
      showFormula: true,
      duration: 3,
      curveColor: '#3b82f6',
      interactive: true,
    };

    // 合并用户配置（用户配置覆盖默认值）
    const userConfig = config.params as Partial<BezierCurveConfig> | undefined;
    this.bezierConfig = {
      ...defaults,
      ...userConfig,
    };
  }

  getHtml(): string {
    const order = this.bezierConfig.order || 2;
    const formula = this.getFormulaHtml(order);

    return `
      <div class="bezier-animation-container">
        <div class="bezier-header">
          <h3 class="bezier-title">${this.getOrderName(order)}贝塞尔曲线</h3>
          <div class="bezier-formula" id="bezier-formula">
            ${formula}
          </div>
        </div>
        <div class="bezier-canvas-wrapper">
          <canvas id="bezier-canvas" class="bezier-canvas"></canvas>
          <div class="bezier-t-display" id="t-display">t = 0.00</div>
        </div>
        <div class="bezier-legend">
          <div class="legend-item">
            <span class="legend-dot control-point"></span>
            <span>控制点 P<sub>i</sub></span>
          </div>
          <div class="legend-item">
            <span class="legend-line auxiliary"></span>
            <span>辅助线</span>
          </div>
          <div class="legend-item">
            <span class="legend-dot moving-point"></span>
            <span>插值点</span>
          </div>
          <div class="legend-item">
            <span class="legend-line curve"></span>
            <span>贝塞尔曲线</span>
          </div>
        </div>
        <div class="bezier-info" id="bezier-info">
          ${this.getInfoText(order)}
        </div>
      </div>
    `;
  }

  private getOrderName(order: 1 | 2 | 3): string {
    const names = { 1: '线性(一次)', 2: '二次', 3: '三次' };
    return names[order];
  }

  private getFormulaHtml(order: 1 | 2 | 3): string {
    switch (order) {
      case 1:
        return `<span class="formula-text">B(t) = (1-t)P<sub>0</sub> + tP<sub>1</sub></span>`;
      case 2:
        return `<span class="formula-text">B(t) = (1-t)<sup>2</sup>P<sub>0</sub> + 2(1-t)tP<sub>1</sub> + t<sup>2</sup>P<sub>2</sub></span>`;
      case 3:
        return `<span class="formula-text">B(t) = (1-t)<sup>3</sup>P<sub>0</sub> + 3(1-t)<sup>2</sup>tP<sub>1</sub> + 3(1-t)t<sup>2</sup>P<sub>2</sub> + t<sup>3</sup>P<sub>3</sub></span>`;
    }
  }

  private getInfoText(order: 1 | 2 | 3): string {
    switch (order) {
      case 1:
        return '线性贝塞尔曲线是最简单的形式，本质上是两点之间的直线段。参数t从0变化到1时，点从P₀移动到P₁。';
      case 2:
        return '二次贝塞尔曲线有3个控制点。当t变化时，先在P₀P₁和P₁P₂上各取一个插值点，然后在这两点之间再做插值，得到曲线上的点。';
      case 3:
        return '三次贝塞尔曲线有4个控制点，是计算机图形学中最常用的形式。CSS动画、字体轮廓、矢量图形都广泛使用三次贝塞尔曲线。';
    }
  }

  initialize(): void {
    this.canvas = this.container.querySelector('#bezier-canvas');
    if (!this.canvas) return;

    // 设置canvas尺寸
    const wrapper = this.canvas.parentElement;
    if (wrapper) {
      const rect = wrapper.getBoundingClientRect();
      this.canvas.width = rect.width || 600;
      this.canvas.height = rect.height || 400;
    }

    this.ctx = this.canvas.getContext('2d');

    // 初始化控制点
    this.initializeControlPoints();

    // 设置交互
    if (this.bezierConfig.interactive) {
      this.setupInteraction();
    }

    // 绘制初始状态
    this.draw();

    if (this.config.autoplay) {
      setTimeout(() => this.start(), 500);
    }
  }

  private initializeControlPoints(): void {
    if (this.bezierConfig.controlPoints) {
      this.controlPoints = [...this.bezierConfig.controlPoints];
    } else {
      const defaults = this.defaultControlPoints[this.bezierConfig.order];
      this.controlPoints = defaults.map((p) => ({
        x: p.x * (this.canvas?.width || 600),
        y: p.y * (this.canvas?.height || 400),
      }));
    }
  }

  private setupInteraction(): void {
    if (!this.canvas) return;

    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mouseup', this.handleMouseUp);
    this.canvas.addEventListener('mouseleave', this.handleMouseUp);
  }

  private handleMouseDown = (e: MouseEvent): void => {
    const rect = this.canvas!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 检查是否点击了控制点
    for (let i = 0; i < this.controlPoints.length; i++) {
      const p = this.controlPoints[i];
      const dist = Math.sqrt((x - p.x) ** 2 + (y - p.y) ** 2);
      if (dist < 15) {
        this.draggingPoint = i;
        this.canvas!.style.cursor = 'grabbing';
        break;
      }
    }
  };

  private handleMouseMove = (e: MouseEvent): void => {
    const rect = this.canvas!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (this.draggingPoint !== null) {
      // 更新控制点位置
      this.controlPoints[this.draggingPoint] = { x, y };
      this.curvePoints = [];
      this.draw();

      // 发送交互事件
      this.emitInteraction({
        action: 'control_point_moved',
        data: {
          pointIndex: this.draggingPoint,
          position: { x, y },
        },
      });
    } else {
      // 检查鼠标是否悬停在控制点上
      let hovering = false;
      for (const p of this.controlPoints) {
        const dist = Math.sqrt((x - p.x) ** 2 + (y - p.y) ** 2);
        if (dist < 15) {
          hovering = true;
          break;
        }
      }
      this.canvas!.style.cursor = hovering ? 'grab' : 'default';
    }
  };

  private handleMouseUp = (): void => {
    this.draggingPoint = null;
    if (this.canvas) {
      this.canvas.style.cursor = 'default';
    }
  };

  start(): void {
    if (this.isPlaying) return;

    this.isPlaying = true;
    this.t = 0;
    this.curvePoints = [];

    this.emitInteraction({
      action: 'animation_start',
      data: { order: this.bezierConfig.order },
    });

    const duration = (this.bezierConfig.duration || 3) * 1000;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      if (!this.isPlaying) return;

      const elapsed = currentTime - startTime;
      this.t = Math.min(elapsed / duration, 1);

      // 计算当前曲线点并添加到轨迹
      const currentPoint = this.calculateBezierPoint(this.t);
      this.curvePoints.push(currentPoint);

      this.draw();
      this.updateTDisplay();

      if (this.t < 1) {
        this.animationFrame = requestAnimationFrame(animate);
      } else {
        this.isPlaying = false;
        this.emitResult('complete', {
          order: this.bezierConfig.order,
          controlPoints: this.controlPoints,
        });
      }
    };

    this.animationFrame = requestAnimationFrame(animate);
  }

  stop(): void {
    this.isPlaying = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  reset(): void {
    this.stop();
    this.t = 0;
    this.curvePoints = [];
    this.draw();
    this.updateTDisplay();
  }

  pause(): void {
    this.stop();
  }

  resume(): void {
    if (!this.isPlaying && this.t < 1) {
      this.start();
    }
  }

  destroy(): void {
    this.stop();
    if (this.canvas) {
      this.canvas.removeEventListener('mousedown', this.handleMouseDown);
      this.canvas.removeEventListener('mousemove', this.handleMouseMove);
      this.canvas.removeEventListener('mouseup', this.handleMouseUp);
      this.canvas.removeEventListener('mouseleave', this.handleMouseUp);
    }
    this.container.innerHTML = '';
  }

  handleControl(controlId: string): void {
    switch (controlId) {
      case 'play':
        this.start();
        break;
      case 'pause':
        this.pause();
        break;
      case 'reset':
        this.reset();
        break;
    }
  }

  private draw(): void {
    if (!this.ctx || !this.canvas) return;

    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // 清除画布
    ctx.clearRect(0, 0, width, height);

    // 绘制网格背景
    this.drawGrid();

    // 绘制控制点之间的连线（骨架）
    this.drawControlPolygon();

    // 绘制辅助线（De Casteljau算法可视化）
    if (this.bezierConfig.showAuxiliaryLines && this.t > 0) {
      this.drawDeCasteljauLines();
    }

    // 绘制已生成的曲线
    this.drawCurve();

    // 绘制控制点
    if (this.bezierConfig.showControlPoints) {
      this.drawControlPoints();
    }

    // 绘制当前点
    if (this.t > 0 && this.t <= 1) {
      const currentPoint = this.calculateBezierPoint(this.t);
      this.drawCurrentPoint(currentPoint);
    }
  }

  private drawGrid(): void {
    if (!this.ctx || !this.canvas) return;

    const ctx = this.ctx;
    const width = this.canvas.width;
    const height = this.canvas.height;

    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    // 绘制垂直线
    for (let x = 0; x <= width; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // 绘制水平线
    for (let y = 0; y <= height; y += 50) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  private drawControlPolygon(): void {
    if (!this.ctx) return;

    const ctx = this.ctx;
    const points = this.controlPoints;

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }

  private drawControlPoints(): void {
    if (!this.ctx) return;

    const ctx = this.ctx;
    const points = this.controlPoints;

    for (let i = 0; i < points.length; i++) {
      const p = points[i];

      // 绘制外圈
      ctx.beginPath();
      ctx.arc(p.x, p.y, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 绘制内圈
      ctx.beginPath();
      ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#3b82f6';
      ctx.fill();

      // 绘制标签
      ctx.fillStyle = '#1e40af';
      ctx.font = 'bold 14px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(`P${i}`, p.x, p.y - 20);
    }
  }

  private drawDeCasteljauLines(): void {
    if (!this.ctx) return;

    const ctx = this.ctx;
    const t = this.t;
    const points = this.controlPoints;

    // 颜色梯度
    const colors = ['#ef4444', '#f97316', '#22c55e'];

    // De Casteljau算法递归计算
    let currentLevel = [...points];
    let level = 0;

    while (currentLevel.length > 1) {
      const nextLevel: { x: number; y: number }[] = [];

      // 绘制当前层的连线
      ctx.strokeStyle = colors[level % colors.length];
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.6;

      ctx.beginPath();
      ctx.moveTo(currentLevel[0].x, currentLevel[0].y);
      for (let i = 1; i < currentLevel.length; i++) {
        ctx.lineTo(currentLevel[i].x, currentLevel[i].y);
      }
      ctx.stroke();

      // 计算插值点
      for (let i = 0; i < currentLevel.length - 1; i++) {
        const p1 = currentLevel[i];
        const p2 = currentLevel[i + 1];
        const interpolated = {
          x: (1 - t) * p1.x + t * p2.x,
          y: (1 - t) * p1.y + t * p2.y,
        };
        nextLevel.push(interpolated);

        // 绘制插值点
        ctx.beginPath();
        ctx.arc(interpolated.x, interpolated.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = colors[level % colors.length];
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      currentLevel = nextLevel;
      level++;
    }
  }

  private drawCurve(): void {
    if (!this.ctx || this.curvePoints.length < 2) return;

    const ctx = this.ctx;

    ctx.strokeStyle = this.bezierConfig.curveColor || '#3b82f6';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(this.curvePoints[0].x, this.curvePoints[0].y);
    for (let i = 1; i < this.curvePoints.length; i++) {
      ctx.lineTo(this.curvePoints[i].x, this.curvePoints[i].y);
    }
    ctx.stroke();
  }

  private drawCurrentPoint(point: { x: number; y: number }): void {
    if (!this.ctx) return;

    const ctx = this.ctx;

    // 绘制发光效果
    const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 20);
    gradient.addColorStop(0, 'rgba(239, 68, 68, 0.5)');
    gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.beginPath();
    ctx.arc(point.x, point.y, 20, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // 绘制当前点
    ctx.beginPath();
    ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  private calculateBezierPoint(t: number): { x: number; y: number } {
    const points = this.controlPoints;
    const n = points.length - 1;

    let x = 0;
    let y = 0;

    for (let i = 0; i <= n; i++) {
      const coefficient = this.binomial(n, i) * Math.pow(1 - t, n - i) * Math.pow(t, i);
      x += coefficient * points[i].x;
      y += coefficient * points[i].y;
    }

    return { x, y };
  }

  private binomial(n: number, k: number): number {
    if (k === 0 || k === n) return 1;
    return this.factorial(n) / (this.factorial(k) * this.factorial(n - k));
  }

  private factorial(n: number): number {
    if (n <= 1) return 1;
    return n * this.factorial(n - 1);
  }

  private updateTDisplay(): void {
    const tDisplay = this.container.querySelector('#t-display');
    if (tDisplay) {
      tDisplay.textContent = `t = ${this.t.toFixed(2)}`;
    }
  }

  private emitResult(type: AnimationResult['type'], data?: any): void {
    if (this.config.onResult) {
      this.config.onResult({
        type,
        data,
        timestamp: Date.now(),
      });
    }
  }

  private emitInteraction(interaction: any): void {
    if (this.config.onInteract) {
      this.config.onInteract({
        ...interaction,
        timestamp: Date.now(),
      });
    }
  }
}
