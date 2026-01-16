export const bloodCirculationStyles = `
.blood-circulation {
  width: 100%;
  height: 100%;
  position: relative;
  font-family: 'Noto Sans', sans-serif;
}

.blood-legend {
  display: flex;
  gap: 16px;
  justify-content: center;
  font-size: 13px;
  color: #0f172a;
  margin-bottom: 12px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 999px;
  box-shadow: 0 4px 10px rgba(15, 23, 42, 0.08);
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.legend-dot.oxygen {
  background: #ef4444;
}

.legend-dot.deoxygen {
  background: #3b82f6;
}

.body-system {
  position: relative;
  width: 100%;
  height: 380px;
  background: linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 16px;
  padding: 16px;
  overflow: hidden;
}

.lungs,
.heart,
.body {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.lungs {
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.lung {
  width: 60px;
  height: 80px;
  background: #fde68a;
  border-radius: 40px 40px 30px 30px;
  box-shadow: inset 0 -6px 0 rgba(251, 191, 36, 0.5);
}

.lung.left {
  margin-right: 10px;
}

.lung.right {
  margin-left: 10px;
}

.heart {
  top: 150px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 100px;
}

.heart-left,
.heart-right {
  position: absolute;
  width: 52px;
  height: 70px;
  background: #f87171;
  border-radius: 40px 40px 25px 25px;
  box-shadow: inset 0 -8px 0 rgba(220, 38, 38, 0.5);
}

.heart-left {
  left: 4px;
}

.heart-right {
  right: 4px;
  background: #60a5fa;
  box-shadow: inset 0 -8px 0 rgba(37, 99, 235, 0.5);
}

.body {
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.body-core {
  width: 120px;
  height: 80px;
  background: #cbd5f5;
  border-radius: 20px;
  box-shadow: inset 0 -6px 0 rgba(99, 102, 241, 0.3);
}

.label {
  font-size: 12px;
  color: #0f172a;
  background: rgba(255, 255, 255, 0.9);
  padding: 4px 10px;
  border-radius: 999px;
}

.vessel {
  position: absolute;
  left: 50%;
  width: 6px;
  transform: translateX(-50%);
  border-radius: 999px;
}

.vessel-systemic {
  top: 220px;
  height: 120px;
  background: linear-gradient(180deg, rgba(239, 68, 68, 0.8) 0%, rgba(59, 130, 246, 0.8) 100%);
}

.vessel-pulmonary {
  top: 80px;
  height: 70px;
  background: linear-gradient(180deg, rgba(59, 130, 246, 0.8) 0%, rgba(239, 68, 68, 0.8) 100%);
}

.flow {
  position: absolute;
  left: 50%;
  width: 16px;
  transform: translateX(-50%);
  pointer-events: none;
}

.flow-dot {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  opacity: 0.9;
}

.flow-systemic {
  top: 220px;
  height: 120px;
}

.flow-systemic .flow-dot {
  background: #ef4444;
  animation: systemicFlow 3s linear infinite;
  animation-play-state: paused;
}

.flow-systemic .flow-dot:nth-child(2) {
  animation-delay: 1.5s;
}

.flow-pulmonary {
  top: 80px;
  height: 70px;
}

.flow-pulmonary .flow-dot {
  background: #3b82f6;
  animation: pulmonaryFlow 2.4s linear infinite;
  animation-play-state: paused;
}

.flow-pulmonary .flow-dot:nth-child(2) {
  animation-delay: 1.2s;
}

@keyframes systemicFlow {
  0% {
    transform: translateY(0);
    opacity: 0.2;
  }
  30% {
    opacity: 1;
  }
  100% {
    transform: translateY(100px);
    opacity: 0.2;
  }
}

@keyframes pulmonaryFlow {
  0% {
    transform: translateY(70px);
    opacity: 0.2;
  }
  30% {
    opacity: 1;
  }
  100% {
    transform: translateY(0);
    opacity: 0.2;
  }
}

.flow-info {
  margin-top: 14px;
  text-align: center;
  font-size: 14px;
  color: #1e293b;
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 12px;
  border-radius: 999px;
  box-shadow: 0 6px 16px rgba(15, 23, 42, 0.08);
}

.blood-circulation.mode-both .flow-dot,
.blood-circulation.mode-systemic .flow-systemic .flow-dot,
.blood-circulation.mode-pulmonary .flow-pulmonary .flow-dot {
  animation-play-state: running;
}

.blood-circulation.mode-systemic .flow-pulmonary .flow-dot,
.blood-circulation.mode-pulmonary .flow-systemic .flow-dot,
.blood-circulation.mode-stop .flow-dot {
  animation-play-state: paused;
}
`;
