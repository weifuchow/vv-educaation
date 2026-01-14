/**
 * QuizSingle Component Tests
 */

import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QuizSingle } from './QuizSingle';

// Mock the useInterpolation hook
vi.mock('../../hooks/useInterpolation', () => ({
  useInterpolation: (text: string) => text,
}));

describe('QuizSingle', () => {
  const defaultProps = {
    id: 'quiz-1',
    props: {
      question: 'What is 1 + 1?',
      options: ['1', '2', '3', '4'],
    },
    state: { selected: null },
    onEvent: vi.fn(),
    onStateChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render question text', () => {
    render(<QuizSingle {...defaultProps} />);
    expect(screen.getByText('What is 1 + 1?')).toBeInTheDocument();
  });

  it('should render all options', () => {
    render(<QuizSingle {...defaultProps} />);
    expect(screen.getByRole('radio', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '3' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: '4' })).toBeInTheDocument();
  });

  it('should render with correct data attributes', () => {
    render(<QuizSingle {...defaultProps} />);
    const container = document.querySelector('[data-vvce-id="quiz-1"]');
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute('data-vvce-type', 'QuizSingle');
  });

  it('should not render when visible is false', () => {
    render(<QuizSingle {...defaultProps} visible={false} />);
    expect(screen.queryByText('What is 1 + 1?')).not.toBeInTheDocument();
  });

  it('should call onStateChange when option is selected', () => {
    render(<QuizSingle {...defaultProps} />);
    const option = screen.getByRole('radio', { name: '2' });
    fireEvent.click(option);

    expect(defaultProps.onStateChange).toHaveBeenCalledTimes(1);
    expect(defaultProps.onStateChange).toHaveBeenCalledWith({ selected: '2' });
  });

  it('should emit change event when option is selected', () => {
    render(<QuizSingle {...defaultProps} />);
    const option = screen.getByRole('radio', { name: '2' });
    fireEvent.click(option);

    expect(defaultProps.onEvent).toHaveBeenCalledTimes(1);
    expect(defaultProps.onEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'change',
        target: 'quiz-1',
        payload: { selected: '2' },
        timestamp: expect.any(Number),
      })
    );
  });

  it('should show selected state for selected option', () => {
    render(<QuizSingle {...defaultProps} state={{ selected: '2' }} />);
    const selectedOption = screen.getByRole('radio', { name: '2' });
    expect(selectedOption).toHaveAttribute('aria-checked', 'true');
    expect(selectedOption).toHaveClass('vvce-quiz-single__option--selected');
  });

  it('should have correct ARIA attributes for radiogroup', () => {
    render(<QuizSingle {...defaultProps} />);
    const radiogroup = screen.getByRole('radiogroup');
    expect(radiogroup).toHaveAttribute('aria-labelledby', 'quiz-1-question');
  });

  it('should handle keyboard Enter to select', () => {
    render(<QuizSingle {...defaultProps} />);
    const option = screen.getByRole('radio', { name: '3' });
    fireEvent.keyDown(option, { key: 'Enter' });

    expect(defaultProps.onStateChange).toHaveBeenCalledWith({ selected: '3' });
  });

  it('should handle keyboard Space to select', () => {
    render(<QuizSingle {...defaultProps} />);
    const option = screen.getByRole('radio', { name: '4' });
    fireEvent.keyDown(option, { key: ' ' });

    expect(defaultProps.onStateChange).toHaveBeenCalledWith({ selected: '4' });
  });

  it('should apply custom style', () => {
    render(<QuizSingle {...defaultProps} style={{ backgroundColor: 'lightblue' }} />);
    const container = document.querySelector('[data-vvce-id="quiz-1"]');
    // Check that the style attribute contains the custom style
    expect(container?.getAttribute('style')).toContain('background-color: lightblue');
  });

  it('should apply custom style class', () => {
    render(<QuizSingle {...defaultProps} styleClass="custom-quiz" />);
    const container = document.querySelector('[data-vvce-id="quiz-1"]');
    expect(container).toHaveClass('custom-quiz');
  });

  it('should handle empty options array', () => {
    render(
      <QuizSingle {...defaultProps} props={{ question: 'No options?', options: [] }} />
    );
    expect(screen.getByText('No options?')).toBeInTheDocument();
    expect(screen.queryByRole('radio')).not.toBeInTheDocument();
  });

  it('should render with null state as no selection', () => {
    render(<QuizSingle {...defaultProps} state={{ selected: null }} />);
    const options = screen.getAllByRole('radio');
    options.forEach((option) => {
      expect(option).toHaveAttribute('aria-checked', 'false');
    });
  });
});
