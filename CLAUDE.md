# CLAUDE.md - AI Assistant Guide for VV Education

> **Last Updated:** 2026-01-10
> **Project:** VV Education (vv-education)
> **Current Phase:** M0 (MVP - Core Engine Development)

This document provides comprehensive guidance for AI assistants working on the VV Education codebase. It covers architecture, conventions, workflows, and best practices.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Repository Structure](#2-repository-structure)
3. [Technology Stack](#3-technology-stack)
4. [Development Workflows](#4-development-workflows)
5. [Code Conventions](#5-code-conventions)
6. [Architecture Deep Dive](#6-architecture-deep-dive)
7. [Common Tasks](#7-common-tasks)
8. [Testing Strategy](#8-testing-strategy)
9. [Git Workflow](#9-git-workflow)
10. [Important Context for AI Assistants](#10-important-context-for-ai-assistants)

---

## 1. Project Overview

### 1.1 What is VV Education?

VV Education (VV课堂) is an **AI-powered interactive educational platform** that delivers courseware through a custom rendering engine called **VVCE (VV Courseware Engine)**.

**Key Differentiators:**
- **Declarative DSL**: Courses are defined in JSON, not code
- **Interactive Experiences**: Event-driven, stateful courseware
- **AI-Generated Content**: DSL designed to be AI-generatable
- **Multi-Platform**: Mini Program, Web Admin, PC Student App
- **Safe & Predictable**: No arbitrary script execution

### 1.2 Core Philosophy

1. **Engine-First Approach**: VVCE is the foundation; all apps consume it
2. **Declarative Over Imperative**: Describe with data, not code
3. **Safety First**: No `eval()`, all logic in validated JSON
4. **Deterministic**: Same input = same output (crucial for replay/testing)
5. **Debug-Friendly**: Complete logging and replay capabilities

### 1.3 Current Status (M0 Phase)

**Completed:**
- ✅ Monorepo architecture setup
- ✅ VVCE core runtime implementation
- ✅ Enhanced style system (v1.1) with themes and animations
- ✅ Spring Boot backend structure
- ✅ Comprehensive documentation

**In Progress:**
- 🔄 VVCE core unit tests
- 🔄 vvce-components implementation
- 🔄 Backend API development (Course, Progress modules)

**Not Started:**
- ⏳ Frontend apps (miniapp, web-admin, web-student)
- ⏳ AI generation pipeline
- ⏳ Project-based assessment system

---

## 2. Repository Structure

### 2.1 Monorepo Layout

```
vv-education/                    # Root
├── apps/                        # Applications (3)
│   ├── miniapp/                 # WeChat Mini Program (student/parent)
│   ├── web-admin/               # Admin dashboard (React)
│   └── web-student/             # PC student app (M2 phase)
├── packages/                    # Shared packages (5)
│   ├── vvce-core/              # ⭐ Core runtime engine (MOST IMPORTANT)
│   ├── vvce-schema/            # DSL types & JSON Schema validation
│   ├── vvce-components/        # Component library
│   ├── contracts/              # API contracts (OpenAPI, types)
│   └── shared/                 # Common utilities
├── server/                      # Backend
│   └── api/                    # Java Spring Boot REST API
├── tools/                       # Development tools
│   ├── course-factory/         # DSL generation tools (M2)
│   └── vvce-devtools/          # Debug & replay tools
├── docs/                        # Technical specifications
│   └── specs/                  # DSL specs, architecture docs
├── .github/                     # GitHub workflows (if any)
├── pnpm-workspace.yaml          # Workspace definition
├── package.json                 # Root package (scripts, dev deps)
├── tsconfig.json                # Base TypeScript config
├── .eslintrc.json               # ESLint config
├── .prettierrc.json             # Prettier config
└── README.md                    # Main documentation
```

### 2.2 Package Dependencies

```
apps/web-admin, apps/miniapp, apps/web-student
├── @vv-education/vvce-core      (workspace:*)
├── @vv-education/vvce-schema    (workspace:*)
├── @vv-education/vvce-components (workspace:*)
└── @vv-education/contracts      (workspace:*)

@vv-education/vvce-core
└── @vv-education/vvce-schema    (peer dependency)

@vv-education/vvce-components
└── @vv-education/vvce-schema    (peer dependency)
```

### 2.3 Key Files to Know

| File | Purpose |
|------|---------|
| `packages/vvce-core/src/runtime/Runtime.ts` | Main runtime orchestrator |
| `packages/vvce-core/src/store/Store.ts` | Three-layer state management |
| `packages/vvce-core/src/interpreter/TriggerInterpreter.ts` | ECA pattern implementation |
| `packages/vvce-core/src/executor/ActionExecutor.ts` | Action execution (23+ actions) |
| `packages/vvce-schema/src/index.ts` | DSL type definitions |
| `docs/specs/vvce-dsl-v1.md` | Complete DSL specification |
| `server/api/src/main/java/com/vveducation/api/` | Backend entry point |

---

## 3. Technology Stack

### 3.1 Frontend Stack

**Package Management:**
- **pnpm 8.14.0** (REQUIRED - do not use npm/yarn)
- **Node.js >= 18.0.0**

**Build & Tooling:**
- **tsup** - Package bundler (for libraries)
- **Vite** - App bundler (planned for apps)
- **TypeScript 5.3.0** - Strict mode enabled

**Core Libraries:**
- **vvce-core** - Pure TypeScript, zero runtime dependencies
- **vvce-schema** - Ajv 8.12.0 for JSON Schema validation
- **React** (planned) - For web apps
- **WeChat Mini Program** - For miniapp

**Code Quality:**
- **ESLint** with TypeScript plugin
- **Prettier** (single quotes, 90 char width, 2 spaces)
- **Vitest** - Unit testing

### 3.2 Backend Stack (Java)

- **Spring Boot 3.2.0**
- **Java 17+**
- **PostgreSQL 14+** (primary), MySQL 8+ (alternative)
- **Redis 6+** (caching)
- **MyBatis Plus 3.5.5** (ORM)
- **JWT** (authentication)
- **SpringDoc OpenAPI 2.3.0** (API docs)
- **Maven 3.8+** (build)

### 3.3 Configuration Files

| File | Purpose |
|------|---------|
| `pnpm-workspace.yaml` | Defines workspace packages |
| `tsconfig.json` | Base TypeScript config (target: ES2020, strict mode) |
| `.eslintrc.json` | Linting rules (allows `any`, warns on unused vars) |
| `.prettierrc.json` | Code formatting (single quotes, 2 spaces, 90 width) |
| `packages/*/package.json` | Individual package configs |
| `server/api/src/main/resources/application.yml` | Backend config |

---

## 4. Development Workflows

### 4.1 Setup & Installation

```bash
# Install dependencies (MUST use pnpm)
pnpm install

# Build all packages
pnpm build:packages

# Build all apps
pnpm build:apps

# Or build everything
pnpm build
```

### 4.2 Development

```bash
# Start development mode (watches packages and apps)
pnpm dev

# Run tests
pnpm test

# Lint code
pnpm lint

# Type check
pnpm typecheck

# Clean all builds and node_modules
pnpm clean
```

### 4.3 Package-Specific Commands

```bash
# Work on vvce-core
cd packages/vvce-core
pnpm dev          # Watch mode with tsup
pnpm build        # Build to dist/
pnpm test         # Run vitest
pnpm typecheck    # TypeScript check

# Same pattern for other packages
```

### 4.4 Backend Development

```bash
cd server/api

# Build with Maven
mvn clean package

# Run with Spring Boot
mvn spring-boot:run

# Run tests
mvn test
```

### 4.5 Build Output

**Packages** (tsup):
- Dual format: CommonJS (`dist/index.js`) + ESM (`dist/index.mjs`)
- TypeScript declarations: `dist/index.d.ts`
- Source maps included in dev mode

**Apps** (planned with Vite):
- Production build to `dist/`
- Assets optimized and hashed

---

## 5. Code Conventions

### 5.1 Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Packages | `@vv-education/package-name` | `@vv-education/vvce-core` |
| Types/Interfaces | PascalCase | `CourseDSL`, `SceneDSL`, `VVEvent` |
| Classes | PascalCase | `Runtime`, `Store`, `EventBus` |
| Files (classes) | PascalCase | `Runtime.ts`, `ActionExecutor.ts` |
| Files (utilities) | kebab-case | `reference-resolver.ts` |
| Functions/Methods | camelCase | `gotoScene`, `addScore`, `handleEvent` |
| Constants | UPPER_SNAKE_CASE | `MAX_LOGS`, `DEFAULT_THEME` |
| DSL Actions | camelCase | `gotoScene`, `setVar`, `playAnimation` |
| Private fields | `private fieldName` | `private store: Store` |

### 5.2 TypeScript Conventions

**Strict Mode Enabled:**
```typescript
// tsconfig.json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true
}
```

**Type Imports:**
```typescript
// Prefer type-only imports when possible
import type { CourseDSL, SceneDSL } from '../types';
import { VVCERuntime } from './Runtime';
```

**Explicit Return Types:**
```typescript
// Always specify return types for public methods
public loadCourse(dsl: CourseDSL): void {
  // ...
}

public getState(): RuntimeState {
  // ...
}
```

**Interface vs Type:**
- Use `interface` for object shapes that may be extended
- Use `type` for unions, intersections, mapped types

### 5.3 File Structure Conventions

**Class files:**
```typescript
/**
 * ClassName - Brief description
 * Extended description if needed
 */

import type { ... } from '...';
import { ... } from '...';

export interface ClassOptions {
  // ...
}

export class ClassName {
  private field: Type;

  constructor(options: ClassOptions) {
    // ...
  }

  public method(): ReturnType {
    // ...
  }

  private helperMethod(): void {
    // ...
  }
}
```

**Module exports:**
```typescript
// packages/vvce-core/src/index.ts
export { VVCERuntime } from './runtime/Runtime';
export { Store } from './store/Store';
export type { CourseDSL, SceneDSL, VVEvent } from './types';
```

### 5.4 Prettier Formatting

```json
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 90,
  "tabWidth": 2,
  "endOfLine": "lf"
}
```

**Example:**
```typescript
const config: RuntimeOptions = {
  debug: true,
  onSceneChange: (sceneId) => console.log('Scene:', sceneId),
  onStateChange: (state) => saveProgress(state),
};
```

### 5.5 Comments & Documentation

**Use JSDoc for public APIs:**
```typescript
/**
 * Loads a course DSL into the runtime
 *
 * @param dsl - The course DSL object
 * @throws {Error} If DSL is invalid
 */
public loadCourse(dsl: CourseDSL): void {
  // Implementation
}
```

**Use inline comments sparingly:**
```typescript
// Only comment non-obvious logic
// Prefer self-documenting code

// Good: Explains WHY
// Reset state before loading to prevent stale data
this.store.reset();

// Bad: Explains WHAT (code already shows this)
// Set the course to dsl
this.course = dsl;
```

---

## 6. Architecture Deep Dive

### 6.1 VVCE Core Architecture

**The Heart of the System:** `packages/vvce-core`

```
┌─────────────────────────────────────────────────┐
│                  VVCERuntime                    │
│  (Main orchestrator - owns all subsystems)      │
└─────────────────┬───────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
┌──────────────┐    ┌──────────────┐
│    Store     │    │   EventBus   │
│ (3-layer     │    │ (Event       │
│  state)      │    │  dispatch)   │
└──────┬───────┘    └──────┬───────┘
       │                   │
       │     ┌─────────────┘
       │     │
       ▼     ▼
┌──────────────────────────────────┐
│    TriggerInterpreter (ECA)      │
│  ┌────────────┐  ┌─────────────┐ │
│  │ Condition  │  │   Action    │ │
│  │ Evaluator  │  │  Executor   │ │
│  └────────────┘  └─────────────┘ │
└──────────────┬───────────────────┘
               │
               ▼
       ┌──────────────┐
       │    Logger    │
       │ (Debug/      │
       │  Replay)     │
       └──────────────┘
```

### 6.2 Three-Layer State Management

**Store Architecture:**

```typescript
RuntimeState {
  globals: {
    vars: {                    // Cross-scene state
      score: number,
      attempt: number,
      nickname: string,
      // ... any custom vars
    }
  },
  scene: {
    current: string,           // Current scene ID
    vars: {                    // Current scene temporary vars
      temp: any,
      // ... scene-specific
    }
  },
  nodes: {                     // Component states
    q1: {
      state: {
        selected: string,      // QuizSingle selection
      }
    },
    input1: {
      state: {
        value: string,         // Input value
      }
    }
  }
}
```

**Access Patterns:**
```typescript
// Reference format in DSL
{ "ref": "globals.vars.score" }        // Global variable
{ "ref": "scene.vars.temp" }           // Scene variable
{ "ref": "q1.state.selected" }         // Node state

// Runtime access (internal)
this.store.get('globals.vars.score');
this.store.set('globals.vars.score', 100);
```

### 6.3 Event-Condition-Action (ECA) Pattern

**The Core Interaction Model:**

```typescript
// In DSL
{
  "triggers": [
    {
      "on": {                          // EVENT
        "event": "click",
        "target": "submitButton"
      },
      "if": [                          // CONDITION
        {
          "op": "equals",
          "left": { "ref": "q1.state.selected" },
          "right": "correctAnswer"
        }
      ],
      "then": [                        // ACTION (if true)
        { "action": "addScore", "value": 10 },
        { "action": "gotoScene", "sceneId": "nextScene" }
      ],
      "else": [                        // ACTION (if false)
        { "action": "toast", "text": "Try again!" }
      ]
    }
  ]
}
```

**Flow:**
1. EventBus receives event (from component or system)
2. TriggerInterpreter finds matching triggers
3. ConditionEvaluator evaluates `if` conditions using ReferenceResolver
4. ActionExecutor runs `then` or `else` actions
5. Logger records everything

### 6.4 DSL Structure

**Top-Level Course DSL:**

```typescript
interface CourseDSL {
  schema: 'vvce.dsl.v1';              // DSL version
  meta: {
    id: string;                        // Course ID
    version: string;                   // Course version
    title?: string;
    author?: string;
  };
  globals?: {
    vars?: Record<string, any>;        // Initial global state
  };
  resources?: {                        // v1.1 additions
    styles?: StyleVariables;
    animations?: CustomAnimation[];
    transitions?: CustomTransition[];
    classes?: Record<string, CSSProperties>;
    theme?: ThemeName;
  };
  startSceneId: string;                // Entry point
  scenes: SceneDSL[];                  // Scene list
}
```

**Scene DSL:**

```typescript
interface SceneDSL {
  id: string;                          // Unique scene ID
  layout?: LayoutConfig;               // Stack/Grid layout
  vars?: Record<string, any>;          // Scene-local vars
  nodes: NodeDSL[];                    // UI components
  triggers: Trigger[];                 // Event handlers
  onEnter?: Action[];                  // Run on scene entry
  onExit?: Action[];                   // Run on scene exit
  transition?: TransitionConfig;       // Scene transition effect
}
```

### 6.5 Component System

**M0 Components (Basic 3):**

1. **Dialog** - Text display
   ```typescript
   {
     id: 'd1',
     type: 'Dialog',
     props: {
       text: 'Welcome! Your score: {{globals.vars.score}}',
       speaker?: string,
       avatar?: string
     }
   }
   ```

2. **QuizSingle** - Single choice quiz
   ```typescript
   {
     id: 'q1',
     type: 'QuizSingle',
     props: {
       question: 'What is 1+1?',
       options: ['1', '2', '3'],
       answerKey: '2'
     },
     state: {
       selected: string | null
     },
     events: ['change']
   }
   ```

3. **Button** - Interactive button
   ```typescript
   {
     id: 'b1',
     type: 'Button',
     props: {
       text: 'Submit'
     },
     events: ['click']
   }
   ```

### 6.6 Action System (23 Actions)

**Categories:**

| Category | Actions | Description |
|----------|---------|-------------|
| **Flow** | `gotoScene`, `parallel`, `sequence`, `delay` | Control flow |
| **State** | `setVar`, `incVar`, `addScore`, `resetNode` | State manipulation |
| **UI** | `toast`, `modal`, `showNode`, `hideNode` | User feedback |
| **Animation** | `playAnimation`, `stopAnimation` | Animations |
| **Style** | `setStyle`, `addClass`, `removeClass`, `setTheme` | Styling |
| **Media** | `sound`, `haptic` | Media playback |

**Example:**
```typescript
// Flow control
{ "action": "gotoScene", "sceneId": "scene2" }
{ "action": "delay", "ms": 1000 }

// State manipulation
{ "action": "setVar", "path": "globals.vars.score", "value": 100 }
{ "action": "incVar", "path": "globals.vars.attempt", "by": 1 }
{ "action": "addScore", "value": 10 }

// UI feedback
{ "action": "toast", "text": "Correct!" }
{ "action": "modal", "text": "Error occurred", "type": "error" }
```

### 6.7 Style System (v1.1)

**New in v1.1:** Enhanced styling capabilities

**Theme System:**
- 9 built-in themes: default, playful, academic, minimal, vibrant, dark, nature, tech, retro
- Custom theme support
- Design tokens (colors, spacing, fonts, shadows)

**Animation System:**
- 30+ built-in animations (fadeIn, bounceIn, shake, pulse, etc.)
- Custom keyframe animations
- Animation sequences and parallel animations

**Transition System:**
- 16 scene transitions (fade, slide, cube, carousel, etc.)
- Customizable durations and easing

### 6.8 Backend Architecture (Spring Boot)

**Domain Modules:**

```
server/api/src/main/java/com/vveducation/api/
├── course/              # Course management
│   ├── controller/
│   ├── service/
│   ├── repository/
│   └── domain/
├── progress/            # Learning progress
│   ├── controller/
│   ├── service/
│   ├── repository/
│   └── domain/
├── identity/            # User authentication
├── assessment/          # (M2+) Assessment & rubrics
├── project/             # (M3+) Project-based learning
└── common/              # Shared utilities
```

**Key APIs (M0):**
- `GET /api/v1/courses/{id}` - Fetch course DSL
- `GET /api/v1/courses/{id}/resources` - Fetch assets
- `POST /api/v1/progress` - Save progress
- `GET /api/v1/progress/{userId}/{courseId}` - Load progress

---

## 7. Common Tasks

### 7.1 Adding a New Action

**Steps:**

1. **Define the action type in schema:**
   ```typescript
   // packages/vvce-schema/src/actions.ts
   export interface MyCustomAction {
     action: 'myCustomAction';
     param1: string;
     param2?: number;
   }

   // Add to ActionDSL union
   export type ActionDSL =
     | GotoSceneAction
     | MyCustomAction
     | ...;
   ```

2. **Implement in ActionExecutor:**
   ```typescript
   // packages/vvce-core/src/executor/ActionExecutor.ts
   private executeAction(action: ActionDSL): void {
     switch (action.action) {
       case 'myCustomAction':
         this.handleMyCustomAction(action);
         break;
       // ...
     }
   }

   private handleMyCustomAction(action: MyCustomAction): void {
     const { param1, param2 = 0 } = action;
     // Implementation
     this.logger.info('action', `MyCustomAction: ${param1}`);
   }
   ```

3. **Add tests:**
   ```typescript
   // packages/vvce-core/src/executor/ActionExecutor.test.ts
   describe('myCustomAction', () => {
     it('should execute custom action', () => {
       // Test implementation
     });
   });
   ```

4. **Update documentation:**
   - Add to `docs/specs/vvce-dsl-v1.md`
   - Add example to README

### 7.2 Adding a New Component

**Steps:**

1. **Define component schema:**
   ```typescript
   // packages/vvce-schema/src/components.ts
   export interface MyComponentProps {
     label: string;
     value?: string;
   }

   export interface MyComponentState {
     isActive: boolean;
   }

   export interface MyComponentNode {
     id: string;
     type: 'MyComponent';
     props: MyComponentProps;
     state?: MyComponentState;
   }
   ```

2. **Implement in vvce-components:**
   ```typescript
   // packages/vvce-components/src/MyComponent.tsx
   import React from 'react';
   import type { MyComponentProps } from '@vv-education/vvce-schema';

   export const MyComponent: React.FC<MyComponentProps> = ({ label, value }) => {
     // Implementation
   };
   ```

3. **Register component:**
   ```typescript
   // packages/vvce-components/src/index.ts
   export { MyComponent } from './MyComponent';
   ```

4. **Add to component registry:**
   - Update component documentation
   - Add examples

### 7.3 Working on VVCE Core

**Typical workflow:**

```bash
# 1. Navigate to package
cd packages/vvce-core

# 2. Start watch mode
pnpm dev

# 3. In another terminal, run tests
pnpm test --watch

# 4. Make changes to src/
# 5. Tests auto-run, build auto-updates

# 6. Before committing:
pnpm typecheck
pnpm lint
```

**Key files to modify:**
- `src/runtime/Runtime.ts` - Main orchestrator
- `src/executor/ActionExecutor.ts` - Adding actions
- `src/interpreter/TriggerInterpreter.ts` - Trigger logic
- `src/store/Store.ts` - State management
- `src/types/index.ts` - Type definitions

### 7.4 Backend Development

**Adding a new API endpoint:**

1. **Define domain entity:**
   ```java
   // server/api/src/main/java/com/vveducation/api/course/domain/Course.java
   @Entity
   @Table(name = "courses")
   public class Course {
       @Id
       private String id;

       @Column(nullable = false)
       private String title;

       @Column(columnDefinition = "json")
       private String dslContent;

       // Getters, setters, etc.
   }
   ```

2. **Create repository:**
   ```java
   // ...repository/CourseRepository.java
   public interface CourseRepository extends JpaRepository<Course, String> {
       List<Course> findByPublishedTrue();
   }
   ```

3. **Implement service:**
   ```java
   // ...service/CourseService.java
   @Service
   public class CourseService {
       @Autowired
       private CourseRepository courseRepository;

       public Course getCourseById(String id) {
           return courseRepository.findById(id)
               .orElseThrow(() -> new CourseNotFoundException(id));
       }
   }
   ```

4. **Create controller:**
   ```java
   // ...controller/CourseController.java
   @RestController
   @RequestMapping("/api/v1/courses")
   public class CourseController {
       @Autowired
       private CourseService courseService;

       @GetMapping("/{id}")
       public ResponseEntity<Course> getCourse(@PathVariable String id) {
           return ResponseEntity.ok(courseService.getCourseById(id));
       }
   }
   ```

### 7.5 Debugging Tips

**Frontend Debugging:**

```typescript
// Enable debug mode
const runtime = new VVCERuntime({
  debug: true,  // Enables verbose logging
});

// Access logs
const logs = runtime.getLogs();
console.table(logs);

// Inspect state
const state = runtime.getState();
console.log('Global vars:', state.globals.vars);
console.log('Scene vars:', state.scene.vars);
console.log('Nodes:', state.nodes);
```

**Backend Debugging:**

```yaml
# application-dev.yml
logging:
  level:
    com.vveducation.api: DEBUG
    org.springframework.web: DEBUG
```

**Common Issues:**

| Issue | Solution |
|-------|----------|
| Reference not found | Check path spelling, ensure node exists |
| Trigger not firing | Verify event type and target match |
| State not updating | Check action path, verify store.set() called |
| Build fails | Run `pnpm clean` then `pnpm install` |

---

## 8. Testing Strategy

### 8.1 Frontend Testing (Vitest)

**Test Structure:**

```typescript
// packages/vvce-core/src/store/Store.test.ts
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

  it('should handle nested paths', () => {
    store.set('node.q1.state.selected', 'option2');
    expect(store.get('node.q1.state.selected')).toBe('option2');
  });
});
```

**Testing Guidelines:**

- **Unit tests**: Test individual classes/functions in isolation
- **Integration tests**: Test subsystems together (e.g., Runtime + Store + EventBus)
- **Coverage target**: >80% for vvce-core
- **Test naming**: `should [expected behavior] when [condition]`

**Run tests:**
```bash
# All tests
pnpm test

# Watch mode
pnpm test --watch

# Coverage
pnpm test --coverage

# Specific file
pnpm test Store.test.ts
```

### 8.2 Backend Testing (JUnit)

```java
@SpringBootTest
class CourseServiceTest {

    @Autowired
    private CourseService courseService;

    @Test
    void shouldReturnCourseById() {
        String courseId = "test-course-001";
        Course course = courseService.getCourseById(courseId);

        assertNotNull(course);
        assertEquals(courseId, course.getId());
    }

    @Test
    void shouldThrowExceptionWhenCourseNotFound() {
        assertThrows(CourseNotFoundException.class, () -> {
            courseService.getCourseById("nonexistent");
        });
    }
}
```

### 8.3 E2E Testing (Future)

- **Playwright** for web apps
- **WeChat DevTools** for miniapp
- Test complete user flows

---

## 9. Git Workflow

### 9.1 Branch Naming

**Convention:**
- Feature: `feature/description`
- Bug fix: `fix/description`
- Docs: `docs/description`
- Refactor: `refactor/description`

**Examples:**
- `feature/add-quiz-multiple-component`
- `fix/reference-resolver-null-check`
- `docs/update-api-documentation`

### 9.2 Commit Messages

**Format:**
```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, missing semicolons, etc.
- `refactor`: Code restructuring
- `test`: Adding tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(vvce-core): add playAnimation action support

Implemented AnimationEngine to handle CSS animations
and keyframe definitions in DSL.

Closes #42

---

fix(store): handle undefined in nested path resolution

Previously would throw when intermediate path didn't exist.
Now returns undefined gracefully.

---

docs(vvce-schema): update action types documentation
```

### 9.3 Pull Request Process

1. **Create feature branch** from `main`
2. **Make changes** with clear commits
3. **Run tests** and ensure they pass
4. **Update documentation** if needed
5. **Create PR** with description:
   - What changed?
   - Why was this needed?
   - How was it tested?
6. **Wait for review** (if working in team)
7. **Merge** using squash or merge commit

### 9.4 Pre-commit Checklist

- [ ] Code builds without errors (`pnpm build`)
- [ ] Tests pass (`pnpm test`)
- [ ] No linting errors (`pnpm lint`)
- [ ] Type checking passes (`pnpm typecheck`)
- [ ] Documentation updated
- [ ] Commit messages follow convention

---

## 10. Important Context for AI Assistants

### 10.1 Critical Design Decisions

**🚨 DO NOT violate these principles:**

1. **No arbitrary JavaScript execution in DSL**
   - DSL must be pure JSON
   - No `eval()`, no function strings
   - All logic via declarative actions/conditions

2. **Deterministic behavior**
   - Same DSL + same state = same result
   - Essential for testing and replay

3. **Type safety everywhere**
   - Use TypeScript strict mode
   - No `any` without good reason
   - Prefer explicit types over inference

4. **Three-layer state separation**
   - Globals, Scene, Nodes - keep them separate
   - Don't mix concerns

5. **Complete logging**
   - Every event, condition, action must be logged
   - Logging is not optional - it's for replay/debug

### 10.2 Architecture Constraints

**What NOT to do:**

- ❌ Don't add new dependencies without careful consideration
- ❌ Don't bypass the Store for state management
- ❌ Don't emit events directly - use EventBus
- ❌ Don't execute actions directly - use ActionExecutor
- ❌ Don't mutate state - use Store.set()
- ❌ Don't create circular dependencies between packages
- ❌ Don't use frontend frameworks in vvce-core (keep it pure)

**What TO do:**

- ✅ Keep vvce-core framework-agnostic
- ✅ Use workspace:* for internal dependencies
- ✅ Export types separately from implementations
- ✅ Write comprehensive tests for core logic
- ✅ Document public APIs with JSDoc
- ✅ Log all significant operations

### 10.3 Common Pitfalls

**Pitfall 1: Forgetting to resolve references**
```typescript
// ❌ Wrong
const value = condition.left; // Might be { ref: "globals.vars.score" }

// ✅ Correct
const value = this.resolver.resolve(condition.left);
```

**Pitfall 2: Direct state mutation**
```typescript
// ❌ Wrong
this.state.globals.vars.score = 100;

// ✅ Correct
this.store.set('globals.vars.score', 100);
```

**Pitfall 3: Forgetting to log**
```typescript
// ❌ Wrong
this.gotoScene(sceneId);

// ✅ Correct
this.logger.info('scene', `Navigating to scene: ${sceneId}`);
this.gotoScene(sceneId);
```

**Pitfall 4: Using npm instead of pnpm**
```bash
# ❌ Wrong
npm install

# ✅ Correct
pnpm install
```

### 10.4 When to Ask for Clarification

**Ask the user when:**

1. **Unclear requirements**: Not sure what action/component should do
2. **Breaking changes**: Change would break existing DSL
3. **New dependencies**: Need to add external package
4. **Architecture changes**: Modifying core patterns
5. **API design**: Creating new public APIs
6. **Performance concerns**: Change might impact performance

**Don't ask when:**

1. Following established patterns
2. Fixing obvious bugs
3. Adding tests
4. Updating documentation
5. Code formatting/linting

### 10.5 Priority Order for Tasks

When multiple tasks are possible, prioritize:

1. **Critical bugs** - Blocking functionality
2. **Core engine work** - VVCE core is the foundation
3. **Testing** - Especially for vvce-core
4. **Documentation** - Keep docs in sync with code
5. **New features** - After solid foundation
6. **Optimizations** - Only after correctness

### 10.6 Code Review Checklist

Before marking work complete, verify:

- [ ] **Functionality**: Does it work as intended?
- [ ] **Tests**: Are there tests? Do they pass?
- [ ] **Types**: Is everything properly typed?
- [ ] **Logging**: Are operations logged?
- [ ] **Error handling**: Are errors handled gracefully?
- [ ] **Documentation**: Is it documented?
- [ ] **Backwards compatibility**: Does it break existing DSL?
- [ ] **Performance**: Any obvious performance issues?
- [ ] **Security**: Any security concerns?

### 10.7 Helpful Resources

**Internal Documentation:**
- `README.md` - Project overview
- `docs/specs/vvce-dsl-v1.md` - Complete DSL specification
- `packages/vvce-core/README.md` - Core engine documentation
- `ROADMAP.md` - Development roadmap

**External Resources:**
- TypeScript Handbook: https://www.typescriptlang.org/docs/
- Vitest Documentation: https://vitest.dev/
- Spring Boot Docs: https://spring.io/projects/spring-boot
- pnpm Documentation: https://pnpm.io/

---

## Appendix: Quick Reference

### Package Scripts

```bash
# Root level
pnpm dev              # Start all packages + apps in watch mode
pnpm build            # Build packages then apps
pnpm test             # Run all tests
pnpm lint             # Lint all code
pnpm typecheck        # Type check everything
pnpm clean            # Remove all node_modules and dist

# Package level (cd packages/vvce-core)
pnpm dev              # Watch mode
pnpm build            # Build package
pnpm test             # Run tests
pnpm test --watch     # Watch mode tests
pnpm typecheck        # Type check
```

### Important Paths

| Path | Description |
|------|-------------|
| `packages/vvce-core/src/` | Core engine source |
| `packages/vvce-schema/src/` | DSL types and validation |
| `packages/vvce-components/src/` | Component implementations |
| `server/api/src/main/java/` | Backend source |
| `docs/specs/` | Technical specifications |

### Key Type Definitions

```typescript
// State access paths
type GlobalPath = `globals.vars.${string}`;
type ScenePath = `scene.vars.${string}`;
type NodePath = `${string}.state.${string}`;

// Event types
type EventType = 'click' | 'change' | 'submit' | 'sceneEnter' | 'sceneExit';

// Action types (23 total)
type ActionType =
  | 'gotoScene' | 'parallel' | 'sequence' | 'delay'
  | 'setVar' | 'incVar' | 'addScore' | 'resetNode'
  | 'toast' | 'modal' | 'showNode' | 'hideNode'
  | 'playAnimation' | 'stopAnimation'
  | 'setStyle' | 'addClass' | 'removeClass' | 'setTheme'
  | 'sound' | 'haptic';

// Condition operators
type ConditionOp =
  | 'equals' | 'notEquals'
  | 'gt' | 'gte' | 'lt' | 'lte'
  | 'and' | 'or' | 'not';
```

---

## Final Notes

**This is a living document.** As the codebase evolves, this file should be updated to reflect:

- New architectural decisions
- Additional components/actions
- Updated workflows
- Lessons learned

**When in doubt:**
1. Check this document
2. Check inline code comments
3. Check `/docs/specs/`
4. Ask the user

**Remember:** The goal is to build a safe, predictable, AI-generatable courseware engine. Every decision should support that goal.

---

**Document Version:** 1.0
**Last Updated:** 2026-01-10
**Maintained By:** VV Education Team
