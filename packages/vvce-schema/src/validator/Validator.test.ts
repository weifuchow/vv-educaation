/**
 * Validator Tests
 * Comprehensive tests for structure and semantic validation
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { Validator, validateCourse } from './Validator';
import type { CourseDSL } from '../types/dsl';

describe('Validator', () => {
  let validator: Validator;

  beforeEach(() => {
    validator = new Validator();
  });

  // Helper to create a minimal valid DSL
  const createValidDSL = (overrides: Partial<CourseDSL> = {}): CourseDSL => ({
    schema: 'vvce.dsl.v1',
    meta: {
      id: 'test-course',
      version: '1.0.0',
    },
    startSceneId: 'scene1',
    scenes: [
      {
        id: 'scene1',
        nodes: [{ id: 'btn1', type: 'Button', props: { text: 'Click' } }],
        triggers: [],
      },
    ],
    ...overrides,
  });

  describe('Structure Validation', () => {
    it('should pass for a valid minimal DSL', () => {
      const dsl = createValidDSL();
      const result = validator.validateCourse(dsl);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when schema is missing', () => {
      const dsl = createValidDSL();
      delete (dsl as any).schema;
      const result = validator.validateCourse(dsl);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          path: 'schema',
          severity: 'error',
        })
      );
    });

    it('should fail when schema is wrong version', () => {
      const dsl = createValidDSL({ schema: 'vvce.dsl.v2' as any });
      const result = validator.validateCourse(dsl);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          path: 'schema',
        })
      );
    });

    it('should fail when meta is missing', () => {
      const dsl = createValidDSL();
      delete (dsl as any).meta;
      const result = validator.validateCourse(dsl);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          path: 'meta',
        })
      );
    });

    it('should fail when meta.id is missing', () => {
      const dsl = createValidDSL();
      delete (dsl as any).meta.id;
      const result = validator.validateCourse(dsl);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          path: 'meta.id',
        })
      );
    });

    it('should fail when meta.version is missing', () => {
      const dsl = createValidDSL();
      delete (dsl as any).meta.version;
      const result = validator.validateCourse(dsl);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          path: 'meta.version',
        })
      );
    });

    it('should fail when startSceneId is missing', () => {
      const dsl = createValidDSL();
      delete (dsl as any).startSceneId;
      const result = validator.validateCourse(dsl);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          path: 'startSceneId',
        })
      );
    });

    it('should fail when scenes is not an array', () => {
      const dsl = createValidDSL();
      (dsl as any).scenes = {};
      const result = validator.validateCourse(dsl);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          path: 'scenes',
          message: expect.stringContaining('数组'),
        })
      );
    });

    it('should fail when scenes is empty', () => {
      const dsl = createValidDSL({ scenes: [] });
      const result = validator.validateCourse(dsl);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          path: 'scenes',
          message: expect.stringContaining('空'),
        })
      );
    });

    it('should fail when scene.id is missing', () => {
      const dsl = createValidDSL();
      delete (dsl as any).scenes[0].id;
      const result = validator.validateCourse(dsl);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          path: 'scenes[0].id',
        })
      );
    });

    it('should fail when scene IDs are duplicated', () => {
      const dsl = createValidDSL({
        scenes: [
          { id: 'scene1', nodes: [], triggers: [] },
          { id: 'scene1', nodes: [], triggers: [] },
        ],
      });
      const result = validator.validateCourse(dsl);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          path: 'scenes[1].id',
          message: expect.stringContaining('重复'),
        })
      );
    });

    it('should fail when node.id is missing', () => {
      const dsl = createValidDSL({
        scenes: [
          {
            id: 'scene1',
            nodes: [{ type: 'Button', props: {} } as any],
            triggers: [],
          },
        ],
      });
      const result = validator.validateCourse(dsl);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          path: 'scenes[0].nodes[0].id',
        })
      );
    });

    it('should fail when node IDs are duplicated within a scene', () => {
      const dsl = createValidDSL({
        scenes: [
          {
            id: 'scene1',
            nodes: [
              { id: 'btn1', type: 'Button', props: {} },
              { id: 'btn1', type: 'Button', props: {} },
            ],
            triggers: [],
          },
        ],
      });
      const result = validator.validateCourse(dsl);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          path: 'scenes[0].nodes[1].id',
          message: expect.stringContaining('重复'),
        })
      );
    });

    it('should fail when node.type is missing', () => {
      const dsl = createValidDSL({
        scenes: [
          {
            id: 'scene1',
            nodes: [{ id: 'btn1', props: {} } as any],
            triggers: [],
          },
        ],
      });
      const result = validator.validateCourse(dsl);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          path: 'scenes[0].nodes[0].type',
        })
      );
    });
  });

  describe('Semantic Validation', () => {
    it('should fail when startSceneId references non-existent scene', () => {
      const dsl = createValidDSL({ startSceneId: 'nonexistent' });
      const result = validator.validateCourse(dsl);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          path: 'startSceneId',
          message: expect.stringContaining('不存在'),
        })
      );
    });

    it('should fail when trigger target references non-existent node', () => {
      const dsl = createValidDSL({
        scenes: [
          {
            id: 'scene1',
            nodes: [{ id: 'btn1', type: 'Button', props: {} }],
            triggers: [
              {
                on: { event: 'click', target: 'nonexistent' },
                then: [{ action: 'toast', text: 'Hello' }],
              },
            ],
          },
        ],
      });
      const result = validator.validateCourse(dsl);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          path: 'scenes[0].triggers[0].on.target',
          message: expect.stringContaining('不存在'),
        })
      );
    });

    it('should fail when gotoScene references non-existent scene', () => {
      const dsl = createValidDSL({
        scenes: [
          {
            id: 'scene1',
            nodes: [{ id: 'btn1', type: 'Button', props: {} }],
            triggers: [
              {
                on: { event: 'click', target: 'btn1' },
                then: [{ action: 'gotoScene', sceneId: 'nonexistent' }],
              },
            ],
          },
        ],
      });
      const result = validator.validateCourse(dsl);

      expect(result.valid).toBe(false);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          message: expect.stringContaining('nonexistent'),
        })
      );
    });

    it('should warn about unreachable scenes', () => {
      const dsl = createValidDSL({
        scenes: [
          {
            id: 'scene1',
            nodes: [],
            triggers: [],
          },
          {
            id: 'scene2',
            nodes: [],
            triggers: [],
          },
        ],
      });
      const result = validator.validateCourse(dsl);

      expect(result.valid).toBe(true);
      expect(result.warnings).toContainEqual(
        expect.objectContaining({
          message: expect.stringContaining('scene2'),
          severity: 'warning',
        })
      );
    });

    it('should pass when all scene references are valid', () => {
      const dsl = createValidDSL({
        scenes: [
          {
            id: 'scene1',
            nodes: [{ id: 'btn1', type: 'Button', props: {} }],
            triggers: [
              {
                on: { event: 'click', target: 'btn1' },
                then: [{ action: 'gotoScene', sceneId: 'scene2' }],
              },
            ],
          },
          {
            id: 'scene2',
            nodes: [],
            triggers: [],
          },
        ],
      });
      const result = validator.validateCourse(dsl);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('validateCourse convenience function', () => {
    it('should work the same as Validator class', () => {
      const dsl = createValidDSL();
      const result = validateCourse(dsl);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
