import React from 'react';
import { render, screen } from '../config/test-utils';
import { Loading } from './Loading';

describe('Loading', () => {
  it('should show a loading spinner', () => {
    render(<Loading />);

    const loadingSpinner = screen.getByLabelText(/loading/i);

    expect(loadingSpinner).toBeInTheDocument();
  });
});
