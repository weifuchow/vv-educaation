#!/bin/bash

# VVCE Demo 启动脚本

pnpm install
pnpm build:packages
echo "🚀 启动 VVCE 课件渲染引擎演示..."
echo ""

# Check if packages are built
if [ ! -d "packages/vvce-core/dist" ]; then
  echo "📦 首次运行，正在构建 packages..."
  pnpm build:packages
  echo "✅ 构建完成！"
  echo ""
fi

# Start HTTP server
echo "🌐 启动 HTTP 服务器..."
echo ""
echo "======================================"
echo "  VVCE 演示已启动！"
echo "======================================"
echo ""
echo "📍 访问地址："
echo "    http://localhost:10000/scene-viewer/scene-runner/"
echo ""
echo "💡 提示："
echo "   - 左侧：课件交互区域"
echo "   - 右侧：实时调试面板"
echo "   - 完成数学测验并查看实时状态更新"
echo ""
echo "🛑 按 Ctrl+C 停止服务器"
echo "======================================"
echo ""

# Start server
py -m http.server 10000
