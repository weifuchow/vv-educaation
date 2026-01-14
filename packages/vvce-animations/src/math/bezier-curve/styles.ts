/**
 * Bezier Curve Animation Styles Export
 * 导出CSS样式字符串，用于动态注入
 */

export const bezierCurveStyles = `
.bezier-animation-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  font-family: system-ui, -apple-system, sans-serif;
  max-width: 100%;
  box-sizing: border-box;
}

.bezier-animation-container * {
  box-sizing: border-box;
}

.bezier-header {
  text-align: center;
}

.bezier-title {
  margin: 0 0 12px 0;
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: -0.02em;
}

.bezier-formula {
  display: inline-block;
  padding: 12px 24px;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.formula-text {
  color: white;
  font-size: 18px;
  font-family: 'Times New Roman', serif;
  font-style: italic;
  letter-spacing: 0.02em;
}

.formula-text sub {
  font-size: 12px;
}

.formula-text sup {
  font-size: 11px;
}

.bezier-canvas-wrapper {
  position: relative;
  width: 100%;
  height: 500px;
  min-height: 450px;
  background: white;
  border-radius: 12px;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.bezier-canvas {
  width: 100%;
  height: 100%;
  display: block;
  cursor: crosshair;
}

.bezier-tooltip {
  position: absolute;
  padding: 8px 12px;
  background: rgba(0, 0, 0, 0.85);
  color: white;
  font-family: 'Fira Code', 'JetBrains Mono', monospace;
  font-size: 12px;
  line-height: 1.5;
  border-radius: 6px;
  pointer-events: none;
  z-index: 100;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.bezier-status {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 32px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  flex-wrap: wrap;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.status-value {
  font-size: 16px;
  font-weight: 700;
  color: #1e40af;
  font-family: 'Fira Code', 'JetBrains Mono', monospace;
}

/* 控制按钮区域 */
.bezier-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 12px;
  flex-wrap: wrap;
}

/* 按钮基础样式 */
.bezier-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 28px;
  font-size: 15px;
  font-weight: 600;
  font-family: system-ui, -apple-system, sans-serif;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  outline: none;
  white-space: nowrap;
  min-width: 140px;
}

.bezier-btn:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* 主要按钮样式 */
.bezier-btn.bezier-btn-primary,
.bezier-btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white !important;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
}

.bezier-btn.bezier-btn-primary:hover,
.bezier-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
}

.bezier-btn.bezier-btn-primary:active,
.bezier-btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
}

/* 次要按钮样式 */
.bezier-btn.bezier-btn-secondary,
.bezier-btn-secondary {
  background: white;
  color: #3b82f6 !important;
  border: 2px solid #3b82f6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.bezier-btn.bezier-btn-secondary:hover,
.bezier-btn-secondary:hover {
  background: #eff6ff;
  border-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.bezier-btn.bezier-btn-secondary:active,
.bezier-btn-secondary:active {
  transform: translateY(0);
  background: #dbeafe;
}

/* 图例区域 */
.bezier-legend {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 28px;
  flex-wrap: wrap;
  padding: 14px 20px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #475569;
  white-space: nowrap;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-dot.control-point {
  background: #3b82f6;
  border: 2px solid #1e40af;
}

.legend-dot.moving-point {
  background: #ef4444;
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
}

.legend-line {
  width: 24px;
  height: 3px;
  border-radius: 2px;
  flex-shrink: 0;
}

.legend-line.auxiliary {
  background: linear-gradient(90deg, #ef4444, #f97316, #22c55e);
}

.legend-line.curve {
  background: #3b82f6;
}

.bezier-info {
  padding: 16px 20px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 12px;
  border-left: 4px solid #3b82f6;
  font-size: 15px;
  line-height: 1.7;
  color: #1e40af;
}

/* 响应式样式 - 平板 */
@media (max-width: 768px) {
  .bezier-animation-container {
    padding: 16px;
    gap: 14px;
  }

  .bezier-title {
    font-size: 22px;
  }

  .bezier-canvas-wrapper {
    height: 420px;
    min-height: 380px;
  }

  .bezier-status {
    gap: 20px;
    padding: 14px 16px;
  }

  .bezier-controls {
    gap: 12px;
    padding: 14px 16px;
  }

  .bezier-btn {
    padding: 10px 20px;
    font-size: 14px;
    min-width: 120px;
  }

  .bezier-legend {
    gap: 20px;
    padding: 12px 16px;
  }
}

/* 响应式样式 - 手机 */
@media (max-width: 640px) {
  .bezier-animation-container {
    padding: 12px;
    gap: 12px;
  }

  .bezier-title {
    font-size: 20px;
  }

  .bezier-formula {
    padding: 8px 16px;
  }

  .formula-text {
    font-size: 14px;
  }

  .bezier-canvas-wrapper {
    height: 350px;
    min-height: 300px;
  }

  .bezier-status {
    flex-direction: column;
    gap: 10px;
    align-items: center;
    padding: 12px 14px;
  }

  .status-item {
    width: 100%;
    justify-content: space-between;
    padding: 0 8px;
  }

  .bezier-controls {
    flex-direction: column;
    gap: 10px;
    padding: 12px 14px;
  }

  .bezier-btn {
    width: 100%;
    padding: 12px 20px;
    font-size: 15px;
  }

  .bezier-legend {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
    padding: 12px 16px;
  }

  .legend-item {
    font-size: 13px;
  }

  .bezier-info {
    font-size: 13px;
    padding: 12px 16px;
  }
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
  }
  50% {
    box-shadow: 0 0 20px rgba(239, 68, 68, 0.8);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bezier-animation-container {
  animation: fade-in 0.5s ease-out;
}

/* 暗色主题 */
.bezier-animation-container.dark {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
}

.bezier-animation-container.dark .bezier-title {
  color: #f1f5f9;
}

.bezier-animation-container.dark .bezier-canvas-wrapper {
  background: #1e293b;
}

.bezier-animation-container.dark .bezier-status {
  background: rgba(15, 23, 42, 0.8);
}

.bezier-animation-container.dark .status-label {
  color: #94a3b8;
}

.bezier-animation-container.dark .status-value {
  color: #60a5fa;
}

.bezier-animation-container.dark .bezier-controls {
  background: rgba(15, 23, 42, 0.7);
}

.bezier-animation-container.dark .bezier-btn-secondary {
  background: #1e293b;
  border-color: #60a5fa;
  color: #60a5fa !important;
}

.bezier-animation-container.dark .bezier-btn-secondary:hover {
  background: #334155;
}

.bezier-animation-container.dark .bezier-legend {
  background: rgba(15, 23, 42, 0.8);
}

.bezier-animation-container.dark .legend-item {
  color: #cbd5e1;
}

.bezier-animation-container.dark .bezier-info {
  background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
  color: #dbeafe;
}
`;
