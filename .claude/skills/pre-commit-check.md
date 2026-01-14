# Pre-Commit Check Skill

> 在提交代码前执行全面的 CI 检查，确保代码质量

## 触发时机

当用户提及以下内容时触发：
- "提交代码"、"commit"、"提交前检查"
- "CI 检查"、"代码检查"
- "准备提交"

## 检查流程

### 1. 代码规范检查 (Lint)

```bash
pnpm lint
```

检查 TypeScript/JavaScript 代码规范：
- ESLint 规则遵守
- 代码格式问题
- 潜在的代码问题

### 2. 类型检查 (TypeCheck)

```bash
pnpm typecheck
```

TypeScript 类型检查：
- 类型错误
- 类型不匹配
- 缺失类型定义

### 3. 单元测试 (Test)

```bash
pnpm test:ci
```

运行所有单元测试：
- 测试用例通过
- 覆盖率要求（目标 > 80%）

### 4. 构建检查 (Build)

```bash
pnpm build:packages
```

确保代码可以成功构建：
- 编译无错误
- 导出正确

### 5. Commit Message 格式检查

验证 commit message 格式：
```
<type>(<scope>): <subject>

[可选 body]

[可选 footer]
```

**允许的 type：**
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档变更
- `style`: 代码格式（不影响代码运行）
- `refactor`: 重构（既不是新功能也不是修复）
- `test`: 添加测试
- `chore`: 构建过程或辅助工具变更

**scope 建议：**
- `vvce-core`, `vvce-schema`, `vvce-components`
- `contracts`, `shared`
- `api`, `backend`
- `miniapp`, `web-admin`, `web-student`

## 执行步骤

1. **并行运行** lint 和 typecheck（它们相互独立）
2. **顺序运行** test（依赖编译成功）
3. **可选运行** build（如果测试通过）
4. **汇总结果** 显示所有检查状态

## 输出格式

```
=== Pre-Commit Check ===

[✓] Lint Check       - 通过
[✓] TypeCheck        - 通过
[✓] Unit Tests       - 通过 (XX tests, XX% coverage)
[✓] Build            - 通过

✅ 所有检查通过，可以提交代码
```

或

```
=== Pre-Commit Check ===

[✓] Lint Check       - 通过
[✗] TypeCheck        - 失败
    - src/runtime/Runtime.ts:42 - Type 'string' is not assignable to type 'number'
[!] Unit Tests       - 跳过（TypeCheck 失败）
[!] Build            - 跳过

❌ 检查未通过，请修复上述问题后再提交
```

## 修复建议

如果检查失败，提供：
1. 具体错误位置和描述
2. 修复建议或代码片段
3. 相关文档链接（如有）

## 注意事项

- 使用 pnpm，不要使用 npm 或 yarn
- 所有路径使用 workspace 相对路径
- 测试失败时不自动修复，让用户决定
