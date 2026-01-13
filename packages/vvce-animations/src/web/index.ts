/**
 * VVCE Animations - Web Renderers
 * 浏览器环境动画渲染器
 */

// 核心渲染器
export * from './WebAnimationRenderer';

// 具体动画渲染器
export { PisaTowerRenderer } from './PisaTowerRenderer';
export { EarthSystemRenderer } from './EarthSystemRenderer';

// 注册所有Web动画
import { webAnimationRegistry } from './WebAnimationRenderer';
import { PisaTowerRenderer } from './PisaTowerRenderer';
import { EarthSystemRenderer } from './EarthSystemRenderer';

// 自动注册所有Web动画
webAnimationRegistry.register('physics.pisa-tower', PisaTowerRenderer);
webAnimationRegistry.register('geography.earth-system', EarthSystemRenderer);

// 导出注册表
export { webAnimationRegistry } from './WebAnimationRenderer';
