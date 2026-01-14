# DSL Validate Skill

> 验证 VVCE DSL 文件的正确性和最佳实践

## 触发时机

当用户提及以下内容时触发：
- "验证 DSL"、"检查 DSL"、"DSL 校验"
- "课件检查"、"courseware validate"
- 打开或编辑 `.json` 课件文件
- "这个 DSL 对不对"

## 验证级别

### Level 1: Schema 验证（语法）

验证 DSL 结构是否符合 JSON Schema：

```typescript
import { validateCourseDSL } from '@vv-education/vvce-schema';

const result = validateCourseDSL(dsl);
if (!result.valid) {
  console.error(result.errors);
}
```

**检查项：**
- [ ] JSON 语法正确
- [ ] 必需字段存在（schema, meta, startSceneId, scenes）
- [ ] 字段类型正确
- [ ] 枚举值有效

### Level 2: 语义验证（引用完整性）

**场景引用验证：**
```typescript
// 检查 startSceneId 存在
// 检查 gotoScene 目标存在
// 检查 trigger 中的场景引用
```

**节点引用验证：**
```typescript
// 检查 trigger.on.target 对应节点存在
// 检查 ref 路径有效
// 检查 action 目标节点存在
```

**变量引用验证：**
```typescript
// 检查 globals.vars 中的变量被使用
// 检查 scene.vars 中的变量被使用
// 检查 ref 引用的变量存在
```

### Level 3: 静态分析（Lint）

**死代码检测：**
- 不可达的场景
- 未使用的变量
- 永不触发的 trigger

**最佳实践检查：**
- 场景过多警告（> 50）
- 节点 ID 命名规范
- 缺少 onEnter/onExit 处理
- 复杂条件警告

**性能提示：**
- 动画过多警告
- 嵌套过深警告
- 状态更新频率警告

### Level 4: Dry Run 模拟

模拟课程执行：
```typescript
import { DryRunner } from '@vv-education/vvce-schema';

const runner = new DryRunner(dsl);
const report = runner.analyze();

console.log('可达场景:', report.reachableScenes);
console.log('执行路径:', report.executionPaths);
console.log('潜在问题:', report.warnings);
```

## 输出格式

### 验证通过

```
=== DSL Validation Report ===

📁 文件: course-intro.json
📊 统计:
   - 场景数: 5
   - 节点数: 23
   - 触发器: 15
   - 动作: 42

✅ Schema 验证: 通过
✅ 语义验证: 通过
✅ Lint 检查: 通过
✅ Dry Run: 所有场景可达

🎉 DSL 验证通过，无问题！
```

### 验证失败

```
=== DSL Validation Report ===

📁 文件: course-intro.json

❌ Schema 验证失败:
   1. /scenes/0/nodes/2: 缺少必需字段 "type"
   2. /scenes/1/triggers/0/on/event: 无效值 "clck" (应为 "click")

⚠️ 语义警告:
   1. 场景 "bonus" 不可达 (无 gotoScene 指向它)
   2. 变量 "globals.vars.temp" 声明但未使用
   3. 节点 "btn1" 被引用但不存在于场景 "scene2"

💡 Lint 建议:
   1. 考虑将场景 "scene3", "scene4", "scene5" 合并 (内容相似)
   2. 触发器条件过于复杂，建议简化 (/scenes/2/triggers/0/if)

📊 统计:
   - 错误: 2
   - 警告: 3
   - 建议: 2

请修复上述问题后重新验证。
```

## 常见错误及修复

### 1. 场景引用错误

```json
// ❌ 错误
{ "action": "gotoScene", "sceneId": "scene_2" }

// ✅ 修复 (假设实际场景 ID 是 "scene2")
{ "action": "gotoScene", "sceneId": "scene2" }
```

### 2. 节点引用错误

```json
// ❌ 错误
{ "on": { "event": "click", "target": "submitBtn" } }
// 但场景中节点 ID 是 "submit_btn"

// ✅ 修复
{ "on": { "event": "click", "target": "submit_btn" } }
```

### 3. 变量路径错误

```json
// ❌ 错误
{ "ref": "global.vars.score" }

// ✅ 修复 (应该是 globals)
{ "ref": "globals.vars.score" }
```

### 4. 条件运算符错误

```json
// ❌ 错误
{ "op": "equal", "left": {...}, "right": {...} }

// ✅ 修复 (应该是 equals)
{ "op": "equals", "left": {...}, "right": {...} }
```

## 集成到编辑器

### VSCode 集成

提供 JSON Schema 用于编辑器验证：
```json
{
  "$schema": "./node_modules/@vv-education/vvce-schema/dist/course.schema.json"
}
```

### 命令行工具

```bash
# 验证单个文件
pnpm vvce validate course.json

# 验证目录下所有课件
pnpm vvce validate ./courses/

# 生成详细报告
pnpm vvce validate course.json --report
```

## 自动修复

某些问题可以自动修复：

```bash
pnpm vvce validate course.json --fix
```

可自动修复的问题：
- 缺少的默认值
- ID 格式标准化
- 未使用变量移除
- JSON 格式化

## 验证 API

```typescript
import {
  validateSchema,
  validateSemantics,
  lintDSL,
  dryRun
} from '@vv-education/vvce-schema';

// 完整验证
const result = await validateDSL(dsl, {
  level: 'all', // 'schema' | 'semantics' | 'lint' | 'all'
  autoFix: false,
  strict: true
});

// 结果结构
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: Suggestion[];
  stats: DSLStats;
  fixedDSL?: CourseDSL; // 如果 autoFix=true
}
```

## 注意事项

- 始终先进行 Schema 验证
- 语义验证依赖 Schema 验证通过
- Dry Run 可能耗时较长，可选执行
- 自动修复不会删除内容，只会规范化
