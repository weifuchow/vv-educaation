# Animation Pack 架构设计

> 解决目录混乱问题，设计支持"DSL + 扩展动画"双输出的架构

## 1. 核心问题

当用户创建课程时：

1. **输入**: 用户描述课程需求
2. **输出**:
   - `course.dsl.json` - 课程DSL（引用已有动画）
   - `extensions.json` - 扩展动画定义（如果需要新动画）

## 2. 架构设计

```
animation-packs/
├── _core/                           # 🔧 核心渲染库（运行时基础设施）
│   ├── manifest.json
│   └── lib/
│       ├── CanvasRenderer.js        # Canvas 渲染器
│       ├── CoordinateSystem.js      # 坐标系
│       ├── Grid.js                  # 网格
│       ├── Point.js                 # 可拖拽点
│       ├── Curve.js                 # 曲线绘制
│       ├── Tooltip.js               # 提示框
│       ├── Controls.js              # UI控件（滑块、按钮）
│       └── utils/                   # 数学工具
│           ├── bezier.js            # 贝塞尔算法
│           ├── interpolation.js     # 插值/缓动
│           └── vector.js            # 向量运算
│
├── keyframes/                       # 🎬 关键帧动画库（CSS动画，JSON定义）
│   ├── _index.json                  # 索引清单
│   ├── basic.json                   # 基础：fadeIn, bounce, shake...
│   ├── math.json                    # 数学：drawLine, countUp...
│   └── science.json                 # 科学：pulse, wave...
│
├── interactive/                     # 🎮 交互式动画库（Canvas/JS）
│   ├── _index.json                  # 索引清单
│   └── math/                        # 数学学科
│       ├── bezier-curve/            # 贝塞尔曲线
│       │   ├── manifest.json        # 动画元数据
│       │   ├── renderer.js          # 渲染逻辑
│       │   └── styles.css           # 样式
│       ├── function-graph/          # 函数图像（未来）
│       └── geometry-transform/      # 几何变换（未来）
│
└── manifest.json                    # 📋 总清单
```

## 3. 两类动画的区别

### 3.1 关键帧动画（Keyframe）

- **存储**: 纯 JSON
- **运行**: CSS Animation API
- **复杂度**: 低
- **可扩展**: 用户可直接提供 JSON
- **适用场景**: 简单视觉效果（淡入、弹跳、闪烁）

```json
{
  "id": "math.drawLine",
  "type": "keyframe",
  "keyframes": [
    { "offset": 0, "properties": { "strokeDashoffset": "100%" } },
    { "offset": 100, "properties": { "strokeDashoffset": "0" } }
  ],
  "duration": 1500
}
```

### 3.2 交互式动画（Interactive）

- **存储**: JSON manifest + JS renderer
- **运行**: Canvas API / WebGL
- **复杂度**: 高
- **可扩展**: 需要 JS 代码，通常需要开发者介入
- **适用场景**: 复杂交互（贝塞尔曲线、函数图像、物理模拟）

```json
{
  "id": "math.bezier-curve",
  "type": "interactive",
  "renderer": "./renderer.js",
  "dependencies": ["@core/CanvasRenderer", "@core/CoordinateSystem"],
  "params": {
    "controlPoints": { "type": "array", "default": [...] }
  }
}
```

## 4. 双输出系统设计

### 4.1 课程创建流程

```
┌─────────────────┐
│  用户输入课程需求  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   AI 分析需求    │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐ ┌───────────┐
│ 检查库 │ │ 需要新动画? │
└───┬───┘ └─────┬─────┘
    │           │
    ▼           ▼
┌───────────────────────────────┐
│         输出两个 JSON          │
│  ┌─────────────────────────┐  │
│  │  course.dsl.json        │  │
│  │  - 引用已有动画          │  │
│  │  - 引用新扩展动画        │  │
│  └─────────────────────────┘  │
│  ┌─────────────────────────┐  │
│  │  extensions.json        │  │
│  │  - 新关键帧动画定义      │  │
│  │  - 交互动画需求说明      │  │
│  └─────────────────────────┘  │
└───────────────────────────────┘
```

### 4.2 输出示例

**course.dsl.json:**

```json
{
  "schema": "vvce.dsl.v1",
  "meta": { "id": "bezier-intro", "title": "贝塞尔曲线入门" },
  "scenes": [
    {
      "id": "demo",
      "nodes": [
        {
          "id": "bezier",
          "type": "Animation",
          "props": {
            "type": "interactive/math.bezier-curve",
            "params": {
              "showConstruction": true,
              "controlPoints": [
                [100, 400],
                [200, 100],
                [400, 100],
                [500, 400]
              ]
            }
          }
        }
      ]
    }
  ],
  "extensions": ["./extensions.json"] // 引用扩展
}
```

**extensions.json:**

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

## 5. 数据库存储映射

```
animation_packs (动画包表)
├── id: "math"
├── name: "数学动画包"
├── type: "subject"  // subject | core | custom
└── version: "1.0.0"

animations (动画表)
├── id: "math.bezier-curve"
├── pack_id: "math"
├── type: "interactive"  // keyframe | interactive
├── manifest_json: {...}
├── renderer_code: "..." (仅 interactive)
├── styles_css: "..."
└── created_by: "system" | "user"

course_extensions (课程扩展表)
├── course_id: "bezier-intro"
├── animation_id: "custom.highlightPath"
└── definition_json: {...}
```

## 6. 运行时加载逻辑

```javascript
class AnimationLoader {
  async load(animationType, container, params) {
    // 1. 解析动画类型
    const [category, subject, name] = this.parseType(animationType);
    // e.g., "interactive/math.bezier-curve" -> ["interactive", "math", "bezier-curve"]

    // 2. 根据类型加载
    if (category === 'keyframe') {
      // 从 JSON 加载关键帧定义
      const def = await this.loadKeyframeDefinition(subject, name);
      return new KeyframeAnimation(container, def, params);
    } else {
      // 动态导入 JS 模块
      const renderer = await this.loadInteractiveRenderer(subject, name);
      return new renderer(container, params);
    }
  }
}
```

## 7. 这套方案的优势

1. **清晰分层**: 核心库 → 动画库 → 课程DSL
2. **两种复杂度**: 简单用 JSON，复杂用 JS
3. **可扩展**: 用户可以添加新动画到数据库
4. **双输出**: 课程创建时同时生成 DSL 和扩展
5. **热加载**: 所有动画都可以动态加载
6. **AI友好**: JSON 格式便于 AI 生成

## 8. 下一步行动

1. [ ] 重命名 `maths/` → `interactive/math/`
2. [ ] 移动 `math.json` → `keyframes/math.json`
3. [ ] 重命名 `_core/lib/math/` → `_core/lib/utils/`
4. [ ] 更新 scene-runner 加载逻辑
5. [ ] 创建 `extensions.schema.json` 验证扩展格式
