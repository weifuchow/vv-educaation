# VV Education - PC 学生端

学生创作与项目平台（阶段二）

## 功能概述

PC Web 端学生应用，用于项目制学习、内容创作和演讲展示。

## 核心功能（阶段二）

### 1. 项目制学习
- 项目列表
- 组队功能（2-3人）
- 项目工作台
- 成果提交

### 2. 创作工具
- 作品编辑器
- 多媒体素材管理
- 版本历史

### 3. 演讲与展示
- 演讲录制
- 作品展示页
- 同伴评审

### 4. 学习记录
- 学习历史
- 成绩单
- 证书/徽章

## 技术选型

- **框架**: React + TypeScript
- **路由**: React Router
- **状态管理**: Zustand
- **UI 组件库**: shadcn/ui
- **构建工具**: Vite

## 目录结构

```
web-student/
├── src/
│   ├── pages/
│   │   ├── Projects/       # 项目管理
│   │   ├── Studio/         # 创作工作室
│   │   └── Profile/        # 个人中心
│   ├── components/
│   ├── api/
│   └── ...
├── package.json
└── vite.config.ts
```

## 许可证

MIT
