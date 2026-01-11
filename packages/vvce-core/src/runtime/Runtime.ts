/**
 * Runtime - VVCE 主运行时类
 * 整合所有组件，提供完整的课件执行环境
 */

import type {
  VVEvent,
  RuntimeOptions,
  StartOptions,
  RuntimeState,
  Trigger,
} from '../types';
import { Store } from '../store/Store';
import { EventBus } from '../event-bus/EventBus';
import { ReferenceResolver } from '../interpreter/ReferenceResolver';
import { ConditionEvaluator } from '../interpreter/ConditionEvaluator';
import { TriggerInterpreter } from '../interpreter/TriggerInterpreter';
import { ActionExecutor } from '../executor/ActionExecutor';
import { Logger } from '../logger/Logger';

export interface CourseDSL {
  schema: string;
  meta: {
    id: string;
    version: string;
  };
  globals?: {
    vars?: Record<string, any>;
  };
  startSceneId: string;
  scenes: SceneDSL[];
}

export interface SceneDSL {
  id: string;
  layout?: any;
  vars?: Record<string, any>;
  nodes?: any[];
  triggers: Trigger[];
}

export class VVCERuntime {
  private store: Store;
  private eventBus: EventBus;
  private resolver: ReferenceResolver;
  private evaluator: ConditionEvaluator;
  private executor: ActionExecutor;
  private interpreter: TriggerInterpreter;
  private logger: Logger;

  private course: CourseDSL | null = null;
  private currentSceneId: string | null = null;
  private currentTriggers: Trigger[] = [];

  private options: RuntimeOptions;

  constructor(options: RuntimeOptions = {}) {
    this.options = options;

    // 初始化日志
    this.logger = new Logger({
      debug: options.debug,
      maxLogs: 1000,
    });

    // 初始化存储
    this.store = new Store();

    // 初始化事件总线
    this.eventBus = new EventBus();

    // 初始化解释器和执行器
    this.resolver = new ReferenceResolver(this.store);
    this.evaluator = new ConditionEvaluator(this.resolver);
    this.executor = new ActionExecutor(this.store, this.resolver, {
      onSceneChange: (sceneId) => this.gotoScene(sceneId),
      onUIAction: options.onUIAction,
    });
    this.interpreter = new TriggerInterpreter(this.evaluator, this.executor, this.logger);

    // 监听所有事件用于日志记录
    this.eventBus.onAll((event) => {
      this.logger.info('event', `Event: ${event.type}`, event);
      // 触发器处理
      this.interpreter.handleEvent(event, this.currentTriggers);
    });
  }

  /**
   * 加载课程 DSL
   */
  loadCourse(dsl: CourseDSL): void {
    this.logger.info('scene', `Loading course: ${dsl.meta.id} v${dsl.meta.version}`);
    this.course = dsl;

    // 初始化全局变量
    if (dsl.globals?.vars) {
      Object.entries(dsl.globals.vars).forEach(([key, value]) => {
        this.store.set(`globals.vars.${key}`, value);
      });
    }
  }

  /**
   * 启动课程
   */
  start(options: StartOptions = {}): void {
    if (!this.course) {
      throw new Error('No course loaded. Call loadCourse() first.');
    }

    // 恢复状态（如果提供）
    if (options.initialState) {
      this.store.restore(options.initialState as RuntimeState);
    }

    // 确定起始场景
    const startSceneId = options.startSceneId || this.course.startSceneId;

    this.logger.info('scene', `Starting course from scene: ${startSceneId}`);

    // 跳转到起始场景
    this.gotoScene(startSceneId);
  }

  /**
   * 跳转到指定场景
   */
  gotoScene(sceneId: string): void {
    if (!this.course) {
      throw new Error('No course loaded.');
    }

    const scene = this.course.scenes.find((s) => s.id === sceneId);
    if (!scene) {
      this.logger.error('scene', `Scene not found: ${sceneId}`);
      throw new Error(`Scene not found: ${sceneId}`);
    }

    this.logger.info('scene', `Entering scene: ${sceneId}`);

    // 保存当前场景 ID
    const previousSceneId = this.currentSceneId;
    this.currentSceneId = sceneId;

    // 如果是新场景，重置场景状态
    if (previousSceneId !== sceneId) {
      this.store.resetSceneState();

      // 初始化场景变量
      if (scene.vars) {
        Object.entries(scene.vars).forEach(([key, value]) => {
          this.store.set(`scene.vars.${key}`, value);
        });
      }
    }

    // 设置当前场景的触发器
    this.currentTriggers = scene.triggers || [];
    this.interpreter.setTriggers(this.currentTriggers);

    // 通知场景变更
    this.options.onSceneChange?.(sceneId);

    // 派发场景进入事件
    this.emit({
      type: 'sceneEnter',
      target: sceneId,
      ts: Date.now(),
    });
  }

  /**
   * 派发事件
   */
  emit(event: VVEvent): void {
    this.eventBus.emit(event);

    // 通知状态变更
    this.options.onStateChange?.(this.store.getAll());
  }

  /**
   * 获取当前状态
   */
  getState(): RuntimeState {
    return this.store.getAll();
  }

  /**
   * 设置状态（用于恢复进度）
   */
  setState(state: Partial<RuntimeState>): void {
    if (state.globals) {
      Object.entries(state.globals.vars || {}).forEach(([key, value]) => {
        this.store.set(`globals.vars.${key}`, value);
      });
    }
    if (state.scene) {
      Object.entries(state.scene.vars || {}).forEach(([key, value]) => {
        this.store.set(`scene.vars.${key}`, value);
      });
    }
    if (state.nodes) {
      Object.entries(state.nodes).forEach(([nodeId, nodeState]) => {
        this.store.setNodeState(nodeId, nodeState);
      });
    }
  }

  /**
   * 获取当前场景 ID
   */
  getCurrentSceneId(): string | null {
    return this.currentSceneId;
  }

  /**
   * 获取当前场景定义
   */
  getCurrentScene(): SceneDSL | null {
    if (!this.course || !this.currentSceneId) {
      return null;
    }
    return this.course.scenes.find((s) => s.id === this.currentSceneId) || null;
  }

  /**
   * 更新节点状态
   */
  updateNodeState(nodeId: string, state: any): void {
    this.store.updateNodeState(nodeId, state);
    this.options.onStateChange?.(this.store.getAll());
  }

  /**
   * 获取节点状态
   */
  getNodeState(nodeId: string): any {
    return this.store.getNodeState(nodeId);
  }

  /**
   * 获取运行日志
   */
  getLogs() {
    return this.logger.getLogs();
  }

  /**
   * 导出日志
   */
  exportLogs(): string {
    return this.logger.export();
  }

  /**
   * 重置课程
   */
  reset(): void {
    this.logger.info('scene', 'Resetting runtime');
    this.store.reset();
    this.currentSceneId = null;
    this.currentTriggers = [];
    this.logger.clear();
  }

  /**
   * 销毁实例
   */
  destroy(): void {
    this.eventBus.clear();
    this.reset();
    this.logger.info('scene', 'Runtime destroyed');
  }
}
