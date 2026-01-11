# VVCE 场景运行器

**Scene Runner** - 用于快速测试和验证课件场景的工具

## 功能

- 📚 **场景选择器** - 快速切换不同场景
- 🎯 **实时渲染** - 即时查看场景效果
- 🐛 **调试面板** - 实时查看状态、变量、日志
- 🔄 **热加载** - 修改 JSON 后刷新即可看到变化

## 使用方法

### 1. 启动服务器

在项目根目录运行：

```bash
# 使用 Python
python3 -m http.server 8080

# 或使用启动脚本
./scene-viewer/start-demo.sh
```

### 2. 访问场景运行器

在浏览器打开：

```
http://localhost:8080/scene-viewer/scene-runner/
```

### 3. 选择场景

点击顶部的场景卡片来加载不同的场景：

- **🧮 数学测验** - 基础算术题测试
- **🏛️ 比萨斜塔实验** - 物理实验演示
- **🌍 地球公转自转** - 天文现象模拟

### 4. 交互体验

- 点击按钮进行交互
- 选择答案提交
- 查看右侧调试信息

## 场景文件结构

所有场景定义存储在 `scene-viewer/scenes/` 目录：

```
scene-viewer/scenes/
├── math-quiz.json        # 数学测验场景
├── pisa-tower.json       # 比萨斜塔实验场景
└── earth-system.json     # 地球系统场景
```

## 添加新场景

### 步骤 1: 创建场景 JSON

在 `scene-viewer/scenes/` 目录创建新的 JSON 文件，例如 `my-scene.json`：

```json
{
  "schema": "vvce.dsl.v1",
  "meta": {
    "id": "my-scene",
    "version": "1.0.0",
    "title": "我的场景",
    "author": "Your Name",
    "description": "场景描述"
  },
  "globals": {
    "vars": {
      "score": 0
    }
  },
  "startSceneId": "scene1",
  "scenes": [
    {
      "id": "scene1",
      "nodes": [
        {
          "id": "dialog1",
          "type": "Dialog",
          "props": {
            "speaker": "老师",
            "text": "Hello World!"
          }
        }
      ],
      "triggers": []
    }
  ]
}
```

### 步骤 2: 添加场景卡片

编辑 `scene-viewer/scene-runner/index.html`，在场景选择器中添加新卡片：

```html
<div class="scene-card" data-scene="my-scene">
  <div class="scene-card-title">🎯 我的场景</div>
  <div class="scene-card-desc">场景描述</div>
</div>
```

### 步骤 3: 刷新浏览器

刷新页面即可看到新场景！

## 场景 JSON 规范

### 基本结构

```json
{
  "schema": "vvce.dsl.v1",
  "meta": {
    "id": "unique-id",
    "version": "1.0.0",
    "title": "场景标题",
    "author": "作者",
    "description": "描述"
  },
  "globals": {
    "vars": {}
  },
  "startSceneId": "start",
  "scenes": []
}
```

### 支持的组件类型

| 组件         | 用途       | 示例                 |
| ------------ | ---------- | -------------------- |
| `Dialog`     | 对话框     | 展示文本、说话人     |
| `QuizSingle` | 单选题     | 选择题测验           |
| `Button`     | 按钮       | 触发交互             |
| `Animation`  | 动画       | 物理/天文动画演示    |
| `Controls`   | 控制按钮组 | 动画控制             |
| `Conclusion` | 结论框     | 科学结论展示（绿色） |
| `Thinking`   | 思考题     | 深度思考问题（橙色） |

### 支持的 Actions

- `gotoScene` - 场景跳转
- `setVar` - 设置变量
- `incVar` - 增加变量
- `addScore` - 增加分数
- `toast` - 显示提示
- `delay` - 延迟执行

## 调试技巧

### 1. 使用浏览器控制台

运行器会将 runtime 暴露到 window：

```javascript
// 获取当前状态
window.vvceRuntime.getState();

// 获取日志
window.vvceRuntime.getLogs();

// 手动跳转场景
window.vvceRuntime.gotoScene('scene-id');
```

### 2. 查看调试面板

右侧面板实时显示：

- 当前场景 ID
- 全局变量值
- 最近 8 条日志

### 3. 检查 JSON 格式

使用 JSON 校验工具确保格式正确：

```bash
# 使用 jq 验证 JSON
cat demo/scenes/my-scene.json | jq .
```

## 常见问题

### Q: 场景加载失败？

**A:** 检查：

1. JSON 文件是否存在于 `demo/scenes/` 目录
2. JSON 格式是否正确（使用 JSONLint 验证）
3. 浏览器控制台是否有错误信息

### Q: 动画不播放？

**A:** 确保：

1. 动画类型正确（`pisa-tower` 或 `earth-system`）
2. `autoplay` 设置为 `true`
3. 动画容器正确渲染（检查 DOM）

### Q: 变量插值不工作？

**A:** 检查：

1. 使用 `{{globals.vars.varName}}` 格式
2. 变量已在 `globals.vars` 中定义
3. 变量名拼写正确

### Q: 触发器不响应？

**A:** 验证：

1. 事件类型正确（`click`, `change`）
2. 目标 ID 与节点 ID 匹配
3. 条件表达式正确（检查引用路径）

## 性能优化

### 减少场景大小

- 避免过多节点（建议 < 20 个/场景）
- 合理拆分复杂场景
- 重用组件定义

### 动画优化

- 使用 CSS 动画而非 JavaScript
- 避免过于复杂的动画
- 合理设置动画时长

## 开发工作流

### 典型流程

1. **设计场景** - 确定教学目标和交互流程
2. **编写 DSL** - 创建场景 JSON 文件
3. **快速测试** - 在场景运行器中验证
4. **调整优化** - 根据效果调整参数
5. **重复迭代** - 直到满意为止

### 最佳实践

1. **先简后繁** - 从简单场景开始，逐步增加复杂度
2. **频繁测试** - 每添加一个节点就测试一次
3. **版本控制** - 使用 Git 追踪 JSON 变更
4. **命名规范** - 使用清晰的 ID 和变量名
5. **添加注释** - 在 `description` 字段说明场景用途

## 与现有演示的对比

### 原演示（basic-example / immersive-example）

- ✅ 完整的课程体验
- ✅ 精美的界面设计
- ❌ DSL 嵌入在 HTML 中
- ❌ 修改需要编辑大文件

### 场景运行器（scene-runner）

- ✅ DSL 独立为 JSON 文件
- ✅ 快速加载切换场景
- ✅ 专注于测试验证
- ✅ 便于 Git 管理和版本控制

**推荐用途：**

- **场景运行器** - 开发和测试阶段
- **原演示** - 展示和体验阶段

## 未来计划

- [ ] 场景编辑器（可视化编辑 JSON）
- [ ] 实时预览（修改 JSON 自动刷新）
- [ ] 场景库浏览（分类展示所有场景）
- [ ] 性能分析工具
- [ ] 导出为独立 HTML

## 反馈

如有问题或建议，请在项目中提交 Issue。

---

**Happy Scene Building! 🎬**
