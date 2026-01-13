# VVCE 演示示例

这个目录包含 VVCE (VV Courseware Engine) 课件渲染引擎的各种演示示例。

## 快速开始

### 方法 1: 使用启动脚本（推荐）

```bash
# 在项目根目录运行
./demo/start-demo.sh
```

然后在浏览器打开: **http://localhost:10000/scene-viewer/scene-runner/**

### 方法 2: 手动启动

```bash
# 1. 构建 packages（如果还没有）
pnpm build:packages

# 2. 启动 HTTP 服务器
py -m http.server 10000

# 3. 在浏览器打开
# http://localhost:10000/scene-viewer/scene-runner/
```

## 演示列表

### 🎬 场景运行器 (`scene-runner/`) ⭐ **推荐用于开发**

**快速测试和验证课件场景的工具** - 将场景定义（DSL JSON）和渲染引擎完全分离：

**核心特性:**

- 📚 **场景选择器** - 快速切换不同场景
- 🔄 **热加载** - 修改 JSON 后刷新即可看到变化
- 🐛 **调试面板** - 实时查看状态、变量、日志
- 📦 **场景库** - 所有场景存储在 `scenes/` 目录

**已包含的场景:**

1. **math-quiz.json** - 数学测验
2. **pisa-tower.json** - 比萨斜塔实验
3. **earth-system.json** - 地球公转自转

**使用场景:**

- ✅ 开发阶段快速测试场景
- ✅ 验证 DSL 定义是否正确
- ✅ 调试场景逻辑和交互
- ✅ Git 管理场景版本

**访问地址:** http://localhost:8080/demo/scene-runner/

[查看详细说明 →](./scene-runner/README.md)

---

### 📚 基础示例 (`basic-example/`)

一个完整的交互式数学测验课件，展示了 VVCE 的核心功能：

**功能展示:**

- ✅ 声明式 DSL（JSON 定义课件）
- ✅ 三层状态管理（Globals/Scene/Nodes）
- ✅ Event-Condition-Action 模式
- ✅ 基础组件（Dialog、QuizSingle、Button）
- ✅ 实时调试面板（状态、变量、日志）

**内容:**

- 欢迎场景
- 数学测验（2 道题）
- 即时反馈和得分
- 结果展示

**访问地址:** http://localhost:8080/demo/basic-example/

[查看详细说明 →](./basic-example/README.md)

---

### 🎨 沉浸式交互示例 (`immersive-example/`) ⭐ **推荐**

**VVCE 核心能力展示** - 这是一个完整的沉浸式教育课件，展示了引擎在创建丰富互动体验方面的强大能力：

**主题内容:**

1. **🏛️ 物理实验 - 伽利略的比萨斜塔**
   - 历史背景介绍
   - 学生预测环节
   - 动画实验演示
   - 科学结论揭示
   - 深度思考引导

2. **🌍 地理知识 - 地球的公转与自转**
   - 互动式天文模拟
   - 可控制的动画系统
   - 地轴倾斜可视化
   - 周期知识测验
   - 系统总结与拓展

**技术亮点:**

- ✨ CSS 动画模拟物理现象
- ✨ 交互式天文系统（太阳、地球、月球）
- ✨ 智能分支逻辑（根据答案不同反馈）
- ✨ 新组件类型（Animation、Controls、Conclusion、Thinking）
- ✨ 沉浸式视觉设计（渐变背景、3D 效果）
- ✨ 教育心理学应用（建构主义、探究式学习）

**教学设计:**

- 🎯 先预测，再验证，后反思
- 🎯 答对给予奖励，答错引导思考
- 🎯 连接真实世界的科学故事
- 🎯 培养科学思维和探究精神

**访问地址:** http://localhost:8080/demo/immersive-example/

[查看详细说明 →](./immersive-example/README.md)

## 技术架构

VVCE 采用清晰的分层架构：

```
┌──────────────────────────────────────────────┐
│         Course DSL (JSON)                    │
│  - 场景定义                                   │
│  - 组件配置                                   │
│  - 触发器逻辑                                 │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│       VVCERuntime (核心引擎)                  │
│  ┌────────────┐  ┌────────────┐  ┌────────┐ │
│  │   Store    │  │  EventBus  │  │ Logger │ │
│  │(状态管理)   │  │(事件总线)   │  │(日志)   │ │
│  └────────────┘  └────────────┘  └────────┘ │
│  ┌─────────────────────────────────────────┐│
│  │   TriggerInterpreter (ECA 解释器)       ││
│  │   ActionExecutor (动作执行器)           ││
│  └─────────────────────────────────────────┘│
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│       UI Layer (组件渲染层)                   │
│  - ComponentRenderer (组件渲染器)            │
│  - UIManager (UI 管理器)                     │
│  - Event Handling (事件处理)                 │
└──────────────────────────────────────────────┘
```

## 核心特性

### 1. 声明式 DSL

使用 JSON 定义课件，无需编写代码：

```json
{
  "schema": "vvce.dsl.v1",
  "meta": { "id": "my-course", "version": "1.0.0" },
  "startSceneId": "welcome",
  "globals": { "vars": { "score": 0 } },
  "scenes": [...]
}
```

### 2. Event-Condition-Action 模式

直观的交互逻辑定义：

```json
{
  "on": { "event": "click", "target": "submitBtn" },
  "if": [{ "op": "equals", "left": {...}, "right": "answer" }],
  "then": [
    { "action": "addScore", "value": 10 },
    { "action": "gotoScene", "sceneId": "next" }
  ],
  "else": [
    { "action": "toast", "text": "再试一次～" }
  ]
}
```

### 3. 三层状态管理

- **globals.vars**: 跨场景全局状态（分数、用户信息等）
- **scene.vars**: 场景临时状态
- **nodes.state**: 组件内部状态（选项、输入值等）

### 4. 组件系统

可扩展的组件协议：

- **Dialog**: 对话框（支持说话人、文本插值）
- **QuizSingle**: 单选题
- **Button**: 交互按钮
- **更多组件**: 开发中...

### 5. 调试友好

- 完整的事件日志
- 实时状态查看
- 支持回放（即将推出）

## 设计原则

1. **安全第一**: 无任意代码执行，纯声明式 DSL
2. **确定性**: 相同输入 = 相同输出（便于测试和回放）
3. **框架无关**: 核心引擎不依赖任何 UI 框架
4. **AI 友好**: DSL 设计为可由 AI 生成
5. **调试友好**: 完整日志和状态追踪

## 项目结构

```
demo/
├── README.md              # 本文件
├── start-demo.sh          # 快速启动脚本
└── basic-example/         # 基础示例
    ├── index.html         # 演示页面
    └── README.md          # 详细说明
```

## 浏览器兼容性

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+

需要支持 ES6 Modules。

## 常见问题

### Q: 为什么需要 HTTP 服务器？

A: 因为浏览器的 CORS 策略限制，ES6 Modules 需要通过 HTTP(S) 协议加载。

### Q: 可以修改演示内容吗？

A: 当然！编辑 `index.html` 中的 `sampleCourse` 对象即可。

### Q: 如何添加新组件？

A: 在 `ComponentRenderer` 类中添加新的渲染方法，并在 `renderNode` 中处理。

### Q: 生产环境如何部署？

A: 引擎已构建为标准 npm 包，可集成到任何前端项目中。

## 下一步

探索更多功能：

1. **添加新场景**: 在 `scenes` 数组中添加更多场景
2. **添加新题型**: 实现更多组件类型
3. **集成后端**: 连接 API 加载课程和保存进度
4. **样式定制**: 修改 CSS 主题
5. **动画效果**: 添加场景过渡和组件动画

## 反馈和贡献

如有问题或建议，请提交 Issue 或 Pull Request。

---

**Happy Coding! 🎓**
