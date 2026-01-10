# @vv-education/contracts

API 契约定义

## 功能概述

统一维护前后端 API 契约，包括：
- OpenAPI 规范定义
- TypeScript 类型定义
- 错误码定义
- API 响应格式

## 主要模块

### 1. Course API
- 获取课程列表
- 获取课程详情
- 获取课程 DSL

### 2. Progress API
- 保存学习进度
- 读取学习进度
- 进度统计

### 3. Identity API
- 用户登录/注册
- 用户信息

## 使用方式

```typescript
import { CourseAPI, ProgressAPI } from '@vv-education/contracts';
```

## 许可证

MIT
