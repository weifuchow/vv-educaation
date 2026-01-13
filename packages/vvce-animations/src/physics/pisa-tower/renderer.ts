/**
 * Pisa Tower Animation Renderer
 * 比萨斜塔自由落体实验渲染器
 */

import {
  IAnimationRenderer,
  WebAnimationConfig,
  AnimationResult,
} from '../../standards/AnimationStandard';

export class PisaTowerRenderer implements IAnimationRenderer {
  public readonly id = 'physics.pisa-tower';
  private container: HTMLElement;
  private config: WebAnimationConfig;
  private animationTimeout: any = null;

  constructor(config: WebAnimationConfig) {
    this.container = config.container;
    this.config = config;
  }

  getHtml(): string {
    return `
      <div class="pisa-tower">
        <div class="tower-level"></div>
        <div class="tower-level"></div>
        <div class="tower-level"></div>
        <div class="tower-level"></div>
        <div class="tower-level"></div>
      </div>
      <div class="galileo">🧑‍🔬</div>
      <div class="ball heavy" id="heavy-ball"></div>
      <div class="ball light" id="light-ball"></div>
    `;
  }

  initialize(): void {
    if (this.config.autoplay) {
      setTimeout(() => this.start(), 500);
    }
  }

  start(): void {
    const heavyBall = this.container.querySelector('#heavy-ball') as HTMLElement;
    const lightBall = this.container.querySelector('#light-ball') as HTMLElement;

    if (!heavyBall || !lightBall) {
      this.emitResult('error', { message: 'Ball elements not found' });
      return;
    }

    // Reset first
    heavyBall.classList.remove('falling');
    lightBall.classList.remove('falling');

    // Emit interaction event - experiment started
    this.emitInteraction({
      action: 'experiment_start',
      data: { animation: 'pisa-tower' },
    });

    // Start falling animation
    this.animationTimeout = setTimeout(() => {
      heavyBall.classList.add('falling');
      lightBall.classList.add('falling');

      // Animation duration is 1.5s, emit result when complete
      setTimeout(() => {
        this.emitResult('complete', {
          conclusion: '两个球同时落地',
          physicsLaw: '自由落体加速度与质量无关',
        });
      }, 1500);
    }, 500);
  }

  stop(): void {
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
      this.animationTimeout = null;
    }

    const heavyBall = this.container.querySelector('#heavy-ball') as HTMLElement;
    const lightBall = this.container.querySelector('#light-ball') as HTMLElement;

    if (heavyBall) heavyBall.classList.remove('falling');
    if (lightBall) lightBall.classList.remove('falling');
  }

  reset(): void {
    this.stop();
    const heavyBall = this.container.querySelector('#heavy-ball') as HTMLElement;
    const lightBall = this.container.querySelector('#light-ball') as HTMLElement;

    if (heavyBall) {
      heavyBall.style.top = '50px';
      heavyBall.classList.remove('falling');
    }
    if (lightBall) {
      lightBall.style.top = '50px';
      lightBall.classList.remove('falling');
    }
  }

  destroy(): void {
    this.stop();
    this.container.innerHTML = '';
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
