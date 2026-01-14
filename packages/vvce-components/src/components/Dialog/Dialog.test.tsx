/**
 * Dialog Component Tests
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Dialog } from './Dialog';

// Mock the useInterpolation hook
vi.mock('../../hooks/useInterpolation', () => ({
  useInterpolation: (text: string) => text,
}));

describe('Dialog', () => {
  const defaultProps = {
    id: 'dialog-1',
    props: { text: 'Hello, World!' },
    onEvent: vi.fn(),
    onStateChange: vi.fn(),
  };

  it('should render text content', () => {
    render(<Dialog {...defaultProps} />);
    expect(screen.getByText('Hello, World!')).toBeInTheDocument();
  });

  it('should render with correct data attributes', () => {
    render(<Dialog {...defaultProps} />);
    const element = screen.getByText('Hello, World!').parentElement?.parentElement;
    expect(element).toHaveAttribute('data-vvce-id', 'dialog-1');
    expect(element).toHaveAttribute('data-vvce-type', 'Dialog');
  });

  it('should not render when visible is false', () => {
    render(<Dialog {...defaultProps} visible={false} />);
    expect(screen.queryByText('Hello, World!')).not.toBeInTheDocument();
  });

  it('should render speaker name', () => {
    render(<Dialog {...defaultProps} props={{ text: 'Hello!', speaker: 'Teacher' }} />);
    expect(screen.getByText('Teacher')).toBeInTheDocument();
    expect(screen.getByText('Hello!')).toBeInTheDocument();
  });

  it('should render avatar image', () => {
    render(
      <Dialog
        {...defaultProps}
        props={{ text: 'Hello!', avatar: 'https://example.com/avatar.png' }}
      />
    );
    const avatar = screen.getByRole('img');
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.png');
  });

  it('should render avatar placeholder with first letter of speaker', () => {
    render(<Dialog {...defaultProps} props={{ text: 'Hello!', speaker: 'Teacher' }} />);
    expect(screen.getByText('T')).toBeInTheDocument();
  });

  it('should apply custom style', () => {
    render(<Dialog {...defaultProps} style={{ backgroundColor: 'red' }} />);
    const container = screen.getByText('Hello, World!').parentElement?.parentElement;
    // Check that the style attribute contains the custom style
    expect(container?.getAttribute('style')).toContain('background-color: red');
  });

  it('should apply custom style class', () => {
    render(<Dialog {...defaultProps} styleClass="custom-class" />);
    const container = screen.getByText('Hello, World!').parentElement?.parentElement;
    expect(container).toHaveClass('custom-class');
  });

  it('should handle empty text', () => {
    render(<Dialog {...defaultProps} props={{ text: '' }} />);
    // Component should still render
    const container = document.querySelector('[data-vvce-id="dialog-1"]');
    expect(container).toBeInTheDocument();
  });

  it('should render with both speaker and avatar', () => {
    render(
      <Dialog
        {...defaultProps}
        props={{
          text: 'Hello!',
          speaker: 'Teacher',
          avatar: 'https://example.com/avatar.png',
        }}
      />
    );
    expect(screen.getByText('Teacher')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute(
      'src',
      'https://example.com/avatar.png'
    );
  });
});
