# VV Education - TODO 清单

> **最后更新**: 2026-01-13
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

- [ ] **组件协议定义** `@priority:high`
  - [ ] 定义组件生命周期接口
  - [ ] 定义 props/state/events 协议
  - [ ] 创建组件基类或 HOC
  - [ ] 文档化组件开发规范

- [ ] **Dialog 组件** `@priority:high`
  - [ ] 实现基础对话框组件
  - [ ] 支持文本插值（{{ref}}）
  - [ ] 支持说话人和头像
  - [ ] 支持样式定制
  - [ ] 添加组件测试

- [ ] **QuizSingle 组件** `@priority:high`
  - [ ] 实现单选题组件
  - [ ] 管理 selected 状态
  - [ ] 触发 change 事件
  - [ ] 支持答案校验（可选）
  - [ ] 添加组件测试

- [ ] **Button 组件** `@priority:high`
  - [ ] 实现按钮组件
  - [ ] 支持 click 事件
  - [ ] 支持禁用状态
  - [ ] 支持样式定制
  - [ ] 添加组件测试

- [ ] **组件注册机制** `@priority:high`
  - [ ] 实现组件注册表
  - [ ] 支持动态组件加载
  - [ ] 创建组件工厂
  - [ ] 文档化注册流程

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

- ✅ vvce-core: 95% （只剩集成测试）
- 🔄 vvce-schema: 60% （需要 JSON Schema 和语义校验）
- 🔄 vvce-components: 20% （需要实现 3 个组件）
- 🔄 Backend API: 30% （需要实现所有 API）
- ✅ CI/CD: 100%
- ✅ 文档: 85% （需要 API 和组件文档）

### 预计完成时间

- M0 完成: 预计 1-2 周
- M1 完成: 预计 M0 后 3-4 周
- M2 完成: 预计 M1 后 4-6 周

---

## 🎯 本周重点（2026-01-13 ~ 2026-01-19）

1. **vvce-schema**: 完成 JSON Schema 定义和基础语义校验
2. **vvce-components**: 实现 Dialog 和 Button 组件
3. **Backend API**: 完成 Course API 基础 CRUD
4. **测试**: 提升 vvce-core 测试覆盖率到 85%+

---

## 📝 备注

- 优先级标签：`@priority:critical` > `@priority:high` > `@priority:medium` > `@priority:low`
- 每完成一项任务，更新此文件并提交
- 每周更新"本周重点"和进度追踪
- 如有新任务或问题，及时添加到对应分类

---

**维护者**: VV Education Team
**联系方式**: 见 README.md
