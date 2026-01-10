/**
 * TriggerInterpreter - 触发器解释器
 * 基于 ECA（Event-Condition-Action）模型
 * 匹配事件、评估条件、执行动作
 */

import type { Trigger, VVEvent } from '../types';
import type { ConditionEvaluator } from './ConditionEvaluator';
import type { ActionExecutor } from '../executor/ActionExecutor';
import type { Logger } from '../logger/Logger';

export class TriggerInterpreter {
  constructor(
    private conditionEvaluator: ConditionEvaluator,
    private actionExecutor: ActionExecutor,
    private logger?: Logger
  ) {}

  /**
   * 处理事件，匹配并执行相应的触发器
   */
  handleEvent(event: VVEvent, triggers: Trigger[]): void {
    this.logger?.debug('event', `Event received: ${event.type}`, event);

    for (const trigger of triggers) {
      if (this.matchEvent(event, trigger)) {
        this.executeTrigger(event, trigger);
      }
    }
  }

  /**
   * 匹配事件是否符合触发器条件
   */
  private matchEvent(event: VVEvent, trigger: Trigger): boolean {
    // 检查事件类型
    if (trigger.on.event !== event.type) {
      return false;
    }

    // 检查目标（如果指定）
    if (trigger.on.target && trigger.on.target !== event.target) {
      return false;
    }

    return true;
  }

  /**
   * 执行触发器
   */
  private executeTrigger(event: VVEvent, trigger: Trigger): void {
    this.logger?.info('trigger', `Trigger matched for event: ${event.type}`);

    // 评估条件
    const conditionResult = trigger.if
      ? this.conditionEvaluator.evaluateAll(trigger.if)
      : true;

    this.logger?.debug('condition', `Condition result: ${conditionResult}`, {
      conditions: trigger.if,
    });

    // 根据条件结果执行相应动作
    if (conditionResult) {
      this.logger?.info('action', `Executing THEN actions (${trigger.then.length})`);
      this.actionExecutor.executeAll(trigger.then);
    } else if (trigger.else) {
      this.logger?.info('action', `Executing ELSE actions (${trigger.else.length})`);
      this.actionExecutor.executeAll(trigger.else);
    }
  }

  /**
   * 批量设置触发器（用于场景切换）
   */
  setTriggers(triggers: Trigger[]): void {
    this.logger?.debug('trigger', `Setting ${triggers.length} triggers`);
  }
}
