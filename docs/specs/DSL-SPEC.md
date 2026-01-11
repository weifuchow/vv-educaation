# VVCE DSL 规范 v1.1

## 概述

VVCE DSL（Domain Specific Language）是 VV 课堂交互式课件的声明式描述语言，采用 JSON 格式。

## 设计原则

1. **声明式优先**：用数据描述行为，而非代码
2. **安全性**：禁止任意脚本执行
3. **可校验性**：基于 JSON Schema 可严格校验
4. **可扩展性**：支持自定义组件和动作
5. **确定性**：相同输入产生相同输出

## 版本历史

- `vvce.dsl.v1` - M0 版本（基础）
- `vvce.dsl.v1.1` - M1 版本（当前）- 增强样式、动画、主题支持

## 顶层结构

```json
{
  "schema": "vvce.dsl.v1",
  "meta": { ... },
  "globals": { ... },
  "resources": { ... },      // v1.1 新增：样式资源定义
  "theme": "default",        // v1.1 新增：主题配置
  "startSceneId": "s1",
  "scenes": [ ... ]
}
```

### 字段说明

#### schema（必需）

- 类型：`string`
- 值：`"vvce.dsl.v1"`
- 说明：DSL 版本标识

#### meta（必需）

课程元数据

```json
{
  "id": "course-001", // 课程唯一标识
  "version": "1.0.0", // 课程版本
  "title": "课程标题",
  "description": "课程描述",
  "author": "作者",
  "createdAt": "2024-01-01",
  "updatedAt": "2024-01-10"
}
```

#### globals（可选）

全局变量定义

```json
{
  "vars": {
    "score": 0,
    "attempt": 0,
    "nickname": ""
  }
}
```

#### resources（可选）v1.1 新增

样式资源定义，详见 [样式资源](#样式资源resources)

#### theme（可选）v1.1 新增

主题配置，详见 [主题系统](#主题系统)

#### startSceneId（必需）

- 类型：`string`
- 说明：起始场景 ID，必须在 scenes 中存在

#### scenes（必需）

- 类型：`SceneDSL[]`
- 说明：场景数组，至少包含一个场景

---

## 样式资源（resources）

v1.1 新增的样式资源系统，支持定义可复用的样式、动画和过渡效果。

```json
{
  "resources": {
    "variables": { ... },     // 样式变量
    "animations": { ... },    // 自定义动画
    "transitions": { ... },   // 自定义过渡
    "styles": { ... },        // 样式类
    "assets": [ ... ]         // 资源引用
  }
}
```

### 样式变量（variables）

定义设计 Token，支持颜色、间距、字体等。

```json
{
  "variables": {
    "colors": {
      "primary": "#4F46E5",
      "secondary": "#06B6D4",
      "success": "#10B981",
      "warning": "#F59E0B",
      "error": "#EF4444",
      "text": "#1F2937",
      "background": "#FFFFFF"
    },
    "spacing": {
      "xs": 4,
      "sm": 8,
      "md": 16,
      "lg": 24,
      "xl": 32
    },
    "fontSizes": {
      "sm": 14,
      "md": 16,
      "lg": 20,
      "xl": 24
    },
    "radii": {
      "sm": 4,
      "md": 8,
      "lg": 12,
      "full": 9999
    },
    "shadows": {
      "sm": "0 1px 2px rgba(0,0,0,0.05)",
      "md": "0 4px 6px rgba(0,0,0,0.1)",
      "lg": "0 10px 15px rgba(0,0,0,0.1)"
    }
  }
}
```

### 自定义动画（animations）

定义关键帧动画。

```json
{
  "animations": {
    "myBounce": {
      "keyframes": [
        { "offset": 0, "properties": { "translateY": 0, "scale": 1 } },
        { "offset": 50, "properties": { "translateY": -20, "scale": 1.1 } },
        { "offset": 100, "properties": { "translateY": 0, "scale": 1 } }
      ],
      "duration": 500,
      "easing": "ease-out",
      "iterations": 1
    }
  }
}
```

### 自定义过渡（transitions）

定义场景切换过渡效果。

```json
{
  "transitions": {
    "mySlide": {
      "type": "slide",
      "duration": 400,
      "easing": "ease-in-out",
      "direction": "left"
    }
  }
}
```

### 样式类（styles）

定义可复用的样式类。

```json
{
  "styles": {
    "card": {
      "base": {
        "padding": 16,
        "borderRadius": "$radii.md",
        "backgroundColor": "$colors.background",
        "boxShadow": "$shadows.md"
      },
      "hover": {
        "boxShadow": "$shadows.lg",
        "transform": { "translateY": -2 }
      }
    },
    "primaryButton": {
      "base": {
        "padding": [12, 24],
        "backgroundColor": "$colors.primary",
        "color": "#FFFFFF",
        "borderRadius": "$radii.md",
        "fontWeight": 600
      },
      "active": {
        "transform": { "scale": 0.98 }
      },
      "disabled": {
        "opacity": 0.5
      }
    }
  }
}
```

### 资源引用（assets）

定义外部资源。

```json
{
  "assets": [
    {
      "id": "avatar1",
      "type": "image",
      "url": "https://example.com/avatar.png",
      "preload": true
    },
    {
      "id": "bgMusic",
      "type": "audio",
      "url": "https://example.com/music.mp3"
    }
  ]
}
```

---

## 主题系统

v1.1 新增的主题系统，支持内置主题和自定义主题。

### 使用内置主题

```json
{
  "theme": "playful"
}
```

内置主题列表：

- `default` - 清新教育风格（默认）
- `playful` - 童趣风格，适合低龄学习者
- `academic` - 学术风格，适合专业学习
- `minimal` - 极简风格
- `vibrant` - 鲜艳活泼风格
- `dark` - 暗色主题
- `nature` - 自然风格
- `tech` - 科技风格
- `retro` - 复古风格

### 自定义主题

```json
{
  "theme": {
    "name": "myTheme",
    "extends": "default",
    "mode": "light",
    "variables": {
      "colors": {
        "primary": "#FF6B6B"
      }
    },
    "components": {
      "Button": {
        "base": {
          "borderRadius": 20
        }
      }
    }
  }
}
```

---

## 场景结构（Scene）

```json
{
  "id": "s1",
  "title": "场景标题",
  "layout": { ... },
  "style": { ... },              // v1.1 新增：场景样式
  "enterTransition": { ... },    // v1.1 新增：进入过渡
  "exitTransition": { ... },     // v1.1 新增：退出过渡
  "background": { ... },         // v1.1 新增：背景配置
  "vars": { ... },
  "nodes": [ ... ],
  "triggers": [ ... ]
}
```

### 字段说明

#### id（必需）

- 类型：`string`
- 说明：场景唯一标识

#### layout（可选）

布局配置

```json
{
  "type": "stack", // stack | grid | flex | absolute | masonry
  "padding": 16, // 内边距（支持数组 [top, right, bottom, left]）
  "gap": 12, // 间距
  "columns": 2, // grid 列数
  "rows": 3, // grid 行数
  "align": "center", // start | center | end | stretch
  "justify": "between", // start | center | end | between | around | evenly
  "reverse": false, // 反向排列
  "wrap": true // 换行
}
```

#### style（可选）v1.1 新增

场景样式定义

```json
{
  "style": {
    "backgroundColor": "#F5F5F5",
    "padding": 20
  }
}
```

#### enterTransition（可选）v1.1 新增

场景进入过渡效果

```json
{
  "enterTransition": {
    "type": "slide",
    "duration": 400,
    "easing": "ease-out",
    "direction": "left"
  }
}
```

过渡类型：

- `none` - 无过渡
- `fade` - 淡入淡出
- `slide` - 滑动
- `scale` - 缩放
- `flip` - 翻转
- `rotate` - 旋转
- `zoom` - 缩放
- `bounce` - 弹跳
- `blur` - 模糊
- `wipe` - 擦除
- `reveal` - 揭示
- `cube` - 3D 立方体
- `carousel` - 旋转木马
- `stack` - 堆叠
- `shuffle` - 洗牌

#### exitTransition（可选）v1.1 新增

场景退出过渡效果，结构同 enterTransition

#### background（可选）v1.1 新增

背景配置

```json
{
  "background": {
    "color": "#FFFFFF",
    "image": "https://example.com/bg.jpg",
    "gradient": {
      "type": "linear",
      "angle": 45,
      "colors": [
        { "color": "#FF6B6B", "position": 0 },
        { "color": "#4ECDC4", "position": 100 }
      ]
    },
    "size": "cover",
    "position": "center",
    "blur": 10,
    "overlay": "rgba(0,0,0,0.3)",
    "parallax": true
  }
}
```

#### vars（可选）

场景局部变量

#### nodes（可选）

节点（组件）数组

#### triggers（可选）

触发器数组

---

## 节点结构（Node）

```json
{
  "id": "node-id",
  "type": "ComponentType",
  "props": { ... },
  "style": { ... },
  "styleClass": "card",           // v1.1 新增：样式类
  "enterAnimation": { ... },      // v1.1 新增：进入动画
  "exitAnimation": { ... },       // v1.1 新增：退出动画
  "interactions": [ ... ],        // v1.1 新增：交互动画
  "visible": true                 // v1.1 新增：可见性
}
```

### 字段说明

#### id（必需）

- 类型：`string`
- 说明：节点唯一标识（在场景内唯一）

#### type（必需）

- 类型：`string`
- 说明：组件类型（如 `Dialog`, `QuizSingle`, `Button`）

#### props（可选）

- 类型：`object`
- 说明：组件属性，具体结构由组件类型决定

#### style（可选）v1.1 增强

内联样式定义

```json
{
  "style": {
    "width": "100%",
    "padding": [16, 24],
    "backgroundColor": "$colors.primary",
    "borderRadius": 8,
    "boxShadow": "$shadows.md",
    "transform": {
      "rotate": 5,
      "scale": 1.1
    }
  }
}
```

#### styleClass（可选）v1.1 新增

引用样式类

```json
{
  "styleClass": "card"              // 单个类
  "styleClass": ["card", "shadow"]  // 多个类
}
```

#### enterAnimation（可选）v1.1 新增

节点进入动画

```json
{
  "enterAnimation": {
    "type": "fadeIn", // 动画类型
    "duration": 300, // 持续时间(ms)
    "easing": "ease-out", // 缓动函数
    "delay": 100 // 延迟(ms)
  }
}
```

内置动画类型：

- 进入动画：`fadeIn`, `slideInLeft`, `slideInRight`, `slideInUp`, `slideInDown`, `scaleIn`, `rotateIn`, `bounceIn`, `flipInX`, `flipInY`, `zoomIn`
- 退出动画：`fadeOut`, `slideOutLeft`, `slideOutRight`, `slideOutUp`, `slideOutDown`, `scaleOut`, `rotateOut`, `bounceOut`, `flipOutX`, `flipOutY`, `zoomOut`
- 注意力动画：`pulse`, `shake`, `wobble`, `swing`, `tada`, `heartbeat`, `rubber`, `jello`
- 循环动画：`float`, `glow`

#### exitAnimation（可选）v1.1 新增

节点退出动画，结构同 enterAnimation

#### interactions（可选）v1.1 新增

交互动画定义

```json
{
  "interactions": [
    {
      "trigger": "hover",
      "animation": "pulse",
      "duration": 300
    },
    {
      "trigger": "click",
      "style": {
        "transform": { "scale": 0.95 }
      },
      "duration": 100
    }
  ]
}
```

#### visible（可选）v1.1 新增

可见性控制

```json
{
  "visible": true                   // 直接布尔值
  "visible": {                      // 条件表达式
    "op": "gt",
    "left": { "ref": "globals.vars.score" },
    "right": 0
  }
}
```

---

## 触发器结构（Trigger）

基于 ECA（Event-Condition-Action）模型。

```json
{
  "on": {
    "event": "click",
    "target": "button-id"
  },
  "if": [ ... ],
  "then": [ ... ],
  "else": [ ... ]
}
```

### 字段说明

#### on（必需）

事件匹配器

```json
{
  "event": "click", // 事件类型
  "target": "node-id" // 目标节点（可选）
}
```

#### if（可选）

条件数组，默认为 `true`

#### then（必需）

条件为真时执行的动作数组

#### else（可选）

条件为假时执行的动作数组

---

## 条件表达式（Condition）

### 比较操作符

```json
{
  "op": "equals", // equals | notEquals | gt | gte | lt | lte
  "left": { "ref": "q1.state.selected" }, // 左值
  "right": "2" // 右值
}
```

### 逻辑操作符

```json
{
  "op": "and",           // and | or | not
  "conditions": [ ... ]  // 子条件数组
}
```

### 引用表达式

```json
{ "ref": "globals.vars.score" }      // 全局变量
{ "ref": "scene.vars.temp" }         // 场景变量
{ "ref": "q1.state.selected" }       // 节点状态
```

---

## 动作定义（Action）

### 基础动作

#### gotoScene - 场景跳转

```json
{
  "action": "gotoScene",
  "sceneId": "s2",
  "transition": {
    // v1.1 新增：过渡效果覆盖
    "type": "slide",
    "direction": "right"
  }
}
```

#### setVar - 设置变量

```json
{
  "action": "setVar",
  "path": "globals.vars.score",
  "value": 100
}
```

#### incVar - 增加变量

```json
{
  "action": "incVar",
  "path": "globals.vars.attempt",
  "by": 1
}
```

#### addScore - 加分

```json
{
  "action": "addScore",
  "value": 10
}
```

#### toast - 提示消息

```json
{
  "action": "toast",
  "text": "回答正确！",
  "duration": 2000, // v1.1 新增
  "position": "bottom", // v1.1 新增：top | center | bottom
  "variant": "success", // v1.1 新增：info | success | warning | error
  "icon": "check" // v1.1 新增
}
```

#### modal - 模态框

```json
{
  "action": "modal",
  "text": "确认提交答案？",
  "title": "确认", // v1.1 新增
  "buttons": [
    // v1.1 新增
    {
      "text": "取消",
      "variant": "secondary"
    },
    {
      "text": "确认",
      "variant": "primary",
      "actions": [{ "action": "gotoScene", "sceneId": "s3" }]
    }
  ]
}
```

#### resetNode - 重置节点

```json
{
  "action": "resetNode",
  "nodeId": "q1"
}
```

### 动画动作（v1.1 新增）

#### playAnimation - 播放动画

```json
{
  "action": "playAnimation",
  "target": "node-id",
  "animation": "bounce",
  "duration": 500,
  "easing": "spring",
  "delay": 100,
  "iterations": 2
}
```

#### stopAnimation - 停止动画

```json
{
  "action": "stopAnimation",
  "target": "node-id"
}
```

### 样式动作（v1.1 新增）

#### setStyle - 设置样式

```json
{
  "action": "setStyle",
  "target": "node-id",
  "style": {
    "backgroundColor": "#FF0000",
    "transform": { "scale": 1.2 }
  },
  "animate": true,
  "duration": 300,
  "easing": "ease-out"
}
```

#### addClass - 添加样式类

```json
{
  "action": "addClass",
  "target": "node-id",
  "className": "highlighted",
  "duration": 200
}
```

#### removeClass - 移除样式类

```json
{
  "action": "removeClass",
  "target": "node-id",
  "className": "highlighted",
  "duration": 200
}
```

#### setTheme - 切换主题

```json
{
  "action": "setTheme",
  "theme": "dark",
  "duration": 500
}
```

#### showNode - 显示节点

```json
{
  "action": "showNode",
  "target": "node-id",
  "animation": "fadeIn",
  "duration": 300
}
```

#### hideNode - 隐藏节点

```json
{
  "action": "hideNode",
  "target": "node-id",
  "animation": "fadeOut",
  "duration": 300
}
```

### 流程控制（v1.1 新增）

#### parallel - 并行执行

```json
{
  "action": "parallel",
  "actions": [
    { "action": "playAnimation", "target": "a", "animation": "bounce" },
    { "action": "playAnimation", "target": "b", "animation": "shake" }
  ]
}
```

#### sequence - 顺序执行

```json
{
  "action": "sequence",
  "actions": [
    { "action": "playAnimation", "target": "a", "animation": "fadeIn" },
    { "action": "delay", "duration": 500 },
    { "action": "playAnimation", "target": "b", "animation": "fadeIn" }
  ]
}
```

#### delay - 延迟

```json
{
  "action": "delay",
  "duration": 1000
}
```

### 多媒体动作（v1.1 新增）

#### sound - 播放音效

```json
{
  "action": "sound",
  "src": "success.mp3",
  "volume": 0.8,
  "loop": false
}
```

#### haptic - 触觉反馈

```json
{
  "action": "haptic",
  "type": "success" // light | medium | heavy | success | warning | error
}
```

---

## 文本插值

支持在文本中使用 `{{path}}` 语法引用变量：

```json
"你的分数是 {{globals.vars.score}}"
```

---

## 样式属性参考

### 布局属性

| 属性           | 类型                | 说明       |
| -------------- | ------------------- | ---------- |
| width          | number/string       | 宽度       |
| height         | number/string       | 高度       |
| minWidth       | number/string       | 最小宽度   |
| maxWidth       | number/string       | 最大宽度   |
| padding        | number/string/array | 内边距     |
| margin         | number/string/array | 外边距     |
| flex           | number/string       | Flex 属性  |
| flexDirection  | string              | 方向       |
| justifyContent | string              | 主轴对齐   |
| alignItems     | string              | 交叉轴对齐 |
| gap            | number/string       | 间距       |

### 定位属性

| 属性     | 类型          | 说明     |
| -------- | ------------- | -------- |
| position | string        | 定位方式 |
| top      | number/string | 上偏移   |
| right    | number/string | 右偏移   |
| bottom   | number/string | 下偏移   |
| left     | number/string | 左偏移   |
| zIndex   | number        | 层级     |

### 背景属性

| 属性               | 类型   | 说明     |
| ------------------ | ------ | -------- |
| backgroundColor    | string | 背景色   |
| backgroundImage    | string | 背景图   |
| backgroundSize     | string | 背景尺寸 |
| backgroundPosition | string | 背景位置 |
| backgroundGradient | object | 背景渐变 |

### 边框属性

| 属性         | 类型          | 说明     |
| ------------ | ------------- | -------- |
| borderWidth  | number/string | 边框宽度 |
| borderColor  | string        | 边框颜色 |
| borderStyle  | string        | 边框样式 |
| borderRadius | number/string | 圆角     |

### 文字属性

| 属性          | 类型          | 说明     |
| ------------- | ------------- | -------- |
| color         | string        | 文字颜色 |
| fontSize      | number/string | 字号     |
| fontWeight    | number/string | 字重     |
| fontFamily    | string        | 字体     |
| lineHeight    | number/string | 行高     |
| textAlign     | string        | 对齐     |
| letterSpacing | number/string | 字间距   |

### 变换属性

```json
{
  "transform": {
    "translateX": 10,
    "translateY": 20,
    "rotate": 45,
    "scale": 1.2,
    "skewX": 5
  }
}
```

### 其他属性

| 属性       | 类型   | 说明       |
| ---------- | ------ | ---------- |
| opacity    | number | 透明度 0-1 |
| visibility | string | 可见性     |
| overflow   | string | 溢出处理   |
| boxShadow  | string | 阴影       |
| cursor     | string | 鼠标样式   |

---

## 完整示例

参见 `packages/vvce-schema/examples/demo-lesson.json`

---

## 扩展性

### 自定义组件

通过组件注册机制添加自定义组件类型。

### 自定义动作

通过动作执行器扩展机制添加自定义动作。

### 自定义主题

可以基于内置主题扩展，或完全自定义主题配置。

### 自定义动画

通过 `resources.animations` 定义自定义关键帧动画。

---

## 版本演进

### v1.1 更新内容

- ✅ 样式资源系统（variables, styles）
- ✅ 主题系统（9 种内置主题）
- ✅ 场景过渡效果（16 种过渡类型）
- ✅ 节点动画（30+ 内置动画）
- ✅ 交互动画
- ✅ 动画/样式动作
- ✅ 流程控制（parallel, sequence, delay）
- ✅ 多媒体支持（sound, haptic）

### M2 计划

- 支持子场景（Subscene）
- 支持更复杂的表达式
- 支持事件冒泡
- 支持粒子效果

---

## 许可证

MIT
