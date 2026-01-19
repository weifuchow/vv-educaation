/**
 * Controls - 控制面板
 * 提供滑块、按钮、信息面板等 UI 组件
 */

/**
 * Slider - 滑块控件
 */
export class Slider {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      label: '',
      min: 0,
      max: 100,
      value: 0,
      step: 1,
      showValue: true,
      valueFormatter: (v) => v.toFixed(2),
      onChange: null,
      ...options,
    };

    this.element = null;
    this.inputElement = null;
    this.valueElement = null;
    this._value = this.options.value;

    this._createElement();
  }

  _createElement() {
    const { label, min, max, value, step, showValue } = this.options;

    this.element = document.createElement('div');
    this.element.className = 'vvce-slider-container';
    this.element.style.cssText = `
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 16px;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(10px);
      border-radius: 8px;
    `;

    const labelEl = document.createElement('span');
    labelEl.className = 'vvce-slider-label';
    labelEl.textContent = label;
    labelEl.style.cssText = `
      color: #aaa;
      font-size: 12px;
      white-space: nowrap;
    `;

    this.inputElement = document.createElement('input');
    this.inputElement.type = 'range';
    this.inputElement.className = 'vvce-slider';
    this.inputElement.min = min;
    this.inputElement.max = max;
    this.inputElement.value = value;
    this.inputElement.step = step;
    this.inputElement.style.cssText = `
      width: 200px;
      height: 4px;
      -webkit-appearance: none;
      appearance: none;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 2px;
      outline: none;
      cursor: pointer;
    `;

    this.inputElement.addEventListener('input', () => {
      this._value = parseFloat(this.inputElement.value);
      this._updateValueDisplay();
      if (this.options.onChange) {
        this.options.onChange(this._value);
      }
    });

    this.element.appendChild(labelEl);
    this.element.appendChild(this.inputElement);

    if (showValue) {
      this.valueElement = document.createElement('span');
      this.valueElement.className = 'vvce-slider-value';
      this.valueElement.style.cssText = `
        color: #4ecdc4;
        font-family: 'Monaco', 'Consolas', monospace;
        font-size: 12px;
        min-width: 50px;
      `;
      this._updateValueDisplay();
      this.element.appendChild(this.valueElement);
    }

    this.container.appendChild(this.element);
  }

  _updateValueDisplay() {
    if (this.valueElement) {
      this.valueElement.textContent = this.options.valueFormatter(this._value);
    }
  }

  get value() {
    return this._value;
  }

  set value(v) {
    this._value = v;
    this.inputElement.value = v;
    this._updateValueDisplay();
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

/**
 * Button - 按钮控件
 */
export class Button {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      text: 'Button',
      icon: null,
      variant: 'primary', // 'primary' | 'secondary'
      active: false,
      onClick: null,
      ...options,
    };

    this.element = null;
    this._active = this.options.active;
    this._createElement();
  }

  _createElement() {
    const { text, icon, variant } = this.options;

    this.element = document.createElement('button');
    this.element.className = `vvce-btn vvce-btn-${variant}`;
    this.element.innerHTML = icon ? `${icon} ${text}` : text;

    const baseStyle = `
      padding: 6px 14px;
      border: none;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      color: #fff;
    `;

    const variantStyles = {
      primary: `
        background: linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%);
      `,
      secondary: `
        background: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.3);
      `,
    };

    this.element.style.cssText = baseStyle + variantStyles[variant];

    this.element.addEventListener('click', () => {
      if (this.options.onClick) {
        this.options.onClick(this);
      }
    });

    this._updateActiveState();
    this.container.appendChild(this.element);
  }

  _updateActiveState() {
    if (this._active) {
      this.element.style.background = 'rgba(78, 205, 196, 0.3)';
      this.element.style.borderColor = '#4ecdc4';
    }
  }

  get active() {
    return this._active;
  }

  set active(v) {
    this._active = v;
    this._updateActiveState();
  }

  setText(text) {
    this.element.textContent = text;
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

/**
 * InfoPanel - 信息面板
 */
export class InfoPanel {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      title: '',
      position: 'top-left',
      ...options,
    };

    this.element = null;
    this.rows = new Map();
    this._createElement();
  }

  _createElement() {
    const { title, position } = this.options;

    this.element = document.createElement('div');
    this.element.className = 'vvce-info-panel';

    const positionStyles = {
      'top-left': 'top: 12px; left: 12px;',
      'top-right': 'top: 12px; right: 12px;',
      'bottom-left': 'bottom: 12px; left: 12px;',
      'bottom-right': 'bottom: 12px; right: 12px;',
    };

    this.element.style.cssText = `
      position: absolute;
      ${positionStyles[position]}
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(10px);
      padding: 12px 16px;
      border-radius: 8px;
      color: #fff;
      font-size: 13px;
      pointer-events: none;
      min-width: 180px;
    `;

    if (title) {
      const titleEl = document.createElement('div');
      titleEl.className = 'vvce-info-title';
      titleEl.textContent = title;
      titleEl.style.cssText = `
        font-weight: 600;
        color: #4ecdc4;
        margin-bottom: 8px;
        font-size: 14px;
      `;
      this.element.appendChild(titleEl);
    }

    this.contentEl = document.createElement('div');
    this.contentEl.className = 'vvce-info-content';
    this.element.appendChild(this.contentEl);

    this.container.appendChild(this.element);
  }

  /**
   * 设置一行数据
   */
  setRow(key, label, value) {
    let row = this.rows.get(key);

    if (!row) {
      row = document.createElement('div');
      row.className = 'vvce-info-row';
      row.style.cssText = `
        display: flex;
        justify-content: space-between;
        margin-bottom: 4px;
      `;

      const labelEl = document.createElement('span');
      labelEl.className = 'vvce-info-label';
      labelEl.textContent = label;
      labelEl.style.color = '#aaa';

      const valueEl = document.createElement('span');
      valueEl.className = 'vvce-info-value';
      valueEl.style.cssText = `
        color: #fff;
        font-family: 'Monaco', 'Consolas', monospace;
        font-size: 12px;
      `;

      row.appendChild(labelEl);
      row.appendChild(valueEl);
      row._valueEl = valueEl;

      this.contentEl.appendChild(row);
      this.rows.set(key, row);
    }

    row._valueEl.textContent = typeof value === 'number' ? value.toFixed(3) : value;
  }

  /**
   * 批量更新
   */
  update(data) {
    for (const [key, { label, value }] of Object.entries(data)) {
      this.setRow(key, label, value);
    }
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

export default { Slider, Button, InfoPanel };
