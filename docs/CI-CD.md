# CI/CD Pipeline 文档

## 概述

本项目配置了完整的 CI/CD 流程，包括自动化测试、代码质量检查、构建验证等，以确保代码质量和减少错误。

## 工作流概览

### 1. 本地 Git Hooks (通过 Husky)

#### Pre-commit Hook

在每次提交前自动运行：

- **Lint-staged**: 只对暂存的文件进行检查
  - TypeScript/TSX 文件: ESLint 自动修复 + Prettier 格式化
  - JSON/Markdown/YAML 文件: Prettier 格式化

#### Pre-push Hook

在每次推送前自动运行：

- **单元测试**: 运行所有前端包的测试

### 2. GitHub Actions 工作流

#### Frontend CI (`frontend-ci.yml`)

**触发条件:**

- Push 到 `main` 或 `claude/**` 分支
- PR 到 `main` 分支
- 影响前端代码的变更

**检查项:**

1. **Lint & Type Check**
   - ESLint 检查
   - TypeScript 类型检查

2. **Unit Tests**
   - 运行所有测试
   - 生成覆盖率报告
   - 上传到 Codecov

3. **Build**
   - 构建所有 packages
   - 缓存构建产物

#### Backend CI (`backend-ci.yml`)

**触发条件:**

- Push 到 `main` 或 `claude/**` 分支
- PR 到 `main` 分支
- 影响后端代码的变更

**检查项:**

1. **Test & Build**
   - Maven 测试
   - Maven 构建
   - 上传 JAR 产物

2. **Code Quality**
   - Checkstyle 检查
   - SpotBugs 检查

#### Code Quality (`code-quality.yml`)

**触发条件:**

- 所有 push 和 PR

**检查项:**

1. **Security Scan**
   - Trivy 漏洞扫描
   - 结果上传到 GitHub Security

2. **Dependency Review** (仅 PR)
   - 检查依赖变更
   - 识别安全问题

3. **Code Coverage**
   - 覆盖率报告
   - PR 评论显示覆盖率变化

4. **Prettier Format Check**
   - 检查代码格式一致性

#### PR Checks (`pr-checks.yml`)

**触发条件:**

- PR 到 `main` 分支

**检查项:**

1. **PR Title Validation**
   - 验证标题格式: `type(scope): description`
   - 允许的类型: feat, fix, docs, style, refactor, test, chore
   - 示例: `feat(vvce-core): add new animation support`

2. **PR Information**
   - 显示 PR 详细信息

## 使用指南

### 开发工作流

```bash
# 1. 克隆并安装
git clone <repository>
cd vv-education
pnpm install  # 会自动运行 husky 安装

# 2. 开发
git checkout -b feature/my-feature
# 编写代码...

# 3. 提交
git add .
git commit -m "feat(vvce-core): add new feature"
# 自动运行 lint-staged，修复代码格式和 lint 问题

# 4. 推送
git push origin feature/my-feature
# 自动运行测试

# 5. 创建 PR
# 确保 PR 标题符合格式: type(scope): description
```

### PR 标题格式规范

**格式:** `type(scope): description`

**Types:**

- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 重构
- `test`: 测试相关
- `chore`: 构建/工具相关

**示例:**

```
feat(vvce-core): add playAnimation action support
fix(store): handle undefined in nested path resolution
docs(api): update course endpoint documentation
test(runtime): add integration tests for scene transitions
```

### 跳过 Hooks（紧急情况）

```bash
# 跳过 pre-commit
git commit --no-verify -m "message"

# 跳过 pre-push
git push --no-verify
```

**⚠️ 警告:** 只在紧急情况下使用，CI 仍会运行检查。

## 本地命令

### 手动运行检查

```bash
# Lint
pnpm lint

# Type check
pnpm typecheck

# Tests
pnpm test

# Build
pnpm build

# Format check
pnpm exec prettier --check "**/*.{ts,tsx,json,md,yml,yaml}"

# Format fix
pnpm exec prettier --write "**/*.{ts,tsx,json,md,yml,yaml}"
```

### 测试覆盖率

```bash
# 运行测试并生成覆盖率
pnpm test --coverage

# 查看覆盖率报告
open coverage/index.html  # macOS
xdg-open coverage/index.html  # Linux
```

## CI/CD 状态徽章

在 README 中添加状态徽章：

```markdown
![Frontend CI](https://github.com/your-org/vv-education/workflows/Frontend%20CI/badge.svg)
![Backend CI](https://github.com/your-org/vv-education/workflows/Backend%20CI/badge.svg)
![Code Quality](https://github.com/your-org/vv-education/workflows/Code%20Quality/badge.svg)
```

## 故障排查

### Husky hooks 未运行

```bash
# 重新安装 husky
pnpm prepare

# 检查 hooks 权限
ls -la .husky/
chmod +x .husky/pre-commit .husky/pre-push
```

### Lint-staged 失败

```bash
# 手动运行查看详细错误
pnpm exec lint-staged --verbose

# 清理缓存
rm -rf node_modules/.cache
```

### CI 构建失败

1. 检查 GitHub Actions 日志
2. 在本地重现问题
3. 确保本地所有检查通过
4. 检查依赖版本一致性

### 格式化问题

```bash
# 自动修复所有格式问题
pnpm exec prettier --write .

# 修复 ESLint 问题
pnpm lint --fix
```

## 配置文件

| 文件                                 | 用途              |
| ------------------------------------ | ----------------- |
| `.github/workflows/frontend-ci.yml`  | 前端 CI 配置      |
| `.github/workflows/backend-ci.yml`   | 后端 CI 配置      |
| `.github/workflows/code-quality.yml` | 代码质量检查      |
| `.github/workflows/pr-checks.yml`    | PR 检查           |
| `.husky/pre-commit`                  | Pre-commit hook   |
| `.husky/pre-push`                    | Pre-push hook     |
| `package.json`                       | lint-staged 配置  |
| `.eslintrc.json`                     | ESLint 规则       |
| `.prettierrc.json`                   | Prettier 规则     |
| `.eslintignore`                      | ESLint 忽略文件   |
| `.prettierignore`                    | Prettier 忽略文件 |

## 最佳实践

1. **提交前检查**
   - 确保代码格式正确
   - 运行相关测试
   - 检查类型错误

2. **PR 规范**
   - 使用规范的标题格式
   - 提供清晰的描述
   - 关联相关 issue

3. **代码审查**
   - 等待 CI 通过后再请求审查
   - 及时修复 CI 发现的问题
   - 保持 PR 小而专注

4. **依赖管理**
   - 使用 `pnpm install --frozen-lockfile` 确保一致性
   - 定期更新依赖
   - 检查安全漏洞

## 性能优化

- **缓存**: GitHub Actions 缓存 pnpm 依赖和构建产物
- **并行**: 多个 job 并行运行
- **路径过滤**: 只在相关文件变更时运行
- **增量检查**: lint-staged 只检查变更文件

## 未来改进

- [ ] 添加 E2E 测试工作流
- [ ] 集成 SonarQube 代码分析
- [ ] 自动发布流程
- [ ] 性能基准测试
- [ ] 自动生成 Changelog
- [ ] Docker 镜像构建和发布

## 相关资源

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Husky 文档](https://typicode.github.io/husky/)
- [lint-staged 文档](https://github.com/okonet/lint-staged)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**维护者:** VV Education Team
**最后更新:** 2026-01-11
