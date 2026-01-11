# VV Education - 小程序

学生/家长双入口小程序

## 功能概述

基于微信小程序（或其他小程序平台），提供学生和家长的学习入口。采用 WebView 承载 VVCE 引擎，实现复杂交互式课件。

## 核心功能

### 学生入口

- 课程学习（WebView 承载 VVCE）
- 学习进度查看
- 学习记录

### 家长入口

- 查看孩子学习进度
- 学习报告
- 课程推荐

### 小程序原生能力

- 用户登录/授权
- 分享功能
- 消息通知
- 支付（未来）
- 录音/相册权限（用于作业提交）

## 技术选型

- **框架**: 微信小程序原生 / Taro / uni-app（待定）
- **WebView 页面**: 基于 VVCE 引擎的 H5 页面
- **状态管理**: 小程序原生 / Pinia（如使用 Taro）
- **UI 组件库**: WeUI / Vant Weapp

## 目录结构

```
miniapp/
├── pages/              # 小程序页面
│   ├── index/          # 首页
│   ├── course/         # 课程列表
│   ├── player/         # WebView 播放器
│   └── profile/        # 个人中心
├── components/         # 小程序组件
├── utils/              # 工具函数
├── api/                # API 调用
├── webview/            # WebView H5 页面（VVCE 承载）
│   ├── src/
│   │   ├── App.tsx
│   │   └── Player.tsx  # VVCE 播放器
│   └── index.html
├── app.json
├── app.ts
└── project.config.json
```

## 开发指南

### 安装依赖

```bash
npm install
```

### 启动开发

```bash
npm run dev
```

### 构建

```bash
npm run build
```

## WebView 通信

小程序与 WebView 通过 postMessage 通信：

```javascript
// 小程序 -> WebView
wx.miniProgram.postMessage({
  type: 'loadCourse',
  courseId: 'xxx',
});

// WebView -> 小程序
wx.miniProgram.navigateBack();
```

## 许可证

MIT
