import React from 'react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
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

  afterEach(() => {
    cleanup();
  });

  describe('Basic Rendering', () => {
    it('should not render when content is empty', () => {
      const { container } = renderWithTheme(<QualityScoreIndicator content="" />);
      expect(container.firstChild).toBeNull();
    });

    it('should render when content is provided', async () => {
      const { container } = renderWithTheme(<QualityScoreIndicator content="Test content for quality scoring" />);

      await waitFor(
        () => {
          const qualityScoreElements = container.querySelectorAll('*');
          const hasQualityScore = Array.from(qualityScoreElements).some(
            (el) => el.textContent?.includes('Quality Score')
          );
          expect(hasQualityScore).toBe(true);
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
