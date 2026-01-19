# Course Design Skill

> 设计和生成 VVCE 交互式课程 DSL

## 触发时机

当用户提及以下内容时触发：
- "设计课程"、"创建课程"、"新课程"、"课程设计"
- "生成课件"、"制作课件"
- "design course"、"create course"
- "示例课程"、"演示课程"

## 输出目录

- **课程 DSL**: `scene-viewer/scenes/` 目录
- **效果包**: `scene-viewer/content-packs/effects/` 目录
- **可视化**: `scene-viewer/content-packs/visualizations/` 目录

## 内容包架构

内容资源采用 **双层架构**：

```
scene-viewer/content-packs/
├── manifest.json              # 内容包清单
├── effects/                   # 关键帧动画（CSS动画，JSON定义）
│   ├── basic.json             # 基础动画包 (内置)
│   ├── science.json           # 科学动画包
│   └── math.json              # 数学动画包
└── visualizations/            # 交互式可视化（Canvas/JS）
    └── math/
        └── bezier-curve/      # 贝塞尔曲线可视化
            ├── renderer.js
            └── styles.css
```

### 两类动画

| 类型 | 存储 | 运行 | 复杂度 | 适用场景 |
|------|------|------|--------|----------|
| **关键帧动画** | JSON | CSS Animation | 低 | 淡入、弹跳、闪烁等简单效果 |
| **交互式可视化** | JS + CSS | Canvas API | 高 | 贝塞尔曲线、函数图像、物理模拟 |

### 架构特点

| 特性 | 说明 |
|------|------|
| **AI 友好** | 只需引用动画名称 + 传参数，不编写 keyframes |
| **质量可控** | 所有动画由专业团队预先实现 |
| **热更新** | 动画包可独立更新，无需重新发布前端 |
| **按需加载** | 只加载课程需要的动画包 |
| **参数化** | 支持参数插值定制动画效果 |
| **TypeScript** | 核心渲染库提供完整类型定义 |

## 关键帧动画包

### @vvce/basic (内置基础动画)

无需在 imports 中声明，自动加载。

#### 入场动画 (entrance)
| 名称 | 描述 | 参数 |
|------|------|------|
| `fadeIn` | 淡入 | duration |
| `slideInLeft` | 从左滑入 | distance |
| `slideInRight` | 从右滑入 | distance |
| `slideInUp` | 从下滑入 | distance |
| `scaleIn` | 缩放入场 | startScale |
| `bounceIn` | 弹跳入场 | - |

#### 退场动画 (exit)
| 名称 | 描述 |
|------|------|
| `fadeOut` | 淡出 |

#### 强调动画 (attention)
| 名称 | 描述 | 参数 | 推荐用途 |
|------|------|------|----------|
| `pulse` | 脉冲 | intensity | 提示可点击 |
| `shake` | 抖动 | distance | **错误反馈** |

#### 循环动画 (loop)
| 名称 | 描述 | 参数 |
|------|------|------|
| `float` | 漂浮 | distance |
| `rotate` | 旋转 | degrees |

### @vvce/science (科学动画包)

需要在 imports 中声明：`{ "pack": "@vvce/science" }`

| 名称 | 描述 | 参数 | 推荐用途 |
|------|------|------|----------|
| `@science/orbit` | 椭圆轨道运动 | radiusX, radiusY, clockwise | 行星公转 |
| `@science/wave` | 波浪运动 | amplitude, horizontal | 声波、水波 |
| `@science/vibrate` | 分子振动 | intensity | 热运动 |
| `@science/spiral` | 螺旋运动 | startRadius, endRadius, turns | 银河系 |
| `@science/pendulum` | 钟摆运动 | angle | 摆钟 |
| `@science/glow` | 发光效果 | color, intensity | 恒星、能量 |
| `@science/expand` | 扩散效果 | scale | 爆炸、大爆炸 |
| `@science/collapse` | 坍缩效果 | scale | 黑洞、引力 |

### @vvce/math (数学动画包)

需要在 imports 中声明：`{ "pack": "@vvce/math" }`

| 名称 | 描述 | 参数 | 推荐用途 |
|------|------|------|----------|
| `@math/countUp` | 数字滚动 | steps | 计数 |
| `@math/drawLine` | 路径绘制 | length | 几何作图 |
| `@math/morphShape` | 形状变换 | scaleX, scaleY | 变换演示 |
| `@math/rotateShape` | 形状旋转 | degrees, steps | 对称性 |
| `@math/flipHorizontal` | 水平翻转 | - | 反射 |
| `@math/flipVertical` | 垂直翻转 | - | 反射 |
| `@math/highlight` | 高亮强调 | color | 重点标记 |
| `@math/progressFill` | 进度填充 | percent | 进度条 |

## 交互式可视化

复杂交互动画使用 Canvas 实现，存放在 `visualizations/` 目录：

### 可用可视化

| 类型 | 描述 | 参数 |
|------|------|------|
| `interactive/math.bezier-curve` | 贝塞尔曲线 | controlPoints, showConstruction, autoplay |

### 在 DSL 中使用

```json
{
  "id": "bezier-demo",
  "type": "Animation",
  "props": {
    "type": "interactive/math.bezier-curve",
    "autoplay": false,
    "params": {
      "showConstruction": true,
      "showGrid": true,
      "controlPoints": [
        [100, 400],
        [200, 100],
        [400, 100],
        [500, 400]
      ]
    }
  }
}
```

### 支持的类型格式

以下格式等效：
- `interactive/math.bezier-curve` (推荐)
- `math.bezier-curve` (简写)
- `@vvce/math/bezier-curve` (包格式)

## 双输出系统

课程创建时可生成两个 JSON：

### course.dsl.json (课程 DSL)

引用已有动画和可视化。

### extensions.json (扩展定义)

当内置库不满足需求时，定义新动画：

```json
{
  "schema": "vvce.animation-pack.v1",
  "keyframes": [
    {
      "id": "custom.highlightPath",
      "keyframes": [
        { "offset": 0, "properties": { "strokeWidth": 2, "opacity": 0.5 } },
        { "offset": 50, "properties": { "strokeWidth": 4, "opacity": 1 } },
        { "offset": 100, "properties": { "strokeWidth": 2, "opacity": 0.5 } }
      ],
      "duration": 1000,
      "iterations": -1
    }
  ],
  "interactive": [
    {
      "id": "custom.specialCurve",
      "type": "interactive",
      "status": "needs-development",
      "description": "需要开发：特殊曲线动画",
      "requirements": ["显示自定义曲线", "支持拖拽控制点"],
      "suggestedBase": "math.bezier-curve"
    }
  ]
}
```

## 设计流程

### 1. 收集课程信息

询问用户以下内容：

**基础信息：**
- 课程 ID（英文，kebab-case）
- 课程标题
- 课程描述
- 目标学习者
- 学科分类：physics | geography | math | chemistry | biology

**内容设计：**
- 场景数量（推荐 3-8 个）
- 每个场景的类型：
  - `intro` - 引入场景
  - `content` - 内容讲解
  - `quiz` - 测验场景
  - `summary` - 总结场景
- 交互类型：单选、多选、拖拽、输入

**样式配置：**
- 主题选择：default | playful | academic | minimal | vibrant | dark | nature | tech | retro
- 需要的动画包：basic(内置)、science、math
- 是否需要交互式可视化
- 场景过渡效果

### 2. DSL 结构模板

#### 完整课程结构

```json
{
  "schema": "vvce.dsl.v1",
  "meta": {
    "id": "course-id",
    "version": "1.0.0",
    "title": "课程标题",
    "author": "VV Education",
    "description": "课程描述",
    "category": "physics"
  },

  "imports": [
    { "pack": "@vvce/science" },
    { "pack": "@vvce/math" }
  ],

  "globals": {
    "vars": {
      "score": 0,
      "attempt": 0,
      "progress": 0
    }
  },

  "resources": {
    "styles": {
      "card": {
        "padding": 16,
        "borderRadius": 12,
        "backgroundColor": "#FFFFFF",
        "boxShadow": "0 4px 6px rgba(0,0,0,0.1)"
      }
    }
  },

  "theme": "playful",
  "startSceneId": "intro",
  "scenes": []
}
```

### 3. 场景模板库

#### 引入场景 (intro)

```json
{
  "id": "intro",
  "layout": {
    "type": "stack",
    "direction": "vertical",
    "gap": 16,
    "padding": 24,
    "align": "center"
  },
  "nodes": [
    {
      "id": "welcome-dialog",
      "type": "Dialog",
      "props": {
        "speaker": "VV老师",
        "text": "欢迎来到本课程！"
      },
      "enterAnimation": {
        "type": "fadeIn",
        "duration": 600
      }
    },
    {
      "id": "start-btn",
      "type": "Button",
      "props": { "text": "开始学习" },
      "enterAnimation": {
        "type": "bounceIn",
        "delay": 300
      }
    }
  ],
  "triggers": [
    {
      "on": { "event": "click", "target": "start-btn" },
      "then": [
        { "action": "gotoScene", "sceneId": "content-1" }
      ]
    }
  ],
  "transition": { "type": "fade", "duration": 300 }
}
```

#### 内容场景 (content) - 带动画演示

```json
{
  "id": "content-1",
  "layout": { "type": "stack", "direction": "vertical", "gap": 16, "padding": 24 },
  "nodes": [
    {
      "id": "title",
      "type": "Dialog",
      "props": { "speaker": "VV老师", "text": "让我们了解太阳系的运动" },
      "enterAnimation": { "type": "fadeIn" }
    },
    {
      "id": "sun",
      "type": "Dialog",
      "props": { "text": "☀️ 太阳" },
      "enterAnimation": { "type": "scaleIn", "delay": 200 },
      "animation": {
        "type": "@science/glow",
        "params": { "color": "#ffcc00", "intensity": 20 }
      }
    },
    {
      "id": "earth",
      "type": "Dialog",
      "props": { "text": "🌍 地球" },
      "enterAnimation": { "type": "fadeIn", "delay": 400 },
      "animation": {
        "type": "@science/orbit",
        "params": { "radiusX": 150, "radiusY": 100 },
        "duration": 8000
      }
    },
    {
      "id": "next-btn",
      "type": "Button",
      "props": { "text": "继续 →" },
      "enterAnimation": { "type": "slideInUp", "delay": 600 }
    }
  ],
  "triggers": [
    {
      "on": { "event": "click", "target": "next-btn" },
      "then": [
        { "action": "gotoScene", "sceneId": "quiz-1" }
      ]
    }
  ]
}
```

#### 交互式可视化场景

```json
{
  "id": "bezier-demo",
  "layout": { "type": "stack", "direction": "vertical", "gap": 16, "padding": 24 },
  "nodes": [
    {
      "id": "intro-dialog",
      "type": "Dialog",
      "props": {
        "speaker": "VV老师",
        "text": "贝塞尔曲线是计算机图形学的基础！试着拖动控制点看看效果。"
      },
      "enterAnimation": { "type": "fadeIn" }
    },
    {
      "id": "bezier-animation",
      "type": "Animation",
      "props": {
        "type": "interactive/math.bezier-curve",
        "autoplay": false,
        "params": {
          "showConstruction": true,
          "showGrid": true,
          "curveColor": "#4ecdc4",
          "controlPointColor": "#ff6b6b"
        }
      }
    },
    {
      "id": "next-btn",
      "type": "Button",
      "props": { "text": "继续学习" },
      "enterAnimation": { "type": "slideInUp", "delay": 300 }
    }
  ],
  "triggers": [
    {
      "on": { "event": "click", "target": "next-btn" },
      "then": [
        { "action": "gotoScene", "sceneId": "quiz-1" }
      ]
    }
  ]
}
```

#### 测验场景 (quiz)

```json
{
  "id": "quiz-1",
  "layout": { "type": "stack", "direction": "vertical", "gap": 16, "padding": 24 },
  "nodes": [
    {
      "id": "quiz-dialog",
      "type": "Dialog",
      "props": { "speaker": "VV老师", "text": "来检验一下学习成果吧！" },
      "enterAnimation": { "type": "fadeIn" }
    },
    {
      "id": "quiz-question",
      "type": "QuizSingle",
      "props": {
        "question": "地球绕太阳公转一周需要多长时间？",
        "options": ["一天", "一个月", "一年", "一百年"],
        "answerKey": "一年"
      },
      "enterAnimation": { "type": "slideInLeft", "delay": 200 }
    },
    {
      "id": "submit-btn",
      "type": "Button",
      "props": { "text": "提交答案" },
      "enterAnimation": { "type": "bounceIn", "delay": 400 }
    }
  ],
  "triggers": [
    {
      "on": { "event": "click", "target": "submit-btn" },
      "if": [
        {
          "op": "equals",
          "left": { "ref": "nodes.quiz-question.selected" },
          "right": "一年"
        }
      ],
      "then": [
        { "action": "addScore", "value": 10 },
        { "action": "playAnimation", "target": "quiz-question", "animation": "pulse", "params": { "intensity": 1.2 } },
        { "action": "toast", "text": "回答正确！+10分" },
        { "action": "delay", "ms": 1500 },
        { "action": "gotoScene", "sceneId": "summary" }
      ],
      "else": [
        { "action": "incVar", "path": "globals.vars.attempt", "by": 1 },
        { "action": "playAnimation", "target": "quiz-question", "animation": "shake" },
        { "action": "toast", "text": "再想想～" }
      ]
    }
  ]
}
```

#### 总结场景 (summary)

```json
{
  "id": "summary",
  "layout": { "type": "stack", "direction": "vertical", "gap": 16, "padding": 24 },
  "nodes": [
    {
      "id": "summary-title",
      "type": "Conclusion",
      "props": {
        "title": "课程完成！",
        "text": "恭喜你完成了本课程的学习！\n\n你的得分：{{globals.vars.score}} 分"
      },
      "enterAnimation": { "type": "scaleIn" }
    },
    {
      "id": "restart-btn",
      "type": "Button",
      "props": { "text": "重新学习" },
      "enterAnimation": { "type": "slideInUp", "delay": 500 },
      "animation": {
        "type": "float",
        "params": { "distance": 5 }
      }
    }
  ],
  "triggers": [
    {
      "on": { "event": "click", "target": "restart-btn" },
      "then": [
        { "action": "setVar", "path": "globals.vars.score", "value": 0 },
        { "action": "gotoScene", "sceneId": "intro" }
      ]
    }
  ]
}
```

### 4. 动画使用方式

#### 入场动画 (enterAnimation)

节点加载时播放一次：

```json
{
  "id": "element",
  "type": "Dialog",
  "props": { "text": "内容" },
  "enterAnimation": {
    "type": "fadeIn",
    "duration": 500,
    "delay": 100,
    "easing": "ease-out"
  }
}
```

#### 持续动画 (animation)

节点加载后持续播放：

```json
{
  "id": "planet",
  "type": "Dialog",
  "props": { "text": "🌍" },
  "animation": {
    "type": "@science/orbit",
    "params": { "radiusX": 100, "radiusY": 80 },
    "duration": 5000,
    "iterations": -1
  }
}
```

#### 动作触发动画 (playAnimation)

通过 trigger 触发动画：

```json
{
  "triggers": [{
    "on": { "event": "click", "target": "btn" },
    "then": [
      {
        "action": "playAnimation",
        "target": "element",
        "animation": "shake",
        "params": { "distance": 15 }
      }
    ]
  }]
}
```

### 5. 布局系统

#### Stack 布局（线性）
```json
{
  "layout": {
    "type": "stack",
    "direction": "vertical",
    "gap": 16,
    "padding": 24,
    "align": "center",
    "justify": "start"
  }
}
```

#### Grid 布局
```json
{
  "layout": {
    "type": "grid",
    "columns": 2,
    "gap": 16,
    "padding": 24
  }
}
```

### 6. 生成流程

1. **收集需求** - 通过对话了解课程设计需求
2. **选择模板** - 根据场景类型选择合适模板
3. **声明动画包** - 在 imports 中声明需要的动画包
4. **引用动画** - 使用 `enterAnimation` 和 `animation` 属性
5. **添加可视化** - 如需交互式可视化，使用 Animation 组件
6. **组装 DSL** - 将各场景组装成完整课程
7. **保存文件** - 写入 `scene-viewer/scenes/{course-id}.json`
8. **验证** - 使用 dsl-validate 验证生成的 DSL

### 7. 新增动画到效果包

如需扩展动画库：

1. **编辑效果包 JSON** (`scene-viewer/content-packs/effects/{pack}.json`)
2. **定义新动画**:
```json
{
  "newAnimation": {
    "name": "newAnimation",
    "description": "动画描述",
    "category": "motion",
    "tags": ["tag1", "tag2"],
    "params": [
      { "name": "param1", "type": "number", "default": 100 }
    ],
    "keyframes": [
      { "offset": 0, "properties": { "translateX": 0 } },
      { "offset": 100, "properties": { "translateX": "${param1}" } }
    ],
    "duration": 1000,
    "easing": "ease-out"
  }
}
```

## 输出示例

```
=== 课程设计完成 ===

文件已创建: scene-viewer/scenes/bezier-intro.json

课程概览:
- ID: bezier-intro
- 标题: 贝塞尔曲线入门
- 学科: math
- 场景数: 4
- 主题: academic

引用的动画包:
- @vvce/basic (内置)
- @vvce/math

使用的动画:
- 入场: fadeIn, slideInLeft, scaleIn, bounceIn
- 持续: float
- 交互: shake, pulse

交互式可视化:
- interactive/math.bezier-curve

场景列表:
1. intro - 课程引入
2. content-1 - 贝塞尔曲线演示
3. quiz-1 - 知识测验
4. summary - 总结

下一步:
1. 使用 scene-viewer 预览课程
2. 运行 "验证 DSL" 检查课程完整性
```

## 注意事项

- 基础动画 (fadeIn, shake 等) 无需前缀，直接使用名称
- 科学/数学动画使用 `@science/xxx` 或 `@math/xxx` 格式
- 需要科学/数学动画时，必须在 `imports` 中声明对应的包
- 交互式可视化使用 `interactive/subject.name` 格式
- 课程 ID 使用 kebab-case
- 确保所有 sceneId 引用正确
- 场景过渡时间建议 300-500ms
- 动画时长建议 300-2000ms
- 持续动画使用 `iterations: -1` 表示无限循环
