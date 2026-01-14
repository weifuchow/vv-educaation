/**
 * DryRunSimulator - Static analysis of DSL execution paths
 * Simulates course execution without runtime, providing:
 * - Execution path analysis
 * - Dead code detection
 * - Coverage analysis
 * - State mutation tracking
 * - Event-action mapping
 */

import type { CourseDSL, SceneDSL, ActionDSL } from '../types/dsl';

/**
 * Represents an execution step in the simulation
 */
export interface ExecutionStep {
  type: 'scene_enter' | 'event' | 'condition' | 'action' | 'scene_exit';
  sceneId: string;
  details: Record<string, unknown>;
  possibleNextSteps: string[];
}

/**
 * Represents an execution path through the course
 */
export interface ExecutionPath {
  id: string;
  steps: ExecutionStep[];
  startScene: string;
  endScene: string | null;
  isComplete: boolean;
  loopDetected: boolean;
}

/**
 * State mutation tracking
 */
export interface StateMutation {
  path: string;
  action: string;
  sceneId: string;
  triggerIndex: number;
}

/**
 * Event-action mapping
 */
export interface EventActionMap {
  event: string;
  target: string | null;
  sceneId: string;
  actions: string[];
  conditions: number;
}

/**
 * Coverage report
 */
export interface CoverageReport {
  scenes: {
    total: number;
    reachable: number;
    coverage: number;
  };
  nodes: {
    total: number;
    referenced: number;
    coverage: number;
  };
  triggers: {
    total: number;
    withConditions: number;
    withElse: number;
  };
  actions: {
    total: number;
    byType: Record<string, number>;
  };
}

/**
 * Complete dry run analysis result
 */
export interface DryRunResult {
  paths: ExecutionPath[];
  mutations: StateMutation[];
  eventActionMap: EventActionMap[];
  coverage: CoverageReport;
  deadCode: {
    unreachableScenes: string[];
    unusedNodes: string[];
    deadTriggers: Array<{ sceneId: string; triggerIndex: number }>;
  };
  complexity: {
    totalScenes: number;
    totalNodes: number;
    totalTriggers: number;
    totalActions: number;
    maxPathLength: number;
    averagePathLength: number;
    branchingFactor: number;
  };
}

/**
 * DryRunSimulator performs static analysis of DSL execution
 */
export class DryRunSimulator {
  private dsl!: CourseDSL;
  private sceneMap = new Map<string, SceneDSL>();
  private visitedScenes = new Set<string>();
  private referencedNodes = new Set<string>();
  private mutations: StateMutation[] = [];
  private eventActionMap: EventActionMap[] = [];
  private paths: ExecutionPath[] = [];
  private pathCounter = 0;

  /**
   * Run dry run analysis on a course DSL
   */
  analyze(dsl: CourseDSL): DryRunResult {
    this.reset();
    this.dsl = dsl;

    // Build scene map
    dsl.scenes.forEach((scene) => {
      this.sceneMap.set(scene.id, scene);
    });

    // Collect event-action mappings
    this.collectEventActionMaps();

    // Collect state mutations
    this.collectMutations();

    // Simulate execution paths
    this.simulatePaths();

    // Calculate coverage
    const coverage = this.calculateCoverage();

    // Find dead code
    const deadCode = this.findDeadCode();

    // Calculate complexity
    const complexity = this.calculateComplexity();

    return {
      paths: this.paths,
      mutations: this.mutations,
      eventActionMap: this.eventActionMap,
      coverage,
      deadCode,
      complexity,
    };
  }

  /**
   * Reset state for new analysis
   */
  private reset(): void {
    this.sceneMap.clear();
    this.visitedScenes.clear();
    this.referencedNodes.clear();
    this.mutations = [];
    this.eventActionMap = [];
    this.paths = [];
    this.pathCounter = 0;
  }

  /**
   * Collect event-action mappings from all triggers
   */
  private collectEventActionMaps(): void {
    this.dsl.scenes.forEach((scene) => {
      scene.triggers?.forEach((trigger) => {
        const actions = this.collectActionTypes(trigger.then);
        if (trigger.else) {
          actions.push(...this.collectActionTypes(trigger.else));
        }

        this.eventActionMap.push({
          event: trigger.on.event,
          target: trigger.on.target || null,
          sceneId: scene.id,
          actions: [...new Set(actions)],
          conditions: trigger.if?.length || 0,
        });

        // Track referenced nodes
        if (trigger.on.target) {
          this.referencedNodes.add(`${scene.id}:${trigger.on.target}`);
        }
      });
    });
  }

  /**
   * Collect action types from action list
   */
  private collectActionTypes(actions: ActionDSL[]): string[] {
    const types: string[] = [];
    actions.forEach((action) => {
      types.push(action.action);
      if (action.action === 'parallel' || action.action === 'sequence') {
        types.push(...this.collectActionTypes(action.actions));
      }
    });
    return types;
  }

  /**
   * Collect state mutations from all actions
   */
  private collectMutations(): void {
    this.dsl.scenes.forEach((scene) => {
      scene.triggers?.forEach((trigger, triggerIndex) => {
        this.collectMutationsFromActions(
          [...trigger.then, ...(trigger.else || [])],
          scene.id,
          triggerIndex
        );
      });
    });
  }

  /**
   * Collect mutations from action list
   */
  private collectMutationsFromActions(
    actions: ActionDSL[],
    sceneId: string,
    triggerIndex: number
  ): void {
    actions.forEach((action) => {
      if (action.action === 'setVar' || action.action === 'incVar') {
        this.mutations.push({
          path: action.path,
          action: action.action,
          sceneId,
          triggerIndex,
        });
      } else if (action.action === 'addScore') {
        this.mutations.push({
          path: 'globals.vars.score',
          action: 'addScore',
          sceneId,
          triggerIndex,
        });
      } else if (action.action === 'parallel' || action.action === 'sequence') {
        this.collectMutationsFromActions(action.actions, sceneId, triggerIndex);
      }
    });
  }

  /**
   * Simulate execution paths through the course
   */
  private simulatePaths(): void {
    // Start from the initial scene
    this.simulateFromScene(this.dsl.startSceneId, [], new Set());
  }

  /**
   * Simulate paths from a given scene
   */
  private simulateFromScene(
    sceneId: string,
    currentPath: ExecutionStep[],
    visitedInPath: Set<string>
  ): void {
    const scene = this.sceneMap.get(sceneId);
    if (!scene) return;

    this.visitedScenes.add(sceneId);

    // Check for loop
    if (visitedInPath.has(sceneId)) {
      this.paths.push({
        id: `path-${++this.pathCounter}`,
        steps: [...currentPath],
        startScene: this.dsl.startSceneId,
        endScene: sceneId,
        isComplete: false,
        loopDetected: true,
      });
      return;
    }

    visitedInPath.add(sceneId);

    // Add scene enter step
    const enterStep: ExecutionStep = {
      type: 'scene_enter',
      sceneId,
      details: { nodeCount: scene.nodes?.length || 0 },
      possibleNextSteps: [],
    };
    currentPath.push(enterStep);

    // Find all possible next scenes
    const nextScenes = this.findNextScenes(scene);
    enterStep.possibleNextSteps = nextScenes;

    if (nextScenes.length === 0) {
      // End of path
      this.paths.push({
        id: `path-${++this.pathCounter}`,
        steps: [...currentPath],
        startScene: this.dsl.startSceneId,
        endScene: sceneId,
        isComplete: true,
        loopDetected: false,
      });
    } else {
      // Continue simulation for each possible next scene
      nextScenes.forEach((nextScene) => {
        this.simulateFromScene(nextScene, [...currentPath], new Set(visitedInPath));
      });
    }
  }

  /**
   * Find all possible next scenes from a scene
   */
  private findNextScenes(scene: SceneDSL): string[] {
    const nextScenes = new Set<string>();

    scene.triggers?.forEach((trigger) => {
      this.collectGotoScenes(trigger.then, nextScenes);
      if (trigger.else) {
        this.collectGotoScenes(trigger.else, nextScenes);
      }
    });

    return Array.from(nextScenes);
  }

  /**
   * Collect gotoScene targets from actions
   */
  private collectGotoScenes(actions: ActionDSL[], targets: Set<string>): void {
    actions.forEach((action) => {
      if (action.action === 'gotoScene') {
        targets.add(action.sceneId);
      } else if (action.action === 'parallel' || action.action === 'sequence') {
        this.collectGotoScenes(action.actions, targets);
      }
    });
  }

  /**
   * Calculate coverage statistics
   */
  private calculateCoverage(): CoverageReport {
    const totalScenes = this.dsl.scenes.length;
    const reachableScenes = this.visitedScenes.size;

    let totalNodes = 0;
    let totalTriggers = 0;
    let triggersWithConditions = 0;
    let triggersWithElse = 0;
    let totalActions = 0;
    const actionsByType: Record<string, number> = {};

    this.dsl.scenes.forEach((scene) => {
      totalNodes += scene.nodes?.length || 0;
      totalTriggers += scene.triggers?.length || 0;

      scene.triggers?.forEach((trigger) => {
        if (trigger.if && trigger.if.length > 0) {
          triggersWithConditions++;
        }
        if (trigger.else && trigger.else.length > 0) {
          triggersWithElse++;
        }

        const countActions = (actions: ActionDSL[]) => {
          actions.forEach((action) => {
            totalActions++;
            actionsByType[action.action] = (actionsByType[action.action] || 0) + 1;
            if (action.action === 'parallel' || action.action === 'sequence') {
              countActions(action.actions);
            }
          });
        };

        countActions(trigger.then);
        if (trigger.else) {
          countActions(trigger.else);
        }
      });
    });

    // Count referenced nodes
    const referencedNodeCount = this.referencedNodes.size;

    return {
      scenes: {
        total: totalScenes,
        reachable: reachableScenes,
        coverage: totalScenes > 0 ? (reachableScenes / totalScenes) * 100 : 0,
      },
      nodes: {
        total: totalNodes,
        referenced: referencedNodeCount,
        coverage: totalNodes > 0 ? (referencedNodeCount / totalNodes) * 100 : 0,
      },
      triggers: {
        total: totalTriggers,
        withConditions: triggersWithConditions,
        withElse: triggersWithElse,
      },
      actions: {
        total: totalActions,
        byType: actionsByType,
      },
    };
  }

  /**
   * Find dead code (unreachable scenes, unused nodes, dead triggers)
   */
  private findDeadCode(): DryRunResult['deadCode'] {
    const unreachableScenes: string[] = [];
    const unusedNodes: string[] = [];
    const deadTriggers: Array<{ sceneId: string; triggerIndex: number }> = [];

    // Find unreachable scenes
    this.dsl.scenes.forEach((scene) => {
      if (!this.visitedScenes.has(scene.id)) {
        unreachableScenes.push(scene.id);
      }
    });

    // Find unused nodes (nodes not referenced in any trigger)
    this.dsl.scenes.forEach((scene) => {
      scene.nodes?.forEach((node) => {
        const nodeKey = `${scene.id}:${node.id}`;
        if (!this.referencedNodes.has(nodeKey)) {
          unusedNodes.push(nodeKey);
        }
      });
    });

    // Find dead triggers (triggers with no actions or only delays)
    this.dsl.scenes.forEach((scene) => {
      scene.triggers?.forEach((trigger, index) => {
        const hasSignificantActions = this.hasSignificantActions(trigger.then);
        const hasSignificantElse =
          trigger.else && this.hasSignificantActions(trigger.else);

        if (!hasSignificantActions && !hasSignificantElse) {
          deadTriggers.push({ sceneId: scene.id, triggerIndex: index });
        }
      });
    });

    return {
      unreachableScenes,
      unusedNodes,
      deadTriggers,
    };
  }

  /**
   * Check if action list has significant (non-delay) actions
   */
  private hasSignificantActions(actions: ActionDSL[]): boolean {
    return actions.some((action) => {
      if (action.action === 'delay') return false;
      if (action.action === 'parallel' || action.action === 'sequence') {
        return this.hasSignificantActions(action.actions);
      }
      return true;
    });
  }

  /**
   * Calculate complexity metrics
   */
  private calculateComplexity(): DryRunResult['complexity'] {
    let totalNodes = 0;
    let totalTriggers = 0;
    let totalActions = 0;
    let totalBranches = 0;

    this.dsl.scenes.forEach((scene) => {
      totalNodes += scene.nodes?.length || 0;
      totalTriggers += scene.triggers?.length || 0;

      scene.triggers?.forEach((trigger) => {
        totalActions += trigger.then.length;
        if (trigger.else) {
          totalActions += trigger.else.length;
          totalBranches++;
        }
        if (trigger.if && trigger.if.length > 0) {
          totalBranches++;
        }
      });
    });

    const pathLengths = this.paths.map((p) => p.steps.length);
    const maxPathLength = Math.max(...pathLengths, 0);
    const averagePathLength =
      pathLengths.length > 0
        ? pathLengths.reduce((a, b) => a + b, 0) / pathLengths.length
        : 0;

    const branchingFactor = totalTriggers > 0 ? totalBranches / totalTriggers : 0;

    return {
      totalScenes: this.dsl.scenes.length,
      totalNodes,
      totalTriggers,
      totalActions,
      maxPathLength,
      averagePathLength: Math.round(averagePathLength * 100) / 100,
      branchingFactor: Math.round(branchingFactor * 100) / 100,
    };
  }

  /**
   * Generate a human-readable report
   */
  generateReport(result: DryRunResult): string {
    const lines: string[] = [];

    lines.push('=== VVCE Dry Run Report ===\n');

    // Complexity
    lines.push('## Complexity');
    lines.push(`- Scenes: ${result.complexity.totalScenes}`);
    lines.push(`- Nodes: ${result.complexity.totalNodes}`);
    lines.push(`- Triggers: ${result.complexity.totalTriggers}`);
    lines.push(`- Actions: ${result.complexity.totalActions}`);
    lines.push(`- Max Path Length: ${result.complexity.maxPathLength}`);
    lines.push(`- Avg Path Length: ${result.complexity.averagePathLength}`);
    lines.push(`- Branching Factor: ${result.complexity.branchingFactor}\n`);

    // Coverage
    lines.push('## Coverage');
    lines.push(
      `- Scene Coverage: ${result.coverage.scenes.coverage.toFixed(1)}% (${result.coverage.scenes.reachable}/${result.coverage.scenes.total})`
    );
    lines.push(
      `- Node References: ${result.coverage.nodes.referenced}/${result.coverage.nodes.total}`
    );
    lines.push(
      `- Triggers with Conditions: ${result.coverage.triggers.withConditions}/${result.coverage.triggers.total}`
    );
    lines.push(
      `- Triggers with Else: ${result.coverage.triggers.withElse}/${result.coverage.triggers.total}\n`
    );

    // Action Distribution
    lines.push('## Action Distribution');
    Object.entries(result.coverage.actions.byType)
      .sort(([, a], [, b]) => b - a)
      .forEach(([type, count]) => {
        lines.push(`- ${type}: ${count}`);
      });
    lines.push('');

    // Dead Code
    if (
      result.deadCode.unreachableScenes.length > 0 ||
      result.deadCode.unusedNodes.length > 0 ||
      result.deadCode.deadTriggers.length > 0
    ) {
      lines.push('## Dead Code Detected');
      if (result.deadCode.unreachableScenes.length > 0) {
        lines.push(
          `- Unreachable Scenes: ${result.deadCode.unreachableScenes.join(', ')}`
        );
      }
      if (result.deadCode.unusedNodes.length > 0) {
        lines.push(
          `- Unused Nodes: ${result.deadCode.unusedNodes.slice(0, 10).join(', ')}${result.deadCode.unusedNodes.length > 10 ? '...' : ''}`
        );
      }
      if (result.deadCode.deadTriggers.length > 0) {
        lines.push(
          `- Dead Triggers: ${result.deadCode.deadTriggers.map((t) => `${t.sceneId}[${t.triggerIndex}]`).join(', ')}`
        );
      }
      lines.push('');
    }

    // State Mutations
    if (result.mutations.length > 0) {
      lines.push('## State Mutations');
      const mutationsByPath = new Map<string, number>();
      result.mutations.forEach((m) => {
        mutationsByPath.set(m.path, (mutationsByPath.get(m.path) || 0) + 1);
      });
      mutationsByPath.forEach((count, path) => {
        lines.push(`- ${path}: ${count} mutations`);
      });
      lines.push('');
    }

    // Execution Paths
    lines.push(`## Execution Paths: ${result.paths.length}`);
    const completePaths = result.paths.filter((p) => p.isComplete);
    const loopPaths = result.paths.filter((p) => p.loopDetected);
    lines.push(`- Complete: ${completePaths.length}`);
    lines.push(`- With Loops: ${loopPaths.length}`);

    return lines.join('\n');
  }
}

/**
 * Convenience function for dry run analysis
 */
export function dryRun(dsl: CourseDSL): DryRunResult {
  const simulator = new DryRunSimulator();
  return simulator.analyze(dsl);
}

/**
 * Convenience function for dry run report
 */
export function dryRunReport(dsl: CourseDSL): string {
  const simulator = new DryRunSimulator();
  const result = simulator.analyze(dsl);
  return simulator.generateReport(result);
}
