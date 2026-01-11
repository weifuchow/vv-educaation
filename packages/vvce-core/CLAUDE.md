# CLAUDE.md - vvce-core Module Guide

> **Module:** `@vv-education/vvce-core`
> **Version:** 0.1.0
> **Purpose:** VVCE Interactive Courseware Scene Rendering Engine - Core Runtime
> **Last Updated:** 2026-01-11

This document provides in-depth implementation details for AI assistants working specifically on the `vvce-core` package.

---

## Table of Contents

1. [Directory Structure](#1-directory-structure)
2. [Key Classes and Responsibilities](#2-key-classes-and-responsibilities)
3. [Code Patterns and Conventions](#3-code-patterns-and-conventions)
4. [Internal Architecture and Data Flow](#4-internal-architecture-and-data-flow)
5. [Extension Points](#5-extension-points)
6. [Testing Guidelines](#6-testing-guidelines)
7. [Common Development Scenarios](#7-common-development-scenarios)
8. [Dependencies and Exports](#8-dependencies-and-exports)
9. [Important Notes for AI Assistants](#9-important-notes-for-ai-assistants)

---

## 1. Directory Structure

```
packages/vvce-core/
├── src/
│   ├── animation/              # Animation System (v1.1)
│   │   ├── AnimationEngine.ts     # Keyframe animation engine (469 lines)
│   │   ├── TransitionEngine.ts    # Scene transition effects (523 lines)
│   │   └── index.ts               # Module exports
│   │
│   ├── event-bus/             # Event Management
│   │   └── EventBus.ts            # Pub-sub event dispatcher (101 lines)
│   │
│   ├── executor/              # Action Execution
│   │   └── ActionExecutor.ts      # 23+ action types executor (423 lines)
│   │
│   ├── interpreter/           # DSL Interpretation (ECA Pattern)
│   │   ├── ReferenceResolver.ts   # Resolves {ref: "path"} (67 lines)
│   │   ├── ConditionEvaluator.ts  # Evaluates conditions (98 lines)
│   │   └── TriggerInterpreter.ts  # Event-Condition-Action (81 lines)
│   │
│   ├── logger/                # Runtime Logging
│   │   └── Logger.ts              # Debug/replay logs (141 lines)
│   │
│   ├── presets/               # Built-in Resources (v1.1)
│   │   ├── animations.ts          # 30+ animations (419 lines)
│   │   ├── themes.ts              # 9 themes (682 lines)
│   │   ├── transitions.ts         # 16 transitions (252 lines)
│   │   └── index.ts               # Exports
│   │
│   ├── runtime/               # Main Runtime
│   │   └── Runtime.ts             # VVCERuntime orchestrator (275 lines)
│   │
│   ├── store/                 # State Management
│   │   └── Store.ts               # Three-layer state (144 lines)
│   │
│   ├── style/                 # Style System (v1.1)
│   │   ├── StyleManager.ts        # Style computation (324 lines)
│   │   ├── ThemeProvider.ts       # Theme management (287 lines)
│   │   └── index.ts               # Module exports
│   │
│   ├── types/                 # Type Definitions
│   │   └── index.ts               # Core types (174 lines)
│   │
│   └── index.ts               # Main entry point
│
├── package.json               # Package configuration
├── tsconfig.json              # TypeScript config
└── README.md                  # Package documentation
```

### File Purpose Summary

| File                    | Lines | Purpose                                                       |
| ----------------------- | ----- | ------------------------------------------------------------- |
| `Runtime.ts`            | 275   | Main orchestrator, integrates all subsystems                  |
| `Store.ts`              | 144   | Three-layer state: globals, scene, nodes                      |
| `EventBus.ts`           | 101   | Event pub-sub with type-specific and global listeners         |
| `ActionExecutor.ts`     | 423   | Executes 23+ action types (flow, state, UI, animation, style) |
| `TriggerInterpreter.ts` | 81    | Implements ECA pattern for event handling                     |
| `ConditionEvaluator.ts` | 98    | Evaluates 9 condition operators                               |
| `ReferenceResolver.ts`  | 67    | Resolves references and interpolates templates                |
| `Logger.ts`             | 141   | Records all runtime operations for debug/replay               |
| `AnimationEngine.ts`    | 469   | Keyframe animation with 8 easing functions                    |
| `TransitionEngine.ts`   | 523   | 16 scene transition effects                                   |
| `StyleManager.ts`       | 324   | Computes styles with variables, responsive, states            |
| `ThemeProvider.ts`      | 287   | Manages theme switching and inheritance                       |

---

## 2. Key Classes and Responsibilities

### 2.1 VVCERuntime (Main Orchestrator)

**Location:** `src/runtime/Runtime.ts`

**Responsibility:** Central coordinator that owns and connects all subsystems.

**Key Properties:**

```typescript
private store: Store;                    // State management
private eventBus: EventBus;              // Event dispatch
private resolver: ReferenceResolver;     // Reference resolution
private evaluator: ConditionEvaluator;   // Condition evaluation
private executor: ActionExecutor;        // Action execution
private interpreter: TriggerInterpreter; // Trigger handling
private logger: Logger;                  // Logging

private course: CourseDSL | null;        // Loaded course
private currentSceneId: string | null;   // Current scene
private currentTriggers: Trigger[];      // Active triggers
```

**Key Methods:**

```typescript
constructor(options: RuntimeOptions)
loadCourse(dsl: CourseDSL): void
start(options?: StartOptions): void
gotoScene(sceneId: string): void
emit(event: VVEvent): void
getState(): RuntimeState
setState(state: Partial<RuntimeState>): void
updateNodeState(nodeId: string, state: any): void
getNodeState(nodeId: string): any
getLogs(): LogEntry[]
reset(): void
destroy(): void
```

**Initialization Flow:**

1. Create logger (with debug mode)
2. Create store
3. Create event bus
4. Create resolver (depends on store)
5. Create evaluator (depends on resolver)
6. Create executor (depends on store, resolver)
7. Create interpreter (depends on evaluator, executor, logger)
8. Wire event bus to interpreter

**Critical Pattern:** All events flow through EventBus → Interpreter → Executor

---

### 2.2 Store (State Management)

**Location:** `src/store/Store.ts`

**Responsibility:** Manages three-layer state architecture with path-based access.

**State Structure:**

```typescript
interface RuntimeState {
  globals: {
    vars: Record<string, any>; // Cross-scene persistent state
  };
  scene: {
    vars: Record<string, any>; // Current scene temporary vars
  };
  nodes: Record<string, NodeState>; // Component states
}
```

**Path Patterns:**

- `globals.vars.score` → Global variable
- `scene.vars.temp` → Scene variable
- `q1.state.selected` → Node state (component ID = q1)

**Key Methods:**

```typescript
get(path: string): any                   // Navigate path, return value
set(path: string, value: any): void      // Set at path (creates intermediate objects)
getAll(): RuntimeState                   // Return full state
getGlobalVars(): Record<string, any>     // Shortcut for globals.vars
getSceneVars(): Record<string, any>      // Shortcut for scene.vars
getNodeState(nodeId: string): any        // Get node state
setNodeState(nodeId: string, state: any) // Replace node state
updateNodeState(nodeId, updates)         // Partial update (Object.assign)
resetSceneState(): void                  // Clear scene.vars and nodes
reset(): void                            // Reset all state
clone(): RuntimeState                    // Deep clone via JSON
restore(snapshot: RuntimeState): void    // Restore from snapshot
```

**Important Patterns:**

- **Path-based access:** All reads/writes use dot-notation paths
- **Auto-creation:** Missing intermediate objects are created on `set()`
- **No direct mutation:** Always use `set()`, never mutate state directly
- **Scene isolation:** `resetSceneState()` called on scene change

---

### 2.3 ActionExecutor (Action Execution)

**Location:** `src/executor/ActionExecutor.ts`

**Responsibility:** Executes 23+ action types across 6 categories.

**Action Categories:**

| Category               | Actions                                   | Count |
| ---------------------- | ----------------------------------------- | ----- |
| **Flow Control**       | gotoScene, parallel, sequence, delay      | 4     |
| **State Manipulation** | setVar, incVar, addScore, resetNode       | 4     |
| **UI Feedback**        | toast, modal, showNode, hideNode          | 4     |
| **Animation**          | playAnimation, stopAnimation              | 2     |
| **Style**              | setStyle, addClass, removeClass, setTheme | 4     |
| **Media**              | sound, haptic                             | 2     |

**Constructor Signature:**

```typescript
// New signature (v1.1, supports engines)
constructor(options: ActionExecutorOptions)

interface ActionExecutorOptions {
  store: Store;
  resolver: ReferenceResolver;
  callbacks?: ActionExecutorCallbacks;
  animationEngine?: AnimationEngine;
  transitionEngine?: TransitionEngine;
  styleManager?: StyleManager;
  themeProvider?: ThemeProvider;
}
```

**Key Methods:**

```typescript
execute(action: Action): Promise<void>       // Execute single action
executeAll(actions: Action[]): Promise<void> // Execute sequentially
setEngines({...}): void                      // Inject engines (v1.1)
```

**Critical Implementation Details:**

1. **Flow Control:**

   ```typescript
   executeGotoScene(sceneId, transition); // Delegates to onSceneChange callback
   executeParallel(actions); // Promise.all()
   executeSequence(actions); // Sequential await
   executeDelay(duration); // new Promise with setTimeout
   ```

2. **State Manipulation:**

   ```typescript
   executeSetVar(path, value); // Resolves value, then store.set()
   executeIncVar(path, by); // Gets current, adds by, sets
   executeAddScore(value); // Shortcut for incVar('globals.vars.score')
   executeResetNode(nodeId); // store.setNodeState(nodeId, {})
   ```

3. **Animation (v1.1):**
   ```typescript
   executePlayAnimation(action); // Uses animationEngine if available
   executeStopAnimation(target); // Stops all animations on node
   ```

**Important Patterns:**

- All actions are async (return Promise<void>)
- References are resolved before execution
- Text interpolation happens in executeToast/Modal
- Engines (animation, style) are optional (check before use)
- Callbacks handle rendering (executor doesn't touch DOM)

---

### 2.4 EventBus (Event Dispatcher)

**Location:** `src/event-bus/EventBus.ts`

**Responsibility:** Pub-sub event system with type-specific and global listeners.

**Data Structures:**

```typescript
private listeners: Map<string, Set<EventListener>>;  // Type-specific
private allListeners: Set<EventListener>;             // Global (all events)
```

**Event Format:**

```typescript
interface VVEvent {
  type: string; // 'click', 'change', 'sceneEnter', etc.
  target?: string; // Node ID (e.g., 'b1', 'q1')
  payload?: any; // Event-specific data
  ts: number; // Timestamp
}
```

**Key Methods:**

```typescript
on(eventType: string, listener: EventListener): () => void  // Returns unsubscribe
onAll(listener: EventListener): () => void                  // Listen to all events
off(eventType: string, listener: EventListener): void
offAll(listener: EventListener): void
emit(event: VVEvent): void                                  // Dispatch event
clear(): void                                               // Remove all listeners
getListenerCount(eventType?: string): number                // Debug helper
```

**Critical Pattern:**

- Both type-specific and global listeners are called on emit
- Errors in listeners are caught and logged (don't stop propagation)
- Unsubscribe function pattern: `const unsub = bus.on('click', handler); unsub();`

---

### 2.5 TriggerInterpreter (ECA Pattern)

**Location:** `src/interpreter/TriggerInterpreter.ts`

**Responsibility:** Implements Event-Condition-Action pattern.

**Trigger Structure:**

```typescript
interface Trigger {
  on: {
    event: string; // Event type to match
    target?: string; // Optional target node ID
  };
  if?: Condition[]; // Optional conditions (AND)
  then: Action[]; // Actions if conditions pass
  else?: Action[]; // Actions if conditions fail
}
```

**Execution Flow:**

1. `handleEvent()` called by Runtime (via EventBus)
2. For each trigger:
   - Check if `event.type` matches `trigger.on.event`
   - If `trigger.on.target` specified, check `event.target` matches
   - If matched:
     - Evaluate `trigger.if` conditions (default true if absent)
     - If true → execute `trigger.then` actions
     - If false → execute `trigger.else` actions (if defined)

---

### 2.6 ReferenceResolver

**Location:** `src/interpreter/ReferenceResolver.ts`

**Responsibility:** Resolves `{ref: "path"}` expressions and `{{path}}` template strings.

**Key Methods:**

```typescript
isRef(value: any): value is RefExpression        // Type guard for {ref: ...}
resolve(value: ValueOrRef): any                  // Resolve single value or ref
interpolate(text: string): string                // Replace {{path}} in strings
resolveObject<T>(obj: T): T                      // Deep resolve all refs in object
```

**Examples:**

```typescript
// Direct reference
{ "ref": "globals.vars.score" }  → Store.get("globals.vars.score")

// Template interpolation
"Your score: {{globals.vars.score}}"  → "Your score: 100"
```

---

### 2.7 ConditionEvaluator

**Location:** `src/interpreter/ConditionEvaluator.ts`

**Supported Operators:**

```typescript
type ConditionOperator =
  | 'equals'
  | 'notEquals' // Value comparison
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte' // Numeric comparison
  | 'and'
  | 'or'
  | 'not'; // Logical operators
```

**Evaluation Details:**

- **equals/notEquals:** Uses `===` after resolving refs
- **Comparisons:** Converts to Number, warns if NaN
- **and:** Returns true if all conditions true (empty = true)
- **or:** Returns true if any condition true (empty = false)
- **not:** Negates first condition only

---

### 2.8 Logger

**Location:** `src/logger/Logger.ts`

**Log Entry Structure:**

```typescript
interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error';
  type: 'event' | 'condition' | 'action' | 'state' | 'scene';
  message: string;
  data?: any;
  ts: number;
}
```

**Key Methods:**

```typescript
log(level, type, message, data?): void
debug(type, message, data?): void
info(type, message, data?): void
warn(type, message, data?): void
error(type, message, data?): void
getLogs(): LogEntry[]
clear(): void
export(): string         // JSON.stringify
import(logsJson): void   // JSON.parse
```

**Critical Pattern:**

- Every significant operation must be logged
- Logs are essential for replay functionality
- Use appropriate type and level
- Include relevant data for debugging

---

### 2.9 AnimationEngine (v1.1)

**Location:** `src/animation/AnimationEngine.ts`

**Key Concepts:**

```typescript
interface AnimationDefinition {
  keyframes: Array<{
    offset: number; // 0-100 (percentage)
    properties: Record<string, any>; // CSS-like properties
  }>;
  duration?: number; // Milliseconds
  easing?: EasingFunction;
  delay?: number;
  iterations?: number; // -1 = infinite
}
```

**Built-in Animations (30+):**

- Fade: fadeIn, fadeOut
- Slide: slideInLeft, slideInRight, slideInUp, slideInDown
- Zoom: zoomIn, zoomOut
- Bounce: bounceIn, bounceOut
- Shake: shake, shakeX, shakeY
- Pulse: pulse, heartbeat
- Flip: flipInX, flipInY, flipOutX, flipOutY

**Pattern:** Animations run via requestAnimationFrame loop

---

### 2.10 StyleManager (v1.1)

**Location:** `src/style/StyleManager.ts`

**Key Concepts:**

```typescript
interface StyleVariables {
  colors?: Record<string, string>;
  spacing?: Record<string, number>;
  fontSizes?: Record<string, number>;
  fontFamilies?: Record<string, string>;
  radii?: Record<string, number>;
  shadows?: Record<string, string>;
}
```

**Style Computation Order:**

1. Apply base styles from class
2. Apply state styles (hover/active/disabled/focus)
3. Apply responsive styles for current breakpoint
4. Apply inline styles (highest priority)
5. Resolve all variable references

---

## 3. Code Patterns and Conventions

### 3.1 Constructor Patterns

**Simple Constructor:**

```typescript
export class Store {
  constructor(initialState?: Partial<RuntimeState>) {
    this.state = {
      globals: { vars: {} },
      scene: { vars: {} },
      nodes: {},
      ...initialState,
    };
  }
}
```

**Constructor with Options:**

```typescript
export class Logger {
  constructor(options: { maxLogs?: number; debug?: boolean } = {}) {
    this.maxLogs = options.maxLogs ?? 1000;
    this.debugMode = options.debug ?? false;
  }
}
```

### 3.2 Method Naming Conventions

| Pattern     | Example              | Purpose              |
| ----------- | -------------------- | -------------------- |
| `execute*`  | `executeGotoScene()` | Action execution     |
| `evaluate*` | `evaluateEquals()`   | Condition evaluation |
| `get*`      | `getState()`         | Getter               |
| `set*`      | `setState()`         | Setter               |
| `on*`       | `onSceneChange()`    | Event callback       |
| `handle*`   | `handleEvent()`      | Event handler        |
| `is*`       | `isRef()`            | Type guard           |

### 3.3 Error Handling

**Console Warnings (Not Errors):**

```typescript
// For recoverable issues
if (!this.isValidOperator(op)) {
  console.warn(`Unknown operator: ${op}`);
  return false; // Safe fallback
}
```

**Thrown Errors:**

```typescript
// For critical failures
if (!this.course) {
  throw new Error('No course loaded. Call loadCourse() first.');
}
```

### 3.4 Callback Optional Chaining

```typescript
this.callbacks.onSceneChange?.(sceneId, transition);
this.logger?.info('scene', `Entering: ${sceneId}`);
```

---

## 4. Internal Architecture and Data Flow

### 4.1 Event Flow (Complete)

```
1. User interaction (e.g., button click)
   │
   ▼
2. Frontend calls runtime.emit({ type: 'click', target: 'b1', ts: ... })
   │
   ▼
3. EventBus.emit(event)
   │
   └─→ TriggerInterpreter.handleEvent(event, currentTriggers)
       │
       ▼
4. For each trigger:
   ├─→ Match event type and target
   ├─→ Evaluate conditions (ConditionEvaluator)
   ├─→ If true: execute trigger.then actions
   └─→ If false: execute trigger.else actions
       │
       ▼
5. ActionExecutor.executeAll(actions)
   │
   └─→ Callbacks notify frontend
```

### 4.2 Scene Change Flow

```
1. Action: { action: 'gotoScene', sceneId: 's2' }
   │
   ▼
2. ActionExecutor.executeGotoScene('s2')
   │
   └─→ Callback: onSceneChange('s2')
       │
       ▼
3. Runtime.gotoScene('s2')
   │
   ├─→ Store.resetSceneState()  // Clear scene.vars and nodes
   ├─→ Initialize scene.vars from scene.vars
   ├─→ Set currentTriggers = scene.triggers
   └─→ Emit: { type: 'sceneEnter', target: 's2' }
```

---

## 5. Extension Points

### 5.1 Adding a New Action

**Steps:**

1. **Define action type in vvce-schema:**

   ```typescript
   // packages/vvce-schema/src/types/dsl.ts
   export interface MyCustomAction {
     action: 'myCustomAction';
     param1: string;
     param2?: number;
   }
   ```

2. **Add to ActionExecutor switch:**

   ```typescript
   // src/executor/ActionExecutor.ts
   private executeAction(action: ActionDSL): void {
     switch (action.action) {
       case 'myCustomAction':
         this.handleMyCustomAction(action);
         break;
   ```

3. **Implement execution method:**
   ```typescript
   private handleMyCustomAction(action: any): void {
     const { param1, param2 = defaultValue } = action;
     const resolvedParam1 = this.resolver.resolve(param1);
     // ... implementation
     this.logger?.info('action', `MyCustomAction: ${param1}`);
   }
   ```

### 5.2 Adding a New Condition Operator

**Steps:**

1. **Add to schema type:**

   ```typescript
   export type ConditionOperator = 'equals' | 'myOperator' | ...;
   ```

2. **Add case in ConditionEvaluator:**
   ```typescript
   case 'myOperator':
     return this.evaluateMyOperator(condition);
   ```

### 5.3 Adding a Built-in Animation

**Steps:**

1. **Add to schema:**

   ```typescript
   export type BuiltinAnimation = 'fadeIn' | 'myAnimation' | ...;
   ```

2. **Define in `presets/animations.ts`:**
   ```typescript
   export const BUILTIN_ANIMATIONS: Record<BuiltinAnimation, AnimationDefinition> = {
     myAnimation: {
       keyframes: [
         { offset: 0, properties: { opacity: 0 } },
         { offset: 100, properties: { opacity: 1 } },
       ],
       duration: 400,
       easing: 'ease-out',
     },
   };
   ```

---

## 6. Testing Guidelines

### 6.1 Recommended Test Structure

```typescript
// src/store/Store.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { Store } from './Store';

describe('Store', () => {
  let store: Store;

  beforeEach(() => {
    store = new Store();
  });

  it('should set and get global variables', () => {
    store.set('globals.vars.score', 100);
    expect(store.get('globals.vars.score')).toBe(100);
  });

  it('should create intermediate objects', () => {
    store.set('globals.vars.deep.nested.value', 42);
    expect(store.get('globals.vars.deep.nested.value')).toBe(42);
  });
});
```

### 6.2 Testing ActionExecutor

```typescript
describe('ActionExecutor', () => {
  let executor: ActionExecutor;

  beforeEach(() => {
    const store = new Store();
    const resolver = new ReferenceResolver(store);
    executor = new ActionExecutor({ store, resolver });
  });

  it('should set variable', async () => {
    await executor.execute({
      action: 'setVar',
      path: 'globals.vars.score',
      value: 100,
    });
    // Assert state changed
  });
});
```

---

## 7. Common Development Scenarios

### 7.1 Debugging a Trigger Not Firing

**Checklist:**

1. Enable debug mode: `new VVCERuntime({ debug: true })`
2. Check logs: `runtime.getLogs()`
3. Verify event type matches
4. Verify target matches (if specified)
5. Check condition evaluation

### 7.2 State Not Updating

**Common Causes:**

1. Incorrect path
2. Direct mutation instead of `store.set()`
3. Scene state cleared on scene change
4. Reference not resolved

**Debugging:**

```typescript
console.log('Before:', store.get('globals.vars.score'));
await executor.execute({ action: 'addScore', value: 10 });
console.log('After:', store.get('globals.vars.score'));
```

---

## 8. Dependencies and Exports

### 8.1 Package Dependencies

```json
{
  "peerDependencies": {
    "@vv-education/vvce-schema": "workspace:*"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "^5.3.0",
    "vitest": "^1.0.0"
  }
}
```

**No Runtime Dependencies:** vvce-core is pure TypeScript with zero external runtime dependencies.

### 8.2 Main Exports

```typescript
// Main Runtime
export { VVCERuntime } from './runtime/Runtime';

// Core Subsystems
export { Store } from './store/Store';
export { EventBus } from './event-bus/EventBus';
export { ActionExecutor } from './executor/ActionExecutor';

// Style System (v1.1)
export { StyleManager } from './style/StyleManager';
export { ThemeProvider } from './style/ThemeProvider';

// Animation System (v1.1)
export { AnimationEngine } from './animation/AnimationEngine';
export { TransitionEngine } from './animation/TransitionEngine';

// Types
export type { VVEvent, RuntimeState, LogEntry } from './types';
```

---

## 9. Important Notes for AI Assistants

### 9.1 Critical Principles

1. **Framework-Agnostic:** vvce-core must NOT depend on React, Vue, or any frontend framework
2. **Pure TypeScript:** No runtime dependencies allowed (except peer: vvce-schema)
3. **Deterministic:** Same DSL + same state = same result (critical for replay)
4. **Immutable Store Access:** Always use `store.set()`, never mutate state directly
5. **Complete Logging:** Every significant operation must be logged

### 9.2 Do NOT Do

- ❌ Add external dependencies (e.g., lodash, rxjs)
- ❌ Use browser-specific APIs directly (delegate to callbacks)
- ❌ Mutate state directly: `this.state.globals.vars.score++`
- ❌ Execute actions without resolving references first
- ❌ Skip logging for new actions/features

### 9.3 DO

- ✅ Use callbacks for UI/DOM operations
- ✅ Resolve all references before using values
- ✅ Log at appropriate levels (debug/info/warn/error)
- ✅ Write tests for new features
- ✅ Use TypeScript strict mode
- ✅ Export types separately from implementations

### 9.4 When Adding New Code

**Checklist:**

- [ ] Types defined in vvce-schema or local file
- [ ] Implementation added to appropriate subsystem
- [ ] References resolved where needed
- [ ] Logging added
- [ ] Error handling implemented
- [ ] Exported from `index.ts` if public API
- [ ] Documentation updated
- [ ] Tests written (recommended)

---

**Document Version:** 1.0
**Last Updated:** 2026-01-11
**Maintained By:** VV Education Team
