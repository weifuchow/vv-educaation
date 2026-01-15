# Course Design Skill

> 设计和生成 VVCE 交互式课程 DSL

## 触发时机

当用户提及以下内容时触发：
- "设计课程"、"创建课程"、"新课程"、"课程设计"
- "生成课件"、"制作课件"
- "design course"、"create course"
- "示例课程"、"演示课程"

## 输出目录

生成的 DSL 文件保存到：`scene-viewer/scenes/` 目录

## 设计流程

### 1. 收集课程信息

询问用户以下内容：

**基础信息：**
- 课程 ID（英文，kebab-case）
- 课程标题
- 课程描述
- 目标学习者

**内容设计：**
- 场景数量（推荐 3-8 个）
- 每个场景的类型：
  - `intro` - 引入场景
  - `content` - 内容讲解
  - `quiz` - 测验场景
  - `experiment` - 实验演示
  - `summary` - 总结场景
- 交互类型：单选、多选、拖拽、输入

**样式配置：**
- 主题选择：default | playful | academic | minimal | vibrant | dark | nature | tech | retro
- 是否需要自定义动画
- 场景过渡效果

### 2. DSL 结构模板

#### 完整课程结构（带动画和样式）

```json
{
  "schema": "vvce.dsl.v1",
  "meta": {
    "id": "course-id",
    "version": "1.0.0",
    "title": "课程标题",
    "author": "VV Education",
    "description": "课程描述"
  },
  "globals": {
    "vars": {
      "score": 0,
      "attempt": 0,
      "progress": 0
    }
  },
  "resources": {
    "variables": {
      "colors": {
        "primary": "#4F46E5",
        "secondary": "#06B6D4",
        "success": "#10B981",
        "warning": "#F59E0B",
        "error": "#EF4444"
      },
      "spacing": {
        "xs": 4,
        "sm": 8,
        "md": 16,
        "lg": 24,
        "xl": 32
      }
    },
    "animations": {
      "fadeInUp": {
        "keyframes": [
          { "offset": 0, "properties": { "opacity": 0, "translateY": 20 } },
          { "offset": 100, "properties": { "opacity": 1, "translateY": 0 } }
        ],
        "duration": 400,
        "easing": "ease-out"
      },
      "pulse": {
        "keyframes": [
          { "offset": 0, "properties": { "scale": 1 } },
          { "offset": 50, "properties": { "scale": 1.05 } },
          { "offset": 100, "properties": { "scale": 1 } }
        ],
        "duration": 1000,
        "iterations": -1
      },
      "shake": {
        "keyframes": [
          { "offset": 0, "properties": { "translateX": 0 } },
          { "offset": 25, "properties": { "translateX": -10 } },
          { "offset": 50, "properties": { "translateX": 10 } },
          { "offset": 75, "properties": { "translateX": -5 } },
          { "offset": 100, "properties": { "translateX": 0 } }
        ],
        "duration": 400,
        "easing": "ease-out"
      },
      "bounceIn": {
        "keyframes": [
          { "offset": 0, "properties": { "scale": 0, "opacity": 0 } },
          { "offset": 60, "properties": { "scale": 1.1, "opacity": 1 } },
          { "offset": 80, "properties": { "scale": 0.95 } },
          { "offset": 100, "properties": { "scale": 1 } }
        ],
        "duration": 600,
        "easing": "ease-out"
      },
      "celebrate": {
        "keyframes": [
          { "offset": 0, "properties": { "scale": 1, "rotate": 0 } },
          { "offset": 25, "properties": { "scale": 1.2, "rotate": -10 } },
          { "offset": 50, "properties": { "scale": 1.2, "rotate": 10 } },
          { "offset": 75, "properties": { "scale": 1.1, "rotate": -5 } },
          { "offset": 100, "properties": { "scale": 1, "rotate": 0 } }
        ],
        "duration": 800,
        "easing": "ease-out"
      }
    },
    "transitions": {
      "slideLeft": {
        "type": "slide",
        "direction": "left",
        "duration": 400,
        "easing": "ease-in-out"
      },
      "fade": {
        "type": "fade",
        "duration": 300,
        "easing": "ease"
      },
      "zoom": {
        "type": "zoom",
        "duration": 400,
        "easing": "ease-out"
      }
    },
    "styles": {
      "card": {
        "base": {
          "padding": 16,
          "borderRadius": 12,
          "backgroundColor": "#FFFFFF",
          "boxShadow": "0 4px 6px rgba(0,0,0,0.1)"
        }
      },
      "button-primary": {
        "base": {
          "padding": [12, 24],
          "borderRadius": 8,
          "backgroundColor": "$colors.primary",
          "color": "#FFFFFF",
          "fontSize": 16,
          "fontWeight": 600
        },
        "hover": {
          "backgroundColor": "#4338CA",
          "scale": 1.02
        },
        "active": {
          "scale": 0.98
        }
      },
      "button-secondary": {
        "base": {
          "padding": [10, 20],
          "borderRadius": 8,
          "backgroundColor": "transparent",
          "borderWidth": 2,
          "borderColor": "$colors.primary",
          "color": "$colors.primary"
        }
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
        "text": "欢迎来到{{globals.vars.courseName}}！",
        "avatar": "teacher"
      },
      "style": {
        "animation": "fadeInUp"
      }
    },
    {
      "id": "start-btn",
      "type": "Button",
      "props": {
        "text": "开始学习"
      },
      "styleClass": ["button-primary"],
      "style": {
        "animation": "bounceIn",
        "animationDelay": 500
      }
    }
  ],
  "triggers": [
    {
      "on": { "event": "click", "target": "start-btn" },
      "then": [
        { "action": "playAnimation", "target": "start-btn", "animation": "pulse" },
        { "action": "delay", "ms": 300 },
        { "action": "gotoScene", "sceneId": "content-1" }
      ]
    }
  ],
  "transition": {
    "type": "fade",
    "duration": 300
  }
}
```

#### 内容场景 (content)

```json
{
  "id": "content-1",
  "layout": {
    "type": "stack",
    "direction": "vertical",
    "gap": 20,
    "padding": 24
  },
  "nodes": [
    {
      "id": "title",
      "type": "Dialog",
      "props": {
        "speaker": "VV老师",
        "text": "第一部分：核心概念"
      },
      "style": {
        "animation": "slideInLeft"
      }
    },
    {
      "id": "content-text",
      "type": "Dialog",
      "props": {
        "text": "这里是内容讲解..."
      },
      "style": {
        "animation": "fadeInUp",
        "animationDelay": 200
      }
    },
    {
      "id": "next-btn",
      "type": "Button",
      "props": {
        "text": "下一步 →"
      },
      "styleClass": ["button-primary"]
    }
  ],
  "triggers": [
    {
      "on": { "event": "click", "target": "next-btn" },
      "then": [
        { "action": "gotoScene", "sceneId": "quiz-1" }
      ]
    }
  ],
  "transition": {
    "type": "slide",
    "direction": "left",
    "duration": 400
  }
}
```

#### 测验场景 (quiz) - 单选

```json
{
  "id": "quiz-1",
  "layout": {
    "type": "stack",
    "direction": "vertical",
    "gap": 16,
    "padding": 24
  },
  "vars": {
    "feedbackShown": false
  },
  "nodes": [
    {
      "id": "quiz-dialog",
      "type": "Dialog",
      "props": {
        "speaker": "VV老师",
        "text": "来检验一下学习成果吧！"
      },
      "style": {
        "animation": "fadeInUp"
      }
    },
    {
      "id": "quiz-question",
      "type": "QuizSingle",
      "props": {
        "question": "题目内容",
        "options": ["选项A", "选项B", "选项C", "选项D"],
        "answerKey": "选项B"
      },
      "style": {
        "animation": "fadeInUp",
        "animationDelay": 200
      }
    },
    {
      "id": "submit-btn",
      "type": "Button",
      "props": {
        "text": "提交答案"
      },
      "styleClass": ["button-primary"],
      "style": {
        "animation": "bounceIn",
        "animationDelay": 400
      }
    },
    {
      "id": "anim-test-correct",
      "type": "Button",
      "props": {
        "text": "测试正确动画"
      },
      "styleClass": ["button-secondary"],
      "visible": true
    },
    {
      "id": "anim-test-wrong",
      "type": "Button",
      "props": {
        "text": "测试错误动画"
      },
      "styleClass": ["button-secondary"],
      "visible": true
    },
    {
      "id": "anim-test-celebrate",
      "type": "Button",
      "props": {
        "text": "测试庆祝动画"
      },
      "styleClass": ["button-secondary"],
      "visible": true
    }
  ],
  "triggers": [
    {
      "on": { "event": "click", "target": "submit-btn" },
      "if": [
        {
          "op": "equals",
          "left": { "ref": "nodes.quiz-question.selected" },
          "right": "选项B"
        }
      ],
      "then": [
        { "action": "addScore", "value": 10 },
        { "action": "playAnimation", "target": "quiz-question", "animation": "celebrate" },
        { "action": "toast", "text": "回答正确！+10分" },
        { "action": "delay", "ms": 1500 },
        { "action": "gotoScene", "sceneId": "summary" }
      ],
      "else": [
        { "action": "incVar", "path": "globals.vars.attempt", "by": 1 },
        { "action": "playAnimation", "target": "quiz-question", "animation": "shake" },
        { "action": "toast", "text": "再想想～" }
      ]
    },
    {
      "on": { "event": "click", "target": "anim-test-correct" },
      "then": [
        { "action": "playAnimation", "target": "quiz-question", "animation": "bounceIn" },
        { "action": "toast", "text": "播放 bounceIn 动画" }
      ]
    },
    {
      "on": { "event": "click", "target": "anim-test-wrong" },
      "then": [
        { "action": "playAnimation", "target": "quiz-question", "animation": "shake" },
        { "action": "toast", "text": "播放 shake 动画" }
      ]
    },
    {
      "on": { "event": "click", "target": "anim-test-celebrate" },
      "then": [
        { "action": "playAnimation", "target": "quiz-question", "animation": "celebrate" },
        { "action": "toast", "text": "播放 celebrate 动画" }
      ]
    }
  ]
}
```

#### 总结场景 (summary)

```json
{
  "id": "summary",
  "layout": {
    "type": "stack",
    "direction": "vertical",
    "gap": 20,
    "padding": 24,
    "align": "center"
  },
  "nodes": [
    {
      "id": "complete-dialog",
      "type": "Dialog",
      "props": {
        "speaker": "VV老师",
        "text": "恭喜完成学习！你的最终得分：{{globals.vars.score}}分"
      },
      "style": {
        "animation": "bounceIn"
      }
    },
    {
      "id": "restart-btn",
      "type": "Button",
      "props": {
        "text": "重新学习"
      },
      "styleClass": ["button-secondary"]
    },
    {
      "id": "test-all-animations",
      "type": "Button",
      "props": {
        "text": "测试所有动画"
      },
      "styleClass": ["button-primary"]
    }
  ],
  "triggers": [
    {
      "on": { "event": "click", "target": "restart-btn" },
      "then": [
        { "action": "setVar", "path": "globals.vars.score", "value": 0 },
        { "action": "setVar", "path": "globals.vars.attempt", "value": 0 },
        { "action": "gotoScene", "sceneId": "intro" }
      ]
    },
    {
      "on": { "event": "click", "target": "test-all-animations" },
      "then": [
        { "action": "playAnimation", "target": "complete-dialog", "animation": "fadeInUp" },
        { "action": "delay", "ms": 500 },
        { "action": "playAnimation", "target": "complete-dialog", "animation": "pulse" },
        { "action": "delay", "ms": 1200 },
        { "action": "playAnimation", "target": "complete-dialog", "animation": "shake" },
        { "action": "delay", "ms": 500 },
        { "action": "playAnimation", "target": "complete-dialog", "animation": "celebrate" }
      ]
    }
  ],
  "onEnter": [
    { "action": "playAnimation", "target": "complete-dialog", "animation": "bounceIn" }
  ]
}
```

### 4. 动画验证按钮模板

为了方便快速验证动画效果，每个场景可添加测试按钮组：

```json
{
  "id": "animation-test-panel",
  "type": "Container",
  "props": {
    "title": "动画测试面板"
  },
  "style": {
    "position": "fixed",
    "bottom": 20,
    "right": 20,
    "padding": 12,
    "backgroundColor": "rgba(0,0,0,0.8)",
    "borderRadius": 8
  },
  "children": [
    {
      "id": "test-fade",
      "type": "Button",
      "props": { "text": "fadeIn" },
      "style": { "margin": 4 }
    },
    {
      "id": "test-bounce",
      "type": "Button",
      "props": { "text": "bounce" },
      "style": { "margin": 4 }
    },
    {
      "id": "test-shake",
      "type": "Button",
      "props": { "text": "shake" },
      "style": { "margin": 4 }
    },
    {
      "id": "test-pulse",
      "type": "Button",
      "props": { "text": "pulse" },
      "style": { "margin": 4 }
    },
    {
      "id": "test-celebrate",
      "type": "Button",
      "props": { "text": "celebrate" },
      "style": { "margin": 4 }
    }
  ]
}
```

对应的 triggers：

```json
[
  {
    "on": { "event": "click", "target": "test-fade" },
    "then": [
      { "action": "playAnimation", "target": "main-content", "animation": "fadeInUp" }
    ]
  },
  {
    "on": { "event": "click", "target": "test-bounce" },
    "then": [
      { "action": "playAnimation", "target": "main-content", "animation": "bounceIn" }
    ]
  },
  {
    "on": { "event": "click", "target": "test-shake" },
    "then": [
      { "action": "playAnimation", "target": "main-content", "animation": "shake" }
    ]
  },
  {
    "on": { "event": "click", "target": "test-pulse" },
    "then": [
      { "action": "playAnimation", "target": "main-content", "animation": "pulse" }
    ]
  },
  {
    "on": { "event": "click", "target": "test-celebrate" },
    "then": [
      { "action": "playAnimation", "target": "main-content", "animation": "celebrate" }
    ]
  }
]
```

### 5. 内置动画库

#### 入场动画
| 名称 | 描述 | 用途 |
|------|------|------|
| `fadeIn` | 淡入 | 通用入场 |
| `fadeInUp` | 从下淡入 | 内容展示 |
| `fadeInDown` | 从上淡入 | 标题入场 |
| `slideInLeft` | 左侧滑入 | 下一步内容 |
| `slideInRight` | 右侧滑入 | 返回内容 |
| `bounceIn` | 弹跳入场 | 强调元素 |
| `zoomIn` | 缩放入场 | 图片展示 |

#### 强调动画
| 名称 | 描述 | 用途 |
|------|------|------|
| `pulse` | 脉冲 | 提示点击 |
| `shake` | 抖动 | 错误反馈 |
| `bounce` | 弹跳 | 吸引注意 |
| `wobble` | 摇摆 | 趣味强调 |
| `tada` | 惊喜 | 完成奖励 |
| `heartbeat` | 心跳 | 重要提示 |
| `celebrate` | 庆祝 | 正确答案 |

#### 退场动画
| 名称 | 描述 |
|------|------|
| `fadeOut` | 淡出 |
| `slideOutLeft` | 左侧滑出 |
| `slideOutRight` | 右侧滑出 |
| `zoomOut` | 缩放退出 |

### 6. 布局系统

#### Stack 布局（线性）

```json
{
  "layout": {
    "type": "stack",
    "direction": "vertical",  // vertical | horizontal
    "gap": 16,
    "padding": 24,
    "align": "center",        // start | center | end | stretch
    "justify": "start"        // start | center | end | space-between | space-around
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

#### Absolute 布局（自由定位）

```json
{
  "layout": {
    "type": "absolute"
  }
}
```

节点使用位置样式：
```json
{
  "style": {
    "position": "absolute",
    "top": 100,
    "left": 50,
    "width": 200
  }
}
```

### 7. 生成流程

1. **收集需求** - 通过对话了解课程设计需求
2. **选择模板** - 根据场景类型选择合适模板
3. **组装 DSL** - 将各场景组装成完整课程
4. **添加测试按钮** - 在关键场景添加动画测试按钮
5. **保存文件** - 写入 `scene-viewer/scenes/{course-id}.json`
6. **验证** - 使用 dsl-validate 验证生成的 DSL

## 输出示例

```
=== 课程设计完成 ===

文件已创建: scene-viewer/scenes/my-course.json

课程概览:
- ID: my-course
- 标题: 我的课程
- 场景数: 4
- 主题: playful

场景列表:
1. intro - 欢迎引入
2. content-1 - 核心概念
3. quiz-1 - 知识测验
4. summary - 总结回顾

内置动画测试按钮:
- 每个场景包含动画测试按钮
- 可快速验证 fadeIn, bounce, shake, pulse, celebrate 等效果

下一步:
1. 使用 scene-viewer 预览课程
2. 运行 "验证 DSL" 检查课程完整性
3. 根据需要调整内容和动画
```

## 快速生成命令

### 生成示例课程（含所有动画测试）

```
用户: 设计一个演示课程，包含所有动画效果

AI: 好的，我来为你生成一个演示课程，包含完整的动画测试功能...
```

### 生成特定主题课程

```
用户: 创建一个数学课程，3个场景，playful 主题

AI: 好的，让我为你设计这个数学课程...
```

## 注意事项

- 课程 ID 使用 kebab-case
- 确保所有 sceneId 引用正确
- 动画名称区分大小写
- 测试按钮仅用于开发验证，正式发布前可移除
- 场景过渡时间建议 300-500ms
- 动画时长建议 300-800ms
