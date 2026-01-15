/**
 * VVCE Animation Library Types
 */

export type AnimationCategory =
  | 'common'
  | 'physics'
  | 'geography'
  | 'chemistry'
  | 'biology'
  | 'math';

export type RendererType = 'css' | 'canvas' | 'threejs' | 'webgl' | 'custom';

export interface AnimationMetadata {
  id: string; // 唯一ID，如 "physics.pisa-tower"
  category: AnimationCategory;
  name: string; // 显示名称
  description: string;
  author?: string;
  version: string;
  tags: string[];
  thumbnail?: string;
  dependencies?: string[];
}

export interface AnimationState {
  playing: boolean;
  progress: number; // 0-1
  speed: number; // 播放速度，1=正常
  scale: number; // 缩放比例
  rotation?: { x: number; y: number; z: number };
  custom?: any; // 动画特定状态
}

export interface AnimationControls {
  play: boolean; // 显示播放/暂停
  reset: boolean; // 显示重置
  seek: boolean; // 显示进度条
  speed: boolean; // 显示速度控制
  zoom: boolean; // 显示缩放
  rotate: boolean; // 显示旋转（3D）
  fullscreen: boolean; // 显示全屏
  screenshot: boolean; // 显示截图
}

export interface AnimationConfig {
  autoplay?: boolean;
  loop?: boolean;
  duration?: number; // 动画时长（毫秒）
  controls?: boolean | Partial<AnimationControls>;
  interactive?: boolean;
  params?: Record<string, any>; // 动画特定参数
}

export interface AnimationDefinition {
  metadata: AnimationMetadata;

  // 渲染方法
  render: (container: HTMLElement, config: AnimationConfig) => AnimationInstance;
}

export interface AnimationInstance {
  // 控制方法
  play: () => void;
  pause: () => void;
  reset: () => void;
  seek: (progress: number) => void; // 0-1
  setSpeed: (speed: number) => void;

  // 交互方法（可选）
  zoom?: (scale: number) => void;
  rotate?: (x: number, y: number, z: number) => void;

  // 状态管理
  getState: () => AnimationState;
  setState: (state: Partial<AnimationState>) => void;

  // 事件
  on: (event: AnimationEvent, handler: (data?: any) => void) => void;
  off: (event: AnimationEvent, handler: (data?: any) => void) => void;

  // 生命周期
  destroy: () => void;
}

export type AnimationEvent =
  | 'play'
  | 'pause'
  | 'reset'
  | 'end'
  | 'progress'
  | 'stateChange';

export interface AnimationLibraryEntry {
  definition: AnimationDefinition;
  usageCount: number;
  lastUsed: number;
  rating?: number;
}
