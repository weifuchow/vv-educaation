/**
 * Blood Circulation Animation Module
 * 血液循环动画模块
 */

import {
  AnimationModuleBase,
  WebAnimationConfig,
  IAnimationRenderer,
} from '../../standards/AnimationStandard';
import { BloodCirculationRenderer } from './renderer';
import { bloodCirculationStyles } from './styles';

class BloodCirculationModule extends AnimationModuleBase {
  metadata = {
    id: 'biology.blood-circulation',
    category: 'biology' as const,
    name: '血液循环示意',
    description: '展示心脏、肺循环与体循环的血液流向',
    tags: ['生物', '血液循环', '心脏', '肺循环', '体循环'],
    version: '1.0.0',
    author: 'VV Education',
  };

  assets = {
    styles: bloodCirculationStyles,
    images: {},
    sounds: {},
    videos: {},
  };

  createRenderer(config: WebAnimationConfig): IAnimationRenderer {
    this.loadStyles();
    return new BloodCirculationRenderer(config);
  }
}

export const bloodCirculationModule = new BloodCirculationModule();

export { BloodCirculationRenderer } from './renderer';
