import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import QualityScoreIndicator from './QualityScoreIndicator';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme();

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('QualityScoreIndicator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should not render when content is empty', () => {
      const { container } = renderWithTheme(<QualityScoreIndicator content="" />);
      expect(container.firstChild).toBeNull();
    });

    it('should render when content is provided', async () => {
      renderWithTheme(<QualityScoreIndicator content="Test content for quality scoring" />);

      await waitFor(
        () => {
          expect(screen.getByText('Quality Score')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it('should display component without crashing', () => {
      const { container } = renderWithTheme(<QualityScoreIndicator content="Test content" />);
      expect(container).toBeTruthy();
    });
  });
});
