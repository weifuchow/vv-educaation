/**
 * Point - 可交互的点
 * 支持拖拽、悬停效果、标签显示
 */
export class Point {
  constructor(x, y, options = {}) {
    this.x = x;
    this.y = y;
    this.options = {
      // 基础样式
      radius: 10,
      color: '#ff6b6b',
      borderColor: '#fff',
      borderWidth: 2,

      // 悬停效果
      hoverRadius: 15,
      hoverColor: 'rgba(255, 107, 107, 0.3)',

      // 拖拽
      draggable: true,

      // 标签
      label: null,
      labelFont: 'bold 11px sans-serif',
      labelColor: '#fff',
      labelOffset: { x: 0, y: 0 },

      ...options,
    };

    // 状态
    this.isHovered = false;
    this.isDragging = false;
  }

  /**
   * 设置位置
   */
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * 检测点击
   */
  hitTest(mouseX, mouseY) {
    const dist = Math.sqrt((this.x - mouseX) ** 2 + (this.y - mouseY) ** 2);
    return dist < this.options.hoverRadius;
  }

  /**
   * 绘制点
   */
  draw(ctx) {
    const { radius, color, borderColor, borderWidth, hoverRadius, hoverColor, label } =
      this.options;

    ctx.save();

    // 悬停/拖拽效果
    if (this.isHovered || this.isDragging) {
      ctx.fillStyle = hoverColor;
      ctx.beginPath();
      ctx.arc(this.x, this.y, hoverRadius + 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // 主圆点
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
    ctx.fill();

    // 边框
    if (borderWidth > 0) {
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = borderWidth;
      ctx.stroke();
    }

    // 标签
    if (label) {
      const { labelFont, labelColor, labelOffset } = this.options;
      ctx.fillStyle = labelColor;
      ctx.font = labelFont;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, this.x + labelOffset.x, this.y + labelOffset.y);
    }

    ctx.restore();
  }
}

/**
 * PointManager - 管理多个可拖拽点
 */
export class PointManager {
  constructor(options = {}) {
    this.points = [];
    this.options = {
      onDragStart: null,
      onDrag: null,
      onDragEnd: null,
      ...options,
    };

    this.draggingIndex = -1;
    this.hoveredIndex = -1;
  }

  /**
   * 添加点
   */
  addPoint(x, y, options = {}) {
    const point = new Point(x, y, options);
    this.points.push(point);
    return point;
  }

  /**
   * 设置多个点
   */
  setPoints(pointsData, options = {}) {
    this.points = pointsData.map((p, i) => {
      return new Point(p.x, p.y, {
        label: `P${i}`,
        ...options,
        ...p.options,
      });
    });
  }

  /**
   * 获取所有点的坐标
   */
  getPositions() {
    return this.points.map((p) => ({ x: p.x, y: p.y }));
  }

  /**
   * 处理鼠标移动
   */
  handleMouseMove(mousePos) {
    if (!mousePos) {
      this.hoveredIndex = -1;
      this.points.forEach((p) => (p.isHovered = false));
      return;
    }

    // 拖拽中
    if (this.draggingIndex >= 0) {
      const point = this.points[this.draggingIndex];
      point.setPosition(mousePos.x, mousePos.y);

      if (this.options.onDrag) {
        this.options.onDrag(this.draggingIndex, point);
      }
      return;
    }

    // 悬停检测
    this.hoveredIndex = -1;
    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];
      const isHovered = point.hitTest(mousePos.x, mousePos.y);
      point.isHovered = isHovered;
      if (isHovered) {
        this.hoveredIndex = i;
      }
    }
  }

  /**
   * 处理鼠标按下
   */
  handleMouseDown(mousePos) {
    if (!mousePos) return;

    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];
      if (point.hitTest(mousePos.x, mousePos.y) && point.options.draggable) {
        this.draggingIndex = i;
        point.isDragging = true;

        if (this.options.onDragStart) {
          this.options.onDragStart(i, point);
        }
        break;
      }
    }
  }

  /**
   * 处理鼠标释放
   */
  handleMouseUp() {
    if (this.draggingIndex >= 0) {
      const point = this.points[this.draggingIndex];
      point.isDragging = false;

      if (this.options.onDragEnd) {
        this.options.onDragEnd(this.draggingIndex, point);
      }

      this.draggingIndex = -1;
    }
  }

  /**
   * 绘制所有点
   */
  draw(ctx) {
    this.points.forEach((point) => point.draw(ctx));
  }

  /**
   * 获取当前光标样式
   */
  getCursor() {
    if (this.draggingIndex >= 0) {
      return 'grabbing';
    }
    if (this.hoveredIndex >= 0) {
      return 'grab';
    }
    return 'default';
  }
}

export default Point;
