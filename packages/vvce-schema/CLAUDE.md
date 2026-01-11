# CLAUDE.md - vvce-schema Module Guide

> **Module:** `@vv-education/vvce-schema`
> **Version:** 0.1.0
> **Purpose:** DSL Type Definitions & Validation for VVCE
> **Last Updated:** 2026-01-11

This document provides comprehensive guidance for AI assistants working on the `vvce-schema` package, which defines the type system and validation for the VVCE DSL.

---

## Table of Contents

1. [Directory Structure](#1-directory-structure)
2. [DSL Type System](#2-dsl-type-system)
3. [Validation Architecture](#3-validation-architecture)
4. [Type Extension Patterns](#4-type-extension-patterns)
5. [Versioning Strategy](#5-versioning-strategy)
6. [Common Tasks](#6-common-tasks)
7. [Testing Strategy](#7-testing-strategy)
8. [Important Notes for AI Assistants](#8-important-notes-for-ai-assistants)

---

## 1. Directory Structure

```
packages/vvce-schema/
├── src/
│   ├── index.ts                    # Public API exports (98 lines)
│   ├── types/
│   │   └── dsl.ts                  # All DSL type definitions (756 lines)
│   └── validator/
│       └── Validator.ts            # Validation logic (238 lines)
├── examples/
│   └── demo-lesson.json            # Reference DSL example
├── package.json                     # Package config
├── tsconfig.json                   # TypeScript config
└── README.md                       # Package documentation

Total: 3 TypeScript files, ~1092 lines of code
```

**Organization Philosophy:**

- **Monolithic types file**: All DSL types in single `dsl.ts` (756 lines)
- **Validation separated**: Validator logic isolated from type definitions
- **Centralized exports**: All public types re-exported through `index.ts`

---

## 2. DSL Type System

### 2.1 Type Hierarchy

```
CourseDSL (Root)
├── schema: 'vvce.dsl.v1' (version identifier)
├── meta: CourseMeta
├── globals?: CourseGlobals
├── resources?: CourseResources ⭐ v1.1
├── theme?: ThemeConfig | string ⭐ v1.1
├── startSceneId: string
└── scenes: SceneDSL[]
    ├── id: string
    ├── nodes?: NodeDSL[]
    │   ├── id: string
    │   ├── type: string
    │   ├── props?: Record<string, any>
    │   ├── style?: StyleProperties ⭐ v1.1
    │   └── enterAnimation?: NodeAnimation ⭐ v1.1
    └── triggers?: TriggerDSL[]
        ├── on: EventMatcher
        ├── if?: ConditionDSL[]
        ├── then: ActionDSL[]
        └── else?: ActionDSL[]
```

### 2.2 Core Type Definitions

**CourseDSL (Root Object):**

```typescript
export interface CourseDSL {
  schema: 'vvce.dsl.v1'; // Version identifier (literal type)
  meta: CourseMeta;
  globals?: CourseGlobals;
  resources?: CourseResources; // v1.1
  theme?: ThemeConfig | string; // v1.1
  startSceneId: string;
  scenes: SceneDSL[];
}
```

**SceneDSL:**

```typescript
export interface SceneDSL {
  id: string; // Unique scene ID
  layout?: LayoutConfig;
  style?: StyleProperties; // v1.1
  enterTransition?: SceneTransition; // v1.1
  exitTransition?: SceneTransition; // v1.1
  vars?: Record<string, any>;
  nodes?: NodeDSL[];
  triggers?: TriggerDSL[];
  onEnter?: ActionDSL[];
  onExit?: ActionDSL[];
}
```

**NodeDSL:**

```typescript
export interface NodeDSL {
  id: string; // Unique in scene
  type: string; // Component type
  props?: Record<string, any>; // Component-specific props
  style?: StyleProperties; // v1.1
  styleClass?: string | string[]; // v1.1
  enterAnimation?: NodeAnimation; // v1.1
  exitAnimation?: NodeAnimation; // v1.1
  visible?: boolean | ConditionDSL; // v1.1
}
```

### 2.3 Action Types (23 Total)

**ActionDSL Union:**

```typescript
export type ActionDSL =
  // Flow Control (4)
  | GotoSceneAction
  | ParallelAction
  | SequenceAction
  | DelayAction
  // State Management (4)
  | SetVarAction
  | IncVarAction
  | AddScoreAction
  | ResetNodeAction
  // UI Feedback (2)
  | ToastAction
  | ModalAction
  // Animation (2)
  | PlayAnimationAction
  | StopAnimationAction
  // Style & Visibility (5)
  | SetStyleAction
  | AddClassAction
  | RemoveClassAction
  | ShowNodeAction
  | HideNodeAction
  // Theme (1)
  | SetThemeAction
  // Media (2)
  | SoundAction
  | HapticAction;
```

**Example Action Types:**

```typescript
export interface GotoSceneAction {
  action: 'gotoScene';
  sceneId: string;
  transition?: SceneTransition;
}

export interface SetVarAction {
  action: 'setVar';
  path: string; // e.g., "globals.vars.score"
  value: ValueOrRef;
}

export interface ToastAction {
  action: 'toast';
  text: string;
  duration?: number;
}
```

### 2.4 Condition Types

**ConditionDSL Union:**

```typescript
export type ConditionDSL = ComparisonCondition | LogicalCondition;
```

**ComparisonCondition:**

```typescript
export interface ComparisonCondition {
  op: 'equals' | 'notEquals' | 'gt' | 'gte' | 'lt' | 'lte';
  left: ValueOrRef;
  right: ValueOrRef;
}
```

**LogicalCondition:**

```typescript
export interface LogicalCondition {
  op: 'and' | 'or' | 'not';
  conditions: ConditionDSL[];
}
```

### 2.5 Reference System

**ValueOrRef:**

```typescript
export type ValueOrRef = any | RefExpression;

export interface RefExpression {
  ref: string; // Path to state: "globals.vars.score", "q1.state.selected"
}
```

### 2.6 Style System (v1.1)

**StyleVariables:**

```typescript
export interface StyleVariables {
  colors?: Record<string, string>;
  spacing?: Record<string, number>;
  fontSizes?: Record<string, number>;
  fontFamilies?: Record<string, string>;
  radii?: Record<string, number>;
  shadows?: Record<string, string>;
}
```

**StyleProperties:**

```typescript
export interface StyleProperties {
  backgroundColor?: string;
  color?: string;
  fontSize?: number | string;
  padding?: number | string;
  margin?: number | string;
  borderRadius?: number | string;
  // ... many more CSS-like properties
}
```

### 2.7 Animation System (v1.1)

**BuiltinAnimation (30+ types):**

```typescript
export type BuiltinAnimation =
  // Fade
  | 'fadeIn'
  | 'fadeOut'
  // Slide
  | 'slideInLeft'
  | 'slideInRight'
  | 'slideInUp'
  | 'slideInDown'
  | 'slideOutLeft'
  | 'slideOutRight'
  | 'slideOutUp'
  | 'slideOutDown'
  // Zoom
  | 'zoomIn'
  | 'zoomOut'
  // Bounce
  | 'bounceIn'
  | 'bounceOut'
  // Shake
  | 'shake'
  | 'shakeX'
  | 'shakeY'
  // Pulse
  | 'pulse'
  | 'heartbeat'
  // Flip
  | 'flipInX'
  | 'flipInY'
  | 'flipOutX'
  | 'flipOutY'
  // Rotate
  | 'rotateIn'
  | 'rotateOut';
```

**AnimationDefinition:**

```typescript
export interface AnimationDefinition {
  keyframes: Array<{
    offset: number; // 0-100
    properties: Record<string, any>;
  }>;
  duration?: number; // Milliseconds
  easing?: EasingFunction;
  delay?: number;
  iterations?: number; // -1 = infinite
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}
```

### 2.8 Theme System (v1.1)

**BuiltinTheme (9 types):**

```typescript
export type BuiltinTheme =
  | 'default'
  | 'playful'
  | 'academic'
  | 'minimal'
  | 'vibrant'
  | 'dark'
  | 'nature'
  | 'tech'
  | 'retro';
```

**ThemeConfig:**

```typescript
export interface ThemeConfig {
  name: string;
  extends?: string; // Inherit from another theme
  variables?: StyleVariables;
  components?: Record<string, StyleDefinition>;
}
```

---

## 3. Validation Architecture

### 3.1 Current Implementation

**Location:** `src/validator/Validator.ts`

**Validation Result:**

```typescript
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[]; // Blocking issues
  warnings: ValidationError[]; // Non-blocking issues
}

export interface ValidationError {
  path: string; // JSONPath-style location
  message: string; // Human-readable error
  severity: 'error' | 'warning';
}
```

**Main API:**

```typescript
export function validateCourse(dsl: any): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // 1. Structural validation (required fields, types)
  validateStructure(dsl, errors);

  // 2. Semantic validation (references, reachability)
  if (errors.length === 0) {
    validateSemantics(dsl, errors, warnings);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}
```

### 3.2 Validation Rules

**Structural Validation:**

| Rule                 | Check                             | Error Message                         |
| -------------------- | --------------------------------- | ------------------------------------- |
| Schema version       | `schema === 'vvce.dsl.v1'`        | "schema must be 'vvce.dsl.v1'"        |
| Meta required        | `meta && meta.id && meta.version` | "meta.id is required"                 |
| Start scene required | `startSceneId` exists             | "startSceneId is required"            |
| Scenes array         | `Array.isArray(scenes)`           | "scenes must be array"                |
| Scene IDs unique     | No duplicate scene IDs            | "Scene ID 'X' duplicated"             |
| Node IDs unique      | No duplicate node IDs per scene   | "Node ID 'X' duplicated in scene 'Y'" |

**Semantic Validation:**

| Rule                    | Check                           | Error Type |
| ----------------------- | ------------------------------- | ---------- |
| Start scene exists      | `startSceneId` in scene IDs     | Error      |
| Trigger target exists   | `trigger.on.target` in node IDs | Error      |
| GotoScene target exists | `action.sceneId` in scene IDs   | Error      |
| Unreachable scenes      | Scene not referenced anywhere   | Warning ⚠️ |

**Validation Flow:**

```typescript
function validateCourse(dsl: any): ValidationResult {
  // Phase 1: Structure
  validateStructure(dsl, errors);
  if (errors.length > 0) return { valid: false, errors, warnings: [] };

  // Phase 2: Semantics
  validateSemantics(dsl, errors, warnings);

  // Phase 3: Dead code detection (graph traversal)
  const reachableScenes = new Set([dsl.startSceneId]);
  // ... traverse all gotoScene actions ...

  // Warn about unreachable scenes
  dsl.scenes.forEach((scene) => {
    if (!reachableScenes.has(scene.id)) {
      warnings.push({
        path: `scenes[${index}]`,
        message: `Scene '${scene.id}' is unreachable`,
        severity: 'warning',
      });
    }
  });

  return { valid: errors.length === 0, errors, warnings };
}
```

### 3.3 Important Notes

**No JSON Schema Yet:**

- Despite `package.json` listing `ajv` as dependency, no JSON Schema files exist
- Current implementation uses programmatic TypeScript validation
- JSON Schema integration is planned but not implemented

---

## 4. Type Extension Patterns

### 4.1 Pattern 1: Union Type Extension

**Used for:** Actions, Conditions, Animations, Themes

**How to add a new action:**

```typescript
// 1. Define the interface
export interface MyCustomAction {
  action: 'myCustomAction'; // Discriminator
  param1: string;
  param2?: number;
}

// 2. Add to union
export type ActionDSL = GotoSceneAction | SetVarAction | MyCustomAction; // ← Add here
```

**Why this works:**

- TypeScript discriminated unions provide exhaustive checking
- Switch statements on `action` field are type-safe
- Adding new types doesn't break existing code

### 4.2 Pattern 2: Record Extension

**Used for:** Resources, Variables, Custom Props

```typescript
// Open-ended records for user-defined values
resources?: {
  animations?: Record<string, AnimationDefinition>;
  styles?: Record<string, StyleDefinition>;
}
```

### 4.3 Pattern 3: String Literal + Escape Hatch

**Used for:** Built-in names that also allow custom values

```typescript
// Define built-ins
export type BuiltinAnimation = 'fadeIn' | 'slideInLeft' | ...;

// Usage allows both built-in and custom
animation: BuiltinAnimation | string  // ← Can use 'customAnim'
```

**Benefit:** Type safety for built-ins, flexibility for custom values

### 4.4 Pattern 4: Optional Field Extension

**Used for:** v1.1 enhancements

```typescript
export interface NodeDSL {
  // Core fields (v1.0)
  id: string;
  type: string;
  props?: Record<string, any>;

  // Enhanced fields (v1.1) - all optional
  style?: StyleProperties; // ← Optional
  styleClass?: string | string[]; // ← Optional
  enterAnimation?: NodeAnimation; // ← Optional
}
```

**Versioning strategy:** Add optional fields, never break existing DSL

---

## 5. Versioning Strategy

### 5.1 Version Identifier

**Current Version:** `vvce.dsl.v1`

**Version Definition:**

```typescript
export interface CourseDSL {
  schema: 'vvce.dsl.v1'; // ← Hard-coded literal type
  // ...
}
```

**Important:** Both v1.0 and v1.1 use the **same** schema identifier

### 5.2 Version Evolution

| Version        | Changes                      | Breaking? | Identifier           |
| -------------- | ---------------------------- | --------- | -------------------- |
| v1.0 (M0)      | Initial DSL                  | N/A       | `vvce.dsl.v1`        |
| v1.1 (Current) | +Style, +Themes, +Animations | ❌ No     | `vvce.dsl.v1` (same) |
| v2.0 (Future)  | Would require new types      | ✅ Yes    | `vvce.dsl.v2`        |

### 5.3 Backward Compatibility Rules

1. **Only add optional fields** - Never remove or change existing required fields
2. **Union type additions** - Safe to add new action/condition types
3. **Same schema version** - Minor enhancements keep same version
4. **Validator adapts** - Validator doesn't enforce v1.1 fields for v1.0 DSL

**Example of backward compatibility:**

```typescript
// v1.0 DSL (still valid)
{
  "schema": "vvce.dsl.v1",
  "meta": { "id": "course-1", "version": "1.0" },
  "startSceneId": "s1",
  "scenes": [...]
}

// v1.1 DSL (uses new features)
{
  "schema": "vvce.dsl.v1",  // ← Same identifier
  "meta": { "id": "course-1", "version": "1.0" },
  "theme": "playful",       // ← New field (optional)
  "startSceneId": "s1",
  "scenes": [...]
}
```

---

## 6. Common Tasks

### 6.1 Adding a New Action Type

**Complete Workflow:**

1. **Define interface** (`src/types/dsl.ts`):

   ```typescript
   export interface CopyVarAction {
     action: 'copyVar';
     from: string; // Source path
     to: string; // Destination path
   }
   ```

2. **Add to union**:

   ```typescript
   export type ActionDSL =
     | GotoSceneAction
     // ... existing ...
     | CopyVarAction; // ← Add here
   ```

3. **Export** (`src/index.ts`):

   ```typescript
   export type {
     // ... existing ...
     CopyVarAction,
   } from './types/dsl';
   ```

4. **Add validation** (`src/validator/Validator.ts`):

   ```typescript
   // In validateSemantics
   if (action.action === 'copyVar') {
     // Validate paths are valid
     if (!action.from.startsWith('globals.') && !action.from.startsWith('scene.')) {
       errors.push({
         path: `scenes[${index}].triggers[${triggerIndex}]`,
         message: `Invalid source path: ${action.from}`,
         severity: 'error',
       });
     }
   }
   ```

5. **Implement in vvce-core** (`packages/vvce-core/src/executor/ActionExecutor.ts`):
   ```typescript
   case 'copyVar':
     this.handleCopyVar(action);
     break;
   ```

### 6.2 Adding a New Component Type

**Workflow:**

1. **Define props interface**:

   ```typescript
   export interface RatingProps {
     maxStars?: number;
     value?: number;
     onChange?: string; // Event handler
   }
   ```

2. **Export**:

   ```typescript
   export type { RatingProps } from './types/dsl';
   ```

3. **No NodeDSL change needed** - NodeDSL already uses `type: string`

4. **Implement component** in `vvce-components`:

   ```typescript
   import type { RatingProps } from '@vv-education/vvce-schema';

   export const Rating: React.FC<RatingProps> = (props) => {
     // Implementation
   };
   ```

### 6.3 Adding a New Condition Operator

**Workflow:**

1. **Extend ComparisonCondition**:

   ```typescript
   export interface ComparisonCondition {
     op: 'equals' | 'notEquals' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains';
     left: ValueOrRef;
     right: ValueOrRef;
   }
   ```

2. **Update evaluator** in `vvce-core`:
   ```typescript
   case 'contains':
     return String(left).includes(String(right));
   ```

### 6.4 Adding a Built-in Animation

**Workflow:**

1. **Add to union**:

   ```typescript
   export type BuiltinAnimation =
     | 'fadeIn'
     // ... existing ...
     | 'myAnimation'; // ← Add here
   ```

2. **Define animation** in `vvce-core/src/presets/animations.ts`:
   ```typescript
   export const BUILTIN_ANIMATIONS: Record<BuiltinAnimation, AnimationDefinition> = {
     myAnimation: {
       keyframes: [
         { offset: 0, properties: { opacity: 0, scale: 0.8 } },
         { offset: 100, properties: { opacity: 1, scale: 1 } },
       ],
       duration: 400,
       easing: 'ease-out',
     },
   };
   ```

---

## 7. Testing Strategy

### 7.1 Current State

**No tests implemented yet** - This is a critical gap for M0 completion.

### 7.2 Recommended Test Structure

**Level 1: Type-Level Tests**

```typescript
// types.test.ts
import type { CourseDSL, ActionDSL } from '@vv-education/vvce-schema';

// Valid DSL should compile
const validCourse: CourseDSL = {
  schema: 'vvce.dsl.v1',
  meta: { id: 'test', version: '1.0.0' },
  startSceneId: 's1',
  scenes: [],
};

// Invalid schema should fail at compile time
const invalid: CourseDSL = {
  schema: 'vvce.dsl.v2', // ← Type error
  // ...
};
```

**Level 2: Validation Logic Tests**

```typescript
// validator.test.ts
import { describe, it, expect } from 'vitest';
import { validateCourse } from '@vv-education/vvce-schema';

describe('Validator - Structure', () => {
  it('should reject missing schema field', () => {
    const dsl = { meta: {}, startSceneId: 's1', scenes: [] };
    const result = validateCourse(dsl);
    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        path: 'schema',
        message: expect.stringContaining('vvce.dsl.v1'),
      })
    );
  });

  it('should detect duplicate scene IDs', () => {
    const dsl = {
      schema: 'vvce.dsl.v1',
      meta: { id: 'test', version: '1.0.0' },
      startSceneId: 's1',
      scenes: [
        { id: 's1', nodes: [] },
        { id: 's1', nodes: [] }, // ← Duplicate
      ],
    };
    const result = validateCourse(dsl);
    expect(result.errors.some((e) => e.message.includes('duplicate'))).toBe(true);
  });
});

describe('Validator - Semantics', () => {
  it('should detect missing scene reference', () => {
    const dsl = {
      schema: 'vvce.dsl.v1',
      meta: { id: 'test', version: '1.0.0' },
      startSceneId: 's1',
      scenes: [
        {
          id: 's1',
          nodes: [{ id: 'b1', type: 'Button' }],
          triggers: [
            {
              on: { event: 'click', target: 'b1' },
              then: [{ action: 'gotoScene', sceneId: 's999' }], // ← Missing
            },
          ],
        },
      ],
    };
    const result = validateCourse(dsl);
    expect(result.errors.some((e) => e.message.includes('s999'))).toBe(true);
  });
});
```

**Level 3: Fixture Tests**

```typescript
// fixtures.test.ts
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

describe('DSL Examples', () => {
  const fixturesDir = join(__dirname, '../examples');
  const files = readdirSync(fixturesDir).filter((f) => f.endsWith('.json'));

  files.forEach((file) => {
    it(`should validate ${file}`, () => {
      const dsl = JSON.parse(readFileSync(join(fixturesDir, file), 'utf-8'));
      const result = validateCourse(dsl);
      expect(result.valid).toBe(true);
    });
  });
});
```

---

## 8. Important Notes for AI Assistants

### 8.1 Critical Principles

1. **Monolithic type file** - All DSL types in single `dsl.ts` file
2. **Version via string literal** - `schema: 'vvce.dsl.v1'` enforced at type level
3. **Union-based extensibility** - ActionDSL, ConditionDSL use discriminated unions
4. **Backward compatibility first** - Always add optional fields for new features
5. **Validator not schema-based yet** - Uses programmatic validation, not JSON Schema

### 8.2 Do NOT Do

- ❌ Don't change the schema version string for minor changes
- ❌ Don't add required fields to existing types (breaks backward compatibility)
- ❌ Don't re-define schema types in vvce-core (import from vvce-schema)
- ❌ Don't use `any` except in escape hatches (`Record<string, any>` for user props)
- ❌ Don't break discriminated unions (action/op field must be unique)

### 8.3 DO

- ✅ Add new action/condition types via union extension
- ✅ Use optional fields for v1.x enhancements
- ✅ Export all public types from `index.ts`
- ✅ Add validation rules for new semantic constraints
- ✅ Document new types with JSDoc comments
- ✅ Keep built-in lists (animations, themes) in sync with vvce-core presets

### 8.4 Type Import Patterns

**In vvce-core:**

```typescript
// ✅ CORRECT: Import types from schema package
import type {
  CourseDSL,
  SceneDSL,
  ActionDSL,
  BuiltinAnimation
} from '@vv-education/vvce-schema';

// ❌ WRONG: Don't re-define schema types
interface ActionDSL { ... }  // Duplicate definition
```

### 8.5 Files to Watch

| Operation            | Files to Modify                                                   | Order       |
| -------------------- | ----------------------------------------------------------------- | ----------- |
| Add new action       | 1. `types/dsl.ts`<br>2. `index.ts`<br>3. `validator/Validator.ts` | Sequential  |
| Add component props  | 1. `types/dsl.ts`<br>2. `index.ts`                                | Sequential  |
| Add validation rule  | 1. `validator/Validator.ts`                                       | Single file |
| Add style properties | 1. `types/dsl.ts`<br>2. `index.ts`                                | Sequential  |

### 8.6 Missing Features (Planned)

| Feature           | Status             | Priority |
| ----------------- | ------------------ | -------- |
| JSON Schema files | ❌ Not implemented | Medium   |
| Ajv integration   | ❌ Not implemented | Medium   |
| Unit tests        | ❌ Not implemented | **High** |
| Migration tools   | ❌ Not implemented | Low      |

---

## Appendix: Quick Reference

### Action Types Quick List

```typescript
// Flow Control
('gotoScene', 'parallel', 'sequence', 'delay');

// State
('setVar', 'incVar', 'addScore', 'resetNode');

// UI
('toast', 'modal', 'showNode', 'hideNode');

// Animation
('playAnimation', 'stopAnimation');

// Style
('setStyle', 'addClass', 'removeClass', 'setTheme');

// Media
('sound', 'haptic');
```

### Condition Operators

```typescript
// Comparison
('equals', 'notEquals', 'gt', 'gte', 'lt', 'lte');

// Logical
('and', 'or', 'not');
```

### Built-in Themes

```typescript
('default',
  'playful',
  'academic',
  'minimal',
  'vibrant',
  'dark',
  'nature',
  'tech',
  'retro');
```

---

**Document Version:** 1.0
**Last Updated:** 2026-01-11
**Maintained By:** VV Education Team
