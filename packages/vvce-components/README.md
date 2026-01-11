# @vv-education/vvce-components

VVCE 标准交互组件库

## 功能概述

提供 VVCE 引擎的标准组件协议和基础组件实现，包括对话框、选择题、按钮等交互组件。

## M0 基础组件

### 1. Dialog（对话框）

- 展示文本内容
- 支持头像和说话者名称
- props: `text`, `avatar`, `speaker`

### 2. QuizSingle（单选题）

- 单选题组件
- props: `question`, `options[]`, `answerKey`
- state: `selected`
- events: `change`

### 3. Button（按钮）

- 交互按钮
- props: `text`, `variant`, `disabled`
- events: `click`

## 组件协议

每个组件必须实现：

- `type`: 组件类型标识
- `propsSchema`: 属性定义
- `stateShape`: 状态结构
- `events`: 支持的事件列表

## 使用方式

组件库框架无关，可用于 React、Vue 等任何前端框架。

```typescript
import { componentRegistry } from '@vv-education/vvce-components';

// 获取组件定义
const DialogComponent = componentRegistry.get('Dialog');
```

## 许可证

MIT
