# VVCE 样式系统规范

## 概述

VVCE 样式系统为交互式课件提供了强大的样式、主题和动画支持。系统设计目标是：

- **声明式** - 通过 DSL 描述样式，无需编写代码
- **可复用** - 支持样式变量、样式类和主题
- **响应式** - 自动适配不同屏幕尺寸
- **可动画** - 内置丰富的动画和过渡效果

---

## 架构概览

```
┌─────────────────────────────────────────────────────────┐
│                      DSL 定义层                          │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │
│  │  resources   │ │    theme     │ │    node      │     │
│  │  (变量/样式) │ │   (主题)     │ │  (内联样式)  │     │
│  └──────────────┘ └──────────────┘ └──────────────┘     │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                      引擎处理层                          │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐     │
│  │StyleManager  │ │ThemeProvider │ │AnimationEngine│     │
│  │ (样式计算)   │ │ (主题管理)   │ │ (动画执行)   │     │
│  └──────────────┘ └──────────────┘ └──────────────┘     │
│                          ↓                               │
│  ┌─────────────────────────────────────────────────┐    │
│  │              TransitionEngine                    │    │
│  │             (场景过渡管理)                       │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                      渲染输出层                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │              Computed Styles                      │   │
│  │           (计算后的最终样式)                      │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## StyleManager

StyleManager 负责管理和计算组件的最终样式。

### 核心功能

```typescript
import { StyleManager } from '@vv-education/vvce-core';

const styleManager = new StyleManager({
  resources: course.resources,
  breakpoint: 'md',
  baseFontSize: 16,
});

// 加载资源
styleManager.loadResources(resources);

// 设置/获取变量
styleManager.setVariable('colors', 'primary', '#FF6B6B');
const primary = styleManager.getVariable('colors.primary');

// 解析变量引用
const resolved = styleManager.resolveVariableRef('$colors.primary');

// 计算最终样式
const computed = styleManager.computeStyle(
  ['card', 'shadow'], // 样式类
  { padding: 20 }, // 内联样式
  'hover' // 当前状态
);

// 设置断点
styleManager.setBreakpointFromWidth(window.innerWidth);
```

### 样式计算优先级

1. 样式类的 `base` 样式
2. 样式类的状态样式（hover/active/disabled/focus）
3. 样式类的响应式样式
4. 内联样式

### 变量引用格式

```typescript
// $path 格式
'$colors.primary';
'$spacing.md';

// var() 格式
'var(--colors-primary)';
'var(--spacing-md)';
```

---

## ThemeProvider

ThemeProvider 管理主题配置和切换。

### 核心功能

```typescript
import { ThemeProvider } from '@vv-education/vvce-core';

const themeProvider = new ThemeProvider({
  theme: 'playful', // 内置主题
  colorMode: 'auto', // light | dark | auto
  onThemeChange: (theme) => {
    console.log('Theme changed:', theme);
  },
});

// 切换主题
themeProvider.setTheme('academic');

// 获取当前主题
const theme = themeProvider.getTheme();
const resolved = themeProvider.getResolvedTheme();

// 设置颜色模式
themeProvider.setColorMode('dark');

// 更新主题变量
themeProvider.updateVariables({
  colors: { primary: '#FF0000' },
});

// 获取变量值
const primaryColor = themeProvider.getVariable('colors.primary');

// 获取组件主题样式
const buttonStyle = themeProvider.getComponentStyle('Button');

// 生成 CSS
const css = themeProvider.generateThemeCSS();
```

### 内置主题

| 主题名     | 描述         | 适用场景   |
| ---------- | ------------ | ---------- |
| `default`  | 清新教育风格 | 通用       |
| `playful`  | 童趣风格     | 低龄学习者 |
| `academic` | 学术风格     | 专业学习   |
| `minimal`  | 极简风格     | 聚焦内容   |
| `vibrant`  | 鲜艳活泼     | 激发兴趣   |
| `dark`     | 暗色主题     | 护眼模式   |
| `nature`   | 自然风格     | 自然科学   |
| `tech`     | 科技风格     | STEM 教育  |
| `retro`    | 复古风格     | 人文历史   |

### 主题变量结构

```typescript
interface StyleVariables {
  colors: {
    primary: string;
    primaryLight: string;
    primaryDark: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    text: string;
    textSecondary: string;
    background: string;
    border: string;
    // ...
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  fontSizes: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  fontFamilies: {
    sans: string;
    mono: string;
  };
  radii: {
    sm: number;
    md: number;
    lg: number;
    full: number;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}
```

---

## AnimationEngine

AnimationEngine 管理节点动画的播放和控制。

### 核心功能

```typescript
import { AnimationEngine } from '@vv-education/vvce-core';

const animationEngine = new AnimationEngine();

// 注册自定义动画
animationEngine.registerAnimation('myBounce', {
  keyframes: [
    { offset: 0, properties: { scale: 1 } },
    { offset: 50, properties: { scale: 1.2 } },
    { offset: 100, properties: { scale: 1 } },
  ],
  duration: 500,
  easing: 'spring',
});

// 播放动画
const instance = animationEngine.playAnimation({
  nodeId: 'card-1',
  animation: 'bounceIn',
  duration: 600,
  delay: 100,
  iterations: 1,
  onComplete: () => console.log('Animation complete'),
  onFrame: (progress, properties) => {
    // 更新节点样式
  },
});

// 控制动画
instance.pause();
instance.resume();
instance.cancel();

// 停止节点上的动画
animationEngine.stopAnimationOnNode('card-1');

// 获取动画状态
const state = animationEngine.getAnimationState('card-1');
```

### 内置动画

#### 进入动画

- `fadeIn` - 淡入
- `slideInLeft/Right/Up/Down` - 滑入
- `scaleIn` - 缩放进入
- `rotateIn` - 旋转进入
- `bounceIn` - 弹跳进入
- `flipInX/Y` - 翻转进入
- `zoomIn` - 缩放进入

#### 退出动画

- `fadeOut` - 淡出
- `slideOutLeft/Right/Up/Down` - 滑出
- `scaleOut` - 缩放退出
- `rotateOut` - 旋转退出
- `bounceOut` - 弹跳退出
- `flipOutX/Y` - 翻转退出
- `zoomOut` - 缩放退出

#### 注意力动画

- `pulse` - 脉冲
- `shake` - 摇晃
- `wobble` - 摇摆
- `swing` - 摆动
- `tada` - 强调
- `heartbeat` - 心跳
- `rubber` - 橡皮筋
- `jello` - 果冻

#### 循环动画

- `float` - 浮动
- `glow` - 发光

### 缓动函数

| 缓动函数            | 效果             |
| ------------------- | ---------------- |
| `linear`            | 匀速             |
| `ease`              | 默认缓动         |
| `ease-in`           | 加速             |
| `ease-out`          | 减速             |
| `ease-in-out`       | 先加速后减速     |
| `spring`            | 弹簧效果         |
| `bounce`            | 弹跳效果         |
| `elastic`           | 弹性效果         |
| `cubic-bezier(...)` | 自定义贝塞尔曲线 |

---

## TransitionEngine

TransitionEngine 管理场景切换的过渡效果。

### 核心功能

```typescript
import { TransitionEngine } from '@vv-education/vvce-core';

const transitionEngine = new TransitionEngine();

// 注册自定义过渡
transitionEngine.registerTransition('myTransition', {
  type: 'custom',
  duration: 500,
  easing: 'ease-out',
});

// 启动过渡
const state = transitionEngine.startTransition('scene-transition', {
  transition: {
    type: 'slide',
    direction: 'left',
    duration: 400,
  },
  onProgress: (progress) => {
    // 更新过渡进度
  },
  onComplete: () => {
    // 过渡完成
  },
});

// 计算过渡样式
const enterStyle = transitionEngine.calculateTransitionStyles(
  'slide', // 类型
  'left', // 方向
  0.5, // 进度
  true // 是否进入
);

// 取消过渡
transitionEngine.cancelTransition('scene-transition');

// 生成过渡 CSS
const css = transitionEngine.generateTransitionCSS({
  type: 'fade',
  duration: 300,
});
```

### 内置过渡类型

| 类型       | 描述      | 方向支持                  |
| ---------- | --------- | ------------------------- |
| `none`     | 无过渡    | -                         |
| `fade`     | 淡入淡出  | -                         |
| `slide`    | 滑动      | left/right/up/down        |
| `scale`    | 缩放      | -                         |
| `flip`     | 翻转      | left/right                |
| `rotate`   | 旋转      | -                         |
| `zoom`     | 缩放      | -                         |
| `bounce`   | 弹跳      | -                         |
| `blur`     | 模糊      | -                         |
| `wipe`     | 擦除      | left/right/up/down        |
| `reveal`   | 揭示      | center/left/right/up/down |
| `cube`     | 3D 立方体 | left/right                |
| `carousel` | 旋转木马  | left/right                |
| `stack`    | 堆叠卡片  | up/down                   |
| `shuffle`  | 洗牌      | -                         |
| `morph`    | 形变      | -                         |

### 场景切换模式预设

```typescript
import { getSceneTransitionMode } from '@vv-education/vvce-core';

// 获取预设模式
const mode = getSceneTransitionMode('pageFlip');
// { enterTransition: {...}, exitTransition: {...} }
```

可用模式：

- `instant` - 无动画
- `crossfade` - 淡入淡出
- `slideHorizontal` - 左右滑动
- `slideVertical` - 上下滑动
- `zoomTransition` - 缩放
- `pageFlip` - 翻页
- `cube3d` - 3D 立方体
- `carousel` - 旋转木马
- `cardStack` - 卡片堆叠
- `circleReveal` - 圆形揭示
- `wipeRight` - 右侧擦除
- `bouncy` - 弹跳
- `blurFade` - 模糊渐变
- `shuffle` - 洗牌

---

## 使用示例

### 创建带动画的课件

```json
{
  "schema": "vvce.dsl.v1",
  "meta": {
    "id": "animated-lesson",
    "version": "1.0.0",
    "title": "动画演示课件"
  },
  "theme": "vibrant",
  "resources": {
    "variables": {
      "colors": {
        "accent": "#FF6B6B"
      }
    },
    "styles": {
      "heroCard": {
        "base": {
          "padding": 32,
          "borderRadius": 16,
          "backgroundColor": "$colors.background",
          "boxShadow": "$shadows.lg"
        },
        "hover": {
          "transform": { "scale": 1.02 }
        }
      }
    }
  },
  "startSceneId": "intro",
  "scenes": [
    {
      "id": "intro",
      "title": "欢迎",
      "enterTransition": {
        "type": "fade",
        "duration": 500
      },
      "background": {
        "gradient": {
          "type": "linear",
          "angle": 135,
          "colors": [
            { "color": "#667eea", "position": 0 },
            { "color": "#764ba2", "position": 100 }
          ]
        }
      },
      "nodes": [
        {
          "id": "welcome-card",
          "type": "Card",
          "styleClass": "heroCard",
          "enterAnimation": {
            "type": "bounceIn",
            "duration": 800,
            "delay": 200
          },
          "props": {
            "title": "欢迎学习！",
            "content": "准备好开始了吗？"
          }
        },
        {
          "id": "start-btn",
          "type": "Button",
          "enterAnimation": {
            "type": "slideInUp",
            "duration": 500,
            "delay": 600
          },
          "interactions": [
            {
              "trigger": "hover",
              "animation": "pulse"
            }
          ],
          "props": {
            "text": "开始学习",
            "variant": "primary"
          }
        }
      ],
      "triggers": [
        {
          "on": { "event": "click", "target": "start-btn" },
          "then": [
            {
              "action": "sequence",
              "actions": [
                { "action": "sound", "src": "click.mp3" },
                { "action": "haptic", "type": "light" },
                {
                  "action": "gotoScene",
                  "sceneId": "lesson-1",
                  "transition": {
                    "type": "cube",
                    "direction": "left",
                    "duration": 800
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### 动态主题切换

```json
{
  "triggers": [
    {
      "on": { "event": "click", "target": "theme-toggle" },
      "then": [
        {
          "action": "parallel",
          "actions": [
            {
              "action": "setTheme",
              "theme": "dark",
              "duration": 500
            },
            {
              "action": "playAnimation",
              "target": "theme-icon",
              "animation": "rotate"
            }
          ]
        }
      ]
    }
  ]
}
```

### 复杂动画序列

```json
{
  "triggers": [
    {
      "on": { "event": "click", "target": "show-results" },
      "then": [
        {
          "action": "sequence",
          "actions": [
            { "action": "hideNode", "target": "question", "animation": "fadeOut" },
            { "action": "delay", "duration": 300 },
            {
              "action": "parallel",
              "actions": [
                {
                  "action": "showNode",
                  "target": "result-1",
                  "animation": "slideInLeft"
                },
                {
                  "action": "showNode",
                  "target": "result-2",
                  "animation": "slideInRight"
                }
              ]
            },
            { "action": "delay", "duration": 200 },
            { "action": "playAnimation", "target": "score", "animation": "tada" },
            { "action": "sound", "src": "success.mp3" }
          ]
        }
      ]
    }
  ]
}
```

---

## 最佳实践

### 1. 使用样式变量

```json
{
  "style": {
    "backgroundColor": "$colors.primary",
    "padding": "$spacing.md",
    "borderRadius": "$radii.lg"
  }
}
```

### 2. 复用样式类

```json
{
  "resources": {
    "styles": {
      "card": { "base": { ... } },
      "cardShadow": { "base": { "boxShadow": "..." } }
    }
  }
}
```

```json
{
  "styleClass": ["card", "cardShadow"]
}
```

### 3. 合理使用动画延迟

为元素设置错开的动画延迟，创造流畅的动画序列：

```json
{
  "nodes": [
    { "id": "a", "enterAnimation": { "type": "fadeIn", "delay": 0 } },
    { "id": "b", "enterAnimation": { "type": "fadeIn", "delay": 100 } },
    { "id": "c", "enterAnimation": { "type": "fadeIn", "delay": 200 } }
  ]
}
```

### 4. 考虑性能

- 避免同时运行过多复杂动画
- 优先使用 transform 和 opacity 属性
- 合理设置动画持续时间（通常 200-500ms）

### 5. 提供替代方案

考虑动画可能被禁用的情况，确保内容无动画时也能正常显示。

---

## 许可证

MIT
