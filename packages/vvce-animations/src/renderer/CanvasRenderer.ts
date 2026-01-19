/**
 * CanvasRenderer - Canvas 渲染器基类
 * 提供 Canvas 初始化、高 DPI 支持、事件处理等基础能力
 */

import type { Point2D } from '../math/vector';

export interface CanvasRendererOptions {
  backgroundColor?: string;
  padding?: number;
}

export type CanvasEventHandler = (pos: Point2D | null) => void;

export class CanvasRenderer {
  protected container: HTMLElement;
  protected options: Required<CanvasRendererOptions>;
  protected canvas: HTMLCanvasElement | null = null;
  protected ctx: CanvasRenderingContext2D | null = null;
  protected width = 0;
  protected height = 0;
  protected dpr: number;
  protected isInitialized = false;
  protected animationId: number | null = null;
  protected isPlaying = false;
  protected eventHandlers = new Map<string, CanvasEventHandler[]>();
  private _resizeHandler: (() => void) | null = null;

  constructor(container: HTMLElement, options: CanvasRendererOptions = {}) {
    this.container = container;
    this.options = {
      backgroundColor: 'transparent',
      padding: 40,
      ...options,
    };
    this.dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
  }

  /**
   * 初始化 Canvas
   */
  initialize(): void {
    if (this.isInitialized) return;

    // 创建 Canvas 元素
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'vvce-canvas';
    this.container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');

    // 设置尺寸
    this.resize();

    // 监听窗口大小变化
    this._resizeHandler = () => this.resize();
    window.addEventListener('resize', this._resizeHandler);

    // 绑定鼠标事件
    this._bindMouseEvents();

    this.isInitialized = true;
  }

  /**
   * 调整 Canvas 尺寸（支持高 DPI）
   */
  resize(): void {
    if (!this.canvas || !this.ctx) return;

    const rect = this.container.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;

    // 高 DPI 支持
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.scale(this.dpr, this.dpr);

    // 触发重绘
    this.render();
  }

  /**
   * 绑定鼠标事件
   */
  private _bindMouseEvents(): void {
    if (!this.canvas) return;

    this.canvas.addEventListener('mousemove', (e) => {
      const pos = this._getMousePos(e);
      this._emit('mousemove', pos);
    });

    this.canvas.addEventListener('mousedown', (e) => {
      const pos = this._getMousePos(e);
      this._emit('mousedown', pos);
    });

    this.canvas.addEventListener('mouseup', (e) => {
      const pos = this._getMousePos(e);
      this._emit('mouseup', pos);
    });

    this.canvas.addEventListener('mouseleave', () => {
      this._emit('mouseleave', null);
    });

    this.canvas.addEventListener('click', (e) => {
      const pos = this._getMousePos(e);
      this._emit('click', pos);
    });
  }

  /**
   * 获取鼠标位置
   */
  private _getMousePos(e: MouseEvent): Point2D {
    if (!this.canvas) return { x: 0, y: 0 };
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  /**
   * 注册事件处理器
   */
  on(event: string, handler: CanvasEventHandler): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  /**
   * 触发事件
   */
  protected _emit(event: string, data: Point2D | null): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach((handler) => handler(data));
    }
  }

  /**
   * 清空画布
   */
  clear(): void {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  /**
   * 开始动画循环
   */
  startAnimation(callback: () => void): void {
    if (this.isPlaying) return;
    this.isPlaying = true;

    const animate = (): void => {
      if (!this.isPlaying) return;
      callback();
      this.animationId = requestAnimationFrame(animate);
    };

    animate();
  }

  /**
   * 停止动画循环
   */
  stopAnimation(): void {
    this.isPlaying = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * 渲染（子类实现）
   */
  render(): void {
    // 子类实现
  }

  /**
   * 销毁
   */
  destroy(): void {
    this.stopAnimation();
    if (this._resizeHandler) {
      window.removeEventListener('resize', this._resizeHandler);
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    this.eventHandlers.clear();
    this.isInitialized = false;
  }
}
