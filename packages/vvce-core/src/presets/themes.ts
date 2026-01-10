/**
 * 内置主题预设
 * 提供多种风格的主题配置
 */

import type {
  BuiltinTheme,
  StyleVariables,
  StyleDefinition,
} from '@vv-education/vvce-schema';

export interface ThemePreset {
  name: string;
  description: string;
  variables: StyleVariables;
  components: Record<string, StyleDefinition>;
}

/**
 * 默认主题 - 清新教育风格
 */
const defaultTheme: ThemePreset = {
  name: 'default',
  description: '清新教育风格，适合大多数学习场景',
  variables: {
    colors: {
      // 主色调
      primary: '#4F46E5',
      primaryLight: '#818CF8',
      primaryDark: '#3730A3',
      // 辅助色
      secondary: '#06B6D4',
      secondaryLight: '#67E8F9',
      secondaryDark: '#0891B2',
      // 成功/警告/错误
      success: '#10B981',
      successLight: '#6EE7B7',
      warning: '#F59E0B',
      warningLight: '#FCD34D',
      error: '#EF4444',
      errorLight: '#FCA5A5',
      // 中性色
      text: '#1F2937',
      textSecondary: '#6B7280',
      textMuted: '#9CA3AF',
      background: '#FFFFFF',
      backgroundSecondary: '#F9FAFB',
      backgroundTertiary: '#F3F4F6',
      border: '#E5E7EB',
      borderLight: '#F3F4F6',
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
    fontSizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
      display: 48,
    },
    fontFamilies: {
      sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
    },
    radii: {
      none: 0,
      sm: 4,
      md: 8,
      lg: 12,
      xl: 16,
      full: 9999,
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
  },
  components: {
    Button: {
      base: {
        padding: [12, 24],
        borderRadius: 8,
        fontSize: 16,
        fontWeight: 500,
        cursor: 'pointer',
      },
      hover: {
        opacity: 0.9,
      },
      active: {
        transform: { scale: 0.98 },
      },
      disabled: {
        opacity: 0.5,
        cursor: 'pointer',
      },
    },
    Dialog: {
      base: {
        padding: 20,
        backgroundColor: '$colors.backgroundSecondary',
        borderRadius: 12,
        boxShadow: '$shadows.md',
      },
    },
    QuizSingle: {
      base: {
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '$colors.border',
        borderStyle: 'solid',
      },
    },
  },
};

/**
 * 童趣主题 - 活泼可爱风格
 */
const playfulTheme: ThemePreset = {
  name: 'playful',
  description: '活泼可爱风格，适合低龄学习者',
  variables: {
    colors: {
      primary: '#FF6B6B',
      primaryLight: '#FF9999',
      primaryDark: '#EE5A5A',
      secondary: '#4ECDC4',
      secondaryLight: '#7EDDD6',
      secondaryDark: '#3DBDB5',
      success: '#95E1A3',
      warning: '#FFE66D',
      error: '#FF6B6B',
      text: '#2D3748',
      textSecondary: '#718096',
      textMuted: '#A0AEC0',
      background: '#FFFEF0',
      backgroundSecondary: '#FFF8E7',
      backgroundTertiary: '#FFE4C4',
      border: '#FFD700',
      borderLight: '#FFEB99',
    },
    spacing: {
      xs: 6,
      sm: 12,
      md: 18,
      lg: 28,
      xl: 40,
      xxl: 56,
    },
    fontSizes: {
      xs: 14,
      sm: 16,
      md: 18,
      lg: 22,
      xl: 26,
      xxl: 32,
      xxxl: 42,
      display: 56,
    },
    radii: {
      none: 0,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      full: 9999,
    },
    shadows: {
      sm: '0 2px 8px rgba(255, 107, 107, 0.2)',
      md: '0 4px 16px rgba(255, 107, 107, 0.25)',
      lg: '0 8px 24px rgba(255, 107, 107, 0.3)',
      xl: '0 16px 48px rgba(255, 107, 107, 0.35)',
    },
  },
  components: {
    Button: {
      base: {
        padding: [14, 28],
        borderRadius: 20,
        fontSize: 18,
        fontWeight: 600,
        boxShadow: '$shadows.md',
      },
      hover: {
        transform: { scale: 1.05 },
      },
      active: {
        transform: { scale: 0.95 },
      },
    },
    Dialog: {
      base: {
        padding: 24,
        backgroundColor: '$colors.backgroundSecondary',
        borderRadius: 24,
        borderWidth: 3,
        borderColor: '$colors.primary',
        borderStyle: 'solid',
        boxShadow: '$shadows.lg',
      },
    },
  },
};

/**
 * 学术主题 - 专业严肃风格
 */
const academicTheme: ThemePreset = {
  name: 'academic',
  description: '专业严肃风格，适合高年级和专业学习',
  variables: {
    colors: {
      primary: '#1E3A5F',
      primaryLight: '#2E5B8F',
      primaryDark: '#0F1F3F',
      secondary: '#8B7355',
      secondaryLight: '#A8917A',
      secondaryDark: '#6E5A44',
      success: '#2E7D32',
      warning: '#ED6C02',
      error: '#D32F2F',
      text: '#212121',
      textSecondary: '#616161',
      textMuted: '#9E9E9E',
      background: '#FAFAFA',
      backgroundSecondary: '#F5F5F5',
      backgroundTertiary: '#EEEEEE',
      border: '#BDBDBD',
      borderLight: '#E0E0E0',
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
    fontSizes: {
      xs: 11,
      sm: 13,
      md: 15,
      lg: 17,
      xl: 19,
      xxl: 22,
      xxxl: 28,
      display: 36,
    },
    fontFamilies: {
      sans: '"Noto Serif SC", Georgia, "Times New Roman", serif',
      mono: '"Fira Code", "Source Code Pro", monospace',
    },
    radii: {
      none: 0,
      sm: 2,
      md: 4,
      lg: 6,
      xl: 8,
      full: 9999,
    },
    shadows: {
      sm: '0 1px 3px rgba(0, 0, 0, 0.08)',
      md: '0 2px 6px rgba(0, 0, 0, 0.1)',
      lg: '0 4px 12px rgba(0, 0, 0, 0.12)',
      xl: '0 8px 24px rgba(0, 0, 0, 0.14)',
    },
  },
  components: {
    Button: {
      base: {
        padding: [10, 20],
        borderRadius: 4,
        fontSize: 14,
        fontWeight: 500,
        borderWidth: 1,
        borderColor: '$colors.primary',
        borderStyle: 'solid',
      },
    },
    Dialog: {
      base: {
        padding: 20,
        backgroundColor: '$colors.background',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '$colors.border',
        borderStyle: 'solid',
      },
    },
  },
};

/**
 * 极简主题 - 简洁大方风格
 */
const minimalTheme: ThemePreset = {
  name: 'minimal',
  description: '简洁大方风格，聚焦内容本身',
  variables: {
    colors: {
      primary: '#000000',
      primaryLight: '#333333',
      primaryDark: '#000000',
      secondary: '#666666',
      secondaryLight: '#888888',
      secondaryDark: '#444444',
      success: '#00C851',
      warning: '#FFBB33',
      error: '#FF4444',
      text: '#000000',
      textSecondary: '#555555',
      textMuted: '#888888',
      background: '#FFFFFF',
      backgroundSecondary: '#FAFAFA',
      backgroundTertiary: '#F5F5F5',
      border: '#EEEEEE',
      borderLight: '#F5F5F5',
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 32,
      xl: 48,
      xxl: 64,
    },
    fontSizes: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 20,
      xl: 24,
      xxl: 32,
      xxxl: 48,
      display: 64,
    },
    radii: {
      none: 0,
      sm: 0,
      md: 0,
      lg: 0,
      xl: 0,
      full: 9999,
    },
    shadows: {
      sm: 'none',
      md: 'none',
      lg: 'none',
      xl: 'none',
    },
  },
  components: {
    Button: {
      base: {
        padding: [12, 24],
        borderRadius: 0,
        fontSize: 14,
        fontWeight: 400,
        borderWidth: 1,
        borderColor: '$colors.primary',
        borderStyle: 'solid',
        backgroundColor: 'transparent',
        color: '$colors.primary',
      },
      hover: {
        backgroundColor: '$colors.primary',
        color: '$colors.background',
      },
    },
    Dialog: {
      base: {
        padding: 32,
        backgroundColor: '$colors.background',
        borderWidth: 1,
        borderColor: '$colors.border',
        borderStyle: 'solid',
      },
    },
  },
};

/**
 * 鲜艳主题 - 明亮活泼风格
 */
const vibrantTheme: ThemePreset = {
  name: 'vibrant',
  description: '明亮活泼风格，充满活力',
  variables: {
    colors: {
      primary: '#7C3AED',
      primaryLight: '#A78BFA',
      primaryDark: '#5B21B6',
      secondary: '#EC4899',
      secondaryLight: '#F472B6',
      secondaryDark: '#DB2777',
      success: '#10B981',
      warning: '#FBBF24',
      error: '#F43F5E',
      text: '#18181B',
      textSecondary: '#52525B',
      textMuted: '#A1A1AA',
      background: '#FFFFFF',
      backgroundSecondary: '#FAFAF9',
      backgroundTertiary: '#F5F5F4',
      border: '#E4E4E7',
      borderLight: '#F4F4F5',
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 36,
      xxl: 48,
    },
    radii: {
      none: 0,
      sm: 6,
      md: 10,
      lg: 14,
      xl: 20,
      full: 9999,
    },
    shadows: {
      sm: '0 2px 4px rgba(124, 58, 237, 0.1)',
      md: '0 4px 12px rgba(124, 58, 237, 0.15)',
      lg: '0 8px 24px rgba(124, 58, 237, 0.2)',
      xl: '0 16px 48px rgba(124, 58, 237, 0.25)',
    },
  },
  components: {
    Button: {
      base: {
        padding: [12, 28],
        borderRadius: 12,
        fontSize: 16,
        fontWeight: 600,
        backgroundGradient: {
          type: 'linear',
          angle: 135,
          colors: [
            { color: '$colors.primary', position: 0 },
            { color: '$colors.secondary', position: 100 },
          ],
        },
        color: '#FFFFFF',
        boxShadow: '$shadows.md',
      },
      hover: {
        boxShadow: '$shadows.lg',
        transform: { translateY: -2 },
      },
    },
  },
};

/**
 * 暗色主题
 */
const darkTheme: ThemePreset = {
  name: 'dark',
  description: '暗色主题，护眼模式',
  variables: {
    colors: {
      primary: '#818CF8',
      primaryLight: '#A5B4FC',
      primaryDark: '#6366F1',
      secondary: '#22D3EE',
      secondaryLight: '#67E8F9',
      secondaryDark: '#06B6D4',
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
      text: '#F9FAFB',
      textSecondary: '#D1D5DB',
      textMuted: '#9CA3AF',
      background: '#111827',
      backgroundSecondary: '#1F2937',
      backgroundTertiary: '#374151',
      border: '#4B5563',
      borderLight: '#374151',
    },
  },
  components: {
    Button: {
      base: {
        backgroundColor: '$colors.primary',
        color: '#111827',
      },
    },
    Dialog: {
      base: {
        backgroundColor: '$colors.backgroundSecondary',
        borderColor: '$colors.border',
      },
    },
  },
};

/**
 * 自然主题 - 清新自然风格
 */
const natureTheme: ThemePreset = {
  name: 'nature',
  description: '清新自然风格，亲近大自然',
  variables: {
    colors: {
      primary: '#059669',
      primaryLight: '#34D399',
      primaryDark: '#047857',
      secondary: '#92400E',
      secondaryLight: '#D97706',
      secondaryDark: '#78350F',
      success: '#16A34A',
      warning: '#CA8A04',
      error: '#DC2626',
      text: '#1C1917',
      textSecondary: '#57534E',
      textMuted: '#A8A29E',
      background: '#FFFBEB',
      backgroundSecondary: '#FEF3C7',
      backgroundTertiary: '#FDE68A',
      border: '#D6D3D1',
      borderLight: '#E7E5E4',
    },
  },
  components: {
    Button: {
      base: {
        backgroundColor: '$colors.primary',
        color: '#FFFFFF',
        borderRadius: 20,
      },
    },
    Dialog: {
      base: {
        backgroundColor: '$colors.backgroundSecondary',
        borderRadius: 16,
      },
    },
  },
};

/**
 * 科技主题 - 未来科技风格
 */
const techTheme: ThemePreset = {
  name: 'tech',
  description: '未来科技风格，现代感十足',
  variables: {
    colors: {
      primary: '#0EA5E9',
      primaryLight: '#38BDF8',
      primaryDark: '#0284C7',
      secondary: '#8B5CF6',
      secondaryLight: '#A78BFA',
      secondaryDark: '#7C3AED',
      success: '#22C55E',
      warning: '#EAB308',
      error: '#EF4444',
      text: '#0F172A',
      textSecondary: '#475569',
      textMuted: '#94A3B8',
      background: '#F8FAFC',
      backgroundSecondary: '#F1F5F9',
      backgroundTertiary: '#E2E8F0',
      border: '#CBD5E1',
      borderLight: '#E2E8F0',
    },
  },
  components: {
    Button: {
      base: {
        backgroundColor: '$colors.primary',
        color: '#FFFFFF',
        borderRadius: 6,
        boxShadow: '0 0 20px rgba(14, 165, 233, 0.3)',
      },
      hover: {
        boxShadow: '0 0 30px rgba(14, 165, 233, 0.5)',
      },
    },
  },
};

/**
 * 复古主题 - 怀旧复古风格
 */
const retroTheme: ThemePreset = {
  name: 'retro',
  description: '怀旧复古风格，温馨经典',
  variables: {
    colors: {
      primary: '#B45309',
      primaryLight: '#D97706',
      primaryDark: '#92400E',
      secondary: '#7C2D12',
      secondaryLight: '#9A3412',
      secondaryDark: '#5C1F0F',
      success: '#15803D',
      warning: '#A16207',
      error: '#B91C1C',
      text: '#292524',
      textSecondary: '#57534E',
      textMuted: '#78716C',
      background: '#FEF7ED',
      backgroundSecondary: '#FEF3E2',
      backgroundTertiary: '#FEECD0',
      border: '#D6CFC7',
      borderLight: '#E7E2DB',
    },
    fontFamilies: {
      sans: 'Georgia, "Palatino Linotype", "Book Antiqua", Palatino, serif',
    },
  },
  components: {
    Button: {
      base: {
        backgroundColor: '$colors.primary',
        color: '#FEF7ED',
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '$colors.primaryDark',
        borderStyle: 'solid',
      },
    },
    Dialog: {
      base: {
        backgroundColor: '$colors.backgroundSecondary',
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '$colors.primary',
        borderStyle: 'solid',
      },
    },
  },
};

/**
 * 内置主题集合
 */
export const BUILTIN_THEMES: Record<BuiltinTheme, ThemePreset> = {
  default: defaultTheme,
  playful: playfulTheme,
  academic: academicTheme,
  minimal: minimalTheme,
  vibrant: vibrantTheme,
  dark: darkTheme,
  nature: natureTheme,
  tech: techTheme,
  retro: retroTheme,
};

/**
 * 获取主题列表
 */
export function getThemeList(): Array<{ name: BuiltinTheme; description: string }> {
  return Object.entries(BUILTIN_THEMES).map(([name, theme]) => ({
    name: name as BuiltinTheme,
    description: theme.description,
  }));
}

/**
 * 获取主题预设
 */
export function getThemePreset(name: BuiltinTheme): ThemePreset | undefined {
  return BUILTIN_THEMES[name];
}
