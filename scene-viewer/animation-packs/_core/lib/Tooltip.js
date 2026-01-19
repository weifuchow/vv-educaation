/**
 * Tooltip - 悬停提示框
 * 显示坐标、参数值等信息
 */
export class Tooltip {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      className: 'vvce-tooltip',
      offset: { x: 0, y: -15 },
      ...options,
    };

    this.element = null;
    this._createElement();
  }

  /**
   * 创建 DOM 元素
   */
  _createElement() {
    this.element = document.createElement('div');
    this.element.className = this.options.className;
    this.element.style.cssText = `
      position: absolute;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(10px);
      padding: 8px 12px;
      border-radius: 6px;
      color: #fff;
      font-size: 12px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      pointer-events: none;
      z-index: 100;
      white-space: nowrap;
      transform: translate(-50%, -100%);
      border: 1px solid rgba(78, 205, 196, 0.5);
      display: none;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;
    this.container.appendChild(this.element);
  }

  /**
   * 显示提示框
   */
  show(x, y, content) {
    const { offset } = this.options;

    if (typeof content === 'string') {
      this.element.innerHTML = content;
    } else if (typeof content === 'object') {
      // 格式化对象内容
      const lines = Object.entries(content).map(([key, value]) => {
        const formattedValue = typeof value === 'number' ? value.toFixed(3) : value;
        return `<div><span style="color: #aaa;">${key}:</span> <strong>${formattedValue}</strong></div>`;
      });
      this.element.innerHTML = lines.join('');
    }

    this.element.style.left = `${x + offset.x}px`;
    this.element.style.top = `${y + offset.y}px`;
    this.element.style.display = 'block';
  }

  /**
   * 隐藏提示框
   */
  hide() {
    this.element.style.display = 'none';
  }

  /**
   * 更新位置
   */
  updatePosition(x, y) {
    const { offset } = this.options;
    this.element.style.left = `${x + offset.x}px`;
    this.element.style.top = `${y + offset.y}px`;
  }

  /**
   * 销毁
   */
  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

export default Tooltip;
