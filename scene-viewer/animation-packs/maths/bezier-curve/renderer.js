/**
 * Bezier Curve Interactive Animation Renderer
 * 贝塞尔曲线交互式动画渲染器
 *
 * 使用 @vvce/core 核心库构建，展示：
 * - 贝塞尔曲线生成过程
 * - de Casteljau 算法可视化
 * - 可拖拽控制点
 * - 悬停显示 t 值和坐标
 */

// 导入核心库（运行时动态加载）
let CanvasRenderer, Grid, PointManager, Curve, Tooltip, Slider, Button, InfoPanel;
let bezierMath;

/**
 * 贝塞尔曲线动画类
 */
export class BezierCurveAnimation {
  constructor(container, params = {}) {
    this.container = container;
    this.params = {
      duration: 3000,
      showGrid: true,
      showControlLines: true,
      showConstruction: true,
      showMovingPoint: true,
      curveColor: '#4ecdc4',
      controlPointColor: '#ff6b6b',
      gridSize: 50,
      autoplay: false,
      controlPoints: null,
      ...params,
    };

    // 状态
    this.t = 0;
    this.isPlaying = false;
    this.showConstruction = this.params.showConstruction;

    // 组件（初始化后设置）
    this.canvas = null;
    this.ctx = null;
    this.grid = null;
    this.pointManager = null;
    this.curve = null;
    this.tooltip = null;
    this.infoPanel = null;
    this.tSlider = null;

    // 尺寸
    this.width = 0;
    this.height = 0;
    this.padding = 40;

    // 动画
    this.animationId = null;

    // 悬停状态
    this.hoverT = null;
    this.isHoveringCurve = false;
    this.mousePos = null;

    // 事件回调
    this.eventCallbacks = new Map();
  }

  /**
   * 初始化（异步加载核心库）
   */
  async initialize() {
    // 动态加载核心库
    await this._loadCore();

    // 创建 DOM 结构
    this._createDOM();

    // 初始化 Canvas
    this._initCanvas();

    // 初始化组件
    this._initComponents();

    // 绑定事件
    this._bindEvents();

    // 初始渲染
    this.render();

    // 自动播放
    if (this.params.autoplay) {
      setTimeout(() => this.start(), 500);
    }
  }

  /**
   * 动态加载核心库
   */
  async _loadCore() {
    const corePath = '../../_core/lib';

    // 加载模块
    const [
      canvasModule,
      gridModule,
      pointModule,
      curveModule,
      tooltipModule,
      controlsModule,
      bezierModule,
    ] = await Promise.all([
      import(`${corePath}/CanvasRenderer.js`),
      import(`${corePath}/Grid.js`),
      import(`${corePath}/Point.js`),
      import(`${corePath}/Curve.js`),
      import(`${corePath}/Tooltip.js`),
      import(`${corePath}/Controls.js`),
      import(`${corePath}/math/bezier.js`),
    ]);

    CanvasRenderer = canvasModule.CanvasRenderer;
    Grid = gridModule.Grid;
    PointManager = pointModule.PointManager;
    Curve = curveModule.Curve;
    Tooltip = tooltipModule.Tooltip;
    Slider = controlsModule.Slider;
    Button = controlsModule.Button;
    InfoPanel = controlsModule.InfoPanel;
    bezierMath = bezierModule;
  }

  /**
   * 创建 DOM 结构
   */
  _createDOM() {
    this.container.innerHTML = `
      <div class="vvce-animation-container bezier-container">
        <div class="canvas-wrapper"></div>
        <div class="info-panel-container"></div>
        <div class="legend-container"></div>
        <div class="slider-container"></div>
        <div class="controls-container"></div>
      </div>
    `;

    // 添加图例
    const legendContainer = this.container.querySelector('.legend-container');
    legendContainer.innerHTML = `
      <div class="vvce-legend">
        <div class="vvce-legend-item">
          <span class="vvce-legend-dot" style="background: ${this.params.controlPointColor};"></span>
          <span>控制点（可拖拽）</span>
        </div>
        <div class="vvce-legend-item">
          <span class="vvce-legend-color" style="background: rgba(255,255,255,0.3);"></span>
          <span>控制线</span>
        </div>
        <div class="vvce-legend-item">
          <span class="vvce-legend-color" style="background: ${this.params.curveColor};"></span>
          <span>贝塞尔曲线</span>
        </div>
        <div class="vvce-legend-item">
          <span class="vvce-legend-dot" style="background: #ffe66d;"></span>
          <span>构造过程</span>
        </div>
      </div>
    `;
  }

  /**
   * 初始化 Canvas
   */
  _initCanvas() {
    const wrapper = this.container.querySelector('.canvas-wrapper');
    const rect = this.container.querySelector('.vvce-animation-container').getBoundingClientRect();

    this.width = rect.width;
    this.height = rect.height;

    // 创建 Canvas
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'vvce-canvas';
    this.canvas.style.cursor = 'crosshair';

    // 高 DPI 支持
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(dpr, dpr);

    wrapper.appendChild(this.canvas);
  }

  /**
   * 初始化组件
   */
  _initComponents() {
    // Grid
    this.grid = new Grid(this.ctx, {
      size: this.params.gridSize,
      color: 'rgba(255, 255, 255, 0.08)',
    });

    // Curve
    this.curve = new Curve(this.ctx, {
      color: this.params.curveColor,
      width: 3,
    });

    // Point Manager
    this.pointManager = new PointManager({
      onDrag: () => this.render(),
      onDragEnd: () => this._emitEvent('pointDrag', this.pointManager.getPositions()),
    });

    // 初始化控制点
    this._initControlPoints();

    // Tooltip
    this.tooltip = new Tooltip(this.container.querySelector('.vvce-animation-container'));

    // Info Panel
    const infoPanelContainer = this.container.querySelector('.info-panel-container');
    this.infoPanel = new InfoPanel(infoPanelContainer, {
      title: '📐 贝塞尔曲线参数',
      position: 'top-left',
    });
    this._updateInfoPanel();

    // Slider
    const sliderContainer = this.container.querySelector('.slider-container');
    sliderContainer.style.cssText = `
      position: absolute;
      bottom: 60px;
      left: 50%;
      transform: translateX(-50%);
    `;

    this.tSlider = new Slider(sliderContainer, {
      label: 't 值：',
      min: 0,
      max: 100,
      value: 0,
      step: 0.1,
      valueFormatter: (v) => (v / 100).toFixed(2),
      onChange: (v) => {
        this.t = v / 100;
        this._updateInfoPanel();
        this._emitEvent('tChange', this.t);
        this.render();
      },
    });

    // Control Buttons
    this._initControlButtons();
  }

  /**
   * 初始化控制点
   */
  _initControlPoints() {
    const w = this.width - this.padding * 2;
    const h = this.height - this.padding * 2;
    const ox = this.padding;
    const oy = this.padding;

    let points;
    if (this.params.controlPoints && this.params.controlPoints.length >= 2) {
      // 使用传入的控制点
      points = this.params.controlPoints.map((p) => ({
        x: p.x ?? p[0],
        y: p.y ?? p[1],
      }));
    } else {
      // 默认四个控制点（三次贝塞尔）
      points = [
        { x: ox + w * 0.1, y: oy + h * 0.8 },
        { x: ox + w * 0.3, y: oy + h * 0.1 },
        { x: ox + w * 0.7, y: oy + h * 0.1 },
        { x: ox + w * 0.9, y: oy + h * 0.8 },
      ];
    }

    this.pointManager.setPoints(points, {
      color: this.params.controlPointColor,
      draggable: true,
    });
  }

  /**
   * 初始化控制按钮
   */
  _initControlButtons() {
    const controlsContainer = this.container.querySelector('.controls-container');
    controlsContainer.className = 'vvce-controls';
    controlsContainer.style.cssText = `
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
    `;

    // 播放按钮
    this.playBtn = new Button(controlsContainer, {
      text: '▶ 播放',
      variant: 'primary',
      onClick: () => this._togglePlay(),
    });

    // 重置按钮
    new Button(controlsContainer, {
      text: '↺ 重置',
      variant: 'secondary',
      onClick: () => this.reset(),
    });

    // 构造线开关
    this.constructionBtn = new Button(controlsContainer, {
      text: '构造线',
      variant: 'secondary',
      active: this.showConstruction,
      onClick: (btn) => {
        this.showConstruction = !this.showConstruction;
        btn.active = this.showConstruction;
        this.render();
      },
    });

    // 添加控制点
    new Button(controlsContainer, {
      text: '+ 控制点',
      variant: 'secondary',
      onClick: () => this._addControlPoint(),
    });

    // 移除控制点
    new Button(controlsContainer, {
      text: '- 控制点',
      variant: 'secondary',
      onClick: () => this._removeControlPoint(),
    });
  }

  /**
   * 绑定事件
   */
  _bindEvents() {
    // 鼠标移动
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mousePos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      // 处理拖拽
      this.pointManager.handleMouseMove(this.mousePos);

      // 更新光标
      this.canvas.style.cursor = this.pointManager.getCursor() || 'crosshair';

      // 检测曲线悬停
      if (this.pointManager.draggingIndex < 0) {
        this._checkCurveHover();
      }

      this.render();
    });

    this.canvas.addEventListener('mousedown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const pos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      this.pointManager.handleMouseDown(pos);
    });

    this.canvas.addEventListener('mouseup', () => {
      this.pointManager.handleMouseUp();
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mousePos = null;
      this.hoverT = null;
      this.isHoveringCurve = false;
      this.tooltip.hide();
      this.pointManager.handleMouseMove(null);
      this.render();
    });

    // 窗口大小变化
    window.addEventListener('resize', () => {
      this._handleResize();
    });
  }

  /**
   * 检测曲线悬停
   */
  _checkCurveHover() {
    if (!this.mousePos) {
      this.hoverT = null;
      this.isHoveringCurve = false;
      this.tooltip.hide();
      return;
    }

    const points = this.pointManager.getPositions();
    const result = bezierMath.findClosestT(points, this.mousePos);

    if (result.distance < 20) {
      this.hoverT = result.t;
      this.isHoveringCurve = true;
      this.tooltip.show(result.point.x, result.point.y, {
        t: result.t,
        x: result.point.x,
        y: result.point.y,
      });
    } else {
      this.hoverT = null;
      this.isHoveringCurve = false;
      this.tooltip.hide();
    }
  }

  /**
   * 处理窗口大小变化
   */
  _handleResize() {
    const rect = this.container.querySelector('.vvce-animation-container').getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;

    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    this.ctx.scale(dpr, dpr);
    this.render();
  }

  /**
   * 切换播放/暂停
   */
  _togglePlay() {
    if (this.isPlaying) {
      this.pause();
      this.playBtn.setText('▶ 播放');
    } else {
      this.start();
      this.playBtn.setText('⏸ 暂停');
    }
  }

  /**
   * 添加控制点
   */
  _addControlPoint() {
    const positions = this.pointManager.getPositions();
    if (positions.length >= 7) return;

    const lastTwo = positions.slice(-2);
    const newPoint = {
      x: (lastTwo[0].x + lastTwo[1].x) / 2,
      y: (lastTwo[0].y + lastTwo[1].y) / 2 - 50,
    };

    positions.splice(positions.length - 1, 0, newPoint);
    this.pointManager.setPoints(positions, {
      color: this.params.controlPointColor,
      draggable: true,
    });

    this._updateInfoPanel();
    this.render();
  }

  /**
   * 移除控制点
   */
  _removeControlPoint() {
    const positions = this.pointManager.getPositions();
    if (positions.length <= 2) return;

    positions.splice(positions.length - 2, 1);
    this.pointManager.setPoints(positions, {
      color: this.params.controlPointColor,
      draggable: true,
    });

    this._updateInfoPanel();
    this.render();
  }

  /**
   * 更新信息面板
   */
  _updateInfoPanel() {
    const positions = this.pointManager.getPositions();
    const curvePoint = bezierMath.bezierPoint(positions, this.t);

    this.infoPanel.update({
      order: { label: '阶数 (n)', value: positions.length - 1 },
      t: { label: 't 值', value: this.t },
      point: { label: '曲线点', value: `(${curvePoint.x.toFixed(0)}, ${curvePoint.y.toFixed(0)})` },
    });
  }

  /**
   * 开始动画
   */
  start() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this._emitEvent('play');
    this._animate();
  }

  /**
   * 暂停动画
   */
  pause() {
    this.isPlaying = false;
    this._emitEvent('pause');
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * 重置
   */
  reset() {
    this.pause();
    this.t = 0;
    this.tSlider.value = 0;
    this._updateInfoPanel();
    this.playBtn.setText('▶ 播放');
    this._emitEvent('reset');
    this.render();
  }

  /**
   * 动画循环
   */
  _animate() {
    if (!this.isPlaying) return;

    const step = 1000 / 60 / this.params.duration;
    this.t += step;

    if (this.t > 1) {
      this.t = 0;
    }

    this.tSlider.value = this.t * 100;
    this._updateInfoPanel();
    this._emitEvent('tChange', this.t);
    this.render();

    this.animationId = requestAnimationFrame(() => this._animate());
  }

  /**
   * 渲染
   */
  render() {
    const ctx = this.ctx;
    const positions = this.pointManager.getPositions();

    // 清空画布
    ctx.clearRect(0, 0, this.width, this.height);

    // 绘制网格
    if (this.params.showGrid) {
      this.grid.draw(this.width, this.height);
    }

    // 绘制控制线
    if (this.params.showControlLines) {
      this._drawControlLines(positions);
    }

    // 绘制贝塞尔曲线
    this._drawBezierCurve(positions);

    // 绘制 de Casteljau 构造过程
    if (this.showConstruction) {
      this._drawConstruction(positions);
    }

    // 绘制控制点
    this.pointManager.draw(ctx);

    // 绘制运动点
    if (this.params.showMovingPoint) {
      this._drawMovingPoint(positions);
    }

    // 绘制悬停点
    if (this.isHoveringCurve && this.hoverT !== null) {
      this._drawHoverPoint(positions);
    }
  }

  /**
   * 绘制控制线
   */
  _drawControlLines(positions) {
    const ctx = this.ctx;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    ctx.beginPath();
    ctx.moveTo(positions[0].x, positions[0].y);
    for (let i = 1; i < positions.length; i++) {
      ctx.lineTo(positions[i].x, positions[i].y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }

  /**
   * 绘制贝塞尔曲线
   */
  _drawBezierCurve(positions) {
    const ctx = this.ctx;

    // 使用参数化绘制
    this.curve.setStyle({ color: this.params.curveColor, width: 3 });
    this.curve.drawParametric((t) => bezierMath.bezierPoint(positions, t), 0, 1, 100);

    // 绘制已经过的部分（更亮）
    if (this.t > 0) {
      this.curve.setStyle({ color: '#fff', width: 4 });
      this.curve.drawParametric((t) => bezierMath.bezierPoint(positions, t), 0, this.t, Math.floor(this.t * 100));
    }
  }

  /**
   * 绘制 de Casteljau 构造过程
   */
  _drawConstruction(positions) {
    const ctx = this.ctx;
    const levels = bezierMath.deCasteljauLevels(positions, this.t);

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

  /**
   * 绘制运动点
   */
  _drawMovingPoint(positions) {
    const ctx = this.ctx;
    const point = bezierMath.bezierPoint(positions, this.t);

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

  /**
   * 绘制悬停点
   */
  _drawHoverPoint(positions) {
    const ctx = this.ctx;
    const point = bezierMath.bezierPoint(positions, this.hoverT);

    ctx.fillStyle = 'rgba(78, 205, 196, 0.8)';
    ctx.beginPath();
    ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  /**
   * 注册事件回调
   */
  on(event, callback) {
    if (!this.eventCallbacks.has(event)) {
      this.eventCallbacks.set(event, []);
    }
    this.eventCallbacks.get(event).push(callback);
  }

  /**
   * 触发事件
   */
  _emitEvent(event, data = null) {
    const callbacks = this.eventCallbacks.get(event);
    if (callbacks) {
      callbacks.forEach((cb) => cb(data));
    }
  }

  /**
   * 获取当前状态
   */
  getState() {
    const positions = this.pointManager.getPositions();
    return {
      t: this.t,
      curvePoint: bezierMath.bezierPoint(positions, this.t),
      controlPoints: positions,
      order: positions.length - 1,
      isPlaying: this.isPlaying,
    };
  }

  /**
   * 销毁
   */
  destroy() {
    this.pause();

    // 销毁组件
    if (this.tooltip) this.tooltip.destroy();
    if (this.infoPanel) this.infoPanel.destroy();
    if (this.tSlider) this.tSlider.destroy();
    if (this.playBtn) this.playBtn.destroy();

    // 清空容器
    this.container.innerHTML = '';
  }

  /**
   * 处理外部控制命令
   */
  handleControl(controlId, element) {
    switch (controlId) {
      case 'play':
        this._togglePlay();
        break;
      case 'reset':
        this.reset();
        break;
      case 'construction':
        this.showConstruction = !this.showConstruction;
        this.render();
        break;
    }
  }
}

// 导出工厂函数
export function create(container, params) {
  return new BezierCurveAnimation(container, params);
}

export default BezierCurveAnimation;
