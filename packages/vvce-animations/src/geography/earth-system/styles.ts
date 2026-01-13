export const earthSystemStyles = `
/* Earth System Animation Styles */
.earth-system { position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
.animation-container.space { background: linear-gradient(180deg, #000428 0%, #004e92 100%); }
.sun { position: absolute; width: 100px; height: 100px; background: radial-gradient(circle, #ffeb3b 0%, #ff9800 100%); border-radius: 50%; box-shadow: 0 0 50px #ff9800, 0 0 100px #ff9800; animation: sunGlow 3s ease-in-out infinite; }
@keyframes sunGlow { 0%, 100% { box-shadow: 0 0 50px #ff9800, 0 0 100px #ff9800; } 50% { box-shadow: 0 0 80px #ff9800, 0 0 130px #ff9800; } }
.orbit { position: absolute; width: 350px; height: 350px; border: 2px dashed rgba(255, 255, 255, 0.3); border-radius: 50%; }
.earth-container { position: absolute; width: 80px; height: 80px; animation: revolution 10s linear infinite paused; transform-origin: 175px center; left: calc(50% - 40px); top: calc(50% - 215px); }
.earth-container.rotating { animation-play-state: running; }
@keyframes revolution { from { transform: rotate(0deg) translateX(175px) rotate(0deg); } to { transform: rotate(360deg) translateX(175px) rotate(-360deg); } }
.earth { width: 80px; height: 80px; background: linear-gradient(135deg, #4a90e2 0%, #2e7d32 50%, #1565c0 100%); border-radius: 50%; position: relative; box-shadow: 0 0 30px rgba(66, 165, 245, 0.5); animation: rotation 4s linear infinite paused; }
.earth.rotating { animation-play-state: running; }
@keyframes rotation { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.earth::after { content: ''; position: absolute; top: 10%; left: 10%; width: 80%; height: 80%; background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), transparent); border-radius: 50%; }
.earth-axis { position: absolute; width: 2px; height: 100px; background: rgba(255, 255, 255, 0.6); top: -10px; left: 39px; transform: rotate(23.5deg); transform-origin: center; }
.axis-label { position: absolute; top: -25px; left: -30px; color: white; font-size: 12px; white-space: nowrap; background: rgba(0, 0, 0, 0.6); padding: 2px 6px; border-radius: 4px; }
.moon { position: absolute; width: 20px; height: 20px; background: radial-gradient(circle, #ddd, #999); border-radius: 50%; top: -30px; left: 30px; }
.info-label { position: absolute; background: rgba(255, 255, 255, 0.95); padding: 12px 16px; border-radius: 8px; font-size: 14px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); max-width: 200px; }
.label-revolution { bottom: 50px; left: 50px; }
.label-rotation { bottom: 50px; right: 50px; }
`;
