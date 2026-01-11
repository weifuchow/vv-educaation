# VV Education - 开发路线图

## M0 阶段：VVCE 引擎跑通（第一优先）

**目标**：构建能运行的最小课件引擎

### Core 包 (packages/vvce-core)

- [x] 项目脚手架搭建
- [x] 类型定义
- [x] 事件总线实现
- [x] 状态管理实现
- [x] 引用解析器
- [x] 条件评估器
- [x] 动作执行器
- [x] 触发器解释器
- [x] 运行时主类
- [x] 日志记录器
- [ ] 单元测试
- [ ] 集成测试

### Schema 包 (packages/vvce-schema)

- [x] 项目脚手架搭建
- [x] DSL 类型定义
- [x] 基础校验器
- [x] 示例 DSL
- [ ] JSON Schema 定义
- [ ] 语义校验完善
- [ ] Dry Run 模拟器
- [ ] 单元测试

### Components 包 (packages/vvce-components)

- [x] 项目脚手架搭建
- [ ] 组件协议定义
- [ ] Dialog 组件实现
- [ ] QuizSingle 组件实现
- [ ] Button 组件实现
- [ ] 组件注册机制
- [ ] 组件测试

### Backend API (server/api)

- [x] Spring Boot 项目搭建
- [x] 数据库设计
- [ ] Course API 实现
  - [ ] 创建课程
  - [ ] 获取课程列表
  - [ ] 获取课程详情
  - [ ] 获取课程 DSL
- [ ] Progress API 实现
  - [ ] 保存进度
  - [ ] 读取进度
  - [ ] 进度统计
- [ ] Identity API 实现
  - [ ] 用户注册/登录
  - [ ] JWT 认证
- [ ] 单元测试
- [ ] API 文档完善

### Contracts 包 (packages/contracts)

- [x] 项目脚手架搭建
- [ ] API 类型定义
- [ ] OpenAPI 规范
- [ ] 错误码定义

### M0 里程碑验收标准

- [ ] 能加载并运行示例 DSL
- [ ] 基础组件渲染正常
- [ ] 事件触发和动作执行正常
- [ ] 场景跳转正常
- [ ] 进度保存和恢复正常
- [ ] 日志记录完整
- [ ] 核心功能单元测试覆盖 > 80%

---

## M1 阶段：组件扩展与管理端

**预计开始**：M0 完成后

### 组件扩展

- [ ] Input（文本输入）
- [ ] TextArea（多行文本）
- [ ] QuizMultiple（多选题）
- [ ] DragDrop（拖拽排序）
- [ ] Audio（音频播放）
- [ ] Video（视频播放）
- [ ] Record（录音）
- [ ] Image（图片展示）

### Web Admin (apps/web-admin)

- [ ] 项目初始化（React + Vite）
- [ ] 路由配置
- [ ] 课程列表页面
- [ ] 课程编辑页面
  - [ ] DSL 编辑器（Monaco）
  - [ ] 可视化编辑器（可选）
- [ ] 课程预览页面
  - [ ] 集成 VVCE 引擎
- [ ] 数据看板
- [ ] 用户管理
- [ ] 权限管理

### DevTools (tools/vvce-devtools)

- [ ] 调试面板组件
- [ ] 日志查看器
- [ ] 状态查看器
- [ ] 事件监控
- [ ] 回放功能

---

## M2 阶段：AI 生成与高级功能

**预计开始**：M1 完成后

### Course Factory (tools/course-factory)

- [ ] Script 转 DSL 工具
- [ ] 模板系统
- [ ] AI 生成集成
- [ ] 批量处理
- [ ] 资源管理

### Assessment 模块

- [ ] Rubric 定义
- [ ] 评估 API
- [ ] 证据链记录
- [ ] AI 追问机制

### 小程序 (apps/miniapp)

- [ ] 小程序基础架构
- [ ] 学生入口
- [ ] 家长入口
- [ ] WebView 集成
- [ ] 原生能力封装
  - [ ] 登录授权
  - [ ] 分享
  - [ ] 录音
  - [ ] 相册

---

## M3 阶段：项目制与协作

**预计开始**：M2 完成后

### Project 模块

- [ ] 项目管理 API
- [ ] 组队功能
- [ ] 成果提交
- [ ] 同伴评审
- [ ] 反作弊机制

### Web Student (apps/web-student)

- [ ] 项目工作台
- [ ] 创作工具
- [ ] 演讲录制
- [ ] 作品展示

### 运营增长

- [ ] 推荐系统
- [ ] 个性化学习路径
- [ ] 成就系统
- [ ] 学习报告

---

## 技术债务与优化

### 性能优化

- [ ] 大型课件加载优化
- [ ] 虚拟滚动
- [ ] 懒加载
- [ ] 缓存策略

### 工程化

- [ ] CI/CD 流水线
- [ ] 自动化测试
- [ ] 代码覆盖率监控
- [ ] 性能监控

### 文档完善

- [ ] API 文档
- [ ] 组件文档
- [ ] 最佳实践指南
- [ ] 贡献指南

---

## 当前进度

**阶段**: M0 - 脚手架搭建完成

**已完成**:

- ✅ Monorepo 架构搭建
- ✅ packages/vvce-core 核心代码骨架
- ✅ packages/vvce-schema 基础实现
- ✅ packages/vvce-components 脚手架
- ✅ packages/contracts 脚手架
- ✅ packages/shared 脚手架
- ✅ server/api Spring Boot 项目搭建
- ✅ apps/miniapp README
- ✅ apps/web-admin README
- ✅ apps/web-student README
- ✅ 技术规范文档
- ✅ 开发指南

**进行中**:

- 🔄 vvce-core 单元测试
- 🔄 vvce-schema 完善校验器
- 🔄 vvce-components 组件实现

**下一步**:

1. 完成 vvce-core 单元测试
2. 实现基础 3 个组件
3. 完成 Course API
4. 完成 Progress API
5. 创建简单的演示 demo

---

## 更新日志

### 2024-01-10

- 完成项目脚手架搭建
- 完成核心包基础代码
- 完成文档体系建设

---

最后更新：2024-01-10
