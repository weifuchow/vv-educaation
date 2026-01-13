/**
 * Pisa Tower Animation Styles
 */

export const pisaTowerStyles = `
/* Pisa Tower Animation Styles */

.pisa-tower {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%) rotate(4deg);
  transform-origin: bottom center;
  width: 120px;
  height: 350px;
  background: linear-gradient(to right, #d4a574 0%, #c89666 50%, #b88858 100%);
  border-radius: 8px 8px 0 0;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
}

.tower-level {
  position: absolute;
  width: 100%;
  height: 60px;
  border-bottom: 3px solid #996633;
  border-top: 2px solid #edc9a3;
}

.tower-level:nth-child(1) {
  top: 0;
}
.tower-level:nth-child(2) {
  top: 60px;
}
.tower-level:nth-child(3) {
  top: 120px;
}
.tower-level:nth-child(4) {
  top: 180px;
}
.tower-level:nth-child(5) {
  top: 240px;
}

.ball {
  position: absolute;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.ball.heavy {
  width: 40px;
  height: 40px;
  background: radial-gradient(circle at 30% 30%, #999, #333);
  left: calc(50% - 80px);
  top: 50px;
}

.ball.light {
  width: 40px;
  height: 40px;
  background: radial-gradient(circle at 30% 30%, #ff6b6b, #c92a2a);
  left: calc(50% + 40px);
  top: 50px;
}

@keyframes fallDown {
  0% {
    top: 50px;
    opacity: 1;
  }
  100% {
    top: 350px;
    opacity: 0.8;
  }
}

.ball.falling {
  animation: fallDown 1.5s ease-in forwards;
}

.galileo {
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 40px;
  z-index: 10;
}
`;
