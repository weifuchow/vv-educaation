# VVCE 基础演示示例

这是一个简单的 VVCE (VV Courseware Engine) 课件渲染引擎演示。

## 功能展示

✅ **声明式 DSL**: 使用 JSON 定义课件内容和交互逻辑
✅ **三层状态管理**: Globals、Scene、Nodes 状态分离
✅ **事件驱动**: Event-Condition-Action (ECA) 模式
✅ **基础组件**: Dialog、QuizSingle、Button
✅ **交互式课件**: 包含数学测验和即时反馈
✅ **实时调试**: 右侧面板展示状态、变量和日志

## 如何运行

### 方法 1: 使用 Python HTTP 服务器

```bash
# 在项目根目录运行
python3 -m http.server 8080

# 然后在浏览器打开
# http://localhost:8080/demo/basic-example/
```

### 方法 2: 使用 Node.js HTTP 服务器

```bash
# 安装 http-server (如果还没有)
npm install -g http-server

# 在项目根目录运行
http-server -p 8080

# 然后在浏览器打开
# http://localhost:8080/demo/basic-example/
```

### 方法 3: 使用 VS Code Live Server

1. 安装 "Live Server" 扩展
2. 右键点击 `index.html`
3. 选择 "Open with Live Server"

## 演示内容

这个演示包含一个简单的数学测验课件：

1. **欢迎场景**: 介绍课程
2. **问题 1**: 1 + 1 = ?
3. **问题 2**: 5 × 3 = ?
4. **结果场景**: 显示最终得分

### DSL 特性展示

- ✅ 场景跳转 (`gotoScene`)
- ✅ 变量插值 (`{{globals.vars.score}}`)
- ✅ 条件判断 (`if/then/else`)
- ✅ 状态管理 (`addScore`, `incVar`)
- ✅ UI 反馈 (`toast`)
- ✅ 延迟执行 (`delay`)

## 调试面板

右侧的调试面板显示：

- **当前场景**: 实时显示当前所在场景
- **得分**: 实时更新的分数
- **全局变量**: globals.vars 的实时状态
- **最近日志**: 最近 10 条事件和动作日志

## 技术架构

```
┌─────────────────────────────────────────┐
│          VVCERuntime (引擎核心)          │
│  ┌─────────┐  ┌──────────┐  ┌────────┐  │
│  │  Store  │  │ EventBus │  │ Logger │  │
│  └─────────┘  └──────────┘  └────────┘  │
│  ┌──────────────────────────────────┐   │
│  │   TriggerInterpreter (ECA)       │   │
│  │   ActionExecutor (23+ actions)   │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
            ▲                ▼
            │                │
┌───────────┴────────────────┴───────────┐
│      UI Layer (组件渲染层)              │
│  - ComponentRenderer                   │
│  - UIManager                           │
│  - Event handling                      │
└────────────────────────────────────────┘
```

## 代码亮点

### 声明式 DSL

```json
{
  "triggers": [
    {
      "on": { "event": "click", "target": "submit1" },
      "if": [
        {
          "op": "equals",
          "left": { "ref": "q1.state.selected" },
          "right": "2"
        }
      ],
      "then": [
        { "action": "addScore", "value": 10 },
        { "action": "toast", "text": "回答正确！+10分" },
        { "action": "gotoScene", "sceneId": "question2" }
      ],
      "else": [{ "action": "toast", "text": "答案不对哦，再想想～" }]
    }
  ]
}
```

### 组件渲染

组件通过简单的渲染器转换为 HTML：

- **Dialog**: 对话框组件，支持说话人和文本插值
- **QuizSingle**: 单选题组件，支持选项选择
- **Button**: 按钮组件，触发点击事件

## 下一步

这个演示展示了 VVCE 的核心能力。未来可以：

1. 添加更多组件类型（填空题、拖拽题、音频等）
2. 实现动画和过渡效果
3. 集成后端 API（课程加载、进度保存）
4. 添加主题系统和样式定制
5. 实现回放和调试工具

## 许可证

MIT
