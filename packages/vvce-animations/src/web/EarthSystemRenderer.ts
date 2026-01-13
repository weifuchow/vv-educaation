/**
 * Earth System Animation Web Renderer
 * 地球公转自转系统 - 浏览器渲染器，支持交互控制
 */

import { WebAnimationRenderer, WebAnimationConfig } from './WebAnimationRenderer';

export class EarthSystemRenderer extends WebAnimationRenderer {
  private currentMode: 'rotation' | 'revolution' | 'both' | 'stop' = 'both';

  constructor(config: WebAnimationConfig) {
    super('geography.earth-system', config);
  }

  getHtml(): string {
    return `
      <div class="earth-system">
        <div class="sun"></div>
        <div class="orbit"></div>
        <div class="earth-container" id="earth-orbit">
          <div class="earth" id="earth-rotate">
            <div class="earth-axis">
              <div class="axis-label">23.5°</div>
            </div>
            <div class="moon"></div>
          </div>
        </div>
        <div class="info-label label-revolution">
          <strong>公转</strong><br>
          周期：365天
        </div>
        <div class="info-label label-rotation">
          <strong>自转</strong><br>
          周期：24小时
        </div>
      </div>
    `;
  }

  initialize(): void {
    if (this.config.autoplay) {
      this.start();
    }
  }

  start(): void {
    this.setMode('both');
    this.emitInteraction({
      action: 'animation_start',
      animation: 'earth-system',
      mode: 'both',
    });
  }

  stop(): void {
    this.setMode('stop');
  }

  reset(): void {
    this.stop();
    // Reset to initial position would require CSS manipulation
    // For now, just stop the animation
  }

  /**
   * Handle control button interactions
   */
  handleControl(controlId: string, element: HTMLElement): void {
    // Remove active class from all buttons
    const allButtons = document.querySelectorAll('.control-button');
    allButtons.forEach((btn) => btn.classList.remove('active'));
    element.classList.add('active');

    switch (controlId) {
      case 'btn-rotation':
        this.setMode('rotation');
        break;
      case 'btn-revolution':
        this.setMode('revolution');
        break;
      case 'btn-both':
        this.setMode('both');
        break;
      case 'btn-stop':
        this.setMode('stop');
        break;
    }

    // Emit interaction result
    this.emitInteraction({
      action: 'control_change',
      controlId,
      mode: this.currentMode,
    });

    // Emit result with current state
    this.emitResult('interact', {
      mode: this.currentMode,
      description: this.getModeDescription(this.currentMode),
    });
  }

  private setMode(mode: 'rotation' | 'revolution' | 'both' | 'stop'): void {
    this.currentMode = mode;

    const earthOrbit = this.container.querySelector('#earth-orbit') as HTMLElement;
    const earthRotate = this.container.querySelector('#earth-rotate') as HTMLElement;

    if (!earthOrbit || !earthRotate) return;

    switch (mode) {
      case 'rotation':
        earthOrbit.classList.remove('rotating');
        earthRotate.classList.add('rotating');
        break;
      case 'revolution':
        earthOrbit.classList.add('rotating');
        earthRotate.classList.remove('rotating');
        break;
      case 'both':
        earthOrbit.classList.add('rotating');
        earthRotate.classList.add('rotating');
        break;
      case 'stop':
        earthOrbit.classList.remove('rotating');
        earthRotate.classList.remove('rotating');
        break;
    }
  }

  private getModeDescription(mode: string): string {
    const descriptions: Record<string, string> = {
      rotation: '仅显示地球自转（24小时周期）',
      revolution: '仅显示地球公转（365天周期）',
      both: '同时显示自转和公转',
      stop: '暂停所有运动',
    };
    return descriptions[mode] || '';
  }
}
