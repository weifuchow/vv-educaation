# Project Init Skill

> 初始化新的 apps 或 packages

## 触发时机

当用户提及以下内容时触发：
- "创建新项目"、"初始化项目"
- "创建新 app"、"创建新 package"
- "添加微信小程序"、"添加 web 应用"

## 项目类型

### 1. 新的 Package

**位置：** `packages/{package-name}/`

**结构：**
```
packages/{package-name}/
├── src/
│   └── index.ts
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts
└── README.md
```

**package.json 模板：**
```json
{
  "name": "@vv-education/{package-name}",
  "version": "0.1.0",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "dev": "tsup --watch",
    "build": "tsup",
    "test": "vitest",
    "test:ci": "vitest run --coverage",
    "typecheck": "tsc --noEmit"
  },
  "peerDependencies": {
    "@vv-education/vvce-schema": "workspace:*"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "^5.3.0",
    "vitest": "^1.0.0"
  }
}
```

### 2. Web 应用 (React + Vite)

**位置：** `apps/{app-name}/`

**结构：**
```
apps/{app-name}/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

**初始化命令：**
```bash
cd apps
pnpm create vite {app-name} --template react-ts
cd {app-name}
pnpm add @vv-education/vvce-core @vv-education/vvce-components
```

### 3. 微信小程序

**位置：** `apps/miniapp/`

**结构：**
```
apps/miniapp/
├── miniprogram/
│   ├── pages/
│   ├── components/
│   ├── utils/
│   ├── app.ts
│   ├── app.json
│   └── app.wxss
├── typings/
├── project.config.json
├── package.json
└── tsconfig.json
```

### 4. 后端模块

**位置：** `server/api/src/main/java/com/vveducation/api/{module}/`

**结构：**
```
{module}/
├── controller/
│   └── {Module}Controller.java
├── service/
│   ├── {Module}Service.java
│   └── impl/
│       └── {Module}ServiceImpl.java
├── repository/
│   └── {Module}Repository.java
├── domain/
│   └── {Module}.java
└── dto/
    ├── {Module}Request.java
    └── {Module}Response.java
```

## 初始化流程

### 创建新 Package

```
用户: 创建一个 vvce-analytics 包

AI:
1. 创建目录结构
2. 初始化 package.json
3. 配置 TypeScript
4. 配置 tsup 构建
5. 配置 Vitest 测试
6. 添加到 pnpm-workspace.yaml
7. 创建基础 index.ts

✅ vvce-analytics 包已创建！

运行以下命令开始开发：
cd packages/vvce-analytics
pnpm dev
```

### 创建新应用

```
用户: 创建 web-admin 应用

AI:
1. 使用 Vite 创建 React 项目
2. 配置路由 (React Router)
3. 配置状态管理 (Zustand)
4. 添加 UI 框架 (Ant Design)
5. 集成 vvce-core 和 vvce-components
6. 创建基础页面结构

✅ web-admin 应用已创建！

运行以下命令启动：
cd apps/web-admin
pnpm dev
```

## 配置模板

### tsconfig.json (Package)

```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### tsup.config.ts

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true
});
```

### vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      reporter: ['text', 'json', 'html']
    }
  }
});
```

### vite.config.ts (App)

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

## 依赖安装

```bash
# 安装所有依赖
pnpm install

# 构建依赖的包
pnpm build:packages
```

## 更新 Workspace

更新 `pnpm-workspace.yaml`：
```yaml
packages:
  - 'packages/*'
  - 'apps/*'
  - 'tools/*'
```

## 检查清单

- [ ] 目录结构正确
- [ ] package.json 配置完整
- [ ] TypeScript 配置正确
- [ ] 依赖声明正确
- [ ] 可以正常构建
- [ ] 可以正常测试
- [ ] 已添加到 workspace
- [ ] README.md 已创建

## 注意事项

- 使用 pnpm，不使用 npm/yarn
- 包名格式: @vv-education/{name}
- 使用 workspace:* 引用内部包
- 保持配置文件一致性
