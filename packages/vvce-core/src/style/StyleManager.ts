/**
 * StyleManager - 样式管理器
 * 管理课程中的样式资源、变量和计算
 */

import type {
  StyleVariables,
  StyleDefinition,
  StyleProperties,
  CourseResources,
} from '@vv-education/vvce-schema';

export interface StyleManagerOptions {
  /** 初始资源 */
  resources?: CourseResources;
  /** 当前断点 */
  breakpoint?: Breakpoint;
  /** 基础字体大小 */
  baseFontSize?: number;
}

export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl';

/** 断点配置 */
export const BREAKPOINTS: Record<Breakpoint, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

export class StyleManager {
  private variables: StyleVariables = {};
  private styles: Record<string, StyleDefinition> = {};
  private currentBreakpoint: Breakpoint = 'md';
  private baseFontSizeValue: number = 16;
  private computedCache: Map<string, StyleProperties> = new Map();

  constructor(options: StyleManagerOptions = {}) {
    if (options.resources) {
      this.loadResources(options.resources);
    }
    if (options.breakpoint) {
      this.currentBreakpoint = options.breakpoint;
    }
    if (options.baseFontSize) {
      this.baseFontSizeValue = options.baseFontSize;
    }
  }

  /**
   * 获取基础字体大小
   */
  getBaseFontSize(): number {
    return this.baseFontSizeValue;
  }

  /**
   * 设置基础字体大小
   */
  setBaseFontSize(size: number): void {
    this.baseFontSizeValue = size;
    this.computedCache.clear();
  }

  /**
   * 加载资源定义
   */
  loadResources(resources: CourseResources): void {
    if (resources.variables) {
      this.variables = { ...this.variables, ...resources.variables };
    }
    if (resources.styles) {
      this.styles = { ...this.styles, ...resources.styles };
    }
    // 清除缓存
    this.computedCache.clear();
  }

  /**
   * 设置样式变量
   */
  setVariable(category: keyof StyleVariables, key: string, value: any): void {
    if (!this.variables[category]) {
      (this.variables as any)[category] = {};
    }
    (this.variables as any)[category][key] = value;
    this.computedCache.clear();
  }

  /**
   * 获取样式变量值
   */
  getVariable(path: string): any {
    const parts = path.split('.');
    let current: any = this.variables;

    for (const part of parts) {
      if (current === undefined || current === null) {
        return undefined;
      }
      current = current[part];
    }

    return current;
  }

  /**
   * 解析变量引用
   * 支持 $colors.primary 或 var(--colors-primary) 格式
   */
  resolveVariableRef(value: string): any {
    if (typeof value !== 'string') {
      return value;
    }

    // $colors.primary 格式
    if (value.startsWith('$')) {
      const path = value.slice(1);
      const resolved = this.getVariable(path);
      return resolved !== undefined ? resolved : value;
    }

    // var(--colors-primary) 格式
    const varMatch = value.match(/var\(--([^)]+)\)/);
    if (varMatch) {
      const path = varMatch[1].replace(/-/g, '.');
      const resolved = this.getVariable(path);
      return resolved !== undefined ? resolved : value;
    }

    return value;
  }

  /**
   * 获取样式类定义
   */
  getStyleClass(name: string): StyleDefinition | undefined {
    return this.styles[name];
  }

  /**
   * 计算节点的最终样式
   * @param styleClass 样式类名（单个或数组）
   * @param inlineStyle 内联样式
   * @param state 当前状态（hover, active, disabled, focus）
   */
  computeStyle(
    styleClass?: string | string[],
    inlineStyle?: StyleProperties,
    state?: 'hover' | 'active' | 'disabled' | 'focus'
  ): StyleProperties {
    const cacheKey = JSON.stringify({ styleClass, inlineStyle, state });
    const cached = this.computedCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    let result: StyleProperties = {};

    // 1. 应用样式类
    if (styleClass) {
      const classes = Array.isArray(styleClass) ? styleClass : [styleClass];
      for (const className of classes) {
        const styleDef = this.styles[className];
        if (styleDef) {
          // 基础样式
          if (styleDef.base) {
            result = this.mergeStyles(result, styleDef.base);
          }
          // 状态样式
          if (state && styleDef[state]) {
            result = this.mergeStyles(result, styleDef[state]!);
          }
          // 响应式样式
          if (styleDef.responsive) {
            const responsiveStyle = this.getResponsiveStyle(styleDef.responsive);
            if (responsiveStyle) {
              result = this.mergeStyles(result, responsiveStyle);
            }
          }
        }
      }
    }

    // 2. 应用内联样式（优先级最高）
    if (inlineStyle) {
      result = this.mergeStyles(result, inlineStyle);
    }

    // 3. 解析所有变量引用
    result = this.resolveStyleVariables(result);

    // 缓存结果
    this.computedCache.set(cacheKey, result);

    return result;
  }

  /**
   * 获取响应式样式
   */
  private getResponsiveStyle(
    responsive: NonNullable<StyleDefinition['responsive']>
  ): StyleProperties | undefined {
    const breakpointOrder: Breakpoint[] = ['sm', 'md', 'lg', 'xl'];
    const currentIndex = breakpointOrder.indexOf(this.currentBreakpoint);

    // 从当前断点向下查找可用样式
    for (let i = currentIndex; i >= 0; i--) {
      const bp = breakpointOrder[i];
      if (responsive[bp]) {
        return responsive[bp];
      }
    }

    return undefined;
  }

  /**
   * 合并样式对象
   */
  private mergeStyles(
    base: StyleProperties,
    override: StyleProperties
  ): StyleProperties {
    return {
      ...base,
      ...override,
      // 深度合并 transform
      transform:
        override.transform !== undefined
          ? {
              ...(base.transform as any),
              ...(override.transform as any),
            }
          : base.transform,
    };
  }

  /**
   * 解析样式中的变量引用
   */
  private resolveStyleVariables(style: StyleProperties): StyleProperties {
    const resolved: StyleProperties = {};

    for (const [key, value] of Object.entries(style)) {
      if (typeof value === 'string') {
        (resolved as any)[key] = this.resolveVariableRef(value);
      } else if (typeof value === 'object' && value !== null) {
        (resolved as any)[key] = this.resolveStyleVariables(value as any);
      } else {
        (resolved as any)[key] = value;
      }
    }

    return resolved;
  }

  /**
   * 设置当前断点
   */
  setBreakpoint(breakpoint: Breakpoint): void {
    if (this.currentBreakpoint !== breakpoint) {
      this.currentBreakpoint = breakpoint;
      this.computedCache.clear();
    }
  }

  /**
   * 根据窗口宽度自动设置断点
   */
  setBreakpointFromWidth(width: number): void {
    let breakpoint: Breakpoint = 'sm';

    if (width >= BREAKPOINTS.xl) {
      breakpoint = 'xl';
    } else if (width >= BREAKPOINTS.lg) {
      breakpoint = 'lg';
    } else if (width >= BREAKPOINTS.md) {
      breakpoint = 'md';
    }

    this.setBreakpoint(breakpoint);
  }

  /**
   * 获取当前断点
   */
  getBreakpoint(): Breakpoint {
    return this.currentBreakpoint;
  }

  /**
   * 获取所有变量
   */
  getVariables(): StyleVariables {
    return { ...this.variables };
  }

  /**
   * 生成 CSS 变量字符串
   */
  generateCSSVariables(): string {
    const lines: string[] = [];

    const processObject = (obj: Record<string, any>, prefix: string = '') => {
      for (const [key, value] of Object.entries(obj)) {
        const varName = prefix ? `${prefix}-${key}` : key;
        if (typeof value === 'object' && value !== null) {
          processObject(value, varName);
        } else {
          lines.push(`  --${varName}: ${value};`);
        }
      }
    };

    processObject(this.variables as any);

    return `:root {\n${lines.join('\n')}\n}`;
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.computedCache.clear();
  }

  /**
   * 重置为初始状态
   */
  reset(): void {
    this.variables = {};
    this.styles = {};
    this.computedCache.clear();
  }
}
