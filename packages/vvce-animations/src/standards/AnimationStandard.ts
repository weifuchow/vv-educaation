/**
 * VVCE Animation Standard
 * 动画标准定义 - 所有动画必须遵循此标准
 */

import { AnimationMetadata } from '../types';

/**
 * 动画资源定义
 */
export interface AnimationAssets {
  /** CSS样式文件路径 */
  styles?: string;
  /** 图片资源 */
  images?: Record<string, string>;
  /** 音频资源 */
  sounds?: Record<string, string>;
  /** 视频资源 */
  videos?: Record<string, string>;
  /** SVG资源 */
  svgs?: Record<string, string>;
  /** 其他资源 */
  [key: string]: any;
}

/**
 * Web动画配置选项
 */
export interface WebAnimationConfig {
  /** 容器元素 */
  container: HTMLElement;
  /** 是否自动播放 */
  autoplay?: boolean;
  /** 自定义参数 */
  params?: Record<string, any>;
  /** 结果回调 */
  onResult?: (result: AnimationResult) => void;
  /** 交互回调 */
  onInteract?: (interaction: AnimationInteraction) => void;
}

/**
 * 动画结果
 */
export interface AnimationResult {
  type: 'complete' | 'interact' | 'error';
  data?: any;
  timestamp: number;
}

/**
 * 动画交互事件
 */
export interface AnimationInteraction {
  action: string;
  data?: any;
  timestamp?: number;
}

/**
 * 动画渲染器接口 - 所有动画渲染器必须实现
 */
export interface IAnimationRenderer {
  /** 动画ID */
  readonly id: string;

  /** 获取HTML模板 */
  getHtml(): string;

  /** 初始化动画（HTML插入后调用） */
  initialize(): void;

  /** 开始播放 */
  start(): void;

  /** 停止播放 */
  stop(): void;

  /** 重置到初始状态 */
  reset(): void;

  /** 暂停（可选） */
  pause?(): void;

  /** 恢复播放（可选） */
  resume?(): void;

  /** 销毁动画，清理资源 */
  destroy(): void;

  /** 处理控制按钮（可选，用于交互式动画） */
  handleControl?(controlId: string, element: HTMLElement): void;
}

/**
 * 动画模块定义 - 每个动画模块导出的标准结构
 */
export interface AnimationModule {
  /** 动画元数据 */
  metadata: AnimationMetadata;

  /** 动画资源 */
  assets: AnimationAssets;

  /** 创建渲染器实例 */
  createRenderer: (config: WebAnimationConfig) => IAnimationRenderer;

  /** 加载CSS样式（自动调用） */
  loadStyles?: () => void;
}

/**
 * 动画模块基类 - 提供通用功能
 */
export abstract class AnimationModuleBase implements AnimationModule {
  abstract metadata: AnimationMetadata;
  abstract assets: AnimationAssets;
  abstract createRenderer(config: WebAnimationConfig): IAnimationRenderer;

  private stylesLoaded = false;

  /**
   * 加载动画样式
   */
  loadStyles(): void {
    if (this.stylesLoaded || !this.assets.styles) return;

    const styleId = `vvce-animation-${this.metadata.id}`;
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = this.assets.styles;
    document.head.appendChild(style);

    this.stylesLoaded = true;
  }
}
