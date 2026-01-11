/**
 * VVCERuntime 单元测试
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { VVCERuntime, CourseDSL, SceneDSL } from './Runtime';

describe('VVCERuntime', () => {
  let runtime: VVCERuntime;

  const createSimpleCourse = (): CourseDSL => ({
    schema: 'vvce.dsl.v1',
    meta: { id: 'test-course', version: '1.0.0' },
    globals: { vars: { score: 0, attempt: 0 } },
    startSceneId: 'scene1',
    scenes: [
      {
        id: 'scene1',
        vars: { temp: 'initial' },
        triggers: [
          {
            on: { event: 'click', target: 'nextBtn' },
            then: [{ action: 'gotoScene', sceneId: 'scene2' }],
          },
        ],
      },
      {
        id: 'scene2',
        triggers: [
          {
            on: { event: 'click', target: 'backBtn' },
            then: [{ action: 'gotoScene', sceneId: 'scene1' }],
          },
        ],
      },
    ],
  });

  beforeEach(() => {
    runtime = new VVCERuntime({ debug: false });
  });

  describe('constructor', () => {
    it('should create runtime instance with default options', () => {
      const rt = new VVCERuntime();
      expect(rt).toBeDefined();
    });

    it('should accept debug option', () => {
      const rt = new VVCERuntime({ debug: true });
      expect(rt).toBeDefined();
    });

    it('should accept callback options', () => {
      const onSceneChange = vi.fn();
      const onStateChange = vi.fn();
      const onUIAction = vi.fn();

      const rt = new VVCERuntime({
        onSceneChange,
        onStateChange,
        onUIAction,
      });

      expect(rt).toBeDefined();
    });
  });

  describe('loadCourse', () => {
    it('should load course DSL', () => {
      const course = createSimpleCourse();
      runtime.loadCourse(course);

      // Global vars should be initialized
      const state = runtime.getState();
      expect(state.globals.vars.score).toBe(0);
      expect(state.globals.vars.attempt).toBe(0);
    });

    it('should handle course without globals', () => {
      const course: CourseDSL = {
        schema: 'vvce.dsl.v1',
        meta: { id: 'test', version: '1.0.0' },
        startSceneId: 'scene1',
        scenes: [{ id: 'scene1', triggers: [] }],
      };

      expect(() => runtime.loadCourse(course)).not.toThrow();
    });
  });

  describe('start', () => {
    it('should start course from startSceneId', () => {
      const onSceneChange = vi.fn();
      const rt = new VVCERuntime({ onSceneChange });

      rt.loadCourse(createSimpleCourse());
      rt.start();

      expect(rt.getCurrentSceneId()).toBe('scene1');
      expect(onSceneChange).toHaveBeenCalledWith('scene1');
    });

    it('should throw if no course loaded', () => {
      expect(() => runtime.start()).toThrow('No course loaded');
    });

    it('should accept custom startSceneId', () => {
      runtime.loadCourse(createSimpleCourse());
      runtime.start({ startSceneId: 'scene2' });

      expect(runtime.getCurrentSceneId()).toBe('scene2');
    });

    it('should accept initial state', () => {
      runtime.loadCourse(createSimpleCourse());
      runtime.start({
        initialState: {
          globals: { vars: { score: 100 } },
          scene: { vars: {} },
          nodes: {},
        },
      });

      const state = runtime.getState();
      expect(state.globals.vars.score).toBe(100);
    });
  });

  describe('gotoScene', () => {
    beforeEach(() => {
      runtime.loadCourse(createSimpleCourse());
      runtime.start();
    });

    it('should navigate to specified scene', () => {
      runtime.gotoScene('scene2');
      expect(runtime.getCurrentSceneId()).toBe('scene2');
    });

    it('should throw for non-existent scene', () => {
      expect(() => runtime.gotoScene('nonexistent')).toThrow('Scene not found');
    });

    it('should reset scene state when changing scenes', () => {
      // Set some scene state
      runtime.updateNodeState('q1', { selected: 'A' });
      expect(runtime.getNodeState('q1')).toEqual({ selected: 'A' });

      // Navigate to another scene
      runtime.gotoScene('scene2');

      // Scene state should be reset
      expect(runtime.getNodeState('q1')).toEqual({});
    });

    it('should initialize scene vars', () => {
      const state = runtime.getState();
      expect(state.scene.vars.temp).toBe('initial');
    });

    it('should call onSceneChange callback', () => {
      const onSceneChange = vi.fn();
      const rt = new VVCERuntime({ onSceneChange });
      rt.loadCourse(createSimpleCourse());
      rt.start();

      rt.gotoScene('scene2');
      expect(onSceneChange).toHaveBeenCalledWith('scene2');
    });
  });

  describe('emit', () => {
    beforeEach(() => {
      runtime.loadCourse(createSimpleCourse());
      runtime.start();
    });

    it('should emit events through event bus', () => {
      const onStateChange = vi.fn();
      const rt = new VVCERuntime({ onStateChange });
      rt.loadCourse(createSimpleCourse());
      rt.start();

      rt.emit({ type: 'click', target: 'test', ts: Date.now() });

      expect(onStateChange).toHaveBeenCalled();
    });

    it('should trigger actions based on events', () => {
      // Click nextBtn should trigger gotoScene('scene2')
      runtime.emit({ type: 'click', target: 'nextBtn', ts: Date.now() });

      expect(runtime.getCurrentSceneId()).toBe('scene2');
    });
  });

  describe('state management', () => {
    beforeEach(() => {
      runtime.loadCourse(createSimpleCourse());
      runtime.start();
    });

    it('should get current state', () => {
      const state = runtime.getState();
      expect(state.globals).toBeDefined();
      expect(state.scene).toBeDefined();
      expect(state.nodes).toBeDefined();
    });

    it('should set state', () => {
      runtime.setState({
        globals: { vars: { score: 50, newVar: 'test' } },
      });

      const state = runtime.getState();
      expect(state.globals.vars.score).toBe(50);
      expect(state.globals.vars.newVar).toBe('test');
    });

    it('should update node state', () => {
      runtime.updateNodeState('q1', { selected: 'B', value: 10 });

      expect(runtime.getNodeState('q1')).toEqual({ selected: 'B', value: 10 });
    });
  });

  describe('getCurrentScene', () => {
    it('should return current scene definition', () => {
      runtime.loadCourse(createSimpleCourse());
      runtime.start();

      const scene = runtime.getCurrentScene();
      expect(scene?.id).toBe('scene1');
      expect(scene?.triggers).toBeDefined();
    });

    it('should return null if no course loaded', () => {
      expect(runtime.getCurrentScene()).toBeNull();
    });

    it('should return null if no current scene', () => {
      runtime.loadCourse(createSimpleCourse());
      expect(runtime.getCurrentScene()).toBeNull();
    });
  });

  describe('logging', () => {
    beforeEach(() => {
      runtime.loadCourse(createSimpleCourse());
      runtime.start();
    });

    it('should return logs', () => {
      const logs = runtime.getLogs();
      expect(Array.isArray(logs)).toBe(true);
      expect(logs.length).toBeGreaterThan(0);
    });

    it('should export logs as JSON', () => {
      const exported = runtime.exportLogs();
      expect(typeof exported).toBe('string');

      const parsed = JSON.parse(exported);
      expect(Array.isArray(parsed)).toBe(true);
    });
  });

  describe('reset', () => {
    it('should reset all state', () => {
      runtime.loadCourse(createSimpleCourse());
      runtime.start();
      runtime.updateNodeState('q1', { selected: 'A' });

      runtime.reset();

      expect(runtime.getCurrentSceneId()).toBeNull();
      const state = runtime.getState();
      expect(state.globals.vars).toEqual({});
      expect(state.nodes).toEqual({});
    });
  });

  describe('destroy', () => {
    it('should clean up resources', () => {
      runtime.loadCourse(createSimpleCourse());
      runtime.start();

      expect(() => runtime.destroy()).not.toThrow();
      expect(runtime.getCurrentSceneId()).toBeNull();
    });
  });

  describe('integration: complete workflow', () => {
    it('should handle a simple state update scenario', () => {
      const rt = new VVCERuntime();

      const course: CourseDSL = {
        schema: 'vvce.dsl.v1',
        meta: { id: 'test', version: '1.0.0' },
        globals: { vars: { score: 0 } },
        startSceneId: 'scene1',
        scenes: [
          {
            id: 'scene1',
            triggers: [
              {
                on: { event: 'click', target: 'addBtn' },
                then: [
                  { action: 'addScore', value: 10 },
                ],
              },
            ],
          },
        ],
      };

      rt.loadCourse(course);
      rt.start();

      // Initial score is 0
      expect(rt.getState().globals.vars.score).toBe(0);

      // Click addBtn should add 10 points
      rt.emit({ type: 'click', target: 'addBtn', ts: Date.now() });

      expect(rt.getState().globals.vars.score).toBe(10);

      // Click again should add another 10
      rt.emit({ type: 'click', target: 'addBtn', ts: Date.now() });
      expect(rt.getState().globals.vars.score).toBe(20);
    });

    it('should handle conditional navigation', () => {
      const rt = new VVCERuntime();

      const course: CourseDSL = {
        schema: 'vvce.dsl.v1',
        meta: { id: 'test', version: '1.0.0' },
        globals: { vars: { score: 0 } },
        startSceneId: 'scene1',
        scenes: [
          {
            id: 'scene1',
            triggers: [
              {
                on: { event: 'submit' },
                if: [{ op: 'gte', left: { ref: 'globals.vars.score' }, right: 60 }],
                then: [{ action: 'gotoScene', sceneId: 'pass' }],
                else: [{ action: 'gotoScene', sceneId: 'fail' }],
              },
            ],
          },
          { id: 'pass', triggers: [] },
          { id: 'fail', triggers: [] },
        ],
      };

      rt.loadCourse(course);
      rt.start();

      // Score is 0, should go to fail
      rt.emit({ type: 'submit', ts: Date.now() });
      expect(rt.getCurrentSceneId()).toBe('fail');

      // Reset and try with high score
      rt.reset();
      rt.loadCourse(course);
      rt.setState({ globals: { vars: { score: 80 } } });
      rt.start();

      rt.emit({ type: 'submit', ts: Date.now() });
      expect(rt.getCurrentSceneId()).toBe('pass');
    });
  });
});
