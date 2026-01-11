# VVCE DevTools

VVCE 开发者工具 - 调试与回放

## 功能概述

提供 VVCE 课件的调试面板、日志查看器和回放功能。

## 核心功能

### 1. 调试面板

- 实时状态查看
- 事件监听
- 手动触发事件

### 2. 日志查看器

- 结构化日志展示
- 日志过滤
- 日志导出

### 3. 回放器

- 基于日志回放课件执行
- 时间轴控制
- 状态快照对比

### 4. 性能分析

- 事件处理耗时
- 渲染性能监控

## 使用方式

在开发环境中嵌入 DevTools：

```typescript
import { VVCEDevTools } from '@vv-education/vvce-devtools';

// 在 VVCE Runtime 旁边渲染 DevTools
<VVCEDevTools runtime={runtime} />
```

## 许可证

MIT
