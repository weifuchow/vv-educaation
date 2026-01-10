# @vv-education/vvce-schema

VVCE DSL 定义和校验器

## 功能概述

`vvce-schema` 模块提供 VVCE 课件 DSL 的 JSON Schema 定义、校验器和类型定义，确保课件内容的规范性和正确性。

## 核心能力

### 1. DSL Schema 定义

提供完整的 JSON Schema 定义：

- **课程结构（Course）**：顶层结构、元数据、全局变量
- **场景结构（Scene）**：布局、节点、变量、触发器
- **节点定义（Node）**：组件类型、属性、状态
- **触发器定义（Trigger）**：事件、条件、动作
- **条件表达式（Condition）**：操作符、引用
- **动作定义（Action）**：动作类型、参数

### 2. 校验器（Validator）

多层次校验机制：

- **结构校验**：基于 JSON Schema 的格式校验
- **语义校验**：
  - ID 唯一性检查
  - 引用存在性检查（场景引用、节点引用）
  - 必填字段检查
  - 类型一致性检查
- **最佳实践检查**：
  - 死循环检测
  - 未使用场景检测
  - 过深嵌套检测

### 3. Dry Run 模拟器

在不实际执行的情况下模拟课件流程：

- 场景图遍历
- 路径可达性分析
- 潜在错误预警

### 4. TypeScript 类型定义

提供完整的 TypeScript 类型支持：

- DSL 所有结构的类型定义
- 类型安全的 DSL 构建
- IDE 智能提示

## 目录结构

```
vvce-schema/
├── schemas/            # JSON Schema 定义
│   ├── course.json     # 课程 Schema
│   ├── scene.json      # 场景 Schema
│   ├── node.json       # 节点 Schema
│   ├── trigger.json    # 触发器 Schema
│   ├── condition.json  # 条件 Schema
│   └── action.json     # 动作 Schema
├── src/
│   ├── types/          # TypeScript 类型定义
│   │   └── dsl.ts      # DSL 类型
│   ├── validator/      # 校验器
│   │   ├── Validator.ts        # 主校验器
│   │   ├── StructureValidator.ts  # 结构校验
│   │   └── SemanticValidator.ts   # 语义校验
│   ├── dry-run/        # Dry Run 模拟器
│   │   └── DryRunner.ts
│   └── index.ts        # 模块入口
└── examples/           # DSL 示例
    └── demo-lesson.json
```

## 使用示例

### 基础校验

```typescript
import { validateCourse, ValidationResult } from '@vv-education/vvce-schema';

const dsl = {
  schema: 'vvce.dsl.v1',
  meta: { id: 'demo-001', version: '0.1.0' },
  startSceneId: 's1',
  scenes: [
    // ...
  ],
};

const result: ValidationResult = validateCourse(dsl);

if (result.valid) {
  console.log('课程 DSL 校验通过');
} else {
  console.error('校验失败：', result.errors);
}
```

### Dry Run 模拟

```typescript
import { dryRun } from '@vv-education/vvce-schema';

const report = dryRun(dsl);

console.log('可达场景：', report.reachableScenes);
console.log('死场景：', report.deadScenes);
console.log('潜在问题：', report.warnings);
```

### TypeScript 类型使用

```typescript
import type { CourseDSL, SceneDSL, Trigger } from '@vv-education/vvce-schema';

const course: CourseDSL = {
  schema: 'vvce.dsl.v1',
  meta: {
    id: 'my-course',
    version: '1.0.0',
  },
  startSceneId: 's1',
  scenes: [],
};
```

## API 文档

### validateCourse(dsl)

校验完整的课程 DSL。

**参数：**
- `dsl: any` - 课程 DSL 对象

**返回：**
```typescript
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}
```

### validateScene(scene)

校验单个场景定义。

### dryRun(dsl, options?)

执行 Dry Run 模拟。

**返回：**
```typescript
interface DryRunReport {
  reachableScenes: string[];
  deadScenes: string[];
  warnings: string[];
  sceneGraph: Record<string, string[]>;
}
```

## DSL 规范（M0 版本）

### 课程结构

```json
{
  "schema": "vvce.dsl.v1",
  "meta": {
    "id": "course-id",
    "version": "0.1.0",
    "title": "课程标题",
    "description": "课程描述"
  },
  "globals": {
    "vars": {
      "score": 0,
      "attempt": 0
    }
  },
  "startSceneId": "s1",
  "scenes": []
}
```

### 场景结构

```json
{
  "id": "s1",
  "layout": {
    "type": "stack",
    "padding": 16,
    "gap": 12
  },
  "vars": {
    "localVar": "value"
  },
  "nodes": [],
  "triggers": []
}
```

### 节点定义

```json
{
  "id": "node-id",
  "type": "ComponentType",
  "props": {
    "key": "value"
  }
}
```

### 触发器定义

```json
{
  "on": {
    "event": "click",
    "target": "button-id"
  },
  "if": [
    {
      "op": "equals",
      "left": { "ref": "q1.state.selected" },
      "right": "2"
    }
  ],
  "then": [
    { "action": "addScore", "value": 10 },
    { "action": "gotoScene", "sceneId": "s2" }
  ],
  "else": [
    { "action": "toast", "text": "再试一次" }
  ]
}
```

## 校验规则

### 结构层面

- ✅ 必须有 `schema` 字段且值为 `vvce.dsl.v1`
- ✅ 必须有 `meta.id` 和 `meta.version`
- ✅ 必须有 `startSceneId` 且对应场景存在
- ✅ 所有场景必须有唯一的 `id`
- ✅ 所有节点必须有唯一的 `id`（在场景内）

### 语义层面

- ✅ 场景引用必须存在（gotoScene 中的 sceneId）
- ✅ 节点引用必须存在（触发器中的 target）
- ✅ 引用路径必须合法（ref 中的路径）
- ✅ 条件操作符必须合法
- ✅ 动作类型必须合法

### 最佳实践

- ⚠️ 检测可能的死循环
- ⚠️ 检测未使用的场景
- ⚠️ 检测过深的场景嵌套（> 20 层）

## 开发计划

### M0 阶段（当前）

- [x] 基础架构搭建
- [ ] JSON Schema 定义
- [ ] TypeScript 类型定义
- [ ] 基础结构校验器
- [ ] 语义校验器
- [ ] Dry Run 模拟器
- [ ] 单元测试

### M1 阶段

- [ ] 更严格的类型校验
- [ ] 自定义校验规则插件
- [ ] DSL 迁移工具（版本升级）
- [ ] 可视化校验报告

### M2 阶段

- [ ] 实时校验（IDE 集成）
- [ ] 自动修复建议
- [ ] 性能优化（大型课件）

## 许可证

MIT
