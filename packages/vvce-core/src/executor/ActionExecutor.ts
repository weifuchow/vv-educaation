/**
 * ActionExecutor - 动作执行器
 * 执行 DSL 中定义的各种动作
 */

import type { Action, ToastAction, ModalAction } from '../types';
import type { Store } from '../store/Store';
import type { ReferenceResolver } from '../interpreter/ReferenceResolver';

export interface ActionExecutorCallbacks {
  onSceneChange?: (sceneId: string) => void;
  onUIAction?: (action: ToastAction | ModalAction) => void;
}

export class ActionExecutor {
  constructor(
    private store: Store,
    private resolver: ReferenceResolver,
    private callbacks: ActionExecutorCallbacks = {}
  ) {}

  /**
   * 执行单个动作
   */
  execute(action: Action): void {
    switch (action.action) {
      case 'gotoScene':
        this.executeGotoScene(action.sceneId);
        break;
      case 'setVar':
        this.executeSetVar(action.path, action.value);
        break;
      case 'incVar':
        this.executeIncVar(action.path, action.by ?? 1);
        break;
      case 'addScore':
        this.executeAddScore(action.value);
        break;
      case 'toast':
        this.executeToast(action.text);
        break;
      case 'modal':
        this.executeModal(action.text);
        break;
      case 'resetNode':
        this.executeResetNode(action.nodeId);
        break;
      default:
        console.warn(`Unknown action type: ${(action as any).action}`);
    }
  }

  /**
   * 执行多个动作
   */
  executeAll(actions: Action[]): void {
    actions.forEach((action) => this.execute(action));
  }

  private executeGotoScene(sceneId: string): void {
    this.callbacks.onSceneChange?.(sceneId);
  }

  private executeSetVar(path: string, value: any): void {
    // 解析值（可能是引用）
    const resolvedValue = this.resolver.resolve(value);
    this.store.set(path, resolvedValue);
  }

  private executeIncVar(path: string, by: number): void {
    const currentValue = this.store.get(path) || 0;
    const newValue = Number(currentValue) + by;
    this.store.set(path, newValue);
  }

  private executeAddScore(value: number): void {
    const currentScore = this.store.get('globals.vars.score') || 0;
    this.store.set('globals.vars.score', currentScore + value);
  }

  private executeToast(text: string): void {
    const resolvedText = this.resolver.interpolate(text);
    this.callbacks.onUIAction?.({
      action: 'toast',
      text: resolvedText,
    });
  }

  private executeModal(text: string): void {
    const resolvedText = this.resolver.interpolate(text);
    this.callbacks.onUIAction?.({
      action: 'modal',
      text: resolvedText,
    });
  }

  private executeResetNode(nodeId: string): void {
    this.store.setNodeState(nodeId, {});
  }
}
