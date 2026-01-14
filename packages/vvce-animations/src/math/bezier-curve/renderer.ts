/**
 * Bezier Curve Animation Renderer
 * 贝塞尔曲线生成过程可视化渲染器
 *
 * 支持线性、二次、三次贝塞尔曲线的动态生成演示
 * 展示De Casteljau算法的递归分割过程
 *
 * 坐标范围: 0-100
 */

import {
  IAnimationRenderer,
  WebAnimationConfig,
  AnimationResult,
} from '../../standards/AnimationStandard';

export interface BezierCurveConfig {
  /** 曲线阶数: 1=线性, 2=二次, 3=三次 */
  order: 1 | 2 | 3;
  /** 控制点坐标 (0-100范围) */
  controlPoints?: { x: number; y: number }[];
  /** 是否显示控制点 */
  showControlPoints?: boolean;
  /** 是否显示辅助线 */
  showAuxiliaryLines?: boolean;
  /** 是否显示公式 */
  showFormula?: boolean;
  /** 动画时长(秒) */
  duration?: number;
  /** 曲线颜色 */
  curveColor?: string;
  /** 是否允许交互（拖拽控制点） */
  interactive?: boolean;
  /** 采样点数量 */
  samplePoints?: number;
  /** 每秒生成的点数 */
  pointsPerSecond?: number;
}

export class BezierCurveRenderer implements IAnimationRenderer {
  public readonly id = 'math.bezier-curve';
  private container: HTMLElement;
  private config: WebAnimationConfig;
  private bezierConfig: BezierCurveConfig;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private currentPointIndex: number = 0;
  private isPlaying: boolean = false;
  private allCurvePoints: { x: number; y: number; t: number }[] = [];
  private drawnPoints: { x: number; y: number; t: number }[] = [];
  private controlPoints: { x: number; y: number }[] = [];
  private draggingPoint: number | null = null;
  private hoveredPoint: { x: number; y: number; t: number } | null = null;
  private isGenerated: boolean = false;

  // 画布边距
  private padding = { top: 50, right: 50, bottom: 70, left: 70 };

  // 坐标范围
  private readonly COORD_MIN = 0;
  private readonly COORD_MAX = 100;

  // 默认控制点位置（0-100坐标）
  private defaultControlPoints: Record<1 | 2 | 3, { x: number; y: number }[]> = {
    1: [
      { x: 10, y: 20 },
      { x: 90, y: 80 },
    ],
    2: [
      { x: 10, y: 20 },
      { x: 50, y: 90 },
      { x: 90, y: 20 },
    ],
    3: [
      { x: 10, y: 20 },
      { x: 30, y: 90 },
      { x: 70, y: 90 },
      { x: 90, y: 20 },
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
      duration: 5,
      curveColor: '#3b82f6',
      interactive: true,
      samplePoints: 100,
      pointsPerSecond: 20,
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
        <div class="bezier-canvas-wrapper" style="height: 500px;">
          <canvas id="bezier-canvas" class="bezier-canvas"></canvas>
          <div class="bezier-tooltip" id="bezier-tooltip" style="display: none;"></div>
        </div>
        <div class="bezier-status">
          <div class="status-item">
            <span class="status-label">当前 t 值:</span>
            <span class="status-value" id="t-display">0.00</span>
          </div>
          <div class="status-item">
            <span class="status-label">进度:</span>
            <span class="status-value" id="progress-display">0%</span>
          </div>
          <div class="status-item">
            <span class="status-label">已生成点数:</span>
            <span class="status-value" id="points-display">0 / ${this.bezierConfig.samplePoints}</span>
          </div>
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
        <div class="bezier-controls">
          <button class="bezier-btn bezier-btn-primary" id="btn-play">播放动画</button>
          <button class="bezier-btn bezier-btn-primary" id="btn-pause" style="display: none;">暂停</button>
          <button class="bezier-btn bezier-btn-primary" id="btn-reset">重置</button>
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
        return '线性贝塞尔曲线是最简单的形式，本质上是两点之间的直线段。参数t从0变化到1时，点从P₀移动到P₁。坐标范围: x, y ∈ [0, 100]';
      case 2:
        return '二次贝塞尔曲线有3个控制点。当t变化时，先在P₀P₁和P₁P₂上各取一个插值点，然后在这两点之间再做插值，得到曲线上的点。坐标范围: x, y ∈ [0, 100]';
      case 3:
        return '三次贝塞尔曲线有4个控制点，是计算机图形学中最常用的形式。CSS动画、字体轮廓、矢量图形都广泛使用三次贝塞尔曲线。坐标范围: x, y ∈ [0, 100]';
    }
  }

  initialize(): void {
    this.canvas = this.container.querySelector('#bezier-canvas');
    if (!this.canvas) return;

    // 设置canvas尺寸 - 更大的画布
    const wrapper = this.canvas.parentElement;
    if (wrapper) {
      const rect = wrapper.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = rect.width || 700;
      const height = rect.height || 500;
      this.canvas.width = width * dpr;
      this.canvas.height = height * dpr;
      this.canvas.style.width = `${width}px`;
      this.canvas.style.height = `${height}px`;
    }

    this.ctx = this.canvas.getContext('2d');
    if (this.ctx) {
      const dpr = window.devicePixelRatio || 1;
      this.ctx.scale(dpr, dpr);
    }

    // 初始化控制点
    this.initializeControlPoints();

    // 预计算所有曲线点
    this.precomputeCurvePoints();

    // 设置交互
    if (this.bezierConfig.interactive) {
      this.setupInteraction();
    }

    // 设置按钮事件
    this.setupButtons();

    // 绘制初始状态
    this.draw();

    if (this.config.autoplay) {
      setTimeout(() => this.start(), 500);
    }
  }

  private setupButtons(): void {
    const btnPlay = this.container.querySelector('#btn-play') as HTMLButtonElement;
    const btnPause = this.container.querySelector('#btn-pause') as HTMLButtonElement;
    const btnReset = this.container.querySelector('#btn-reset') as HTMLButtonElement;

    if (btnPlay) {
      btnPlay.addEventListener('click', () => {
        this.start();
        btnPlay.style.display = 'none';
        if (btnPause) btnPause.style.display = 'inline-flex';
      });
    }
    if (btnPause) {
      btnPause.addEventListener('click', () => {
        this.pause();
        btnPause.style.display = 'none';
        if (btnPlay) {
          btnPlay.textContent = '继续播放';
          btnPlay.style.display = 'inline-flex';
        }
      });
    }
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        this.reset();
        if (btnPause) btnPause.style.display = 'none';
        if (btnPlay) {
          btnPlay.textContent = '播放动画';
          btnPlay.style.display = 'inline-flex';
        }
      });
    }
  }

  private getDrawingArea(): { x: number; y: number; width: number; height: number } {
    const canvasWidth = (this.canvas?.width || 700) / (window.devicePixelRatio || 1);
    const canvasHeight = (this.canvas?.height || 500) / (window.devicePixelRatio || 1);
    return {
      x: this.padding.left,
      y: this.padding.top,
      width: canvasWidth - this.padding.left - this.padding.right,
      height: canvasHeight - this.padding.top - this.padding.bottom,
    };
  }

  // 将0-100坐标转换为画布坐标
  private coordToCanvas(point: { x: number; y: number }): { x: number; y: number } {
    const area = this.getDrawingArea();
    return {
      x: area.x + (point.x / this.COORD_MAX) * area.width,
      y: area.y + area.height - (point.y / this.COORD_MAX) * area.height, // Y轴反转
    };
  }

  // 将画布坐标转换为0-100坐标
  private canvasToCoord(point: { x: number; y: number }): { x: number; y: number } {
    const area = this.getDrawingArea();
    return {
      x: ((point.x - area.x) / area.width) * this.COORD_MAX,
      y: ((area.y + area.height - point.y) / area.height) * this.COORD_MAX, // Y轴反转
    };
  }

  private initializeControlPoints(): void {
    if (this.bezierConfig.controlPoints) {
      this.controlPoints = [...this.bezierConfig.controlPoints];
    } else {
      this.controlPoints = [...this.defaultControlPoints[this.bezierConfig.order || 2]];
    }
  }

  private precomputeCurvePoints(): void {
    const samplePoints = this.bezierConfig.samplePoints || 100;
    this.allCurvePoints = [];

    for (let i = 0; i <= samplePoints; i++) {
      const t = i / samplePoints;
      const point = this.calculateBezierPoint(t);
      this.allCurvePoints.push({ ...point, t });
    }
  }

  private setupInteraction(): void {
    if (!this.canvas) return;

    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mouseup', this.handleMouseUp);
    this.canvas.addEventListener('mouseleave', this.handleMouseLeave);
  }

  private handleMouseDown = (e: MouseEvent): void => {
    const pos = this.getCanvasPos(e);

    // 检查是否点击了控制点
    for (let i = 0; i < this.controlPoints.length; i++) {
      const canvasPos = this.coordToCanvas(this.controlPoints[i]);
      const dist = Math.sqrt((pos.x - canvasPos.x) ** 2 + (pos.y - canvasPos.y) ** 2);
      if (dist < 15) {
        this.draggingPoint = i;
        this.canvas!.style.cursor = 'grabbing';
        break;
      }
    }
  };

  private handleMouseMove = (e: MouseEvent): void => {
    const pos = this.getCanvasPos(e);

    if (this.draggingPoint !== null) {
      // 更新控制点位置
      const coord = this.canvasToCoord(pos);
      this.controlPoints[this.draggingPoint] = {
        x: Math.max(this.COORD_MIN, Math.min(this.COORD_MAX, coord.x)),
        y: Math.max(this.COORD_MIN, Math.min(this.COORD_MAX, coord.y)),
      };

      // 重新计算曲线点
      this.precomputeCurvePoints();

      // 如果已生成曲线，更新显示
      if (this.isGenerated) {
        this.drawnPoints = [...this.allCurvePoints];
      } else {
        this.drawnPoints = this.allCurvePoints.slice(0, this.currentPointIndex + 1);
      }

      this.draw();

      // 发送交互事件
      this.emitInteraction({
        action: 'control_point_moved',
        data: {
          pointIndex: this.draggingPoint,
          position: this.controlPoints[this.draggingPoint],
        },
      });
    } else {
      // 检查鼠标是否悬停在控制点上
      let hovering = false;
      for (const p of this.controlPoints) {
        const canvasPos = this.coordToCanvas(p);
        const dist = Math.sqrt((pos.x - canvasPos.x) ** 2 + (pos.y - canvasPos.y) ** 2);
        if (dist < 15) {
          hovering = true;
          break;
        }
      }

      // 检查是否悬停在曲线点附近
      this.hoveredPoint = null;
      for (const point of this.drawnPoints) {
        const canvasPos = this.coordToCanvas(point);
        const dist = Math.sqrt((pos.x - canvasPos.x) ** 2 + (pos.y - canvasPos.y) ** 2);
        if (dist < 10) {
          this.hoveredPoint = point;
          break;
        }
      }

      this.canvas!.style.cursor = hovering ? 'grab' : 'crosshair';
      this.updateTooltip(pos);
      this.draw();
    }
  };

  private handleMouseUp = (): void => {
    this.draggingPoint = null;
    if (this.canvas) {
      this.canvas.style.cursor = 'crosshair';
    }
  };

  private handleMouseLeave = (): void => {
    this.draggingPoint = null;
    this.hoveredPoint = null;
    this.hideTooltip();
    this.draw();
  };

  private getCanvasPos(e: MouseEvent): { x: number; y: number } {
    const rect = this.canvas!.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  private updateTooltip(pos: { x: number; y: number }): void {
    const tooltip = this.container.querySelector('#bezier-tooltip') as HTMLElement;
    if (!tooltip) return;

    const area = this.getDrawingArea();

    // 检查是否在绘图区域内
    if (
      pos.x >= area.x &&
      pos.x <= area.x + area.width &&
      pos.y >= area.y &&
      pos.y <= area.y + area.height
    ) {
      // 转换为坐标值 (0-100)
      const coord = this.canvasToCoord(pos);

      let tooltipContent = `x: ${coord.x.toFixed(1)}<br>y: ${coord.y.toFixed(1)}`;

      // 如果悬停在曲线点上，显示t值
      if (this.hoveredPoint) {
        tooltipContent += `<br><span style="color: #ef4444; font-weight: bold;">t = ${this.hoveredPoint.t.toFixed(3)}</span>`;
        tooltipContent += `<br><span style="color: #3b82f6;">曲线点: (${this.hoveredPoint.x.toFixed(1)}, ${this.hoveredPoint.y.toFixed(1)})</span>`;
      }

      tooltip.innerHTML = tooltipContent;
      tooltip.style.display = 'block';
      tooltip.style.left = `${pos.x + 15}px`;
      tooltip.style.top = `${pos.y - 10}px`;
    } else {
      this.hideTooltip();
    }
  }

  private hideTooltip(): void {
    const tooltip = this.container.querySelector('#bezier-tooltip') as HTMLElement;
    if (tooltip) {
      tooltip.style.display = 'none';
    }
  }

  // 生成完整曲线（立即显示所有点连接成的曲线）
  generate(): void {
    this.stop();
    this.isGenerated = true;
    this.currentPointIndex = this.bezierConfig.samplePoints || 100;
    this.drawnPoints = [...this.allCurvePoints];
    this.draw();
    this.updateStatusDisplay();

    this.emitInteraction({
      action: 'curve_generated',
      data: {
        order: this.bezierConfig.order,
        controlPoints: this.controlPoints,
        totalPoints: this.drawnPoints.length,
      },
    });

    this.emitResult('complete', {
      order: this.bezierConfig.order,
      controlPoints: this.controlPoints,
      totalPoints: this.drawnPoints.length,
    });
  }

  // 播放生成过程动画
  start(): void {
    if (this.isPlaying) return;

    // 如果是从头开始（不是暂停后继续）
    if (this.currentPointIndex === 0 || this.isGenerated) {
      this.currentPointIndex = 0;
      this.drawnPoints = [];
      this.isGenerated = false;
    }

    this.isPlaying = true;

    this.emitInteraction({
      action: 'animation_start',
      data: { order: this.bezierConfig.order },
    });

    const pointsPerSecond = this.bezierConfig.pointsPerSecond || 20;
    const intervalMs = 1000 / pointsPerSecond;

    const animate = () => {
      if (!this.isPlaying) return;

      if (this.currentPointIndex <= (this.bezierConfig.samplePoints || 100)) {
        this.drawnPoints = this.allCurvePoints.slice(0, this.currentPointIndex + 1);
        this.draw();
        this.updateStatusDisplay();
        this.currentPointIndex++;
        setTimeout(animate, intervalMs);
      } else {
        this.isPlaying = false;
        this.isGenerated = true;
        // 动画完成，更新按钮状态
        this.updateButtonsOnComplete();
        this.emitResult('complete', {
          order: this.bezierConfig.order,
          controlPoints: this.controlPoints,
          totalPoints: this.drawnPoints.length,
        });
      }
    };

    animate();
  }

  private updateButtonsOnComplete(): void {
    const btnPlay = this.container.querySelector('#btn-play') as HTMLButtonElement;
    const btnPause = this.container.querySelector('#btn-pause') as HTMLButtonElement;
    if (btnPause) btnPause.style.display = 'none';
    if (btnPlay) {
      btnPlay.textContent = '播放动画';
      btnPlay.style.display = 'inline-flex';
    }
  }

  stop(): void {
    this.isPlaying = false;
  }

  reset(): void {
    this.stop();
    this.isGenerated = false;
    this.currentPointIndex = 0;
    this.drawnPoints = [];
    this.draw();
    this.updateStatusDisplay();
  }

  pause(): void {
    this.stop();
  }

  resume(): void {
    if (
      !this.isPlaying &&
      this.currentPointIndex < (this.bezierConfig.samplePoints || 100)
    ) {
      this.isPlaying = true;

      const pointsPerSecond = this.bezierConfig.pointsPerSecond || 20;
      const intervalMs = 1000 / pointsPerSecond;

      const animate = () => {
        if (!this.isPlaying) return;

        if (this.currentPointIndex <= (this.bezierConfig.samplePoints || 100)) {
          this.drawnPoints = this.allCurvePoints.slice(0, this.currentPointIndex + 1);
          this.draw();
          this.updateStatusDisplay();
          this.currentPointIndex++;
          setTimeout(animate, intervalMs);
        } else {
          this.isPlaying = false;
          this.isGenerated = true;
        }
      };

      animate();
    }
  }

  destroy(): void {
    this.stop();
    if (this.canvas) {
      this.canvas.removeEventListener('mousedown', this.handleMouseDown);
      this.canvas.removeEventListener('mousemove', this.handleMouseMove);
      this.canvas.removeEventListener('mouseup', this.handleMouseUp);
      this.canvas.removeEventListener('mouseleave', this.handleMouseLeave);
    }
    this.container.innerHTML = '';
  }

  handleControl(controlId: string): void {
    switch (controlId) {
      case 'generate':
        this.generate();
        break;
      case 'play':
        this.start();
        break;
      case 'pause':
        this.pause();
        break;
      case 'resume':
        this.resume();
        break;
      case 'reset':
        this.reset();
        break;
    }
  }

  private updateStatusDisplay(): void {
    const samplePoints = this.bezierConfig.samplePoints || 100;
    const currentT = this.currentPointIndex / samplePoints;
    const progress = Math.round((this.currentPointIndex / samplePoints) * 100);

    const progressEl = this.container.querySelector('#progress-display');
    const pointsEl = this.container.querySelector('#points-display');
    const tEl = this.container.querySelector('#t-display');

    if (progressEl) progressEl.textContent = `${progress}%`;
    if (pointsEl) pointsEl.textContent = `${this.currentPointIndex} / ${samplePoints}`;
    if (tEl) tEl.textContent = currentT.toFixed(2);
  }

  private draw(): void {
    if (!this.ctx || !this.canvas) return;

    const ctx = this.ctx;
    const canvasWidth = this.canvas.width / (window.devicePixelRatio || 1);
    const canvasHeight = this.canvas.height / (window.devicePixelRatio || 1);

    // 清除画布
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // 绘制白色背景
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 绘制坐标系
    this.drawCoordinateSystem();

    // 绘制控制点之间的连线（骨架）
    this.drawControlPolygon();

    // 绘制辅助线（De Casteljau算法可视化）
    if (this.bezierConfig.showAuxiliaryLines && this.drawnPoints.length > 0) {
      const currentT = this.drawnPoints[this.drawnPoints.length - 1]?.t || 0;
      this.drawDeCasteljauLines(currentT);
    }

    // 绘制已生成的曲线
    this.drawCurve();

    // 绘制控制点
    if (this.bezierConfig.showControlPoints) {
      this.drawControlPoints();
    }

    // 绘制当前点
    if (this.drawnPoints.length > 0 && !this.isGenerated) {
      const currentPoint = this.drawnPoints[this.drawnPoints.length - 1];
      this.drawCurrentPoint(currentPoint);
    }

    // 绘制悬停高亮点
    if (this.hoveredPoint) {
      this.drawHoveredPoint(this.hoveredPoint);
    }
  }

  private drawCoordinateSystem(): void {
    if (!this.ctx) return;

    const ctx = this.ctx;
    const area = this.getDrawingArea();

    // 绘制背景网格
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;

    // 垂直网格线 (每10个单位一条)
    const gridCount = 10;
    const gridSpacingX = area.width / gridCount;
    for (let i = 0; i <= gridCount; i++) {
      const x = area.x + i * gridSpacingX;
      ctx.beginPath();
      ctx.moveTo(x, area.y);
      ctx.lineTo(x, area.y + area.height);
      ctx.stroke();
    }

    // 水平网格线
    const gridSpacingY = area.height / gridCount;
    for (let i = 0; i <= gridCount; i++) {
      const y = area.y + i * gridSpacingY;
      ctx.beginPath();
      ctx.moveTo(area.x, y);
      ctx.lineTo(area.x + area.width, y);
      ctx.stroke();
    }

    // 绘制坐标轴
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;

    // X轴
    ctx.beginPath();
    ctx.moveTo(area.x, area.y + area.height);
    ctx.lineTo(area.x + area.width, area.y + area.height);
    ctx.stroke();

    // Y轴
    ctx.beginPath();
    ctx.moveTo(area.x, area.y);
    ctx.lineTo(area.x, area.y + area.height);
    ctx.stroke();

    // 绘制箭头
    ctx.fillStyle = '#333333';

    // X轴箭头
    ctx.beginPath();
    ctx.moveTo(area.x + area.width + 10, area.y + area.height);
    ctx.lineTo(area.x + area.width - 5, area.y + area.height - 5);
    ctx.lineTo(area.x + area.width - 5, area.y + area.height + 5);
    ctx.closePath();
    ctx.fill();

    // Y轴箭头
    ctx.beginPath();
    ctx.moveTo(area.x, area.y - 10);
    ctx.lineTo(area.x - 5, area.y + 5);
    ctx.lineTo(area.x + 5, area.y + 5);
    ctx.closePath();
    ctx.fill();

    // 绘制刻度和标签
    ctx.fillStyle = '#666666';
    ctx.font = '12px system-ui';
    ctx.textAlign = 'center';

    // X轴刻度 (0-100)
    for (let i = 0; i <= gridCount; i++) {
      const x = area.x + i * gridSpacingX;
      const value = ((i * this.COORD_MAX) / gridCount).toFixed(0);

      ctx.beginPath();
      ctx.moveTo(x, area.y + area.height);
      ctx.lineTo(x, area.y + area.height + 5);
      ctx.stroke();

      ctx.fillText(value, x, area.y + area.height + 20);
    }

    // Y轴刻度 (0-100)
    ctx.textAlign = 'right';
    for (let i = 0; i <= gridCount; i++) {
      const y = area.y + area.height - i * gridSpacingY;
      const value = ((i * this.COORD_MAX) / gridCount).toFixed(0);

      ctx.beginPath();
      ctx.moveTo(area.x - 5, y);
      ctx.lineTo(area.x, y);
      ctx.stroke();

      ctx.fillText(value, area.x - 10, y + 4);
    }

    // 轴标签
    ctx.fillStyle = '#333333';
    ctx.font = 'bold 14px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('x', area.x + area.width / 2, area.y + area.height + 45);

    ctx.save();
    ctx.translate(25, area.y + area.height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('y', 0, 0);
    ctx.restore();

    // 原点标签
    ctx.font = '12px system-ui';
    ctx.fillStyle = '#666666';
    ctx.fillText('O', area.x - 15, area.y + area.height + 20);
  }

  private drawControlPolygon(): void {
    if (!this.ctx) return;

    const ctx = this.ctx;
    const points = this.controlPoints;

    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    const canvasPoints = points.map((p) => this.coordToCanvas(p));

    ctx.beginPath();
    ctx.moveTo(canvasPoints[0].x, canvasPoints[0].y);
    for (let i = 1; i < canvasPoints.length; i++) {
      ctx.lineTo(canvasPoints[i].x, canvasPoints[i].y);
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
      const canvasPos = this.coordToCanvas(p);

      // 绘制外圈
      ctx.beginPath();
      ctx.arc(canvasPos.x, canvasPos.y, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 绘制内圈
      ctx.beginPath();
      ctx.arc(canvasPos.x, canvasPos.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#3b82f6';
      ctx.fill();

      // 绘制标签
      ctx.fillStyle = '#1e40af';
      ctx.font = 'bold 14px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(`P${i}`, canvasPos.x, canvasPos.y - 18);

      // 显示坐标 (0-100)
      ctx.font = '11px system-ui';
      ctx.fillStyle = '#666666';
      ctx.fillText(
        `(${p.x.toFixed(0)}, ${p.y.toFixed(0)})`,
        canvasPos.x,
        canvasPos.y + 28
      );
    }
  }

  private drawDeCasteljauLines(t: number): void {
    if (!this.ctx || t <= 0) return;

    const ctx = this.ctx;
    const points = this.controlPoints;

    // 颜色梯度
    const colors = ['#ef4444', '#f97316', '#22c55e'];

    // De Casteljau算法递归计算
    let currentLevel = [...points];
    let level = 0;

    while (currentLevel.length > 1) {
      const nextLevel: { x: number; y: number }[] = [];

      // 转换为画布坐标
      const canvasPoints = currentLevel.map((p) => this.coordToCanvas(p));

      // 绘制当前层的连线
      ctx.strokeStyle = colors[level % colors.length];
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.6;

      ctx.beginPath();
      ctx.moveTo(canvasPoints[0].x, canvasPoints[0].y);
      for (let i = 1; i < canvasPoints.length; i++) {
        ctx.lineTo(canvasPoints[i].x, canvasPoints[i].y);
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
        const canvasInterpolated = this.coordToCanvas(interpolated);
        ctx.beginPath();
        ctx.arc(canvasInterpolated.x, canvasInterpolated.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = colors[level % colors.length];
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      currentLevel = nextLevel;
      level++;
    }
  }

  private drawCurve(): void {
    if (!this.ctx || this.drawnPoints.length < 2) return;

    const ctx = this.ctx;

    ctx.strokeStyle = this.bezierConfig.curveColor || '#3b82f6';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const canvasPoints = this.drawnPoints.map((p) => this.coordToCanvas(p));

    ctx.beginPath();
    ctx.moveTo(canvasPoints[0].x, canvasPoints[0].y);
    for (let i = 1; i < canvasPoints.length; i++) {
      ctx.lineTo(canvasPoints[i].x, canvasPoints[i].y);
    }
    ctx.stroke();

    // 绘制曲线上的采样点（小圆点）- 显示曲线是由点连接而成
    ctx.fillStyle = this.bezierConfig.curveColor || '#3b82f6';
    for (let i = 0; i < canvasPoints.length; i += 5) {
      const point = canvasPoints[i];
      ctx.beginPath();
      ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private drawCurrentPoint(point: { x: number; y: number; t: number }): void {
    if (!this.ctx) return;

    const ctx = this.ctx;
    const canvasPos = this.coordToCanvas(point);

    // 绘制发光效果
    const gradient = ctx.createRadialGradient(
      canvasPos.x,
      canvasPos.y,
      0,
      canvasPos.x,
      canvasPos.y,
      20
    );
    gradient.addColorStop(0, 'rgba(239, 68, 68, 0.5)');
    gradient.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.beginPath();
    ctx.arc(canvasPos.x, canvasPos.y, 20, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // 绘制当前点
    ctx.beginPath();
    ctx.arc(canvasPos.x, canvasPos.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 显示当前t值
    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 12px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText(`t = ${point.t.toFixed(2)}`, canvasPos.x + 15, canvasPos.y - 5);
  }

  private drawHoveredPoint(point: { x: number; y: number; t: number }): void {
    if (!this.ctx) return;

    const ctx = this.ctx;
    const canvasPos = this.coordToCanvas(point);

    // 绘制高亮圈
    ctx.beginPath();
    ctx.arc(canvasPos.x, canvasPos.y, 15, 0, Math.PI * 2);
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 绘制内点
    ctx.beginPath();
    ctx.arc(canvasPos.x, canvasPos.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();
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
