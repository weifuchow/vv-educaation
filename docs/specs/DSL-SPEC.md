# VVCE DSL 规范 v1.0

## 概述

VVCE DSL（Domain Specific Language）是 VV 课堂交互式课件的声明式描述语言，采用 JSON 格式。

## 设计原则

1. **声明式优先**：用数据描述行为，而非代码
2. **安全性**：禁止任意脚本执行
3. **可校验性**：基于 JSON Schema 可严格校验
4. **可扩展性**：支持自定义组件和动作
5. **确定性**：相同输入产生相同输出

## 版本历史

- `vvce.dsl.v1` - M0 版本（当前）

## 顶层结构

```json
{
  "schema": "vvce.dsl.v1",
  "meta": { ... },
  "globals": { ... },
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
  "id": "course-001",           // 课程唯一标识
  "version": "1.0.0",            // 课程版本
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

#### startSceneId（必需）
- 类型：`string`
- 说明：起始场景 ID，必须在 scenes 中存在

#### scenes（必需）
- 类型：`SceneDSL[]`
- 说明：场景数组，至少包含一个场景

## 场景结构（Scene）

```json
{
  "id": "s1",
  "title": "场景标题",
  "layout": { ... },
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
  "type": "stack",      // stack | grid | flex
  "padding": 16,        // 内边距
  "gap": 12,            // 间距
  "columns": 2,         // grid 列数（仅 grid 布局）
  "align": "center",    // 对齐方式
  "justify": "between"  // 排列方式
}
```

#### vars（可选）
场景局部变量

#### nodes（可选）
节点（组件）数组

#### triggers（可选）
触发器数组

## 节点结构（Node）

```json
{
  "id": "node-id",
  "type": "ComponentType",
  "props": { ... },
  "style": { ... }
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

#### style（可选）
- 类型：`object`
- 说明：样式定义（预留）

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
  "event": "click",      // 事件类型
  "target": "node-id"    // 目标节点（可选）
}
```

#### if（可选）
条件数组，默认为 `true`

#### then（必需）
条件为真时执行的动作数组

#### else（可选）
条件为假时执行的动作数组

## 条件表达式（Condition）

### 比较操作符

```json
{
  "op": "equals",                         // equals | notEquals | gt | gte | lt | lte
  "left": { "ref": "q1.state.selected" }, // 左值
  "right": "2"                            // 右值
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

## 动作定义（Action）

### gotoScene - 场景跳转

```json
{
  "action": "gotoScene",
  "sceneId": "s2"
}
```

### setVar - 设置变量

```json
{
  "action": "setVar",
  "path": "globals.vars.score",
  "value": 100
}
```

### incVar - 增加变量

```json
{
  "action": "incVar",
  "path": "globals.vars.attempt",
  "by": 1
}
```

### addScore - 加分

```json
{
  "action": "addScore",
  "value": 10
}
```

### toast - 提示消息

```json
{
  "action": "toast",
  "text": "回答正确！分数 +{{globals.vars.score}}"
}
```

### modal - 模态框

```json
{
  "action": "modal",
  "text": "确认提交答案？"
}
```

### resetNode - 重置节点

```json
{
  "action": "resetNode",
  "nodeId": "q1"
}
```

## 文本插值

支持在文本中使用 `{{path}}` 语法引用变量：

```json
"你的分数是 {{globals.vars.score}}"
```

## 完整示例

参见 `packages/vvce-schema/examples/demo-lesson.json`

## 扩展性

### 自定义组件

通过组件注册机制添加自定义组件类型。

### 自定义动作

通过动作执行器扩展机制添加自定义动作。

## 版本演进

### M1 计划
- 支持数组操作
- 支持更复杂的表达式
- 支持时间轴动画

### M2 计划
- 支持子场景（Subscene）
- 支持异步动作
- 支持事件冒泡

## 许可证

MIT
