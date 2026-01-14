# Release Prep Skill

> 准备版本发布，确保发布质量

## 触发时机

当用户提及以下内容时触发：
- "发布版本"、"release"、"发版"
- "版本升级"、"bump version"
- "准备上线"

## 发布检查清单

### 1. 代码质量检查

```bash
# 完整 CI 检查
pnpm lint
pnpm typecheck
pnpm test:ci
pnpm build
```

### 2. 版本号管理

**语义化版本 (SemVer):**
- MAJOR.MINOR.PATCH
- 例如: 1.2.3

**版本升级规则：**
- MAJOR: 不兼容的 API 变更
- MINOR: 向后兼容的新功能
- PATCH: 向后兼容的 bug 修复

### 3. 更新版本号

```bash
# 更新所有包版本
pnpm version patch  # 0.1.0 -> 0.1.1
pnpm version minor  # 0.1.0 -> 0.2.0
pnpm version major  # 0.1.0 -> 1.0.0

# 或手动更新 package.json
```

**需要更新的文件：**
- `/package.json`
- `/packages/vvce-core/package.json`
- `/packages/vvce-schema/package.json`
- `/packages/vvce-components/package.json`
- `/packages/contracts/package.json`
- `/packages/shared/package.json`

### 4. 更新 CHANGELOG

```markdown
# Changelog

## [1.2.0] - 2026-01-14

### Added
- 新功能描述

### Changed
- 变更描述

### Fixed
- 修复描述

### Deprecated
- 废弃功能

### Removed
- 移除功能

### Security
- 安全修复
```

### 5. 更新文档

- [ ] README.md 更新（如需要）
- [ ] API 文档更新
- [ ] 迁移指南（如有破坏性变更）

### 6. 创建 Release Tag

```bash
# 创建 tag
git tag -a v1.2.0 -m "Release v1.2.0"

# 推送 tag
git push origin v1.2.0
```

### 7. 创建 GitHub Release

```bash
gh release create v1.2.0 \
  --title "v1.2.0" \
  --notes-file RELEASE_NOTES.md
```

## 输出格式

```
=== Release Preparation ===

📋 检查清单:
   [✓] Lint 检查通过
   [✓] TypeCheck 通过
   [✓] 单元测试通过 (156 tests, 82% coverage)
   [✓] 构建成功
   [✓] 无未提交更改

📦 版本信息:
   当前版本: 0.1.0
   建议版本: 0.2.0 (包含新功能)

📝 变更摘要:
   - feat: 添加动画引擎 (#42)
   - feat: 添加 30+ 内置动画 (#43)
   - fix: 修复 Store 深层路径问题 (#44)
   - docs: 更新 DSL 规范文档

🔖 发布步骤:
   1. pnpm version minor
   2. 更新 CHANGELOG.md
   3. git commit -m "chore: release v0.2.0"
   4. git tag -a v0.2.0 -m "Release v0.2.0"
   5. git push && git push --tags
   6. gh release create v0.2.0

确认后执行发布？
```

## 回滚计划

如果发布出现问题：

```bash
# 删除远程 tag
git push --delete origin v1.2.0

# 删除本地 tag
git tag -d v1.2.0

# 回滚代码
git revert HEAD

# 发布修复版本
git tag -a v1.2.1 -m "Hotfix release"
```

## 注意事项

- 确保所有测试通过
- 确保文档已更新
- 通知相关人员
- 监控发布后的问题
- 准备好回滚方案
