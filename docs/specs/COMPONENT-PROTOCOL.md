# VVCE 组件协议 v1.1

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

  // 默认样式（v1.1 新增）
  defaultStyle?: StyleDefinition;

  // 支持的交互动画（v1.1 新增）
  interactions?: string[];

  // 渲染函数（框架相关）
  render: (context: RenderContext) => ReactNode | VNode;
}

// v1.1 新增渲染上下文
interface RenderContext {
  props: Record<string, any>;
  state: Record<string, any>;
  style: ComputedStyle;          // 计算后的样式
  styleClass: string[];          // 应用的样式类
  animation: AnimationState;     // 动画状态
  emit: EventEmitter;
  theme: ThemeContext;           // 主题上下文
}
```

---

## 样式系统集成（v1.1）

### 组件样式来源

组件最终样式由以下来源合并（优先级从低到高）：

1. **默认样式** - 组件定义中的 `defaultStyle`
2. **主题样式** - 主题配置中的组件样式覆盖
3. **样式类** - DSL 中通过 `styleClass` 引用的样式
4. **内联样式** - DSL 中的 `style` 属性
5. **状态样式** - hover/active/disabled 等状态样式
6. **动画样式** - 动画执行过程中的样式

### 样式计算

```typescript
interface ComputedStyle {
  // 最终计算的样式属性
  properties: StyleProperties;
  // 当前状态
  state: 'normal' | 'hover' | 'active' | 'disabled' | 'focus';
  // CSS 变量解析后的值
  resolved: Record<string, any>;
}
```

### 主题上下文

```typescript
interface ThemeContext {
  // 当前主题名称
  name: string;
  // 颜色模式
  mode: 'light' | 'dark';
  // 获取变量值
  getVariable(path: string): any;
  // 获取组件主题样式
  getComponentStyle(type: string): StyleDefinition | undefined;
}
```

---

## 动画系统集成（v1.1）

### 动画状态

```typescript
interface AnimationState {
  // 是否正在播放动画
  isAnimating: boolean;
  // 当前动画名称
  animationName: string | null;
  // 动画进度 0-1
  progress: number;
  // 当前帧样式
  frameStyle: Record<string, any>;
}
```

### 组件动画支持

组件可以声明支持的交互动画：

```typescript
componentRegistry.register({
  type: 'Card',
  interactions: ['hover', 'click', 'visible'],
  // ...
});
```

支持的交互类型：
- `hover` - 鼠标悬停
- `click` - 点击
- `focus` - 获得焦点
- `active` - 激活状态
- `visible` - 进入可视区域

---

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

**默认样式**:
```typescript
{
  base: {
    padding: 20,
    backgroundColor: '$colors.backgroundSecondary',
    borderRadius: 12,
    boxShadow: '$shadows.md'
  }
}
```

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

**默认样式**:
```typescript
{
  base: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '$colors.border',
    borderStyle: 'solid'
  }
}
```

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

**默认样式**:
```typescript
{
  base: {
    padding: [12, 24],
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 500,
    cursor: 'pointer',
    transition: { property: 'all', duration: 200 }
  },
  hover: {
    opacity: 0.9
  },
  active: {
    transform: { scale: 0.98 }
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  }
}
```

**交互动画**:
```typescript
interactions: ['hover', 'click', 'active']
```

---

## 组件注册

```typescript
import { componentRegistry } from '@vv-education/vvce-components';

componentRegistry.register({
  type: 'MyComponent',
  propsSchema: { ... },
  stateShape: { ... },
  events: ['click', 'change'],
  defaultStyle: {
    base: { ... },
    hover: { ... }
  },
  interactions: ['hover', 'click'],
  render: (context) => {
    const { props, state, style, animation, emit, theme } = context;
    // 渲染逻辑
  }
});
```

---

## 扩展组件示例

### 倒计时组件

```typescript
componentRegistry.register({
  type: 'Countdown',
  propsSchema: {
    type: 'object',
    properties: {
      seconds: { type: 'number' },
      showProgress: { type: 'boolean' }
    },
    required: ['seconds']
  },
  stateShape: {
    remaining: 0,
    isRunning: false
  },
  events: ['timeout', 'tick'],
  defaultStyle: {
    base: {
      fontSize: 48,
      fontWeight: 700,
      textAlign: 'center',
      color: '$colors.primary'
    }
  },
  interactions: ['visible'],
  render: (context) => {
    const { props, state, style } = context;
    // 渲染逻辑
  }
});
```

### 卡片组件

```typescript
componentRegistry.register({
  type: 'Card',
  propsSchema: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      content: { type: 'string' },
      image: { type: 'string' },
      clickable: { type: 'boolean' }
    }
  },
  stateShape: {},
  events: ['click'],
  defaultStyle: {
    base: {
      padding: 16,
      borderRadius: '$radii.lg',
      backgroundColor: '$colors.background',
      boxShadow: '$shadows.md',
      overflow: 'hidden',
      transition: { property: 'all', duration: 300 }
    },
    hover: {
      boxShadow: '$shadows.lg',
      transform: { translateY: -4 }
    },
    active: {
      transform: { scale: 0.98 }
    }
  },
  interactions: ['hover', 'click'],
  render: (context) => {
    // 渲染逻辑
  }
});
```

### 动画容器组件

```typescript
componentRegistry.register({
  type: 'AnimatedContainer',
  propsSchema: {
    type: 'object',
    properties: {
      enterAnimation: { type: 'string' },
      exitAnimation: { type: 'string' },
      stagger: { type: 'number' }
    }
  },
  stateShape: {
    isVisible: true
  },
  events: ['animationEnd'],
  defaultStyle: {
    base: {
      position: 'relative'
    }
  },
  interactions: ['visible'],
  render: (context) => {
    const { animation } = context;

    // 应用动画帧样式
    const containerStyle = {
      ...context.style.properties,
      ...animation.frameStyle
    };

    // 渲染逻辑
  }
});
```

---

## 样式变量引用

在组件样式中可以使用 `$` 前缀引用主题变量：

```typescript
defaultStyle: {
  base: {
    color: '$colors.text',
    backgroundColor: '$colors.background',
    padding: '$spacing.md',
    borderRadius: '$radii.md',
    boxShadow: '$shadows.md',
    fontFamily: '$fontFamilies.sans'
  }
}
```

---

## 响应式样式

组件可以定义响应式断点样式：

```typescript
defaultStyle: {
  base: {
    padding: 16,
    fontSize: 14
  },
  responsive: {
    sm: {
      padding: 12,
      fontSize: 12
    },
    md: {
      padding: 16,
      fontSize: 14
    },
    lg: {
      padding: 20,
      fontSize: 16
    }
  }
}
```

断点定义：
- `sm`: < 640px
- `md`: 640px - 1024px
- `lg`: 1024px - 1280px
- `xl`: > 1280px

---

## 许可证

MIT
