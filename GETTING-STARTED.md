# VV Education - 开发指南

## 快速开始

### 环境要求

#### 前端开发
- Node.js >= 18.0.0
- pnpm >= 8.0.0

#### 后端开发
- JDK 17+
- Maven 3.8+
- PostgreSQL 14+ / MySQL 8+
- Redis 6+

### 安装依赖

#### 前端（Monorepo）

```bash
# 安装 pnpm（如未安装）
npm install -g pnpm

# 安装所有依赖
pnpm install
```

#### 后端

```bash
cd server/api
mvn clean install
```

## 项目结构

```
vv-education/
├── apps/                   # 应用层
│   ├── miniapp/            # 小程序
│   ├── web-admin/          # 管理端
│   └── web-student/        # PC 学生端
├── packages/               # 共享包
│   ├── vvce-core/          # VVCE 引擎核心
│   ├── vvce-schema/        # DSL 定义和校验
│   ├── vvce-components/    # 组件库
│   ├── contracts/          # API 契约
│   └── shared/             # 通用工具
├── server/                 # 后端服务
│   └── api/                # Spring Boot API
├── tools/                  # 工具
│   ├── course-factory/     # 课件工厂
│   └── vvce-devtools/      # 开发工具
├── docs/                   # 文档
│   └── specs/              # 技术规范
└── infra/                  # 基础设施
```

## 开发流程

### 1. 核心包开发（packages）

#### vvce-core

VVCE 引擎核心运行时。

```bash
cd packages/vvce-core

# 开发模式（监听文件变更）
pnpm dev

# 构建
pnpm build

# 测试
pnpm test

# 类型检查
pnpm typecheck
```

#### vvce-schema

DSL 定义和校验器。

```bash
cd packages/vvce-schema
pnpm dev
```

#### vvce-components

组件库。

```bash
cd packages/vvce-components
pnpm dev
```

### 2. 应用开发（apps）

#### web-admin

管理端（计划使用 React + Vite）。

```bash
cd apps/web-admin
pnpm dev
```

访问: http://localhost:5173

#### miniapp

小程序（待实现）。

### 3. 后端开发（server）

#### 启动开发环境

```bash
# 确保 PostgreSQL 和 Redis 已启动

cd server/api

# 开发模式启动
mvn spring-boot:run
```

API 文档: http://localhost:8080/api/swagger-ui.html

#### 数据库初始化

```bash
# 创建数据库
createdb vv_education

# 应用会自动创建表（JPA ddl-auto: update）
```

## Monorepo 工作流

### 构建所有包

```bash
# 根目录执行
pnpm build
```

### 仅构建 packages

```bash
pnpm build:packages
```

### 仅构建 apps

```bash
pnpm build:apps
```

### 运行所有测试

```bash
pnpm test
```

### 类型检查

```bash
pnpm typecheck
```

### 代码规范检查

```bash
pnpm lint
```

## 包依赖关系

```
apps/web-admin
├── @vv-education/vvce-core
├── @vv-education/vvce-schema
├── @vv-education/vvce-components
└── @vv-education/contracts

packages/vvce-core
└── @vv-education/vvce-schema

packages/vvce-components
└── @vv-education/vvce-schema
```

## 开发建议

### 优先级

1. **M0 阶段** - 先完成 VVCE 引擎核心能力
   - packages/vvce-core
   - packages/vvce-schema
   - packages/vvce-components（基础 3 个组件）
   - server/api（Course + Progress API）

2. **M1 阶段** - 管理端和组件扩展
   - apps/web-admin
   - 更多组件

3. **M2 阶段** - AI 生成和高级功能
   - tools/course-factory
   - Assessment API

### 代码风格

- 使用 TypeScript
- 遵循 ESLint 规则
- 使用 Prettier 格式化
- 提交前运行 `pnpm lint` 和 `pnpm typecheck`

### Git 工作流

```bash
# 创建功能分支
git checkout -b feature/xxx

# 开发...

# 提交
git add .
git commit -m "feat: xxx"

# 推送
git push origin feature/xxx
```

## 调试技巧

### 前端调试

1. 使用浏览器开发者工具
2. VVCE 引擎开启 debug 模式：

```typescript
const runtime = new VVCERuntime({
  debug: true,  // 开启日志
});
```

3. 查看日志：

```typescript
const logs = runtime.getLogs();
console.log(logs);
```

### 后端调试

1. IDE 断点调试
2. 查看日志：

```bash
tail -f logs/application.log
```

## 常见问题

### pnpm 安装失败

```bash
# 清理缓存
pnpm store prune

# 重新安装
rm -rf node_modules
pnpm install
```

### 类型错误

```bash
# 重新生成类型定义
pnpm build:packages
```

### 端口被占用

修改相应配置文件中的端口号。

## 参考文档

- [DSL 规范](./docs/specs/DSL-SPEC.md)
- [组件协议](./docs/specs/COMPONENT-PROTOCOL.md)
- [README](./README.md)

## 联系方式

- GitHub Issues: [vv-education/issues](https://github.com/vv-education/vv-education/issues)
