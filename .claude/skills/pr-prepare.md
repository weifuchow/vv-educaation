# PR Prepare Skill

> 准备 Pull Request，确保代码质量和 PR 规范

## 触发时机

当用户提及以下内容时触发：
- "创建 PR"、"发起 PR"、"Pull Request"
- "准备合并"、"合并到主分支"
- "代码审查准备"

## 完整检查流程

### 阶段 1：代码质量检查

执行 pre-commit-check 的所有检查：
1. Lint 检查
2. TypeCheck 检查
3. 单元测试
4. 构建检查

### 阶段 2：Git 状态检查

```bash
# 检查是否有未提交的更改
git status

# 检查分支是否是最新的
git fetch origin
git log HEAD..origin/main --oneline
```

确保：
- [ ] 没有未提交的更改
- [ ] 已推送到远程分支
- [ ] 与主分支没有冲突

### 阶段 3：Commit 历史检查

```bash
git log origin/main..HEAD --oneline
```

检查：
- [ ] Commit message 格式正确
- [ ] 没有包含敏感信息
- [ ] Commit 逻辑清晰

### 阶段 4：PR 标题格式

**格式要求：**
```
<type>(<scope>): <description>
```

**示例：**
- `feat(vvce-core): add playAnimation action support`
- `fix(store): handle undefined in nested path resolution`
- `docs(vvce-schema): update action types documentation`

**自动生成建议：**
基于 commit 历史自动建议 PR 标题

### 阶段 5：PR 描述模板

```markdown
## Summary

<!-- 简要描述这个 PR 做了什么 -->

## Changes

<!-- 列出主要变更 -->
-
-

## Related Issues

<!-- 关联的 Issue（如有） -->
Closes #

## Testing

<!-- 描述如何测试这些变更 -->
- [ ] 单元测试通过
- [ ] 本地手动测试通过

## Checklist

- [ ] 代码遵循项目规范
- [ ] 添加了必要的测试
- [ ] 更新了相关文档
- [ ] 更新了 TODO.md（如果需要）

## Screenshots

<!-- 如果有 UI 变更，添加截图 -->
```

## 输出格式

```
=== PR Prepare Check ===

阶段 1: 代码质量检查
  [✓] Lint Check       - 通过
  [✓] TypeCheck        - 通过
  [✓] Unit Tests       - 通过 (42 tests, 85% coverage)
  [✓] Build            - 通过

阶段 2: Git 状态检查
  [✓] 工作区干净
  [✓] 已推送到远程
  [✓] 与 main 无冲突

阶段 3: Commit 历史
  [✓] 3 个 commits 待合并
  └── feat(vvce-core): add animation engine
  └── feat(vvce-core): implement 30+ built-in animations
  └── test(vvce-core): add animation tests

阶段 4: PR 建议
  标题: feat(vvce-core): add animation engine with 30+ built-in animations

阶段 5: PR 描述
  [已生成 PR 描述模板]

✅ 准备就绪，可以创建 PR！

使用以下命令创建 PR：
gh pr create --title "feat(vvce-core): add animation engine" --body-file .github/PR_BODY.md
```

## 自动修复

如果发现问题，提供自动修复选项：

1. **Lint 问题**：`pnpm lint --fix`
2. **格式问题**：`pnpm prettier --write .`
3. **Commit message 问题**：建议修改命令

## PR 分支命名

**推荐格式：**
```
<type>/<ticket-id>-<short-description>
```

**示例：**
- `feature/VV-123-add-animation-engine`
- `fix/VV-456-store-null-check`
- `docs/update-api-documentation`

## 注意事项

- 确保 PR 只包含相关的变更
- 避免大型 PR，推荐拆分为多个小 PR
- 确保测试覆盖新增功能
- 更新 CHANGELOG.md（如果项目有）
