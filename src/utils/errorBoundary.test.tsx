import React from 'react';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary, safeMap, safeGetElementById } from './errorBoundary';

describe('ErrorBoundary', () => {
  const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
    if (shouldThrow) {
      throw new Error('Test error');
    }
    return <div>No error</div>;
  };

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('renders fallback UI when there is an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
  });
});

describe('safeMap', () => {
  it('maps over valid array', () => {
    const array = [1, 2, 3];
    const result = safeMap(array, (item) => item * 2);
    expect(result).toEqual([2, 4, 6]);
  });

  it('returns fallback for null array', () => {
    const result = safeMap(null, (item) => item * 2, [0]);
    expect(result).toEqual([0]);
  });
});

describe('safeGetElementById', () => {
  it('returns null when element does not exist', () => {
    const element = safeGetElementById('non-existent');
    expect(element).toBeNull();
  });
});
