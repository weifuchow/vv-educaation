/**
 * DryRunSimulator Tests
 * Tests for static analysis and dry run simulation
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { DryRunSimulator, dryRun, dryRunReport } from './DryRunSimulator';
import type { CourseDSL } from '../types/dsl';

describe('DryRunSimulator', () => {
  let simulator: DryRunSimulator;

  beforeEach(() => {
    simulator = new DryRunSimulator();
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

  describe('Basic Analysis', () => {
    it('should analyze a simple course', () => {
      const dsl = createValidDSL();
      const result = simulator.analyze(dsl);

      expect(result).toBeDefined();
      expect(result.complexity.totalScenes).toBe(1);
      expect(result.complexity.totalNodes).toBe(1);
    });

    it('should count complexity metrics correctly', () => {
      const dsl = createValidDSL({
        scenes: [
          {
            id: 'scene1',
            nodes: [
              { id: 'btn1', type: 'Button', props: {} },
              { id: 'btn2', type: 'Button', props: {} },
            ],
            triggers: [
              {
                on: { event: 'click', target: 'btn1' },
                then: [{ action: 'toast', text: 'Hello' }],
              },
            ],
          },
          {
            id: 'scene2',
            nodes: [{ id: 'd1', type: 'Dialog', props: {} }],
            triggers: [],
          },
        ],
      });
      const result = simulator.analyze(dsl);

      expect(result.complexity.totalScenes).toBe(2);
      expect(result.complexity.totalNodes).toBe(3);
      expect(result.complexity.totalTriggers).toBe(1);
      expect(result.complexity.totalActions).toBe(1);
    });
  });

  describe('Execution Paths', () => {
    it('should detect paths through the course', () => {
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
      const result = simulator.analyze(dsl);

      expect(result.paths.length).toBeGreaterThan(0);
      expect(result.paths[0].startScene).toBe('scene1');
    });

    it('should detect loops in paths', () => {
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
            nodes: [{ id: 'btn2', type: 'Button', props: {} }],
            triggers: [
              {
                on: { event: 'click', target: 'btn2' },
                then: [{ action: 'gotoScene', sceneId: 'scene1' }],
              },
            ],
          },
        ],
      });
      const result = simulator.analyze(dsl);

      const loopPaths = result.paths.filter((p) => p.loopDetected);
      expect(loopPaths.length).toBeGreaterThan(0);
    });

    it('should identify complete paths', () => {
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
            triggers: [], // No outgoing transitions
          },
        ],
      });
      const result = simulator.analyze(dsl);

      const completePaths = result.paths.filter((p) => p.isComplete);
      expect(completePaths.length).toBeGreaterThan(0);
    });
  });

  describe('State Mutations', () => {
    it('should track setVar mutations', () => {
      const dsl = createValidDSL({
        scenes: [
          {
            id: 'scene1',
            nodes: [{ id: 'btn1', type: 'Button', props: {} }],
            triggers: [
              {
                on: { event: 'click', target: 'btn1' },
                then: [{ action: 'setVar', path: 'globals.vars.score', value: 100 }],
              },
            ],
          },
        ],
      });
      const result = simulator.analyze(dsl);

      expect(result.mutations).toContainEqual(
        expect.objectContaining({
          path: 'globals.vars.score',
          action: 'setVar',
        })
      );
    });

    it('should track incVar mutations', () => {
      const dsl = createValidDSL({
        scenes: [
          {
            id: 'scene1',
            nodes: [{ id: 'btn1', type: 'Button', props: {} }],
            triggers: [
              {
                on: { event: 'click', target: 'btn1' },
                then: [{ action: 'incVar', path: 'globals.vars.attempt', by: 1 }],
              },
            ],
          },
        ],
      });
      const result = simulator.analyze(dsl);

      expect(result.mutations).toContainEqual(
        expect.objectContaining({
          path: 'globals.vars.attempt',
          action: 'incVar',
        })
      );
    });

    it('should track addScore mutations', () => {
      const dsl = createValidDSL({
        scenes: [
          {
            id: 'scene1',
            nodes: [{ id: 'btn1', type: 'Button', props: {} }],
            triggers: [
              {
                on: { event: 'click', target: 'btn1' },
                then: [{ action: 'addScore', value: 10 }],
              },
            ],
          },
        ],
      });
      const result = simulator.analyze(dsl);

      expect(result.mutations).toContainEqual(
        expect.objectContaining({
          path: 'globals.vars.score',
          action: 'addScore',
        })
      );
    });
  });

  describe('Event-Action Mapping', () => {
    it('should map events to actions', () => {
      const dsl = createValidDSL({
        scenes: [
          {
            id: 'scene1',
            nodes: [{ id: 'btn1', type: 'Button', props: {} }],
            triggers: [
              {
                on: { event: 'click', target: 'btn1' },
                then: [
                  { action: 'toast', text: 'Clicked!' },
                  { action: 'addScore', value: 10 },
                ],
              },
            ],
          },
        ],
      });
      const result = simulator.analyze(dsl);

      expect(result.eventActionMap).toContainEqual(
        expect.objectContaining({
          event: 'click',
          target: 'btn1',
          actions: expect.arrayContaining(['toast', 'addScore']),
        })
      );
    });

    it('should count conditions', () => {
      const dsl = createValidDSL({
        scenes: [
          {
            id: 'scene1',
            nodes: [{ id: 'q1', type: 'QuizSingle', props: {} }],
            triggers: [
              {
                on: { event: 'change', target: 'q1' },
                if: [
                  { op: 'equals', left: { ref: 'q1.state.selected' }, right: 'a' },
                  { op: 'equals', left: { ref: 'globals.vars.attempts' }, right: 1 },
                ],
                then: [{ action: 'toast', text: 'Correct!' }],
              },
            ],
          },
        ],
      });
      const result = simulator.analyze(dsl);

      expect(result.eventActionMap[0].conditions).toBe(2);
    });
  });

  describe('Coverage Report', () => {
    it('should calculate scene coverage', () => {
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
          {
            id: 'unreachable',
            nodes: [],
            triggers: [],
          },
        ],
      });
      const result = simulator.analyze(dsl);

      expect(result.coverage.scenes.total).toBe(3);
      expect(result.coverage.scenes.reachable).toBe(2);
      expect(result.coverage.scenes.coverage).toBeCloseTo(66.67, 0);
    });

    it('should count action types', () => {
      const dsl = createValidDSL({
        scenes: [
          {
            id: 'scene1',
            nodes: [{ id: 'btn1', type: 'Button', props: {} }],
            triggers: [
              {
                on: { event: 'click', target: 'btn1' },
                then: [
                  { action: 'toast', text: 'Hello' },
                  { action: 'toast', text: 'World' },
                  { action: 'addScore', value: 10 },
                ],
              },
            ],
          },
        ],
      });
      const result = simulator.analyze(dsl);

      expect(result.coverage.actions.byType['toast']).toBe(2);
      expect(result.coverage.actions.byType['addScore']).toBe(1);
    });
  });

  describe('Dead Code Detection', () => {
    it('should detect unreachable scenes', () => {
      const dsl = createValidDSL({
        scenes: [
          {
            id: 'scene1',
            nodes: [],
            triggers: [],
          },
          {
            id: 'orphan',
            nodes: [],
            triggers: [],
          },
        ],
      });
      const result = simulator.analyze(dsl);

      expect(result.deadCode.unreachableScenes).toContain('orphan');
    });

    it('should detect unused nodes', () => {
      const dsl = createValidDSL({
        scenes: [
          {
            id: 'scene1',
            nodes: [
              { id: 'btn1', type: 'Button', props: {} },
              { id: 'unusedNode', type: 'Dialog', props: {} },
            ],
            triggers: [
              {
                on: { event: 'click', target: 'btn1' },
                then: [{ action: 'toast', text: 'Hello' }],
              },
            ],
          },
        ],
      });
      const result = simulator.analyze(dsl);

      expect(result.deadCode.unusedNodes).toContain('scene1:unusedNode');
    });

    it('should detect dead triggers (delay only)', () => {
      const dsl = createValidDSL({
        scenes: [
          {
            id: 'scene1',
            nodes: [{ id: 'btn1', type: 'Button', props: {} }],
            triggers: [
              {
                on: { event: 'click', target: 'btn1' },
                then: [{ action: 'delay', duration: 1000 }],
              },
            ],
          },
        ],
      });
      const result = simulator.analyze(dsl);

      expect(result.deadCode.deadTriggers).toContainEqual(
        expect.objectContaining({
          sceneId: 'scene1',
          triggerIndex: 0,
        })
      );
    });
  });

  describe('Report Generation', () => {
    it('should generate a readable report', () => {
      const dsl = createValidDSL({
        scenes: [
          {
            id: 'scene1',
            nodes: [{ id: 'btn1', type: 'Button', props: {} }],
            triggers: [
              {
                on: { event: 'click', target: 'btn1' },
                then: [
                  { action: 'toast', text: 'Hello' },
                  { action: 'gotoScene', sceneId: 'scene2' },
                ],
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
      const result = simulator.analyze(dsl);
      const report = simulator.generateReport(result);

      expect(report).toContain('VVCE Dry Run Report');
      expect(report).toContain('Complexity');
      expect(report).toContain('Coverage');
      expect(report).toContain('Execution Paths');
    });
  });

  describe('Convenience Functions', () => {
    it('dryRun should work like simulator.analyze', () => {
      const dsl = createValidDSL();
      const result = dryRun(dsl);

      expect(result).toBeDefined();
      expect(result.complexity).toBeDefined();
    });

    it('dryRunReport should return a string report', () => {
      const dsl = createValidDSL();
      const report = dryRunReport(dsl);

      expect(typeof report).toBe('string');
      expect(report).toContain('VVCE Dry Run Report');
    });
  });
});
