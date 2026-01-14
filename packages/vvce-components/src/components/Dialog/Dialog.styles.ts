/**
 * Dialog Component Styles
 */

import type { CSSProperties } from 'react';

/**
 * Base styles for Dialog component
 */
export const dialogStyles: Record<string, CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px',
    margin: '8px 0',
    backgroundColor: 'var(--vvce-dialog-bg, #f8f9fa)',
    borderRadius: 'var(--vvce-border-radius, 8px)',
    boxShadow: 'var(--vvce-shadow-sm, 0 1px 3px rgba(0,0,0,0.1))',
  },
  avatarContainer: {
    flexShrink: 0,
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundColor: 'var(--vvce-avatar-bg, #e9ecef)',
  },
  avatar: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    color: 'var(--vvce-avatar-color, #6c757d)',
    backgroundColor: 'var(--vvce-avatar-bg, #e9ecef)',
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  speaker: {
    margin: '0 0 4px 0',
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--vvce-speaker-color, #495057)',
  },
  text: {
    margin: 0,
    fontSize: '16px',
    lineHeight: 1.5,
    color: 'var(--vvce-text-color, #212529)',
    wordWrap: 'break-word',
  },
  noAvatar: {
    padding: '16px 20px',
  },
};

/**
 * Get container style based on whether avatar is present
 */
export function getContainerStyle(hasAvatar: boolean): CSSProperties {
  return hasAvatar
    ? dialogStyles.container
    : { ...dialogStyles.container, ...dialogStyles.noAvatar };
}
