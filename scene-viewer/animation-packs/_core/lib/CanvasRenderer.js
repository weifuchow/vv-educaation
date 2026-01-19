/**
 * CanvasRenderer - Canvas 渲染器基类
 * 提供 Canvas 初始化、高 DPI 支持、事件处理等基础能力
 */
export class CanvasRenderer {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      backgroundColor: 'transparent',
      padding: 40,
      ...options,
    };

    this.canvas = null;
    this.ctx = null;
    this.width = 0;
    this.height = 0;
    this.dpr = window.devicePixelRatio || 1;

    // 状态
    this.isInitialized = false;
    this.animationId = null;
    this.isPlaying = false;

    // 事件回调
    this.eventHandlers = new Map();
  }

  /**
   * 初始化 Canvas
   */
  initialize() {
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
  resize() {
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
  _bindMouseEvents() {
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
  _getMousePos(e) {
    const rect = this.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  /**
   * 注册事件处理器
   */
  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push(handler);
  }

  /**
   * 触发事件
   */
  _emit(event, data) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach((handler) => handler(data));
    }
  }

  /**
   * 清空画布
   */
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  /**
   * 开始动画循环
   */
  startAnimation(callback) {
    if (this.isPlaying) return;
    this.isPlaying = true;

    const animate = () => {
      if (!this.isPlaying) return;
      callback();
      this.animationId = requestAnimationFrame(animate);
    };

    animate();
  }

  /**
   * 停止动画循环
   */
  stopAnimation() {
    this.isPlaying = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * 渲染（子类实现）
   */
  render() {
    // 子类实现
  }

  /**
   * 销毁
   */
  destroy() {
    this.stopAnimation();
    window.removeEventListener('resize', this._resizeHandler);
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    this.eventHandlers.clear();
    this.isInitialized = false;
  }
}

export default CanvasRenderer;
