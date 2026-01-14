# VV Education - AI Skills

> AI 辅助开发技能集，提升开发效率和代码质量

## 技能概览

| Skill | 触发词 | 描述 |
|-------|--------|------|
| [pre-commit-check](#pre-commit-check) | 提交代码、CI 检查 | 代码提交前的全面检查 |
| [todo-manager](#todo-manager) | TODO、待办、任务 | 管理项目 TODO.md |
| [pr-prepare](#pr-prepare) | 创建 PR、发起 PR | 准备 Pull Request |
| [component-scaffold](#component-scaffold) | 创建组件、新组件 | 生成组件脚手架 |
| [dsl-validate](#dsl-validate) | 验证 DSL、检查课件 | 验证 VVCE DSL 文件 |
| [debug-helper](#debug-helper) | 调试、debug | 辅助调试运行时问题 |
| [test-runner](#test-runner) | 运行测试、coverage | 智能运行测试 |
| [api-test](#api-test) | 测试 API、接口测试 | 测试后端 API |
| [release-prep](#release-prep) | 发布版本、release | 准备版本发布 |
| [code-review](#code-review) | 代码审查、CR | 自动化代码审查 |
| [project-init](#project-init) | 创建项目、初始化 | 初始化新项目 |

---

## 详细说明

### pre-commit-check

**用途：** 在提交代码前执行全面的 CI 检查

**触发词：**
- "提交代码"、"commit"
- "CI 检查"、"代码检查"
- "准备提交"

**执行内容：**
1. `pnpm lint` - 代码规范检查
2. `pnpm typecheck` - TypeScript 类型检查
3. `pnpm test:ci` - 单元测试
4. `pnpm build:packages` - 构建检查
5. Commit message 格式验证

---

### todo-manager

**用途：** 管理项目的 TODO.md 文件

**触发词：**
- "TODO"、"待办"、"任务列表"
- "完成了 xxx"
- "更新进度"

**功能：**
- 加载并显示 TODO 状态
- 标记任务为已完成
- 更新进度百分比
- 添加新任务

---

### pr-prepare

**用途：** 准备高质量的 Pull Request

**触发词：**
- "创建 PR"、"发起 PR"
- "准备合并"

**执行内容：**
1. 完整的代码质量检查
2. Git 状态检查
3. Commit 历史审查
4. 生成 PR 标题和描述

---

### component-scaffold

**用途：** 为 vvce-components 创建新组件

**触发词：**
- "创建组件"、"新组件"
- "添加 XXX 组件"

**生成内容：**
- `{Component}.tsx` - 组件实现
- `{Component}.meta.ts` - 组件元数据
- `{Component}.styles.ts` - 样式定义
- `{Component}.test.tsx` - 单元测试
- `index.ts` - 导出文件

---

### dsl-validate

**用途：** 验证 VVCE DSL 文件的正确性

**触发词：**
- "验证 DSL"、"检查 DSL"
- "课件检查"

**验证级别：**
1. Schema 验证（语法）
2. 语义验证（引用完整性）
3. 静态分析（Lint）
4. Dry Run 模拟

---

### debug-helper

**用途：** 辅助调试 VVCE 运行时问题

**触发词：**
- "调试"、"debug"
- "事件没触发"
- "状态不对"

**功能：**
- 状态检查
- 日志分析
- 事件追踪
- 常见问题排查

---

### test-runner

**用途：** 智能运行和管理测试

**触发词：**
- "运行测试"、"test"
- "覆盖率"、"coverage"

**功能：**
- 全量测试 / 单包测试 / 单文件测试
- 覆盖率报告
- 失败分析
- 测试用例生成

---

### api-test

**用途：** 测试后端 API 接口

**触发词：**
- "测试 API"
- "接口测试"

**测试范围：**
- Course API
- Progress API
- Identity API

---

### release-prep

**用途：** 准备版本发布

**触发词：**
- "发布版本"、"release"
- "版本升级"

**检查清单：**
1. 代码质量检查
2. 版本号管理
3. CHANGELOG 更新
4. 文档更新
5. 创建 Release Tag

---

### code-review

**用途：** 自动化代码审查

**触发词：**
- "代码审查"、"code review"
- "这样写对吗"

**审查维度：**
- 代码规范
- TypeScript 最佳实践
- 架构一致性
- 安全性
- 性能
- 可维护性

---

### project-init

**用途：** 初始化新项目

**触发词：**
- "创建项目"
- "添加 package"
- "创建 app"

**支持类型：**
- 新的 Package
- Web 应用 (React + Vite)
- 微信小程序
- 后端模块

---

## 使用方式

### 方式 1: 直接对话

```
用户: 帮我运行一下 CI 检查

AI: [加载 pre-commit-check skill，执行检查]
```

### 方式 2: 明确指定

```
用户: 使用 todo-manager 看一下当前进度

AI: [加载 todo-manager skill，显示 TODO 状态]
```

### 方式 3: 组合使用

```
用户: 我完成了 Dialog 组件，帮我更新 TODO 并准备提交

AI:
1. [加载 todo-manager skill，更新进度]
2. [加载 pre-commit-check skill，执行检查]
```

---

## 扩展 Skills

### 添加新 Skill

1. 在 `.claude/skills/` 目录创建新的 markdown 文件
2. 定义触发词、功能、执行步骤
3. 添加到本 README 的技能概览表格

### Skill 文件结构

```markdown
# Skill Name

> 简短描述

## 触发时机
当用户提及以下内容时触发：
- 触发词 1
- 触发词 2

## 功能/流程
...

## 输出格式
...

## 注意事项
...
```

---

## 最佳实践

1. **组合使用**: 复杂任务可以组合多个 skill
2. **按需触发**: 根据任务自动选择合适的 skill
3. **持续更新**: 根据项目演进更新 skill 内容
4. **反馈改进**: 根据使用体验优化 skill

---

## 维护信息

- **版本**: 1.0.0
- **更新日期**: 2026-01-14
- **维护者**: VV Education Team
