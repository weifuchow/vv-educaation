/**
 * ConditionEvaluator - 条件评估器
 * 评估 DSL 中的条件表达式
 */

import type { Condition } from '../types';
import type { ReferenceResolver } from './ReferenceResolver';

export class ConditionEvaluator {
  constructor(private resolver: ReferenceResolver) {}

  /**
   * 评估条件表达式
   */
  evaluate(condition: Condition): boolean {
    switch (condition.op) {
      case 'equals':
        return this.evaluateEquals(condition);
      case 'notEquals':
        return !this.evaluateEquals(condition);
      case 'gt':
        return this.evaluateComparison(condition, (a, b) => a > b);
      case 'gte':
        return this.evaluateComparison(condition, (a, b) => a >= b);
      case 'lt':
        return this.evaluateComparison(condition, (a, b) => a < b);
      case 'lte':
        return this.evaluateComparison(condition, (a, b) => a <= b);
      case 'and':
        return this.evaluateAnd(condition);
      case 'or':
        return this.evaluateOr(condition);
      case 'not':
        return this.evaluateNot(condition);
      default:
        console.warn(`Unknown condition operator: ${condition.op}`);
        return false;
    }
  }

  /**
   * 评估多个条件（默认为 AND 关系）
   */
  evaluateAll(conditions: Condition[]): boolean {
    if (conditions.length === 0) {
      return true;
    }
    return conditions.every((cond) => this.evaluate(cond));
  }

  private evaluateEquals(condition: Condition): boolean {
    const left = this.resolver.resolve(condition.left);
    const right = this.resolver.resolve(condition.right);
    return left === right;
  }

  private evaluateComparison(
    condition: Condition,
    compareFn: (a: any, b: any) => boolean
  ): boolean {
    const left = this.resolver.resolve(condition.left);
    const right = this.resolver.resolve(condition.right);

    // 确保都是数字
    const leftNum = Number(left);
    const rightNum = Number(right);

    if (isNaN(leftNum) || isNaN(rightNum)) {
      console.warn('Comparison operands must be numbers', { left, right });
      return false;
    }

    return compareFn(leftNum, rightNum);
  }

  private evaluateAnd(condition: Condition): boolean {
    if (!condition.conditions || condition.conditions.length === 0) {
      return true;
    }
    return condition.conditions.every((cond) => this.evaluate(cond));
  }

  private evaluateOr(condition: Condition): boolean {
    if (!condition.conditions || condition.conditions.length === 0) {
      return false;
    }
    return condition.conditions.some((cond) => this.evaluate(cond));
  }

  private evaluateNot(condition: Condition): boolean {
    if (!condition.conditions || condition.conditions.length === 0) {
      return false;
    }
    // NOT 只取第一个条件
    return !this.evaluate(condition.conditions[0]);
  }
}
