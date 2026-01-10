/**
 * Validator - DSL 校验器
 * 提供结构校验和语义校验
 */

import type { CourseDSL } from '../types/dsl';

export interface ValidationError {
  path: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export class Validator {
  /**
   * 校验完整的课程 DSL
   */
  validateCourse(dsl: any): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];

    // 1. 结构校验
    this.validateStructure(dsl, errors);

    // 2. 语义校验
    if (errors.length === 0) {
      this.validateSemantics(dsl, errors, warnings);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * 结构校验
   */
  private validateStructure(dsl: any, errors: ValidationError[]): void {
    // 检查 schema 字段
    if (!dsl.schema || dsl.schema !== 'vvce.dsl.v1') {
      errors.push({
        path: 'schema',
        message: 'schema 必须为 "vvce.dsl.v1"',
        severity: 'error',
      });
    }

    // 检查 meta 字段
    if (!dsl.meta) {
      errors.push({
        path: 'meta',
        message: 'meta 字段是必需的',
        severity: 'error',
      });
    } else {
      if (!dsl.meta.id) {
        errors.push({
          path: 'meta.id',
          message: 'meta.id 是必需的',
          severity: 'error',
        });
      }
      if (!dsl.meta.version) {
        errors.push({
          path: 'meta.version',
          message: 'meta.version 是必需的',
          severity: 'error',
        });
      }
    }

    // 检查 startSceneId
    if (!dsl.startSceneId) {
      errors.push({
        path: 'startSceneId',
        message: 'startSceneId 是必需的',
        severity: 'error',
      });
    }

    // 检查 scenes
    if (!Array.isArray(dsl.scenes)) {
      errors.push({
        path: 'scenes',
        message: 'scenes 必须是数组',
        severity: 'error',
      });
      return;
    }

    if (dsl.scenes.length === 0) {
      errors.push({
        path: 'scenes',
        message: 'scenes 不能为空',
        severity: 'error',
      });
    }

    // 检查场景 ID 唯一性
    const sceneIds = new Set<string>();
    dsl.scenes.forEach((scene: any, index: number) => {
      if (!scene.id) {
        errors.push({
          path: `scenes[${index}].id`,
          message: 'scene.id 是必需的',
          severity: 'error',
        });
      } else if (sceneIds.has(scene.id)) {
        errors.push({
          path: `scenes[${index}].id`,
          message: `场景 ID "${scene.id}" 重复`,
          severity: 'error',
        });
      } else {
        sceneIds.add(scene.id);
      }

      // 检查节点 ID 唯一性（在场景内）
      if (scene.nodes && Array.isArray(scene.nodes)) {
        const nodeIds = new Set<string>();
        scene.nodes.forEach((node: any, nodeIndex: number) => {
          if (!node.id) {
            errors.push({
              path: `scenes[${index}].nodes[${nodeIndex}].id`,
              message: 'node.id 是必需的',
              severity: 'error',
            });
          } else if (nodeIds.has(node.id)) {
            errors.push({
              path: `scenes[${index}].nodes[${nodeIndex}].id`,
              message: `节点 ID "${node.id}" 在场景 "${scene.id}" 中重复`,
              severity: 'error',
            });
          } else {
            nodeIds.add(node.id);
          }

          if (!node.type) {
            errors.push({
              path: `scenes[${index}].nodes[${nodeIndex}].type`,
              message: 'node.type 是必需的',
              severity: 'error',
            });
          }
        });
      }
    });
  }

  /**
   * 语义校验
   */
  private validateSemantics(
    dsl: CourseDSL,
    errors: ValidationError[],
    warnings: ValidationError[]
  ): void {
    const sceneIds = new Set(dsl.scenes.map((s) => s.id));

    // 检查 startSceneId 是否存在
    if (!sceneIds.has(dsl.startSceneId)) {
      errors.push({
        path: 'startSceneId',
        message: `起始场景 "${dsl.startSceneId}" 不存在`,
        severity: 'error',
      });
    }

    // 检查场景内的引用
    dsl.scenes.forEach((scene, index) => {
      const nodeIds = new Set(scene.nodes?.map((n) => n.id) || []);

      // 检查触发器
      scene.triggers?.forEach((trigger, triggerIndex) => {
        // 检查目标节点是否存在
        if (trigger.on.target && !nodeIds.has(trigger.on.target)) {
          errors.push({
            path: `scenes[${index}].triggers[${triggerIndex}].on.target`,
            message: `目标节点 "${trigger.on.target}" 在场景 "${scene.id}" 中不存在`,
            severity: 'error',
          });
        }

        // 检查 gotoScene 动作中的场景引用
        const allActions = [...trigger.then, ...(trigger.else || [])];
        allActions.forEach((action) => {
          if (action.action === 'gotoScene' && !sceneIds.has(action.sceneId)) {
            errors.push({
              path: `scenes[${index}].triggers[${triggerIndex}]`,
              message: `目标场景 "${action.sceneId}" 不存在`,
              severity: 'error',
            });
          }
        });
      });
    });

    // 检查未使用的场景
    const usedScenes = new Set([dsl.startSceneId]);
    dsl.scenes.forEach((scene) => {
      scene.triggers?.forEach((trigger) => {
        const allActions = [...trigger.then, ...(trigger.else || [])];
        allActions.forEach((action) => {
          if (action.action === 'gotoScene') {
            usedScenes.add(action.sceneId);
          }
        });
      });
    });

    sceneIds.forEach((sceneId) => {
      if (!usedScenes.has(sceneId)) {
        warnings.push({
          path: `scenes`,
          message: `场景 "${sceneId}" 可能无法到达`,
          severity: 'warning',
        });
      }
    });
  }
}

/**
 * 便捷函数：校验课程
 */
export function validateCourse(dsl: any): ValidationResult {
  const validator = new Validator();
  return validator.validateCourse(dsl);
}
