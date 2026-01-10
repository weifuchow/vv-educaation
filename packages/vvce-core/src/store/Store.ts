/**
 * Store - 主状态管理容器
 * 管理三层状态：globals、scene、nodes
 */

import type { RuntimeState, IStore } from '../types';

export class Store implements IStore {
  private state: RuntimeState;

  constructor(initialState?: Partial<RuntimeState>) {
    this.state = {
      globals: {
        vars: {},
      },
      scene: {
        vars: {},
      },
      nodes: {},
      ...initialState,
    };
  }

  /**
   * 获取指定路径的值
   * 支持路径：globals.vars.score、scene.vars.temp、q1.state.selected
   */
  get(path: string): any {
    const parts = path.split('.');
    let current: any = this.state;

    for (const part of parts) {
      if (current === undefined || current === null) {
        return undefined;
      }
      current = current[part];
    }

    return current;
  }

  /**
   * 设置指定路径的值
   */
  set(path: string, value: any): void {
    const parts = path.split('.');
    const lastPart = parts.pop()!;
    let current: any = this.state;

    // 导航到父对象
    for (const part of parts) {
      if (!(part in current)) {
        current[part] = {};
      }
      current = current[part];
    }

    // 设置值
    current[lastPart] = value;
  }

  /**
   * 获取完整状态
   */
  getAll(): RuntimeState {
    return this.state;
  }

  /**
   * 获取全局变量
   */
  getGlobalVars(): Record<string, any> {
    return this.state.globals.vars;
  }

  /**
   * 获取场景变量
   */
  getSceneVars(): Record<string, any> {
    return this.state.scene.vars;
  }

  /**
   * 获取节点状态
   */
  getNodeState(nodeId: string): any {
    return this.state.nodes[nodeId] || {};
  }

  /**
   * 设置节点状态
   */
  setNodeState(nodeId: string, state: any): void {
    this.state.nodes[nodeId] = state;
  }

  /**
   * 更新节点状态（部分更新）
   */
  updateNodeState(nodeId: string, updates: any): void {
    if (!this.state.nodes[nodeId]) {
      this.state.nodes[nodeId] = {};
    }
    Object.assign(this.state.nodes[nodeId], updates);
  }

  /**
   * 重置场景变量和节点状态（切换场景时使用）
   */
  resetSceneState(): void {
    this.state.scene.vars = {};
    this.state.nodes = {};
  }

  /**
   * 重置所有状态
   */
  reset(): void {
    this.state = {
      globals: {
        vars: {},
      },
      scene: {
        vars: {},
      },
      nodes: {},
    };
  }

  /**
   * 克隆当前状态（用于快照）
   */
  clone(): RuntimeState {
    return JSON.parse(JSON.stringify(this.state));
  }

  /**
   * 从快照恢复状态
   */
  restore(snapshot: RuntimeState): void {
    this.state = JSON.parse(JSON.stringify(snapshot));
  }
}
