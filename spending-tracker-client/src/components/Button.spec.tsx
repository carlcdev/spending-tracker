import React from 'react';
import { render, screen } from '../config/test-utils';
import { Button } from './Button';

describe('Button', () => {
  it('should show a button with the relevant label', () => {
    render(<Button label="Test Button" />);

    const testButton = screen.getByText(/Test Button/i);

    expect(testButton).toBeInTheDocument();
  });

  it('should show a loading spinner when in the loading state', () => {
    render(<Button loading label="Test Button" />);

    const testButtonByText = screen.queryByText(/Test Button/i);
    const loadingSpinner = screen.getByLabelText(/loading/i);

    // Text should not be visible while in loading state
    expect(testButtonByText).not.toBeInTheDocument();
    expect(loadingSpinner).toBeInTheDocument();
  });
});
