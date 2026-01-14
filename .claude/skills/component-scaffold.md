# Component Scaffold Skill

> 为 vvce-components 创建新组件的脚手架

## 触发时机

当用户提及以下内容时触发：
- "创建组件"、"新组件"、"添加组件"
- "生成组件模板"
- "QuizMultiple 组件"等具体组件名

## 组件目录结构

每个组件遵循标准结构：

```
packages/vvce-components/src/components/{ComponentName}/
├── index.ts              # 导出
├── {ComponentName}.tsx   # React 组件实现
├── {ComponentName}.meta.ts    # 组件元数据
├── {ComponentName}.styles.ts  # 样式定义
└── {ComponentName}.test.tsx   # 单元测试
```

## 生成流程

### 1. 收集信息

询问用户：
- 组件名称（PascalCase）
- 组件描述
- Props 定义
- State 定义（如果有状态）
- 支持的事件
- 默认属性值

### 2. 生成文件

#### index.ts

```typescript
export { {ComponentName} } from './{ComponentName}';
export { {ComponentName}Meta } from './{ComponentName}.meta';
export type { {ComponentName}Props } from './{ComponentName}';
```

#### {ComponentName}.meta.ts

```typescript
import type { VVCEComponentMeta } from '../../types';
import { {ComponentName}PropsSchema } from './schema';

export const {ComponentName}Meta: VVCEComponentMeta = {
  type: '{ComponentName}',
  displayName: '{显示名称}',
  description: '{组件描述}',
  propsSchema: {ComponentName}PropsSchema,
  stateShape: null, // 或定义状态形状
  events: [], // 或定义事件列表
  defaultProps: {},
};
```

#### {ComponentName}.tsx

```typescript
import React from 'react';
import type { VVCEComponentProps } from '../../types';
import { useVVCEContext } from '../../context';
import { useInterpolation } from '../../hooks';
import styles from './{ComponentName}.styles';

export interface {ComponentName}Props {
  // Props 定义
}

export interface {ComponentName}State {
  // State 定义（如果需要）
}

type Props = VVCEComponentProps<{ComponentName}Props, {ComponentName}State>;

export const {ComponentName}: React.FC<Props> = ({
  id,
  props,
  state,
  style,
  styleClass,
  visible = true,
  onEvent,
  onStateChange,
}) => {
  const context = useVVCEContext();

  if (!visible) return null;

  // 组件实现

  return (
    <div className={styles.container} style={style}>
      {/* 组件内容 */}
    </div>
  );
};
```

#### {ComponentName}.styles.ts

```typescript
import { css } from '../../utils/styles';

export default {
  container: css`
    /* 容器样式 */
  `,
  // 其他样式
};
```

#### {ComponentName}.test.tsx

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { {ComponentName} } from './{ComponentName}';
import { renderWithVVCE } from '../../../test/utils';

describe('{ComponentName}', () => {
  const defaultProps = {
    id: 'test-{componentName}',
    props: {},
    onEvent: vi.fn(),
    onStateChange: vi.fn(),
  };

  it('should render correctly', () => {
    renderWithVVCE(<{ComponentName} {...defaultProps} />);
    // 断言
  });

  it('should handle visibility', () => {
    const { container } = renderWithVVCE(
      <{ComponentName} {...defaultProps} visible={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  // 更多测试用例
});
```

### 3. 注册组件

更新 `packages/vvce-components/src/components/index.ts`：

```typescript
export * from './{ComponentName}';
```

更新 `packages/vvce-components/src/registry/defaultComponents.ts`：

```typescript
import { {ComponentName}, {ComponentName}Meta } from '../components/{ComponentName}';

componentRegistry.register({ComponentName}Meta, {ComponentName});
```

### 4. 更新类型

如果需要，更新 `packages/vvce-schema/src/components.ts`：

```typescript
export interface {ComponentName}Node {
  id: string;
  type: '{ComponentName}';
  props: {ComponentName}Props;
  state?: {ComponentName}State;
}
```

## 组件分类

### 显示组件（无状态）
- Dialog
- Image
- Video
- Audio

### 交互组件（有状态）
- Button (events only)
- Input
- QuizSingle
- QuizMultiple
- DragDrop

### 布局组件
- Container
- Grid
- Stack

## 测试要求

- [ ] 基础渲染测试
- [ ] Props 变更测试
- [ ] State 变更测试（如适用）
- [ ] 事件触发测试（如适用）
- [ ] 可见性测试
- [ ] 样式应用测试
- [ ] 无障碍测试 (a11y)
- [ ] 快照测试

## 检查清单

生成后检查：
- [ ] 文件结构正确
- [ ] TypeScript 类型完整
- [ ] 导出正确
- [ ] 注册到 ComponentRegistry
- [ ] 测试文件包含基础用例
- [ ] 样式遵循主题系统
- [ ] 事件正确触发到 EventBus
- [ ] 状态与 Store 同步（如适用）

## 示例用法

```
用户: 创建一个 TextArea 组件

AI: 好的，让我为你创建 TextArea 组件。

请确认以下配置：
- 组件名称: TextArea
- 显示名称: 多行输入框
- Props:
  - placeholder: string (可选)
  - rows: number (默认: 3)
  - maxLength: number (可选)
- State:
  - value: string
- Events:
  - change: { value: string }
  - focus
  - blur

确认无误，开始生成...

[生成文件...]

✅ TextArea 组件创建完成！

已创建文件：
- packages/vvce-components/src/components/TextArea/index.ts
- packages/vvce-components/src/components/TextArea/TextArea.tsx
- packages/vvce-components/src/components/TextArea/TextArea.meta.ts
- packages/vvce-components/src/components/TextArea/TextArea.styles.ts
- packages/vvce-components/src/components/TextArea/TextArea.test.tsx

下一步：
1. 运行 pnpm test 验证测试
2. 在 Storybook 中预览组件
3. 更新 TODO.md 进度
```

## 注意事项

- 组件名必须是 PascalCase
- 必须包含完整的测试用例
- 必须支持主题系统
- 事件必须通过 onEvent 回调
- 状态必须通过 onStateChange 同步
