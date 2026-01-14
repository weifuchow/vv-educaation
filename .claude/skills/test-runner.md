# Test Runner Skill

> 智能运行和管理测试用例

## 触发时机

当用户提及以下内容时触发：
- "运行测试"、"跑测试"、"test"
- "测试覆盖率"、"coverage"
- "测试失败"、"test failed"
- "添加测试"、"写测试"

## 测试命令

### 全量测试

```bash
# 运行所有包的测试
pnpm test

# CI 模式（包含覆盖率）
pnpm test:ci
```

### 单包测试

```bash
# 测试 vvce-core
cd packages/vvce-core && pnpm test

# 测试 vvce-schema
cd packages/vvce-schema && pnpm test

# 测试 vvce-components
cd packages/vvce-components && pnpm test
```

### 单文件测试

```bash
# 运行指定文件
pnpm test -- Store.test.ts

# 运行匹配模式
pnpm test -- --grep "should set and get"
```

### Watch 模式

```bash
# 监听文件变化自动运行
pnpm test -- --watch

# 只监听失败的测试
pnpm test -- --watch --failed
```

## 覆盖率报告

### 生成报告

```bash
pnpm test:ci
```

### 覆盖率目标

| 包 | 目标 | 当前 |
|---|---|---|
| vvce-core | > 80% | -- |
| vvce-schema | > 70% | -- |
| vvce-components | > 90% | -- |
| contracts | > 60% | -- |

### 查看报告

```bash
# 在浏览器中打开
open coverage/index.html
```

## 测试分类

### 单元测试

```typescript
// packages/vvce-core/src/store/Store.test.ts
describe('Store', () => {
  it('should set and get values', () => {
    const store = new Store();
    store.set('foo.bar', 123);
    expect(store.get('foo.bar')).toBe(123);
  });
});
```

### 集成测试

```typescript
// packages/vvce-core/src/runtime/Runtime.integration.test.ts
describe('Runtime Integration', () => {
  it('should execute complete course flow', async () => {
    const runtime = new VVCERuntime();
    runtime.loadCourse(sampleCourse);
    // ...
  });
});
```

### 组件测试

```typescript
// packages/vvce-components/src/components/Button/Button.test.tsx
describe('Button', () => {
  it('should trigger click event', () => {
    const onEvent = vi.fn();
    render(<Button id="b1" props={{ text: 'Click' }} onEvent={onEvent} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onEvent).toHaveBeenCalledWith({
      type: 'click',
      target: 'b1'
    });
  });
});
```

## 测试工具

### Vitest 配置

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['**/node_modules/**', '**/dist/**']
    }
  }
});
```

### 测试工具函数

```typescript
// test/utils.ts
export function createMockRuntime(): VVCERuntime {
  return new VVCERuntime({ debug: true });
}

export function createMockStore(): Store {
  return new Store();
}

export function renderWithVVCE(ui: React.ReactElement) {
  return render(
    <VVCEProvider runtime={createMockRuntime()}>
      {ui}
    </VVCEProvider>
  );
}
```

## 测试失败处理

### 分析失败原因

```
=== Test Failure Analysis ===

❌ 失败测试: Store.test.ts > should handle nested paths

错误信息:
  Expected: "value"
  Received: undefined

失败位置:
  packages/vvce-core/src/store/Store.test.ts:42

相关代码:
  store.set('deep.nested.path', 'value');
  expect(store.get('deep.nested.path')).toBe('value');

可能原因:
  1. Store.get() 不支持深层路径
  2. Store.set() 没有创建中间对象

建议修复:
  检查 Store 类的 set/get 方法对深层路径的处理
```

### 快速修复

```bash
# 只运行失败的测试
pnpm test -- --only-failed

# 跳过失败的测试（临时）
pnpm test -- --skip-failing
```

## 生成测试用例

### 为现有代码生成测试

```
用户: 为 ActionExecutor.ts 生成测试

AI: 分析 ActionExecutor.ts...

发现以下方法需要测试:
1. executeAction(action: ActionDSL)
2. handleGotoScene(action: GotoSceneAction)
3. handleSetVar(action: SetVarAction)
...

生成测试用例:
[生成 ActionExecutor.test.ts]

✅ 已生成 15 个测试用例
   - 覆盖 23 个 action 类型
   - 包含边界情况测试
   - 包含错误处理测试
```

### 测试模板

```typescript
describe('ClassName', () => {
  let instance: ClassName;

  beforeEach(() => {
    instance = new ClassName();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('methodName', () => {
    it('should [expected behavior] when [condition]', () => {
      // Arrange
      const input = ...;

      // Act
      const result = instance.methodName(input);

      // Assert
      expect(result).toBe(expected);
    });

    it('should throw when [error condition]', () => {
      expect(() => instance.methodName(invalidInput))
        .toThrow('Expected error message');
    });
  });
});
```

## 输出格式

```
=== Test Results ===

📦 vvce-core
   ✓ Store (12 tests) - 15ms
   ✓ EventBus (8 tests) - 8ms
   ✓ ActionExecutor (23 tests) - 45ms
   ✗ TriggerInterpreter (1 failed)

📦 vvce-schema
   ✓ Validator (15 tests) - 12ms
   ✓ Analyzer (10 tests) - 20ms

📊 总结
   通过: 68
   失败: 1
   跳过: 2
   覆盖率: 78.5%

❌ 失败测试:
   TriggerInterpreter > should match wildcard events
   Expected: true, Received: false

💡 建议:
   运行 pnpm test -- TriggerInterpreter --verbose 查看详情
```

## 注意事项

- 测试应该相互独立
- 避免测试实现细节
- Mock 外部依赖
- 保持测试简单可读
- 使用描述性的测试名称
