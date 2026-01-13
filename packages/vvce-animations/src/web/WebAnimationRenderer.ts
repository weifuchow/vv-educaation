/**
 * Web Animation Renderer
 * 浏览器环境下的动画渲染器，支持交互和结果传递
 */

export interface AnimationResult {
  type: 'complete' | 'interact' | 'error';
  data?: any;
  timestamp: number;
}

export interface WebAnimationConfig {
  container: HTMLElement;
  onResult?: (result: AnimationResult) => void;
  onInteract?: (interaction: any) => void;
  autoplay?: boolean;
  params?: Record<string, any>;
}

export interface WebAnimation {
  id: string;
  start: () => void;
  stop: () => void;
  reset: () => void;
  pause?: () => void;
  resume?: () => void;
  destroy: () => void;
  handleControl?: (controlId: string, element: HTMLElement) => void;
}

/**
 * Web Animation Renderer Base Class
 */
export abstract class WebAnimationRenderer implements WebAnimation {
  protected container: HTMLElement;
  protected config: WebAnimationConfig;
  public id: string;

  constructor(id: string, config: WebAnimationConfig) {
    this.id = id;
    this.container = config.container;
    this.config = config;
  }

  /**
   * Get HTML template for the animation
   */
  abstract getHtml(): string;

  /**
   * Initialize the animation after HTML is inserted
   */
  abstract initialize(): void;

  /**
   * Start the animation
   */
  abstract start(): void;

  /**
   * Stop the animation
   */
  abstract stop(): void;

  /**
   * Reset the animation to initial state
   */
  abstract reset(): void;

  /**
   * Clean up resources
   */
  destroy(): void {
    this.stop();
    this.container.innerHTML = '';
  }

  /**
   * Emit a result event
   */
  protected emitResult(type: AnimationResult['type'], data?: any): void {
    if (this.config.onResult) {
      this.config.onResult({
        type,
        data,
        timestamp: Date.now(),
      });
    }
  }

  /**
   * Emit an interaction event
   */
  protected emitInteraction(interaction: any): void {
    if (this.config.onInteract) {
      this.config.onInteract(interaction);
    }
  }
}

/**
 * Web Animation Registry for browser environment
 */
export class WebAnimationRegistry {
  private animations: Map<string, any>;

  constructor() {
    this.animations = new Map();
  }

  /**
   * Register a web animation renderer
   */
  register(
    id: string,
    rendererClass: new (config: WebAnimationConfig) => WebAnimationRenderer
  ): void {
    this.animations.set(id, rendererClass);
  }

  /**
   * Create an animation instance
   */
  create(id: string, config: WebAnimationConfig): WebAnimationRenderer | null {
    const RendererClass = this.animations.get(id);
    if (!RendererClass) {
      console.warn(`Animation renderer "${id}" not found`);
      return null;
    }
    return new RendererClass(config);
  }

  /**
   * Get HTML for an animation
   */
  getHtml(id: string): string {
    const RendererClass = this.animations.get(id);
    if (!RendererClass) {
      return `<div style="padding: 40px; text-align: center;">Animation "${id}" not found</div>`;
    }
    // Create temporary instance to get HTML
    const tempContainer = document.createElement('div');
    const instance = new RendererClass({ container: tempContainer });
    return instance.getHtml();
  }

  /**
   * Check if animation exists
   */
  has(id: string): boolean {
    return this.animations.has(id);
  }

  /**
   * Get all registered animation IDs
   */
  getIds(): string[] {
    return Array.from(this.animations.keys());
  }
}

// Global registry instance
export const webAnimationRegistry = new WebAnimationRegistry();
