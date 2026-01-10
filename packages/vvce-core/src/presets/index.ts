/**
 * Presets - 内置预设模块
 */

// 主题预设
export {
  BUILTIN_THEMES,
  getThemeList,
  getThemePreset,
} from './themes';
export type { ThemePreset } from './themes';

// 动画预设
export {
  BUILTIN_ANIMATIONS,
  getAnimationList,
  getAnimationDefinition,
  ANIMATION_CATEGORIES,
} from './animations';

// 过渡预设
export {
  BUILTIN_TRANSITIONS,
  TRANSITION_CATEGORIES,
  SCENE_TRANSITION_MODES,
  getTransitionDefinition,
  getTransitionTypes,
  getSceneTransitionMode,
  getSceneTransitionModes,
} from './transitions';
export type { SceneTransitionMode } from './transitions';
