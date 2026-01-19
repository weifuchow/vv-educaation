/**
 * BezierCurve Animation Module
 * 贝塞尔曲线交互式动画 - 展示曲线生成过程
 *
 * 功能特性:
 * - 展示贝塞尔曲线的生成过程（de Casteljau 算法可视化）
 * - 控制点可拖拽
 * - 参数可调（曲线阶数、动画速度等）
 * - 鼠标悬停显示坐标和 t 值
 * - 模拟运动轨迹
 */

import type { AnimationMetadata } from '../types';
import type {
  AnimationModule,
  AnimationAssets,
  WebAnimationConfig,
  IAnimationRenderer,
} from '../standards/AnimationStandard';

// ============= 类型定义 =============

interface Point {
  x: number;
  y: number;
}

interface BezierParams {
  /** 控制点数组 */
  controlPoints?: Point[];
  /** 动画持续时间（毫秒） */
  duration?: number;
  /** 是否显示控制点 */
  showControlPoints?: boolean;
  /** 是否显示控制线 */
  showControlLines?: boolean;
  /** 是否显示 de Casteljau 构造过程 */
  showConstruction?: boolean;
  /** 是否显示运动轨迹上的点 */
  showMovingPoint?: boolean;
  /** 曲线颜色 */
  curveColor?: string;
  /** 控制点颜色 */
  controlPointColor?: string;
  /** 背景颜色 */
  backgroundColor?: string;
  /** 是否显示网格 */
  showGrid?: boolean;
  /** 网格大小 */
  gridSize?: number;
}

// ============= 元数据 =============

const metadata: AnimationMetadata = {
  id: 'math.bezier-curve',
  category: 'math',
  name: '贝塞尔曲线',
  description:
    '交互式贝塞尔曲线可视化，展示曲线生成过程、de Casteljau 算法，支持拖拽控制点',
  author: 'VV Education',
  version: '1.0.0',
  tags: ['bezier', 'curve', 'math', 'geometry', 'interactive', 'animation'],
};

// ============= CSS 样式 =============

const styles = `
.bezier-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
  background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 12px;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', sans-serif;
}

.bezier-canvas {
  display: block;
  width: 100%;
  height: 100%;
  cursor: crosshair;
}

.bezier-info-panel {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  padding: 12px 16px;
  border-radius: 8px;
  color: #fff;
  font-size: 13px;
  pointer-events: none;
  min-width: 180px;
}

.bezier-info-title {
  font-weight: 600;
  color: #4ecdc4;
  margin-bottom: 8px;
  font-size: 14px;
}

.bezier-info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.bezier-info-label {
  color: #aaa;
}

.bezier-info-value {
  color: #fff;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 12px;
}

.bezier-hover-tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  padding: 8px 12px;
  border-radius: 6px;
  color: #fff;
  font-size: 12px;
  pointer-events: none;
  z-index: 100;
  white-space: nowrap;
  transform: translate(-50%, -100%);
  margin-top: -10px;
  border: 1px solid rgba(78, 205, 196, 0.5);
}

.bezier-hover-tooltip::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 6px 6px 0;
  border-style: solid;
  border-color: rgba(0, 0, 0, 0.85) transparent transparent;
}

.bezier-controls {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  padding: 8px 12px;
  border-radius: 8px;
}

.bezier-btn {
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  color: #fff;
}

.bezier-btn-primary {
  background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
}

.bezier-btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(78, 205, 196, 0.4);
}

.bezier-btn-secondary {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.bezier-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.25);
}

.bezier-btn-secondary.active {
  background: rgba(78, 205, 196, 0.3);
  border-color: #4ecdc4;
}

.bezier-slider-container {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  padding: 10px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.bezier-slider-label {
  color: #aaa;
  font-size: 12px;
  white-space: nowrap;
}

.bezier-slider {
  width: 200px;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  outline: none;
}

.bezier-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #4ecdc4;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(78, 205, 196, 0.5);
}

.bezier-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #4ecdc4;
  cursor: pointer;
  border: none;
}

.bezier-slider-value {
  color: #4ecdc4;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 12px;
  min-width: 50px;
}

.bezier-legend {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 11px;
}

.bezier-legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  color: #ccc;
}

.bezier-legend-item:last-child {
  margin-bottom: 0;
}

.bezier-legend-color {
  width: 16px;
  height: 3px;
  border-radius: 1px;
}

.bezier-legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
`;

// ============= 资源定义 =============

const assets: AnimationAssets = {
  styles,
};

// ============= 渲染器实现 =============

class BezierCurveRenderer implements IAnimationRenderer {
  readonly id = 'math.bezier-curve';

  private container: HTMLElement;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private params: BezierParams;
  private config: WebAnimationConfig;

  // 状态
  private controlPoints: Point[] = [];
  private animationId: number | null = null;
  private t: number = 0;
  private isPlaying: boolean = false;
  private showConstruction: boolean = true;
  private draggingPointIndex: number = -1;

  // 鼠标状态
  private mousePos: Point | null = null;
  private hoverT: number | null = null;
  private isHoveringCurve: boolean = false;

  // 尺寸
  private width: number = 0;
  private height: number = 0;
  private padding: number = 40;

  constructor(config: WebAnimationConfig) {
    this.container = config.container;
    this.config = config;
    this.params = {
      duration: 3000,
      showControlPoints: true,
      showControlLines: true,
      showConstruction: true,
      showMovingPoint: true,
      curveColor: '#4ecdc4',
      controlPointColor: '#ff6b6b',
      backgroundColor: 'transparent',
      showGrid: true,
      gridSize: 50,
      ...config.params,
    };

    // 默认控制点（三次贝塞尔曲线）
    this.controlPoints = this.params.controlPoints || [];
  }

  getHtml(): string {
    return `
      <div class="bezier-container">
        <canvas class="bezier-canvas"></canvas>
        <div class="bezier-info-panel">
          <div class="bezier-info-title">📐 贝塞尔曲线参数</div>
          <div class="bezier-info-row">
            <span class="bezier-info-label">阶数 (n)</span>
            <span class="bezier-info-value" data-info="order">3</span>
          </div>
          <div class="bezier-info-row">
            <span class="bezier-info-label">t 值</span>
            <span class="bezier-info-value" data-info="t">0.000</span>
          </div>
          <div class="bezier-info-row">
            <span class="bezier-info-label">曲线点</span>
            <span class="bezier-info-value" data-info="point">-</span>
          </div>
        </div>
        <div class="bezier-legend">
          <div class="bezier-legend-item">
            <span class="bezier-legend-dot" style="background: #ff6b6b;"></span>
            <span>控制点（可拖拽）</span>
          </div>
          <div class="bezier-legend-item">
            <span class="bezier-legend-color" style="background: rgba(255,255,255,0.3);"></span>
            <span>控制线</span>
          </div>
          <div class="bezier-legend-item">
            <span class="bezier-legend-color" style="background: #4ecdc4;"></span>
            <span>贝塞尔曲线</span>
          </div>
          <div class="bezier-legend-item">
            <span class="bezier-legend-dot" style="background: #ffe66d;"></span>
            <span>构造过程</span>
          </div>
        </div>
        <div class="bezier-hover-tooltip" style="display: none;"></div>
        <div class="bezier-slider-container">
          <span class="bezier-slider-label">t 值：</span>
          <input type="range" class="bezier-slider" min="0" max="100" value="0" data-control="t-slider">
          <span class="bezier-slider-value">0.00</span>
        </div>
        <div class="bezier-controls">
          <button class="bezier-btn bezier-btn-primary" data-control="play">▶ 播放</button>
          <button class="bezier-btn bezier-btn-secondary" data-control="reset">↺ 重置</button>
          <button class="bezier-btn bezier-btn-secondary active" data-control="construction">构造线</button>
          <button class="bezier-btn bezier-btn-secondary" data-control="add-point">+ 控制点</button>
          <button class="bezier-btn bezier-btn-secondary" data-control="remove-point">- 控制点</button>
        </div>
      </div>
    `;
  }

  initialize(): void {
    this.loadStyles();

    this.canvas = this.container.querySelector('.bezier-canvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) return;

    this.setupCanvas();
    this.initControlPoints();
    this.bindEvents();
    this.render();

    if (this.config.autoplay) {
      setTimeout(() => this.start(), 500);
    }
  }

  private loadStyles(): void {
    const styleId = 'vvce-animation-bezier-curve';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = styles;
    document.head.appendChild(style);
  }

  private setupCanvas(): void {
    if (!this.canvas) return;

    const rect = this.canvas.parentElement!.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;

    // 高 DPI 支持
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx!.scale(dpr, dpr);
  }

  private initControlPoints(): void {
    if (this.controlPoints.length > 0) return;

    // 默认四个控制点（三次贝塞尔）
    const w = this.width - this.padding * 2;
    const h = this.height - this.padding * 2;
    const ox = this.padding;
    const oy = this.padding;

    this.controlPoints = [
      { x: ox + w * 0.1, y: oy + h * 0.8 },
      { x: ox + w * 0.3, y: oy + h * 0.1 },
      { x: ox + w * 0.7, y: oy + h * 0.1 },
      { x: ox + w * 0.9, y: oy + h * 0.8 },
    ];

    this.updateOrderDisplay();
  }

  private bindEvents(): void {
    if (!this.canvas) return;

    // 鼠标移动
    this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
    this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
    this.canvas.addEventListener('mouseleave', this.handleMouseLeave.bind(this));

    // 控制按钮
    const controls = this.container.querySelectorAll('[data-control]');
    controls.forEach((el) => {
      el.addEventListener('click', (e) => {
        const controlId = (e.target as HTMLElement).dataset.control;
        if (controlId) this.handleControl(controlId, e.target as HTMLElement);
      });
    });

    // t 值滑块
    const slider = this.container.querySelector(
      '[data-control="t-slider"]'
    ) as HTMLInputElement;
    if (slider) {
      slider.addEventListener('input', () => {
        this.t = parseFloat(slider.value) / 100;
        this.updateSliderDisplay();
        this.render();
      });
    }

    // 窗口大小变化
    window.addEventListener('resize', () => {
      this.setupCanvas();
      this.render();
    });
  }

  private handleMouseMove(e: MouseEvent): void {
    const rect = this.canvas!.getBoundingClientRect();
    this.mousePos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    // 拖拽控制点
    if (this.draggingPointIndex >= 0) {
      this.controlPoints[this.draggingPointIndex] = { ...this.mousePos };
      this.render();
      return;
    }

    // 检测曲线上的悬停点
    this.checkCurveHover();
    this.render();
  }

  private handleMouseDown(e: MouseEvent): void {
    const rect = this.canvas!.getBoundingClientRect();
    const mousePos = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    // 检测是否点击了控制点
    for (let i = 0; i < this.controlPoints.length; i++) {
      const p = this.controlPoints[i];
      const dist = Math.sqrt((p.x - mousePos.x) ** 2 + (p.y - mousePos.y) ** 2);
      if (dist < 15) {
        this.draggingPointIndex = i;
        this.canvas!.style.cursor = 'grabbing';
        return;
      }
    }
  }

  private handleMouseUp(): void {
    this.draggingPointIndex = -1;
    this.canvas!.style.cursor = 'crosshair';
  }

  private handleMouseLeave(): void {
    this.mousePos = null;
    this.hoverT = null;
    this.isHoveringCurve = false;
    this.draggingPointIndex = -1;
    this.hideTooltip();
    this.render();
  }

  private checkCurveHover(): void {
    if (!this.mousePos) {
      this.hoverT = null;
      this.isHoveringCurve = false;
      return;
    }

    // 在曲线上找最近点
    let minDist = Infinity;
    let closestT = 0;

    for (let i = 0; i <= 100; i++) {
      const testT = i / 100;
      const point = this.computeBezierPoint(this.controlPoints, testT);
      const dist = Math.sqrt(
        (point.x - this.mousePos.x) ** 2 + (point.y - this.mousePos.y) ** 2
      );
      if (dist < minDist) {
        minDist = dist;
        closestT = testT;
      }
    }

    // 精细搜索
    for (let i = -10; i <= 10; i++) {
      const testT = Math.max(0, Math.min(1, closestT + i / 1000));
      const point = this.computeBezierPoint(this.controlPoints, testT);
      const dist = Math.sqrt(
        (point.x - this.mousePos.x) ** 2 + (point.y - this.mousePos.y) ** 2
      );
      if (dist < minDist) {
        minDist = dist;
        closestT = testT;
      }
    }

    if (minDist < 20) {
      this.hoverT = closestT;
      this.isHoveringCurve = true;
      this.showTooltip(closestT);
    } else {
      this.hoverT = null;
      this.isHoveringCurve = false;
      this.hideTooltip();
    }
  }

  private showTooltip(t: number): void {
    const tooltip = this.container.querySelector('.bezier-hover-tooltip') as HTMLElement;
    if (!tooltip) return;

    const point = this.computeBezierPoint(this.controlPoints, t);
    tooltip.innerHTML = `
      <div><strong>t = ${t.toFixed(3)}</strong></div>
      <div>x: ${point.x.toFixed(1)}, y: ${point.y.toFixed(1)}</div>
    `;
    tooltip.style.display = 'block';
    tooltip.style.left = `${point.x}px`;
    tooltip.style.top = `${point.y}px`;
  }

  private hideTooltip(): void {
    const tooltip = this.container.querySelector('.bezier-hover-tooltip') as HTMLElement;
    if (tooltip) {
      tooltip.style.display = 'none';
    }
  }

  handleControl(controlId: string, element: HTMLElement): void {
    switch (controlId) {
      case 'play':
        if (this.isPlaying) {
          this.pause();
          element.textContent = '▶ 播放';
        } else {
          this.start();
          element.textContent = '⏸ 暂停';
        }
        break;
      case 'reset': {
        this.reset();
        const playBtn = this.container.querySelector(
          '[data-control="play"]'
        ) as HTMLElement;
        if (playBtn) playBtn.textContent = '▶ 播放';
        break;
      }
      case 'construction':
        this.showConstruction = !this.showConstruction;
        element.classList.toggle('active', this.showConstruction);
        this.render();
        break;
      case 'add-point':
        this.addControlPoint();
        break;
      case 'remove-point':
        this.removeControlPoint();
        break;
    }
  }

  private addControlPoint(): void {
    if (this.controlPoints.length >= 7) return;

    // 在最后两个点之间添加
    const last = this.controlPoints[this.controlPoints.length - 1];
    const secondLast = this.controlPoints[this.controlPoints.length - 2];
    const newPoint = {
      x: (last.x + secondLast.x) / 2,
      y: (last.y + secondLast.y) / 2 - 50,
    };
    this.controlPoints.splice(this.controlPoints.length - 1, 0, newPoint);
    this.updateOrderDisplay();
    this.render();
  }

  private removeControlPoint(): void {
    if (this.controlPoints.length <= 2) return;
    this.controlPoints.splice(this.controlPoints.length - 2, 1);
    this.updateOrderDisplay();
    this.render();
  }

  private updateOrderDisplay(): void {
    const orderEl = this.container.querySelector('[data-info="order"]');
    if (orderEl) {
      orderEl.textContent = String(this.controlPoints.length - 1);
    }
  }

  private updateSliderDisplay(): void {
    const sliderValue = this.container.querySelector('.bezier-slider-value');
    if (sliderValue) {
      sliderValue.textContent = this.t.toFixed(2);
    }

    const tInfo = this.container.querySelector('[data-info="t"]');
    if (tInfo) {
      tInfo.textContent = this.t.toFixed(3);
    }

    const point = this.computeBezierPoint(this.controlPoints, this.t);
    const pointInfo = this.container.querySelector('[data-info="point"]');
    if (pointInfo) {
      pointInfo.textContent = `(${point.x.toFixed(0)}, ${point.y.toFixed(0)})`;
    }
  }

  start(): void {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.animate();
  }

  stop(): void {
    this.isPlaying = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  pause(): void {
    this.stop();
  }

  resume(): void {
    this.start();
  }

  reset(): void {
    this.stop();
    this.t = 0;
    this.updateSliderValue(0);
    this.updateSliderDisplay();
    this.render();
  }

  private updateSliderValue(value: number): void {
    const slider = this.container.querySelector(
      '[data-control="t-slider"]'
    ) as HTMLInputElement;
    if (slider) {
      slider.value = String(value * 100);
    }
  }

  destroy(): void {
    this.stop();
    // 清理事件监听器会在容器销毁时自动清理
  }

  private animate(): void {
    if (!this.isPlaying) return;

    const duration = this.params.duration || 3000;
    const step = 1000 / 60 / duration; // 每帧增量

    this.t += step;
    if (this.t > 1) {
      this.t = 0;
    }

    this.updateSliderValue(this.t);
    this.updateSliderDisplay();
    this.render();

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  private render(): void {
    if (!this.ctx) return;

    const ctx = this.ctx;

    // 清空画布
    ctx.clearRect(0, 0, this.width, this.height);

    // 绘制网格
    if (this.params.showGrid) {
      this.drawGrid();
    }

    // 绘制控制线
    if (this.params.showControlLines) {
      this.drawControlLines();
    }

    // 绘制贝塞尔曲线
    this.drawBezierCurve();

    // 绘制 de Casteljau 构造过程
    if (this.showConstruction && this.params.showConstruction) {
      this.drawConstruction();
    }

    // 绘制控制点
    if (this.params.showControlPoints) {
      this.drawControlPoints();
    }

    // 绘制当前点
    if (this.params.showMovingPoint) {
      this.drawMovingPoint();
    }

    // 绘制悬停点
    if (this.isHoveringCurve && this.hoverT !== null) {
      this.drawHoverPoint();
    }
  }

  private drawGrid(): void {
    const ctx = this.ctx!;
    const gridSize = this.params.gridSize || 50;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;

    // 垂直线
    for (let x = 0; x < this.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }

    // 水平线
    for (let y = 0; y < this.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }
  }

  private drawControlLines(): void {
    const ctx = this.ctx!;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    ctx.beginPath();
    ctx.moveTo(this.controlPoints[0].x, this.controlPoints[0].y);
    for (let i = 1; i < this.controlPoints.length; i++) {
      ctx.lineTo(this.controlPoints[i].x, this.controlPoints[i].y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }

  private drawBezierCurve(): void {
    const ctx = this.ctx!;
    ctx.strokeStyle = this.params.curveColor || '#4ecdc4';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';

    ctx.beginPath();
    const startPoint = this.computeBezierPoint(this.controlPoints, 0);
    ctx.moveTo(startPoint.x, startPoint.y);

    for (let i = 1; i <= 100; i++) {
      const point = this.computeBezierPoint(this.controlPoints, i / 100);
      ctx.lineTo(point.x, point.y);
    }
    ctx.stroke();

    // 绘制已经过的部分（更亮）
    if (this.t > 0) {
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(startPoint.x, startPoint.y);
      for (let i = 1; i <= Math.floor(this.t * 100); i++) {
        const point = this.computeBezierPoint(this.controlPoints, i / 100);
        ctx.lineTo(point.x, point.y);
      }
      ctx.stroke();
    }
  }

  private drawConstruction(): void {
    const ctx = this.ctx!;
    const levels = this.computeDeCasteljauLevels(this.controlPoints, this.t);

    // 绘制每一层的线和点
    const colors = [
      'rgba(255, 107, 107, 0.6)',
      'rgba(255, 230, 109, 0.6)',
      'rgba(120, 200, 255, 0.6)',
      'rgba(200, 150, 255, 0.6)',
      'rgba(150, 255, 150, 0.6)',
    ];

    for (let i = 1; i < levels.length - 1; i++) {
      const level = levels[i];
      const color = colors[(i - 1) % colors.length];

      // 绘制连接线
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(level[0].x, level[0].y);
      for (let j = 1; j < level.length; j++) {
        ctx.lineTo(level[j].x, level[j].y);
      }
      ctx.stroke();

      // 绘制中间点
      ctx.fillStyle = color;
      for (const point of level) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  private drawControlPoints(): void {
    const ctx = this.ctx!;
    const color = this.params.controlPointColor || '#ff6b6b';

    for (let i = 0; i < this.controlPoints.length; i++) {
      const p = this.controlPoints[i];
      const isHovered =
        this.mousePos &&
        Math.sqrt((p.x - this.mousePos.x) ** 2 + (p.y - this.mousePos.y) ** 2) < 15;
      const isDragging = i === this.draggingPointIndex;

      // 外圈（悬停/拖拽效果）
      if (isHovered || isDragging) {
        ctx.fillStyle = 'rgba(255, 107, 107, 0.3)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, 18, 0, Math.PI * 2);
        ctx.fill();
      }

      // 主圆点
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
      ctx.fill();

      // 白色边框
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 标签
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`P${i}`, p.x, p.y);
    }
  }

  private drawMovingPoint(): void {
    const ctx = this.ctx!;
    const point = this.computeBezierPoint(this.controlPoints, this.t);

    // 发光效果
    const gradient = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, 20);
    gradient.addColorStop(0, 'rgba(255, 230, 109, 0.8)');
    gradient.addColorStop(0.5, 'rgba(255, 230, 109, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 230, 109, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 20, 0, Math.PI * 2);
    ctx.fill();

    // 主点
    ctx.fillStyle = '#ffe66d';
    ctx.beginPath();
    ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  private drawHoverPoint(): void {
    if (this.hoverT === null) return;

    const ctx = this.ctx!;
    const point = this.computeBezierPoint(this.controlPoints, this.hoverT);

    // 悬停点
    ctx.fillStyle = 'rgba(78, 205, 196, 0.8)';
    ctx.beginPath();
    ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  /**
   * 计算贝塞尔曲线上的点（de Casteljau 算法）
   */
  private computeBezierPoint(points: Point[], t: number): Point {
    if (points.length === 1) {
      return points[0];
    }

    const newPoints: Point[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      newPoints.push({
        x: (1 - t) * points[i].x + t * points[i + 1].x,
        y: (1 - t) * points[i].y + t * points[i + 1].y,
      });
    }

    return this.computeBezierPoint(newPoints, t);
  }

  /**
   * 计算 de Casteljau 算法的所有中间层
   */
  private computeDeCasteljauLevels(points: Point[], t: number): Point[][] {
    const levels: Point[][] = [points];
    let currentLevel = points;

    while (currentLevel.length > 1) {
      const newLevel: Point[] = [];
      for (let i = 0; i < currentLevel.length - 1; i++) {
        newLevel.push({
          x: (1 - t) * currentLevel[i].x + t * currentLevel[i + 1].x,
          y: (1 - t) * currentLevel[i].y + t * currentLevel[i + 1].y,
        });
      }
      levels.push(newLevel);
      currentLevel = newLevel;
    }

    return levels;
  }
}

// ============= 模块导出 =============

export const BezierCurveModule: AnimationModule = {
  metadata,
  assets,
  createRenderer: (config: WebAnimationConfig) => new BezierCurveRenderer(config),
};

export default BezierCurveModule;
