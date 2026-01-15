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
- **动画定义**: `packages/vvce-animations/src/{category}/` 目录

## 动画库结构

动画资源保存在 `packages/vvce-animations/` 目录，按学科分类：

```
packages/vvce-animations/src/
├── common/                    # 通用 UI 动画效果
│   └── effects/
│       ├── types.ts          # 类型定义
│       ├── entrance.ts       # 入场动画 (17个)
│       ├── emphasis.ts       # 强调动画 (15个)
│       ├── exit.ts           # 退场动画 (15个)
│       └── index.ts          # 导出
├── physics/                   # 物理实验动画
│   └── pisa-tower/           # 比萨斜塔实验
├── geography/                 # 地理动画
│   └── earth-system/         # 地球系统
├── math/                      # 数学动画
│   ├── bezier-curve/         # 贝塞尔曲线
│   └── index.ts
├── chemistry/                 # 化学动画（预留）
├── biology/                   # 生物动画（预留）
└── index.ts                   # 主入口
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
  - `experiment` - 实验演示
  - `summary` - 总结场景
- 交互类型：单选、多选、拖拽、输入

**样式配置：**
- 主题选择：default | playful | academic | minimal | vibrant | dark | nature | tech | retro
- 是否需要自定义动画
- 场景过渡效果

### 2. 动画库使用

#### 引用动画库

```typescript
import {
  // 通用动画效果
  fadeIn, fadeInUp, bounceIn, zoomIn,
  pulse, shake, celebrate, tada,
  fadeOut, slideOutLeft,
  // 注册表
  effectsRegistry,
  getEffect,
  // 学科动画
  pisaTowerModule,
  earthSystemModule,
} from '@vv-education/vvce-animations';
```

#### 通用动画效果 (common)

##### 入场动画 (entrance) - 17 个
| ID | 名称 | 描述 | 推荐用途 |
|----|------|------|----------|
| `common.fadeIn` | 淡入 | 从透明到不透明 | 通用入场 |
| `common.fadeInUp` | 向上淡入 | 从下方淡入 | 内容展示 |
| `common.fadeInDown` | 向下淡入 | 从上方淡入 | 标题入场 |
| `common.fadeInLeft` | 从左淡入 | 从左侧淡入 | 列表项 |
| `common.fadeInRight` | 从右淡入 | 从右侧淡入 | 列表项 |
| `common.slideInLeft` | 左侧滑入 | 从左侧滑入 | 下一步内容 |
| `common.slideInRight` | 右侧滑入 | 从右侧滑入 | 返回内容 |
| `common.slideInUp` | 底部滑入 | 从底部滑入 | 弹窗 |
| `common.slideInDown` | 顶部滑入 | 从顶部滑入 | 通知 |
| `common.bounceIn` | 弹跳入场 | 弹跳效果 | 强调元素 |
| `common.bounceInUp` | 向上弹跳入场 | 从底部弹跳 | 重要提示 |
| `common.bounceInDown` | 向下弹跳入场 | 从顶部弹跳 | 警告 |
| `common.zoomIn` | 缩放入场 | 从小到大 | 图片展示 |
| `common.zoomInUp` | 向上缩放入场 | 从底部缩放 | 卡片 |
| `common.rotateIn` | 旋转入场 | 旋转进入 | 特效 |
| `common.flipInX` | X轴翻转入场 | 沿X轴翻转 | 卡片翻转 |
| `common.flipInY` | Y轴翻转入场 | 沿Y轴翻转 | 卡片翻转 |

##### 强调动画 (emphasis) - 15 个
| ID | 名称 | 描述 | 推荐用途 |
|----|------|------|----------|
| `common.pulse` | 脉冲 | 脉冲放大缩小 | 提示可点击 |
| `common.shake` | 抖动 | 左右抖动 | **错误反馈** |
| `common.shakeX` | 水平抖动 | 剧烈水平抖动 | 警告 |
| `common.shakeY` | 垂直抖动 | 垂直方向抖动 | 提醒 |
| `common.bounce` | 弹跳 | 上下弹跳 | 吸引注意 |
| `common.wobble` | 摇摆 | 左右摇摆 | 趣味强调 |
| `common.swing` | 摆动 | 钟摆摆动 | 轻微提示 |
| `common.tada` | 惊喜 | 惊喜效果 | **完成奖励** |
| `common.heartbeat` | 心跳 | 心跳效果 | 重要提示 |
| `common.celebrate` | 庆祝 | 庆祝效果 | **答对庆祝** |
| `common.flash` | 闪烁 | 快速闪烁 | 警告提示 |
| `common.rubberBand` | 橡皮筋 | 弹性效果 | 点击反馈 |
| `common.jello` | 果冻 | 果冻扭曲 | 趣味效果 |
| `common.headShake` | 摇头 | 否定效果 | **答错否定** |
| `common.attention` | 注意 | 吸引注意 | 重要内容 |

##### 退场动画 (exit) - 15 个
| ID | 名称 | 描述 |
|----|------|------|
| `common.fadeOut` | 淡出 | 通用退场 |
| `common.fadeOutUp` | 向上淡出 | 向上消失 |
| `common.fadeOutDown` | 向下淡出 | 向下消失 |
| `common.fadeOutLeft` | 向左淡出 | 向左消失 |
| `common.fadeOutRight` | 向右淡出 | 向右消失 |
| `common.slideOutLeft` | 左侧滑出 | 滑出左侧 |
| `common.slideOutRight` | 右侧滑出 | 滑出右侧 |
| `common.slideOutUp` | 顶部滑出 | 滑出顶部 |
| `common.slideOutDown` | 底部滑出 | 滑出底部 |
| `common.bounceOut` | 弹跳退场 | 弹跳消失 |
| `common.zoomOut` | 缩放退场 | 缩小消失 |
| `common.zoomOutUp` | 向上缩放退场 | 向上缩小消失 |
| `common.rotateOut` | 旋转退场 | 旋转消失 |
| `common.flipOutX` | X轴翻转退场 | X轴翻转消失 |
| `common.flipOutY` | Y轴翻转退场 | Y轴翻转消失 |

#### 学科动画模块

##### 物理 (physics)
| ID | 名称 | 描述 |
|----|------|------|
| `physics.pisa-tower` | 比萨斜塔实验 | 伽利略自由落体实验 |

##### 地理 (geography)
| ID | 名称 | 描述 |
|----|------|------|
| `geography.earth-system` | 地球系统 | 地球结构和运动 |

##### 数学 (math)
| ID | 名称 | 描述 |
|----|------|------|
| `math.bezier-curve` | 贝塞尔曲线 | 交互式贝塞尔曲线演示 |
| `math.geometry-transform` | 几何变换 | 平移、旋转、缩放（预留） |
| `math.function-graph` | 函数图像 | 函数可视化（预留） |
| `math.pythagorean` | 勾股定理 | 勾股定理证明（预留） |

### 3. DSL 结构模板

#### 完整课程结构（引用动画库）

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
        "xs": 4, "sm": 8, "md": 16, "lg": 24, "xl": 32
      }
    },
    "animationImports": [
      "@vv-education/vvce-animations/common",
      "@vv-education/vvce-animations/physics/pisa-tower"
    ],
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
        "hover": { "backgroundColor": "#4338CA", "scale": 1.02 },
        "active": { "scale": 0.98 }
      }
    }
  },
  "theme": "playful",
  "startSceneId": "intro",
  "scenes": []
}
```

### 4. 场景模板库

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
        "text": "欢迎来到{{globals.vars.courseName}}！"
      },
      "style": { "animation": "common.fadeInUp" }
    },
    {
      "id": "start-btn",
      "type": "Button",
      "props": { "text": "开始学习" },
      "styleClass": ["button-primary"],
      "style": { "animation": "common.bounceIn", "animationDelay": 500 }
    }
  ],
  "triggers": [
    {
      "on": { "event": "click", "target": "start-btn" },
      "then": [
        { "action": "playAnimation", "target": "start-btn", "animation": "common.pulse" },
        { "action": "delay", "ms": 300 },
        { "action": "gotoScene", "sceneId": "content-1" }
      ]
    }
  ],
  "transition": { "type": "fade", "duration": 300 }
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
  "nodes": [
    {
      "id": "quiz-dialog",
      "type": "Dialog",
      "props": { "speaker": "VV老师", "text": "来检验一下学习成果吧！" },
      "style": { "animation": "common.fadeInUp" }
    },
    {
      "id": "quiz-question",
      "type": "QuizSingle",
      "props": {
        "question": "题目内容",
        "options": ["选项A", "选项B", "选项C", "选项D"],
        "answerKey": "选项B"
      },
      "style": { "animation": "common.fadeInUp", "animationDelay": 200 }
    },
    {
      "id": "submit-btn",
      "type": "Button",
      "props": { "text": "提交答案" },
      "styleClass": ["button-primary"],
      "style": { "animation": "common.bounceIn", "animationDelay": 400 }
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
        { "action": "playAnimation", "target": "quiz-question", "animation": "common.celebrate" },
        { "action": "toast", "text": "回答正确！+10分" },
        { "action": "delay", "ms": 1500 },
        { "action": "gotoScene", "sceneId": "summary" }
      ],
      "else": [
        { "action": "incVar", "path": "globals.vars.attempt", "by": 1 },
        { "action": "playAnimation", "target": "quiz-question", "animation": "common.shake" },
        { "action": "toast", "text": "再想想～" }
      ]
    }
  ]
}
```

#### 实验场景 (experiment)

```json
{
  "id": "experiment-1",
  "layout": { "type": "stack", "direction": "vertical", "gap": 16, "padding": 24 },
  "nodes": [
    {
      "id": "exp-title",
      "type": "Dialog",
      "props": { "speaker": "VV老师", "text": "让我们来做一个实验！" },
      "style": { "animation": "common.fadeInDown" }
    },
    {
      "id": "animation-player",
      "type": "Animation",
      "props": {
        "type": "physics.pisa-tower",
        "autoplay": false
      },
      "style": { "animation": "common.zoomIn", "animationDelay": 300 }
    },
    {
      "id": "play-btn",
      "type": "Button",
      "props": { "text": "开始实验" },
      "styleClass": ["button-primary"]
    }
  ],
  "triggers": [
    {
      "on": { "event": "click", "target": "play-btn" },
      "then": [
        { "action": "playAnimation", "target": "animation-player", "animation": "start" },
        { "action": "toast", "text": "实验开始..." }
      ]
    }
  ]
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
3. **引用动画库** - 使用 `common.xxx` 或 `{category}.xxx` 引用动画
4. **组装 DSL** - 将各场景组装成完整课程
5. **保存文件** - 写入 `scene-viewer/scenes/{course-id}.json`
6. **验证** - 使用 dsl-validate 验证生成的 DSL

### 7. 新增动画到库

如需创建新的学科动画，遵循以下步骤：

```bash
# 1. 创建动画目录
packages/vvce-animations/src/{category}/{animation-name}/
├── index.ts      # 模块入口
├── renderer.ts   # 渲染逻辑
└── styles.ts     # 样式定义

# 2. 在主入口注册
# packages/vvce-animations/src/index.ts
export { myNewModule } from './{category}/{animation-name}/index';
```

## 输出示例

```
=== 课程设计完成 ===

文件已创建: scene-viewer/scenes/physics-free-fall.json

课程概览:
- ID: physics-free-fall
- 标题: 自由落体运动
- 学科: physics
- 场景数: 4
- 主题: academic

引用的动画:
- common: fadeInUp, bounceIn, shake, celebrate, pulse
- physics: pisa-tower

场景列表:
1. intro - 课程引入
2. content-1 - 理论讲解
3. experiment - 比萨斜塔实验
4. quiz-1 - 知识测验
5. summary - 总结

下一步:
1. 使用 scene-viewer 预览课程
2. 运行 "验证 DSL" 检查课程完整性
```

## 快速查找动画

```typescript
import { getEffect, listEffectIds, getEffectsByCategory } from '@vv-education/vvce-animations';

// 获取单个动画
const shake = getEffect('common.shake');

// 列出所有动画 ID
const allIds = listEffectIds();

// 按类别获取
const entranceAnimations = getEffectsByCategory('entrance');
const emphasisAnimations = getEffectsByCategory('emphasis');
```

## 注意事项

- 动画 ID 格式：`{category}.{name}`，如 `common.fadeIn`、`physics.pisa-tower`
- 课程 ID 使用 kebab-case
- 确保所有 sceneId 引用正确
- 新动画应保存到 `packages/vvce-animations/src/` 对应目录
- 场景过渡时间建议 300-500ms
- 动画时长建议 300-800ms
