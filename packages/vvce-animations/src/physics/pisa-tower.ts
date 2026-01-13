/**
 * 比萨斜塔自由落体实验动画
 * Galileo's Pisa Tower Experiment
 */

import { AnimationBase } from '../core/AnimationBase';
import type { AnimationDefinition, AnimationConfig, AnimationInstance } from '../types';

interface PisaTowerParams {
  towerHeight?: number; // 塔高（米）
  ballHeight?: number; // 球的起始高度（米）
  heavyBallMass?: number; // 重球质量（千克）
  lightBallMass?: number; // 轻球质量（千克）
  gravity?: number; // 重力加速度（m/s²）
  showVectors?: boolean; // 显示速度矢量
  showLabels?: boolean; // 显示标签
}

class PisaTowerAnimation extends AnimationBase {
  private params: Required<PisaTowerParams>;
  private elements: {
    tower: HTMLElement;
    galileo: HTMLElement;
    heavyBall: HTMLElement;
    lightBall: HTMLElement;
    ground: HTMLElement;
    labels?: HTMLElement;
  };

  constructor(container: HTMLElement, config: AnimationConfig) {
    super(container);

    this.params = {
      towerHeight: 56, // 比萨斜塔实际高度
      ballHeight: 50,
      heavyBallMass: 10,
      lightBallMass: 1,
      gravity: 9.8,
      showVectors: false,
      showLabels: true,
      ...config.params,
    };

    this.elements = this.createElements();
    this.renderFrame(0);
  }

  protected getDuration(): number {
    // 使用物理公式计算自由落体时间
    // t = sqrt(2h/g)
    const h = this.params.ballHeight;
    const g = this.params.gravity;
    return Math.sqrt((2 * h) / g) * 1000; // 转换为毫秒
  }

  private createElements() {
    this.container.innerHTML = `
      <div class="pisa-animation-container">
        <div class="pisa-sky"></div>
        <div class="pisa-tower">
          <div class="tower-level"></div>
          <div class="tower-level"></div>
          <div class="tower-level"></div>
          <div class="tower-level"></div>
          <div class="tower-level"></div>
          <div class="tower-level"></div>
        </div>
        <div class="pisa-galileo">🧑‍🔬</div>
        <div class="pisa-ball heavy">
          <div class="ball-shadow"></div>
        </div>
        <div class="pisa-ball light">
          <div class="ball-shadow"></div>
        </div>
        <div class="pisa-ground"></div>
        ${this.params.showLabels ? '<div class="pisa-labels"></div>' : ''}
      </div>
    `;

    this.injectStyles();

    return {
      tower: this.container.querySelector('.pisa-tower') as HTMLElement,
      galileo: this.container.querySelector('.pisa-galileo') as HTMLElement,
      heavyBall: this.container.querySelector('.pisa-ball.heavy') as HTMLElement,
      lightBall: this.container.querySelector('.pisa-ball.light') as HTMLElement,
      ground: this.container.querySelector('.pisa-ground') as HTMLElement,
      labels: this.container.querySelector('.pisa-labels') as HTMLElement,
    };
  }

  private injectStyles(): void {
    const styleId = 'pisa-tower-animation-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .pisa-animation-container {
        position: relative;
        width: 100%;
        height: 450px;
        background: linear-gradient(180deg, #87ceeb 0%, #e0f7ff 100%);
        border-radius: 12px;
        overflow: hidden;
        box-shadow: inset 0 2px 10px rgba(0,0,0,0.1);
      }

      .pisa-sky {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 200px;
        background: linear-gradient(180deg, #87ceeb 0%, transparent 100%);
        pointer-events: none;
      }

      .pisa-tower {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%) rotate(4deg);
        transform-origin: bottom center;
        width: 120px;
        height: 360px;
        background: linear-gradient(to right, #d4a574 0%, #c89666 50%, #b88858 100%);
        border-radius: 8px 8px 0 0;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
      }

      .tower-level {
        position: absolute;
        width: 100%;
        height: 60px;
        border-bottom: 3px solid #996633;
        border-top: 2px solid #edc9a3;
      }

      .tower-level:nth-child(1) { top: 0; }
      .tower-level:nth-child(2) { top: 60px; }
      .tower-level:nth-child(3) { top: 120px; }
      .tower-level:nth-child(4) { top: 180px; }
      .tower-level:nth-child(5) { top: 240px; }
      .tower-level:nth-child(6) { top: 300px; }

      .pisa-galileo {
        position: absolute;
        top: 30px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 36px;
        z-index: 10;
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
      }

      .pisa-ball {
        position: absolute;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        transition: opacity 0.3s;
      }

      .pisa-ball.heavy {
        background: radial-gradient(circle at 30% 30%, #999, #333);
        left: calc(50% - 80px);
      }

      .pisa-ball.light {
        background: radial-gradient(circle at 30% 30%, #ff6b6b, #c92a2a);
        left: calc(50% + 40px);
      }

      .ball-shadow {
        position: absolute;
        bottom: -2px;
        left: 50%;
        transform: translateX(-50%);
        width: 80%;
        height: 4px;
        background: rgba(0,0,0,0.2);
        border-radius: 50%;
        filter: blur(2px);
      }

      .pisa-ground {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 60px;
        background: linear-gradient(180deg, #8b7355 0%, #6b5a45 100%);
        box-shadow: inset 0 2px 10px rgba(0,0,0,0.2);
      }

      .pisa-labels {
        position: absolute;
        bottom: 80px;
        left: 20px;
        background: rgba(255,255,255,0.95);
        padding: 12px;
        border-radius: 8px;
        font-size: 13px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        max-width: 200px;
      }
    `;
    document.head.appendChild(style);
  }

  protected renderFrame(progress: number): void {
    // 使用物理公式计算位置
    // s = (1/2) * g * t^2
    const t = progress * Math.sqrt((2 * this.params.ballHeight) / this.params.gravity);
    const distance = 0.5 * this.params.gravity * t * t;
    const distancePercent = (distance / this.params.ballHeight) * 100;

    // 计算实际像素位置（相对于容器）
    const startY = 50; // 起始Y位置（像素）
    const endY = 360; // 结束Y位置（像素）
    const currentY = startY + ((endY - startY) * distancePercent) / 100;

    // 更新球的位置（同时下落）
    this.elements.heavyBall.style.top = `${currentY}px`;
    this.elements.lightBall.style.top = `${currentY}px`;

    // 更新阴影大小（越接近地面阴影越小）
    const shadowScale = 1 - progress * 0.5;
    const shadows = this.container.querySelectorAll('.ball-shadow');
    shadows.forEach((shadow) => {
      (shadow as HTMLElement).style.transform = `translateX(-50%) scale(${shadowScale})`;
    });

    // 更新标签
    if (this.params.showLabels && this.elements.labels) {
      const velocity = this.params.gravity * t;
      this.elements.labels.innerHTML = `
        <strong>自由落体</strong><br>
        进度: ${(progress * 100).toFixed(0)}%<br>
        时间: ${t.toFixed(2)}s<br>
        速度: ${velocity.toFixed(2)} m/s<br>
        距离: ${distance.toFixed(2)}m
      `;
    }

    // 落地效果
    if (progress >= 1) {
      this.elements.heavyBall.style.opacity = '0.7';
      this.elements.lightBall.style.opacity = '0.7';
    } else {
      this.elements.heavyBall.style.opacity = '1';
      this.elements.lightBall.style.opacity = '1';
    }
  }

  protected updateTransform(): void {
    const container = this.container.querySelector(
      '.pisa-animation-container'
    ) as HTMLElement;
    if (container) {
      container.style.transform = `scale(${this.state.scale})`;
      container.style.transformOrigin = 'center center';
    }
  }
}

// 导出动画定义
export const pisaTowerAnimation: AnimationDefinition = {
  metadata: {
    id: 'physics.pisa-tower',
    category: 'physics',
    name: '比萨斜塔实验',
    description: '伽利略的自由落体实验 - 展示不同质量的物体下落速度相同',
    author: 'VV Education',
    version: '1.0.0',
    tags: ['自由落体', '重力', '经典力学', '伽利略', '比萨斜塔'],
  },

  render(container: HTMLElement, config: AnimationConfig): AnimationInstance {
    return new PisaTowerAnimation(container, config);
  },
};
