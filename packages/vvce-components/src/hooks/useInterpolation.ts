/**
 * useInterpolation Hook
 *
 * React hook for text interpolation with automatic updates
 */

import { useMemo } from 'react';
import { useResolveRef } from '../context/hooks';
import { interpolate, extractRefs } from '../utils/interpolation';

/**
 * Hook for interpolating a template string
 *
 * @param template - Template string with {{ref}} placeholders
 * @returns Interpolated string
 *
 * @example
 * ```tsx
 * const Dialog: React.FC<{ text: string }> = ({ text }) => {
 *   const interpolatedText = useInterpolation(text);
 *   return <p>{interpolatedText}</p>;
 * };
 * ```
 */
export function useInterpolation(template: string): string {
  const resolveRef = useResolveRef();

  return useMemo(() => {
    if (!template || typeof template !== 'string') {
      return template || '';
    }

    return interpolate(template, resolveRef);
  }, [template, resolveRef]);
}

/**
 * Hook for extracting and resolving multiple references
 *
 * @param template - Template string
 * @returns Object with refs and resolved values
 */
export function useInterpolationRefs(template: string): {
  refs: string[];
  values: Record<string, unknown>;
  result: string;
} {
  const resolveRef = useResolveRef();

  return useMemo(() => {
    const refs = extractRefs(template);
    const values: Record<string, unknown> = {};

    for (const ref of refs) {
      values[ref] = resolveRef(ref);
    }

    const result = interpolate(template, resolveRef);

    return { refs, values, result };
  }, [template, resolveRef]);
}
