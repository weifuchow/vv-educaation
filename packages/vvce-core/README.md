# @vv-education/vvce-core

VVCE（VV Courseware Engine）交互式课件场景渲染引擎 - 核心运行时

## 功能概述

`vvce-core` 是 VV课堂交互式课件渲染引擎的核心运行时模块，负责解释执行结构化的课件 DSL，提供可交互、可回放、可验证的课程学习体验。

## 核心能力

### 1. 状态管理（Store）

三层状态架构：

- **全局状态（globals.vars）**：跨场景持久化状态（分数、尝试次数、用户昵称等）
- **场景状态（scene.vars）**：当前场景临时变量
- **节点状态（node.state）**：组件内部状态（选中项、输入值等）

### 2. 事件总线（Event Bus）

统一的事件派发与监听机制：

- 支持组件事件（click、change、submit 等）
- 支持系统事件（sceneEnter、sceneExit 等）
- 事件格式标准化，携带时间戳和载荷
- 支持事件日志记录与回放

### 3. 触发器解释器（Trigger Interpreter）

基于 ECA（Event-Condition-Action）模型：

- **事件匹配（on）**：监听特定事件和目标
- **条件评估（if）**：支持条件表达式（equals、gt、and、or 等）
- **动作执行（then/else）**：根据条件结果执行相应动作序列

### 4. 动作执行器（Action Executor）

M0 阶段支持的核心动作：

- **流程控制**：`gotoScene` - 场景跳转
- **状态操作**：`setVar`、`incVar`、`addScore` - 变量修改
- **UI 反馈**：`toast`、`modal` - 用户提示
- **组件控制**：`resetNode` - 重置组件状态

### 5. 引用解析（Reference Resolver）

支持表达式中的引用解析：

- `globals.vars.*` - 全局变量引用
- `scene.vars.*` - 场景变量引用
- `node.state.*` - 节点状态引用（如 `q1.state.selected`）

### 6. 文本插值（Text Interpolation）

模板字符串支持：

```
"你的分数是 {{globals.vars.score}}"
```

### 7. 运行时日志（Runtime Logger）

完整记录运行时信息用于调试和回放：

- 事件触发记录
- 条件评估结果
- 动作执行序列
- 状态变更差异（state diff）
- 场景跳转历史

## 架构设计

```
vvce-core/
├── store/              # 状态管理
│   ├── Store.ts        # 主状态容器
│   ├── GlobalStore.ts  # 全局状态
│   ├── SceneStore.ts   # 场景状态
│   └── NodeStore.ts    # 节点状态
├── event-bus/          # 事件总线
│   ├── EventBus.ts     # 事件分发中心
│   └── types.ts        # 事件类型定义
├── interpreter/        # 解释器
│   ├── TriggerInterpreter.ts  # 触发器解释器
│   ├── ConditionEvaluator.ts  # 条件评估器
│   └── ReferenceResolver.ts   # 引用解析器
├── executor/           # 执行器
│   ├── ActionExecutor.ts      # 动作执行器
│   └── actions/               # 动作实现
│       ├── FlowActions.ts     # 流程控制动作
│       ├── StateActions.ts    # 状态操作动作
│       └── UIActions.ts       # UI 反馈动作
├── runtime/            # 运行时
│   ├── Runtime.ts      # 主运行时类
│   └── SceneManager.ts # 场景管理器
├── logger/             # 日志
│   ├── Logger.ts       # 日志记录器
│   └── types.ts        # 日志类型定义
├── types/              # 类型定义
│   └── index.ts        # 导出所有类型
└── index.ts            # 模块入口
```

## 使用示例

```typescript
import { VVCERuntime } from '@vv-education/vvce-core';

// 创建运行时实例
const runtime = new VVCERuntime({
  onSceneChange: (sceneId) => {
    console.log('场景切换:', sceneId);
  },
  onStateChange: (state) => {
    // 保存进度
    saveProgress(state);
  },
  debug: true, // 开启调试模式
});

// 加载课程 DSL
runtime.loadCourse(courseDSL);

// 启动课程（从指定场景或上次进度恢复）
runtime.start({
  startSceneId: 's1',
  initialState: savedProgress, // 可选：恢复上次进度
});

// 派发事件（通常由组件触发）
runtime.emit({
  type: 'click',
  target: 'b1',
  ts: Date.now(),
});

// 获取当前状态
const currentState = runtime.getState();

// 获取运行日志
const logs = runtime.getLogs();

// 重置课程
runtime.reset();
```

## API 文档

### VVCERuntime

主运行时类，提供完整的课件执行环境。

#### 构造函数

```typescript
constructor(options: RuntimeOptions)
```

#### 主要方法

- `loadCourse(dsl: CourseDSL): void` - 加载课程 DSL
- `start(options?: StartOptions): void` - 启动课程
- `emit(event: VVEvent): void` - 派发事件
- `getState(): RuntimeState` - 获取当前状态
- `setState(state: Partial<RuntimeState>): void` - 设置状态
- `getLogs(): LogEntry[]` - 获取运行日志
- `reset(): void` - 重置课程
- `destroy(): void` - 销毁实例

## 设计原则

1. **安全性优先**：禁止任意脚本执行，所有逻辑通过声明式 DSL 定义
2. **确定性执行**：相同输入产生相同输出，便于测试和回放
3. **可观测性**：完整的日志记录，支持调试和验证
4. **渐进增强**：核心能力最小化，通过插件机制扩展
5. **框架无关**：运行时与前端框架解耦，可用于任何渲染层

## 依赖关系

- `@vv-education/vvce-schema` - DSL 定义和校验
- 无其他外部依赖（纯 TypeScript 实现）

## 开发计划

### M0 阶段（当前）

- [x] 基础架构搭建
- [ ] Store 实现
- [ ] EventBus 实现
- [ ] TriggerInterpreter 实现
- [ ] ActionExecutor 实现
- [ ] Runtime 主类实现
- [ ] Logger 实现
- [ ] 单元测试覆盖

### M1 阶段

- [ ] 动作扩展（动画、时间轴）
- [ ] 中间件机制
- [ ] 性能优化（事件节流、状态批量更新）
- [ ] 回放功能增强

### M2 阶段

- [ ] 插件系统
- [ ] 热更新支持
- [ ] 离线缓存策略

## 许可证

MIT
