/**
 * Animation Registry for VVCE Scene Runner
 * Manages animation HTML templates and control handlers
 */

export class AnimationRegistry {
  constructor() {
    this.animations = new Map();
    this.registerBuiltInAnimations();
  }

  /**
   * Register built-in animations
   */
  registerBuiltInAnimations() {
    // Pisa Tower animation
    this.register('pisa-tower', {
      getHtml: () => `
        <div class="pisa-tower">
          <div class="tower-level"></div>
          <div class="tower-level"></div>
          <div class="tower-level"></div>
          <div class="tower-level"></div>
          <div class="tower-level"></div>
        </div>
        <div class="galileo">🧑‍🔬</div>
        <div class="ball heavy" id="heavy-ball"></div>
        <div class="ball light" id="light-ball"></div>
      `,
      start: () => {
        const heavyBall = document.getElementById('heavy-ball');
        const lightBall = document.getElementById('light-ball');

        if (heavyBall && lightBall) {
          heavyBall.classList.remove('falling');
          lightBall.classList.remove('falling');

          setTimeout(() => {
            heavyBall.classList.add('falling');
            lightBall.classList.add('falling');
          }, 500);
        }
      },
      handleControl: (controlId, buttonElement) => {
        // Pisa tower doesn't have controls - always auto-plays
      },
    });

    // Earth System animation
    this.register('earth-system', {
      getHtml: () => `
        <div class="earth-system">
          <div class="sun"></div>
          <div class="orbit"></div>
          <div class="earth-container" id="earth-orbit">
            <div class="earth" id="earth-rotate">
              <div class="earth-axis">
                <div class="axis-label">23.5°</div>
              </div>
              <div class="moon"></div>
            </div>
          </div>
          <div class="info-label label-revolution">
            <strong>公转</strong><br>
            周期：365天
          </div>
          <div class="info-label label-rotation">
            <strong>自转</strong><br>
            周期：24小时
          </div>
        </div>
      `,
      start: () => {
        const earthOrbit = document.getElementById('earth-orbit');
        const earthRotate = document.getElementById('earth-rotate');
        if (earthOrbit && earthRotate) {
          earthOrbit.classList.add('rotating');
          earthRotate.classList.add('rotating');
        }
      },
      handleControl: (controlId, buttonElement) => {
        const earthOrbit = document.getElementById('earth-orbit');
        const earthRotate = document.getElementById('earth-rotate');

        if (!earthOrbit || !earthRotate) return;

        // Remove active class from all buttons
        const allButtons = document.querySelectorAll('.control-button');
        allButtons.forEach((btn) => btn.classList.remove('active'));
        buttonElement.classList.add('active');

        switch (controlId) {
          case 'btn-rotation':
            earthOrbit.classList.remove('rotating');
            earthRotate.classList.add('rotating');
            break;
          case 'btn-revolution':
            earthOrbit.classList.add('rotating');
            earthRotate.classList.remove('rotating');
            break;
          case 'btn-both':
            earthOrbit.classList.add('rotating');
            earthRotate.classList.add('rotating');
            break;
          case 'btn-stop':
            earthOrbit.classList.remove('rotating');
            earthRotate.classList.remove('rotating');
            break;
        }
      },
    });
  }

  /**
   * Register a new animation type
   * @param {string} type - Animation type identifier
   * @param {Object} config - Animation configuration
   * @param {Function} config.getHtml - Returns HTML for the animation
   * @param {Function} config.start - Starts the animation
   * @param {Function} config.handleControl - Handles control button clicks
   */
  register(type, config) {
    this.animations.set(type, config);
  }

  /**
   * Get HTML for an animation type
   * @param {string} type - Animation type
   * @returns {string} HTML string
   */
  getAnimationHtml(type) {
    const animation = this.animations.get(type);
    if (!animation) {
      console.warn(`Animation type "${type}" not found in registry`);
      return `<div style="padding: 40px; text-align: center;">Animation "${type}" not found</div>`;
    }
    return animation.getHtml();
  }

  /**
   * Start an animation
   * @param {string} type - Animation type
   */
  startAnimation(type) {
    const animation = this.animations.get(type);
    if (animation && animation.start) {
      animation.start();
    }
  }

  /**
   * Handle control button click
   * @param {string} type - Animation type
   * @param {string} controlId - Control button ID
   * @param {HTMLElement} buttonElement - Button element that was clicked
   */
  handleControl(type, controlId, buttonElement) {
    const animation = this.animations.get(type);
    if (animation && animation.handleControl) {
      animation.handleControl(controlId, buttonElement);
    }
  }

  /**
   * Check if animation type exists
   * @param {string} type - Animation type
   * @returns {boolean}
   */
  has(type) {
    return this.animations.has(type);
  }

  /**
   * Get all registered animation types
   * @returns {string[]}
   */
  getTypes() {
    return Array.from(this.animations.keys());
  }
}
