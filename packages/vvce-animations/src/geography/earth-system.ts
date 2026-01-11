/**
 * 地球公转与自转动画
 * Earth Revolution and Rotation Animation
 */

import { AnimationBase } from '../core/AnimationBase';
import type { AnimationDefinition, AnimationConfig, AnimationInstance } from '../types';

interface EarthSystemParams {
  revolutionPeriod?: number; // 公转周期（秒）
  rotationPeriod?: number; // 自转周期（秒）
  orbitRadius?: number; // 轨道半径（像素）
  earthRadius?: number; // 地球半径（像素）
  showOrbit?: boolean; // 显示轨道
  showAxis?: boolean; // 显示地轴
  showMoon?: boolean; // 显示月球
  showLabels?: boolean; // 显示标签
  animationType?: 'both' | 'revolution' | 'rotation' | 'none'; // 动画类型
}

class EarthSystemAnimation extends AnimationBase {
  private params: Required<EarthSystemParams>;
  private elements: {
    sun: HTMLElement;
    orbit: HTMLElement;
    earthContainer: HTMLElement;
    earth: HTMLElement;
    moon?: HTMLElement;
    labels?: HTMLElement;
  };

  constructor(container: HTMLElement, config: AnimationConfig) {
    super(container);

    this.params = {
      revolutionPeriod: 10, // 10秒一周
      rotationPeriod: 4, // 4秒一周
      orbitRadius: 175,
      earthRadius: 40,
      showOrbit: true,
      showAxis: true,
      showMoon: true,
      showLabels: true,
      animationType: 'both',
      ...config.params,
    };

    this.elements = this.createElements();
    this.renderFrame(0);
  }

  protected getDuration(): number {
    // 使用公转周期作为完整周期
    return this.params.revolutionPeriod * 1000;
  }

  private createElements() {
    this.container.innerHTML = `
      <div class="earth-system-container">
        <div class="earth-sun"></div>
        ${this.params.showOrbit ? '<div class="earth-orbit"></div>' : ''}
        <div class="earth-container">
          <div class="earth">
            ${
              this.params.showAxis
                ? `
              <div class="earth-axis">
                <div class="axis-label">23.5°</div>
              </div>
            `
                : ''
            }
            ${this.params.showMoon ? '<div class="earth-moon"></div>' : ''}
          </div>
        </div>
        ${
          this.params.showLabels
            ? `
          <div class="info-label label-revolution">
            <strong>公转</strong><br>
            周期：365天
          </div>
          <div class="info-label label-rotation">
            <strong>自转</strong><br>
            周期：24小时
          </div>
        `
            : ''
        }
      </div>
    `;

    this.injectStyles();

    return {
      sun: this.container.querySelector('.earth-sun') as HTMLElement,
      orbit: this.container.querySelector('.earth-orbit') as HTMLElement,
      earthContainer: this.container.querySelector('.earth-container') as HTMLElement,
      earth: this.container.querySelector('.earth') as HTMLElement,
      moon: this.container.querySelector('.earth-moon') as HTMLElement,
      labels: this.container.querySelector('.info-label') as HTMLElement,
    };
  }

  private injectStyles(): void {
    const styleId = 'earth-system-animation-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .earth-system-container {
        position: relative;
        width: 100%;
        height: 450px;
        background: linear-gradient(180deg, #000428 0%, #004e92 100%);
        border-radius: 12px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .earth-sun {
        position: absolute;
        width: 100px;
        height: 100px;
        background: radial-gradient(circle, #ffeb3b 0%, #ff9800 100%);
        border-radius: 50%;
        box-shadow: 0 0 50px #ff9800, 0 0 100px #ff9800;
        animation: sunGlow 3s ease-in-out infinite;
      }

      @keyframes sunGlow {
        0%, 100% {
          box-shadow: 0 0 50px #ff9800, 0 0 100px #ff9800;
        }
        50% {
          box-shadow: 0 0 80px #ff9800, 0 0 130px #ff9800;
        }
      }

      .earth-orbit {
        position: absolute;
        width: 350px;
        height: 350px;
        border: 2px dashed rgba(255, 255, 255, 0.3);
        border-radius: 50%;
      }

      .earth-container {
        position: absolute;
        width: 80px;
        height: 80px;
        transform-origin: center;
      }

      .earth {
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, #4a90e2 0%, #2e7d32 50%, #1565c0 100%);
        border-radius: 50%;
        position: relative;
        box-shadow: 0 0 30px rgba(66, 165, 245, 0.5);
      }

      .earth::after {
        content: '';
        position: absolute;
        top: 10%;
        left: 10%;
        width: 80%;
        height: 80%;
        background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent);
        border-radius: 50%;
      }

      .earth-axis {
        position: absolute;
        width: 2px;
        height: 100px;
        background: rgba(255, 255, 255, 0.6);
        top: -10px;
        left: 39px;
        transform: rotate(23.5deg);
        transform-origin: center;
      }

      .axis-label {
        position: absolute;
        top: -25px;
        left: -30px;
        color: white;
        font-size: 12px;
        white-space: nowrap;
        background: rgba(0,0,0,0.6);
        padding: 2px 6px;
        border-radius: 4px;
      }

      .earth-moon {
        position: absolute;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, #ddd, #999);
        border-radius: 50%;
        top: -30px;
        left: 30px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      }

      .info-label {
        position: absolute;
        background: rgba(255, 255, 255, 0.95);
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 14px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        max-width: 200px;
      }

      .label-revolution {
        bottom: 50px;
        left: 50px;
      }

      .label-rotation {
        bottom: 50px;
        right: 50px;
      }
    `;
    document.head.appendChild(style);
  }

  protected renderFrame(progress: number): void {
    const revolutionAngle = progress * 360; // 度
    const rotationCycles =
      progress * (this.params.revolutionPeriod / this.params.rotationPeriod);
    const rotationAngle = (rotationCycles % 1) * 360;

    // 应用变换
    if (
      this.params.animationType === 'both' ||
      this.params.animationType === 'revolution'
    ) {
      // 公转：地球容器绕太阳旋转
      const radians = (revolutionAngle * Math.PI) / 180;
      const x = Math.cos(radians) * this.params.orbitRadius;
      const y = Math.sin(radians) * this.params.orbitRadius;

      this.elements.earthContainer.style.transform = `translate(${x}px, ${y}px) rotate(${-revolutionAngle}deg)`;
    }

    if (
      this.params.animationType === 'both' ||
      this.params.animationType === 'rotation'
    ) {
      // 自转：地球自身旋转
      this.elements.earth.style.transform = `rotate(${rotationAngle}deg)`;
    }

    // 更新标签
    if (this.params.showLabels) {
      const labels = this.container.querySelectorAll('.info-label');
      if (labels[0]) {
        labels[0].innerHTML = `
          <strong>公转</strong><br>
          角度: ${revolutionAngle.toFixed(1)}°<br>
          周期: 365天
        `;
      }
      if (labels[1]) {
        labels[1].innerHTML = `
          <strong>自转</strong><br>
          角度: ${rotationAngle.toFixed(1)}°<br>
          周期: 24小时
        `;
      }
    }
  }

  // 额外的控制方法
  setAnimationType(type: 'both' | 'revolution' | 'rotation' | 'none'): void {
    this.params.animationType = type;
    if (type === 'none') {
      this.pause();
    }
  }

  protected updateTransform(): void {
    const container = this.container.querySelector(
      '.earth-system-container'
    ) as HTMLElement;
    if (container) {
      container.style.transform = `scale(${this.state.scale})`;
      container.style.transformOrigin = 'center center';
    }
  }
}

// 导出动画定义
export const earthSystemAnimation: AnimationDefinition = {
  metadata: {
    id: 'geography.earth-system',
    category: 'geography',
    name: '地球公转与自转',
    description: '演示地球围绕太阳公转和自身自转的运动',
    author: 'VV Education',
    version: '1.0.0',
    tags: ['地球', '公转', '自转', '天文', '太阳系'],
  },

  render(container: HTMLElement, config: AnimationConfig): AnimationInstance {
    const instance = new EarthSystemAnimation(container, config);

    // 扩展实例，添加特定控制方法
    (instance as any).setAnimationType = (type: string) => {
      (instance as EarthSystemAnimation).setAnimationType(
        type as 'both' | 'revolution' | 'rotation' | 'none'
      );
    };

    return instance;
  },
};
