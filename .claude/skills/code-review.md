# Code Review Skill

> 自动化代码审查，确保代码质量

## 触发时机

当用户提及以下内容时触发：
- "代码审查"、"code review"、"CR"
- "审查这段代码"、"检查代码"
- "这样写对吗"

## 审查维度

### 1. 代码规范

**命名规范：**
- 变量/函数: camelCase
- 类/接口: PascalCase
- 常量: UPPER_SNAKE_CASE
- 文件: PascalCase (类) 或 kebab-case (工具)

**格式规范：**
- 单引号
- 2 空格缩进
- 90 字符行宽
- 分号结尾

### 2. TypeScript 最佳实践

**类型安全：**
```typescript
// ❌ 避免
const data: any = fetchData();

// ✅ 推荐
const data: CourseDSL = fetchData();
```

**严格空检查：**
```typescript
// ❌ 避免
function process(value: string | null) {
  return value.length; // 可能为 null
}

// ✅ 推荐
function process(value: string | null) {
  if (!value) return 0;
  return value.length;
}
```

**类型导入：**
```typescript
// ✅ 推荐
import type { CourseDSL } from './types';
```

### 3. 架构一致性

**VVCE 核心原则检查：**
- [ ] 不使用 eval() 或动态代码执行
- [ ] 状态通过 Store 管理
- [ ] 事件通过 EventBus 分发
- [ ] 动作通过 ActionExecutor 执行
- [ ] 所有操作有日志记录

### 4. 安全性

**检查项：**
- [ ] 无硬编码敏感信息
- [ ] 用户输入验证
- [ ] 防止 XSS 攻击
- [ ] 防止注入攻击

### 5. 性能

**检查项：**
- [ ] 避免不必要的重渲染
- [ ] 避免大循环中的 DOM 操作
- [ ] 适当使用缓存
- [ ] 避免内存泄漏

### 6. 可维护性

**检查项：**
- [ ] 函数职责单一
- [ ] 适当的注释和文档
- [ ] 避免魔法数字
- [ ] 代码可读性

## 输出格式

```
=== Code Review Report ===

📁 文件: packages/vvce-core/src/runtime/Runtime.ts
📊 更改: +45 -12

🔴 严重问题 (1):
   Line 42: 使用 any 类型，失去类型安全
   ```typescript
   const result: any = this.executor.execute(action);
   ```
   建议: 定义明确的返回类型
   ```typescript
   const result: ActionResult = this.executor.execute(action);
   ```

⚠️ 警告 (2):
   Line 78: 未处理 null 情况
   Line 123: 魔法数字 1000，建议提取为常量

💡 建议 (3):
   Line 15: 考虑使用 type-only import
   Line 56: 函数过长 (45 行)，建议拆分
   Line 89: 变量名 `d` 不够描述性

✅ 优点:
   - 良好的错误处理
   - 完整的日志记录
   - 清晰的方法命名

📊 总结:
   严重: 1 | 警告: 2 | 建议: 3

   总体评价: 需要小改进后可合并
```

## 常见问题模板

### 类型问题

```markdown
🔴 **类型安全问题**

位置: `file.ts:42`

问题代码:
```typescript
const data: any = ...
```

建议修复:
```typescript
const data: SpecificType = ...
```

原因: 使用 any 会绕过 TypeScript 类型检查，可能导致运行时错误。
```

### 架构问题

```markdown
🔴 **架构违规**

位置: `Runtime.ts:78`

问题代码:
```typescript
this.state.score = 100; // 直接修改状态
```

建议修复:
```typescript
this.store.set('globals.vars.score', 100);
```

原因: 根据 VVCE 架构，所有状态变更必须通过 Store，以确保可追踪和可回放。
```

### 性能问题

```markdown
⚠️ **性能警告**

位置: `NodeRenderer.tsx:56`

问题代码:
```typescript
nodes.map(node => {
  const style = computeStyle(node); // 每次渲染都计算
  return <Node style={style} />;
});
```

建议修复:
```typescript
const nodeStyles = useMemo(
  () => nodes.map(node => computeStyle(node)),
  [nodes]
);
```

原因: 避免不必要的重复计算，提升渲染性能。
```

## 自动修复

部分问题可以自动修复：

```bash
# 格式问题
pnpm prettier --write file.ts

# Lint 问题
pnpm eslint --fix file.ts
```

## 审查清单

在合并前确认：

- [ ] 代码符合项目规范
- [ ] 所有严重问题已修复
- [ ] 警告已评估（修复或忽略并说明原因）
- [ ] 测试覆盖新增代码
- [ ] 文档已更新（如需要）

## 注意事项

- 审查应该建设性，不要针对人
- 提供具体的修复建议
- 考虑代码的上下文
- 区分必须修改和建议修改
