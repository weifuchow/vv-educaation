# VVCE 组件协议

## 概述

VVCE 组件协议定义了如何创建符合 VVCE 引擎标准的交互组件。

## 组件接口

每个组件必须实现以下接口：

```typescript
interface VVCEComponent {
  // 组件类型标识（全局唯一）
  type: string;

  // 属性 Schema
  propsSchema: JSONSchema;

  // 状态结构定义
  stateShape: Record<string, any>;

  // 支持的事件列表
  events: string[];

  // 渲染函数（框架相关）
  render: (props: any, state: any, emit: EventEmitter) => ReactNode | VNode;
}
```

## M0 基础组件

### Dialog（对话框）

**类型标识**: `Dialog`

**属性**:
```typescript
interface DialogProps {
  text: string;        // 对话文本
  speaker?: string;    // 说话者名称
  avatar?: string;     // 头像 URL
}
```

**状态**: 无

**事件**: 无

### QuizSingle（单选题）

**类型标识**: `QuizSingle`

**属性**:
```typescript
interface QuizSingleProps {
  question: string;       // 问题
  options: string[];      // 选项数组
  answerKey?: string;     // 正确答案（M0 可用，后续移到后端）
}
```

**状态**:
```typescript
{
  selected: string | null;  // 当前选中项
}
```

**事件**:
- `change` - 选项变更时触发

### Button（按钮）

**类型标识**: `Button`

**属性**:
```typescript
interface ButtonProps {
  text: string;                              // 按钮文本
  variant?: 'primary' | 'secondary' | 'text'; // 样式变体
  disabled?: boolean;                         // 禁用状态
}
```

**状态**: 无

**事件**:
- `click` - 点击时触发

## 组件注册

```typescript
import { componentRegistry } from '@vv-education/vvce-components';

componentRegistry.register({
  type: 'MyComponent',
  propsSchema: { ... },
  stateShape: { ... },
  events: ['click', 'change'],
  render: (props, state, emit) => { ... }
});
```

## 扩展组件示例

创建一个倒计时组件：

```typescript
componentRegistry.register({
  type: 'Countdown',
  propsSchema: {
    type: 'object',
    properties: {
      seconds: { type: 'number' }
    },
    required: ['seconds']
  },
  stateShape: {
    remaining: 0,
    isRunning: false
  },
  events: ['timeout', 'tick'],
  render: (props, state, emit) => {
    // 渲染逻辑
  }
});
```

## 许可证

MIT
