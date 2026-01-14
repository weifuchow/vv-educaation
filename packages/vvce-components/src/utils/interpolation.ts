/**
 * Text Interpolation Utility
 *
 * Supports {{ref}} syntax for variable interpolation in text content
 */

/**
 * Interpolation pattern: {{path}} or {{path:defaultValue}}
 */
const INTERPOLATION_PATTERN = /\{\{([^}]+)\}\}/g;

/**
 * Resolver function type
 */
export type RefResolver = (path: string) => unknown;

/**
 * Interpolate a template string with resolved references
 *
 * @param template - Template string with {{ref}} placeholders
 * @param resolver - Function to resolve reference paths to values
 * @returns Interpolated string
 *
 * @example
 * ```ts
 * interpolate('Hello {{globals.vars.name}}!', (path) => {
 *   if (path === 'globals.vars.name') return 'World';
 *   return undefined;
 * });
 * // => 'Hello World!'
 *
 * // With default value
 * interpolate('Score: {{globals.vars.score:0}}', () => undefined);
 * // => 'Score: 0'
 * ```
 */
export function interpolate(template: string, resolver: RefResolver): string {
  if (!template || typeof template !== 'string') {
    return template;
  }

  return template.replace(INTERPOLATION_PATTERN, (_match, content: string) => {
    // Check for default value syntax: {{path:defaultValue}}
    const colonIndex = content.indexOf(':');
    let path: string;
    let defaultValue: string | undefined;

    if (colonIndex !== -1) {
      path = content.slice(0, colonIndex).trim();
      defaultValue = content.slice(colonIndex + 1).trim();
    } else {
      path = content.trim();
      defaultValue = undefined;
    }

    // Resolve the reference
    const value = resolver(path);

    // Handle different value types
    if (value === undefined || value === null) {
      return defaultValue ?? '';
    }

    if (typeof value === 'object') {
      try {
        return JSON.stringify(value);
      } catch {
        return String(value);
      }
    }

    return String(value);
  });
}

/**
 * Extract all reference paths from a template
 *
 * @param template - Template string
 * @returns Array of reference paths
 */
export function extractRefs(template: string): string[] {
  if (!template || typeof template !== 'string') {
    return [];
  }

  const refs: string[] = [];
  let match: RegExpExecArray | null;

  // Reset lastIndex for global pattern
  const pattern = new RegExp(INTERPOLATION_PATTERN.source, 'g');

  while ((match = pattern.exec(template)) !== null) {
    const content = match[1];
    const colonIndex = content.indexOf(':');
    const path = colonIndex !== -1 ? content.slice(0, colonIndex).trim() : content.trim();

    if (path && !refs.includes(path)) {
      refs.push(path);
    }
  }

  return refs;
}

/**
 * Check if a string contains interpolation placeholders
 *
 * @param str - String to check
 */
export function hasInterpolation(str: string): boolean {
  if (!str || typeof str !== 'string') {
    return false;
  }
  return INTERPOLATION_PATTERN.test(str);
}
