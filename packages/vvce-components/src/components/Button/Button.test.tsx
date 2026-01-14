/**
 * Button Component Tests
 */

import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

// Mock the useInterpolation hook
vi.mock('../../hooks/useInterpolation', () => ({
  useInterpolation: (text: string) => text,
}));

describe('Button', () => {
  const defaultProps = {
    id: 'btn-1',
    props: { text: 'Click me' },
    onEvent: vi.fn(),
    onStateChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render button text', () => {
    render(<Button {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('should render with correct data attributes', () => {
    render(<Button {...defaultProps} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-vvce-id', 'btn-1');
    expect(button).toHaveAttribute('data-vvce-type', 'Button');
  });

  it('should not render when visible is false', () => {
    render(<Button {...defaultProps} visible={false} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should emit click event when clicked', () => {
    render(<Button {...defaultProps} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(defaultProps.onEvent).toHaveBeenCalledTimes(1);
    expect(defaultProps.onEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'click',
        target: 'btn-1',
        timestamp: expect.any(Number),
      })
    );
  });

  it('should not emit click event when disabled', () => {
    render(<Button {...defaultProps} props={{ text: 'Click me', disabled: true }} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(defaultProps.onEvent).not.toHaveBeenCalled();
  });

  it('should render with primary variant by default', () => {
    render(<Button {...defaultProps} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('vvce-button--primary');
  });

  it('should render with secondary variant', () => {
    render(
      <Button {...defaultProps} props={{ text: 'Click me', variant: 'secondary' }} />
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('vvce-button--secondary');
  });

  it('should render with text variant', () => {
    render(<Button {...defaultProps} props={{ text: 'Click me', variant: 'text' }} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('vvce-button--text');
  });

  it('should have disabled class when disabled', () => {
    render(<Button {...defaultProps} props={{ text: 'Click me', disabled: true }} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('vvce-button--disabled');
    expect(button).toBeDisabled();
  });

  it('should have aria-disabled attribute when disabled', () => {
    render(<Button {...defaultProps} props={{ text: 'Click me', disabled: true }} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('should apply custom style', () => {
    render(<Button {...defaultProps} style={{ backgroundColor: 'red' }} />);
    const button = screen.getByRole('button');
    // Check that the style attribute contains the custom style
    expect(button.getAttribute('style')).toContain('background-color: red');
  });

  it('should apply custom style class', () => {
    render(<Button {...defaultProps} styleClass="custom-class" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('should be of type button', () => {
    render(<Button {...defaultProps} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });
});
