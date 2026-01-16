/**
 * Blood Circulation Animation Renderer
 * 血液循环渲染器
 */

import {
  IAnimationRenderer,
  WebAnimationConfig,
  AnimationResult,
} from '../../standards/AnimationStandard';

type CirculationMode = 'both' | 'systemic' | 'pulmonary' | 'stop';

export class BloodCirculationRenderer implements IAnimationRenderer {
  public readonly id = 'biology.blood-circulation';
  private container: HTMLElement;
  private config: WebAnimationConfig;
  private mode: CirculationMode = 'both';

  constructor(config: WebAnimationConfig) {
    this.container = config.container;
    this.config = config;
  }

  getHtml(): string {
    return `
      <div class="blood-circulation">
        <div class="blood-legend">
          <span class="legend-item legend-oxygen">
            <span class="legend-dot oxygen"></span> 富氧血
          </span>
          <span class="legend-item legend-deoxygen">
            <span class="legend-dot deoxygen"></span> 缺氧血
          </span>
        </div>
        <div class="body-system">
          <div class="lungs">
            <div class="lung left"></div>
            <div class="lung right"></div>
            <div class="label">肺</div>
          </div>
          <div class="heart">
            <div class="heart-left"></div>
            <div class="heart-right"></div>
            <div class="label">心脏</div>
          </div>
          <div class="body">
            <div class="body-core"></div>
            <div class="label">全身组织</div>
          </div>
          <div class="vessel vessel-systemic"></div>
          <div class="vessel vessel-pulmonary"></div>
          <div class="flow flow-systemic">
            <span class="flow-dot"></span>
            <span class="flow-dot"></span>
          </div>
          <div class="flow flow-pulmonary">
            <span class="flow-dot"></span>
            <span class="flow-dot"></span>
          </div>
        </div>
        <div class="flow-info" id="flow-info">体循环 + 肺循环</div>
      </div>
    `;
  }

  initialize(): void {
    this.applyMode('both');

    if (this.config.autoplay) {
      this.start();
    }
  }

  start(): void {
    this.applyMode(this.mode === 'stop' ? 'both' : this.mode);
    this.emitInteraction({ action: 'animation_start', data: { mode: this.mode } });
  }

  stop(): void {
    this.applyMode('stop');
  }

  reset(): void {
    this.applyMode('both');
  }

  destroy(): void {
    this.stop();
    this.container.innerHTML = '';
  }

  handleControl(controlId: string, element: HTMLElement): void {
    const allButtons = document.querySelectorAll('.control-button');
    allButtons.forEach((btn) => btn.classList.remove('active'));
    element.classList.add('active');

    switch (controlId) {
      case 'control-systemic':
        this.applyMode('systemic');
        break;
      case 'control-pulmonary':
        this.applyMode('pulmonary');
        break;
      case 'control-both':
        this.applyMode('both');
        break;
      case 'control-stop':
        this.applyMode('stop');
        break;
      default:
        this.applyMode('both');
    }

    this.emitInteraction({ action: 'control_change', data: { mode: this.mode } });
    this.emitResult('interact', { mode: this.mode, description: this.getModeText() });
  }

  private applyMode(mode: CirculationMode): void {
    this.mode = mode;
    const root = this.container.querySelector('.blood-circulation') as HTMLElement;
    const info = this.container.querySelector('#flow-info') as HTMLElement;

    if (!root) return;

    root.classList.remove('mode-both', 'mode-systemic', 'mode-pulmonary', 'mode-stop');
    root.classList.add(`mode-${mode}`);

    if (info) {
      info.textContent = this.getModeText();
    }
  }

  private getModeText(): string {
    switch (this.mode) {
      case 'systemic':
        return '体循环：左心室 → 全身 → 右心房';
      case 'pulmonary':
        return '肺循环：右心室 → 肺 → 左心房';
      case 'stop':
        return '暂停循环（停止流动）';
      case 'both':
      default:
        return '体循环 + 肺循环';
    }
  }

  private emitResult(type: AnimationResult['type'], data?: any): void {
    this.config.onResult?.({ type, data, timestamp: Date.now() });
  }

  private emitInteraction(interaction: any): void {
    this.config.onInteract?.({ ...interaction, timestamp: Date.now() });
  }
}
