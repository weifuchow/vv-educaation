# VV Education - TODO 清单

> **最后更新**: 2026-01-14
> **当前阶段**: M0（核心引擎开发）约 70% 完成

## 🔥 高优先级（M0 完成前）

### vvce-schema 包完善

- [ ] **JSON Schema 定义** `@priority:high`
  - [ ] 为所有 DSL 类型创建 JSON Schema
  - [ ] 支持 schema 版本验证
  - [ ] 添加自定义错误消息
  - [ ] 创建 schema 测试用例

- [ ] **语义校验增强** `@priority:high`
  - [ ] 验证场景引用（startSceneId, gotoScene 目标）
  - [ ] 验证状态路径（ref 引用完整性）
  - [ ] 验证触发器目标节点存在性
  - [ ] 检测循环依赖
  - [ ] 添加警告级别的 lint 检查

- [ ] **Dry Run 模拟器** `@priority:medium`
  - [ ] 实现静态分析工具
  - [ ] 模拟课程执行流程
  - [ ] 检测死代码（不可达场景）
  - [ ] 生成执行路径报告

### vvce-components 包实现

#### 1. 组件架构基础设施 `@priority:critical`

- [ ] **组件协议定义** (`src/types/component.ts`)
  - [ ] 定义 `VVCEComponentMeta` 接口（组件元数据）
    ```typescript
    interface VVCEComponentMeta {
      type: string; // 组件类型标识符
      displayName: string; // 显示名称
      description?: string; // 组件描述
      propsSchema: JSONSchema; // Props JSON Schema 定义
      stateShape?: StateShapeDefinition; // 状态形状定义
      events: EventDefinition[]; // 支持的事件列表
      defaultProps?: Record<string, any>; // 默认属性
    }
    ```
  - [ ] 定义 `VVCEComponentProps` 基础接口
    ```typescript
    interface VVCEComponentProps<P = any, S = any> {
      id: string; // 节点 ID
      props: P; // 组件属性
      state?: S; // 组件状态
      style?: StyleProperties; // 内联样式
      styleClass?: string | string[]; // 样式类
      visible?: boolean; // 可见性
      onEvent: (event: VVCEEvent) => void; // 事件回调
      onStateChange: (state: S) => void; // 状态变更回调
    }
    ```
  - [ ] 定义 `VVCEEvent` 事件接口
    ```typescript
    interface VVCEEvent {
      type: string; // 事件类型 (click, change, etc.)
      target: string; // 目标节点 ID
      payload?: Record<string, any>; // 事件数据
      timestamp: number; // 时间戳
    }
    ```
  - [ ] 定义 `EventDefinition` 事件定义接口
  - [ ] 定义 `StateShapeDefinition` 状态形状接口

- [ ] **组件生命周期接口** (`src/types/lifecycle.ts`)
  - [ ] 定义 `VVCEComponentLifecycle` 接口
    ```typescript
    interface VVCEComponentLifecycle {
      onMount?: () => void; // 组件挂载
      onUnmount?: () => void; // 组件卸载
      onPropsChange?: (prev: P, next: P) => void; // 属性变更
      onStateChange?: (prev: S, next: S) => void; // 状态变更
      onVisibilityChange?: (visible: boolean) => void; // 可见性变更
    }
    ```
  - [ ] 定义 `useVVCEComponent` 钩子接口（React 适配）

- [ ] **组件注册表** (`src/registry/ComponentRegistry.ts`)
  - [ ] 实现 `ComponentRegistry` 类
    ```typescript
    class ComponentRegistry {
      register(meta: VVCEComponentMeta, component: ComponentType): void;
      get(type: string): RegisteredComponent | undefined;
      has(type: string): boolean;
      list(): VVCEComponentMeta[];
      unregister(type: string): boolean;
    }
    ```
  - [ ] 实现注册校验（检查 meta 完整性）
  - [ ] 实现组件查找和列举
  - [ ] 支持组件覆盖/替换
  - [ ] 导出单例 `componentRegistry`

- [ ] **组件工厂** (`src/factory/ComponentFactory.ts`)
  - [ ] 实现 `ComponentFactory` 类
    ```typescript
    class ComponentFactory {
      create(node: NodeDSL, context: RenderContext): ComponentInstance;
      createFromType(type: string, props: any): ComponentInstance;
    }
    ```
  - [ ] 支持从 DSL 节点创建组件实例
  - [ ] 注入 Runtime 上下文（用于事件分发和状态同步）
  - [ ] 处理组件不存在的情况（FallbackComponent）

- [ ] **渲染上下文** (`src/context/RenderContext.ts`)
  - [ ] 定义 `RenderContext` 接口
    ```typescript
    interface RenderContext {
      runtime: VVCERuntime; // Runtime 引用
      theme: ThemeConfig; // 当前主题
      resources: CourseResources; // 资源定义
      dispatch: (event: VVCEEvent) => void; // 事件分发
      getState: (nodeId: string) => any; // 获取节点状态
      setState: (nodeId: string, state: any) => void; // 设置节点状态
      resolveRef: (ref: string) => any; // 解析引用
    }
    ```
  - [ ] 实现 React Context Provider（`VVCEProvider`）
  - [ ] 实现 `useVVCEContext` 钩子

#### 2. M0 基础组件实现 `@priority:critical`

- [ ] **Dialog 组件** (`src/components/Dialog/`)
  - [ ] 创建目录结构
    ```
    Dialog/
    ├── index.ts          # 导出
    ├── Dialog.tsx        # React 组件实现
    ├── Dialog.meta.ts    # 组件元数据
    ├── Dialog.styles.ts  # 样式定义
    └── Dialog.test.tsx   # 单元测试
    ```
  - [ ] 定义组件元数据
    ```typescript
    const DialogMeta: VVCEComponentMeta = {
      type: 'Dialog',
      displayName: '对话框',
      description: '显示文本内容，支持头像和说话者',
      propsSchema: DialogPropsSchema,
      stateShape: null, // Dialog 无状态
      events: [], // Dialog 无事件
      defaultProps: { text: '' },
    };
    ```
  - [ ] 实现 Dialog React 组件
    - [ ] 支持 `text` 属性渲染
    - [ ] 支持文本插值 `{{ref}}` 语法
    - [ ] 支持 `speaker` 显示说话者名称
    - [ ] 支持 `avatar` 头像图片
    - [ ] 支持主题样式适配
    - [ ] 支持响应式布局
  - [ ] 实现样式（支持 9 种内置主题）
  - [ ] 编写单元测试（覆盖率 > 90%）
    - [ ] 基础渲染测试
    - [ ] 文本插值测试
    - [ ] 头像/说话者渲染测试
    - [ ] 样式应用测试
    - [ ] 快照测试

- [ ] **Button 组件** (`src/components/Button/`)
  - [ ] 创建目录结构（同 Dialog）
  - [ ] 定义组件元数据
    ```typescript
    const ButtonMeta: VVCEComponentMeta = {
      type: 'Button',
      displayName: '按钮',
      description: '可点击的交互按钮',
      propsSchema: ButtonPropsSchema,
      stateShape: null,
      events: [{ type: 'click', description: '点击事件' }],
      defaultProps: { text: '按钮', variant: 'primary' },
    };
    ```
  - [ ] 实现 Button React 组件
    - [ ] 支持 `text` 属性
    - [ ] 支持 `variant` 变体 (primary/secondary/text)
    - [ ] 支持 `disabled` 禁用状态
    - [ ] 支持文本插值 `{{ref}}`
    - [ ] 触发 `click` 事件到 EventBus
    - [ ] 支持主题样式适配
    - [ ] 支持悬停/激活状态样式
    - [ ] 支持进入/退出动画
  - [ ] 实现样式（支持所有内置主题）
  - [ ] 编写单元测试
    - [ ] 基础渲染测试
    - [ ] 点击事件触发测试
    - [ ] 禁用状态测试
    - [ ] 样式变体测试
    - [ ] 无障碍测试 (a11y)

- [ ] **QuizSingle 组件** (`src/components/QuizSingle/`)
  - [ ] 创建目录结构（同 Dialog）
  - [ ] 定义组件元数据
    ```typescript
    const QuizSingleMeta: VVCEComponentMeta = {
      type: 'QuizSingle',
      displayName: '单选题',
      description: '单选测验组件',
      propsSchema: QuizSinglePropsSchema,
      stateShape: {
        selected: { type: 'string', nullable: true, description: '当前选中的选项' },
      },
      events: [
        { type: 'change', description: '选择变更事件', payload: { selected: 'string' } },
      ],
      defaultProps: { question: '', options: [] },
    };
    ```
  - [ ] 实现 QuizSingle React 组件
    - [ ] 支持 `question` 问题文本
    - [ ] 支持 `options` 选项数组渲染
    - [ ] 支持 `answerKey` 答案键（可选，用于本地校验）
    - [ ] 管理 `selected` 内部状态
    - [ ] 与 Runtime Store 同步状态
    - [ ] 触发 `change` 事件（包含 selected 值）
    - [ ] 支持选项样式（正确/错误/选中/未选中）
    - [ ] 支持主题样式适配
    - [ ] 支持键盘导航 (a11y)
  - [ ] 实现样式
    - [ ] 选项列表样式
    - [ ] 选中状态样式
    - [ ] 正确/错误反馈样式
    - [ ] 禁用状态样式
  - [ ] 编写单元测试
    - [ ] 基础渲染测试
    - [ ] 选项点击测试
    - [ ] 状态变更测试
    - [ ] change 事件触发测试
    - [ ] 无障碍测试

#### 3. 文本插值系统 `@priority:high`

- [ ] **插值解析器** (`src/utils/interpolation.ts`)
  - [ ] 实现 `interpolate` 函数
    ```typescript
    function interpolate(template: string, resolver: (path: string) => any): string;
    ```
  - [ ] 支持 `{{ref}}` 语法
  - [ ] 支持嵌套路径 `{{globals.vars.score}}`
  - [ ] 支持默认值 `{{path:defaultValue}}`
  - [ ] 支持格式化 `{{path|format}}`（可选，M1）
  - [ ] 处理未找到的引用（显示占位符或空）
  - [ ] 编写单元测试

- [ ] **插值 Hook** (`src/hooks/useInterpolation.ts`)
  - [ ] 实现 `useInterpolation` 钩子
    ```typescript
    function useInterpolation(template: string): string;
    ```
  - [ ] 自动订阅相关状态变更
  - [ ] 支持依赖追踪优化

#### 4. 样式系统集成 `@priority:high`

- [ ] **主题 Provider** (`src/theme/ThemeProvider.tsx`)
  - [ ] 实现 `VVCEThemeProvider` 组件
  - [ ] 注入 CSS 变量到根元素
  - [ ] 支持动态主题切换
  - [ ] 支持 9 种内置主题
  - [ ] 支持自定义主题扩展

- [ ] **样式工具** (`src/utils/styles.ts`)
  - [ ] 实现 `resolveStyle` 函数（解析 StyleProperties 到 CSS）
  - [ ] 实现 `mergeStyles` 函数（合并多个样式）
  - [ ] 实现 `applyStyleClass` 函数（应用样式类）
  - [ ] 实现 CSS 变量引用解析

- [ ] **动画系统** (`src/animation/`)
  - [ ] 实现 30+ 内置动画 CSS
  - [ ] 实现 `useAnimation` 钩子
  - [ ] 支持自定义动画定义
  - [ ] 支持动画序列和并行

#### 5. vvce-core 集成层 `@priority:high`

- [ ] **Runtime 适配器** (`src/adapters/RuntimeAdapter.ts`)
  - [ ] 实现 `RuntimeAdapter` 类
    ```typescript
    class RuntimeAdapter {
      constructor(runtime: VVCERuntime);
      subscribe(callback: (state: RuntimeState) => void): () => void;
      dispatch(event: VVCEEvent): void;
      getNodeState(nodeId: string): any;
      setNodeState(nodeId: string, state: any): void;
      resolveRef(path: string): any;
    }
    ```
  - [ ] 桥接 vvce-core EventBus
  - [ ] 桥接 vvce-core Store
  - [ ] 处理状态同步

- [ ] **场景渲染器** (`src/renderer/SceneRenderer.tsx`)
  - [ ] 实现 `SceneRenderer` 组件
    ```typescript
    interface SceneRendererProps {
      scene: SceneDSL;
      runtime: VVCERuntime;
    }
    ```
  - [ ] 渲染场景布局（stack/grid/flex/absolute/masonry）
  - [ ] 渲染节点列表
  - [ ] 处理节点可见性
  - [ ] 处理场景过渡动画

- [ ] **节点渲染器** (`src/renderer/NodeRenderer.tsx`)
  - [ ] 实现 `NodeRenderer` 组件
  - [ ] 根据节点 type 查找组件
  - [ ] 注入组件 props 和事件处理
  - [ ] 处理节点样式和动画
  - [ ] 处理条件渲染 (`visible`)

#### 6. 测试与质量保障 `@priority:high`

- [ ] **测试基础设施**
  - [ ] 配置 Vitest 测试环境
  - [ ] 配置 @testing-library/react
  - [ ] 创建测试工具函数
    - [ ] `renderWithVVCE` - 带上下文的渲染
    - [ ] `createMockRuntime` - 模拟 Runtime
    - [ ] `createMockStore` - 模拟 Store
  - [ ] 配置覆盖率报告

- [ ] **组件测试要求**
  - [ ] 每个组件单元测试覆盖率 > 90%
  - [ ] 每个组件包含快照测试
  - [ ] 每个组件包含无障碍测试
  - [ ] 事件触发和状态同步测试

- [ ] **集成测试**
  - [ ] 场景渲染完整流程测试
  - [ ] 组件交互与状态同步测试
  - [ ] 主题切换测试
  - [ ] 动画执行测试

#### 7. 开发工具与文档 `@priority:medium`

- [ ] **Storybook 集成**（可选，M0 后期或 M1）
  - [ ] 配置 Storybook
  - [ ] 为每个组件创建 Story
  - [ ] 添加交互式文档

- [ ] **组件文档**
  - [ ] 组件协议文档
  - [ ] 各组件 API 文档
  - [ ] 使用示例
  - [ ] 主题定制指南

- [ ] **开发脚本更新**
  - [ ] 更新 package.json 添加 React 依赖
  - [ ] 更新 tsconfig.json 支持 JSX
  - [ ] 添加测试脚本
  - [ ] 添加 Storybook 脚本（可选）

### Backend API 实现

- [ ] **数据模型完善** `@priority:high`
  - [ ] Course 实体和 Repository
  - [ ] Progress 实体和 Repository
  - [ ] User 实体和 Repository
  - [ ] 数据库迁移脚本

- [ ] **Course API** `@priority:high`
  - [ ] POST /api/v1/courses - 创建课程
  - [ ] GET /api/v1/courses - 获取课程列表（分页、过滤）
  - [ ] GET /api/v1/courses/{id} - 获取课程详情
  - [ ] GET /api/v1/courses/{id}/dsl - 获取课程 DSL
  - [ ] PUT /api/v1/courses/{id} - 更新课程
  - [ ] DELETE /api/v1/courses/{id} - 删除课程
  - [ ] GET /api/v1/courses/{id}/resources - 获取课程资源
  - [ ] 添加 API 单元测试
  - [ ] 添加集成测试

- [ ] **Progress API** `@priority:high`
  - [ ] POST /api/v1/progress - 保存学习进度
  - [ ] GET /api/v1/progress/{userId}/{courseId} - 获取进度
  - [ ] GET /api/v1/progress/{userId} - 获取用户所有进度
  - [ ] GET /api/v1/progress/{userId}/{courseId}/stats - 进度统计
  - [ ] DELETE /api/v1/progress/{userId}/{courseId} - 重置进度
  - [ ] 添加 API 单元测试
  - [ ] 添加集成测试

- [ ] **Identity API** `@priority:high`
  - [ ] POST /api/v1/auth/register - 用户注册
  - [ ] POST /api/v1/auth/login - 用户登录
  - [ ] POST /api/v1/auth/refresh - 刷新 Token
  - [ ] GET /api/v1/auth/me - 获取当前用户信息
  - [ ] 实现 JWT 认证过滤器
  - [ ] 实现密码加密（BCrypt）
  - [ ] 添加认证测试

- [ ] **Contracts 包完善** `@priority:medium`
  - [ ] 定义所有 API 请求/响应类型
  - [ ] 生成 OpenAPI 3.0 规范
  - [ ] 定义统一错误码体系
  - [ ] 创建 TypeScript 类型（从 OpenAPI 生成）

### M0 验收测试

- [ ] **功能验收** `@priority:critical`
  - [ ] 能加载并运行示例 DSL
  - [ ] 基础组件渲染正常
  - [ ] 事件触发和动作执行正常
  - [ ] 场景跳转正常
  - [ ] 进度保存和恢复正常
  - [ ] 日志记录完整可回放

- [ ] **测试覆盖率** `@priority:high`
  - [ ] vvce-core 单元测试覆盖率 > 80%
  - [ ] vvce-schema 单元测试覆盖率 > 70%
  - [ ] Backend API 单元测试覆盖率 > 70%
  - [ ] 端到端测试（至少 2 个完整流程）

- [ ] **性能基准** `@priority:medium`
  - [ ] 测试大型课件加载时间（< 500ms）
  - [ ] 测试状态更新性能（1000次 < 100ms）
  - [ ] 测试内存占用（< 50MB for typical course）

### Demo 应用

- [ ] **创建 Web Demo** `@priority:high`
  - [ ] 初始化 React + Vite 项目
  - [ ] 集成 vvce-core 和 vvce-components
  - [ ] 创建课件播放器界面
  - [ ] 实现进度保存到 localStorage
  - [ ] 添加调试面板（状态查看、日志）
  - [ ] 部署到 Vercel/Netlify

---

## 📋 中优先级（M0 完成后）

### vvce-core 增强

- [ ] **集成测试套件** `@priority:medium`
  - [ ] 多场景跳转测试
  - [ ] 复杂条件评估测试
  - [ ] 并行动作执行测试
  - [ ] 错误处理和恢复测试

- [ ] **性能优化** `@priority:medium`
  - [ ] 实现状态更新批处理
  - [ ] 优化引用解析缓存
  - [ ] 减少不必要的日志开销（生产模式）
  - [ ] 实现懒加载机制

- [ ] **DevTools 支持** `@priority:medium`
  - [ ] 实现 Chrome DevTools Extension 协议
  - [ ] 支持状态时间旅行
  - [ ] 支持断点调试
  - [ ] 性能分析工具

### Web Admin 应用

- [ ] **项目初始化** `@priority:medium`
  - [ ] React + Vite + TypeScript 搭建
  - [ ] 路由配置（React Router）
  - [ ] 状态管理（Zustand/Jotai）
  - [ ] UI 框架（Ant Design/Shadcn UI）
  - [ ] API 客户端配置

- [ ] **核心功能页面** `@priority:medium`
  - [ ] 登录/注册页面
  - [ ] 课程列表页面（表格、搜索、分页）
  - [ ] 课程创建/编辑页面
  - [ ] DSL 编辑器（Monaco Editor + JSON 校验）
  - [ ] 课程预览页面（集成 VVCE）
  - [ ] 数据看板（统计图表）

- [ ] **高级功能** `@priority:low`
  - [ ] 可视化 DSL 编辑器（拖拽式）
  - [ ] 版本管理
  - [ ] 协作编辑
  - [ ] 权限管理

### 文档完善

- [ ] **API 文档** `@priority:medium`
  - [ ] 使用 SpringDoc 生成 OpenAPI 文档
  - [ ] 添加 Swagger UI
  - [ ] 编写 API 使用示例
  - [ ] 创建 Postman Collection

- [ ] **组件文档** `@priority:medium`
  - [ ] 为每个组件编写文档
  - [ ] 创建 Storybook 示例
  - [ ] 添加交互式演示
  - [ ] 组件 Props 参考表

- [ ] **开发者指南** `@priority:medium`
  - [ ] 贡献指南（CONTRIBUTING.md）
  - [ ] 代码风格指南
  - [ ] 组件开发指南
  - [ ] DSL 编写最佳实践
  - [ ] 部署指南

---

## 📁 vvce-components 目录结构参考

```
packages/vvce-components/
├── src/
│   ├── index.ts                    # 主入口，导出所有公共 API
│   │
│   ├── types/                      # 类型定义
│   │   ├── index.ts
│   │   ├── component.ts            # VVCEComponentMeta, VVCEComponentProps
│   │   ├── events.ts               # VVCEEvent, EventDefinition
│   │   ├── lifecycle.ts            # VVCEComponentLifecycle
│   │   └── state.ts                # StateShapeDefinition
│   │
│   ├── registry/                   # 组件注册
│   │   ├── index.ts
│   │   └── ComponentRegistry.ts
│   │
│   ├── factory/                    # 组件工厂
│   │   ├── index.ts
│   │   ├── ComponentFactory.ts
│   │   └── FallbackComponent.tsx
│   │
│   ├── context/                    # React 上下文
│   │   ├── index.ts
│   │   ├── RenderContext.ts
│   │   ├── VVCEProvider.tsx
│   │   └── hooks.ts                # useVVCEContext, useVVCEComponent
│   │
│   ├── adapters/                   # Runtime 适配
│   │   ├── index.ts
│   │   └── RuntimeAdapter.ts
│   │
│   ├── renderer/                   # 渲染器
│   │   ├── index.ts
│   │   ├── SceneRenderer.tsx
│   │   ├── NodeRenderer.tsx
│   │   └── LayoutRenderer.tsx
│   │
│   ├── components/                 # 组件实现
│   │   ├── index.ts
│   │   │
│   │   ├── Dialog/
│   │   │   ├── index.ts
│   │   │   ├── Dialog.tsx
│   │   │   ├── Dialog.meta.ts
│   │   │   ├── Dialog.styles.ts
│   │   │   └── Dialog.test.tsx
│   │   │
│   │   ├── Button/
│   │   │   ├── index.ts
│   │   │   ├── Button.tsx
│   │   │   ├── Button.meta.ts
│   │   │   ├── Button.styles.ts
│   │   │   └── Button.test.tsx
│   │   │
│   │   └── QuizSingle/
│   │       ├── index.ts
│   │       ├── QuizSingle.tsx
│   │       ├── QuizSingle.meta.ts
│   │       ├── QuizSingle.styles.ts
│   │       └── QuizSingle.test.tsx
│   │
│   ├── theme/                      # 主题系统
│   │   ├── index.ts
│   │   ├── ThemeProvider.tsx
│   │   ├── themes/                 # 9 种内置主题
│   │   │   ├── default.ts
│   │   │   ├── playful.ts
│   │   │   ├── academic.ts
│   │   │   └── ...
│   │   └── utils.ts
│   │
│   ├── animation/                  # 动画系统
│   │   ├── index.ts
│   │   ├── animations.css          # 30+ 内置动画
│   │   ├── useAnimation.ts
│   │   └── AnimationController.ts
│   │
│   ├── utils/                      # 工具函数
│   │   ├── index.ts
│   │   ├── interpolation.ts        # 文本插值
│   │   ├── styles.ts               # 样式处理
│   │   └── dom.ts                  # DOM 工具
│   │
│   └── hooks/                      # 自定义 Hooks
│       ├── index.ts
│       ├── useInterpolation.ts
│       ├── useNodeState.ts
│       └── useAnimation.ts
│
├── test/                           # 测试
│   ├── setup.ts                    # 测试配置
│   ├── utils.tsx                   # 测试工具
│   └── integration/                # 集成测试
│       └── SceneRender.test.tsx
│
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

---

## 🌟 低优先级（M1/M2 阶段）

### 组件扩展（M1）

- [ ] Input 组件
- [ ] TextArea 组件
- [ ] QuizMultiple 组件
- [ ] DragDrop 组件
- [ ] Audio 组件
- [ ] Video 组件
- [ ] Record 组件
- [ ] Image 组件

### 小程序开发（M2）

- [ ] 微信小程序项目初始化
- [ ] 学生端功能
- [ ] 家长端功能
- [ ] WebView 集成 VVCE
- [ ] 原生能力封装

### AI 生成工具（M2）

- [ ] Script 转 DSL 工具
- [ ] 模板系统
- [ ] AI 生成集成（Claude API）
- [ ] 批量处理工具
- [ ] 资源管理系统

### Assessment 模块（M2）

- [ ] Rubric 定义系统
- [ ] 评估 API
- [ ] 证据链记录
- [ ] AI 追问机制

---

## 🐛 已知问题 & 技术债务

### Bug 修复

- [ ] 修复：状态路径深度嵌套解析问题（edge case）
- [ ] 修复：并行动作执行顺序不确定性
- [ ] 修复：日志回放时 timestamp 精度问题

### 技术债务

- [ ] 重构：ActionExecutor 过大，拆分为多个执行器
- [ ] 重构：Store 性能优化（使用 Immer 或 Proxy）
- [ ] 重构：日志系统支持不同日志级别和过滤
- [ ] 改进：错误处理和错误信息国际化
- [ ] 改进：类型定义完善（减少 any 使用）

### 代码质量

- [ ] 添加 ESLint 自定义规则（DSL 最佳实践）
- [ ] 配置 Husky pre-commit hooks
- [ ] 集成 SonarQube 代码质量扫描
- [ ] 提升测试覆盖率到 90%+

---

## 📊 进度追踪

### M0 阶段完成度：70%

| 模块            | 进度 | 状态 | 说明                                           |
| --------------- | ---- | ---- | ---------------------------------------------- |
| vvce-core       | 95%  | ✅   | 只剩集成测试                                   |
| vvce-schema     | 85%  | ✅   | JSON Schema、语义校验、Dry Run 已完成          |
| vvce-components | 5%   | 🔴   | **关键路径** - 需要实现组件架构和 3 个基础组件 |
| Backend API     | 30%  | 🔄   | 需要实现所有 API                               |
| CI/CD           | 100% | ✅   | 已完成                                         |
| 文档            | 85%  | ✅   | 需要 API 和组件文档                            |

### vvce-components 详细进度

| 子模块          | 进度 | 状态 |
| --------------- | ---- | ---- |
| 组件协议定义    | 0%   | ⏳   |
| 组件注册表      | 0%   | ⏳   |
| 组件工厂        | 0%   | ⏳   |
| 渲染上下文      | 0%   | ⏳   |
| Dialog 组件     | 0%   | ⏳   |
| Button 组件     | 0%   | ⏳   |
| QuizSingle 组件 | 0%   | ⏳   |
| 文本插值系统    | 0%   | ⏳   |
| 样式系统集成    | 0%   | ⏳   |
| Runtime 适配器  | 0%   | ⏳   |
| 场景/节点渲染器 | 0%   | ⏳   |
| 测试基础设施    | 0%   | ⏳   |

---

## 🎯 本周重点（2026-01-14 ~ 2026-01-20）

### 优先级 1：vvce-components 基础架构

1. **组件协议定义** - 完成 `VVCEComponentMeta`、`VVCEComponentProps`、`VVCEEvent` 接口
2. **组件注册表** - 实现 `ComponentRegistry` 类
3. **渲染上下文** - 实现 `RenderContext` 和 `VVCEProvider`

### 优先级 2：基础组件实现

4. **Dialog 组件** - 完成基础实现和测试
5. **Button 组件** - 完成基础实现和测试

### 优先级 3：集成与验证

6. **Runtime 适配器** - 桥接 vvce-core
7. **简单集成测试** - 验证组件与 Runtime 交互

### 本周目标

- vvce-components 进度从 5% 提升到 40%
- 完成组件架构基础设施
- 完成 Dialog 和 Button 两个组件

---

## 📝 备注

- 优先级标签：`@priority:critical` > `@priority:high` > `@priority:medium` > `@priority:low`
- 每完成一项任务，更新此文件并提交
- 每周更新"本周重点"和进度追踪
- 如有新任务或问题，及时添加到对应分类

---

**维护者**: VV Education Team
**联系方式**: 见 README.md
