# Debug Helper Skill

> 辅助调试 VVCE 运行时问题

## 触发时机

当用户提及以下内容时触发：
- "调试"、"debug"、"问题排查"
- "运行时错误"、"状态不对"
- "事件没触发"、"动作没执行"
- "为什么不工作"

## 调试工具

### 1. 状态检查

```typescript
// 获取完整运行时状态
const state = runtime.getState();
console.log('Globals:', state.globals);
console.log('Scene:', state.scene);
console.log('Nodes:', state.nodes);
```

### 2. 日志分析

```typescript
// 获取所有日志
const logs = runtime.getLogs();

// 按类型过滤
const eventLogs = logs.filter(l => l.type === 'event');
const actionLogs = logs.filter(l => l.type === 'action');
const errorLogs = logs.filter(l => l.type === 'error');
```

### 3. 事件追踪

```typescript
// 订阅事件
runtime.on('event', (event) => {
  console.log('Event:', event);
});

runtime.on('action', (action) => {
  console.log('Action:', action);
});

runtime.on('stateChange', (change) => {
  console.log('State Change:', change);
});
```

## 常见问题排查

### 问题 1: 事件没有触发

**排查步骤：**
1. 检查节点 ID 是否匹配
2. 检查事件类型是否正确
3. 检查节点是否可见
4. 检查是否有阻止冒泡

**示例：**
```json
// DSL 中的触发器
{
  "on": { "event": "click", "target": "btn1" }
}

// 实际节点 ID 是 "button1" ← 不匹配！
```

### 问题 2: 条件不满足

**排查步骤：**
1. 打印条件两边的值
2. 检查 ref 路径是否正确
3. 检查运算符是否正确

**调试代码：**
```typescript
const left = resolver.resolve(condition.left);
const right = resolver.resolve(condition.right);
console.log(`Condition: ${left} ${condition.op} ${right}`);
```

### 问题 3: 动作没有执行

**排查步骤：**
1. 检查条件是否满足（看 else 是否执行）
2. 检查动作参数是否正确
3. 检查是否有错误被吞掉

**调试代码：**
```typescript
runtime.on('actionError', (error, action) => {
  console.error('Action failed:', action, error);
});
```

### 问题 4: 状态没有更新

**排查步骤：**
1. 检查 setVar 路径是否正确
2. 检查值类型是否匹配
3. 检查是否有其他动作覆盖

**调试代码：**
```typescript
runtime.on('stateChange', (path, oldValue, newValue) => {
  console.log(`State: ${path} changed from`, oldValue, 'to', newValue);
});
```

### 问题 5: 场景跳转失败

**排查步骤：**
1. 检查目标场景是否存在
2. 检查 onExit 是否有阻止
3. 检查是否有动画未完成

## 调试模式配置

```typescript
const runtime = new VVCERuntime({
  debug: true,
  logLevel: 'verbose', // 'error' | 'warn' | 'info' | 'verbose'
  onError: (error) => {
    console.error('Runtime Error:', error);
  },
  onLog: (log) => {
    console.log(`[${log.type}] ${log.message}`);
  }
});
```

## 时间旅行调试

```typescript
// 保存状态快照
const snapshot = runtime.saveSnapshot();

// 恢复到快照
runtime.restoreSnapshot(snapshot);

// 重放日志
runtime.replay(logs, { speed: 1 });
```

## 输出格式

```
=== Debug Report ===

📍 当前场景: scene2
📊 全局状态:
   score: 10
   attempt: 2

📦 场景状态:
   temp: null

🔘 节点状态:
   q1.selected: "option2"
   input1.value: ""

📋 最近事件 (5):
   [12:34:56.789] EVENT click on btn1
   [12:34:56.790] CONDITION equals(q1.selected, "option1") = false
   [12:34:56.791] ACTION toast "Try again!"
   [12:34:57.123] EVENT change on q1 {selected: "option2"}
   [12:34:57.124] CONDITION equals(q1.selected, "option1") = false

⚠️ 发现的问题:
   1. q1.selected 值为 "option2"，但 answerKey 是 "option1"
   2. btn1 的 click 事件 10 秒内触发了 3 次

💡 建议:
   1. 检查题目答案设置
   2. 考虑添加按钮防抖
```

## 可视化调试工具

### Chrome DevTools Extension

```bash
# 安装 VVCE DevTools
npm install -g @vv-education/vvce-devtools
```

### 内置调试面板

```typescript
import { DebugPanel } from '@vv-education/vvce-devtools';

<DebugPanel runtime={runtime} />
```

## 注意事项

- 生产环境关闭 debug 模式
- 敏感数据不要打印到日志
- 大量日志会影响性能
- 使用日志级别控制输出
