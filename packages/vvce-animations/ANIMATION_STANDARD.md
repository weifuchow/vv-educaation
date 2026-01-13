# VVCE 动画标准

## 动画标准定义

所有 VVCE 动画必须遵循统一的标准结构，确保可复用性、可维护性和AI可生成性。

## 目录结构标准

每个动画都是一个完整的、自包含的模块：

```
src/
└── {category}/
    └── {animation-name}/
        ├── index.ts          # 模块入口（必需）
        ├── renderer.ts       # 渲染器实现（必需）
        ├── styles.css        # 样式文件（必需）
        ├── config.ts         # 配置文件（可选）
        └── assets/           # 资源目录（可选）
            ├── images/
            ├── sounds/
            ├── videos/
            └── svgs/
```

### 示例：比萨斜塔动画

```
src/physics/pisa-tower/
├── index.ts          # 导出 pisaTowerModule
├── renderer.ts       # PisaTowerRenderer 类
├── styles.css        # 塔、球等样式
└── assets/           # （此动画无需额外资源）
```

## 实现标准

### 1. 模块入口文件（index.ts）

每个动画的 `index.ts` 必须：

- 扩展 `AnimationModuleBase` 类
- 定义 `metadata`（元数据）
- 定义 `assets`（资源）
- 实现 `createRenderer()` 方法
- 导出模块实例

```typescript
import {
  AnimationModuleBase,
  AnimationConfig,
  IAnimationRenderer,
} from '../../standards/AnimationStandard';
import { YourRenderer } from './renderer';
import stylesContent from './styles.css?raw';

class YourAnimationModule extends AnimationModuleBase {
  metadata = {
    id: 'category.animation-name', // 唯一ID
    category: 'physics', // 分类
    name: '动画名称', // 显示名称
    description: '动画描述', // 详细描述
    tags: ['标签1', '标签2'], // 搜索标签
    version: '1.0.0', // 版本
    author: 'VV Education', // 作者
  };

  assets = {
    styles: stylesContent, // CSS内容
    images: {}, // 图片资源
    sounds: {}, // 音频资源
    videos: {}, // 视频资源
  };

  createRenderer(config: AnimationConfig): IAnimationRenderer {
    this.loadStyles(); // 自动加载CSS
    return new YourRenderer(config);
  }
}

// 导出模块实例
export const yourAnimationModule = new YourAnimationModule();

// 导出渲染器（可选，用于直接使用）
export { YourRenderer } from './renderer';
```

### 2. 渲染器文件（renderer.ts）

渲染器必须实现 `IAnimationRenderer` 接口：

```typescript
import {
  IAnimationRenderer,
  AnimationConfig,
  AnimationResult,
} from '../../standards/AnimationStandard';

export class YourRenderer implements IAnimationRenderer {
  public readonly id = 'category.animation-name';
  private container: HTMLElement;
  private config: AnimationConfig;

  constructor(config: AnimationConfig) {
    this.container = config.container;
    this.config = config;
  }

  // 必需方法
  getHtml(): string {
    return `<div>Your HTML template</div>`;
  }

  initialize(): void {
    // 初始化逻辑（HTML插入后调用）
    if (this.config.autoplay) {
      this.start();
    }
  }

  start(): void {
    // 开始播放动画
  }

  stop(): void {
    // 停止动画
  }

  reset(): void {
    // 重置到初始状态
  }

  destroy(): void {
    // 清理资源
    this.stop();
    this.container.innerHTML = '';
  }

  // 可选方法
  pause?(): void {
    // 暂停
  }

  resume?(): void {
    // 恢复
  }

  handleControl?(controlId: string, element: HTMLElement): void {
    // 处理交互控制
  }

  // 辅助方法：发送结果
  private emitResult(type: AnimationResult['type'], data?: any): void {
    if (this.config.onResult) {
      this.config.onResult({
        type,
        data,
        timestamp: Date.now(),
      });
    }
  }

  // 辅助方法：发送交互事件
  private emitInteraction(interaction: any): void {
    if (this.config.onInteract) {
      this.config.onInteract({
        ...interaction,
        timestamp: Date.now(),
      });
    }
  }
}
```

### 3. 样式文件（styles.css）

所有样式必须独立，避免污染全局样式：

```css
/* 使用具有唯一性的类名 */
.your-animation-container {
  /* 样式 */
}

.your-animation-element {
  /* 样式 */
}

/* 动画关键帧 */
@keyframes yourAnimation {
  from {
    /* ... */
  }
  to {
    /* ... */
  }
}
```

### 4. 资源文件（assets/）

资源文件组织方式：

```
assets/
├── images/
│   ├── sprite.png
│   └── background.jpg
├── sounds/
│   ├── start.mp3
│   └── complete.mp3
├── videos/
│   └── intro.mp4
└── svgs/
    └── icon.svg
```

在模块中引用资源：

```typescript
import spriteImage from './assets/images/sprite.png';
import startSound from './assets/sounds/start.mp3';

assets = {
  styles: stylesContent,
  images: {
    sprite: spriteImage,
  },
  sounds: {
    start: startSound,
  },
};
```

## 接口标准

### IAnimationRenderer 接口

所有渲染器必须实现以下接口：

```typescript
interface IAnimationRenderer {
  readonly id: string; // 动画ID（必需）
  getHtml(): string; // HTML模板（必需）
  initialize(): void; // 初始化（必需）
  start(): void; // 开始播放（必需）
  stop(): void; // 停止（必需）
  reset(): void; // 重置（必需）
  destroy(): void; // 销毁（必需）
  pause?(): void; // 暂停（可选）
  resume?(): void; // 恢复（可选）
  handleControl?(controlId: string, element: HTMLElement): void; // 控制（可选）
}
```

### AnimationModule 接口

所有模块必须实现以下接口：

```typescript
interface AnimationModule {
  metadata: AnimationMetadata; // 元数据
  assets: AnimationAssets; // 资源
  createRenderer(config: AnimationConfig): IAnimationRenderer; // 创建渲染器
  loadStyles?(): void; // 加载样式（可选）
}
```

## 结果回调标准

### onResult 回调

用于传递动画完成或交互的结果：

```typescript
onResult: (result: AnimationResult) => void

interface AnimationResult {
  type: 'complete' | 'interact' | 'error';  // 结果类型
  data?: any;                                // 结果数据
  timestamp: number;                         // 时间戳
}
```

示例：

```typescript
// 动画完成时
this.emitResult('complete', {
  conclusion: '实验结论',
  physicsLaw: '物理定律',
});

// 交互时
this.emitResult('interact', {
  mode: 'rotation',
  description: '仅显示自转',
});

// 错误时
this.emitResult('error', {
  message: '元素未找到',
});
```

### onInteract 回调

用于记录用户交互行为：

```typescript
onInteract: (interaction: AnimationInteraction) => void

interface AnimationInteraction {
  action: string;        // 交互动作
  data?: any;           // 交互数据
  timestamp?: number;   // 时间戳
}
```

示例：

```typescript
this.emitInteraction({
  action: 'experiment_start',
  data: { animation: 'pisa-tower' },
});

this.emitInteraction({
  action: 'control_change',
  data: { controlId: 'btn-rotation', mode: 'rotation' },
});
```

## 注册标准

### 自动注册

在 `src/index.ts` 中自动注册所有动画：

```typescript
import { webAnimationRegistry } from './standards/WebAnimationRegistry';
import { yourAnimationModule } from './category/your-animation';

// 自动注册
webAnimationRegistry.registerBatch([yourAnimationModule]);
```

### 使用动画

```typescript
import { webAnimationRegistry } from '@vv-education/vvce-animations';

// 创建动画实例
const animation = webAnimationRegistry.create('category.animation-name', {
  container: document.getElementById('animation-container'),
  autoplay: true,
  onResult: (result) => {
    console.log('Animation result:', result);
  },
  onInteract: (interaction) => {
    console.log('User interaction:', interaction);
  },
});

if (animation) {
  animation.initialize();
}
```

## 创建新动画步骤

### 1. 创建目录结构

```bash
mkdir -p src/physics/new-animation/assets/{images,sounds,videos}
```

### 2. 创建样式文件

```bash
touch src/physics/new-animation/styles.css
```

编写独立的CSS样式。

### 3. 创建渲染器

```bash
touch src/physics/new-animation/renderer.ts
```

实现 `IAnimationRenderer` 接口。

### 4. 创建模块入口

```bash
touch src/physics/new-animation/index.ts
```

扩展 `AnimationModuleBase` 并导出模块实例。

### 5. 注册到主入口

在 `src/index.ts` 中：

```typescript
// 导入模块
import { newAnimationModule } from './physics/new-animation';

// 注册
webAnimationRegistry.registerBatch([
  pisaTowerModule,
  earthSystemModule,
  newAnimationModule, // 新增
]);

// 导出模块
export { newAnimationModule } from './physics/new-animation';
```

### 6. 构建和测试

```bash
pnpm build
```

## AI 生成动画标准

为了让AI能够自动生成符合标准的动画，需要提供以下信息：

1. **动画需求描述**：
   - 动画名称和类别
   - 要展示的内容和原理
   - 交互方式（如果有）
   - 预期的结果数据

2. **引用现有动画**：
   - 参考相似动画的实现
   - 复用通用的动画模式

3. **资源要求**：
   - 需要哪些图片、音频、视频
   - 样式要求（颜色、布局等）

4. **检查已有动画库**：

```typescript
import { hasAnimation, searchAnimations } from '@vv-education/vvce-animations';

// 检查是否已存在
if (hasAnimation('physics.pendulum')) {
  // 复用现有动画
} else {
  // 创建新动画
}

// 搜索相似动画
const similar = searchAnimations('物理 摆动');
```

## 最佳实践

1. **命名规范**：
   - 动画ID：`category.animation-name`（小写，连字符分隔）
   - 类名：`{AnimationName}Renderer`（PascalCase）
   - CSS类：`.animation-name-element`（小写，连字符分隔）

2. **性能优化**：
   - 使用 CSS 动画而非 JavaScript 动画
   - 避免频繁的 DOM 操作
   - 及时清理资源（`destroy()` 方法）

3. **可访问性**：
   - 提供适当的 ARIA 标签
   - 支持键盘操作
   - 提供替代文本

4. **错误处理**：
   - 检查 DOM 元素是否存在
   - 提供有意义的错误信息
   - 使用 `emitResult('error', ...)` 通知错误

5. **文档**：
   - 在代码中添加清晰的注释
   - 说明交互方式和预期行为
   - 记录配置参数和回调数据格式

## 参考示例

完整的参考示例：

- **比萨斜塔实验**：`src/physics/pisa-tower/`
- **地球公转自转**：`src/geography/earth-system/`

这两个动画展示了标准的完整实现。
