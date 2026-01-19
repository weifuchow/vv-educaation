# 动画包架构设计

> **版本:** 1.0
> **日期:** 2026-01-18
> **状态:** 设计阶段

## 1. 概述

### 1.1 背景

VV Education 的核心业务是通过 AI 生成高质量教育课件。当用户描述想学习的知识点时，系统通过 VVCE 引擎生成课件并配合 AI 讲解。

**核心挑战：**

- AI 擅长理解语义和组织内容，但不擅长编写复杂动画的 keyframes
- 科普、数学等领域需要专业动画（轨道运动、波浪、分子振动等）
- 动画库需要持续扩展，但不能每次都重新发布前端
- 前端包体积需要可控

### 1.2 设计目标

| 目标         | 说明                                           |
| ------------ | ---------------------------------------------- |
| **AI 友好**  | AI 只需引用动画名称 + 传参数，不编写 keyframes |
| **质量可控** | 所有动画由专业团队预先实现，效果稳定           |
| **热更新**   | 动画包可独立更新，无需重新发布前端             |
| **按需加载** | 只加载课程需要的动画包，控制体积               |
| **持续扩展** | 客户有新需求时，后台补充动画库即可             |

---

## 2. 架构设计

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        动画包体系                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  L1: 领域动画包 (远程加载，热更新)                        │   │
│  │                                                         │   │
│  │  ┌───────────┐ ┌───────────┐ ┌───────────┐             │   │
│  │  │ @science  │ │ @math     │ │ @language │  ...        │   │
│  │  │ • orbit   │ │ • draw    │ │ • stroke  │             │   │
│  │  │ • wave    │ │ • graph   │ │ • typing  │             │   │
│  │  │ • molecule│ │ • morph   │ │ • highlight│            │   │
│  │  │ • explode │ │ • calculate│ │ • underline│           │   │
│  │  └───────────┘ └───────────┘ └───────────┘             │   │
│  │                                                         │   │
│  │  存储: CDN + 数据库    加载: 按需下载    缓存: 本地持久化  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              ↑                                  │
│                           基于                                  │
│                              ↓                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  L0: 基础动画 (内置，随前端发布)                          │   │
│  │                                                         │   │
│  │  入场: fadeIn, slideIn, scaleIn, bounceIn, zoomIn...   │   │
│  │  退场: fadeOut, slideOut, scaleOut, bounceOut...       │   │
│  │  强调: pulse, shake, wobble, swing, tada, heartbeat... │   │
│  │  循环: float, glow, rotate, blink...                   │   │
│  │                                                         │   │
│  │  体积: ~20KB (固定)    共 30+ 个基础动画                  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 数据流

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   后台管理    │────▶│   数据库     │────▶│    CDN      │
│  (创建/编辑)  │     │  (存储定义)   │     │  (分发)     │
└──────────────┘     └──────────────┘     └──────────────┘
                                                 │
                                                 ▼
┌──────────────────────────────────────────────────────────┐
│                      VVCE Runtime                        │
│  ┌────────────────────────────────────────────────────┐  │
│  │                 AnimationRegistry                  │  │
│  │  ┌──────────────┐  ┌──────────────────────────┐   │  │
│  │  │ L0 基础动画   │  │ L1 领域动画包 (动态加载)  │   │  │
│  │  │ (内置)       │  │ ┌────────┐ ┌────────┐   │   │  │
│  │  │ • fadeIn     │  │ │@science│ │@math   │   │   │  │
│  │  │ • bounce     │  │ └────────┘ └────────┘   │   │  │
│  │  │ • ...        │  │                          │   │  │
│  │  └──────────────┘  └──────────────────────────┘   │  │
│  └────────────────────────────────────────────────────┘  │
│                           │                              │
│                           ▼                              │
│  ┌────────────────────────────────────────────────────┐  │
│  │                 AnimationEngine                    │  │
│  │            (执行动画，插值计算)                      │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

## 3. DSL Schema 设计

### 3.1 课程级别：声明动画包依赖

```typescript
interface CourseDSL {
  schema: 'vvce.dsl.v1';
  meta: CourseMeta;

  // 新增：动画包导入声明
  imports?: AnimationImport[];

  globals?: GlobalsDSL;
  resources?: ResourcesDSL;
  startSceneId: string;
  scenes: SceneDSL[];
}

interface AnimationImport {
  // 包名称
  pack: string; // "@vvce/science"

  // 版本约束 (可选)
  version?: string; // "1.2.0" | "^1.0.0" | "latest"

  // 别名 (可选，用于简化引用)
  alias?: string; // "sci" → 可用 "@sci/orbit"
}
```

**示例：**

```json
{
  "schema": "vvce.dsl.v1",
  "meta": { "id": "solar-system", "title": "太阳系探索" },

  "imports": [
    { "pack": "@vvce/science", "version": "^1.0.0" },
    { "pack": "@vvce/basic" }
  ],

  "startSceneId": "intro",
  "scenes": [...]
}
```

### 3.2 节点级别：引用动画

```typescript
interface NodeAnimation {
  // 动画类型：内置动画 | 动画包动画
  type: BuiltinAnimation | string; // "fadeIn" | "@science/orbit"

  // 动画参数 (用于参数化动画)
  params?: Record<string, any>;

  // 覆盖默认配置
  duration?: number;
  easing?: EasingFunction;
  delay?: number;
  iterations?: number;
  direction?: AnimationDirection;
  fillMode?: AnimationFillMode;
}

interface NodeDSL {
  id: string;
  type: ComponentType;
  props?: Record<string, any>;

  // 入场/退场动画
  enterAnimation?: NodeAnimation;
  exitAnimation?: NodeAnimation;

  // 持续动画 (新增)
  animation?: NodeAnimation;
}
```

**示例：**

```json
{
  "id": "earth",
  "type": "Image",
  "props": { "src": "earth.png" },
  "animation": {
    "type": "@science/orbit",
    "params": {
      "radiusX": 200,
      "radiusY": 150,
      "centerX": 400,
      "centerY": 300
    },
    "duration": 10000,
    "iterations": -1
  }
}
```

### 3.3 Action 级别：动态播放动画

```typescript
interface PlayAnimationAction {
  action: 'playAnimation';
  target: string; // 目标节点 ID
  animation: BuiltinAnimation | string; // "pulse" | "@science/wave"
  params?: Record<string, any>; // 动画参数
  duration?: number;
  easing?: EasingFunction;
  delay?: number;
  iterations?: number;
}
```

**示例：**

```json
{
  "triggers": [
    {
      "on": { "event": "click", "target": "explainBtn" },
      "then": [
        {
          "action": "playAnimation",
          "target": "molecule",
          "animation": "@science/vibrate",
          "params": { "intensity": 5 },
          "iterations": 3
        }
      ]
    }
  ]
}
```

---

## 4. 动画包格式

### 4.1 包定义结构

```typescript
interface AnimationPack {
  // 包元信息
  name: string; // "@vvce/science"
  version: string; // "1.2.0"
  description: string; // "科普类动画包，包含轨道、波浪等效果"
  author?: string;

  // 动画定义
  animations: Record<string, AnimationTemplate>;

  // 依赖的其他包 (可选)
  dependencies?: string[]; // ["@vvce/basic"]
}

interface AnimationTemplate {
  // 元信息 (供 AI 理解)
  name: string; // "orbit"
  description: string; // "椭圆轨道运动，用于展示行星公转"
  category?: string; // "motion" | "attention" | "transition"
  tags?: string[]; // ["科普", "天文", "循环"]

  // 参数定义
  params: ParamDefinition[];

  // 动画定义 (支持参数插值)
  keyframes: AnimationKeyframe[];

  // 默认配置
  duration: number;
  easing?: EasingFunction;
  iterations?: number;
  direction?: AnimationDirection;
  fillMode?: AnimationFillMode;
}

interface ParamDefinition {
  name: string; // "radiusX"
  type: 'number' | 'string' | 'boolean' | 'color';
  description: string; // "椭圆X轴半径"
  default: any; // 100
  min?: number; // 0
  max?: number; // 1000
}

interface AnimationKeyframe {
  offset: number; // 0-100
  properties: Record<string, any>; // 支持 "${paramName}" 插值
}
```

### 4.2 包文件示例

```json
{
  "name": "@vvce/science",
  "version": "1.2.0",
  "description": "科普类动画包，包含轨道运动、波浪、分子振动等效果",

  "animations": {
    "orbit": {
      "name": "orbit",
      "description": "椭圆轨道运动，用于展示行星公转、电子轨道等",
      "category": "motion",
      "tags": ["科普", "天文", "物理", "循环"],

      "params": [
        {
          "name": "radiusX",
          "type": "number",
          "description": "椭圆X轴半径",
          "default": 100,
          "min": 10,
          "max": 500
        },
        {
          "name": "radiusY",
          "type": "number",
          "description": "椭圆Y轴半径",
          "default": 80,
          "min": 10,
          "max": 500
        },
        {
          "name": "clockwise",
          "type": "boolean",
          "description": "是否顺时针运动",
          "default": true
        }
      ],

      "keyframes": [
        { "offset": 0, "properties": { "translateX": "${radiusX}", "translateY": 0 } },
        {
          "offset": 25,
          "properties": {
            "translateX": 0,
            "translateY": "${radiusY * (clockwise ? 1 : -1)}"
          }
        },
        { "offset": 50, "properties": { "translateX": "${-radiusX}", "translateY": 0 } },
        {
          "offset": 75,
          "properties": {
            "translateX": 0,
            "translateY": "${radiusY * (clockwise ? -1 : 1)}"
          }
        },
        { "offset": 100, "properties": { "translateX": "${radiusX}", "translateY": 0 } }
      ],

      "duration": 3000,
      "easing": "linear",
      "iterations": -1,
      "fillMode": "forwards"
    },

    "wave": {
      "name": "wave",
      "description": "波浪运动，用于展示声波、水波、电磁波等",
      "category": "motion",
      "tags": ["科普", "物理", "循环"],

      "params": [
        { "name": "amplitude", "type": "number", "description": "振幅", "default": 20 },
        {
          "name": "frequency",
          "type": "number",
          "description": "频率(周期数)",
          "default": 2
        }
      ],

      "keyframes": [
        { "offset": 0, "properties": { "translateY": 0 } },
        { "offset": 25, "properties": { "translateY": "${amplitude}" } },
        { "offset": 50, "properties": { "translateY": 0 } },
        { "offset": 75, "properties": { "translateY": "${-amplitude}" } },
        { "offset": 100, "properties": { "translateY": 0 } }
      ],

      "duration": 1000,
      "easing": "ease-in-out",
      "iterations": -1
    },

    "vibrate": {
      "name": "vibrate",
      "description": "分子振动效果，用于展示分子热运动",
      "category": "attention",
      "tags": ["科普", "化学", "物理"],

      "params": [
        {
          "name": "intensity",
          "type": "number",
          "description": "振动强度",
          "default": 3,
          "min": 1,
          "max": 10
        }
      ],

      "keyframes": [
        { "offset": 0, "properties": { "translateX": 0, "translateY": 0 } },
        {
          "offset": 20,
          "properties": { "translateX": "${intensity}", "translateY": "${-intensity}" }
        },
        {
          "offset": 40,
          "properties": { "translateX": "${-intensity}", "translateY": "${intensity}" }
        },
        {
          "offset": 60,
          "properties": {
            "translateX": "${intensity * 0.5}",
            "translateY": "${intensity}"
          }
        },
        {
          "offset": 80,
          "properties": {
            "translateX": "${-intensity * 0.5}",
            "translateY": "${-intensity * 0.5}"
          }
        },
        { "offset": 100, "properties": { "translateX": 0, "translateY": 0 } }
      ],

      "duration": 200,
      "easing": "linear",
      "iterations": -1
    }
  }
}
```

---

## 5. 核心模块设计

### 5.1 模块结构

```
packages/vvce-core/src/animation/
├── AnimationEngine.ts          # 动画执行引擎 (已有)
├── AnimationRegistry.ts        # 动画注册中心 (新增)
├── AnimationLoader.ts          # 动画包加载器 (新增)
├── AnimationResolver.ts        # 动画引用解析 (新增)
├── ParamInterpolator.ts        # 参数插值器 (新增)
└── types.ts                    # 类型定义
```

### 5.2 AnimationRegistry (动画注册中心)

```typescript
/**
 * AnimationRegistry - 动画注册中心
 *
 * 职责：
 * 1. 管理所有已注册的动画（内置 + 动态加载）
 * 2. 提供动画查询接口
 * 3. 支持动态注册/卸载动画包
 */
class AnimationRegistry {
  // 内置动画 (L0)
  private builtinAnimations: Map<string, AnimationDefinition>;

  // 动态加载的动画包 (L1)
  private loadedPacks: Map<string, AnimationPack>;

  constructor() {
    this.builtinAnimations = new Map();
    this.loadedPacks = new Map();

    // 注册内置动画
    this.registerBuiltins();
  }

  /**
   * 注册内置动画
   */
  private registerBuiltins(): void {
    // 从 presets/animations.ts 加载
    Object.entries(BUILTIN_ANIMATIONS).forEach(([name, def]) => {
      this.builtinAnimations.set(name, def);
    });
  }

  /**
   * 注册动画包
   */
  registerPack(pack: AnimationPack): void {
    this.loadedPacks.set(pack.name, pack);
    this.logger.info('animation', `Registered pack: ${pack.name}@${pack.version}`);
  }

  /**
   * 卸载动画包
   */
  unregisterPack(packName: string): void {
    this.loadedPacks.delete(packName);
  }

  /**
   * 解析动画引用
   *
   * @param ref - 动画引用，如 "fadeIn" 或 "@science/orbit"
   * @returns 动画模板，如果未找到则返回 undefined
   */
  resolve(ref: string): AnimationTemplate | AnimationDefinition | undefined {
    // 1. 检查是否是包引用 (@pack/animation)
    if (ref.startsWith('@')) {
      const [packRef, animName] = this.parsePackRef(ref);
      const pack = this.loadedPacks.get(packRef);
      if (pack && pack.animations[animName]) {
        return pack.animations[animName];
      }
      return undefined;
    }

    // 2. 检查内置动画
    return this.builtinAnimations.get(ref);
  }

  /**
   * 检查动画是否可用
   */
  has(ref: string): boolean {
    return this.resolve(ref) !== undefined;
  }

  /**
   * 获取所有已加载的包
   */
  getLoadedPacks(): string[] {
    return Array.from(this.loadedPacks.keys());
  }

  /**
   * 获取动画包信息 (供 AI 使用)
   */
  getPackManifest(): PackManifest[] {
    return Array.from(this.loadedPacks.values()).map((pack) => ({
      name: pack.name,
      version: pack.version,
      description: pack.description,
      animations: Object.entries(pack.animations).map(([name, anim]) => ({
        name: `${pack.name}/${name}`,
        description: anim.description,
        params: anim.params,
        tags: anim.tags,
      })),
    }));
  }

  private parsePackRef(ref: string): [string, string] {
    // "@vvce/science/orbit" → ["@vvce/science", "orbit"]
    // "@science/orbit" (使用别名) → ["@vvce/science", "orbit"]
    const match =
      ref.match(/^(@[\w-]+\/[\w-]+)\/([\w-]+)$/) || ref.match(/^(@[\w-]+)\/([\w-]+)$/);
    if (!match) {
      throw new Error(`Invalid animation reference: ${ref}`);
    }
    return [match[1], match[2]];
  }
}
```

### 5.3 AnimationLoader (动画包加载器)

```typescript
/**
 * AnimationLoader - 动画包加载器
 *
 * 职责：
 * 1. 从远程 CDN 加载动画包
 * 2. 管理本地缓存
 * 3. 处理版本控制
 */
interface LoaderConfig {
  // CDN 基础路径
  cdnBase: string; // "https://cdn.vveducation.com/animations"

  // 缓存策略
  cacheStrategy: 'memory' | 'indexeddb' | 'localstorage';

  // 缓存有效期 (毫秒)
  maxCacheAge: number; // 24 * 60 * 60 * 1000 (24小时)

  // 请求超时 (毫秒)
  timeout: number; // 10000

  // 重试次数
  retries: number; // 3
}

class AnimationLoader {
  private config: LoaderConfig;
  private memoryCache: Map<string, CachedPack>;
  private registry: AnimationRegistry;
  private storage: CacheStorage;

  constructor(config: LoaderConfig, registry: AnimationRegistry) {
    this.config = config;
    this.registry = registry;
    this.memoryCache = new Map();
    this.storage = this.createStorage(config.cacheStrategy);
  }

  /**
   * 加载课程所需的所有动画包
   */
  async loadImports(imports: AnimationImport[]): Promise<LoadResult> {
    const results: LoadResult = {
      success: [],
      failed: [],
    };

    // 并行加载所有包
    const loadPromises = imports.map(async (imp) => {
      try {
        await this.loadPack(imp.pack, imp.version);
        results.success.push(imp.pack);
      } catch (error) {
        results.failed.push({ pack: imp.pack, error: error.message });
      }
    });

    await Promise.all(loadPromises);
    return results;
  }

  /**
   * 加载单个动画包
   */
  async loadPack(name: string, version?: string): Promise<AnimationPack> {
    const cacheKey = `${name}@${version || 'latest'}`;

    // 1. 检查内存缓存
    const memoryCached = this.memoryCache.get(cacheKey);
    if (memoryCached && !this.isExpired(memoryCached)) {
      return memoryCached.pack;
    }

    // 2. 检查持久缓存
    const storageCached = await this.storage.get(cacheKey);
    if (storageCached && !this.isExpired(storageCached)) {
      this.memoryCache.set(cacheKey, storageCached);
      this.registry.registerPack(storageCached.pack);
      return storageCached.pack;
    }

    // 3. 从 CDN 加载
    const pack = await this.fetchFromCDN(name, version);

    // 4. 缓存
    const cached: CachedPack = {
      pack,
      cachedAt: Date.now(),
    };
    this.memoryCache.set(cacheKey, cached);
    await this.storage.set(cacheKey, cached);

    // 5. 注册到 Registry
    this.registry.registerPack(pack);

    return pack;
  }

  /**
   * 从 CDN 获取动画包
   */
  private async fetchFromCDN(name: string, version?: string): Promise<AnimationPack> {
    const url = this.buildUrl(name, version);

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.config.retries; attempt++) {
      try {
        const response = await fetch(url, {
          signal: AbortSignal.timeout(this.config.timeout),
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const pack: AnimationPack = await response.json();
        this.validatePack(pack);

        return pack;
      } catch (error) {
        lastError = error;

        // 指数退避重试
        if (attempt < this.config.retries) {
          await this.delay(Math.pow(2, attempt) * 1000);
        }
      }
    }

    throw new Error(`Failed to load animation pack ${name}: ${lastError?.message}`);
  }

  /**
   * 构建 CDN URL
   */
  private buildUrl(name: string, version?: string): string {
    // @vvce/science@1.2.0 → https://cdn.../animations/vvce/science/1.2.0.json
    const cleanName = name.replace('@', '').replace('/', '/');
    const ver = version || 'latest';
    return `${this.config.cdnBase}/${cleanName}/${ver}.json`;
  }

  /**
   * 预加载常用动画包 (可选优化)
   */
  async preload(packs: string[]): Promise<void> {
    await Promise.all(packs.map((pack) => this.loadPack(pack)));
  }

  /**
   * 清除缓存
   */
  async clearCache(): Promise<void> {
    this.memoryCache.clear();
    await this.storage.clear();
  }

  /**
   * 检查缓存是否过期
   */
  private isExpired(cached: CachedPack): boolean {
    return Date.now() - cached.cachedAt > this.config.maxCacheAge;
  }

  private validatePack(pack: AnimationPack): void {
    if (!pack.name || !pack.version || !pack.animations) {
      throw new Error('Invalid animation pack format');
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

interface CachedPack {
  pack: AnimationPack;
  cachedAt: number;
}

interface LoadResult {
  success: string[];
  failed: Array<{ pack: string; error: string }>;
}
```

### 5.4 ParamInterpolator (参数插值器)

```typescript
/**
 * ParamInterpolator - 参数插值器
 *
 * 职责：
 * 将动画模板 + 参数 → 可执行的动画定义
 */
class ParamInterpolator {
  /**
   * 将参数化模板转换为具体的动画定义
   */
  interpolate(
    template: AnimationTemplate,
    params: Record<string, any>
  ): AnimationDefinition {
    // 合并默认参数
    const mergedParams = this.mergeWithDefaults(template.params, params);

    // 插值 keyframes
    const keyframes = template.keyframes.map((kf) => ({
      offset: kf.offset,
      properties: this.interpolateProperties(kf.properties, mergedParams),
    }));

    // 插值其他可能包含参数的字段
    const duration = this.interpolateValue(template.duration, mergedParams);

    return {
      keyframes,
      duration,
      easing: template.easing,
      iterations: template.iterations,
      direction: template.direction,
      fillMode: template.fillMode,
    };
  }

  /**
   * 合并用户参数和默认参数
   */
  private mergeWithDefaults(
    paramDefs: ParamDefinition[],
    userParams: Record<string, any>
  ): Record<string, any> {
    const result: Record<string, any> = {};

    for (const def of paramDefs) {
      result[def.name] = userParams[def.name] ?? def.default;
    }

    return result;
  }

  /**
   * 插值属性对象
   */
  private interpolateProperties(
    properties: Record<string, any>,
    params: Record<string, any>
  ): Record<string, any> {
    const result: Record<string, any> = {};

    for (const [key, value] of Object.entries(properties)) {
      result[key] = this.interpolateValue(value, params);
    }

    return result;
  }

  /**
   * 插值单个值
   *
   * 支持格式：
   * - "${radiusX}" → 直接替换
   * - "${radiusX * 2}" → 简单表达式
   * - "${radiusX + radiusY}" → 多参数表达式
   */
  private interpolateValue(value: any, params: Record<string, any>): any {
    if (typeof value !== 'string') {
      return value;
    }

    // 检查是否是插值表达式
    const match = value.match(/^\$\{(.+)\}$/);
    if (!match) {
      return value;
    }

    const expression = match[1];

    // 安全执行表达式 (不使用 eval)
    return this.evaluateExpression(expression, params);
  }

  /**
   * 安全执行简单数学表达式
   */
  private evaluateExpression(expression: string, params: Record<string, any>): number {
    // 替换参数名为值
    let expr = expression;
    for (const [name, value] of Object.entries(params)) {
      expr = expr.replace(new RegExp(`\\b${name}\\b`, 'g'), String(value));
    }

    // 只允许数字和基本运算符
    if (!/^[\d\s+\-*/().]+$/.test(expr)) {
      throw new Error(`Invalid expression: ${expression}`);
    }

    // 使用 Function 构造器而非 eval (稍微安全一点)
    return Function(`"use strict"; return (${expr})`)();
  }
}
```

### 5.5 整合到 Runtime

```typescript
// packages/vvce-core/src/runtime/Runtime.ts

class VVCERuntime {
  private animationRegistry: AnimationRegistry;
  private animationLoader: AnimationLoader;
  private animationEngine: AnimationEngine;
  private paramInterpolator: ParamInterpolator;

  constructor(config: RuntimeConfig) {
    // 初始化动画系统
    this.animationRegistry = new AnimationRegistry();
    this.animationLoader = new AnimationLoader(
      config.animation || DEFAULT_ANIMATION_CONFIG,
      this.animationRegistry
    );
    this.paramInterpolator = new ParamInterpolator();
    this.animationEngine = new AnimationEngine({
      registry: this.animationRegistry,
      interpolator: this.paramInterpolator,
    });
  }

  /**
   * 加载课程
   */
  async loadCourse(dsl: CourseDSL): Promise<void> {
    // 1. 验证 DSL
    this.validateDSL(dsl);

    // 2. 加载动画包依赖
    if (dsl.imports && dsl.imports.length > 0) {
      const result = await this.animationLoader.loadImports(dsl.imports);

      if (result.failed.length > 0) {
        this.logger.warn(
          'animation',
          `Failed to load packs: ${result.failed.map((f) => f.pack).join(', ')}`
        );
      }

      this.logger.info(
        'animation',
        `Loaded animation packs: ${result.success.join(', ')}`
      );
    }

    // 3. 初始化状态
    this.store.initialize(dsl);

    // 4. 跳转到起始场景
    await this.gotoScene(dsl.startSceneId);
  }

  /**
   * 播放动画
   */
  playAnimation(nodeId: string, animation: NodeAnimation): void {
    // 1. 解析动画引用
    const template = this.animationRegistry.resolve(animation.type);

    if (!template) {
      this.logger.warn('animation', `Animation not found: ${animation.type}`);
      // 降级到默认动画
      return this.animationEngine.playAnimation({
        nodeId,
        animation: this.animationRegistry.resolve('fadeIn')!,
      });
    }

    // 2. 如果是参数化模板，进行插值
    let definition: AnimationDefinition;
    if ('params' in template && animation.params) {
      definition = this.paramInterpolator.interpolate(template, animation.params);
    } else {
      definition = template as AnimationDefinition;
    }

    // 3. 应用覆盖配置
    if (animation.duration) definition.duration = animation.duration;
    if (animation.easing) definition.easing = animation.easing;
    if (animation.iterations) definition.iterations = animation.iterations;

    // 4. 执行动画
    this.animationEngine.playAnimation({
      nodeId,
      animation: definition,
      delay: animation.delay,
    });
  }
}
```

---

## 6. 后台管理设计

### 6.1 数据库模型

```sql
-- 动画包表
CREATE TABLE animation_packs (
    id              VARCHAR(64) PRIMARY KEY,
    name            VARCHAR(128) NOT NULL,          -- "@vvce/science"
    version         VARCHAR(32) NOT NULL,           -- "1.2.0"
    description     TEXT,
    author          VARCHAR(64),

    -- 动画定义 (JSON)
    definition      JSONB NOT NULL,

    -- 状态管理
    status          VARCHAR(16) DEFAULT 'draft',    -- draft, published, deprecated
    published_at    TIMESTAMP,

    -- 元数据
    created_at      TIMESTAMP DEFAULT NOW(),
    updated_at      TIMESTAMP DEFAULT NOW(),

    UNIQUE(name, version)
);

-- 索引
CREATE INDEX idx_packs_name ON animation_packs(name);
CREATE INDEX idx_packs_status ON animation_packs(status);
```

### 6.2 API 设计

```yaml
# 动画包管理 API

# 获取动画包列表
GET /api/v1/admin/animation-packs
Response:
  - id, name, version, status, description, animationCount

# 获取单个动画包详情
GET /api/v1/admin/animation-packs/{id}
Response:
  - 完整的动画包定义

# 创建动画包
POST /api/v1/admin/animation-packs
Body:
  - name, version, description, definition

# 更新动画包
PUT /api/v1/admin/animation-packs/{id}
Body:
  - description, definition

# 发布动画包 (同步到 CDN)
POST /api/v1/admin/animation-packs/{id}/publish
Response:
  - cdnUrl, publishedAt

# 废弃动画包
POST /api/v1/admin/animation-packs/{id}/deprecate

# 获取动画包使用统计
GET /api/v1/admin/animation-packs/{id}/stats
Response:
  - usageCount, courseCount, lastUsedAt
```

### 6.3 发布流程

```
┌─────────────────────────────────────────────────────────────┐
│                      发布流程                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   1. 创建/编辑                                               │
│      ┌─────────────────────────────────────────────────┐   │
│      │  后台管理界面                                    │   │
│      │  • 定义动画 keyframes                           │   │
│      │  • 设置参数 schema                              │   │
│      │  • 填写描述 (供 AI 理解)                         │   │
│      │  • 预览测试                                     │   │
│      └─────────────────────────────────────────────────┘   │
│                         ↓                                   │
│   2. 保存草稿                                               │
│      → 存入数据库 (status: draft)                           │
│                         ↓                                   │
│   3. 发布                                                   │
│      ┌─────────────────────────────────────────────────┐   │
│      │  • 验证动画定义完整性                            │   │
│      │  • 生成 JSON 文件                               │   │
│      │  • 上传到 CDN                                   │   │
│      │  • 更新 latest 指针                             │   │
│      │  • 更新数据库状态 (status: published)           │   │
│      └─────────────────────────────────────────────────┘   │
│                         ↓                                   │
│   4. 客户端自动获取                                         │
│      → 下次加载课程时，自动拉取新版本                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. AI 集成

### 7.1 Prompt 模板

当 AI 生成课程时，需要知道可用的动画。系统应提供动画清单：

````markdown
## 可用动画库

### 内置基础动画 (无需 import)

- 入场: fadeIn, slideInLeft, slideInRight, slideInUp, slideInDown, scaleIn, bounceIn, zoomIn
- 退场: fadeOut, slideOutLeft, slideOutRight, scaleOut, bounceOut, zoomOut
- 强调: pulse, shake, wobble, swing, tada, heartbeat
- 循环: float, glow, rotate

### @vvce/science (科普动画包)

需要在 imports 中声明: { "pack": "@vvce/science" }

| 动画名  | 描述                       | 参数                        |
| ------- | -------------------------- | --------------------------- |
| orbit   | 椭圆轨道运动，用于行星公转 | radiusX, radiusY, clockwise |
| wave    | 波浪运动，用于声波、水波   | amplitude, frequency        |
| vibrate | 分子振动，用于热运动展示   | intensity                   |
| explode | 爆炸扩散效果               | radius, particles           |
| spiral  | 螺旋运动                   | radius, turns               |

### @vvce/math (数学动画包)

需要在 imports 中声明: { "pack": "@vvce/math" }

| 动画名 | 描述         | 参数              |
| ------ | ------------ | ----------------- |
| draw   | 路径绘制动画 | path, strokeWidth |
| morph  | 形状变换     | from, to          |
| count  | 数字滚动     | from, to          |
| graph  | 函数图像绘制 | function, range   |

## 使用示例

```json
{
  "imports": [{ "pack": "@vvce/science" }],
  "scenes": [
    {
      "nodes": [
        {
          "id": "earth",
          "type": "Image",
          "props": { "src": "earth.png" },
          "animation": {
            "type": "@science/orbit",
            "params": { "radiusX": 200, "radiusY": 150 },
            "iterations": -1
          }
        }
      ]
    }
  ]
}
```
````

```

### 7.2 动画选择建议

AI 应根据课程内容选择合适的动画：

| 课程类型 | 推荐动画包 | 典型动画 |
|---------|-----------|---------|
| 天文科普 | @vvce/science | orbit, spiral, explode |
| 物理科普 | @vvce/science | wave, vibrate, collision |
| 化学科普 | @vvce/science | vibrate, bond, reaction |
| 数学教学 | @vvce/math | draw, morph, graph, count |
| 语言学习 | @vvce/language | typing, highlight, stroke |
| 通用场景 | 内置基础动画 | fadeIn, bounce, pulse |

---

## 8. 实施计划

### Phase 1: 基础架构 (1-2周)

- [ ] 定义动画包 TypeScript 类型
- [ ] 实现 AnimationRegistry
- [ ] 实现 ParamInterpolator
- [ ] 修改 AnimationEngine 支持参数化动画
- [ ] 更新 DSL Schema 支持 imports

### Phase 2: 动态加载 (1周)

- [ ] 实现 AnimationLoader
- [ ] 实现本地缓存 (IndexedDB)
- [ ] 整合到 Runtime

### Phase 3: 后台管理 (1-2周)

- [ ] 数据库模型
- [ ] CRUD API
- [ ] CDN 发布流程
- [ ] 管理界面 (基础版)

### Phase 4: 内容填充 (持续)

- [ ] @vvce/science 动画包
- [ ] @vvce/math 动画包
- [ ] @vvce/language 动画包
- [ ] AI Prompt 模板

---

## 9. 总结

### 核心原则

| 原则 | 说明 |
|------|------|
| **AI 只引用，不创建** | AI 生成 DSL 时只引用动画名称和参数 |
| **质量可控** | 所有动画由专业团队预先实现 |
| **热更新** | 动画包通过 CDN 分发，无需发布前端 |
| **按需加载** | 只加载课程需要的动画包 |
| **持续扩展** | 客户有新需求时，后台补充动画库 |

### 竞争优势

1. **稳定高质量** - 动画效果经过专业调试
2. **快速生成** - AI 只需选择 + 传参
3. **持续进化** - 动画库不断丰富
4. **差异化壁垒** - 积累的动画库是核心资产
```
