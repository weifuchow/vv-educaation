# vv-education

VV课堂（`vv-education`）是一个基于 AI 的教育平台，面向学生与家长，通过 **交互式课件渲染引擎（VVCE）** 将课程内容以结构化 DSL（JSON）运行在多端，并逐步叠加学习主线、上下文进度、项目制验收与运营增长。

------

## 1. 背景（Background）

传统在线学习/AI答疑更偏“内容消费”或“解题工具”，但学习效果很难持续、也难以让家长明确看到孩子的成长。VV课堂希望将学习过程变成：

- **可沉浸的交互式体验**：课程不是静态页面，而是可执行的“场景脚本”。
- **可规模化的内容生产**：AI 持续生成结构化课件 DSL（JSON），引擎负责稳定渲染与交互执行。
- **可验收的学习成果**：最终通过任务/项目产出、证据链与 rubric 评价体系实现“看得见的成长”。

------

## 2. 目标（Goals）

### 2.1 产品目标

- 多端入口：
  - 小程序：学生入口 + 家长入口（可合并一个小程序双入口）
  - PC Web：学生创作/项目（阶段二）
  - 管理端：课程生产、审核、发布、数据与运营
- 核心体验：
  - 学习主线（任务地图/闯关）
  - 课程上下文进度（可中断、可恢复）
  - 个性化表达（同一主题基于画像差异化讲法/案例/节奏）
  - 主动提问环节（学习过程中必须出现“提问/反思”节点）
  - 项目制考核（2-3人组队，可与家长/同学组队，阶段三）

### 2.2 技术目标

- 构建 **VVCE 交互式课件场景渲染引擎**（核心 MVP）
- 形成可复用资产：
  - DSL Schema & 校验器
  - 组件协议 & 组件库
  - 事件日志与回放（调试/验收）
- 后端采用 Java（Spring Boot）提供课程、进度、用户、资源等 API

------

## 3. 仓库策略（Repo Strategy）

- ✅ 单仓库 Monorepo（适合一人团队快速迭代，避免版本漂移）
- ✅ 单后端服务（模块化单体），内部按领域模块划分
- ✅ 引擎与 DSL 作为共享包沉淀，供小程序 WebView、PC Web、管理端预览复用

------

## 4. 模块划分（Module Layout）

建议目录结构：

```
vv-education/
  apps/
    miniapp/            # 小程序壳（学生/家长双入口，建议WebView承载VVCE）
    web-admin/          # 管理端（课程生成/审核/发布/预览/数据）
    web-student/        # PC学生端（项目/创作/演讲，阶段二）
  server/
    api/                # Java Spring Boot 后端（单服务，内部按领域模块化）
  packages/
    vvce-core/          # 引擎运行时：状态/事件/动作解释器/回放
    vvce-schema/        # DSL JSON Schema + 校验器（lint/dry-run）
    vvce-components/    # 组件协议 + 标准交互组件
    contracts/          # API契约（OpenAPI/错误码/类型）
    shared/             # 通用工具、类型、常量
  tools/
    course-factory/     # 课件工厂：script→dsl→lint→dry-run→打包（阶段二）
    vvce-devtools/      # 回放器/调试面板（可选）
  docs/
    specs/              # DSL/组件协议/rubric/数据模型等文档
  infra/                # docker-compose/部署脚本（可选）
```

------

## 5. 方案选型（Tech Choices）

### 5.1 小程序承载方案

- ✅ **WebView 承载 VVCE**：更容易实现复杂交互、组件复用、快速迭代
- 小程序原生侧负责：登录、支付、分享、通知、权限（录音/相册等）

### 5.2 课件形态

- ✅ DSL JSON + 组件库渲染（可控、可校验、可复用）
- ❌ AI 直接生成 HTML 作为生产形态（不稳定、难维护、难验收）

### 5.3 后端

- ✅ Java（Spring Boot）单服务起步
- 模块化单体：内部按领域模块划分，未来再拆服务（如有必要）

### 5.4 API 契约

- ✅ `packages/contracts` 统一维护 OpenAPI/错误码/类型，避免前后端漂移

------

## 6. MVP 优先级：先做 VVCE M0（课件场景渲染引擎）

> 一人团队 MVP 第一性工程：**先把“课件场景能跑起来”**。
>  管理端、AI生成流水线、项目制验收都建立在这个引擎之上。

### 6.1 VVCE M0 必须做到什么（Definition of Done）

- 输入：结构化 DSL JSON（课程包/场景包）
- 输出：可交互运行的课件场景（Scene），支持：
  - 基础布局渲染（Stack/Grid 最小集）
  - 基础组件：对话（Dialog）、单选题（QuizSingle）、按钮（Button）
  - 事件触发 → 条件判断 → 动作执行（ECA：Event-Condition-Action）
  - 场景跳转（scene graph）
  - 最小进度保存/恢复（startSceneId + currentSceneId + globals.vars）
  - 运行日志（事件/动作/变量变更）用于调试/回放

**M0 不做：**

- 可视化编辑器
- 复杂动画/时间轴（先预留 action）
- 项目制/组队/反作弊（后续 M2/M3）
- AI 生成流水线（先手写 DSL 验证引擎）

------

## 7. VVCE M0：最小 DSL（vvce.dsl.v1）

### 7.1 顶层结构（M0 必需字段）

```
{
  "schema": "vvce.dsl.v1",
  "meta": { "id": "demo-lesson-001", "version": "0.1.0" },
  "globals": { "vars": { "score": 0, "attempt": 0 } },
  "startSceneId": "s1",
  "scenes": [
    {
      "id": "s1",
      "layout": { "type": "stack", "padding": 16, "gap": 12 },
      "vars": {},
      "nodes": [
        { "id": "d1", "type": "Dialog", "props": { "text": "欢迎来到VV课堂！" } },
        { "id": "q1", "type": "QuizSingle", "props": { "question": "1+1=?", "options": ["1","2","3"], "answerKey": "2" } },
        { "id": "b1", "type": "Button", "props": { "text": "提交" } }
      ],
      "triggers": [
        {
          "on": { "event": "click", "target": "b1" },
          "if": [
            { "op": "equals", "left": { "ref": "q1.state.selected" }, "right": "2" }
          ],
          "then": [
            { "action": "addScore", "value": 10 },
            { "action": "gotoScene", "sceneId": "s2" }
          ],
          "else": [
            { "action": "incVar", "path": "globals.vars.attempt", "by": 1 },
            { "action": "toast", "text": "再试一次～" }
          ]
        }
      ]
    },
    {
      "id": "s2",
      "layout": { "type": "stack", "padding": 16, "gap": 12 },
      "nodes": [
        { "id": "d2", "type": "Dialog", "props": { "text": "完成！你的分数是 {{globals.vars.score}}" } }
      ],
      "triggers": []
    }
  ]
}
```

### 7.2 DSL 约束（M0）

- 禁止任意脚本执行（不允许直接执行 JS）
- 条件表达式只支持：
  - `equals / notEquals / gt / gte / lt / lte`
  - `and / or / not`
- 引用只允许 `ref`：
  - `globals.vars.*`
  - `scene.vars.*`
  - `node.state.*`（如 `q1.state.selected`）
- 文本支持最小插值：`{{globals.vars.score}}`

------

## 8. VVCE M0：运行时架构（Runtime）

### 8.1 三层状态（Store）

- `globals.vars`：跨场景（score/attempt/nickname…）
- `scene.vars`：当前场景临时变量
- `node.state`：组件状态（selected/inputValue…）

### 8.2 事件总线（Event Bus）

统一事件格式：

```
type VVEvent = {
  type: string;       // click, change, submit, sceneEnter...
  target?: string;    // nodeId
  payload?: any;
  ts: number;
}
```

### 8.3 Trigger Interpreter（ECA）

- 匹配事件 `on`
- 评估条件 `if`
- 执行动作 `then/else`

### 8.4 Action Executor（M0 指令集）

最少但够用：

- 流程：`gotoScene(sceneId)`
- 状态：`setVar(path,value)`、`incVar(path,by)`、`addScore(value)`
- UI：`toast(text)`（可选：`modal(text)`）
- 组件：预留 `resetNode(nodeId)`（M1 再实现）

### 8.5 日志与回放（Debug First）

- 记录：event / conditionResult / actions / stateDiff
- 提供一个最小 DevPanel（侧边栏）：
  - 当前 sceneId
  - globals.vars
  - 最近 N 条日志
  - 重置/回放（可选）

------

## 9. VVCE M0：组件协议（Component Contract）

每个组件必须声明：

- `type`
- `propsSchema`（M0 可轻校验，M1 引入严格 JSON Schema）
- `stateShape`
- `emitEvents`（click/change/submit）

### 9.1 M0 组件清单（最小3个）

1. `Dialog`

- props：`text`
- state：无
- events：无

1. `QuizSingle`

- props：`question`, `options[]`, `answerKey`（M0 可用，后续可移到后端策略）
- state：`selected`
- events：`change`

1. `Button`

- props：`text`
- events：`click`

------

## 10. 后端（Java / Spring Boot）M0 支撑范围

M0 阶段后端只需要最小能力：

- 拉取课程包（DSL JSON + 资源索引）
- 保存/读取学习进度（currentSceneId + globals.vars）

推荐后端领域模块（先实现 `course` / `progress`）：

- `course`：课程包版本、发布、资源索引
- `progress`：用户学习进度与上下文存档
- `identity`：账号体系（如需登录）

> 其他模块（assessment/project/billing）在 VVCE M0 之后再叠加。

------

## 11. MVP 里程碑（Milestones）

### M0：VVCE 引擎跑通（第一优先）

- DSL Loader + 轻校验（必填字段、id 唯一、引用存在）
- Runtime：store + event bus + ref 解析 + 文本插值
- Trigger Interpreter：条件判断（equals/and/or）
- Action Executor：gotoScene / setVar / incVar / toast / addScore
- Renderer（前端不限）：渲染 stack + 3 个组件
- 日志/DevPanel：最小可用

### M1：组件扩展（填空/拖拽/音频/录音提交）

### M2：管理端课件生产与发布（预览/版本/审核）

### M3：项目制验收（rubric + 证据链 + AI追问）

------

## 12. 开始开发（Getting Started）

> 待补：项目初始化脚本、前端框架选择、构建工具与本地开发启动方式。