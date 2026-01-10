/**
 * ReferenceResolver - 引用解析器
 * 解析 DSL 中的引用表达式（如 {ref: "globals.vars.score"}）
 */

import type { ValueOrRef, RefExpression } from '../types';
import type { Store } from '../store/Store';

export class ReferenceResolver {
  constructor(private store: Store) {}

  /**
   * 判断是否为引用表达式
   */
  isRef(value: any): value is RefExpression {
    return value && typeof value === 'object' && 'ref' in value;
  }

  /**
   * 解析值或引用
   */
  resolve(value: ValueOrRef): any {
    if (this.isRef(value)) {
      return this.store.get(value.ref);
    }
    return value;
  }

  /**
   * 解析文本插值
   * 将 "你的分数是 {{globals.vars.score}}" 转换为实际值
   */
  interpolate(text: string): string {
    if (typeof text !== 'string') {
      return text;
    }

    return text.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
      const value = this.store.get(path.trim());
      return value !== undefined ? String(value) : match;
    });
  }

  /**
   * 批量解析对象中的引用
   */
  resolveObject<T extends Record<string, any>>(obj: T): T {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (this.isRef(value)) {
        result[key] = this.resolve(value);
      } else if (typeof value === 'string') {
        result[key] = this.interpolate(value);
      } else if (Array.isArray(value)) {
        result[key] = value.map((item) =>
          this.isRef(item) ? this.resolve(item) : item
        );
      } else if (value && typeof value === 'object') {
        result[key] = this.resolveObject(value);
      } else {
        result[key] = value;
      }
    }
    return result as T;
  }
}
