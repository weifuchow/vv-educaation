# Course Factory

课件工厂 - DSL 生成与处理工具（阶段二）

## 功能概述

课件工厂负责将课程脚本转换为标准化的 VVCE DSL，并进行校验、测试和打包。

## 核心功能

### 1. Script 转 DSL
- 支持从简化的脚本语法生成标准 DSL
- 模板化生成
- 批量处理

### 2. DSL Lint
- 结构校验
- 语义检查
- 最佳实践检查

### 3. Dry Run
- 模拟课件执行
- 场景流程检查
- 死循环检测

### 4. 打包发布
- 资源收集
- 版本管理
- 发布准备

## 使用方式

```bash
# 校验 DSL
npm run lint -- course.json

# Dry Run
npm run dry-run -- course.json

# 打包
npm run pack -- course.json
```

## 许可证

MIT
