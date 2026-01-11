/**
 * ThemeProvider - 主题提供器
 * 管理主题切换和主题配置
 */

import type {
  ThemeConfig,
  BuiltinTheme,
  StyleVariables,
  StyleDefinition,
} from '@vv-education/vvce-schema';
import { StyleManager } from './StyleManager';
import { BUILTIN_THEMES } from '../presets/themes';

export interface ThemeProviderOptions {
  /** 初始主题 */
  theme?: ThemeConfig | BuiltinTheme;
  /** 样式管理器实例 */
  styleManager?: StyleManager;
  /** 主题变更回调 */
  onThemeChange?: (theme: ThemeConfig) => void;
  /** 颜色模式 */
  colorMode?: 'light' | 'dark' | 'auto';
}

export interface ResolvedTheme {
  name: string;
  mode: 'light' | 'dark';
  variables: StyleVariables;
  components: Record<string, StyleDefinition>;
}

export class ThemeProvider {
  private currentTheme: ThemeConfig;
  private resolvedTheme: ResolvedTheme;
  private styleManager: StyleManager;
  private colorMode: 'light' | 'dark' | 'auto' = 'light';
  private systemColorMode: 'light' | 'dark' = 'light';
  private onThemeChange?: (theme: ThemeConfig) => void;

  constructor(options: ThemeProviderOptions = {}) {
    this.styleManager = options.styleManager || new StyleManager();
    this.onThemeChange = options.onThemeChange;

    if (options.colorMode) {
      this.colorMode = options.colorMode;
    }

    // 初始化主题
    this.currentTheme = this.normalizeTheme(options.theme || 'default');
    this.resolvedTheme = this.resolveTheme(this.currentTheme);
    this.applyTheme();
  }

  /**
   * 标准化主题配置
   */
  private normalizeTheme(theme: ThemeConfig | BuiltinTheme): ThemeConfig {
    if (typeof theme === 'string') {
      return {
        name: theme,
        extends: theme,
      };
    }
    return theme;
  }

  /**
   * 解析主题（合并继承）
   */
  private resolveTheme(theme: ThemeConfig): ResolvedTheme {
    let baseVariables: StyleVariables = {};
    let baseComponents: Record<string, StyleDefinition> = {};

    // 如果有继承，先加载基础主题
    if (theme.extends) {
      const baseTheme = BUILTIN_THEMES[theme.extends];
      if (baseTheme) {
        baseVariables = { ...baseTheme.variables };
        baseComponents = { ...baseTheme.components };
      }
    }

    // 合并自定义变量
    const mergedVariables = this.mergeVariables(baseVariables, theme.variables || {});

    // 合并组件样式
    const mergedComponents = {
      ...baseComponents,
      ...(theme.components || {}),
    };

    // 确定颜色模式
    let effectiveMode: 'light' | 'dark' = 'light';
    if (theme.mode === 'auto') {
      effectiveMode = this.systemColorMode;
    } else if (theme.mode) {
      effectiveMode = theme.mode;
    }

    // 如果是暗色模式，应用暗色变体
    if (effectiveMode === 'dark' && theme.extends) {
      const darkVariant = BUILTIN_THEMES[`${theme.extends}-dark` as BuiltinTheme];
      if (darkVariant) {
        Object.assign(mergedVariables, darkVariant.variables);
      }
    }

    return {
      name: theme.name || theme.extends || 'custom',
      mode: effectiveMode,
      variables: mergedVariables,
      components: mergedComponents,
    };
  }

  /**
   * 深度合并样式变量
   */
  private mergeVariables(base: StyleVariables, override: StyleVariables): StyleVariables {
    const result: StyleVariables = { ...base };

    for (const [key, value] of Object.entries(override)) {
      if (
        typeof value === 'object' &&
        value !== null &&
        typeof (result as any)[key] === 'object'
      ) {
        (result as any)[key] = {
          ...(result as any)[key],
          ...value,
        };
      } else {
        (result as any)[key] = value;
      }
    }

    return result;
  }

  /**
   * 应用当前主题到样式管理器
   */
  private applyTheme(): void {
    this.styleManager.loadResources({
      variables: this.resolvedTheme.variables,
      styles: this.resolvedTheme.components,
    });
  }

  /**
   * 设置主题
   */
  setTheme(theme: ThemeConfig | BuiltinTheme): void {
    this.currentTheme = this.normalizeTheme(theme);
    this.resolvedTheme = this.resolveTheme(this.currentTheme);
    this.applyTheme();
    this.onThemeChange?.(this.currentTheme);
  }

  /**
   * 获取当前主题配置
   */
  getTheme(): ThemeConfig {
    return { ...this.currentTheme };
  }

  /**
   * 获取解析后的主题
   */
  getResolvedTheme(): ResolvedTheme {
    return { ...this.resolvedTheme };
  }

  /**
   * 设置颜色模式
   */
  setColorMode(mode: 'light' | 'dark' | 'auto'): void {
    this.colorMode = mode;

    if (mode !== 'auto') {
      // 更新解析后的主题
      if (this.resolvedTheme.mode !== mode) {
        this.resolvedTheme = this.resolveTheme(this.currentTheme);
        this.applyTheme();
      }
    } else {
      // auto 模式下使用系统设置
      this.resolvedTheme = this.resolveTheme(this.currentTheme);
      this.applyTheme();
    }
  }

  /**
   * 获取当前颜色模式
   */
  getColorMode(): 'light' | 'dark' | 'auto' {
    return this.colorMode;
  }

  /**
   * 获取有效的颜色模式（考虑 auto）
   */
  getEffectiveColorMode(): 'light' | 'dark' {
    return this.resolvedTheme.mode;
  }

  /**
   * 设置系统颜色模式（用于 auto 模式）
   */
  setSystemColorMode(mode: 'light' | 'dark'): void {
    if (this.systemColorMode !== mode) {
      this.systemColorMode = mode;
      if (this.colorMode === 'auto') {
        this.resolvedTheme = this.resolveTheme(this.currentTheme);
        this.applyTheme();
      }
    }
  }

  /**
   * 更新主题变量
   */
  updateVariables(variables: Partial<StyleVariables>): void {
    this.currentTheme = {
      ...this.currentTheme,
      variables: this.mergeVariables(this.currentTheme.variables || {}, variables),
    };
    this.resolvedTheme = this.resolveTheme(this.currentTheme);
    this.applyTheme();
  }

  /**
   * 获取主题变量值
   */
  getVariable(path: string): any {
    return this.styleManager.getVariable(path);
  }

  /**
   * 获取组件样式
   */
  getComponentStyle(componentType: string): StyleDefinition | undefined {
    return this.resolvedTheme.components[componentType];
  }

  /**
   * 获取内部样式管理器
   */
  getStyleManager(): StyleManager {
    return this.styleManager;
  }

  /**
   * 获取可用的内置主题列表
   */
  static getAvailableThemes(): BuiltinTheme[] {
    return Object.keys(BUILTIN_THEMES) as BuiltinTheme[];
  }

  /**
   * 检查是否是内置主题
   */
  static isBuiltinTheme(name: string): name is BuiltinTheme {
    return name in BUILTIN_THEMES;
  }

  /**
   * 生成主题 CSS
   */
  generateThemeCSS(): string {
    const cssVars = this.styleManager.generateCSSVariables();
    const mode = this.resolvedTheme.mode;

    return `/* Theme: ${this.resolvedTheme.name} (${mode}) */\n${cssVars}`;
  }
}
