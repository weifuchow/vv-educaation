/**
 * SemanticValidator - Enhanced semantic validation
 * Provides deep validation of DSL semantics including:
 * - Reference path validation
 * - Circular dependency detection
 * - Action parameter validation
 * - Component registry validation
 * - Animation/Theme reference validation
 */

import type {
  CourseDSL,
  TriggerDSL,
  ActionDSL,
  ConditionDSL,
  ValueOrRef,
  RefExpression,
} from '../types/dsl';

export interface SemanticError {
  path: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
  code: SemanticErrorCode;
}

export type SemanticErrorCode =
  // Reference errors
  | 'INVALID_SCENE_REF'
  | 'INVALID_NODE_REF'
  | 'INVALID_VAR_PATH'
  | 'INVALID_ANIMATION_REF'
  | 'INVALID_THEME_REF'
  | 'INVALID_STYLE_REF'
  // Structure errors
  | 'CIRCULAR_SCENE_REF'
  | 'UNREACHABLE_SCENE'
  | 'DEAD_TRIGGER'
  | 'EMPTY_ACTIONS'
  // Action errors
  | 'INVALID_ACTION_PARAMS'
  | 'NESTED_DEPTH_EXCEEDED'
  // Component errors
  | 'UNKNOWN_COMPONENT_TYPE'
  | 'INVALID_COMPONENT_PROPS'
  // Style errors
  | 'UNDEFINED_STYLE_VAR'
  | 'INVALID_STYLE_VALUE';

export interface SemanticValidationResult {
  valid: boolean;
  errors: SemanticError[];
  warnings: SemanticError[];
  info: SemanticError[];
}

// M0 component registry
const M0_COMPONENTS = new Set(['Dialog', 'QuizSingle', 'Button']);

// Built-in animations
const BUILTIN_ANIMATIONS = new Set([
  'fadeIn',
  'fadeOut',
  'slideInLeft',
  'slideInRight',
  'slideInUp',
  'slideInDown',
  'slideOutLeft',
  'slideOutRight',
  'slideOutUp',
  'slideOutDown',
  'scaleIn',
  'scaleOut',
  'rotateIn',
  'rotateOut',
  'bounceIn',
  'bounceOut',
  'flipInX',
  'flipInY',
  'flipOutX',
  'flipOutY',
  'zoomIn',
  'zoomOut',
  'pulse',
  'shake',
  'wobble',
  'swing',
  'tada',
  'heartbeat',
  'rubber',
  'jello',
  'float',
  'glow',
]);

// Built-in themes
const BUILTIN_THEMES = new Set([
  'default',
  'playful',
  'academic',
  'minimal',
  'vibrant',
  'dark',
  'nature',
  'tech',
  'retro',
]);

// Valid reference path patterns
const VALID_REF_PATTERNS = [
  /^globals\.vars\.[a-zA-Z_][a-zA-Z0-9_]*$/,
  /^scene\.vars\.[a-zA-Z_][a-zA-Z0-9_]*$/,
  /^[a-zA-Z_][a-zA-Z0-9_]*\.state\.[a-zA-Z_][a-zA-Z0-9_]*$/,
];

// Maximum nesting depth for parallel/sequence actions
const MAX_ACTION_DEPTH = 10;

/**
 * SemanticValidator provides comprehensive DSL semantic validation
 */
export class SemanticValidator {
  private errors: SemanticError[] = [];
  private warnings: SemanticError[] = [];
  private info: SemanticError[] = [];

  // Collected metadata for analysis
  private sceneIds = new Set<string>();
  private nodeIdsByScene = new Map<string, Set<string>>();
  private customAnimations = new Set<string>();
  private customThemes = new Set<string>();
  private customStyles = new Set<string>();
  private styleVariables = new Set<string>();

  /**
   * Validate DSL semantics
   */
  validate(dsl: CourseDSL): SemanticValidationResult {
    this.reset();
    this.collectMetadata(dsl);

    // Run all validation passes
    this.validateSceneReferences(dsl);
    this.validateNodeReferences(dsl);
    this.validateVarPaths(dsl);
    this.validateAnimationReferences(dsl);
    this.validateThemeReferences(dsl);
    this.validateComponentTypes(dsl);
    this.validateActionParameters(dsl);
    this.detectCircularSceneRefs(dsl);
    this.detectUnreachableScenes(dsl);
    this.validateActionNesting(dsl);

    return {
      valid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
      info: this.info,
    };
  }

  /**
   * Reset state for new validation
   */
  private reset(): void {
    this.errors = [];
    this.warnings = [];
    this.info = [];
    this.sceneIds.clear();
    this.nodeIdsByScene.clear();
    this.customAnimations.clear();
    this.customThemes.clear();
    this.customStyles.clear();
    this.styleVariables.clear();
  }

  /**
   * Collect metadata for cross-reference validation
   */
  private collectMetadata(dsl: CourseDSL): void {
    // Collect scene IDs
    dsl.scenes.forEach((scene) => {
      this.sceneIds.add(scene.id);

      // Collect node IDs per scene
      const nodeIds = new Set<string>();
      scene.nodes?.forEach((node) => nodeIds.add(node.id));
      this.nodeIdsByScene.set(scene.id, nodeIds);
    });

    // Collect custom resources
    if (dsl.resources) {
      if (dsl.resources.animations) {
        Object.keys(dsl.resources.animations).forEach((name) =>
          this.customAnimations.add(name)
        );
      }
      if (dsl.resources.styles) {
        Object.keys(dsl.resources.styles).forEach((name) => this.customStyles.add(name));
      }
      if (dsl.resources.variables) {
        this.collectStyleVariables(dsl.resources.variables, '');
      }
    }

    // Collect theme name if custom
    if (dsl.theme && typeof dsl.theme === 'object' && dsl.theme.name) {
      this.customThemes.add(dsl.theme.name);
    }
  }

  /**
   * Recursively collect style variable paths
   */
  private collectStyleVariables(obj: object, prefix: string): void {
    for (const [key, value] of Object.entries(obj)) {
      const path = prefix ? `${prefix}.${key}` : key;
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        this.collectStyleVariables(value, path);
      } else {
        this.styleVariables.add(path);
      }
    }
  }

  /**
   * Validate scene references (startSceneId, gotoScene)
   */
  private validateSceneReferences(dsl: CourseDSL): void {
    // Check startSceneId
    if (!this.sceneIds.has(dsl.startSceneId)) {
      this.errors.push({
        path: 'startSceneId',
        message: `起始场景 "${dsl.startSceneId}" 不存在`,
        severity: 'error',
        code: 'INVALID_SCENE_REF',
      });
    }

    // Check gotoScene actions
    dsl.scenes.forEach((scene, sceneIndex) => {
      this.validateActionsForSceneRefs(scene.triggers || [], sceneIndex, scene.id);
    });
  }

  /**
   * Validate gotoScene references in triggers
   */
  private validateActionsForSceneRefs(
    triggers: TriggerDSL[],
    sceneIndex: number,
    _sceneId: string
  ): void {
    triggers.forEach((trigger, triggerIndex) => {
      const path = `scenes[${sceneIndex}].triggers[${triggerIndex}]`;
      this.validateActionsRecursive(trigger.then, path, (action) => {
        if (action.action === 'gotoScene' && !this.sceneIds.has(action.sceneId)) {
          this.errors.push({
            path: `${path}.then`,
            message: `目标场景 "${action.sceneId}" 不存在`,
            severity: 'error',
            code: 'INVALID_SCENE_REF',
          });
        }
      });

      if (trigger.else) {
        this.validateActionsRecursive(trigger.else, path, (action) => {
          if (action.action === 'gotoScene' && !this.sceneIds.has(action.sceneId)) {
            this.errors.push({
              path: `${path}.else`,
              message: `目标场景 "${action.sceneId}" 不存在`,
              severity: 'error',
              code: 'INVALID_SCENE_REF',
            });
          }
        });
      }
    });
  }

  /**
   * Recursively validate actions (handles parallel/sequence)
   */
  private validateActionsRecursive(
    actions: ActionDSL[],
    basePath: string,
    validator: (action: ActionDSL) => void
  ): void {
    actions.forEach((action) => {
      validator(action);
      if (action.action === 'parallel' || action.action === 'sequence') {
        this.validateActionsRecursive(action.actions, basePath, validator);
      }
    });
  }

  /**
   * Validate node references in triggers and actions
   */
  private validateNodeReferences(dsl: CourseDSL): void {
    dsl.scenes.forEach((scene, sceneIndex) => {
      const nodeIds = this.nodeIdsByScene.get(scene.id) || new Set();

      scene.triggers?.forEach((trigger, triggerIndex) => {
        const path = `scenes[${sceneIndex}].triggers[${triggerIndex}]`;

        // Check trigger target
        if (trigger.on.target && !nodeIds.has(trigger.on.target)) {
          this.errors.push({
            path: `${path}.on.target`,
            message: `目标节点 "${trigger.on.target}" 在场景 "${scene.id}" 中不存在`,
            severity: 'error',
            code: 'INVALID_NODE_REF',
          });
        }

        // Check node references in actions
        this.validateNodeRefsInActions(
          [...trigger.then, ...(trigger.else || [])],
          path,
          nodeIds
        );
      });
    });
  }

  /**
   * Validate node references in actions
   */
  private validateNodeRefsInActions(
    actions: ActionDSL[],
    basePath: string,
    nodeIds: Set<string>
  ): void {
    actions.forEach((action) => {
      const targetActions = [
        'playAnimation',
        'stopAnimation',
        'setStyle',
        'addClass',
        'removeClass',
        'showNode',
        'hideNode',
        'resetNode',
      ];

      if (targetActions.includes(action.action)) {
        const target =
          (action as { target?: string; nodeId?: string }).target ||
          (action as { nodeId?: string }).nodeId;
        if (target && !nodeIds.has(target)) {
          this.warnings.push({
            path: basePath,
            message: `动作目标节点 "${target}" 在当前场景中不存在`,
            severity: 'warning',
            code: 'INVALID_NODE_REF',
          });
        }
      }

      // Recurse into parallel/sequence
      if (action.action === 'parallel' || action.action === 'sequence') {
        this.validateNodeRefsInActions(action.actions, basePath, nodeIds);
      }
    });
  }

  /**
   * Validate variable reference paths
   */
  private validateVarPaths(dsl: CourseDSL): void {
    dsl.scenes.forEach((scene, sceneIndex) => {
      scene.triggers?.forEach((trigger, triggerIndex) => {
        const path = `scenes[${sceneIndex}].triggers[${triggerIndex}]`;

        // Validate conditions
        if (trigger.if) {
          trigger.if.forEach((condition, condIndex) => {
            this.validateConditionRefs(condition, `${path}.if[${condIndex}]`);
          });
        }

        // Validate actions with paths
        [...trigger.then, ...(trigger.else || [])].forEach((action) => {
          if ('path' in action && typeof action.path === 'string') {
            this.validateRefPath(action.path, `${path}`);
          }
        });
      });
    });
  }

  /**
   * Validate references in conditions
   */
  private validateConditionRefs(condition: ConditionDSL, path: string): void {
    if ('conditions' in condition) {
      // Logical condition
      condition.conditions.forEach((c, i) => {
        this.validateConditionRefs(c, `${path}.conditions[${i}]`);
      });
    } else {
      // Comparison condition
      this.validateValueOrRef(condition.left, `${path}.left`);
      this.validateValueOrRef(condition.right, `${path}.right`);
    }
  }

  /**
   * Validate a value or reference
   */
  private validateValueOrRef(value: ValueOrRef, path: string): void {
    if (this.isRefExpression(value)) {
      this.validateRefPath(value.ref, path);
    }
  }

  /**
   * Check if value is a ref expression
   */
  private isRefExpression(value: ValueOrRef): value is RefExpression {
    return typeof value === 'object' && value !== null && 'ref' in value;
  }

  /**
   * Validate a reference path format
   */
  private validateRefPath(refPath: string, location: string): void {
    const isValid = VALID_REF_PATTERNS.some((pattern) => pattern.test(refPath));
    if (!isValid) {
      this.warnings.push({
        path: location,
        message: `引用路径 "${refPath}" 格式可能无效，应为 globals.vars.*, scene.vars.*, 或 nodeId.state.*`,
        severity: 'warning',
        code: 'INVALID_VAR_PATH',
      });
    }
  }

  /**
   * Validate animation references
   */
  private validateAnimationReferences(dsl: CourseDSL): void {
    const allAnimations = new Set([...BUILTIN_ANIMATIONS, ...this.customAnimations]);

    dsl.scenes.forEach((scene, sceneIndex) => {
      // Check node animations
      scene.nodes?.forEach((node, nodeIndex) => {
        const nodePath = `scenes[${sceneIndex}].nodes[${nodeIndex}]`;

        if (node.enterAnimation?.type && !allAnimations.has(node.enterAnimation.type)) {
          this.warnings.push({
            path: `${nodePath}.enterAnimation`,
            message: `动画 "${node.enterAnimation.type}" 未定义`,
            severity: 'warning',
            code: 'INVALID_ANIMATION_REF',
          });
        }

        if (node.exitAnimation?.type && !allAnimations.has(node.exitAnimation.type)) {
          this.warnings.push({
            path: `${nodePath}.exitAnimation`,
            message: `动画 "${node.exitAnimation.type}" 未定义`,
            severity: 'warning',
            code: 'INVALID_ANIMATION_REF',
          });
        }
      });

      // Check action animations
      scene.triggers?.forEach((trigger, triggerIndex) => {
        const triggerPath = `scenes[${sceneIndex}].triggers[${triggerIndex}]`;
        this.validateActionsRecursive(
          [...trigger.then, ...(trigger.else || [])],
          triggerPath,
          (action) => {
            if (action.action === 'playAnimation') {
              if (!allAnimations.has(action.animation)) {
                this.warnings.push({
                  path: triggerPath,
                  message: `动画 "${action.animation}" 未定义`,
                  severity: 'warning',
                  code: 'INVALID_ANIMATION_REF',
                });
              }
            }
          }
        );
      });
    });
  }

  /**
   * Validate theme references
   */
  private validateThemeReferences(dsl: CourseDSL): void {
    const allThemes = new Set([...BUILTIN_THEMES, ...this.customThemes]);

    dsl.scenes.forEach((scene, sceneIndex) => {
      scene.triggers?.forEach((trigger, triggerIndex) => {
        const triggerPath = `scenes[${sceneIndex}].triggers[${triggerIndex}]`;
        this.validateActionsRecursive(
          [...trigger.then, ...(trigger.else || [])],
          triggerPath,
          (action) => {
            if (action.action === 'setTheme') {
              if (!allThemes.has(action.theme)) {
                this.warnings.push({
                  path: triggerPath,
                  message: `主题 "${action.theme}" 未定义`,
                  severity: 'warning',
                  code: 'INVALID_THEME_REF',
                });
              }
            }
          }
        );
      });
    });
  }

  /**
   * Validate component types against registry
   */
  private validateComponentTypes(dsl: CourseDSL): void {
    dsl.scenes.forEach((scene, sceneIndex) => {
      scene.nodes?.forEach((node, nodeIndex) => {
        if (!M0_COMPONENTS.has(node.type)) {
          this.info.push({
            path: `scenes[${sceneIndex}].nodes[${nodeIndex}].type`,
            message: `组件类型 "${node.type}" 不在 M0 组件注册表中 (Dialog, QuizSingle, Button)`,
            severity: 'info',
            code: 'UNKNOWN_COMPONENT_TYPE',
          });
        }
      });
    });
  }

  /**
   * Validate action parameters
   */
  private validateActionParameters(dsl: CourseDSL): void {
    dsl.scenes.forEach((scene, sceneIndex) => {
      scene.triggers?.forEach((trigger, triggerIndex) => {
        const path = `scenes[${sceneIndex}].triggers[${triggerIndex}]`;
        this.validateActionsParams([...trigger.then, ...(trigger.else || [])], path);
      });
    });
  }

  /**
   * Validate individual action parameters
   */
  private validateActionsParams(actions: ActionDSL[], basePath: string): void {
    actions.forEach((action, index) => {
      const actionPath = `${basePath}.actions[${index}]`;

      switch (action.action) {
        case 'addScore':
          if (typeof action.value !== 'number') {
            this.errors.push({
              path: actionPath,
              message: 'addScore.value 必须是数字',
              severity: 'error',
              code: 'INVALID_ACTION_PARAMS',
            });
          }
          break;

        case 'delay':
          if (typeof action.duration !== 'number' || action.duration < 0) {
            this.errors.push({
              path: actionPath,
              message: 'delay.duration 必须是非负数字',
              severity: 'error',
              code: 'INVALID_ACTION_PARAMS',
            });
          }
          break;

        case 'toast':
          if (!action.text || typeof action.text !== 'string') {
            this.errors.push({
              path: actionPath,
              message: 'toast.text 必须是非空字符串',
              severity: 'error',
              code: 'INVALID_ACTION_PARAMS',
            });
          }
          break;

        case 'parallel':
        case 'sequence':
          if (!action.actions || action.actions.length === 0) {
            this.errors.push({
              path: actionPath,
              message: `${action.action}.actions 不能为空`,
              severity: 'error',
              code: 'EMPTY_ACTIONS',
            });
          } else {
            this.validateActionsParams(action.actions, actionPath);
          }
          break;
      }
    });
  }

  /**
   * Detect circular scene references
   */
  private detectCircularSceneRefs(dsl: CourseDSL): void {
    const sceneGraph = new Map<string, Set<string>>();

    // Build scene graph
    dsl.scenes.forEach((scene) => {
      const targets = new Set<string>();
      scene.triggers?.forEach((trigger) => {
        [...trigger.then, ...(trigger.else || [])].forEach((action) => {
          this.collectGotoTargets(action, targets);
        });
      });
      sceneGraph.set(scene.id, targets);
    });

    // Find scenes that only loop to themselves
    sceneGraph.forEach((targets, sceneId) => {
      if (targets.size === 1 && targets.has(sceneId)) {
        this.warnings.push({
          path: `scenes`,
          message: `场景 "${sceneId}" 仅引用自身，可能导致无限循环`,
          severity: 'warning',
          code: 'CIRCULAR_SCENE_REF',
        });
      }
    });

    // Find strongly connected components (cycles)
    this.findCycles(sceneGraph);
  }

  /**
   * Collect gotoScene targets from action
   */
  private collectGotoTargets(action: ActionDSL, targets: Set<string>): void {
    if (action.action === 'gotoScene') {
      targets.add(action.sceneId);
    } else if (action.action === 'parallel' || action.action === 'sequence') {
      action.actions.forEach((a) => this.collectGotoTargets(a, targets));
    }
  }

  /**
   * Find cycles in scene graph using DFS
   */
  private findCycles(graph: Map<string, Set<string>>): void {
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    const cyclePaths: string[][] = [];

    const dfs = (node: string, path: string[]): void => {
      visited.add(node);
      recursionStack.add(node);
      path.push(node);

      const neighbors = graph.get(node) || new Set();
      Array.from(neighbors).forEach((neighbor) => {
        if (!visited.has(neighbor)) {
          dfs(neighbor, [...path]);
        } else if (recursionStack.has(neighbor)) {
          // Found cycle
          const cycleStart = path.indexOf(neighbor);
          const cycle = path.slice(cycleStart);
          if (cycle.length > 1) {
            cyclePaths.push(cycle);
          }
        }
      });

      recursionStack.delete(node);
    };

    Array.from(graph.keys()).forEach((node) => {
      if (!visited.has(node)) {
        dfs(node, []);
      }
    });

    // Report significant cycles (more than 2 scenes)
    cyclePaths.forEach((cycle) => {
      if (cycle.length >= 2) {
        this.info.push({
          path: 'scenes',
          message: `检测到场景循环: ${cycle.join(' -> ')} -> ${cycle[0]}`,
          severity: 'info',
          code: 'CIRCULAR_SCENE_REF',
        });
      }
    });
  }

  /**
   * Detect unreachable scenes
   */
  private detectUnreachableScenes(dsl: CourseDSL): void {
    const reachable = new Set<string>([dsl.startSceneId]);
    const queue = [dsl.startSceneId];

    while (queue.length > 0) {
      const current = queue.shift()!;
      const scene = dsl.scenes.find((s) => s.id === current);

      if (!scene) continue;

      scene.triggers?.forEach((trigger) => {
        [...trigger.then, ...(trigger.else || [])].forEach((action) => {
          this.collectGotoTargets(action, reachable);
        });
      });

      // Add newly found scenes to queue
      reachable.forEach((sceneId) => {
        if (!queue.includes(sceneId) && this.sceneIds.has(sceneId)) {
          const alreadyProcessed =
            Array.from(reachable).indexOf(sceneId) <
            Array.from(reachable).indexOf(current);
          if (!alreadyProcessed) {
            queue.push(sceneId);
          }
        }
      });
    }

    // Report unreachable scenes
    this.sceneIds.forEach((sceneId) => {
      if (!reachable.has(sceneId)) {
        this.warnings.push({
          path: 'scenes',
          message: `场景 "${sceneId}" 可能无法到达`,
          severity: 'warning',
          code: 'UNREACHABLE_SCENE',
        });
      }
    });
  }

  /**
   * Validate action nesting depth
   */
  private validateActionNesting(dsl: CourseDSL): void {
    dsl.scenes.forEach((scene, sceneIndex) => {
      scene.triggers?.forEach((trigger, triggerIndex) => {
        const path = `scenes[${sceneIndex}].triggers[${triggerIndex}]`;
        this.checkActionDepth(trigger.then, path, 0);
        if (trigger.else) {
          this.checkActionDepth(trigger.else, path, 0);
        }
      });
    });
  }

  /**
   * Check action nesting depth
   */
  private checkActionDepth(actions: ActionDSL[], path: string, depth: number): void {
    if (depth > MAX_ACTION_DEPTH) {
      this.errors.push({
        path,
        message: `动作嵌套深度超过限制 (最大 ${MAX_ACTION_DEPTH})`,
        severity: 'error',
        code: 'NESTED_DEPTH_EXCEEDED',
      });
      return;
    }

    actions.forEach((action) => {
      if (action.action === 'parallel' || action.action === 'sequence') {
        this.checkActionDepth(action.actions, path, depth + 1);
      }
    });
  }
}

/**
 * Convenience function for semantic validation
 */
export function validateSemantics(dsl: CourseDSL): SemanticValidationResult {
  const validator = new SemanticValidator();
  return validator.validate(dsl);
}
