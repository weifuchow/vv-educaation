/**
 * VVCE Core 演示示例
 * 展示如何使用 VVCERuntime 运行一个简单的交互式课件
 *
 * 运行方式: npx tsx examples/demo.ts
 */

import { VVCERuntime, CourseDSL } from '../src/runtime/Runtime';

// 定义一个简单的测验课程
const quizCourse: CourseDSL = {
  schema: 'vvce.dsl.v1',
  meta: {
    id: 'simple-quiz',
    version: '1.0.0',
  },
  globals: {
    vars: {
      score: 0,
      attempt: 0,
      userName: '小明',
    },
  },
  startSceneId: 'welcome',
  scenes: [
    // 欢迎场景
    {
      id: 'welcome',
      vars: { greeting: '欢迎来到数学测验！' },
      triggers: [
        {
          on: { event: 'click', target: 'startBtn' },
          then: [
            { action: 'gotoScene', sceneId: 'question1' },
          ],
        },
      ],
    },
    // 问题1场景
    {
      id: 'question1',
      vars: { questionText: '1 + 1 = ?' },
      triggers: [
        {
          on: { event: 'submit', target: 'answer' },
          if: [
            { op: 'equals', left: { ref: 'globals.vars.userAnswer' }, right: '2' },
          ],
          then: [
            { action: 'addScore', value: 10 },
            { action: 'toast', text: '正确！加10分' },
            { action: 'gotoScene', sceneId: 'question2' },
          ],
          else: [
            { action: 'incVar', path: 'globals.vars.attempt', by: 1 },
            { action: 'toast', text: '错误，请重试' },
          ],
        },
      ],
    },
    // 问题2场景
    {
      id: 'question2',
      vars: { questionText: '2 x 3 = ?' },
      triggers: [
        {
          on: { event: 'submit', target: 'answer' },
          if: [
            { op: 'equals', left: { ref: 'globals.vars.userAnswer' }, right: '6' },
          ],
          then: [
            { action: 'addScore', value: 10 },
            { action: 'toast', text: '正确！加10分' },
            { action: 'gotoScene', sceneId: 'result' },
          ],
          else: [
            { action: 'incVar', path: 'globals.vars.attempt', by: 1 },
            { action: 'toast', text: '错误，请重试' },
          ],
        },
      ],
    },
    // 结果场景
    {
      id: 'result',
      triggers: [
        {
          on: { event: 'sceneEnter', target: 'result' },
          if: [
            { op: 'gte', left: { ref: 'globals.vars.score' }, right: 20 },
          ],
          then: [
            { action: 'toast', text: '恭喜！满分通过！' },
          ],
          else: [
            { action: 'toast', text: '测验结束，继续加油！' },
          ],
        },
        {
          on: { event: 'click', target: 'restartBtn' },
          then: [
            { action: 'setVar', path: 'globals.vars.score', value: 0 },
            { action: 'setVar', path: 'globals.vars.attempt', value: 0 },
            { action: 'gotoScene', sceneId: 'welcome' },
          ],
        },
      ],
    },
  ],
};

// 创建运行时实例
const runtime = new VVCERuntime({
  debug: true, // 启用调试日志
  onSceneChange: (sceneId) => {
    console.log(`\n📍 场景切换到: ${sceneId}`);
    const scene = runtime.getCurrentScene();
    if (scene?.vars) {
      console.log('   场景变量:', scene.vars);
    }
  },
  onStateChange: (state) => {
    console.log('📊 状态更新:', {
      score: state.globals.vars.score,
      attempt: state.globals.vars.attempt,
    });
  },
  onUIAction: (action) => {
    if (action.type === 'toast') {
      console.log(`💬 提示: ${action.text}`);
    } else if (action.type === 'modal') {
      console.log(`🔔 弹窗: ${action.text}`);
    }
  },
});

// 主函数
function main() {
  console.log('='.repeat(50));
  console.log('VVCE Core 演示');
  console.log('='.repeat(50));

  // 加载课程
  console.log('\n1. 加载课程...');
  runtime.loadCourse(quizCourse);
  console.log('   课程已加载:', quizCourse.meta.id);

  // 启动课程
  console.log('\n2. 启动课程...');
  runtime.start();

  // 模拟用户交互
  console.log('\n3. 模拟用户交互...');

  // 点击开始按钮
  console.log('\n   [用户点击: 开始按钮]');
  runtime.emit({ type: 'click', target: 'startBtn', ts: Date.now() });

  // 回答问题1（错误答案）
  console.log('\n   [用户提交答案: 3 (错误)]');
  runtime.setState({ globals: { vars: { ...runtime.getState().globals.vars, userAnswer: '3' } } });
  runtime.emit({ type: 'submit', target: 'answer', ts: Date.now() });

  // 回答问题1（正确答案）
  console.log('\n   [用户提交答案: 2 (正确)]');
  runtime.setState({ globals: { vars: { ...runtime.getState().globals.vars, userAnswer: '2' } } });
  runtime.emit({ type: 'submit', target: 'answer', ts: Date.now() });

  // 回答问题2（正确答案）
  console.log('\n   [用户提交答案: 6 (正确)]');
  runtime.setState({ globals: { vars: { ...runtime.getState().globals.vars, userAnswer: '6' } } });
  runtime.emit({ type: 'submit', target: 'answer', ts: Date.now() });

  // 打印最终状态
  console.log('\n4. 最终状态:');
  const finalState = runtime.getState();
  console.log('   当前场景:', runtime.getCurrentSceneId());
  console.log('   最终分数:', finalState.globals.vars.score);
  console.log('   错误尝试:', finalState.globals.vars.attempt);

  // 打印部分日志
  console.log('\n5. 运行日志 (最近5条):');
  const logs = runtime.getLogs().slice(-5);
  logs.forEach((log) => {
    console.log(`   [${log.type}] ${log.message}`);
  });

  console.log('\n' + '='.repeat(50));
  console.log('演示结束');
  console.log('='.repeat(50));

  // 清理
  runtime.destroy();
}

// 运行演示
main();
