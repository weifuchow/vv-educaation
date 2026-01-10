# VV Education - 管理端

课程管理与运营平台

## 功能概述

Web 管理端，用于课程生成、审核、发布、预览和数据分析。

## 核心功能

### 1. 课程管理
- 课程列表/搜索/筛选
- 课程创建/编辑
- DSL 编辑器（JSON 编辑或可视化编辑）
- 课程预览（集成 VVCE 引擎）
- 课程发布/下架
- 版本管理

### 2. 内容审核
- 待审核课程列表
- 课程内容审核
- DSL 校验报告
- 审核通过/驳回

### 3. AI 课件生成（M2）
- AI 生成配置
- 生成历史
- 生成结果预览

### 4. 数据看板
- 课程统计
- 用户学习数据
- 完成率/通过率分析

### 5. 用户管理
- 用户列表
- 用户详情
- 学习记录

## 技术选型

- **框架**: React + TypeScript
- **路由**: React Router
- **状态管理**: Zustand / Redux Toolkit
- **UI 组件库**: Ant Design / shadcn/ui
- **构建工具**: Vite
- **代码编辑器**: Monaco Editor（用于 DSL 编辑）

## 目录结构

```
web-admin/
├── src/
│   ├── pages/              # 页面
│   │   ├── Dashboard/      # 数据看板
│   │   ├── Course/         # 课程管理
│   │   ├── Preview/        # 课程预览
│   │   └── Users/          # 用户管理
│   ├── components/         # 组件
│   │   ├── DSLEditor/      # DSL 编辑器
│   │   ├── CoursePreview/  # 课程预览器
│   │   └── ...
│   ├── api/                # API 调用
│   ├── stores/             # 状态管理
│   ├── hooks/              # 自定义 Hooks
│   ├── utils/              # 工具函数
│   ├── App.tsx
│   └── main.tsx
├── public/
├── index.html
├── package.json
└── vite.config.ts
```

## 开发指南

### 安装依赖
```bash
npm install
```

### 启动开发
```bash
npm run dev
```

### 构建
```bash
npm run build
```

## 许可证

MIT
